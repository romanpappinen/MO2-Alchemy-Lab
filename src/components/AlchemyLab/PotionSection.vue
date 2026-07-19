<template>
  <div>
    <div class="lib-header">
      <div><h2 class="lib-title">{{ t('pt.title') }} <span class="lib-count">{{ potionList.length }}</span></h2></div>
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input v-model="searchQuery" class="search-input" :placeholder="t('common.search')" type="text">
      </div>
    </div>

    <div v-if="potionList.length === 0" class="empty">
      <p class="empty-icon">🧪</p>
      <p class="empty-title">{{ t('pt.empty.title') }}</p>
      <p class="empty-sub">{{ t('pt.empty.sub') }}</p>
    </div>
    <div v-else-if="filtered.length === 0" class="empty" style="padding:24px">
      <p class="empty-sub">{{ t('pt.notFound') }}</p>
    </div>

    <div v-else class="table-wrap">
      <table class="lib-tbl">
        <thead>
          <tr>
            <th>{{ t('common.name') }}</th>
            <th>{{ t('pt.vial') }}</th>
            <th class="num">{{ t('pt.pu') }}</th>
            <th class="num">DH/PU</th>
            <th class="num bold">{{ t('pt.gulp') }}</th>
            <th class="num">HoT/PU</th>
            <th class="num">HL</th>
            <th class="num">DP/PU</th>
            <th class="num">PoT/PU</th>
            <th class="num">PL</th>
            <th class="num">{{ t('pt.apm') }}</th>
            <th class="num">{{ t('pt.ings') }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in filtered" :key="rec.id">
            <td class="td-name">{{ rec.name }}</td>
            <td class="td-vial">{{ vialLabel(rec.vialType) }}</td>
            <td class="num mono">{{ rec.calc?.PU??'—' }}</td>
            <td class="num" :class="hc(rec.calc?.props?.dh)">{{ fp(rec.calc?.props?.dh) }}</td>
            <td class="num bold" :class="hc(rec.calc?.gulp?.dh)">{{ fp(rec.calc?.gulp?.dh) }}</td>
            <td class="num" :class="hc(rec.calc?.props?.hot)">{{ fp(rec.calc?.props?.hot) }}</td>
            <td class="num" :class="hc(rec.calc?.props?.hl)">{{ fp(rec.calc?.props?.hl) }}</td>
            <td class="num" :class="pc(rec.calc?.props?.dp)">{{ fp(rec.calc?.props?.dp) }}</td>
            <td class="num" :class="pc(rec.calc?.props?.pot)">{{ fp(rec.calc?.props?.pot) }}</td>
            <td class="num" :class="pc(rec.calc?.props?.pl)">{{ fp(rec.calc?.props?.pl) }}</td>
            <td class="num mono dim">{{ rec.apm }}</td>
            <td class="num mono dim">{{ rec.lines?.length??0 }}</td>
            <td class="td-actions">
              <button class="edit-btn" @click="openPotionModal(rec.id)">✎</button>
              <button class="del-btn" @click="deletePotion(rec.id)">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { fmtProp, VIAL_TYPES } from '@/composables/potionCalc.js'
  import { useI18n } from '@/composables/useI18n.js'
  import { usePotionStore } from '@/composables/usePotionStore.js'

  const { t } = useI18n()
  const { potionList, openPotionModal, deletePotion } = usePotionStore()

  const searchQuery = ref('')
  const filtered = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    return q ? potionList.value.filter(r => r.name.toLowerCase().includes(q)) : potionList.value
  })
  function vialLabel (id) {
    return VIAL_TYPES.find(v => v.id === id)?.label ?? id
  }
  function fp (v) {
    return fmtProp(v)
  }
  function hc (v) {
    return !v || v === 0 ? 'dim' : 'pos'
  }
  function pc (v) {
    return !v || v === 0 ? 'dim' : 'neg'
  }
</script>

<style scoped>
.lib-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px}
.lib-title{font-size:18px;font-weight:600;color:var(--text)}
.lib-count{font-size:13px;color:var(--muted);font-weight:400;margin-left:6px;font-family:var(--mono)}
.search-wrap{position:relative;min-width:180px}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--dim);font-size:14px;pointer-events:none}
.search-input{background:var(--s1);border:1px solid var(--border);border-radius:7px;color:var(--text);font-size:13px;padding:8px 10px 8px 30px;width:100%;transition:border .15s;outline:none}
.search-input:focus{border-color:var(--accent)}
.search-input::placeholder{color:var(--dim)}
.empty{text-align:center;padding:48px 20px;color:var(--dim)}
.empty-icon{font-size:32px;margin-bottom:10px;opacity:.4}
.empty-title{font-size:16px;color:var(--muted);margin-bottom:5px;font-weight:500}
.empty-sub{font-size:13px}
.table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:10px}
.lib-tbl{width:100%;border-collapse:collapse;font-size:12px;white-space:nowrap}
.lib-tbl th{padding:9px 10px;text-align:left;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dim);background:var(--s2);border-bottom:1px solid var(--border)}
.lib-tbl th.num{text-align:right}.lib-tbl th.bold{font-weight:700;color:var(--text)}
.lib-tbl td{padding:9px 10px;border-bottom:1px solid rgba(44,46,78,.4);font-family:var(--mono);color:var(--dim)}
.td-name{color:var(--text);font-family:var(--ui);font-size:13px;font-weight:500}
.td-vial{color:var(--muted);font-family:var(--ui);font-size:12px}
.lib-tbl td.num{text-align:right}.lib-tbl td.mono{font-family:var(--mono)}
.lib-tbl td.dim{color:var(--dim)}.lib-tbl td.pos{color:var(--success)}.lib-tbl td.neg{color:var(--danger)}.lib-tbl td.bold{font-weight:600}
.lib-tbl tr:last-child td{border-bottom:none}
.lib-tbl tr:hover td{background:var(--s2)}
.td-actions{display:flex;gap:5px;justify-content:flex-end}
.edit-btn{background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--muted);font-size:12px;padding:3px 7px;transition:.15s}
.edit-btn:hover{border-color:var(--accent);color:var(--accent2)}
.del-btn{background:none;border:1px solid var(--border);border-radius:5px;cursor:pointer;color:var(--muted);font-size:11px;padding:3px 7px;transition:.15s}
.del-btn:hover{border-color:var(--danger);color:var(--danger)}
</style>
