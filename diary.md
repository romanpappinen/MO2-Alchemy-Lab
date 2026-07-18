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
