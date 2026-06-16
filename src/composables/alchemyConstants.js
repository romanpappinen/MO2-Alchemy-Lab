// ─── Ingredient properties ─────────────────────────────────────────────────
export const ALL_PROPS = [
  { id: 'dh', label: 'DH', hint: 'Мгновенное HP при питье' },
  { id: 'hot', label: 'HoT', hint: 'Реген HP/сек × PU' },
  { id: 'hl', label: 'HL', hint: 'Длительность HoT (сек)' },
  { id: 'dp', label: 'DP', hint: 'Мгновенный урон' },
  { id: 'pot', label: 'PoT', hint: 'Урон/сек × PU' },
  { id: 'pl', label: 'PL', hint: 'Длительность яда (сек)' },
  { id: 'alc', label: 'Alc', hint: 'Alcohol (эффект не изучен)' },
]

export const MULT_PROPS = ['dh', 'hot', 'hl', 'dp', 'pot', 'pl']

// ─── Testbed ingredients ────────────────────────────────────────────────────
export const TESTBEDS = {
  sdl_dh: { label: 'Sea Dew Leaves — DH', LB: 2, MV: 0, note: 'Herbology. L×B=2.0. 11 SDL → DH=2.4 (APM+lore 100). MV=0, чистый сигнал.' },
  avg_hot: { label: 'Aloe Vera Gel — HoT', LB: 0.1, MV: 0, note: 'Herbology. L×B=0.100. 11 AVG → HoT=0.120. MV=0.' },
  avg_hl: { label: 'Aloe Vera Gel — HL', LB: 12, MV: 0, note: 'Herbology. L×B=12.0. 11 AVG → HL=14.4. Лучше CVJ — нет собственного HLM.' },
  tm_dp: { label: 'Troll Meat — DP', LB: 2, MV: 0, note: 'Primate Meat Lore. L×B=2.0. Один рецепт даёт DP+PoT+PL.' },
  tm_pot: { label: 'Troll Meat — PoT', LB: 0.05, MV: 0, note: 'Primate Meat Lore. L×B=0.050. Тот же рецепт, смотришь PoT.' },
  tm_pl: { label: 'Troll Meat — PL', LB: 9, MV: 0, note: 'Primate Meat Lore. L×B=9.0. Тот же рецепт, смотришь PL.' },
  cvj_dh: { label: 'CVJ — DH', LB: 1, MV: 0, note: 'Herbology. L×B=1.0. Слабее SDL.' },
  cvj_hl: { label: 'CVJ — HL', LB: 24, MV: -0.8, note: 'Herbology. L×B=24.0. CVJ HLM=−0.80 учтён. Лучше использовать AVG.' },
  nitre_dp: { label: 'Nitre — DP', LB: 3, MV: -0.36, note: 'Nitre Lore (F=1). DPM=−0.36 учтён. Нулевое с +1 нейтр.: DP≈1.802.' },
}

export const TB_BY_PROP = {
  dh: ['sdl_dh', 'cvj_dh'],
  hot: ['avg_hot'],
  hl: ['avg_hl', 'cvj_hl'],
  dp: ['tm_dp', 'nitre_dp'],
  pot: ['tm_pot'],
  pl: ['tm_pl'],
}

export const DEFAULT_TB = {
  dh: 'sdl_dh', hot: 'avg_hot', hl: 'avg_hl',
  dp: 'tm_dp', pot: 'tm_pot', pl: 'tm_pl',
}

// ─── Known multiplier values ─────────────────────────────────────────────────
// Classic values follow M²/100−1 formula. Post-patch ingredients may have
// arbitrary values (e.g. +0.10, +0.60) — the full 0.01-step table catches them.
export const KNOWN_MV = {
  '+0.96': 'Argus Sponge, Skadite',
  '+0.69': 'Gold, Jadeite, Great Horn',
  '+0.60': 'non-standard (post-patch?)',
  '+0.56': 'Pirum Juice, Electrum',
  '+0.44': 'Basileus, Blood Ore, Muse Fruit',
  '+0.21': 'Horn, Gamun Seeds, Allium',
  '+0.10': 'non-standard (post-patch)',
  '+0.00': 'Нейтральный',
  '-0.10': 'Nitre (HoTM/HLM)',
  '-0.19': 'Nitre (DHM/PoTM)',
  '-0.36': 'Nitre (DPM)',
  '-0.75': 'Vitis HLM',
  '-0.80': 'CVJ HLM',
  '-1.00': 'Nitre AlcM',
}

// MV candidates: full range -1.00 to +2.00 in 0.01 steps
// Covers all known multiplier values including post-patch non-standard ones
export const MV_VALS = Array.from({ length: 301 }, (_, i) => {
  const val = Math.round((-1 + i * 0.01) * 100) / 100
  return { M: val, val }
})

// ─── Helpers ────────────────────────────────────────────────────────────────
export function makeMTState () {
  return Object.fromEntries(
    MULT_PROPS.map(prop => {
      const tb = TESTBEDS[DEFAULT_TB[prop]]
      return [prop, {
        tbKey: DEFAULT_TB[prop],
        lb: tb.LB,
        mv: tb.MV,
        calibration: '',
        baseMVMode: false,
        potions: [
          { ntb: 11, nx: 1, pr: '' },
          { ntb: 11, nx: 2, pr: '' },
        ],
      }]
    }),
  )
}

export function makePot () {
  return { dh: '', hot: '', hl: '', dp: '', pot: '', pl: '', alc: '' }
}
