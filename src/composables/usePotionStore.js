import { computed, reactive, ref } from 'vue'
import { calcPotion, perGulp, VIAL_TYPES } from './potionCalc.js'

const isPotionModalOpen = ref(false)
const editingPotionId = ref(/** @type {number|null} */ (null))

const recipe = reactive({
  name: '',
  vialType: 'minor', // 'minor' | 'medium'
  thirst: 10, // PU per gulp
  apm: 100,
  alvarin: false, // +10% PU clade
  qualityBuff: false, // +3% quality buff
  lines: /** @type {Array<{id:number, ingredient:object|null, count:number}>} */ ([]),
})

const nameError = ref('')
const potionList = ref(/** @type {Array} */ ([]))

let lineId = 0

export function usePotionStore () {
  const validLines = computed(() =>
    recipe.lines.filter(l => l.ingredient !== null && l.count > 0),
  )

  const calculation = computed(() => {
    if (validLines.value.length === 0) {
      return null
    }
    const QB = recipe.qualityBuff ? 1.03 : 1
    const base = calcPotion(validLines.value, recipe.apm, QB)
    // Alvarin clade: +10% PU rounded down
    const PU = recipe.alvarin ? Math.floor(base.PU * 1.1) : base.PU
    const vial = VIAL_TYPES.find(v => v.id === recipe.vialType) ?? VIAL_TYPES[0]
    const PUFinal = Math.min(PU, vial.maxPU)
    const PUDrunk = Math.min(recipe.thirst, PUFinal)
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
  })

  function openPotionModal (id = null) {
    _resetRecipe()
    if (id !== null) {
      const rec = potionList.value.find(r => r.id === id)
      if (rec) {
        _populateRecipe(rec)
      }
      editingPotionId.value = id
    }
    isPotionModalOpen.value = true
  }

  function closePotionModal () {
    isPotionModalOpen.value = false
    _resetRecipe()
  }

  function _resetRecipe () {
    recipe.name = ''
    recipe.vialType = 'minor'
    recipe.thirst = 10
    recipe.apm = 100
    recipe.alvarin = false
    recipe.qualityBuff = false
    recipe.lines = [_makeLine()]
    nameError.value = ''
    editingPotionId.value = null
  }

  function _populateRecipe (rec) {
    recipe.name = rec.name
    recipe.vialType = rec.vialType ?? 'minor'
    recipe.thirst = rec.thirst ?? 10
    recipe.apm = rec.apm ?? 100
    recipe.alvarin = rec.alvarin ?? false
    recipe.qualityBuff = rec.qualityBuff ?? false
    recipe.lines = rec.lines.map(l => ({ ...l, id: lineId++ }))
  }

  function _makeLine () {
    return { id: lineId++, ingredient: null, count: 1 }
  }

  function addLine () {
    if (recipe.lines.length >= 16) {
      return
    }
    recipe.lines.push(_makeLine())
  }

  function removeLine (id) {
    if (recipe.lines.length <= 1) {
      return
    }
    const idx = recipe.lines.findIndex(l => l.id === id)
    if (idx !== -1) {
      recipe.lines.splice(idx, 1)
    }
  }

  function setIngredient (lineId, ingredient) {
    const line = recipe.lines.find(l => l.id === lineId)
    if (line) {
      line.ingredient = ingredient
    }
  }

  function validate () {
    nameError.value = ''
    if (recipe.name.trim()) {
      if (validLines.value.length === 0) {
        nameError.value = 'Add at least one ingredient'
        return false
      }
      return true
    } else {
      nameError.value = 'Enter recipe name'
      return false
    }
  }

  function _buildRecord (id) {
    return {
      id,
      name: recipe.name.trim(),
      vialType: recipe.vialType,
      thirst: recipe.thirst,
      apm: recipe.apm,
      alvarin: recipe.alvarin,
      qualityBuff: recipe.qualityBuff,
      lines: recipe.lines
        .filter(l => l.ingredient !== null && l.count > 0)
        .map(l => ({ ingredient: l.ingredient, count: l.count })),
      calc: calculation.value ? { ...calculation.value } : null,
      savedAt: new Date().toISOString(),
    }
  }

  function savePotion () {
    if (!validate()) {
      return
    }
    const id = editingPotionId.value ?? Date.now()
    const rec = _buildRecord(id)
    const idx = potionList.value.findIndex(r => r.id === id)
    if (idx === -1) {
      potionList.value.unshift(rec)
    } else {
      potionList.value.splice(idx, 1, rec)
    }
    _persist()
    closePotionModal()
    return 'saved'
  }

  function saveAsCopy () {
    if (!validate()) {
      return
    }
    const rec = _buildRecord(Date.now())
    rec.name = rec.name + ' (copy)'
    potionList.value.unshift(rec)
    _persist()
    closePotionModal()
    return 'copy'
  }

  function deletePotion (id) {
    potionList.value = potionList.value.filter(r => r.id !== id)
    _persist()
  }

  function _persist () {
    try {
      localStorage.setItem('alchemy_potions_v1', JSON.stringify(potionList.value))
    } catch {}
  }

  function loadPotions () {
    try {
      const raw = localStorage.getItem('alchemy_potions_v1')
      if (raw) {
        const stored = JSON.parse(raw)
        // The app used to seed a built-in example recipe on first load
        // (marked preset:true). It has been removed — drop unedited seeded
        // copies from returning visitors too. Saving/editing rebuilds the
        // record without the flag, so user-modified copies are kept.
        potionList.value = stored.filter(r => !r.preset)
        if (potionList.value.length !== stored.length) {
          _persist()
        }
      }
    } catch {}
    if (recipe.lines.length === 0) {
      _resetRecipe()
    }
  }

  return {
    isPotionModalOpen, editingPotionId,
    recipe, nameError,
    potionList, validLines, calculation,
    openPotionModal, closePotionModal,
    addLine, removeLine, setIngredient,
    savePotion, saveAsCopy, deletePotion,
    loadPotions,
  }
}
