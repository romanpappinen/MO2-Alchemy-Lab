<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isModalOpen" class="overlay" @mousedown.self="closeModal">
        <Transition name="modal">
          <div v-if="isModalOpen" aria-modal="true" class="modal" role="dialog">
            <div class="modal-header">
              <div class="modal-title-wrap">
                <span class="modal-title">
                  {{ editingId ? t('wizard.editIngredient') : (step===1 ? t('wizard.newIngredient') : step===2 ? t('wizard.step2') : t('wizard.step3')) }}
                </span>
                <span v-if="ingredientName && (step>1||editingId)" class="modal-ing-name">{{ ingredientName }}</span>
              </div>
              <button class="close-btn" @click="closeModal">✕</button>
            </div>
            <div class="modal-progress">
              <WizardProgress :current-step="step" :detected-m-v-count="detectedMVCount" :ingredient-name="ingredientName" />
            </div>
            <div class="modal-body">
              <Transition mode="out-in" name="step">
                <Step1Base v-if="step===1" key="s1" />
                <Step2Multipliers v-else-if="step===2" key="s2" />
                <Step3Review v-else-if="step===3" key="s3" />
              </Transition>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'
  import Step1Base from './Step1Base.vue'
  import Step2Multipliers from './Step2Multipliers.vue'
  import Step3Review from './Step3Review.vue'
  import WizardProgress from './WizardProgress.vue'

  const { t } = useI18n()
  const { isModalOpen, step, ingredientName, detectedMVCount, editingId, closeModal } = useAlchemyStore()
</script>

<style scoped>
.overlay{position:fixed;inset:0;background:rgba(8,9,20,.75);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:flex-start;justify-content:center;padding:32px 16px;overflow-y:auto}
.modal{background:var(--s1);border:1px solid var(--border2);border-radius:14px;width:100%;max-width:820px;flex-shrink:0;box-shadow:0 24px 64px rgba(0,0,0,.5)}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 14px;border-bottom:1px solid var(--border);gap:12px}
.modal-title-wrap{display:flex;align-items:center;gap:10px;min-width:0}
.modal-title{font-size:15px;font-weight:600;color:var(--text);white-space:nowrap}
.modal-ing-name{font-size:12px;color:var(--accent2);background:var(--accent-glow);border:1px solid rgba(107,94,247,.25);border-radius:5px;padding:2px 8px;font-family:var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
.close-btn{background:none;border:1px solid var(--border);border-radius:6px;color:var(--muted);cursor:pointer;font-size:13px;padding:4px 9px;transition:.15s;flex-shrink:0}
.close-btn:hover{border-color:var(--danger);color:var(--danger)}
.modal-progress{padding:16px 20px 0}
.modal-body{padding:16px 20px 20px}
.overlay-enter-active,.overlay-leave-active{transition:opacity .2s}
.overlay-enter-from,.overlay-leave-to{opacity:0}
.modal-enter-active,.modal-leave-active{transition:opacity .2s,transform .2s}
.modal-enter-from,.modal-leave-to{opacity:0;transform:translateY(-12px)}
.step-enter-active,.step-leave-active{transition:opacity .15s,transform .15s}
.step-enter-from{opacity:0;transform:translateX(10px)}
.step-leave-to{opacity:0;transform:translateX(-10px)}
</style>
