// ======================= THE SEA: swimming, sea life, boats, pirates, the giant squid and the Lonely Lighthouse =======================
let ships=[],cballs=[],loot=[],ripples=[];
const SEAHEAL={school:5,shark:20,whale:75,squid:150,sailor:10,pirate:12,islander:12,iseal:24};
const SEAPTS={school:10,shark:60,whale:200,squid:1500,sailor:25,pirate:40,islander:25,iseal:50};
const SHIPK={fishing:{hp:50,sp:55,crew:2,r:34},rowboat:{hp:30,sp:40,crew:1,r:24},merchant:{hp:120,sp:48,crew:3,r:52,gold:2},pirate:{hp:150,sp:68,crew:4,r:50,gold:5}};
const SEA_PLAN={school:10,lakeschool:3,shark:6,whale:3,squid:1,fishing:5,rowboat:2,merchant:3,pirate:3,islander:3,iseal:4};
const ISEAL_ROCKS=[[-1,-.1],[.95,.25],[.2,1.0],[-.6,.85]].map(([a,b])=>({x:LH.x+a*LH.r*.92,y:LH.y+b*LH.r*.72}));
const DOCK={x:LH.x-LH.r-40,y:LH.y+40};
const isLand=(x,y)=>!inWater(x,y);
function seaPoint(minD,maxD,opt){opt=opt||{};for(let t=0;t<120;t++){let x,y;
    if(opt.deep){x=R(8150,WX1-300);y=R(WY0+500,WY1-400);}else if(rnd()<.72){x=R(5600,opt.noDeep?7800:WX1-300);y=R(WY0+500,WY1-400);}else{x=R(-9600,7600);y=R(4500,WY1-300);}
    if(!inSea(x,y))continue;const dd=seaD(x,y);if(dd<minD||dd>maxD)continue;if(opt.noDeep&&inDeep(x,y))continue;if(opt.deep&&!inDeep(x,y))continue;
    if(opt.avoidIsle&&d2(x,y,LH.x,LH.y)<900&&rnd()>.08)continue;if(d2(x,y,LH.x,LH.y)<LH.r+90)continue;if(opt.far&&d2(x,y,D.x,D.y)<1300)continue;return{x,y};}return null;}
function lakePoint(r){const a=R(0,TAU),k=R(0,r||.75);return{x:LAKE.x+Math.cos(a)*LAKE.rx*k,y:LAKE.y+Math.sin(a)*LAKE.ry*k};}
function mkSea(kind,x,y,o){const u=mkUnit('sea',x,y,Object.assign({kind,hp:10,maxHp:10,ang:R(0,TAU),cd:0,t:R(0,3)},o||{}));units.push(u);return u;}
function spawnSea(kind,far){let p;
  if(kind==='lakeschool'){p=lakePoint(.7);return mkSea('school',p.x,p.y,{n:RI(5,8),hp:999,maxHp:999,lake:true});}
  if(kind==='school'){p=seaPoint(120,2600,{far});if(p)mkSea('school',p.x,p.y,{n:RI(6,9),hp:999,maxHp:999});return;}
  if(kind==='shark'){p=seaPoint(350,3000,{far});if(p)mkSea('shark',p.x,p.y,{hp:28,maxHp:28});return;}
  if(kind==='whale'){p=seaPoint(700,3200,{far,noDeep:rnd()<.5});if(p)mkSea('whale',p.x,p.y,{hp:140,maxHp:140,spoutT:R(2,6)});return;}
  if(kind==='squid'){p=seaPoint(0,9e9,{deep:true,far});if(p){mkSea('squid',p.x,p.y,{hp:700,maxHp:700,home:{x:p.x,y:p.y},state:'lurk',sub:1});float(D.x,D.y-120,'Something HUGE stirs in the Kraken Deep...','#c8a0ff');}return;}
  if(kind==='islander'){const job=units.some(u=>!u.dead&&u.kind==='islander'&&u.job==='keeper')?'fisher':'keeper';const a=R(0,TAU);
    mkSea('islander',job==='keeper'?LH.x+20:DOCK.x+R(-10,30),job==='keeper'?LH.y+40:DOCK.y+R(-20,20),{job,hp:8,maxHp:8,face:1,anim:0});return;}
  if(kind==='iseal'){const free=ISEAL_ROCKS.find(r=>!units.some(u=>!u.dead&&u.kind==='iseal'&&u.rock===r))||ISEAL_ROCKS[0];mkSea('iseal',free.x,free.y,{rock:free,state:'rock',hp:18,maxHp:18,face:rnd()<.5?1:-1});return;}
  const K=SHIPK[kind];if(!K)return;
  if(kind==='rowboat'){p=lakePoint(.6);}else p=seaPoint(kind==='fishing'?140:400,kind==='fishing'?1100:3000,{far,avoidIsle:kind==='pirate',noDeep:kind!=='pirate'});
  if(!p)return;ships.push({kind,x:p.x,y:p.y,ang:R(0,TAU),sp:K.sp,hp:K.hp,maxHp:K.hp,r:K.r,crew:K.crew,fire:0,fireT:0,state:'sail',wp:null,cd:R(1,3),cd2:R(2,4),t:0,id:rnd(),bob:R(0,TAU)});}
function countSea(kind){if(SHIPK[kind])return ships.filter(s=>s.kind===kind&&s.state!=='sink').length;
  if(kind==='lakeschool')return units.filter(u=>!u.dead&&u.kind==='school'&&u.lake).length;if(kind==='school')return units.filter(u=>!u.dead&&u.kind==='school'&&!u.lake).length;
  return units.filter(u=>!u.dead&&u.type==='sea'&&u.kind===kind).length;}
function initSea(){ships=[];cballs=[];loot=[];ripples=[];G.seaT=6;G.squidRespawn=0;G.isleT=0;for(const k in SEA_PLAN)for(let i=0;i<SEA_PLAN[k];i++)spawnSea(k,false);}
function updSea(dt){
  // respawns (rare for the squid)
  G.seaT-=dt;if(G.seaT<=0){G.seaT=6;for(const k in SEA_PLAN){if(k==='squid'||k==='islander'||k==='iseal')continue;if(countSea(k)<SEA_PLAN[k]){G.respT=G.respT||{};G.respT[k]=(G.respT[k]||0)+6;if(G.respT[k]>=(k==='pirate'?60:k==='whale'?50:24)){G.respT[k]=0;spawnSea(k,true);}}}
    if(countSea('squid')<1){G.squidRespawn+=6;if(G.squidRespawn>=240){G.squidRespawn=0;spawnSea('squid',true);}}
    const nearIsle=d2(D.x,D.y,LH.x,LH.y)<650;G.isleT+=6;
    if(G.isleT>=30&&!nearIsle){G.isleT=0;if(countSea('islander')<3)spawnSea('islander');if(countSea('iseal')<4)spawnSea('iseal');}}
  // swimming ripples
  if(D.swim&&(G.fc%(Math.hypot(D.vx,D.vy)>20?6:16))===0)ripples.push({x:D.x+R(-20,20),y:D.y+R(-10,10),t:0});
  for(const r of ripples)r.t+=dt;ripples=ripples.filter(r=>r.t<1.6);
  // the Lonely Lighthouse: a rest stop
  if(!G.over&&!G.won&&D.alt<.3&&onIsle(D.x,D.y)){D.st=Math.min(D.maxSt,D.st+30*dt);if(D.hp<D.maxHp){D.hp=Math.min(D.maxHp,D.hp+(G.easy?7:5)*dt);D.healFx=Math.max(D.healFx||0,.12);}
    if(!G.isleMsgT||G.t-G.isleMsgT>12){G.isleMsgT=G.t;float(D.x,D.y-95,'The Lonely Lighthouse: resting restores stamina and heals','#bff');}}
  for(const s of ships)updShip(s,dt);ships=ships.filter(s=>!(s.state==='sink'&&s.t>4));
  updCballs(dt);
  for(const l of loot){l.t+=dt;if(l.amt>0&&D.alt<.65&&d2(l.x,l.y,D.x,D.y)<95){const cap=G.easy?80:60;const take=Math.min(l.amt,cap-D.gold);if(take>0){l.amt-=take;D.gold+=take;float(l.x,l.y-30,`+${take} pirate gold!`,'#ffd84a');sparkle(l.x,l.y,8);}
      else if(!l.msg){l.msg=1;float(l.x,l.y-30,'Claws full! Stash gold at your lair','#ffd');}}}
  loot=loot.filter(l=>l.amt>0&&l.t<90);
}
function shipSlam(){{for(const s of ships)if(s.state!=='sink'&&d2(s.x,s.y,D.x,D.y)<s.r+60){hurtShip(s,80,'slam');float(s.x,s.y-60,'DIVE SLAM! The deck caves in!','#ffe28a');G.shake=Math.max(G.shake,12);}}}
// ---------- sea creatures, islanders, swimmers ----------
function seaOK(u,x,y){if(u.lake)return inLake(x,y)&&d2(x,y,LAKE.x,LAKE.y)<LAKE.rx*.95;if(u.kind==='squid')return inDeep(x,y);return inSea(x,y)&&d2(x,y,LH.x,LH.y)>LH.r+40;}
function swimTo(u,tx,ty,sp,dt){const a=Math.atan2(ty-u.y,tx-u.x);u.ang+=angDiff(a,u.ang)*Math.min(1,3*dt);const nx=u.x+Math.cos(u.ang)*sp*dt,ny=u.y+Math.sin(u.ang)*sp*dt;
  if(seaOK(u,nx,ny)){u.x=nx;u.y=ny;u.face=Math.cos(u.ang)>0?1:-1;u.anim+=dt*6;return d2(u.x,u.y,tx,ty)<20;}u.ang+=R(1.5,3);u.tgt=null;return false;}
function lowNear(u,r){return !G.over&&!G.won&&D.alt<.5&&d2(u.x,u.y,D.x,D.y)<r;}
function updSeaUnit(u,dt){u.cd-=dt;u.t-=dt;const dd=d2(u.x,u.y,D.x,D.y);
  if(u.kind==='school'){if(!u.tgt||u.t<=0){u.t=R(3,7);const p=u.lake?lakePoint(.8):{x:u.x+R(-300,300),y:u.y+R(-300,300)};u.tgt=p;}
    if(dd<200&&D.alt<.6){const a=Math.atan2(u.y-D.y,u.x-D.x);swimTo(u,u.x+Math.cos(a)*80,u.y+Math.sin(a)*80,70,dt);}else if(swimTo(u,u.tgt.x,u.tgt.y,28,dt))u.tgt=null;return;}
  if(u.kind==='shark'){const hunt=(D.swim||D.alt<.35)&&dd<300&&inWater(D.x,D.y)&&u.hp>9;
    if(hunt){if(!u.growl||G.t-u.growl>7){u.growl=G.t;float(u.x,u.y-24,'Chomp chomp!','#ffd0a0');}if(dd>50)swimTo(u,D.x,D.y,150,dt);else if(u.cd<=0){u.cd=1.8;hurtDragon(3,'shark');float(D.x+R(-20,20),D.y-90,'Shark nip! -3','#ffb0a0');u.back=.8;}}
    if(u.back>0){u.back-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);swimTo(u,u.x+Math.cos(a)*60,u.y+Math.sin(a)*60,120,dt);return;}
    if(!hunt){if(u.hp<=9&&dd<350){const a=Math.atan2(u.y-D.y,u.x-D.x);swimTo(u,u.x+Math.cos(a)*80,u.y+Math.sin(a)*80,140,dt);return;}
      if(!u.tgt||u.t<=0){u.t=R(3,6);u.tgt={x:u.x+R(-400,400),y:u.y+R(-400,400)};}if(swimTo(u,u.tgt.x,u.tgt.y,70,dt))u.tgt=null;}return;}
  if(u.kind==='whale'){u.spoutT-=dt;if(u.spoutT<=0){u.spoutT=R(5,9);u.spout=1.2;}u.spout=Math.max(0,(u.spout||0)-dt);
    if(u.slapT&&G.t>u.slapT)whaleSlap(u);
    if(lowNear(u,190)&&u.cd<=0&&(u.angry>0||rnd()<.4)){u.cd=4;u.slap=.6;setTimeout0(u);}
    u.angry=Math.max(0,(u.angry||0)-dt);
    if(!u.tgt||u.t<=0){u.t=R(6,12);u.tgt={x:u.x+R(-600,600),y:u.y+R(-400,400)};}if(swimTo(u,u.tgt.x,u.tgt.y,u.angry>0?45:28,dt))u.tgt=null;return;}
  if(u.kind==='squid'){updSquid(u,dt,dd);return;}
  if(u.kind==='sailor'||u.kind==='pirate'){u.life=(u.life||45)-dt;if(u.life<=0){u.dead=true;if(dd<900)float(u.x,u.y-20,u.kind==='pirate'?'Arr, rescued by a rowboat!':'Rescued by a passing boat!','#cfe8ff');return;}
    u.anim+=dt*5;if(dd<180){const a=Math.atan2(u.y-D.y,u.x-D.x);const nx=u.x+Math.cos(a)*30*dt,ny=u.y+Math.sin(a)*30*dt;if(inWater(nx,ny)){u.x=nx;u.y=ny;}
      if(!u.say||G.t-u.say>4){u.say=G.t;float(u.x,u.y-24,u.kind==='pirate'?'Arrr! Glub glub!':'Help! Glub!','#cfe8ff');}}else{u.x+=Math.sin(G.t+u.id*9)*6*dt;}return;}
  if(u.kind==='islander'){u.anim+=dt*4;
    if(dd<260&&D.alt<.6){const a=Math.atan2(u.y-D.y,u.x-D.x)+R(-.3,.3);const nx=u.x+Math.cos(a)*85*dt,ny=u.y+Math.sin(a)*85*dt;if(onIsle(nx,ny)||Math.abs(nx-DOCK.x)<60&&Math.abs(ny-DOCK.y)<14){u.x=nx;u.y=ny;u.face=Math.cos(a)>0?1:-1;}
      if(!u.say||G.t-u.say>5){u.say=G.t;float(u.x,u.y-26,u.job==='keeper'?'Not my lighthouse!':'Eek, a dragon!','#ffe');}return;}
    if(!u.tgt||u.t<=0){u.t=R(2,5);u.tgt=u.job==='keeper'?{x:LH.x+R(-90,90),y:LH.y+R(-40,90)}:{x:DOCK.x+R(-20,40),y:DOCK.y+R(-6,6)};}
    const a=Math.atan2(u.tgt.y-u.y,u.tgt.x-u.x);if(d2(u.x,u.y,u.tgt.x,u.tgt.y)>8){u.x+=Math.cos(a)*25*dt;u.y+=Math.sin(a)*25*dt;u.face=Math.cos(a)>0?1:-1;}else u.anim=0;return;}
  if(u.kind==='iseal'){
    if(u.state==='rock'){u.x=lerp(u.x,u.rock.x,Math.min(1,dt*2));u.y=lerp(u.y,u.rock.y,Math.min(1,dt*2));
      if(dd<230&&D.alt<.7){u.state='swim';u.t=R(10,16);const a=Math.atan2(u.y-LH.y,u.x-LH.x);u.ang=a;u.flop=.6;puff(u.x,u.y,8,'rgba(220,240,255,',70,5);float(u.x,u.y-24,'Arf! *SPLOOSH*','#cfe8ff');}}
    else{u.flop=Math.max(0,(u.flop||0)-dt);const a=Math.atan2(u.y-LH.y,u.x-LH.x);const nx=u.x+Math.cos(u.ang)*55*dt,ny=u.y+Math.sin(u.ang)*55*dt;
      if(d2(nx,ny,LH.x,LH.y)<LH.r+380){u.x=nx;u.y=ny;}else u.ang=a+Math.PI/2;u.anim+=dt*6;u.face=Math.cos(u.ang)>0?1:-1;
      if(u.t<=0&&dd>420){u.x=lerp(u.x,u.rock.x,Math.min(1,dt*1.5));u.y=lerp(u.y,u.rock.y,Math.min(1,dt*1.5));if(d2(u.x,u.y,u.rock.x,u.rock.y)<12)u.state='rock';}}}}
function setTimeout0(u){u.slapT=G.t+.6;}
function whaleSlap(u){if(u.slapDone===u.slapT)return;u.slapDone=u.slapT;puff(u.x-Math.cos(u.ang)*70,u.y-Math.sin(u.ang)*70,22,'rgba(220,240,255,',160,10);
  if(D.alt<.5&&d2(u.x,u.y,D.x,D.y)<230){hurtDragon(4,'whale');float(D.x,D.y-90,'Whale tail SLAP! -4','#ffb0a0');D.vx+=(D.x-u.x)*2;D.vy+=(D.y-u.y)*2;}}
function updSquid(u,dt,dd){u.anim+=dt*2;
  if(u.state==='dazed'){u.dz-=dt;u.sub=lerp(u.sub,0,dt*3);if(u.dz<=0){u.state='lurk';u.hp=Math.max(u.hp,u.maxHp*.4);float(u.x,u.y-80,'The squid recovers!','#c8a0ff');}return;}
  if(u.state==='grab'){u.gt-=dt;D.vx*=.2;D.vy*=.2;const a=Math.atan2(D.y-u.y,D.x-u.x);D.x=lerp(D.x,u.x+Math.cos(a)*150,dt*3);D.y=lerp(D.y,u.y+Math.sin(a)*150,dt*3);D.altT=Math.min(D.altT,.15);
    if(D.mode==='air'){D.alt=Math.min(D.alt,.3);}hurtDragon(3*dt,'squid');if(u.gt<=0||u.grabHit>=40){u.state='lurk';u.cd=3.5;D.vx=Math.cos(a)*220;D.vy=Math.sin(a)*220;float(D.x,D.y-100,u.grabHit>=40?'Burned free of the tentacle!':'Wriggled free!','#cfe8ff');}return;}
  if(u.state==='slam'){u.st-=dt;if(u.st<=0){u.state='lurk';u.cd=2.6;puff(u.sx,u.sy,26,'rgba(220,240,255,',190,12);G.shake=Math.max(G.shake,8);
      if(d2(D.x,D.y,u.sx,u.sy)<100&&D.alt<.8){hurtDragon(9,'squid');float(D.x,D.y-100,'TENTACLE SLAM! -9','#ff9a9a');}}return;}
  const engage=!G.over&&!G.won&&dd<560&&D.alt<.85;u.sub=lerp(u.sub,engage?.25:1,dt*1.5);
  if(engage){if(!u.roar||G.t-u.roar>9){u.roar=G.t;float(u.x,u.y-90,'BLOOORP! The GIANT SQUID!','#c8a0ff');}
    if(u.cd<=0){if(dd<260&&rnd()<.5){u.state='grab';u.gt=2.2;u.grabHit=0;float(D.x,D.y-110,'GRABBED! Breathe fire to break free!','#ff9a9a');}
      else{u.state='slam';u.st=1.2;u.sx=D.x+D.vx*.6;u.sy=D.y+D.vy*.6;}}
    if(dd>240)swimTo(u,D.x,D.y,45,dt);}
  else{if(!u.tgt||u.t<=0){u.t=R(6,10);u.tgt={x:u.home.x+R(-700,700),y:u.home.y+R(-700,700)};}if(swimTo(u,u.tgt.x,u.tgt.y,25,dt))u.tgt=null;}}
function hurtSea(u,d,src){if(u.dead)return;const k=u.kind;
  if(k==='school'){if(!u.dove||G.t-u.dove>3){u.dove=G.t;float(u.x,u.y-20,'The fish dive!','#bfe6ff');}return;}
  if(k==='squid'){if(u.state==='grab')u.grabHit+=d;if(u.state==='dazed'){u.hp=Math.max(1,u.hp-d);return;}u.hp-=d;u.sub=Math.max(0,u.sub-.1);
    if(u.hp<=u.maxHp*.18){u.state='dazed';u.dz=10;u.hp=Math.max(1,u.hp);float(u.x,u.y-100,'The squid is DAZED! Eat it now (E)!','#ffe28a');}return;}
  if(k==='whale'){u.angry=6;}
  u.hp-=d;if(u.hp<=0){if(k==='whale'||k==='shark'){u.hp=1;return;}u.dead=true;puff(u.x,u.y,6,'rgba(220,240,255,',60,5);}}
function seaEdible(u){return true;}
function eatSea(u){const k=u.kind;
  if(k==='whale'&&u.hp>u.maxHp*.5){D.eatCD=.8;u.angry=6;float(u.x,u.y-50,'Too big to swallow! Wear the whale down first','#ffd27a');return;}
  if(k==='squid'&&u.state!=='dazed'){D.eatCD=.8;float(u.x,u.y-80,'Too strong! Burn it until it is dazed','#ffd27a');return;}
  const heal=SEAHEAL[k]||10;D.hp=Math.min(D.maxHp,D.hp+heal);D.st=Math.min(D.maxSt,D.st+(k==='squid'?60:8));D.healFx=.6;feed(heal);D.eatCD=D.alt<.3?.45:.9;D.eatT=.3;
  G.stats.seaPts=(G.stats.seaPts||0)+(SEAPTS[k]||10);sparkle(D.x,D.y-heightOf(),k==='squid'?40:12);puff(u.x,u.y,8,'rgba(220,240,255,',70,5);
  float(D.x+R(-10,10),D.y-heightOf()-70,`+${heal} HP`,'#6dff7a');
  if(k==='school'){u.n--;float(u.x,u.y-20,'Fishy snack!','#ffd27a');if(u.n<=0)u.dead=true;G.stats.animals++;return;}
  u.dead=true;
  if(k==='squid'){G.stats.squid=(G.stats.squid||0)+1;G.squidRespawn=0;G.shake=14;float(u.x,u.y-110,'YOU ATE THE GIANT SQUID! +1500','#ffe28a');G.banner={text:'Calamari for a king!',sub:'The Kraken Deep is quiet... for now.',t:4};return;}
  if(k==='sailor'||k==='pirate'||k==='islander'){G.stats.eaten++;if(k!=='pirate')addAlarm(2);float(u.x,u.y-20,k==='pirate'?'Yo-ho-GULP!':'Gulp!','#ffd27a');return;}
  G.stats.animals++;float(u.x,u.y-20,k==='whale'?'A WHALE of a meal!':k==='shark'?'Shark fin soup!':'Chomp!','#ffd27a');}
// ---------- ships ----------
function shipOK(s,x,y){if(s.kind==='rowboat')return inLake(x,y)&&d2(x,y,LAKE.x,LAKE.y)<LAKE.rx*.9;if(!inSea(x,y)||d2(x,y,LH.x,LH.y)<LH.r+s.r+50)return false;
  if(s.kind!=='pirate'&&inDeep(x,y))return false;if(s.kind==='fishing'&&seaD(x,y)>1300)return false;return seaD(x,y)>60;}
function newWp(s){if(s.kind==='rowboat')return lakePoint(.7);return seaPoint(s.kind==='fishing'?140:350,s.kind==='fishing'?1100:3000,{avoidIsle:s.kind==='pirate',noDeep:s.kind!=='pirate'})||{x:s.x+R(-300,300),y:s.y+R(-300,300)};}
function updShip(s,dt){s.t+=dt;s.bob+=dt;
  if(s.state==='sink'){if(s.fire)s.fire=Math.max(0,s.fire-dt);return;}
  const far=Math.abs(s.x-D.x)>1900||Math.abs(s.y-D.y)>1500;
  if(s.fire){s.fireT+=dt;hurtShip(s,6*dt,'fire');if(s.kind==='pirate'&&s.fireT>6){s.fire=0;s.fireT=0;float(s.x,s.y-60,'Pirates douse the flames! Arr!','#cfe8ff');}
    if(!far&&rnd()<dt*14)flame(s.x+R(-s.r*.5,s.r*.5),s.y+R(-8,8),R(10,30));}
  const dd=d2(s.x,s.y,D.x,D.y);let tx,ty,sp=s.sp;
  if(s.kind==='pirate'&&dd<700&&!G.over&&!G.won){const a=Math.atan2(s.y-D.y,s.x-D.x)+.9;tx=D.x+Math.cos(a)*330;ty=D.y+Math.sin(a)*330;sp*=1.15;
    if(!s.yell||G.t-s.yell>8){s.yell=G.t;float(s.x,s.y-70,['Arr! A dragon! Fire the cannons!','Avast! Crossbows ready!',"Shiver me scales!"][RI(0,2)],'#ffe');}
    s.cd-=dt;s.cd2-=dt;if(s.cd<=0&&dd<520){s.cd=R(1.4,2);for(let i=0;i<2;i++){const ox=s.x+R(-20,20),oy=s.y+R(-10,10),b=Math.atan2(D.y-oy,D.x-ox)+R(-.07,.07);projs.push({kind:'arrow',x:ox,y:oy,z:18,vx:Math.cos(b)*440,vy:Math.sin(b)*440,tz:heightOf()+15,life:1.5,dmg:2,pirate:true});}}
    if(s.cd2<=0&&dd<650){s.cd2=R(3.5,5);const T=1.1,px=D.x+D.vx*T*.8,py=D.y+D.vy*T*.8;cballs.push({sx:s.x,sy:s.y,tx:px,ty:py,t:0,T,h1:heightOf()});puff(s.x+Math.cos(s.ang+Math.PI/2)*s.r*.5,s.y,10,'rgba(230,230,230,',80,8);float(s.x,s.y-50,'BOOM!','#fff');}}
  else if((s.kind==='merchant'||s.kind==='fishing')&&dd<420&&D.alt<.9){const a=Math.atan2(s.y-D.y,s.x-D.x);tx=s.x+Math.cos(a)*200;ty=s.y+Math.sin(a)*200;sp*=1.25;
    if(!s.yell||G.t-s.yell>9){s.yell=G.t;float(s.x,s.y-60,s.kind==='merchant'?'Full sail! Save the cargo!':'Row for your lives!','#ffe');}}
  else{if(!s.wp||d2(s.x,s.y,s.wp.x,s.wp.y)<60)s.wp=newWp(s);tx=s.wp.x;ty=s.wp.y;}
  const a=Math.atan2(ty-s.y,tx-s.x);s.ang+=angDiff(a,s.ang)*Math.min(1,1.2*dt);const nx=s.x+Math.cos(s.ang)*sp*dt,ny=s.y+Math.sin(s.ang)*sp*dt;
  if(shipOK(s,nx,ny)){s.x=nx;s.y=ny;}else{s.ang+=1.6*dt*8;s.wp=newWp(s);}
  if(s.kind!=='rowboat'&&!far&&(G.fc&7)===0)ripples.push({x:s.x-Math.cos(s.ang)*s.r,y:s.y-Math.sin(s.ang)*s.r,t:.3});}
function hurtShip(s,d,src){if(s.state==='sink')return;s.hp-=d;if(src!=='fire'&&s.kind!=='pirate'&&!s.alarmed){s.alarmed=1;}
  if(s.hp<=0){s.hp=0;s.state='sink';s.t=0;G.stats.ships=(G.stats.ships||0)+1;const pir=s.kind==='pirate';if(pir)G.stats.pirates=(G.stats.pirates||0)+1;
    G.stats.seaPts=(G.stats.seaPts||0)+(pir?150:s.kind==='merchant'?90:s.kind==='rowboat'?30:50);if(!pir)addAlarm(s.kind==='merchant'?5:3);
    float(s.x,s.y-70,pir?'The pirate ship sinks! Treasure ahoy!':s.kind==='merchant'?'Merchant ship sunk!':'Boat sunk!','#ffb050');puff(s.x,s.y,20,'rgba(220,240,255,',140,10);
    for(let i=0;i<s.crew;i++){const a=R(0,TAU);let x=s.x+Math.cos(a)*(s.r+12),y=s.y+Math.sin(a)*(s.r*.5+12);if(!inWater(x,y)){x=s.x;y=s.y;}mkSea(pir?'pirate':'sailor',x,y,{hp:6,maxHp:6,life:R(38,50),anim:0});}
    const g=SHIPK[s.kind].gold;if(g)loot.push({x:s.x+R(-15,15),y:s.y+R(-10,10),amt:pir?RI(g-1,g+1):g,t:0});}}
function fireShips(ox,oy,dt){for(const s of ships)if(s.state!=='sink'&&inFire(s.x,s.y,ox,oy)){if(!s.fire){s.fire=1;s.fireT=0;float(s.x,s.y-60,s.kind==='pirate'?'Fire on deck! Arr!':'The boat is ablaze!','#ffb050');}hurtShip(s,DR.fireDps*.5*dt,'fire');}}
function biteShip(){for(const s of ships)if(s.state!=='sink'&&d2(s.x,s.y,D.x+Math.cos(D.ang)*60,D.y+Math.sin(D.ang)*60)<s.r+70&&D.alt<.6){hurtShip(s,18,'bite');D.eatCD=.6;D.eatT=.3;float(s.x,s.y-50,'CRUNCH! Hull bitten!','#ffe28a');puff(s.x,s.y,8,'rgba(140,100,60,',80,6);return true;}return false;}
function updCballs(dt){for(const c of cballs){c.t+=dt;if(c.t>=c.T&&!c.done){c.done=true;const hit=d2(D.x,D.y,c.tx,c.ty)<70&&!G.over;
    if(hit){hurtDragon(7,'cannon');float(D.x,D.y-100,'Cannonball! -7','#ff9a9a');}puff(c.tx,c.ty,hit?14:10,inWater(c.tx,c.ty)?'rgba(220,240,255,':'rgba(140,125,100,',110,8);}}
  cballs=cballs.filter(c=>!c.done);}
// ---------- drawing ----------
function drawSeaLow(x0,y0,x1,y1){const v=o=>o.x>x0-200&&o.x<x1+200&&o.y>y0-200&&o.y<y1+200;
  ctx.lineWidth=2;for(const r of ripples)if(v(r)){const f=r.t/1.6;ctx.strokeStyle=`rgba(230,245,255,${.5*(1-f)})`;ctx.beginPath();ctx.ellipse(r.x,r.y,14+f*50,6+f*20,0,0,TAU);ctx.stroke();}
  for(const l of loot)if(v(l)){const b=Math.sin(G.t*2+l.x)*2;ell(l.x,l.y+4,16,5,'rgba(0,0,0,.2)');rect(l.x-12,l.y-10+b,24,14,'#8a5a24');rect(l.x-12,l.y-12+b,24,4,'#6a3a14');rect(l.x-2,l.y-8+b,4,5,'#ffd84a');
    if(Math.floor(G.t*3+l.x)%3===0)ell(l.x+R(-8,8),l.y-14+b,2,2,'#fff6b0');}}
function drawSeaTop(x0,y0,x1,y1){
  for(const c of cballs){const f=c.t/c.T,x=lerp(c.sx,c.tx,f),y=lerp(c.sy,c.ty,f),z=lerp(10,c.h1,f)+4*110*f*(1-f);ell(x,y,5,2,'rgba(0,0,0,.3)');ell(x,y-z,6,6,'#222');ell(x-2,y-z-2,2,2,'#777');
    ctx.strokeStyle='rgba(255,60,40,.5)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(c.tx,c.ty,55*(1-f)+15,22*(1-f)+6,0,0,TAU);ctx.stroke();}
  // lighthouse beam (sweeps forever)
  if(lhUp()&&x1>LH.x-1400&&x0<LH.x+1400&&y1>LH.y-1100&&y0<LH.y+1000){const bx=LH.x,by=LH.y-160,a=G.t*.5,f=lhFlick(),L=700*f,night=typeof nightAmt==='function'?nightAmt():0;
    ctx.save();ctx.globalCompositeOperation='lighter';const gr=ctx.createRadialGradient(bx,by,10,bx,by,L);gr.addColorStop(0,`rgba(255,170,70,${(.3+.3*night)*f})`);gr.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=gr;
    ctx.beginPath();ctx.arc(bx,by,L*.45,0,TAU);ctx.fill(); // pulsing firelight halo
    for(const o of[0,Math.PI]){ctx.beginPath();ctx.moveTo(bx,by);ctx.arc(bx,by,L,a+o-.25,a+o+.25);ctx.closePath();ctx.fill();} // a soft, wide sweep of firelight
    ell(bx,by,14+4*Math.sin(G.t*11),12+3*Math.sin(G.t*9),'rgba(255,220,140,.6)');ctx.restore();}}
function drawSeaUnit(u){const x=u.x,y=u.y,k=u.kind,f=u.face||1;
  if(k==='school'){for(let i=0;i<u.n;i++){const a=i*2.4+G.t*1.5,r=8+i*3.2,fx=x+Math.cos(a)*r,fy=y+Math.sin(a)*r*.5;ctx.save();ctx.translate(fx,fy);ctx.rotate(a+Math.PI/2);ell(0,0,5,2,'rgba(220,240,255,.75)');poly([-5,0,-8,-2,-8,2],'rgba(220,240,255,.75)');ctx.restore();}
    if(Math.floor(G.t*2+u.id*10)%4===0){ell(x,y,u.n*3,u.n*1.4,'rgba(255,255,255,.12)');}return;}
  if(k==='shark'){ctx.save();ctx.translate(x,y);ctx.rotate(u.ang);ell(0,0,34,10,'rgba(30,50,80,.45)');ctx.restore();
    const w=Math.sin(G.t*5+u.id*9)*2;poly([x-8,y,x+2+w,y-22,x+9,y],'#5a6a7a');poly([x+2+w,y-22,x+9,y,x+3,y],'#46525e');ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+1,14,4,0,0,Math.PI);ctx.stroke();
    if(u.hp<u.maxHp)rect(x-12,y-30,24*u.hp/u.maxHp,3,'#e44');return;}
  if(k==='whale'){ctx.save();ctx.translate(x,y);ctx.rotate(u.ang);ctx.scale(1.5,1.5);const sl=u.slapT&&G.t<u.slapT+.4&&G.t>u.slapT-.6?Math.sin((G.t-u.slapT+.6)*8)*.8:0;
    ell(0,2,95,30,'rgba(20,40,80,.35)');ell(0,0,85,26,'#4a6a94');ell(10,-6,60,12,'#6a8ab4');ell(40,6,30,10,'#d8e0e8');
    ctx.save();ctx.translate(-85,0);ctx.rotate(sl);poly([0,0,-30,-26,-22,0,-30,26],'#3a5a84');ctx.restore();ell(55,-8,3,3,'#112');ctx.restore();
    if(u.spout>0){const h=50*Math.sin(Math.PI*u.spout/1.2);for(let i=0;i<5;i++)ell(x+Math.cos(u.ang)*35+R(-6,6),y-h+R(-6,6),6,5,'rgba(230,245,255,.7)');}
    if(u.hp<u.maxHp)rect(x-30,y-44,60*u.hp/u.maxHp,4,'#e44');return;}
  if(k==='squid'){drawSquid(u);return;}
  if(k==='sailor'||k==='pirate'){const b=Math.sin(u.anim)*2;ctx.strokeStyle='rgba(230,245,255,.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,11+b,4,0,0,TAU);ctx.stroke();
    ell(x,y-6+b*.3,6,6,'#f0c8a0');if(k==='pirate'){poly([x-8,y-10,x+8,y-10,x,y-17],'#222');ell(x,y-11,2,1.5,'#fff');rect(x+1,y-8,4,2,'#222');}else ell(x,y-11,6,3,'#c33');
    line(x-6,y-2,x-12,y-12+Math.sin(u.anim*2)*4,'#f0c8a0',2);line(x+6,y-2,x+12,y-12-Math.sin(u.anim*2)*4,'#f0c8a0',2);return;}
  if(k==='islander'){const b=Math.sin(u.anim)*1.2;ell(x,y+1,7,3,'rgba(0,0,0,.2)');line(x-2,y,x-2,y-8,'#333',2);line(x+2,y,x+2,y-8,'#333',2);
    rect(x-5,y-18-b,10,11,u.job==='keeper'?'#2a3a6a':'#c8a040');ell(x,y-22-b,4.5,4.5,'#f0c8a0');
    if(u.job==='keeper'){rect(x-5,y-28-b,10,4,'#1a2a4a');ell(x+f*3,y-22-b,1,1,'#000');ell(x,y-19-b,3,1.5,'#ddd');}else{poly([x-7,y-25-b,x+7,y-25-b,x,y-31-b],'#e8d070');}return;}
  if(k==='iseal'){const sw=u.state!=='rock';ctx.save();ctx.translate(x,y-(sw?0:12));ctx.scale(1.5,1.5);ctx.translate(-x,-y);if(sw){ctx.strokeStyle='rgba(230,245,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y+2,18,6,0,0,TAU);ctx.stroke();}
    const fl=0,lf=u.flop>0?Math.abs(Math.sin(u.flop*20))*4:0;ctx.translate(0,-lf); // the whole seal flops as one pieceell(x,y+(sw?0:1),sw?14:16,sw?5:7,sw?'#5a5a66':'#6a6a78');ell(x+f*13,y-5-fl,7,6,'#7a7a88');ell(x+f*17,y-4-fl,2.4,1.6,'#222');ell(x+f*15,y-7-fl,1.2,1.2,'#111');
    if(!sw){poly([x-f*15,y,x-f*24,y-5,x-f*22,y+4],'#5a5a66');line(x+f*16,y-3-fl,x+f*22,y-5-fl,'#ddd',.8);ell(x-2,y-3,8,2.5,'rgba(255,255,255,.25)');}ctx.restore();return;}}
function drawSquid(u){const x=u.x,y=u.y,sub=u.sub,t=G.t,dz=u.state==='dazed',hi=GFX_HI,atk=u.state==='grab'||u.state==='slam';
  // heading: arms toward the dragon when it is engaging, otherwise trailing behind the swim direction
  if(u._px===undefined){u._px=x;u._py=y;u._ha=0;}const mvx=x-u._px,mvy=y-u._py;u._px=x;u._py=y;
  let want=u._ha;if(sub<.7||atk)want=Math.atan2(D.y-y,D.x-x);else if(mvx*mvx+mvy*mvy>.0004)want=Math.atan2(-mvy,-mvx);
  let da=want-u._ha;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;u._ha+=da*.06;const ha=u._ha;
  const jet=.5+.5*Math.sin(t*(atk?7:3)),pulse=1+.07*jet,al=1-sub*.72,sp=u.seed||(u.seed=RI(1,9999));
  const flash=dz?0:atk?.5+.5*Math.sin(t*18):Math.pow(Math.max(0,Math.sin(t*1.7+sp)),12);
  // shadow + expanding ripples
  ell(x,y,200,95,`rgba(40,10,30,${.22+.18*(1-sub)})`);
  ctx.lineWidth=2;for(let k=0;k<3;k++){const ph=(t*.45+k/3)%1;ctx.strokeStyle=`rgba(225,240,255,${.35*(1-ph)*(1-sub*.5)})`;ctx.beginPath();ctx.ellipse(x,y,130+ph*130,60+ph*60,0,0,TAU);ctx.stroke();}
  ctx.save();ctx.translate(x,y);ctx.scale(1.35,.84);ctx.rotate(ha);
  // ---- 8 arms + 2 long feeding clubs, fanning out ahead of the head ----
  const armCol=dz?'rgba(225,160,170,':'rgba(176,64,58,',sucker=`rgba(255,226,210,${.7*al})`;
  const arm=(a0,L,w0,club,i)=>{const pts=[];for(let j=0;j<=10;j++){const f=j/10,wig=Math.sin(t*2.4+i*1.3-f*4)*(.18+.5*f)*(atk?1.4:1),a=a0+wig*f;
      const px=18+Math.cos(a)*L*f,py=Math.sin(a)*L*f*.9;pts.push([px,py,f]);}
    ctx.lineCap='round';for(let j=1;j<pts.length;j++){const [ax,ay]=pts[j-1],[bx,by,f]=pts[j];const deep=f>.55?1-(f-.55)*1.3:1;
      ctx.strokeStyle=armCol+(al*Math.max(.25,deep)*(.85))+')';ctx.lineWidth=Math.max(1.5,(club?w0*(f>.82?1.5:.45+.5*(1-f)):w0*(1-f*.85)));ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.stroke();
      if(hi&&(club?f>.78:(j%2===0&&f<.85))){ctx.fillStyle=sucker;const n=club?2:1;for(let s=0;s<n;s++){ctx.beginPath();ctx.arc(bx+(s-.5)*3,by+(s-.5)*2,club?2.2:1.6*(1-f)+.8,0,TAU);ctx.fill();}}}};
  for(let i=0;i<8;i++){const a=(i-3.5)/3.5*.95,L=(105+18*Math.sin(i*2.1))*(1-sub*.35);arm(a,L,19,false,i);}
  if(!atk)for(const s of[-1,1])arm(s*.18,185*(1-sub*.3),7,true,s+9);
  // ---- torpedo mantle (pointing away from the arms), with fins at the tail ----
  const ML=165*(1-sub*.1),MW=36*pulse;
  const fin=Math.sin(t*3.2)*.35;for(const s of[-1,1]){ctx.fillStyle=dz?`rgba(230,170,175,${al})`:`rgba(150,46,44,${al})`;ctx.beginPath();ctx.moveTo(-ML*.72,0);
    ctx.quadraticCurveTo(-ML*.8,s*(MW*1.9+fin*16),-ML*1.04,s*(MW*.55+fin*6));ctx.lineTo(-ML*.98,0);ctx.closePath();ctx.fill();}
  const body=()=>{ctx.beginPath();ctx.moveTo(8,-MW*.8);ctx.bezierCurveTo(-ML*.35,-MW*1.12,-ML*.75,-MW*.6,-ML,0);ctx.bezierCurveTo(-ML*.75,MW*.6,-ML*.35,MW*1.12,8,MW*.8);ctx.closePath();};
  ctx.globalAlpha=al;body();const gr=ctx.createLinearGradient(0,-MW,0,MW);
  if(dz){gr.addColorStop(0,'#f2c8c8');gr.addColorStop(.5,'#e6a8b0');gr.addColorStop(1,'#c07a88');}else{gr.addColorStop(0,'#8c2420');gr.addColorStop(.45,'#c8503e');gr.addColorStop(1,'#7a1e1c');}
  ctx.fillStyle=gr;ctx.fill();
  if(hi){ctx.save();body();ctx.clip();let s=sp;const r=()=>((s=(s*9301+49297)%233280)/233280);  // mottled chromatophores
    for(let i=0;i<34;i++){const mx=-r()*ML*.95,my=(r()-.5)*MW*1.8,rr=2+r()*5;ctx.fillStyle=r()<.6?'rgba(90,16,18,.45)':'rgba(240,130,90,.35)';ctx.beginPath();ctx.ellipse(mx,my,rr*1.4,rr,0,0,TAU);ctx.fill();}
    ctx.strokeStyle='rgba(255,210,190,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-MW*.2);ctx.quadraticCurveTo(-ML*.5,-MW*.35,-ML*.95,0);ctx.stroke();ctx.restore();}
  if(flash>.02){body();ctx.fillStyle=`rgba(255,235,215,${.45*flash})`;ctx.fill();}
  // ---- head with huge eyes ----
  ctx.fillStyle=dz?'#e8b0b8':'#a8382e';ctx.beginPath();ctx.ellipse(10,0,24,MW*.85,0,0,TAU);ctx.fill();
  for(const s of[-1,1]){const ex=8,ey=s*MW*.62;ctx.fillStyle='#f6eccc';ctx.beginPath();ctx.ellipse(ex,ey,13,11,0,0,TAU);ctx.fill();
    ctx.fillStyle=dz?'#c9a':'#d9a21e';ctx.beginPath();ctx.ellipse(ex+1,ey,9.5,8.5,0,0,TAU);ctx.fill();
    if(dz){ctx.strokeStyle='#111';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<14;k++){const a=k*.9,rr=k*.6;ctx.lineTo(ex+Math.cos(a)*rr,ey+Math.sin(a)*rr);}ctx.stroke();}
    else{ctx.fillStyle='#120808';ctx.beginPath();ctx.ellipse(ex+2,ey,2.6+3*flash,7,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(ex-2,ey-s*3,2.4,0,TAU);ctx.fill();}}
  ctx.globalAlpha=1;
  // ---- waterline foam: the beast is half-submerged ----
  ctx.strokeStyle=`rgba(235,248,255,${.55*(1-sub*.4)})`;ctx.lineWidth=2.5;ctx.setLineDash([10,7]);ctx.lineDashOffset=-t*20;
  ctx.beginPath();ctx.ellipse(-ML*.42,0,ML*.62,MW*1.25,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
  // jet pulse wake behind the mantle tip
  for(let k=0;k<(hi?5:2);k++){const ph=(t*1.3+k/5)%1;ctx.fillStyle=`rgba(230,245,255,${.4*(1-ph)*jet})`;ctx.beginPath();ctx.arc(-ML-10-ph*60,Math.sin(k*2.3+t)*8*ph,3+ph*7,0,TAU);ctx.fill();}
  ctx.restore();
  const tent=(tx,ty,lift)=>{ctx.lineCap='round';ctx.strokeStyle='#9a3a32';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+tx)/2,(y+ty)/2-lift,tx,ty);ctx.stroke();
    ctx.strokeStyle='rgba(255,215,195,.7)';ctx.lineWidth=3;ctx.setLineDash([2,6]);ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+tx)/2,(y+ty)/2-lift,tx,ty);ctx.stroke();ctx.setLineDash([]);ell(tx,ty,13,9,'#b8463a');ell(tx,ty,6,4,'rgba(255,220,200,.7)');};
  if(u.state==='grab')tent(D.x,D.y-heightOf(),80);
  if(u.state==='slam'){const f=1-u.st/1.2;ctx.strokeStyle=`rgba(255,60,40,${.5+.4*Math.sin(t*20)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(u.sx,u.sy,100,45,0,0,TAU);ctx.stroke();tent(u.sx,u.sy-160*(1-f),200*(1-f));}
  if(dz)txt('DAZED!',x,y-90,14,'#ffe28a','center');
  if(u.hp<u.maxHp&&sub<.9){rect(x-60,y-110,120,6,'#300');rect(x-60,y-110,120*u.hp/u.maxHp,6,'#e64');}}
function drawSkullFlag(x,y,w){rect(x,y,w,w*.66,'#111');const cx=x+w/2,cy=y+w*.3;ctx.strokeStyle='#fff';ctx.lineWidth=w*.08;ctx.beginPath();ctx.moveTo(cx-w*.3,cy+w*.25);ctx.lineTo(cx+w*.3,cy-w*.05);ctx.moveTo(cx+w*.3,cy+w*.25);ctx.lineTo(cx-w*.3,cy-w*.05);ctx.stroke();
  ell(cx,cy,w*.17,w*.15,'#fff');ell(cx-w*.06,cy,w*.04,w*.04,'#111');ell(cx+w*.06,cy,w*.04,w*.04,'#111');}
function drawShip(s){const x=s.x,y=s.y,k=s.kind,sk=s.state==='sink'?s.t/4:0,b=Math.sin(s.bob*1.6)*1.5,r=s.r;
  ctx.save();ctx.globalAlpha=1-sk*.9;const yo=sk*24;
  ell(x,y+4,r*1.05,r*.38,'rgba(10,30,60,.3)');
  ctx.save();ctx.translate(x,y+yo+b);ctx.rotate(Math.cos(s.ang)>=0?sk*.5:-sk*.5);const f=Math.cos(s.ang)>=0?1:-1;ctx.scale(f,1);
  const hull=k==='pirate'?'#4a2a1a':k==='merchant'?'#8a5a2a':'#7a4a24';
  poly([-r,-8,r,-8,r*.75,8,-r*.8,8],hull);poly([-r,-8,r,-8,r*.95,-4,-r*.95,-4],k==='pirate'?'#6a3a22':'#a06a34');line(-r*.8,2,r*.75,2,'rgba(0,0,0,.3)',2);
  if(k==='pirate')for(let i=-1;i<=1;i++)ell(i*r*.45,0,3,3,'#111');
  if(k==='merchant'){rect(-r*.5,-16,14,8,'#b08850');rect(-r*.2,-15,12,7,'#c09860');}
  if(k==='rowboat'){line(-6,-2,-16,10+Math.sin(G.t*4)*3,'#6a4a2a',2);line(6,-2,16,10-Math.sin(G.t*4)*3,'#6a4a2a',2);ell(0,-10,4,4,'#f0c8a0');ell(0,-13,4,2,'#c33');}
  else{const mh=k==='fishing'?48:k==='merchant'?78:84;line(0,-6,0,-mh,'#4a2a10',3);
    const sc=k==='pirate'?'#2a2a2a':k==='merchant'?'#f4ecd8':'#f2eee0',sw=Math.sin(G.t*1.2+s.id*5)*3;
    poly([2,-mh+4,2,-14,r*.75+sw,-18,r*.6+sw,-mh+8],sc);if(k==='merchant'){poly([-2,-mh+10,-2,-18,-r*.6+sw,-20,-r*.5+sw,-mh+14],'#e8443a');}
    if(k==='pirate'){drawSkullFlag(-2-20,-mh-16,20);const cx=r*.38+sw,cy=-mh*.55;ell(cx,cy,9,8,'#fff');ell(cx-3,cy-1,2,2.4,'#111');ell(cx+3,cy-1,2,2.4,'#111');line(cx-10,cy+10,cx+10,cy+16,'#fff',3);line(cx+10,cy+10,cx-10,cy+16,'#fff',3);}
    else{poly([0,-mh,0,-mh-10,12,-mh-5],k==='merchant'?'#ffd84a':'#4a8ae0');}
    if(k==='fishing'){ctx.strokeStyle='rgba(230,230,200,.6)';ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-r,-4);ctx.lineTo(-r-14-i*4,8+i*2);ctx.stroke();}}}
  ctx.restore();
  if(s.state!=='sink'){const crewN=k==='rowboat'?0:Math.min(s.crew,3);for(let i=0;i<crewN;i++){const cx=x+(i-1)*r*.4,cy=y-12+b;ell(cx,cy-4,4,4,'#f0c8a0');if(k==='pirate'){poly([cx-6,cy-6,cx+6,cy-6,cx,cy-12],'#111');}else ell(cx,cy-8,4,2,'#2a5a9a');}
    if(s.hp<s.maxHp)rect(x-r*.6,y-r-40,r*1.2*s.hp/s.maxHp,4,k==='pirate'?'#e44':'#fa4');
    if(s.fire){for(let i=0;i<3;i++)ell(x+R(-r*.5,r*.5),y-14-R(0,14),R(5,9),R(7,12),`rgba(255,${RI(120,200)},40,.75)`);}}
  else{for(let i=0;i<3;i++)ell(x+R(-r,r),y+R(-6,6),R(2,5),R(2,5),'rgba(230,245,255,.7)');}
  ctx.restore();}
// a medieval beacon tower: rough fieldstone, a timber gallery on top and an open iron brazier with a roaring fire
function lhUp(){return kUp('lighthouse');}
function lhFlick(){return .78+.14*Math.sin(G.t*7.3)+.08*Math.sin(G.t*17.1+1);}
function drawLighthouse(o){const x=o.x,y=o.y,S=kS('lighthouse');ell(x,y+6,46,14,'rgba(0,0,0,.25)');ell(x,y,40,14,'#8a8578');
  if(S&&S.state!=='ok')return; // rubble / scaffolding is drawn by the structure itself
  const H=132,wb=24,wt=16;poly([x-wb,y,x-wt,y-H,x+wt,y-H,x+wb,y],'#9a948a');
  // rough stone courses
  for(let r=0;r<11;r++){const t=r/11,yy=y-H*t,w=wb-(wb-wt)*t,off=r%2?6:0;line(x-w,yy,x+w,yy,'rgba(60,55,50,.55)',1.2);
    for(let c=-3;c<=3;c++){const xx=x+c*9+off-3;if(Math.abs(xx-x)<w-2)line(xx,yy,xx,yy-H/11,'rgba(60,55,50,.4)',1);}
    if(r%3===1)ell(x-w*.5+(r*7)%10,yy-5,3,2,'rgba(70,110,60,.6)');}  // moss
  poly([x+5,y,x+4,y-H,x+wt,y-H,x+wb,y],'rgba(0,0,0,.15)');
  ctx.fillStyle='#2a1a10';ctx.beginPath();ctx.moveTo(x-7,y);ctx.lineTo(x-7,y-16);ctx.arc(x,y-16,7,Math.PI,0);ctx.lineTo(x+7,y);ctx.fill(); // arched door
  rect(x-3,y-70,6,11,'#1a120c');rect(x-3,y-104,6,10,'#1a120c'); // arrow slits
  // timber gallery with railings and a little shingle hood
  rect(x-26,y-H-4,52,7,'#6b4a26');for(let i=-24;i<=24;i+=8)line(x+i,y-H-4,x+i,y-H-16,'#5a3a1a',2);line(x-26,y-H-16,x+26,y-H-16,'#7a5530',3);
  line(x-24,y-H,x-30,y-H+14,'#5a3a1a',2.5);line(x+24,y-H,x+30,y-H+14,'#5a3a1a',2.5);
  // iron brazier bowl on posts + the fire
  line(x-10,y-H-4,x-7,y-H-20,'#2a2a2a',2.5);line(x+10,y-H-4,x+7,y-H-20,'#2a2a2a',2.5);poly([x-15,y-H-20,x+15,y-H-20,x+10,y-H-28,x-10,y-H-28],'#333');
  const f=lhFlick();for(let i=0;i<6;i++){const ph=G.t*9+i*1.7,fx=x+Math.sin(ph)*5+(i-2.5)*3,hh=(20+8*Math.sin(ph*1.3))*f;
    ctx.fillStyle=i%2?'rgba(255,120,20,.85)':'rgba(255,200,60,.9)';ctx.beginPath();ctx.moveTo(fx-6,y-H-26);ctx.quadraticCurveTo(fx-4,y-H-26-hh*.6,fx,y-H-26-hh);ctx.quadraticCurveTo(fx+4,y-H-26-hh*.6,fx+6,y-H-26);ctx.fill();}
  ell(x,y-H-30,7,5,'rgba(255,250,200,.9)');
  for(let k=0;k<3;k++){const ph=(G.t*.6+k/3)%1;ell(x+Math.sin(G.t+k)*6+ph*14,y-H-60-ph*60,6+ph*14,5+ph*10,`rgba(80,75,70,${.35*(1-ph)})`);} // smoke
  if(Math.random()<.3)ell(x+R(-8,8),y-H-50-R(0,30),1.3,1.3,'#ffd080');} // sparks
function drawDock(o){const x=o.x,y=o.y;{const S=kS('dock');if(S&&S.state!=='ok'){for(let i=0;i<4;i++){const b=Math.sin(G.t*2+i)*2;rect(x-40+i*22,y-4+b+(i%2)*8,14,6,'#5a3a1a');}for(const px of[-50,40])rect(x+px,y,4,8,'#2a1a0c');return;}}for(let i=0;i<6;i++)rect(x-50+i*16,y-8,14,16,i%2?'#8a6a3a':'#7a5a30');for(const px of[-50,40])for(const py of[-10,8])rect(x+px,y+py,4,8,'#4a3018');
  rect(x-60,y-30,6,22,'#5a3a1a');line(x-57,y-30,x-30,y-46,'#5a3a1a',2);line(x-30,y-46,x-28,y-10,'rgba(230,230,230,.7)',1);}
function drawSeaRock(o){ell(o.x,o.y+4,o.r*1.1,o.r*.4,'rgba(0,0,0,.2)');ell(o.x,o.y,o.r,o.r*.6,'#7d786c');ell(o.x-o.r*.25,o.y-o.r*.2,o.r*.55,o.r*.28,'#9a9488');}
function addIsleDecor(){DECOR.push({k:'lighthouse',x:LH.x,y:LH.y},{k:'dock',x:DOCK.x,y:DOCK.y});for(const r of ISEAL_ROCKS)DECOR.push({k:'isrock',x:r.x,y:r.y-6,r:30});
  for(let i=0;i<14;i++){const a=R(0,TAU),k=R(.2,.75);const x=LH.x+Math.cos(a)*LH.r*k,y=LH.y+Math.sin(a)*LH.r*.7*k;if(d2(x,y,LH.x,LH.y)>70)DECOR.push({k:'grass',x,y});}}
function drawSeaMap(X,Y,big,q){for(const s of ships){if(s.state==='sink'||!seen(s.x,s.y))continue;ctx.fillStyle=s.kind==='pirate'?'#111':'#fff';ctx.fillRect(X(s.x)-q*.7,Y(s.y)-q*.7,q*1.4,q*1.4);if(s.kind==='pirate'&&big){ctx.fillStyle='#fff';ctx.fillRect(X(s.x)-1,Y(s.y)-1,2,2);}}
  for(const u of units)if(!u.dead&&u.kind==='squid'&&seen(u.x,u.y)){ell(X(u.x),Y(u.y),big?6:4,big?6:4,'#b4f');if(big)txt('SQUID',X(u.x),Y(u.y)-8,10,'#e0b0ff','center');}
  if(seen(LH.x,LH.y)){const lx=X(LH.x),ly=Y(LH.y);ell(lx,ly,big?6:4,big?6:4,'#fff');ell(lx,ly,big?3:2,big?3:2,'#e33');ctx.strokeStyle='rgba(255,240,170,.8)';ctx.lineWidth=1.5;const a=G.t*.9;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+Math.cos(a)*(big?18:10),ly+Math.sin(a)*(big?18:10));ctx.stroke();
    if(big)txt('Lonely Lighthouse',lx,ly+16,10,'#fff3c0','center',false);}}
