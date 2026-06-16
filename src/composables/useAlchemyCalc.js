import { KNOWN_MV, MV_VALS } from './alchemyConstants.js'

export function calcA (apm) {
  return 1 + 0.2 * apm / 100
}
export function calcL (loreType, loreLevel) {
  return loreType === 0 ? 1 : 1 + loreType * loreLevel / 100
}
export function calcQB (qualityBuff) {
  return qualityBuff ? 1.03 : 1
}

export function detectSelfMV (v1Str, v2Str) {
  const v1 = Number.parseFloat(v1Str), v2 = Number.parseFloat(v2Str)
  if (Number.isNaN(v1) || v1 === 0 || Number.isNaN(v2) || v2 === 0) {
    return null
  }
  const ratio = v1 / (v2 * 2)
  if (Math.abs(ratio - 1) <= 0.004) {
    return 0
  }
  return Math.round((1 - ratio) / (0.7071 * ratio - 1) * 100) / 100
}

export function computeALB (obs, isWater, selfMV, QB) {
  const df = isWater ? 2 : 1
  const sm1 = selfMV === null ? 1 : (1 + selfMV)
  return obs * df / (QB * sm1)
}

export function computeAllBases (pot1, pot2, hasAW, QB) {
  const result = {}
  const isWater = !hasAW
  for (const [key, v1Str] of Object.entries(pot1)) {
    const v1 = Number.parseFloat(v1Str)
    if (Number.isNaN(v1) || v1 === 0) {
      result[key] = null
      continue
    } else {
      let selfMV = null
      if (!isWater) {
        selfMV = detectSelfMV(v1Str, pot2[key])
      }
      result[key] = computeALB(v1, isWater, selfMV, QB)
    }
  }
  return result
}

export function computeAllSelfMVs (pot1, pot2, hasAW) {
  if (!hasAW) {
    return Object.fromEntries(Object.keys(pot1).map(k => [k, null]))
  }
  return Object.fromEntries(Object.keys(pot1).map(k => [k, detectSelfMV(pot1[k], pot2[k])]))
}

// ─── Shared base extractor ───────────────────────────────────────────────────
function _extractBases (potions, lb, mvtb, effQA, MVx) {
  const albs = potions.map(p => {
    const pr = Number.parseFloat(p.pr)
    if (Number.isNaN(pr) || p.pr === '') {
      return Number.NaN
    }
    const N = p.ntb + p.nx
    const pT = p.ntb / N
    const pX = p.nx / N
    const mT = 1 + Math.sqrt(pT) * mvtb
    const mX = 1 + Math.sqrt(pX) * MVx
    if (Math.abs(mT) < 1e-9 || Math.abs(mX) < 1e-9) {
      return Number.NaN
    }
    const bSum = pr / (effQA * mT * mX)
    const lxbx = (bSum - lb * pT) / pX
    return effQA * lxbx
  })
  const stableAlbs = albs.filter((v, i) => Number.isFinite(v) && potions[i].nx >= 2)
  return { albs, stableAlbs }
}

// ─── Normal mode (base = 0 expected) ────────────────────────────────────────
export function computeMVTable (potions, lb, mvtb, A, QB, calibration = null) {
  const valid = potions.filter(p => p.pr !== '' && !Number.isNaN(Number.parseFloat(p.pr)))
  if (valid.length === 0) {
    return []
  }
  const effQA = calibration == null ? QB * A : calibration / lb

  return MV_VALS.map(({ M, val: MVx }) => {
    const { albs } = _extractBases(valid, lb, mvtb, effQA, MVx)
    const fin = albs.filter(x => Number.isFinite(x))

    let minSpread = Infinity
    for (let i = 0; i < fin.length; i++) {
      for (let j = i + 1; j < fin.length; j++) {
        const s = Math.abs(fin[i] - fin[j])
        if (s < minSpread) {
          minSpread = s
        }
      }
    }

    const mean = fin.length > 0 ? fin.reduce((a, b) => a + b, 0) / fin.length : Infinity

    // Values must converge AND be near zero.
    // |mean| check prevents false hits when ingredient has a hidden non-zero base
    // (e.g. Muse Fruit DP: values cluster at -2.47 for all MV candidates)
    const hit = fin.length >= 2 && minSpread < 0.005 && Math.abs(mean) < 0.05
    const near = !hit && fin.length >= 2 && minSpread < 0.02 && Math.abs(mean) < 0.08

    const mvStr = (MVx >= 0 ? '+' : '') + MVx.toFixed(2)
    return { M, MVx, albs, fin, hit, near, known: KNOWN_MV[mvStr] ?? '' }
  })
}

// ─── Base+MV mode (ingredient has both base and multiplier) ─────────────────
export function computeMVTableBaseMV (potions, lb, mvtb, A, QB, calibration = null) {
  const valid = potions.filter(p => p.pr !== '' && !Number.isNaN(Number.parseFloat(p.pr)))
  if (valid.length === 0) {
    return []
  }
  const effQA = calibration == null ? QB * A : calibration / lb

  return MV_VALS.map(({ M, val: MVx }) => {
    const { albs, stableAlbs } = _extractBases(valid, lb, mvtb, effQA, MVx)
    const fin = albs.filter(x => Number.isFinite(x))

    if (stableAlbs.length < 2) {
      const mvStr = (MVx >= 0 ? '+' : '') + MVx.toFixed(2)
      return { M, MVx, albs, fin, stableAlbs, hit: false, near: false,
        estimatedBase: null, known: KNOWN_MV[mvStr] ?? '' }
    }

    let minSpread = Infinity
    for (let i = 0; i < stableAlbs.length; i++) {
      for (let j = i + 1; j < stableAlbs.length; j++) {
        const s = Math.abs(stableAlbs[i] - stableAlbs[j])
        if (s < minSpread) {
          minSpread = s
        }
      }
    }

    const mean = stableAlbs.reduce((a, b) => a + b, 0) / stableAlbs.length
    const relSpread = Math.abs(mean) > 0.001 ? minSpread / Math.abs(mean) : Infinity

    // 5% threshold — tolerates small calibration errors (~2.4% from Troll Meat DP)
    const hit = relSpread < 0.05
    const near = !hit && relSpread < 0.15

    // Best base estimate = average of two highest-nx stable potions
    const sorted = [...valid]
      .filter((p, i) => Number.isFinite(albs[i]) && p.nx >= 2)
      .sort((a, b) => b.nx - a.nx)
      .slice(0, 2)
    const bestAlbs = sorted.map(p => albs[valid.indexOf(p)]).filter(x => Number.isFinite(x))
    const estimatedBase = bestAlbs.length > 0
      ? Math.round(bestAlbs.reduce((a, b) => a + b, 0) / bestAlbs.length * 1000) / 1000
      : null

    const mvStr = (MVx >= 0 ? '+' : '') + MVx.toFixed(2)
    return { M, MVx, albs, fin, stableAlbs, hit, near, estimatedBase, known: KNOWN_MV[mvStr] ?? '' }
  })
}

export function computeZeroPatterns (lb, mvtb, A, QB, calibration = null) {
  const effQA = calibration == null ? QB * A : calibration / lb
  return [1, 2, 3].map(nx => {
    const N = 11 + nx
    const pT = 11 / N
    const v = effQA * lb * pT * (1 + Math.sqrt(pT) * mvtb)
    return { nx, v: Math.round(v * 1000) / 1000 }
  })
}

export function fmtAlb (v) {
  return v == null ? '—' : (+v).toFixed(4)
}
export function fmtLib (v) {
  return !v || v === 0 ? '—' : (+v).toFixed(3)
}
export function fmtMV (v) {
  return v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2)
}
export function valClass (v) {
  if (v == null || Math.abs(+v) < 1e-4) {
    return 'zero'
  }
  return +v > 0 ? 'pos' : 'neg'
}
