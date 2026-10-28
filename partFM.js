// ======================= FIRE METER: fire breath has its own red bar (like flying stamina): drains while breathing, refills when you stop =======================
const FM={max:100,drain:9,regen:16,regenWait:.35,recover:25};
function fireInit(){D.fire=FM.max;D.maxFire=FM.max;D.fireOut=false;D.fireIdle=0;}
function updFireMeter(dt){if(D.maxFire===undefined)fireInit();
  if(D.breath){D.fire=Math.max(0,D.fire-FM.drain*(G.easy?.7:1)*dt);D.fireIdle=0;
    if(D.fire<=0&&!D.fireOut){D.fireOut=true;D.breath=false;G.fireOutT=G.t;float(D.x,D.y-90,'Out of fire! Catch your breath…','#ff9a8a');if(typeof SFX!=='undefined'&&SFX.play)SFX.play('hurt',D.x,D.y,.3);}}
  else{D.fireIdle=(D.fireIdle||0)+dt;if(D.fireIdle>FM.regenWait)D.fire=Math.min(D.maxFire,D.fire+FM.regen*dt);}
  if(D.fireOut&&D.fire>=FM.recover){D.fireOut=false;float(D.x,D.y-90,'Fire is back!','#ffb070');}}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!G.over&&!paused&&D)updFireMeter(dt);return r;};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);fireInit();return r;};}
// bar colour: red; flashes when empty; orange glow while lava shots are loaded
function fireBarCol(){if(D.lava>0){const p=.5+.5*Math.sin(G.t*7);return `rgb(255,${Math.round(120+50*p)},${Math.round(20+20*p)})`;}
  if(D.fireOut)return Math.floor(G.t*4)%2?'#ff4a3a':'#6a1410';return D.fire<25?(Math.floor(G.t*4)%2?'#e8302a':'#a01810'):'#d42a22';}
function fireBarLabel(){return D.lava>0?`Fire ${Math.ceil(D.fire)}  ·  🌋 LAVA ×${D.lava}`:D.fireOut?'Fire EMPTY: recovering…':`Fire ${Math.ceil(D.fire)}`;}
function drawFireBar(x,y,w,h){bar(x,y,w,h,D.fire/(D.maxFire||100),fireBarCol(),fireBarLabel());
  if(D.lava>0){ctx.save();ctx.shadowColor='#ff8a1a';ctx.shadowBlur=10;ctx.strokeStyle='rgba(255,170,60,.9)';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,w+2,h+2);ctx.restore();}
  else if(D.fireOut&&Math.floor(G.t*4)%2){ctx.strokeStyle='#ffd0c0';ctx.lineWidth=2;ctx.strokeRect(x-1,y-1,w+2,h+2);}}
// mobile: a red fire-meter ring around the FIRE button
{const _dt=drawTouch;drawTouch=function(){_dt.apply(this,arguments);if(!TOUCH.on||scene!=='play'||!G||G.over||G.won||!TOUCH.btns)return;const o=TOUCH.btns.find(b=>b.id==='fire');if(!o||D.maxFire===undefined)return;
  const f=clamp(D.fire/D.maxFire,0,1);ctx.lineWidth=8;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.beginPath();ctx.arc(o.x,o.y,o.r+8,0,TAU);ctx.stroke();
  ctx.strokeStyle=f>=.999&&!D.fireOut?'#ff6a2a':fireBarCol();ctx.beginPath();ctx.arc(o.x,o.y,o.r+8,-Math.PI/2,-Math.PI/2+TAU*f);ctx.stroke();
  // the number (the HUD has no fire gauge on phones)
  const s=D.fireOut?'EMPTY':`🔥 ${Math.ceil(D.fire)}`;ctx.font='bold 13px Georgia';const w=ctx.measureText(s).width+12;ctx.fillStyle='rgba(20,10,6,.8)';ctx.fillRect(o.x-w/2,o.y+o.r-24,w,18);
  txt(s,o.x,o.y+o.r-10,13,D.fireOut?'#ff8a7a':f<.25?'#ffb08a':'#fff2d0','center');};}
