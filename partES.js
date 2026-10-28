// ======================= partES: THE EAST MARCH (map v2) — a 2nd lumber camp (the Eastwood) and a 2nd mine (the Iron Crags) =======================
// The Sapphire Coast moved SEA_DX east (partW), opening new kingdom land between Saltmere and the sea. Each new site has its own yard
// (G.yard2Wood / G.yard2Stone), 3 workers, mine carts (G.cartsPool2), supply carts to the Castle Storehouse along new roads from Saltmere,
// a worksite guard squad, patrol points, tower guard spots and predators around it. Site-2 workers run the SAME villager / fight-back /
// militia code as the first site: while one is updated (or the site is drawn) CAMP, MINE, the pile spots, the yards and the cart pool are
// swapped to the East March versions (ES2.on), and pile()/kUp() pick the site-2 structures (s.s2).
const ES={workers:3,carts:3,trees:520,ring:50,rocks:90,cartCd:20};
const ES_BLD=new Set(['camptent','sawmill','minehead','minehut']);
let _esC=null;
function esIn(){if(ES2.on||!G)return false;ES2.on=true;
  _esC=[CAMP.x,CAMP.y,MINE.x,MINE.y,LOGPILE_POS.x,LOGPILE_POS.y,STONEPILE_POS.x,STONEPILE_POS.y];
  CAMP.x=CAMP2.x;CAMP.y=CAMP2.y;MINE.x=MINE2.x;MINE.y=MINE2.y;LOGPILE_POS.x=LOGPILE2.x;LOGPILE_POS.y=LOGPILE2.y;STONEPILE_POS.x=STONEPILE2.x;STONEPILE_POS.y=STONEPILE2.y;
  esSwapG();return true;}
function esOut(){const c=_esC;CAMP.x=c[0];CAMP.y=c[1];MINE.x=c[2];MINE.y=c[3];LOGPILE_POS.x=c[4];LOGPILE_POS.y=c[5];STONEPILE_POS.x=c[6];STONEPILE_POS.y=c[7];esSwapG();ES2.on=false;}
function esSwapG(){let t=G.yardWood;G.yardWood=G.yard2Wood||0;G.yard2Wood=t||0;t=G.yardStone;G.yardStone=G.yard2Stone||0;G.yard2Stone=t||0;
  t=G.cartsPool;G.cartsPool=G.cartsPool2||0;G.cartsPool2=t||0;}
function esRun(fn){const ok=esIn();try{return fn();}finally{if(ok)esOut();}}
// site-aware lookups
{const _p=pile;pile=function(kind){if(kind==='logpile2'||kind==='stonepile2'){const k=kind.slice(0,-1);return structures.find(s=>s.kind===k&&s.s2);}
  if(kind==='logpile'||kind==='stonepile'){const on=ES2.on;return structures.find(s=>s.kind===kind&&!!s.s2===on);}return _p.apply(this,arguments);};}
{const _k=kUp;kUp=function(kind,pred){if(ES_BLD.has(kind)){const on=ES2.on;return _k(kind,s=>!!s.s2===on&&(!pred||pred(s)));}return _k.apply(this,arguments);};}
// ---------- world: yards, crag rocks, Eastwood trees (called from newGame in part1, before the bridges) ----------
function esWorld(blocked){
  const a=addStruct('logpile',LOGPILE2.x,LOGPILE2.y,-1);a.s2=1;const b=addStruct('stonepile',STONEPILE2.x,STONEPILE2.y,-1);b.s2=1;
  const clear=(x,y)=>d2(x,y,MINE2.x,MINE2.y)<150||d2(x,y,STONEPILE2.x,STONEPILE2.y)<100||d2(x,y,MINE2.x-120,MINE2.y+60)<90||d2(x,y,MINE2.x-60,MINE2.y+110)<80;
  for(let i=0;i<ES.rocks;i++){const x=SR(6450,8550),y=SR(1800,3300);if(regionKey(x,y)!=='crags'||clear(x,y))continue;ROCKS.push({x,y,r:SR(14,44),c:SR(0,1)});}
  // part1's blocked() keeps the whole 920..1680 band east of the first mine clear; out here only water, river, beach and Saltmere matter
  const blk=(x,y)=>x>5800?(inWater(x,y)||riverD(x,y)<RIVW+40||onBeach(x,y)||d2(x,y,VILLAGES[10].x,VILLAGES[10].y)<210):blocked(x,y);
  const bad=(x,y)=>blk(x,y)||d2(x,y,CAMP2.x,CAMP2.y)<110||d2(x,y,LOGPILE2.x,LOGPILE2.y)<85||d2(x,y,CAMP2.x-100,CAMP2.y+60)<85||d2(x,y,CAMP2.x+30,CAMP2.y+40)<100;
  let tries=0,nt=trees.length;while(trees.length<nt+ES.trees&&tries<8000){tries++;const x=SR(5850,8300),y=SR(-220,1850);if(regionKey(x,y)==='eastwood'&&!bad(x,y))addTree(x,y);}
  // a ring of good timber in easy reach of the camp (woodcutters fell trees within 480 of their camp)
  tries=0;nt=trees.length;while(trees.length<nt+ES.ring&&tries<1500){tries++;const t=SR(-2.6,.9),r=SR(200,440),x=CAMP2.x+Math.cos(t)*r,y=CAMP2.y+Math.sin(t)*r;if(!bad(x,y)&&!inWater(x,y))addTree(x,y);}
  // a few pines on the crags
  tries=0;nt=trees.length;while(trees.length<nt+24&&tries<600){tries++;const x=SR(6500,8500),y=SR(1850,3250);if(regionKey(x,y)==='crags'&&!clear(x,y)&&!bad(x,y))addTree(x,y);}}
// roads: Saltmere -> Eastwood camp, Saltmere -> Iron Crags mine, and a track between the two sites (called from buildRoads)
function esRoads(add,V){const C={x:CAMP2.x+30,y:CAMP2.y+40},M={x:MINE2.x-40,y:MINE2.y+70},S={x:STONEPILE2.x,y:STONEPILE2.y+30};
  add(V[10],C);add(V[10],S);add(S,M,20);add(C,{x:MINE2.x-90,y:MINE2.y+20},16,'path');}
// structures: the site-2 tent, sawmill, mine head and mine hut
{const _i=initStructsK;initStructsK=function(){const r=_i.apply(this,arguments);
  kAdd('minehead',MINE2.x,MINE2.y+14,-1,{s2:1});kAdd('minehut',MINE2.x-120,MINE2.y+60,-1,{s2:1});kAdd('camptent',CAMP2.x,CAMP2.y+10,-1,{s2:1});kAdd('sawmill',CAMP2.x-100,CAMP2.y+60,-1,{s2:1});return r;};}
// ---------- workers ----------
const esWorker=u=>u.type==='villager'&&!u.dead&&u.site===2&&(u.job==='woodcutter'||u.job==='miner');
{const _v=updVillager;updVillager=function(u,dt){if(u.site!==2)return _v.apply(this,arguments);const ok=esIn();
  try{const r=_v.apply(this,arguments);if(u.cart&&!u.cart.supply)u.cart.s2=1;return r;}finally{if(ok)esOut();}};}
// the base economy staffs 3 woodcutters / 3 miners and rebuilds mine carts for site 1; site 2 does the same separately
{const _e=updEconomy;updEconomy=function(dt){const ren=[],sc=[];
  for(const u of units){if(u.site!==2)continue;if(u.dead)continue;if(!esWorker(u)){delete u.site;continue;}ren.push([u,u.job]);u.job+='2';}
  for(const c of carts)if(c.s2&&!c.supply){c.supply=true;sc.push(c);}
  let r;try{r=_e.apply(this,arguments);}finally{for(const[u,j]of ren)u.job=j;for(const c of sc)c.supply=false;}
  esEconomy(dt);return r;};}
function esNeed(job,pos){if(units.filter(u=>esWorker(u)&&u.job===job).length>=ES.workers)return;let b=null,bd=1e18;
  for(const u of units)if(u.type==='villager'&&!u.dead&&u.job==='peasant'&&!u.task&&!u.wk&&!u.scart){const q=d2(u.x,u.y,pos.x,pos.y);if(q<bd){bd=q;b=u;}}
  if(b){b.job=job;b.site=2;b.state='idle';b.tgt=null;}}
// mine carts for the Crags are built from Eastwood logs (the east yard), so they never compete with castle rebuilds for storehouse wood
function esEconomy(dt){G.cartBuildT2=(G.cartBuildT2||0)-dt;
  const active=carts.filter(c=>c.s2&&!c.supply&&!c.wrecked).length+units.filter(u=>esWorker(u)&&u.job==='miner'&&(u.inside||u.state==='cart')).length;
  if((G.cartsPool2||0)+active<ES.carts&&G.cartBuildT2<=0&&(G.yard2Wood||0)>=2){G.yard2Wood-=2;G.cartsPool2=(G.cartsPool2||0)+1;G.cartBuildT2=ES.cartCd;float(MINE2.x-40,MINE2.y-40,'New cart built (-2 Eastwood logs)','#e8c090');}
  if(rnd()<dt*.3){esNeed('woodcutter',CAMP2);esNeed('miner',MINE2);}}
function esSpawnWorkers(){for(let i=0;i<ES.workers;i++){const u=spawnVillager(CAMP2.x+R(-20,20),CAMP2.y+R(-20,20),'woodcutter',10);u.site=2;}
  for(let i=0;i<ES.workers;i++){const u=spawnVillager(MINE2.x-60+R(-20,20),MINE2.y+40,'miner',10);u.site=2;}}
// walking replacement workers (partWK): the East March sites, and keep each site's workers apart
{const _s=wkSites;wkSites=function(){const L=_s.apply(this,arguments);
  for(const s of L)if(s.id==='camp'||s.id==='mine'){const bk=s.bk;s.bp=b=>bk.includes(b.kind)&&!b.s2;}
  const add=[{id:'camp2',name:'Eastwood logging camp',job:'woodcutter',jobName:'lumberjack',need:ES.workers,bk:['camptent','sawmill'],x:CAMP2.x,y:CAMP2.y+30,v:10,s2:1},
    {id:'mine2',name:'Iron Crags mine',job:'miner',jobName:'miner',need:ES.workers,bk:['minehead','minehut'],x:MINE2.x-60,y:MINE2.y+40,v:10,s2:1}];
  for(const s of add){const bk=s.bk;s.bp=b=>bk.includes(b.kind)&&!!b.s2;s.down=false;s.refill=false;s.cd=0;}
  const i=L.findIndex(s=>s.id==='mine')+1;L.splice(i>0?i:L.length,0,...add);return L;};}
{const _w=wkIsWorker;wkIsWorker=function(u,site){const r=_w.apply(this,arguments);if(r&&(site.job==='woodcutter'||site.job==='miner'))return !!site.s2===(u.site===2);return r;};}
{const _a=wkArrive;wkArrive=function(u,site){const r=_a.apply(this,arguments);if(site.s2)u.site=2;else if(site.job==='woodcutter'||site.job==='miner')delete u.site;return r;};}
// ---------- supply carts (partSC): two more yards haul to the Castle Storehouse ----------
SC_SRC.camp2={kind:'wood',yard:'logpile2',park:()=>({x:LOGPILE2.x+64,y:LOGPILE2.y+26}),job:'woodcutter',name:'Eastwood logging camp',s2:1};
SC_SRC.mine2={kind:'stone',yard:'stonepile2',park:()=>({x:STONEPILE2.x-60,y:STONEPILE2.y+30}),job:'miner',name:'Iron Crags mine',s2:1};
scWorkers=function(src){const S=SC_SRC[src];if(!S)return 0;const two=!!S.s2;return units.filter(u=>u.type==='villager'&&!u.dead&&u.job===S.job&&(u.site===2)===two&&!(u.wk&&!u.wk.done)).length;};
{const _st=scStep;scStep=function(c){const S=SC_SRC[c.src];if(!S||!S.s2)return _st.apply(this,arguments);
  let t=G.yardWood;G.yardWood=G.yard2Wood||0;G.yard2Wood=t;t=G.yardStone;G.yardStone=G.yard2Stone||0;G.yard2Stone=t;
  try{return _st.apply(this,arguments);}finally{t=G.yardWood;G.yardWood=G.yard2Wood;G.yard2Wood=t;t=G.yardStone;G.yardStone=G.yard2Stone;G.yard2Stone=t;}};}
// ---------- worksite guard squads (partGP) and road-patrol stops (partF) ----------
{const _s=WS.sites;WS.sites=()=>[..._s(),{key:'camp2',name:'Eastwood lumber camp',x:(CAMP2.x+LOGPILE2.x)/2,y:(CAMP2.y+LOGPILE2.y)/2,rx:190,ry:140},
  {key:'mine2',name:'Iron Crags mine',x:(MINE2.x+STONEPILE2.x)/2,y:(MINE2.y+STONEPILE2.y)/2,rx:200,ry:140}];}
// ---------- new game ----------
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);
  G.yard2Wood=4;G.yard2Stone=4;G.cartsPool2=3;G.cartBuildT2=0;G.mapV=MAP_V;if(!G.scT)G.scT={};G.scT.camp2=16;G.scT.mine2=24;
  esSpawnWorkers();scSpawn('camp2',{load:3,st:'go',s:120});scSpawn('mine2',{load:3,st:'go',s:120});return r;};}
// ---------- drawing: the second camp and mine use the same art, in the swapped context ----------

{const _m=drawMine;drawMine=function(){const r=_m.apply(this,arguments);esRun(()=>_m.apply(this,arguments));return r;};}
{const _c=drawCamp;drawCamp=function(){const r=_c.apply(this,arguments);esRun(()=>_c.apply(this,arguments));return r;};}
// ---------- saves: v1 saves were made on the old map (the coast 3000 further west) ----------
{const _ss=svSnapshot;svSnapshot=function(){const o=_ss.apply(this,arguments);if(o)o.mapV=MAP_V;return o;};
 const _sa=svApply;svApply=function(d){if(d&&!(d.mapV>=2))d=esMigrate(d);return _sa.call(this,d);};}
const ES_OLDX=5250; // everything east of here on the old map was coast / sea / the lighthouse isle: it moves east with the sea
function esMigrate(d0){const d=Object.assign({},d0),sh=x=>x>ES_OLDX?x+SEA_DX:x;
  if(d.D&&typeof d.D.x==='number'){d.D=Object.assign({},d.D,{x:sh(d.D.x)});}
  if(d.PR&&typeof d.PR.x==='number')d.PR=Object.assign({},d.PR,{x:sh(d.PR.x)});
  if(Array.isArray(d.S))d.S=d.S.map(r=>r&&r.x>ES_OLDX?Object.assign({},r,{x:r.x+SEA_DX}):r);
  // fog: shift the explored columns east of the old coastline (the East March itself starts unexplored)
  // (saves from before the west expansion have no FW: 100 columns starting at x=-10200, as partSJ assumes)
  if(d.FOG){const oW=d.FW||100,ox=d.FW?WX0:-10200,bits=[];for(let i=0;i<d.FOG.length;i++){const n=parseInt(d.FOG[i],16);for(let b=0;b<4;b++)bits.push((n>>b)&1);}
    const cut=Math.floor((ES_OLDX-ox)/FG),off=Math.round((ox-WX0)/FG),dc=Math.round(SEA_DX/FG),nb=new Uint8Array(FW*FH);
    for(let k=0;k<bits.length;k++)if(bits[k]){const i=k%oW,j=k/oW|0;const ni=i+off+(i>cut?dc:0);if(ni>=0&&ni<FW&&j<FH)nb[j*FW+ni]=1;}
    let s='';for(let i=0;i<nb.length;i+=4)s+=((nb[i]?1:0)|(nb[i+1]?2:0)|(nb[i+2]?4:0)|(nb[i+3]?8:0)).toString(16);d.FOG=s;d.FW=FW;}
  if(d.G){d.G=Object.assign({},d.G);delete d.G.mapV;}
  return d;}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);G.mapV=MAP_V;if(G.yard2Wood==null)G.yard2Wood=4;if(G.yard2Stone==null)G.yard2Stone=4;if(G.cartsPool2==null)G.cartsPool2=3;
  if(!G.scT)G.scT={};for(const k of['camp2','mine2'])if(G.scT[k]==null)G.scT[k]=SC.respawn;
  // old saves have no East March carts: start one from each new yard
  for(const k of['camp2','mine2'])if(!carts.some(c=>c.supply&&c.src===k&&!c.wrecked))scSpawn(k);return r;};}
