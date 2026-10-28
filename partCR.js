// ======================= CRUISE SPEED: steady flight with no combat input slowly speeds up (1x → 1.8x over ~5 s) =======================
// Works for keyboard, touch joystick and gamepad (it reads the final movement vector). Any combat input (fire, bite, claw, stomp, lava),
// landing / diving, a sharp turn or stopping resets it. Flying stamina drains at the normal rate, so cruising simply covers more ground per
// stamina; it won't build while stamina is low (<15%) and fades if you're tiring. Subtle wind streaks show the speed-up.
const CR={max:1.8,ramp:5,delay:.6,turn:1.05,minSt:.15};
function crReset(why){if(D.cruise>1.05){G.crResets=(G.crResets||0)+1;G.crWhy=why;}D.cruise=1;D.crT=0;}
function updCruise(dt,ix,iy){if(D.cruise===undefined){D.cruise=1;D.crT=0;D.crA=null;D.crLava=D.lava||0;}
  const mag=Math.hypot(ix,iy),lava=D.lava||0;
  const combat=D.breath||keys[' ']||GPAD.fire||D.eatT>0||D.stompT>0||(D.scratchT||0)>0||lava<D.crLava;D.crLava=lava;
  if(combat){crReset('combat');D.crA=null;return 1;}
  if(D.mode!=='air'||D.altT<1||D.diving||D.alt<.85){crReset('land');D.crA=null;return 1;}
  if(mag<.5){crReset('stop');D.crA=null;return 1;}
  const a=Math.atan2(iy,ix);
  if(D.crA!=null&&Math.abs(angDiff(a,D.crA))>CR.turn){D.crA=a;crReset('turn');return 1;}
  // gentle steering keeps cruise: the reference heading follows slowly
  D.crA=D.crA==null?a:D.crA+angDiff(a,D.crA)*Math.min(1,2.5*dt);
  const stF=D.st/(D.maxSt||DR.maxSt||100);
  if(stF<CR.minSt){D.cruise=Math.max(1,D.cruise-.4*dt);return D.cruise;}
  D.crT+=dt;if(D.crT>CR.delay)D.cruise=Math.min(CR.max,D.cruise+(CR.max-1)/CR.ramp*dt);
  G.crPeak=Math.max(G.crPeak||1,D.cruise);return D.cruise;}
// any combat action resets cruise immediately (touch buttons, keys and gamepad all end up in these)
{const _a=tryEat;tryEat=function(){if(D&&D.cruise>1)crReset('combat');return _a.apply(this,arguments);};}
{const _a=doStomp;doStomp=function(){if(D&&D.cruise>1)crReset('combat');return _a.apply(this,arguments);};}
{const _a=clawScratch;clawScratch=function(){if(D&&D.cruise>1)crReset('combat');return _a.apply(this,arguments);};}
{const _a=tryEatBird;tryEatBird=function(){if(D&&D.cruise>1)crReset('combat');return _a.apply(this,arguments);};}
// wind streaks behind a cruising dragon
{const _dd=drawDragon;drawDragon=function(){
  if(D.cruise>1.08&&D.alt>.5){const k=clamp((D.cruise-1)/(CR.max-1),0,1),h=heightOf(),sp=Math.hypot(D.vx,D.vy)||1,ux=D.vx/sp,uy=D.vy/sp,nx=-uy,ny=ux;
    ctx.save();ctx.lineCap='round';
    for(let i=0;i<7;i++){const s=((G.t*2.3+i*.37)%1),off=(i-3)*16+Math.sin(i*7.1)*6,len=40+60*k;
      const bx=D.x-ux*(30+s*140)+nx*off,by=D.y-h-uy*(30+s*140)+ny*off;
      ctx.globalAlpha=.10+.32*k*(1-s);ctx.strokeStyle='#eef6ff';ctx.lineWidth=1.5+k;
      ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx-ux*len,by-uy*len);ctx.stroke();}
    ctx.restore();G.crDrawn=(G.crDrawn||0)+1;}
  return _dd.apply(this,arguments);};}
// save: cruise is momentary and is not saved (a loaded game starts at normal speed)
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);D.cruise=1;D.crT=0;D.crA=null;return r;};}
