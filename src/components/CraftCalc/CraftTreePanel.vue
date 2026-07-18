<template>
  <div class="tree-panel">
    <div class="hero-card">
      <div class="hero-name">{{ metal.name }}</div>
      <div class="hero-amount">{{ fmt(result.target) }}</div>
      <div class="hero-sub">{{ t('craft.runsInFurnace', { n: fmtDec(result.runs) }) }}</div>
    </div>

    <div v-if="costData.total > 0" class="cost-card">
      <div class="cost-card-title">{{ t('craft.costTitle', { amount: fmt(result.target), metal: metal.name }) }}</div>

      <template v-if="priceMode.absolute">
        <div v-for="row in costData.rows" :key="row.key" class="cost-row">
          <span class="cost-row-name">{{ row.label }}</span>
          <span class="cost-row-qty">{{ fmt(row.qty) }}</span>
          <span class="cost-row-x">×</span>
          <span class="cost-row-price">{{ row.price }}/10k</span>
          <span class="cost-row-eq">=</span>
          <span class="cost-row-total">{{ fmt(row.cost) }}</span>
        </div>
        <div class="cost-divider"></div>
        <div class="cost-final">
          <span class="cost-final-label">{{ t('craft.total') }}</span>
          <span class="cost-final-val">{{ fmt(costData.total) }} g</span>
        </div>
        <div class="cost-per-unit">
          {{ t('craft.perUnit', { v: fmtDec(costData.total / result.target), metal: metal.name }) }}
        </div>
      </template>

      <template v-else>
        <div class="cost-pct-bar">
          <div
            v-for="row in costData.rows" :key="row.key" class="cost-pct-seg"
            :style="{width: row.pct + '%', background: row.color}"
          ></div>
        </div>
        <div v-for="row in costData.rows" :key="row.key" class="cost-pct-row">
          <div class="cost-pct-dot" :style="{background: row.color}"></div>
          <span class="cost-pct-name">{{ row.label }}</span>
          <span class="cost-pct-val">{{ row.pct.toFixed(1) }}%</span>
          <span class="cost-pct-val cost-pct-cost">{{ fmt(row.cost) }} g</span>
        </div>
        <div class="cost-divider"></div>
        <div class="cost-final">
          <span class="cost-final-label">{{ t('craft.total') }}</span>
          <span class="cost-final-val">{{ fmt(costData.total) }} g</span>
        </div>
      </template>
    </div>

    <div class="tree-card">
      <div class="tree-card-header">{{ t('craft.materialTree') }}</div>
      <div class="tree-body">
        <template v-for="(node, i) in result.tree" :key="i">
          <div v-if="node.divider" class="tree-divider"></div>
          <div v-else class="tree-node-row">
            <span class="tree-prefix">{{ node.prefix }}</span>
            <span class="tree-name" :class="node.cls">{{ node.name }}</span>
            <span v-if="node.tag" class="tree-tag" :class="'tag-' + node.tag">{{ node.tagLabel }}</span>
            <span
              v-if="node.cls !== 'tree-section' && node.amount" class="tree-amount" :class="node.cls"
            >{{ fmt(node.amount) }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from '@/composables/useI18n.js'
  import { useCraftCalc } from '@/composables/useCraftCalc.js'

  const { t } = useI18n()
  const { metal, result, costData, priceMode, fmt, fmtDec } = useCraftCalc()
</script>

<style scoped>
.cost-per-unit{font-size:11px;color:var(--craft-text3);margin-top:4px;}
.cost-pct-cost{margin-left:8px;color:var(--craft-green);}
</style>
