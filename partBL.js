// ---------- (n) Bulls: 1–2 per cow pen. They paw the ground and snort steam, then CHARGE and ram (modest damage, a little knockback).
// A damaged or burned pen fence lets a bull break out, chase the dragon briefly, then trot home. Tough: edible only once worn below 45%.
LIVESTOCK.add('bull');HEAL.bull=30;if(typeof FOOD!=='undefined')FOOD.bull=30;ANIM_SP.bull=60;
const BULL_PENS={1:1,3:2,7:1},BULL_HP=60;
const BL={t:0,spawnT:20};
function blPen(fi){return FARMS[fi]&&FARMS[fi].pen;}
function blMk(fi,x,y,hp){const P=blPen(fi);const u=mkUnit('animal',x!=null?x:P.x+R(20,P.w-20),y!=null?y:P.y+R(20,P.h-20),{species:'bull',pen:P,hp:BULL_HP,maxHp:BULL_HP});
  if(hp)u.hp=hp;u.bst='idle';u.bcd=R(.5,2);u.farmI=fi;u.face=rnd()<.5?1:-1;units.push(u);return u;}
function blInit(){BL.t=0;BL.spawnT=20;for(const k in BULL_PENS){const fi=+k,P=blPen(fi);if(!P)continue;P.fhp=100;P.fHitT=-99;P.bulls=BULL_PENS[k];if(P.capB==null)P.capB=P.cap||3;P.cap=P.capB+P.bulls;for(let i=0;i<P.bulls;i++)blMk(fi);}}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);blInit();return r;};}
function blIn(u,P,m){m=m||0;return u.x>P.x-m&&u.x<P.x+P.w+m&&u.y>P.y-m&&u.y<P.y+P.h+m;}
function blSay(u,t,c,force){if(dist(u,D)<900&&(force||!u.sayT||G.t-u.sayT>1.6)){u.sayT=G.t;float(u.x,u.y-30,t,c||'#ffd8b0');}}
function updBull(u,dt){const P=u.pen;if(!P)return;u.bcd-=dt;u.anim+=dt*(u.bst==='charge'?14:u.bst==='paw'?10:4);
  const dd=dist(u,D),trig=EASY?170:230,ground=D.alt<.35&&!G.over&&scene==='play',broken=P.fhp<50;
  if(u.bst==='idle'){
    if(u.out){u.outT-=dt;const home=u.outT<=0||d2(u.x,u.y,P.x+P.w/2,P.y+P.h/2)>500||!ground;
      if(home){u.bst='home';blSay(u,'Hmph. The bull trots home.','#e8d8c0');}
      else if(u.bcd<=0&&dd<trig+40){u.bst='paw';u.bt=1.1;}
      else{u.face=D.x>u.x?1:-1;moveTo(u,D.x,D.y,95,dt);}}
    else{
      if(ground&&u.bcd<=0&&dd<trig+(broken?70:0)){u.bst='paw';u.bt=1.1;if(broken&&!blIn(D,P,-4)){u.out=true;u.outT=8;blSay(u,'The bull bursts through the broken fence!','#ffb070',1);G.bullOut=(G.bullOut||0)+1;}}
      else{if(!u.tgt||rnd()<dt*.3)u.tgt={x:P.x+R(14,P.w-14),y:P.y+R(14,P.h-14)};moveTo(u,u.tgt.x,u.tgt.y,14,dt);}}}
  else if(u.bst==='paw'){u.bt-=dt;u.face=D.x>u.x?1:-1;
    if(rnd()<dt*7)puff(u.x+u.face*15,u.y-9,1,'rgba(245,245,245,',26,3.5,true);
    if(rnd()<dt*5)puff(u.x-u.face*4,u.y+2,1,'rgba(150,120,80,',30,3);
    blSay(u,rnd()<.5?'Snort! *paw paw*':'SNORT!','#f0e0d0');
    if(u.bt<=0){u.bst='charge';u.bt=1.2;u.ca=Math.atan2(D.y-u.y,D.x-u.x);G.bullCharges=(G.bullCharges||0)+1;blSay(u,'CHARGE!','#ff9a6a',1);}}
  else if(u.bst==='charge'){u.bt-=dt;const sp=260;u.x+=Math.cos(u.ca)*sp*dt;u.y+=Math.sin(u.ca)*sp*dt;u.face=Math.cos(u.ca)>=0?1:-1;
    if(rnd()<dt*12)puff(u.x-u.face*8,u.y+2,1,'rgba(160,130,90,',40,4);
    let stop=u.bt<=0;
    if(!u.out&&!blIn(u,P,-8)){u.x=clamp(u.x,P.x+8,P.x+P.w-8);u.y=clamp(u.y,P.y+8,P.y+P.h-8);stop=true;}
    if(!stop&&dist(u,D)<46&&D.alt<.5){hurtDragon(7,'bull');const k=40;D.x+=Math.cos(u.ca)*k;D.y+=Math.sin(u.ca)*k;G.shake=Math.max(G.shake||0,6);G.bullRams=(G.bullRams||0)+1;
      float(D.x+R(-15,15),D.y-heightOf()-80,'WHAM! Bull ram!','#ffb0a0');stop=true;u.bcd=3;}
    if(stop){u.bst='idle';u.bcd=Math.max(u.bcd,1.5);}}
  else if(u.bst==='home'){const cx=P.x+P.w/2,cy=P.y+P.h/2;u.face=cx>u.x?1:-1;moveTo(u,cx,cy,75,dt);if(blIn(u,P,-10)){u.bst='idle';u.out=false;u.bcd=2;}}
  if(!u.out&&u.bst!=='home'){u.x=clamp(u.x,P.x+8,P.x+P.w-8);u.y=clamp(u.y,P.y+8,P.y+P.h-8);}}
{const _ua=updAnimal;updAnimal=function(u,dt){if(u.species==='bull'){updBull(u,dt);return;}return _ua.apply(this,arguments);};}
// tough hide: fire only singes a bull, and it must be worn down before it can be swallowed
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.species==='bull'&&!u.dead){if(src==='fire')d*=.3;if(u.bst==='idle'&&!u.out)u.bcd=Math.min(u.bcd,.3);}return _hu.call(this,u,d,src);};}
TOUGH.bull={chk:u=>u.hp>u.maxHp*.45,hit:u=>{hurtUnit(u,12,'bite');hurtDragon(2,'bull');G.bullShrug=(G.bullShrug||0)+1;float(u.x,u.y-40,'The bull shrugs you off! Wear it down below 45% first','#ffd27a');}};
// fences: fire and stomps damage pen fences; below half a bull can break out. Farmers mend them after 30 s of peace.
const BL_PTS=[[0,0],[.5,0],[1,0],[0,.5],[1,.5],[0,1],[.5,1],[1,1]];
function blFenceHit(P,d){if(P.fhp==null)P.fhp=100;const was=P.fhp;P.fhp=Math.max(0,P.fhp-d);P.fHitT=G.t;if(was>=50&&P.fhp<50&&d2(P.x,P.y,D.x,D.y)<900)float(P.x+P.w/2,P.y-10,'The pen fence is broken!','#ffb070');}
{const _af=applyFire;applyFire=function(ox,oy,dt){_af.apply(this,arguments);for(const f of FARMS){const P=f.pen;if(!P)continue;if(d2(P.x+P.w/2,P.y+P.h/2,ox,oy)>DR.fireRange+200)continue;
    if(BL_PTS.some(q=>inFire(P.x+q[0]*P.w,P.y+q[1]*P.h,ox,oy))){blFenceHit(P,28*dt);P.charT=G.t;}}};}
{const _ds=doStomp;doStomp=function(){const r=_ds.apply(this,arguments);for(const f of FARMS){const P=f.pen;if(!P)continue;const nx=clamp(D.x,P.x,P.x+P.w),ny=clamp(D.y,P.y,P.y+P.h);if(d2(nx,ny,D.x,D.y)<DR.stompR+20)blFenceHit(P,40);}return r;};}
function blTick(dt){BL.t+=dt;for(const f of FARMS){const P=f.pen;if(P&&P.fhp!=null&&P.fhp<100&&G.t-P.fHitT>30){P.fhp=100;P.charT=0;if(d2(P.x,P.y,D.x,D.y)<900)float(P.x+P.w/2,P.y-10,'Farmers mend the fence','#e0f0c0');}}
  BL.spawnT-=dt;if(BL.spawnT<=0){BL.spawnT=20;for(const k in BULL_PENS){const fi=+k,f=FARMS[fi],P=f.pen;if(!P)continue;const barn=structures.find(s=>s.kind==='barn'&&dist(s,f.barn)<5);if(barn&&barn.state!=='ok')continue;
      const n=units.filter(u=>!u.dead&&u.species==='bull'&&u.farmI===fi).length;if(n<P.bulls&&d2(P.x,P.y,D.x,D.y)>500){blMk(fi);G.bullBorn=(G.bullBorn||0)+1;}}}}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over)blTick(dt);};}
// drawing
function drawBull(u){const x=u.x,y=u.y,f=u.face,mad=u.bst==='paw'||u.bst==='charge',lift=animalLift(u),bob=u.bst==='charge'?Math.abs(Math.sin(u.anim))*2:0;
  ell(x,y+2,13,4,'rgba(0,0,0,.25)');ctx.save();ctx.translate(0,-lift-bob);
  const leg=u.bst==='paw'?Math.sin(u.anim)*3:Math.sin(u.anim)*1.2;
  for(const lx of[-7,-3,4,8]){const sw=lx===8&&u.bst==='paw'?leg:Math.sin(u.anim+lx)*1.2;line(x+lx*f,y-4,x+lx*f+sw,y+1,'#2e1c10',2);}
  ell(x,y-8,12,6.5,'#4a2c1a');ell(x-f*2,y-11,7,3,'#5c3820');ell(x-f*12,y-9,1.6,1.6,'#2e1c10');line(x-f*12,y-9,x-f*14,y-3,'#2e1c10',1.2);
  const hx=x+f*12,hy=y-10;ell(hx,hy,5.5,4.6,'#3e2414');ell(hx+f*3.5,hy+2,3,2.4,'#7a5040');
  ctx.strokeStyle='#f2e8cc';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(hx-2,hy-3);ctx.quadraticCurveTo(hx-6,hy-8,hx-3,hy-11);ctx.moveTo(hx+2,hy-3);ctx.quadraticCurveTo(hx+7,hy-7,hx+5,hy-11);ctx.stroke();ctx.lineWidth=1;
  ctx.strokeStyle='#ffd040';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(hx+f*4.5,hy+3.6,1.6,0,TAU);ctx.stroke();ctx.lineWidth=1;
  ell(hx+f*1.5,hy-1.5,1.2,1.2,mad?'#ff3a2a':'#111');
  if(u.bst==='paw'){ctx.fillStyle='#ff4a3a';ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillText('!',x,y-28);}
  if(u.burn>0)ell(x,y-8,9,5,'rgba(255,120,0,.55)');ctx.restore();
  if(u.hp<u.maxHp)miniBar(x,y-34-lift,u.hp/u.maxHp,28);}
{const _da=drawAnimal0;drawAnimal0=function(u){if(u.species==='bull'){drawBull(u);return;}return _da.apply(this,arguments);};}
{const _dp=drawPen;drawPen=function(P){if(P.fhp==null||P.fhp>=100){_dp.apply(this,arguments);return;}
  const br=P.fhp<50,c=br?'#3a2a1a':'#5e4224',post=br?'#2a1e12':'#4e3418';ctx.strokeStyle=c;ctx.lineWidth=2;
  const sides=[[P.x,P.y,P.x+P.w,P.y],[P.x+P.w,P.y,P.x+P.w,P.y+P.h],[P.x+P.w,P.y+P.h,P.x,P.y+P.h],[P.x,P.y+P.h,P.x,P.y]];
  sides.forEach((s,i)=>{const L=Math.hypot(s[2]-s[0],s[3]-s[1]),n=Math.max(2,Math.round(L/18));for(let k=0;k<n;k++){const gap=br&&((k+i*3)%4===1||(k===Math.floor(n/2)));if(gap)continue;
      const a=k/n,b=(k+1)/n;ctx.beginPath();ctx.moveTo(s[0]+(s[2]-s[0])*a,s[1]+(s[3]-s[1])*a);ctx.lineTo(s[0]+(s[2]-s[0])*b,s[1]+(s[3]-s[1])*b);ctx.stroke();
      rect(s[0]+(s[2]-s[0])*a-1.5,s[1]+(s[3]-s[1])*a-5,3,br&&k%2?4:8,post);}});
  ctx.lineWidth=1;if(br&&G.t-(P.charT||-99)<6){ctx.globalAlpha=.5;for(let i=0;i<4;i++)ell(P.x+P.w*(i+.5)/4,P.y-3,5,2.5,'#555');ctx.globalAlpha=1;}}}
tallyAddSect('farm','Animals · Farmlands','🐄','#b8e07a',[['bull','Bulls']]);
// save / load (flat numbers: farm, x, y, hp per bull; then each bull pen's fence health)
{const _ss=svSnapshot;svSnapshot=function(){G.bullS=[];for(const u of units)if(!u.dead&&u.species==='bull')G.bullS.push(u.farmI,Math.round(u.x),Math.round(u.y),Math.round(u.hp));
  G.bullF=[];for(const k in BULL_PENS){const P=blPen(+k);G.bullF.push(+k,Math.round(P&&P.fhp!=null?P.fhp:100));}return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(Array.isArray(G.bullS)){for(const u of units)if(u.species==='bull')u.dead=true;units=units.filter(u=>u.species!=='bull');
    const s=G.bullS;for(let i=0;i+3<s.length;i+=4){const P=blPen(s[i]);if(!P)continue;const u=blMk(s[i],clamp(s[i+1],P.x+8,P.x+P.w-8),clamp(s[i+2],P.y+8,P.y+P.h-8),Math.max(1,s[i+3]));}}
  if(Array.isArray(G.bullF))for(let i=0;i+1<G.bullF.length;i+=2){const P=blPen(G.bullF[i]);if(P){P.fhp=G.bullF[i+1];P.fHitT=G.t;}}return r;};}
