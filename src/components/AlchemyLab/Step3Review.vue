<template>
  <div class="step3">
    <div class="s3-header">
      <p class="s3-name">{{ ingredientName||'—' }}</p>
      <div class="s3-meta">
        <span class="tag">AW = {{ hasAW?1:0 }}</span>
        <span class="tag">APM {{ skills.apm }}</span>
        <span class="tag">Lore {{ skills.loreLevel }}</span>
        <span v-if="skills.qualityBuff" class="tag tag-accent">Buff +3%</span>
      </div>
    </div>

    <div v-if="isEditNoRemeasure" class="info-box" style="margin-bottom:0">
      {{ t('s3.editHint') }}
    </div>

    <section class="card">
      <h2 class="card-title">{{ t('s3.basesTitle') }}</h2>
      <p class="info-box" style="margin-bottom:12px">{{ t('s3.basesHint', { al: (A*L).toFixed(4) }) }}</p>
      <div class="result-grid">
        <div v-for="p in ALL_PROPS" :key="'rb-'+p.id" class="ri">
          <p class="ri-lbl">P{{ p.label }}</p>
          <p class="ri-val" :class="valClass(previewBases[p.id])">{{ fmtAlb(previewBases[p.id]) }}</p>
          <p v-if="baseMVSources[p.id]" class="ri-sub accent">из Base+MV</p>
          <p v-else-if="selfMVs[p.id]!==null&&selfMVs[p.id]!==0" class="ri-sub warn">
            self-MV {{ selfMVs[p.id]>=0?'+':'' }}{{ selfMVs[p.id] }}
          </p>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top:12px">
      <h2 class="card-title">{{ t('s3.mvsTitle') }}</h2>
      <div class="result-grid">
        <div v-for="p in MULT_PROPS_CONF" :key="'mv-'+p.id" class="ri">
          <p class="ri-lbl">{{ p.label }}M</p>
          <template v-if="detectedMVs[p.id]?.hit">
            <p class="ri-val" :class="valClass(detectedMVs[p.id].MVx)">{{ fmtMV(detectedMVs[p.id].MVx) }}</p>
            <p class="ri-sub source">{{ t('s3.fromTest') }}</p>
          </template>
          <template v-else-if="selfMVs[p.id]!==null&&selfMVs[p.id]!==0">
            <p class="ri-val" :class="valClass(selfMVs[p.id])">{{ fmtMV(selfMVs[p.id]) }}</p>
            <p class="ri-sub warn">{{ t('s3.fromSelf') }}</p>
          </template>
          <p v-else-if="detectedMVs[p.id]?.near" class="ri-val zero">~{{ fmtMV(detectedMVs[p.id].MVx) }}</p>
          <p v-else class="ri-val zero">—</p>
        </div>
      </div>
    </section>

    <div class="nav-row">
      <button class="btn btn-ghost" @click="step=2">{{ t('common.back') }}</button>
      <button class="btn btn-success" style="font-size:14px;padding:10px 22px" @click="saveIngredient">
        ✓ {{ t('s3.saveBtn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { ALL_PROPS } from '@/composables/alchemyConstants.js'
  import { fmtAlb, fmtMV, valClass } from '@/composables/useAlchemyCalc.js'
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'

  const MULT_PROPS_CONF = [
    { id: 'dh', label: 'DH' }, { id: 'hot', label: 'HoT' }, { id: 'hl', label: 'HL' },
    { id: 'dp', label: 'DP' }, { id: 'pot', label: 'PoT' }, { id: 'pl', label: 'PL' },
  ]
  const { t } = useI18n()
  const { step, ingredientName, hasAW, skills, A, L,
          bases, previewBases, selfMVs, detectedMVs, saveIngredient, isEditNoRemeasure } = useAlchemyStore()

  // Show which bases come from Base+MV (not Step 1)
  const baseMVSources = computed(() => {
    const result = {}
    for (const p of ['dh', 'hot', 'hl', 'dp', 'pot', 'pl']) {
      const pb = previewBases.value[p]
      const b = bases.value[p]
      result[p] = pb != null && (b == null || b === 0) && pb !== b
    }
    return result
  })
</script>

<style scoped>
.step3{display:flex;flex-direction:column;gap:12px}
.s3-header{background:var(--s2);border:1px solid var(--border);border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.s3-name{font-size:22px;font-weight:600;color:var(--text)}
.s3-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.tag{font-size:10px;background:var(--s3);border:1px solid var(--border);border-radius:4px;padding:2px 7px;color:var(--muted);font-family:var(--mono)}
.tag-accent{background:var(--accent-glow);border-color:rgba(107,94,247,.3);color:var(--accent2)}
.result-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}
.ri{background:var(--s3);border:1px solid var(--border);border-radius:8px;padding:10px 12px}
.ri-lbl{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.ri-val{font-size:20px;font-weight:500;font-family:var(--mono);line-height:1.1}
.ri-val.pos{color:var(--success)}.ri-val.neg{color:var(--danger)}.ri-val.zero{color:var(--dim)}
.ri-sub{font-size:10px;color:var(--dim);margin-top:3px;font-family:var(--mono)}
.ri-sub.warn{color:var(--warn)}.ri-sub.source{color:var(--dim)}.ri-sub.accent{color:var(--accent2)}
</style>
