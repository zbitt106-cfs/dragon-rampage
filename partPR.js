// ================= partPR: PRINCE BOSS ARMIES - every 5th castle level a named prince sails in with a royal war fleet =================
// Warning (herald + horn + war drums, ~10 s) -> warships sail in from the southern sea edge -> they beach at the landing spot (⚓ on the map)
// -> the army disembarks and the prince (on his white warhorse) and his whole army hunt the dragon down together, wherever it is -> boss fight.
// Sinking a warship before it lands dumps its soldiers in the sea: they can't swim in armour, so they cling to barrels and get fished out (no gore).
const PRINCE_NAMES=['Prince Edmund the Valiant','Prince Aldric of the Golden Isles','Prince Leopold Stormcrown','Prince Florian the Fair','Prince Casimir Ironsail','Prince Valentin of Westmarch','Prince Rupert the Resolute','Prince Tristan Sunshield','Prince Magnus the Mighty','Prince Ferdinand Wavebreaker','Prince Oswin of Highcliff','Prince Lucian Silverlance'];
const PRINCE_COLS=[['#1f3f9a','#ffd23a','crown'],['#8a1420','#ffd23a','lion'],['#1d6a3a','#f4f4f4','tree'],['#5a2a8a','#ffe08a','star'],['#0f5f78','#f4f4f4','moon'],['#a8461a','#ffe08a','sun'],['#2a2a34','#ffd23a','bolt'],['#b81e6e','#f4f4f4','rose']];
const PRN_WARN=10,PRN_DELAY=20;
let PRN={cur:null,seed:Math.floor(Math.random()*PRINCE_NAMES.length),swim:[],land:null,noBite:null};
SHIPK.warship={hp:240,sp:72,crew:0,r:66};
function princeLevel(l){return l>=5&&l%5===0;}
function princeK(l){return Math.max(1,Math.floor(l/5));}
function princeInfo(l){const k=princeK(l),ez=!!G.easy,name=PRINCE_NAMES[(PRN.seed+k-1)%PRINCE_NAMES.length],c=PRINCE_COLS[(PRN.seed*3+k-1)%PRINCE_COLS.length];
  const total=Math.min(40,Math.round(9+4.5*(k-1))-(ez?2:0));
  const archer=Math.round(total*Math.min(.32,.2+.04*(k-1))),cavalry=Math.round(total*Math.min(.3,.12+.05*(k-1))),knight=Math.round(total*.25),foot=Math.max(1,total-archer-cavalry-knight);
  return{k,lvl:l,name,short:name.split(' ').slice(0,2).join(' '),col:c[0],trim:c[1],crest:c[2],ships:2+(k-1),army:{foot,knight,archer,cavalry},total,siege:k>=3?Math.min(4,k-2):0,
    hp:Math.round((900+400*(k-1))*(ez?.75:1)),shipHp:Math.round((240+40*(k-1))*(ez?.8:1)),gold:250+150*(k-1),pts:1500*k};}
function princeActive(){return !!PRN.cur&&!PRN.cur.done;}
function princeHudOn(){return scene==='play'&&princeActive()&&PRN.cur.phase!=='pre';}
// ---- where the fleet lands: the southern shore below Haybury, a short march from King William's roads ----
function shoreAt(x){for(let y=3950;y<WY1-200;y+=10)if(inSea(x,y))return y;return null;}
function princeLanding(){if(PRN.land)return PRN.land;
  for(const x0 of[3000,3300,2700,3600,2400,3900,4300]){const yS=shoreAt(x0);if(yS===null)continue;const L={x:x0,y:yS-60};if(soldierWet(L.x,L.y))continue;return PRN.land={x:x0,y:yS,L};}
  return PRN.land={x:3000,y:4600,L:{x:3000,y:4540}};}
function princeRoute(L){const P=[],rp=typeof roadPath==='function'?roadPath(L.x,L.y,RAID_TRAIL.x,RAID_TRAIL.y):null;
  if(rp)for(const p of rp.P){const l=P[P.length-1]||L;if(dist(l,p)>40)P.push({x:p.x,y:p.y});}else P.push({x:3050,y:4020},{x:2400,y:3960},{x:2265,y:3340},{x:2350,y:2900},{x:2350,y:1720},{x:2150,y:900});
  P.push({x:RAID_TRAIL.x,y:RAID_TRAIL.y},{x:2070,y:120},{x:2130,y:-380},{x:2210,y:-880},{x:2270,y:-1330},{x:HX()+30,y:HY()+190});return P;}
function mkPrince(){if(typeof G.prSeed==='number')PRN.seed=G.prSeed;const c=princeInfo(G.lvl);G.prT=Math.max(typeof G.prT==='number'?G.prT:PRN_DELAY,6);
  Object.assign(c,{phase:'pre',t:0,drumT:0,members:[],boss:null,done:false,landed:false,land:princeLanding(),path:null,fleet:[]});return c;}
function princeHerald(){const c=PRN.cur;c.phase='warn';c.t=PRN_WARN;c.drumT=0;
  G.banner={text:`Hear ye! ${c.name} vows before King William to slay the dragon!`,
    sub:`${c.ships} royal warships  ·  ${c.total} soldiers${c.siege?' + '+c.siege+' siege engine'+(c.siege>1?'s':''):''}  ·  landing on the southern shore in ${PRN_WARN} s (⚓ on the map)`,
    extra:c.k===1?'Sink the warships at sea before they land: soldiers in armour can\'t swim! Burn, slam or scratch the hulls.':`Prince number ${c.k}: a bigger fleet, more archers and cavalry${c.siege?' and siege engines':''}!`,t:4.5};c.hb=G.banner;
  G.shake=Math.max(G.shake,7);if(typeof SFX!=='undefined'){SFX.play('princeHorn');SFX.play('warDrum');}if(typeof horn==='function')horn();
  showToast(`👑 ${c.name} is coming with ${c.ships} warships!`);float(D.x,D.y-130,'📯 Hear ye! Hear ye!','#ffe08a');}
function launchFleet(){const c=PRN.cur,L=c.land;c.phase='sail';c.path=princeRoute(L.L);
  // cargo: the prince rides on the flagship; the rest of the army is shared round-robin over the fleet
  const q=[];const A=c.army,mx=Math.max(A.foot,A.knight,A.archer,A.cavalry);for(let i=0;i<mx;i++){if(i<A.cavalry)q.push('cavalry');if(i<A.knight)q.push('knight');if(i<A.archer)q.push('archer');if(i<A.foot)q.push('foot');}
  for(let i=0;i<c.siege;i++)q.push(i%2?'scorpion':'catapult');
  for(let i=0;i<c.ships;i++){const x=L.x+(i-(c.ships-1)/2)*170,yS=shoreAt(x)||L.y,anchor={x,y:yS+62};let drop={x,y:yS-48};if(soldierWet(drop.x,drop.y))drop=dryNear(drop.x,drop.y)||L.L;
    let sx=x+R(-220,220),sy=WY1-170;for(let t=0;t<30&&!inSea(sx,sy);t++)sy-=40;
    const s={kind:'warship',war:c,x:sx,y:sy+i*60,ang:-Math.PI/2,sp:SHIPK.warship.sp*(.92+.05*i),hp:c.shipHp,maxHp:c.shipHp,r:SHIPK.warship.r,crew:0,fire:0,fireT:0,state:'sail',wp:null,cd:R(1.5,3),cd2:0,t:0,id:rnd(),bob:R(0,TAU),anchor,drop,cargo:i===0?['prince']:[],flagship:i===0,unT:0};
    ships.push(s);c.fleet.push(s);}
  q.forEach((k,i)=>c.fleet[i%c.ships].cargo.push(k));
  float(L.L.x,L.L.y-60,'⚓ The royal fleet makes for this shore!','#ffe08a');showToast(`⛵ ${c.ships} warships under ${c.short}'s colours are sailing in!`);}
function princeDisembark(s,k){const c=s.war,p=s.drop,x=p.x+R(-16,16),y=p.y+R(-10,10),K=c.k;let u=null;
  if(k==='prince'){u=mkUnit('knight',x,y,{mounted:true,hp:c.hp,maxHp:c.hp,atk:0,colr:c.col,isPrince:true,cs:'wheel'});c.boss=u;
    float(x,y-80,`${c.short}: "Forward, for glory! Slay the beast!"`,'#ffe08a');G.banner={text:`${c.name} has landed!`,sub:`He and his whole army are hunting you down, wherever you go! Wear him down below 30% to gobble him!`,t:4.5};if(typeof SFX!=='undefined')SFX.play('princeHorn');}
  else if(k==='foot')u=mkUnit('knight',x,y,{hp:30+4*K,maxHp:30+4*K,atk:0,foot:true,colr:c.col});
  else if(k==='knight')u=mkUnit('knight',x,y,{hp:55+6*K,maxHp:55+6*K,atk:0,colr:c.col});
  else if(k==='cavalry')u=mkCavalry(x,y,{colr:c.col,hp:95+8*K,maxHp:95+8*K,cs:'wheel'});
  else if(k==='archer')u=mkUnit('archer',x,y,{hp:24+3*K,maxHp:24+3*K,shootT:R(1,3)});
  else{const n0=units.length;spawnSiege(k,siege.length);const g=siege[siege.length-1];g.x=x;g.y=y;g.prince=c;for(let i=n0;i<units.length;i++){units[i].x=x+R(-12,12);units[i].y=y+R(-8,8);}puff(x,y,8,'rgba(220,240,255,',60,5);return;}
  u.prince=c;u.born=G.t;if(u.mounted||(!u.isPrince&&u.type==='knight'&&c.members.filter(m=>m.prFlag&&!m.mounted).length<2))u.prFlag=!u.isPrince;
  c.members.push(u);units.push(u);puff(x,y,6,'rgba(220,240,255,',60,5);}
function princeSwimmers(s){const c=s.war,n=s.cargo.filter(k=>k!=='prince'&&k!=='catapult'&&k!=='scorpion').length;
  for(let i=0;i<n;i++){const a=R(0,TAU);PRN.swim.push({x:s.x+Math.cos(a)*R(10,s.r),y:s.y+Math.sin(a)*R(6,s.r*.4),t:-R(0,.6),ph:R(0,6),col:c.col});}
  if(n)float(s.x,s.y-40,['Glub! We can\'t swim in this armour!','Help! Grab a barrel!','Blub blub! Abandon ship!'][RI(0,2)],'#bfe6ff');
  s.lost=n;s.cargo=[];}
function warshipSunk(s,src){const c=s.war;s.hp=0;s.state='sink';s.t=0;G.stats.ships=(G.stats.ships||0)+1;G.stats.seaPts=(G.stats.seaPts||0)+200;
  if(typeof tallyAdd==='function')tallyAdd('ship:warship');puff(s.x,s.y,24,'rgba(220,240,255,',150,10);if(typeof SFX!=='undefined')SFX.play('splash',s.x,s.y,1);
  const hadPrince=s.cargo.includes('prince');princeSwimmers(s);
  float(s.x,s.y-90,s.state0==='empty'?'The empty warship burns down to the waterline!':`Warship sunk! ${s.lost||0} soldiers fished out of the sea`,'#ffb050');
  loot.push({x:s.x+R(-15,15),y:s.y+R(-10,10),amt:4,t:0});
  if(hadPrince&&c===PRN.cur&&!c.done)princeDown(c,'sunk',s);}
// ---- the prince ends: defeated, gobbled or his flagship sunk before landing ----
function princeDown(c,how,at){if(!c||c.done)return;c.done=true;c.phase='over';G.prState='done';const x=at?at.x:c.boss?c.boss.x:D.x,y=at?at.y:c.boss?c.boss.y:D.y;
  G.stash+=c.gold;if(typeof hoardDrop==='function')hoardDrop(c.gold,x,y);G.stats.princePts=(G.stats.princePts||0)+c.pts;G.stats.princes=(G.stats.princes||0)+1;
  if(how==='sunk'&&typeof tallyAdd==='function')tallyAdd('prince:'+c.name);
  if(typeof plantTrophy==='function')plantTrophy({name:c.name,short:c.short,col:c.col,trim:c.trim,crest:c.crest,big:true});
  sparkle(x,y,30);G.shake=Math.max(G.shake,8);
  G.banner={text:how==='eaten'?`You gobbled ${c.name}! Crown and all!`:how==='sunk'?`${c.name}'s flagship sinks! He is fished out and rows home in disgrace`:`${c.name} is defeated!`,
    sub:`+${c.gold} gold for your hoard  ·  +${c.pts} pts  ·  his royal banner now flies at your lair`,extra:'His army loses heart and runs back to the boats.',t:4.5};
  if(typeof SFX!=='undefined')SFX.play('fanfare');showToast(`👑 ${c.short} beaten: +${c.gold} gold and a royal banner trophy`);
  for(const u of c.members)if(!u.dead)u.prFlee=true;for(const s of c.fleet)if(s.state==='sail'||s.state==='unload'){s.state='home';s.cargo=[];}
  RAID.cd=Math.max(RAID.cd,90);}
// ---- per-frame ----
function updPrince(dt){if(scene!=='play'||!G||G.over||G.won)return;
  for(const w of PRN.swim){w.t+=dt;if(w.t>0){w.y+=22*dt;w.x+=Math.sin(G.t*2+w.ph)*8*dt;}if(w.t>2.5&&!w.msg){w.msg=1;if(PRN.swim.indexOf(w)%5===0)float(w.x,w.y-30,['A fishing boat fishes them out!','Paddling home on a barrel!','*splash* ...rescued!'][RI(0,2)],'#cfe8ff');}}
  PRN.swim=PRN.swim.filter(w=>w.t<7);
  if(G.prState==='pending'&&!PRN.cur)PRN.cur=mkPrince();
  const c=PRN.cur;if(!c||c.done)return;
  if(c.phase==='pre'){if(RAID.cur)return;G.prT-=dt;if(G.prT<=0)princeHerald();return;}
  if(c.phase==='warn'){c.t-=dt;if(!G.banner&&c.hb&&c.hb.t>1&&c.t>2)G.banner=c.hb;c.drumT-=dt;if(c.drumT<=0){c.drumT=.62;if(typeof SFX!=='undefined')SFX.play('warDrum');}if(c.t<=0)launchFleet();return;}
  if(c.boss&&c.boss.dead)princeDown(c,c.boss.eaten?'eaten':'defeated');
  if(!c.landed&&c.fleet.some(s=>s.state==='unload'||s.state==='empty'))c.landed=true;}
function updWarship(s,dt){s.t+=dt;s.bob+=dt;if(s.state==='sink')return;const c=s.war;
  if(s.fire){s.fireT+=dt;hurtShip(s,6*dt,'fire');if(s.state==='sink')return;if(s.fireT>8&&s.state!=='empty'){s.fire=0;s.fireT=0;float(s.x,s.y-70,'The sailors douse the flames!','#cfe8ff');}
    if(Math.abs(s.x-D.x)<1900&&rnd()<dt*16)flame(s.x+R(-s.r*.5,s.r*.5),s.y+R(-8,8),R(12,34));}
  if(s.state==='sail'||s.state==='home'){const tx=s.state==='home'?s.x:s.anchor.x,ty=s.state==='home'?WY1+200:s.anchor.y,a=Math.atan2(ty-s.y,tx-s.x);
    s.ang+=angDiff(a,s.ang)*Math.min(1,1.6*dt);const nx=s.x+Math.cos(s.ang)*s.sp*dt,ny=s.y+Math.sin(s.ang)*s.sp*dt;
    if(s.state==='home'){s.x=nx;s.y=ny;if(s.y>WY1-90){s.state='sink';s.t=99;}return;}
    if(inSea(nx,ny)&&d2(nx,ny,LH.x,LH.y)>LH.r+s.r){s.x=nx;s.y=ny;}else{s.anchor={x:s.x,y:s.y};}
    if(d2(s.x,s.y,s.anchor.x,s.anchor.y)<28){s.state='unload';s.unT=.8;s.state0='unload';float(s.x,s.y-90,`Land ho! Disembark!`,'#ffe08a');if(typeof SFX!=='undefined')SFX.play('warDrum');}
    // archers on deck loose arrows at a dragon that comes close
    const ar=s.cargo.filter(k=>k==='archer').length;s.cd-=dt;
    if(ar&&s.cd<=0&&!G.over&&d2(s.x,s.y,D.x,D.y)<470){s.cd=R(1.6,2.4)/Math.min(3,ar);const b=Math.atan2(D.y-s.y,D.x-s.x)+R(-.06,.06);projs.push({kind:'arrow',x:s.x,y:s.y-10,z:22,vx:Math.cos(b)*430,vy:Math.sin(b)*430,tz:heightOf()+15,life:1.4,dmg:3,z0:22});}
    if((G.fc&7)===0)ripples.push({x:s.x-Math.cos(s.ang)*s.r,y:s.y-Math.sin(s.ang)*s.r,t:.3});return;}
  if(s.state==='unload'){s.unT-=dt;if(s.unT<=0&&s.cargo.length){s.unT=.42;princeDisembark(s,s.cargo.shift());}if(!s.cargo.length){s.state='empty';s.state0='empty';}}}
// unit loop hook (part6): prince + army behaviour; false = let the normal soldier AI hunt the dragon
function princeStep(u,dt){const c=u.prince;if(!c||c!==PRN.cur){u.prince=null;u.isPrince=false;return false;}
  if(u.isPrince)return princeBoss(u,dt);
  if(c.done||u.prFlee){u.prFlee=true;const p=c.land.L;if(moveTo(u,p.x,p.y+6,u.mounted?120:95,dt)||dist(u,p)<40){u.dead=true;u.gone=true;if(rnd()<.35)float(u.x,u.y-30,'Back to the boats! Row home!','#cfe8ff');}u.anim+=dt*6;return true;}
  const dd=dist(u,D),low=D.alt<DR.hitAltSword;
  if(dd<(u.type==='archer'?470:low?340:230))return false;
  const ch=c.boss;if(!ch||ch.dead)return false;
  const i=c.members.indexOf(u),row=1+Math.floor((i-1)/4),col=((i-1)%4)-1.5,nx=(c.path[0]||ch),ha=Math.atan2(nx.y-ch.y,nx.x-ch.x),
    tx=ch.x-Math.cos(ha)*26*row-Math.sin(ha)*20*col,ty=ch.y-Math.sin(ha)*26*row+Math.cos(ha)*20*col;
  if(d2(u.x,u.y,tx,ty)>1100){u.x=tx;u.y=ty;}else if(d2(u.x,u.y,tx,ty)>36)moveTo(u,tx,ty,u.mounted?115:88,dt);
  u.anim+=dt*5;u.face=Math.cos(ha)>=0?1:-1;if(u.mounted)u.ha=ha;return true;}
function princeBoss(u,dt){const c=u.prince;u.retreat=false;u.shieldT=Math.max(0,(u.shieldT||0)-dt);u.shCD=Math.max(0,(u.shCD||0)-dt);u.atk-=dt;u.thrust=Math.max(0,(u.thrust||0)-dt);
  const dd=dist(u,D),low=D.alt<DR.hitAltSword;
  if(dd<560&&(low||dd<300)){
    if(!u.engaged){u.engaged=true;float(u.x,u.y-80,`${c.short}: "Have at thee, dragon!"`,'#ffe08a');}
    if(low&&dd<74&&u.cs!=='charge'){u.face=D.x>u.x?1:-1;u.anim+=dt*4;if(u.atk<=0){u.atk=1.25;u.thrust=.32;const dm=10+3*c.k;hurtDragon(dm,'lance');float(D.x,D.y-95,`Royal lance! -${dm}`,'#ffb0a0');}return true;}
    updCavalry(u,dt);return true;}
  u.engaged=false;const p=c.path&&c.path[0];
  if(!p){u.face=D.x>u.x?1:-1;if(!c.tauntT||G.t-c.tauntT>9){c.tauntT=G.t;float(u.x,u.y-80,`${c.short}: "Come out and face me, dragon!"`,'#ffe08a');}return true;}
  u.anim+=dt*7;u.face=p.x>u.x?1:-1;if(moveTo(u,p.x,p.y,64,dt)||dist(u,p)<28)c.path.shift();return true;}
// ---- hooks ----
const _updPartsPR=updParts;updParts=function(dt){_updPartsPR(dt);updPrince(dt);};
const _updShipPR=updShip;updShip=function(s,dt){if(s.kind==='warship'){updWarship(s,dt);return;}_updShipPR(s,dt);};
const _hurtShipPR=hurtShip;hurtShip=function(s,d,src){if(!s||s.kind!=='warship')return _hurtShipPR.apply(this,arguments);if(s.state==='sink')return;
  s.hp-=d;if(src!=='fire'&&d>=10&&Math.abs(s.x-D.x)<1500)float(s.x,s.y-80,src==='scratch'?'Claws rake the hull!':src==='slam'?'The deck caves in!':'The hull splinters!','#ffe28a');
  if(s.hp<=0)warshipSunk(s,src);};
const _drawShipPR=drawShip;drawShip=function(s){if(s.kind==='warship'){drawWarship(s);return;}_drawShipPR(s);};
const _dismountPR=dismount;dismount=function(u){if(u&&u.isPrince){if(!u.saddleMsg||G.t-u.saddleMsg>5){u.saddleMsg=G.t;float(u.x,u.y-80,'The prince keeps his saddle!','#ffe08a');}return;}return _dismountPR.apply(this,arguments);};
const _hurtUnitPR=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.isPrince&&!u.dead){
    if((src==='fire'||src==='lava')&&!(u.shieldT>0)&&!(u.shCD>0)){u.shieldT=1.8;u.shCD=6;float(u.x,u.y-84,`${u.prince.short} raises his shield!`,'#ffe08a');}
    d*=(u.shieldT>0?.25:1)*(src==='fire'?.55:.8);}
  const was=u&&u.dead;_hurtUnitPR.apply(this,[u,d,src]);if(u&&u.isPrince&&!was&&u.dead)princeDown(u.prince,'defeated');};
const _eatUnitPR=eatUnit;eatUnit=function(u){const p=u&&u.isPrince&&!u.dead;if(p)u.eaten=true;_eatUnitPR(u);if(p){float(u.x,u.y-60,'Crown and all? GULP!','#ffd27a');princeDown(u.prince,'eaten');}};
// only edible below 30% health (a cartoon gulp); above that he raises his royal shield
const _biteTargetsPR=biteTargets;biteTargets=function(){const T=_biteTargetsPR.apply(this,arguments);return PRN.noBite?T.filter(u=>u!==PRN.noBite):T;};
const _tryEatPR=tryEat;tryEat=function(){const T=biteTargets(),pz=T.find(u=>u.isPrince&&u.hp>u.maxHp*.3);
  if(pz){if(T.length===1){D.eatCD=.8;D.hp-=7*G.dmgMul;D.hurt=.3;pz.shieldT=Math.max(pz.shieldT||0,.8);float(pz.x,pz.y-80,`${pz.prince.short} raises his royal shield! Wear him down below 30% first`,'#ffd27a');return;}PRN.noBite=pz;}
  try{return _tryEatPR.apply(this,arguments);}finally{PRN.noBite=null;}};
const _newGamePR=newGame;newGame=function(){const r=_newGamePR.apply(this,arguments);PRN.cur=null;PRN.swim=[];PRN.land=null;G.prSeed=PRN.seed;G.prState=princeLevel(G.lvl)?'pending':'none';G.prT=PRN_DELAY;return r;};
const _updRaidsPR=updRaids;updRaids=function(dt){if(princeActive()&&!RAID.cur&&scene==='play'&&G&&!G.over&&!G.won){RAID.cd=Math.max(RAID.cd,30);return;}return _updRaidsPR(dt);}; // no hoard raids during a prince attack
const _raidCdLinePR=raidCdLine;raidCdLine=function(){if(princeActive()&&!RAID.cur)return`🛡 No hoard raids while ${PRN.cur.short} is attacking  ·  Next raid possible in ${Math.floor(Math.ceil(RAID.cd)/60)}:${String(Math.ceil(RAID.cd)%60).padStart(2,'0')} after he is beaten`;return _raidCdLinePR();};
const _calcScorePR=calcScore;calcScore=function(){return _calcScorePR()+((G&&G.stats&&G.stats.princePts)||0);};
const _tallyKeyUPR=tallyKeyU;tallyKeyU=function(u){if(u&&u.isPrince&&u.prince)return'prince:'+u.prince.name;return _tallyKeyUPR(u);};
(function(){if(typeof TALLY_SECT==='undefined')return;const i=TALLY_SECT.findIndex(s=>s.id==='champ'),sec={id:'prince',name:'Princes (royal war fleets)',icon:'👑',col:'#ffd23a',keys:PRINCE_NAMES.map(n=>['prince:'+n,n])};
  TALLY_SECT.splice(i<0?TALLY_SECT.length:i+1,0,sec);for(const [k,n] of sec.keys)TALLY_LABEL[k]=n;const B=TALLY_SECT.find(s=>s.id==='boats');if(B){B.keys.push(['ship:warship','Royal warships']);TALLY_LABEL['ship:warship']='Royal warships';}})();
// ---- drawing ----
function drawWarship(s){const c=s.war||{col:'#1f3f9a',trim:'#ffd23a',crest:'crown'},x=s.x,y=s.y,sk=s.state==='sink'?Math.min(1.2,s.t/4):0,b=Math.sin(s.bob*1.4)*1.6,r=s.r,f=Math.cos(s.ang)>=0?1:-1,beached=s.state==='unload'||s.state==='empty';
  ctx.save();ctx.globalAlpha=Math.max(0,1-sk*.9);
  if(beached&&s.drop&&sk===0){line(x,y-8,s.drop.x,s.drop.y+4,'#5a3a1a',7);line(x,y-8,s.drop.x,s.drop.y+4,'#9a7040',4);}
  ell(x,y+6,r*1.1,r*.36,'rgba(10,30,60,.32)');
  ctx.save();ctx.translate(x,y+sk*28+(beached?0:b));ctx.rotate(f*sk*.5+(s.state==='empty'?f*.04:0));ctx.scale(f,1);
  poly([-r,-12,r*1.08,-15,r*.8,10,-r*.82,10],'#5a3418');poly([-r,-12,r*1.08,-15,r*1.02,-9,-r*.97,-8],'#7a4a24');line(-r*.85,0,r*.82,0,c.trim,2.5);
  rect(-r*.98,-31,r*.42,19,'#6a3e1c');rect(-r*.98,-34,r*.42,4,'#8a5a2a');poly([r*.6,-14,r*1.08,-15,r*1.02,-29,r*.62,-29],'#6a3e1c');line(r*.6,-29,r*1.04,-29,'#8a5a2a',3);
  for(let i=0;i<5;i++){const sx=-r*.45+i*r*.24;ell(sx,-15,4.6,4.6,i%2?c.col:c.trim);ell(sx,-15,1.5,1.5,'#333');}
  const sw=Math.sin(G.t*1.3+s.id*5)*2.5,furl=s.state==='empty'||beached;
  for(const [mx,mh,w] of [[-r*.15,100,24],[r*.4,78,19]]){line(mx,-12,mx,-mh,'#4a2a10',3.5);line(mx-w,-mh+10,mx+w,-mh+10,'#4a2a10',2);
    if(furl){rect(mx-w,-mh+9,w*2,5,c.col);line(mx-w,-mh+14,mx+w,-mh+14,c.trim,1.2);continue;}
    ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(mx-w,-mh+11);ctx.lineTo(mx+w,-mh+11);ctx.quadraticCurveTo(mx+w+4+sw,-mh*.55,mx+w-2,-24);ctx.lineTo(mx-w+2,-24);ctx.quadraticCurveTo(mx-w+4+sw,-mh*.55,mx-w,-mh+11);ctx.fill();
    ctx.strokeStyle=c.trim;ctx.lineWidth=1.6;ctx.stroke();drawCrest(mx+sw*.5,(-mh+11-24)/2,mh>90?2.3:1.8,c.crest,c.trim);}
  // royal swallow-tailed banner at the main masthead
  const mx=-r*.15,wv=Math.sin(G.t*6+s.id*3)*2.2;line(mx,-100,mx,-112,'#4a2a10',2);ell(mx,-113,2,2,'#ffd23a');
  poly([mx,-112,mx-30,-109+wv,mx-23,-105+wv*.5,mx-30,-101+wv,mx,-103],c.col);line(mx,-108,mx-26,-106+wv*.8,c.trim,1.5);
  ctx.restore();
  if(s.state!=='sink'){const n=Math.min(7,s.cargo?s.cargo.length:0);for(let i=0;i<n;i++){const k=s.cargo[i],cx=x+(i-(n-1)/2)*r*.24,cy=y-16+b;
      if(k==='prince'){ell(cx,cy-5,4.4,4.4,'#e8ecf2');poly([cx-4,cy-8,cx+4,cy-8,cx+4,cy-12,cx+2,cy-10,cx,cy-13.5,cx-2,cy-10,cx-4,cy-12],'#ffd23a');}
      else{ell(cx,cy-5,4,4,'#f0c8a0');ctx.fillStyle=k==='archer'?'#4f7a3a':'#9aa2ac';ctx.beginPath();ctx.arc(cx,cy-6,4.3,Math.PI,0);ctx.fill();if(k==='cavalry'||k==='knight')line(cx+3,cy-4,cx+5,cy-20,'#8a6a40',1.4);}}
    if(s.hp<s.maxHp){rect(x-r*.6-1,y-r-61,r*1.2+2,6,'#000');rect(x-r*.6,y-r-60,r*1.2*s.hp/s.maxHp,4,s.state==='empty'?'#c96':'#e44');}
    if(s.flagship&&s.state==='sail')txt(`👑 ${c.short}'s flagship`,x,y-r-68,10,'#ffe08a','center',true);
    if(s.fire)for(let i=0;i<4;i++)ell(x+R(-r*.5,r*.5),y-16-R(0,16),R(5,10),R(7,13),`rgba(255,${RI(120,200)},40,.75)`);}
  else for(let i=0;i<3;i++)ell(x+R(-r,r),y+R(-6,6),R(2,5),R(2,5),'rgba(230,245,255,.7)');
  ctx.restore();}
function drawPrinceFlag(u){const c=u.prince,f=u.face||1,px=u.x-f*6,base=u.mounted?u.y-26:u.y-6,top=base-(u.mounted?34:36),wv=Math.sin(G.t*6+u.id*9)*1.6;
  line(px,base,px,top,'#6a4a28',1.6);ell(px,top-1,1.6,1.6,'#ffd23a');ctx.fillStyle=c.col;ctx.fillRect(px-(f>0?0:14),top+1,14,10);ctx.fillStyle=c.trim;ctx.fillRect(px-(f>0?0:14),top+9,14,1.6);
  ctx.save();ctx.beginPath();ctx.rect(px-(f>0?0:14),top+1,14,10);ctx.clip();drawCrest(px+(f>0?7:-7),top+5.5,.9,c.crest,c.trim);ctx.restore();
  ctx.fillStyle=c.col;for(let i=0;i<2;i++){const bx=px+(f>0?i*7:-14+i*7);ctx.beginPath();ctx.moveTo(bx,top+11);ctx.lineTo(bx+7,top+11);ctx.lineTo(bx+3.5,top+15+wv);ctx.fill();}}
function drawPrince(u){const c=u.prince||{},x=u.x,y=u.y,f=u.face||1,g=Math.sin(u.anim*1.6),s=1.45,ch=u.cs==='charge'||u.thrust>0,sh=u.shieldT>0;
  ell(x,y+3,24,7,'rgba(0,0,0,.28)');
  if(sh){ctx.strokeStyle=`rgba(255,230,140,${.5+.3*Math.sin(G.t*14)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x+f*16,y-34,18,26,0,0,TAU);ctx.stroke();}
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  for(const lx of[-8,-4,5,9]){const ex=lx+g*3*(lx>0?1:-1);line(lx,-7,ex,1,'#e4e0d6',2.4);ell(ex,1.2,1.4,.9,'#555');}
  line(-f*13,-12,-f*17,-3,'#f2f0ea',3);ell(0,-11,13.5,6.4,u.burn>0?'#e0b090':'#fbfaf6');
  ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(-11,-15);ctx.lineTo(11,-15);ctx.lineTo(12,-5);ctx.lineTo(-12,-5);ctx.closePath();ctx.fill();line(-12,-5.5,12,-5.5,c.trim,1.4);drawCrest(-f*5,-10,.6,c.crest,c.trim);
  ell(f*12,-17,3.8,5.8,'#fbfaf6');ell(f*15.5,-21.5,4.8,3.1,'#fbfaf6');ell(f*16.6,-22.4,1,1,'#111');line(f*10,-22,f*11.5,-14,'#e6dcc0',2);poly([f*12,-24,f*13,-29,f*14.5,-24],c.trim);
  ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(-f*1,-29);ctx.quadraticCurveTo(-f*10,-23+g,-f*12,-12);ctx.lineTo(-f*3,-14);ctx.closePath();ctx.fill();ctx.strokeStyle=c.trim;ctx.lineWidth=1;ctx.stroke();
  rect(-3.6,-29,7.2,13,'#e2e7ee');rect(-3.6,-29,2,13,'#ffffff');rect(-3,-25,6,5,c.col);line(-3,-20.5,3,-20.5,c.trim,1);
  ell(0,-32,3.5,3.5,'#e8ecf2');ell(f*1.2,-31.6,1.8,2,'#f0c8a0');
  poly([-3.8,-34.5,3.8,-34.5,3.8,-38.4,1.9,-36.4,0,-39.6,-1.9,-36.4,-3.8,-38.4],'#ffd23a');ell(0,-35.6,.8,.8,'#e33');
  if(ch){line(-f*6,-22,f*40,-19,'#d8c090',2.6);poly([f*40,-20.6,f*45,-19,f*40,-17.4],'#eef');poly([f*30,-19.5,f*22,-17,f*30,-15],c.col);}
  else{line(-f*3,-18,f*18,-50,'#d8c090',2.2);poly([f*18,-50,f*12,-46,f*16.6,-47.8],'#eef');poly([f*16.4,-47,f*7,-44,f*14.6,-42.6],c.col);}
  if(sh){ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(f*5,-31);ctx.lineTo(f*15,-31);ctx.lineTo(f*15,-22);ctx.lineTo(f*10,-15);ctx.lineTo(f*5,-22);ctx.closePath();ctx.fill();
    ctx.fillStyle=c.col;ctx.beginPath();ctx.moveTo(f*6,-30);ctx.lineTo(f*14,-30);ctx.lineTo(f*14,-22.5);ctx.lineTo(f*10,-16.5);ctx.lineTo(f*6,-22.5);ctx.closePath();ctx.fill();drawCrest(f*10,-25,.75,c.crest,c.trim);}
  else{ctx.fillStyle=c.trim;ctx.beginPath();ctx.moveTo(-f*2,-27);ctx.lineTo(-f*8,-27);ctx.lineTo(-f*8,-22);ctx.lineTo(-f*5,-18);ctx.lineTo(-f*2,-22);ctx.closePath();ctx.fill();ctx.fillStyle=c.col;ctx.fillRect(f>0?-7.4:2.6,-26.4,4.8,3.6);}
  ctx.restore();
  const ty=y-72,w=70;rect(x-w/2-1,ty-1,w+2,7,'#000');rect(x-w/2,ty,w,5,'#401010');rect(x-w/2,ty,w*Math.max(0,u.hp/u.maxHp),5,u.hp>u.maxHp*.3?'#ffc23a':'#ff5a3a');
  txt(`👑 ${c.name||'Prince'}`,x,ty-5,11,'#fff4c0','center',true);if(u.hp<=u.maxHp*.3)txt('weak! gobble him!',x,ty+16,10,'#ffb08a','center',true);}
const _drawKnightPR=drawKnight;drawKnight=function(u){if(u.isPrince&&u.prince){drawPrince(u);return;}_drawKnightPR(u);if(u.prince&&u.prFlag)drawPrinceFlag(u);};
// big gold-trimmed royal banners among the trophies
const _drawTrophyPR=drawTrophy;drawTrophy=function(f){if(!f.big)return _drawTrophyPR(f);ctx.save();
  const gl=.35+.2*Math.sin(G.t*2.4+f.ph);ell(f.x,f.y+1,16,6,`rgba(255,210,60,${gl})`);
  ctx.translate(f.x,f.y);ctx.scale(1.6,1.6);ctx.translate(-f.x,-f.y);_drawTrophyPR(Object.assign({},f,{trim:'#ffd23a'}));
  ell(f.x,f.y-56,3.4,3.4,'#ffd23a');poly([f.x-3,f.y-58,f.x+3,f.y-58,f.x+3,f.y-61,f.x+1.5,f.y-59.5,f.x,f.y-62,f.x-1.5,f.y-59.5,f.x-3,f.y-61],'#ffd23a');ctx.restore();};
// world: landing beacon + swimmers clinging to barrels
const _drawCrashFxPR=drawCrashFx;drawCrashFx=function(){_drawCrashFxPR();const c=PRN.cur;
  if(c&&!c.done&&(c.phase==='warn'||(c.phase==='sail'&&!c.landed))){const L=c.land.L,p=.5+.5*Math.sin(G.t*4);ctx.strokeStyle=c.col;ctx.lineWidth=4;ctx.globalAlpha=.5+.4*p;ctx.beginPath();ctx.ellipse(L.x,L.y,60+p*18,24+p*7,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;
    line(L.x,L.y,L.x,L.y-60,'#6a4a28',2.5);poly([L.x,L.y-60,L.x+26,L.y-54,L.x,L.y-46],c.col);txt('⚓ Royal landing',L.x,L.y+44,13,'#ffe08a','center',true);}
  for(const w of PRN.swim){if(w.t<0)continue;const a=Math.max(0,Math.min(1,(7-w.t)/1.5)),x=w.x,y=w.y,bb=Math.sin(G.t*6+w.ph)*2;ctx.globalAlpha=a;
    for(let i=0;i<2;i++){const rr=(G.t*26+i*12+w.ph*9)%24+6;ctx.strokeStyle=`rgba(230,245,255,${.55-rr/50})`;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x,y,rr,rr*.4,0,0,TAU);ctx.stroke();}
    ell(x+7,y+bb*.5,7,5,'#8a5a2a');line(x+1,y+bb*.5,x+13,y+bb*.5,'#5a3a1a',1.2);ell(x,y-6+bb,5,5,'#f0c8a0');ctx.fillStyle='#9aa2ac';ctx.beginPath();ctx.arc(x,y-7+bb,5.4,Math.PI,0);ctx.fill();
    line(x-5,y-3+bb,x-10,y-12+Math.sin(G.t*14+w.ph)*4,'#9aa2ac',2.2);ctx.globalAlpha=1;}};
// HUD: boss bar at the top of the screen
function princeHudRect(){const sm=VW<760,tch=typeof TOUCH!=='undefined'&&TOUCH.on,y=sm?(tch?120:56):104+(typeof gateBroken==='function'&&gateBroken()?24:0),w=Math.min(VW-20,sm?420:520);return{x:VW/2-w/2,y,w,h:sm?30:34};}
const _drawHUDPR=drawHUD;drawHUD=function(){_drawHUDPR();if(!princeHudOn()||G.over||G.won)return;ctx.setTransform(DPR,0,0,DPR,0,0);
  const c=PRN.cur,B=princeHudRect(),sm=VW<760,pl=.8+.2*Math.sin(G.t*4);ctx.fillStyle=`rgba(28,14,38,${.88*pl+.08})`;ctx.fillRect(B.x,B.y,B.w,B.h);ctx.strokeStyle=c.trim;ctx.lineWidth=2;ctx.strokeRect(B.x+1,B.y+1,B.w-2,B.h-2);
  ctx.fillStyle=c.col;ctx.fillRect(B.x+4,B.y+4,B.h-8,B.h-8);drawCrest(B.x+B.h/2,B.y+B.h/2,sm?1.5:1.8,c.crest,c.trim);
  const bx=B.x+B.h+2,bw=B.w-B.h-8,by=B.y+B.h-12;txt(`👑 ${c.name}`,bx,B.y+(sm?12:14),sm?10:12,'#ffe8b0','left',true);
  let frac=0,lab='',col='#ffc23a';const afloat=c.fleet.filter(s=>s.state==='sail').length,aboard=c.fleet.reduce((a,s)=>a+(s.state==='sail'?s.cargo.length:0),0);
  if(c.phase==='warn'){frac=c.t/PRN_WARN;lab=`War drums! The fleet sails in ${Math.ceil(c.t)} s  ·  ⚓ southern shore`;col='#c8a0ff';}
  else if(c.boss&&!c.boss.dead){const u=c.boss;frac=u.hp/u.maxHp;lab=`${Math.ceil(u.hp)} / ${u.maxHp}${frac<=.3?'  ·  weak: gobble him!':''}${afloat?'  ·  '+afloat+' ship'+(afloat>1?'s':'')+' still at sea':''}`;col=frac>.3?'#ffc23a':'#ff5a3a';}
  else{const hp=c.fleet.reduce((a,s)=>a+(s.state==='sail'?s.hp:0),0),mx=c.fleet.reduce((a,s)=>a+s.maxHp,0);frac=mx?hp/mx:0;lab=`${afloat} warship${afloat===1?'':'s'} afloat  ·  ${aboard} soldiers aboard  ·  sink them before they land!`;col='#5ab0ff';}
  rect(bx,by,bw,8,'#2a0c0c');rect(bx,by,bw*Math.max(0,Math.min(1,frac)),8,col);ctx.strokeStyle=c.trim;ctx.lineWidth=1;ctx.strokeRect(bx+.5,by+.5,bw-1,7);
  txt(lab,bx+bw,B.y+(sm?12:14),sm?9:10,'#fff','right',true);};
// map + minimap: landing spot, warships and the prince
const _drawMapPR=drawMap;drawMap=function(mmx,mmy,mmw,big){_drawMapPR(mmx,mmy,mmw,big);const c=PRN.cur;if(!c||c.done||c.phase==='pre')return;const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,pl=Math.sin(Date.now()/200)>0;
  const L=c.land.L;if(!c.landed||c.phase!=='over'){ctx.beginPath();ctx.arc(X(L.x),Y(L.y),big?7:4,0,TAU);ctx.fillStyle=pl?c.col:c.trim;ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();
    txt('⚓',X(L.x),Y(L.y)+(big?20:11),big?14:9,'#ffe08a','center',true);if(big)txt(`${c.short}'s landing`,X(L.x)+12,Y(L.y)-6,10,'#ffe08a','left',true);}
  for(const w of c.fleet)if(w.state!=='sink'){ctx.fillStyle=c.col;ctx.fillRect(X(w.x)-(big?4:2.5),Y(w.y)-(big?2:1.5),big?8:5,big?4:3);ctx.fillStyle=c.trim;ctx.fillRect(X(w.x)-.5,Y(w.y)-(big?7:4),1,big?5:3);}
  for(const u of c.members)if(!u.dead&&!u.isPrince){ctx.fillStyle=c.col;ctx.fillRect(X(u.x)-1,Y(u.y)-1,2,2);}
  const b=c.boss;if(b&&!b.dead){ctx.beginPath();ctx.arc(X(b.x),Y(b.y),big?5:3,0,TAU);ctx.fillStyle='#ffd23a';ctx.fill();ctx.strokeStyle=c.col;ctx.lineWidth=1.5;ctx.stroke();if(big)txt(`👑 ${c.short}`,X(b.x)+10,Y(b.y)+4,10,'#ffe08a','left',true);}};
// ---- sounds: a royal horn call and booming war drums ----
SFX_DEF.princeHorn=(a,B,o,t)=>{[[0,.28,0],[.3,.28,4],[.6,.28,7],[.9,.9,12]].forEach(([dt,len,st])=>{const f=233*Math.pow(2,st/12);osc(a,o,t+dt,'sawtooth',f,f*1.002,len,.15,.03);osc(a,o,t+dt,'triangle',f*2,f*2.003,len,.06,.03);});return 1.9;};
SFX_DEF.warDrum=(a,B,o,t)=>{osc(a,o,t,'sine',110,42,.38,.7,.004);nz(a,B,o,t,.16,'lowpass',420,90,1,.45);osc(a,o,t+.2,'sine',96,40,.3,.45,.004);return .5;};
// ---- after landing, the prince and his whole army HUNT the dragon wherever it is (one group, in formation) ----
// Every ~1.2 s the hunt target is the dragon's position (or the nearest dry ground to it, never water). Long legs follow King William's
// roads (roadPath); short legs go straight if the line is dry. His army is separate from the soldier waves: they don't count toward
// wave reinforcements and beating them doesn't raise the WANTED meter, so regular waves still only come from the wanted level.
const PR_HUNT={every:1.2,move:160,road:650};
function prLineDry(a,b){const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/50));for(let i=1;i<=n;i++){const x=a.x+(b.x-a.x)*i/n,y=a.y+(b.y-a.y)*i/n;if(soldierWet(x,y))return false;}return true;}
function prHuntTarget(){let T={x:D.x,y:D.y};if(soldierWet(T.x,T.y)){const q=typeof dryNear==='function'?dryNear(T.x,T.y):null;if(q)T={x:q.x,y:q.y};else return null;}
  T.x=clamp(T.x,WX0+60,WX1-60);T.y=clamp(T.y,WY0+60,WY1-60);return T;}
function prHuntPath(from,T){let P=[];const far=Math.hypot(T.x-from.x,T.y-from.y)>PR_HUNT.road;
  if(far||!prLineDry(from,T)){const rp=typeof roadPath==='function'?roadPath(from.x,from.y,T.x,T.y):null;
    if(rp&&rp.P&&rp.P.length){for(const p of rp.P){const l=P[P.length-1]||from;if(Math.hypot(p.x-l.x,p.y-l.y)>40)P.push({x:p.x,y:p.y});}
      // skip road points behind us
      while(P.length>1&&Math.hypot(P[1].x-from.x,P[1].y-from.y)<Math.hypot(P[0].x-from.x,P[0].y-from.y)&&prLineDry(from,P[1]))P.shift();}}
  P.push({x:T.x,y:T.y});return P;}
function prHunt(c,dt){const b=c.boss;if(!b||b.dead||c.done)return;c.huntT=(c.huntT||0)-dt;if(c.huntT>0&&c.path&&c.path.length)return;c.huntT=PR_HUNT.every;
  const T=prHuntTarget();if(!T)return;if(c.hunt&&c.path&&c.path.length&&Math.hypot(T.x-c.hunt.x,T.y-c.hunt.y)<PR_HUNT.move)return;
  c.hunt=T;c.path=prHuntPath(b,T);c.hunts=(c.hunts||0)+1;}
{const _u=updPrince;updPrince=function(dt){const r=_u.apply(this,arguments);const c=PRN.cur;if(c&&!c.done&&c.boss&&!c.boss.dead&&scene==='play'&&G&&!G.over)prHunt(c,dt);return r;};}
// never step into water: if the next leg is wet, re-path along the roads
{const _b=princeBoss;princeBoss=function(u,dt){const c=u.prince,p=c&&c.path&&c.path[0];
  if(p){const a=Math.atan2(p.y-u.y,p.x-u.x),nx=u.x+Math.cos(a)*30,ny=u.y+Math.sin(a)*30;if(soldierWet(nx,ny)&&!c.wetFix){c.wetFix=1;c.path=prHuntPath(u,c.path[c.path.length-1]);c.huntT=PR_HUNT.every;}else if(!soldierWet(nx,ny))c.wetFix=0;}
  const ox=u.x,oy=u.y,r=_b.apply(this,arguments);if(soldierWet(u.x,u.y)&&!soldierWet(ox,oy)){u.x=ox;u.y=oy;}return r;};}
// the prince's army is not part of the wanted-level waves: its casualties don't raise the wanted meter
let PR_NOALARM=0;
{const _a=addAlarm;addAlarm=function(v){if(PR_NOALARM&&v>0){G.prAlarmSkipped=(G.prAlarmSkipped||0)+v;return;}return _a.apply(this,arguments);};}
{const _h=hurtUnit;hurtUnit=function(u){if(u&&u.prince){PR_NOALARM++;try{return _h.apply(this,arguments);}finally{PR_NOALARM--;}}return _h.apply(this,arguments);};}
{const _e=eatUnit;eatUnit=function(u){if(u&&u.prince){PR_NOALARM++;try{return _e.apply(this,arguments);}finally{PR_NOALARM--;}}return _e.apply(this,arguments);};}
