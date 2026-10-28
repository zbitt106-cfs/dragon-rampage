// ===================== partWD: THE DRAGON PEAKS — a roost of smaller wild dragons in the far north-west mountains =====================
// + a shared "too tough to swallow yet" bite helper (TOUGH) used by the new creatures (wild dragons, bulls, morays, narwhals...).
const TOUGH={};let TG_NOBITE=null;
function toughKey(u){return u.type==='sea'?'sea:'+u.kind:u.species;}
function toughNow(u){const h=TOUGH[toughKey(u)];return !!(h&&h.chk(u));}
{const _bt=biteTargets;biteTargets=function(){const T=_bt.apply(this,arguments);return TG_NOBITE?T.filter(u=>!TG_NOBITE.has(u)):T;};}
{const _te=tryEat;tryEat=function(){const T=biteTargets(),tg=T.filter(toughNow);
  if(tg.length){if(tg.length===T.length){const u=tg[0];TOUGH[toughKey(u)].hit(u);D.eatCD=Math.max(D.eatCD||0,.7);D.eatT=.3;return;}TG_NOBITE=new Set(tg);}
  try{return _te.apply(this,arguments);}finally{TG_NOBITE=null;}};}
function miniBar(x,y,f,w){w=w||30;rect(x-w/2-1,y-1,w+2,6,'rgba(0,0,0,.55)');rect(x-w/2,y,w*Math.max(0,f),4,f>.5?'#6dd86a':f>.25?'#ffd040':'#ff5a4a');}
// ---------- region ----------
const WD_E={x:-14400,y:-1300,rx:2400,ry:640};
function inDP(x,y,k){const dx=(x-WD_E.x)/WD_E.rx,dy=(y-WD_E.y)/WD_E.ry;return dx*dx+dy*dy<(k||1);}
{const _rk=regionKey;regionKey=function(x,y){const k=_rk(x,y);return k==='mountain'&&inDP(x,y)?'drpeaks':k;};}
Object.assign(REGION_NAMES,{drpeaks:'The Dragon Peaks'});
Object.assign(REGION_SUB,{drpeaks:'Crags, nests and a roost of smaller wild dragons. They guard their peaks!'});
Object.assign(REGION_LABEL,{drpeaks:[WD_E.x,WD_E.y-420]});
{const _fp=floraPal;floraPal=function(x,y){if(regionKey(x,y)==='drpeaks')return null;return _fp(x,y);};}
ZONES.drpeaks={ok:(x,y)=>inDP(x,y,.9)&&!inSea(x,y),s:()=>{const a=R(0,TAU),r=Math.sqrt(R(0,.8));return{x:WD_E.x+Math.cos(a)*WD_E.rx*r,y:WD_E.y+Math.sin(a)*WD_E.ry*r};}};
const WD_NESTS=[[-16100,-1450],[-15200,-1750],[-14300,-1150],[-13400,-1650],[-12700,-1250]].map(([x,y])=>({x,y}));
const WD_CRAGS=(()=>{let s=90210;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;},out=[];
  for(let t=0;out.length<14&&t<400;t++){const a=r()*TAU,k=Math.sqrt(r())*.86,x=Math.round(WD_E.x+Math.cos(a)*WD_E.rx*k),y=Math.round(WD_E.y+Math.sin(a)*WD_E.ry*k);
    if(WD_NESTS.some(n=>d2(x,y,n.x,n.y)<260)||out.some(c=>d2(x,y,c.x,c.y)<300))continue;out.push({x,y,s:.8+r()*.6,v:Math.floor(r()*3)});}return out;})();
function addPeaksDecor(r,Rr){for(const c of WD_CRAGS)DECOR.push({k:'wdcrag',x:c.x,y:c.y,s:c.s,v:c.v});
  WD_NESTS.forEach((n,i)=>DECOR.push({k:'wdnest',x:n.x,y:n.y,eggs:2+i%3,i}));
  for(let i=0;i<70;i++){const x=Rr(WD_E.x-WD_E.rx,WD_E.x+WD_E.rx),y=Rr(WD_E.y-WD_E.ry,WD_E.y+WD_E.ry);if(inDP(x,y,.95))DECOR.push({k:'wdrock',x,y,s:Rr(.5,1.2)});}}
{const _ad=addDesertDecor;addDesertDecor=function(r,Rr){_ad(r,Rr);addPeaksDecor(r,Rr);};}
const WD_DECOR=new Set(['wdcrag','wdnest','wdrock']);
const WD_EGG=['#9ad0a0','#a8c8ff','#d8b8ff','#ffe08a','#a0f0e0','#ffc8a0','#e8eef4'];
function drawPeaksDecor(o){const x=o.x,y=o.y;
  if(o.k==='wdrock'){const s=o.s;poly([x-14*s,y,x-8*s,y-10*s,x+4*s,y-12*s,x+14*s,y-2*s,x+10*s,y+3*s,x-10*s,y+3*s],'#7a7068');poly([x-8*s,y-10*s,x+4*s,y-12*s,x+2*s,y-6*s,x-6*s,y-5*s],'#a49a90');return;}
  if(o.k==='wdcrag'){const s=o.s;ell(x,y+4,46*s,12*s,'rgba(0,0,0,.22)');
    poly([x-44*s,y+4,x-30*s,y-50*s,x-12*s,y-92*s,x+6*s,y-70*s,x+22*s,y-104*s,x+38*s,y-46*s,x+46*s,y+4],'#6e655e');
    poly([x-12*s,y-92*s,x+6*s,y-70*s,x+22*s,y-104*s,x+16*s,y-60*s,x-2*s,y-52*s,x-20*s,y-60*s],'#9c928a');
    poly([x-12*s,y-92*s,x-4*s,y-84*s,x+6*s,y-70*s,x+14*s,y-90*s,x+22*s,y-104*s,x+18*s,y-92*s,x+6*s,y-78*s,x-4*s,y-90*s],'#eef2f6');
    line(x-26*s,y-30*s,x-14*s,y-8*s,'#544c46',2);line(x+24*s,y-40*s,x+30*s,y-10*s,'#544c46',2);return;}
  if(o.k==='wdnest'){ell(x,y+3,40,13,'rgba(0,0,0,.22)');ell(x,y,36,14,'#7a5a30');ell(x,y-2,28,10,'#5a3e1e');
    ctx.strokeStyle='#a07a40';ctx.lineWidth=2;for(let i=0;i<9;i++){const a=i*.7;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*34,y+Math.sin(a)*12);ctx.lineTo(x+Math.cos(a+1.2)*30,y+Math.sin(a+1.2)*11);ctx.stroke();}
    for(let e=0;e<o.eggs;e++){const ex=x-12+e*12,wob=Math.sin(G.t*3+e+o.i)*(e===1?1.2:0);ctx.save();ctx.translate(ex,y-6);ctx.rotate(wob*.08);ell(0,0,6,8,WD_EGG[(o.i*2+e)%WD_EGG.length]);ell(-2,-3,1.6,2.4,'rgba(255,255,255,.7)');ctx.restore();}}}
{const _dd=drawDecor;drawDecor=function(o){if(WD_DECOR.has(o.k)){drawPeaksDecor(o);return;}_dd(o);};}
// ---------- the wild dragons ----------
FAUNA.wdragon={hp:110,sp:170,bite:5,aggro:430,cd:1.4,say:'Wild dragon bite! -5',growl:'RAWRR!',zone:'drpeaks'};
HEAL.wdragon=45;FOOD.wdragon=45;FAUNA_ART.add('wdragon');
const WD_N=6,WD_COLS=[['#3f9a4a','#22602a','#d8f0a8','rgba(40,110,50,.9)'],['#3a6fc8','#20407a','#b8d8ff','rgba(40,80,160,.9)'],['#8a4ac8','#52287a','#e8c8ff','rgba(100,50,150,.9)'],
  ['#d8a830','#8a6a18','#fff0a8','rgba(170,120,30,.9)'],['#2aa8a0','#16645e','#c0fff0','rgba(30,120,110,.9)'],['#e07a2a','#8a4210','#ffe0a8','rgba(170,80,30,.9)'],['#9aa4b0','#5a6470','#f4f8fc','rgba(110,120,135,.9)']];
const WD_SCALE=.45; // vs. the player's draw scale DS: about 45% of the player's size
HN_DIET.wdragon={prey:['mgoat','goat','eagle','hawk','sparrow'],r:700};HN_NICE.wdragon='a wild dragon';HN_WHO.wdragon='A wild dragon';
function mkWD(x,y,col,nest,o){const u=mkUnit('animal',x,y,Object.assign({species:'wdragon',wild:true,free:true,zone:'drpeaks',hp:FAUNA.wdragon.hp,maxHp:FAUNA.wdragon.hp,col,nest,st:'perch',alt:0,ang:R(0,TAU),flapT:R(0,6),t:R(2,8),cd:0,fcd:0,fireT:0,full:R(10,40),
    home:{x:WD_E.x-WD_E.rx,y:WD_E.y-WD_E.ry,w:WD_E.rx*2,h:WD_E.ry*2}},o||{}));units.push(u);return u;}
function wdPerchSpot(u){const P=WD_CRAGS.concat(WD_NESTS);let best=P[0],bd=1e9;for(const p of P){const d=d2(p.x,p.y,u.x,u.y)+R(0,900);if(d<bd&&!units.some(o=>o!==u&&!o.dead&&o.species==='wdragon'&&o.perch===p)){bd=d;best=p;}}return best;}
function wdInit(){for(let i=0;i<WD_N;i++){const n=i%WD_NESTS.length,p=i<WD_NESTS.length?WD_NESTS[n]:WD_CRAGS[i%WD_CRAGS.length];const u=mkWD(p.x+R(-20,20),p.y+R(-8,8),i%WD_COLS.length,n);u.perch=p;}
  for(let i=0;i<preyN('wdgoat',7);i++)wdGoat(false);for(let i=0;i<3;i++)wdEagle();}
function wdGoat(far){const Z=ZONES.drpeaks;let p=null;for(let t=0;!p&&t<40;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>750))p=q;}if(!p)return;
  units.push(mkUnit('animal',p.x,p.y,{species:'mgoat',wild:true,zone:'drpeaks',home:{x:p.x-350,y:p.y-220,w:700,h:440},hp:FAUNA.mgoat.hp,maxHp:FAUNA.mgoat.hp,free:true,t:R(0,3),jt:0,wdg:1}));}
function wdEagle(){const c=WD_CRAGS[RI(0,WD_CRAGS.length-1)],p={x:c.x,y:c.y-4,z:Math.round(70*c.s)};birds.push(mkBird(rnd()<.6?'eagle':'hawk',p.x,p.y,{state:'perch',z:p.z,perch:p,wdp:1}));}
function wdThreat(){return !G.over&&!G.won&&inDP(D.x,D.y,1.3);}
function wdAggro(u,why){if(u.st==='attack'||u.daze>0)return;u.st='attack';u.atkT=G.easy?7:14;u.angry=G.t;if(u.hPrey)hnDrop(u);
  if(!u.growl||G.t-u.growl>5){u.growl=G.t;float(u.x,u.y-60,['RAWRR! Out of our peaks!','SKRAAA! Our nests!','Hssss-RAWR!'][RI(0,2)],'#ffd0a0');}
  let n=1;if(!G.easy&&why!=='pack'){const k=RI(0,2),O=units.filter(o=>o!==u&&!o.dead&&o.species==='wdragon'&&o.st!=='attack'&&!(o.daze>0)&&o.hp>o.maxHp*.4&&dist(o,u)<1100).sort((a,b)=>dist(a,u)-dist(b,u)).slice(0,k);
    for(const o of O){wdAggro(o,'pack');n++;}if(n>1)float(u.x,u.y-80,`A pack of ${n} wild dragons attacks!`,'#ffb070');}
  if(why!=='pack'){G.wdPacks=G.wdPacks||[];G.wdPacks.push(n);if(G.wdPacks.length>20)G.wdPacks.shift();}}
function wdMove(u,tx,ty,sp,dt){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);if(d<3)return true;const a=Math.atan2(dy,dx),df=Math.atan2(Math.sin(a-u.ang),Math.cos(a-u.ang));
  u.ang+=clamp(df,-dt*4.5,dt*4.5);const s=Math.min(d,sp*dt)*(Math.abs(df)>1.4?.5:1);let nx=u.x+Math.cos(u.ang)*s,ny=u.y+Math.sin(u.ang)*s;
  const ex=(nx-WD_E.x)/WD_E.rx,ey=(ny-WD_E.y)/WD_E.ry,e=ex*ex+ey*ey;if(e>.97){const f=Math.sqrt(.97/e);nx=WD_E.x+(nx-WD_E.x)*f;ny=WD_E.y+(ny-WD_E.y)*f;} // never leaves the peaks
  u.x=nx;u.y=ny;u.face=Math.cos(u.ang)>0?1:-1;return d<14;}
function wdFire(u,len){u.fireT=.55;u.fireL=len||1;}
function updWD(u,dt){const easy=G.easy,dd=dist(u,D);u.cd-=dt;u.fcd-=dt;u.t-=dt;u.fireT=Math.max(0,u.fireT-dt);u.anim=(u.anim||0)+dt;
  if(u.full>0)u.full-=dt;if(u.hRest>0)u.hRest-=dt;if(u.burn>0)u.burn-=dt;
  const up=a=>{u.alt=lerp(u.alt,a,Math.min(1,dt*2.2));};u.flapT+=dt*(u.alt>.25?8+u.alt*4:1.5);
  if(u.daze>0){u.daze-=dt;up(0);if(u.daze<=0){u.st='home';u.hp=Math.max(u.hp,u.maxHp*.3);float(u.x,u.y-40,'The wild dragon shakes it off and flaps home','#ffe6a8');}return;}
  const thr=wdThreat(),aggR=(easy?250:430)*(D.alt>.5?1.1:1);
  if(u.st!=='attack'&&u.st!=='flee'&&thr&&u.hp>u.maxHp*.3&&(dd<aggR||(u.angry&&G.t-u.angry<5&&dd<900)))wdAggro(u);
  if(u.st==='attack'){u.atkT-=dt;if(!thr||u.atkT<=0||u.hp<u.maxHp*.3){u.st=u.hp<u.maxHp*.3?'flee':'home';if(u.st==='flee')float(u.x,u.y-50,'Eep! The wild dragon flees to its nest','#ffe6a8');return;}
    up(D.alt>.5?.95:.7);u.orb=(u.orb||R(0,TAU))+dt*(1+u.col*.07);const R0=dd>260?0:110;wdMove(u,D.x+Math.cos(u.orb)*R0,D.y+Math.sin(u.orb)*R0*.7,FAUNA.wdragon.sp*(easy?.8:1),dt);
    if(dd<240&&dd>60&&u.fcd<=0){u.fcd=easy?4.5:2.8;u.ang=Math.atan2(D.y-u.y,D.x-u.x);wdFire(u,1);const dmg=easy?2:4;hurtDragon(dmg,'wdragon');float(D.x+R(-20,20),D.y-heightOf()-80,`Fwoosh! Wild dragon fire! -${dmg}`,'#ffb070');}
    else if(dd<80&&u.cd<=0){u.cd=easy?2.2:1.4;const dmg=easy?3:FAUNA.wdragon.bite;hurtDragon(dmg,'wdragon');float(D.x+R(-20,20),D.y-heightOf()-70,`Wild dragon bite! -${dmg}`,'#ffb0a0');}
    return;}
  if(u.st==='flee'||u.st==='home'){up(.8);const n=WD_NESTS[u.nest]||WD_NESTS[0];if(wdMove(u,n.x+(u.col%2?24:-24),n.y,FAUNA.wdragon.sp*(u.st==='flee'?1.1:.7),dt)){u.st='perch';u.perch=n;u.t=R(10,18);}return;}
  const T=u.hPrey;
  if(T){if(!hnAlive(T)||u.hT>14||!inDP(T.x,T.y,1)){hnDrop(u);u.full=R(6,12);u.st='fly';return;}u.hT+=dt;up(T.flap!==undefined?.9:.55);const d=dist(u,T);
    if(d<34){hnCatch(u,T);u.st='perch';u.perch=null;u.t=R(4,8);return;}
    wdMove(u,T.x,T.y,FAUNA.wdragon.sp*1.12,dt);if(d<150&&u.fcd<=0){u.fcd=3;wdFire(u,.6);}T.hChased=G.t;return;}
  if(u.st==='perch'){up(0);if(u.perch&&d2(u.x,u.y,u.perch.x,u.perch.y)>6)wdMove(u,u.perch.x,u.perch.y,60,dt);if(u.hp<u.maxHp)u.hp=Math.min(u.maxHp,u.hp+1.5*dt);
    if(u.t<=0){u.st='fly';u.t=R(9,16);u.wp=null;u.perch=null;}return;}
  if(u.st==='land'){up(.25);const p=u.perch||(u.perch=wdPerchSpot(u));if(wdMove(u,p.x,p.y-4,FAUNA.wdragon.sp*.6,dt)){u.st='perch';u.t=R(6,14);}return;}
  up(1);if(!u.wp||wdMove(u,u.wp.x,u.wp.y,FAUNA.wdragon.sp*.65,dt))u.wp=ZONES.drpeaks.s(); // fly: lazy loops around the territory
  if(u.t<=0){u.st='land';u.perch=wdPerchSpot(u);}}
{const _uw=updWild;updWild=function(u,dt){if(u.species==='wdragon'){updWD(u,dt);return;}return _uw(u,dt);};}
// never "killed" outright: at 1 HP it is dazed (cartoon stars) and can be gulped; getting hurt makes it (and in Normal its pack) defend
{const _hu=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.species==='wdragon'&&!u.dead){if(u.daze>0){u.hp=Math.max(1,u.hp-d);return;}d=Math.min(d,Math.max(0,u.hp-1));u.hp-=d;u.angry=G.t;
    if(wdThreat()&&u.st!=='attack'&&u.st!=='flee'&&u.hp>u.maxHp*.3)wdAggro(u);
    if(u.hp<=1){u.daze=6;u.st='perch';if(u.hPrey)hnDrop(u);float(u.x,u.y-50,'The wild dragon is dazed! Gulp it (E)!','#ffe28a');}return;}
  return _hu.apply(this,arguments);};}
TOUGH.wdragon={chk:u=>u.hp>u.maxHp*.4&&!(u.daze>0),hit:u=>{hurtUnit(u,22,'bite');D.hp-=2*G.dmgMul;D.hurt=.2;float(u.x,u.y-60,'CHOMP! The wild dragon wriggles free! Wear it down below 40% first','#ffd27a');}};
{const _eu=eatUnit;eatUnit=function(u){const w=u&&u.species==='wdragon'&&!u.dead;_eu.apply(this,arguments);if(w){G.stats.wdragons=(G.stats.wdragons||0)+1;float(u.x,u.y-70,'A wild dragon? GULP! *burp*  +200 pts','#ffd27a');}};}
{const _cs=calcScore;calcScore=function(){return _cs()+(((G&&G.stats&&G.stats.wdragons)||0)*200);};}
// slow respawn: a dragonet hatches from a nest about every 100 s while the roost is below 6; goats & eagles top up too
function wdRespawn(dt){G.wdT=(G.wdT||0)+dt;if(G.wdT<15)return;G.wdT=0;G.wdR=(G.wdR||0)+15;
  if(units.filter(u=>!u.dead&&u.species==='mgoat'&&u.wdg).length<preyN('wdgoat',7))wdGoat(true);
  if(birds.filter(b=>!b.dead&&b.wdp).length<3&&rnd()<.3)wdEagle();
  const W=units.filter(u=>!u.dead&&u.species==='wdragon');if(W.length>=WD_N){G.wdR=0;return;}if(G.wdR<100)return;
  const N=WD_NESTS.map((n,i)=>[n,i]).filter(([n])=>d2(n.x,n.y,D.x,D.y)>700);if(!N.length)return;const[n,i]=N[RI(0,N.length-1)],used=new Set(W.map(u=>u.col));let c=0;while(used.has(c)&&c<WD_COLS.length-1)c++;
  const u=mkWD(n.x,n.y,c,i,{hp:Math.round(FAUNA.wdragon.hp*.7)});u.perch=n;u.t=R(6,10);G.wdR=0;G.wdHatch=(G.wdHatch||0)+1;if(dist(n,D)<1600)float(n.x,n.y-50,'Crack! A wild dragon hatches in the Dragon Peaks!','#e8d0ff');}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over)wdRespawn(dt);};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);G.wdT=0;G.wdR=0;wdInit();return r;};}
// art: a cartoon dragon like yours at ~45% size in its own colour; shadow on the ground, body lifted by altitude
function drawWD(u){const C=WD_COLS[u.col%WD_COLS.length],h=u.alt*70,x=u.x,y=u.y,a=u.ang,wOpen=clamp((u.alt-.05)/.4,0,1),flap=Math.sin(u.flapT),S=DS*WD_SCALE;
  ctx.save();ctx.translate(x+h*.25,y+h*.12);ctx.scale(S,S);ctx.rotate(a);ctx.globalAlpha=.28-.1*u.alt;ell(0,0,62,22,'#000');ell(-70,0,28,7,'#000');if(wOpen>0){const L=95*wOpen*(.7+.3*flap);poly([10,-14,-30,-14-L,-40,-14-L*.4,-20,-14],'#000');poly([10,14,-30,14+L,-40,14+L*.4,-20,14],'#000');}ctx.restore();
  ctx.save();ctx.translate(x,y-h);const k=S*(1+.18*u.alt);ctx.scale(k,k);ctx.rotate(a);
  const hurt=u.burn>0&&Math.floor(G.t*20)%2===0,body=hurt?'#ff9a7a':C[0],dark=C[1],belly=C[2],wingc=C[3],sway=Math.sin(G.t*2.6+u.id*9)*.25;
  ctx.lineCap='round';let px=-36,py=0;for(let i=0;i<8;i++){const nx=-36-i*10,ny=Math.sin(sway*3+i*.5)*i*2.2;line(px,py,nx,ny,body,18-i*2);if(i%2===0)poly([nx,ny-4,nx-6,ny,nx,ny+4],dark);px=nx;py=ny;}poly([px-2,py-9,px-18,py,px-2,py+9],dark);
  if(u.alt<.6){ctx.globalAlpha=1-u.alt/.6;[[22,1],[22,-1],[-22,1],[-22,-1]].forEach(([lx,s])=>ell(lx,s*22,9,6,dark));ctx.globalAlpha=1;}
  for(const s of[-1,1]){if(wOpen<1){ctx.globalAlpha=1-wOpen;poly([16,s*12,-6,s*22,-36,s*20,-30,s*12],wingc);ctx.globalAlpha=1;}
    if(wOpen>0){const L=100*wOpen*(.72+.28*flap),sw=flap*14*wOpen,sx=14,sy=s*15,ex=-6+sw*.2,ey=s*(15+L*.85),tx=-36-sw,ty=s*(15+L);ctx.globalAlpha=wOpen;
      poly([sx,sy,ex,ey,tx,ty,-40,s*(15+L*.55),-46,s*(15+L*.32),-34,s*16],wingc);line(sx,sy,ex,ey,dark,4);line(ex,ey,tx,ty,dark,3);line(ex,ey,-40,s*(15+L*.55),dark,2);ctx.globalAlpha=1;}}
  ell(0,0,42,22,body);ell(4,0,30,12,belly);ell(0,0,40,6,dark);for(let i=-3;i<=3;i++)poly([i*10-4,0,i*10+3,-6,i*10+5,0],belly);
  line(26,0,52,Math.sin(G.t*2)*2,body,18);ctx.save();ctx.translate(60,Math.sin(G.t*2)*2);
  ell(0,0,17,12,body);ell(14,0,10,7.5,body);line(-6,-8,-20,-17,'#eee6c8',3.5);line(-6,8,-20,17,'#eee6c8',3.5);
  ell(4,-7,3.5,2.6,'#ffd31a');ell(4,7,3.5,2.6,'#ffd31a');ell(5,-7,1.2,2,'#000');ell(5,7,1.2,2,'#000');
  if(u.fireT>0){const f=u.fireT/.55,L=(70+60*(1-f))*(u.fireL||1);ctx.globalAlpha=Math.min(1,f*1.6);for(let i=0;i<6;i++){const t=i/5,r=6+t*16;ell(24+t*L,Math.sin(G.t*30+i)*3,r,r*.7,i<2?'#fff3a0':i<4?'#ffb020':'#ff6020');}ctx.globalAlpha=1;}
  ctx.restore();ctx.restore();
  const by=y-h-36;if(u.daze>0){for(let i=0;i<3;i++){const aa=G.t*4+i*2.1;hnStar(x+Math.cos(aa)*18,by-6+Math.sin(aa)*5,4,'#ffe35a');}}
  if(u.hp<u.maxHp||u.st==='attack')miniBar(x,by,u.hp/u.maxHp,34);}
{const _df=drawFauna;drawFauna=function(u){if(u.species==='wdragon'){drawWD(u);return;}_df(u);};}
// Tally section, map markers, save/load
function tallyAddSect(id,name,icon,col,keys,before){if(typeof TALLY_SECT==='undefined')return;let s=TALLY_SECT.find(q=>q.id===id);
  if(!s){s={id,name,icon,col,keys:[]};const i=TALLY_SECT.findIndex(q=>q.id===(before||'boats'));TALLY_SECT.splice(i<0?TALLY_SECT.length:i,0,s);}
  for(const k of keys){if(!s.keys.some(q=>q[0]===k[0]))s.keys.push(k);TALLY_LABEL[k[0]]=k[1];}}
tallyAddSect('drpeaks','Animals · The Dragon Peaks','🐉','#c89aff',[['wdragon','Wild dragons']]);
{const _sm=drawSeaMap;drawSeaMap=function(X,Y,big,q){_sm.apply(this,arguments);for(const n of WD_NESTS)if(seen(n.x,n.y)){ctx.fillStyle='#b08a50';ctx.fillRect(X(n.x)-q*.6,Y(n.y)-q*.6,q*1.2,q*1.2);}
  for(const u of units)if(u.species==='wdragon'&&!u.dead&&seen(u.x,u.y)){const x=X(u.x),y=Y(u.y),r=big?5:3;ctx.fillStyle=WD_COLS[u.col%WD_COLS.length][0];ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y+r*.7);ctx.lineTo(x-r,y+r*.7);ctx.closePath();ctx.fill();}};}
{const _ss=svSnapshot;svSnapshot=function(){G.wdS=[];for(const u of units)if(!u.dead&&u.species==='wdragon')G.wdS.push(Math.round(u.x),Math.round(u.y),Math.round(u.hp),u.col,u.nest);return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);const S=G.wdS;if(Array.isArray(S)){for(const u of units)if(u.species==='wdragon')u.dead=true;units=units.filter(u=>u.species!=='wdragon');
    for(let i=0;i+4<S.length;i+=5){const u=mkWD(S[i],S[i+1],S[i+3]|0,S[i+4]|0);u.hp=clamp(S[i+2],1,u.maxHp);u.perch=wdPerchSpot(u);u.st='land';}}HN.list=null;return r;};}
