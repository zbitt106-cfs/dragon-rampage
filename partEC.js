// ================= partEC: the TOWN ECONOMY (houses and merchant shops slowly earn gold; the tax man collects it) =================
// Hidden by design: building gold is never shown (no HUD, no menu line, no coin stacks, no text on buildings).
// It only becomes the KINGDOM's gold when a tax collector carries his sack into the castle (the castle gold piles).
// The collector always leaves >=1 coin in every house and >=3 in every merchant shop. Intercept him and his sack goes to the lair pile.
// Wreck a house or shop and whatever it had stored goes straight to the lair pile (partGA's "+N" pop). Saved per building (s.sg).
const EC={houseRate:1/25,shopMul:2.5,houseMin:1,shopMin:3,houseCap:15,shopCap:40,houseStart:[1,3],shopStart:[3,7]};
const EC_HOUSE=new Set(['hut','adobe']),EC_SHOP=new Set(['stall','fishmonger','bakery','smithy','jeweler']);
const ecHouse=s=>EC_HOUSE.has(s.kind)||(s.kind==='hut'&&s.adobe),ecShop=s=>EC_SHOP.has(s.kind),ecKind=s=>ecShop(s)?'shop':ecHouse(s)?'house':null;
const ecMin=s=>ecShop(s)?EC.shopMin:EC.houseMin,ecCap=s=>ecShop(s)?EC.shopCap:EC.houseCap,ecRate=s=>ecShop(s)?EC.houseRate*EC.shopMul:EC.houseRate;
function ecInit(s){if(typeof s.sg!=='number'||!isFinite(s.sg)){const r=ecShop(s)?EC.shopStart:EC.houseStart;s.sg=RI(r[0],r[1]);}return s;}
function ecGold(s){return ecKind(s)?Math.floor(ecInit(s).sg):0;}
function ecUpd(dt){for(const s of structures){if(!ecKind(s))continue;ecInit(s);if(s.state==='ok'&&s.sg<ecCap(s))s.sg=Math.min(ecCap(s),s.sg+ecRate(s)*dt);}}
{const _k=updK;updK=function(dt){const r=_k.apply(this,arguments);ecUpd(dt);return r;};}
// who pays at a tax stop: a village stop taxes its houses (and any shop that belongs to no market), a market stop taxes its shops
function ecPayers(tg){return structures.filter(s=>s.state==='ok'&&ecKind(s)&&(tg.mk?s.market===tg.mk:(s.v===tg.vi&&(ecHouse(s)||(ecShop(s)&&!s.market)))));}
function ecTaxable(s){return Math.max(0,Math.floor(ecInit(s).sg)-ecMin(s));}
function ecCollect(tg,want){let got=0;for(const s of ecPayers(tg)){if(got>=want)break;const n=Math.min(ecTaxable(s),want-got);if(n>0){s.sg-=n;got+=n;}}return got;}
taxTargets=function(){const T=[];VILLAGES.forEach((v,vi)=>{const t={x:v.x+30,y:v.y+40,vi,name:v.name||'a village'};const P=ecPayers(t);if(P.length){t.amt=P.reduce((a,s)=>a+ecTaxable(s),0);T.push(t);}});
  for(const M of MARKETS){const t={x:M.x,y:M.y+40,mk:M.name,name:M.name};const P=ecPayers(t);if(P.length){t.amt=P.reduce((a,s)=>a+ecTaxable(s),0);T.push(t);}}return T;};
{const _t=updTax;updTax=function(u,dt){const tg=u.route&&u.route[u.ri];if(tg&&!tg.home&&(tg.vi!==undefined||tg.mk)){tg.amt=ecPayers(tg).reduce((a,s)=>a+ecTaxable(s),0);}
  const ri0=u.ri,s0=u.sack;const r=_t.apply(this,arguments);
  if(tg&&!tg.home&&u.ri>ri0&&(tg.vi!==undefined||tg.mk)){const got=ecCollect(tg,u.sack-s0);u.sack=s0+got;G.ecTaxed=(G.ecTaxed||0)+got;}return r;};}
// an intercepted collector: his whole sack goes to the lair pile (it never reaches the castle)
{const _s=taxSacks;taxSacks=function(){for(const u of units)if(u.tax&&u.dead&&!u.gone&&!u.sackDone){u.sackDone=true;const n=Math.max(0,Math.floor(u.sack||0));
    if(n>0){D.gold=(D.gold||0)+n;G.ecSackLair=(G.ecSackLair||0)+n;}u.sack=0;addAlarm(4,u.x,u.y);G.stats.taxmen=(G.stats.taxmen||0)+1;puff(u.x,u.y-10,8,'rgba(255,216,74,',90,5);
    float(u.x,u.y-40,n>0?'The tax collector\'s sack is yours!':'The tax collector\'s sack was empty!','#ffd84a');}return _s.apply(this,arguments);};}
// wrecked house or shop: its stored gold goes to the lair pile (instead of the old random spill)
{const _o=onRuin;onRuin=function(s){if(!s||!ecKind(s)||s._loading)return _o.apply(this,arguments);const n=ecGold(s);s.hasGold=false;const r=_o.apply(this,arguments);
  if(n>0){D.gold=(D.gold||0)+n;G.ecDrop=(G.ecDrop||0)+n;puff(s.x,s.y-20,Math.min(14,4+n),'rgba(255,216,74,',120,5);}s.sg=0;return r;};}
// ---------- a rich tax man calls for an ESCORT: the nearest patrol lends him soldiers back to the castle ----------
// Only when he PASSES a patrol (within ~200px) on his route; no patrol near = he walks alone.
// sack >= 25: 2 soldiers, >= 40: 3, >= 60: 4 (cap). They walk with him, fight the dragon if it comes close (escortStep),
// and rejoin their patrol's normal route once the gold is delivered (or the tax man is lost). The sack itself looks fuller as it grows.
const TXE={at:25,steps:[[60,4],[40,3],[25,2]],cap:4,range:200};
const txeWant=sack=>{for(const [a,n] of TXE.steps)if(sack>=a)return Math.min(TXE.cap,n);return 0;};
const txeOf=m=>units.filter(u=>!u.dead&&u.escort===m&&u.txe);
function txeLend(m,u,p){u.txe=1;u.txP=p;u.escort=m;u.eo=[-1.6,1.6,-.6,.6][txeOf(m).length%4];u.patrol=null;u.retreat=false;if(p){const i=p.members.indexOf(u);if(i>=0)p.members.splice(i,1);}}
function txeRecruit(m){const want=txeWant(m.sack),have=txeOf(m).length;if(want<=have)return 0;let need=want-have,got=0;
  // only a patrol he is PASSING (any member within ~200px) - he never summons one from afar, and no patrol detours to him
  const pd=p=>Math.min(...p.members.filter(u=>!u.dead).map(u=>dist(u,m)));
  const P=patrols.filter(p=>!p.dead&&!p.engaged&&p.members.some(u=>!u.dead)&&pd(p)<=TXE.range).sort((a,b)=>pd(a)-pd(b));
  for(const p of P){if(need<=0)break;
    const pick=p.members.filter(u=>!u.dead).sort((a,b)=>(a.mounted?1:0)-(b.mounted?1:0)); // foot soldiers & archers first
    for(const u of pick){if(need<=0)break;txeLend(m,u,p);need--;got++;}}
  if(got){m.txeN=(m.txeN||0)+got;G.txeRecruits=(G.txeRecruits||0)+got;if(dist(m,D)<900)float(m.x,m.y-34,'Guards! Escort the King\'s taxes!','#ffe0a0');}return got;}
function txeRelease(m){for(const u of units){if(u.dead||u.escort!==m||!u.txe)continue;u.escort=null;u.txe=0;const p=u.txP;u.txP=null;
    if(p){if(!patrols.includes(p)){p.dead=false;p.engaged=false;p.wp=null;patrols.push(p);}p.members.push(u);u.patrol=p;}else u.retreat=true;}
  G.txeReleased=(G.txeReleased||0)+1;}
{const _u=updTaxes;updTaxes=function(dt){const r=_u.apply(this,arguments);
  for(const m of units){if(!m.tax)continue;if(m.dead){if(!m.txeDone){m.txeDone=1;txeRelease(m);}continue;}
    m.txeT=(m.txeT||0)-dt;if(m.txeT<=0){m.txeT=1;if(m.sack>=TXE.at)txeRecruit(m);}}
  // released soldiers whose patrol had no one left still need a leader slot: drop empty patrols
  return r;};}
// the delivery line marks the tax man dead+gone inside updTax: release his escort the same frame
{const _t=updTax;updTax=function(u,dt){const r=_t.apply(this,arguments);if(u.dead&&!u.txeDone){u.txeDone=1;txeRelease(u);}return r;};}
// save/load: tax men on the road keep their sack, route and escort
const TXE_K=u=>u.type==='archer'?'archer':u.mounted?'cavalry':u.foot?'foot':'knight';
{const _s=svSnapshot;svSnapshot=function(){const d=_s.apply(this,arguments);
  d.TX=units.filter(u=>u.tax&&!u.dead).map(m=>({x:Math.round(m.x),y:Math.round(m.y),sack:m.sack|0,ri:m.ri|0,route:(m.route||[]).map(t=>svPrim(t)),hp:m.hp,
    esc:txeOf(m).map(u=>({k:TXE_K(u),hp:Math.round(u.hp),maxHp:u.maxHp,colr:u.colr||null,x:Math.round(u.x),y:Math.round(u.y),eo:u.eo}))}));return d;};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);if(!Array.isArray(d.TX))return r;
  for(let i=units.length-1;i>=0;i--)if(units[i].tax)units.splice(i,1);
  for(const t of d.TX){const m=mkUnit('villager',t.x,t.y,{job:'tax',tax:true,route:t.route||[],ri:t.ri||0,sack:t.sack||0,hp:t.hp||10,maxHp:10,shirt:'#5a2a6a',home:{x:GATE.x,y:GATE.y+20},v:-1});units.push(m);
    if(t.esc&&t.esc.length){const p={id:++patrolId,members:[],engaged:false,wp:null,txLoad:1};
      for(const e of t.esc){const o={hp:e.hp,maxHp:e.maxHp,atk:0};if(e.colr)o.colr=e.colr;let u;
        if(e.k==='archer')u=mkUnit('archer',e.x,e.y,{hp:e.hp,maxHp:e.maxHp,shootT:R(1,3)});else if(e.k==='cavalry')u=mkCavalry(e.x,e.y,o);else u=mkUnit('knight',e.x,e.y,Object.assign(o,e.k==='foot'?{foot:true}:{}));
        u.hp=e.hp;u.maxHp=e.maxHp;u.born=G.t;units.push(u);txeLend(m,u,p);if(typeof e.eo==='number')u.eo=e.eo;}}}
  return r;};}
