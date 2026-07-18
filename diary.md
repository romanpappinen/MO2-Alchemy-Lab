# Diary

## 2026-07-18 — Full RU/EN translation of the material tree

**What changed:** The material tree in `craftConstants.js` had ~250 hardcoded Russian row labels across all 7 metals, generated inside each metal's `calc()`. Threaded a `t` translation function through `calc(target, sel, bon, tools, t)` (default `t=(k)=>k` so existing callers/tests without a real translator don't crash), passed from `useCraftCalc.js`'s `result` computed via `useI18n()`. Replaced every dynamic Russian tree-row string with a `t('tree.xxx', {vars})` call against ~40 shared template keys added to `useI18n.js` (RU+EN) — most patterns repeat across metals (`{item} → {target}`, `{item} (byproduct from {source})`, etc.) so the key count is far smaller than the row count.

Also: `tagLabel` fields (руда/покупка/сложно/легко/побочка/бонус) were converted from literal Russian display text to semantic English keys (`ore`/`purchase`/`hard`/`easy`/`byproduct`/`bonus`); `CraftTreePanel.vue` now resolves them via `t('tag.' + node.tagLabel)` instead of rendering the field directly. Fixed 3 stray Cyrillic strings in `label:` fields that weren't part of the tree system at all (`'Lupium (доп.)'`, two Calx/Saburra option labels with `(даёт ...)`) — these are static recipe-panel labels, simply translated to English text to match every other label in the file.

**What was verified:**
- Every `t()` key used in `craftConstants.js` (40 total) confirmed present in both the RU and EN dictionaries in `useI18n.js` (scripted check, not manual).
- `grep` swept all `name:`/`label:`/`tagLabel:` fields in `craftConstants.js` for Cyrillic characters after the change: zero matches.
- Re-ran the full verification suite: 194/194 recipe options still match `refineRecipes.js`; 1,746 metal/option/tool/target combinations swept with zero NaN/negative tree values (data and math are untouched by this change — only display strings moved through `t()`).
- Browser-driven check (Playwright, fresh `npm run dev` instance) across all 7 metals in both RU and EN: zero leftover Cyrillic text in EN mode, zero console errors. Hit one false alarm mid-way — a long-running dev server from earlier in the session had a stale HMR/watch state and kept serving pre-edit output for 6 of 7 metals despite the on-disk file being correct (confirmed via direct `grep`); restarting `npm run dev` from scratch resolved it. Not a code bug.
- `eslint --rule no-unused-vars` and `vue-tsc --build --force`: clean.

## 2026-07-18 — Remove dead code, fix hidden Coke/CalxPowder tracking bugs

**What changed:** Started as a "remove dead code" task; mechanical `eslint --rule no-unused-vars` sweep across `craftConstants.js` surfaced several genuinely dead variables (harmless, removed) but also two real correctness bugs hiding behind "unused variable" warnings:

1. **Messing and Bron silently dropped Coke/Coal requirements.** Selecting a Cuprum or Malachite recipe option catalyzed by Coke (e.g. "Fabricula + Malachite + Coke") computed `cupCoke`/`malCoke` and then discarded them — never added to any total, never shown in the tree. A player could pick that option and never learn they needed Coal-derived Coke.
2. **Tindremic Messing dropped Almine's mandatory Calx Powder catalyst.** Both `al`-step options require 800 Calx Powder per batch unconditionally; the computed `alCat` was never used.

Fixed by giving Messing, Bron, and Tindremic a proper Coal->Coke chain (new `coke` step, 2 options, matching Steel/Oghmium/Cronite/Tungsteel) and a dedicated `calx` step, then applying the same Crusher/Grinder auto-mix solver from the waste-minimization feature to satisfy both the Calx Powder deficit (demand minus existing Calspar/Malachite byproducts) and the Coal need (direct catalyst + Coke crafting, minus existing Calspar/Malachite-via-Calx byproducts) with minimal leftover. Also surfaced two previously-dropped byproducts as bonus rows: Calspar and Coal from the Malachite-via-Calx recipe path (`calsparFromMalCalx`, `coalFromMalCalx`).

Dead code actually removed (no behavior change): `calxR`/`aBF_al`/`aBF_arc`/`alR`/`needGalb_lup_placeholder` in Oghmium (vestigial - the Almine/Arconite BF/GN mix has always used hardcoded constants, not the step selection), `needSaburra`/`sabWater`/`malFromCals` in Messing and Bron (superseded by the byproduct-netted `needSaburra_sp`/`sabWater_sp` computed later in the same function).

**What was verified:**
- `eslint --rule no-unused-vars`: zero remaining warnings in `craftConstants.js` (was ~15).
- Cross-checked recipe data against `refineRecipes.js` again: 194/194 options match (was 182; +12 for the 6 new coke/calx step options added across Messing/Bron/Tindremic).
- Swept every option of every step, times 5 tool-availability scenarios, times 5 target sizes, across all 7 metals (4,850 combinations): zero NaN/negative tree values.
- Manually verified the Coke fix with before/after node scripts: selecting a Coke-catalyzed Cuprum/Malachite option in Messing/Bron now correctly shows "Coke (всего)" and "Coal для Coke" rows (previously silently 0).
- Browser-driven check (Playwright + `npm run dev`): Messing, Bron, and Tindremic Messing all render their new CALX POWDER / COKE tree sections correctly with no console errors; Tindremic's numbers match the node-script verification exactly (Calx Powder для Almine: 2858, mix: 0.0 Crusher + 1.4 Grinder, Coal бонус: 1583).
- `vue-tsc --build --force`: clean.

## 2026-07-18 — Fix Steel missing Pig Iron Sulfur option

**What changed:** User asked whether switching Pig Iron's recipe from Coke to Sulfur (Blood Ore + Sulfur -> Pig Iron, no Coal/Coke chain needed) recalculates the whole tree. Investigating surfaced a real gap: Steel's `pig` step only had 2 options (Furnace/Blast Furnace, both Coke-based) — the "Furnace + Sulfur" option that Oghmium, Cronite, and Tungsteel all already have (and that exists in `refineRecipes.js`/`base_refine.txt`) was missing entirely from Steel. Added it, and fixed `calc()`: the old `cokePig = r(needPig, pR.yield*EM, pR.catAmt)` unconditionally treated `catAmt` as Coke regardless of recipe, so selecting the (until-now-nonexistent) Sulfur option would have silently miscounted its catalyst as Coke instead of Sulfur. Added the `pR.isSulfur` branch (matching the other 3 metals) and a `needSulfur` purchase row in Steel's tree (previously absent).

**What was verified:**
- Confirmed the fix is fully reactive through the existing chain: switching Steel's Pig Iron to Sulfur drops Coke need (11796->10204 at target 10000), which lowers the Coal need feeding into the Crusher/Grinder Calx mix solver (6.4/8.5 runs -> 3.5/12.2), and adds a new Sulfur purchase line (2959) - confirmed with a before/after node script.
- Re-ran the full cross-check against `refineRecipes.js`: 182/182 options now match (was 181; +1 for the new option).
- Swept all metal/pig-option/tool-scenario/target combinations (180 total): zero NaN/negative tree values.
- `vue-tsc --build --force` and `node --check`: clean.

## 2026-07-18 — Add structured refine-recipes data module

**What changed:** Added `src/composables/refineRecipes.js`, transcribing and deduplicating the raw recipe dump in `base_refine.txt` (repo root, user-provided) into a structured `RECIPES` array — 8 top-level alloy recipes (`kind: 'alloy'`, base + 2 catalysts, "Refining Oven") and 75 deduplicated refine recipes (`kind: 'refine'`, base + 0-1 catalyst, building varies). Each `base_refine.txt` entry that listed the same (input, catalysts, building) combo once per producible output was collapsed into one recipe with a combined `outputs` array. Normalized the source typo `Cinnibar` → `Cinnabar`. Added a `findRecipesByOutput(materialName)` lookup helper.

This is standalone, unused data for now — it does not touch `craftConstants.js`, `useCraftCalc.js`, or any CraftCalc component. Reconciling/adapting it against the existing (duplicated, free-text) per-metal recipe data in `craftConstants.js` is explicit future work.

**What was verified:**
- Node ESM load of the module: 8 alloy + 75 refine = 83 recipes, no duplicate `(input, catalysts, building)` triples, no leftover "Cinnibar" references.
- `eslint` clean after `--fix` (numeric-separator/style-only fixes, no data changes).
- `vue-tsc --build --force` shows one pre-existing, unrelated error (`AppShell/index.vue` missing declaration) — not caused by this change.
- No UI wiring yet, so no browser-driven check applies.

**Next concrete step:** Compare `refineRecipes.js` against `craftConstants.js`'s per-metal `steps/options` data to find gaps/mismatches, then decide how (or whether) to adapt `craftConstants.js`/`useCraftCalc.js` to consume the structured data instead of free-text `input` strings.

## 2026-07-18 — Craft calculator work plan: bugfix, new metals, tool availability

**What changed (multi-step plan, executed in order):**
1. Fixed `craftConstants.js` steel/calx "Grinder + Calx + Water" option: `coal:0` → `coal:1140` (matches the identical recipe in oghmium/cronite and `refineRecipes.js`) — Steel was under-crediting the Coal byproduct.
2. Added Bron and Tungsteel as standalone selectable metals (previously: Bron didn't exist at all; Tungsteel/Grain Steel were only internal intermediates inside Oghmium's calc()). Bron reuses Messing's Cuprum/Malachite/Calspar/Saburra Powder chain plus a new Bleck-from-Bleckblende step. Tungsteel extracts the Lupium/Blood Ore/Galbinum/Coke logic already embedded in Oghmium. Also added Steel's missing Coke-recipe choice (was hardcoded to "Coal+Coal" only) and tracked the previously-dropped Pyrite byproduct on two Pyroxene options (Oghmium + Cronite).
3. Re-ran the automated cross-check (input+catalysts+building+yield+byproducts) between `craftConstants.js` and `refineRecipes.js` after all of the above — 181 recipe-options across all 7 metals, zero mismatches.
4. Verified `bon.ironmaster`/`bon.extractBonus` reduce real material totals identically across all 7 metals (including the two new ones); confirmed the bonus toggle UI in `CraftSidebar.vue` is fully generic (no per-metal special-casing).
5. Added a persisted "available tools" selector (`useCraftCalc.js`: `BUILDINGS`, `availableTools`, `toggleTool`, localStorage key `craft_tools_v1`) and `sortedOptions()` helper that reorders each step's options for *display* only (available-tool options first) without touching the underlying `options` array indices that `selections`/`getSelIdx` depend on. Wired into `CraftSidebar.vue` (checkbox list) and `CraftRecipesPanel.vue` (sorted render + "unavailable" badge + dimming). Added `craft.tools`/`craft.toolsHint`/`craft.unavailable` i18n keys (RU/EN).

Still open: waste-minimization recipe hints (mixing two recipe options in proportion to hit two simultaneous byproduct needs with minimal excess, e.g. Calx Powder + Coal for Steel via Crusher/Grinder — same idea as the existing Almine/Arconite BF/GN system-of-equations mix). Depends on the tool-availability work landed here.

**What was verified:**
- Node cross-check script: 181/181 recipe-options match `refineRecipes.js` on ingredients, yield, and byproducts across all 7 metals.
- `bron.calc()`/`tungsteel.calc()` sanity-run at multiple targets and bonus combinations: no NaN/negative tree values.
- `vue-tsc --build --force`: no new errors (one pre-existing unrelated error in `AppShell/index.vue`).
- `eslint`: no new violation *categories* introduced; the touched files (`craftConstants.js`, `useCraftCalc.js`, the CraftCalc `.vue` files) were never lint-clean to begin with (staged pre-session, never run through eslint) — did not do a wholesale reformat, out of scope for this change.
- Browser-driven check via a one-off Playwright script (project has no run skill; `chromium-cli` unavailable in this container) against `npm run dev`: Bron and Tungsteel both appear in the metal list and render correct material trees; toggling "Crusher" off in the new Available Tools panel moved its recipe options to the bottom of their lists with a dimmed "unavailable" badge, while previously-selected options stayed selected (index-based selection unaffected by the display sort). No console/page errors. Screenshots kept in the session scratchpad.

**Note on git history:** one commit in this sequence (`89a32eb`, "Add Bron and Tungsteel metals...") accidentally included 9 unrelated pre-session-staged files (`.claude/settings.json`, `.devcontainer/*`, `CLAUDE.md`, several `AppShell`/`CraftCalc` `.vue` files) due to running `git commit -m` without a pathspec after a broad `git add`. Left as-is per user decision — nothing was lost, but the commit message undersells its actual diff.

**Next concrete step:** Design and implement waste-minimization recipe-mix hints (task depends on user confirming scope: e.g. which material pairs to target first, and whether hints render inline in the material tree or as a separate suggestion panel).

## 2026-07-18 — Waste-minimization Calx mix (Crusher/Grinder → Calx Powder + Coal)

**What changed:** Implemented the "hint" item from the craft-calculator plan, scoped to one concrete pattern: whenever a metal needs both Calx Powder and Coal (which both come from refining the same raw Calx ore via either Crusher or Grinder, in different ratios), `calc()` now solves a 2-variable linear system — the same technique already used for Almine/Arconite BF/GN balancing — to find the exact mix of Crusher-runs and Grinder-runs that satisfies both needs with minimal/zero leftover, instead of picking one recipe and mining extra Coal or wasting the surplus byproduct.

- Applied to the 4 metals where Coal is an active downstream requirement: Oghmium, Steel, Cronite, Tungsteel (Messing/Bron/Tindremic's Calx-derived Coal byproduct is untracked/unused there — no active need to optimize against, left alone).
- `calc(target, sel, bon, tools)` now takes a 4th `tools` argument (`{buildingName: boolean}`); `useCraftCalc.js`'s `result` computed passes `availableTools` (from the tool-availability feature) through. When both Crusher and Grinder are available, the mix is solved exactly; when only one is available, it falls back to today's existing single-recipe behavior (satisfy Calx Powder exactly, treat Coal as pure byproduct with any deficit mined separately or surplus shown as bonus).
- Tree output: the single "Calx" row now reads e.g. `Calx (6.4 прог. Crusher + 8.5 прог. Grinder — закрывает Calx Powder и Coal без остатка)`, plus a new "Coal бонус (излишек от Calx)" row when there's a surplus.
- **Scoping/localization note:** the material tree has never been localized (every row label in `craftConstants.js` is hardcoded Russian, including all pre-existing rows) — this is a pre-existing property of the whole file, not something this change introduced. The new mix-hint rows follow the same hardcoded-Russian convention for consistency rather than partially localizing just the new rows. Full i18n of the tree (matching the already-localized UI chrome in `CraftSidebar.vue`/`CraftRecipesPanel.vue`) would be a separate, much larger task if wanted later.

**What was verified:**
- Cross-checked recipe data integrity again (unaffected by this change, since only `calc()` logic changed, not recipe data): 181/181 options still match `refineRecipes.js`.
- Swept all 7 metals × 10 tool-availability scenarios × 5 target sizes (350 combinations) with varying bonuses: zero NaN/negative tree values.
- Manually confirmed the solver's behavior makes sense in both directions: for Oghmium (needed Coal:CalxPowder ratio below what either recipe alone yields) the solver correctly picks 100% Grinder rather than inventing a fake split; for Steel (the user's original example) with both tools available it finds a mix that brings both "extra Coal to mine" and "Coal surplus" to ~0, and forcing only one tool available reintroduces real waste (extra mining or a large surplus) in the browser screenshot.
- Browser-driven check (Playwright, same setup as before) against `npm run dev`: Steel's material tree shows the "X прог. Crusher + Y прог. Grinder" row and near-zero Coal line; disabling Grinder in Available Tools live-updates the split to 100% Crusher and reintroduces a Coal surplus row. No console/page errors.
- `vue-tsc --build --force`: no new errors. `node --check` on both modified files: valid syntax. (Full-file eslint still reports the same pre-existing, pre-session lint debt in `craftConstants.js` as before — no new violation categories from this change.)

## 2026-07-18 — Saburra as a first-class Cuprum path (Messing, Bron, Tindremic Messing)

**What changed:** Per user request, the Cuprum-based alloys no longer push the Calx→Calspar chain by default — crushing Saburra is simpler and yields both of what these alloys need at once (Malachite for Cuprum + Saburra Powder as a direct alloy component). Since the Saburra Powder step and the Malachite step split the *same* Saburra ore and each run yields *both* products, treating them sequentially either double-counted supply or ignored it; they are now solved jointly as a 2x2 linear system (same Cramer-with-clamps pattern as the Crusher/Grinder Calx mix), minimizing surplus while covering both needs.

- **Messing** (done in the previous work session, verified in this one): 2x2 solver in the `malR.base==='Saburra'` branch; the non-Saburra branch still credits the SP-step's Malachite byproduct; fixed the water double-count (mal-step Water catalyst was counted via both `malCat` and a duplicate variable). Default `mal` switched from Furnace+Calspar+Bor to Crusher+Saburra.
- **Bron**: same solver port, same water-double-count fix, same default switch. Additionally, every crushed Saburra batch yields Bleckblende (Crusher 1584 / Grinder 1900 per 10 000 — added to the sab-step option data), which is now credited against the Bleck chain's Bleckblende need. On defaults this *fully covers* Bleckblende mining with a surplus shown as a bonus row. Also fixed the pre-existing pooling bug where the SP-step's Malachite byproduct was counted toward the *Saburra Powder* need.
- **Tindremic Messing**: had no Saburra options at all (Calspar-only `mal` step) and ignored the SP-step's Malachite byproduct even on the Calspar path. Added the two Saburra options (+`base` fields on the Calspar ones, `mal` byproduct fields on the sab-step options), ported the solver, switched the mal-step catalyst checks from fragile index comparisons (`sel.mal===0`) to cat-based checks, made the Calspar/Calx tree rows conditional on the Calspar path, and switched the default to Crusher+Saburra.

**What was verified:**
- `node --check` after each metal's edit: valid syntax.
- Node sweeps: Messing 3 456 / Bron 9 216 / Tindremic 720 option×tool×target combinations — zero NaN/negative tree amounts.
- Solver math re-derived independently in the test scripts (not by calling `calc()`): S/M batch counts, total Saburra, Bron's net Bleckblende ore and bonus, and Tindremic's Calspar-path Malachite-byproduct credit all match the tree output to <1 unit.
- Bron water single-count spot-checked with the Grinder+Calx+Water mal option.
- eslint: HEAD version already had ~10.7k pre-existing stylistic errors (compact house style vs `@stylistic` config); confirmed zero `no-unused-vars`/`no-undef`/`no-use-before-define` errors on the edited file.
- Playwright against `npm run dev` with cleared localStorage (fresh defaults): Messing/Bron/Tindremic render in RU and EN, Crusher+Saburra preselected, no Cyrillic leftovers in EN, no console/page errors. Screenshots in the session scratchpad (`sab-{ru,en}-*.png`).

**Next concrete step:** remaining plan items — translate the leftover Russian code comments in `craftConstants.js` to English, add Skadite as a craftable target (needs its own runs metric, see PLAN.md design note), and a real in-repo automated test suite to replace the one-off node scripts.

## 2026-07-18 — Skadite as a craftable target (+ EN ore-price panel bugfix)

**What changed:**
- Added **Skadite** as the 8th metal in `craftConstants.js`, per the PLAN.md design note. It is not a Refining Oven alloy — the final step is a plain Fabricula refine (`10 000 Chalk Glance + {190 Dragon Salt | 800 Ichor} → 3 200 Skadite`), so Ironmaster applies nowhere in the chain and `runs = target/3200`. Chain: Calx → Calspar → Chalk Glance → Skadite, where Chalk Glance (elsewhere a byproduct of Malachite recipes) is the driven output and Malachite/Electrum flip into bonus byproducts. All 12 Calspar→Chalk Glance catalyst options included; the Coke option gets the full Coal→Coke chain with the Crusher/Grinder Calx auto-mix, with the Calspar step's Calx Powder/Coal byproducts credited first.
- The page-header subtitle was hardcoded "Refining Oven · yield 7 000 / craft" — now parameterized (`craft.furnaceSubtitle` takes `{furnace}/{n}`; metals may declare `furnace`/`craftYield`, defaulting to Refining Oven/7000).
- **Bugfix:** `useCraftCalc.js`'s `oreList`/`costData` located the tree's totals section by matching the Russian header text (`'ИТОГО БАЗОВЫЕ'`) — broken in the EN locale ever since the tree-i18n migration (ore price panel rendered empty). Totals rows now carry `totals:true` and the composable keys off that flag.
- `targets` gained the `skadite` key; a zero-amount Calx-mix row is now suppressed in Skadite's Coke section.

**What was verified:**
- Data cross-check: all 14 Skadite-chain options (2 skad + 12 cg) match `refineRecipes.js` on catalyst name/amount, building, and Chalk Glance/Malachite/Electrum outputs.
- Sweep: 1 296 option×tool×target combinations — zero NaN/negative amounts; independent balance check at target 3200 (exactly 1 craft): Chalk Glance 10 000, Calx 558 036, Dragon Salt 4 190, Water 55 804, runs=1 — all match hand-derived values.
- The three Saburra-metal verifiers re-run clean after the shared `totals:true` edit.
- Playwright: Skadite renders in RU and EN (subtitle "Fabricula · выход/yield 3 200 / craft", "3.13 crafts" at target 10 000), no Cyrillic leftovers in EN, no console errors; EN ore-price panel now lists Calx/Dragon Salt/Water (regression fixed); Oghmium's subtitle still reads "Refining Oven · yield 7 000 / craft".

**Next concrete step:** the last open plan item — an in-repo automated test suite to replace the one-off scratchpad node scripts.

## 2026-07-18 — Session stopped (handoff note)

Stopped by user request right before writing the automated test suite — the
last open PLAN.md item. Everything else in the session is done and committed:

- `5757f1a` Saburra as a first-class Cuprum path (Messing/Bron/Tindremic + fixes)
- `233ae6d` craftConstants.js comments translated to English
- `0081bb1` Skadite added as the 8th metal + EN ore-price panel bugfix

**Where the test work stood:** decision made (no vitest install — the repo has
no test runner and network installs need explicit approval; use Node 22's
built-in `node --test` instead, since `craftConstants.js`/`refineRecipes.js`
are pure ESM with no Vue imports). A draft `tests/craftConstants.test.mjs` was
prepared but NOT written to the repo. Planned contents, for whoever resumes:

1. Data integrity: parse every step option's `input` string and match it
   against `refineRecipes.js` (yield + byproduct fields), ~190 options.
2. Alloy sanity: each Refining Oven metal has exactly one 10000+5000+5000→7000
   alloy recipe; Skadite has none (Fabricula, craftYield 3200).
3. Calc invariants: every option × tool combos × bonus combos × targets →
   finite, non-negative tree amounts; linear scaling with target.
4. Exactly one `totals:true` marker row per metal (the EN ore-price panel
   depends on it).
5. Perk semantics: ironmaster divides first-level needs by 1.03, leaves
   Skadite untouched; extract bonus never increases ore needs.
6. Regression pins with hand-derived numbers: Messing/Bron Saburra 126 262.63,
   Bron Bleckblende fully covered (+11 666.67 bonus), Tindremic Saburra
   ~180 374.9, Skadite 1-craft balance (Calx 558 035.71, Dragon Salt 4 190).

Also add `"test": "node --test tests/"` to package.json scripts when landing.
