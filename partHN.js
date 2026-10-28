// ======================= partHN: prey populations (+5%), every predator hunts, freshwater crocodiles =======================
// Family-friendly: predators stalk, chase and "gulp" prey, which vanishes in a puff with stars or feathers. No gore.
// ---------- (1) prey populations +5%: spawn counts and respawn caps (birds, chickens, pens and herds are patched in part1/part7/partGH via preyN) ----------
const PREY_SP=new Set(['deer','rabbit','boar','horse','fish','beaver','mgoat','goat','crab','seal','camel','lizard']);
const HN_BASE={plan:FAUNA_PLAN.map(([s,n])=>[s,n]),sea:{school:SEA_PLAN.school,lakeschool:SEA_PLAN.lakeschool}};
function hnApplyCaps(){HN_CAP={};
  FAUNA_PLAN.forEach((e,i)=>{const[s,n]=HN_BASE.plan[i];e[1]=PREY_SP.has(s)?preyN('plan:'+s,n):n;});
  for(const k in HN_BASE.sea)SEA_PLAN[k]=preyN('sea:'+k,HN_BASE.sea[k]);}
const _newGameHN=newGame;newGame=function(o){hnApplyCaps();HN.fx=[];HN.list=null;HN.crocT=0;HN.penT=0;HN.drinkT=4;const r=_newGameHN(o);if(!G.hunts)G.hunts={total:0};crocInit();return r;};
// ---------- (2) hunting ----------
const HN_DRINKERS=['deer','goat','boar','rabbit'];
const HN={budget:6,budgetLo:3,rr:0,listT:0,list:null,fx:[],crocT:0,penT:0,drinkT:4};
// prey lists per predator; r = how far it notices prey, sp = chase speed x its own speed
const HN_DIET={
  wolf:{prey:['deer','rabbit','goat','mgoat'],r:520,sp:1.18},fox:{prey:['rabbit','chicken'],r:380,sp:1.12},dfox:{prey:['lizard'],r:360,sp:1.1},
  bear:{prey:['deer','rabbit','fish','beaver'],r:340,sp:1.1},cougar:{prey:['deer','rabbit'],r:420,sp:1.15},
  snake:{prey:['lizard','rabbit'],r:200,sp:1.35,ambush:1},dscorp:{prey:['lizard'],r:170,sp:1.3,ambush:1},
  sandworm:{prey:['camel','lizard','dfox','snake','dscorp'],r:520},croc:{prey:['deer','goat','rabbit','boar','beaver','fish','sheep','duck','goose'],r:260},
  hawk:{prey:['rabbit','chicken','lizard','sparrow'],r:620},eagle:{prey:['rabbit','fish','sparrow','duck','lizard'],r:700},gull:{prey:['school','fish'],r:460},
  shark:{prey:['school','seal','iseal'],r:520},squid:{prey:['school','shark','boat'],r:420}};
const HN_NICE={deer:'a deer',rabbit:'a rabbit',goat:'a goat',mgoat:'a mountain goat',chicken:'a chicken',lizard:'a lizard',fish:'a fish',beaver:'a beaver',camel:'a camel',dfox:'a desert fox',snake:'a snake',dscorp:'a scorpion',school:'some fish',seal:'a seal',iseal:'a seal',shark:'a shark',sparrow:'a sparrow',duck:'a duck',goose:'a goose',sheep:'a sheep',boar:'a boar'};
const HN_WHO={wolf:'A wolf',fox:'A fox',dfox:'A desert fox',bear:'A bear',cougar:'A mountain lion',snake:'A snake',dscorp:'A scorpion',sandworm:'The sand worm',croc:'A crocodile',hawk:'A hawk',eagle:'An eagle',gull:'A gull',shark:'A shark',squid:'The kraken'};
function hnKey(T){if(!T)return null;if(T.kind&&BIRD[T.kind]&&T.flap!==undefined)return T.kind;if(T.type==='sea')return T.kind;if(T.type==='animal')return T.species;if(T.crew!==undefined)return 'boat';return null;}
function hnAlive(T){if(!T||T.dead||T.gone)return false;if(T.type==='sea'&&T.kind==='school')return T.n>0;if(T.crew!==undefined)return T.state==='sail'||!T.state;return true;}
function hnBudget(){return GFX_HI?HN.budget:HN.budgetLo;}
function hnLists(){const L={},add=(k,o)=>{(L[k]||(L[k]=[])).push(o);},P=[];
  for(const u of units){if(u.dead||u.gone)continue;
    if(u.type==='animal'){if(u.carav&&u.species==='camel')continue;add(u.species,u);if(HN_DIET[u.species]&&(u.wild||u.species==='sandworm'))P.push(u);}
    else if(u.type==='sea'){if(u.kind==='school'&&u.n>0)add('school',u);else if(u.kind==='iseal'&&u.state!=='rock')add('iseal',u);else if(u.kind==='shark'){add('shark',u);P.push(u);}else if(u.kind==='squid')P.push(u);}}
  for(const b of birds){if(b.dead)continue;add(b.kind,b);if(b.kind==='hawk'||b.kind==='eagle'||b.kind==='gull')P.push(b);}
  for(const s of ships)if(!s.war&&s.state==='sail'&&(s.kind==='fishing'||s.kind==='rowboat'||s.kind==='merchant'))add('boat',s);
  HN.list=L;HN.preds=P;}
function hnTaken(T,p){return T.hBy&&T.hBy!==p&&T.hBy.hPrey===T&&hnAlive(T.hBy);}
function hnPredKey(p){return p.type==='animal'?p.species:p.type==='sea'?p.kind:p.kind;}
function hnFindPrey(p){const k=hnPredKey(p),Dt=HN_DIET[k];if(!Dt)return null;let best=null,bd=Dt.r;
  const Z=p.type==='animal'&&p.zone&&ZONES[p.zone],home=p.perch||p.home;
  for(const pk of Dt.prey){const arr=HN.list[pk];if(!arr)continue;
    for(const T of arr){if(T===p||!hnAlive(T)||hnTaken(T,p))continue;const d=d2(T.x,T.y,p.x,p.y);if(d>=bd)continue;
      if(k==='croc'){if(!crocCanReach(p,T))continue;}
      else if(k==='sandworm'){if(!ZONES.desert.ok(T.x,T.y))continue;}
      else if(k==='shark'){if(!inSea(T.x,T.y)||T.lake)continue;}
      else if(k==='squid'){if(!inDeep(T.x,T.y)&&!(pk==='boat'&&d<340))continue;}
      else if(k==='gull'){if(pk==='fish'&&!inWater(T.x,T.y))continue;if(T.lake)continue;}
      else if(k==='hawk'||k==='eagle'){if(pk==='sparrow'&&T.z>200)continue;if(pk==='duck'&&T.state!=='ground')continue;if(home&&d2(T.x,T.y,home.x,home.y)>Dt.r*1.2)continue;}
      else if(Z&&!Z.ok(T.x,T.y))continue;
      if(T.type==='animal'&&!T.wild&&!T.pen)continue;
      best=T;bd=d;}}
  return best;}
function hnStart(p,T){p.hPrey=T;p.hT=0;T.hBy=p;}
function hnDrop(p){if(p.hPrey&&p.hPrey.hBy===p)p.hPrey.hBy=null;p.hPrey=null;p.hT=0;p.crouch=0;}
function hnFx(x,y,kind){HN.fx.push({x,y,t:0,kind,n:GFX_HI?6:3,a:R(0,TAU)});if(HN.fx.length>40)HN.fx.shift();}
// the catch: cartoon gulp, prey poofs away; predator gets fuller and rests a moment
function hnCatch(p,T){const pk=hnKey(T),k=hnPredKey(p),bird=pk==='sparrow'||pk==='duck'||pk==='goose'||pk==='chicken'||pk==='parrot'||pk==='toucan'||pk==='ostrich';
  if(pk==='school'){T.n--;if(T.n<=0){T.dead=true;T.gone=true;}}
  else if(pk==='boat'){krakenBoat(p,T);}
  else if(T.flap!==undefined){T.dead=true;}else{T.dead=true;T.gone=true;}
  if(T.hBy===p)T.hBy=null;p.hPrey=null;p.hT=0;p.crouch=0;
  const wet=inWater(T.x,T.y);puff(T.x,T.y-6,GFX_HI?8:4,wet?'rgba(200,230,255,':'rgba(245,245,245,',55,4);hnFx(T.x,T.y,bird?'feathers':wet?'bubbles':'stars');
  p.belly=Math.min(1,(p.belly||0)+.35);p.full=R(55,95)*(k==='squid'||k==='sandworm'?1.6:1);p.hRest=R(3,6);
  G.hunts=G.hunts||{total:0};G.hunts.total=(G.hunts.total||0)+1;G.hunts[k]=(G.hunts[k]||0)+1;G.hunts['prey_'+pk]=(G.hunts['prey_'+pk]||0)+1;
  if(dist(p,D)<900&&pk!=='boat'){const w=HN_WHO[k]||'A predator';float(p.x,p.y-34,`${w} gulps down ${HN_NICE[pk]||'a snack'}! *burp*`,'#ffe6a8');}}
// wrap the wild-animal AI: predators stalk/chase/catch; chased prey bolt away from the predator
const _updWildHN=updWild;updWild=function(u,dt){
  if(u.species==='croc'){updCroc(u,dt);return;}
  if(HN_DIET[u.species]&&hnLand(u,dt))return;
  if(u.hBy&&G.t-(u.hChased||-9)<.5&&hnAlive(u.hBy)&&hnPrey(u,dt))return;
  if(u.drink&&hnDrink(u,dt))return;
  _updWildHN(u,dt);};
function hnDragonBusy(u){const F=FAUNA[u.species]||{},dd=dist(u,D);return !G.over&&!G.won&&D.alt<.5&&dd<Math.max(F.aggro?F.aggro*1.6:0,F.flee||0,200)||u.burn>0||u.bolted>0||u.state==='pounce'||u.state==='feed'||u.state==='back';}
function hnLand(u,dt){const F=FAUNA[u.species],Dt=HN_DIET[u.species];
  if(u.full>0)u.full-=dt;
  if(hnDragonBusy(u)){if(u.hPrey)hnDrop(u);u.hRest=0;return false;}
  if(u.hRest>0){u.hRest-=dt;u.anim+=dt*.5;u.belly=Math.max(0,(u.belly||0)-dt*.01);return true;}
  const T=u.hPrey;if(!T)return false;
  if(!hnAlive(T)||u.hT>8){if(u.hT>8&&dist(u,D)<900&&rnd()<.6)float(T.x,T.y-24,'Phew! Got away!','#e0ffe0');hnDrop(u);u.full=R(8,15);return false;}
  u.hT+=dt;const d=dist(u,T),Z=ZONES[u.zone],ox=u.x,oy=u.y,stalk=d>(Dt.ambush?70:160)&&u.hT<3.5;
  moveTo(u,T.x,T.y,F.sp*(stalk?.42:Dt.ambush&&d<70?2.2:Dt.sp),dt);u.crouch=stalk?1:0;
  if(Z&&!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;u.hBlock=(u.hBlock||0)+dt;if(u.hBlock>1){u.hBlock=0;hnDrop(u);u.full=R(5,10);return false;}}
  if(!stalk){T.hChased=G.t;T.hBy=u;}
  if(d<(T.species==='fish'?40:20))hnCatch(u,T);
  return true;}
function hnPrey(u,dt){const F=FAUNA[u.species];if(!F||u.species==='fish')return false;if(!G.over&&D.alt<.5&&dist(u,D)<(F.flee||200))return false;
  const P=u.hBy,a=Math.atan2(u.y-P.y,u.x-P.x)+Math.sin(G.t*4+u.id)*.5,ox=u.x,oy=u.y,Z=ZONES[u.zone];u.drink=null;
  moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*.85,dt);
  if(Z&&!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;moveTo(u,u.x+Math.cos(a+1.6)*40,u.y+Math.sin(a+1.6)*40,F.sp*.6,dt);if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}}
  if(u.leap!==undefined&&(u.species==='goat'||u.species==='mgoat')&&!u.leap)u.leap=.5;return true;}
// pen animals & chickens scurry around their pen when a fox is after them
const _updAnimalHN=updAnimal;updAnimal=function(u,dt){
  if(u.hBy&&G.t-(u.hChased||-9)<.5&&hnAlive(u.hBy)&&u.pen){const P=u.hBy,a=Math.atan2(u.y-P.y,u.x-P.x),Pn=u.pen;moveTo(u,u.x+Math.cos(a)*30,u.y+Math.sin(a)*30,40,dt);
    u.x=clamp(u.x,Pn.x+6,Pn.x+Pn.w-6);u.y=clamp(u.y,Pn.y+6,Pn.y+Pn.h-6);if(rnd()<dt*.6&&dist(u,D)<900)float(u.x,u.y-20,u.species==='chicken'?'Bawk bawk!':'Baa!','#eee');return;}
  _updAnimalHN(u,dt);};
// thirsty prey wander to a riverbank or lakeshore for a drink (crocodiles wait there)
function hnDrink(u,dt){const W=u.drink;if(!G.over&&D.alt<.5&&dist(u,D)<(FAUNA[u.species].flee||200)){u.drink=null;return false;}
  W.t-=dt;if(W.t<-30){u.drink=null;return false;}
  if(!W.at){if(moveTo(u,W.x,W.y,FAUNA[u.species].sp*.35,dt)){W.at=1;W.t=R(4,8);}else if(W.t<-25){u.drink=null;}return true;}
  u.face=W.wx>u.x?1:-1;u.anim+=dt*.6;u.sip=1;if(W.t<=0){u.drink=null;u.sip=0;}return true;}
function hnBank(x,y,R0){let best=null,bd=1e9;for(let i=0;i<24;i++){const a=i/24*TAU;for(let r=40;r<=R0;r+=30){const wx=x+Math.cos(a)*r,wy=y+Math.sin(a)*r;if(!isFresh(wx,wy))continue;
      const bx=x+Math.cos(a)*(r-34),by=y+Math.sin(a)*(r-34);if(!inWater(bx,by)&&r<bd){bd=r;best={x:bx,y:by,wx,wy};}break;}}return best;}
// raptors: hawks & eagles swoop from their perch at small prey
const _updRaptorHN=updRaptor;updRaptor=function(b,dt,dd,dz){if(b.full>0)b.full-=dt;
  if(b.state==='hunt'){const T=b.hPrey,spd=BIRD[b.kind].sp;
    if(!hnAlive(T)||(dd<300&&!G.over&&!G.won)||b.hT>10){hnDrop(b);b.state='home';b.full=R(10,20);return _updRaptorHN(b,dt,dd,dz);}
    b.hT+=dt;const tz=(T.z||0)+4,a=Math.atan2(T.y-b.y,T.x-b.x),d=Math.hypot(T.x-b.x,T.y-b.y);b.face=Math.cos(a)>0?1:-1;
    b.x+=Math.cos(a)*Math.min(d,spd*1.25*dt);b.y+=Math.sin(a)*Math.min(d,spd*1.25*dt);b.z=lerp(b.z,d<160?tz:Math.max(tz+60,90),dt*(d<160?5:2));
    if(d<160&&T.type==='animal'){T.hChased=G.t;T.hBy=b;}
    if(d<16&&Math.abs(b.z-tz)<18){hnCatch(b,T);b.state='home';b.hRest=0;}return;}
  return _updRaptorHN(b,dt,dd,dz);};
// gulls: dive at fish near the coast, then fly home
function hnGull(b,dt){const T=b.hPrey;if(!hnAlive(T)||b.hT>9||dist(b,D)<200){hnDrop(b);b.t=0;return;}
  b.hT+=dt;b.state='fly';b.t=5;const a=Math.atan2(T.y-b.y,T.x-b.x),d=Math.hypot(T.x-b.x,T.y-b.y),sp=BIRD.gull.sp;b.vx=Math.cos(a)*Math.min(sp,d*3);b.vy=Math.sin(a)*Math.min(sp,d*3);
  if(d<90)b.z=lerp(b.z,4,dt*6);if(d<16&&b.z<20){hnCatch(b,T);b.t=0;splash(T.x,T.y);}}
function splash(x,y){if(typeof ripples!=='undefined')ripples.push({x,y,t:0});puff(x,y,GFX_HI?6:3,'rgba(210,235,255,',50,3);}
// sea: sharks chase fish schools & seals; the kraken grabs fish, sharks, or tips over a passing boat
const _updSeaUnitHN=updSeaUnit;updSeaUnit=function(u,dt){
  if((u.kind==='shark'||u.kind==='squid')&&u.full>0)u.full-=dt;
  if(u.kind==='shark'&&u.hPrey){const dd=d2(u.x,u.y,D.x,D.y),T=u.hPrey;
    if((D.swim||D.alt<.35)&&dd<300&&inWater(D.x,D.y)||u.hp<=9||u.back>0||!hnAlive(T)||u.hT>10){hnDrop(u);return _updSeaUnitHN(u,dt);}
    u.hT+=dt;swimTo(u,T.x,T.y,135,dt);if(T.type==='sea'&&T.kind==='school'){T.hChased=G.t;}if(d2(u.x,u.y,T.x,T.y)<32)hnCatch(u,T);return;}
  if(u.kind==='squid'&&u.hPrey){const dd=d2(u.x,u.y,D.x,D.y),T=u.hPrey;
    if(u.state!=='lurk'&&u.state!==undefined||dd<700||!hnAlive(T)||u.hT>14){hnDrop(u);return _updSeaUnitHN(u,dt);}
    u.hT+=dt;u.anim+=dt*2;swimTo(u,T.x,T.y,70,dt);if(d2(u.x,u.y,T.x,T.y)<(T.crew!==undefined?120:85)){u.reach=.6;hnCatch(u,T);}return;}
  return _updSeaUnitHN(u,dt);};
function krakenBoat(k,s){s.hp=0;s.state='sink';s.t=0;s.kraken=1;const n=Math.max(1,s.crew||1);
  if(typeof PRN!=='undefined'&&PRN.swim)for(let i=0;i<n;i++){const a=R(0,TAU);PRN.swim.push({x:s.x+Math.cos(a)*R(10,30),y:s.y+Math.sin(a)*R(6,14),t:-R(0,.6),ph:R(0,6),col:'#c9a36a'});}
  splash(s.x,s.y);if(dist(s,D)<1400)float(s.x,s.y-50,'The KRAKEN tips the boat over! The crew paddle off on barrels!','#c8a0ff');}
// the sand worm swallows desert critters from below (pops up for a moment)
const _updWormHN=updWorm;updWorm=function(u,dt){if(u.full>0)u.full-=dt;
  if(u.ws==='under'&&u.hPrey){const dd=dist(u,D),low=D.alt<.4&&!G.over&&!G.won,T=u.hPrey;
    if(low&&dd<750&&inDesert(D.x,D.y)||!hnAlive(T)||u.hT>12){hnDrop(u);return _updWormHN(u,dt);}
    u.hT+=dt;u.inside=true;u.anim=(u.anim||0)+dt*4;const a=Math.atan2(T.y-u.y,T.x-u.x),nx=u.x+Math.cos(a)*85*dt,ny=u.y+Math.sin(a)*85*dt;if(ZONES.desert.ok(nx,ny)){u.x=nx;u.y=ny;}u.face=Math.cos(a)>0?1:-1;
    if(dist(u,T)<150){T.hChased=G.t;T.hBy=u;}
    if(dist(u,T)<34){puff(u.x,u.y,GFX_HI?18:8,'rgba(220,190,130,',160,10);hnCatch(u,T);hnFx(u.x,u.y,'sand');}return;}
  return _updWormHN(u,dt);};
// per-frame driver: a small round-robin budget of predators look for prey each frame
function updHunt(dt){HN.listT-=dt;if(!HN.list||HN.listT<=0){HN.listT=.5;hnLists();}
  const P=HN.preds,n=P.length;if(n){let b=hnBudget();for(let i=0;i<n&&b>0;i++){HN.rr=(HN.rr+1)%n;const p=P[HN.rr];if(!p||p.dead||p.gone)continue;
      if(p.kind==='gull'){if(p.hPrey){continue;}}
      if(p.hPrey||p.full>0||p.hRest>0)continue;b--;
      if(p.type==='animal'){if(p.species!=='sandworm'&&p.species!=='croc'&&hnDragonBusy(p))continue;if(p.species==='sandworm'&&p.ws!=='under')continue;if(p.state==='pounce'||p.state==='feed'||p.state==='stalk')continue;}
      else if(p.type==='sea'){if(d2(p.x,p.y,D.x,D.y)<(p.kind==='squid'?750:350))continue;if(p.kind==='squid'&&p.state&&p.state!=='lurk')continue;}
      else{if(p.kind==='gull'){if(p.state!=='ground')continue;}else if(p.state!=='perch')continue;if(dist(p,D)<500)continue;}
      if(rnd()<.35)continue;const T=hnFindPrey(p);if(T){hnStart(p,T);if(p.flap!==undefined&&p.kind!=='gull')p.state='hunt';}}}
  for(const b of birds)if(b.kind==='gull'&&b.hPrey&&!b.dead)hnGull(b,dt);
  // drinkers: now and then a wild grazer near fresh water heads to the bank
  HN.drinkT-=dt;if(HN.drinkT<=0){HN.drinkT=R(3,6);const c=HN_DRINKERS.reduce((a,k)=>a.concat(HN.list[k]||[]),[]).filter(u=>u.wild&&!u.drink&&!u.hBy&&(u.zone==='lakeside'||freshDist(u.x,u.y)<500));
    if(c.length){const u=c[RI(0,c.length-1)],W=hnBank(u.x,u.y,520);if(W){const Z=ZONES[u.zone];if(!Z||Z.ok(W.x,W.y)||u.zone==='lakeside')u.drink={x:W.x,y:W.y,wx:W.wx,wy:W.wy,t:0};}}}
  // pens: farmers bring in a new lamb / calf / piglet now and then so pen populations stay stable
  HN.penT-=dt;if(HN.penT<=0){HN.penT=20;for(const f of FARMS){const P=f.pen;if(!P||!P.cap)continue;const barn=structures.find(s=>s.kind==='barn'&&dist(s,f.barn)<5);if(barn&&barn.state!=='ok')continue;
      if(units.filter(u=>!u.dead&&u.pen===P).length<P.cap&&d2(P.x,P.y,D.x,D.y)>500)units.push(mkUnit('animal',P.x+R(15,P.w-15),P.y+R(15,P.h-15),{species:P.animal,pen:P,hp:14}));}}
  for(const f of HN.fx)f.t+=dt;HN.fx=HN.fx.filter(f=>f.t<1.1);
  crocRespawn(dt);}
const _updPartsHN=updParts;updParts=function(dt){_updPartsHN(dt);if(scene==='play'&&G&&!G.over)updHunt(dt);};
// poof effects: stars (land), feathers (birds), bubbles (water), sand (worm)
function drawHuntFx(){for(const f of HN.fx){const k=f.t/1.1,al=1-k;ctx.globalAlpha=al;
    for(let i=0;i<f.n;i++){const a=f.a+i/f.n*TAU,r=8+28*k,x=f.x+Math.cos(a)*r,y=f.y-10-18*k+Math.sin(a)*r*.6;
      if(f.kind==='stars'){hnStar(x,y,3.4*(1-k*.4),i%2?'#ffe35a':'#fff7c0');}
      else if(f.kind==='feathers'){ctx.save();ctx.translate(x,y+10*k);ctx.rotate(a+k*3);ell(0,0,4,1.6,i%2?'#fff':'#e8dcc8');ctx.restore();}
      else if(f.kind==='bubbles'){ctx.strokeStyle='#dff4ff';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y-6*k,2.5+i%3,0,TAU);ctx.stroke();}
      else ell(x,y,3,2,'#d8bd84');}
    ctx.globalAlpha=1;}}
function hnStar(x,y,r,c){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}poly(p,c);}
const _drawCrashFxHN=drawCrashFx;drawCrashFx=function(){_drawCrashFxHN.apply(this,arguments);drawHuntFx();};
// ---------- (3) crocodiles: rivers, the lake and the ponds only (never the sea or the desert oasis) ----------
FAUNA.croc={hp:26,sp:60,bite:4,aggro:90,cd:1.8,say:'SNAP! Croc bite! -4',zone:'fresh'};
HEAL.croc=22;if(typeof FOOD!=='undefined')FOOD.croc=22;
FAUNA_ART.add('croc');
const CROC_PLAN=[['river',3],['lake',2],['pond0',1],['pond1',1],['pond3',1],['jriver',4],['whole',1]];
function inPondE(p,x,y,k){const dx=(x-p.x)/p.rx,dy=(y-p.y)/p.ry;return dx*dx+dy*dy<(k||.7);}
function isFresh(x,y){if(inSea(x,y)||inOasis(x,y))return false;return inLake0(x,y)||riverD(x,y)<RIVW-12||jriverD(x,y)<JRW-12||inWHole(x,y,.75)||PONDS.some(p=>!(p.x===LAKE.x&&p.y===LAKE.y)&&inPondE(p,x,y));}
function freshDist(x,y){let m=Math.min(riverD(x,y)-RIVW,jriverD(x,y)-JRW);{const dx=(x-WHOLE.x)/WHOLE.rx,dy=(y-WHOLE.y)/WHOLE.ry;m=Math.min(m,(Math.hypot(dx,dy)-1)*WHOLE.ry);}const lx=(x-LAKE.x)/LAKE.rx,ly=(y-LAKE.y)/LAKE.ry;m=Math.min(m,(Math.hypot(lx,ly)-1)*Math.min(LAKE.rx,LAKE.ry));
  for(const p of PONDS){const dx=(x-p.x)/p.rx,dy=(y-p.y)/p.ry;m=Math.min(m,(Math.hypot(dx,dy)-1)*Math.min(p.rx,p.ry));}return m;}
function crocBody(x,y){if(inLake0(x,y))return 'lake';if(inWHole(x,y,1.2))return 'whole';if(jriverD(x,y)<JRW+30)return 'jriver';for(const i of[0,1,3]){const p=PONDS[i];if(p&&inPondE(p,x,y,1))return 'pond'+i;}return 'river';}
function crocSpot(body){for(let t=0;t<60;t++){let x,y;
    if(body==='river'){const i=RI(0,RIVER.length-2),k=rnd();x=RIVER[i][0]+(RIVER[i+1][0]-RIVER[i][0])*k+R(-14,14);y=RIVER[i][1]+(RIVER[i+1][1]-RIVER[i][1])*k+R(-14,14);}
    else if(body==='jriver'){const i=RI(0,JRIVER.length-2),k=rnd();x=JRIVER[i][0]+(JRIVER[i+1][0]-JRIVER[i][0])*k+R(-16,16);y=JRIVER[i][1]+(JRIVER[i+1][1]-JRIVER[i][1])*k+R(-16,16);}
    else if(body==='whole'){const a=R(0,TAU),r=R(0,.55);x=WHOLE.x+Math.cos(a)*WHOLE.rx*r;y=WHOLE.y+Math.sin(a)*WHOLE.ry*r;}
    else if(body==='lake'){const a=R(0,TAU),r=R(.55,.88);x=LAKE.x+Math.cos(a)*LAKE.rx*r;y=LAKE.y+Math.sin(a)*LAKE.ry*r;}
    else{const p=PONDS[+body.slice(4)],a=R(0,TAU),r=R(0,.5);x=p.x+Math.cos(a)*p.rx*r;y=p.y+Math.sin(a)*p.ry*r;}
    if(isFresh(x,y)&&crocBody(x,y)===body)return{x,y};}return null;}
ZONES.fresh={ok:isFresh,s:()=>crocSpot(['river','lake'][RI(0,1)])||{x:LAKE.x,y:LAKE.y}};
// a few deer live along the lakeshore & riverbanks (part of the normal deer cap): the crocs' favourite drinkers
ZONES.lakeside={ok:(x,y)=>!inWater(x,y)&&!inOasis(x,y)&&freshDist(x,y)<300&&x>WX0+200&&x<WX1-200,s:()=>{const b=rnd()<.5?'lake':'river',p=crocSpot(b);if(!p)return{x:LAKE.x,y:LAKE.y};
  for(let t=0;t<12;t++){const a=R(0,TAU),r=R(60,240),q={x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r};if(ZONES.lakeside.ok(q.x,q.y))return q;}return p;}};
const _spawnWildHN=spawnWild;spawnWild=function(sp,far,at){
  if(sp==='deer'&&!at&&units.filter(u=>!u.dead&&u.species==='deer'&&u.zone==='lakeside').length<4){const Z=ZONES.lakeside;let p=null;for(let t=0;!p&&t<40;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>750))p=q;}
    if(p){const n=units.length;_spawnWildHN(sp,far,p);for(let i=n;i<units.length;i++){const u=units[i];u.zone='lakeside';u.home={x:p.x-200,y:p.y-150,w:400,h:300};}return;}}
  return _spawnWildHN(sp,far,at);};
function mkCroc(x,y,body){const u=mkUnit('animal',x,y,{species:'croc',wild:true,zone:'fresh',body,hp:FAUNA.croc.hp,maxHp:FAUNA.croc.hp,free:true,t:R(0,3),jt:0,surf:0,lunge:0,full:R(0,40),face:rnd()<.5?1:-1,swim:true});units.push(u);return u;}
function crocInit(){for(const[b,n]of CROC_PLAN)for(let i=0;i<n;i++){const p=crocSpot(b);if(p)mkCroc(p.x,p.y,b);}}
function crocRespawn(dt){HN.crocT+=dt;if(HN.crocT<15)return;HN.crocT=0;G.crocR=(G.crocR||0)+15;if(G.crocR<75)return; // slow: one croc at most every ~75 s
  for(const[b,n]of CROC_PLAN){if(units.filter(u=>!u.dead&&u.species==='croc'&&u.body===b).length<n){for(let t=0;t<10;t++){const p=crocSpot(b);if(p&&d2(p.x,p.y,D.x,D.y)>700){mkCroc(p.x,p.y,b);G.crocR=0;if(dist(p,D)<1500)float(p.x,p.y-30,'A crocodile slides into the water…','#cfe8b0');return;}}}}}
function crocCanReach(c,T){if(T.flap!==undefined)return T.state==='ground'&&d2(T.x,T.y,c.x,c.y)<220;if(T.type==='sea')return T.lake&&d2(T.x,T.y,c.x,c.y)<200;
  if(T.species==='fish')return isFresh(T.x,T.y);if(freshDist(T.x,T.y)>70)return false;return true;}
function crocSwim(u,tx,ty,sp,dt){const dx=tx-u.x,dy=ty-u.y,d=Math.hypot(dx,dy);if(d<4)return true;const s=Math.min(d,sp*dt),nx=u.x+dx/d*s,ny=u.y+dy/d*s;
  if(isFresh(nx,ny)&&crocBody(nx,ny)===u.body){u.x=nx;u.y=ny;if(Math.abs(dx)>1)u.face=dx>0?1:-1;u.anim+=dt*3;return false;}u.tgt=null;return true;}
function updCroc(u,dt){const F=FAUNA.croc,dd=dist(u,D);u.cd=(u.cd||0)-dt;u.t-=dt;u.lunge=Math.max(0,(u.lunge||0)-dt);u.anim=(u.anim||0)+dt*1.2;if(u.full>0)u.full-=dt;
  const low=D.alt<.35&&!G.over&&!G.won;
  if(low&&dd<170&&!(u.burn>0)){ // the dragon wades or walks close: rear up and SNAP
    if(u.hPrey)hnDrop(u);u.surf=1;u.face=D.x>u.x?1:-1;if(!u.growl||G.t-u.growl>6){u.growl=G.t;float(u.x,u.y-26,'Hsssss!','#cfe8b0');}
    if(dd>70)crocSwim(u,D.x,D.y,F.sp*1.4,dt);if(dd<85&&u.cd<=0){u.cd=F.cd;u.lunge=.35;hurtDragon(F.bite,'croc');float(D.x+R(-20,20),D.y-90,F.say,'#ffb0a0');}return;}
  u.surf=Math.max(0,(u.surf||0)-dt*.7);
  if(u.hRest>0){u.hRest-=dt;return;}
  const T=u.hPrey;
  if(T){if(!hnAlive(T)||u.hT>16){hnDrop(u);u.full=R(5,12);return;}
    u.hT+=dt;const d=dist(u,T);
    if(d>90){if(crocSwim(u,T.x,T.y,d<220?F.sp*.55:F.sp*.35,dt)&&d>130){hnDrop(u);u.full=R(5,10);}return;} // creep up with just eyes & snout above water
    if(u.cd<=0){u.cd=1.3;u.lunge=.45;u.surf=1;splash(u.x+(T.x-u.x)*.5,u.y+(T.y-u.y)*.5);
      if(T.type==='villager'){crocScare(u,T);return;}
      if(rnd()<.8)hnCatch(u,T);else{float(T.x,T.y-24,'SNAP! …missed!','#e0ffe0');T.hChased=G.t;T.hBy=u;T.drink=null;hnDrop(u);u.full=R(6,12);}}
    return;}
  // villagers & fishermen too close to the water get a fright (never eaten)
  if(u.t<=0){u.t=R(4,9);u.tgt=crocWander(u);
    const v=units.find(o=>o.type==='villager'&&!o.dead&&dist(o,u)<110);if(v&&u.cd<=0){u.cd=4;u.lunge=.45;u.surf=1;crocScare(u,v);}
    const s=ships.find(s=>s.kind==='rowboat'&&s.state==='sail'&&d2(s.x,s.y,u.x,u.y)<120);if(s&&!s.crocT||s&&G.t-s.crocT>30){s.crocT=G.t;u.surf=1;u.lunge=.45;s.wp=null;s.ang+=Math.PI;if(dist(s,D)<1200)float(s.x,s.y-40,'A croc bumps the rowboat! "Row faster!"','#cfe8b0');}}
  if(u.tgt&&crocSwim(u,u.tgt.x,u.tgt.y,14,dt))u.tgt=null;}
function crocWander(u){for(let t=0;t<20;t++){const a=R(0,TAU),r=R(40,220),x=u.x+Math.cos(a)*r,y=u.y+Math.sin(a)*r;if(isFresh(x,y)&&crocBody(x,y)===u.body)return{x,y};}return null;}
function crocScare(c,v){if(v.state!=='flee'){if(typeof dropCarry==='function')dropCarry(v);v.state='flee';}v.t=2.5;const a=Math.atan2(v.y-c.y,v.x-c.x),nx=v.x+Math.cos(a)*30,ny=v.y+Math.sin(a)*30;if(!inWater(nx,ny)){v.x=nx;v.y=ny;}
  if(dist(v,D)<1200)float(v.x,v.y-30,['Eek! A crocodile!','Yikes! Snapping jaws!','Not today, croc!'][RI(0,2)],'#fff2c0');}
// art: lurking = eyes, brow bumps and snout tip above the water with ripples; surfacing/lunging shows the whole cartoon croc
function drawCroc(u){const x=u.x,y=u.y,f=u.face||1,s=Math.max(u.surf||0,u.lunge>0?1:0),bob=Math.sin(G.t*1.6+u.id)*1.2,lg=u.lunge>0?Math.sin(u.lunge/.45*Math.PI)*14:0;
  const rp=(G.t*.6+u.id*.37)%1;ctx.strokeStyle=`rgba(220,240,255,${.45*(1-rp)})`;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(x,y+2,14+18*rp,5+6*rp,0,0,TAU);ctx.stroke();
  const g='#5f8a3a',dk='#3f6326',lt='#a9c46a';
  if(s>.15){ctx.globalAlpha=Math.min(1,s*1.4);
    ell(x-f*16,y+1,16,5,dk);ctx.lineWidth=4;ctx.strokeStyle=dk;ctx.beginPath();ctx.moveTo(x-f*28,y);ctx.quadraticCurveTo(x-f*40,y+4+Math.sin(G.t*3)*3,x-f*50,y-1);ctx.stroke();
    ell(x,y-2,20,7,g);for(let i=-2;i<=2;i++)poly([x+i*7-3,y-7,x+i*7,y-11,x+i*7+3,y-7],dk);
    const hx=x+f*(18+lg),jaw=u.lunge>0?6:1.5;poly([hx,y-6,hx+f*26,y-4,hx+f*28,y-1,hx,y],g);poly([hx,y,hx+f*26,y+jaw,hx,y+3],lt);
    for(let i=0;i<4;i++)poly([hx+f*(6+i*5),y-1,hx+f*(8+i*5),y+2,hx+f*(10+i*5),y-1],'#fff');
    ell(hx+f*2,y-8,3.6,3.2,lt);ell(hx+f*2.5,y-8.5,1.8,2,'#fff');ell(hx+f*3,y-8.5,.9,1.4,'#222');ctx.globalAlpha=1;}
  if(s<1){ctx.globalAlpha=1-s*.8;const ey=y-2+bob;ell(x-f*4,ey,4.5,3,g);ell(x+f*4,ey,4.5,3,g);ell(x-f*4,ey-1.5,2.2,1.8,'#fff8c0');ell(x+f*4,ey-1.5,2.2,1.8,'#fff8c0');
    ell(x-f*4+f*.6,ey-1.5,.7,1.5,'#222');ell(x+f*4+f*.6,ey-1.5,.7,1.5,'#222');ell(x+f*22,ey+1,5,2.4,g);ell(x+f*24,ey,.8,.8,'#222');ell(x+f*21,ey,.8,.8,'#222');ctx.globalAlpha=1;}
  if(u.hp<u.maxHp&&typeof hpBar==='function')hpBar(x,y-22,u.hp/u.maxHp);}
const _drawFaunaHN=drawFauna;drawFauna=function(u){if(u.species==='croc'){drawCroc(u);return;}_drawFaunaHN(u);};
// sipping deer bend their heads to the water (tiny visual cue) — drawn by the normal art; the ripple marks the spot
// Tally: crocodiles count in the lake & rivers section
(function(){if(typeof TALLY_SECT==='undefined')return;const w=TALLY_SECT.find(s=>s.id==='water');if(w&&!w.keys.some(k=>k[0]==='croc'))w.keys.push(['croc','Crocodiles']);TALLY_LABEL.croc='Crocodiles';})();
// save/load: crocs are live units, so store them as a flat [x,y,hp,bodyIndex,...] list
const CROC_BODIES=['river','lake','pond0','pond1','pond3','jriver','whole'];
const _svSnapshotHN=svSnapshot;svSnapshot=function(){G.crocS=[];for(const u of units)if(!u.dead&&u.species==='croc')G.crocS.push(Math.round(u.x),Math.round(u.y),Math.round(u.hp),CROC_BODIES.indexOf(u.body));return _svSnapshotHN.apply(this,arguments);};
const _svApplyHN=svApply;svApply=function(d){const r=_svApplyHN.apply(this,arguments);const S=G.crocS;if(Array.isArray(S)){for(const u of units)if(u.species==='croc')u.dead=true;units=units.filter(u=>u.species!=='croc');
    for(let i=0;i+3<S.length;i+=4){const b=CROC_BODIES[S[i+3]]||crocBody(S[i],S[i+1]);if(isFresh(S[i],S[i+1])){const c=mkCroc(S[i],S[i+1],b);c.hp=S[i+2];}}}HN.list=null;return r;};
