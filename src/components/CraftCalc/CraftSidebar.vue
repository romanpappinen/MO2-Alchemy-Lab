<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">{{ t('craft.sidebarLogo') }}</div>
      <div class="sidebar-title">{{ t('craft.sidebarTitle') }}</div>
    </div>
    <nav class="sidebar-nav">
      <div class="nav-label">{{ t('craft.metals') }}</div>
      <div
        v-for="m in metals" :key="m.id" class="nav-item"
        :class="{active: currentMetal === m.id}" @click="currentMetal = m.id"
      >
        <div class="nav-dot"></div>{{ m.name }}
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="preset-label">{{ t('craft.settings') }}</div>
      <button class="preset-btn save" @click="onSave">{{ t('craft.savePreset') }}</button>
      <button class="preset-btn load" @click="onLoad">{{ t('craft.loadPreset') }}</button>
    </div>

    <div class="bonus-section">
      <div class="bonus-label-main">{{ t('craft.perks') }}</div>
      <div class="bonus-item">
        <label class="bonus-item-label" :class="{active: bonuses.ironmaster}">
          <input v-model="bonuses.ironmaster" type="checkbox"/>
          Ironmaster
          <span v-if="bonuses.ironmaster" class="bonus-badge">+3%</span>
        </label>
        <div class="bonus-sub">{{ t('craft.ironmasterHint') }}</div>
      </div>
      <div class="bonus-item">
        <label class="bonus-item-label" :class="{active: bonuses.extractBonus > 0}">
          <input
            type="checkbox" :checked="bonuses.extractBonus > 0"
            @change="bonuses.extractBonus = $event.target.checked ? 3 : 0"
          />
          Metallurgist
        </label>
        <div class="bonus-sub bonus-sub-tight">{{ t('craft.metallurgistHint') }}</div>
        <div v-if="bonuses.extractBonus > 0" class="bonus-seg">
          <button
            class="bonus-seg-btn" :class="{active: bonuses.extractBonus === 3}"
            @click="bonuses.extractBonus = 3"
          >+3%</button>
          <button
            class="bonus-seg-btn" :class="{active: bonuses.extractBonus === 6}"
            @click="bonuses.extractBonus = 6"
          >+6%</button>
          <button
            class="bonus-seg-btn" :class="{active: bonuses.extractBonus === 9}"
            @click="bonuses.extractBonus = 9"
          >+9%</button>
        </div>
      </div>
    </div>

    <div class="price-section">
      <div class="price-label-main">
        {{ t('craft.orePrices') }}
        <label class="price-toggle">
          <input v-model="priceMode.absolute" type="checkbox"/>
          {{ priceMode.absolute ? t('craft.priceModeSum') : t('craft.priceModePct') }}
        </label>
      </div>
      <div v-for="ore in oreList" :key="ore.key" class="price-row">
        <span class="price-row-label">{{ ore.label }}</span>
        <input v-model.number="prices[ore.key]" class="price-input" type="number" min="0" placeholder="0"/>
        <span class="price-tag">{{ t('craft.per10k') }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
  import { useI18n } from '@/composables/useI18n.js'
  import { useCraftCalc } from '@/composables/useCraftCalc.js'

  const { t } = useI18n()
  const { currentMetal, metals, bonuses, prices, priceMode, oreList, savePreset, loadPreset } = useCraftCalc()

  function onSave () {
    savePreset(t('craft.presetSaved'))
  }
  function onLoad () {
    loadPreset(t('craft.presetLoaded'), t('craft.presetNone'), t('craft.presetError'))
  }
</script>

<style scoped>
.bonus-sub{font-size:11px;color:var(--craft-text3);margin-left:20px;}
.bonus-sub-tight{margin-bottom:5px;}
</style>
