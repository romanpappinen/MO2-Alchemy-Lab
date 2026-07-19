<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isPotionModalOpen" class="overlay" @mousedown.self="closePotionModal">
        <Transition name="modal">
          <div v-if="isPotionModalOpen" class="modal" role="dialog">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="modal-title">{{ editingPotionId ? t('pm.editTitle') : t('pm.newTitle') }}</span>
                <span v-if="recipe.name" class="modal-chip">{{ recipe.name }}</span>
              </div>
              <button class="close-btn" @click="closePotionModal">✕</button>
            </div>

            <div class="modal-body">
              <div class="layout">
                <!-- ── Editor ── -->
                <div class="editor">
                  <div class="card" style="margin-bottom:10px">
                    <div class="card-title">{{ editingPotionId ? t('pm.editTitle') : t('pm.newTitle') }}</div>
                    <div class="grid-3">
                      <div class="field" style="grid-column:1/-1">
                        <label class="lbl">{{ t('pm.recipeName') }}</label>
                        <input
                            v-model.trim="recipe.name"
                            :class="['input-text',{'has-err':nameError}]"
                            :placeholder="t('pm.recipePH')"
                            type="text"
                            @input="nameError=''"
                        >
                        <p v-if="nameError" class="err">{{ nameError }}</p>
                      </div>
                      <div class="field">
                        <label class="lbl">{{ t('pm.vial') }}</label>
                        <select v-model="recipe.vialType">
                          <option v-for="v in VIAL_TYPES" :key="v.id" :value="v.id">{{ v.label }} ({{ v.maxPU }} PU)</option>
                        </select>
                      </div>
                      <div class="field">
                        <label class="lbl">{{ t('pm.thirst') }}</label>
                        <input v-model.number="recipe.thirst" max="30" min="1" type="number">
                        <p class="hint">{{ t('pm.thirstHint') }}</p>
                      </div>
                      <div class="field">
                        <label class="lbl">APM</label>
                        <div class="range-row">
                          <input
                              v-model.number="recipe.apm"
                              max="100"
                              min="0"
                              step="1"
                              type="range"
                          >
                          <span class="range-val">{{ recipe.apm }}</span>
                        </div>
                        <p class="hint">{{ t('pm.apmHint', { val: (1+0.2*recipe.apm/100).toFixed(3) }) }}</p>
                      </div>
                    </div>
                    <label class="chk-item" style="margin-top:8px">
                      <input v-model="recipe.alvarin" type="checkbox">
                      {{ t('pm.alvarin') }}
                    </label>
                    <label class="chk-item" style="margin-top:6px">
                      <input v-model="recipe.qualityBuff" type="checkbox">
                      {{ t('s1.qualityBuff', { val: recipe.qualityBuff ? '1.03' : '1.00' }) }}
                    </label>
                  </div>

                  <div class="card">
                    <div class="card-title">{{ t('pm.ingredients') }}</div>
                    <p class="hint" style="margin-bottom:10px">{{ t('pm.ingHint') }}</p>

                    <div class="ing-header">
                      <span class="slbl">{{ t('pm.ingCol') }}</span>
                      <span class="slbl" style="text-align:right">{{ t('pm.countCol') }}</span>
                      <span class="slbl" style="text-align:center">AW</span>
                      <span />
                    </div>

                    <div v-for="line in recipe.lines" :key="line.id" class="ing-row">
                      <div class="ing-select-wrap">
                        <select
                            :class="{'sel-empty':!line.ingredient}"
                            :value="line.ingredient ? String(line.ingredient.id) : ''"
                            @change="onPickIngredient(line, $event.target.value)"
                        >
                          <option value="">{{ t('pm.selectIng') }}</option>
                          <!-- Always show the ingredient actually embedded in this
                               line as its own option, keyed by its own id —
                               guarantees the <select> displays it correctly no
                               matter what the current library contains, without
                               ever changing the calc data. Primitive (string) id
                               matching avoids the timing/identity pitfalls of
                               binding <option> values to whole objects. -->
                          <option v-if="line.ingredient" :value="String(line.ingredient.id)">
                            {{ line.ingredient.name }}
                          </option>
                          <option v-for="ing in availableFor(line.id)" :key="ing.id" :value="String(ing.id)">{{ ing.name }}</option>
                        </select>
                      </div>
                      <input
                          v-model.number="line.count"
                          class="count-input"
                          min="1"
                          step="1"
                          type="number"
                      >
                      <div class="aw-cell">
                        <span v-if="line.ingredient" class="aw-badge" :class="line.ingredient.hasAW?'aw1':'aw0'">{{ line.ingredient.hasAW?1:0 }}</span>
                        <span v-else class="aw-badge aw-empty">—</span>
                      </div>
                      <button class="del-btn" :disabled="recipe.lines.length<=1" @click="removeLine(line.id)">×</button>
                    </div>

                    <!-- Max 16 indicator -->
                    <div class="ing-footer">
                      <button class="add-line-btn" :disabled="recipe.lines.length>=16" @click="addLine">
                        {{ t('pm.addLine') }}
                      </button>
                      <span class="ing-counter" :class="{ 'counter-max': recipe.lines.length>=16 }">
                        {{ recipe.lines.length }}/16
                        <span v-if="recipe.lines.length>=16" class="counter-warn">— {{ t('pm.maxLines') }}</span>
                      </span>
                    </div>

                    <div v-if="calculation" class="aw-summary">
                      <span>AW = {{ calculation.totalAW }}</span>
                      <span class="dot">·</span>
                      <span>{{ calculation.PU }} / {{ calculation.vialMax }} PU</span>
                      <span class="dot">·</span>
                      <span :class="{'text-warn':!calculation.isFull}">
                        {{ calculation.isFull ? t('pm.awSummaryFull') : t('pm.awSummaryPart') }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- ── Results ── -->
                <div class="results">
                  <div class="card results-card">
                    <div class="card-title">{{ t('pm.resultTitle') }}</div>
                    <div v-if="!calculation" class="results-empty">{{ t('pm.resultEmpty') }}</div>
                    <template v-else>
                      <div class="pu-row">
                        <div class="pu-cell">
                          <p class="pu-lbl">{{ t('pm.puInVial') }}</p>
                          <p class="pu-val">{{ calculation.PU }}</p>
                        </div>
                        <div class="pu-cell">
                          <p class="pu-lbl">{{ t('pm.puPerGulp') }}</p>
                          <p class="pu-val accent">{{ calculation.PUDrunk }}</p>
                        </div>
                      </div>
                      <div class="hr" />
                      <p class="prop-section-lbl heal">{{ t('pm.healing') }}</p>
                      <div class="prop-rows">
                        <PropRow
                            v-for="p in HEAL_PROPS"
                            :key="p"
                            :per-gulp="calculation.gulp[p]"
                            :per-pu="calculation.props[p]"
                            :prop="p"
                        />
                      </div>
                      <div class="hr" />
                      <p class="prop-section-lbl poison">{{ t('pm.poison') }}</p>
                      <div class="prop-rows">
                        <PropRow
                            v-for="p in POISON_PROPS"
                            :key="p"
                            :per-gulp="calculation.gulp[p]"
                            :per-pu="calculation.props[p]"
                            :prop="p"
                        />
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-ghost" @click="closePotionModal">{{ t('common.cancel') }}</button>
              <div class="footer-right">
                <button v-if="editingPotionId" class="btn btn-outline" @click="saveAsCopy">{{ t('pm.saveCopy') }}</button>
                <button class="btn btn-primary" @click="savePotion">
                  {{ editingPotionId ? t('pm.saveChanges') : t('pm.saveRecipe') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { VIAL_TYPES } from '@/composables/potionCalc.js'
import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
import { useI18n } from '@/composables/useI18n.js'
import { usePotionStore } from '@/composables/usePotionStore.js'
import PropRow from './PropRow.vue'

const HEAL_PROPS = ['dh', 'hot', 'hl']
const POISON_PROPS = ['dp', 'pot', 'pl']

const { t } = useI18n()
const { isPotionModalOpen, editingPotionId, recipe, nameError, calculation,
  closePotionModal, addLine, removeLine, savePotion, saveAsCopy } = usePotionStore()
const { library } = useAlchemyStore()

// Explicit, controlled handler for the ingredient <select> — deliberately
// not v-model, since v-model bound to whole objects on a <select> whose
// options list is simultaneously changing (availableFor excludes
// whatever is picked) can race and leave the DOM out of sync. Matching
// by primitive id string avoids that entirely.
function onPickIngredient (line, idStr) {
  if (!idStr) {
    line.ingredient = null
    return
  }
  const id = Number(idStr)
  line.ingredient = library.value.find(i => i.id === id) ?? line.ingredient
}

// Ingredients not already used by ANY line — the current line's own
// selection is always shown separately via its own dedicated option
// above, bound to the exact embedded object, so it doesn't need to (and
// must not, to avoid silently swapping the calc data) appear here too.
// Matched by NAME (not id): an old recipe's embedded ingredient can have
// a different id than the current library's entry for the same-named
// ingredient (library drift/reseed) — matching by id would then fail to
// exclude it and let the same ingredient show up twice.
function availableFor (lineId) { // eslint-disable-line no-unused-vars
  const selectedNames = new Set(
      recipe.lines
          .filter(l => l.ingredient !== null)
          .map(l => l.ingredient.name.trim().toLowerCase()),
  )
  return library.value.filter(i => !selectedNames.has(i.name.trim().toLowerCase()))
}
</script>

<style scoped>
.overlay{position:fixed;inset:0;background:rgba(8,9,20,.75);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:28px 16px;overflow-y:auto}
.modal{background:var(--s1);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:980px;flex-shrink:0;box-shadow:0 24px 64px rgba(0,0,0,.5);display:flex;flex-direction:column}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 14px;border-bottom:1px solid var(--border);gap:12px;flex-shrink:0}
.modal-title-wrap{display:flex;align-items:center;gap:10px;min-width:0}
.modal-title{font-size:15px;font-weight:600;color:var(--text)}
.modal-chip{font-size:12px;color:var(--accent2);background:var(--accent-glow);border:1px solid rgba(107,94,247,.25);border-radius:5px;padding:2px 8px;font-family:var(--mono);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.close-btn{background:none;border:1px solid var(--border);border-radius:6px;color:var(--muted);cursor:pointer;font-size:13px;padding:4px 9px;transition:.15s}
.close-btn:hover{border-color:var(--danger);color:var(--danger)}
.modal-body{padding:16px 20px;overflow-y:auto}
.layout{display:grid;grid-template-columns:1fr 280px;gap:14px;align-items:start}
.editor{display:flex;flex-direction:column;gap:10px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.range-row{display:flex;align-items:center;gap:8px;margin-top:2px}
.range-row input{flex:1}
.range-val{min-width:30px;text-align:right;font-family:var(--mono);font-size:13px;font-weight:500;color:var(--accent2)}
.chk-item{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;color:var(--muted)}
.chk-item input{accent-color:var(--accent);width:14px;height:14px}
.ing-header{display:grid;grid-template-columns:1fr 70px 36px 28px;gap:6px;margin-bottom:4px}
.slbl{font-size:10px;color:var(--muted)}
.ing-row{display:grid;grid-template-columns:1fr 70px 36px 28px;gap:6px;align-items:center;margin-bottom:6px}
.ing-select-wrap select{padding:7px 8px;font-size:13px}
.sel-empty{color:var(--dim)}
.count-input{background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--mono);font-size:14px;font-weight:500;padding:6px 7px;text-align:right;width:100%;outline:none;transition:border .15s}
.count-input:focus{border-color:var(--accent)}
.aw-cell{display:flex;justify-content:center;align-items:center}
.aw-badge{font-size:11px;font-family:var(--mono);font-weight:600;padding:2px 6px;border-radius:4px}
.aw1{background:rgba(56,201,116,.12);color:var(--success);border:1px solid rgba(56,201,116,.25)}
.aw0{background:var(--s3);color:var(--dim);border:1px solid var(--border)}
.aw-empty{background:transparent;color:var(--dim)}
.del-btn{background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--muted);font-size:14px;padding:0 7px;height:32px;transition:.15s}
.del-btn:hover:not(:disabled){border-color:var(--danger);color:var(--danger)}
.del-btn:disabled{opacity:.25;cursor:default}
.ing-footer{display:flex;align-items:center;gap:10px;margin-top:6px;flex-wrap:wrap}
.add-line-btn{padding:5px 14px;border:1px solid var(--border2);border-radius:6px;background:transparent;color:var(--muted);cursor:pointer;font-size:12px;font-family:var(--ui);transition:.15s}
.add-line-btn:hover:not(:disabled){color:var(--accent2);border-color:var(--accent)}
.add-line-btn:disabled{opacity:.35;cursor:not-allowed}
.ing-counter{font-size:11px;font-family:var(--mono);color:var(--dim)}
.ing-counter.counter-max{color:var(--warn)}
.counter-warn{font-family:var(--ui)}
.aw-summary{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
.dot{color:var(--dim)}
.text-warn{color:var(--warn)}
.results-card{position:sticky;top:0}
.results-empty{text-align:center;padding:32px 10px;font-size:12px;color:var(--dim)}
.pu-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.pu-cell{background:var(--s3);border-radius:7px;padding:9px 12px}
.pu-lbl{font-size:10px;color:var(--dim);margin-bottom:3px;text-transform:uppercase;letter-spacing:.05em}
.pu-val{font-size:22px;font-weight:500;font-family:var(--mono);color:var(--text)}
.pu-val.accent{color:var(--accent2)}
.hr{height:1px;background:var(--border);margin:10px 0}
.prop-section-lbl{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}
.prop-section-lbl.heal{color:var(--success)}.prop-section-lbl.poison{color:var(--danger)}
.prop-rows{display:flex;flex-direction:column;gap:4px;margin-bottom:4px}
.modal-footer{display:flex;justify-content:space-between;align-items:center;padding:14px 20px;border-top:1px solid var(--border);flex-shrink:0}
.footer-right{display:flex;gap:8px}
.overlay-enter-active,.overlay-leave-active{transition:opacity .2s}
.overlay-enter-from,.overlay-leave-to{opacity:0}
.modal-enter-active,.modal-leave-active{transition:opacity .2s,transform .2s}
.modal-enter-from,.modal-leave-to{opacity:0;transform:translateY(-10px)}
</style>