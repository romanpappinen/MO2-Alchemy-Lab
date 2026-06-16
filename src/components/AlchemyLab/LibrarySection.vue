<template>
  <div class="library">
    <div class="lib-header">
      <div><h2 class="lib-title">{{ t('lib.title') }} <span class="lib-count">{{ library.length }}</span></h2></div>
      <div class="lib-tools">
        <div class="search-wrap">
          <span class="search-icon">⌕</span>
          <input v-model="searchQuery" class="search-input" :placeholder="t('common.search')" type="text">
        </div>
        <button class="btn btn-ghost btn-sm" :disabled="library.length === 0" @click="exportXLSX">{{ t('common.export') }}</button>
        <button class="btn btn-ghost btn-sm" @click="triggerImport">{{ t('common.import') }}</button>
        <input
          id="import-file"
          accept=".xlsx,.xls"
          style="display:none"
          type="file"
          @change="onImport"
        >
      </div>
    </div>

    <div v-if="library.length === 0" class="empty">
      <p class="empty-icon">⚗</p>
      <p class="empty-title">{{ t('lib.empty.title') }}</p>
      <p class="empty-sub">{{ t('lib.empty.sub') }}</p>
    </div>
    <div v-else-if="filteredLibrary.length === 0" class="empty" style="padding:24px">
      <p class="empty-sub">{{ t('lib.notFound') }}</p>
    </div>

    <div v-else class="table-wrap">
      <table class="lib-tbl">
        <thead>
          <tr>
            <th>{{ t('common.name') }}</th>
            <th class="num">AW</th>
            <th class="num">PDH</th><th class="num">PHoT</th><th class="num">PHL</th>
            <th class="num">PDP</th><th class="num">PPoT</th><th class="num">PPL</th>
            <th class="num">DHM</th><th class="num">HoTM</th><th class="num">HLM</th>
            <th class="num">DPM</th><th class="num">PoTM</th><th class="num">PLM</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="ing in filteredLibrary" :key="ing.id">
            <td class="td-name">{{ ing.name }}</td>
            <td class="num muted">{{ ing.hasAW?1:0 }}</td>
            <td class="num" :class="vc(ing.bases?.dh)">{{ lf(ing.bases?.dh) }}</td>
            <td class="num" :class="vc(ing.bases?.hot)">{{ lf(ing.bases?.hot) }}</td>
            <td class="num" :class="vc(ing.bases?.hl)">{{ lf(ing.bases?.hl) }}</td>
            <td class="num" :class="vc(ing.bases?.dp)">{{ lf(ing.bases?.dp) }}</td>
            <td class="num" :class="vc(ing.bases?.pot)">{{ lf(ing.bases?.pot) }}</td>
            <td class="num" :class="vc(ing.bases?.pl)">{{ lf(ing.bases?.pl) }}</td>
            <td class="num" :class="vc(ing.mvs?.dhm)">{{ lf(ing.mvs?.dhm) }}</td>
            <td class="num" :class="vc(ing.mvs?.hotm)">{{ lf(ing.mvs?.hotm) }}</td>
            <td class="num" :class="vc(ing.mvs?.hlm)">{{ lf(ing.mvs?.hlm) }}</td>
            <td class="num" :class="vc(ing.mvs?.dpm)">{{ lf(ing.mvs?.dpm) }}</td>
            <td class="num" :class="vc(ing.mvs?.potm)">{{ lf(ing.mvs?.potm) }}</td>
            <td class="num" :class="vc(ing.mvs?.plm)">{{ lf(ing.mvs?.plm) }}</td>
            <td class="td-actions">
              <button class="edit-btn" @click="openModal(ing.id)">✎</button>
              <button class="del-btn" @click="deleteIngredient(ing.id)">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { fmtLib } from '@/composables/useAlchemyCalc.js'
  import { useAlchemyStore } from '@/composables/useAlchemyStore.js'
  import { useI18n } from '@/composables/useI18n.js'

  const { t } = useI18n()
  const { library, searchQuery, filteredLibrary, deleteIngredient, exportXLSX, importXLSX, openModal } = useAlchemyStore()

  function triggerImport () {
    document.querySelector('#import-file').click()
  }
  function onImport (e) {
    importXLSX(e.target.files[0]); e.target.value = ''
  }
  function lf (v) {
    return fmtLib(v)
  }
  function vc (v) {
    if (!v || v === 0) return 'dim'; return +v > 0 ? 'pos' : 'neg'
  }
</script>

<style scoped>
.library{}
.lib-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px}
.lib-title{font-size:18px;font-weight:600;color:var(--text)}
.lib-count{font-size:13px;color:var(--muted);font-weight:400;margin-left:6px;font-family:var(--mono)}
.lib-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.search-wrap{position:relative;flex:1;min-width:160px}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--dim);font-size:14px;pointer-events:none}
.search-input{background:var(--s1);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;padding:8px 10px 8px 30px;width:100%;transition:border .15s;outline:none}
.search-input:focus{border-color:var(--accent)}
.search-input::placeholder{color:var(--dim)}
.empty{text-align:center;padding:48px 20px;color:var(--dim)}
.empty-icon{font-size:36px;margin-bottom:12px;opacity:.4}
.empty-title{font-size:16px;color:var(--muted);margin-bottom:6px;font-weight:500}
.empty-sub{font-size:13px}
.table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:10px}
.lib-tbl{width:100%;border-collapse:collapse;font-size:12px;white-space:nowrap}
.lib-tbl th{padding:9px 10px;text-align:left;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);background:var(--s2);border-bottom:1px solid var(--border)}
.lib-tbl th.num{text-align:right}
.lib-tbl td{padding:9px 10px;border-bottom:1px solid rgba(44,46,78,.4);font-family:var(--mono);color:var(--dim)}
.lib-tbl td.td-name{color:var(--text);font-family:var(--ui);font-size:13px}
.lib-tbl td.num{text-align:right}
.lib-tbl td.muted{color:var(--muted)}
.lib-tbl td.pos{color:var(--success)}.lib-tbl td.neg{color:var(--danger)}.lib-tbl td.dim{color:var(--dim)}
.lib-tbl tr:last-child td{border-bottom:none}
.lib-tbl tr:hover td{background:var(--s2)}
.td-actions{display:flex;gap:5px;justify-content:flex-end}
.edit-btn{background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--muted);font-size:12px;padding:3px 7px;transition:.15s}
.edit-btn:hover{border-color:var(--accent);color:var(--accent2)}
.del-btn{background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--muted);font-size:11px;padding:3px 7px;transition:.15s}
.del-btn:hover{border-color:var(--danger);color:var(--danger)}
</style>
