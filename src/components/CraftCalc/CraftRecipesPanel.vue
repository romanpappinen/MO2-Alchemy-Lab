<template>
  <div class="recipes-panel">
    <div v-for="step in metal.steps" :key="step.id" class="recipe-card">
      <div class="recipe-card-header">
        <span class="recipe-card-title">{{ step.label }}</span>
        <span class="recipe-card-furnace">{{ getSelected(step).furnace }}</span>
      </div>
      <div class="recipe-options">
        <div
          v-for="(opt, idx) in step.options" :key="idx" class="recipe-opt"
          :class="{selected: getSelIdx(step.id) === idx}" @click="select(step.id, idx)"
        >
          <div class="recipe-opt-radio"><div class="recipe-opt-radio-dot"></div></div>
          <div class="recipe-opt-info">
            <div class="recipe-opt-name">{{ opt.label }}</div>
            <div class="recipe-opt-detail">{{ opt.furnace }} · {{ opt.input }}</div>
          </div>
          <span v-if="isBestOpt(step, idx)" class="best-badge">{{ t('craft.best') }}</span>
          <span class="recipe-opt-yield">{{ (opt.yield || 0).toLocaleString('ru') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from '@/composables/useI18n.js'
  import { useCraftCalc } from '@/composables/useCraftCalc.js'

  const { t } = useI18n()
  const { metal, getSelIdx, getSelected, select, isBestOpt } = useCraftCalc()
</script>
