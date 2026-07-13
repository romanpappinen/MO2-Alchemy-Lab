import { computed, reactive, ref } from 'vue'
import { ALL_PROPS, makeMTState, makePot, MULT_PROPS, TESTBEDS } from './alchemyConstants.js'
import { PRESET_INGREDIENTS } from './presetIngredients.js'
import { calcA, calcL, calcQB, computeAllBases, computeAllSelfMVs, computeMVTable, computeMVTableBaseMV } from './useAlchemyCalc.js'

const step = ref(1)
const isModalOpen = ref(false)
const editingId = ref(null)
const editingOriginal = ref(null)
const ingredientName = ref('')
const nameError = ref('')
const hasAW = ref(true)

const skills = reactive({ apm: 100, loreType: 2 / 3, loreLevel: 100, qualityBuff: false })
const pot1 = reactive(makePot())
const pot2 = reactive(makePot())

const activeMProp = ref('dh')
const multTests = reactive(makeMTState())
const showAllMV = ref(false)

const library = ref([])
const searchQuery = ref('')
const toast = ref(null)
let toastTimer = null

export function useAlchemyStore () {
  const A = computed(() => calcA(skills.apm))
  const L = computed(() => calcL(skills.loreType, skills.loreLevel))
  const QB = computed(() => calcQB(skills.qualityBuff))

  const selfMVs = computed(() => computeAllSelfMVs(pot1, pot2, hasAW.value))
  const bases = computed(() => computeAllBases(pot1, pot2, hasAW.value, QB.value))

  const hasAnyBase = computed(() => Object.values(bases.value).some(v => v !== null))
  const hasAnyInput = computed(() => ingredientName.value || Object.values(pot1).some(v => v !== ''))
  const pot1HasValues = computed(() => Object.values(pot1).some(v => v !== ''))

  // True when editing an existing ingredient and Step 1 measurements
  // (pot1) haven't been re-entered — i.e. the person is only tweaking
  // the name/skills/etc, not re-measuring the ingredient from scratch.
  const isEditNoRemeasure = computed(() => !!editingId.value && !pot1HasValues.value)

  const previewBases = computed(() => {
    const result = { ...bases.value }
    for (const prop of MULT_PROPS) {
      const det = detectedMVs.value[prop]
      if (!det?.hit) {
        continue
      }
      if (det.estimatedBase != null && (result[prop] == null || result[prop] === 0)) {
        result[prop] = det.estimatedBase
      } else if (det.fin?.length >= 2) {
        const mean = det.fin.reduce((a, b) => a + b, 0) / det.fin.length
        if (Math.abs(mean) > 0.1 && (result[prop] == null || result[prop] === 0)) {
          result[prop] = Math.round(mean * 1000) / 1000
        }
      }
    }
    return result
  })

  const activeTest = computed(() => multTests[activeMProp.value])
  const activeMVTable = computed(() => computeMVTableForProp(activeMProp.value))
  const activeDetectedMV = computed(() => detectedMVs.value[activeMProp.value])
  const detectedMVCount = computed(() => Object.values(detectedMVs.value).filter(v => v?.hit).length)

  const detectedMVs = computed(() =>
    Object.fromEntries(
      MULT_PROPS.map(prop => {
        const tbl = computeMVTableForProp(prop)
        return [prop, tbl.find(r => r.hit) ?? tbl.find(r => r.near) ?? null]
      }),
    ),
  )

  const filteredLibrary = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return q ? library.value.filter(i => i.name.toLowerCase().includes(q)) : library.value
  })

  function computeMVTableForProp (prop) {
    const t = multTests[prop]
    if (!t) {
      return []
    }
    const calib = t.calibration !== '' && !isNaN(Number.parseFloat(t.calibration))
      ? Number.parseFloat(t.calibration)
      : null
    return t.baseMVMode
      ? computeMVTableBaseMV(t.potions, t.lb, t.mv, A.value, QB.value, calib)
      : computeMVTable(t.potions, t.lb, t.mv, A.value, QB.value, calib)
  }

  function validateAndNext () {
    nameError.value = ''
    if (!ingredientName.value.trim()) {
      nameError.value = 'Enter ingredient name'
      return false
    }
    step.value = 2
    return true
  }

  function addPotion (prop) {
    const nx = multTests[prop].potions.length + 1
    multTests[prop].potions.push({ ntb: 11, nx, pr: '' })
  }

  function removePotion (prop, idx) {
    multTests[prop].potions.splice(idx, 1)
  }

  function syncTestbedValues (prop) {
    const tb = TESTBEDS[multTests[prop].tbKey]
    if (tb) {
      multTests[prop].lb = tb.LB
      multTests[prop].mv = tb.MV
    }
    showAllMV.value = false
  }

  function openModal (id = null) {
    resetWizard()
    if (id !== null) {
      const rec = library.value.find(i => i.id === id)
      if (rec) {
        _populateFromRecord(rec)
      }
    }
    isModalOpen.value = true
  }

  function _populateFromRecord (rec) {
    editingId.value = rec.id
    editingOriginal.value = rec
    ingredientName.value = rec.name
    hasAW.value = rec.hasAW
    if (rec.skills) {
      Object.assign(skills, rec.skills)
    }
  }

  function closeModal () {
    isModalOpen.value = false
    resetWizard()
  }

  function saveIngredient () {
    // Editing an existing ingredient without re-entering Step 1
    // measurements: pot1/multTests are blank, so bases/detectedMVs would
    // compute as empty. Keep whatever was already saved for this record
    // instead of wiping it out.
    if (isEditNoRemeasure.value && editingOriginal.value) {
      const orig = editingOriginal.value
      const record = {
        id: orig.id,
        name: ingredientName.value.trim(),
        hasAW: hasAW.value,
        skills: { ...skills },
        bases: { ...orig.bases },
        selfMVs: { ...orig.selfMVs },
        mvs: { ...orig.mvs },
        createdAt: orig.createdAt,
        updatedAt: new Date().toISOString(),
      }
      const existIdx = library.value.findIndex(i => i.id === record.id)
      if (existIdx !== -1) {
        library.value.splice(existIdx, 1, record)
      }
      persistLibrary()
      showToast('Changes saved')
      closeModal()
      return
    }

    const mvs = Object.fromEntries(
      MULT_PROPS.map(prop => {
        const det = detectedMVs.value[prop]
        const selfMV = selfMVs.value[prop]
        let value = null
        if (det?.hit || det?.near) {
          value = det.MVx
        } else if (selfMV !== null && selfMV !== 0) {
          value = selfMV
        }
        return [prop + 'm', value]
      }),
    )

    const finalBases = { ...bases.value }
    for (const prop of MULT_PROPS) {
      const det = detectedMVs.value[prop]
      if (!det?.hit) {
        continue
      }
      if (det.estimatedBase != null) {
        if (finalBases[prop] == null || finalBases[prop] === 0) {
          finalBases[prop] = det.estimatedBase
        }
      } else if (det.fin?.length >= 2) {
        const mean = det.fin.reduce((a, b) => a + b, 0) / det.fin.length
        if (Math.abs(mean) > 0.1 && (finalBases[prop] == null || finalBases[prop] === 0)) {
          finalBases[prop] = Math.round(mean * 1000) / 1000
        }
      }
    }

    const record = {
      id: editingId.value ?? Date.now(),
      name: ingredientName.value.trim(),
      hasAW: hasAW.value,
      skills: { ...skills },
      bases: finalBases,
      selfMVs: { ...selfMVs.value },
      mvs,
      createdAt: new Date().toISOString(),
    }

    const existIdx = library.value.findIndex(i => i.id === record.id)
    if (existIdx === -1) {
      library.value.unshift(record)
      showToast('Saved to library')
    } else {
      library.value.splice(existIdx, 1, record)
      showToast('Changes saved')
    }

    persistLibrary()
    closeModal()
  }

  function deleteIngredient (id) {
    library.value = library.value.filter(i => i.id !== id)
    persistLibrary()
    showToast('Deleted')
  }

  function resetWizard () {
    step.value = 1
    editingId.value = null
    editingOriginal.value = null
    ingredientName.value = ''
    nameError.value = ''
    hasAW.value = true
    Object.assign(pot1, makePot())
    Object.assign(pot2, makePot())
    activeMProp.value = 'dh'
    showAllMV.value = false
    const fresh = makeMTState()
    for (const prop of MULT_PROPS) {
      Object.assign(multTests[prop], fresh[prop])
    }
  }

  function showToast (msg) {
    toast.value = msg
    if (toastTimer) {
      clearTimeout(toastTimer)
    }
    toastTimer = setTimeout(() => {
      toast.value = null
    }, 2200)
  }

  function persistLibrary () {
    try {
      localStorage.setItem('alchemy_library_v1', JSON.stringify(library.value))
    } catch {}
  }

  function loadLibrary () {
    try {
      const raw = localStorage.getItem('alchemy_library_v1')
      if (raw) {
        library.value = JSON.parse(raw)
      } else {
        // Fresh install / cleared storage: seed with the built-in preset
        // instead of starting empty. Deep-cloned so later edits never
        // mutate the shared PRESET_INGREDIENTS constant, and persisted
        // immediately so it behaves like any normal saved library from
        // here on (fully editable/deletable).
        library.value = JSON.parse(JSON.stringify(PRESET_INGREDIENTS))
        persistLibrary()
      }
    } catch {}
  }

  function exportXLSX () {
    if (library.value.length === 0 || !window.XLSX) {
      return
    }
    const headers = ['Name', 'AW', 'APM', 'Lore', 'PDH', 'PHoT', 'PHL', 'PDP', 'PPoT', 'PPL', 'PAlc', 'DHM', 'HoTM', 'HLM', 'DPM', 'PoTM', 'PLM']
    const rows = library.value.map(i => [
      i.name, i.hasAW ? 1 : 0, i.skills.apm, i.skills.loreLevel,
      i.bases?.dh ?? 0, i.bases?.hot ?? 0, i.bases?.hl ?? 0, i.bases?.dp ?? 0, i.bases?.pot ?? 0, i.bases?.pl ?? 0, i.bases?.alc ?? 0,
      i.mvs?.dhm ?? 0, i.mvs?.hotm ?? 0, i.mvs?.hlm ?? 0, i.mvs?.dpm ?? 0, i.mvs?.potm ?? 0, i.mvs?.plm ?? 0,
    ])
    const ws = window.XLSX.utils.aoa_to_sheet([headers, ...rows])
    ws['!cols'] = [{ wch: 22 }, ...Array.from({ length: 16 }).fill({ wch: 9 })]
    const wb = window.XLSX.utils.book_new()
    window.XLSX.utils.book_append_sheet(wb, ws, 'Alchemy')
    window.XLSX.writeFile(wb, 'alchemy_ingredients.xlsx')
  }

  function importXLSX (file) {
    if (!file || !window.XLSX) {
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      try {
        const wb = window.XLSX.read(e.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = window.XLSX.utils.sheet_to_json(ws, { header: 1 })
        let added = 0
        for (let i = 1; i < data.length; i++) {
          const r = data[i]
          if (!r[0]) {
            continue
          }
          const toN = v => (!v || v === 0) ? null : +v
          const rec = {
            id: Date.now() + i,
            name: String(r[0]),
            hasAW: r[1] === 1,
            skills: { apm: r[2] ?? 100, loreLevel: r[3] ?? 100, loreType: 2 / 3, qualityBuff: false },
            bases: { dh: toN(r[4]), hot: toN(r[5]), hl: toN(r[6]), dp: toN(r[7]), pot: toN(r[8]), pl: toN(r[9]), alc: toN(r[10]) },
            selfMVs: {},
            mvs: { dhm: toN(r[11]), hotm: toN(r[12]), hlm: toN(r[13]), dpm: toN(r[14]), potm: toN(r[15]), plm: toN(r[16]) },
            createdAt: new Date().toISOString(),
          }
          const ei = library.value.findIndex(x => x.name.toLowerCase() === rec.name.toLowerCase())
          if (ei === -1) {
            library.value.push(rec)
          } else {
            library.value.splice(ei, 1, rec)
          }
          added++
        }
        persistLibrary()
        showToast(`Imported: ${added}`)
      } catch {
        showToast('Import failed')
      }
    })
    reader.readAsBinaryString(file)
  }

  return {
    step, isModalOpen, editingId, ingredientName, nameError, hasAW, skills,
    pot1, pot2, activeMProp, multTests, showAllMV,
    library, searchQuery, toast,
    A, L, QB,
    selfMVs, bases, previewBases, hasAnyBase, hasAnyInput, isEditNoRemeasure,
    activeTest, activeMVTable, detectedMVs, activeDetectedMV, detectedMVCount,
    filteredLibrary,
    computeMVTableForProp,
    validateAndNext,
    addPotion, removePotion, syncTestbedValues,
    openModal, closeModal,
    saveIngredient, deleteIngredient, resetWizard,
    loadLibrary, exportXLSX, importXLSX,
  }
}
