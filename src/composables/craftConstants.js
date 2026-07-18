// ─── Mortal Online 2 craft-tree data ───────────────────────────────────────
// Extracted from mortal_craft_calc_v5.html. Each metal has its own bespoke
// calc() — the crafting trees differ enough between metals (byproduct pools,
// BF/GN equation systems, etc.) that a shared abstraction would obscure more
// than it clarifies, so this mirrors the original per-metal structure 1:1.

// Proportional calc — no ceil() anywhere, exact fractional numbers.
// r(need, recipeOut, recipeIn) → how much input is needed to get 'need' output
export function r (need, recipeOut, recipeIn) {
  return (need / recipeOut) * recipeIn
}

export const METALS = [
{
  id:'oghmium', name:'Oghmium',
  defaultSel:{sang:1, rb:2, lup:0, al:0, blo:3, calx:1, pig:1, gal:2, pyr:4, coke:1},
  steps:[
    {id:'sang', label:'Sanguinite', options:[
      {label:'Rock Oil',        furnace:'Blast Furnace', input:'10 000 Red Bleckblende + 1 000 Rock Oil',  yield:140, cat:'Rock Oil',   catAmt:1000, aabam:3000, calamine:240,  silver:200},
      {label:'Fuming Salt ★',  furnace:'Blast Furnace', input:'10 000 Red Bleckblende + 320 Fuming Salt', yield:200, cat:'Fuming Salt',catAmt:320,  aabam:3000, calamine:455,  silver:350,},
      {label:'Coke',            furnace:'Furnace',       input:'10 000 Red Bleckblende + 438 Coke',        yield:23,  cat:'Coke',       catAmt:438,  aabam:2322, calamine:568,  silver:158},
    ]},
    {id:'rb', label:'Red Bleckblende', options:[
      {label:'Grinder + Bor',                   furnace:'Grinder',        input:'10 000 Tephra + 720 Bor',          yield:807,  cat:'Bor',        catAmt:720,  galb:1999},
      {label:'Grinder + Water',                 furnace:'Grinder',        input:'10 000 Tephra + 1 000 Water',      yield:768,  cat:'Water',      catAmt:1000, galb:1900},
      {label:'Greater Natorus + Calx Powder ★', furnace:'Greater Natorus',input:'10 000 Tephra + 800 Calx Powder',  yield:2600, cat:'CalxPowder', catAmt:800,  galb:499, },
      {label:'Greater Natorus + Bor',           furnace:'Greater Natorus',input:'10 000 Tephra + 900 Bor',          yield:2132, cat:'Bor',        catAmt:900,  galb:1249},
      {label:'Furnace + Calx Powder',           furnace:'Furnace',        input:'10 000 Tephra + 800 Calx Powder',  yield:2080, cat:'CalxPowder', catAmt:800,  galb:299},
    ]},
    {id:'lup', label:'Lupium (extra)', options:[
      {label:'Blast Furnace + Waterstone + Fuming Salt ★', furnace:'Blast Furnace', input:'10 000 Waterstone + 360 Fuming Salt', yield:3200, cat:'Fuming Salt', catAmt:360, base:'Waterstone',},
      {label:'Blast Furnace + Waterstone + Bor',           furnace:'Blast Furnace', input:'10 000 Waterstone + 720 Bor',         yield:2048, cat:'Bor',         catAmt:720, base:'Waterstone'},
      {label:'Fabricula + Waterstone + Fuming Salt',       furnace:'Fabricula',     input:'10 000 Waterstone + 360 Fuming Salt', yield:2400, cat:'Fuming Salt', catAmt:360, base:'Waterstone'},
      {label:'Blast Furnace + Galbinum + Calx Powder',     furnace:'Blast Furnace', input:'10 000 Galbinum + 640 Calx Powder',   yield:298,  cat:'CalxPowder', catAmt:640, base:'Galbinum'},
    ]},
    {id:'al', label:'Almine / Arconite', options:[
      {label:'Blast Furnace',     furnace:'Blast Furnace',  input:'10 000 Pyroxene + 800 Calx Powder', almine:400,  arconite:800, yield:400,  cat:'CalxPowder', catAmt:800},
      {label:'Greater Natorus ★', furnace:'Greater Natorus',input:'10 000 Pyroxene + 800 Calx Powder', almine:2000, arconite:160, yield:2000, cat:'CalxPowder', catAmt:800,},
    ]},
    {id:'blo', label:'Blood Ore', options:[
      {label:'Grinder + Gabore + Bor',              furnace:'Grinder',  input:'10 000 Gabore + 630 Bor',          yield:226,  cat:'Bor',        catAmt:630, base:'Gabore', galb:1050, galbFromBlo:true},
      {label:'Furnace + Gabore + Coke',             furnace:'Furnace',  input:'10 000 Gabore + 360 Coke',         yield:568,  cat:'Coke',       catAmt:360, base:'Gabore', galb:236,  galbFromBlo:true},
      {label:'Crusher + Granum',                    furnace:'Crusher',  input:'10 000 Granum',                    yield:770,  cat:null,         catAmt:0,   base:'Granum', gp:2940},
      {label:'Attractor + Granum + Calx Powder ★',  furnace:'Attractor',input:'10 000 Granum + 720 Calx Powder',  yield:1980, cat:'CalxPowder', catAmt:720, base:'Granum',},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher', input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder', input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
    {id:'pig', label:'Pig Iron', options:[
      {label:'Furnace',         furnace:'Furnace',       input:'10 000 Blood Ore + 400 Coke', yield:4000, catAmt:400},
      {label:'Blast Furnace ★', furnace:'Blast Furnace', input:'10 000 Blood Ore + 390 Coke', yield:5000, catAmt:390,},
      {label:'Furnace + Sulfur',furnace:'Furnace',       input:'10 000 Blood Ore + 580 Sulfur',yield:4000,catAmt:580, isSulfur:true},
    ]},
    {id:'gal', label:'Galbinum', options:[
      {label:'Grinder + Gabore + Bor',           furnace:'Grinder',        input:'10 000 Gabore + 630 Bor',         yield:1050, cat:'Bor',        catAmt:630, base:'Gabore', bloByproduct:226},
      {label:'Furnace + Gabore + Coke',          furnace:'Furnace',        input:'10 000 Gabore + 360 Coke',        yield:236,  cat:'Coke',       catAmt:360, base:'Gabore', bloByproduct:568},
      {label:'Grinder + Tephra + Bor ★',         furnace:'Grinder',        input:'10 000 Tephra + 720 Bor',         yield:1999, cat:'Bor',        catAmt:720, base:'Tephra',},
      {label:'Grinder + Tephra + Water',         furnace:'Grinder',        input:'10 000 Tephra + 1 000 Water',     yield:1900, cat:'Water',      catAmt:1000,base:'Tephra'},
      {label:'Greater Natorus + Tephra + CalxP', furnace:'Greater Natorus',input:'10 000 Tephra + 800 Calx Powder', yield:499,  cat:'CalxPowder', catAmt:800, base:'Tephra'},
      {label:'Greater Natorus + Tephra + Bor',   furnace:'Greater Natorus',input:'10 000 Tephra + 900 Bor',         yield:1249, cat:'Bor',        catAmt:900, base:'Tephra'},
      {label:'Furnace + Tephra + Calx Powder',   furnace:'Furnace',        input:'10 000 Tephra + 800 Calx Powder', yield:299,  cat:'CalxPowder', catAmt:800, base:'Tephra'},
    ]},
    {id:'pyr', label:'Pyroxene', options:[
      {label:'Blast Furnace + Calx Powder',  furnace:'Blast Furnace',  input:'10 000 Galbinum + 640 Calx Powder', yield:1230, cat:'CalxPowder', catAmt:640, lup:298},
      {label:'Blast Furnace + Coke ★',       furnace:'Blast Furnace',  input:'10 000 Galbinum + 390 Coke',        yield:1760, cat:'Coke',       catAmt:390, lup:245,},
      {label:'Blast Furnace + Bor',          furnace:'Blast Furnace',  input:'10 000 Galbinum + 720 Bor',         yield:1400, cat:'Bor',        catAmt:720, lup:245},
      {label:'Furnace + Calx Powder',        furnace:'Furnace',        input:'10 000 Galbinum + 480 Calx Powder', yield:696,  cat:'CalxPowder', catAmt:480, lup:170, pyrite:55},
      {label:'Greater Natorus + Coke',       furnace:'Greater Natorus',input:'10 000 Galbinum + 390 Coke',        yield:4200, cat:'Coke',       catAmt:390, lup:62,  pyrite:652},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM = bon.ironmaster ? 1.03 : 1;
    const EM = 1 + (bon.extractBonus||0)/100;
    const RO = 7000 * IM;
    const T  = target;
    const isAvail = name => tools[name] !== false;

    const sangR = this.steps[0].options[sel.sang??1];
    const rbR   = this.steps[1].options[sel.rb??2];
    const lupR  = this.steps[2].options[sel.lup??0];
    const bloR  = this.steps[4].options[sel.blo??3];
    const pigR  = this.steps[6].options[sel.pig??1];
    const galR  = this.steps[7].options[sel.gal??2];
    const pyrR  = this.steps[8].options[sel.pyr??4];
    const cokeR = this.steps[9].options[sel.coke??1];

    // ── TOP LEVEL ──
    // Oghmium: 10000 Tungsteel + 5000 Cronite + 5000 Sanguinite → RO
    const needTung = r(T, RO, 10000);
    const needCron = r(T, RO, 5000);
    const needSang = r(T, RO, 5000);

    // ── TUNGSTEEL ──
    // Tungsteel: 10000 Grain Steel + 5000 Lupium + 5000 Granum Powder → RO
    const needGS_tung = r(needTung, RO, 10000);
    const needLup     = r(needTung, RO, 5000);
    const needGP      = r(needTung, RO, 5000);

    // ── CRONITE ──
    // Cronite: 10000 Grain Steel + 5000 Almine + 5000 Arconite → RO
    const needGS_cron = r(needCron, RO, 10000);
    const needAl      = r(needCron, RO, 5000);
    const needArc     = r(needCron, RO, 5000);

    // ── GRAIN STEEL (суммарно) ──
    // Grain Steel: 10000 Pig Iron + 5000 Coke + 5000 Calx Powder → RO
    const needGS      = needGS_tung + needGS_cron;
    const needPig     = r(needGS, RO, 10000);
    const needCoke_gs = r(needGS, RO, 5000);
    const needCP_gs   = r(needGS, RO, 5000);

    // ── ALMINE + ARCONITE: система уравнений для микса BF / GN ──
    // BF: almine=400*EM, arconite=800*EM per batch (10000 Pyroxene)
    // GN: almine=2000*EM, arconite=160*EM per batch
    const BF_al=400*EM, BF_arc=800*EM, GN_al=2000*EM, GN_arc=160*EM;
    const det = BF_al*GN_arc - GN_al*BF_arc;
    let xBF = (needAl*GN_arc - needArc*GN_al) / det;
    let yGN = (BF_al*needArc - BF_arc*needAl) / det;
    if (xBF < 0) { xBF=0; yGN=Math.max(needAl/GN_al, needArc/GN_arc); }
    if (yGN < 0) { yGN=0; xBF=Math.max(needAl/BF_al, needArc/BF_arc); }
    const needPyrox       = (xBF + yGN) * 10000;
    const cpForAlmine     = (xBF + yGN) * 800;
    const alActual        = xBF*BF_al + yGN*GN_al;
    const arcActual       = xBF*BF_arc + yGN*GN_arc;

    // ── PYROXENE ← Galbinum ──
    const pyrYield    = pyrR.yield * EM;
    const needGalb_pyr = r(needPyrox, pyrYield, 10000);
    const lupFromPyr  = r(needPyrox, pyrYield, pyrR.lup);
    const pyriteFromPyr = pyrR.pyrite ? r(needPyrox, pyrYield, pyrR.pyrite) : 0;
    const cpForPyr    = pyrR.cat==='CalxPowder' ? r(needPyrox, pyrYield, pyrR.catAmt) : 0;
    const cokeForPyr  = pyrR.cat==='Coke'       ? r(needPyrox, pyrYield, pyrR.catAmt) : 0;
    const borForPyr   = pyrR.cat==='Bor'        ? r(needPyrox, pyrYield, pyrR.catAmt) : 0;

    // ── SANGUINITE ← Red Bleckblende ──
    const sangYield = sangR.yield * EM;
    const needRB    = r(needSang, sangYield, 10000);
    const sangCat   = r(needSang, sangYield, sangR.catAmt);
    const aabamBonus    = r(needSang, sangYield, sangR.aabam);
    const calamineBonus = r(needSang, sangYield, sangR.calamine);
    const silverBonus   = r(needSang, sangYield, sangR.silver);

    // ── RED BLECKBLENDE ← Tephra ──
    const rbYield   = rbR.yield * EM;
    const needTeph  = r(needRB, rbYield, 10000);
    const rbCat     = r(needRB, rbYield, rbR.catAmt);
    const galbFromRB = r(needRB, rbYield, rbR.galb); // Galbinum побочка из Tephra

    // ── BLOOD ORE ← база ──
    const bloYield    = bloR.yield * EM;
    const needBO      = r(needPig, pigR.yield*EM, 10000);
    const cokeForPig  = pigR.isSulfur ? 0 : r(needPig, pigR.yield*EM, pigR.catAmt);
    const sulfurForPig= pigR.isSulfur ? r(needPig, pigR.yield*EM, pigR.catAmt) : 0;

    const needBloBase = r(needBO, bloYield, 10000);
    const bloCat      = r(needBO, bloYield, bloR.catAmt);
    const galbFromBlo = bloR.galbFromBlo ? r(needBO, bloYield, bloR.galb) : 0;
    const gpFromBlo   = bloR.gp ? r(needBO, bloYield, bloR.gp) : 0;

    // ── GRANUM POWDER: побочка Blood Ore (crusher), если не хватает — доп. прогоны ──
    const gpExtra     = Math.max(0, needGP - gpFromBlo);
    const granumForGP = gpExtra > 0 ? r(gpExtra, 2940*EM, 10000) : 0;
    const bloFromGranumExtra = granumForGP > 0 ? r(granumForGP*EM, 10000, 770) : 0;
    const gpBonus     = Math.max(0, gpFromBlo - needGP);

    // ── GALBINUM пул: нужно для Pyroxene + Lupium (если base=Galbinum) ──
    const galbPool = galbFromRB + galbFromBlo;

    // ── GALBINUM для Pyroxene ← вычитаем побочку ──
    const netGalb_pyr = Math.max(0, needGalb_pyr - galbPool);
    const galbUsedFromPool = Math.min(galbPool, needGalb_pyr);
    const galbPoolRemainder = Math.max(0, galbPool - needGalb_pyr);

    // ── LUPIUM: вычитаем побочку из Pyroxene ──
    const netLup      = Math.max(0, needLup - lupFromPyr);
    const lupFromPyrUsed = Math.min(lupFromPyr, needLup);
    const lupBonus    = Math.max(0, lupFromPyr - needLup);

    // Если нужно докрафтить Lupium
    const lupYield    = lupR.yield * EM;
    const needLupExtra = netLup > 0 ? r(netLup, lupYield, 10000) : 0;
    const lupCat      = netLup > 0 ? r(netLup, lupYield, lupR.catAmt) : 0;
    // Если Lupium из Galbinum — нужен доп. Galbinum
    const needGalb_lup = (lupR.base==='Galbinum' && netLup>0) ? needLupExtra : 0;
    const cpForLup    = (lupR.cat==='CalxPowder' && netLup>0) ? lupCat : 0;
    const borForLup   = (lupR.cat==='Bor'        && netLup>0) ? lupCat : 0;
    const fsForLup    = (lupR.cat==='Fuming Salt' && netLup>0) ? lupCat : 0;

    // Waterstone → Amarantum → Granum
    let needWS=0, needAmarantum=0, granumForWS=0;
    let granumFromAmarantum_blo=0, granumFromAmarantum_gp=0;
    if (lupR.base==='Waterstone' && netLup>0) {
      needWS = needLupExtra;
      needAmarantum = r(needWS, 900*EM, 10000);
      granumForWS   = r(needAmarantum, 882*EM, 10000);
      // Amarantum даёт побочки: Blood Ore (770), Granum Powder (2940)
      granumFromAmarantum_blo = r(needAmarantum, 882*EM, 770);
      granumFromAmarantum_gp  = r(needAmarantum, 882*EM, 2940);
    }

    // Итоговый Galbinum для крафта (Pyroxene + Lupium)
    const totalGalbNeeded = netGalb_pyr + needGalb_lup;
    const galYield  = galR.yield * EM;
    const needGalBase = totalGalbNeeded > 0 ? r(totalGalbNeeded, galYield, 10000) : 0;
    const galCat    = totalGalbNeeded > 0 ? r(totalGalbNeeded, galYield, galR.catAmt) : 0;
    const bloFromGal = galR.bloByproduct ? r(totalGalbNeeded > 0 ? needGalBase : 0, galYield, galR.bloByproduct) : 0;

    // ── CALX POWDER суммарно ──
    const cpForBlo  = bloR.cat==='CalxPowder' ? bloCat : 0;
    const cpForGal  = galR.cat==='CalxPowder' ? galCat : 0;
    const cpForRB   = rbR.cat==='CalxPowder'  ? rbCat  : 0;
    let totalCP = needCP_gs + cpForBlo + cpForAlmine + cpForPyr + cpForGal + cpForRB + cpForLup;

    // ── COKE суммарно (предв., без coke-рецепта-катализатора) ──
    const cokeForSang = sangR.cat==='Coke' ? sangCat : 0;
    const cokeForBlo  = bloR.cat==='Coke'  ? bloCat  : 0;
    const cokeForGal  = galR.cat==='Coke'  ? galCat  : 0;
    const totalCoke_pre = needCoke_gs + cokeForPig + cokeForPyr + cokeForSang + cokeForBlo + cokeForGal;

    // Coke рецепт
    const cokeYield  = 7200 * EM;
    const needCoal_coke = r(totalCoke_pre, cokeYield, cokeR.coalTotal);
    const cpForCoke  = cokeR.useCalxPowder ? r(totalCoke_pre, cokeYield, cokeR.calxPowderCat) : 0;
    totalCP += cpForCoke;

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть Calx Powder и Coal без остатка ──
    // (тот же приём, что и Almine/Arconite выше: оба рецепта дают Calx Powder + Coal
    // из одной руды в разных пропорциях, поэтому можно попасть в обе потребности сразу)
    const calxCrusher = this.steps[5].options[0], calxGrinder = this.steps[5].options[1];
    const totalCoalNeed = needCoal_coke;
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (totalCP*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*totalCP) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=totalCP/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=totalCP/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = totalCP/cpCr;
    } else {
      yGrinder = totalCP/cpGr;
    }
    const needCalxTotal = (xCrusher + yGrinder) * 10000;
    const waterForCalx  = yGrinder * calxGrinder.catAmt;
    const coalFromCalx  = xCrusher*coalCr + yGrinder*coalGr;

    // ── COAL ──
    const netCoal = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed);

    // ── БАЗОВЫЕ РУДЫ ──
    let needGranum=0, needGabore=0, needTephra=0;
    if (bloR.base==='Granum')  needGranum += needBloBase;
    if (bloR.base==='Gabore')  needGabore += needBloBase;
    if (galR.base==='Gabore')  needGabore += needGalBase;
    if (galR.base==='Tephra')  needTephra += needGalBase;
    if (lupR.base==='Waterstone') needGranum += granumForWS;
    needGranum += granumForGP;
    // Tephra из Red Bleckblende
    needTephra += needTeph;

    // ── КАТАЛИЗАТОРЫ ──
    const needBor  = (rbR.cat==='Bor'  ? rbCat : 0)
                   + (bloR.cat==='Bor'  ? bloCat : 0)
                   + (galR.cat==='Bor'  ? galCat : 0)
                   + borForPyr + borForLup;
    const needFS   = (sangR.cat==='Fuming Salt' ? sangCat : 0) + fsForLup;
    const needRO   = sangR.cat==='Rock Oil'  ? sangCat : 0;
    const needSulfur = sulfurForPig;
    const needWater  = (rbR.cat==='Water'   ? rbCat   : 0)
                     + (galR.cat==='Water'   ? galCat  : 0)
                     + waterForCalx;

    // ── ДЕРЕВО ──
    const tree = [
      {name:'Oghmium',    cls:'final',        amount:T,         prefix:''},
      {divider:true},
      // ── top level
      {name:'Tungsteel',  cls:'intermediate', amount:needTung,  prefix:'├─ '},
      {name:'Cronite',    cls:'intermediate', amount:needCron,  prefix:'├─ '},
      {name:'Sanguinite', cls:'intermediate', amount:needSang,  prefix:'└─ '},
      {divider:true},
      // ── Tungsteel
      {name:'▸ TUNGSTEEL', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemForTarget',{item:'Grain Steel',target:'Tungsteel'}), cls:'intermediate', amount:needGS_tung, prefix:'   ├─ '},
      {name:t('tree.itemNeed',{item:'Lupium',n:Math.round(needLup).toLocaleString('ru')}), cls:'intermediate', amount:needLup, prefix:'   ├─ '},
      {name:t('tree.itemNeed',{item:'Granum Powder',n:Math.round(needGP).toLocaleString('ru')}), cls:'intermediate', amount:needGP, prefix:'   └─ '},
      ...(lupBonus>0?[{name:t('tree.byproductArrowFromN',{item:'Lupium',source:'Pyroxene',n:Math.round(lupFromPyrUsed).toLocaleString('ru')}), cls:'base-easy', amount:lupFromPyrUsed, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(netLup>0?[{name:t('tree.itemCraftMore',{item:'Lupium'}), cls:'intermediate', amount:netLup, prefix:'      '},
        {name:t('tree.xToY',{x:lupR.base==='Waterstone'?'Waterstone':'Galbinum',y:'Lupium'}), cls:'intermediate', amount:needLupExtra, prefix:'         '}]:[]),
      ...(gpBonus>0?[{name:t('tree.bonusArrowFromPoolPlus',{item:'Granum Powder',source:'Blood Ore',n:Math.round(gpBonus).toLocaleString('ru')}), cls:'base-easy', amount:gpBonus, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(granumForGP>0?[{name:t('tree.extraOreForItem',{base:'Granum',item:'GP',n:Math.round(granumForGP).toLocaleString('ru'),rate:2940}), cls:'intermediate', amount:granumForGP, prefix:'      '}]:[]),
      {divider:true},
      // ── Cronite
      {name:'▸ CRONITE', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemForTarget',{item:'Grain Steel',target:'Cronite'}),  cls:'intermediate', amount:needGS_cron,  prefix:'   ├─ '},
      {name:t('tree.itemWillGet',{item:'Almine',n:Math.round(alActual).toLocaleString('ru')}), cls:'intermediate', amount:needAl,  prefix:'   ├─ '},
      {name:t('tree.itemWillGet',{item:'Arconite',n:Math.round(arcActual).toLocaleString('ru')}),cls:'intermediate', amount:needArc, prefix:'   └─ '},
      {name:t('tree.mixRuns',{item:'Pyroxene',x:xBF.toFixed(1),y:yGN.toFixed(1)}), cls:'intermediate', amount:needPyrox, prefix:'      '},
      {divider:true},
      // ── Grain Steel total
      {name:t('tree.sectionTotal',{item:'GRAIN STEEL'}), cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemTotal',{item:'Grain Steel'}),  cls:'intermediate', amount:needGS,        prefix:'   ├─ '},
      {name:'Pig Iron',           cls:'intermediate', amount:needPig,       prefix:'   │  ├─ '},
      {name:t('tree.itemForTarget',{item:'Coke',target:'GS'}),      cls:'intermediate', amount:needCoke_gs,   prefix:'   │  ├─ '},
      {name:t('tree.itemForTarget',{item:'Calx Powder',target:'GS'}),cls:'intermediate',amount:needCP_gs,     prefix:'   │  └─ '},
      {divider:true},
      // ── Blood Ore
      {name:'▸ BLOOD ORE / PIG IRON', cls:'tree-section', amount:0, prefix:''},
      {name:'Blood Ore',          cls:'intermediate', amount:needBO,        prefix:'   ├─ '},
      ...(bloR.base==='Granum'?[{name:t('tree.xToY',{x:'Granum',y:'Blood Ore'}),cls:'base-ore',amount:needBloBase,prefix:'   │  └─ ',tag:'mine',tagLabel:'ore'}]:[]),
      ...(bloR.base==='Gabore'?[{name:t('tree.xToY',{x:'Gabore',y:'Blood Ore'}),cls:'base-ore',amount:needBloBase,prefix:'   │  └─ ',tag:'mine',tagLabel:'ore'}]:[]),
      ...(galbFromBlo>0?[{name:t('tree.byproductArrowFrom',{item:'Galbinum',source:'Blood Ore'}),cls:'base-easy',amount:galbFromBlo,prefix:'   │  ',tag:'easy',tagLabel:'byproduct'}]:[]),
      ...(gpFromBlo>0?[{name:t('tree.byproductArrowN',{item:'Granum Powder',n:Math.round(gpFromBlo).toLocaleString('ru')}),cls:'base-easy',amount:gpFromBlo,prefix:'   │  ',tag:'easy',tagLabel:'byproduct'}]:[]),
      ...(bloFromGranumExtra>0?[{name:t('tree.byproductParenFrom',{item:'Blood Ore',source:'extra Granum'}),cls:'base-easy',amount:bloFromGranumExtra,prefix:'   │  ',tag:'easy',tagLabel:'bonus'}]:[]),
      {divider:true},
      // ── Sanguinite / Red Bleckblende
      {name:'▸ SANGUINITE / RED BLECKBLENDE', cls:'tree-section', amount:0, prefix:''},
      {name:'Red Bleckblende',    cls:'intermediate', amount:needRB,        prefix:'   ├─ '},
      {name:t('tree.xToY',{x:'Tephra',y:'RB'}),        cls:'base-ore',     amount:needTeph,      prefix:'   │  └─ ', tag:'mine', tagLabel:'ore'},
      ...(galbFromRB>0?[{name:t('tree.byproductArrowFrom',{item:'Galbinum',source:'RB'}),cls:'base-easy',amount:galbFromRB,prefix:'   │  ',tag:'easy',tagLabel:'byproduct'}]:[]),
      ...(aabamBonus>0?[{name:t('tree.byproductParen',{item:'Aabam'}),cls:'base-easy',amount:aabamBonus,prefix:'   ',tag:'easy',tagLabel:'bonus'}]:[]),
      ...(silverBonus>0?[{name:t('tree.byproductParen',{item:'Silver'}),cls:'base-easy',amount:silverBonus,prefix:'   ',tag:'easy',tagLabel:'bonus'}]:[]),
      ...(calamineBonus>0?[{name:t('tree.byproductParen',{item:'Calamine'}),cls:'base-easy',amount:calamineBonus,prefix:'   ',tag:'easy',tagLabel:'bonus'}]:[]),
      {divider:true},
      // ── Galbinum / Pyroxene
      {name:'▸ GALBINUM / PYROXENE', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemNeedForTarget',{item:'Galbinum',target:'Pyroxene'}), cls:'intermediate', amount:needGalb_pyr, prefix:'   ├─ '},
      ...(galbUsedFromPool>0?[{name:t('tree.byproductArrowFromPool',{n:Math.round(galbUsedFromPool).toLocaleString('ru')}),cls:'base-easy',amount:galbUsedFromPool,prefix:'   │  ',tag:'easy',tagLabel:'byproduct'}]:[]),
      ...(galbPoolRemainder>0?[{name:t('tree.remainderBonus',{item:'Galbinum'}),cls:'base-easy',amount:galbPoolRemainder,prefix:'   │  ',tag:'easy',tagLabel:'bonus'}]:[]),
      ...(netGalb_pyr>0?[{name:t('tree.itemCraftMore',{item:'Galbinum'}),cls:'intermediate',amount:netGalb_pyr,prefix:'   ├─ '}]:[]),
      ...(needGalb_lup>0?[{name:t('tree.itemForTargetNoParen',{item:'Galbinum',target:'Lupium'}),cls:'intermediate',amount:needGalb_lup,prefix:'   ├─ '}]:[]),
      ...(needGalBase>0?[
        {name:t('tree.xToY',{x:galR.base,y:'Galbinum'}),cls:'base-ore',amount:needGalBase,prefix:'   │  └─ ',tag:'mine',tagLabel:'ore'},
        ...(bloFromGal>0?[{name:t('tree.byproductArrowFrom',{item:'Blood Ore',source:'Galbinum'}),cls:'base-easy',amount:bloFromGal,prefix:'   │  ',tag:'easy',tagLabel:'bonus'}]:[]),
      ]:[]),
      ...(pyriteFromPyr>0?[{name:t('tree.byproductParenFrom',{item:'Pyrite',source:'Pyroxene'}),cls:'base-easy',amount:pyriteFromPyr,prefix:'   ├─ ',tag:'easy',tagLabel:'bonus'}]:[]),
      ...(needWS>0?[{name:t('tree.xToY',{x:'Waterstone',y:'Lupium'}),cls:'intermediate',amount:needWS,prefix:'   ├─ '},
        {name:t('tree.xToY',{x:'Amarantum',y:'Waterstone'}),cls:'intermediate',amount:needAmarantum,prefix:'   │  └─ '},
        {name:t('tree.xToY',{x:'Granum',y:'Amarantum'}),cls:'base-ore',amount:granumForWS,prefix:'   │     └─ ',tag:'mine',tagLabel:'ore'},
        ...(granumFromAmarantum_blo>0?[{name:t('tree.byproductArrow',{item:'Blood Ore'}),cls:'base-easy',amount:granumFromAmarantum_blo,prefix:'   │     ',tag:'easy',tagLabel:'byproduct'}]:[]),
        ...(granumFromAmarantum_gp>0?[{name:t('tree.byproductArrow',{item:'Granum Powder'}),cls:'base-easy',amount:granumFromAmarantum_gp,prefix:'   │     ',tag:'easy',tagLabel:'byproduct'}]:[]),
      ]:[]),
      {divider:true},
      // ── Coke / Calx
      {name:'▸ COKE / CALX', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemTotalParen',{item:'Coke'}),       cls:'intermediate', amount:totalCoke_pre,  prefix:'   ├─ '},
      {name:t('tree.itemForTargetNoParen',{item:'Coal',target:'Coke'}),      cls:'intermediate', amount:needCoal_coke,  prefix:'   │  └─ '},
      {name:t('tree.itemTotalParen',{item:'Calx Powder'}),cls:'intermediate', amount:totalCP,        prefix:'   ├─ '},
      {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalxTotal, prefix:'   │  └─ ', tag:'mine', tagLabel:'ore'},
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'   │     ', tag:'easy', tagLabel:'bonus'}]:[]),
      {divider:true},
      // ── totals
      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum',   cls:'base-ore',  amount:needGranum,   prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needGabore>0?[{name:'Gabore',   cls:'base-ore',  amount:needGabore,   prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needTephra>0?[{name:'Tephra',   cls:'base-ore',  amount:needTephra,   prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      {name:'Calx',               cls:'base-ore',  amount:needCalxTotal,    prefix:'', tag:'mine', tagLabel:'ore'},
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore',  amount:netCoal,      prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needFS>0?[{name:'Fuming Salt',  cls:'base-buy',  amount:needFS,       prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needRO>0?[{name:'Rock Oil',     cls:'base-buy',  amount:needRO,       prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needSulfur>0?[{name:'Sulfur',   cls:'base-buy',  amount:needSulfur,   prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needBor>0?[{name:'Bor',         cls:'base-hard', amount:needBor,      prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needWater>0?[{name:'Water',     cls:'base-easy', amount:needWater,    prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];

    return { target:T, runs:T/7000, tree };
  }
},
{
  id:'steel', name:'Steel',
  defaultSel:{saburra:1,calx:1,pig:1,blo:3,coke:1},
  steps:[
    {id:'saburra',label:'Saburra Powder',options:[
      {label:'Crusher + Saburra',          furnace:'Crusher',input:'10 000 Saburra',             yield:2000,cat:null,   catAmt:0},
      {label:'Grinder + Saburra + Water ★',furnace:'Grinder',input:'10 000 Saburra + 900 Water', yield:4275,cat:'Water',catAmt:900},
    ]},
    {id:'calx',label:'Calx Powder',options:[
      {label:'Crusher + Calx',          furnace:'Crusher',input:'10 000 Calx',              yield:1361,cat:null,   catAmt:0,   coal:2151},
      {label:'Grinder + Calx + Water ★',furnace:'Grinder',input:'10 000 Calx + 1 000 Water',yield:2058,cat:'Water',catAmt:1000,coal:1140},
    ]},
    {id:'pig',label:'Pig Iron',options:[
      {label:'Furnace',        furnace:'Furnace',      input:'10 000 Blood Ore + 400 Coke',yield:4000,catAmt:400},
      {label:'Blast Furnace ★',furnace:'Blast Furnace',input:'10 000 Blood Ore + 390 Coke',yield:5000,catAmt:390},
      {label:'Furnace + Sulfur',furnace:'Furnace',      input:'10 000 Blood Ore + 580 Sulfur',yield:4000,catAmt:580, isSulfur:true},
    ]},
    {id:'blo',label:'Blood Ore',options:[
      {label:'Grinder + Gabore + Bor',             furnace:'Grinder', input:'10 000 Gabore + 630 Bor',         yield:226, cat:'Bor',       catAmt:630,base:'Gabore'},
      {label:'Furnace + Gabore + Coke',            furnace:'Furnace', input:'10 000 Gabore + 360 Coke',        yield:568, cat:'Coke',      catAmt:360,base:'Gabore'},
      {label:'Crusher + Granum',                   furnace:'Crusher', input:'10 000 Granum',                   yield:770, cat:null,        catAmt:0,  base:'Granum'},
      {label:'Attractor + Granum + Calx Powder ★', furnace:'Attractor',input:'10 000 Granum + 720 Calx Powder',yield:1980,cat:'CalxPowder',catAmt:720,base:'Granum'},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM  = bon.ironmaster  ? 1.03 : 1;
    const EM  = 1 + (bon.extractBonus||0)/100;
    const RO  = 7000 * IM;
    const isAvail = name => tools[name] !== false;
    const sR=this.steps[0].options[sel.saburra??1];
    const pR=this.steps[2].options[sel.pig??1];
    const bR=this.steps[3].options[sel.blo??3];
    const cokeR=this.steps[4].options[sel.coke??1];
    const T=target;

    // Steel: 10000 Grain Steel + 5000 Coal + 5000 Saburra Powder → RO
    const needGS   = r(T,RO,10000);
    const needCoalSteel = r(T,RO,5000);
    const needSP   = r(T,RO,5000);

    // Grain Steel: 10000 Pig Iron + 5000 Coke + 5000 Calx Powder → RO
    const needPig  = r(needGS,RO,10000);
    const needCoke_gs = r(needGS,RO,5000);
    const needCP_gs   = r(needGS,RO,5000);

    const needSaburra = r(needSP,sR.yield*EM,10000);
    const sabWater    = r(needSP,sR.yield*EM,sR.catAmt);

    const needBO  = r(needPig,pR.yield*EM,10000);
    const cokePig  = pR.isSulfur ? 0 : r(needPig,pR.yield*EM,pR.catAmt);
    const sulfurForPig = pR.isSulfur ? r(needPig,pR.yield*EM,pR.catAmt) : 0;

    const needBloBase = r(needBO,bR.yield*EM,10000);
    const bloCat      = r(needBO,bR.yield*EM,bR.catAmt);

    // ── COKE (выбираемый рецепт: Coal+Coal или Coal+Calx Powder) ──
    const totalCoke= needCoke_gs+cokePig+(sel.blo===1?bloCat:0);
    const cokeYield = 7200*EM;
    const needCoal_coke = r(totalCoke,cokeYield,cokeR.coalTotal);
    const cpForCoke = cokeR.useCalxPowder ? r(totalCoke,cokeYield,cokeR.calxPowderCat) : 0;

    const cpExtra  = sel.blo===3?bloCat:0;
    const totalCP  = needCP_gs+cpExtra+cpForCoke;

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть Calx Powder и Coal без остатка ──
    const calxCrusher = this.steps[1].options[0], calxGrinder = this.steps[1].options[1];
    const totalCoalNeed = needCoal_coke+needCoalSteel;
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (totalCP*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*totalCP) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=totalCP/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=totalCP/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = totalCP/cpCr;
    } else {
      yGrinder = totalCP/cpGr;
    }
    const needCalx = (xCrusher + yGrinder) * 10000;
    const calxWater= yGrinder * calxGrinder.catAmt;
    const coalFromCalx = xCrusher*coalCr + yGrinder*coalGr;

    const netCoal  = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed);

    let needGranum=0,needGabore=0;
    if(bR.base==='Granum') needGranum=needBloBase;
    if(bR.base==='Gabore') needGabore=needBloBase;

    const needBor  = sel.blo===0?bloCat:0;
    const needWater= sabWater+calxWater;
    const needSulfur = sulfurForPig;

    const tree=[
      {name:'Steel',       cls:'final',       amount:T,        prefix:''},
      {divider:true},
      {name:'Grain Steel',       cls:'intermediate',amount:needGS,       prefix:'├─ '},
      {name:t('tree.itemCatalyst',{item:'Coal'}),cls:'intermediate',amount:needCoalSteel, prefix:'├─ '},
      {name:'Saburra Powder',    cls:'intermediate',amount:needSP,        prefix:'└─ '},
      {divider:true},
      {name:'Pig Iron',    cls:'intermediate',amount:needPig,    prefix:'   ├─ '},
      {name:'Coke',        cls:'intermediate',amount:totalCoke,  prefix:'   ├─ '},
      {name:'Calx Powder', cls:'intermediate',amount:totalCP,    prefix:'   └─ '},
      {divider:true},
      {name:'Blood Ore',   cls:'intermediate',amount:needBO,     prefix:'      └─ '},
      {divider:true},
      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum',cls:'base-ore',amount:needGranum,prefix:'',tag:'mine',tagLabel:'ore'}]:[]),
      ...(needGabore>0?[{name:'Gabore',cls:'base-ore',amount:needGabore,prefix:'',tag:'mine',tagLabel:'ore'}]:[]),
      {name:'Saburra',cls:'base-ore',amount:needSaburra,prefix:'',tag:'mine',tagLabel:'ore'},
      {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}),cls:'base-ore',amount:needCalx,prefix:'',tag:'mine',tagLabel:'ore'},
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}),cls:'base-easy',amount:coalBonus,prefix:'',tag:'easy',tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:'Coal',cls:'base-ore',amount:netCoal,prefix:'',tag:'mine',tagLabel:'byproduct'}]:[]),
      ...(needBor>0?[{name:'Bor',cls:'base-hard',amount:needBor,prefix:'',tag:'hard',tagLabel:'hard'}]:[]),
      ...(needSulfur>0?[{name:'Sulfur',cls:'base-buy',amount:needSulfur,prefix:'',tag:'buy',tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',cls:'base-easy',amount:needWater,prefix:'',tag:'easy',tagLabel:'easy'}]:[]),
    ];
    return {target:T, runs:T/7000, tree};
  }
},
{
  id:'messing', name:'Messing',
  defaultSel:{cup:5, mal:7, cals:0, sab:1, coke:1, calx:1},
  steps:[
    {id:'cup', label:'Cuprum', options:[
      // Amarantum-based
      {label:'Crusher + Amarantum',              furnace:'Crusher',      input:'10 000 Amarantum',              yield:270,  cat:null,    catAmt:0,   base:'Amarantum', calamine:90,  electrum:180, waterstone:900, bleck:135},
      {label:'Furnace + Amarantum + Bor',        furnace:'Furnace',      input:'10 000 Amarantum + 720 Bor',    yield:2400, cat:'Bor',   catAmt:720, base:'Amarantum', calamine:563, electrum:480, bleck:960},
      {label:'Blast Furnace + Amarantum + Bor ★',furnace:'Blast Furnace',input:'10 000 Amarantum + 900 Bor',    yield:3000, cat:'Bor',   catAmt:900, base:'Amarantum', calamine:624, electrum:800, bleck:600,},
      // Electrum-based
      {label:'Blast Furnace + Electrum + CalxP', furnace:'Blast Furnace',input:'10 000 Electrum + 800 Calx Powder', yield:3500, cat:'CalxPowder', catAmt:800, base:'Electrum', gold:1750, silver:2500},
      {label:'Furnace + Electrum + CalxP',       furnace:'Furnace',      input:'10 000 Electrum + 640 Calx Powder', yield:2600, cat:'CalxPowder', catAmt:640, base:'Electrum', gold:1400, silver:1600},
      // Malachite-based
      {label:'Blast Furnace + Malachite + Bor',  furnace:'Blast Furnace',input:'10 000 Malachite + 900 Bor',    yield:5000, cat:'Bor',   catAmt:900, base:'Malachite'},
      {label:'Fabricula + Malachite + Bor',      furnace:'Fabricula',    input:'10 000 Malachite + 720 Bor',    yield:4000, cat:'Bor',   catAmt:720, base:'Malachite', sulfur:200},
      {label:'Fabricula + Malachite + Coke',     furnace:'Fabricula',    input:'10 000 Malachite + 385 Coke',   yield:4000, cat:'Coke',  catAmt:385, base:'Malachite', sulfur:320},
      {label:'Fabricula + Malachite + Coal',     furnace:'Fabricula',    input:'10 000 Malachite + 530 Coal',   yield:2400, cat:'Coal',  catAmt:530, base:'Malachite', sulfur:640},
      {label:'Furnace + Malachite + Bor',        furnace:'Furnace',      input:'10 000 Malachite + 720 Bor',    yield:4000, cat:'Bor',   catAmt:720, base:'Malachite', sulfur:200},
      {label:'Furnace + Malachite + Coke',       furnace:'Furnace',      input:'10 000 Malachite + 400 Coke',   yield:4000, cat:'Coke',  catAmt:400, base:'Malachite', sulfur:83},
      {label:'Blast Furnace + Malachite + Coke', furnace:'Blast Furnace',input:'10 000 Malachite + 385 Coke',   yield:5000, cat:'Coke',  catAmt:385, base:'Malachite'},
    ]},
    {id:'mal', label:'Malachite', options:[
      // Calspar-based
      {label:'BF + Calspar + Dragon Salt',   furnace:'Blast Furnace',input:'10 000 Calspar + 280 Dragon Salt', yield:2064, cat:'DragonSalt', catAmt:280,  base:'Calspar', electrum:224, chalkGlance:700},
      {label:'BF + Calspar + Ichor',         furnace:'Blast Furnace',input:'10 000 Calspar + 1 000 Ichor',     yield:3302, cat:'Ichor',      catAmt:1000, base:'Calspar', electrum:425, chalkGlance:490},
      {label:'BF + Calspar + Sulfur',        furnace:'Blast Furnace',input:'10 000 Calspar + 490 Sulfur',      yield:2373, cat:'Sulfur',     catAmt:490,  base:'Calspar', electrum:291, chalkGlance:448},
      {label:'Furnace + Calspar + Dragon Salt',furnace:'Furnace',    input:'10 000 Calspar + 133 Dragon Salt', yield:1444, cat:'DragonSalt', catAmt:133,  base:'Calspar', electrum:88,  chalkGlance:245},
      {label:'Furnace + Calspar + Ichor',    furnace:'Furnace',      input:'10 000 Calspar + 700 Ichor',       yield:2793, cat:'Ichor',      catAmt:700,  base:'Calspar', electrum:211, chalkGlance:159},
      {label:'Furnace + Calspar + Sulfur',   furnace:'Furnace',      input:'10 000 Calspar + 490 Sulfur',      yield:1781, cat:'Sulfur',     catAmt:490,  base:'Calspar', electrum:129, chalkGlance:142},
      {label:'Furnace + Calspar + Water',    furnace:'Furnace',      input:'10 000 Calspar + 1 000 Water',     yield:3467, cat:'Water',      catAmt:1000, base:'Calspar', electrum:108, chalkGlance:72},
      {label:'Furnace + Calspar + Bor ★',   furnace:'Furnace',      input:'10 000 Calspar + 630 Bor',         yield:4816, cat:'Bor',        catAmt:630,  base:'Calspar', electrum:294, chalkGlance:73,},
      {label:'Furnace + Calspar + Coke',     furnace:'Furnace',      input:'10 000 Calspar + 341 Coke',        yield:3295, cat:'Coke',       catAmt:341,  base:'Calspar', electrum:211, chalkGlance:73},
      {label:'Fabricula + Calspar + Ichor',  furnace:'Fabricula',    input:'10 000 Calspar + 1 000 Ichor',     yield:1375, cat:'Ichor',      catAmt:1000, base:'Calspar', electrum:336, chalkGlance:210},
      {label:'Fabricula + Calspar + Sulfur', furnace:'Fabricula',    input:'10 000 Calspar + 700 Sulfur',      yield:334,  cat:'Sulfur',     catAmt:700,  base:'Calspar', electrum:112, chalkGlance:167},
      {label:'Fabricula + Calspar + Bor',    furnace:'Fabricula',    input:'10 000 Calspar + 900 Bor',         yield:3440, cat:'Bor',        catAmt:900,  base:'Calspar', electrum:560},
      // Calx-based (даёт и Calspar и Malachite)
      {label:'Crusher + Calx (gives Calspar+Mal)',furnace:'Crusher',  input:'10 000 Calx',                      yield:891,  cat:null,         catAmt:0,    base:'Calx', calspar:360, calxPowder:1361, coal:2151},
      {label:'Grinder + Calx + Water',           furnace:'Grinder',  input:'10 000 Calx + 1 000 Water',        yield:528,  cat:'Water',      catAmt:1000, base:'Calx', calspar:2000,calxPowder:2058, coal:1140},
      // Saburra-based (даёт и Saburra Powder и Malachite)
      {label:'Crusher + Saburra (gives SP+Mal)',  furnace:'Crusher',  input:'10 000 Saburra',                   yield:1584, cat:null,         catAmt:0,    base:'Saburra', saburraP:2000, bleckblende:1584},
      {label:'Grinder + Saburra + Water',        furnace:'Grinder',  input:'10 000 Saburra + 900 Water',       yield:950,  cat:'Water',      catAmt:900,  base:'Saburra', saburraP:4275, bleckblende:1900},
    ]},
    {id:'cals', label:'Calspar', options:[
      {label:'Crusher + Calx',           furnace:'Crusher',input:'10 000 Calx',               yield:360,  cat:null,    catAmt:0,    mal:891,  calxPowder:1361, coal:2151},
      {label:'Grinder + Calx + Water',   furnace:'Grinder',input:'10 000 Calx + 1 000 Water', yield:2000, cat:'Water', catAmt:1000, mal:528,  calxPowder:2058, coal:1140},
      {label:'Furnace + Calx + Water ★', furnace:'Furnace',input:'10 000 Calx + 1 000 Water', yield:2560, cat:'Water', catAmt:1000, mal:506, },
    ]},
    {id:'sab', label:'Saburra Powder', options:[
      {label:'Crusher + Saburra',           furnace:'Crusher',input:'10 000 Saburra',             yield:2000, cat:null,    catAmt:0,   mal:1584},
      {label:'Grinder + Saburra + Water ★', furnace:'Grinder',input:'10 000 Saburra + 900 Water', yield:4275, cat:'Water', catAmt:900, mal:950,},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher', input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder', input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM = bon.ironmaster ? 1.03 : 1;
    const EM = 1 + (bon.extractBonus||0)/100;
    const RO = 7000 * IM;
    const T  = target;
    const isAvail = name => tools[name] !== false;

    const cupR  = this.steps[0].options[sel.cup??5];
    const malR  = this.steps[1].options[sel.mal??7];
    const calsR = this.steps[2].options[sel.cals??0];
    const sabR  = this.steps[3].options[sel.sab??1];
    const cokeR = this.steps[4].options[sel.coke??1];

    // ── MESSING: 10000 Cuprum + 5000 Calamine + 5000 Saburra Powder → RO ──
    const needCup = r(T, RO, 10000);
    const needCal = r(T, RO, 5000);  // покупка
    const needSP  = r(T, RO, 5000);

    // ── SABURRA POWDER ──
    const sabYield    = sabR.yield * EM;
    // Malachite побочка из Saburra Powder рецептов
    const malFromSab  = sabR.mal ? r(needSP, sabYield, sabR.mal) : 0;

    // ── MALACHITE для Cuprum (если нужен) ──
    const cupYield = cupR.yield * EM;
    const needCupBase = r(needCup, cupYield, 10000); // базовый материал для Cuprum

    // Electrum побочка из Cuprum (Amarantum рецепты)
    const electrumFromCup = cupR.electrum ? r(needCup, cupYield, cupR.electrum) : 0;
    const calamineFromCup = cupR.calamine ? r(needCup, cupYield, cupR.calamine) : 0;
    const waterstoneFromCup = cupR.waterstone ? r(needCup, cupYield, cupR.waterstone) : 0;

    // ── MALACHITE (если Cuprum из Malachite) ──
    let needMal_forCup = 0;
    if (cupR.base === 'Malachite') needMal_forCup = needCupBase;

    // ── AMARANTUM (если Cuprum из Amarantum) ──
    let needAmarantum_forCup = 0;
    if (cupR.base === 'Amarantum') needAmarantum_forCup = needCupBase;
    // Amarantum → Granum
    const needGranum_cup = needAmarantum_forCup > 0 ? r(needAmarantum_forCup, 882*EM, 10000) : 0;

    // ── CALSPAR для Malachite ──
    // Malachite из Calspar, Calx или Saburra
    const malYield = malR.yield * EM;

    // Сначала посчитаем сколько Malachite нужно из mal step
    // Вычитаем побочки: из Saburra Powder крафта
    const malPool_pre = malFromSab;

    // Если mal step сам даёт Malachite из Calx или Saburra — это основной рецепт
    let needMal_craft = 0; // сколько крафтить через mal step
    let needCals_forMal = 0;
    let calsYield = 0;

    if (malR.base === 'Calspar') {
      // Обычный путь: Calspar → Malachite
      const netMal = Math.max(0, needMal_forCup - malPool_pre);
      needMal_craft = netMal;
      needCals_forMal = r(needMal_craft, malYield, 10000);
      // Electrum побочка из Malachite
    } else if (malR.base === 'Calx') {
      // Calx → напрямую даёт и Calspar и Malachite
      const netMal = Math.max(0, needMal_forCup - malPool_pre);
      needMal_craft = netMal;
      needCals_forMal = 0; // Calx идёт напрямую
    } else if (malR.base === 'Saburra') {
      // Saburra → Malachite (+ Saburra Powder побочка)
      const netMal = Math.max(0, needMal_forCup - malPool_pre);
      needMal_craft = netMal;
    }

    const malCat = needMal_craft > 0 ? r(needMal_craft, malYield, malR.catAmt) : 0;
    const electrumFromMal = (malR.electrum && needMal_craft > 0) ? r(needMal_craft, malYield, malR.electrum) : 0;
    const chalkGlanceBonus = (malR.chalkGlance && needMal_craft > 0) ? r(needMal_craft, malYield, malR.chalkGlance) : 0;
    // Saburra Powder побочка из Saburra Malachite рецепта
    const sabPFromMal = (malR.saburraP && needMal_craft > 0) ? r(needMal_craft, malYield, malR.saburraP) : 0;

    // ── CALSPAR (отдельный step, если нужен) ──
    calsYield = calsR.yield * EM;
    // Если mal step не использует Calspar step отдельно (base=Calx или base=Saburra),
    // то cals step может быть нужен для чего-то ещё — но в Messing нет другого применения
    // Если mal base=Calspar — cals step нужен
    let needCalx_cals = 0, calsWater = 0;
    let malFromCalsStep = 0, calxPowderFromCals = 0, coalFromCals = 0;

    if (malR.base === 'Calspar') {
      needCalx_cals = r(needCals_forMal, calsYield, 10000);
      calsWater     = r(needCals_forMal, calsYield, calsR.catAmt);
      malFromCalsStep = calsR.mal ? r(needCals_forMal, calsYield, calsR.mal) : 0;
      calxPowderFromCals = calsR.calxPowder ? r(needCals_forMal, calsYield, calsR.calxPowder) : 0;
      coalFromCals  = calsR.coal ? r(needCals_forMal, calsYield, calsR.coal) : 0;
    }

    // ── CALX (для Calspar, или напрямую для Malachite) ──
    let needCalx_mal = 0, malWater_calx = 0, calxPowderFromMalCalx = 0, coalFromMalCalx = 0, calsparFromMalCalx = 0;
    if (malR.base === 'Calx') {
      needCalx_mal = r(needMal_craft, malYield, 10000);
      malWater_calx = r(needMal_craft, malYield, malR.catAmt);
      calxPowderFromMalCalx = malR.calxPowder ? r(needMal_craft, malYield, malR.calxPowder) : 0;
      coalFromMalCalx = malR.coal ? r(needMal_craft, malYield, malR.coal) : 0;
      calsparFromMalCalx = malR.calspar ? r(needMal_craft, malYield, malR.calspar) : 0;
    }

    // ── SABURRA (для Saburra Powder катализатора + Malachite рецепта) ──
    let needSaburra_mal = 0, sabMalWater = 0;
    if (malR.base === 'Saburra') {
      needSaburra_mal = r(needMal_craft, malYield, 10000);
      sabMalWater = r(needMal_craft, malYield, malR.catAmt);
    }
    // Суммарно Saburra (для SP катализатора + для Malachite)
    // Saburra Powder побочка из Saburra Malachite покрывает часть needSP
    const sabPPool = malFromSab + sabPFromMal;
    const netSabP  = Math.max(0, needSP - sabPPool);
    const sabPBonus= Math.max(0, sabPPool - needSP);
    // Пересчитываем Saburra для SP если пул покрывает
    const needSaburra_sp = netSabP > 0 ? r(netSabP, sabYield, 10000) : 0;
    const sabWater_sp    = netSabP > 0 ? r(netSabP, sabYield, sabR.catAmt) : 0;
    const totalSaburra   = needSaburra_sp + needSaburra_mal;

    // ── CALX POWDER: катализаторы Cuprum/Coke против побочек Calspar/Malachite-via-Calx ──
    const cpForCup = cupR.cat==='CalxPowder' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const cpSupply = calxPowderFromCals + calxPowderFromMalCalx;

    // ── CALX суммарно (для Calspar / Malachite-via-Calx) ──
    const needCalxTotal = needCalx_cals + needCalx_mal;

    // ── COAL / COKE: Cuprum и Malachite могут требовать Coal напрямую или через Coke ──
    const cupCoal  = cupR.cat==='Coal' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const malCoke  = malR.cat==='Coke' ? malCat : 0;
    const cupCoke  = cupR.cat==='Coke' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const totalCoke = malCoke + cupCoke;
    const cokeYield = 7200 * EM;
    const needCoal_coke = totalCoke > 0 ? r(totalCoke, cokeYield, cokeR.coalTotal) : 0;
    const cpForCoke = (totalCoke > 0 && cokeR.useCalxPowder) ? r(totalCoke, cokeYield, cokeR.calxPowderCat) : 0;

    // ── CALX POWDER дефицит: сколько докрафтить сверх побочек Calspar/Malachite ──
    const cpDemand  = cpForCup + cpForCoke;
    const cpDeficit = Math.max(0, cpDemand - cpSupply);

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть дефицит Calx Powder и Coal без остатка ──
    // (Coal-побочка из Calspar/Malachite-via-Calx крафта засчитывается в счёт нужды заранее)
    const coalPool = coalFromCals + coalFromMalCalx;
    const totalCoalNeedGross = cupCoal + needCoal_coke;
    const totalCoalNeed = Math.max(0, totalCoalNeedGross - coalPool);
    const coalPoolBonus = Math.max(0, coalPool - totalCoalNeedGross);
    const calxCrusher = this.steps[5].options[0], calxGrinder = this.steps[5].options[1];
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (cpDeficit*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*cpDeficit) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=cpDeficit/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=cpDeficit/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = cpDeficit/cpCr;
    } else {
      yGrinder = cpDeficit/cpGr;
    }
    const needCalxForCP  = (xCrusher + yGrinder) * 10000;
    const calxWaterForCP = yGrinder * calxGrinder.catAmt;
    const cpFromCalx      = xCrusher*cpCr + yGrinder*cpGr;
    const coalFromCalx    = xCrusher*coalCr + yGrinder*coalGr;

    const netCoal   = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed) + coalPoolBonus;
    const cpBonus    = Math.max(0, (cpSupply + cpFromCalx) - cpDemand);

    // ── БАЗОВЫЕ РУДЫ ──
    let needGranum = needGranum_cup;
    const needCalx_total = needCalxTotal + needCalxForCP;

    // ── ИТОГО ВОДА ──
    const needWater = sabWater_sp + calsWater + calxWaterForCP
      + (malR.cat==='Water' ? malCat : 0)
      + (malR.base==='Calx' ? malWater_calx : 0)
      + (malR.base==='Saburra' ? sabMalWater : 0);

    // ── БОР ──
    const needBor = (cupR.cat==='Bor' ? r(needCup, cupYield, cupR.catAmt) : 0)
                  + (malR.cat==='Bor' ? malCat : 0);

    // ── ПОКУПНЫЕ ──
    const needIchor      = malR.cat==='Ichor'      ? malCat : 0;
    const needDragonSalt = malR.cat==='DragonSalt' ? malCat : 0;
    const needSulfur_mal = malR.cat==='Sulfur'     ? malCat : 0;
    const sulfurFromCup  = cupR.sulfur ? r(needCup, cupYield, cupR.sulfur) : 0;
    const goldBonus      = cupR.gold   ? r(needCup, cupYield, cupR.gold)   : 0;
    const silverBonus    = cupR.silver ? r(needCup, cupYield, cupR.silver) : 0;

    const tree = [
      {name:'Messing',        cls:'final',        amount:T,         prefix:''},
      {divider:true},
      {name:'Cuprum',         cls:'intermediate', amount:needCup,   prefix:'├─ '},
      {name:t('tree.itemPurchase',{item:'Calamine'}), cls:'base-buy', amount:needCal,   prefix:'├─ ', tag:'buy', tagLabel:'purchase'},
      {name:'Saburra Powder', cls:'intermediate', amount:needSP,    prefix:'└─ '},
      {divider:true},

      // ── Cuprum
      {name:'▸ CUPRUM', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.xToY',{x:cupR.base,y:'Cuprum'}), cls:'intermediate', amount:needCupBase, prefix:'   └─ '},
      ...(cupR.base==='Amarantum'?[{name:t('tree.xToY',{x:'Granum',y:'Amarantum'}), cls:'base-ore', amount:needGranum_cup, prefix:'      └─ ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(electrumFromCup>0?[{name:t('tree.byproductParenFrom',{item:'Electrum',source:'Amarantum'}), cls:'base-easy', amount:electrumFromCup, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(calamineFromCup>0?[{name:t('tree.byproductCoversPurchase',{item:'Calamine'}), cls:'base-easy', amount:calamineFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(waterstoneFromCup>0?[{name:t('tree.byproductParen',{item:'Waterstone'}), cls:'base-easy', amount:waterstoneFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(goldBonus>0?[{name:t('tree.byproductParen',{item:'Gold'}), cls:'base-easy', amount:goldBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(silverBonus>0?[{name:t('tree.byproductParen',{item:'Silver'}), cls:'base-easy', amount:silverBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(sulfurFromCup>0?[{name:t('tree.byproductParen',{item:'Sulfur'}), cls:'base-easy', amount:sulfurFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      {divider:true},

      // ── Saburra Powder
      {name:'▸ SABURRA POWDER', cls:'tree-section', amount:0, prefix:''},
      ...(sabPPool>0?[{name:t('tree.itemFromPoolN',{item:'Saburra Powder',n:Math.round(Math.min(sabPPool,needSP)).toLocaleString('ru')}), cls:'base-easy', amount:Math.min(sabPPool,needSP), prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(sabPBonus>0?[{name:t('tree.itemBonus',{item:'Saburra Powder'}), cls:'base-easy', amount:sabPBonus, prefix:'   ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netSabP>0?[{name:t('tree.xToYCraftMore',{x:'Saburra',y:'Saburra Powder'}), cls:'intermediate', amount:needSaburra_sp, prefix:'   └─ '}]:[]),
      {divider:true},

      // ── Malachite
      {name:'▸ MALACHITE', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemNeedFor',{item:'Malachite',target:'Cuprum'}), cls:'intermediate', amount:needMal_forCup, prefix:'   ├─ '},
      ...(malFromSab>0?[{name:t('tree.byproductArrowFromSourceN',{source:'Saburra Powder',n:Math.round(malFromSab).toLocaleString('ru')}), cls:'base-easy', amount:malFromSab, prefix:'   │  ', tag:'easy', tagLabel:'byproduct'}]:[]),
      {name:t('tree.itemCraftMore',{item:'Malachite'}), cls:'intermediate', amount:needMal_craft, prefix:'   └─ '},
      ...(malR.base==='Calspar'?[{name:t('tree.xToY',{x:'Calspar',y:'Malachite'}), cls:'intermediate', amount:needCals_forMal, prefix:'      └─ '}]:[]),
      ...(malR.base==='Calx'?[{name:t('tree.xToY',{x:'Calx',y:'Malachite'}), cls:'intermediate', amount:needCalx_mal, prefix:'      └─ '}]:[]),
      ...(malR.base==='Saburra'?[{name:t('tree.xToY',{x:'Saburra',y:'Malachite'}), cls:'intermediate', amount:needSaburra_mal, prefix:'      └─ '}]:[]),
      ...(electrumFromMal>0?[{name:t('tree.byproductParenFrom',{item:'Electrum',source:'Malachite'}), cls:'base-easy', amount:electrumFromMal, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(chalkGlanceBonus>0?[{name:t('tree.byproductParen',{item:'Chalk Glance'}), cls:'base-easy', amount:chalkGlanceBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(sabPFromMal>0?[{name:t('tree.byproductParenFrom',{item:'Saburra Powder',source:'Saburra'}), cls:'base-easy', amount:sabPFromMal, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(malFromCalsStep>0?[{name:t('tree.byproductArrowFrom',{item:'Malachite',source:'Calspar'}), cls:'base-easy', amount:malFromCalsStep, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      {divider:true},

      // ── Calspar
      ...(malR.base==='Calspar'?[
        {name:'▸ CALSPAR', cls:'tree-section', amount:0, prefix:''},
        {name:t('tree.xToY',{x:'Calx',y:'Calspar'}), cls:'intermediate', amount:needCalx_cals, prefix:'   └─ '},
        ...(calxPowderFromCals>0?[{name:t('tree.byproductParenFrom',{item:'Calx Powder',source:'Calspar'}), cls:'base-easy', amount:calxPowderFromCals, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(coalFromCals>0?[{name:t('tree.byproductParenFrom',{item:'Coal',source:'Calspar'}), cls:'base-easy', amount:coalFromCals, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
        {divider:true},
      ]:[]),

      // ── Calx Powder / Coke (if Cuprum/Malachite need CalxPowder or Coke) ──
      ...(cpDemand>0||totalCoalNeed>0?[
        {name:'▸ CALX POWDER / COKE', cls:'tree-section', amount:0, prefix:''},
        ...(cpForCup>0?[{name:t('tree.itemNeedFor',{item:'Calx Powder',target:'Cuprum'}), cls:'intermediate', amount:cpForCup, prefix:'   ├─ '}]:[]),
        ...(totalCoke>0?[
          {name:t('tree.itemTotalParen',{item:'Coke'}), cls:'intermediate', amount:totalCoke, prefix:'   ├─ '},
          {name:t('tree.itemForTargetNoParen',{item:'Coal',target:'Coke'}), cls:'intermediate', amount:needCoal_coke, prefix:'   │  └─ '},
        ]:[]),
        ...(calsparFromMalCalx>0?[{name:t('tree.byproductParenFrom',{item:'Calspar',source:'Malachite-via-Calx'}), cls:'base-easy', amount:calsparFromMalCalx, prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(coalFromMalCalx>0?[{name:t('tree.byproductParenFrom',{item:'Coal',source:'Malachite-via-Calx'}), cls:'base-easy', amount:coalFromMalCalx, prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
        {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalxForCP, prefix:'   └─ ', tag:'mine', tagLabel:'ore'},
        {divider:true},
      ]:[]),

      // ── totals
      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum',  cls:'base-ore', amount:needGranum,    prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(totalSaburra>0?[{name:'Saburra',cls:'base-ore',amount:totalSaburra,  prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needCalx_total>0?[{name:'Calx', cls:'base-ore',amount:needCalx_total,prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(cpBonus>0?[{name:t('tree.bonusParen',{item:'Calx Powder'}), cls:'base-easy', amount:cpBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore', amount:netCoal, prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needBor>0?[{name:'Bor',         cls:'base-hard',amount:needBor,       prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needIchor>0?[{name:'Ichor',     cls:'base-buy', amount:needIchor,     prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needDragonSalt>0?[{name:'Dragon Salt',cls:'base-buy',amount:needDragonSalt,prefix:'',tag:'buy',tagLabel:'purchase'}]:[]),
      ...(needSulfur_mal>0?[{name:'Sulfur',cls:'base-buy',amount:needSulfur_mal,prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',     cls:'base-easy',amount:needWater,     prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];

    return { target:T, runs:T/7000, tree };
  }
},
{
  id:'tindremic', name:'Tindremic Messing',
  defaultSel:{gem:0,al:1,cup:0,mal:0,cals:2,sab:1,coke:1,calx:1},
  steps:[
    {id:'gem',label:'Gem Metal',options:[
      {label:'Fabricula + Rock Oil ★',     furnace:'Fabricula',    input:'10 000 Waterstone + 800 Rock Oil',   yield:3200,cat:'Rock Oil',   catAmt:800},
      {label:'Fabricula + Bor',            furnace:'Fabricula',    input:'10 000 Waterstone + 720 Bor',         yield:1920,cat:'Bor',        catAmt:720},
      {label:'Blast Furnace + Bor',        furnace:'Blast Furnace',input:'10 000 Waterstone + 720 Bor',         yield:1823,cat:'Bor',        catAmt:720},
      {label:'Blast Furnace + Fuming Salt',furnace:'Blast Furnace',input:'10 000 Waterstone + 360 Fuming Salt', yield:1248,cat:'Fuming Salt',catAmt:360},
    ]},
    {id:'al',label:'Almine',options:[
      {label:'Blast Furnace',    furnace:'Blast Furnace', input:'10 000 Pyroxene + 800 Calx Powder',yield:400, cat:'CalxPowder',catAmt:800},
      {label:'Greater Natorus ★',furnace:'Greater Natorus',input:'10 000 Pyroxene + 800 Calx Powder',yield:2000,cat:'CalxPowder',catAmt:800},
    ]},
    {id:'cup',label:'Cuprum',options:[
      {label:'Blast Furnace + Malachite + Bor ★',furnace:'Blast Furnace',input:'10 000 Malachite + 900 Bor', yield:5000,cat:'Bor', catAmt:900},
      {label:'Blast Furnace + Malachite + Coke', furnace:'Blast Furnace',input:'10 000 Malachite + 385 Coke',yield:5000,cat:'Coke',catAmt:385},
      {label:'Furnace + Malachite + Bor',        furnace:'Furnace',      input:'10 000 Malachite + 720 Bor', yield:4000,cat:'Bor', catAmt:720},
    ]},
    {id:'mal',label:'Malachite',options:[
      {label:'Furnace + Calspar + Bor ★',      furnace:'Furnace',      input:'10 000 Calspar + 630 Bor',    yield:4816,cat:'Bor',  catAmt:630},
      {label:'Furnace + Calspar + Water',       furnace:'Furnace',      input:'10 000 Calspar + 1 000 Water',yield:3467,cat:'Water',catAmt:1000},
      {label:'Blast Furnace + Calspar + Ichor', furnace:'Blast Furnace',input:'10 000 Calspar + 1 000 Ichor',yield:3302,cat:'Ichor',catAmt:1000},
    ]},
    {id:'cals',label:'Calspar',options:[
      {label:'Crusher + Calx',          furnace:'Crusher',input:'10 000 Calx',              yield:360, cat:null,   catAmt:0},
      {label:'Grinder + Calx + Water',  furnace:'Grinder',input:'10 000 Calx + 1 000 Water',yield:2000,cat:'Water',catAmt:1000},
      {label:'Furnace + Calx + Water ★',furnace:'Furnace',input:'10 000 Calx + 1 000 Water',yield:2560,cat:'Water',catAmt:1000},
    ]},
    {id:'sab',label:'Saburra Powder',options:[
      {label:'Crusher + Saburra',          furnace:'Crusher',input:'10 000 Saburra',            yield:2000,cat:null,   catAmt:0},
      {label:'Grinder + Saburra + Water ★',furnace:'Grinder',input:'10 000 Saburra + 900 Water',yield:4275,cat:'Water',catAmt:900},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher', input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder', input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
  ],
  calc(target,sel,bon={},tools={},t=(k)=>k){
    const IM=bon.ironmaster?1.03:1;
    const EM=1+(bon.extractBonus||0)/100;
    const RO=7000*IM;
    const isAvail = name => tools[name] !== false;
    const gR  =this.steps[0].options[sel.gem??0];
    const aR  =this.steps[1].options[sel.al??1];
    const cupR=this.steps[2].options[sel.cup??0];
    const malR=this.steps[3].options[sel.mal??0];
    const cR  =this.steps[4].options[sel.cals??2];
    const sR  =this.steps[5].options[sel.sab??1];
    const cokeR=this.steps[6].options[sel.coke??1];
    const T=target;

    // Tindremic: 10000 Messing + 5000 Almine + 5000 Gem Metal → RO
    const needMess= r(T,RO,10000);
    const needAl  = r(T,RO,5000);
    const needGem = r(T,RO,5000);

    const needWS  = r(needGem,gR.yield*EM,10000);
    const gemCat  = r(needGem,gR.yield*EM,gR.catAmt);
    const needPyrox = r(needAl,aR.yield*EM,10000);
    const alCat   = r(needAl,aR.yield*EM,aR.catAmt);

    // Messing chain
    const needCup = r(needMess,RO,10000);
    const needCal = r(needMess,RO,5000);
    const needSP  = r(needMess,RO,5000);
    const needMal  = r(needCup,cupR.yield*EM,10000);
    const cupCat   = r(needCup,cupR.yield*EM,cupR.catAmt);
    const needCals = r(needMal,malR.yield*EM,10000);
    const malCat   = r(needMal,malR.yield*EM,malR.catAmt);
    const needCalx = r(needCals,cR.yield*EM,10000);
    const calsWater= r(needCals,cR.yield*EM,cR.catAmt);
    const needSaburra=r(needSP,sR.yield*EM,10000);
    const sabWater   =r(needSP,sR.yield*EM,sR.catAmt);

    // Granum → Amarantum → Waterstone (EM applies)
    const needAmarantum = r(needWS,900*EM,10000);
    const granumForWS   = r(needAmarantum,882*EM,10000);

    const needRO   = sel.gem===0?gemCat:0;
    const needBorGem=(sel.gem===1||sel.gem===2)?gemCat:0;
    const needFS   = sel.gem===3?gemCat:0;
    const needBorCup=(sel.cup===0||sel.cup===2)?cupCat:0;
    const needBorMal=sel.mal===0?malCat:0;
    const needBor  = needBorGem+needBorCup+needBorMal;
    const needIchor= sel.mal===2?malCat:0;

    // ── COKE / COAL: Cuprum может требовать Coke (крафтится из Coal) ──
    const cupCoke = sel.cup===1?cupCat:0;
    const cokeYield = 7200*EM;
    const needCoal_coke = cupCoke>0 ? r(cupCoke, cokeYield, cokeR.coalTotal) : 0;
    const cpForCoke = (cupCoke>0 && cokeR.useCalxPowder) ? r(cupCoke, cokeYield, cokeR.calxPowderCat) : 0;

    // ── CALX POWDER: Almine требует её как катализатор всегда (оба варианта al-шага) ──
    const cpDeficit = alCat + cpForCoke;

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть Calx Powder (для Almine+Coke) и Coal без остатка ──
    const calxCrusher = this.steps[7].options[0], calxGrinder = this.steps[7].options[1];
    const totalCoalNeed = needCoal_coke;
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (cpDeficit*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*cpDeficit) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=cpDeficit/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=cpDeficit/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = cpDeficit/cpCr;
    } else {
      yGrinder = cpDeficit/cpGr;
    }
    const needCalxForCP  = (xCrusher + yGrinder) * 10000;
    const calxWaterForCP = yGrinder * calxGrinder.catAmt;
    const cpFromCalx      = xCrusher*cpCr + yGrinder*cpGr;
    const coalFromCalx    = xCrusher*coalCr + yGrinder*coalGr;

    const netCoal   = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed);
    const cpBonus    = Math.max(0, cpFromCalx - cpDeficit);
    const needCalxGrandTotal = needCalx + needCalxForCP;

    const needWater= calsWater+sabWater+calxWaterForCP+(sel.mal===1?malCat:0);

    const tree=[
      {name:'Tindremic Messing',cls:'final',      amount:T,        prefix:''},
      {divider:true},
      {name:'Messing',   cls:'intermediate',amount:needMess,  prefix:'├─ '},
      {name:'Almine',    cls:'intermediate',amount:needAl,    prefix:'├─ '},
      {name:'Gem Metal', cls:'intermediate',amount:needGem,   prefix:'└─ '},
      {divider:true},
      {name:'Cuprum',        cls:'intermediate',amount:needCup,     prefix:'   ├─ '},
      {name:'Calamine',      cls:'base-buy',    amount:needCal,     prefix:'   ├─ ',tag:'buy',tagLabel:'purchase'},
      {name:'Saburra Powder',cls:'intermediate',amount:needSP,      prefix:'   ├─ '},
      {name:'Pyroxene',      cls:'base-ore',    amount:needPyrox,   prefix:'   ├─ ',tag:'mine',tagLabel:'ore'},
      {name:'Waterstone',    cls:'intermediate',amount:needWS,      prefix:'   └─ '},
      {divider:true},
      {name:'Malachite',     cls:'intermediate',amount:needMal,     prefix:'      └─ '},
      {name:'Saburra',       cls:'base-ore',    amount:needSaburra, prefix:'      └─ ',tag:'mine',tagLabel:'ore'},
      {name:'Granum (→Amarantum→WS)',cls:'base-ore',amount:granumForWS,prefix:'      └─ ',tag:'mine',tagLabel:'ore'},
      {divider:true},
      {name:'Calspar',       cls:'intermediate',amount:needCals,    prefix:'         └─ '},
      {divider:true},
      {name:'Calx (→ Calspar)',cls:'base-ore',amount:needCalx,prefix:'            ',tag:'mine',tagLabel:'ore'},
      ...(needRO>0?[{name:'Rock Oil',   cls:'base-buy', amount:needRO,   prefix:'            ',tag:'buy', tagLabel:'purchase'}]:[]),
      ...(needFS>0?[{name:'Fuming Salt',cls:'base-buy', amount:needFS,   prefix:'            ',tag:'buy', tagLabel:'purchase'}]:[]),
      ...(needBor>0?[{name:'Bor',       cls:'base-hard',amount:needBor,  prefix:'            ',tag:'hard',tagLabel:'hard'}]:[]),
      ...(needIchor>0?[{name:'Ichor',   cls:'base-buy', amount:needIchor,prefix:'            ',tag:'buy', tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',   cls:'base-easy',amount:needWater,prefix:'            ',tag:'easy',tagLabel:'easy'}]:[]),
      {divider:true},

      // ── Calx Powder / Coke (Almine's catalyst is mandatory; Cuprum's is optional) ──
      {name:'▸ CALX POWDER / COKE', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemForTargetNoParen',{item:'Calx Powder',target:'Almine'}), cls:'intermediate', amount:alCat, prefix:'   ├─ '},
      ...(cupCoke>0?[
        {name:t('tree.itemForTarget',{item:'Coke',target:'Cuprum'}), cls:'intermediate', amount:cupCoke, prefix:'   ├─ '},
        {name:t('tree.itemForTargetNoParen',{item:'Coal',target:'Coke'}), cls:'intermediate', amount:needCoal_coke, prefix:'   │  └─ '},
      ]:[]),
      {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalxForCP, prefix:'   └─ ', tag:'mine', tagLabel:'ore'},
      {divider:true},

      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(granumForWS>0?[{name:'Granum', cls:'base-ore', amount:granumForWS, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needSaburra>0?[{name:'Saburra',cls:'base-ore', amount:needSaburra, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      {name:'Calx', cls:'base-ore', amount:needCalxGrandTotal, prefix:'', tag:'mine', tagLabel:'ore'},
      ...(cpBonus>0?[{name:t('tree.bonusParen',{item:'Calx Powder'}), cls:'base-easy', amount:cpBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore', amount:netCoal, prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needRO>0?[{name:'Rock Oil',    cls:'base-buy', amount:needRO,   prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needFS>0?[{name:'Fuming Salt', cls:'base-buy', amount:needFS,   prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needBor>0?[{name:'Bor',        cls:'base-hard',amount:needBor,  prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needIchor>0?[{name:'Ichor',    cls:'base-buy', amount:needIchor,prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',    cls:'base-easy',amount:needWater,prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];
    return {target:T,runs:T/7000,tree};
  }
},
{
  id:'cronite', name:'Cronite',
  defaultSel:{pig:1, blo:3, calx:1, gal:2, pyr:4, coke:1},
  steps:[
    {id:'pig', label:'Pig Iron', options:[
      {label:'Furnace',         furnace:'Furnace',      input:'10 000 Blood Ore + 400 Coke', yield:4000, catAmt:400},
      {label:'Blast Furnace ★', furnace:'Blast Furnace',input:'10 000 Blood Ore + 390 Coke', yield:5000, catAmt:390,},
      {label:'Furnace + Sulfur',furnace:'Furnace',      input:'10 000 Blood Ore + 580 Sulfur',yield:4000,catAmt:580, isSulfur:true},
    ]},
    {id:'blo', label:'Blood Ore', options:[
      {label:'Grinder + Gabore + Bor',             furnace:'Grinder',  input:'10 000 Gabore + 630 Bor',          yield:226,  cat:'Bor',        catAmt:630,  base:'Gabore', galb:1050, galbFromBlo:true},
      {label:'Furnace + Gabore + Coke',            furnace:'Furnace',  input:'10 000 Gabore + 360 Coke',         yield:568,  cat:'Coke',       catAmt:360,  base:'Gabore', galb:236,  galbFromBlo:true},
      {label:'Crusher + Granum',                   furnace:'Crusher',  input:'10 000 Granum',                    yield:770,  cat:null,         catAmt:0,    base:'Granum'},
      {label:'Attractor + Granum + Calx Powder ★', furnace:'Attractor',input:'10 000 Granum + 720 Calx Powder',  yield:1980, cat:'CalxPowder', catAmt:720,  base:'Granum',},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher',input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder',input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
    {id:'gal', label:'Galbinum', options:[
      {label:'Grinder + Gabore + Bor',          furnace:'Grinder',        input:'10 000 Gabore + 630 Bor',          yield:1050, cat:'Bor',        catAmt:630,  base:'Gabore', bloByproduct:226},
      {label:'Furnace + Gabore + Coke',         furnace:'Furnace',        input:'10 000 Gabore + 360 Coke',         yield:236,  cat:'Coke',       catAmt:360,  base:'Gabore', bloByproduct:568},
      {label:'Grinder + Tephra + Bor ★',        furnace:'Grinder',        input:'10 000 Tephra + 720 Bor',          yield:1999, cat:'Bor',        catAmt:720,  base:'Tephra',},
      {label:'Grinder + Tephra + Water',        furnace:'Grinder',        input:'10 000 Tephra + 1 000 Water',      yield:1900, cat:'Water',      catAmt:1000, base:'Tephra'},
      {label:'Greater Natorus + Tephra + CalxP',furnace:'Greater Natorus',input:'10 000 Tephra + 800 Calx Powder',  yield:499,  cat:'CalxPowder', catAmt:800,  base:'Tephra'},
      {label:'Greater Natorus + Tephra + Bor',  furnace:'Greater Natorus',input:'10 000 Tephra + 900 Bor',          yield:1249, cat:'Bor',        catAmt:900,  base:'Tephra'},
      {label:'Furnace + Tephra + Calx Powder',  furnace:'Furnace',        input:'10 000 Tephra + 800 Calx Powder',  yield:299,  cat:'CalxPowder', catAmt:800,  base:'Tephra'},
    ]},
    {id:'pyr', label:'Pyroxene', options:[
      {label:'Blast Furnace + Calx Powder',    furnace:'Blast Furnace',  input:'10 000 Galbinum + 640 Calx Powder', yield:1230, cat:'CalxPowder', catAmt:640,  lup:298},
      {label:'Blast Furnace + Coke ★',         furnace:'Blast Furnace',  input:'10 000 Galbinum + 390 Coke',        yield:1760, cat:'Coke',       catAmt:390,  lup:245,},
      {label:'Blast Furnace + Bor',            furnace:'Blast Furnace',  input:'10 000 Galbinum + 720 Bor',         yield:1400, cat:'Bor',        catAmt:720,  lup:245},
      {label:'Furnace + Calx Powder',          furnace:'Furnace',        input:'10 000 Galbinum + 480 Calx Powder', yield:696,  cat:'CalxPowder', catAmt:480,  lup:170, pyrite:55},
      {label:'Greater Natorus + Coke',         furnace:'Greater Natorus',input:'10 000 Galbinum + 390 Coke',        yield:4200, cat:'Coke',       catAmt:390,  lup:62,  pyrite:652},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',          furnace:'Furnace',input:'10 000 Coal + 600 Coal',       yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★', furnace:'Furnace',input:'10 000 Coal + 720 Calx Powder',yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM = bon.ironmaster ? 1.03 : 1;
    const EM = 1 + (bon.extractBonus||0)/100;
    const RO = 7000 * IM;
    const T  = target;
    const isAvail = name => tools[name] !== false;

    const pigR  = this.steps[0].options[sel.pig??1];
    const bloR  = this.steps[1].options[sel.blo??3];
    const galR  = this.steps[3].options[sel.gal??2];
    const pyrR  = this.steps[4].options[sel.pyr??4];
    const cokeR = this.steps[5].options[sel.coke??1];

    // ── Cronite: 10000 Grain Steel + 5000 Almine + 5000 Arconite → RO ──
    const needGS  = r(T, RO, 10000);
    const needAl  = r(T, RO, 5000);
    const needArc = r(T, RO, 5000);

    // ── Grain Steel: 10000 Pig Iron + 5000 Coke + 5000 Calx Powder → RO ──
    const needPig     = r(needGS, RO, 10000);
    const needCoke_gs = r(needGS, RO, 5000);
    const needCP_gs   = r(needGS, RO, 5000);

    // ── Pig Iron ← Blood Ore ──
    const pigYield  = pigR.yield * EM;
    const needBO    = r(needPig, pigYield, 10000);
    const cokePig   = pigR.isSulfur ? 0 : r(needPig, pigYield, pigR.catAmt);
    const sulfurPig = pigR.isSulfur ? r(needPig, pigYield, pigR.catAmt) : 0;

    // ── Blood Ore ← base ──
    const bloYield    = bloR.yield * EM;
    const needBloBase = r(needBO, bloYield, 10000);
    const bloCat      = r(needBO, bloYield, bloR.catAmt);
    // Galbinum побочка из Blood Ore рецепта
    const galbFromBlo = bloR.galbFromBlo ? r(needBO, bloYield, bloR.galb) : 0;

    // ── Almine + Arconite: решаем систему уравнений для микса BF и GN ──
    // BF:  400*EM Almine + 800*EM Arconite за 10000 Pyroxene
    // GN: 2000*EM Almine + 160*EM Arconite за 10000 Pyroxene
    // x*400*EM + y*2000*EM = needAl
    // x*800*EM + y*160*EM  = needArc
    const aBF_al=400*EM, aBF_arc=800*EM, aGN_al=2000*EM, aGN_arc=160*EM;
    const det = aBF_al*aGN_arc - aGN_al*aBF_arc; // всегда != 0
    // прогонов за 10000 Pyroxene:
    let xBF = (needAl*aGN_arc - needArc*aGN_al) / det;
    let yGN = (aBF_al*needArc - aBF_arc*needAl) / det;
    // если отрицательное — зажимаем в 0 и пересчитываем по одной печи
    if (xBF < 0) { xBF=0; yGN=Math.max(needAl/aGN_al, needArc/aGN_arc); }
    if (yGN < 0) { yGN=0; xBF=Math.max(needAl/aBF_al, needArc/aBF_arc); }
    const pyroxeneForAl = (xBF + yGN) * 10000;
    const calxPowderForAl = (xBF + yGN) * 800; // одинаковый катализатор у обоих

    // ── Pyroxene ← Galbinum ──
    const pyrYield = pyrR.yield * EM;
    const needGalb_pyr  = r(pyroxeneForAl, pyrYield, 10000);
    const cokePyr       = (pyrR.cat==='Coke')       ? r(pyroxeneForAl, pyrYield, pyrR.catAmt) : 0;
    const calxPowderPyr = (pyrR.cat==='CalxPowder') ? r(pyroxeneForAl, pyrYield, pyrR.catAmt) : 0;
    const borPyr        = (pyrR.cat==='Bor')        ? r(pyroxeneForAl, pyrYield, pyrR.catAmt) : 0;
    const lupFromPyr    = r(pyroxeneForAl, pyrYield, pyrR.lup); // побочка Lupium
    const pyriteFromPyr = pyrR.pyrite ? r(pyroxeneForAl, pyrYield, pyrR.pyrite) : 0;

    // ── Galbinum: нужно needGalb_pyr, вычитаем побочку из Blood Ore ──
    const netGalb    = Math.max(0, needGalb_pyr - galbFromBlo);
    const galFromBloUsed = Math.min(galbFromBlo, needGalb_pyr);

    const galYield   = galR.yield * EM;
    const needGalBase = r(netGalb, galYield, 10000);
    const galCat     = r(netGalb, galYield, galR.catAmt);
    const bloFromGal = galR.bloByproduct ? r(netGalb, galYield, galR.bloByproduct) : 0; // Blood Ore побочка из Galbinum

    // ── Calx Powder суммарно ──
    // нужно: для GS, для Blood Ore рецепта (если Attractor), для Almine/Arconite, для Pyroxene, для Galbinum рецепта
    const cpForBlo = (bloR.cat==='CalxPowder') ? bloCat : 0;
    const cpForGal = (galR.cat==='CalxPowder') ? galCat : 0;
    let totalCP = needCP_gs + cpForBlo + calxPowderForAl + calxPowderPyr + cpForGal;

    // Coke для Coke рецепта (Calx Powder катализатор) тоже добавим ниже после расчёта Coke

    // Coke суммарно (предварительно без cokeCalxPowder-катализатора)
    const cokeBlo = (bloR.cat==='Coke') ? bloCat : 0;
    const cokeGal = (galR.cat==='Coke') ? galCat : 0;
    const cokeTotal_pre = needCoke_gs + cokePig + cokeBlo + cokeGal + cokePyr;

    // Coke рецепт
    const cokeYield = 7200 * EM;
    const needCoal_for_coke = r(cokeTotal_pre, cokeYield, cokeR.coalTotal);
    const cpForCoke = cokeR.useCalxPowder ? r(cokeTotal_pre, cokeYield, cokeR.calxPowderCat) : 0;

    // добавляем cpForCoke в totalCP
    totalCP += cpForCoke;

    // ── Calx: смешиваем Crusher/Grinder, чтобы закрыть Calx Powder и Coal без остатка ──
    const calxCrusher = this.steps[2].options[0], calxGrinder = this.steps[2].options[1];
    const totalCoalNeed = needCoal_for_coke;
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (totalCP*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*totalCP) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=totalCP/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=totalCP/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = totalCP/cpCr;
    } else {
      yGrinder = totalCP/cpGr;
    }
    const needCalx_total = (xCrusher + yGrinder) * 10000;
    const waterCalx      = yGrinder * calxGrinder.catAmt;
    const coalFromCalx   = xCrusher*coalCr + yGrinder*coalGr;

    // Coal: нужно для Coke, часть покрывается побочкой из Calx
    const netCoal = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed);

    // ── Базовые руды ──
    let needGranum=0, needGabore=0, needTephra=0;
    if (bloR.base==='Granum') needGranum += needBloBase;
    if (bloR.base==='Gabore') needGabore += needBloBase;
    if (galR.base==='Gabore') needGabore += needGalBase;
    if (galR.base==='Tephra') needTephra += needGalBase;

    // ── Катализаторы итого ──
    const needBor =
      (bloR.cat==='Bor' ? bloCat : 0) +
      (galR.cat==='Bor' ? galCat : 0) +
      (pyrR.cat==='Bor' ? borPyr : 0);
    const needWater = waterCalx + (galR.cat==='Water' ? galCat : 0);
    const needSulfur = sulfurPig;

    // ── tree ──
    const tree = [
      {name:'Cronite',         cls:'final',        amount:T,              prefix:''},
      {divider:true},
      {name:'Grain Steel',     cls:'intermediate', amount:needGS,         prefix:'├─ '},
      {name:t('tree.itemNeeded',{item:'Almine'}),  cls:'intermediate', amount:needAl,         prefix:'├─ '},
      {name:t('tree.itemNeeded',{item:'Arconite'}),cls:'intermediate', amount:needArc,        prefix:'└─ '},
      {divider:true},
      // Grain Steel
      {name:'Pig Iron',        cls:'intermediate', amount:needPig,        prefix:'   ├─ '},
      {name:t('tree.itemForTarget',{item:'Coke',target:'GS'}),   cls:'intermediate', amount:needCoke_gs,    prefix:'   ├─ '},
      {name:t('tree.itemForTarget',{item:'Calx Powder',target:'GS'}), cls:'intermediate', amount:needCP_gs, prefix:'   └─ '},
      {divider:true},
      // Pig Iron
      {name:'Blood Ore',       cls:'intermediate', amount:needBO,         prefix:'      └─ '},
      {divider:true},
      // Blood Ore source
      ...(bloR.base==='Granum'?[{name:'Granum', cls:'base-ore', amount:needBloBase, prefix:'         ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(bloR.base==='Gabore'?[{name:t('tree.itemForTarget',{item:'Gabore',target:'Blood Ore'}), cls:'base-ore', amount:needBloBase, prefix:'         ', tag:'mine', tagLabel:'ore'}]:[]),
      {divider:true},
      // Almine + Arconite mix
      {name:t('tree.mixRunsFull',{x:'Pyroxene',y:'Almine/Arconite',bf:xBF.toFixed(1),gn:yGN.toFixed(1)}), cls:'intermediate', amount:pyroxeneForAl, prefix:'   ├─ '},
      {divider:true},
      // Pyroxene source
      {name:t('tree.itemForTarget',{item:'Galbinum',target:'Pyroxene'}), cls:'intermediate', amount:needGalb_pyr, prefix:'      └─ '},
      ...(galbFromBlo>0?[{name:t('tree.byproductArrowFromSourceN',{source:'Blood Ore',n:Math.round(galFromBloUsed).toLocaleString('ru')}), cls:'base-easy', amount:galFromBloUsed, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      {name:t('tree.itemBuyOrMine',{item:'Galbinum'}), cls:'intermediate', amount:netGalb, prefix:'      └─ '},
      {divider:true},
      // Galbinum source
      ...(galR.base==='Gabore'?[{name:t('tree.itemForTarget',{item:'Gabore',target:'Galbinum'}), cls:'base-ore', amount:needGalBase, prefix:'         ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(galR.base==='Tephra'?[{name:'Tephra', cls:'base-ore', amount:needGalBase, prefix:'         ', tag:'mine', tagLabel:'ore'}]:[]),
      {divider:true},
      // byproducts
      ...(lupFromPyr>0?[{name:t('tree.byproductParenFrom',{item:'Lupium',source:'Pyroxene'}), cls:'base-easy', amount:lupFromPyr, prefix:'         ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(pyriteFromPyr>0?[{name:t('tree.byproductParenFrom',{item:'Pyrite',source:'Pyroxene'}), cls:'base-easy', amount:pyriteFromPyr, prefix:'         ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(bloFromGal>0?[{name:t('tree.byproductParenFrom',{item:'Blood Ore',source:'Galbinum'}), cls:'base-easy', amount:bloFromGal, prefix:'         ', tag:'easy', tagLabel:'bonus'}]:[]),
      {divider:true},
      // Coke
      {name:t('tree.itemTotalParen',{item:'Coke'}),    cls:'intermediate', amount:cokeTotal_pre,  prefix:'├─ '},
      {name:t('tree.itemForTarget',{item:'Coal',target:'Coke'}), cls:'intermediate', amount:needCoal_for_coke, prefix:'│  └─ '},
      {divider:true},
      // Calx Powder
      {name:t('tree.itemTotalParen',{item:'Calx Powder'}), cls:'intermediate', amount:totalCP,   prefix:'└─ '},
      {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalx_total, prefix:'   └─ ', tag:'mine', tagLabel:'ore'},
      {divider:true},
      // totals
      {name:t('tree.totalBaseResources'), cls:'intermediate', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum',  cls:'base-ore',  amount:needGranum,  prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needGabore>0?[{name:'Gabore',  cls:'base-ore',  amount:needGabore,  prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needTephra>0?[{name:'Tephra',  cls:'base-ore',  amount:needTephra,  prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      {name:'Calx',            cls:'base-ore',     amount:needCalx_total, prefix:'', tag:'mine', tagLabel:'ore'},
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore', amount:netCoal, prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needBor>0?[{name:'Bor',        cls:'base-hard', amount:needBor,    prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needSulfur>0?[{name:'Sulfur',  cls:'base-buy',  amount:needSulfur, prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',    cls:'base-easy', amount:needWater,  prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];

    return { target:T, runs:T/7000, tree };
  }
},
{
  id:'bron', name:'Bron',
  defaultSel:{cup:5, mal:7, cals:0, bleck:0, sab:1, coke:1, calx:1},
  steps:[
    {id:'cup', label:'Cuprum', options:[
      // Amarantum-based
      {label:'Crusher + Amarantum',              furnace:'Crusher',      input:'10 000 Amarantum',              yield:270,  cat:null,    catAmt:0,   base:'Amarantum', calamine:90,  electrum:180, waterstone:900, bleck:135},
      {label:'Furnace + Amarantum + Bor',        furnace:'Furnace',      input:'10 000 Amarantum + 720 Bor',    yield:2400, cat:'Bor',   catAmt:720, base:'Amarantum', calamine:563, electrum:480, bleck:960},
      {label:'Blast Furnace + Amarantum + Bor ★',furnace:'Blast Furnace',input:'10 000 Amarantum + 900 Bor',    yield:3000, cat:'Bor',   catAmt:900, base:'Amarantum', calamine:624, electrum:800, bleck:600,},
      // Electrum-based
      {label:'Blast Furnace + Electrum + CalxP', furnace:'Blast Furnace',input:'10 000 Electrum + 800 Calx Powder', yield:3500, cat:'CalxPowder', catAmt:800, base:'Electrum', gold:1750, silver:2500},
      {label:'Furnace + Electrum + CalxP',       furnace:'Furnace',      input:'10 000 Electrum + 640 Calx Powder', yield:2600, cat:'CalxPowder', catAmt:640, base:'Electrum', gold:1400, silver:1600},
      // Malachite-based
      {label:'Blast Furnace + Malachite + Bor',  furnace:'Blast Furnace',input:'10 000 Malachite + 900 Bor',    yield:5000, cat:'Bor',   catAmt:900, base:'Malachite'},
      {label:'Fabricula + Malachite + Bor',      furnace:'Fabricula',    input:'10 000 Malachite + 720 Bor',    yield:4000, cat:'Bor',   catAmt:720, base:'Malachite', sulfur:200},
      {label:'Fabricula + Malachite + Coke',     furnace:'Fabricula',    input:'10 000 Malachite + 385 Coke',   yield:4000, cat:'Coke',  catAmt:385, base:'Malachite', sulfur:320},
      {label:'Fabricula + Malachite + Coal',     furnace:'Fabricula',    input:'10 000 Malachite + 530 Coal',   yield:2400, cat:'Coal',  catAmt:530, base:'Malachite', sulfur:640},
      {label:'Furnace + Malachite + Bor',        furnace:'Furnace',      input:'10 000 Malachite + 720 Bor',    yield:4000, cat:'Bor',   catAmt:720, base:'Malachite', sulfur:200},
      {label:'Furnace + Malachite + Coke',       furnace:'Furnace',      input:'10 000 Malachite + 400 Coke',   yield:4000, cat:'Coke',  catAmt:400, base:'Malachite', sulfur:83},
      {label:'Blast Furnace + Malachite + Coke', furnace:'Blast Furnace',input:'10 000 Malachite + 385 Coke',   yield:5000, cat:'Coke',  catAmt:385, base:'Malachite'},
    ]},
    {id:'mal', label:'Malachite', options:[
      // Calspar-based
      {label:'BF + Calspar + Dragon Salt',   furnace:'Blast Furnace',input:'10 000 Calspar + 280 Dragon Salt', yield:2064, cat:'DragonSalt', catAmt:280,  base:'Calspar', electrum:224, chalkGlance:700},
      {label:'BF + Calspar + Ichor',         furnace:'Blast Furnace',input:'10 000 Calspar + 1 000 Ichor',     yield:3302, cat:'Ichor',      catAmt:1000, base:'Calspar', electrum:425, chalkGlance:490},
      {label:'BF + Calspar + Sulfur',        furnace:'Blast Furnace',input:'10 000 Calspar + 490 Sulfur',      yield:2373, cat:'Sulfur',     catAmt:490,  base:'Calspar', electrum:291, chalkGlance:448},
      {label:'Furnace + Calspar + Dragon Salt',furnace:'Furnace',    input:'10 000 Calspar + 133 Dragon Salt', yield:1444, cat:'DragonSalt', catAmt:133,  base:'Calspar', electrum:88,  chalkGlance:245},
      {label:'Furnace + Calspar + Ichor',    furnace:'Furnace',      input:'10 000 Calspar + 700 Ichor',       yield:2793, cat:'Ichor',      catAmt:700,  base:'Calspar', electrum:211, chalkGlance:159},
      {label:'Furnace + Calspar + Sulfur',   furnace:'Furnace',      input:'10 000 Calspar + 490 Sulfur',      yield:1781, cat:'Sulfur',     catAmt:490,  base:'Calspar', electrum:129, chalkGlance:142},
      {label:'Furnace + Calspar + Water',    furnace:'Furnace',      input:'10 000 Calspar + 1 000 Water',     yield:3467, cat:'Water',      catAmt:1000, base:'Calspar', electrum:108, chalkGlance:72},
      {label:'Furnace + Calspar + Bor ★',   furnace:'Furnace',      input:'10 000 Calspar + 630 Bor',         yield:4816, cat:'Bor',        catAmt:630,  base:'Calspar', electrum:294, chalkGlance:73,},
      {label:'Furnace + Calspar + Coke',     furnace:'Furnace',      input:'10 000 Calspar + 341 Coke',        yield:3295, cat:'Coke',       catAmt:341,  base:'Calspar', electrum:211, chalkGlance:73},
      {label:'Fabricula + Calspar + Ichor',  furnace:'Fabricula',    input:'10 000 Calspar + 1 000 Ichor',     yield:1375, cat:'Ichor',      catAmt:1000, base:'Calspar', electrum:336, chalkGlance:210},
      {label:'Fabricula + Calspar + Sulfur', furnace:'Fabricula',    input:'10 000 Calspar + 700 Sulfur',      yield:334,  cat:'Sulfur',     catAmt:700,  base:'Calspar', electrum:112, chalkGlance:167},
      {label:'Fabricula + Calspar + Bor',    furnace:'Fabricula',    input:'10 000 Calspar + 900 Bor',         yield:3440, cat:'Bor',        catAmt:900,  base:'Calspar', electrum:560},
      // Calx-based (даёт и Calspar и Malachite)
      {label:'Crusher + Calx (gives Calspar+Mal)',furnace:'Crusher',  input:'10 000 Calx',                      yield:891,  cat:null,         catAmt:0,    base:'Calx', calspar:360, calxPowder:1361, coal:2151},
      {label:'Grinder + Calx + Water',           furnace:'Grinder',  input:'10 000 Calx + 1 000 Water',        yield:528,  cat:'Water',      catAmt:1000, base:'Calx', calspar:2000,calxPowder:2058, coal:1140},
      // Saburra-based (даёт и Saburra Powder и Malachite)
      {label:'Crusher + Saburra (gives SP+Mal)',  furnace:'Crusher',  input:'10 000 Saburra',                   yield:1584, cat:null,         catAmt:0,    base:'Saburra', saburraP:2000, bleckblende:1584},
      {label:'Grinder + Saburra + Water',        furnace:'Grinder',  input:'10 000 Saburra + 900 Water',       yield:950,  cat:'Water',      catAmt:900,  base:'Saburra', saburraP:4275, bleckblende:1900},
    ]},
    {id:'cals', label:'Calspar', options:[
      {label:'Crusher + Calx',           furnace:'Crusher',input:'10 000 Calx',               yield:360,  cat:null,    catAmt:0,    mal:891,  calxPowder:1361, coal:2151},
      {label:'Grinder + Calx + Water',   furnace:'Grinder',input:'10 000 Calx + 1 000 Water', yield:2000, cat:'Water', catAmt:1000, mal:528,  calxPowder:2058, coal:1140},
      {label:'Furnace + Calx + Water ★', furnace:'Furnace',input:'10 000 Calx + 1 000 Water', yield:2560, cat:'Water', catAmt:1000, mal:506, },
    ]},
    {id:'bleck', label:'Bleck', options:[
      {label:'Greater Natorus + Bleckblende + Bor ★', furnace:'Greater Natorus', input:'10 000 Bleckblende + 900 Bor',      yield:6000, cat:'Bor',      catAmt:900, base:'Bleckblende'},
      {label:'Natorus + Bleckblende + Bor',            furnace:'Natorus',         input:'10 000 Bleckblende + 810 Bor',      yield:5400, cat:'Bor',      catAmt:810, base:'Bleckblende'},
      {label:'Natorus + Bleckblende + Rock Oil',       furnace:'Natorus',         input:'10 000 Bleckblende + 417 Rock Oil', yield:5400, cat:'Rock Oil', catAmt:417, base:'Bleckblende'},
      {label:'Furnace + Bleckblende + Bor',            furnace:'Furnace',        input:'10 000 Bleckblende + 720 Bor',      yield:1920, cat:'Bor',      catAmt:720, base:'Bleckblende'},
    ]},
    {id:'sab', label:'Saburra Powder', options:[
      {label:'Crusher + Saburra',           furnace:'Crusher',input:'10 000 Saburra',             yield:2000, cat:null,    catAmt:0,   mal:1584},
      {label:'Grinder + Saburra + Water ★', furnace:'Grinder',input:'10 000 Saburra + 900 Water', yield:4275, cat:'Water', catAmt:900, mal:950,},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher', input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder', input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM = bon.ironmaster ? 1.03 : 1;
    const EM = 1 + (bon.extractBonus||0)/100;
    const RO = 7000 * IM;
    const T  = target;
    const isAvail = name => tools[name] !== false;

    const cupR   = this.steps[0].options[sel.cup??5];
    const malR   = this.steps[1].options[sel.mal??7];
    const calsR  = this.steps[2].options[sel.cals??0];
    const bleckR = this.steps[3].options[sel.bleck??0];
    const sabR   = this.steps[4].options[sel.sab??1];
    const cokeR  = this.steps[5].options[sel.coke??1];

    // ── BRON: 10000 Cuprum + 5000 Bleck + 5000 Saburra Powder → RO ──
    const needCup   = r(T, RO, 10000);
    const needBleck = r(T, RO, 5000);
    const needSP    = r(T, RO, 5000);

    // ── SABURRA POWDER ──
    const sabYield    = sabR.yield * EM;
    const malFromSab  = sabR.mal ? r(needSP, sabYield, sabR.mal) : 0;

    // ── CUPRUM ──
    const cupYield = cupR.yield * EM;
    const needCupBase = r(needCup, cupYield, 10000);

    const electrumFromCup = cupR.electrum ? r(needCup, cupYield, cupR.electrum) : 0;
    const calamineFromCup = cupR.calamine ? r(needCup, cupYield, cupR.calamine) : 0;
    const waterstoneFromCup = cupR.waterstone ? r(needCup, cupYield, cupR.waterstone) : 0;
    const bleckFromCup = cupR.bleck ? r(needCup, cupYield, cupR.bleck) : 0; // побочка Bleck из Amarantum-Cuprum

    let needMal_forCup = 0;
    if (cupR.base === 'Malachite') needMal_forCup = needCupBase;
    let needAmarantum_forCup = 0;
    if (cupR.base === 'Amarantum') needAmarantum_forCup = needCupBase;
    const needGranum_cup = needAmarantum_forCup > 0 ? r(needAmarantum_forCup, 882*EM, 10000) : 0;

    // ── MALACHITE (для Cuprum, если нужен) ──
    const malYield = malR.yield * EM;
    const malPool_pre = malFromSab;
    let needMal_craft = 0, needCals_forMal = 0, calsYield = 0;

    if (malR.base === 'Calspar') {
      needMal_craft = Math.max(0, needMal_forCup - malPool_pre);
      needCals_forMal = r(needMal_craft, malYield, 10000);
    } else if (malR.base === 'Calx') {
      needMal_craft = Math.max(0, needMal_forCup - malPool_pre);
    } else if (malR.base === 'Saburra') {
      needMal_craft = Math.max(0, needMal_forCup - malPool_pre);
    }

    const malCat = needMal_craft > 0 ? r(needMal_craft, malYield, malR.catAmt) : 0;
    const electrumFromMal = (malR.electrum && needMal_craft > 0) ? r(needMal_craft, malYield, malR.electrum) : 0;
    const chalkGlanceBonus = (malR.chalkGlance && needMal_craft > 0) ? r(needMal_craft, malYield, malR.chalkGlance) : 0;
    const sabPFromMal = (malR.saburraP && needMal_craft > 0) ? r(needMal_craft, malYield, malR.saburraP) : 0;

    // ── CALSPAR (отдельный step, если Malachite из Calspar) ──
    calsYield = calsR.yield * EM;
    let needCalx_cals = 0, calsWater = 0, malFromCalsStep = 0, calxPowderFromCals = 0, coalFromCals = 0;
    if (malR.base === 'Calspar') {
      needCalx_cals = r(needCals_forMal, calsYield, 10000);
      calsWater     = r(needCals_forMal, calsYield, calsR.catAmt);
      malFromCalsStep = calsR.mal ? r(needCals_forMal, calsYield, calsR.mal) : 0;
      calxPowderFromCals = calsR.calxPowder ? r(needCals_forMal, calsYield, calsR.calxPowder) : 0;
      coalFromCals  = calsR.coal ? r(needCals_forMal, calsYield, calsR.coal) : 0;
    }

    // ── CALX (для Malachite, если base=Calx) ──
    let needCalx_mal = 0, malWater_calx = 0, calxPowderFromMalCalx = 0, coalFromMalCalx = 0, calsparFromMalCalx = 0;
    if (malR.base === 'Calx') {
      needCalx_mal = r(needMal_craft, malYield, 10000);
      malWater_calx = r(needMal_craft, malYield, malR.catAmt);
      calxPowderFromMalCalx = malR.calxPowder ? r(needMal_craft, malYield, malR.calxPowder) : 0;
      coalFromMalCalx = malR.coal ? r(needMal_craft, malYield, malR.coal) : 0;
      calsparFromMalCalx = malR.calspar ? r(needMal_craft, malYield, malR.calspar) : 0;
    }

    // ── SABURRA (для Malachite, если base=Saburra) ──
    let needSaburra_mal = 0, sabMalWater = 0;
    if (malR.base === 'Saburra') {
      needSaburra_mal = r(needMal_craft, malYield, 10000);
      sabMalWater = r(needMal_craft, malYield, malR.catAmt);
    }

    const sabPPool = malFromSab + sabPFromMal;
    const netSabP  = Math.max(0, needSP - sabPPool);
    const needSaburra_sp = netSabP > 0 ? r(netSabP, sabYield, 10000) : 0;
    const sabWater_sp    = netSabP > 0 ? r(netSabP, sabYield, sabR.catAmt) : 0;
    const totalSaburra   = needSaburra_sp + needSaburra_mal;

    // ── BLECK: вычитаем побочку из Cuprum (Amarantum-based) ──
    const netBleck   = Math.max(0, needBleck - bleckFromCup);
    const bleckBonus = Math.max(0, bleckFromCup - needBleck);
    const bleckYield = bleckR.yield * EM;
    const needBleckBase = netBleck > 0 ? r(netBleck, bleckYield, 10000) : 0;
    const bleckCat = netBleck > 0 ? r(netBleck, bleckYield, bleckR.catAmt) : 0;

    // ── CALX POWDER: катализаторы Cuprum/Coke против побочек Calspar/Malachite-via-Calx ──
    const cpForCup = cupR.cat==='CalxPowder' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const cpSupply = calxPowderFromCals + calxPowderFromMalCalx;
    const needCalxTotal = needCalx_cals + needCalx_mal;

    // ── COAL / COKE: Cuprum и Malachite могут требовать Coal напрямую или через Coke ──
    const cupCoal  = cupR.cat==='Coal' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const malCoke  = malR.cat==='Coke' ? malCat : 0;
    const cupCoke  = cupR.cat==='Coke' ? r(needCup, cupYield, cupR.catAmt) : 0;
    const totalCoke = malCoke + cupCoke;
    const cokeYield = 7200 * EM;
    const needCoal_coke = totalCoke > 0 ? r(totalCoke, cokeYield, cokeR.coalTotal) : 0;
    const cpForCoke = (totalCoke > 0 && cokeR.useCalxPowder) ? r(totalCoke, cokeYield, cokeR.calxPowderCat) : 0;

    // ── CALX POWDER дефицит: сколько докрафтить сверх побочек Calspar/Malachite ──
    const cpDemand  = cpForCup + cpForCoke;
    const cpDeficit = Math.max(0, cpDemand - cpSupply);

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть дефицит Calx Powder и Coal без остатка ──
    // (Coal-побочка из Calspar/Malachite-via-Calx крафта засчитывается в счёт нужды заранее)
    const coalPool = coalFromCals + coalFromMalCalx;
    const totalCoalNeedGross = cupCoal + needCoal_coke;
    const totalCoalNeed = Math.max(0, totalCoalNeedGross - coalPool);
    const coalPoolBonus = Math.max(0, coalPool - totalCoalNeedGross);
    const calxCrusher = this.steps[6].options[0], calxGrinder = this.steps[6].options[1];
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (cpDeficit*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*cpDeficit) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=cpDeficit/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=cpDeficit/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = cpDeficit/cpCr;
    } else {
      yGrinder = cpDeficit/cpGr;
    }
    const needCalxForCP  = (xCrusher + yGrinder) * 10000;
    const calxWaterForCP = yGrinder * calxGrinder.catAmt;
    const cpFromCalx      = xCrusher*cpCr + yGrinder*cpGr;
    const coalFromCalx    = xCrusher*coalCr + yGrinder*coalGr;

    const netCoal   = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed) + coalPoolBonus;
    const cpBonus    = Math.max(0, (cpSupply + cpFromCalx) - cpDemand);

    const needWater = sabWater_sp + calsWater + calxWaterForCP
      + (malR.cat==='Water' ? malCat : 0)
      + (malR.base==='Calx' ? malWater_calx : 0)
      + (malR.base==='Saburra' ? sabMalWater : 0);

    const needBor = (cupR.cat==='Bor' ? r(needCup, cupYield, cupR.catAmt) : 0)
                  + (malR.cat==='Bor' ? malCat : 0)
                  + (bleckR.cat==='Bor' ? bleckCat : 0);

    const needIchor      = malR.cat==='Ichor'      ? malCat : 0;
    const needDragonSalt = malR.cat==='DragonSalt' ? malCat : 0;
    const needSulfur_mal = malR.cat==='Sulfur'     ? malCat : 0;
    const needRockOil    = bleckR.cat==='Rock Oil' ? bleckCat : 0;
    const sulfurFromCup  = cupR.sulfur ? r(needCup, cupYield, cupR.sulfur) : 0;
    const goldBonus      = cupR.gold   ? r(needCup, cupYield, cupR.gold)   : 0;
    const silverBonus    = cupR.silver ? r(needCup, cupYield, cupR.silver) : 0;

    const needGranum = needGranum_cup;
    const needCalx_total = needCalxTotal + needCalxForCP;

    const tree = [
      {name:'Bron',        cls:'final',        amount:T,         prefix:''},
      {divider:true},
      {name:'Cuprum',         cls:'intermediate', amount:needCup,   prefix:'├─ '},
      {name:'Bleck',          cls:'intermediate', amount:needBleck, prefix:'├─ '},
      {name:'Saburra Powder', cls:'intermediate', amount:needSP,    prefix:'└─ '},
      {divider:true},

      // ── Cuprum
      {name:'▸ CUPRUM', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.xToY',{x:cupR.base,y:'Cuprum'}), cls:'intermediate', amount:needCupBase, prefix:'   └─ '},
      ...(cupR.base==='Amarantum'?[{name:t('tree.xToY',{x:'Granum',y:'Amarantum'}), cls:'base-ore', amount:needGranum_cup, prefix:'      └─ ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(electrumFromCup>0?[{name:t('tree.byproductParenFrom',{item:'Electrum',source:'Amarantum'}), cls:'base-easy', amount:electrumFromCup, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(calamineFromCup>0?[{name:t('tree.byproductParen',{item:'Calamine'}), cls:'base-easy', amount:calamineFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(waterstoneFromCup>0?[{name:t('tree.byproductParen',{item:'Waterstone'}), cls:'base-easy', amount:waterstoneFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(bleckFromCup>0?[{name:t('tree.byproductParenFromN',{item:'Bleck',source:cupR.base,n:Math.round(Math.min(bleckFromCup,needBleck)).toLocaleString('ru')}), cls:'base-easy', amount:Math.min(bleckFromCup,needBleck), prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(goldBonus>0?[{name:t('tree.byproductParen',{item:'Gold'}), cls:'base-easy', amount:goldBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(silverBonus>0?[{name:t('tree.byproductParen',{item:'Silver'}), cls:'base-easy', amount:silverBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(sulfurFromCup>0?[{name:t('tree.byproductParen',{item:'Sulfur'}), cls:'base-easy', amount:sulfurFromCup, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      {divider:true},

      // ── Bleck
      {name:'▸ BLECK', cls:'tree-section', amount:0, prefix:''},
      ...(bleckBonus>0?[{name:t('tree.bonusFromByproduct',{item:'Bleck',source:'Cuprum'}), cls:'base-easy', amount:bleckBonus, prefix:'   ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netBleck>0?[{name:t('tree.xToY',{x:'Bleckblende',y:'Bleck'}), cls:'intermediate', amount:needBleckBase, prefix:'   └─ '}]:[]),
      {divider:true},

      // ── Saburra Powder
      {name:'▸ SABURRA POWDER', cls:'tree-section', amount:0, prefix:''},
      ...(sabPPool>0?[{name:t('tree.itemFromPoolN',{item:'Saburra Powder',n:Math.round(Math.min(sabPPool,needSP)).toLocaleString('ru')}), cls:'base-easy', amount:Math.min(sabPPool,needSP), prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(netSabP>0?[{name:t('tree.xToYCraftMore',{x:'Saburra',y:'Saburra Powder'}), cls:'intermediate', amount:needSaburra_sp, prefix:'   └─ '}]:[]),
      {divider:true},

      // ── Malachite
      {name:'▸ MALACHITE', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemNeedFor',{item:'Malachite',target:'Cuprum'}), cls:'intermediate', amount:needMal_forCup, prefix:'   ├─ '},
      ...(malFromSab>0?[{name:t('tree.byproductArrowFromSourceN',{source:'Saburra Powder',n:Math.round(malFromSab).toLocaleString('ru')}), cls:'base-easy', amount:malFromSab, prefix:'   │  ', tag:'easy', tagLabel:'byproduct'}]:[]),
      {name:t('tree.itemCraftMore',{item:'Malachite'}), cls:'intermediate', amount:needMal_craft, prefix:'   └─ '},
      ...(malR.base==='Calspar'?[{name:t('tree.xToY',{x:'Calspar',y:'Malachite'}), cls:'intermediate', amount:needCals_forMal, prefix:'      └─ '}]:[]),
      ...(malR.base==='Calx'?[{name:t('tree.xToY',{x:'Calx',y:'Malachite'}), cls:'intermediate', amount:needCalx_mal, prefix:'      └─ '}]:[]),
      ...(malR.base==='Saburra'?[{name:t('tree.xToY',{x:'Saburra',y:'Malachite'}), cls:'intermediate', amount:needSaburra_mal, prefix:'      └─ '}]:[]),
      ...(electrumFromMal>0?[{name:t('tree.byproductParenFrom',{item:'Electrum',source:'Malachite'}), cls:'base-easy', amount:electrumFromMal, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(chalkGlanceBonus>0?[{name:t('tree.byproductParen',{item:'Chalk Glance'}), cls:'base-easy', amount:chalkGlanceBonus, prefix:'      ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(sabPFromMal>0?[{name:t('tree.byproductParenFrom',{item:'Saburra Powder',source:'Saburra'}), cls:'base-easy', amount:sabPFromMal, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(malFromCalsStep>0?[{name:t('tree.byproductArrowFrom',{item:'Malachite',source:'Calspar'}), cls:'base-easy', amount:malFromCalsStep, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
      {divider:true},

      // ── Calspar
      ...(malR.base==='Calspar'?[
        {name:'▸ CALSPAR', cls:'tree-section', amount:0, prefix:''},
        {name:t('tree.xToY',{x:'Calx',y:'Calspar'}), cls:'intermediate', amount:needCalx_cals, prefix:'   └─ '},
        ...(calxPowderFromCals>0?[{name:t('tree.byproductParenFrom',{item:'Calx Powder',source:'Calspar'}), cls:'base-easy', amount:calxPowderFromCals, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(coalFromCals>0?[{name:t('tree.byproductParenFrom',{item:'Coal',source:'Calspar'}), cls:'base-easy', amount:coalFromCals, prefix:'      ', tag:'easy', tagLabel:'byproduct'}]:[]),
        {divider:true},
      ]:[]),

      // ── Calx Powder / Coke (if Cuprum/Malachite need CalxPowder or Coke) ──
      ...(cpDemand>0||totalCoalNeed>0?[
        {name:'▸ CALX POWDER / COKE', cls:'tree-section', amount:0, prefix:''},
        ...(cpForCup>0?[{name:t('tree.itemNeedFor',{item:'Calx Powder',target:'Cuprum'}), cls:'intermediate', amount:cpForCup, prefix:'   ├─ '}]:[]),
        ...(totalCoke>0?[
          {name:t('tree.itemTotalParen',{item:'Coke'}), cls:'intermediate', amount:totalCoke, prefix:'   ├─ '},
          {name:t('tree.itemForTargetNoParen',{item:'Coal',target:'Coke'}), cls:'intermediate', amount:needCoal_coke, prefix:'   │  └─ '},
        ]:[]),
        ...(calsparFromMalCalx>0?[{name:t('tree.byproductParenFrom',{item:'Calspar',source:'Malachite-via-Calx'}), cls:'base-easy', amount:calsparFromMalCalx, prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(coalFromMalCalx>0?[{name:t('tree.byproductParenFrom',{item:'Coal',source:'Malachite-via-Calx'}), cls:'base-easy', amount:coalFromMalCalx, prefix:'   ', tag:'easy', tagLabel:'byproduct'}]:[]),
        {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalxForCP, prefix:'   └─ ', tag:'mine', tagLabel:'ore'},
        {divider:true},
      ]:[]),

      // ── totals
      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum',      cls:'base-ore', amount:needGranum,     prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needBleckBase>0?[{name:'Bleckblende', cls:'base-ore', amount:needBleckBase, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(totalSaburra>0?[{name:'Saburra',    cls:'base-ore', amount:totalSaburra,   prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needCalx_total>0?[{name:'Calx',     cls:'base-ore', amount:needCalx_total, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(cpBonus>0?[{name:t('tree.bonusParen',{item:'Calx Powder'}), cls:'base-easy', amount:cpBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore', amount:netCoal, prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needBor>0?[{name:'Bor',             cls:'base-hard',amount:needBor,        prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needIchor>0?[{name:'Ichor',         cls:'base-buy', amount:needIchor,      prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needDragonSalt>0?[{name:'Dragon Salt',cls:'base-buy',amount:needDragonSalt,prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needSulfur_mal>0?[{name:'Sulfur',   cls:'base-buy', amount:needSulfur_mal, prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needRockOil>0?[{name:'Rock Oil',    cls:'base-buy', amount:needRockOil,    prefix:'', tag:'buy',  tagLabel:'purchase'}]:[]),
      ...(needWater>0?[{name:'Water',         cls:'base-easy',amount:needWater,      prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];

    return { target:T, runs:T/7000, tree };
  }
},
{
  id:'tungsteel', name:'Tungsteel',
  defaultSel:{lup:0, blo:3, calx:1, pig:1, gal:2, coke:1},
  steps:[
    {id:'lup', label:'Lupium', options:[
      {label:'Blast Furnace + Waterstone + Fuming Salt ★', furnace:'Blast Furnace', input:'10 000 Waterstone + 360 Fuming Salt', yield:3200, cat:'Fuming Salt', catAmt:360, base:'Waterstone',},
      {label:'Blast Furnace + Waterstone + Bor',           furnace:'Blast Furnace', input:'10 000 Waterstone + 720 Bor',         yield:2048, cat:'Bor',         catAmt:720, base:'Waterstone'},
      {label:'Fabricula + Waterstone + Fuming Salt',       furnace:'Fabricula',     input:'10 000 Waterstone + 360 Fuming Salt', yield:2400, cat:'Fuming Salt', catAmt:360, base:'Waterstone'},
      {label:'Blast Furnace + Galbinum + Calx Powder',     furnace:'Blast Furnace', input:'10 000 Galbinum + 640 Calx Powder',   yield:298,  cat:'CalxPowder', catAmt:640, base:'Galbinum'},
    ]},
    {id:'blo', label:'Blood Ore', options:[
      {label:'Grinder + Gabore + Bor',              furnace:'Grinder',  input:'10 000 Gabore + 630 Bor',          yield:226,  cat:'Bor',        catAmt:630, base:'Gabore', galb:1050, galbFromBlo:true},
      {label:'Furnace + Gabore + Coke',             furnace:'Furnace',  input:'10 000 Gabore + 360 Coke',         yield:568,  cat:'Coke',       catAmt:360, base:'Gabore', galb:236,  galbFromBlo:true},
      {label:'Crusher + Granum',                    furnace:'Crusher',  input:'10 000 Granum',                    yield:770,  cat:null,         catAmt:0,   base:'Granum', gp:2940},
      {label:'Attractor + Granum + Calx Powder ★',  furnace:'Attractor',input:'10 000 Granum + 720 Calx Powder',  yield:1980, cat:'CalxPowder', catAmt:720, base:'Granum',},
    ]},
    {id:'calx', label:'Calx Powder', options:[
      {label:'Crusher + Calx',           furnace:'Crusher', input:'10 000 Calx',               yield:1361, cat:null,    catAmt:0,    coal:2151},
      {label:'Grinder + Calx + Water ★', furnace:'Grinder', input:'10 000 Calx + 1 000 Water', yield:2058, cat:'Water', catAmt:1000, coal:1140,},
    ]},
    {id:'pig', label:'Pig Iron', options:[
      {label:'Furnace',         furnace:'Furnace',       input:'10 000 Blood Ore + 400 Coke', yield:4000, catAmt:400},
      {label:'Blast Furnace ★', furnace:'Blast Furnace', input:'10 000 Blood Ore + 390 Coke', yield:5000, catAmt:390,},
      {label:'Furnace + Sulfur',furnace:'Furnace',       input:'10 000 Blood Ore + 580 Sulfur',yield:4000,catAmt:580, isSulfur:true},
    ]},
    {id:'gal', label:'Galbinum', options:[
      {label:'Grinder + Gabore + Bor',           furnace:'Grinder',        input:'10 000 Gabore + 630 Bor',         yield:1050, cat:'Bor',        catAmt:630, base:'Gabore', bloByproduct:226},
      {label:'Furnace + Gabore + Coke',          furnace:'Furnace',        input:'10 000 Gabore + 360 Coke',        yield:236,  cat:'Coke',       catAmt:360, base:'Gabore', bloByproduct:568},
      {label:'Grinder + Tephra + Bor ★',         furnace:'Grinder',        input:'10 000 Tephra + 720 Bor',         yield:1999, cat:'Bor',        catAmt:720, base:'Tephra',},
      {label:'Grinder + Tephra + Water',         furnace:'Grinder',        input:'10 000 Tephra + 1 000 Water',     yield:1900, cat:'Water',      catAmt:1000,base:'Tephra'},
      {label:'Greater Natorus + Tephra + CalxP', furnace:'Greater Natorus',input:'10 000 Tephra + 800 Calx Powder', yield:499,  cat:'CalxPowder', catAmt:800, base:'Tephra'},
      {label:'Greater Natorus + Tephra + Bor',   furnace:'Greater Natorus',input:'10 000 Tephra + 900 Bor',         yield:1249, cat:'Bor',        catAmt:900, base:'Tephra'},
      {label:'Furnace + Tephra + Calx Powder',   furnace:'Furnace',        input:'10 000 Tephra + 800 Calx Powder', yield:299,  cat:'CalxPowder', catAmt:800, base:'Tephra'},
    ]},
    {id:'coke', label:'Coke', options:[
      {label:'Furnace + Coal + Coal',           furnace:'Furnace', input:'10 000 Coal + 600 Coal',        yield:7200, coalTotal:10600, useCalxPowder:false},
      {label:'Furnace + Coal + Calx Powder ★',  furnace:'Furnace', input:'10 000 Coal + 720 Calx Powder', yield:7200, coalTotal:10000, useCalxPowder:true, calxPowderCat:720,},
    ]},
  ],
  calc(target, sel, bon={}, tools={}, t=(k)=>k) {
    const IM = bon.ironmaster ? 1.03 : 1;
    const EM = 1 + (bon.extractBonus||0)/100;
    const RO = 7000 * IM;
    const T  = target;
    const isAvail = name => tools[name] !== false;

    const lupR  = this.steps[0].options[sel.lup??0];
    const bloR  = this.steps[1].options[sel.blo??3];
    const pigR  = this.steps[3].options[sel.pig??1];
    const galR  = this.steps[4].options[sel.gal??2];
    const cokeR = this.steps[5].options[sel.coke??1];

    // ── Tungsteel: 10000 Grain Steel + 5000 Lupium + 5000 Granum Powder → RO ──
    const needGS  = r(T, RO, 10000);
    const needLup = r(T, RO, 5000);
    const needGP  = r(T, RO, 5000);

    // ── Grain Steel: 10000 Pig Iron + 5000 Coke + 5000 Calx Powder → RO ──
    const needPig     = r(needGS, RO, 10000);
    const needCoke_gs = r(needGS, RO, 5000);
    const needCP_gs   = r(needGS, RO, 5000);

    // ── Pig Iron ← Blood Ore ──
    const pigYield  = pigR.yield * EM;
    const needBO      = r(needPig, pigYield, 10000);
    const cokeForPig  = pigR.isSulfur ? 0 : r(needPig, pigYield, pigR.catAmt);
    const sulfurForPig= pigR.isSulfur ? r(needPig, pigYield, pigR.catAmt) : 0;

    // ── Blood Ore ← база ──
    const bloYield    = bloR.yield * EM;
    const needBloBase = r(needBO, bloYield, 10000);
    const bloCat      = r(needBO, bloYield, bloR.catAmt);
    const galbFromBlo = bloR.galbFromBlo ? r(needBO, bloYield, bloR.galb) : 0;
    const gpFromBlo   = bloR.gp ? r(needBO, bloYield, bloR.gp) : 0;

    // ── GRANUM POWDER: побочка Blood Ore (crusher), если не хватает — доп. прогоны ──
    const gpExtra     = Math.max(0, needGP - gpFromBlo);
    const granumForGP = gpExtra > 0 ? r(gpExtra, 2940*EM, 10000) : 0;
    const gpBonus     = Math.max(0, gpFromBlo - needGP);

    // ── LUPIUM: прямая цель, докрафтить весь объём ──
    const lupYield    = lupR.yield * EM;
    const needLupExtra = r(needLup, lupYield, 10000);
    const lupCat      = r(needLup, lupYield, lupR.catAmt);
    const needGalb_lup = lupR.base==='Galbinum' ? needLupExtra : 0;
    const borForLup   = lupR.cat==='Bor'         ? lupCat : 0;
    const fsForLup    = lupR.cat==='Fuming Salt' ? lupCat : 0;

    // Waterstone → Amarantum → Granum
    let needWS=0, needAmarantum=0, granumForWS=0;
    let granumFromAmarantum_blo=0, granumFromAmarantum_gp=0;
    if (lupR.base==='Waterstone') {
      needWS = needLupExtra;
      needAmarantum = r(needWS, 900*EM, 10000);
      granumForWS   = r(needAmarantum, 882*EM, 10000);
      granumFromAmarantum_blo = r(needAmarantum, 882*EM, 770);
      granumFromAmarantum_gp  = r(needAmarantum, 882*EM, 2940);
    }

    // ── GALBINUM пул: нужно для Lupium (если base=Galbinum), вычитаем побочку из Blood Ore ──
    const galbPool = galbFromBlo;
    const netGalb_lup = Math.max(0, needGalb_lup - galbPool);
    const galbUsedFromPool = Math.min(galbPool, needGalb_lup);
    const galbPoolRemainder = Math.max(0, galbPool - needGalb_lup);

    const galYield  = galR.yield * EM;
    const needGalBase = netGalb_lup > 0 ? r(netGalb_lup, galYield, 10000) : 0;
    const galCat    = netGalb_lup > 0 ? r(netGalb_lup, galYield, galR.catAmt) : 0;
    const bloFromGal = galR.bloByproduct ? r(netGalb_lup > 0 ? needGalBase : 0, galYield, galR.bloByproduct) : 0;

    // ── CALX POWDER суммарно ──
    const cpForBlo  = bloR.cat==='CalxPowder' ? bloCat : 0;
    const cpForGal  = galR.cat==='CalxPowder' ? galCat : 0;
    const cpForLup  = lupR.cat==='CalxPowder' ? lupCat : 0;
    let totalCP = needCP_gs + cpForBlo + cpForGal + cpForLup;

    // ── COKE суммарно (предв.) ──
    const cokeForBlo  = bloR.cat==='Coke' ? bloCat : 0;
    const cokeForGal  = galR.cat==='Coke' ? galCat : 0;
    const totalCoke_pre = needCoke_gs + cokeForPig + cokeForBlo + cokeForGal;

    // Coke рецепт
    const cokeYield  = 7200 * EM;
    const needCoal_coke = r(totalCoke_pre, cokeYield, cokeR.coalTotal);
    const cpForCoke  = cokeR.useCalxPowder ? r(totalCoke_pre, cokeYield, cokeR.calxPowderCat) : 0;
    totalCP += cpForCoke;

    // ── CALX: смешиваем Crusher/Grinder, чтобы закрыть Calx Powder и Coal без остатка ──
    const calxCrusher = this.steps[2].options[0], calxGrinder = this.steps[2].options[1];
    const totalCoalNeed = needCoal_coke;
    const cpCr = calxCrusher.yield*EM, coalCr = calxCrusher.coal*EM;
    const cpGr = calxGrinder.yield*EM, coalGr = calxGrinder.coal*EM;
    let xCrusher = 0, yGrinder = 0;
    if (isAvail('Crusher') && isAvail('Grinder')) {
      const calxDet = cpCr*coalGr - cpGr*coalCr;
      xCrusher = (totalCP*coalGr - totalCoalNeed*cpGr) / calxDet;
      yGrinder = (cpCr*totalCoalNeed - coalCr*totalCP) / calxDet;
      if (xCrusher < 0) { xCrusher=0; yGrinder=totalCP/cpGr; }
      if (yGrinder < 0) { yGrinder=0; xCrusher=totalCP/cpCr; }
    } else if (isAvail('Crusher')) {
      xCrusher = totalCP/cpCr;
    } else {
      yGrinder = totalCP/cpGr;
    }
    const needCalxTotal = (xCrusher + yGrinder) * 10000;
    const waterForCalx  = yGrinder * calxGrinder.catAmt;
    const coalFromCalx  = xCrusher*coalCr + yGrinder*coalGr;

    // ── COAL ──
    const netCoal = Math.max(0, totalCoalNeed - coalFromCalx);
    const coalBonus = Math.max(0, coalFromCalx - totalCoalNeed);

    // ── БАЗОВЫЕ РУДЫ ──
    let needGranum=0, needGabore=0, needTephra=0;
    if (bloR.base==='Granum')  needGranum += needBloBase;
    if (bloR.base==='Gabore')  needGabore += needBloBase;
    if (galR.base==='Gabore')  needGabore += needGalBase;
    if (galR.base==='Tephra')  needTephra += needGalBase;
    if (lupR.base==='Waterstone') needGranum += granumForWS;
    needGranum += granumForGP;

    // ── КАТАЛИЗАТОРЫ ──
    const needBor  = (bloR.cat==='Bor' ? bloCat : 0)
                   + (galR.cat==='Bor' ? galCat : 0)
                   + borForLup;
    const needFS   = fsForLup;
    const needSulfur = sulfurForPig;
    const needWater  = (galR.cat==='Water' ? galCat : 0) + waterForCalx;

    const tree = [
      {name:'Tungsteel', cls:'final', amount:T, prefix:''},
      {divider:true},
      {name:'Grain Steel', cls:'intermediate', amount:needGS, prefix:'├─ '},
      {name:t('tree.itemNeed',{item:'Lupium',n:Math.round(needLup).toLocaleString('ru')}), cls:'intermediate', amount:needLup, prefix:'├─ '},
      {name:t('tree.itemNeed',{item:'Granum Powder',n:Math.round(needGP).toLocaleString('ru')}), cls:'intermediate', amount:needGP, prefix:'└─ '},
      {divider:true},
      {name:'▸ GRAIN STEEL', cls:'tree-section', amount:0, prefix:''},
      {name:'Pig Iron', cls:'intermediate', amount:needPig, prefix:'   ├─ '},
      {name:t('tree.itemForTarget',{item:'Coke',target:'GS'}), cls:'intermediate', amount:needCoke_gs, prefix:'   ├─ '},
      {name:t('tree.itemForTarget',{item:'Calx Powder',target:'GS'}), cls:'intermediate', amount:needCP_gs, prefix:'   └─ '},
      {divider:true},
      {name:'▸ BLOOD ORE / PIG IRON', cls:'tree-section', amount:0, prefix:''},
      {name:'Blood Ore', cls:'intermediate', amount:needBO, prefix:'   ├─ '},
      ...(bloR.base==='Granum'?[{name:t('tree.xToY',{x:'Granum',y:'Blood Ore'}), cls:'base-ore', amount:needBloBase, prefix:'   │  └─ ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(bloR.base==='Gabore'?[{name:t('tree.xToY',{x:'Gabore',y:'Blood Ore'}), cls:'base-ore', amount:needBloBase, prefix:'   │  └─ ', tag:'mine', tagLabel:'ore'}]:[]),
      ...(galbFromBlo>0?[{name:t('tree.byproductArrowFrom',{item:'Galbinum',source:'Blood Ore'}), cls:'base-easy', amount:galbFromBlo, prefix:'   │  ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(gpFromBlo>0?[{name:t('tree.byproductArrowN',{item:'Granum Powder',n:Math.round(gpFromBlo).toLocaleString('ru')}), cls:'base-easy', amount:gpFromBlo, prefix:'   │  ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ...(gpBonus>0?[{name:t('tree.itemBonusPlusN',{item:'Granum Powder',n:Math.round(gpBonus).toLocaleString('ru')}), cls:'base-easy', amount:gpBonus, prefix:'   ', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(granumForGP>0?[{name:t('tree.extraOreForItem',{base:'Granum',item:'GP',n:Math.round(granumForGP).toLocaleString('ru'),rate:2940}), cls:'intermediate', amount:granumForGP, prefix:'   '}]:[]),
      {divider:true},
      {name:'▸ LUPIUM', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.xToY',{x:lupR.base,y:'Lupium'}), cls:'intermediate', amount:needLupExtra, prefix:'   └─ '},
      ...(needWS>0?[
        {name:t('tree.xToY',{x:'Waterstone',y:'Lupium'}), cls:'intermediate', amount:needWS, prefix:'      └─ '},
        {name:t('tree.xToY',{x:'Amarantum',y:'Waterstone'}), cls:'intermediate', amount:needAmarantum, prefix:'         └─ '},
        {name:t('tree.xToY',{x:'Granum',y:'Amarantum'}), cls:'base-ore', amount:granumForWS, prefix:'            └─ ', tag:'mine', tagLabel:'ore'},
        ...(granumFromAmarantum_blo>0?[{name:t('tree.byproductArrow',{item:'Blood Ore'}), cls:'base-easy', amount:granumFromAmarantum_blo, prefix:'            ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(granumFromAmarantum_gp>0?[{name:t('tree.byproductArrow',{item:'Granum Powder'}), cls:'base-easy', amount:granumFromAmarantum_gp, prefix:'            ', tag:'easy', tagLabel:'byproduct'}]:[]),
      ]:[]),
      ...(needGalb_lup>0?[
        {name:t('tree.itemForTargetNoParen',{item:'Galbinum',target:'Lupium'}), cls:'intermediate', amount:needGalb_lup, prefix:'      └─ '},
        ...(galbUsedFromPool>0?[{name:t('tree.byproductArrowFromPool',{n:Math.round(galbUsedFromPool).toLocaleString('ru')}), cls:'base-easy', amount:galbUsedFromPool, prefix:'         ', tag:'easy', tagLabel:'byproduct'}]:[]),
        ...(galbPoolRemainder>0?[{name:t('tree.remainderBonus',{item:'Galbinum'}), cls:'base-easy', amount:galbPoolRemainder, prefix:'         ', tag:'easy', tagLabel:'bonus'}]:[]),
        ...(needGalBase>0?[
          {name:t('tree.xToY',{x:galR.base,y:'Galbinum'}), cls:'base-ore', amount:needGalBase, prefix:'         └─ ', tag:'mine', tagLabel:'ore'},
          ...(bloFromGal>0?[{name:t('tree.byproductArrowFrom',{item:'Blood Ore',source:'Galbinum'}), cls:'base-easy', amount:bloFromGal, prefix:'         ', tag:'easy', tagLabel:'bonus'}]:[]),
        ]:[]),
      ]:[]),
      {divider:true},
      {name:'▸ COKE / CALX', cls:'tree-section', amount:0, prefix:''},
      {name:t('tree.itemTotalParen',{item:'Coke'}), cls:'intermediate', amount:totalCoke_pre, prefix:'   ├─ '},
      {name:t('tree.itemForTargetNoParen',{item:'Coal',target:'Coke'}), cls:'intermediate', amount:needCoal_coke, prefix:'   │  └─ '},
      {name:t('tree.itemTotalParen',{item:'Calx Powder'}), cls:'intermediate', amount:totalCP, prefix:'   ├─ '},
      {name:t('tree.calxMix',{x:xCrusher.toFixed(1),y:yGrinder.toFixed(1)}), cls:'base-ore', amount:needCalxTotal, prefix:'   │  └─ ', tag:'mine', tagLabel:'ore'},
      {divider:true},
      {name:t('tree.totalBaseResources'), cls:'tree-section', amount:0, prefix:''},
      {divider:true},
      ...(needGranum>0?[{name:'Granum', cls:'base-ore', amount:needGranum, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needGabore>0?[{name:'Gabore', cls:'base-ore', amount:needGabore, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      ...(needTephra>0?[{name:'Tephra', cls:'base-ore', amount:needTephra, prefix:'', tag:'mine', tagLabel:'ore'}]:[]),
      {name:'Calx', cls:'base-ore', amount:needCalxTotal, prefix:'', tag:'mine', tagLabel:'ore'},
      ...(coalBonus>0?[{name:t('tree.bonusArrowExtra',{item:'Coal',source:'Calx'}), cls:'base-easy', amount:coalBonus, prefix:'', tag:'easy', tagLabel:'bonus'}]:[]),
      ...(netCoal>0?[{name:t('tree.itemExtra',{item:'Coal'}), cls:'base-ore', amount:netCoal, prefix:'', tag:'mine', tagLabel:'byproduct'}]:[]),
      ...(needFS>0?[{name:'Fuming Salt', cls:'base-buy', amount:needFS, prefix:'', tag:'buy', tagLabel:'purchase'}]:[]),
      ...(needSulfur>0?[{name:'Sulfur', cls:'base-buy', amount:needSulfur, prefix:'', tag:'buy', tagLabel:'purchase'}]:[]),
      ...(needBor>0?[{name:'Bor', cls:'base-hard', amount:needBor, prefix:'', tag:'hard', tagLabel:'hard'}]:[]),
      ...(needWater>0?[{name:'Water', cls:'base-easy', amount:needWater, prefix:'', tag:'easy', tagLabel:'easy'}]:[]),
    ];

    return { target:T, runs:T/7000, tree };
  }
},
];
