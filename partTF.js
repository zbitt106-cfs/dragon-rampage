// ======================= TERRITORIAL PACK LEADERS: the male lion (savanna prides) & the white alpha wolf (Deepwood packs) =======================
// One shared system: a leader guards the pack's home turf. When he spots the dragon in or near it he ROARS / HOWLS (visible rings + sound),
// every packmate drops whatever it is hunting and runs in to fight. Once the dragon has been away from the turf for a while they calm down.
// Cartoony only: nips, swipes and bonks, no gore.
const TF_L={
  lion:{flag:'male',hp:40,bite:5,cd:1.3,R:520,scale:1.22,call:'ROOOAAAR!',sfx:'roar',col:'#ffb060',ring:'255,190,90',key:'lionm',label:'Male lions',food:40,heal:40,
    who:'The male lion',say:'Big lion swipe!',calm:'The male lion shakes his mane and settles down',fresh:'A new male lion takes over the pride!'},
  wolf:{flag:'alpha',hp:30,bite:4,cd:1.2,R:480,scale:1.3,call:'AWOOOOOOO!',sfx:'howl',col:'#e8f4ff',ring:'220,235,255',key:'wolfa',label:'White alpha wolves',food:20,heal:20,
    who:'The white alpha',say:'Alpha bite!',calm:'The white alpha huffs and leads the pack back into the woods',fresh:'A new white alpha leads the pack!'}};
const TF_NEAR=180,TF_CALM=6,TF_LEASH=450,TF_NEWLEADER=60;
const TF={packs:{},t:0};
Object.assign(FOOD,{lionm:TF_L.lion.food,wolfa:TF_L.wolf.food});
if(typeof SFX_DEF!=='undefined'&&!SFX_DEF.howl)SFX_DEF.howl=(a,B,o,t)=>{osc(a,o,t,'sine',330,560,.75,.22,.18);osc(a,o,t+.7,'sine',560,380,1.1,.2,.06);osc(a,o,t,'triangle',165,280,.75,.06,.2);return 1.85;};
const tfIsLeader=u=>!!(u&&u.type==='animal'&&TF_L[u.species]&&u[TF_L[u.species].flag]);
const tfMembers=pk=>units.filter(v=>!v.dead&&v.type==='animal'&&v.pack===pk&&TF_L[v.species]);
function tfPack(u){let P=TF.packs[u.pack];const H=u.home;if(!P){P=TF.packs[u.pack]={alert:false,calm:0,roarT:-99,noL:0,sp:u.species};}
  if(H){P.cx=H.x+H.w/2;P.cy=H.y+H.h/2;}else if(P.cx===undefined){P.cx=u.x;P.cy=u.y;}return P;}
function tfMakeLeader(u){const L=TF_L[u.species];if(!L)return u;u[L.flag]=1;u.hp=u.maxHp=L.hp;return u;}
// ---- spawning: the lion pride's first lion is already the male (partSJ); every wolf pack gets an extra white alpha ----
{const _sp=spawnPride;spawnPride=function(sp,far){const n0=packId;const r=_sp.apply(this,arguments);if(sp==='lion'&&packId>n0)for(const u of units)if(u.pack===packId&&u.male)tfMakeLeader(u);return r;};}
{const _sw=spawnWild;spawnWild=function(sp,far,at){const n0=packId;const r=_sw.apply(this,arguments);
  if(sp==='wolf'&&packId>n0){const m=units.filter(u=>!u.dead&&u.pack===packId&&u.species==='wolf');if(m.length&&!m.some(u=>u.alpha)){const o=m[0];
    const a=mkUnit('animal',o.x+R(-20,20),o.y+R(-15,15),{species:'wolf',wild:true,zone:o.zone,home:o.home,strict:o.strict,hp:TF_L.wolf.hp,maxHp:TF_L.wolf.hp,free:true,pack:o.pack,t:R(0,3),jt:0});units.push(tfMakeLeader(a));}}
  return r;};}
// ---- the leader watches the turf ----
function tfCall(u,P){const L=TF_L[u.species];P.roarT=G.t;u.roarFx=1.6;
  float(u.x,u.y-48,L.call,L.col);if(typeof SFX!=='undefined')SFX.play(L.sfx,u.x,u.y,1);if(dist(u,D)<900)G.shake=Math.max(G.shake||0,4);
  if(u.species==='lion')G.tfRoars=(G.tfRoars||0)+1;else G.tfHowls=(G.tfHowls||0)+1;}
function tfAlarm(u,P){P.alert=true;P.calm=0;P.seenT=G.t;tfCall(u,P);
  for(const m of tfMembers(u.pack)){if(m===u)continue;
    if(m.hPrey){hnDrop(m);m.hRest=0;G.tfStopped=(G.tfStopped||0)+1;if(dist(m,D)<1100)float(m.x,m.y-30,'Hunt dropped!','#ffe0a0');}
    m.drink=null;m.full=0;m.tfCalled=G.t;m.state='hunt';G.tfCalled=(G.tfCalled||0)+1;}
  if(dist(u,D)<1100)float(u.x,u.y-66,`${TF_L[u.species].who} calls the ${u.species==='lion'?'pride':'pack'} to fight!`,'#fff2c0');}
function tfSpot(P,L){return !G.over&&!G.won&&D.alt<.6&&d2(D.x,D.y,P.cx,P.cy)<L.R+TF_NEAR;}
function tfLeaderTick(u,dt){const L=TF_L[u.species],P=tfPack(u);if(u.roarFx>0)u.roarFx-=dt;
  if(tfSpot(P,L)&&dist(u,D)<1100){P.seenT=G.t;P.calm=0;if(!P.alert)tfAlarm(u,P);else if(G.t-P.roarT>7)tfCall(u,P);}
  else if(P.alert){P.calm=G.t-(P.seenT===undefined?G.t:P.seenT);if(P.calm>=TF_CALM)tfStandDown(u.pack,u);}}
function tfStandDown(pk,ld){const P=TF.packs[pk];if(!P)return;P.alert=false;P.calm=0;
  for(const m of tfMembers(pk)){m.state='idle';m.tfBack=0;m.tgt=null;}if(ld&&dist(ld,D)<1300)float(ld.x,ld.y-40,TF_L[ld.species].calm,'#e0ffe0');}
// ---- called packmates (and the leader) fight the dragon inside the turf ----
function tfFight(u,dt,P){if(u.hPrey)hnDrop(u);if(u.burn>0||u.bolted>0)return false;const F=FAUNA[u.species],ld=tfIsLeader(u),L=TF_L[u.species],Z=ZONES[u.zone],ox=u.x,oy=u.y;
  u.cd=(u.cd||0)-dt;u.state='hunt';if(u.hPrey)hnDrop(u);
  if(u.tfBack>0){u.tfBack-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*.8,dt);}
  else{let tx=D.x,ty=D.y;const lim=L.R+TF_LEASH,dc=Math.hypot(tx-P.cx,ty-P.cy);if(dc>lim){tx=P.cx+(tx-P.cx)/dc*lim;ty=P.cy+(ty-P.cy)/dc*lim;}
    if(D.alt>=.5){const a=u.id*2.4+G.t*.6;tx+=Math.cos(a)*60;ty+=Math.sin(a)*40;}
    const dd=dist(u,D);if(dd>(ld?40:34)||D.alt>=.5)moveTo(u,tx,ty,F.sp*(ld?1.05:1.15),dt);
    else if(u.cd<=0&&D.alt<.5){const dmg=ld?L.bite:F.bite;u.cd=ld?L.cd:F.cd;hurtDragon(dmg,u.species);float(D.x+R(-20,20),D.y-90,`${ld?L.say:F.say.replace(/ -\d+$/,'')} -${Math.round(dmg*G.dmgMul)}`,'#ffb0a0');u.tfBack=ld?.6:.9;
      G.tfBites=(G.tfBites||0)+1;}}
  if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}return true;}
// the turf check runs once per frame per pack, before any packmate moves (so the call beats a packmate's own hunting logic)
function tfPackTick(u){let P=TF.packs[u.pack];if(P&&P.lt===G.t)return;let ld=P&&P.ld;
  if(!ld||ld.dead||ld.pack!==u.pack||!tfIsLeader(ld))ld=tfIsLeader(u)?u:units.find(v=>!v.dead&&v.pack===u.pack&&tfIsLeader(v));
  if(!ld){if(P)P.lt=G.t;return;}P=tfPack(ld);P.ld=ld;const fdt=Math.min(.5,Math.max(0,G.t-(P.lt===undefined?G.t:P.lt)));P.lt=G.t;tfLeaderTick(ld,fdt);}
{const _uw=updWild;updWild=function(u,dt){if(u&&!u.dead&&u.pack&&TF_L[u.species]){tfPackTick(u);const P=TF.packs[u.pack];
    if(P&&P.alert&&tfFight(u,dt,P))return;}return _uw(u,dt);};updWild._base=_uw._base;}
// a called packmate does not start a new hunt while the pack is fighting
{const _hs=hnStart;hnStart=function(p,T){const P=p&&p.pack&&TF_L[p.species]&&TF.packs[p.pack];if(P&&P.alert)return;return _hs.apply(this,arguments);};}
// ---- leaderless packs: after a while (dragon far away) a new leader joins ----
{const _uf=updFauna;updFauna=function(dt){_uf(dt);TF.t+=dt;if(TF.t<5)return;const st=TF.t;TF.t=0;const g={};
  for(const u of units)if(!u.dead&&u.type==='animal'&&u.pack&&TF_L[u.species]&&!u.bolted)(g[u.pack]||(g[u.pack]=[])).push(u);
  for(const pk in g){const m=g[pk],P=tfPack(m[0]);if(m.some(tfIsLeader)){P.noL=0;continue;}P.noL+=st;if(P.alert&&!m.some(tfIsLeader))tfStandDown(pk,null);
    if(P.noL>=TF_NEWLEADER&&dist(m[0],D)>800){const o=m[0],sp=o.species,L=TF_L[sp];
      const a=mkUnit('animal',o.x+R(-25,25),o.y+R(-15,15),{species:sp,wild:true,zone:o.zone,home:o.home,strict:o.strict,hp:L.hp,maxHp:L.hp,free:true,pack:o.pack,t:R(0,3),jt:0,face:rnd()<.5?1:-1});
      units.push(tfMakeLeader(a));P.noL=0;G.tfNewLeaders=(G.tfNewLeaders||0)+1;if(dist(o,D)<1400)float(o.x,o.y-40,L.fresh,'#ffe6a8');}}};}
// ---- a new game / a loaded game starts with calm packs (live animals are rebuilt on load, each pack with its leader) ----
{const _ng=newGame;newGame=function(){TF.packs={};TF.t=0;return _ng.apply(this,arguments);};}
// ---- Tally & food: leaders have their own Tally line ----
{const _tk=tallyKeyU;tallyKeyU=function(u){if(tfIsLeader(u))return TF_L[u.species].key;return _tk(u);};}
tallyAddSect('savanna','Animals · The savanna','🦓','#e8c860',[['lionm',TF_L.lion.label]]);
tallyAddSect('forest','Animals · The Deepwood','🦌','#7fcf8a',[['wolfa',TF_L.wolf.label]]);
{const _fh=furHi;furHi=function(u){if(tfIsLeader(u)&&u.species==='wolf')return;if(tfIsLeader(u)){const L=TF_L[u.species];ctx.save();ctx.translate(u.x,u.y);ctx.scale(L.scale,L.scale);ctx.translate(-u.x,-u.y);try{_fh(u);}finally{ctx.restore();}return;}_fh(u);};}
// ---- drawing: bigger leaders, a white wolf, roar / howl rings ----
function tfRings(u){const L=TF_L[u.species],k=1-(u.roarFx/1.6);if(!(u.roarFx>0))return;ctx.save();ctx.lineWidth=3;
  for(let i=0;i<3;i++){const t=k*1.4-i*.25;if(t<=0||t>1)continue;ctx.strokeStyle=`rgba(${L.ring},${(1-t)*.85})`;ctx.beginPath();ctx.ellipse(u.x+(u.face||1)*14,u.y-14,20+t*130,(20+t*130)*.55,0,0,TAU);ctx.stroke();}
  ctx.restore();}
function drawAlpha(u){const x=u.x,y=u.y,f=u.face||1,b=0,hunt=u.state==='hunt',a=u.anim||0,W='#f4f6fa',S='#c9d2de';
  const legs=lx=>line(x+lx,y-5,x+lx+Math.sin(a+lx)*1.5,y+1,'#aeb6c2',1.8);
  ell(x,y+1,11,3,'rgba(0,0,0,.2)');for(const lx of[-5,-2,3,6])legs(lx);ell(x,y-8-b,10.5,4.8,W);ell(x-f*2,y-6,7,2.4,S);ell(x+f*4,y-10,5,4.2,W);
  ell(x+f*10,y-10-b,4.2,3.5,W);poly([x+f*8,y-13-b,x+f*9,y-18.5-b,x+f*11,y-13-b],W);poly([x+f*12.5,y-9.5,x+f*15.5,y-8.6,x+f*12.5,y-7.6],S);ell(x+f*15,y-8.8,.9,.9,'#333');
  line(x-f*9,y-9-b,x-f*16,y-12-b+(hunt?-3:3),W,3.4);ell(x+f*11,y-11-b,1.3,1.1,hunt?'#4af':'#9cf');
  if(u.roarFx>0){line(x+f*12,y-12,x+f*13,y-19,'#fff',1);}}
{const _df=drawFauna;drawFauna=function(u){if(!tfIsLeader(u))return _df(u);const L=TF_L[u.species];tfRings(u);ctx.save();ctx.translate(u.x,u.y);ctx.scale(L.scale,L.scale);ctx.translate(-u.x,-u.y);
  try{if(u.species==='wolf')drawAlpha(u);else _df(u);}finally{ctx.restore();}};}
