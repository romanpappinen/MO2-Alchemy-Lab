// Default recipe, baked into the app so a fresh install has a working
// example potion instead of an empty list. Seeded into localStorage on
// first load only — see loadPotions() in usePotionStore.js.
//
// Built entirely from PRESET_INGREDIENTS (not from any user's saved
// library/localStorage) — every line embeds the exact preset ingredient
// object, so this recipe calculates correctly on a completely fresh
// install with zero other data present, and matches what the equivalent
// user-saved recipe worked out to.
import { calcPotion, perGulp, VIAL_TYPES } from './potionCalc.js'
import { PRESET_INGREDIENTS } from './presetIngredients.js'

function findPreset (name) {
  const ing = PRESET_INGREDIENTS.find(i => i.name === name)
  if (!ing) {
    throw new Error(`[presetPotions] preset ingredient not found: ${name}`)
  }
  return ing
}

function buildLines (entries) {
  return entries.map(([name, count]) => ({ ingredient: findPreset(name), count }))
}

function computeCalc (lines, { apm, qualityBuff, alvarin, vialType, thirst }) {
  const QB = qualityBuff ? 1.03 : 1
  const base = calcPotion(lines, apm, QB)
  const PU = alvarin ? Math.floor(base.PU * 1.1) : base.PU
  const vial = VIAL_TYPES.find(v => v.id === vialType) ?? VIAL_TYPES[0]
  const PUFinal = Math.min(PU, vial.maxPU)
  const PUDrunk = Math.min(thirst, PUFinal)
  const gulp = perGulp(base.props, PUDrunk)
  return {
    props: base.props,
    gulp,
    totalAW: base.totalAW,
    PU: PUFinal,
    PUDrunk,
    vialMax: vial.maxPU,
    isFull: PUFinal >= vial.maxPU,
  }
}

const V1_PARAMS = { apm: 100, qualityBuff: true, alvarin: false, vialType: 'minor', thirst: 10 }

const V1_SPEC = [
  ['Sea Dew Leaves', 5772],
  ['Argus Sponge', 470],
  ['Skadite', 467],
  ['Calxfish', 279],
  ['Clothos Maiden Carcass', 277],
  ['Gold', 279],
  ['Great Horn', 279],
  ['Jadeite', 279],
  ['Nitre Queen Carcass', 277],
  ['Electrum', 185],
  ['Green Jambura Juice', 276],
  ['Pirum Juice', 278],
  ['Muse Fruit', 265],
  ['Tagmaton Bulwark Carcass', 276],
  ['Tagmaton Broodmother Carcass', 277],
  ['Tagmaton Drone Carcass', 276],
]

const v1Lines = buildLines(V1_SPEC)

export const PRESET_POTIONS = [
  {
    id: 1,
    name: 'V1',
    vialType: V1_PARAMS.vialType,
    thirst: V1_PARAMS.thirst,
    apm: V1_PARAMS.apm,
    alvarin: V1_PARAMS.alvarin,
    qualityBuff: V1_PARAMS.qualityBuff,
    lines: v1Lines,
    calc: computeCalc(v1Lines, V1_PARAMS),
    savedAt: '2026-07-13T00:00:00.000Z',
    preset: true,
  },
]
