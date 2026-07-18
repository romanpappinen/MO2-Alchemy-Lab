import { computed, reactive, ref } from 'vue'
import { METALS } from './craftConstants.js'

// ── Ore price tracking ────────────────────────────────────────────────────
const ALL_ORE_KEYS = ['Calx', 'Granum', 'Tephra', 'Gabore', 'Saburra', 'Bleckblende', 'Bor', 'Water', 'Fuming Salt', 'Rock Oil', 'Sulfur', 'Ichor', 'Dragon Salt']
const PCT_COLORS = ['#c8922a', '#4a9e6a', '#4a7a9e', '#9e4a4a', '#7a4a9e', '#9e7a4a', '#4a9e9e', '#9e9e4a']

const currentMetal = ref('oghmium')
const targets = reactive({ oghmium: 10000, steel: 10000, messing: 10000, tindremic: 10000, cronite: 10000, bron: 10000, tungsteel: 10000 })
const selections = reactive(Object.fromEntries(METALS.map(m => [m.id, { ...m.defaultSel }])))
const bonuses = reactive({ ironmaster: false, extractBonus: 0 })
const toast = reactive({ show: false, msg: '', success: false })
let toastTimer = null

const prices = reactive(Object.fromEntries(ALL_ORE_KEYS.map(k => [k, 0])))
const priceMode = reactive({ absolute: true })

export function useCraftCalc () {
  const metals = METALS
  const metal = computed(() => METALS.find(m => m.id === currentMetal.value))

  const result = computed(() => {
    if (!metal.value) {
      return { target: 0, runs: 0, tree: [] }
    }
    return metal.value.calc(targets[currentMetal.value] || 10000, selections[currentMetal.value] || {}, bonuses)
  })

  // Dynamic ore list, read off the "base resources" summary section of the
  // current tree so the price panel only ever shows ores actually in use.
  const oreList = computed(() => {
    const tree = result.value?.tree || []
    let inSummary = false
    const found = []
    const seen = new Set()
    for (const node of tree) {
      if (node.name && node.name.includes('ИТОГО БАЗОВЫЕ')) {
        inSummary = true
        continue
      }
      if (!inSummary || !node.name || !node.amount) {
        continue
      }
      const key = ALL_ORE_KEYS.find(k => node.name === k || node.name.startsWith(k + ' ') || node.name.startsWith(k + '('))
      if (key && !seen.has(key)) {
        seen.add(key)
        found.push({ key, label: key })
      }
    }
    return found
  })

  const costData = computed(() => {
    const tree = result.value?.tree || []
    let inSummary = false
    const seen = new Map()
    for (const node of tree) {
      if (node.name && node.name.includes('ИТОГО БАЗОВЫЕ')) {
        inSummary = true
        continue
      }
      if (!inSummary || !node.name || !node.amount) {
        continue
      }
      const key = ALL_ORE_KEYS.find(k => node.name === k || node.name.startsWith(k + ' ') || node.name.startsWith(k + '('))
      if (!key) {
        continue
      }
      const price = prices[key] || 0
      if (price <= 0) {
        continue
      }
      const qty = node.amount
      const cost = qty * (price / 10000)
      if (seen.has(key)) {
        const e = seen.get(key)
        e.qty += qty
        e.cost += cost
      } else {
        seen.set(key, { key, label: key, qty, price, cost, color: '', pct: 0 })
      }
    }
    const rows = [...seen.values()]
    const total = rows.reduce((s, row) => s + row.cost, 0)
    rows.forEach((row, i) => {
      row.color = PCT_COLORS[i % PCT_COLORS.length]
      row.pct = total > 0 ? (row.cost / total) * 100 : 0
    })
    return { rows, total }
  })

  function getSelIdx (stepId) {
    return selections[currentMetal.value]?.[stepId] ?? 0
  }

  function isBestOpt (step, idx) {
    const EM = 1 + (bonuses.extractBonus || 0) / 100
    // Group by base ore (if any), otherwise compare all options together.
    const opt = step.options[idx]
    const sameGroup = step.options.filter(o => (o.base || '') === (opt.base || ''))
    if (sameGroup.length <= 1) {
      return false
    }
    const maxYield = Math.max(...sameGroup.map(o => (o.yield || 0) * EM))
    return (opt.yield || 0) * EM === maxYield && maxYield > 0
  }

  function getSelected (step) {
    return step.options[getSelIdx(step.id)]
  }

  function select (stepId, idx) {
    if (!selections[currentMetal.value]) {
      selections[currentMetal.value] = {}
    }
    selections[currentMetal.value][stepId] = idx
  }

  function showToast (msg, success = false) {
    if (toastTimer) {
      clearTimeout(toastTimer)
    }
    Object.assign(toast, { msg, show: true, success })
    toastTimer = setTimeout(() => { toast.show = false }, 2500)
  }

  function savePreset (msgSaved) {
    localStorage.setItem('craft_preset_v1', JSON.stringify({
      targets: { ...targets },
      selections: JSON.parse(JSON.stringify(selections)),
      bonuses: { ...bonuses },
    }))
    showToast(msgSaved, true)
  }

  function loadPreset (msgLoaded, msgEmpty, msgError) {
    const raw = localStorage.getItem('craft_preset_v1')
    if (!raw) {
      return showToast(msgEmpty)
    }
    try {
      const d = JSON.parse(raw)
      Object.assign(targets, d.targets)
      Object.assign(selections, d.selections)
      if (d.bonuses) {
        Object.assign(bonuses, d.bonuses)
      }
      showToast(msgLoaded, true)
    } catch {
      showToast(msgError)
    }
  }

  // Ceil to whole units — you can't mine 1.4 ore.
  function fmt (n) {
    if (!n || Number.isNaN(n)) {
      return '0'
    }
    return Math.ceil(n).toLocaleString('ru-RU')
  }

  function fmtDec (n) {
    if (!n || Number.isNaN(n)) {
      return '0.00'
    }
    return n.toFixed(2)
  }

  return {
    currentMetal, metals, metal, targets, selections, result, toast, bonuses,
    getSelIdx, getSelected, select, savePreset, loadPreset, fmt, fmtDec, isBestOpt,
    prices, priceMode, oreList, costData,
  }
}
