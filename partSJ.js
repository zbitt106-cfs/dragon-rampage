// ======================= THE GOLDEN SAVANNA & THE EMERALD JUNGLE (world expansion, west of the Scorching Sands) =======================
// Geometry lives in partD0 (desW / savW borders, WHOLE watering hole, JRIVER, RUINS). Everything here plugs into the existing systems:
// regions + terrain + decor, FAUNA / ZONES / FAUNA_PLAN (+5% prey via preyN), predator hunting (HN_DIET), food, Tally, hunger, fog/save.
const SAV_SP=['zebra','gazelle','wildebeest','giraffe','elephant','warthog','ostrich','lion','cheetah','hyena'];
const JUN_SP=['monkey','tapir','capybara','frog','jaguar','tiger','python'];
const SJ_SP=new Set([...SAV_SP,...JUN_SP]),SJ_HERD=new Set(['zebra','gazelle','wildebeest','elephant','giraffe']);
Object.assign(REGION_NAMES,{savanna:'The Golden Savanna',jungle:'The Emerald Jungle'});
Object.assign(REGION_SUB,{savanna:'Zebras, giraffes, elephants and prides of lions around the watering hole',jungle:'Monkeys, tigers, jaguars, pythons and crocs in the jungle river. Ruins hide in the green!'});
Object.assign(REGION_LABEL,{savanna:[-10700,1250],jungle:[-14700,1500]});
// ---------- terrain colour, blended smoothly desert -> savanna -> jungle ----------
const sjMix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],sjS=t=>t*t*(3-2*t);
function savCol(x,y,n){let c=sjMix([204,174,88],[178,150,70],n);const g=fbm(x/700+11,y/700);if(g>.62)c=sjMix(c,[150,152,74],.45);else if(g<.34)c=sjMix(c,[222,196,128],.4);
  const wd=Math.min(...WHOLES.map(H=>Math.hypot((x-H.x)/(H.rx+300),(y-H.y)/(H.ry+230))));if(wd<1.35)c=sjMix([104,140,62],c,clamp((wd-.8)/.55,0,1));return c;}
function junCol(x,y,n){let c=sjMix([30,80,36],[50,106,44],n);const g=fbm(x/240+40,y/240);if(g>.6)c=sjMix(c,[18,54,26],.5);else if(g<.3)c=sjMix(c,[66,122,50],.35);
  for(const r of RUINS){const d=d2(x,y,r.x,r.y);if(d<r.w*.75)c=sjMix([128,124,104],c,clamp((d-r.w*.45)/(r.w*.3),0,1));}return c;}
function westCol(x,y,wx,wy,n){const tD=clamp((wx-desW(wy))/700+.5,0,1);if(tD>=1)return desertCol(x,y,n);const tJ=clamp((savW(wy)-wx)/700+.5,0,1);
  let c=tJ>=1?junCol(x,y,n):tJ<=0?savCol(x,y,n):sjMix(savCol(x,y,n),junCol(x,y,n),sjS(tJ));if(tD>0)c=sjMix(c,desertCol(x,y,n),sjS(tD));return c;}
// ---------- decor: acacias, termite mounds, grass tufts, kopjes | canopy trees with vines, giant ferns, ruins, reeds ----------
function addWildDecor(r,Rr){const okS=(x,y)=>regionKey(x,y)==='savanna'&&!inWater(x,y)&&!inWHole(x,y,1.7),okJ=(x,y)=>regionKey(x,y)==='jungle'&&!inWater(x,y)&&jriverD(x,y)>JRW+22&&!RUINS.some(q=>d2(x,y,q.x,q.y)<q.w*.8);
  for(let i=0;i<170;i++){const x=Rr(-12950,-8450),y=Rr(-150,4250);if(okS(x,y))DECOR.push({k:'acacia',x,y,s:Rr(.8,1.4)});}
  for(let i=0;i<50;i++){const x=Rr(-12900,-8500),y=Rr(-100,4200);if(okS(x,y))DECOR.push({k:'termite',x,y,s:Rr(.8,1.35)});}
  for(let i=0;i<320;i++){const x=Rr(-12950,-8350),y=Rr(-150,4250);if(okS(x,y))DECOR.push({k:'tuft',x,y,s:Rr(.7,1.3),lo:i%2});}
  for(let i=0;i<12;i++){const x=Rr(-12600,-8800),y=Rr(100,4000);if(okS(x,y))DECOR.push({k:'kopje',x,y,s:Rr(.8,1.3)});}
  for(const H of WHOLES){const n=H===WHOLE?34:28;for(let i=0;i<n;i++){const a=i/n*TAU+Rr(-.1,.1),k=Rr(1.03,1.15);DECOR.push({k:'reed',x:H.x+Math.cos(a)*H.rx*k,y:H.y+Math.sin(a)*H.ry*k});}}
  for(let i=0;i<560;i++){const x=Rr(-16800,-12450),y=Rr(-150,4250);if(okJ(x,y))DECOR.push({k:'jtree',x,y,s:Rr(.85,1.5),v:r()<.6?1:0});}
  for(let i=0;i<460;i++){const x=Rr(-16800,-12450),y=Rr(-150,4250);if(okJ(x,y))DECOR.push({k:'fern',x,y,s:Rr(.7,1.4),lo:i%2});}
  for(let i=0;i<70;i++){const j=Math.floor(r()*(JRIVER.length-1)),p=JRIVER[j],q=JRIVER[j+1],t=r(),x=p[0]+(q[0]-p[0])*t+(r()<.5?-1:1)*(JRW+12),y=p[1]+(q[1]-p[1])*t;if(!inWater(x,y)&&regionKey(x,y)==='jungle')DECOR.push({k:'reed',x,y});}
  for(const q of RUINS)DECOR.push({k:'ruin',x:q.x,y:q.y,w:q.w});}
const _addDesertDecorSJ=addDesertDecor;addDesertDecor=function(r,Rr){_addDesertDecorSJ(r,Rr);addWildDecor(r,Rr);};
const SJ_DECOR=new Set(['acacia','termite','tuft','kopje','jtree','fern','ruin']);
// tiny draw helpers on a switchable context so the static decor can be baked into cached sprites (big perf win in the dense jungle)
let SJC=ctx,SJ_BAKE=false;
function sE(x,y,rx,ry,c){SJC.fillStyle=c;SJC.beginPath();SJC.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);SJC.fill();}
function sR(x,y,w,h,c){SJC.fillStyle=c;SJC.fillRect(x,y,w,h);}
function sP(pts,c){SJC.beginPath();SJC.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)SJC.lineTo(pts[i],pts[i+1]);SJC.closePath();SJC.fillStyle=c;SJC.fill();}
function sL(x1,y1,x2,y2,c,w){SJC.strokeStyle=c;SJC.lineWidth=w||1;SJC.beginPath();SJC.moveTo(x1,y1);SJC.lineTo(x2,y2);SJC.stroke();}
function sjPaint(o){const x=o.x,y=o.y,s=o.s||1;
  if(o.k==='acacia'){sE(x+18*s,y+3,30*s,6*s,'rgba(0,0,0,.18)');SJC.strokeStyle='#6a4a2a';SJC.lineWidth=4*s;SJC.beginPath();SJC.moveTo(x,y);SJC.lineTo(x+2*s,y-26*s);SJC.lineTo(x-12*s,y-44*s);SJC.moveTo(x+2*s,y-26*s);SJC.lineTo(x+14*s,y-46*s);SJC.stroke();
    sE(x+1*s,y-50*s,38*s,9*s,'#4e7428');sE(x-4*s,y-54*s,28*s,6*s,'#628a32');if(GFX_HI)sE(x+12*s,y-53*s,14*s,4*s,'#72a03a');return true;}
  if(o.k==='termite'){sE(x+6*s,y+2,14*s,4*s,'rgba(0,0,0,.2)');sP([x-12*s,y,x-6*s,y-22*s,x-2*s,y-38*s,x+3*s,y-26*s,x+7*s,y-30*s,x+12*s,y],'#b4784a');sP([x+3*s,y-26*s,x+7*s,y-30*s,x+12*s,y,x+2*s,y],'#9a6238');
    if(GFX_HI)for(let k=0;k<3;k++)sE(x-4*s+k*4*s,y-8*s-k*7*s,1.6*s,1.2*s,'#6a4020');return true;}
  if(o.k==='tuft'){if(!GFX_HI&&o.lo)return true;SJC.lineCap='round';for(let k=-3;k<=3;k++){sL(x+k*2*s,y,x+k*3.2*s+Math.sin(G.t*1.5+x)*1.5,y-(9+Math.abs(3-Math.abs(k))*2)*s,k%2?'#d8b85a':'#b8963e',1.4);}return true;}
  if(o.k==='kopje'){sE(x+10*s,y+4,46*s,10*s,'rgba(0,0,0,.2)');sE(x-14*s,y-12*s,22*s,16*s,'#8a847a');sE(x+14*s,y-10*s,20*s,14*s,'#7a746a');sE(x,y-24*s,18*s,14*s,'#9a948a');sE(x-4*s,y-30*s,8*s,4*s,'rgba(255,255,255,.18)');return true;}
  if(o.k==='jtree'){sE(x+16*s,y+4,34*s,8*s,'rgba(0,0,0,.25)');sR(x-5*s,y-58*s,10*s,58*s,'#5a4028');sL(x-5*s,y,x-12*s,y+3,'#5a4028',3*s);sL(x+5*s,y,x+12*s,y+3,'#5a4028',3*s);
    sE(x-16*s,y-64*s,26*s,20*s,'#1f5a24');sE(x+16*s,y-66*s,26*s,20*s,'#24642a');sE(x,y-80*s,30*s,22*s,'#2e7a30');if(GFX_HI){sE(x-6*s,y-88*s,16*s,9*s,'#3e9a3c');sE(x+18*s,y-74*s,10*s,6*s,'#3a8e36');}
    if(o.v&&GFX_HI&&!SJ_BAKE){SJC.lineCap='round';for(const vx of[-22,-8,14,26]){const sw=Math.sin(G.t*.9+vx+x)*2;SJC.strokeStyle='#3f8a2e';SJC.lineWidth=1.6;SJC.beginPath();SJC.moveTo(x+vx*s,y-58*s);SJC.quadraticCurveTo(x+vx*s+sw,y-38*s,x+vx*s+sw*1.5,y-(20+Math.abs(vx)*.4)*s);SJC.stroke();sE(x+vx*s+sw*1.5,y-(20+Math.abs(vx)*.4)*s,2*s,1.4*s,'#5aaa3a');}}return true;}
  if(o.k==='fern'){if(!GFX_HI&&o.lo)return true;SJC.lineCap='round';for(let k=0;k<7;k++){const a=Math.PI+.25+k/6*(Math.PI-.5),L=22*s,sw=Math.sin(G.t*1.1+x*.01+k)*1.5;SJC.strokeStyle=k%2?'#3e9a34':'#2e7a2a';SJC.lineWidth=3*s;SJC.beginPath();SJC.moveTo(x,y);
      SJC.quadraticCurveTo(x+Math.cos(a)*L*.6,y+Math.sin(a)*L*.9-6*s,x+Math.cos(a)*L+sw,y+Math.sin(a)*L*.55);SJC.stroke();}return true;}
  if(o.k==='ruin'){const w=o.w;sE(x+20,y+8,w*.6,w*.14,'rgba(0,0,0,.25)');sP([x-w/2,y,x-w*.42,y-w*.12,x+w*.42,y-w*.12,x+w/2,y],'#8a8676');sP([x-w*.34,y-w*.12,x-w*.28,y-w*.24,x+w*.28,y-w*.24,x+w*.34,y-w*.12],'#9a9686');
    for(const px of[-.3,-.1,.12,.3]){const h=px===.12?w*.22:w*.42;sR(x+px*w-6,y-w*.24-h,12,h,'#a8a492');sR(x+px*w-8,y-w*.24-h-5,16,6,'#b8b4a2');}
    sR(x-w*.3-6,y-w*.66-10,w*.4+12,10,'#a8a492'); // a lintel over two pillars
    sE(x+w*.05,y-w*.3,10,7,'#6a8a4a');SJC.strokeStyle='#3f8a2e';SJC.lineWidth=2;for(const vx of[-.3,-.1,.3]){SJC.beginPath();SJC.moveTo(x+vx*w,y-w*.66);SJC.quadraticCurveTo(x+vx*w+6,y-w*.45,x+vx*w-2,y-w*.26);SJC.stroke();}
    txt('ancient ruins',x,y+16,10,'rgba(255,255,220,.55)','center');return true;}
  return false;}
const SJ_SPR={},SJ_BAKED=new Set(['acacia','termite','tuft','kopje','jtree','fern']),SJ_RES=2;
function drawWildDecor(o){if(!SJ_BAKED.has(o.k)){SJC=ctx;return sjPaint(o);}
  if(!GFX_HI&&o.lo)return true;
  const sb=Math.max(.6,Math.round((o.s||1)*5)/5),key=o.k+sb+(GFX_HI?'h':'l');let c=SJ_SPR[key];
  if(c===undefined){const W=Math.ceil(124*sb*SJ_RES),H=Math.ceil(130*sb*SJ_RES);c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
    if(!g){SJ_SPR[key]=null;}else{g.setTransform(SJ_RES,0,0,SJ_RES,0,0);SJC=g;SJ_BAKE=true;const t=G.t;try{G.t=0;sjPaint({k:o.k,x:62*sb,y:112*sb,s:sb,v:0});}finally{G.t=t;SJC=ctx;SJ_BAKE=false;}SJ_SPR[key]=c;}}
  if(!c){SJC=ctx;return sjPaint(o);}
  ctx.drawImage(c,o.x-62*sb,o.y-112*sb,124*sb,130*sb);
  if(o.k==='jtree'&&o.v&&GFX_HI){const s=sb,x=o.x,y=o.y;ctx.lineCap='round';ctx.strokeStyle='#3f8a2e';ctx.lineWidth=1.6;ctx.beginPath();
    for(const vx of[-22,-8,14,26]){const sw=Math.sin(G.t*.9+vx+x)*2;ctx.moveTo(x+vx*s,y-58*s);ctx.quadraticCurveTo(x+vx*s+sw,y-38*s,x+vx*s+sw*1.5,y-(20+Math.abs(vx)*.4)*s);}ctx.stroke();
    ctx.fillStyle='#5aaa3a';ctx.beginPath();for(const vx of[-22,-8,14,26]){const sw=Math.sin(G.t*.9+vx+x)*2,ex=x+vx*s+sw*1.5,ey=y-(20+Math.abs(vx)*.4)*s;ctx.moveTo(ex+2*s,ey);ctx.ellipse(ex,ey,2*s,1.4*s,0,0,TAU);}ctx.fill();}
  return true;}
{const _dd=drawDecor;drawDecor=function(o){if(SJ_DECOR.has(o.k)&&drawWildDecor(o))return;_dd(o);};}
// ---------- wildflowers ----------
Object.assign(FLORA_PAL,{savanna:{c:['#ffd23a','#ff9a2a','#ffffff','#e8603a'],leaf:'#8a8a3a',n:[4,8],w:[12,22],sz:1.4},jungle:{c:['#ff3a8a','#ff6a2a','#c040ff','#ffffff','#ffe040'],leaf:'#2e6a2a',n:[6,10],w:[12,22],sz:1.7}});
{const _fp=floraPal;floraPal=function(x,y){const k=regionKey(x,y);if(k==='savanna')return inWater(x,y)?null:rnd()<.1?'savanna':null;if(k==='jungle')return inWater(x,y)?null:rnd()<.16?'jungle':null;return _fp(x,y);};}
// ---------- animals ----------
Object.assign(FAUNA,{
  zebra:{hp:22,sp:105,flee:240,zone:'savanna'},gazelle:{hp:9,sp:135,flee:260,zone:'savanna'},wildebeest:{hp:22,sp:96,flee:220,zone:'savanna'},giraffe:{hp:34,sp:82,flee:210,zone:'savanna'},
  elephant:{hp:60,sp:55,bite:5,aggro:75,cd:2.2,say:'Elephant trunk swat! -5',growl:'PAWOOO!',zone:'savanna'},warthog:{hp:10,sp:100,flee:200,zone:'savanna'},ostrich:{hp:9,sp:140,flee:250,zone:'savanna'},
  lion:{hp:22,sp:96,bite:3,aggro:110,cd:1.5,say:'Lion swipe! -3',growl:'ROOOAR!',zone:'savanna'},cheetah:{hp:12,sp:120,bite:2,aggro:70,cd:1.3,say:'Cheetah scratch! -2',growl:'Mrrrow!',zone:'savanna'},
  hyena:{hp:9,sp:100,bite:2,aggro:95,cd:1.4,say:'Hyena nip! -2',growl:'Hee-hee-hee!',zone:'savanna'},
  monkey:{hp:5,sp:115,flee:220,zone:'jungle'},tapir:{hp:18,sp:70,flee:180,zone:'jungle'},capybara:{hp:12,sp:75,flee:170,zone:'jbank'},frog:{hp:2,sp:80,flee:130,zone:'jbank'},
  jaguar:{hp:18,sp:105,bite:3,aggro:100,cd:1.5,say:'Jaguar pounce! -3',growl:'Grrrowl!',zone:'jungle'},tiger:{hp:26,sp:105,bite:4,aggro:110,cd:1.6,say:'Tiger swipe! -4',growl:'ROARRR!',zone:'jungle'},
  python:{hp:14,sp:50,bite:2,aggro:80,cd:1.8,say:'Python squeeze! -2',growl:'Hssssss!',zone:'jungle'}});
ZONES.savanna={ok:(x,y)=>regionKey(x,y)==='savanna'&&!inWater(x,y),s:()=>({x:R(-12850,-8500),y:R(-120,4150)})};
ZONES.jungle={ok:(x,y)=>regionKey(x,y)==='jungle'&&!inWater(x,y),s:()=>({x:R(-16700,-12550),y:R(-120,4150)})};
ZONES.jbank={ok:(x,y)=>regionKey(x,y)==='jungle'&&!inWater(x,y)&&jriverD(x,y)<330,s:()=>{const i=RI(0,JRIVER.length-2),k=rnd(),sd=rnd()<.5?-1:1;return{x:JRIVER[i][0]+(JRIVER[i+1][0]-JRIVER[i][0])*k+sd*R(JRW+20,300),y:JRIVER[i][1]+(JRIVER[i+1][1]-JRIVER[i][1])*k+R(-40,40)};}};
// base populations (prey get the +5% stochastic boost through PREY_SP / HN_BASE like every other prey species)
const SJ_PLAN=[['zebra',10],['gazelle',12],['wildebeest',12],['giraffe',5],['elephant',4],['warthog',8],['ostrich',6],['cheetah',3],
  ['monkey',12],['tapir',6],['capybara',10],['frog',14],['jaguar',3],['tiger',2],['python',4]];
const SJ_PREY=['zebra','gazelle','wildebeest','giraffe','elephant','warthog','ostrich','monkey','tapir','capybara','frog'];
for(const[s,n]of SJ_PLAN){FAUNA_PLAN.push([s,n]);HN_BASE.plan.push([s,n]);}for(const s of SJ_PREY)PREY_SP.add(s);
const PRIDES={lion:{n:2,size:3},hyena:{n:2,size:4}}; // lion prides & hyena clans (pack members share a home and get angry together)
Object.assign(HEAL,{zebra:24,gazelle:10,wildebeest:22,giraffe:34,elephant:60,warthog:12,ostrich:12,lion:24,cheetah:14,hyena:10,monkey:6,tapir:18,capybara:14,frog:3,jaguar:18,tiger:26,python:12});
Object.assign(FOOD,{zebra:24,gazelle:12,wildebeest:24,giraffe:36,elephant:70,warthog:14,ostrich:12,lion:28,cheetah:16,hyena:12,monkey:6,tapir:20,capybara:15,frog:2,jaguar:20,tiger:30,python:12,parrot:3,toucan:4,vulture:8});
SJ_SP.forEach(s=>FAUNA_ART.add(s));
function sjFar(p,far){return !far||d2(p.x,p.y,D.x,D.y)>750;}
function spawnSJ(sp,far,at){const F=FAUNA[sp],Z=ZONES[F.zone];let p=at||null,home=null;
  if(!p&&SJ_HERD.has(sp)&&rnd()<.65){const m=units.filter(u=>!u.dead&&u.species===sp&&u.wild);if(m.length){const o=m[RI(0,m.length-1)];
    for(let t=0;t<10&&!p;t++){const q={x:o.x+R(-120,120),y:o.y+R(-90,90)};if(Z.ok(q.x,q.y)&&sjFar(q,far)){p=q;home=o.home;}}}}
  for(let t=0;!p&&t<80;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&sjFar(q,far))p=q;}if(!p)return null;
  const bank=F.zone==='jbank',hw=bank?520:sp==='monkey'?700:1000,hh=bank?400:sp==='monkey'?500:760;home=home||{x:p.x-hw/2,y:p.y-hh/2,w:hw,h:hh};
  const u=mkUnit('animal',p.x,p.y,{species:sp,wild:true,zone:F.zone,home,hp:F.hp,maxHp:F.hp,free:true,pack:0,t:R(0,3),jt:0,face:rnd()<.5?1:-1});units.push(u);return u;}
{const _sw=spawnWild;spawnWild=function(sp,far,at){if(SJ_SP.has(sp))return spawnSJ(sp,far,at);return _sw(sp,far,at);};}
function spawnPride(sp,far){const F=FAUNA[sp],Z=ZONES[F.zone],P=PRIDES[sp];let p=null;for(let t=0;!p&&t<80;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&sjFar(q,far))p=q;}if(!p)return;
  const pk=++packId,home={x:p.x-380,y:p.y-280,w:760,h:560};
  for(let i=0;i<P.size;i++){const q=sjNear(Z,p,40,30);units.push(mkUnit('animal',q.x,q.y,{species:sp,wild:true,zone:F.zone,home,hp:F.hp,maxHp:F.hp,free:true,pack:pk,male:(sp==='lion'||sp==='gorilla')&&i===0?1:0,t:R(0,3),jt:0,face:rnd()<.5?1:-1}));}}
function sjNear(Z,p,ax,ay){for(let t=0;t<12;t++){const x=p.x+R(-ax,ax),y=p.y+R(-ay,ay);if(Z.ok(x,y))return{x,y};}return{x:p.x,y:p.y};}
function prideGroups(sp){const g={};for(const u of units)if(!u.dead&&u.species===sp&&u.pack)(g[u.pack]||(g[u.pack]=[])).push(u);return g;}
function updPrides(dt){G.prideT=(G.prideT||0)-dt;if(G.prideT>0)return;G.prideT=8;G.prideGrow=(G.prideGrow||0)+8;
  for(const sp in PRIDES){const P=PRIDES[sp],g=prideGroups(sp),ks=Object.keys(g);if(ks.length<P.n){spawnPride(sp,true);continue;}
    if(G.prideGrow>=40)for(const k of ks){const m=g[k];if(m.length<P.size){const o=m[0];if(d2(o.x,o.y,D.x,D.y)>700){const q=sjNear(ZONES[o.zone],o,30,20);units.push(mkUnit('animal',q.x,q.y,{species:sp,wild:true,zone:o.zone,home:o.home,hp:FAUNA[sp].hp,maxHp:FAUNA[sp].hp,free:true,pack:o.pack,t:R(0,3),jt:0}));G.prideGrow=0;break;}}}}}
// jungle birds: parrots & toucans perched around six jungle glades (sit / take off when startled / settle again, like the pond birds)
Object.assign(BIRD,{parrot:{heal:3,pts:20,sp:130,col:'#e8342a'},toucan:{heal:4,pts:25,sp:115,col:'#1a1a1e'}});
let JB_HOMES=[];function jbHomes(){if(JB_HOMES.length)return JB_HOMES;[[-15250,600],[-13550,1300],[-15800,2150],[-13300,2500],[-15000,3650],[-16150,1250]].forEach(([x,y],i)=>JB_HOMES.push({x,y,rx:90,ry:60,jb:i<4?'parrot':'toucan',i}));return JB_HOMES;}
function jbCap(h){return preyN('jb'+h.i,3);}
function spawnJB(h){const a=R(0,TAU);birds.push(mkBird(h.jb,h.x+Math.cos(a)*h.rx*.6,h.y+Math.sin(a)*h.ry*.6,{home:h,hx:0,hy:0}));}
{const _ib=initBirds;initBirds=function(){const r=_ib.apply(this,arguments);for(const h of jbHomes())for(let i=0;i<jbCap(h);i++)spawnJB(h);return r;};}
// savanna vultures: soar in groups, and glide over to circle any fresh savanna catch (scavengers, no gore)
function spawnSavVulture(c){c=c||{x:R(-12500,-8800),y:R(100,3900)};if(regionKey(c.x,c.y)!=='savanna')return;for(let i=0;i<3;i++)birds.push(mkBird('vulture',c.x,c.y,{sav:1,state:'soar',z:R(120,170),cx:c.x,cy:c.y,ang:R(0,TAU),rad:R(110,190),dir:rnd()<.5?1:-1}));}
{const _hc=hnCatch;hnCatch=function(p,T){const x=T.x,y=T.y;_hc(p,T);if(regionKey(x,y)==='savanna'){const v=birds.filter(b=>b.sav&&!b.dead&&d2(b.cx,b.cy,x,y)<1800);if(v.length){for(const b of v){b.cx=x+R(-40,40);b.cy=y+R(-30,30);}G.hunts.vultures=(G.hunts.vultures||0)+1;if(dist(p,D)<900)float(x,y-70,'Vultures circle overhead…','#e8dcc0');}}};}
function updSJ(dt){updPrides(dt);G.sjT=(G.sjT||0)-dt;if(G.sjT>0)return;G.sjT=12;
  for(const h of jbHomes())if(birds.filter(b=>b.home===h&&!b.dead).length<jbCap(h))spawnJB(h);
  if(birds.filter(b=>b.sav&&!b.dead).length<6)spawnSavVulture();}
{const _uf=updFauna;updFauna=function(dt){_uf(dt);updSJ(dt);};}
{const _if=initFauna;initFauna=function(){const r=_if.apply(this,arguments);for(const sp in PRIDES)for(let i=0;i<PRIDES[sp].n;i++)spawnPride(sp,false);return r;};}
{const _ib2=initBirds;initBirds=function(){const r=_ib2.apply(this,arguments);spawnSavVulture({x:-10400,y:1700});spawnSavVulture({x:-11800,y:3000});return r;};}
// ---------- hunting: who eats whom out here ----------
Object.assign(HN_DIET,{lion:{prey:['zebra','wildebeest','gazelle','warthog'],r:520,sp:1.25},cheetah:{prey:['gazelle','warthog','ostrich'],r:560,sp:1.45},
  hyena:{prey:['wildebeest','zebra','warthog','gazelle'],r:480,sp:1.22},jaguar:{prey:['tapir','capybara','monkey','frog','parrot'],r:420,sp:1.25},
  tiger:{prey:['tapir','capybara','monkey'],r:460,sp:1.2},python:{prey:['capybara','monkey','frog','parrot','toucan'],r:200,sp:1.35,ambush:1}});
HN_DIET.croc.prey.push('capybara','tapir','frog','zebra','wildebeest','gazelle','warthog');
HN_DRINKERS.push('zebra','wildebeest','gazelle','elephant','giraffe','warthog','tapir','capybara');
Object.assign(HN_NICE,{zebra:'a zebra',gazelle:'a gazelle',wildebeest:'a wildebeest',giraffe:'a giraffe',warthog:'a warthog',ostrich:'an ostrich',monkey:'a monkey',tapir:'a tapir',capybara:'a capybara',frog:'a frog',parrot:'a parrot',toucan:'a toucan'});
Object.assign(HN_WHO,{lion:'A lion',cheetah:'A cheetah',hyena:'A hyena',jaguar:'A jaguar',tiger:'A tiger',python:'A python'});
// ---------- Tally ----------
{const i=TALLY_SECT.findIndex(s=>s.id==='boats');TALLY_SECT.splice(i,0,
  {id:'savanna',name:'Animals · The savanna',icon:'🦓',col:'#e8c860',keys:[['zebra','Zebras'],['gazelle','Gazelles'],['wildebeest','Wildebeest'],['giraffe','Giraffes'],['elephant','Elephants'],['warthog','Warthogs'],['ostrich','Ostriches'],['lion','Lions'],['cheetah','Cheetahs'],['hyena','Hyenas']]},
  {id:'jungle',name:'Animals · The jungle',icon:'🐒',col:'#6fd88a',keys:[['monkey','Monkeys'],['tapir','Tapirs'],['capybara','Capybaras'],['frog','Frogs'],['parrot','Parrots'],['toucan','Toucans'],['jaguar','Jaguars'],['tiger','Tigers'],['python','Pythons']]});
  for(const s of TALLY_SECT)for(const [k,n] of s.keys)TALLY_LABEL[k]=n;}
// ---------- hunger: savanna a touch hungrier than home, jungle normal (the desert stays hot) ----------
{const _dh=desertHunger;desertHunger=function(){if(!G.easy&&regionKey(D.x,D.y)==='savanna')return 1.1;return _dh();};}
// ---------- saves: the fog grid got wider (old saves were 100 columns starting at x=-10200) ----------
{const _ss=svSnapshot;svSnapshot=function(){const r=_ss.apply(this,arguments);if(r)r.FW=FW;return r;};
 const _sa=svApply;svApply=function(d){if(d&&d.FOG&&d.FW!==FW){const oW=d.FW||100,off=d.FW?0:Math.round((-10200-WX0)/FG),bits=[];for(let i=0;i<d.FOG.length;i++){const n=parseInt(d.FOG[i],16);for(let b=0;b<4;b++)bits.push((n>>b)&1);}
   const nb=new Uint8Array(FW*FH);for(let k=0;k<bits.length;k++)if(bits[k]){const i=k%oW,j=k/oW|0,ni=i+off;if(ni>=0&&ni<FW&&j<FH)nb[j*FW+ni]=1;}
   let s='';for(let i=0;i<nb.length;i+=4)s+=((nb[i]?1:0)|(nb[i+1]?2:0)|(nb[i+2]?4:0)|(nb[i+3]?8:0)).toString(16);d=Object.assign({},d,{FOG:s,FW});}return _sa.call(this,d);};}
// ---------- art (cartoon, chunky, no gore) ----------
function sjQuad(u,o){const x=u.x,y=u.y,a=u.anim||0,bob=Math.abs(Math.sin(a))*1.2,by=y-o.leg-o.bh*.5-bob;
  ell(x,y+1,o.bw*1.05,Math.max(2.5,o.bw*.24),'rgba(0,0,0,.2)');for(const k of[-.62,-.3,.32,.64]){const lx=x+k*o.bw;line(lx,by+o.bh*.3,lx+Math.sin(a+k*5)*o.leg*.25,y,o.dk,o.lw||2);}
  ell(x,by,o.bw,o.bh,o.c);return by;}
function sjEye(x,y,r){ell(x,y,r||1.3,r||1.3,'#111');}
function drawSJ(u){const s=u.species,x=u.x,y=u.y,f=u.face||1,a=u.anim||0;ctx.lineCap='round';
  if(s==='zebra'){const by=sjQuad(u,{bw:12,bh:6,leg:10,c:'#f2f2ee',dk:'#2a2a2a',lw:2});for(let k=-2;k<=2;k++)line(x+k*4,by-5,x+k*4-1.5,by+5,'#222',1.8);
    line(x+f*9,by-2,x+f*14,by-12,'#f2f2ee',5);line(x+f*10,by-4,x+f*13,by-9,'#222',1.4);line(x+f*7,by-5,x+f*12,by-15,'#222',2);ell(x+f*17,by-13,5,3,'#f2f2ee');ell(x+f*21,by-12,2.3,2,'#333');sjEye(x+f*16,by-14);line(x-f*12,by-1,x-f*15,by+6,'#222',1.5);return;}
  if(s==='gazelle'){const by=sjQuad(u,{bw:9,bh:4.5,leg:10,c:'#c8925a',dk:'#7a5a3a',lw:1.4});ell(x,by+2,7,2,'#f4ead8');line(x-7,by,x+7,by,'#5a3a20',1.2);
    line(x+f*7,by-1,x+f*10,by-8,'#c8925a',3);ell(x+f*12,by-9,3.6,2.4,'#c8925a');line(x+f*11,by-11,x+f*9,by-18,'#3a2a1a',1.3);line(x+f*12.5,by-11,x+f*11,by-18,'#3a2a1a',1.3);sjEye(x+f*12.5,by-9.5,.9);ell(x-f*9,by-1,1.8,2,'#fff');return;}
  if(s==='wildebeest'){const by=sjQuad(u,{bw:12,bh:6,leg:9,c:'#6e655c',dk:'#3a342e',lw:2.2});ell(x+f*6,by-3,7,6.5,'#6e655c');line(x+f*2,by-8,x+f*10,by-8,'#2a2420',2.5);
    ell(x+f*15,by-3,4,5.5,'#4a423a');line(x+f*15,by+2,x+f*15,by+6,'#2a2420',2);ctx.strokeStyle='#e0d8c8';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x+f*13,by-7);ctx.quadraticCurveTo(x+f*9,by-9,x+f*11,by-13);ctx.moveTo(x+f*17,by-7);ctx.quadraticCurveTo(x+f*21,by-9,x+f*19,by-13);ctx.stroke();sjEye(x+f*16,by-5,.9);return;}
  if(s==='giraffe'){const by=sjQuad(u,{bw:12,bh:7,leg:18,c:'#e8b04a',dk:'#b0783a',lw:2.2});for(const[sx,sy]of[[-6,-2],[0,1],[5,-3],[-2,-4],[8,1]])ell(x+sx,by+sy,2.4,1.8,'#9a5a2a');
    const sw=Math.sin(G.t*.8+u.id*9)*2;line(x+f*9,by-3,x+f*20+sw,by-34,'#e8b04a',5);for(let k=1;k<4;k++)ell(x+f*(9+k*2.7)+sw*k/4,by-3-k*7.5,1.6,1.4,'#9a5a2a');
    ell(x+f*23+sw,by-36,5.5,3,'#e8b04a');line(x+f*20+sw,by-38,x+f*20+sw,by-42,'#7a4a1a',1.4);line(x+f*22+sw,by-38,x+f*22+sw,by-42,'#7a4a1a',1.4);sjEye(x+f*23+sw,by-37,1);line(x-f*12,by-2,x-f*14,by+8,'#7a4a1a',1.2);return;}
  if(s==='elephant'){const by=sjQuad(u,{bw:22,bh:13,leg:12,c:'#8c8f98',dk:'#767982',lw:7});ell(x+f*20,by-4,10,10,'#8c8f98');ell(x+f*14,by-3,7,11,'#7a7d86');
    ctx.strokeStyle='#8c8f98';ctx.lineWidth=4.5;ctx.beginPath();ctx.moveTo(x+f*27,by);ctx.quadraticCurveTo(x+f*31,by+10,x+f*28+Math.sin(G.t*1.4+u.id*7)*3*f,by+16);ctx.stroke();
    line(x+f*25,by+4,x+f*30,by+7,'#f6f2e6',2.4);sjEye(x+f*23,by-6,1.4);line(x-f*22,by-2,x-f*24,by+8,'#6a6d76',1.6);return;}
  if(s==='warthog'){const by=sjQuad(u,{bw:9,bh:5,leg:6,c:'#7a6a5e',dk:'#4a3e34',lw:2});ell(x+f*10,by+1,5,4,'#7a6a5e');ell(x+f*14,by+2,2.5,2,'#a08a7a');line(x+f*13,by,x+f*15,by-4,'#fff',1.4);
    line(x-f*2,by-5,x+f*8,by-5,'#3a2e24',2);line(x-f*9,by-1,x-f*11,by-10,'#4a3e34',1);ell(x-f*11,by-11,1.4,2,'#3a2e24');sjEye(x+f*10,by-1,.9);return;}
  if(s==='ostrich'){const sw=Math.sin(a)*4;ell(x,y+1,9,2.5,'rgba(0,0,0,.2)');line(x-2,y-18,x-2+sw,y,'#e8a898',2);line(x+2,y-18,x+2-sw,y,'#e8a898',2);ell(x,y-22,10,7,'#222');ell(x-f*9,y-24,4,4,'#fff');ell(x+f*2,y-23,5,3,'#ddd');
    line(x+f*6,y-25,x+f*9,y-42,'#e8b0a0',2.5);ell(x+f*10,y-43,2.8,2.2,'#e8b0a0');line(x+f*12,y-43,x+f*15,y-42.5,'#d89040',1.4);sjEye(x+f*10.5,y-43.5,.8);return;}
  if(s==='lion'||s==='cheetah'||s==='jaguar'||s==='tiger'){const big=s==='tiger'?1.15:1,c=s==='lion'?'#d9a44c':s==='cheetah'?'#ecc274':s==='jaguar'?'#e0a646':'#f0902a',dk=s==='tiger'?'#a85a14':'#9a6a26';
    const by=sjQuad(u,{bw:12*big,bh:(s==='cheetah'?4.5:6)*big,leg:(s==='cheetah'?10:9)*big,c,dk,lw:s==='cheetah'?1.6:2.4});
    if(s==='cheetah')for(const[sx,sy]of[[-7,-1],[-3,2],[1,-2],[5,1],[8,-2],[-5,-3],[3,3]])ell(x+sx,by+sy,1.1,1.1,'#2a2015');
    if(s==='jaguar'){ctx.strokeStyle='#3a2a14';ctx.lineWidth=1;for(const[sx,sy]of[[-7,-1],[-2,2],[3,-2],[7,1]]){ctx.beginPath();ctx.arc(x+sx,by+sy,1.8,0,TAU);ctx.stroke();}}
    if(s==='tiger'){ell(x,by+3,10,2.5,'#fff4e6');for(let k=-3;k<=3;k++)line(x+k*4,by-6,x+k*4+1.5,by+1,'#1a1a1a',1.8);}
    const hx=x+f*14*big,hy=by-5;if(s==='lion'&&u.male)ell(hx-f,hy,9.5,9.5,'#8a4a1a');ell(hx,hy,5.5*big,5*big,c);ell(hx-f*2,hy-4.5*big,1.8,1.8,dk);ell(hx+f*2.5,hy-4.5*big,1.8,1.8,dk);
    if(s==='tiger'){ell(hx+f*2,hy+2,3,2,'#fff4e6');line(hx-2,hy-3,hx-1,hy,'#1a1a1a',1.2);}if(s==='cheetah')line(hx+f*2,hy-1,hx+f*3,hy+3,'#1a1a1a',1);
    ell(hx+f*4.5*big,hy+.5,1.4,1.2,'#3a2418');sjEye(hx+f*2*big,hy-1.5,1);ctx.strokeStyle=c;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-f*12*big,by-1);ctx.quadraticCurveTo(x-f*19*big,by-1+Math.sin(G.t*2+u.id*5)*3,x-f*20*big,by-9);ctx.stroke();
    if(s==='lion')ell(x-f*20,by-9,2,2,'#6a3a14');return;}
  if(s==='hyena'){const by=sjQuad(u,{bw:10,bh:5.5,leg:8,c:'#b49c70',dk:'#6a5432',lw:2});ell(x+f*5,by-2,6.5,6,'#b49c70');for(const[sx,sy]of[[-5,0],[-1,2],[3,-1],[6,2]])ell(x+sx,by+sy,1.2,1.2,'#5a4428');
    line(x+f*1,by-7,x+f*8,by-7,'#4a3a22',2);ell(x+f*13,by-5,5,4,'#b49c70');ell(x+f*17,by-4,2.4,2,'#3a2a18');ell(x+f*11,by-9,2,2,'#7a6240');sjEye(x+f*14,by-6,.9);line(x-f*10,by,x-f*12,by+5,'#4a3a22',1.4);return;}
  if(s==='monkey'){const bob=Math.abs(Math.sin(a*1.4))*3;ell(x,y+1,6,2,'rgba(0,0,0,.2)');ctx.strokeStyle='#7a4e26';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-f*4,y-6-bob);ctx.quadraticCurveTo(x-f*14,y-8-bob,x-f*11,y-18-bob);ctx.quadraticCurveTo(x-f*8,y-22-bob,x-f*9,y-17-bob);ctx.stroke();
    line(x-2,y-6-bob,x-3,y,'#7a4e26',2);line(x+2,y-6-bob,x+3,y,'#7a4e26',2);ell(x,y-9-bob,5,6,'#8a5a2e');line(x+f*3,y-12-bob,x+f*7,y-6-bob+Math.sin(a*2)*2,'#7a4e26',1.8);
    ell(x+f*2,y-17-bob,4.5,4.2,'#8a5a2e');ell(x-f*1.5,y-18-bob,1.6,1.6,'#e8c08a');ell(x+f*3.2,y-16.5-bob,3,2.8,'#e8c08a');sjEye(x+f*2.6,y-17.5-bob,.7);sjEye(x+f*4.4,y-17.5-bob,.7);return;}
  if(s==='tapir'){const by=sjQuad(u,{bw:12,bh:7,leg:7,c:'#2e2c32',dk:'#1e1c22',lw:2.6});ell(x-f*3,by,7,6.2,'#ecece4');ell(x+f*13,by+1,5,5,'#2e2c32');line(x+f*17,by+1,x+f*21,by+4,'#2e2c32',3);ell(x+f*11,by-4,1.6,2,'#ecece4');sjEye(x+f*14,by-.5,.9);return;}
  if(s==='capybara'){const by=sjQuad(u,{bw:10,bh:6,leg:4,c:'#9a6a3c',dk:'#6a4422',lw:2.4});ell(x+f*10,by-1,5.5,4.5,'#9a6a3c');ell(x+f*14,by,2.6,3,'#8a5a30');ell(x+f*8,by-5,1.4,1.4,'#6a4422');ell(x+f*15,by-.5,.9,.9,'#222');sjEye(x+f*11,by-2,.9);return;}
  if(s==='frog'){const mv=u.tgt||u.hBy?Math.abs(Math.sin(G.t*6+u.id*20))*5:0;ell(x,y+1,4,1.6,'rgba(0,0,0,.2)');ell(x,y-3-mv,4.6,3,'#4ab040');ell(x-f*3,y-1-mv,2.6,1.6,'#3a9030');ell(x+f*1,y-6-mv,1.8,1.8,'#4ab040');ell(x+f*3.5,y-6-mv,1.8,1.8,'#4ab040');
    sjEye(x+f*1,y-6.5-mv,.8);sjEye(x+f*3.5,y-6.5-mv,.8);return;}
  if(s==='python'){ctx.strokeStyle='#6a7a2a';ctx.lineWidth=6;ctx.beginPath();const pts=[];for(let i=0;i<=14;i++){const px=x-f*i*3.6,py=y-3+Math.sin(G.t*3+i*.7+u.id*9)*3.5;pts.push([px,py]);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();
    for(let i=2;i<14;i+=2)ell(pts[i][0],pts[i][1],1.8,1.4,'#3a4a14');ell(x+f*2,y-3,4.5,3.4,'#7a8a34');sjEye(x+f*3,y-4.5,.9);if(Math.sin(G.t*5+u.id*3)>.6)line(x+f*6,y-3,x+f*10,y-2,'#e03a3a',1);return;}}
{const _df=drawFauna;drawFauna=function(u){if(SJ_SP.has(u.species)){drawSJ(u);return;}_df(u);};}
{const _db=drawBird;drawBird=function(b,fly){if(b.kind!=='parrot'&&b.kind!=='toucan')return _db(b,fly);const x=b.x,y=fly?b.y-b.z:b.y,w=Math.sin(b.flap),P=b.kind==='parrot',c=P?'#e8342a':'#1a1a1e';
  if(fly){ell(b.x+b.z*.25,b.y+b.z*.1,5,2,'rgba(0,0,0,.18)');const s=8,fl=w*s*.7;ctx.strokeStyle=P?'#2a6ae8':'#1a1a1e';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-s,y-fl);ctx.quadraticCurveTo(x-s*.4,y-fl*.2-2,x,y);ctx.quadraticCurveTo(x+s*.4,y-fl*.2-2,x+s,y-fl);ctx.stroke();
    ell(x,y,3.4,2.4,c);ell(x+3,y-1,P?1.2:2.4,1,P?'#ffd23a':'#ff9a2a');return;}
  const f=b.face||1;ell(x,y+1,5,1.8,'rgba(0,0,0,.2)');ell(x,y-5,3.6,5,c);ell(x-f*1.5,y-4,2.4,3.6,P?'#2a6ae8':'#fff');line(x-f*1,y-1,x-f*3,y+5,P?'#2a6ae8':'#1a1a1e',2);ell(x+f*1,y-10,3,2.8,c);if(!P)ell(x+f*1.5,y-9.5,1.6,1.6,'#fff');
  if(P)poly([x+f*3,y-11,x+f*5.5,y-9.5,x+f*3,y-8.5],'#ffd23a');else poly([x+f*3,y-11.5,x+f*10,y-10,x+f*3,y-8],'#ff9a2a');sjEye(x+f*1.8,y-10.5,.6);};}
