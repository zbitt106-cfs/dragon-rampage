// ======================= regional wildlife, mounted knights and roaming patrols =======================
// prey populations (+5%): each cap is the old count x1.05, rounded up or down at random (once per game) so the average is exactly +5% even for small groups
const PREY_MUL=1.05;let HN_CAP={};
function preyN(key,n){if(!(key in HN_CAP)){const x=n*PREY_MUL,f=Math.floor(x+1e-9);HN_CAP[key]=f+(rnd()<x-f?1:0);}return HN_CAP[key];}
const FAUNA={
  deer:{hp:20,sp:95,flee:260,zone:'forest'},rabbit:{hp:5,sp:85,flee:200,zone:'forest'},fox:{hp:7,sp:105,flee:240,zone:'forest'},
  boar:{hp:16,sp:85,bite:2,aggro:110,cd:1.6,say:'Snort! Bonk! -2',zone:'forest'},
  wolf:{hp:14,sp:110,bite:2,aggro:240,cd:1.4,say:'Grr! Nip! -2',zone:'forest'},
  bear:{hp:44,sp:75,bite:5,aggro:170,cd:2,say:'ROAR! Bear swipe! -5',zone:'forest'},
  horse:{hp:18,sp:120,flee:240,zone:'paddock'},fish:{hp:2,zone:'water'},beaver:{hp:7,sp:50,flee:160,zone:'shore'},
  mgoat:{hp:12,sp:105,flee:260,zone:'mountain'},cougar:{hp:30,sp:100,bite:4,aggro:210,cd:1.8,say:'Rrrowr! Claw swipe! -4',zone:'peaks'},goat:{hp:10,sp:80,flee:210,zone:'hills'},
  crab:{hp:3,sp:40,flee:120,zone:'beach'},seal:{hp:18,sp:35,flee:150,zone:'beach'}};
const FAUNA_PLAN=[['deer',12],['rabbit',12],['fox',6],['boar',6],['wolf',3],['bear',3],['horse',9],['fish',14],['beaver',6],['mgoat',22],['cougar',3],['goat',10],['crab',12],['seal',6]]; // wolf counts packs of 3
const ZONES={
  forest:{ok:(x,y)=>regionKey(x,y)==='forest',s:()=>({x:R(-2900,-300),y:R(-100,4200)})},
  water:{ok:(x,y)=>!inSea(x,y)&&(inLake(x,y)||riverD(x,y)<RIVW-8),s:()=>{if(rnd()<.6){const a=R(0,TAU),r=R(0,.8);return{x:LAKE.x+Math.cos(a)*LAKE.rx*r,y:LAKE.y+Math.sin(a)*LAKE.ry*r};}
    const i=RI(0,RIVER.length-2),t=rnd();return{x:RIVER[i][0]+(RIVER[i+1][0]-RIVER[i][0])*t,y:RIVER[i][1]+(RIVER[i+1][1]-RIVER[i][1])*t};}},
  shore:{ok:(x,y)=>true,s:()=>{const a=R(0,TAU);return{x:LAKE.x+Math.cos(a)*LAKE.rx*1.06,y:LAKE.y+Math.sin(a)*LAKE.ry*1.06};}},
  mountain:{ok:(x,y)=>y<frostY(x)-120&&y>WY0+500&&x>WX0+300&&!inSea(x,y),s:()=>({x:R(-2700,5000),y:R(-1700,-450)})},
  hills:{ok:(x,y)=>regionKey(x,y)==='hills',s:()=>rnd()<.25?{x:R(2700,3150),y:R(950,1650)}:{x:R(3300,5000),y:R(-50,2950)}},
  beach:{ok:onBeach,s:()=>{if(rnd()<.75){const y=R(-50,4300);return{x:coastX(y)-R(20,150),y};}const x=R(400,5300);return{x,y:coastY(x)-R(20,130)};}},
  paddock:{ok:()=>true,s:()=>{const P=PADDOCKS[RI(0,PADDOCKS.length-1)];return{x:P.x+R(15,P.w-15),y:P.y+R(15,P.h-15),P};}},
  // the slopes around Dragon Peak: a healthy mountain-goat herd lives here
  summit:{ok:(x,y)=>y<frostY(x)-120&&y>WY0+420&&!inSea(x,y)&&d2(x,y,LAIR.x,LAIR.y)>230&&d2(x,y,LAIR.x,LAIR.y)<1300,s:()=>{const a=R(0,TAU),r=R(300,1150);return{x:LAIR.x+Math.cos(a)*r,y:LAIR.y+Math.sin(a)*r*.75};}},
  // mountain lions prowl the snowy mountains and the eastern hills
  peaks:{ok:(x,y)=>(y<frostY(x)-120&&y>WY0+420&&x>WX0+300&&!inSea(x,y))||regionKey(x,y)==='hills',s:()=>rnd()<.6?{x:R(-2000,5000),y:R(-1900,-500)}:{x:R(3300,5000),y:R(-50,2950)}},
  any:{ok:(x,y)=>!inSea(x,y),s:()=>({x:D.x,y:D.y})}};
let packId=0;
function spawnWild(sp,far,at){const F=FAUNA[sp],zk=sp==='mgoat'&&rnd()<.7?'summit':F.zone,Z=ZONES[zk];let p=at||null;
  for(let t=0;!p&&t<80;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>750))p=q;}if(!p)return;
  const big=sp==='bear'||sp==='wolf'||sp==='cougar',hw=big?900:sp==='crab'||sp==='seal'?260:600,hh=big?700:sp==='crab'||sp==='seal'?260:450;
  const home=p.P||(F.zone==='shore'?{x:p.x-80,y:p.y-50,w:160,h:100}:{x:p.x-hw/2,y:p.y-hh/2,w:hw,h:hh});const n=sp==='wolf'?3:1,pk=sp==='wolf'?++packId:0;
  for(let i=0;i<n;i++)units.push(mkUnit('animal',p.x+R(-30,30)*(n>1),p.y+R(-20,20)*(n>1),{species:sp,wild:true,zone:zk,home,strict:!!p.P,hp:F.hp,maxHp:F.hp,free:true,pack:pk,t:R(0,3),jt:0}));}
function initFauna(){for(const[sp,n]of FAUNA_PLAN)for(let i=0;i<n;i++)spawnWild(sp,false);}
function updFauna(dt){G.faunaT=(G.faunaT||0)-dt;if(G.faunaT>0)return;G.faunaT=5;
  for(const[sp,n]of FAUNA_PLAN){const have=sp==='wolf'?new Set(units.filter(u=>!u.dead&&u.species==='wolf'&&u.pack).map(u=>u.pack)).size:units.filter(u=>!u.dead&&u.wild&&u.species===sp&&!u.bolted&&u.herd===undefined).length; // northern herds (partGH) keep their own count
    if(have<n)spawnWild(sp,true);}}
function updWild(u,dt){const F=FAUNA[u.species],Z=ZONES[u.zone],dd=dist(u,D),ox=u.x,oy=u.y;u.cd=(u.cd||0)-dt;u.t-=dt;
  if(u.species==='fish'){updFish(u,dt,dd);return;}
  u.leap=Math.max(0,(u.leap||0)-dt);if(u.species==='cougar'&&updCougar(u,dt,dd,ox,oy))return;
  if(u.bolted>0){u.bolted-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*50,u.y+Math.sin(a)*50,150,dt);if(u.bolted<=0)u.home={x:u.x-300,y:u.y-200,w:600,h:400};return;}
  if(F.bite&&!G.over&&!G.won&&!(u.burn>0)){const low=D.alt<.4;
    if(u.state==='back'){u.t2-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*.8,dt);if(u.t2<=0)u.state='idle';if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}return;}
    const angry=low&&(dd<F.aggro||(u.pack&&(G.packAngry[u.pack]||-9)>G.t-3&&dd<F.aggro*2.2));
    if(angry){u.state='hunt';if(u.pack)G.packAngry[u.pack]=G.t;
      if(!u.growl||G.t-u.growl>6){u.growl=G.t;float(u.x,u.y-26,F.growl||(u.species==='wolf'?'Awooo!':u.species==='bear'?'GRRR!':'Snort snort!'),'#ffd0a0');}
      if(dd>34)moveTo(u,D.x,D.y,F.sp,dt);else if(u.cd<=0){u.cd=F.cd;hurtDragon(F.bite,u.species);float(D.x+R(-20,20),D.y-90,F.say,'#ffb0a0');u.state='back';u.t2=u.species==='bear'?.7:1;}
      if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}return;}
    if(u.state==='hunt')u.state='idle';
    if(u.species==='bear'&&D.alt>.5&&dd<220){u.rear=1;}else u.rear=0;}
  if((F.flee&&dd<F.flee*(D.alt>.5?.8:1))||u.burn>0){const a=Math.atan2(u.y-D.y,u.x-D.x)+R(-.4,.4);if(u.species==='mgoat'||u.species==='goat'){if(!u.leap){u.leap=.55;if(dd<700&&rnd()<.5)puff(u.x,u.y,3,u.zone==='summit'?'rgba(240,245,255,':'rgba(160,140,110,',40,3);}}moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp,dt);u.tgt=null;}
  else{if(!u.tgt||u.t<=0){u.t=R(2,6);const H=u.home;u.tgt={x:H.x+R(0,H.w),y:H.y+R(0,H.h)};}
    if(moveTo(u,u.tgt.x,u.tgt.y,F.sp*(u.species==='crab'?.6:.22),dt))u.tgt=null;}
  if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;u.tgt=null;}
  const H=u.home,m=u.strict?8:-220;u.x=clamp(u.x,H.x+m,H.x+H.w-m);u.y=clamp(u.y,H.y+m,H.y+H.h-m);}
function updFish(u,dt,dd){const Z=ZONES.water,ox=u.x,oy=u.y;
  if(u.jt>0){u.jt-=dt;u.x+=u.vx*dt;u.y+=u.vy*dt;if(u.jt<=0){u.jt=0;if(dd<900)puff(u.x,u.y,4,'rgba(200,230,255,',40,3);}}
  else{u.x+=Math.sin(G.t*.5+u.id*9)*12*dt;u.y+=Math.cos(G.t*.4+u.id*7)*6*dt;if(u.t<=0){u.t=R(1.5,4.5);u.jt=.9;u.vx=R(-45,45);u.vy=R(-12,12);u.face=u.vx>0?1:-1;if(dd<450&&rnd()<.3)float(u.x,u.y-34,'Splash!','#bfe6ff');}}
  if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;u.vx*=-1;}}
const fishZ=u=>u.jt>0?Math.sin(Math.PI*(.9-u.jt)/.9)*30:0;
function drawFauna(u){if(u.species==='cougar'){drawCougar(u);return;}if(DES_SP.has(u.species)){drawDesertFauna(u);return;}const x=u.x,y=u.y,s=u.species,f=u.face||1,b=0,lift=animalLift(u),tk=hopTuck(u),legs=(lx,c,len,w)=>tk?line(x+lx,y-len,x+lx-f*(lx>0?-1:1)*tk*2.2,y+1-tk*len*.5,c,w||1.6):line(x+lx,y-len,x+lx+Math.sin(u.anim+lx)*1.5,y+1+stretchLeg(u),c,w||1.6);
  if(s==='fish'){if(u.jt>0){const z=fishZ(u);ell(x,y+1,6,2,'rgba(30,60,120,.3)');ctx.save();ctx.translate(x,y-z);ctx.rotate(f*(u.jt-.45)*1.6);ell(0,0,8,3.5,'#e8904a');poly([-f*7,0,-f*13,-4,-f*13,4],'#e07a3a');ell(f*4,-1,1.2,1.2,'#222');ctx.restore();}
    else{ctx.strokeStyle='rgba(220,240,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,y,5+Math.sin(G.t*3+u.id*20)*2,2,0,0,TAU);ctx.stroke();}return;}
  {const sk=Math.max(.45,1-lift/30);ell(x,y+1,(s==='bear'||s==='horse'?13:s==='crab'?6:9)*sk,3.5*sk,'rgba(0,0,0,.2)');}
  ctx.save();ctx.translate(0,-lift); // ONE translate lifts every part of the animal together (hop / bob / flop)
  if(s==='horse'){for(const lx of[-7,-3,4,8])legs(lx,'#5a3a20',6,2);ell(x,y-10-b,12,5.5,'#9a6236');ell(x+f*11,y-17-b,3.6,5.5,'#9a6236');ell(x+f*14,y-20-b,4.5,3,'#9a6236');
    line(x+f*8,y-20-b,x+f*5,y-12-b,'#3a2410',3);line(x-f*12,y-11-b,x-f*16,y-4-b,'#3a2410',2.5);ell(x+f*15,y-21-b,1,1,'#111');}
  else if(s==='boar'){for(const lx of[-5,-2,3,6])legs(lx,'#3a2a20',4,1.6);ell(x,y-7-b,10,5.5,'#5a4436');ell(x+f*9,y-7-b,4.5,4,'#5a4436');ell(x+f*13,y-6-b,2,1.8,'#c8a090');
    line(x+f*12,y-5-b,x+f*14,y-9-b,'#fff',1.4);for(let i=-6;i<=4;i+=3)line(x+i,y-12-b,x+i-1,y-15-b,'#2a1a10',1.2);}
  else if(s==='fox'){for(const lx of[-4,-1,3,5])legs(lx,'#222',4,1.3);ell(x,y-6-b,8,3.8,'#e07a30');ell(x+f*8,y-8-b,3.5,3,'#e07a30');poly([x+f*7,y-11-b,x+f*8,y-15-b,x+f*10,y-11-b],'#e07a30');
    ell(x-f*10,y-7-b,5,2.5,'#e07a30');ell(x-f*14,y-7-b,2,1.6,'#fff');ell(x+f*11,y-7-b,1.3,1,'#222');}
  else if(s==='wolf'){for(const lx of[-5,-2,3,6])legs(lx,'#555',5,1.6);ell(x,y-8-b,10,4.5,'#8a8e96');ell(x+f*10,y-10-b,4,3.4,'#8a8e96');poly([x+f*8,y-13-b,x+f*9,y-18-b,x+f*11,y-13-b],'#8a8e96');
    line(x-f*9,y-9-b,x-f*16,y-12-b+(u.state==='hunt'?-3:3),'#8a8e96',3);ell(x+f*11,y-11-b,1.2,1,u.state==='hunt'?'#f33':'#ff0');}
  else if(s==='bear'){const r=u.rear?8:0;for(const lx of[-7,-3,4,8])legs(lx,'#3a2414',6,3);ell(x,y-12-b-r,14,8+r*.5,'#6a4426');ell(x+f*12,y-17-b-r*1.6,6,5,'#6a4426');
    ell(x+f*9,y-22-b-r*1.6,2.3,2.3,'#6a4426');ell(x+f*16,y-16-b-r*1.6,2.5,2,'#c8a07a');ell(x+f*14,y-18-b-r*1.6,1.2,1.2,'#111');if(u.hp<u.maxHp){rect(x-10,y-34-r,20,2.5,'#400');rect(x-10,y-34-r,20*u.hp/u.maxHp,2.5,'#e44');}}
  else if(s==='beaver'){ell(x,y-4-b,7,4.5,'#7a4a24');ell(x+f*6,y-6-b,3.4,3,'#7a4a24');ell(x-f*9,y-2,4.5,2,'#4a2a14');rect(x+f*8-1,y-5-b,2,2,'#fff');ell(x+f*7.5,y-7-b,1,1,'#111');}
  else if(s==='mgoat'||s==='goat'){const c=s==='mgoat'?'#f2f0ea':'#c8b89a';for(const lx of[-4,-1,3,5])legs(lx,'#333',5,1.4);ell(x,y-8-b,8,4.5,c);ell(x+f*8,y-11-b,3.2,3,c);
    ctx.strokeStyle=s==='mgoat'?'#555':'#6a5a40';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x+f*7,y-14-b,3,Math.PI,Math.PI*1.9);ctx.stroke();ell(x+f*9,y-8-b,1,2,'#ddd');}
  else if(s==='crab'){const sx=Math.sin(u.anim*2)*1.5;ell(x+sx,y-3,5.5,3.5,'#e0402a');for(let i=-1;i<=1;i+=2){line(x+sx+i*4,y-3,x+sx+i*8,y-1,'#c03020',1.2);ell(x+sx+i*7,y-6,2,1.5,'#e0402a');}ell(x+sx-1.5,y-6,.9,.9,'#111');ell(x+sx+1.5,y-6,.9,.9,'#111');}
  else if(s==='seal'){const r=0;ell(x,y-4-r,12,5,'#7d8590');ell(x+f*10,y-7-r,4.5,4,'#7d8590');ell(x+f*12,y-8-r,1.1,1.1,'#111');ell(x+f*14,y-7-r,1.4,1,'#333');poly([x-f*11,y-4,x-f*16,y-7,x-f*16,y-1],'#6a727c');}
  if(u.burn>0)ell(x,y-8,8,5,'rgba(255,120,0,.6)');ctx.restore();}
// one shared lift for every hopping / bobbing animal, used by both the Low drawing and the High-graphics fur overlay
function goatHopP(u){return (u.species==='mgoat'||u.species==='goat')&&u.leap>0?Math.min(1,Math.max(0,(.55-u.leap)/.55)):-1;}
function animalLift(u){const s=u.species,p=goatHopP(u);if(p>=0)return Math.sin(p*Math.PI)*12;
  if(s==='rabbit')return Math.abs(Math.sin(u.anim*1.3))*3;if(s==='chicken')return Math.abs(Math.sin(u.anim))*2;if(s==='seal')return (Math.sin(G.t*2+u.id*5)+1)*.9;
  if(DES_SP.has(s))return s==='camel'||s==='dfox'?Math.abs(Math.sin(u.anim||0))*1.5:0;return Math.abs(Math.sin(u.anim||0))*(FAUNA_ART.has(s)?1.2:1);}
function hopTuck(u){const p=goatHopP(u);return p>=0?Math.max(0,Math.sin(p*Math.PI)-.25)/.75:0;} // legs tuck up mid-air
function stretchLeg(u){const p=goatHopP(u);return p>=0?Math.min(1.5,animalLift(u)*.25):0;} // legs reach for the ground at take-off and landing
// cartoon mounted knight: horse + rider with a lance (lowered when charging)
function drawCavalry(u){const x=u.x,y=u.y,f=u.face,g=Math.sin(u.anim*1.6);
  ell(x,y+2,16,5,'rgba(0,0,0,.25)');for(const lx of[-8,-4,5,9])line(x+lx,y-7,x+lx+g*3*(lx>0?1:-1),y+1,'#3a2410',2.2);
  ell(x,y-11,13,6,u.burn>0?'#a64':'#e8e2d4');rect(x-8,y-14,16,6,u.colr);ell(x+f*12,y-17,3.6,5.5,'#e8e2d4');ell(x+f*15,y-21,4.6,3,'#e8e2d4');ell(x+f*16,y-22,1,1,'#111');line(x-f*13,y-12,x-f*17,y-4,'#888',2.5);
  rect(x-3,y-27,6,11,'#c8ccd4');ell(x,y-30,3.3,3.3,'#aab0ba');poly([x-3,y-33,x+3,y-33,x,y-38],u.colr);
  if(u.cs==='charge')line(x-f*8,y-22,x+f*34,y-18,'#8a6a40',2.5);else line(x-f*4,y-20,x+f*20,y-44,'#8a6a40',2.2);
  if(u.cs==='charge'){ctx.fillStyle='#ddd';ell(x+f*35,y-18,2.2,2.2,'#eee');}
  if(u.banner)drawFlag(x-f*4,y-28,u);
  if(u.hp<u.maxHp){rect(x-10,y-44,20,2.5,'#400');rect(x-10,y-44,20*u.hp/u.maxHp,2.5,'#e44');}}
function drawFlag(x,y,u){line(x,y,x,y-30,'#5a3a1a',2);const w=Math.sin(G.t*6+u.id*9)*2;poly([x,y-30,x+16,y-27+w,x,y-20],'#c22');ell(x+6,y-25+w*.5,2.5,2.5,'#ffd84a');}

// ---------- mounted knights ----------
function updCavalry(u,dt){const dd=dist(u,D),ground=D.alt<DR.hitAltSword;u.anim+=dt*(u.cs==='charge'?14:8);const ox=u.x,oy=u.y,bl=uBlocked(u);
  if(u.ha===undefined)u.ha=Math.atan2(D.y-u.y,D.x-u.x);if(!u.cs){u.cs='wheel';u.t=.6;}
  if(u.cs==='charge'){u.t-=dt;u.x+=Math.cos(u.ha)*270*dt;u.y+=Math.sin(u.ha)*270*dt;u.face=Math.cos(u.ha)>0?1:-1;
    if(ground&&!u.hitThis&&dd<46){u.hitThis=true;hurtDragon(11,'lance');float(D.x,D.y-90,'Lance hit! -11','#ffb0a0');D.vx+=Math.cos(u.ha)*120;D.vy+=Math.sin(u.ha)*120;}
    const along=(D.x-u.x)*Math.cos(u.ha)+(D.y-u.y)*Math.sin(u.ha);if(u.t<=0||along<-170){u.cs='wheel';u.t=R(.9,1.5);}}
  else{u.t-=dt;const wp=riverRoute(u,D.x,D.y),want=wp?Math.atan2(wp.y-u.y,wp.x-u.x):Math.atan2(D.y-u.y,D.x-u.x);u.ha+=clamp(angDiff(want,u.ha),-2.4*dt,2.4*dt);const sp=dd<160&&!ground?90:160;u.x+=Math.cos(u.ha)*sp*dt;u.y+=Math.sin(u.ha)*sp*dt;u.face=Math.cos(u.ha)>0?1:-1;
    if(u.t<=0&&ground&&!wp&&Math.abs(angDiff(want,u.ha))<.3&&dd>130&&dd<650){u.cs='charge';u.t=2.6;u.hitThis=false;u.ha=want;if(rnd()<.5)float(u.x,u.y-44,'Charge!','#ffe0a0');}}
  u.x=clamp(u.x,WX0+40,WX1-40);u.y=clamp(u.y,WY0+40,WY1-40);if(bl(u.x,u.y)&&!bl(ox,oy)){u.x=ox;u.y=oy;if(u.cs==='charge'){u.cs='wheel';u.t=.8;}else u.ha+=1.2*dt;}}
function dismount(u,src){u.mounted=false;u.maxHp=45;u.hp=Math.min(u.hp,45);u.cs=null;
  const h=mkUnit('animal',u.x+R(-10,10),u.y+8,{species:'horse',wild:true,zone:'any',home:{x:u.x-300,y:u.y-200,w:600,h:400},hp:18,maxHp:18,free:true,bolted:4,t:0,face:-u.face});units.push(h);
  float(u.x,u.y-44,src==='fire'?'Hot! The horse bolts!':'Dismounted! The horse runs off!','#ffe0a0');}
function mkCavalry(x,y,o){return mkUnit('knight',x,y,Object.assign({mounted:true,hp:90,maxHp:90,atk:0,colr:['#c33','#33c','#cc3','#3a3'][RI(0,3)]},o||{}));}

// ---------- roaming patrols (independent of the wanted meter) ----------
let patrols=[],patrolId=0;
const PATROL_MIX=[['knight','knight','archer'],['cavalry','cavalry','cavalry'],['archer','archer','archer','archer','knight','knight'],['knight','knight','knight'],['cavalry','knight','archer'],['cavalry','cavalry','archer','archer']];
function patrolPoints(){return[{x:GATE.x,y:GATE.y+80},...VILLAGES.map(v=>({x:v.x,y:v.y+110})),{x:CAMP.x+120,y:CAMP.y},{x:MINE.x-110,y:MINE.y+70},{x:CABIN.x+110,y:CABIN.y+70},{x:LOGPILE_POS.x+60,y:LOGPILE_POS.y+60}];}
function spawnPatrol(){const lvl=G.lvl,mix=[...PATROL_MIX[RI(0,PATROL_MIX.length-1)]];for(let i=1;i<lvl;i++)mix.push(['knight','archer','cavalry'][RI(0,2)]);if(G.easy&&mix.length>2)mix.pop();
  const p={id:++patrolId,members:[],engaged:false,wp:null},hpM=1+.2*(lvl-1),colr=['#c33','#33c','#cc3','#3a3'][RI(0,3)];
  const wg=waveGates();mix.forEach((k,i)=>{const x=GATE.x+R(-20,20),y=GATE.y+10+i*6;let u;
    if(k==='archer'&&G.waveNum<wg.arch)k='foot';if(k==='cavalry'&&G.waveNum<wg.cav)k=G.waveNum<3?'foot':'knight'; // early patrols: foot soldiers & knights only
    if(k==='foot')u=mkUnit('knight',x,y,{hp:24,maxHp:24,atk:0,foot:true,colr});else if(k==='cavalry')u=mkCavalry(x,y,{colr});else if(k==='archer')u=mkUnit('archer',x,y,{hp:22,maxHp:22,shootT:R(1,3)});else u=mkUnit('knight',x,y,{hp:45,maxHp:45,atk:0,colr});
    u.hp=u.maxHp=Math.round(u.maxHp*hpM);u.patrol=p;u.born=G.t;p.members.push(u);});
  // the banner carrier leads the column
  let bi=p.members.findIndex(u=>u.type==='knight'&&!u.mounted);if(bi<0)bi=p.members.findIndex(u=>u.type==='knight');const bc=p.members[bi>=0?bi:0];bc.banner=true;p.members.splice(p.members.indexOf(bc),1);p.members.unshift(bc);
  units.push(...p.members);patrols.push(p);G.gateOpenT=Math.max(G.gateOpenT,2);return p;}
function engagePatrol(p){if(p.engaged)return;p.engaged=true;p.engT=G.t;const L=p.members.find(u=>!u.dead);if(L)float(L.x,L.y-50,'Patrol: "There\'s the dragon!"','#ffe0a0');}
function updPatrols(dt){G.patrolT-=dt;const cap=(G.easy?2:3)+Math.min(2,G.lvl-1)+treasPatrols();
  if(G.patrolT<=0){G.patrolT=G.easy?70:45;if(patrols.length<cap&&units.length<420)spawnPatrol();}
  const P=patrolPoints();
  for(const p of patrols){p.members=p.members.filter(u=>!u.dead);if(!p.members.length){p.dead=true;continue;}const L=p.members[0],dl=dist(L,D);
    if(!p.engaged){if(dl<340&&!G.over&&!G.won)engagePatrol(p);}
    else if((dl>1000&&G.t-p.engT>4)||G.over||G.won){p.engaged=false;p.wp=null;}
    if(p.engaged)continue;
    const far=Math.abs(L.x-D.x)>1800||Math.abs(L.y-D.y)>1400,sp=p.members.every(u=>u.mounted)?80:52;
    if(!p.wp){const opts=P.filter(q=>d2(q.x,q.y,L.x,L.y)>200&&d2(q.x,q.y,L.x,L.y)<2600);p.wp=opts.length?opts[RI(0,opts.length-1)]:P[0];}
    if(moveTo(L,p.wp.x,p.wp.y,sp,dt))p.wp=null;const ha=Math.atan2(p.wp?p.wp.y-L.y:0,p.wp?p.wp.x-L.x:1);
    for(let i=1;i<p.members.length;i++){const u=p.members[i],row=Math.ceil(i/2),side=i%2?1:-1,tx=L.x-Math.cos(ha)*30*row-Math.sin(ha)*18*side,ty=L.y-Math.sin(ha)*30*row+Math.cos(ha)*18*side;
      if(far){u.x=tx;u.y=ty;}else moveTo(u,tx,ty,sp*1.5,dt);if(u.mounted){u.cs='wheel';u.ha=ha;u.anim+=dt*6;}}
    if(L.mounted){L.cs='wheel';L.ha=ha;}}
  patrols=patrols.filter(p=>!p.dead);}
function drawShield(x,y,c){poly([x-4,y-4,x+4,y-4,x+4,y,x,y+5,x-4,y],'#fff');poly([x-3,y-3,x+3,y-3,x+3,y,x,y+3.6,x-3,y],c);}
