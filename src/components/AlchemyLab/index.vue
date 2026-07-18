<template>
  <div class="alchemy-lab">
    <header class="top-bar">
      <div>
        <h1 class="logo"><em>⚗</em> Alchemy Lab</h1>
        <p class="logo-sub">{{ t('app.subtitle') }}</p>
      </div>
      <div class="top-actions">
        <button class="btn btn-primary" @click="onAdd">
          {{ activeTab === 'ingredients' ? t('btn.addReagent') : t('btn.newRecipe') }}
        </button>
      </div>
    </header>

    <div class="tab-bar">
      <button class="tab" :class="{active:activeTab==='ingredients'}" @click="activeTab='ingredients'">
        {{ t('nav.ingredients') }}
        <span class="tab-count">{{ library.length }}</span>
      </button>
      <button class="tab" :class="{active:activeTab==='potions'}" @click="activeTab='potions'">
        {{ t('nav.recipes') }}
        <span class="tab-count">{{ potionList.length }}</span>
      </button>
    </div>

    <Transition mode="out-in" name="tab">
      <LibrarySection v-if="activeTab==='ingredients'" key="ing" />
      <PotionSection v-else key="pot" />
    </Transition>

    <WizardModal />
    <PotionModal />

    <Transition name="toast">
      <div v-if="toast || potionToast" class="toast">{{ toast || potionToast }}</div>
    </Transition>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'
  import { usePotionStore } from '@/composables/usePotionStore.js'
  import LibrarySection from './LibrarySection.vue'
  import PotionModal from './PotionModal.vue'
  import PotionSection from './PotionSection.vue'
  import WizardModal from './WizardModal.vue'

  const { t } = useI18n()
  const { toast, library, openModal, loadLibrary } = useAlchemyStore()
  const { potionList, openPotionModal, loadPotions } = usePotionStore()

  const activeTab = ref('ingredients')
  const potionToast = ref(null)

  function onAdd () {
    if (activeTab.value === 'ingredients') openModal()
    else openPotionModal()
  }

  onMounted(() => {
    // eslint-disable-next-line @stylistic/max-statements-per-line
    loadLibrary(); loadPotions()
  })
</script>

<style>
:root{--bg:#0e0f1e;--s1:#141527;--s2:#1b1c31;--s3:#22243c;--border:#2c2e4e;--border2:#3d3f62;--text:#dddaf5;--muted:#8280a8;--dim:#474870;--accent:#6b5ef7;--accent2:#9d95ff;--accent-glow:rgba(107,94,247,.15);--success:#38c974;--success-bg:rgba(56,201,116,.1);--warn:#e8a82a;--warn-bg:rgba(232,168,42,.1);--danger:#e05858;--danger-bg:rgba(224,88,88,.1);--info:#5aa8f5;--info-bg:rgba(90,168,245,.08);--mono:'JetBrains Mono','Fira Code',monospace;--ui:'Outfit','DM Sans',system-ui,sans-serif}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--ui);background:var(--bg);color:var(--text);font-size:14px;line-height:1.55;min-height:100vh}
.card{background:var(--s1);border:1px solid var(--border);border-radius:12px;padding:18px}
.card-title{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;gap:10px}
.card-title::after{content:'';flex:1;height:1px;background:var(--border)}
.field{margin-bottom:14px}.field:last-child{margin-bottom:0}
.lbl{display:block;font-size:11px;font-weight:500;color:var(--muted);margin-bottom:5px;letter-spacing:.02em}
.hint{font-size:11px;color:var(--dim);margin-top:4px;line-height:1.55}
.err{font-size:11px;color:var(--danger);margin-top:3px}
input[type=text],input[type=number],select{background:var(--bg);border:1px solid var(--border);border-radius:7px;color:var(--text);font-family:var(--ui);font-size:14px;padding:8px 11px;width:100%;transition:border .15s,box-shadow .15s;outline:none}
input[type=number]{font-family:var(--mono);text-align:right}
input:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
input::placeholder{color:var(--dim)}
input.has-err{border-color:var(--danger)}
input[type=range]{accent-color:var(--accent);cursor:pointer;height:4px;background:none;box-shadow:none;border:none;padding:0;width:100%}
select{cursor:pointer}
.info-box{font-size:12px;color:var(--muted);background:var(--info-bg);border-left:2px solid var(--info);padding:8px 12px;border-radius:0 7px 7px 0;margin:5px 0;line-height:1.6}
.info-box.warn{background:var(--warn-bg);border-left-color:var(--warn);color:var(--warn)}
.btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:7px;border:none;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--ui);transition:all .15s;white-space:nowrap}
.btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{background:var(--accent2);color:var(--bg)}
.btn-outline{background:transparent;border:1px solid var(--border2);color:var(--text)}.btn-outline:hover{background:var(--s3);border-color:var(--accent)}
.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--muted)}.btn-ghost:hover{background:var(--s2)}
.btn-success{background:var(--success-bg);border:1px solid var(--success);color:var(--success)}.btn-success:hover{background:rgba(56,201,116,.2)}
.btn:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}
.btn-sm{padding:5px 13px;font-size:12px}
.nav-row{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--border)}
.nav-right{display:flex;gap:8px}
.step-hint{font-size:12px;color:var(--dim)}
</style>

<style scoped>
.alchemy-lab{max-width:1140px;margin:0 auto;padding:24px 16px 60px}
.top-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid var(--border)}
.logo{font-size:20px;font-weight:600;letter-spacing:-.02em;color:var(--text)}
.logo em{color:var(--accent2);font-style:normal}
.logo-sub{font-size:11px;color:var(--dim);margin-top:1px;letter-spacing:.04em;text-transform:uppercase}
.top-actions{display:flex;align-items:center;gap:12px}

.tab-bar{display:flex;margin-bottom:20px;border-bottom:1px solid var(--border)}
.tab{display:flex;align-items:center;gap:7px;padding:9px 20px;background:transparent;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;font-size:13px;font-weight:500;font-family:var(--ui);color:var(--muted);transition:all .15s}
.tab:hover{color:var(--text)}
.tab.active{color:var(--accent2);border-bottom-color:var(--accent)}
.tab-count{font-size:11px;font-family:var(--mono);background:var(--s3);border:1px solid var(--border);border-radius:4px;padding:1px 5px;color:var(--dim)}
.tab.active .tab-count{color:var(--accent2);background:var(--accent-glow);border-color:rgba(107,94,247,.3)}

.tab-enter-active,.tab-leave-active{transition:opacity .15s,transform .15s}
.tab-enter-from{opacity:0;transform:translateY(4px)}
.tab-leave-to{opacity:0;transform:translateY(-4px)}

.toast{position:fixed;bottom:20px;right:20px;background:var(--success-bg);border:1px solid var(--success);border-radius:8px;padding:10px 16px;font-size:13px;color:var(--success);z-index:300}
.toast-enter-active,.toast-leave-active{transition:opacity .2s,transform .2s}
.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(6px)}
</style>
