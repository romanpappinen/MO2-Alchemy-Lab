// Test suite for the craft-tree data and per-metal calc() functions.
// Runs on Node's built-in test runner (node --test) — no dependencies;
// craftConstants.js and refineRecipes.js are pure ESM with no Vue imports.
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { METALS } from '../src/composables/craftConstants.js'
import { RECIPES } from '../src/composables/refineRecipes.js'

const t = k => k

// Byproduct-quantity option fields → the material they count.
// (Flag/meta fields like isSulfur, coalTotal, useCalxPowder, calxPowderCat,
// galbFromBlo are not quantities-per-batch and are not listed here.)
const BYPRODUCT_MATERIAL = {
  aabam: 'Aabam', calamine: 'Calamine', silver: 'Silver', gold: 'Gold',
  galb: 'Galbinum', gp: 'Granum Powder', almine: 'Almine', arconite: 'Arconite',
  coal: 'Coal', lup: 'Lupium', pyrite: 'Pyrite', bloByproduct: 'Blood Ore',
  waterstone: 'Waterstone', bleck: 'Bleck', electrum: 'Electrum', sulfur: 'Sulfur',
  chalkGlance: 'Chalk Glance', calspar: 'Calspar', calxPowder: 'Calx Powder',
  mal: 'Malachite', saburraP: 'Saburra Powder', bleckblende: 'Bleckblende',
}

// What each step's `yield` measures (step ids are consistent across metals).
const STEP_MATERIAL = {
  sang: 'Sanguinite', rb: 'Red Bleckblende', lup: 'Lupium', al: 'Almine',
  blo: 'Blood Ore', calx: 'Calx Powder', pig: 'Pig Iron', gal: 'Galbinum',
  pyr: 'Pyroxene', coke: 'Coke', saburra: 'Saburra Powder', cup: 'Cuprum',
  mal: 'Malachite', cals: 'Calspar', sab: 'Saburra Powder', gem: 'Gem Metal',
  bleck: 'Bleck', skad: 'Skadite', cg: 'Chalk Glance',
}

// '10 000 Calspar + 1 000 Ichor' → [{name:'Calspar',amount:10000}, {name:'Ichor',amount:1000}]
function parseInput (input) {
  return input.split(' + ').map(part => {
    const m = part.trim().match(/^([\d\s]*?\d)\s+([A-Z].*)$/i)
    assert.ok(m, `unparseable input part: '${part}' in '${input}'`)
    return { name: m[2].trim(), amount: Number(m[1].replace(/\D/g, '')) }
  })
}

function findRecipe (inputMat, building, cats) {
  return RECIPES.filter(rc =>
    rc.input.name === inputMat.name
    && rc.building === building
    && rc.catalysts.length === cats.length
    && cats.every(c => rc.catalysts.some(rcat => rcat.name === c.name && rcat.amount === c.amount)))
}

function calc (metal, { target, sel = metal.defaultSel, bon = {}, tools = {} } = {}) {
  return metal.calc(target ?? (metal.craftYield || 7000), sel, bon, tools, t)
}

// Material rows after the totals:true marker (the base-resources section),
// keyed by name. Bonus/byproduct rows, tree.* template rows, and rows that
// round to zero (float noise around an exactly-covered need) are skipped.
function baseRows (tree) {
  const rows = new Map()
  let after = false
  for (const row of tree) {
    if (row.divider) {
      continue
    }
    if (row.totals) {
      after = true
      continue
    }
    if (!after || row.name.startsWith('tree.') || Math.abs(row.amount) < 1e-6) {
      continue
    }
    rows.set(row.name, row.amount)
  }
  return rows
}

function assertClose (actual, expected, tol, msg) {
  assert.ok(Math.abs(actual - expected) <= tol, `${msg}: ${actual} !≈ ${expected} (±${tol})`)
}

// Selections to sweep: defaults, one-step-at-a-time variations covering every
// option, plus seeded-random full combinations for cross-step interactions.
function* selCombos (metal, randomCount = 150) {
  yield { ...metal.defaultSel }
  for (const step of metal.steps) {
    for (let i = 0; i < step.options.length; i++) {
      if (i !== metal.defaultSel[step.id]) {
        yield { ...metal.defaultSel, [step.id]: i }
      }
    }
  }
  let seed = 42
  const rnd = () => (seed = (seed * 1_103_515_245 + 12_345) & 0x7f_ff_ff_ff) / 0x80_00_00_00
  for (let n = 0; n < randomCount; n++) {
    const sel = {}
    for (const step of metal.steps) {
      sel[step.id] = Math.floor(rnd() * step.options.length)
    }
    yield sel
  }
}

const TOOL_COMBOS = [{}, { Crusher: false }, { Grinder: false }]
const BON_COMBOS = [{}, { ironmaster: true }, { extractBonus: 15 }]

describe('data integrity: step options vs refineRecipes.js', () => {
  for (const metal of METALS) {
    it(metal.id, () => {
      for (const step of metal.steps) {
        const material = STEP_MATERIAL[step.id]
        assert.ok(material, `no STEP_MATERIAL entry for step '${step.id}'`)
        for (const opt of step.options) {
          const where = `${metal.id}/${step.id}/'${opt.label}'`
          const [inputMat, ...cats] = parseInput(opt.input)
          const matches = findRecipe(inputMat, opt.furnace, cats)
          assert.equal(matches.length, 1, `${where}: expected exactly 1 recipe match, got ${matches.length}`)
          const rec = matches[0]
          assert.equal(rec.input.amount, inputMat.amount, `${where}: input batch size`)
          if (cats.length === 1 && typeof opt.catAmt === 'number' && opt.catAmt > 0) {
            assert.equal(opt.catAmt, cats[0].amount, `${where}: catAmt vs input string`)
          }
          const out = name => rec.outputs.find(o => o.name === name)?.amount ?? 0
          assert.equal(out(material), opt.yield, `${where}: yield of ${material}`)
          for (const [field, mat] of Object.entries(BYPRODUCT_MATERIAL)) {
            if (typeof opt[field] === 'number') {
              assert.equal(out(mat), opt[field], `${where}: byproduct ${field} (${mat})`)
            }
          }
        }
      }
    })
  }
})

describe('alloy sanity', () => {
  for (const metal of METALS) {
    it(metal.id, () => {
      const alloys = RECIPES.filter(rc => rc.kind === 'alloy' && rc.outputs.some(o => o.name === metal.name))
      if (metal.id === 'skadite') {
        assert.equal(alloys.length, 0, 'Skadite must not be a Refining Oven alloy')
        assert.equal(metal.furnace, 'Fabricula')
        assert.equal(metal.craftYield, 3200)
      } else {
        assert.equal(alloys.length, 1, `expected exactly one alloy recipe for ${metal.name}`)
        const rec = alloys[0]
        assert.equal(rec.building, 'Refining Oven')
        assert.equal(rec.input.amount, 10_000)
        assert.deepEqual(rec.catalysts.map(c => c.amount), [5000, 5000])
        assert.equal(rec.outputs.find(o => o.name === metal.name).amount, 7000)
        assert.equal(metal.craftYield ?? 7000, 7000)
      }
    })
  }
})

describe('calc invariants: finite, non-negative, linear in target', () => {
  for (const metal of METALS) {
    it(metal.id, () => {
      for (const sel of selCombos(metal)) {
        for (const tools of TOOL_COMBOS) {
          for (const bon of BON_COMBOS) {
            const where = `${metal.id} sel=${JSON.stringify(sel)} tools=${JSON.stringify(tools)} bon=${JSON.stringify(bon)}`
            const res1 = calc(metal, { target: 10_000, sel, bon, tools })
            const res2 = calc(metal, { target: 20_000, sel, bon, tools })
            assert.ok(Number.isFinite(res1.runs), `${where}: runs not finite`)
            assertClose(res2.runs, 2 * res1.runs, 1e-9 * res2.runs, `${where}: runs not linear`)
            assert.equal(res1.tree.length, res2.tree.length, `${where}: tree shape changed with target`)
            for (const [i, row] of res1.tree.entries()) {
              if (row.divider) {
                continue
              }
              const a = row.amount, b = res2.tree[i].amount
              assert.ok(Number.isFinite(a), `${where}: '${row.name}' amount not finite`)
              assert.ok(a >= -1e-6, `${where}: '${row.name}' negative amount ${a}`)
              assertClose(b, 2 * a, 1e-9 * Math.max(1, Math.abs(b)), `${where}: '${row.name}' not linear`)
            }
          }
        }
      }
    })
  }
})

describe('totals marker: exactly one totals:true row per tree', () => {
  for (const metal of METALS) {
    it(metal.id, () => {
      for (const sel of selCombos(metal, 0)) {
        const res = calc(metal, { sel })
        const count = res.tree.filter(row => row.totals).length
        assert.equal(count, 1, `${metal.id} sel=${JSON.stringify(sel)}: ${count} totals rows`)
      }
    })
  }
})

describe('perk semantics', () => {
  it('ironmaster divides the alloy-component rows by 1.03 (Refining Oven metals)', () => {
    for (const metal of METALS) {
      if (metal.id === 'skadite') {
        continue
      }
      const plain = calc(metal, {}).tree
      const im = calc(metal, { bon: { ironmaster: true } }).tree
      // Row 0 is the target (unchanged); rows 2–4 are the 10000+5000+5000
      // alloy components — the first-level Refining Oven needs.
      assert.equal(im[0].amount, plain[0].amount, `${metal.id}: target row changed`)
      for (const i of [2, 3, 4]) {
        assertClose(im[i].amount, plain[i].amount / 1.03, 1e-9 * plain[i].amount,
          `${metal.id}: row ${i} '${plain[i].name}'`)
      }
    }
  })

  it('ironmaster leaves Skadite entirely unchanged (no Refining Oven in its chain)', () => {
    const metal = METALS.find(m => m.id === 'skadite')
    for (const sel of selCombos(metal, 0)) {
      const plain = calc(metal, { sel })
      const im = calc(metal, { sel, bon: { ironmaster: true } })
      assert.deepEqual(im, plain, `skadite sel=${JSON.stringify(sel)}`)
    }
  })

  it('extract bonus never increases a base-resource need (default selections)', () => {
    // Only asserted on defaultSel: with off-default selections, byproduct
    // cross-crediting legitimately lets an individual ore grow (fewer batches
    // of one chain → less byproduct → another chain covers the gap).
    for (const metal of METALS) {
      for (const em of [5, 15, 25]) {
        const plain = baseRows(calc(metal, {}).tree)
        const boosted = baseRows(calc(metal, { bon: { extractBonus: em } }).tree)
        for (const [name, amount] of boosted) {
          const before = plain.get(name)
          assert.ok(before !== undefined, `${metal.id} em=${em}: '${name}' appeared with bonus`)
          assert.ok(amount <= before + 1e-9, `${metal.id} em=${em}: '${name}' grew ${before} → ${amount}`)
        }
      }
    }
  })
})

describe('regression pins (hand-derived values)', () => {
  const metal = id => METALS.find(m => m.id === id)

  it('Messing @7000 defaults: Saburra covers Malachite + Saburra Powder jointly', () => {
    const rows = baseRows(calc(metal('messing'), { target: 7000 }).tree)
    assertClose(rows.get('Saburra'), 126_262.63, 0.01, 'Saburra')
  })

  it('Bron @7000 defaults: same Saburra total; Bleckblende fully covered by its byproduct', () => {
    const tree = calc(metal('bron'), { target: 7000 }).tree
    const rows = baseRows(tree)
    assertClose(rows.get('Saburra'), 126_262.63, 0.01, 'Saburra')
    assert.equal(rows.get('Bleckblende'), undefined, 'Bleckblende should not need mining on defaults')
    let after = false
    const bonuses = tree.filter(row => {
      if (row.totals) {
        after = true
      }
      return after && !row.divider && row.tagLabel === 'bonus'
    })
    assert.equal(bonuses.length, 1, 'expected one bonus row in the totals section')
    assertClose(bonuses[0].amount, 11_666.67, 0.01, 'Bleckblende surplus')
  })

  it('Tindremic Messing @7000 defaults: Saburra total', () => {
    const rows = baseRows(calc(metal('tindremic'), { target: 7000 }).tree)
    assertClose(rows.get('Saburra'), 180_375.18, 0.01, 'Saburra')
  })

  it('Skadite @3200 defaults: exactly one Fabricula craft, balanced chain', () => {
    const res = calc(metal('skadite'), { target: 3200 })
    assertClose(res.runs, 1, 1e-12, 'runs')
    const cg = res.tree.find(row => !row.divider && row.name === 'Chalk Glance')
    assertClose(cg.amount, 10_000, 1e-9, 'Chalk Glance')
    const rows = baseRows(res.tree)
    assertClose(rows.get('Calx'), 558_035.71, 0.01, 'Calx')
    assertClose(rows.get('Dragon Salt'), 4190, 0.01, 'Dragon Salt')
    assertClose(rows.get('Water'), 55_803.57, 0.01, 'Water')
  })
})
