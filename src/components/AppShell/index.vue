<template>
  <div class="app-shell">
    <header class="app-switcher">
      <button class="app-switch-btn" :class="{active: activeApp === 'alchemy'}" @click="activeApp = 'alchemy'">
        {{ t('nav.app.alchemy') }}
      </button>
      <button class="app-switch-btn" :class="{active: activeApp === 'craft'}" @click="activeApp = 'craft'">
        {{ t('nav.app.craft') }}
      </button>
    </header>

    <AlchemyLab v-if="activeApp === 'alchemy'" />
    <CraftCalc v-else />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useI18n } from '@/composables/useI18n.js'
  import AlchemyLab from '@/components/AlchemyLab/index.vue'
  import CraftCalc from '@/components/CraftCalc/index.vue'

  const { t } = useI18n()
  const activeApp = ref('alchemy')
</script>

<style scoped>
.app-switcher{display:flex;gap:2px;padding:8px 12px;background:#0a0a0c;border-bottom:1px solid #232430;}
.app-switch-btn{padding:8px 16px;background:transparent;border:none;border-radius:6px 6px 0 0;cursor:pointer;font-size:13px;font-weight:600;font-family:inherit;color:#7a7a8c;transition:all .15s;letter-spacing:.02em;}
.app-switch-btn:hover{color:#d0d0e0;background:rgba(255,255,255,.03);}
.app-switch-btn.active{color:#e8b84b;background:rgba(200,146,42,.12);}
</style>
