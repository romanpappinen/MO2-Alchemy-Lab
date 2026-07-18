# Diary

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
