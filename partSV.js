// ================= partSV: SAVE / LOAD (3 slots + autosave, localStorage) =================
const SAVE_V=1,SAVE_MIN=1,SAVE_KEYS=[['dr_save_auto','Autosave',1],['dr_save_1','Slot 1'],['dr_save_2','Slot 2'],['dr_save_3','Slot 3']],AUTOSAVE_EVERY=120;
let svCache=null,svCacheT=0,svAutoT=0;
const svIsPlain=o=>{const p=Object.getPrototypeOf(o);return p===Object.prototype||p===null;};
const svNum=v=>typeof v==='number'?(isFinite(v)?Math.round(v*1000)/1000:0):v;
// copy only primitives, flat arrays of primitives and flat plain objects of primitives (never live references to units etc.)
function svFlat(o,skip){const r={};for(const k in o){if(skip&&skip.includes(k))continue;const v=o[k];const t=typeof v;
    if(t==='number'||t==='string'||t==='boolean'||v===null)r[k]=svNum(v);
    else if(t==='object'){if(Array.isArray(v)){if(v.every(x=>x===null||typeof x!=='object'))r[k]=v.map(svNum);}
      else if(svIsPlain(v)){let ok=true;const c={};for(const j in v){const w=v[j],tw=typeof w;if(w!==null&&(tw==='object'||tw==='function')){ok=false;break;}c[j]=svNum(w);}if(ok)r[k]=c;}}}return r;}
function svPrim(o,skip){const r={};for(const k in o){if(skip&&skip.includes(k))continue;const v=o[k],t=typeof v;if(t==='number'||t==='string'||t==='boolean'||v===null)r[k]=svNum(v);}return r;}
const TREE_C={ok:'o',burnt:'b',falling:'s',stump:'s',gone:'g'},TREE_S={o:'ok',b:'burnt',s:'stump',g:'gone'};
function svFog(){let s='';for(let i=0;i<FOG.length;i+=4)s+=((FOG[i]?1:0)|(FOG[i+1]?2:0)|(FOG[i+2]?4:0)|(FOG[i+3]?8:0)).toString(16);return s;}
function svUnfog(s){if(!s)return;for(let i=0;i<s.length;i++){const n=parseInt(s[i],16);for(let b=0;b<4;b++)if(i*4+b<FOG.length&&(n>>b)&1)FOG[i*4+b]=1;}fogDirty=true;}
function svSnapshot(){
  return{v:SAVE_V,game:"Dragon's Rampage",when:Date.now(),lvl:G.lvl,easy:!!EASY,gfx:!!GFX_HI,playT:Math.round(GAME_PLAYT),
    G:svFlat(G,['spawnQ','banner','msg','regBanner','over','overT','won','wonT','bigMap']),
    D:svPrim(D,['vx','vy','quip','quipT']),PR:svPrim(PR),
    S:structures.map(s=>Object.assign(svPrim(s,['id']),{kind:s.kind,x:Math.round(s.x),y:Math.round(s.y)})),
    T:trees.map(t=>TREE_C[t.state]||'o').join(''),nT:trees.length,
    C:cells.map(c=>c.burnt?-1:Math.round((c.growth||0)*100)),
    GP:goldPiles.map(p=>svPrim(p)),FOG:svFog(),
    RAID:{n:RAID.n,thr:RAID.thr,cd:RAID.cd},TROPH:TROPHIES.map(t=>({name:t.name,short:t.short,col:t.col,trim:t.trim,crest:t.crest,big:!!t.big})),
    WK:wkSave(),tally:{g:TALLY.game,pr:TALLY.prGame}};}
function svMeta(d){return{v:d.v,when:d.when,gold:Math.round((d.G.stash||0)+(d.D.gold||0)),stash:d.G.stash||0,carry:d.D.gold||0,wanted:d.G.level||0,lvl:d.lvl||1,playT:d.playT||0,easy:d.easy,pr:d.PR&&d.PR.state};}
function svWrite(key){if(scene!=='play'||G.over||G.won)return false;try{const d=svSnapshot();localStorage.setItem(key,JSON.stringify(d));localStorage.setItem(key+'_meta',JSON.stringify(svMeta(d)));svCache=null;return true;}catch(e){console.warn('save failed',e);return false;}}
function svList(){if(svCache&&performance.now()-svCacheT<800)return svCache;
  svCache=SAVE_KEYS.map(([key,name,auto])=>{let raw=null,info=null;try{raw=localStorage.getItem(key);const m=localStorage.getItem(key+'_meta');if(raw){info=m?JSON.parse(m):null;if(!info){const d=JSON.parse(raw);if(d&&d.G&&d.D)info=svMeta(d);}if(info&&!(info.v>=SAVE_MIN&&info.v<=SAVE_V))info.old=1;}}catch(e){info=null;}
    return{key,name,auto:!!auto,raw:!!raw,info};});svCacheT=performance.now();return svCache;}
function svHasAny(){return svList().some(s=>s.info&&!s.info.old);}
function svWhen(ts){try{return new Date(ts).toLocaleString([], {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return String(new Date(ts));}}
function svDur(s){s=Math.max(0,Math.round(s||0));const h=Math.floor(s/3600),m=Math.floor(s/60)%60,x=s%60;return h?`${h}h ${m}m`:`${m}m ${String(x).padStart(2,'0')}s`;}
function svDesc(i){if(!i)return'';if(i.old)return'Saved by an older version of the game: it cannot be loaded, sorry!';
  return`Gold ${i.gold}  ·  Wanted ${i.wanted}: ${LEVEL_NAMES[i.wanted]||''}  ·  Castle lvl ${i.lvl}  ·  Played ${svDur(i.playT)}${i.easy?'  ·  Easy':''}${i.pr==='carried'?'  ·  ♛ carrying the Princess':''}`;}
function svLoad(key){let d;try{d=JSON.parse(localStorage.getItem(key)||'null');}catch(e){return'That save looks damaged and could not be read, sorry!';}
  if(!d)return'That slot is empty.';
  if(!d.v||d.v<SAVE_MIN)return'That save is from an older version of the game and can\'t be loaded, sorry! Start a fresh rampage instead.';
  if(d.v>SAVE_V)return'That save is from a newer version of the game. Reload the page to update, then try again.';
  if(!d.G||!d.D||!Array.isArray(d.S))return'That save is missing data and could not be loaded, sorry!';
  try{svApply(d);return true;}catch(e){console.warn('load failed',e);newGame();return'Something went wrong loading that save, so a new game was started instead.';}}
function svApply(d){
  setEasy(!!d.easy);if(typeof setGfx==='function'&&typeof d.gfx==='boolean'&&d.gfx!==GFX_HI)setGfx(d.gfx);
  TALLY_KEEP=true;newGame({lvl:d.lvl||1,bank:d.G.bank||0});scene='play';
  for(const k in d.G)G[k]=d.G[k];G.over=false;G.won=false;G.banner=null;G.msg=null;G.spawnQ=[];G.regBanner=null;
  Object.assign(D,d.D);D.vx=0;D.vy=0;
  Object.assign(PR,d.PR||{});if(PR.state!=='carried')D.princess=false;
  // buildings, bridges, wells, the gate, the castle and the keep roof
  const used=new Set();
  d.S.forEach((r,i)=>{let s=structures[i];if(!s||used.has(s)||s.kind!==r.kind||Math.abs(s.x-r.x)>3||Math.abs(s.y-r.y)>3){s=null;let bd=300*300;for(const t of structures){if(used.has(t)||t.kind!==r.kind)continue;const q=d2(t.x,t.y,r.x,r.y);if(q<bd){bd=q;s=t;}}}
    if(!s)return;used.add(s);for(const k in r)if(k!=='x'&&k!=='y'&&k!=='kind')s[k]=r[k];s.builder=null;});
  if(typeof d.T==='string'&&d.nT===trees.length)for(let i=0;i<trees.length;i++){const st=TREE_S[d.T[i]]||'ok';if(st!=='ok'){const t=trees[i];t.state=st;t.hp=0;t.fire=0;t.claimed=null;t.regrow=60;}}
  if(Array.isArray(d.C)&&d.C.length===cells.length)cells.forEach((c,i)=>{const v=d.C[i];if(v<0){c.burnt=true;c.growth=0;}else{c.burnt=false;c.growth=v/100;}c.fire=0;c.claimed=null;});
  if(Array.isArray(d.GP))d.GP.forEach((p,i)=>{if(goldPiles[i])Object.assign(goldPiles[i],p);});
  svUnfog(d.FOG);
  if(d.RAID){RAID.n=d.RAID.n||0;RAID.thr=d.RAID.thr||0;RAID.cd=Math.max(30,d.RAID.cd||0);RAID.cur=null;}
  TROPHIES.length=0;(d.TROPH||[]).forEach((t,i)=>{const s=trophySlot(i);TROPHIES.push(Object.assign({},t,{x:s.x,y:s.y,a:s.a,t0:G.t-5,raidRef:null,ph:Math.random()*6}));});
  if(typeof HOARD!=='undefined')HOARD.shown=G.stash||0;
  wkLoad(d.WK);
  // live enemies are not saved: guards and waves re-muster from the wanted level and wave timers
  G.waveCD=Math.max(G.waveCD||0,8);G.spawnQT=0;
  if(d.tally){TALLY.game=d.tally.g||{};TALLY.prGame=d.tally.pr||0;}if(PR.state==='carried'||PR.state==='lair')G._prCap=1;
  GAME_PLAYT=d.playT||0;svAutoT=0;
  cam.x=D.x;cam.y=D.y;G.banner={text:'Game loaded',sub:`${svWhen(d.when)}  ·  Castle level ${G.lvl}`,t:2.5};}
function svAuto(){if(scene==='play'&&!G.over&&!G.won&&G.t>3){svWrite('dr_save_auto');svAutoT=0;}}
const _updateSV=update;update=function(dt){const r=_updateSV.apply(this,arguments);if(scene==='play'&&!G.over&&!G.won){svAutoT+=dt;if(svAutoT>=AUTOSAVE_EVERY)svAuto();}return r;};
const _newGameSV=newGame;newGame=function(){const r=_newGameSV.apply(this,arguments);svAutoT=0;return r;};
