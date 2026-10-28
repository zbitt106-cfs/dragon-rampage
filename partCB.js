// ======================= partCB: THREE hunters' cabins (Deepwood north, Deepwood south, the Eastwood) =======================
// CABINS (part1) lists the cabins; each is a 'cabin' structure with s.cb = its index. Hunter slots run 0..8: slot hs belongs to cabin floor(hs/3),
// so every cabin keeps its own trio with exactly the rules of the first one (bow/dagger AI, per-hunter respawn timers, worker refill after a rebuild,
// militia corner posts, save/load). The single-cabin code in partHU is reused by briefly pointing CABIN at the hunter's own cabin.
const CB_N=CABINS.length,HU_ALL=HU_N*CB_N;
const cbOf=u=>u&&u.cb!==undefined?u.cb:Math.floor((u&&u.hs||0)/HU_N)%CB_N;
const cbSite=ci=>ci?'cabin'+ci:'cabin';
function cbStruct(ci){return structures.find(s=>s.kind==='cabin'&&(s.cb||0)===ci);}
function cbWith(ci,fn){const C=CABINS[ci];if(!C||C===CABIN||!ci)return fn();const ox=CABIN.x,oy=CABIN.y;CABIN.x=C.x;CABIN.y=C.y;try{return fn();}finally{CABIN.x=ox;CABIN.y=oy;}}
HU.want=null;
huFreeSlot=function(){const used=new Set(huLive().map(u=>u.hs));const order=HU.want!==null&&HU.want!==undefined?[HU.want]:[...Array(CB_N).keys()];
  for(const c of order)for(let i=c*HU_N;i<c*HU_N+HU_N;i++)if(!used.has(i))return i;return order.length===1?order[0]*HU_N:HU_ALL;};
huWalkers=function(ci){const id=cbSite(ci||0);return units.filter(u=>!u.dead&&u.wk&&u.wk.id===id&&!u.wk.back).length;};
{const _sh=spawnHunter;spawnHunter=function(slot){const s=(slot!==undefined&&slot!==null)?slot:huFreeSlot();const ci=Math.floor(s/HU_N)%CB_N;
  const u=cbWith(ci,()=>_sh.call(this,s));u.hs=s;u.cb=ci;u.home=CABINS[ci];return u;};}
{const _h=updHunter;updHunter=function(u,dt){if(u.hs===undefined)u.hs=huFreeSlot();if(u.cb===undefined)u.cb=Math.floor(u.hs/HU_N)%CB_N;const a=arguments,t=this;return cbWith(u.cb,()=>_h.apply(t,a));};}
{const _kp=kmPost;kmPost=function(u){const a=arguments,t=this;if(u&&u.type==='hunter')return cbWith(cbOf(u),()=>_kp.apply(t,a));return _kp.apply(t,a);};}
// all three trios muster at the start
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);for(const C of CABINS)if(C!==CABIN&&typeof jtClear==='function')jtClear(C.x+10,C.y+15,125);
  while(huLive().length<HU_ALL&&huFreeSlot()<HU_ALL)spawnHunter();G.huT=Array(HU_ALL).fill(HU_RESP);HU.last=-9;G.hunterT=1e9;return r;};}
// per-cabin worker refill sites (need 3 each)
{const _ws=wkSites;wkSites=function(){const L=_ws.apply(this,arguments);const i=L.findIndex(s=>s.id==='cabin');if(i<0)return L;const b=L[i];b.cb=0;b.bp=s=>s.kind==='cabin'&&!s.cb;
  const add=CABINS.slice(1).map((C,k)=>Object.assign({},b,{id:cbSite(k+1),cb:k+1,name:"hunters' cabin ("+C.name+")",bp:s=>s.kind==='cabin'&&s.cb===k+1,x:C.x+30,y:C.y+30}));L.splice(i+1,0,...add);return L;};}
{const _wi=wkIsWorker;wkIsWorker=function(u,site){if(site&&site.job==='hunter'){if(u.dead||u.wk)return false;return u.type==='hunter'&&cbOf(u)===(site.cb||0);}return _wi.apply(this,arguments);};}
{const _wa=wkArrive;wkArrive=function(u,site){if(site&&site.job==='hunter'){const w=HU.want;HU.want=site.cb||0;try{return _wa.apply(this,arguments);}finally{HU.want=w;}}return _wa.apply(this,arguments);};}
// respawn: each cabin runs the partHU rules for its own three slots
huUpd=function(dt){G.hunterT=1e9;if(G.over||G.won)return;if(!Array.isArray(G.huT)||G.huT.length<HU_ALL){const o=G.huT||[];G.huT=Array.from({length:HU_ALL},(_,i)=>o[i]!==undefined?o[i]:HU_RESP);}
  const live=huLive(),used=new Set(live.map(u=>u.hs));
  for(let c=0;c<CB_N;c++){const cab=cbStruct(c),site=WK.find(s=>s.id===cbSite(c));let room=HU_N-live.filter(u=>cbOf(u)===c).length-huWalkers(c),k=0;
    for(let j=0;j<HU_N;j++){const i=c*HU_N+j;if(used.has(i)){G.huT[i]=HU_RESP+HU_STAG*j;continue;}
      if(!cab||cab.state!=='ok'||(site&&(site.down||site.refill))||room<=0){G.huT[i]=Math.max(G.huT[i],HU_RESP+HU_STAG*k);k++;continue;}
      G.huT[i]-=dt;k++;if(G.huT[i]<=0){G.huT[i]=HU_RESP;spawnHunter(i);room--;}}}};
// save / load: slots already carry the cabin; saves from before the extra cabins get the two new trios at once
{const _ss=svSnapshot;svSnapshot=function(){G.cbV=CB_N;return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(d&&d.G&&!d.G.cbV){HU.want=null;for(let c=1;c<CB_N;c++){HU.want=c;while(huLive().filter(u=>cbOf(u)===c).length<HU_N)spawnHunter();}HU.want=null;G.cbV=CB_N;}return r;};}
