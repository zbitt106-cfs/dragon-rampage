// ================= partSC: SUPPLY CARTS + the CASTLE STOREHOUSE =================
// Loggers and miners pile their work in the camp/mine yards (G.yardWood / G.yardStone). Horse carts, each LED by a
// villager driver walking at the horse's head, haul it along the roads to the Castle Storehouse beside the castle.
// Only cargo that is DELIVERED joins the kingdom stockpile (G.wood / G.stone) that pays for rebuilding.
const STORE_POS={x:1730,y:4075},STORE_DOOR={x:1815,y:4068};
const SC={cap:5,perSrc:2,respawn:35,speed:46,loadEvery:1.1,lazyGo:22,strandT:40,lossFrac:.4,horseGap:22,cartGap:48};
const SC_SRC={
  camp:{kind:'wood',yard:'logpile',park:()=>({x:LOGPILE_POS.x+64,y:LOGPILE_POS.y+26}),job:'woodcutter',name:'logging camp'},
  mine:{kind:'stone',yard:'stonepile',park:()=>({x:STONEPILE_POS.x-60,y:STONEPILE_POS.y+30}),job:'miner',name:'mine'}};
function storeS(){return structures.find(s=>s.kind==='storehouse');}
function storeUp(){const s=storeS();return !!s&&s.state==='ok';}
function scList(){return carts.filter(c=>c.supply);}
function scLive(){return carts.filter(c=>c.supply&&!c.wrecked);}
function scWorkers(src){const j=SC_SRC[src].job;return units.filter(u=>u.type==='villager'&&!u.dead&&u.job===j&&!(u.wk&&!u.wk.done)).length;}
function yardGet(kind){return kind==='wood'?(G.yardWood||0):(G.yardStone||0);}
function yardTake(kind,n){if(kind==='wood')G.yardWood=(G.yardWood||0)-n;else G.yardStone=(G.yardStone||0)-n;}
// a route = polyline with cumulative lengths; position by arc length (negative = behind the start along the first leg)
function scRoute(a,b){const r=typeof roadPath==='function'?roadPath(a.x,a.y,b.x,b.y):null;const P=[{x:a.x,y:a.y}];
  if(r&&r.P)for(const v of r.P)P.push({x:v.x,y:v.y});if(b===STORE_DOOR||(Math.abs(b.x-STORE_DOOR.x)<2&&Math.abs(b.y-STORE_DOOR.y)<2))P.push({x:STORE_DOOR.x,y:STORE_DOOR.y-60});
  P.push({x:b.x,y:b.y});const Q=[P[0]];for(const p of P)if(Math.hypot(p.x-Q[Q.length-1].x,p.y-Q[Q.length-1].y)>4)Q.push(p);
  const L=[0];for(let i=1;i<Q.length;i++)L.push(L[i-1]+Math.hypot(Q[i].x-Q[i-1].x,Q[i].y-Q[i-1].y));return{P:Q,L,len:L[L.length-1]};}
function scAt(R,s){const P=R.P,L=R.L;if(P.length<2)return{x:P[0].x,y:P[0].y,a:0};
  if(s<=0){const a=Math.atan2(P[1].y-P[0].y,P[1].x-P[0].x);return{x:P[0].x+Math.cos(a)*s,y:P[0].y+Math.sin(a)*s,a};}
  let i=1;while(i<P.length-1&&L[i]<s)i++;const a=Math.atan2(P[i].y-P[i-1].y,P[i].x-P[i-1].x),seg=(L[i]-L[i-1])||1,k=Math.min(1,(s-L[i-1])/seg);
  return{x:P[i-1].x+(P[i].x-P[i-1].x)*k,y:P[i-1].y+(P[i].y-P[i-1].y)*k,a};}
function scMkDriver(x,y){const u=spawnVillager(x,y,'carter',8);u.shirt='#6a4a8a';return u;}
function scMkHorse(x,y){const h=mkUnit('animal',x,y,{species:'horse',hp:16,maxHp:16,cartHorse:true,pen:{x:x-40,y:y-30,w:80,h:60}});units.push(h);return h;}
function scSpawn(src,o){o=o||{};const S=SC_SRC[src],pk=S.park();
  const c={supply:true,src,kind:S.kind,load:o.load||0,st:o.st||'load',x:pk.x,y:pk.y,fire:0,wrecked:false,t:0,ang:0,waitT:0,loadT:0,strandT:0,id:Math.random()};
  c.R=c.st==='go'?scRoute(pk,STORE_DOOR):scRoute(STORE_DOOR,pk);c.s=c.st==='load'?c.R.len:0;if(o.s!=null)c.s=o.s;
  if(o.st==='back')c.s=o.s||0;
  const p=scAt(c.R,c.s);c.drv=o.noDrv?null:scMkDriver(p.x,p.y);if(c.drv)c.drv.scart=c;const hp=scAt(c.R,c.s-SC.horseGap);c.horse=o.noHorse?null:scMkHorse(hp.x,hp.y);if(c.horse)c.horse.scart=c;
  carts.push(c);scPlace(c,0,true);return c;}
function scAlive(u){return !!u&&!u.dead;}
// put horse + cart on the route behind the driver's lead point
function scPlace(c,dt,snap){const lead=scAt(c.R,c.s),hp=scAt(c.R,c.s-SC.horseGap),cp=scAt(c.R,c.s-SC.cartGap);
  c.lead=lead;c.x=cp.x;c.y=cp.y;c.ang=Math.atan2(hp.y-cp.y,hp.x-cp.x);
  const H=c.horse;if(scAlive(H)&&!H.loose){H.x=hp.x;H.y=hp.y;H.face=Math.cos(hp.a)>=0?1:-1;if(dt&&!c.halt)H.anim+=dt*6;H.state='idle';}
  const u=c.drv;if(snap&&scAlive(u)){const px=-Math.sin(lead.a)*9,py=Math.cos(lead.a)*9;u.x=lead.x+px;u.y=lead.y+py;}}
function scDeliver(c){const n=c.load|0;if(n<=0)return;if(c.kind==='wood')G.wood+=n;else G.stone+=n;c.load=0;
  G.stats.delivered=(G.stats.delivered||0)+n;float(STORE_DOOR.x,STORE_DOOR.y-46,`+${n} ${c.kind} delivered to the storehouse`,c.kind==='wood'?'#e8c090':'#e0e0e0');}
function scStep(c,dt){if(c.wrecked)return;
  const u=c.drv,H=c.horse,dOK=scAlive(u),hOK=scAlive(H)&&!H.loose;
  if(c.fire){c.halt=true;return;}
  // stranded: lost its driver or horse; a new one comes out once the dragon has gone
  if(!dOK||!hOK){c.halt=true;c.strandT+=dt;if(c.strandT>SC.strandT&&dist(c,D)>650){const p=scAt(c.R,c.s);
      if(!dOK){c.drv=scMkDriver(p.x,p.y);c.drv.scart=c;}if(!hOK){if(H&&H.loose){H.dead=true;H.gone=true;}c.horse=scMkHorse(c.x,c.y);c.horse.scart=c;}
      c.strandT=0;float(c.x,c.y-30,!dOK?'A new carter takes the reins':'A fresh horse is hitched up','#b8e0ff');}
    return;}
  if(u.state==='flee'||u.inside){c.halt=true;return;}
  // walk back to the horse's head before setting off again
  const L=c.lead||scAt(c.R,c.s),px=-Math.sin(L.a)*9,py=Math.cos(L.a)*9;
  if(Math.hypot(u.x-L.x-px,u.y-L.y-py)>6){c.halt=true;moveTo(u,L.x+px,L.y+py,52,dt);return;}
  c.halt=false;
  if(c.st==='load'){c.halt=true;u.face=1;c.waitT+=dt;c.loadT+=dt;
    if(c.loadT>=SC.loadEvery){c.loadT=0;if(c.load<SC.cap&&yardGet(c.kind)>0){yardTake(c.kind,1);c.load++;}}
    if(c.load>=SC.cap||(c.load>=2&&c.waitT>SC.lazyGo)){c.st='go';c.R=scRoute(SC_SRC[c.src].park(),STORE_DOOR);c.s=0;c.waitT=0;scPlace(c,0,true);
      float(c.x,c.y-30,`Cart of ${c.kind==='wood'?'logs':'stone'} heads for the castle`,'#e8d8b0');}
    return;}
  if(c.st==='wait'){c.halt=true;const s=storeS();
    if(s&&s.state==='ok'){scDeliver(c);c.st='back';c.R=scRoute(STORE_DOOR,SC_SRC[c.src].park());c.s=0;scPlace(c,0,true);return;}
    // the kingdom cannot afford the rebuild: tip the cargo onto the rubble so masons can pay for it
    const [w,st]=COST.storehouse;if(s&&!s.paid&&(G.wood<w||G.stone<st)&&c.load>0){c.waitT+=dt;if(c.waitT>4){scDeliver(c);c.st='back';c.R=scRoute(STORE_DOOR,SC_SRC[c.src].park());c.s=0;scPlace(c,0,true);}}
    return;}
  // on the road
  c.s+=SC.speed*dt;u.anim+=dt*8;
  if(c.s>=c.R.len){c.s=c.R.len;
    if(c.st==='go'){if(storeUp()){scDeliver(c);c.st='back';c.R=scRoute(STORE_DOOR,SC_SRC[c.src].park());c.s=0;}
      else{c.st='wait';c.waitT=0;}}
    else if(c.st==='back'){c.st='load';c.waitT=0;c.loadT=0;}}
  scPlace(c,dt);const L2=c.lead,qx=-Math.sin(L2.a)*9,qy=Math.cos(L2.a)*9;u.x=L2.x+qx;u.y=L2.y+qy;u.face=Math.cos(L2.a)>=0?1:-1;}
function updSupply(dt){if(scene!=='play'&&scene!=='title')return;
  for(const c of carts)if(c.supply)scStep(c,dt);
  // runaway horses from smashed carts trot off and leave the map
  for(const H of units)if(H.cartHorse&&H.loose&&!H.dead){H.loose-=dt;const a=Math.atan2(H.y-D.y,H.x-D.x);H.x+=Math.cos(a)*70*dt;H.y+=Math.sin(a)*70*dt;H.face=Math.cos(a)>0?1:-1;H.anim+=dt*10;if(H.loose<=0){H.dead=true;H.gone=true;}}
  // respawn: a new cart comes out of each yard every so often while its camp has workers
  if(!G.scT)G.scT={};
  for(const src in SC_SRC){const S=SC_SRC[src],n=carts.filter(c=>c.supply&&!c.wrecked&&c.src===src).length,yard=pile(S.yard);
    if(n>=SC.perSrc||!yard||yard.state!=='ok'||!scWorkers(src)){G.scT[src]=Math.min(G.scT[src]||SC.respawn,SC.respawn);continue;}
    G.scT[src]=(G.scT[src]==null?SC.respawn:G.scT[src])-dt;
    if(G.scT[src]<=0&&dist(S.park(),D)>360){G.scT[src]=SC.respawn;scSpawn(src);float(S.park().x,S.park().y-40,`A new supply cart sets out from the ${S.name}`,'#b8e0ff');}}}
// wreck a supply cart: cargo is lost, the horse bolts, the driver runs
const _wreckCartSC=wreckCart;wreckCart=function(c){if(!c||!c.supply)return _wreckCartSC.apply(this,arguments);if(c.wrecked)return;
  c.wrecked=true;c.fire=0;c.t=12;const lost=c.load|0;c.load=0;G.stats.scarts=(G.stats.scarts||0)+1;addAlarm(4,c.x,c.y);
  if(typeof tallyAdd==='function')tallyAdd('supplycart');
  splinters&&splinters(c.x,c.y,6);puff(c.x,c.y-6,12,'rgba(150,130,110,',120,8);
  float(c.x,c.y-36,lost?`Supply cart smashed! ${lost} ${c.kind} lost`:'Supply cart smashed!','#ffb050');
  const H=c.horse;if(scAlive(H)){H.loose=8;}const u=c.drv;if(scAlive(u)){u.scart=null;u.job='peasant';u.state='flee';u.t=2;}};
const _calcScoreSC=calcScore;calcScore=function(){return _calcScoreSC.apply(this,arguments)+(G.stats.scarts||0)*40;};
// bites and dive slams smash carts too (stomps and fire already do)
const _tryEatSC=tryEat;tryEat=function(){const r=_tryEatSC.apply(this,arguments);if(D.alt<.5){const mx=D.x+Math.cos(D.ang)*40,my=D.y+Math.sin(D.ang)*40;
    for(const c of carts)if(c.supply&&!c.wrecked&&Math.hypot(c.x-mx,c.y-my)<46){wreckCart(c);float(c.x,c.y-54,'CRUNCH!','#ffe28a');break;}}return r;};
if(typeof diveSlam==='function'){const _ds=diveSlam;diveSlam=function(){const r=_ds.apply(this,arguments);for(const c of carts)if(c.supply&&!c.wrecked&&dist(c,D)<DR.stompR*1.3)wreckCart(c);return r;};}
// the driver: flees from the dragon like any villager, otherwise the cart logic moves him
const _updVillagerSC=updVillager;updVillager=function(u,dt){if(u.scart&&!u.scart.wrecked){if(dist(u,D)<fearR()&&!G.over)return _updVillagerSC.apply(this,arguments);
    if(u.state==='flee'){u.t-=dt;if(u.t>0)return;u.state='idle';}return;}
  if(u.job==='carter'){u.job='peasant';}return _updVillagerSC.apply(this,arguments);};
const _updAnimalSC=updAnimal;updAnimal=function(u,dt){if(u.cartHorse)return;return _updAnimalSC.apply(this,arguments);};
// the storehouse loses part of the stockpile when wrecked
const _onRuinSC=onRuin;onRuin=function(s){const r=_onRuinSC.apply(this,arguments);if(s.kind==='storehouse'){const w=Math.ceil(G.wood*SC.lossFrac),st=Math.ceil(G.stone*SC.lossFrac);G.wood-=w;G.stone-=st;
    float(s.x,s.y-70,`Storehouse wrecked! ${w} wood and ${st} stone spill and are lost`,'#ffb050');if(w+st>0){dropDebris(s.x,s.y,w,st);}}return r;};
function dropDebris(x,y,w,st){for(let i=0;i<Math.min(14,w+st);i++)puff(x+R(-30,30),y-R(0,10),1,i<w?'rgba(140,90,40,':'rgba(160,160,160,',80,6);}
// world setup
const _newGameSC=newGame;newGame=function(){const r=_newGameSC.apply(this,arguments);
  if(!storeS())kAdd('storehouse',STORE_POS.x,STORE_POS.y,-1);G.yardWood=4;G.yardStone=4;G.scT={camp:12,mine:20};
  scSpawn('camp',{load:3,st:'go',s:120});scSpawn('mine',{load:3,st:'go',s:120});return r;};
const _updateSC=update;update=function(dt){const r=_updateSC.apply(this,arguments);if(scene==='play'&&!G.over&&!paused)updSupply(dt);
  for(let i=carts.length-1;i>=0;i--){const c=carts[i];if(c.supply&&c.wrecked&&c.t<=0)carts.splice(i,1);}return r;};
// save / load
function scSave(){return scList().filter(c=>!c.wrecked).map(c=>({src:c.src,st:c.st,load:c.load,s:Math.round(c.s),waitT:Math.round(c.waitT||0),drv:scAlive(c.drv)?1:0,horse:scAlive(c.horse)&&!c.horse.loose?1:0}));}
function scLoad(arr){if(!Array.isArray(arr))return;
  for(const c of scList()){for(const u of [c.drv,c.horse])if(u){u.dead=true;u.gone=true;}}
  for(let i=carts.length-1;i>=0;i--)if(carts[i].supply)carts.splice(i,1);
  for(let i=units.length-1;i>=0;i--)if(units[i].gone&&units[i].dead)units.splice(i,1);
  for(const a of arr){if(!SC_SRC[a.src])continue;const st=['load','go','back','wait'].includes(a.st)?a.st:'load';
    const c=scSpawn(a.src,{st:st==='wait'?'go':st,load:+a.load||0,noDrv:!a.drv,noHorse:!a.horse});
    if(st==='back'){c.R=scRoute(STORE_DOOR,SC_SRC[a.src].park());}
    c.st=st;c.s=st==='wait'?c.R.len:Math.max(0,Math.min(c.R.len,+a.s||0));if(st==='load')c.s=c.R.len;c.waitT=+a.waitT||0;scPlace(c,0,true);}}
if(typeof svSnapshot==='function'){const _snapSC=svSnapshot;svSnapshot=function(){const o=_snapSC.apply(this,arguments);o.SC=scSave();return o;};
  const _applySC=svApply;svApply=function(d){const r=_applySC.apply(this,arguments);scLoad(d.SC);return r;};}
// drawing: horse harness, shafts, cargo, reins to the driver's hand
const _drawCartSC=drawCart;drawCart=function(c){if(!c.supply)return _drawCartSC.apply(this,arguments);drawSupplyCart(c);};
function drawSupplyCart(c){const x=c.x,y=c.y,a=c.ang||0,F=c.fire,ca=Math.cos(a),sa=Math.sin(a);
  if(c.wrecked){ctx.globalAlpha=Math.min(1,c.t/3);line(x-14,y,x+10,y-5,'#3a2a1a',3);line(x-6,y+4,x+14,y+2,'#4a3420',3);ell(x+8,y+3,5,2.4,'#333');ell(x-10,y-2,5,2.4,'#333');ctx.globalAlpha=1;return;}
  ell(x,y+4,20,6,'rgba(0,0,0,.25)');
  const H=c.horse;if(scAlive(H)&&!H.loose){line(x+ca*12,y+sa*12-6,H.x-ca*8,H.y-sa*8-8,'#5a3a1c',2);line(x+ca*12+sa*5,y+sa*12-ca*5-4,H.x-ca*8+sa*4,H.y-sa*8-ca*4-6,'#5a3a1c',2);
    const u=c.drv;if(scAlive(u)&&!c.halt||scAlive(u)&&dist(u,H)<40){ctx.strokeStyle='#2a1a10';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(H.x+ca*10,H.y+sa*10-12);ctx.quadraticCurveTo((H.x+u.x)/2,(H.y+u.y)/2-4,u.x+u.face*3,u.y-8);ctx.stroke();}}
  // wheels + bed (a little side-on box that turns with the road)
  const w=Math.abs(ca)*12+5;ell(x-w,y+1,4.5,4.5,'#3a2a18');ell(x+w,y+1,4.5,4.5,'#3a2a18');ell(x-w,y+1,2,2,'#8a6a40');ell(x+w,y+1,2,2,'#8a6a40');
  rect(x-w-4,y-10,2*w+8,9,F?'#5a2a10':'#8a6234');rect(x-w-4,y-11,2*w+8,2,F?'#3a1a08':'#5a3a1c');
  const n=c.load|0;
  if(c.kind==='wood')for(let i=0;i<n;i++){const row=i<3?0:1,col=row?i-3:i,lx=x-w+3+col*((2*w-6)/2)+row*5,ly=y-13-row*5;line(lx-6,ly,lx+6,ly,'#7a4a20',4.6);ell(lx+6,ly,2.6,2.4,'#d2a868');}
  else for(let i=0;i<n;i++){const row=i<3?0:1,col=row?i-3:i,bx=x-w+1+col*((2*w-4)/3)+row*4,by=y-16-row*5;rect(bx,by,6,5,i%2?'#a39d94':'#8d877e');rect(bx,by,6,1.2,'#c8c2b8');}
  if(F)for(let i=0;i<2;i++)ell(x+R(-8,8),y-16-R(0,8),R(3,5),R(5,8),`rgba(255,${RI(120,200)},40,.8)`);
  if(n&&Math.hypot(cam.x-x,cam.y-y)<500&&c.st!=='load'){ctx.fillStyle='rgba(255,240,210,.9)';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText(`${n} ${c.kind==='wood'?'logs':'stone'}`,x,y-26);}}
// storehouse: show what is in store (crates, logs, stone) and the stock
const _drawStructKSC=drawStructK;drawStructK=function(s){const r=_drawStructKSC.apply(this,arguments);
  if(s.kind==='storehouse'&&s.state==='ok'){const x=s.x,y=s.y,nw=Math.min(8,Math.ceil(G.wood/3)),ns=Math.min(8,Math.ceil(G.stone/3));
    for(let i=0;i<nw;i++){const lx=x-56+(i%4)*7,ly=y-4-Math.floor(i/4)*6;line(lx-8,ly,lx+4,ly,'#7a4a20',4.6);ell(lx+4,ly,2.6,2.4,'#d2a868');}
    for(let i=0;i<ns;i++)rect(x+40+(i%4)*7,y-6-Math.floor(i/4)*6,6,5,i%2?'#a39d94':'#8d877e');
    ctx.fillStyle='#ffe';ctx.font='bold 11px Georgia';ctx.textAlign='center';ctx.fillText('Castle Storehouse',x,y-62);ctx.font='10px Georgia';ctx.fillText(`wood ${G.wood} · stone ${G.stone}`,x,y-50);}
  return r;};
