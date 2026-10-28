// ================= partV: the volcano beside Dragon Peak, and LAVA SHOTS =================
// Land beside the crater and drink (E / pad X / touch BITE) to swap fire breath for 20 lava globs.
// Each fire press lobs a glob that arcs, splashes, burns harder, cracks stone and wells, and leaves a puddle.
const VOLC={x:LAIR.x+560,y:LAIR.y+260,r:96,drinkR:165},LAVA_MAX=20,LAVA_CD=8,LAVA_REPEAT=.42;
// Lava tuning: shorter lob (old speed 520, up 230), wider splash (old 80), and a cooling puddle that keeps hurting enemies.
const LAVA_CFG={sp:380,vz:180,splashR:130,scorchR:70,puddleR:[62,74],puddleT:5.5,crustAt:.12,tick:.25,unitDmg:2,structDmg:1.5,maxPuddles:24};
// the puddle never hurts the dragon (not a unit), King William or Princess Elizabeth
function lavaSafe(u){return !u||u.dead||u.inside||u.princess||u.isPrincess||u.type==='princess';}
// King William CAN be hurt by a puddle: in armour through his armour's fire multiplier (partKA), unarmoured (courtyard) straight off his HP.
// His HP floor still holds either way, so he is never knocked out of the game.
function lavaKing(p,d){if(typeof KA==='undefined'||typeof KING==='undefined'||KA.u)return;if(!(KA.phase==='home'||KA.phase==='toArmory'||KA.phase==='toHome'||KA.phase==='suit'))return;
  if(Math.hypot(KING.x-p.x,KING.y-p.y)>=p.r+6)return;const mx=KA.maxHp||kaStats().hp;KA.maxHp=mx;if(!(KA.hp>0))KA.hp=mx;KA.hp=Math.max(mx*KA_CFG.floor,KA.hp-d);KA.lavaHp=KA.hp;
  if(G.t-(KA.hopT||-9)>1.5){KA.hopT=G.t;float(KING.x,KING.y-50,'King William: "Hot! Hot! HOT!"','#ffb070');}}
let LGLOBS=[],LPUDDLES=[],LEMBERS=[],VOLC_T={erupt:6,smoke:0,warn:0};
function clearVolcanoSite(){const far=o=>Math.hypot(o.x-VOLC.x,(o.y-VOLC.y)*1.25)>300;
  DECOR=DECOR.filter(o=>o.k!=='peak'||!(Math.abs(o.x-VOLC.x)<o.w*.5+300&&o.y>VOLC.y-260&&o.y<VOLC.y+560));
  if(trees)trees=trees.filter(far);for(let i=ROCKS.length-1;i>=0;i--)if(!far(ROCKS[i]))ROCKS.splice(i,1);}
const _newGameV=newGame;newGame=function(opt){const r=_newGameV(opt);clearVolcanoSite();LGLOBS=[];LPUDDLES=[];LEMBERS=[];VOLC_T={erupt:6,smoke:0,warn:0};
  if(D){D.lava=0;D.lavaCD=0;D.lavaRep=0;D.lavaHeld=false;}return r;};
function nearLava(){return D&&D.mode==='ground'&&D.alt<.3&&!D.swim&&Math.hypot(D.x-VOLC.x,D.y-VOLC.y)<VOLC.drinkR;}
// returns true when the eat press was used for drinking
function lavaDrink(){if(!nearLava())return false;
  if(D.lavaCD>0){float(D.x,D.y-90,`The lava is still bubbling up... ${Math.ceil(D.lavaCD)}s`,'#ffb070');D.eatCD=.3;return true;}
  if(D.lava>=LAVA_MAX){float(D.x,D.y-90,'Already full of lava!','#ffb070');D.eatCD=.3;return true;}
  D.lava=LAVA_MAX;D.lavaCD=LAVA_CD;D.eatCD=.6;D.eatT=.4;G.stats.lava=(G.stats.lava||0)+1;
  float(D.x,D.y-100,`GLUG GLUG! Lava: ${LAVA_MAX} shots`,'#ffcf4a');SFX.play('lavaGulp',D.x,D.y,1);rumble&&rumble(.5,.4,200);
  for(let i=0;i<18;i++)LEMBERS.push({x:VOLC.x+R(-40,40),y:VOLC.y+R(-15,15),z:R(0,10),vx:R(-60,60),vy:R(-30,30),vz:R(120,260),t:R(.6,1.1)});
  if(!G.seenLava){G.seenLava=true;showToast('Lava shots! Each fire press lobs a lava glob: it cracks stone, wells and soldiers alike.');}
  return true;}
function mouthPos(){const ca=Math.cos(D.ang),sa=Math.sin(D.ang);return{x:D.x+ca*105,y:D.y+sa*105,z:heightOf()+18};}
// called every frame from the fire code while the dragon has lava
function lavaFire(dt){const held=!!(keys[' ']||GPAD.fire);D.lavaRep-=dt;
  const go=held&&(!D.lavaHeld||D.lavaRep<=0);D.lavaHeld=held;if(!go)return;D.lavaRep=LAVA_REPEAT;
  const m=mouthPos(),ca=Math.cos(D.ang),sa=Math.sin(D.ang),sp=LAVA_CFG.sp;
  LGLOBS.push({x:m.x,y:m.y,z:m.z,vx:ca*sp+D.vx*.6,vy:sa*sp+D.vy*.6,vz:LAVA_CFG.vz,t:0,rot:R(0,TAU)});
  D.lava--;SFX.play('lavaSpit',m.x,m.y,.9);puff(m.x,m.y,4,'rgba(90,60,50,',60,7);
  if(D.lava<=0){D.lava=0;float(D.x,D.y-90,'Out of lava: back to fire breath','#ffd8a0');}}
function lavaSplash(x,y){const wet=inWater(x,y)&&!onBridge(x,y),r=LAVA_CFG.splashR;G.shake=Math.max(G.shake,5);
  if(wet){SFX.play('lavaHiss',x,y,1);puff(x,y,14,'rgba(230,230,240,',110,14);
    for(const s of ships)if(s.state!=='sink'&&Math.hypot(s.x-x,s.y-y)<r+40){s.fire=1;s.fireT=s.fireT||0;hurtShip(s,70,'fire');}
    for(const u of units)if(!u.dead&&Math.hypot(u.x-x,u.y-y)<r)hurtUnit(u,25,'fire');addAlarm(.3,x,y);return;}
  SFX.play('lavaSplash',x,y,1);scorch(x,y,LAVA_CFG.scorchR);puff(x,y,10,'rgba(80,60,50,',120,12);
  for(let i=0;i<14;i++)LEMBERS.push({x,y,z:4,vx:R(-160,160),vy:R(-110,110),vz:R(80,240),t:R(.4,.8)});
  LPUDDLES.push({x,y,r:R(LAVA_CFG.puddleR[0],LAVA_CFG.puddleR[1]),t:LAVA_CFG.puddleT,max:LAVA_CFG.puddleT,tick:0,seed:Math.random()*99,lava:1});if(LPUDDLES.length>LAVA_CFG.maxPuddles)LPUDDLES.splice(0,LPUDDLES.length-LAVA_CFG.maxPuddles);
  fireFlora(x,y);
  for(const t of trees)if(t.state==='ok'&&Math.hypot(t.x-x,t.y-y)<r){t.fire=1;t.hp-=30;}
  HEAVY=true;
  for(const s of structures){if(s.state==='ruin'||Math.hypot(s.x-x,s.y-y)>r+22)continue;
    if(stoneish(s)){s.weak=3;hurtStruct(s,s.kind==='well'||s.kind==='fountain'?45:55);if(rnd()<.6)puff(s.x,s.y-10,5,'rgba(150,140,130,',80,8);}
    else{if(!s.fire){s.fire=1;addAlarm(.8,s.x,s.y);}hurtStruct(s,60);}}
  HEAVY=false;
  for(const c of cells)if(!c.burnt&&c.growth>.15&&Math.hypot(c.x-x,c.y-y)<r)c.fire=1;
  for(const c of carts)if(!c.wrecked&&Math.hypot(c.x-x,c.y-y)<r)c.fire=1;
  for(const g of siege)if(!g.dead&&Math.hypot(g.x-x,g.y-y)<r+20){g.fire=1;hurtSiege(g,70);}
  for(const u of units)if(!u.dead&&!u.inside&&Math.hypot(u.x-x,u.y-y)<r){u.burn=u.type==='sea'?0:2.4;hurtUnit(u,30,'fire');}
  addAlarm(.4,x,y);}
function updVolcano(dt){if(!G||!D)return;D.lavaCD=Math.max(0,(D.lavaCD||0)-dt);
  for(const g of LGLOBS){g.t+=dt;g.x+=g.vx*dt;g.y+=g.vy*dt;g.vz-=900*dt;g.z+=g.vz*dt;g.rot+=dt*8;if(g.z<=0){g.dead=true;lavaSplash(g.x,g.y);}}
  LGLOBS=LGLOBS.filter(g=>!g.dead&&g.t<4);
  if(LPUDDLES.length>LAVA_CFG.maxPuddles)LPUDDLES.splice(0,LPUDDLES.length-LAVA_CFG.maxPuddles);
  for(const p of LPUDDLES){p.t-=dt;p.tick-=dt;if(p.tick<=0&&p.t>p.max*LAVA_CFG.crustAt){p.tick=LAVA_CFG.tick;const tk=LAVA_CFG.tick;
    // hot lava: small steady damage per second to enemies standing in it, until it crusts over
    for(const u of units)if(!lavaSafe(u)&&Math.hypot(u.x-p.x,u.y-p.y)<p.r+6){if(!p.lava)u.burn=Math.max(u.burn||0,1.2);else if(rnd()<.3)flame(u.x,u.y,6);hurtUnit(u,(p.lava?LAVA_CFG.unitDmg:5),u.isKingArmor?'lava':'fire');}
    if(p.lava)lavaKing(p,LAVA_CFG.unitDmg);
    for(const s of structures)if(s.state!=='ruin'&&Math.hypot(s.x-p.x,s.y-p.y)<p.r+16){if(!stoneish(s))s.fire=1;if(p.lava)hurtStruct(s,LAVA_CFG.structDmg);}
    for(const t of trees)if(t.state==='ok'&&!t.fire&&Math.hypot(t.x-p.x,t.y-p.y)<p.r+8)t.fire=1;}}
  LPUDDLES=LPUDDLES.filter(p=>p.t>0);
  for(const e of LEMBERS){e.t-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.vz-=520*dt;e.z=Math.max(0,e.z+e.vz*dt);if(e.z<=0){e.vx*=.6;e.vy*=.6;}}
  LEMBERS=LEMBERS.filter(e=>e.t>0);if(LEMBERS.length>260)LEMBERS.splice(0,LEMBERS.length-260);
  // the volcano itself: smoke and the occasional (harmless, cartoony) ember eruption
  const near=Math.abs(cam.x-VOLC.x)<1600&&Math.abs(cam.y-VOLC.y)<1200;
  VOLC_T.smoke-=dt;if(near&&VOLC_T.smoke<=0){VOLC_T.smoke=.18;parts.push({x:VOLC.x+R(-30,30),y:VOLC.y+R(-10,6),z:R(10,30),vx:R(-10,25),vy:R(-14,-4),vz:R(30,55),life:R(2.2,3.4),max:3.4,size:R(10,18),kind:'smoke',col:'rgba(70,64,64,'});}
  VOLC_T.erupt-=dt;if(VOLC_T.erupt<=0){VOLC_T.erupt=R(10,18);VOLC_T.warn=1.4;
    if(near){SFX.play('erupt',VOLC.x,VOLC.y,1);G.shake=Math.max(G.shake,Math.hypot(D.x-VOLC.x,D.y-VOLC.y)<700?6:2);
      for(let i=0;i<46;i++){const a=R(0,TAU),s=R(30,190);LEMBERS.push({x:VOLC.x+R(-20,20),y:VOLC.y+R(-8,8),z:20,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:R(260,520),t:R(1.2,2.4)});}
      for(let i=0;i<12;i++)parts.push({x:VOLC.x+R(-40,40),y:VOLC.y,z:R(20,60),vx:R(-30,30),vy:R(-20,0),vz:R(60,110),life:R(2,3),max:3,size:R(16,26),kind:'smoke',col:'rgba(60,52,52,'});}}
  VOLC_T.warn=Math.max(0,VOLC_T.warn-dt);}
const _updPartsV=updParts;updParts=function(dt){_updPartsV(dt);if(scene==='play'&&!paused)updVolcano(dt);};
// ---------- drawing ----------
function drawVolcano(){if(Math.abs(cam.x-VOLC.x)>1900||Math.abs(cam.y-VOLC.y)>1400)return;const x=VOLC.x,y=VOLC.y,t=G?G.t:0,pl=.5+.5*Math.sin(t*2.3);
  ell(x+10,y+150,270,70,'rgba(0,0,0,.2)');
  // chunky cartoon cone: base below the crater, dark rock with lighter ridges and glowing lava runs
  poly([x-270,y+150,x-170,y+40,x-105,y-12,x+105,y-12,x+175,y+40,x+275,y+150,x+120,y+182,x-130,y+180],'#4b3f3d');
  poly([x-270,y+150,x-170,y+40,x-105,y-12,x-40,y-8,x-90,y+60,x-120,y+176,x-130,y+180],'#5d504c');
  poly([x+105,y-12,x+175,y+40,x+275,y+150,x+200,y+168,x+130,y+80],'#3a302f');
  ctx.strokeStyle='#2a2120';ctx.lineWidth=4;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-270,y+150);ctx.lineTo(x-170,y+40);ctx.lineTo(x-105,y-12);ctx.moveTo(x+105,y-12);ctx.lineTo(x+175,y+40);ctx.lineTo(x+275,y+150);ctx.stroke();
  for(const [a,b,c,d] of [[-30,8,-62,120],[44,6,70,128],[5,10,-8,90]]){ctx.strokeStyle=`rgba(255,${110+60*pl|0},30,.85)`;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x+a,y+b);ctx.quadraticCurveTo(x+(a+c)/2+12,y+(b+d)/2,x+c,y+d);ctx.stroke();ctx.strokeStyle='rgba(255,230,120,.8)';ctx.lineWidth=2.5;ctx.stroke();}
  // crater rim + lava pool
  ell(x,y,VOLC.r+18,46,'#2e2524');ell(x,y-2,VOLC.r+8,40,'#6a5a55');
  const gr=ctx.createRadialGradient(x,y,6,x,y,VOLC.r);gr.addColorStop(0,'#fff3a0');gr.addColorStop(.45,`rgb(255,${150+50*pl|0},40)`);gr.addColorStop(1,'#c2360e');
  ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(x,y,VOLC.r,34,0,0,TAU);ctx.fill();
  for(let i=0;i<5;i++){const a=t*.7+i*1.3,bx=x+Math.cos(a)*55,by=y+Math.sin(a*1.4)*14,br=5+4*Math.abs(Math.sin(t*3+i));ell(bx,by,br,br*.6,'rgba(255,240,150,.9)');ell(bx,by,br*.45,br*.3,'#ff9a20');}
  ctx.globalCompositeOperation='lighter';const g2=ctx.createRadialGradient(x,y,10,x,y,190);g2.addColorStop(0,`rgba(255,120,30,${.32+.2*pl+.4*VOLC_T.warn})`);g2.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(x,y,190,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
  if(D&&D.lava<LAVA_MAX&&Math.hypot(D.x-x,D.y-y)<500){ctx.globalAlpha=.6+.3*pl;ctx.strokeStyle='#ffe08a';ctx.setLineDash([10,8]);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,VOLC.drinkR,VOLC.drinkR*.5,0,0,TAU);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}
  txt('Mount Cinder',x,y+205,13,'#ffcf9a','center');}
function drawLavaGround(){
  for(const p of LPUDDLES){if(Math.abs(p.x-cam.x)>1700||Math.abs(p.y-cam.y)>1300)continue;
    const k=clamp(p.t/p.max,0,1),hot=clamp((k-LAVA_CFG.crustAt)/(1-LAVA_CFG.crustAt),0,1),a=Math.min(1,p.t*1.2),r=p.r;
    // cools from bright orange to a dark crust: glow fades, the crust darkens and cracks close up
    ctx.globalAlpha=a;ell(p.x,p.y+2,r*1.05,r*.58,'rgba(30,18,14,.55)');
    ell(p.x,p.y,r,r*.55,`rgb(${50+190*hot|0},${28+70*hot|0},${18+6*hot|0})`);
    if(hot>0){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(p.x,p.y,2,p.x,p.y,r*1.3);g.addColorStop(0,`rgba(255,150,40,${.45*hot})`);g.addColorStop(1,'rgba(255,60,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p.x,p.y,r*1.3,r*.75,0,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
      ell(p.x-r*.12,p.y-2,r*.66,r*.33,`rgba(255,${140+90*hot|0},40,${hot})`);ell(p.x+r*.2,p.y-4,r*.2,r*.1,`rgba(255,250,180,${hot})`);}
    // crust plates spreading as it cools
    const cr=1-hot,sd=p.seed||0;ctx.strokeStyle=`rgba(${20+60*hot|0},${12+20*hot|0},10,${.3+.6*cr})`;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<6;i++){const an=sd+i*1.05,l=r*(.35+.5*cr);ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+Math.cos(an)*l,p.y+Math.sin(an)*l*.55);}ctx.stroke();
    ctx.globalAlpha=1;}}
function drawLavaAir(){ctx.globalCompositeOperation='lighter';
  for(const e of LEMBERS){const a=clamp(e.t*1.4,0,1);ctx.fillStyle=`rgba(255,${120+Math.random()*100|0},30,${a})`;ctx.beginPath();ctx.arc(e.x,e.y-e.z,3.2,0,TAU);ctx.fill();}
  ctx.globalCompositeOperation='source-over';
  for(const g of LGLOBS){ell(g.x,g.y,10,5,'rgba(0,0,0,.25)');const sy=g.y-g.z;
    ctx.globalCompositeOperation='lighter';const gg=ctx.createRadialGradient(g.x,sy,2,g.x,sy,26);gg.addColorStop(0,'rgba(255,200,80,.7)');gg.addColorStop(1,'rgba(255,80,0,0)');ctx.fillStyle=gg;ctx.beginPath();ctx.arc(g.x,sy,26,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
    ctx.fillStyle='#c8320c';ctx.beginPath();ctx.arc(g.x,sy,11,0,TAU);ctx.fill();ctx.fillStyle='#ff9a2a';ctx.beginPath();ctx.arc(g.x-2,sy-2,7.5,0,TAU);ctx.fill();ctx.fillStyle='#fff0a0';ctx.beginPath();ctx.arc(g.x-4,sy-4,3,0,TAU);ctx.fill();
    ctx.strokeStyle='#4a1a0a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(g.x,sy,11,0,TAU);ctx.stroke();}}
function drawMouthGlow(){if(!D||!(D.lava>0))return;const m=mouthPos(),sx=m.x-Math.cos(D.ang)*12,sy=m.y-m.z+14,t=G.t,f=.7+.3*Math.sin(t*9);
  ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(sx,sy,2,sx,sy,40*f);g.addColorStop(0,'rgba(255,230,120,.9)');g.addColorStop(.4,'rgba(255,120,20,.55)');g.addColorStop(1,'rgba(255,40,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(sx,sy,40*f,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';
  if(rnd()<.25)LEMBERS.push({x:m.x,y:m.y,z:m.z-4,vx:D.vx*.5+R(-20,20),vy:D.vy*.5+R(-20,20),vz:R(-40,10),t:R(.3,.6)});
  // prompt
}
const _drawDragonV=drawDragon;drawDragon=function(){_drawDragonV();drawMouthGlow();};
const _drawLairV=drawLair;drawLair=function(){_drawLairV();drawVolcano();drawLavaGround();};
const _drawCrashFxV=drawCrashFx;drawCrashFx=function(){_drawCrashFxV();drawLavaAir();
  if(scene==='play'&&nearLava()&&!G.over){const pl=.7+.3*Math.sin(G.t*5),msg=D.lavaCD>0?`Lava refilling... ${Math.ceil(D.lavaCD)}s`:D.lava>=LAVA_MAX?'Full of lava!':(TOUCH&&TOUCH.on?'Tap BITE to drink lava':'Drink lava: E  /  pad X');
    ctx.font='bold 15px Georgia';const w=ctx.measureText(msg).width+24;ctx.fillStyle=`rgba(60,16,6,${.75*pl})`;ctx.fillRect(D.x-w/2,D.y-heightOf()-150,w,26);txt(msg,D.x,D.y-heightOf()-132,15,'#ffd27a','center');}};
const _drawMapV=drawMap;drawMap=function(mmx,mmy,mmw,big){_drawMapV(mmx,mmy,mmw,big);const s=mmw/(WX1-WX0),X=mmx+(VOLC.x-WX0)*s,Y=mmy+(VOLC.y-WY0)*s;
  ctx.fillStyle='#3a2a26';ctx.beginPath();ctx.moveTo(X-(big?9:5),Y+(big?6:4));ctx.lineTo(X,Y-(big?9:5));ctx.lineTo(X+(big?9:5),Y+(big?6:4));ctx.fill();ctx.fillStyle=`rgba(255,${140+80*Math.sin(Date.now()/250)|0},40,1)`;ctx.beginPath();ctx.arc(X,Y-(big?6:3),big?3:2,0,TAU);ctx.fill();
  if(big)txt('Volcano',X,Y+18,10,'#ffb080','center',false);};
// ---------- HUD badge ----------
const _drawHUDV=drawHUD;drawHUD=function(){_drawHUDV();if(scene!=='play'||!D)return;const y=typeof UI!=='undefined'&&UI.colY?UI.colY:226; // next slot of the left HUD column
  if(D.lava>0){const pl=.75+.25*Math.sin(G.t*6);ctx.fillStyle=`rgba(90,24,8,${.85})`;ctx.fillRect(10,y,170,28);ctx.strokeStyle=`rgba(255,${150+80*pl|0},50,1)`;ctx.lineWidth=2;ctx.strokeRect(11,y+1,168,26);
    for(let i=0;i<LAVA_MAX;i++){ctx.fillStyle=i<D.lava?'#ff8a20':'#4a2a20';ctx.fillRect(98+i*4,y+9,3,10);}txt(`Lava: ${D.lava}`,18,y+19,14,'#ffd27a');if(UI.col)UI.col.h=Math.max(UI.col.h,y+28-UI.col.y);}
  else if(D.lavaCD>0){txt(`Volcano refills in ${Math.ceil(D.lavaCD)}s`,14,y+18,11,'#ffb080','left');if(UI.col)UI.col.h=Math.max(UI.col.h,y+22-UI.col.y);}};
// ---------- sounds ----------
Object.assign(SFX_DEF,{
  lavaSpit:(a,B,o,t)=>{osc(a,o,t,'sine',180,60,.18,.7,.01);nz(a,B,o,t,.25,'lowpass',900,200,1,.5);return .3;},
  lavaSplash:(a,B,o,t)=>{osc(a,o,t,'sine',110,40,.35,.8);nz(a,B,o,t,.6,'lowpass',1200,200,1,.6);nz(a,B,o,t+.1,.5,'highpass',2500,0,.6,.25);return .7;},
  lavaHiss:(a,B,o,t)=>{nz(a,B,o,t,.9,'highpass',3000,0,.8,.55);return .9;},
  lavaGulp:(a,B,o,t)=>{for(let i=0;i<3;i++)osc(a,o,t+i*.17,'sine',240-i*30,70,.16,.6,.02);nz(a,B,o,t+.5,.4,'lowpass',500,100,1,.3);return .9;},
  erupt:(a,B,o,t)=>{osc(a,o,t,'sine',55,28,1.2,.9,.05);nz(a,B,o,t,1.4,'lowpass',700,80,1,.8);for(let i=0;i<5;i++)nz(a,B,o,t+.2+Math.random()*.8,.08,'bandpass',1200+Math.random()*1500,0,4,.25);return 1.5;}});
