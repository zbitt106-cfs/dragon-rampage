// ======================= three hunters per hunter's cabin =======================
// Each cabin now houses THREE hunters (slots 0,1,2). They share the classic hunter AI (bow at range, dagger up close, keep their distance)
// and the worker respawn rules: a lost hunter returns from the intact cabin after his own timer, and after the cabin is rebuilt villagers
// walk in one by one (worker respawn, need 3) and each takes up the bow. During militia all three guard the cabin with their bows.
// Fairness: they fan out to different flanks, only one arrow can be loosed every HU_GAP seconds, and only one hunter stabs at a time.
const HU_N=3,HU_GAP=.6,HU_RESP=20,HU_STAG=7;
const HU_OFF=[[30,30],[-70,55],[95,-25]],HU_FLANK=[0,2.2,-2.2],HU_RANGE=[300,360,250];
let HU={last:-9};
function huLive(){return units.filter(u=>!u.dead&&u.type==='hunter');}
function huWalkers(){return units.filter(u=>!u.dead&&u.wk&&u.wk.id==='cabin'&&!u.wk.back).length;}
function huFreeSlot(){const used=new Set(huLive().map(u=>u.hs));for(let i=0;i<HU_N;i++)if(!used.has(i))return i;return HU_N;}
{const _sh=spawnHunter;spawnHunter=function(slot){const s=(slot!==undefined&&slot!==null)?slot:huFreeSlot();const u=_sh.apply(this,[]);u.hs=s;const o=HU_OFF[s%HU_N];
  u.x=CABIN.x+o[0];u.y=CABIN.y+o[1];u.shootT=2+s*.8;u.id=(u.id||0)+s*1.7;
  if(G.milOn&&typeof kmRole==='function'){u.arm='bow';u.engaged=false;}return u;};}
// first muster: three hunters at the cabin
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);for(const u of units)if(!u.dead&&u.type==='hunter'&&u.hs===undefined)u.hs=huFreeSlot();
  while(huLive().length<HU_N)spawnHunter();G.huT=[HU_RESP,HU_RESP,HU_RESP];HU.last=-9;G.hunterT=1e9;return r;};}
// worker respawn after the cabin is rebuilt: need 3 hunters
{const _ws=wkSites;wkSites=function(){const L=_ws.apply(this,arguments);for(const s of L)if(s.id==='cabin'){s.need=HU_N;s.name="hunters' cabin";}return L;};}
// per-hunter respawn from an intact cabin (replaces the single-hunter timer)
function huUpd(dt){G.hunterT=1e9;if(G.over||G.won)return;if(!Array.isArray(G.huT))G.huT=[HU_RESP,HU_RESP,HU_RESP];
  const cab=structures.find(s=>s.kind==='cabin'),site=WK.find(s=>s.id==='cabin');
  const live=huLive(),used=new Set(live.map(u=>u.hs));let room=HU_N-live.length-huWalkers(),k=0;
  for(let i=0;i<HU_N;i++){if(used.has(i)){G.huT[i]=HU_RESP+HU_STAG*i;continue;}
    if(!cab||cab.state!=='ok'||(site&&(site.down||site.refill))||room<=0){G.huT[i]=Math.max(G.huT[i],HU_RESP+HU_STAG*k);k++;continue;}
    G.huT[i]-=dt;k++;if(G.huT[i]<=0){G.huT[i]=HU_RESP;spawnHunter(i);room--;}}}
{const _up=update;update=function(dt){if(G&&scene==='play')G.hunterT=1e9;const r=_up.apply(this,arguments);if(G&&scene==='play')huUpd(dt);return r;};}
// fairness wrapper around the hunter AI (outermost: also wraps the militia version)
{const _h=updHunter;updHunter=function(u,dt){if(u.hs===undefined)u.hs=huFreeSlot();const s=u.hs%HU_N,dd=dist(u,D),ground=D.alt<0.35;
  // only one dagger at a time: the others hang back at bow range
  if(ground&&dd<110&&units.some(v=>v!==u&&!v.dead&&v.type==='hunter'&&v.mode==='dagger'&&dist(v,D)<110)){const a=Math.atan2(u.y-D.y,u.x-D.x)+HU_FLANK[s]*.15;
    u.x+=Math.cos(a)*90*dt;u.y+=Math.sin(a)*90*dt;u.anim+=dt*10;u.mode='bow';u.face=D.x>u.x?1:-1;return;}
  // one arrow at a time across the trio
  const since=G.t-HU.last;if(u.shootT-dt<=0&&since<HU_GAP)u.shootT=HU_GAP-since+dt+.12*s;
  const pre=u.shootT;const r=_h.apply(this,arguments);if(u.shootT>pre+.5)HU.last=G.t;
  // fan out: each hunter drifts to its own flank and its own preferred range, and keeps clear of the others
  if(u.mode==='bow'&&!G.over&&dd<=520*clamp(.45+.4*kingdomMul(D.x,D.y),.55,1)){const want=Math.atan2(CABIN.y-D.y,CABIN.x-D.x)+HU_FLANK[s];
    const tx=D.x+Math.cos(want)*HU_RANGE[s],ty=D.y+Math.sin(want)*HU_RANGE[s];const ox=u.x,oy=u.y;moveTo(u,tx,ty,28,dt);if(typeof kmBlocked==='function'&&kmBlocked(u.x,u.y)){u.x=ox;u.y=oy;}}
  for(const v of units)if(v!==u&&!v.dead&&v.type==='hunter'){const q=dist(u,v);if(q<70&&q>0.01){u.x+=(u.x-v.x)/q*40*dt;u.y+=(u.y-v.y)/q*40*dt;}}
  if(G.milOn&&u.post&&typeof kmClampLeash==='function'){const[cx,cy]=kmClampLeash(u.post,u.x,u.y);u.x=cx;u.y=cy;}
  return r;};}
// militia: each hunter guards his own corner of the cabin
{const _kp=kmPost;kmPost=function(u){const P=_kp.apply(this,arguments);if(u&&u.arm==='bow'&&u.type==='hunter'){const o=HU_OFF[(u.hs||0)%HU_N];return{x:CABIN.x+o[0],y:CABIN.y+o[1]+10,name:P.name};}return P;};}
// save / load: which hunter slots are alive and their health
{const _ss=svSnapshot;svSnapshot=function(){const S=[];for(const u of huLive())S.push(u.hs,Math.round(u.hp));G.huS=S;return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);const S=d&&d.G&&d.G.huS;if(Array.isArray(S)){for(const u of units)if(u.type==='hunter')u.dead=true;units=units.filter(u=>u.type!=='hunter');
    for(let i=0;i+1<S.length;i+=2){const h=spawnHunter(S[i]);h.hp=Math.min(h.maxHp,S[i+1]);}G.hunterT=1e9;}return r;};}
