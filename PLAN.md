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

## In progress

- [ ] This plan file
- [ ] Translate all material-tree labels through `useI18n.js` (RU/EN) — currently hardcoded Russian strings in `craftConstants.js`
- [ ] Translate existing Russian code comments in `craftConstants.js` to English
- [ ] Add **Skadite** as a craftable target
- [ ] Remove dead code (`coalPool` in Messing/Bron, and anything similar found along the way)
- [ ] Real automated test suite (current checks are one-off node scripts, not part of the repo)
- [ ] Cleanup — scope to be confirmed

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
