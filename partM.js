// ======================= MOBILE / TOUCH =======================
// Virtual joystick (left thumb, floats to wherever you touch) + FIRE / BITE / STOMP / FLY buttons
// (right thumb) + MAP / PAUSE. STOMP while flying = crash DIVE STOMP (same as Q in the air).
// Also: safe-area aware HUD, rotate-to-landscape hint, iOS audio unlock, auto Low graphics.
const TOUCH={on:IS_TOUCH,mx:0,my:0,joy:null,held:{},btns:[],rot:false,rotPaused:false,taps:0,portrait:false,rotOK:false,lastTouch:0,
  JR:62};
(function(){ // first visit on a phone/tablet: default to Low graphics (fast); the title menu can still switch it
  let saved=null;try{saved=localStorage.getItem('dr_gfx');}catch(e){}
  if(IS_TOUCH&&saved===null){setGfx(false);}
  resize();
})();
// iOS / Safari only lets audio start inside a touchend (or click): resume the context and play a
// 1-sample silent buffer to unlock it.
const _setGfx0=setGfx;setGfx=function(v){_setGfx0(v);if(IS_TOUCH)resize();};
function audioUnlock(){const a=audio();if(!a)return;try{if(a.state!=='running'){const pr=a.resume();if(pr&&pr.catch)pr.catch(()=>{});}const b=a.createBuffer(1,1,22050),s=a.createBufferSource();s.buffer=b;s.connect(a.destination);s.start(0);}catch(e){}
  if(a.state==='running'&&!TOUCH.unlocked){TOUCH.unlocked=true;}}
addEventListener('touchend',audioUnlock,{passive:true});addEventListener('click',audioUnlock);
addEventListener('keydown',()=>{if(!IS_TOUCH)TOUCH.on=false;});

function touchLayout(){const S=SAFE,b=[];const fx=VW-S.r-92,fy=VH-S.b-92;
  b.push({id:'fire',x:fx,y:fy,r:56,label:D&&D.lava>0?'LAVA '+D.lava:'FIRE',key:' ',hold:true,col:'#e8572a'});
  b.push({id:'bite',x:fx-150,y:fy+18,r:42,label:typeof nearLava==='function'&&nearLava()?'DRINK':'BITE',key:'e',col:typeof nearLava==='function'&&nearLava()?'#e8702a':'#d8a23a'});
  b.push({id:'stomp',x:fx-118,y:fy-104,r:40,label:D&&D.mode==='air'?'DIVE':'STOMP',key:'q',col:'#8a6a4a'});
  b.push({id:'fly',x:fx+8,y:fy-150,r:40,label:D&&D.mode==='air'?'LAND':'FLY',key:'f',col:'#4a86c8'});
  const colB=typeof UI!=='undefined'&&UI.col?UI.col.y+UI.col.h:0,my=S.t+Math.max(284,colB+40); // MAP / PAUSE stay below the left HUD column
  b.push({id:'map',x:S.l+34,y:my,r:24,label:'MAP',key:'m',col:'#557'});
  b.push({id:'pause',x:S.l+34,y:my+54,r:24,label:paused?'▶':'II',key:'p',col:'#557'});
  TOUCH.btns=b;return b;}
function hitBtn(x,y){let best=null,bd=1e9;for(const b of TOUCH.btns){const d=Math.hypot(x-b.x,y-b.y);if(d<b.r*1.3&&d<bd){bd=d;best=b;}}return best;}
function tpos(t){return{x:t.clientX/UIS,y:t.clientY/UIS};}
// title menu hit test (geometry mirrors drawTitle)
function titleTap(x,y){const g=TOUCH.tg;if(!g)return false;const lx=(x-g.ox)/g.k,ly=y/g.k;
  for(let i=0;i<6;i++){const ry=g.y0+i*36;if(lx>g.cx-230&&lx<g.cx+230&&ly>ry-4&&ly<ry+34){titleSel=i;
      if(i===5){pmOpen('load','title');return true;}if(i===0)pressed['enter']=true;else if(i===1||i===2)pressed['enter']=true;
      else{const k=i===3?'music':'sfx';if(AUD.muted)toggleMute();else setVol(k,lx>g.cx+60?Math.min(1,AUD[k]+.1):lx<g.cx-60?Math.max(0,AUD[k]-.1):(AUD[k]>=1?0:AUD[k]+.1));if(k==='sfx')SFX.play('coin');}
      return true;}}
  if(ly>g.y0+6*36+20){pressed['enter']=true;titleSel=0;}return true;}
function onTouchStart(e){if(e.cancelable)e.preventDefault();TOUCH.on=true;TOUCH.lastTouch=Date.now();audio();try{if(!TOUCH.btns.length)touchLayout();}catch(_){}
  for(const t of e.changedTouches){const p=tpos(t);TOUCH.taps++;
    if(TOUCH.rot){TOUCH.rotOK=true;TOUCH.rot=false;continue;} // rotation locked? a tap on the hint plays on in portrait
    if(PM.on){pmTap(p.x,p.y,t.identifier);continue;}
    if(scene==='title'){titleTap(p.x,p.y);continue;}
    const b=hitBtn(p.x,p.y);
    if(b&&!(G.over||G.won)){TOUCH.held[t.identifier]=b;pressed[b.key]=true;if(b.hold)keys[b.key]=true;b.down=true;continue;}
    if(G.over&&G.overT>1){pressed['enter']=true;continue;}
    if(G.won&&G.wonT>1){pressed['enter']=true;continue;}
    if(paused){pressed['p']=true;continue;}
    if(p.x<VW*.5&&!TOUCH.joy){const R=TOUCH.JR;TOUCH.joy={id:t.identifier,ox:clamp(p.x,SAFE.l+R+8,VW*.5),oy:clamp(p.y,R+8,VH-SAFE.b-R-8),x:p.x,y:p.y};joyUpd();}
  }}
function joyUpd(){const j=TOUCH.joy;if(!j){TOUCH.mx=TOUCH.my=0;return;}let dx=j.x-j.ox,dy=j.y-j.oy;const l=Math.hypot(dx,dy),R=TOUCH.JR;
  if(l>R){ // drag the base along so the stick never "sticks" at the rim
    j.ox+=dx*(1-R/l);j.oy+=dy*(1-R/l);dx=j.x-j.ox;dy=j.y-j.oy;}
  const m=Math.min(1,l/R);if(m<.12){TOUCH.mx=TOUCH.my=0;return;}const k=(m-.12)/.88/(Math.hypot(dx,dy)||1);TOUCH.mx=dx*k;TOUCH.my=dy*k;}
function onTouchMove(e){e.preventDefault();for(const t of e.changedTouches){if(PM.on&&PM.drag){pmDragMove(t.identifier,tpos(t).y);continue;}const j=TOUCH.joy;if(j&&j.id===t.identifier){const p=tpos(t);j.x=p.x;j.y=p.y;joyUpd();}}}
function onTouchEnd(e){e.preventDefault();for(const t of e.changedTouches){if(PM.drag&&PM.drag.id===t.identifier)PM.drag=null;const j=TOUCH.joy;if(j&&j.id===t.identifier){TOUCH.joy=null;joyUpd();}
    const b=TOUCH.held[t.identifier];if(b){delete TOUCH.held[t.identifier];if(b.hold&&!Object.values(TOUCH.held).some(o=>o.key===b.key))keys[b.key]=false;b.down=false;}}}
cv.addEventListener('click',e=>{try{if(Date.now()-TOUCH.lastTouch<900)return;audio();const p={x:e.clientX/UIS,y:e.clientY/UIS};
  if(PM.on&&scene==='title'){return;}if(scene==='title')titleTap(p.x,p.y);else if(TOUCH.rot){TOUCH.rotOK=true;TOUCH.rot=false;}}catch(_){}});
cv.addEventListener('touchstart',onTouchStart,{passive:false});cv.addEventListener('touchmove',onTouchMove,{passive:false});
cv.addEventListener('touchend',onTouchEnd,{passive:false});cv.addEventListener('touchcancel',onTouchEnd,{passive:false});
// stop iOS rubber-banding / double-tap zoom / long-press menus outside the canvas too
document.addEventListener('touchmove',e=>{if(e.cancelable)e.preventDefault();},{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault());document.addEventListener('contextmenu',e=>{if(IS_TOUCH)e.preventDefault();});
addEventListener('blur',()=>{TOUCH.joy=null;TOUCH.mx=TOUCH.my=0;for(const k in TOUCH.held){const b=TOUCH.held[k];if(b.hold)keys[b.key]=false;}TOUCH.held={};});

// called every frame from frame(): portrait = pause + rotate hint
function touchTick(){if(!TOUCH.on)return;TOUCH.portrait=IS_TOUCH&&VH>VW*1.05;if(!TOUCH.portrait)TOUCH.rotOK=false;
  TOUCH.rot=TOUCH.portrait&&scene==='play'&&!TOUCH.rotOK;
  if(TOUCH.rot&&scene==='play'&&!paused&&!G.over&&!G.won){paused=true;TOUCH.rotPaused=true;}
  if(!TOUCH.rot&&TOUCH.rotPaused){paused=false;TOUCH.rotPaused=false;}
  if(TOUCH.rot&&TOUCH.joy){TOUCH.joy=null;joyUpd();}}
// HUD inside the safe area (notch / home bar): offset every setTransform drawHUD makes
function withSafe(fn){const S=SAFE;if(!(S.l||S.r||S.t||S.b))return fn();const st=ctx.setTransform,w=VW,h=VH;
  ctx.setTransform=function(a,b,c,d,e,f){return st.call(ctx,a,b,c,d,(e||0)+S.l*DPR,(f||0)+S.t*DPR);};VW=w-S.l-S.r;VH=h-S.t-S.b;
  try{fn();}finally{ctx.setTransform=st;VW=w;VH=h;}}
function drawTouch(){if(!TOUCH.on)return;ctx.setTransform(DPR,0,0,DPR,0,0);
  if(TOUCH.rot){ctx.fillStyle='rgba(8,4,2,.93)';ctx.fillRect(0,0,VW,VH);const cx=VW/2,cy=VH*.42,a=(performance.now()/900)%TAU,r=Math.min(1,Math.max(0,Math.sin(a)*1.4));
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-r*Math.PI/2);ctx.strokeStyle='#ffd24a';ctx.lineWidth=6;ctx.beginPath();ctx.roundRect?ctx.roundRect(-45,-80,90,160,14):ctx.rect(-45,-80,90,160);ctx.stroke();
    ctx.fillStyle='#ffd24a';ctx.beginPath();ctx.arc(0,62,6,0,TAU);ctx.fill();ctx.restore();
    txt('Rotate your phone',cx,cy+150,40,'#ffd24a','center');txt('Dragon\'s Rampage plays best in landscape',cx,cy+195,24,'#f3dcb8','center',false);
    txt('Rotation locked? Tap anywhere to play in portrait',cx,cy+240,20,'rgba(243,220,184,.75)','center',false);return;}
  if(scene==='title'&&TOUCH.portrait&&!PM.on){const g=TOUCH.tg,my=g?(g.y0+6*36+60)*g.k:VH*.4,y=Math.max(my+60,VH*.55);ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,y-46,VW,70);
    txt('\u25b6 Tap down here to start',VW/2,y,34,'#ffd24a','center');const y2=VH-SAFE.b-40;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,y2-28,VW,44);txt('\u21bb Best in landscape: turn your phone',VW/2,y2,19,'#f3dcb8','center',false);}
  if(scene!=='play')return;
  const b=touchLayout();ctx.textAlign='center';
  if(!(G.over||G.won)){
    for(const o of b){const dn=o.down||(o.hold&&keys[o.key]);ctx.globalAlpha=dn?.85:.5;ctx.fillStyle=o.col;ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,TAU);ctx.fill();
      ctx.globalAlpha=dn?1:.75;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();ctx.globalAlpha=1;
      if(o.icon){txt(o.icon,o.x,o.y-o.r*.12,Math.round(o.r*.42),'#fff','center',false);txt(o.label,o.x,o.y+o.r*.5,Math.round(o.r*.3),'#fff','center');}else txt(o.label,o.x,o.y+o.r*.16,o.r>30?Math.round(o.r*.36):14,'#fff','center');}
    if(D.mode==='air'){const o=b[2];ctx.strokeStyle='rgba(255,210,74,.9)';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.beginPath();ctx.arc(o.x,o.y,o.r+6,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
  // joystick
  const j=TOUCH.joy,R=TOUCH.JR,ox=j?j.ox:SAFE.l+118,oy=j?j.oy:VH-SAFE.b-112;
  ctx.globalAlpha=j?.6:.28;ctx.fillStyle='#000';ctx.beginPath();ctx.arc(ox,oy,R,0,TAU);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
  const kx=ox+TOUCH.mx*R,ky=oy+TOUCH.my*R;ctx.globalAlpha=j?.9:.45;ctx.fillStyle='#ddd';ctx.beginPath();ctx.arc(kx,ky,R*.42,0,TAU);ctx.fill();ctx.globalAlpha=1;
  if(!j&&G.t<12)txt('drag to move',ox,oy+R+20,14,'rgba(255,255,255,.8)','center',false);
  if((G.over&&G.overT>1)||(G.won&&G.wonT>1))txt('Tap to continue',VW/2,VH-SAFE.b-30,22,'#ffd24a','center');
  else if(paused&&!PM.on)txt('Tap to resume',VW/2,VH-SAFE.b-30,22,'#ffd24a','center');}
