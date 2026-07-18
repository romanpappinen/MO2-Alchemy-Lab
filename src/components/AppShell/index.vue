<template>
  <div class="app-shell">
    <header class="app-switcher">
      <div class="app-switch-group">
        <button class="app-switch-btn" :class="{active: activeApp === 'alchemy'}" @click="activeApp = 'alchemy'">
          {{ t('nav.app.alchemy') }}
        </button>
        <button class="app-switch-btn" :class="{active: activeApp === 'craft'}" @click="activeApp = 'craft'">
          {{ t('nav.app.craft') }}
        </button>
      </div>

      <div class="lang-switch">
        <button class="lang-btn" :class="{active: locale==='ru'}" @click="setLocale('ru')">RU</button>
        <span class="lang-sep">·</span>
        <button class="lang-btn" :class="{active: locale==='en'}" @click="setLocale('en')">EN</button>
      </div>
    </header>

    <AlchemyLab v-if="activeApp === 'alchemy'" />
    <CraftCalc v-else />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import AlchemyLab from '@/components/AlchemyLab/index.vue'
  import CraftCalc from '@/components/CraftCalc/index.vue'
  import { useI18n } from '@/composables/useI18n.js'

  const { t, locale, setLocale } = useI18n()
  const activeApp = ref('alchemy')
</script>

<style scoped>
.app-switcher{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 12px;background:#0a0a0c;border-bottom:1px solid #232430;}
.app-switch-group{display:flex;gap:2px;}
.app-switch-btn{padding:8px 16px;background:transparent;border:none;border-radius:6px 6px 0 0;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;color:#7a7a8c;transition:all .15s;letter-spacing:.02em;}
.app-switch-btn:hover{color:#d0d0e0;background:rgba(255,255,255,.03);}
.app-switch-btn.active{color:#e8b84b;background:rgba(200,146,42,.12);}

.lang-switch{display:flex;align-items:center;gap:4px;background:#151620;border:1px solid #232430;border-radius:7px;padding:3px 4px;flex-shrink:0;}
.lang-sep{color:#4a4c5e;font-size:11px;}
.lang-btn{background:transparent;border:none;cursor:pointer;font-size:12px;font-weight:500;font-family:'JetBrains Mono','Fira Code',monospace;color:#7a7a8c;padding:3px 8px;border-radius:5px;transition:all .15s;}
.lang-btn:hover{color:#d0d0e0;}
.lang-btn.active{background:rgba(200,146,42,.15);color:#e8b84b;}
</style>
