// ======================= alarm, waves and the kingdom's army =======================
function updAlarm(dt){
  G.sinceDmg+=dt;if(G.sinceDmg>coolDelay())G.alarm=Math.max(0,G.alarm-2.2*coolMul()*dt);
  let L=0;for(const t of THRESH)if(G.alarm>=t)L++;
  G.waveCD-=dt;G.reinforceT-=dt;
  if(L>G.lastLevel&&G.waveCD<=0)spawnWave(L);
  else if(L>=1&&G.reinforceT<=0&&G.waveCD<=0){const foes=units.filter(u=>!u.dead&&!u.post&&(u.type==='knight'||u.type==='archer')).length;if(foes<4+L*3)spawnWave(L,true);}
  if(L<G.lastLevel)G.lastLevel=L;
  G.level=L;
  // enemies give up and ride home if the meter cools to Calm
  {const gu=giveUpT();for(const u of units)if(!u.dead&&!u.post&&!u.patrol&&!u.escort&&!u.raid&&!u.prince&&(u.type==='knight'||u.type==='archer')&&G.t-(u.born||0)>10&&((L===0&&G.sinceDmg>gu)||(G.sinceDmg>gu&&kingdomMul(D.x,D.y)<.6&&dist(u,D)>1300)))u.retreat=true;}
  // troops muster at the barracks and ride out of the gate one by one
  G.gateOpenT=Math.max(0,G.gateOpenT-dt);
  if(G.spawnQ.length){G.spawnQT-=dt;if(G.spawnQT<=0){G.spawnQT=0.28*musterSlow()*musterNear()*(gateBroken()?2:1);const q=G.spawnQ.shift();G.gateOpenT=Math.max(G.gateOpenT,1.6);const nb=units.length;
    if(q==='foot')units.push(mkUnit('knight',GATE.x+R(-18,18),GATE.y-8,{hp:24,maxHp:24,atk:0,foot:true,colr:['#a33','#336','#996','#363'][RI(0,3)]}));
    else if(q==='knight')units.push(mkUnit('knight',GATE.x+R(-18,18),GATE.y-8,{hp:45,maxHp:45,atk:0,colr:['#c33','#33c','#cc3','#3a3'][RI(0,3)]}));
    else if(q==='cavalry')units.push(mkCavalry(GATE.x+R(-14,14),GATE.y-8,{cs:'wheel'}));
    else if(q==='archer')units.push(mkUnit('archer',GATE.x+R(-18,18),GATE.y-8,{hp:22,maxHp:22,shootT:R(1,3)}));
    else spawnSiege(q,siege.length);for(let i=nb;i<units.length;i++){const v=units[i];v.born=G.t;if(G.hpMul>1){v.hp*=G.hpMul;v.maxHp*=G.hpMul;}}}}
}
// damage to the gate / barracks slows the kingdom's response (1 = undamaged)
function castleHealth(kind){const s=structures.find(s=>s.kind===kind);return !s||s.state==='ruin'?0:s.state==='building'?.3:s.hp/s.maxHp;}
function musterSlow(){return (1+(gateBroken()?0:(1-castleHealth('gate'))*0.8)+(1-castleHealth('barracks'))*1.4)*(gateBroken()?GATE_SLOW:1);
}
// the castle gate is its own destructible part: while it is rubble (or still being rebuilt) waves come
// GATE_SLOW x less often, are half the size, and the soldiers trickle out one by one through the rubble
const GATE_SLOW=2.5;
function gateStruct(){return structures.find(s=>s.kind==='gate');}
function gateBroken(){const s=gateStruct();return !!s&&s.state!=='ok';}
// wave gates: a unit type needs its wanted tier AND enough waves fought (easy mode waits longer)
function waveGates(){return G.easy?{arch:10,cav:14,scorp:19,cat:27,mil:20}:{arch:8,cav:11,scorp:16,cat:24,mil:18};}
function waveComp(L,n){const e=G.easy,g=waveGates();return{
  footmen:L>=1?(e?Math.min(10,1+Math.floor(n*.3)):Math.min(16,2+Math.floor(n*.45))):0,
  knights:L>=2?Math.min(e?9:14,1+(L-2)+Math.floor(n*(e?.25:.35))):0,
  archers:L>=3&&n>=g.arch?Math.min(e?6:10,1+(L-3)+Math.floor((n-g.arch)/3)):0,
  cavalry:L>=4&&n>=g.cav?Math.min(e?5:8,1+(L-4)+Math.floor((n-g.cav)/4)):0,
  scorpions:L>=5&&n>=g.scorp?Math.min(e?2:4,1+Math.floor((n-g.scorp)/4)):0,
  catapults:L>=5&&n>=g.cat?Math.min(e?2:3,1+Math.floor((n-g.cat)/5)):0};}
// unit toughness grows slowly with the wave count
function waveHpMul(n){return 1+Math.min(G.easy?.2:.45,(n-1)*(G.easy?.008:.015));}
function edgePoint_unused(){const side=RI(0,2);// left,right,bottom (top is the castle)
  if(side===0)return{x:-30,y:R(500,WH-100)};if(side===1)return{x:WW+30,y:R(500,WH-100)};return{x:R(100,WW-100),y:WH+30};}
function spawnWave(L,reinf){G.waveNum++;const slow=musterSlow(),n=G.waveNum,ez=G.easy?1.5:1;G.waveCD=(n<6?10+(6-n)*3:7)*slow*ez;G.reinforceT=(38+Math.max(0,8-n)*5)*slow*(G.easy?1.4:1);G.lastLevel=L;G.hpMul=waveHpMul(n);const c0=waveComp(L,n);
  const gb=gateBroken();const m=G.waveMul*(castleHealth('barracks')>0?1:.6)*waveNear()*treasMul()*(gb?.5:1),sc=(v,min)=>v?Math.max(min,Math.round(v*m)):0;
  const c={footmen:sc(c0.footmen,1),knights:sc(c0.knights,c0.knights?1:0),archers:sc(c0.archers,1),cavalry:sc(c0.cavalry,1),scorpions:sc(c0.scorpions,G.easy?0:1),catapults:sc(c0.catapults,G.easy?0:1)};
  // everyone rides out of the castle gate, knights first
  const q=[];const mx=Math.max(c.knights,c.archers);for(let i=0;i<c.cavalry;i++)q.push('cavalry');for(let i=0;i<mx;i++){if(i<c.knights)q.push('knight');if(i<c.archers)q.push('archer');}for(let i=0;i<c.footmen;i++)q.push('foot');
  for(let i=0;i<c.scorpions;i++)q.push('scorpion');for(let i=0;i<c.catapults;i++)q.push('catapult');
  G.spawnQ.push(...q);G.spawnQT=Math.min(G.spawnQT,1.2*slow);G.gateOpenT=2+q.length*.3*slow;horn();
  const parts_=[`${c.footmen} foot soldier${c.footmen>1?'s':''}`];if(c.knights)parts_.push(`${c.knights} knight${c.knights>1?'s':''}`);if(c.cavalry)parts_.push(`${c.cavalry} mounted knight${c.cavalry>1?'s':''}`);if(c.archers)parts_.push(`${c.archers} archers`);if(c.scorpions)parts_.push(`${c.scorpions} scorpion${c.scorpions>1?'s':''}`);if(c.catapults)parts_.push(`${c.catapults} catapult${c.catapults>1?'s':''}`);
  let extra='';if(c.scorpions&&!G.seenScorp){G.seenScorp=true;extra='Scorpions roll out of the castle! Watch for the red aiming line.';}
  else if(c.catapults&&!G.seenCat){G.seenCat=true;extra='Catapults! Dodge the warning circles. They can\'t reach you high in the sky.';}
  else if(c.cavalry&&!G.seenCav){G.seenCav=true;extra='Mounted knights charge in straight lines—fly or sidestep! Burn or stomp them to knock them off their horses.';}
  else if(c.archers&&!G.seenArch){G.seenArch=true;extra='Archers can hit you even in the air!';}
  else if(c.knights&&!G.seenKn){G.seenKn=true;extra='Armoured knights on horseback join the foot soldiers: tougher and faster, but still stuck on the ground.';}
  else if(n===1)extra='Foot soldiers can only poke you on the ground. Take to the sky!';
  if(slow>1.3)extra='Your damage to the castle has slowed them down!';
  if(gb)extra='The gate is rubble: a smaller wave trickles out, and the next one is a long way off!';
  const who=c.knights||c.cavalry?'The knights are coming!':'The foot soldiers are coming!';
  G.banner={text:reinf?'Reinforcements! '+who:who,sub:`Wave ${n}: ${parts_.join(', ')}  ·  ${gb?'trickling out through the rubble':'riding out of the castle gate'}`,extra,t:4.5};G.shake=Math.max(G.shake,4);}
function spawnSiege(kind,i){const g={kind,x:GATE.x+(i%2?1:-1)*(30+i*28),y:GATE.y-10,hp:kind==='scorpion'?130:170,maxHp:kind==='scorpion'?130:170,fire:0,dead:false,
  state:'roll',t:R(.5,2),aim:{x:0,y:0},ang:Math.PI/2,armA:0,id:Math.random()};siege.push(g);
  const n=kind==='scorpion'?2:3;for(let k=0;k<n;k++)units.push(mkUnit('crew',g.x,g.y,{siege:g,slot:k,hp:15,maxHp:15}));}
function updKnight(u,dt){if(u.mounted&&!u.retreat){updCavalry(u,dt);return;}const dd=dist(u,D);u.atk-=dt;
  if(u.retreat){if(moveTo(u,GATE.x,GATE.y,110,dt)||dist(u,GATE)<20){u.dead=true;u.gone=true;}return;}
  if(u.post==='guard'&&(dd>380||d2(u.x,u.y,u.px,u.py)>520)){moveTo(u,u.px,u.py,80,dt);u.face=D.x>u.x?1:-1;u.swing=Math.max(0,(u.swing||0)-dt);return;}
  const ground=D.alt<DR.hitAltSword;
  const fs=u.foot?.7:1;
  if(ground){if(dd>(u.foot?58:72))moveTo(u,D.x,D.y,130*fs,dt);else{u.anim+=dt*4;if(u.atk<=0){u.atk=u.foot?1.35:1.1;u.swing=.25;hurtDragon(u.foot?4:7,u.foot?'spear':'sword');}}}
  else{const a=G.t*.8+u.id*TAU,tx=D.x+Math.cos(a)*120,ty=D.y+Math.sin(a)*80;moveTo(u,tx,ty,(dd>200?130:70)*fs,dt);}
  u.swing=Math.max(0,(u.swing||0)-dt);}
function updArcher(u,dt){const dd=dist(u,D);u.shootT-=dt;
  if(u.retreat){if(moveTo(u,GATE.x,GATE.y,80,dt)||dist(u,GATE)<20){u.dead=true;u.gone=true;}return;}
  if(u.post==='tower'){u.x=u.px;u.y=u.py;}
  else if(dd>330)moveTo(u,D.x,D.y,72,dt);else if(dd<180){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*30,u.y+Math.sin(a)*30,70,dt);}
  u.face=D.x>u.x?1:-1;
  if(dd<(u.post?440:420)&&u.shootT<=0){u.shootT=R(1.8,2.6)-G.level*.15;u.draw=.3;const T=dd/430,px=D.x+D.vx*T*.6,py=D.y+D.vy*T*.6,a=Math.atan2(py-u.y,px-u.x);
    projs.push({kind:'arrow',x:u.x,y:u.y,z:10,vx:Math.cos(a)*430,vy:Math.sin(a)*430,tz:heightOf()+15,life:1.4,dmg:4,z0:u.post?40:10});}
  u.draw=Math.max(0,(u.draw||0)-dt);}
function updCrew(u,dt){const g=u.siege;if(!g||g.dead){u.job='peasant';u.type='villager';u.home=VILLAGES[RI(0,4)];u.v=0;u.shirt='#8a6a3a';u.state='idle';return;}
  const a=g.ang+Math.PI+(u.slot-(g.kind==='scorpion'?.5:1))*0.7,tx=g.x+Math.cos(a)*30,ty=g.y+Math.sin(a)*22;moveTo(u,tx,ty,60,dt);
  if(g.state==='load'||g.state==='aim')u.anim+=dt*5;}
function updSiege(g,dt){if(g.dead)return;siegeSwim(g);const crew=units.filter(u=>!u.dead&&u.type==='crew'&&u.siege===g).length;
  if(crew===0){g.state='abandoned';return;}
  const dd=dist(g,D),eff=crew/(g.kind==='scorpion'?2:3);const range=g.kind==='scorpion'?560:720,minR=g.kind==='scorpion'?0:170;
  const want=Math.atan2(D.y-g.y,D.x-g.x);
  if(g.state==='roll'){ if(dd>range*.85){const sp=(g.kind==='scorpion'?34:26)*(.5+.5*eff),wp=riverRoute(g,D.x,D.y),wa=wp?Math.atan2(wp.y-g.y,wp.x-g.x):want,ox=g.x,oy=g.y,bl=uBlocked(g);g.x+=Math.cos(wa)*sp*dt;g.y+=Math.sin(wa)*sp*dt;if(bl(g.x,g.y)&&!bl(ox,oy)){g.x=ox;g.y=oy;bankSlide(g,wp?wp.x:D.x,wp?wp.y:D.y,sp*dt,bl);}g.ang+=angDiff(want,g.ang)*Math.min(1,2*dt);g.wheel=(g.wheel||0)+sp*dt*.2;}
    else if(dd<minR){g.x-=Math.cos(want)*20*dt;g.y-=Math.sin(want)*20*dt;}
    g.t-=dt;if(g.t<=0&&dd<range&&dd>=minR*.8)g.state=g.kind==='scorpion'?'aim':'fire',g.t=g.kind==='scorpion'?1.4:0;}
  if(g.kind==='scorpion'){
    if(g.state==='aim'){g.t-=dt;if(g.t>.35){g.aim.x=D.x;g.aim.y=D.y;g.aimH=heightOf();}g.ang+=angDiff(Math.atan2(g.aim.y-g.y,g.aim.x-g.x),g.ang)*Math.min(1,6*dt);
      if(g.t<=0){const a=Math.atan2(g.aim.y-g.y,g.aim.x-g.x);projs.push({kind:'bolt',x:g.x+Math.cos(a)*24,y:g.y+Math.sin(a)*24,z:14,vx:Math.cos(a)*950,vy:Math.sin(a)*950,tz:g.aimH+15,life:.9,dmg:0});
        g.state='roll';g.t=Math.max(1.4,(3.2-G.waveNum*.08))/(.4+.6*eff);g.recoil=.3;}}
    g.recoil=Math.max(0,(g.recoil||0)-dt);
  } else {
    if(g.state==='fire'){const T=1.8,px=clamp(D.x+D.vx*T,WX0+60,WX1-60),py=clamp(D.y+D.vy*T,WY0+60,WY1-60);
      boulders.push({sx:g.x,sy:g.y,tx:px,ty:py,t:0,T,r:78});g.state='roll';g.t=Math.max(3,5.5-G.waveNum*.1)/(.4+.6*eff);g.armA=1;g.ang=Math.atan2(py-g.y,px-g.x);}
    g.armA=Math.max(0,g.armA-dt*1.5);
  }}
function updProjs(dt){
  for(const p of projs){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.z=lerp(p.z,p.tz,Math.min(1,dt*3));
    if(d2(p.x,p.y,D.x,D.y)<(p.kind==='bolt'?48:40)&&!G.over){p.life=0;
      if(p.kind==='bolt'){const air=D.alt>.5;hurtDragon(air?26:12,'bolt');float(D.x,D.y-heightOf()-80,air?'Scorpion bolt! Critical!':'Scorpion bolt!','#ff9a9a');}
      else hurtDragon(p.dmg,'arrow');puff(D.x,D.y-heightOf(),4,'rgba(200,200,200,',60,4);}}
  for(let i=projs.length-1;i>=0;i--)if(projs[i].life<=0)projs.splice(i,1);
  for(const b of boulders){b.t+=dt;if(b.t>=b.T&&!b.done){b.done=true;G.shake=Math.max(G.shake,dist({x:b.tx,y:b.ty},D)<300?9:2);
      puff(b.tx,b.ty,30,'rgba(140,125,100,',200,16);scorch(b.tx,b.ty,20);
      const dd=d2(b.tx,b.ty,D.x,D.y);if(dd<b.r+20&&D.alt<DR.catAltSafe){const f=1-D.alt/DR.catAltSafe;hurtDragon(Math.round(26*(0.45+0.55*f)*(dd<b.r*.5?1:.7)),'boulder');float(D.x,D.y-100,'Crushed by a boulder!','#ff9a9a');}
      for(const u of units)if(!u.dead&&!u.inside&&d2(u.x,u.y,b.tx,b.ty)<b.r*.8)hurtUnit(u,30,'stomp');
      for(const s of structures)if(s.state!=='ruin'&&d2(s.x,s.y,b.tx,b.ty)<b.r*.8)hurtStruct(s,40);}}
  for(let i=boulders.length-1;i>=0;i--)if(boulders[i].done&&boulders[i].t>b_fade(boulders[i]))boulders.splice(i,1);
}
function b_fade(b){return b.T+.3;}
