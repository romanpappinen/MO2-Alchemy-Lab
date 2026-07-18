# Craft Calc Work Plan (Mortal Online 2)

Living checklist for the craft-calculator work. Checked off as items land;
new items get added as they come up. Project language is English
throughout (docs, code, comments, commit messages) — the RU/EN toggle is
a UI-only concern (`src/composables/useI18n.js`), not a reason to write
Russian anywhere else.

## Done

- [x] `base_refine.txt` -> `src/composables/refineRecipes.js` (83 deduplicated recipes: 8 alloys + 75 refine)
- [x] Bugfix: Steel/Calx-Grinder wasn't crediting the Coal byproduct (`coal:0` -> `coal:1140`)
- [x] Added **Bron** and **Tungsteel** as standalone metals (previously missing / intermediate-only)
- [x] Steel: added the Coke recipe choice (Coal+Coal vs Coal+Calx Powder — was hardcoded)
- [x] Tracked the Pyrite byproduct on Pyroxene (Oghmium, Cronite)
- [x] Data cross-check: every metal's recipe options verified against `refineRecipes.js` (0 mismatches)
- [x] Verified perks (ironmaster/extractBonus) behave identically across all metals
- [x] Tool availability: sidebar selector + recipe-option sorting by availability
- [x] Waste-minimization hint: auto-mix Crusher/Grinder for Calx Powder+Coal (Oghmium, Steel, Cronite, Tungsteel)
- [x] Steel: added the missing Pig Iron-via-Sulfur option (existed on 3 of 4 comparable metals)
- [x] This plan file
- [x] Remove dead code (mechanical `no-unused-vars` sweep) — surfaced two real bugs along the way: Messing/Bron silently dropped Coke/Coal requirements, Tindremic dropped Almine's mandatory Calx Powder catalyst. Fixed by adding a proper Coal->Coke chain + Crusher/Grinder Calx auto-mix to all three metals.

- [x] Translate all material-tree labels through `useI18n.js` (RU/EN) — `calc()` now takes a `t` function; ~40 shared `tree.*`/`tag.*` template keys cover all 7 metals' rows in both locales
- [x] Saburra as a first-class Cuprum path (Messing, Bron, Tindremic Messing): one Saburra batch yields Malachite AND Saburra Powder at once, so the SP-step and Malachite-step now share a 2x2 joint solver (same pattern as the Crusher/Grinder Calx mix) instead of double-counting or ignoring each other's byproducts. Defaults switched from the Calspar path to Crusher+Saburra. Tindremic gained the Saburra options it was missing entirely (and now credits the SP-step Malachite byproduct on the Calspar path too). Bron additionally credits the Bleckblende that crushed Saburra yields toward the Bleck chain — on defaults it fully covers Bleckblende mining. Also fixed Bron's water double-count (mal-step Water catalyst was added twice; same bug fixed earlier in Messing).

- [x] Translate existing Russian code comments in `craftConstants.js` to English (comment-only diff, verified code parts identical)
- [x] Add **Skadite** as a craftable target — modeled per the design note below: Calx -> Calspar -> Chalk Glance (driven output, Malachite/Electrum flip into byproducts) -> Skadite via Fabricula; own `runs = target/3200` metric and a per-metal `furnace`/`craftYield` header (the "Refining Oven · 7000/craft" subtitle was hardcoded). Coke-catalyst option included with the full Coal->Coke chain + Crusher/Grinder Calx mix.
- [x] Bugfix found along the way: the ore-price panel matched the tree's totals section by the *Russian* header text, so it was empty in the EN locale ever since the tree i18n landed. Totals rows now carry a structural `totals:true` flag that `useCraftCalc.js` keys off instead.

## In progress

- [ ] Real automated test suite (current checks are one-off node scripts, not part of the repo)

## Notes / decisions made along the way

- Grain Steel intentionally NOT made a standalone target (stays internal-only, per user decision)
- Magmum->Kyanite/Maalite/Pyropite, Cerulite->Azurite/Malachite/Pyrite, Cinnabar->Ichor/Sulfur branches are not wired up — no current metal needs them
- Skadite doesn't fit the "10000+5000+5000 -> 7000 via Refining Oven" pattern the other 7 metals use — needs its own model (see below)
- Commits `89a32eb` and `4e22638` include unrelated pre-session files that got swept in by `git add`/`git commit` without an explicit pathspec — left as-is per user decision

## Skadite — design note

Skadite isn't a top-level alloy in `base_refine.txt` (no "X+Y+Z -> Skadite" formula) —
it's a plain refine step: `10000 Chalk Glance + {190 Dragon Salt | 800 Ichor} (Fabricula) -> 3200 Skadite`.
Chalk Glance itself is currently only produced as a byproduct of Malachite's Calspar-based
recipes (Messing/Bron's `mal` step). Modeling Skadite as a metal means treating Chalk Glance as
the *primary* driven output of that step instead of a byproduct, then chaining back through
Calspar -> Calx as usual. The `runs: target/7000` display convention (built around the
Refining Oven's 7000/craft output) won't apply here since Skadite's own craft yields 3200 via
Fabricula — needs its own runs metric or a tweak to how that's displayed.
