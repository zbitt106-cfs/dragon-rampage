// ======================= dragon tuning (full-grown adult from the start) =======================
const DR={groundSpeed:135,airSpeed:255,fireRange:230,fireHalf:0.45,fireDps:60,stompR:100,stompDmg:60,stompCD:1.1,
  eatRGround:62,eatRAir:30,flyDrain:5,breathAirDrain:5,groundRegen:16,takeoffMin:15,hitAltSword:0.35,catAltSafe:0.6};
const ALT_H=70; // pixel height of full flight
function heightOf(){return D.alt*ALT_H;}

function addAlarm(v,x,y){if(!(v>0)){G.sinceDmg=0;return;}const k=kingdomMul(x===undefined?D.x:x,y===undefined?D.y:y);G.alarm=clamp(G.alarm+v*ALARM_GAIN*G.alarmMul*k,0,100);G.sinceDmg=0;}
function float(x,y,txt,col){texts.push({x,y,txt,col:col||'#fff',t:1.4});}
function puff(x,y,n,col,spd,size,up){for(let i=0;i<n;i++){const a=R(0,TAU),s=R(.2,1)*(spd||60);
  parts.push({x,y,z:R(0,6),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:R(10,40)*(up||1),life:R(.5,1.1),max:1,col:col||'rgba(170,150,120,',size:size||R(6,12),kind:'dust'});}}
function smoke(x,y){parts.push({x:x+R(-8,8),y:y+R(-4,4),z:R(10,30),vx:R(-8,8),vy:R(-4,4),vz:R(25,45),life:R(1,2),max:2,col:'rgba(60,55,50,',size:R(8,16),kind:'smoke'});}
function flame(x,y,z){parts.push({x:x+R(-6,6),y:y+R(-4,4),z:z||R(4,16),vx:R(-10,10),vy:R(-6,6),vz:R(30,70),life:R(.3,.6),max:.6,size:R(5,10),kind:'flame'});}

// ---------- input ----------
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!keys[k])pressed[k]=true;keys[k]=true;
  if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('blur',()=>{keys={};});
const P=k=>pressed[k];

// ---------- dragon ----------
function updDragon(dt){
  let ix=0,iy=0;if(keys['a']||keys['arrowleft'])ix--;if(keys['d']||keys['arrowright'])ix++;if(keys['w']||keys['arrowup'])iy--;if(keys['s']||keys['arrowdown'])iy++;
  let il=Math.hypot(ix,iy)||1;ix/=il;iy/=il;
  if(!ix&&!iy&&(GPAD.mx||GPAD.my)){ix=GPAD.mx;iy=GPAD.my;}
  if(!ix&&!iy&&(TOUCH.mx||TOUCH.my)){ix=TOUCH.mx;iy=TOUCH.my;} // touch joystick // analog stick / d-pad (magnitude = speed)
  // take off / land
  if(P('f')){ if(D.mode==='ground'){ if(D.st>=DR.takeoffMin){D.mode='air';D.altT=1;puff(D.x,D.y,18,'rgba(190,170,130,',120,14);float(D.x,D.y-60,'Take off!','#cfe8ff');}
      else float(D.x,D.y-60,'Too tired to fly!','#ffb0a0'); }
    else {D.mode='ground';D.altT=0;D.landDust=true;D.diveFrom=D.alt;G.diveT=G.t;} }
  if(D.mode==='air'){D.st-=(DR.flyDrain+(D.breath?DR.breathAirDrain:0))*(G.easy?.7:1)*dt;if(D.st<=0){D.st=0;D.mode='ground';D.altT=0;D.landDust=true;float(D.x,D.y-60,'Exhausted! Landing…','#ffb0a0');}}
  else D.st=Math.min(D.maxSt,D.st+DR.groundRegen*dt);
  const prevAlt=D.alt;D.alt+=clamp(D.altT-D.alt,(D.diving?-4.2:-1.5)*dt,1.2*dt);updCrash(dt);
  if(D.landDust&&D.alt<=0.001&&prevAlt>0){D.landDust=false;puff(D.x,D.y,34,'rgba(180,160,120,',170,16);G.shake=Math.max(G.shake,8);
    for(const u of units)if(!u.dead&&dist(u,D)<90&&u.type!=='animal'&&u.type!=='sea'){u.vx+=(u.x-D.x)*2;u.vy+=(u.y-D.y)*2;}}
  const wasSwim=D.swim;D.swim=D.mode==='ground'&&D.alt<.25&&inWater(D.x,D.y)&&!onBridge(D.x,D.y);D.overWater=D.alt>=.25&&inWater(D.x,D.y);
  if(D.swim&&!wasSwim){puff(D.x,D.y,24,'rgba(220,240,255,',150,12);if(!G.swimTip){G.swimTip=1;float(D.x,D.y-90,'Splash! Swimming: slower. Stomp becomes a CLAW SCRATCH (Q); bite & fire still work','#bfe6ff');}}
  if(D.swim&&D.mode==='ground')D.st=Math.max(0,D.st-DR.groundRegen*.5*dt); // half stamina regen in the water
  const sp=lerp(DR.groundSpeed,DR.airSpeed,D.alt)*(D.eatT>0?0.4:1)*(D.stompT>0?0.3:1)*(D.swim?0.55:1);
  const acc=D.alt>0.5?4:8;D.vx=lerp(D.vx,ix*sp,Math.min(1,acc*dt));D.vy=lerp(D.vy,iy*sp,Math.min(1,acc*dt));
  const ox_=D.x,oy_=D.y;D.x=clamp(D.x+D.vx*dt,WX0+60,WX1-60);D.y=clamp(D.y+D.vy*dt,WY0+60,WY1-60);
  // castle walls block a walking dragon (fly over them, or smash the gate)
  if(D.alt<0.5){const inC=(x,y)=>x>CWALL.x0&&x<CWALL.x1&&y>CWALL.y0&&y<CWALL.y1;
    if(inC(ox_,oy_)!==inC(D.x,D.y)){const gate=structures.find(s=>s.kind==='gate');const thruGate=gate&&gate.state==='ruin'&&Math.abs(D.x-GATE.x)<50&&D.y>CWALL.y1-60;
      if(!thruGate){D.x=ox_;D.y=oy_;D.vx*=-.2;D.vy*=-.2;if(!D.wallMsg||G.t-D.wallMsg>3){D.wallMsg=G.t;float(D.x,D.y-90,'Castle walls! Fly over (F) or smash the gate','#ffd');}}}}
  if(ix||iy){const ta=Math.atan2(iy,ix);D.ang+=angDiff(ta,D.ang)*Math.min(1,10*dt);D.walkT+=dt*(D.alt<.3?7:0);}
  D.flapT+=dt*(D.alt>0.1?(D.alt<0.95?14:9):0);
  D.hurt=Math.max(0,D.hurt-dt);D.stompCD-=dt;D.eatCD-=dt;D.stompT=Math.max(0,D.stompT-dt);D.eatT=Math.max(0,D.eatT-dt);
  // fire breath
  D.breath=!(D.lava>0)&&!!(keys[' ']||GPAD.fire)&&!(D.mode==='air'&&D.st<=0.5)&&!D.fireOut; // fire meter (partFM): empty = no fire until it recovers
  if(D.lava>0)lavaFire(dt);else D.lavaHeld=!!(keys[' ']||GPAD.fire); // lava shots replace fire while they last (partV)
  if(D.breath){const ca=Math.cos(D.ang),sa=Math.sin(D.ang),ox=D.x+ca*105,oy=D.y+sa*105,h=heightOf()+18;
    for(let i=0;i<7;i++){const a=D.ang+R(-DR.fireHalf,DR.fireHalf)*.8,s=R(260,380);
      parts.push({x:ox,y:oy,z:h,vx:Math.cos(a)*s+D.vx*.5,vy:Math.sin(a)*s+D.vy*.5,vz:-h*1.6-R(0,30),life:R(.4,.6),max:.6,size:R(8,16),kind:'breath'});}
    applyFire(ox,oy,dt);}
  // stomp (ground only)
  if((P('q')||P('shift'))&&D.swim){clawScratch();} // in the water the stomp becomes a CLAW SCRATCH (partCS)
  else if((P('q')||P('shift'))){ if(D.diving){}else if(D.alt>0.2||D.mode==='air')startCrash();
    else if(D.stompCD<=0){D.stompCD=DR.stompCD;D.stompT=0.35;doStomp();} }
  // eat
  if(P('e')&&D.eatCD<=0){if(!lavaDrink())tryEat();}
}
function inFire(x,y,ox,oy){const dx=x-ox,dy=y-oy,dd=Math.hypot(dx,dy);if(dd>DR.fireRange+10)return false;if(dd<50)return true;
  return Math.abs(angDiff(Math.atan2(dy,dx),D.ang))<DR.fireHalf;}
function applyFire(ox,oy,dt){fireFlora(ox,oy);
  for(const t of trees)if(t.state==='ok'&&!t.fire&&inFire(t.x,t.y,ox,oy)){t.fire=1;addAlarm(.3);}
  for(const s of structures)if(s.state==='ok'&&isStone(s)&&inFire(s.x,s.y,ox,oy))stoneFire(s,dt);else if(s.state!=='ruin'&&!stoneish(s)&&inFire(s.x,s.y,ox,oy)){if(!s.fire){s.fire=1;addAlarm(.8);}hurtStruct(s,DR.fireDps*.7*dt);}
  for(const t of trees)if(t.fire&&t.state==='ok'&&inFire(t.x,t.y,ox,oy))t.hp-=DR.fireDps*.4*dt;
  for(const c of cells)if(!c.burnt&&!c.fire&&c.growth>.15&&inFire(c.x,c.y,ox,oy)){c.fire=1;}
  for(const c of carts)if(!c.wrecked&&!c.fire&&inFire(c.x,c.y,ox,oy))c.fire=1;
  for(const g of siege)if(!g.dead&&inFire(g.x,g.y,ox,oy)){if(!g.fire){g.fire=1;float(g.x,g.y-40,'Siege engine ablaze!','#ffb050');}hurtSiege(g,DR.fireDps*.5*dt);}
  for(const u of units)if(!u.dead&&!u.inside&&inFire(u.x,u.y,ox,oy)){u.burn=u.type==='sea'?0:1.4;hurtUnit(u,DR.fireDps*dt,'fire');}
  fireShips(ox,oy,dt);
}
function doStomp(){G.shake=Math.max(G.shake,14);rumble(.9,.6,260);puff(D.x,D.y,40,'rgba(160,140,100,',260,18);
  const r=DR.stompR;let hit=false;HEAVY=true;
  for(const t of trees)if(t.state==='ok'&&dist(t,D)<r*.8){t.state='stump';t.fire=0;t.regrow=90;G.stats.trees++;addAlarm(1.2);hit=true;puff(t.x,t.y,8,'rgba(60,110,40,',90,8);}
  for(const s of structures)if(s.state!=='ruin'&&dist(s,D)<r+18){if(isWood(s))splinters(s.x,s.y,4);hurtStruct(s,DR.stompDmg*1.6*(isWood(s)?1.25:1));hit=true;
    if(s.kind==='stonepile'){const l=Math.min(G.yardStone||0,4);G.yardStone-=l;if(l)float(s.x,s.y-40,`-${l} stone`,'#ddd');}
    if(s.kind==='logpile'){const l=Math.min(G.yardWood||0,3);G.yardWood-=l;if(l)float(s.x,s.y-40,`-${l} wood`,'#e8c090');}}
  HEAVY=false;
  for(const c of cells)if(!c.burnt&&dist(c,D)<r*.8){c.burnt=true;c.flat=true;c.growth=0;G.stats.crops++;addAlarm(.15);}
  for(const c of carts)if(!c.wrecked&&dist(c,D)<r)wreckCart(c);
  for(const g of siege)if(!g.dead&&dist(g,D)<r+20){hurtSiege(g,DR.stompDmg*1.3);hit=true;}
  for(const u of units)if(!u.dead&&!u.inside&&dist(u,D)<r){hurtUnit(u,DR.stompDmg,'stomp');const a=Math.atan2(u.y-D.y,u.x-D.x);u.x+=Math.cos(a)*30;u.y+=Math.sin(a)*30;}
  float(D.x,D.y-90,'STOMP!','#ffe28a');}
// MULTI-BITE: one chomp swallows EVERY edible creature or person in a wide arc in front of the jaws (never the princess)
const BITE_MAX=5,BITE_ARC=1.05;
function biteTargets(){const gr=D.alt<0.3,r=(gr?DR.eatRGround:DR.eatRAir)*1.3,mx=D.x+Math.cos(D.ang)*80,my=D.y+Math.sin(D.ang)*80,out=[];
  for(const u of units){if(u.dead||u.inside||u.princess)continue;if(!['villager','animal','crew','archer','knight','hunter','sea'].includes(u.type))continue;if(u.kind==='squid'&&D.alt>.6)continue;if(u.species==='fish'&&!(u.jt>0))continue;
    const dm=d2(u.x,u.y,mx,my),dd=dist(u,D),fa=Math.abs(angDiff(Math.atan2(u.y-D.y,u.x-D.x),D.ang));
    // inside the jaw circle, or in the frontal arc close to the head
    if(dm<r||(dd<r+(gr?90:30)&&fa<BITE_ARC&&dd>20)||dd+12<r*.8)out.push({u,d:Math.min(dm,dd+12)});}
  out.sort((a,b)=>a.d-b.d);return out.map(o=>o.u);}
function tryEat(){if(tryGrab())return;
  let T=biteTargets();
  if(!T.length){if(biteRoof())return;if(tryEatBird())return;if(biteShip())return;if(biteWell())return;}
  if(!T.length){if(D.alt>=0.3)float(D.x,D.y-90,'Swoop closer to snatch!','#ddd');D.eatCD=.25;return;}
  // tough ones fight back: a healthy bear wriggles free, a healthy whale or an awake squid can't be swallowed (only if it's the closest target)
  const tough=u=>(u.species==='bear'&&u.hp>u.maxHp*.5)||(u.species==='elephant'&&u.hp>u.maxHp*.5)||(u.champ&&u.hp>u.maxHp*.5)||(u.species==='sandworm'&&!u.stuck&&u.hp>u.maxHp*.35)||(u.type==='sea'&&((u.kind==='whale'&&u.hp>u.maxHp*.5)||(u.kind==='squid'&&u.state!=='dazed')));
  const first=T[0];
  if(tough(first)&&T.filter(u=>!tough(u)).length===0){
    if(first.species==='sandworm'){D.eatCD=.8;D.hp-=4*G.dmgMul;D.hurt=.3;float(first.x,first.y-60,'Too big to swallow! Wear the worm down first','#ffd27a');return;}
    if(first.species==='elephant'){D.eatCD=.8;D.hp-=5*G.dmgMul;D.hurt=.3;float(first.x,first.y-60,'PAWOO! The elephant shakes you off! Wear it down first','#ffd27a');return;}
    if(first.species==='bear'){D.eatCD=.8;D.hp-=5*G.dmgMul;D.hurt=.3;first.angry=3;float(first.x,first.y-40,'The bear wriggles free! Wear it down first','#ffd27a');return;}
    if(first.champ){D.eatCD=.8;D.hp-=6*G.dmgMul;D.hurt=.3;float(first.x,first.y-60,`${first.raid?first.raid.short:'The champion'} raises a shield! Wear them down first`,'#ffd27a');return;}
    D.eatT=.3;eatSea(first);return;}
  T=T.filter(u=>!tough(u)).slice(0,BITE_MAX);
  const hp0=D.hp,hu0=D.hunger;D.eatT=.3;
  for(const u of T){if(u.type==='sea')eatSea(u);else eatUnit(u);}
  D.eatCD=D.alt<.3?.45:.9;D.eatT=.3;const n=T.length;
  if(typeof SFX!=='undefined')SFX.chomp(n);
  if(n>1){const bonus=n*(n-1)*25;G.stats.comboPts=(G.stats.comboPts||0)+bonus;G.stats.bestCombo=Math.max(G.stats.bestCombo||0,n);G.lastCombo={n,t:G.t,heal:Math.round(D.hp-hp0),hunger:Math.round(D.hunger-hu0)};
    float(D.x,D.y-heightOf()-110,`x${n} CHOMP!  +${bonus} pts`,n>=4?'#ff7a3a':'#ffb84a');G.shake=Math.max(G.shake,3+n);sparkle(D.x,D.y-heightOf(),8*n);}}
function stoneish(s){return isStone(s)||s.kind==='bridge'&&((s.state!=='building'&&s.mat==='stone')||(s.state==='building'&&s.nextMat==='stone'));}
const HEAL={chicken:5,rabbit:6,sheep:14,pig:16,deer:20,cow:26,villager:10,crew:10,archer:12,knight:18,hunter:18,horse:24,boar:16,fox:8,wolf:12,bear:40,fish:4,beaver:7,mgoat:15,cougar:32,goat:12,crab:3,seal:22,cavalry:40};
// ---- HUNGER (normal mode only): ~80s full->empty on the ground, ~60s flying/breathing fire; starving drains HP ----
const HUNGER={base:1.25,airMul:1.25,breath:.35,maxRate:1.65,low:25,starveHp:2.5,feedMul:2.2,feedMin:6,wetMul:1.4,wetMax:2.3};
function feed(heal){if(G.easy)return;const f=Math.max(HUNGER.feedMin,heal*HUNGER.feedMul),was=D.hunger;D.hunger=Math.min(D.maxHunger,D.hunger+f);
  if(was<=0)float(D.x,D.y-heightOf()-95,'Phew, fed!','#ffd27a');if(D.hunger>HUNGER.low)D.hungryWarn=false;}
function updHunger(dt){if(G.easy||G.over||G.won){D.hunger=D.maxHunger;D.starveT=0;return;}
  const wet=D.swim||D.overWater,rate=Math.min(wet?HUNGER.wetMax:HUNGER.maxRate,(HUNGER.base*(D.mode==='air'?HUNGER.airMul:1)+(D.breath?HUNGER.breath:0))*(wet?HUNGER.wetMul:1));
  D.hunger=Math.max(0,D.hunger-rate*desertHunger()*dt);
  if(D.hunger<=HUNGER.low&&D.hunger>0&&!D.hungryWarn){D.hungryWarn=true;float(D.x,D.y-heightOf()-90,'Getting hungry… eat something!','#ffb060');}
  if(D.hunger<=0){D.starveT+=dt;D.hp-=HUNGER.starveHp*dt;D.hurt=Math.max(D.hurt,.05);
    if(Math.floor(D.starveT/3)!==Math.floor((D.starveT-dt)/3))float(D.x,D.y-heightOf()-90,'Starving!','#ff5050');
    if(D.hp<=0){D.hp=0;G.over=true;G.overT=0;G.starved=true;G.score=calcScore();if(G.score>best){best=G.score;localStorage.setItem('dr_best',best);}}}
  else D.starveT=0;}
function eatUnit(u){if(u.type==='sea'){eatSea(u);return;}u.dead=true;u.eaten=true;dropCarry(u);const heal=Math.round((u.type==='animal'?HEAL[u.species]:u.mounted?HEAL.cavalry:HEAL[u.type])||10);if(u.patrol)patrolHit(u);
  const got=Math.min(heal,D.maxHp-D.hp);D.hp=Math.min(D.maxHp,D.hp+heal);D.st=Math.min(D.maxSt,D.st+8);D.healFx=.6;feed(heal);
  puff(u.x,u.y,6,'rgba(170,40,40,',60,5);sparkle(D.x,D.y-heightOf(),14);
  float(D.x+R(-10,10),D.y-heightOf()-70,`+${heal} HP`,'#6dff7a');
  if(u.type==='animal'){G.stats.animals++;if(u.species==='cougar'){G.stats.cougars=(G.stats.cougars||0)+1;float(u.x,u.y-50,'Mountain lion! +120 pts','#ffd27a');}if(!isWild(u))addAlarm(2.5,u.x,u.y);float(u.x,u.y-20,'Chomp!','#ffd27a');}
  else{G.stats.eaten++;addAlarm(u.type==='villager'?6:3);float(u.x,u.y-20,u.mounted?'Horse and rider? Gulp!':u.type==='knight'?'Crunchy knight!':'Gulp!','#ffd27a');if(u.type==='archer')G.stats.archers++;if(u.type==='knight')G.stats.knights++;}}
function sparkle(x,y,n){for(let i=0;i<n;i++){const a=R(0,TAU),s=R(20,70);parts.push({x:x+R(-30,30),y:y+R(-20,20),z:R(10,50),vx:Math.cos(a)*s,vy:Math.sin(a)*s*.5,vz:R(20,60),life:R(.5,.9),max:.9,size:R(3,6),kind:'sparkle'});}}
function dropCarry(u){if(u.carry==='log'){}u.carry=null;u.water=null;if(u.cart){u.cart.pusher=null;u.cart=null;}if(u.task&&u.task.s){u.task.s.builder=null;}u.task=null;
  if(u.tree){u.tree.claimed=null;u.tree=null;}if(u.cell){u.cell.claimed=null;u.cell=null;}}
function patrolHit(u){const p=u.patrol;if(!p)return;if(!p.hitT||G.t-p.hitT>1){p.hitT=G.t;addAlarm(5);}engagePatrol(p);}
function hurtUnit(u,d,src){if(u.dead)return;if(u.type==='sea'){hurtSea(u,d,src);return;}if(u.patrol)patrolHit(u);u.hp-=d;
  if(u.mounted&&u.hp>0&&(src==='fire'||src==='stomp'))dismount(u,src);
  if(u.hp<=0){u.dead=true;dropCarry(u);
  puff(u.x,u.y,5,src==='fire'?'rgba(40,30,25,':'rgba(150,40,40,',50,6);
  if(u.type==='knight'){G.stats.knights++;addAlarm(2);float(u.x,u.y-20,'Knight down!','#cde');}
  else if(u.type==='archer'){G.stats.archers++;addAlarm(1.5);}
  else if(u.type==='hunter'){G.stats.hunters=(G.stats.hunters||0)+1;addAlarm(2);float(u.x,u.y-20,'The hunter is down!','#cde');}
  else if(u.type==='villager'||u.type==='crew'){addAlarm(3);}else if(u.type==='animal'&&!isWild(u)){addAlarm(1.5,u.x,u.y);}}}
function hurtStruct(s,d){if(s.state==='ruin')return;if(stoneish(s)&&!HEAVY)return;if(s.kind==='bridge'&&s.state==='building'&&s.nextMat==='stone'){d*=.5;}if(s.state==='building'){s.state='ruin';s.fire=0;s.build=Math.max(0,s.build-.5);if(s.builder){s.builder.task=null;s.builder.state='idle';s.builder=null;}puff(s.x,s.y,10,'rgba(120,100,70,',90,10);return;}s.hp-=d*(stoneish(s)&&s.weak>0?1.75:1);
  if(s.hp<=0){s.hp=0;s.state='ruin';s.fire=0;s.build=0;if(s.builder){s.builder.task=null;s.builder=null;}onRuin(s);
    scorch(s.x,s.y+4,s.kind==='barn'?55:40);puff(s.x,s.y,20,'rgba(70,60,50,',120,14);G.shake=Math.max(G.shake,5);
    if(s.kind==='hut'){G.stats.huts++;addAlarm(7);float(s.x,s.y-40,'Hut destroyed!','#ffb050');}
    else if(s.kind==='barn'){G.stats.barns++;addAlarm(10);float(s.x,s.y-50,'Barn destroyed!','#ffb050');}
    else if(s.kind==='logpile'){G.stats.piles++;G.yardWood=0;addAlarm(8);float(s.x,s.y-40,'Log pile burned! Rebuilding slowed','#ffb050');}
    else if(s.kind==='stonepile'){G.stats.piles++;G.yardStone=0;addAlarm(8);float(s.x,s.y-40,'Stone pile wrecked! Rebuilding slowed','#ffb050');}
    else if(s.kind==='cabin'){G.stats.huts++;addAlarm(6);float(s.x,s.y-40,"Hunters' cabin burned!",'#ffb050');}
    else if(s.kind==='gate'){s.ruinT=G.t;G.stats.castle=(G.stats.castle||0)+1;addAlarm(10);float(s.x,s.y-50,'The castle gate is smashed! Waves delayed','#ffb050');showToast&&showToast('Castle gate destroyed: waves delayed and smaller until it is rebuilt');}
    else if(s.kind==='bridge'){G.stats.bridges++;addAlarm(6);s.upgBy=null;float(s.x,s.y-50,s.mat==='stone'?'The STONE bridge crumbles into the river!':'The bridge burns and collapses!','#ffb050');}
    else if(s.kind==='barracks'){G.stats.castle=(G.stats.castle||0)+1;addAlarm(10);float(s.x,s.y-50,'Barracks destroyed! Fewer, slower knights','#ffb050');}}}
function wreckCart(c){if(c.wrecked)return;c.wrecked=true;c.fire=0;c.t=12;G.stats.carts++;addAlarm(3);G.cartsPool=Math.max(0,G.cartsPool);
  if(c.pusher){c.pusher.cart=null;c.pusher=null;}puff(c.x,c.y,12,'rgba(120,110,100,',110,8);float(c.x,c.y-30,c.stone?'Stone cart wrecked!':'Cart wrecked!','#ffb050');c.stone=0;}
function hurtDragon(d,src){if(G.over||G.won)return;d*=G.dmgMul;if(d>=9)rumble(.7,.9,180);D.hp-=d;D.hurt=.25;G.shake=Math.max(G.shake,Math.min(12,d*.6));float(D.x+R(-20,20),D.y-heightOf()-50,'-'+Math.round(d),'#ff7070');
  if(D.hp<=0){D.hp=0;G.over=true;G.overT=0;G.score=calcScore();if(G.score>best){best=G.score;localStorage.setItem('dr_best',best);}}}
function hurtSiege(g,d){if(g.dead)return;g.hp-=d;if(g.hp<=0){g.dead=true;g.fire=0;G.stats.siege++;addAlarm(5);scorch(g.x,g.y,40);puff(g.x,g.y,25,'rgba(80,60,40,',150,12);
  float(g.x,g.y-40,g.kind==='scorpion'?'Scorpion destroyed!':'Catapult destroyed!','#ffe28a');for(const c of units)if(c.siege===g)c.siege=null;}}
function calcScore(){const s=G.stats;return Math.round(s.huts*50+s.barns*90+s.trees*6+s.crops*3+s.eaten*30+s.animals*15+s.knights*40+s.archers*30+s.siege*150+s.carts*25+s.piles*120+(s.castle||0)*200+(s.hunters||0)*60+(s.birdPts||0)+(s.seaPts||0)+(s.regions||0)*100+(s.comboPts||0)+(s.cougars||0)*120+(s.coinPts||0)+(s.kPts||0)+(s.bridges||0)*80+G.stash*5+(G.won?1000*G.lvl:0)+G.t*2)+G.bank;}
