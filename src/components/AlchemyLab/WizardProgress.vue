<template>
  <div class="wizard-progress">
    <template v-for="(s, idx) in resolvedSteps" :key="s.id">
      <div class="wp-step" :class="{ 'is-last': idx === resolvedSteps.length - 1 }">
        <div class="wp-circle" :class="circleClass(s.id)">
          {{ currentStep > s.id ? '✓' : s.id }}
        </div>
        <div class="wp-info">
          <p class="wp-label" :class="{ active: currentStep === s.id }">{{ s.label }}</p>
          <p class="wp-sub">{{ s.sub }}</p>
        </div>
      </div>
      <div v-if="idx < resolvedSteps.length - 1" class="wp-line" :class="{ done: currentStep > s.id }" />
    </template>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from '@/composables/useI18n.js'

  const { t } = useI18n()

  const props = defineProps({
    currentStep: { type: Number, required: true },
    ingredientName: { type: String, default: '' },
    detectedMVCount: { type: Number, default: 0 },
  })

  const resolvedSteps = computed(() => [
    { id: 1, label: t('wizard.step1'), sub: props.ingredientName || t('wizard.step1sub') },
    { id: 2, label: t('wizard.step2'), sub: `${props.detectedMVCount}/6 ${t('wizard.found')}` },
    { id: 3, label: t('wizard.step3'), sub: t('wizard.step3sub') },
  ])

  function circleClass (id) {
    if (props.currentStep > id) return 'done'
    if (props.currentStep === id) return 'active'
    return ''
  }
</script>

<style scoped>
.wizard-progress { display: flex; align-items: center; margin-bottom: 28px }
.wp-step { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0 }
.wp-step.is-last { flex: 0; min-width: auto }
.wp-circle {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1.5px solid var(--border); background: var(--s1);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 500; font-family: var(--mono);
  color: var(--dim); flex-shrink: 0; transition: all .25s;
}
.wp-circle.active { border-color: var(--accent); color: var(--accent2); background: var(--accent-glow); box-shadow: 0 0 0 4px rgba(107,94,247,.08) }
.wp-circle.done   { border-color: var(--success); color: var(--success); background: var(--success-bg) }
.wp-info { min-width: 0; overflow: hidden }
.wp-label { font-size: 12px; font-weight: 500; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color .2s }
.wp-label.active { color: var(--text) }
.wp-sub { font-size: 10px; color: var(--dim); font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
.wp-line { flex: 1; height: 1px; background: var(--border); margin: 0 10px; transition: background .3s }
.wp-line.done { background: var(--success) }
</style>
