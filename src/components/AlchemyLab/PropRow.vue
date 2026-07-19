<template>
  <div class="prop-row">
    <span class="prop-label">{{ PROP_LABELS[prop].label }}</span>
    <span class="prop-per-pu" :class="valCls(perPu)">{{ fmt(perPu) }}</span>
    <span class="prop-sep">{{ t('pm.perPu') }}</span>
    <template v-if="!isFlat">
      <span class="prop-arrow">→</span>
      <span class="prop-gulp" :class="valCls(perGulp)">{{ fmt(perGulp) }}</span>
      <span class="prop-sep-gulp">{{ t('pm.perGulp') }}</span>
    </template>
    <template v-else>
      <span class="prop-flat-note">{{ t('pm.flatProp') }}</span>
    </template>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { PROP_LABELS } from '@/composables/potionCalc.js'
  import { useI18n } from '@/composables/useI18n.js'

  const { t } = useI18n()

  const props = defineProps({
    prop: { type: String, required: true },
    perPu: { type: Number, default: 0 },
    perGulp: { type: Number, default: 0 },
  })

  const isFlat = computed(() => props.prop === 'hl' || props.prop === 'pl')

  function fmt (v) {
    return (!v || v === 0) ? '—' : (+v).toFixed(3)
  }
  function valCls (v) {
    if (!v || v === 0) return 'dim'
    return v > 0 ? (PROP_LABELS[props.prop].heal ? 'pos' : 'neg') : 'dim'
  }
</script>

<style scoped>
.prop-row { display:flex;align-items:center;gap:5px;padding:5px 8px;border-radius:6px;background:var(--s3);font-size:12px }
.prop-label { min-width:32px;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.04em }
.prop-per-pu { min-width:52px;font-family:var(--mono);font-size:13px;font-weight:500;text-align:right }
.prop-sep { font-size:10px;color:var(--dim) }
.prop-arrow { font-size:10px;color:var(--dim);margin:0 1px }
.prop-gulp { min-width:52px;font-family:var(--mono);font-size:14px;font-weight:600;text-align:right }
.prop-sep-gulp { font-size:10px;color:var(--dim);margin-left:2px }
.prop-flat-note { font-size:10px;color:var(--dim);margin-left:4px;font-style:italic }
.pos { color:var(--success) }
.neg { color:var(--danger) }
.dim { color:var(--dim) }
</style>
