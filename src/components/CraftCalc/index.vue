<template>
  <div class="craft-root">
    <div class="craft-app">
      <CraftSidebar />

      <main v-if="metal" class="main">
        <div class="page-header">
          <div>
            <div class="page-title">{{ metal.name }}</div>
            <div class="page-subtitle">{{ t('craft.furnaceSubtitle') }}</div>
          </div>
          <div class="target-block">
            <label>{{ t('craft.target') }}</label>
            <input v-model.number="targets[currentMetal]" class="target-input" type="number" min="1" step="100"/>
          </div>
        </div>

        <div class="layout">
          <CraftRecipesPanel />
          <CraftTreePanel />
        </div>
      </main>
    </div>

    <Transition name="craft-toast">
      <div v-if="toast.show" class="toast" :class="{success: toast.success}">{{ toast.msg }}</div>
    </Transition>
  </div>
</template>

<script setup>
  import { useI18n } from '@/composables/useI18n.js'
  import { useCraftCalc } from '@/composables/useCraftCalc.js'
  import CraftRecipesPanel from './CraftRecipesPanel.vue'
  import CraftSidebar from './CraftSidebar.vue'
  import CraftTreePanel from './CraftTreePanel.vue'

  const { t } = useI18n()
  const { metal, currentMetal, targets, toast } = useCraftCalc()
</script>

<style scoped>
.craft-root {
  --craft-bg:#0d0f12;--craft-bg2:#13161b;--craft-bg3:#1a1e25;--craft-bg4:#212530;
  --craft-border:#2a2f3d;--craft-border2:#353c50;
  --craft-accent:#c8922a;--craft-accent2:#e8b84b;--craft-accent-dim:rgba(200,146,42,0.15);
  --craft-text:#d4cfc4;--craft-text2:#8a8880;--craft-text3:#555a66;
  --craft-green:#4a9e6a;--craft-green-dim:rgba(74,158,106,0.12);
  --craft-red:#9e4a4a;--craft-red-dim:rgba(158,74,74,0.12);
  --craft-blue:#4a7a9e;--craft-blue-dim:rgba(74,122,158,0.12);
  --craft-font:'Rajdhani',sans-serif;--craft-mono:'Share Tech Mono',monospace;
  background:var(--craft-bg);color:var(--craft-text);font-family:var(--craft-font);font-size:15px;
}
.craft-app {
  display:grid;grid-template-columns:210px 1fr;min-height:100vh;
}
.sidebar{background:var(--craft-bg2);border-right:1px solid var(--craft-border);display:flex;flex-direction:column;overflow-y:auto;}
.main{padding:24px;overflow-y:auto;}
.sidebar-header{padding:20px 16px 16px;border-bottom:1px solid var(--craft-border);}
.sidebar-logo{font-size:10px;letter-spacing:0.2em;color:var(--craft-accent);text-transform:uppercase;font-weight:600;margin-bottom:4px;}
.sidebar-title{font-size:18px;font-weight:700;color:var(--craft-text);letter-spacing:0.05em;}
.sidebar-nav{padding:12px 8px;}
.nav-label{font-size:10px;letter-spacing:0.15em;color:var(--craft-text3);text-transform:uppercase;padding:8px 8px 4px;font-weight:600;}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:6px;cursor:pointer;transition:all 0.15s;color:var(--craft-text2);font-size:14px;font-weight:500;border:1px solid transparent;margin-bottom:2px;}
.nav-item:hover{background:var(--craft-bg3);color:var(--craft-text);}
.nav-item.active{background:var(--craft-accent-dim);color:var(--craft-accent2);border-color:rgba(200,146,42,0.3);}
.nav-dot{width:6px;height:6px;border-radius:50%;background:var(--craft-text3);flex-shrink:0;transition:background 0.15s;}
.nav-item.active .nav-dot{background:var(--craft-accent);box-shadow:0 0 6px var(--craft-accent);}
.sidebar-footer{padding:12px 16px;border-top:1px solid var(--craft-border);}
.preset-label{font-size:10px;letter-spacing:0.15em;color:var(--craft-text3);text-transform:uppercase;margin-bottom:8px;font-weight:600;}
.preset-btn{width:100%;padding:7px 10px;background:var(--craft-bg3);border:1px solid var(--craft-border);border-radius:6px;color:var(--craft-text2);font-family:var(--craft-font);font-size:13px;cursor:pointer;transition:all 0.15s;text-align:left;margin-bottom:4px;font-weight:500;}
.preset-btn.save{color:var(--craft-green);border-color:rgba(74,158,106,0.3);}
.preset-btn.save:hover{background:var(--craft-green-dim);}
.preset-btn.load{color:var(--craft-accent);border-color:rgba(200,146,42,0.3);}
.preset-btn.load:hover{background:var(--craft-accent-dim);}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:20px;}
.page-title{font-size:26px;font-weight:700;letter-spacing:0.05em;color:var(--craft-text);}
.page-subtitle{font-size:13px;color:var(--craft-text3);margin-top:3px;}
.target-block{display:flex;align-items:center;gap:12px;background:var(--craft-bg2);border:1px solid var(--craft-border);border-radius:8px;padding:10px 14px;flex-shrink:0;}
.target-block label{font-size:12px;color:var(--craft-text2);letter-spacing:0.05em;text-transform:uppercase;font-weight:600;white-space:nowrap;}
.target-input{background:var(--craft-bg);border:1px solid var(--craft-border2);border-radius:6px;color:var(--craft-accent2);font-family:var(--craft-mono);font-size:18px;padding:4px 10px;width:130px;text-align:right;outline:none;transition:border-color 0.15s;}
.target-input:focus{border-color:var(--craft-accent);}
.layout{display:grid;grid-template-columns:1fr 420px;gap:20px;align-items:start;}
.recipes-panel{display:flex;flex-direction:column;gap:12px;}
.recipe-card{background:var(--craft-bg2);border:1px solid var(--craft-border);border-radius:8px;overflow:hidden;}
.recipe-card-header{padding:9px 14px;border-bottom:1px solid var(--craft-border);display:flex;align-items:center;justify-content:space-between;}
.recipe-card-title{font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--craft-text2);}
.recipe-card-furnace{font-size:11px;color:var(--craft-text3);font-family:var(--craft-mono);}
.recipe-options{padding:8px;display:flex;flex-direction:column;gap:5px;}
.recipe-opt{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--craft-border);border-radius:6px;cursor:pointer;transition:all 0.15s;background:var(--craft-bg3);}
.recipe-opt:hover{border-color:var(--craft-border2);}
.recipe-opt.selected{border-color:rgba(200,146,42,0.5);background:var(--craft-accent-dim);}
.recipe-opt-radio{width:14px;height:14px;border-radius:50%;border:2px solid var(--craft-border2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.recipe-opt.selected .recipe-opt-radio{border-color:var(--craft-accent);}
.recipe-opt-radio-dot{width:6px;height:6px;border-radius:50%;background:var(--craft-accent);display:none;}
.recipe-opt.selected .recipe-opt-radio-dot{display:block;}
.recipe-opt-info{flex:1;min-width:0;}
.recipe-opt-name{font-size:13px;font-weight:500;color:var(--craft-text);}
.recipe-opt.selected .recipe-opt-name{color:var(--craft-accent2);}
.recipe-opt-detail{font-size:11px;color:var(--craft-text3);font-family:var(--craft-mono);margin-top:1px;}
.recipe-opt-yield{font-family:var(--craft-mono);font-size:13px;font-weight:600;color:var(--craft-green);flex-shrink:0;}
.best-badge{font-size:9px;letter-spacing:0.1em;background:rgba(200,146,42,0.2);color:var(--craft-accent);border:1px solid rgba(200,146,42,0.3);border-radius:3px;padding:2px 5px;font-weight:700;flex-shrink:0;}
.tree-panel{position:sticky;top:24px;display:flex;flex-direction:column;gap:12px;}
.hero-card{background:var(--craft-bg2);border:1px solid rgba(200,146,42,0.35);border-radius:8px;padding:14px 18px;}
.hero-name{font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:var(--craft-accent);font-weight:600;margin-bottom:3px;}
.hero-amount{font-family:var(--craft-mono);font-size:30px;font-weight:700;color:var(--craft-accent2);line-height:1;}
.hero-sub{font-size:12px;color:var(--craft-text3);margin-top:4px;font-family:var(--craft-mono);}
.tree-card{background:var(--craft-bg2);border:1px solid var(--craft-border);border-radius:8px;overflow:hidden;}
.tree-card-header{padding:9px 14px;border-bottom:1px solid var(--craft-border);font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--craft-text2);}
.tree-body{padding:12px 14px;}
.tree-node-row{display:flex;align-items:baseline;line-height:2;}
.tree-prefix{font-family:var(--craft-mono);font-size:12px;color:var(--craft-text3);white-space:pre;flex-shrink:0;}
.tree-name{font-family:var(--craft-mono);font-size:12px;flex:1;}
.tree-name.final{color:var(--craft-accent2);font-weight:700;font-size:13px;}
.tree-name.intermediate{color:var(--craft-blue);}
.tree-name.base-ore{color:var(--craft-green);}
.tree-name.base-buy{color:var(--craft-accent);}
.tree-name.base-hard{color:var(--craft-red);}
.tree-name.base-easy{color:#7ab3d4;}
.tree-amount{font-family:var(--craft-mono);font-size:12px;font-weight:600;flex-shrink:0;margin-left:8px;text-align:right;min-width:80px;}
.tree-amount.final{color:var(--craft-accent2);font-size:13px;}
.tree-amount.intermediate{color:var(--craft-blue);}
.tree-amount.base-ore{color:var(--craft-green);}
.tree-amount.base-buy{color:var(--craft-accent);}
.tree-amount.base-hard{color:var(--craft-red);}
.tree-amount.base-easy{color:#7ab3d4;}
.tree-tag{font-size:9px;padding:1px 5px;border-radius:3px;font-weight:700;letter-spacing:0.05em;margin-left:6px;flex-shrink:0;align-self:center;}
.tag-mine{background:var(--craft-green-dim);color:var(--craft-green);border:1px solid rgba(74,158,106,0.3);}
.tag-buy{background:var(--craft-accent-dim);color:var(--craft-accent);border:1px solid rgba(200,146,42,0.3);}
.tag-hard{background:var(--craft-red-dim);color:var(--craft-red);border:1px solid rgba(158,74,74,0.3);}
.tag-easy{background:var(--craft-blue-dim);color:var(--craft-blue);border:1px solid rgba(74,122,158,0.3);}
.tree-divider{height:0.5px;background:var(--craft-border);margin:5px 0;}
.tree-name.tree-section{color:var(--craft-text3);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;padding-top:4px;}
.tree-amount.tree-section{display:none;}
.toast{position:fixed;bottom:20px;right:20px;background:var(--craft-bg3);border:1px solid var(--craft-border2);border-radius:8px;padding:10px 16px;font-size:13px;color:var(--craft-text);z-index:999;transition:all 0.3s;opacity:1;font-family:var(--craft-font);font-weight:500;}
.toast.hidden{opacity:0;pointer-events:none;}
.toast.success{border-color:rgba(74,158,106,0.5);color:var(--craft-green);}
.bonus-section { padding: 12px 16px; border-top: 1px solid var(--craft-border); }
.bonus-label-main { font-size: 10px; letter-spacing: 0.15em; color: var(--craft-text3); text-transform: uppercase; margin-bottom: 10px; font-weight: 600; }
.bonus-item { margin-bottom: 10px; }
.bonus-item-label { font-size: 12px; color: var(--craft-text2); font-weight: 500; margin-bottom: 5px; display: flex; align-items: center; gap: 6px; }
.bonus-item-label input[type=checkbox] { accent-color: var(--craft-accent); width: 14px; height: 14px; cursor: pointer; }
.bonus-item-label.active { color: var(--craft-accent2); }
.bonus-seg { display: flex; gap: 4px; margin-top: 4px; }
.bonus-seg-btn { flex: 1; padding: 4px 0; font-size: 11px; font-family: var(--craft-font); font-weight: 600; border: 1px solid var(--craft-border); border-radius: 4px; background: var(--craft-bg3); color: var(--craft-text3); cursor: pointer; text-align: center; transition: all 0.15s; }
.bonus-seg-btn.active { background: var(--craft-accent-dim); color: var(--craft-accent2); border-color: rgba(200,146,42,0.4); }
.bonus-badge { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 3px; background: var(--craft-accent-dim); color: var(--craft-accent); border: 1px solid rgba(200,146,42,0.3); font-family: var(--craft-mono); font-weight: 600; margin-left: auto; }
/* ── PRICE PANEL ── */
.price-section{padding:12px 16px;border-top:1px solid var(--craft-border);}
.price-label-main{font-size:10px;letter-spacing:0.15em;color:var(--craft-text3);text-transform:uppercase;margin-bottom:10px;font-weight:600;display:flex;align-items:center;gap:8px;}
.price-toggle{display:flex;align-items:center;gap:5px;margin-left:auto;font-size:11px;color:var(--craft-text2);cursor:pointer;letter-spacing:0;}
.price-toggle input{accent-color:var(--craft-accent);width:13px;height:13px;cursor:pointer;}
.price-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;}
.price-row-label{font-size:11px;color:var(--craft-text2);width:90px;flex-shrink:0;}
.price-input{background:var(--craft-bg3);border:1px solid var(--craft-border);border-radius:4px;padding:3px 7px;font-size:12px;font-family:var(--craft-mono);color:var(--craft-text);width:70px;text-align:right;outline:none;transition:border 0.15s;}
.price-input:focus{border-color:var(--craft-border2);}
.price-tag{font-size:10px;color:var(--craft-text3);}
/* Cost card */
.cost-card{margin:10px 16px 0;background:var(--craft-bg3);border:1px solid var(--craft-border);border-radius:8px;padding:12px 14px;}
.cost-card-title{font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:var(--craft-text3);font-weight:700;margin-bottom:10px;}
.cost-row{display:flex;align-items:baseline;gap:6px;margin-bottom:5px;font-size:12px;}
.cost-row-name{color:var(--craft-text2);flex:1;}
.cost-row-qty{font-family:var(--craft-mono);color:var(--craft-text3);font-size:11px;width:68px;text-align:right;}
.cost-row-x{color:var(--craft-text3);font-size:10px;}
.cost-row-price{font-family:var(--craft-mono);color:var(--craft-text3);font-size:11px;width:44px;text-align:right;}
.cost-row-eq{color:var(--craft-text3);font-size:10px;}
.cost-row-total{font-family:var(--craft-mono);color:var(--craft-green);font-size:12px;width:72px;text-align:right;}
.cost-divider{height:0.5px;background:var(--craft-border);margin:7px 0;}
.cost-final{display:flex;align-items:baseline;gap:6px;font-size:13px;font-weight:600;}
.cost-final-label{color:var(--craft-text2);flex:1;}
.cost-final-val{font-family:var(--craft-mono);color:var(--craft-accent2);font-size:15px;}
/* Percent mode */
.cost-pct-bar{height:6px;border-radius:3px;background:var(--craft-border);margin:8px 0 4px;overflow:hidden;display:flex;}
.cost-pct-seg{height:100%;transition:width 0.3s;}
.cost-pct-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;font-size:12px;}
.cost-pct-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.cost-pct-name{color:var(--craft-text2);flex:1;}
.cost-pct-val{font-family:var(--craft-mono);color:var(--craft-text3);font-size:11px;}

.craft-toast-enter-active,.craft-toast-leave-active{transition:opacity 0.3s;}
.craft-toast-enter-from,.craft-toast-leave-to{opacity:0;}
</style>
