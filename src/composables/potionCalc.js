// ─── Potion calculation ──────────────────────────────────────────────────────
//
// Formula:
//   Property = A × Σ(LB_i × C_i/N) × Π(1 + √(C_i/N) × MV_i)
//
// Where:
//   A     = APM multiplier of the recipe maker = 1 + 0.2 × apm/100
//   LB_i  = L×B of ingredient = stored_ALB / A_ing (normalize out test-time A)
//   C_i   = count of ingredient i in the potion
//   N     = total count of ALL ingredients (including AW=0 ones)
//   MV_i  = multiplier value of ingredient for this property (0 if none)

export const POTION_PROPS = ['dh', 'hot', 'hl', 'dp', 'pot', 'pl']

export const PROP_LABELS = {
  dh: { label: 'DH', full: 'Direct Healing', heal: true },
  hot: { label: 'HoT', full: 'Healing over Time', heal: true },
  hl: { label: 'HL', full: 'Healing Length', heal: true },
  dp: { label: 'DP', full: 'Direct Poison', heal: false },
  pot: { label: 'PoT', full: 'Poison over Time', heal: false },
  pl: { label: 'PL', full: 'Poison Length', heal: false },
}

export const VIAL_TYPES = [
  { id: 'minor', label: 'Minor Vial', maxPU: 15 },
  { id: 'medium', label: 'Medium Vial', maxPU: 40 },
]

/**
 * Compute L×B from stored A×L×B value by dividing out the test-time A.
 * This gives the lore-adjusted base independent of APM.
 */
export function getLB (ingredient, prop) {
  const alb = ingredient?.bases?.[prop]
  if (!alb) {
    return 0
  }
  const A_ing = 1 + 0.2 * (ingredient.skills?.apm ?? 100) / 100
  return alb / A_ing
}

/**
 * Get MV for a property from ingredient's mvs record.
 */
export function getMV (ingredient, prop) {
  return ingredient?.mvs?.[prop + 'm'] ?? 0
}

/**
 * Calculate all potion properties from a list of recipe lines.
 *
 * @param {Array<{ingredient: object, count: number}>} lines
 * @param {number} apm  - recipe maker's APM level (0-100)
 * @returns {{ props: object, totalAW: number, PU: number }}
 */
export function calcPotion (lines, apm, QB = 1) {
  const A = 1 + 0.2 * apm / 100
  const N = lines.reduce((s, l) => s + l.count, 0)

  if (N === 0) {
    return { props: Object.fromEntries(POTION_PROPS.map(p => [p, 0])), totalAW: 0, PU: 0 }
  }

  const totalAW = lines.reduce((s, l) => s + l.count * (l.ingredient.hasAW ? 1 : 0), 0)
  const rawPU = Math.floor((totalAW - 1) / 10)
  const PU = Math.max(0, rawPU)

  const props = {}
  for (const prop of POTION_PROPS) {
    // Base sum: Σ LB_i × (C_i / N)
    let baseSum = 0
    for (const line of lines) {
      const lb = getLB(line.ingredient, prop)
      if (lb !== 0) {
        baseSum += lb * (line.count / N)
      }
    }

    // Multiplier product: Π (1 + √(C_i/N) × MV_i)
    let multProd = 1
    for (const line of lines) {
      const mv = getMV(line.ingredient, prop)
      if (mv !== 0) {
        multProd *= 1 + Math.sqrt(line.count / N) * mv
      }
    }

    const raw = QB * A * baseSum * multProd
    // Round to 3 decimal places; if <= 0 before rounding → 0
    props[prop] = raw > 0 ? Math.round(raw * 1000) / 1000 : 0
  }

  return { props, totalAW, PU }
}

/**
 * Compute per-gulp values: DH × PU_drunk, etc.
 * HL and PL are NOT multiplied by PU (they are flat durations).
 */
export function perGulp (props, PUDrunk) {
  const result = {}
  for (const prop of POTION_PROPS) {
    const v = props[prop] ?? 0
    result[prop] = (prop === 'hl' || prop === 'pl') ? v : Math.round(v * PUDrunk * 1000) / 1000
  }
  return result
}

/**
 * Format a property value for display.
 */
export function fmtProp (v) {
  if (!v || v === 0) {
    return '—'
  }
  return (+v).toFixed(3)
}
