// ======================= partNW: GORILLAS, GIANT RIVER OTTERS (jungle) · DOLPHINS, ORCAS, FLYING FISH, MARINE IGUANAS (coast & sea) =======================
// Family-friendly cartoon wildlife: predators "gulp" prey in a puff, no gore. All wild: eating them never raises wanted.
// + the small wild dragons of Dragon Peaks give +10 permanent max health each (same-life rule as the kraken / sand worm / octopus).
// ---------- jungle: gorilla troops led by a silverback (uses the partTF territorial-leader system) ----------
Object.assign(FAUNA,{gorilla:{hp:34,sp:68,bite:3,aggro:60,cd:1.6,say:'Gorilla bonk! -3',growl:'Hoo-hoo! *grunt*',zone:'jungle'},
  gotter:{hp:8,sp:84,bite:1,aggro:80,cd:1.3,say:'Otter nip! -1',growl:'EEE-EEE-EEE!',zone:'jotter'}});
Object.assign(HEAL,{gorilla:30,gotter:8,silverback:50});Object.assign(FOOD,{gorilla:30,gotter:8,silverback:50});
['gorilla','gotter'].forEach(s=>FAUNA_ART.add(s));
TF_L.gorilla={flag:'male',hp:92,bite:6,cd:1.5,R:480,scale:1.25,call:'*THUMP THUMP* HOO-HOO-HOO!',sfx:'roar',col:'#e8e8f0',ring:'210,215,230',key:'silverback',label:'Silverback gorillas',food:50,heal:50,grp:'troop',
  who:'The silverback',say:'Silverback bonk!',calm:'The silverback grunts and the troop goes back to munching leaves',fresh:'A new silverback leads the troop!'};
Object.assign(PRIDES,{gorilla:{n:2,size:5},gotter:{n:3,size:4}});
// the jungle river: giant otters live on both banks and in the water; jungle fish swim in it
ZONES.jotter={ok:(x,y)=>regionKey(x,y)==='jungle'&&jriverD(x,y)<190,s:()=>{const i=RI(0,JRIVER.length-2),k=rnd(),sd=rnd()<.5?-1:1;return{x:JRIVER[i][0]+(JRIVER[i+1][0]-JRIVER[i][0])*k+sd*R(0,120),y:JRIVER[i][1]+(JRIVER[i+1][1]-JRIVER[i][1])*k};}};
ZONES.jwater={ok:(x,y)=>jriverD(x,y)<JRW-8,s:()=>{const i=RI(0,JRIVER.length-2),k=rnd();return{x:JRIVER[i][0]+(JRIVER[i+1][0]-JRIVER[i][0])*k+R(-20,20),y:JRIVER[i][1]+(JRIVER[i+1][1]-JRIVER[i][1])*k};}};
const NW_JFISH=12;
function nwJFish(far,at){const Z=ZONES.jwater;let p=at||null;for(let t=0;!p&&t<60;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>800))p=q;}if(!p)return null;
  const u=mkUnit('animal',p.x,p.y,{species:'fish',wild:true,free:true,zone:'jwater',jfish:1,hp:2,maxHp:2,home:{x:p.x-200,y:p.y-200,w:400,h:400},t:R(0,3),jt:0,face:rnd()<.5?1:-1});units.push(u);return u;}
const nwSilver=u=>!!(u&&u.species==='gorilla'&&u.male);
// predators & prey: otters fish; crocs and jaguars may try for an otter (the family mobs them); big cats back off from a silverback
HN_DIET.gotter={prey:['fish'],r:380,sp:1.3};
for(const [p,a] of [['croc',['gotter']],['jaguar',['gotter']]])if(HN_DIET[p])for(const k of a)if(!HN_DIET[p].prey.includes(k))HN_DIET[p].prey.push(k);
// ---------- sea: dolphins, orcas, flying fish, marine iguanas ----------
const NWK=['dolphin','orca','ffish','miguana'];
const NW_HP={dolphin:30,orca:160,ffish:3,miguana:8},NW_FOOD={dolphin:30,orca:70,ffish:3,miguana:8};
for(const k of NWK){SEAHEAL[k]=NW_FOOD[k];FOOD[k]=NW_FOOD[k];SEAPTS[k]=Math.round(NW_FOOD[k]/2)+2;}
const NW_PLAN={dolphin:[3,4],orca:[2,3],ffish:[4,6],miguana:[3,6]}; // [groups, size]
HN_DIET.dolphin={prey:['school','ffish'],r:420};HN_DIET.orca={prey:['school','dolphin','iseal','shark','penguin','miguana','ffish'],r:560};
for(const [p,a] of [['shark',['ffish','miguana']],['gull',['ffish']]])if(HN_DIET[p])for(const k of a)if(!HN_DIET[p].prey.includes(k))HN_DIET[p].prey.push(k);
Object.assign(HN_NICE,{gorilla:'a gorilla',gotter:'a giant otter',dolphin:'a dolphin',orca:'an orca',ffish:'a flying fish',miguana:'a marine iguana'});
Object.assign(HN_WHO,{gotter:'A giant otter',dolphin:'A dolphin',orca:'An orca',jaguar:HN_WHO.jaguar||'A jaguar'});
const NW={cols:[],t:0,rT:0,grp:0};
function nwOK(u,x,y){if(d2(x,y,LH.x,LH.y)<LH.r+40||!inSea(x,y))return false;if(u.kind==='ffish'||u.kind==='dolphin')return !inDeep(x,y)||u.kind==='dolphin';return true;}
{const _ok=seaOK;seaOK=function(u,x,y){if(u&&u.nw){if(u.kind==='miguana')return inSea(x,y)||onBeach(x,y);return nwOK(u,x,y);}return _ok.apply(this,arguments);};}
function nwMk(kind,x,y,o){return mkSea(kind,x,y,Object.assign({nw:1,ang:R(0,TAU),hp:NW_HP[kind],maxHp:NW_HP[kind],hx:x,hy:y,face:1,anim:R(0,6),st:'idle',cd:0,jT:R(1,5),jump:0,fly:0,fcd:0},o||{}));}
function nwGroup(kind,far,at){const n=NW_PLAN[kind][1],g=++NW.grp;let p=at;
  if(kind==='miguana'){if(!p){const c=nwColony(far);if(!c)return 0;p=c;}const c=p.wx!==undefined?p:nwColonyAt(p.x,p.y);if(!c)return 0;
    for(let i=0;i<n;i++)nwMk('miguana',c.x+R(-40,40),c.y+R(-20,20),{col:NW.cols.indexOf(c),grp:g,st:'bask',t:R(2,10)});return n;}
  if(!p)p=seaPoint(kind==='orca'?900:kind==='dolphin'?200:120,kind==='orca'?4200:kind==='dolphin'?1500:2400,{noDeep:kind!=='orca',far,avoidIsle:true});if(!p)return 0;
  for(let i=0;i<n;i++){const q={x:p.x+R(-60,60),y:p.y+R(-40,40)};if(!inSea(q.x,q.y)){q.x=p.x;q.y=p.y;}nwMk(kind,q.x,q.y,{hx:p.x,hy:p.y,grp:g});}return n;}
// marine iguanas: rocky basking spots on the beach, each with a shallow grazing patch just offshore
function nwWaterNear(x,y){for(let r=40;r<=520;r+=30)for(let i=0;i<12;i++){const a=i/12*TAU,wx=x+Math.cos(a)*r,wy=y+Math.sin(a)*r;if(inSea(wx,wy)&&!inDeep(wx,wy)&&seaD(wx,wy)>40)return{x:wx,y:wy};}return null;}
function nwColonyAt(x,y,wx,wy){let w=wx!==undefined?{x:wx,y:wy}:nwWaterNear(x,y);if(!w)return null;const c={x,y,wx:w.x,wy:w.y,rocks:[]};
  for(let i=0;i<5;i++)c.rocks.push({x:x+R(-46,46),y:y+R(-20,20),r:R(9,16)});NW.cols.push(c);return c;}
function nwColony(far){for(let t=0;t<40;t++){const p=ocBeachPt(far);if(!p)continue;if(NW.cols.some(c=>d2(c.x,c.y,p.x,p.y)<700))continue;const c=nwColonyAt(p.x,p.y);if(c)return c;}return null;}
function nwInit(){NW.cols=[];NW.t=0;NW.rT=0;NW.sT=0;for(const k of NWK)for(let i=0;i<NW_PLAN[k][0];i++)nwGroup(k,false);
  for(let i=0;i<NW_JFISH;i++)nwJFish(false);}
const nwPod=u=>units.filter(v=>!v.dead&&v.nw&&v.kind===u.kind&&v.grp===u.grp);
function nwMoveLin(u,tx,ty,sp,dt){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);if(d<3)return true;const s=Math.min(d,sp*dt);u.x+=dx/d*s;u.y+=dy/d*s;if(Math.abs(dx)>1)u.face=dx>0?1:-1;u.anim+=dt*8;return d<6;}
function nwChase(u,sp,dt,cR){const T=u.hPrey;if(!hnAlive(T)||u.hT>12){hnDrop(u);return false;}u.hT+=dt;const dx=T.x-u.x,dy=T.y-u.y,d=Math.hypot(dx,dy);
  if(d<cR){hnCatch(u,T);return true;}const s=Math.min(d,sp*dt),nx=u.x+dx/d*s,ny=u.y+dy/d*s;if(T.type==="sea"&&T.kind==="school")T.hChased=G.t;else T.hBy=u;u.ang=Math.atan2(dy,dx);if(seaOK(u,nx,ny)){u.x=nx;u.y=ny;}else return ocChase(u,sp,dt,cR);u.face=dx>0?1:-1;u.anim+=dt*6;return true;}
function updNW(u,dt){const k=u.kind;u.cd=Math.max(0,u.cd-dt);u.fcd=Math.max(0,u.fcd-dt);if(u.full>0)u.full-=dt;if(u.hRest>0)u.hRest-=dt;if(u.angry>0)u.angry-=dt;u.anim+=dt*2;
  if(k==='dolphin'){u.jT-=dt;if(u.jump>0){u.jump-=dt/1.1;if(u.jump<=0&&dist(u,D)<1000)splash(u.x+u.face*14,u.y);}else if(u.jT<=0){u.jT=R(3,8);u.jump=1;}
    const hurt=G.t-(u.hurtT||-99)<4;
    if(hurt){ocAway(u,190,dt);return;}
    if(D.swim&&!G.over&&d2(u.x,u.y,D.x,D.y)<340){const a=G.t*1.3+u.id*1.7,tx=D.x+Math.cos(a)*110,ty=D.y+Math.sin(a)*70;swimTo(u,tx,ty,170,dt);if(u.jump<=0&&rnd()<dt*.6)u.jump=1;
      if(!u._pl||G.t-u._pl>6){u._pl=G.t;G.dolPlay=(G.dolPlay||0)+1;ocSay(u,'Eee-ee-ee! *click click*','#bff0ff',4);}return;}
    if(u.hPrey&&nwChase(u,175,dt,30))return;
    ocWander(u,95,dt,260);return;}
  if(k==='orca'){u.spout=(u.spout||R(4,9))-dt;if(u.spout<=0){u.spout=R(6,12);if(dist(u,D)<1100)puff(u.x+u.face*20,u.y-24,GFX_HI?6:3,'rgba(235,245,255,',40,4);}
    if(u.angry>0&&ocDragonWet(u,450)){swimTo(u,D.x,D.y,150,dt);if(d2(u.x,u.y,D.x,D.y)<75&&u.cd<=0){u.cd=2.2;G.orcaSlaps=(G.orcaSlaps||0)+1;ocHurtD(5,'orca',u,'Orca tail slap!');splash(D.x,D.y);}return;}
    if(u.hPrey&&nwChase(u,160,dt,42))return;
    // the pod leader drifts the pod's home now and then
    if(rnd()<dt*.02){const p=seaPoint(900,4200,{avoidIsle:true});if(p&&d2(p.x,p.y,u.hx,u.hy)<1600)for(const v of nwPod(u)){v.hx=p.x;v.hy=p.y;}}
    ocWander(u,70,dt,420);return;}
  if(k==='ffish'){if(u.fly>0){u.fly-=dt;const sp=270;u.x+=Math.cos(u.fa)*sp*dt;u.y+=Math.sin(u.fa)*sp*dt;u.face=Math.cos(u.fa)>0?1:-1;
      if(u.fly<=0){u.fly=0;u.fcd=R(1.2,2.5);if(!inSea(u.x,u.y)){u.x-=Math.cos(u.fa)*40;u.y-=Math.sin(u.fa)*40;}if(dist(u,D)<1000)splash(u.x,u.y);}return;}
    const th=ocDragonLow(u,230)?D:(u.hBy&&hnAlive(u.hBy)&&dist(u,u.hBy)<240?u.hBy:null);
    if(u.fcd<=0&&(th||rnd()<dt*.04)){const base=th?Math.atan2(u.y-th.y,u.x-th.x):R(0,TAU);
      for(let i=0;i<6;i++){const a=base+R(-.6,.6),ex=u.x+Math.cos(a)*270*1.3,ey=u.y+Math.sin(a)*270*1.3;if(inSea(ex,ey)&&d2(ex,ey,LH.x,LH.y)>LH.r+60){u.fa=a;u.fly=1.3;G.ffGlides=(G.ffGlides||0)+1;
        if(u.hBy&&u.hBy.hPrey===u){hnDrop(u.hBy);}u.hBy=null;if(th&&dist(u,D)<900&&(!NW.ffSay||G.t-NW.ffSay>4)){NW.ffSay=G.t;float(u.x,u.y-30,'Whoosh! Flying fish take off!','#bfe6ff');}return;}}}
    // the school wanders together
    if(u.grp&&rnd()<dt*.05){const p=seaPoint(120,2400,{noDeep:true,avoidIsle:true});if(p&&d2(p.x,p.y,u.hx,u.hy)<900)for(const v of nwPod(u)){v.hx=p.x;v.hy=p.y;}}
    ocWander(u,55,dt,140);return;}
  if(k==='miguana'){const c=NW.cols[u.col];if(!c){u.dead=true;u.gone=true;return;}u.t-=dt;const wet=inSea(u.x,u.y);u.wet=wet;
    if(u.st==='bask'){if(u.t<=0){if(rnd()<.45){u.st='out';u.tx=c.wx+R(-50,50);u.ty=c.wy+R(-40,40);}else{u.t=R(4,10);u.bx=c.x+R(-44,44);u.by=c.y+R(-18,18);}}
      if(u.bx!==undefined)nwMoveLin(u,u.bx,u.by,14,dt);
      if(rnd()<dt*.04&&dist(u,D)<700){G.iguSneeze=(G.iguSneeze||0)+1;u.sneeze=.6;ocSay(u,'Ptchoo! *salty sneeze*','#e8f4ff',3);}
      if(u.sneeze>0)u.sneeze-=dt;return;}
    if(u.st==='out'){if(nwMoveLin(u,u.tx,u.ty,wet?38:30,dt)){u.st='graze';u.t=R(5,10);}return;}
    if(u.st==='graze'){u.x+=Math.sin(G.t+u.id)*6*dt;if(u.t<=0||(u.hBy&&hnAlive(u.hBy)))u.st='back';return;}
    if(u.st==='back'){if(nwMoveLin(u,c.x+R(-30,30),c.y+R(-12,12),wet?44:30,dt)){u.st='bask';u.t=R(6,14);u.bx=u.x;u.by=u.y;}return;}
    u.st='bask';return;}}
{const _us=updSeaUnit;updSeaUnit=function(u,dt){if(u&&u.nw){if(u.dead)return;updNW(u,dt);return;}return _us.apply(this,arguments);};}
// hunters join the lists: flying fish in the air and iguanas on the rocks are out of reach of sea predators
{const _hl=hnLists;hnLists=function(){_hl.apply(this,arguments);const L=HN.list,P=HN.preds;if(!L||!P)return;for(const k of NWK)L[k]=[];
  for(const u of units){if(u.dead||u.gone||!u.nw)continue;const k=u.kind;L[k].push(u);if((k==='dolphin'||k==='orca')&&!P.includes(u))P.push(u);}};}
{const _hf=hnFindPrey;hnFindPrey=function(p){const T=_hf.apply(this,arguments);if(!T||!p)return T;const k=hnPredKey(p);
  if(T.kind==='ffish'&&T.fly>0&&p.type==='sea')return null;if(T.kind==='miguana'&&!inSea(T.x,T.y))return null;
  if((k==='orca'||k==='dolphin')&&(!inSea(T.x,T.y)||T.lake))return null;return T;};}
function nwOtterMob(p,T){const fam=units.filter(v=>!v.dead&&v!==T&&v.species==='gotter'&&v.pack===T.pack&&dist(v,T)<240);if(fam.length<2)return false;
  hnDrop(p);if(T.hBy===p)T.hBy=null;p.full=R(15,25);p.hRest=R(1,2);if(p.species==='jaguar'){p.bolted=1.6;p.boltFrom={x:T.x,y:T.y};}
  for(const m of fam){m.mobT=1.4;m.mobAt={x:p.x,y:p.y};}G.otterMobs=(G.otterMobs||0)+1;if(dist(T,D)<1100)float(T.x,T.y-30,`EEE-EEE! The otter family mobs ${HN_NICE[hnPredKey(p)]||'the hunter'}! It backs off`,'#ffe6a8');return true;}
{const _hc=hnCatch;hnCatch=function(p,T){
  if(T&&T.kind==='ffish'&&T.fly>0&&p&&p.type==='sea'){hnDrop(p);p.full=R(4,8);if(dist(T,D)<900)float(T.x,T.y-26,'Whoosh! It glided away','#bfe6ff');return;}
  if(T&&T.kind==='dolphin'&&p&&p.kind==='shark'&&nwPod(T).length>=2){hnDrop(p);p.full=R(15,25);p.back=2.5;G.dolShark=(G.dolShark||0)+1;if(dist(T,D)<1100)float(T.x,T.y-30,'The dolphin pod rams the shark away!','#bff0ff');return;}
  if(T&&T.kind==='dolphin'&&p&&p.kind==='orca'&&rnd()<.4){hnDrop(p);p.full=R(6,12);T.hurtT=G.t;if(dist(T,D)<1000)float(T.x,T.y-26,'Zoom! The dolphin outswims the orca','#bff0ff');return;}
  if(T&&T.species==='gotter'&&p&&nwOtterMob(p,T))return;
  return _hc.apply(this,arguments);};}
// damage and eating
{const _hs=hurtSea;hurtSea=function(u,d,src){if(!u||!u.nw)return _hs.apply(this,arguments);if(u.dead)return;const k=u.kind;u.hurtT=G.t;
  if(k==='orca')for(const v of nwPod(u))v.angry=8;if(k==='dolphin')for(const v of nwPod(u))v.hurtT=G.t;
  u.hp-=d;if(u.hp<=0){u.dead=true;puff(u.x,u.y,6,'rgba(220,240,255,',60,5);}};}
TOUGH['sea:orca']={chk:u=>u.hp>u.maxHp*.4,hit:u=>{hurtSea(u,12,'bite');float(u.x,u.y-56,'Too big! Wear the orca down below 40% first','#ffd27a');}};
TOUGH['sea:dolphin']={chk:u=>{if(u._dg!==G.t){u._dg=G.t;u._dodge=rnd()<.35;}return u._dodge;},hit:u=>{u.hurtT=G.t;u.jump=1;G.dolDodge=(G.dolDodge||0)+1;float(u.x,u.y-40,'Zip! The dolphin dodged','#bff0ff');}};
TOUGH.gorilla={chk:u=>u.male&&u.hp>u.maxHp*.5,hit:u=>{u.hp-=10;u.roarFx=1.6;float(u.x,u.y-60,'Too strong! Wear the silverback down below half first','#ffd27a');}};
{const _es=eatSea;eatSea=function(u){const was=u&&u.dead,k=u&&u.kind;const r=_es.apply(this,arguments);
  if(u&&u.nw&&!was&&u.dead){const msg={dolphin:'Gulp! A slippery dolphin!',orca:'A WHALE-SIZED GULP! Orca!',ffish:'Snap! Caught a flying fish!',miguana:'Crunch! A salty marine iguana'}[k];if(msg)float(u.x,u.y-50,msg,'#ffd27a');}return r;};}
// ---------- land AI: otters mob, silverbacks scare off big cats ----------
{const _uw=updWild;updWild=function(u,dt){if(u&&u.species==='gotter'&&u.mobT>0){u.mobT-=dt;const Z=ZONES.jotter,ox=u.x,oy=u.y;moveTo(u,u.mobAt.x,u.mobAt.y,150,dt);if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}u.anim=(u.anim||0)+dt*12;return;}
  if(u&&u.species==='gorilla'&&u.beat>0)u.beat-=dt;
  if(u&&u.bolted>0){u.bolted-=dt;const f=u.boltFrom||D,a=Math.atan2(u.y-f.y,u.x-f.x),F=FAUNA[u.species]||{sp:80},Z=ZONES[u.zone],nx=u.x+Math.cos(a)*F.sp*1.5*dt,ny=u.y+Math.sin(a)*F.sp*1.5*dt;
    if(!Z||Z.ok(nx,ny)){u.x=nx;u.y=ny;}u.face=Math.cos(a)>0?1:-1;u.anim=(u.anim||0)+dt*10;if(u.bolted<=0)u.boltFrom=null;return;}
  return _uw(u,dt);};updWild._base=_uw._base;}
function nwTick(dt){NW.t+=dt;if(NW.t<.5)return;NW.t=0;
  for(const s of units){if(s.dead||!nwSilver(s))continue;for(const c of units){if(c.dead||c.type!=='animal'||(c.species!=='jaguar'&&c.species!=='tiger')||c.bolted>0)continue;
      if(d2(c.x,c.y,s.x,s.y)<220){if(c.hPrey)hnDrop(c);c.bolted=2;c.boltFrom={x:s.x,y:s.y};c.full=R(10,20);s.roarFx=1.6;s.beat=1.2;G.gorScare=(G.gorScare||0)+1;
        if(dist(s,D)<1200)float(s.x,s.y-60,`*THUMP THUMP* The silverback scares off the ${c.species}!`,'#f0f0ff');}}}
  // dolphin pods chase off sharks that come close
  const sh=units.filter(v=>!v.dead&&v.type==='sea'&&v.kind==='shark');if(sh.length)for(const u of units){if(u.dead||!u.nw||u.kind!=='dolphin')continue;
    for(const s of sh)if(!(s.back>0)&&d2(s.x,s.y,u.x,u.y)<200&&nwPod(u).length>=2){s.back=2.5;if(s.hPrey)hnDrop(s);G.dolShark=(G.dolShark||0)+1;ocSay(u,'The dolphin pod chases the shark off!','#bff0ff',5);}}
  NW.rT+=.5;if(NW.rT>=10){NW.rT=0;nwRespawn();}}
function nwRespawn(){for(const k of NWK){const n=units.filter(u=>!u.dead&&u.nw&&u.kind===k).length,[g,s]=NW_PLAN[k];
    if(n<=(g-1)*s){if(k==='miguana'){const c=NW.cols.find(c=>!units.some(u=>!u.dead&&u.kind==='miguana'&&NW.cols[u.col]===c)&&d2(c.x,c.y,D.x,D.y)>1100);if(c)nwGroup(k,true,c);else if(NW.cols.length<g+2)nwGroup(k,true);}else nwGroup(k,true);}}
  const jf=units.filter(u=>!u.dead&&u.jfish).length;if(jf<NW_JFISH)nwJFish(true);}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over)nwTick(dt);};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);NW.grp=0;nwInit();return r;};}
// ---------- the small wild dragons of Dragon Peaks: +5 permanent max STAMINA each (the flying/take-off meter, not fire) ----------
// Lasts on the same life across castle levels; resets on death / new game (same rule as the nest-egg fire bonus); D.stBonus + D.maxSt are in saves.
const WD_ST=5,ST_BASE=100;let ST_CARRY=null;
function stUp(what,x,y){D.stBonus=(D.stBonus||0)+WD_ST;D.maxSt=ST_BASE+D.stBonus;D.st=D.maxSt;G.stats.wdStUps=(G.stats.wdStUps||0)+1;
  float(D.x,D.y-heightOf()-130,`+${WD_ST} Stamina!`,'#ffe066');sparkle(D.x,D.y-heightOf(),18);
  const b=G.banner;if(b&&b.t>1.2&&typeof showToast==='function')showToast(`⚡ +${WD_ST} Stamina! (max ${D.maxSt})`);else G.banner={text:`+${WD_ST} Stamina!`,sub:`${what} gives you staying power: max stamina ${D.maxSt}, kept until you die`,t:4};
  if(typeof SFX!=='undefined'&&SFX.play)SFX.play('coin',D.x,D.y,1);}
{const _eu=eatUnit;eatUnit=function(u){const w=u&&u.species==='wdragon'&&!u.dead;const r=_eu.apply(this,arguments);
  if(w&&u.dead)stUp('The wild dragon',u.x,u.y);return r;};}
{const _nl=nextLevel;nextLevel=function(){ST_CARRY={b:D.stBonus||0};try{return _nl.apply(this,arguments);}finally{ST_CARRY=null;}};}
{const _ng=newGame;newGame=function(){const c=ST_CARRY;const r=_ng.apply(this,arguments);if(D){D.stBonus=c?c.b:0;D.maxSt=ST_BASE+D.stBonus;D.st=D.maxSt;}return r;};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);D.stBonus=Math.max(0,D.stBonus|0);D.maxSt=ST_BASE+D.stBonus;D.st=Math.min(D.st==null?D.maxSt:D.st,D.maxSt);return r;};}
// ---------- drawing ----------
function drawGorilla(u){const x=u.x,y=u.y,f=u.face||1,sb=u.male,a=u.anim||0,beat=(u.beat>0||u.roarFx>0),B='#2e2a2c',S=sb?'#b8b8c4':'#3c3638',sk='#5a4a48';
  ell(x,y+1,16,4,'rgba(0,0,0,.22)');
  line(x-f*8,y-6,x-f*9+Math.sin(a)*2,y+1,B,4);line(x-f*2,y-6,x-f*1-Math.sin(a)*2,y+1,B,4);
  ell(x-f*3,y-13,13,9,B);ell(x-f*5,y-15,8,5,S);
  if(beat){const t=Math.sin(G.t*22)*2;line(x+f*4,y-18,x+f*1,y-15+t,B,4.5);line(x+f*9,y-18,x+f*6,y-14-t,B,4.5);ell(x+f*5,y-16,5,4.5,sk);}
  else{line(x+f*6,y-14,x+f*10+Math.sin(a+1)*1.5,y+1,B,5);line(x+f*2,y-14,x+f*4-Math.sin(a+1)*1.5,y+1,B,4.5);}
  ell(x+f*9,y-22,6.5,6,B);ell(x+f*8,y-26,5,3,B);ell(x+f*11,y-20,4,3.2,sk);ell(x+f*10,y-23.5,1.1,1.1,'#fff');ell(x+f*10.3,y-23.5,.6,.6,'#111');ell(x+f*12.6,y-20,1,.7,'#222');
  if(beat){ctx.globalAlpha=.7;txt('!',x+f*16,y-30,11,'#fff','center');ctx.globalAlpha=1;}}
function drawOtter(u){const x=u.x,y=u.y,f=u.face||1,a=u.anim||0,wet=jriverD(x,y)<JRW-4,C='#6a4a30',T='#f0d8a8';
  if(wet){ell(x,y,14,4,'rgba(30,60,120,.35)');ell(x-f*2,y-2,11,3.6,C);ell(x+f*9,y-4,4.4,3.6,C);ell(x+f*11,y-3,2.4,1.8,T);ell(x+f*10,y-5.5,.9,.9,'#111');
    ctx.globalAlpha=.5;line(x-f*14,y,x-f*20,y+Math.sin(a*3),'#cfe8ff',1);ctx.globalAlpha=1;return;}
  ell(x,y+1,12,3,'rgba(0,0,0,.2)');for(const lx of [-6,-3,4,7])line(x+f*lx,y-4,x+f*lx+Math.sin(a+lx)*1.4,y,'#4a3220',2);
  poly([x-f*9,y-6,x-f*21,y-2+Math.sin(a)*1.5,x-f*20,y,x-f*8,y-3],C);ell(x,y-6,11,4.2,C);ell(x+f*6,y-5,5,2.4,T);
  ell(x+f*11,y-9,4.6,3.8,C);ell(x+f*13.5,y-8,2.4,1.8,T);ell(x+f*12,y-10.5,1,1,'#111');ell(x+f*9.5,y-12,1.2,1,'#4a3220');}
{const _df=drawFauna;drawFauna=function(u){if(u.species==='gorilla'){if(u.male){const L=TF_L.gorilla;tfRings(u);ctx.save();ctx.translate(u.x,u.y);ctx.scale(L.scale,L.scale);ctx.translate(-u.x,-u.y);try{drawGorilla(u);}finally{ctx.restore();}}else drawGorilla(u);return;}
  if(u.species==='gotter'){drawOtter(u);return;}return _df(u);};}
function drawNW(u){const x=u.x,y=u.y,f=u.face||1,k=u.kind,a=u.anim||0;
  if(k==='dolphin'){if(u.jump>0){const p=1-u.jump,z=Math.sin(Math.PI*p)*30,r=(p-.5)*1.6*f;ell(x,y,12,3,'rgba(30,60,120,.3)');ctx.save();ctx.translate(x,y-z);ctx.rotate(r);
      ell(0,0,16,5.2,'#8a9cb0');ell(0,2,12,2.6,'#dfe8f0');poly([-f*4,-4,-f*9,-11,-f*10,-4],'#7a8ca0');poly([-f*15,0,-f*22,-5,-f*21,5],'#7a8ca0');ell(f*17,1,4,1.8,'#8a9cb0');ell(f*10,-1.5,1,1,'#111');ctx.restore();return;}
    ell(x,y,15,4,'rgba(20,50,110,.35)');ell(x,y-1,13,3,'#8a9cb0');poly([x-f*2,y-2,x-f*7,y-11,x-f*8,y-2],'#7a8ca0');
    ctx.globalAlpha=.5;line(x-f*13,y,x-f*19,y+Math.sin(a*2),'#e8f6ff',1);ctx.globalAlpha=1;return;}
  if(k==='orca'){ell(x,y,30,7,'rgba(20,40,90,.35)');ell(x,y-2,27,6,'#1a1c22');ell(x+f*4,y,18,3,'#f4f6fa');ell(x+f*15,y-4,4,2,'#f4f6fa');
    poly([x-f*2,y-5,x-f*5,y-30+Math.sin(a)*1.5,x-f*11,y-5],'#1a1c22');ell(x-f*9,y-4,5,1.8,'#c8ccd6');poly([x-f*24,y-2,x-f*34,y-8,x-f*33,y+3],'#1a1c22');
    if(u.angry>0){ctx.globalAlpha=.8;txt('!',x,y-36,12,'#ff8a6a','center');ctx.globalAlpha=1;}
    if(u.hp<u.maxHp&&u.hp>0)ocBar(u,40,40);return;}
  if(k==='ffish'){if(u.fly>0){const p=1-u.fly/1.3,z=Math.sin(Math.PI*p)*34;ell(x,y+1,7,2,'rgba(20,50,110,.3)');ctx.save();ctx.translate(x,y-z);
      ell(0,0,8,2.8,'#5a8ad0');ell(0,1,6,1.4,'#e8f0ff');poly([-2,-1,-f*2,-13,f*5,-2],'rgba(190,225,255,.85)');poly([-2,1,-f*2,11,f*5,2],'rgba(190,225,255,.6)');poly([-f*7,0,-f*12,-4,-f*12,4],'#4a7ac0');ell(f*5,-.6,.9,.9,'#111');ctx.restore();return;}
    ctx.globalAlpha=.75;ell(x,y,7,2.4,'#5a8ad0');poly([-f*6+x,y,-f*10+x,y-3,-f*10+x,y+3],'#4a7ac0');ctx.globalAlpha=1;return;}
  if(k==='miguana'){const wet=inSea(x,y),C='#3a3a40',R2='#c8543a',G2='#5a8a4a';
    if(wet){ell(x,y,12,3,'rgba(20,50,110,.3)');ell(x+f*6,y-2,4,2.6,C);ell(x+f*7,y-3,.9,.9,'#fff');line(x+f*2,y-1,x-f*12,y+Math.sin(a*4)*2,C,2.4);return;}
    ell(x,y+1,12,2.6,'rgba(0,0,0,.2)');for(const lx of [-5,4])line(x+f*lx,y-3,x+f*lx+2,y,C,1.8);line(x-f*8,y-3,x-f*20,y-1+Math.sin(a)*1,C,2.6);
    ell(x,y-4,10,3.6,C);ell(x-f*2,y-4,6,2.2,R2);ell(x+f*3,y-3,3,1.6,G2);for(let i=0;i<5;i++)poly([x-f*(6-i*3),y-7,x-f*(5-i*3),y-11,x-f*(4-i*3),y-7],'#6a6a72');
    ell(x+f*11,y-6,4,3,C);ell(x+f*12,y-7,1,1,'#fff');ell(x+f*12.2,y-7,.5,.5,'#111');
    if(u.sneeze>0){ctx.globalAlpha=u.sneeze;ell(x+f*18,y-8,3,2,'#fff');ell(x+f*22,y-10,2,1.5,'#fff');ctx.globalAlpha=1;}return;}}
{const _ds=drawSeaUnit;drawSeaUnit=function(u){if(u&&u.nw)return drawNW(u);return _ds.apply(this,arguments);};}
// iguana basking rocks
{const _dl=drawSeaLow;drawSeaLow=function(x0,y0,x1,y1){_dl.apply(this,arguments);for(const c of NW.cols){if(c.x<x0-100||c.x>x1+100||c.y<y0-60||c.y>y1+60)continue;
  for(const r of c.rocks){ell(r.x,r.y+2,r.r+2,r.r*.5+1,'rgba(0,0,0,.18)');ell(r.x,r.y,r.r,r.r*.55,'#4a4a52');ell(r.x-r.r*.3,r.y-r.r*.15,r.r*.5,r.r*.25,'#6a6a74');}}};}
// ---------- Tally ----------
tallyAddSect('jungle','Animals · The jungle','🐒','#6ad06a',[['gorilla','Gorillas'],['silverback','Silverback gorillas'],['gotter','Giant river otters']]);
tallyAddSect('coast','Animals · Coast & sea','🦈','#6fb8e8',[['dolphin','Dolphins'],['orca','Orcas'],['ffish','Flying fish'],['miguana','Marine iguanas']]);
// ---------- save / load ----------
{const _ss=svSnapshot;svSnapshot=function(){const U=[],C=[],L=[];
  for(const c of NW.cols)C.push(Math.round(c.x),Math.round(c.y),Math.round(c.wx),Math.round(c.wy));
  for(const u of units){if(u.dead)continue;
    if(u.nw)U.push(NWK.indexOf(u.kind),Math.round(u.x),Math.round(u.y),Math.round(u.hp),Math.round(u.hx||0),Math.round(u.hy||0),u.grp||0,u.kind==='miguana'?u.col:0);
    else if(u.type==='animal'&&(u.species==='gorilla'||u.species==='gotter'||u.jfish)){const H=u.home||{x:u.x-300,y:u.y-200,w:600,h:400};
      L.push(u.jfish?2:u.species==='gorilla'?0:1,Math.round(u.x),Math.round(u.y),Math.round(u.hp),u.pack||0,u.male?1:0,Math.round(H.x),Math.round(H.y),Math.round(H.w),Math.round(H.h));}}
  G.nwU=U;G.nwC=C;G.nwL=L;G.nwG=NW.grp;return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(!Array.isArray(G.nwU))return r;
  for(const u of units)if(u.nw||u.jfish||(u.type==='animal'&&(u.species==='gorilla'||u.species==='gotter'))){u.dead=true;u.gone=true;}
  units=units.filter(u=>!u.dead);NW.cols=[];const C=G.nwC||[];for(let i=0;i+3<C.length;i+=4)nwColonyAt(C[i],C[i+1],C[i+2],C[i+3]);
  const U=G.nwU;for(let i=0;i+7<U.length;i+=8){const k=NWK[U[i]];if(!k)continue;const o={hx:U[i+4],hy:U[i+5],grp:U[i+6],hp:U[i+3]};if(k==='miguana'){o.col=U[i+7];o.st='bask';o.t=R(2,8);}nwMk(k,U[i+1],U[i+2],o);}
  const L=G.nwL||[];let mp=0;for(let i=0;i+9<L.length;i+=10){const t=L[i],x=L[i+1],y=L[i+2],home={x:L[i+6],y:L[i+7],w:L[i+8],h:L[i+9]};
    if(t===2){const f=nwJFish(false,{x,y});if(f)f.home=home;continue;}const sp=t?'gotter':'gorilla',F=FAUNA[sp],pk=L[i+4];mp=Math.max(mp,pk);
    const u=mkUnit('animal',x,y,{species:sp,wild:true,zone:F.zone,home,hp:F.hp,maxHp:F.hp,free:true,pack:pk,male:L[i+5]?1:0,t:R(0,3),jt:0,face:rnd()<.5?1:-1});
    if(u.male)tfMakeLeader(u);u.hp=Math.min(u.maxHp,L[i+3]||u.maxHp);units.push(u);}
  if(mp>packId)packId=mp;NW.grp=Math.max(G.nwG||0,NW.grp);return r;};}
