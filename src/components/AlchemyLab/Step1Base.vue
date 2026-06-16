<template>
  <VRow class="step1 justify-center">
    <VCol cols="6">
      <section class="card">
        <h2 class="card-title">{{ t('s1.ingredient') }}</h2>
        <div class="grid-2">
          <div class="field">
            <label class="lbl">{{ t('s1.ingredientName') }}</label>
            <input
              v-model.trim="ingredientName"
              :class="['input-text',{'has-err':nameError}]"
              :placeholder="t('s1.ingredientPH')"
              type="text"
              @input="nameError=''"
              @keyup.enter="validateAndNext"
            >
            <p v-if="nameError" class="err">{{ nameError }}</p>
          </div>
          <div class="field">
            <label class="lbl">{{ t('s1.aw') }}</label>
            <div class="rb-group">
              <label class="rb-item" :class="{selected:hasAW}"><input v-model="hasAW" type="radio" :value="true"> {{ t('s1.awPresent') }}</label>
              <label class="rb-item" :class="{selected:!hasAW}"><input v-model="hasAW" type="radio" :value="false"> {{ t('s1.awNone') }}</label>
            </div>
            <p class="hint">{{ t('s1.awHint') }}</p>
          </div>
        </div>
      </section>

      <section class="card">
        <h2 class="card-title">{{ t('s1.skills') }}</h2>
        <div class="grid-2">
          <div>
            <div class="skill-row">
              <span class="lbl">APM</span>
              <input
                v-model.number="skills.apm"
                max="100"
                min="0"
                step="1"
                type="range"
              >
              <span class="skill-val">{{ skills.apm }}</span>
            </div>
            <p class="hint">{{ t('s1.apmHint', { val: A.toFixed(3) }) }}</p>
            <div class="skill-row" style="margin-top:10px">
              <span class="lbl">{{ t('s1.loreLevel') }}</span>
              <input
                v-model.number="skills.loreLevel"
                max="100"
                min="0"
                step="1"
                type="range"
              >
              <span class="skill-val">{{ skills.loreLevel }}</span>
            </div>
            <p class="hint">{{ t('s1.loreLevelHint', { l: L.toFixed(4), al: (A*L).toFixed(4) }) }}</p>
          </div>
          <div>
            <div class="field">
              <label class="lbl">{{ t('s1.loreType') }}</label>
              <select v-model.number="skills.loreType">
                <option :value="2/3">{{ t('s1.loreHerb') }}</option>
                <option :value="1.0">{{ t('s1.loreOther') }}</option>
                <option :value="0">{{ t('s1.loreUnknown') }}</option>
              </select>
              <p class="hint">{{ t('s1.loreTypeHint') }}</p>
            </div>
            <label class="chk-item" style="margin-top:12px">
              <input v-model="skills.qualityBuff" type="checkbox">
              {{ t('s1.qualityBuff', { val: QB.toFixed(2) }) }}
            </label>
            <p class="hint" style="margin-top:4px">{{ t('s1.qualityBuffHint') }}</p>
          </div>
        </div>
      </section>
    </VCol>
    <VCol cols="6">
      <section class="card">
        <h2 class="card-title">{{ hasAW ? t('s1.potion1title') : t('s1.potion1titleWater') }}</h2>
        <div v-if="!hasAW" class="info-box warn">{{ t('s1.selfmvWarn') }}</div>
        <div v-else class="info-box">{{ t('s1.potion1hint') }}</div>
        <div class="props-grid" style="margin-top:12px">
          <div v-for="p in ALL_PROPS" :key="'p1-'+p.id" class="pcell">
            <p class="plbl">{{ p.label }}</p>
            <p class="phint">{{ t('prop.'+p.id+'.hint') }}</p>
            <input
              v-model="pot1[p.id]"
              class="input-num"
              placeholder="—"
              step="0.001"
              type="number"
            >
          </div>
        </div>
      </section>

      <section v-if="hasAW" class="card">
        <h2 class="card-title">
          {{ t('s1.selfmv') }}
          <span class="badge-muted">{{ t('s1.selfmvBadge') }}</span>
        </h2>
        <div class="info-box">{{ t('s1.selfmvHint') }}</div>
        <div class="info-box warn">{{ t('s1.selfmvWarn') }}</div>
        <p class="hint" style="margin:6px 0 10px">{{ t('s1.selfmvFormula') }}</p>
        <div class="props-grid">
          <div v-for="p in ALL_PROPS" :key="'p2-'+p.id" class="pcell">
            <p class="plbl">{{ p.label }}</p>
            <input
              v-model="pot2[p.id]"
              class="input-num"
              placeholder="—"
              step="0.001"
              type="number"
            >
          </div>
        </div>
      </section>

      <section v-if="hasAnyBase" class="card">
        <h2 class="card-title">{{ t('s1.preview') }}</h2>
        <p class="info-box" style="margin-bottom:12px">{{ t('s1.previewHint') }}</p>
        <div class="result-grid">
          <div v-for="p in ALL_PROPS" v-show="bases[p.id]!==null" :key="'rb-'+p.id" class="ri">
            <p class="ri-lbl">P{{ p.label }}</p>
            <p class="ri-val" :class="valClass(bases[p.id])">{{ fmtAlb(bases[p.id]) }}</p>
            <p v-if="selfMVs[p.id]!==null && selfMVs[p.id]!==0" class="ri-sub">self-MV {{ selfMVs[p.id]>=0?'+':'' }}{{ selfMVs[p.id] }}</p>
            <p v-else-if="selfMVs[p.id]===0" class="ri-sub ok">{{ t('s1.selfmvNone') }}</p>
            <p v-else class="ri-sub warn">{{ t('s1.selfmvNotFound') }}</p>
          </div>
        </div>
      </section>
    </VCol>

    <div class="nav-row">
      <p class="step-hint">{{ t('wizard.stepOf', { n: 1 }) }}</p>
      <div class="nav-right">
        <button class="btn btn-outline" @click="validateAndNext">{{ t('common.next') }}</button>
      </div>
    </div>
  </VRow>
</template>

<script setup>
  import { ALL_PROPS } from '@/composables/alchemyConstants.js'
  import { fmtAlb, valClass } from '@/composables/useAlchemyCalc.js'
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'

  const { t } = useI18n()
  const { ingredientName, nameError, hasAW, skills, pot1, pot2, A, L, QB, bases, selfMVs, hasAnyBase, validateAndNext } = useAlchemyStore()
</script>

<style scoped>
.step1{display:flex;flex-direction:column;gap:12px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.props-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.pcell{background:var(--s3);border:1px solid var(--border);border-radius:8px;padding:9px 10px}
.plbl{font-size:11px;font-weight:600;color:var(--muted);margin-bottom:2px}
.phint{font-size:10px;color:var(--dim);margin-bottom:5px;line-height:1.4}
.input-num{font-family:var(--mono);font-size:14px;font-weight:500}
.skill-row{display:flex;align-items:center;gap:10px}
.skill-row .lbl{min-width:110px;flex-shrink:0;margin-bottom:0}
.skill-row input[type=range]{flex:1}
.skill-val{min-width:36px;text-align:right;font-family:var(--mono);font-size:13px;font-weight:500;color:var(--accent2)}
.rb-group{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;margin-bottom:4px}
.rb-item{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;color:var(--muted)}
.rb-item.selected{color:var(--text)}
.rb-item input{accent-color:var(--accent)}
.chk-item{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:13px;color:var(--muted)}
.chk-item input{accent-color:var(--accent);width:14px;height:14px}
.result-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}
.ri{background:var(--s3);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
.ri-lbl{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.ri-val{font-size:20px;font-weight:500;font-family:var(--mono);line-height:1.1}
.ri-val.pos{color:var(--success)}.ri-val.neg{color:var(--danger)}.ri-val.zero{color:var(--dim)}
.ri-sub{font-size:10px;color:var(--dim);margin-top:3px;font-family:var(--mono)}
.ri-sub.ok{color:var(--success)}.ri-sub.warn{color:var(--warn)}
.badge-muted{font-size:10px;background:var(--s3);border:1px solid var(--border);border-radius:4px;padding:2px 6px;color:var(--muted);font-weight:400;letter-spacing:0;text-transform:none;font-family:var(--ui);vertical-align:middle;margin-left:6px}
</style>
