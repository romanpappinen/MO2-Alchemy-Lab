<template>
  <div>
    <div class="mv-statusbar">
      <span class="mv-status-text" :class="statusClass">{{ statusText }}</span>
      <label class="toggle-row">
        <input :checked="showAll" type="checkbox" @change="$emit('update:showAll', $event.target.checked)">
        {{ t('s2.allRows') }}
        <span v-if="!showAll" class="toggle-count">({{ displayRows.length }}/{{ rows.length }})</span>
      </label>
    </div>
    <div v-if="baseMVMode" class="basemv-info-bar">
      {{ t('s2.baseMVTableHint') }}
    </div>
    <div class="mv-scroll">
      <table class="mv-tbl">
        <thead>
          <tr>
            <th class="col-mv">MV</th>
            <th class="col-known">{{ t('s2.known') }}</th>
            <th v-if="baseMVMode" class="col-base">{{ t('s2.estimatedBase') }}</th>
            <th
              v-for="(p, i) in validPots"
              :key="i"
              class="col-val"
              :class="{'col-noisy': baseMVMode && p.nx < 2}"
            >
              {{ baseMVMode && p.nx < 2 ? '⚠ ' : '' }}A×L×B (З{{ i + 1 }}: {{ p.ntb }}+{{ p.nx }})
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in displayRows" :key="row.MVx" :class="{hit:row.hit, near:row.near}">
            <td class="col-mv">{{ fmtMVStr(row.MVx) }}{{ row.hit?' ✓':row.near?' ~':'' }}</td>
            <td class="col-known">{{ row.known }}</td>
            <td v-if="baseMVMode" class="col-base" :class="albClass(row.estimatedBase)">
              {{ row.estimatedBase != null ? row.estimatedBase.toFixed(3) : '—' }}
            </td>
            <td
              v-for="(alb, i) in row.albs"
              :key="i"
              class="col-val"
              :class="[albClass(alb), {'col-dim-noisy': baseMVMode && validPots[i]?.nx < 2}]"
            >
              {{ isFinite(alb) ? alb.toFixed(4) : '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from '@/composables/useI18n.js'

  const { t } = useI18n()

  const props = defineProps({
    rows: { type: Array, required: true },
    validPots: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    baseMVMode: { type: Boolean, default: false },
  })
  defineEmits(['update:showAll'])

  const hits = computed(() => props.rows.filter(r => r.hit))

  // When "show all" is off, only surface rows that matched (hit) or nearly
  // matched (near) — the full 301-row MV range is noise otherwise.
  // Falls back to the full list if nothing matched yet, so the table
  // is never silently empty.
  const displayRows = computed(() => {
    if (props.showAll) return props.rows
    const filtered = props.rows.filter(r => r.hit || r.near)
    return filtered.length > 0 ? filtered : props.rows
  })

  const statusClass = computed(() => {
    if (hits.value.length > 1) return 'status-warn'
    if (hits.value.length === 1) return 'status-ok'
    return 'status-muted'
  })

  const statusText = computed(() => {
    if (hits.value.length > 1) return t('s2.mvStatusMany', { n: hits.value.length, next: props.validPots.length + 1 })
    if (hits.value.length === 1) return t('s2.mvStatus1', { mv: (hits.value[0].MVx >= 0 ? '+' : '') + hits.value[0].MVx.toFixed(2) })
    const near = props.rows.filter(r => r.near)
    if (near.length > 0) return t('s2.mvStatusNear', { n: near.length })
    if (props.validPots.length >= 2) return t('s2.mvStatusNone')
    return t('s2.mvStatusNeed')
  })

  function fmtMVStr (v) {
    return (v >= 0 ? '+' : '') + v.toFixed(2)
  }
  function albClass (alb) {
    if (!Number.isFinite(alb)) return 'dim'
    if (alb > 0.001) return 'pos'
    if (alb < -0.001) return 'neg'
    return 'dim'
  }
</script>

<style scoped>
.mv-statusbar { display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px }
.mv-status-text { font-size:12px;color:var(--muted) }
.mv-status-text.status-ok   { color:var(--success) }
.mv-status-text.status-warn { color:var(--warn) }
.mv-status-text.status-muted { color:var(--muted) }
.basemv-info-bar { font-size:11px;color:var(--warn);background:var(--warn-bg);padding:5px 10px;border-radius:6px;margin-bottom:6px }
.col-noisy { color:var(--warn) !important;opacity:.7 }
.col-dim-noisy { opacity:.5 }
.col-base { text-align:right;min-width:80px;font-weight:600 }
.toggle-row { display:flex;align-items:center;gap:5px;cursor:pointer;font-size:11px;color:var(--muted) }
.toggle-row input { accent-color:var(--accent);cursor:pointer }
.toggle-count { color:var(--dim);font-family:var(--mono) }
.mv-scroll { overflow:auto;max-height:290px;border:1px solid var(--border);border-radius:8px }
.mv-tbl { width:100%;border-collapse:collapse;font-size:12px }
.mv-tbl th { padding:6px 9px;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);background:var(--s3);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:1 }
.mv-tbl td { padding:4px 9px;border-bottom:1px solid rgba(44,46,78,.4);font-family:var(--mono) }
.col-mv { text-align:left;min-width:72px }
.col-known { text-align:left;font-family:var(--ui);font-size:10px;color:var(--muted);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap }
.col-val { text-align:right;min-width:90px }
td.col-mv { color:var(--text);font-weight:500 }
td.pos { color:var(--success) }
td.neg { color:var(--danger) }
td.dim { color:var(--dim) }
tr.hit td { background:rgba(56,201,116,.06);color:var(--success) }
tr.hit td.col-mv,tr.hit td.col-known { color:var(--text) }
tr.near td { background:rgba(232,168,42,.05);color:var(--warn) }
tr.near td.col-mv,tr.near td.col-known { color:var(--text) }
</style>
