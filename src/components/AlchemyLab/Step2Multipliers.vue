<template>
  <div class="step2">
    <div class="ing-chip">⚗ {{ ingredientName||'—' }} <span class="aw-tag">AW={{ hasAW?1:0 }}</span></div>

    <section class="card">
      <h2 class="card-title">{{ t('s2.title') }}</h2>
      <div class="info-box" style="margin-bottom:12px">{{ t('s2.hint') }}</div>

      <div class="prop-tabs">
        <button
          v-for="p in MULT_PROPS_CONF"
          :key="'tab-'+p.id"
          class="ptab"
          :class="{active:activeMProp===p.id}"
          @click="activeMProp=p.id;showAllMV=false"
        >
          <span class="ptab-dot" :class="tabDotClass(p.id)" />
          {{ p.label }}
        </button>
      </div>

      <div class="panel-inner">
        <div v-if="activeDetectedMV?.hit" class="detected-banner">
          {{ t('s2.detectedMV', { mv: fmtMV(activeDetectedMV.MVx), alb: activeDetectedMV.fin.length > 0 ? activeDetectedMV.fin[0].toFixed(4) : '—' }) }}
          <span v-if="activeDetectedMV.known" style="margin-left:6px;font-size:10px;color:var(--muted)">({{ activeDetectedMV.known }})</span>
        </div>

        <div class="g2" style="margin-bottom:12px">
          <div class="field">
            <label class="lbl">{{ t('s2.testbed') }}</label>
            <select v-model="activeTest.tbKey" @change="syncTestbedValues(activeMProp)">
              <option v-for="opt in activeTbOptions" :key="opt.key" :value="opt.key">{{ opt.label }}</option>
            </select>
          </div>
          <div class="g2" style="gap:8px">
            <div class="field">
              <label class="lbl">{{ t('s2.lb') }}</label>
              <input v-model.number="activeTest.lb" class="input-num" step="0.001" type="number">
              <p class="hint">{{ t('s2.lbHint') }}</p>
            </div>
            <div class="field">
              <label class="lbl">{{ t('s2.mvBase') }}</label>
              <input v-model.number="activeTest.mv" class="input-num" step="0.01" type="number">
              <p class="hint">{{ t('s2.mvBaseHint') }}</p>
            </div>
          </div>
        </div>
        <p class="tb-note">{{ activeTbNote }}</p>

        <div class="calib-block">
          <div class="calib-header">
            <span class="calib-title">{{ t('s2.calibTitle') }}</span>
            <span v-if="activeTest.calibration && !isNaN(parseFloat(activeTest.calibration))" class="calib-ok">✓ {{ t('s2.calibSet') }}</span>
          </div>
          <div class="calib-row">
            <span class="calib-desc">{{ t('s2.calibDesc', { prop: activeMProp.toUpperCase(), ntb: 11 }) }}</span>
            <input
              v-model="activeTest.calibration"
              class="input-num calib-input"
              :placeholder="t('s2.calibPH')"
              step="0.001"
              type="number"
            >
          </div>
          <p class="hint">{{ t('s2.calibHint') }}</p>
        </div>

        <div style="margin-bottom:12px">
          <p class="lbl">{{ t('s2.zeroTitle') }}</p>
          <p class="hint" style="margin-bottom:6px">{{ t('s2.zeroHint') }}</p>
          <div class="zero-refs">
            <div v-for="zp in zeroPatterns" :key="zp.nx" class="zero-ref">
              <p class="zr-lbl">{{ t('s2.zeroRef', { n: zp.nx }) }}</p>
              <p class="zr-val">{{ zp.v.toFixed(3) }}</p>
            </div>
          </div>
        </div>

        <p class="lbl" style="margin-bottom:4px">{{ t('s2.potions') }}</p>
        <p class="hint" style="margin-bottom:8px">{{ t('s2.potionsHint', { prop: activeMProp.toUpperCase() }) }}</p>
        <div style="display:grid;grid-template-columns:44px 58px 58px 1fr 22px;gap:6px;margin-bottom:4px">
          <div /><div class="slbl">{{ t('s2.nBase') }}</div><div class="slbl">{{ t('s2.nIng') }}</div>
          <div class="slbl">{{ activeMProp.toUpperCase() }}</div><div />
        </div>
        <div v-for="(pot,idx) in activeTest.potions" :key="idx" class="pot-row">
          <span class="pot-num">З-{{ idx+1 }}</span>
          <input v-model.number="pot.ntb" class="input-num" min="1" type="number">
          <input v-model.number="pot.nx" class="input-num" min="1" type="number">
          <input
            v-model="pot.pr"
            class="input-num input-pr"
            placeholder="0.000"
            step="0.001"
            type="number"
          >
          <button class="del-btn" @click="removePotion(activeMProp,idx)">×</button>
        </div>
        <button class="add-btn" @click="addPotion(activeMProp)">{{ t('s2.addPotion') }}</button>

        <div class="mode-row">
          <label class="basemv-toggle-inline" :class="{'is-active':activeTest.baseMVMode}">
            <input v-model="activeTest.baseMVMode" type="checkbox">
            <span>Base+MV {{ t('s2.baseMVToggle') }}</span>
          </label>
          <span v-if="activeTest.baseMVMode" class="basemv-active-tag">{{ t('s2.baseMVActive') }}</span>
        </div>
        <div v-if="hasSuggestBaseMV && !activeTest.baseMVMode" class="basemv-hint-block">
          <span class="basemv-icon">⚡</span>
          {{ t('s2.baseMVSuggest') }}
        </div>
        <div v-if="activeTest.baseMVMode" class="basemv-on-block">
          <p class="basemv-hint">{{ t('s2.baseMVHint') }}</p>
          <p class="basemv-note">{{ t('s2.baseMVNote') }}</p>
        </div>

        <MVTable
          v-if="hasMVData"
          v-model:show-all="showAllMV"
          :base-m-v-mode="activeTest.baseMVMode"
          :rows="activeMVTable"
          :valid-pots="validPots"
        />
        <p v-else class="info-box" style="margin-top:10px">{{ t('s2.potionsHint', { prop: activeMProp.toUpperCase() }) }}</p>
      </div>
    </section>

    <div class="nav-row">
      <button class="btn btn-ghost" @click="step=1">{{ t('common.back') }}</button>
      <div class="nav-right">
        <button class="btn btn-outline" @click="step=3">{{ t('common.skip') }}</button>
        <button class="btn btn-primary" @click="step=3">{{ t('common.next') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { TB_BY_PROP, TESTBEDS } from '@/composables/alchemyConstants.js'
  import { computeZeroPatterns, fmtMV } from '@/composables/useAlchemyCalc.js'
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'
  import MVTable from './MVTable.vue'

  const MULT_PROPS_CONF = [
    { id: 'dh', label: 'DH' }, { id: 'hot', label: 'HoT' }, { id: 'hl', label: 'HL' },
    { id: 'dp', label: 'DP' }, { id: 'pot', label: 'PoT' }, { id: 'pl', label: 'PL' },
  ]

  const { t } = useI18n()
  const { step, ingredientName, hasAW, activeMProp, multTests, showAllMV, A, QB,
          activeTest, activeMVTable, detectedMVs, activeDetectedMV,
          addPotion, removePotion, syncTestbedValues } = useAlchemyStore()

  const activeTbOptions = computed(() =>
    (TB_BY_PROP[activeMProp.value] ?? []).map(k => ({ key: k, label: TESTBEDS[k].label })),
  )
  const activeTbNote = computed(() => TESTBEDS[activeTest.value.tbKey]?.note ?? '')
  const zeroPatterns = computed(() => {
    const t2 = activeTest.value
    const calib = t2.calibration !== '' && !isNaN(Number.parseFloat(t2.calibration)) ? Number.parseFloat(t2.calibration) : null
    return computeZeroPatterns(t2.lb, t2.mv, A.value, QB.value, calib)
  })
  const validPots = computed(() => activeTest.value.potions.filter(p => p.pr !== '' && !isNaN(Number.parseFloat(p.pr))))
  const hasMVData = computed(() => validPots.value.length > 0)
  const hasSuggestBaseMV = computed(() => {
    if (activeTest.value.baseMVMode) return false
    if (validPots.value.length < 3) return false
    return !activeMVTable.value.some(r => r.hit || r.near)
  })

  function tabDotClass (prop) {
    const d = detectedMVs.value[prop]
    if (!d) return 'dot-none'
    return d.hit ? 'dot-hit' : (d.near ? 'dot-near' : 'dot-none')
  }
</script>

<style scoped>
.step2{display:flex;flex-direction:column;gap:12px}
.ing-chip{display:inline-flex;align-items:center;gap:8px;background:var(--accent-glow);border:1px solid rgba(107,94,247,.3);border-radius:8px;padding:6px 14px;font-size:13px;font-weight:500;color:var(--accent2);margin-bottom:2px}
.aw-tag{font-size:10px;background:var(--s3);border:1px solid var(--border);border-radius:4px;padding:1px 5px;color:var(--muted);font-family:var(--mono)}
.prop-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.ptab{display:flex;align-items:center;gap:5px;padding:5px 14px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;font-size:12px;font-weight:500;font-family:var(--ui);transition:all .15s}
.ptab:hover{border-color:var(--border2);color:var(--text)}
.ptab.active{border-color:var(--accent);color:var(--accent2);background:var(--accent-glow)}
.ptab-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.dot-none{background:var(--dim)}.dot-hit{background:var(--success)}.dot-near{background:var(--warn)}
.panel-inner{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:14px}
.detected-banner{background:var(--accent-glow);border:1px solid rgba(107,94,247,.3);border-radius:7px;padding:9px 13px;margin-bottom:14px;font-size:12px;color:var(--muted)}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.input-num{background:var(--bg);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:var(--mono);font-size:13px;padding:6px 8px;width:100%;text-align:right;transition:border .15s}
.input-num:focus{outline:none;border-color:var(--accent)}
.input-pr{font-size:14px;font-weight:500}
.tb-note{font-size:11px;color:var(--muted);background:var(--info-bg);border-left:2px solid var(--info);padding:7px 11px;border-radius:0 6px 6px 0;margin-bottom:12px;line-height:1.6}
.calib-block{background:rgba(232,168,42,.06);border:1px solid rgba(232,168,42,.2);border-radius:8px;padding:10px 12px;margin-bottom:12px}
.calib-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.calib-title{font-size:11px;font-weight:600;color:var(--warn);text-transform:uppercase;letter-spacing:.06em}
.calib-ok{font-size:11px;color:var(--success);font-family:var(--mono)}
.calib-row{display:flex;align-items:center;gap:10px;margin-bottom:4px}
.calib-desc{font-size:12px;color:var(--muted);flex:1;line-height:1.4}
.calib-input{width:110px;flex-shrink:0}
.zero-refs{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.zero-ref{background:var(--s3);border:1px solid var(--border);border-radius:6px;padding:7px 11px}
.zr-lbl{font-size:10px;color:var(--dim)}.zr-val{font-size:13px;font-weight:500;font-family:var(--mono);color:var(--text)}
.slbl{font-size:10px;color:var(--muted)}
.pot-row{display:grid;grid-template-columns:44px 58px 58px 1fr 22px;gap:6px;align-items:end;margin-bottom:6px}
.pot-num{font-size:12px;color:var(--muted);padding-bottom:3px}
.del-btn{background:none;border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--muted);font-size:14px;padding:0 7px;height:32px;transition:.15s}
.del-btn:hover{border-color:var(--danger);color:var(--danger)}
.add-btn{padding:4px 12px;border:1px solid var(--border2);border-radius:6px;background:transparent;color:var(--muted);cursor:pointer;font-size:12px;font-family:var(--ui);margin-bottom:8px;transition:.15s}
.add-btn:hover{color:var(--accent2);border-color:var(--accent)}
.mode-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.basemv-toggle-inline{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:var(--muted);padding:4px 10px;border:1px solid var(--border);border-radius:6px;transition:.15s}
.basemv-toggle-inline:hover{border-color:var(--accent);color:var(--accent2)}
.basemv-toggle-inline.is-active{border-color:var(--accent);color:var(--accent2);background:var(--accent-glow)}
.basemv-toggle-inline input{accent-color:var(--accent);cursor:pointer}
.basemv-active-tag{font-size:11px;color:var(--accent2);background:var(--accent-glow);border:1px solid rgba(107,94,247,.3);border-radius:4px;padding:2px 7px;font-family:var(--mono)}
.basemv-hint-block{background:rgba(90,168,245,.07);border:1px solid rgba(90,168,245,.2);border-radius:7px;padding:8px 11px;margin-bottom:10px;font-size:12px;color:var(--info);display:flex;align-items:center;gap:6px}
.basemv-icon{font-size:13px}
.basemv-on-block{background:rgba(107,94,247,.07);border:1px solid rgba(107,94,247,.2);border-radius:7px;padding:9px 12px;margin-bottom:10px}
.basemv-hint{font-size:11px;color:var(--muted);line-height:1.55}
.basemv-note{font-size:11px;color:var(--accent2);margin-top:4px}
</style>
