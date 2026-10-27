// ======================= CLAW SCRATCH: while swimming, the stomp button becomes a quick claw swipe =======================
// Same key (Q / Shift), same controller button (B / Circle) and the same mobile button (relabelled SCRATCH in the water).
const CS={cd:.55,reach:205,arc:1.05,dmgShip:28,dmgSea:24,dmgSquid:20,dmgLand:18,fxT:.32};
let scratchFx=[];
function inScratch(x,y,extra){const dx=x-D.x,dy=y-D.y,dd=Math.hypot(dx,dy);if(dd>CS.reach+(extra||0))return false;if(dd<60)return true;
  return Math.abs(angDiff(Math.atan2(dy,dx),D.ang))<CS.arc+Math.min(.6,(extra||0)/Math.max(dd,1));}
function clawScratch(){if(!(D.scratchCD>0)){}else return false;
  D.scratchCD=CS.cd;D.stompT=0;G.stats.scratches=(G.stats.scratches||0)+1;
  const ca=Math.cos(D.ang),sa=Math.sin(D.ang),mx=D.x+ca*110,my=D.y+sa*110;let hits=0;
  for(const s of ships)if(s.state!=='sink'&&inScratch(s.x,s.y,s.r||30)){hurtShip(s,CS.dmgShip,'scratch');hits++;splinters&&splinters(s.x,s.y,3);
    if(s.state!=='sink')float(s.x,s.y-60,s.kind==='pirate'?'Claw marks on the hull! Arr!':'Scratched hull!','#cfe8ff');}
  for(const u of units){if(u.dead||u.inside||u.princess)continue;
    if(u.kind==='squid'){const tent=u.state==='grab'||(u.state==='slam'&&inScratch(u.sx,u.sy,40));
      if(tent||inScratch(u.x,u.y,150)){hurtSea(u,CS.dmgSquid,'scratch');hits++;
        if(u.state==='slam'&&inScratch(u.sx,u.sy,40)){u.state='lurk';u.cd=2.2;float(u.sx,u.sy-60,'Tentacle swatted away!','#c8a0ff');}
        else float(u.x+R(-30,30),u.y-90,'Tentacle scratched!','#c8a0ff');}continue;}
    if(!inScratch(u.x,u.y,12))continue;
    const sea=u.type==='sea'||u.species==='seal'||u.species==='crab'||u.species==='fish';
    hurtUnit(u,sea?CS.dmgSea:CS.dmgLand,'scratch');hits++;
    if(!u.dead){const a=Math.atan2(u.y-D.y,u.x-D.x),nx=u.x+Math.cos(a)*26,ny=u.y+Math.sin(a)*26;if(u.type!=='sea'||inWater(nx,ny)){u.x=nx;u.y=ny;}}}
  // streaks + splash
  scratchFx.push({x:mx,y:my,a:D.ang,t:0});
  puff(mx,my,16,'rgba(220,240,255,',150,10);for(let i=0;i<3;i++)ripples.push({x:mx+R(-30,30),y:my+R(-20,20),t:0});
  G.shake=Math.max(G.shake,hits?6:3);if(typeof rumble==='function')rumble(.4,.3,120);
  if(typeof SFX!=='undefined'&&SFX.play)SFX.play('scratch',mx,my,1);
  float(D.x,D.y-90,hits?`CLAW SCRATCH! ×${hits}`:'CLAW SCRATCH!','#bfe6ff');
  return true;}
SFX_DEF.scratch=(a,B,o,t)=>{for(let i=0;i<3;i++)nz(a,B,o,t+i*.055,.09,'highpass',5200-i*700,1800,1.5,.55);
  nz(a,B,o,t+.12,.35,'bandpass',1800,350,.8,.5);for(let i=0;i<3;i++)osc(a,o,t+.16+i*.06,'sine',650+Math.random()*450,1300,.06,.07);return .5;};
{const _u=update;update=function(dt){if(D&&D.scratchCD>0)D.scratchCD=Math.max(0,D.scratchCD-dt);for(const f of scratchFx)f.t+=dt;scratchFx=scratchFx.filter(f=>f.t<CS.fxT);return _u.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){scratchFx=[];const r=_ng.apply(this,arguments);if(D)D.scratchCD=0;return r;};}
// draw: three curved claw-slash streaks in front of the swimming dragon
{const _dst=drawSeaTop;drawSeaTop=function(){const r=_dst.apply(this,arguments);
  for(const f of scratchFx){const k=f.t/CS.fxT,al=1-k,ca=Math.cos(f.a),sa=Math.sin(f.a),px=-sa,py=ca;ctx.save();ctx.lineCap='round';
    for(let i=-1;i<=1;i++){const ox=f.x+px*i*18,oy=f.y+py*i*18,L=46+18*(1-Math.abs(i)),sw=(k*2-1)*L;
      ctx.strokeStyle=`rgba(255,255,255,${.95*al})`;ctx.lineWidth=5*al+1;ctx.beginPath();ctx.moveTo(ox-ca*L*.2+px*(-L),oy-sa*L*.2+py*(-L));
      ctx.quadraticCurveTo(ox+ca*22,oy+sa*22,ox-ca*L*.2+px*L,oy-sa*L*.2+py*L);ctx.stroke();
      ctx.strokeStyle=`rgba(120,210,255,${.7*al})`;ctx.lineWidth=2;ctx.stroke();}
    for(let i=0;i<6;i++){const b=f.a+(i-2.5)*.35,rr=20+60*k;ctx.fillStyle=`rgba(225,245,255,${.8*al})`;ctx.beginPath();ctx.arc(f.x+Math.cos(b)*rr,f.y+Math.sin(b)*rr-12*Math.sin(k*Math.PI),3*al+1,0,TAU);ctx.fill();}
    ctx.restore();}
  return r;};}
// mobile button: STOMP -> SCRATCH while swimming
{const _tl=touchLayout;touchLayout=function(){const b=_tl.apply(this,arguments);const s=b.find(x=>x.id==='stomp');if(s&&D&&D.swim&&D.mode!=='air'){s.label='SCRATCH';s.icon='🐾';s.col='#2f86b8';}return b;};}
