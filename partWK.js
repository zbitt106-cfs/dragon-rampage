// ================= partWK: WORKER RESPAWN - rebuilt work buildings get new workers who walk in from the nearest village =================
const WK_FIRST=3,WK_GAP=9,WK_SPD=54;
let WK=[];
function wkSites(){const L=[];
  L.push({id:'camp',name:'logging camp',job:'woodcutter',jobName:'lumberjack',need:3,bk:['camptent','sawmill'],x:CAMP.x,y:CAMP.y+30,v:0});
  L.push({id:'mine',name:'mine',job:'miner',jobName:'miner',need:3,bk:['minehead','minehut'],x:MINE.x-60,y:MINE.y+40,v:1});
  L.push({id:'cabin',name:"hunter's cabin",job:'hunter',jobName:'hunter',need:1,bk:['cabin'],x:CABIN.x+30,y:CABIN.y+30,v:-1});
  FARMS.forEach((f,fi)=>L.push({id:'farm'+fi,name:'farm',job:'farmer',jobName:'farmer',need:2,farm:fi,bp:s=>s.kind==='barn'&&s.farm===fi,x:f.field.x+20,y:f.field.y+20,v:f.v}));
  MARKETS.forEach((M,mi)=>L.push({id:'mkt'+mi,name:M.name,job:'shopper',jobName:'shopkeeper',need:5,mkt:M,bp:s=>s.market===M.name,x:M.x,y:M.y+20,v:M.v}));
  for(const s of L){s.down=false;s.refill=false;s.cd=0;}return L;}
function wkBlds(site){return structures.filter(s=>site.bp?site.bp(s):site.bk.includes(s.kind));}
function wkUp(site){const b=wkBlds(site);return b.length>0&&b.every(s=>s.state==='ok');}
function wkIsWorker(u,site){if(u.dead||u.wk)return false;
  if(site.job==='hunter')return u.type==='hunter';if(u.type!=='villager')return false;
  if(site.job==='shopper')return !!u.shopper&&d2(u.home.x,u.home.y,site.mkt.x,site.mkt.y+20)<220*220;
  if(site.job==='farmer')return u.job==='farmer'&&u.farm===site.farm;return u.job===site.job;}
function wkCount(site){let n=0,w=0;for(const u of units){if(u.dead)continue;if(u.wk&&u.wk.id===site.id&&!u.wk.back)w++;else if(wkIsWorker(u,site))n++;}return{n,w};}
function wkHome(site){let best=-1,bd=1e18,any=-1,ad=1e18;
  VILLAGES.forEach((v,vi)=>{const d=d2(v.x,v.y,site.x,site.y);if(d<ad){ad=d;any=vi;}if(d<bd&&structures.some(s=>s.kind==='hut'&&s.v===vi&&s.state==='ok')){bd=d;best=vi;}});return best>=0?best:any;}
function wkSpawn(site){const vi=wkHome(site),V0=VILLAGES[vi];if(!V0)return null;
  const u=spawnVillager(V0.x+R(-30,30),V0.y+R(-20,20),'peasant',vi);
  const rp=roadPath(u.x,u.y,site.x,site.y),P=[];if(rp&&rp.P)for(const p of rp.P)P.push({x:p.x,y:p.y});P.push({x:site.x,y:site.y});
  u.wk={id:site.id,i:0,P,vi,t0:G.t,back:false};u.state='walk';
  if(dist(u,D)<1600||G.bigMap)float(u.x,u.y-26,`Off to work at the ${site.name}!`,'#d8f0c0');return u;}
function wkAbort(u,site){const w=u.wk;if(!w||w.back)return;w.back=true;const k=Math.min(w.i,w.P.length-1);w.P=w.P.slice(0,k).reverse();const V0=VILLAGES[w.vi];w.P.push({x:V0.x+R(-30,30),y:V0.y+R(-20,20)});w.i=0;
  if(dist(u,D)<1600)float(u.x,u.y-26,`The ${site.name} is wrecked! Back home!`,'#ffd0a0');}
function wkArrive(u,site){u.wk=null;u.state='idle';u.tgt=null;
  if(site.job==='hunter'){u.dead=true;u.gone=true;const h=spawnHunter();h.x=u.x;h.y=u.y;return;}
  if(site.job==='shopper'){u.shopper=true;u.home={x:site.mkt.x,y:site.mkt.y+20};u.v=site.v;}
  else{u.job=site.job;if(site.v>=0){u.v=site.v;u.home=VILLAGES[site.v]||u.home;}if(site.job==='farmer')u.farm=site.farm;}
  if(dist(u,D)<1600)float(u.x,u.y-26,`New ${site.jobName} at work!`,'#d8f0c0');}
function wkStep(u,dt){const w=u.wk,site=WK.find(s=>s.id===w.id);if(!site){u.wk=null;return;}
  if(!w.back&&site.down)wkAbort(u,site);
  const p=w.P[w.i];if(!p){if(w.back){u.wk=null;u.state='idle';u.home=VILLAGES[w.vi]||u.home;}else wkArrive(u,site);return;}
  if(moveTo(u,p.x,p.y,WK_SPD,dt))w.i++;}
function updWorkers(dt){if(!WK.length)return;for(const site of WK){const up=wkUp(site);
    if(!up){if(!site.down){site.down=true;site.refill=false;for(const u of units)if(u.wk&&u.wk.id===site.id&&!u.dead)wkAbort(u,site);}continue;}
    if(site.down){site.down=false;site.refill=true;site.cd=WK_FIRST;}
    if(!site.refill)continue;const c=wkCount(site);if(c.n+c.w>=site.need){if(!c.w&&c.n>=site.need)site.refill=false;continue;}
    site.cd-=dt;if(site.cd>0)continue;site.cd=WK_GAP;wkSpawn(site);}}
const _updVillagerWK=updVillager;updVillager=function(u,dt){if(u.wk&&!u.dead){if(dist(u,D)<fearR()&&!G.over)return _updVillagerWK(u,dt);wkStep(u,dt);return;}return _updVillagerWK(u,dt);};
const _newGameWK=newGame;newGame=function(){const r=_newGameWK.apply(this,arguments);WK=wkSites();return r;};
const _updateWK=update;update=function(dt){const r=_updateWK.apply(this,arguments);if(!G.over)updWorkers(dt);return r;};
// save / load support
function wkSave(){return WK.map(s=>{const c=wkCount(s);return{id:s.id,down:s.down,refill:s.refill,cd:s.cd,n:c.n,w:c.w};});}
function wkLoad(arr){WK=wkSites();if(!Array.isArray(arr))return;for(const a of arr){const s=WK.find(x=>x.id===a.id);if(!s)continue;
    s.down=!!a.down;s.refill=!!a.refill||a.w>0;s.cd=Math.min(+a.cd||0,WK_GAP);
    let extra=wkCount(s).n-(+a.n||0);if(extra>0)for(const u of units){if(extra<=0)break;if(wkIsWorker(u,s)){u.dead=true;u.gone=true;extra--;}}
    if(s.refill&&wkCount(s).n<s.need)s.cd=Math.min(s.cd,WK_FIRST);}
  for(let i=units.length-1;i>=0;i--)if(units[i].gone&&units[i].dead)units.splice(i,1);}
