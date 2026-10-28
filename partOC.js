// ======================= OCEAN & BEACH CREATURES: morays, narwhals, stingrays, anglerfish, turtles, penguins, giant octopus, starfish, seashells =======================
// All are 'sea' units (type 'sea', new kinds) so they flow through the normal bite (eatSea), fire (hurtSea), Tally and Glutton code; none raise "wanted".
const OCK=['moray','narwhal','stingray','angler','seaturtle','hatchling','pturtle','penguin','octopus','starfish'];
const OCSET=new Set(OCK);
const OC_FOOD={moray:25,narwhal:35,stingray:10,angler:15,seaturtle:18,hatchling:2,pturtle:6,penguin:6,octopus:60,starfish:2};
const OC_HP={moray:40,narwhal:50,stingray:8,angler:14,seaturtle:20,hatchling:1,pturtle:6,penguin:4,octopus:220,starfish:1};
const OC_PLAN={reefs:6,narwhalPods:2,rayGroups:3,angler:3,seaturtle:5,logs:5,penguinCols:2,starfish:14,shells:18,northSchools:3};
const OC_SHELL_T=['spiral','scallop','conch'],OC_STAR_C=['#f08a3a','#f07aa8','#9a6ad8'];
const OC={reefs:[],floes:[],logs:[],nests:[],shells:[],cols:[],t:0,shellT:0};
for(const k of OCK){SEAHEAL[k]=OC_FOOD[k];FOOD[k]=OC_FOOD[k];if(typeof SEAPTS!=='undefined')SEAPTS[k]=Math.round(OC_FOOD[k]/2)+2;}
Object.assign(HN_NICE,{moray:'a moray eel',narwhal:'a narwhal',stingray:'a stingray',angler:'an anglerfish',seaturtle:'a sea turtle',hatchling:'a turtle hatchling',pturtle:'a pond turtle',penguin:'a penguin',starfish:'a starfish'});
Object.assign(HN_WHO,{moray:'A moray eel',narwhal:'A narwhal',stingray:'A stingray',angler:'The anglerfish',penguin:'A penguin'});
HN_DIET.narwhal={prey:['school'],r:420};HN_DIET.stingray={prey:['crab','school'],r:240};HN_DIET.penguin={prey:['school'],r:320};
for(const k of ['stingray','seaturtle','penguin','hatchling'])if(!HN_DIET.shark.prey.includes(k))HN_DIET.shark.prey.push(k);
if(!HN_DIET.croc.prey.includes('pturtle'))HN_DIET.croc.prey.push('pturtle');
if(HN_DIET.gull&&!HN_DIET.gull.prey.includes('starfish'))HN_DIET.gull.prey.push('starfish');
// ---------- geography helpers ----------
const ocNorth=(x,y)=>inSea(x,y)&&y<-350;
const ocShallow=(x,y)=>inSea(x,y)&&seaD(x,y)<640&&d2(x,y,LH.x,LH.y)>LH.r+60;
function ocBeachOK(x,y){return onBeach(x,y)&&!inWater(x,y)&&!onIsle(x,y)&&x>RANGE1+200&&y>-150&&!(typeof inDesert==='function'&&inDesert(x,y))&&!(typeof inLake==='function'&&inLake(x,y));}
function ocBeachPt(far){for(let t=0;t<200;t++){let x,y;if(rnd()<.6){y=R(150,4300);x=coastX(y)-R(25,140);}else{x=R(-2600,5300+SEA_DX);y=coastY(x)-R(25,130);}
    if(!ocBeachOK(x,y))continue;if(far&&d2(x,y,D.x,D.y)<1100)continue;return{x,y};}return null;}
function ocIcyShore(){for(let t=0;t<200;t++){const y=R(-2000,-750),x=coastX(y)-R(40,150);if(!inWater(x,y)&&!inSea(x,y))return{x,y};}return{x:coastX(-1200)-90,y:-1200};}
function ocNorthPt(far){for(let t=0;t<200;t++){const x=R(5800+SEA_DX,9500+SEA_DX),y=R(-2300,-500);if(!ocNorth(x,y)||seaD(x,y)<160)continue;if(far&&d2(x,y,D.x,D.y)<1300)continue;return{x,y};}return null;}
function ocOnFloe(x,y){for(const f of OC.floes){const dx=(x-f.x)/f.rx,dy=(y-f.y)/f.ry;if(dx*dx+dy*dy<1)return f;}return null;}
function ocShallowPt(far){for(let t=0;t<200;t++){const p=seaPoint(60,460,{noDeep:true,far});if(p&&ocShallow(p.x,p.y)&&p.y>-200)return p;}return null;}
function ocHsh(i){const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s);}
function ocReefRocks(r){r.rocks=[];const n=5+Math.floor(ocHsh(r.x+r.y)*4);for(let i=0;i<n;i++){const a=ocHsh(r.x*.7+i)*TAU,d=ocHsh(r.y*.3+i*3)*70;r.rocks.push({x:r.x+Math.cos(a)*d,y:r.y+Math.sin(a)*d*.6,r:14+ocHsh(i+r.x)*16});}
  r.cv=r.rocks.slice(0,3).map(k=>({x:k.x+k.r*.5,y:k.y+k.r*.25}));return r;}
function ocLogAt(x,y){for(let i=0;i<OC.logs.length;i++)if(d2(x,y,OC.logs[i].x,OC.logs[i].y)<5)return i;return -1;}
function ocMakeLogs(n){OC.logs=[];const pts=[];for(let i=0;i<14;i++){const a=i/14*TAU+.2;pts.push([LAKE.x+Math.cos(a)*LAKE.rx*1.02,LAKE.y+Math.sin(a)*LAKE.ry*1.02,a]);}
  if(typeof RIVER!=='undefined')for(let i=1;i<RIVER.length-1;i+=Math.max(1,Math.floor(RIVER.length/6))){const p=RIVER[i];pts.push([p[0]!==undefined?p[0]:p.x,p[1]!==undefined?p[1]:p.y,null]);}
  for(let t=0;t<pts.length*3&&OC.logs.length<n;t++){const P=pts[RI(0,pts.length-1)];let lx=P[0],ly=P[1];
    // walk outward from water to find the bank
    let a=P[2]===null?R(0,TAU):P[2],ok=false;for(let r=0;r<160;r+=8){const x=lx+Math.cos(a)*r,y=ly+Math.sin(a)*r;if(!inWater(x,y)){lx=x-Math.cos(a)*14;ly=y-Math.sin(a)*14;ok=true;break;}}
    if(!ok||inSea(lx,ly)||OC.logs.some(l=>d2(l.x,l.y,lx,ly)<300))continue;let wx=lx-Math.cos(a)*40,wy=ly-Math.sin(a)*40;if(!inWater(wx,wy)){wx=lx;wy=ly;}
    OC.logs.push({x:lx,y:ly,ang:a+Math.PI/2,wx,wy,cap:RI(1,2)});}}
// ---------- spawning ----------
function ocMk(kind,x,y,o){const hp=OC_HP[kind];const u=mkSea(kind,x,y,Object.assign({hp,maxHp:hp,oc:1,st:'idle',face:rnd()<.5?1:-1,cd:R(0,2),zcd:0,anim:R(0,6)},o||{}));u.ang=R(0,TAU);return u;}
function ocMoray(r,ci){const c=r.cv[ci%r.cv.length];return ocMk('moray',c.x,c.y,{hx:c.x,hy:c.y,st:'in',inside:true,t:R(1,5),reef:OC.reefs.indexOf(r)});}
function ocPod(p,n){const pod=G.t+R(0,1e6)|0;for(let i=0;i<n;i++)ocMk('narwhal',p.x+R(-60,60),p.y+R(-40,40),{pod,lead:i===0,hx:p.x,hy:p.y,sub:R(0,1),subT:R(0,8),ox:R(-70,70),oy:R(-40,40)});}
function ocRays(p,n){for(let i=0;i<n;i++){let x=p.x+R(-50,50),y=p.y+R(-30,30);if(!ocShallow(x,y)){x=p.x;y=p.y;}ocMk('stingray',x,y,{hx:p.x,hy:p.y,bury:rnd()<.5?1:0,t:R(2,8)});}}
function ocAngler(p){return ocMk('angler',p.x,p.y,{hx:p.x,hy:p.y,lure:R(0,6)});}
function ocTurtle(p){return ocMk('seaturtle',p.x,p.y,{hx:p.x,hy:p.y,nestT:R(30,90)});}
function ocPTurtle(li){const l=OC.logs[li];const k=OC.units('pturtle').filter(u=>u.log===li).length;return ocMk('pturtle',l.x+(k?14:-12)*Math.cos(l.ang),l.y+(k?14:-12)*Math.sin(l.ang)*.5,{log:li,st:'sun',hx:l.x,hy:l.y});}
function ocPenguin(ci){const c=OC.cols[ci];const a=R(0,TAU),r=R(0,c.r*.8);return ocMk('penguin',c.x+Math.cos(a)*r,c.y+Math.sin(a)*r*.6,{col:ci,hx:c.x,hy:c.y,st:'waddle',t:R(1,4)});}
function ocStar(p){return ocMk('starfish',p.x,p.y,{hx:p.x,hy:p.y,c:RI(0,2),rot:R(0,TAU)});}
function ocOcto(far){const rs=OC.reefs.filter(r=>!far||d2(r.x,r.y,D.x,D.y)>1300);const r=rs.length?rs[RI(0,rs.length-1)]:OC.reefs[0];if(!r)return null;
  return ocMk('octopus',r.x+20,r.y+30,{hx:r.x+20,hy:r.y+30,st:'lurk',sub:.4})}
function ocShell(p){OC.shells.push({x:p.x,y:p.y,ty:RI(0,2),rot:R(-.6,.6),c:RI(0,3)});}
OC.units=k=>units.filter(u=>!u.dead&&u.kind===k&&u.type==='sea');
function ocInit(){OC.reefs=[];OC.floes=[];OC.nests=[];OC.shells=[];OC.cols=[];OC.t=0;OC.shellT=0;G.octoT=0;G.rayZaps=0;G.morayLunges=0;G.narPokes=0;G.shellsFound=0;G.anglerGulps=0;G.penSlides=0;G.hatched=0;
  for(let i=0;i<OC_PLAN.reefs*4&&OC.reefs.length<OC_PLAN.reefs;i++){const p=seaPoint(150,820,{noDeep:true,avoidIsle:true});if(!p||p.y<-200||OC.reefs.some(r=>d2(r.x,r.y,p.x,p.y)<700))continue;OC.reefs.push(ocReefRocks({x:Math.round(p.x),y:Math.round(p.y),cap:RI(1,2)}));}
  for(const r of OC.reefs)for(let i=0;i<r.cap;i++)ocMoray(r,i);
  // ice floes up north (one big one carries a penguin colony)
  for(let i=0;i<9;i++){const p=ocNorthPt(false);if(p)OC.floes.push({x:Math.round(p.x),y:Math.round(p.y),rx:i===0?150:R(40,95),ry:i===0?80:R(22,50)});}
  const sh=ocIcyShore();OC.cols.push({x:sh.x,y:sh.y,r:120,cap:RI(8,15),ice:0});
  if(OC.floes[0])OC.cols.push({x:OC.floes[0].x,y:OC.floes[0].y,r:120,cap:RI(8,12),ice:1});
  for(let ci=0;ci<OC.cols.length;ci++)for(let i=0;i<OC.cols[ci].cap;i++)ocPenguin(ci);
  for(let i=0;i<OC_PLAN.narwhalPods;i++){const p=ocNorthPt(false);if(p)ocPod(p,RI(3,5));}
  for(let i=0;i<OC_PLAN.northSchools;i++){const p=ocNorthPt(false);if(p)mkSea('school',p.x,p.y,{n:RI(6,9),hp:999,maxHp:999,north:1});}
  for(let i=0;i<OC_PLAN.rayGroups;i++){const r=OC.reefs[i];const p=r&&rnd()<.5?{x:r.x+R(-120,120),y:r.y+R(-80,80)}:ocShallowPt(false);const q=p&&ocShallow(p.x,p.y)?p:ocShallowPt(false);if(q)ocRays(q,RI(2,5));}
  ocAngler({x:R(8300+SEA_DX,9300+SEA_DX),y:R(600,2800)});const pa={x:R(8300+SEA_DX,9300+SEA_DX),y:R(3200,5400)};ocAngler(pa);ocAngler({x:pa.x+60,y:pa.y+40});
  for(let i=0;i<OC_PLAN.seaturtle;i++){const p=seaPoint(120,1400,{noDeep:true,avoidIsle:true});if(p&&p.y>-200)ocTurtle(p);}
  for(let i=0;i<3;i++){const p=ocBeachPt(false);if(p)OC.nests.push({x:p.x,y:p.y,eggs:0,t:0});}
  ocMakeLogs(OC_PLAN.logs);for(let li=0;li<OC.logs.length;li++)for(let i=0;i<OC.logs[li].cap;i++)ocPTurtle(li);
  for(let i=0;i<OC_PLAN.starfish;i++){const p=ocBeachPt(false);if(p)ocStar(p);}
  for(let i=0;i<OC_PLAN.shells;i++){const p=ocBeachPt(false);if(p)ocShell(p);}
  ocOcto(false);}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);ocInit();return r;};}
// ---------- movement ----------
const OC_OK={
  moray:(u,x,y)=>inSea(x,y),narwhal:(u,x,y)=>ocNorth(x,y)&&seaD(x,y)>80,stingray:(u,x,y)=>u.st==='flee'?inSea(x,y)&&seaD(x,y)<1000:ocShallow(x,y),angler:(u,x,y)=>inDeep(x,y)&&x>8150+SEA_DX,
  seaturtle:(u,x,y)=>inSea(x,y)&&!inDeep(x,y)&&d2(x,y,LH.x,LH.y)>LH.r+40||u.st==='nest'||u.st==='lay'||u.st==='home'&&d2(x,y,u.nx,u.ny)<300,
  hatchling:(u,x,y)=>true,pturtle:(u,x,y)=>true,penguin:(u,x,y)=>d2(x,y,u.hx,u.hy)<480,octopus:(u,x,y)=>inSea(x,y)&&d2(x,y,u.hx,u.hy)<400,starfish:(u,x,y)=>ocBeachOK(x,y)};
{const _ok=seaOK;seaOK=function(u,x,y){if(u&&OC_OK[u.kind])return OC_OK[u.kind](u,x,y);return _ok.apply(this,arguments);};}
function ocMove(u,tx,ty,sp,dt){return swimTo(u,tx,ty,sp,dt);}
function ocWander(u,sp,dt,R0){if(!u.tgt||u.tT<=0||d2(u.x,u.y,u.tgt.x,u.tgt.y)<20){const a=R(0,TAU),r=R(0,R0);u.tgt={x:u.hx+Math.cos(a)*r,y:u.hy+Math.sin(a)*r*.7};u.tT=R(4,9);}
  u.tT-=dt;ocMove(u,u.tgt.x,u.tgt.y,sp,dt);}
function ocDragonLow(u,r){return !G.over&&!G.won&&D.alt<.35&&d2(u.x,u.y,D.x,D.y)<r;}
function ocDragonWet(u,r){return ocDragonLow(u,r)&&inWater(D.x,D.y);}
function ocSay(u,s,c,cd){if(dist(u,D)>1100)return;if(cd&&u._say&&G.t-u._say<cd)return;u._say=G.t;float(u.x,u.y-34,s,c||'#ffe6a8');}
function ocHurtD(n,src,u,msg){const d0=D.hp;hurtDragon(n,src);const got=Math.round((d0-D.hp)*10)/10;if(u)ocSay(u,msg+(got>0?` -${got}`:''),'#ff9a7a');return got;}
function ocAway(u,sp,dt){const a=Math.atan2(u.y-D.y,u.x-D.x);ocMove(u,u.x+Math.cos(a)*200,u.y+Math.sin(a)*200,sp,dt);}
function ocChase(u,sp,dt,catchR){const T=u.hPrey;if(!hnAlive(T)||u.hT>12||ocDragonLow(u,260)){hnDrop(u);return false;}u.hT+=dt;ocMove(u,T.x,T.y,sp,dt);
  if(T.type==='sea'&&T.kind==='school')T.hChased=G.t;else T.hBy=u;if(d2(u.x,u.y,T.x,T.y)<catchR)hnCatch(u,T);return true;}
function updOC(u,dt){const k=u.kind;u.cd=Math.max(0,(u.cd||0)-dt);u.zcd=Math.max(0,(u.zcd||0)-dt);if(u.shell>0)u.shell-=dt;if(u.poke>0)u.poke-=dt;if(u.full>0)u.full-=dt;if(u.spray>0)u.spray-=dt;
  u.anim=(u.anim||0)+dt*2;
  if(k==='moray'){const hx=u.hx,hy=u.hy;
    if(u.st==='in'){u.inside=true;u.x=hx;u.y=hy;u.t-=dt;if(u.t<=0||ocDragonWet(u,170)){u.st='peek';u.t=R(2,4.5);u.inside=false;}return;}
    u.inside=false;
    if(u.st==='peek'){u.x=hx;u.y=hy;u.t-=dt;
      if(u.cd<=0){let T=null;if(ocDragonWet(u,150))T=D;else for(const v of units){if(v.dead||v.gone||v.type!=='sea'||v===u||v.inside)continue;const kk=v.kind;
          if(!(kk==='school'&&v.n>0&&!v.lake||kk==='iseal'&&v.state!=='rock'||kk==='stingray'||kk==='penguin'&&inSea(v.x,v.y)&&!ocOnFloe(v.x,v.y)))continue;const dd=d2(v.x,v.y,hx,hy);if(dd<150&&(!T||dd<T._dd)){T=v;T._dd=dd;}}
        if(T){u.st='lunge';u.tg=T;u.t=.7;u.cd=T===D?2.5:9;G.morayLunges++;ocSay(u,T===D?'The moray lunges!':'Lunge!','#ffd27a',1.5);return;}}
      if(u.t<=0){u.st='in';u.t=R(3,7);}return;}
    if(u.st==='lunge'){const T=u.tg;u.t-=dt;if(T!==D&&!hnAlive(T)){u.st='ret';return;}const tx=T.x,ty=T.y;const a=Math.atan2(ty-u.y,tx-u.x),d=Math.hypot(tx-u.x,ty-u.y);u.face=Math.cos(a)>0?1:-1;u.ang=a;
      const s=Math.min(d,300*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;
      if(T===D){if(d<46){ocHurtD(4,'moray',u,'Moray bite!');u.st='ret';}}
      else if(d<24&&hnAlive(T)){hnCatch(u,T);u.st='ret';}
      if(u.t<=0||d2(u.x,u.y,hx,hy)>160||T!==D&&!hnAlive(T))u.st='ret';return;}
    if(u.st==='ret'){const a=Math.atan2(hy-u.y,hx-u.x),d=Math.hypot(hx-u.x,hy-u.y),s=Math.min(d,140*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;if(d<3){u.st='peek';u.t=R(1,2.5);}return;}
    u.st='in';return;}
  if(k==='narwhal'){u.subT-=dt;if(u.subT<=0){if(u.sub>.5){u.surf=1;u.subT=R(3,5);u.spray=1.1;if(dist(u,D)<900&&rnd()<.35)ocSay(u,'Pfffsh!','#cfe8ff',4);}else{u.surf=0;u.subT=R(5,9);}}
    u.sub=lerp(u.sub,u.surf?0:.75,Math.min(1,dt*1.5));
    if(u.hPrey){ocChase(u,105,dt,34);return;}
    if(u.angry>0){u.angry-=dt;if(ocDragonLow(u,90)&&u.zcd<=0){u.zcd=1.6;u.poke=.4;G.narPokes++;ocHurtD(3,'narwhal',u,'Tusk poke!');}if(ocDragonLow(u,600)){ocMove(u,D.x,D.y,90,dt);return;}}
    const L=u.lead?null:units.find(v=>!v.dead&&v.kind==='narwhal'&&v.pod===u.pod&&v.lead);
    if(!L&&!u.lead){u.lead=true;}
    if(L){ocMove(u,L.x+u.ox,L.y+u.oy,d2(u.x,u.y,L.x+u.ox,L.y+u.oy)>100?95:55,dt);return;}
    if(u.tT===undefined||u.tT<=0||!u.tgt||d2(u.x,u.y,u.tgt.x,u.tgt.y)<30){const p=ocNorthPt(false);u.tgt=p||{x:u.hx,y:u.hy};u.tT=R(10,20);}u.tT-=dt;ocMove(u,u.tgt.x,u.tgt.y,45,dt);return;}
  if(k==='stingray'){
    // tail-barb zap at the dragon (low & close) or at a predator closing in, then glide off
    if(u.zcd<=0&&ocDragonLow(u,64)){u.zcd=3;u.bury=0;u.st='flee';u.t=2.5;G.rayZaps++;ocHurtD(3,'stingray',u,'Zap! Stingray tail barb!');zapFx(u.x,u.y);}
    if(u.zcd<=0&&u.hBy&&hnAlive(u.hBy)&&u.hBy.hPrey===u&&dist(u,u.hBy)<60&&rnd()<.6){const p=u.hBy;hnDrop(p);p.full=R(8,14);p.hRest=R(2,4);u.hBy=null;u.zcd=3;u.st='flee';u.t=2.5;u.bury=0;G.rayZaps++;
      zapFx(u.x,u.y);ocSay(u,`Zap! ${HN_WHO[hnPredKey(p)]||'The predator'} backs off!`,'#9ae8ff',2);}
    if(u.st==='flee'){u.t-=dt;u.bury=0;const s=u.hBy||D;const a0=Math.atan2(u.y-s.y,u.x-s.x),fa=u.fleeA!==undefined?u.fleeA:0;for(const da of [fa,0,.8,-.8,1.6,-1.6,2.4,-2.4]){const a=a0+da,ox=u.x,oy=u.y;ocMove(u,u.x+Math.cos(a)*200,u.y+Math.sin(a)*200,150,dt);if(u.x!==ox||u.y!==oy){u.fleeA=da;break;}}if(u.t<=0){u.st='idle';u.fleeA=undefined;}return;}
    if(u.hPrey){u.bury=0;ocChase(u,80,dt,26);return;}
    u.t-=dt;if(u.bury>0){u.bury=Math.min(1,u.bury+dt);if(u.t<=0){u.bury=0;u.t=R(5,10);}return;}
    if(u.t<=0){u.bury=.01;u.t=R(6,14);return;}ocWander(u,32,dt,160);return;}
  if(k==='angler'){u.lure+=dt*3;
    if(ocDragonWet(u,90)&&u.zcd<=0){u.zcd=2.2;u.snap=.3;ocHurtD(2,'angler',u,'Snap!');}
    if(u.snap>0)u.snap-=dt;
    // the lure draws small fish in, then gulp
    if(!u.full||u.full<=0){let T=null,bd=260*260;for(const v of units){if(v.dead||v.kind!=='school'||v.type!=='sea'||v.n<=0||v.lake)continue;const dd=d2(v.x,v.y,u.x,u.y);if(dd<bd){bd=dd;T=v;}}
      if(T){const lx=u.x+(u.face||1)*30,ly=u.y-22,a=Math.atan2(ly-T.y,lx-T.x);T.x+=Math.cos(a)*22*dt;T.y+=Math.sin(a)*22*dt;T.lured=G.t;
        if(d2(T.x,T.y,lx,ly)<55){u.snap=.35;G.anglerGulps++;hnCatch(u,T);u.full=R(10,18);}}}
    ocWander(u,16,dt,140);return;}
  if(k==='seaturtle'){
    if(ocDragonLow(u,110)&&u.st!=='nest'){u.shell=Math.max(u.shell||0,1);}
    if(u.shell>0)return;
    if(u.st==='idle'){u.nestT-=dt;if(u.nestT<=0&&OC.nests.length&&dist(u,D)>800){const n=OC.nests[RI(0,OC.nests.length-1)];if(!n.eggs){u.st='home';u.nx=n.x;u.ny=n.y;u.nest=n;}else u.nestT=R(30,60);}ocWander(u,30,dt,300);return;}
    if(u.st==='home'){const n=u.nest;const a=Math.atan2(n.y-u.y,n.x-u.x),d=Math.hypot(n.x-u.x,n.y-u.y),sp=inSea(u.x,u.y)?60:22,s=Math.min(d,sp*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;u.face=Math.cos(a)>0?1:-1;
      if(d<6){u.st='lay';u.t=6;}return;}
    if(u.st==='lay'){u.t-=dt;if(u.t<=0){const n=u.nest;n.eggs=RI(3,5);n.t=45;u.st='back';ocSay(u,'A turtle laid eggs in the sand!','#ffe6a8',8);}return;}
    if(u.st==='back'){const a=Math.atan2(u.hy-u.y,u.hx-u.x),sp=inSea(u.x,u.y)?60:22;u.x+=Math.cos(a)*sp*dt;u.y+=Math.sin(a)*sp*dt;u.face=Math.cos(a)>0?1:-1;if(inSea(u.x,u.y)&&seaD(u.x,u.y)>80){u.st='idle';u.nestT=R(80,160);}return;}
    u.st='idle';return;}
  if(k==='hatchling'){u.life-=dt;const a=Math.atan2(u.ty-u.y,u.tx-u.x);const sp=inSea(u.x,u.y)?40:28;u.x+=Math.cos(a)*sp*dt;u.y+=Math.sin(a)*sp*dt;u.face=Math.cos(a)>0?1:-1;
    if(inSea(u.x,u.y)&&seaD(u.x,u.y)>140||u.life<=0){u.dead=true;u.gone=true;}return;}
  if(k==='pturtle'){const l=OC.logs[u.log];if(!l){u.dead=true;u.gone=true;return;}
    if(u.st==='sun'){u.sub=0;if(ocDragonLow(u,260)||u.hBy&&hnAlive(u.hBy)&&dist(u,u.hBy)<200){u.st='plop';u.t=R(9,15);u.px=l.wx+R(-25,25);u.py=l.wy+R(-15,15);ocSay(u,'Plop!','#bfe6ff',3);splash(u.x,u.y);}
      else if(u.shell<=0){u.anim+=dt;}return;}
    if(u.st==='plop'){u.t-=dt;const a=Math.atan2(u.py-u.y,u.px-u.x),d=Math.hypot(u.px-u.x,u.py-u.y),s=Math.min(d,70*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;u.sub=Math.min(.7,(u.sub||0)+dt);
      if(u.t<=0&&!ocDragonLow(u,300)){u.st='climb';}return;}
    if(u.st==='climb'){const tx=l.x+(u.id%2?14:-12)*Math.cos(l.ang),ty=l.y+(u.id%2?14:-12)*Math.sin(l.ang)*.5;const a=Math.atan2(ty-u.y,tx-u.x),d=Math.hypot(tx-u.x,ty-u.y),s=Math.min(d,30*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;u.sub=Math.max(0,u.sub-dt);if(d<2)u.st='sun';return;}
    u.st='sun';return;}
  if(k==='penguin'){const c=OC.cols[u.col]||{x:u.hx,y:u.hy,r:100,ice:0};const wet=inSea(u.x,u.y)&&!ocOnFloe(u.x,u.y);u.wet=wet;
    if(u.hPrey){u.st='swim';ocChase(u,90,dt,28);return;}
    if(ocDragonLow(u,220)&&u.st!=='slide'&&u.st!=='swim'){u.st='slide';u.t=2.2;G.penSlides++;
      // belly-slide away from the dragon, toward the water
      const a=Math.atan2(u.y-D.y,u.x-D.x);u.sa=a;if(rnd()<.3)ocSay(u,'Wheee! *belly slide*','#cfe8ff',3);}
    if(u.st==='slide'){u.t-=dt;const nx=u.x+Math.cos(u.sa)*150*dt,ny=u.y+Math.sin(u.sa)*150*dt;if(d2(nx,ny,c.x,c.y)<460){u.x=nx;u.y=ny;}u.face=Math.cos(u.sa)>0?1:-1;if(u.t<=0)u.st=inSea(u.x,u.y)&&!ocOnFloe(u.x,u.y)?'swim':'waddle';return;}
    if(u.st==='swim'){u.t=(u.t||0)-dt;if(u.t<-8){u.st='back';}else{ocWander(u,60,dt,300);}if(!inSea(u.x,u.y))u.st='waddle';return;}
    if(u.st==='back'){const a=Math.atan2(c.y-u.y,c.x-u.x),d=Math.hypot(c.x-u.x,c.y-u.y),s=Math.min(d,(u.wet?60:24)*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;u.face=Math.cos(a)>0?1:-1;if(d<c.r*.7)u.st='waddle';return;}
    // waddle about the colony
    u.t-=dt;if(u.t<=0||!u.tgt){const a=R(0,TAU),r=R(0,c.r*.8);u.tgt={x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r*.6};u.t=R(2,6);}
    const d=Math.hypot(u.tgt.x-u.x,u.tgt.y-u.y);if(d>3){const a=Math.atan2(u.tgt.y-u.y,u.tgt.x-u.x),s=Math.min(d,18*dt);u.x+=Math.cos(a)*s;u.y+=Math.sin(a)*s;u.face=Math.cos(a)>0?1:-1;u.anim+=dt*6;}return;}
  if(k==='octopus'){if(u.st==='dazed'){u.dz-=dt;u.sub=0;if(u.dz<=0){u.st='lurk';u.hp=Math.max(u.hp,u.maxHp*.35);ocSay(u,'The octopus recovers!','#ffd27a');}return;}
    if(u.ink>0)u.ink-=dt;
    if(ocDragonLow(u,320)&&inWater(D.x,D.y)){u.st='fight';u.sub=Math.max(0,u.sub-dt);u.face=D.x>u.x?1:-1;if(dist(u,D)>110)ocMove(u,D.x,D.y,50,dt);
      if(u.zcd<=0&&dist(u,D)<150){u.zcd=2.4;u.slap=.4;ocHurtD(5,'octopus',u,'Tentacle slap!');}if(u.slap>0)u.slap-=dt;return;}
    u.st='lurk';u.sub=Math.min(.4,u.sub+dt*.3);ocWander(u,14,dt,120);return;}
  if(k==='starfish'){u.rot+=dt*.05;return;}}
function zapFx(x,y){for(let i=0;i<5;i++)puff(x+R(-12,12),y+R(-12,6),1,'rgba(160,240,255,',40,3);}
{const _us=updSeaUnit;updSeaUnit=function(u,dt){if(u&&u.oc){if(u.dead)return;updOC(u,dt);return;}return _us.apply(this,arguments);};}
// hunters: new predators & prey join the HN lists
{const _hl=hnLists;hnLists=function(){_hl.apply(this,arguments);const L=HN.list,P=HN.preds;if(!L||!P)return;
  for(const k of ['stingray','seaturtle','hatchling','penguin','pturtle','starfish'])L[k]=[];
  for(const u of units){if(u.dead||u.gone||!u.oc||u.inside)continue;const k=u.kind;
    if(L[k]&&!(k==='pturtle'&&u.st==='sun'&&false))L[k].push(u);if((k==='narwhal'||k==='stingray'||k==='penguin')&&!P.includes(u))P.push(u);}};}
{const _hf=hnFindPrey;hnFindPrey=function(p){const T=_hf.apply(this,arguments);if(!T||!p)return T;const k=hnPredKey(p);
  if(k==='penguin'&&!(inSea(T.x,T.y)&&!T.lake&&ocNorth(T.x,T.y)))return null;if(k==='narwhal'&&!(inSea(T.x,T.y)&&!T.lake))return null;
  if(k==='stingray'&&T.lake)return null;if(k==='gull'&&T.kind==='starfish'&&!ocBeachOK(T.x,T.y))return null;return T;};}
{const _cr=crocCanReach;crocCanReach=function(c,T){if(T&&T.kind==='pturtle')return freshDist(T.x,T.y)<90&&d2(T.x,T.y,c.x,c.y)<230;return _cr.apply(this,arguments);};}
// shells protect turtles from predators half the time
{const _hc=hnCatch;hnCatch=function(p,T){if(T&&(T.kind==='seaturtle'||T.kind==='pturtle')&&(T.shell>0||rnd()<.35)){hnDrop(p);p.full=R(10,20);p.hRest=R(2,4);T.shell=3;G.shellSaves=(G.shellSaves||0)+1;
    if(dist(T,D)<900)float(T.x,T.y-26,'Clunk! The shell protects it!','#cfe8ff');return;}return _hc.apply(this,arguments);};}
// damage: shell-hiding turtles take much less, narwhals poke back, the octopus inks & gets dazed
const OC_SHELL_MUL=.35;
{const _hs=hurtSea;hurtSea=function(u,d,src){if(!u||!u.oc)return _hs.apply(this,arguments);if(u.dead)return;const k=u.kind;
  if(k==='seaturtle'||k==='pturtle'){if(u.shell>0)d*=OC_SHELL_MUL;else{u.shell=R(2.5,4);d*=OC_SHELL_MUL;if(dist(u,D)<900)ocSay(u,'*hides in its shell*','#cfe8ff',2);}}
  if(k==='narwhal'){for(const v of units)if(!v.dead&&v.kind==='narwhal'&&v.pod===u.pod)v.angry=6;if(dist(u,D)<140&&u.zcd<=0){u.zcd=1.6;u.poke=.4;G.narPokes++;ocHurtD(3,'narwhal',u,'Tusk poke!');}}
  if(k==='moray'&&u.st==='peek'){u.st='in';u.t=R(2,4);}
  if(k==='octopus'){if(u.st==='dazed'){u.hp=Math.max(1,u.hp-d);return;}u.hp-=d;if(!(u.ink>0)){u.ink=3;puff(u.x,u.y,GFX_HI?14:6,'rgba(30,20,40,',70,10);ocSay(u,'Squirt! Ink cloud!','#c8a0ff',3);}
    if(u.hp<=u.maxHp*.25){u.st='dazed';u.dz=10;u.hp=Math.max(1,u.hp);float(u.x,u.y-70,'The octopus is DAZED! Eat it now (E)!','#ffe28a');}return;}
  u.hp-=d;u.hurtT=G.t;if(u.hp<=0){u.dead=true;puff(u.x,u.y,6,'rgba(220,240,255,',60,5);}};}
// tough ones: morays & narwhals until worn down; the octopus until dazed
TOUGH['sea:moray']={chk:u=>u.hp>u.maxHp*.5,hit:u=>{hurtSea(u,10,'bite');ocHurtD(2,'moray',u,'The moray bites back!');float(u.x,u.y-48,'Slippery! Wear the moray down below half first','#ffd27a');}};
TOUGH['sea:narwhal']={chk:u=>u.hp>u.maxHp*.5,hit:u=>{hurtSea(u,10,'bite');float(u.x,u.y-48,'Too big! Wear the narwhal down below half first','#ffd27a');}};
TOUGH['sea:octopus']={chk:u=>u.st!=='dazed',hit:u=>{hurtSea(u,8,'bite');float(u.x,u.y-70,'Too strong! Wear the octopus down until it is dazed','#ffd27a');}};
{const _es=eatSea;eatSea=function(u){if(u&&u.kind==='octopus'&&u.st!=='dazed'){D.eatCD=.8;float(u.x,u.y-70,'Too strong! Wear the octopus down until it is dazed','#ffd27a');return;}
  const was=u&&u.dead,k=u&&u.kind,n0=u&&u.n;const r=_es.apply(this,arguments);
  // Tally: bitten sea creatures were never counted before (only burned ones via hurtSea) - count every gulp once
  if(u&&typeof tallyAdd==='function'){if(k==='school'||k==='lakeschool'){if(n0!==undefined&&(u.n<n0||(!was&&u.dead)))tallyAdd('fish');}else if(!was&&u.dead&&!u._tal){u._tal=1;tallyAdd(tallyKeyU(u));}}
  if(u&&!was&&u.dead&&u.oc){const msg={octopus:'GULP! Slurped the giant octopus!',starfish:'Crunch! A starfish snack',hatchling:'Gulp! A tiny turtle snack',moray:'GULP! Moray eel!',narwhal:'GULP! Narwhal!',penguin:'Gulp! Penguin!',angler:'Gulp! Anglerfish!'}[k];
    if(msg)float(u.x,u.y-50,msg,'#ffd27a');if(k==='octopus'){G.octoT=0;maxHpUp('The giant octopus',u.x,u.y,MH.octo);}}return r;};}
MH.octo=20;
{const _mh=maxHpUp;maxHpUp=function(what,x,y,gain){if(!gain||gain===MH.feast)return _mh.apply(this,arguments);const f=MH.feast;MH.feast=gain;try{return _mh.call(this,what,x,y);}finally{MH.feast=f;}};}
// ---------- respawn, hatching, shells ----------
function ocTick(dt){OC.t+=dt;OC.shellT+=dt;
  // hatching nests
  for(const n of OC.nests){if(!n.eggs)continue;n.t-=dt;if(n.t<=0&&dist(n,D)>200){const p=seaPoint(40,200,{noDeep:true})||{x:coastX(n.y)+120,y:n.y};let best=null,bd=1e18;
      for(let i=0;i<24;i++){const a=i/24*TAU;for(let r=40;r<400;r+=20){const x=n.x+Math.cos(a)*r,y=n.y+Math.sin(a)*r;if(inSea(x,y)){if(r<bd){bd=r;best={x:x+Math.cos(a)*80,y:y+Math.sin(a)*80};}break;}}}
      const tgt=best||p;for(let i=0;i<n.eggs;i++)ocMk('hatchling',n.x+R(-10,10),n.y+R(-6,6),{tx:tgt.x+R(-30,30),ty:tgt.y+R(-30,30),life:40});G.hatched+=n.eggs;
      if(dist(n,D)<1000)float(n.x,n.y-30,'The turtle eggs hatch! Tiny turtles scurry to the sea','#9aff7a');n.eggs=0;}}
  // seashell pickup (on the ground, walking over it)
  if(D.alt<.3&&!G.over)for(let i=OC.shells.length-1;i>=0;i--){const s=OC.shells[i];if(d2(s.x,s.y,D.x,D.y)<38){OC.shells.splice(i,1);G.shellsFound++;tallyAdd('shell');
      if(rnd()<.5&&typeof D.gold==='number'){D.gold+=1;float(s.x,s.y-24,'Pretty seashell! +1 gold','#ffe28a');}else{sparkle(s.x,s.y,10);float(s.x,s.y-24,`A ${OC_SHELL_T[s.ty]} shell! ✨`,'#ffe6f8');}
      if(typeof SFX!=='undefined'&&SFX.play)SFX.play('coin',s.x,s.y,.4);}}
  if(OC.shellT>25){OC.shellT=0;if(OC.shells.length<OC_PLAN.shells){const p=ocBeachPt(true);if(p)ocShell(p);}}
  // octopus: one at a time, back 4 minutes after it is eaten
  if(!OC.units('octopus').length){G.octoT=(G.octoT||0)+dt;if(G.octoT>=240){const o=ocOcto(true);if(o){G.octoT=0;if(dist(o,D)<2000)float(D.x,D.y-120,'A giant octopus has settled on a reef...','#c8a0ff');}}}
  if(OC.t<10)return;OC.t=0;ocRespawn();}
function ocRespawn(){const far=(x,y)=>d2(x,y,D.x,D.y)>1100;
  for(let ri=0;ri<OC.reefs.length;ri++){const r=OC.reefs[ri];const n=units.filter(u=>!u.dead&&u.kind==='moray'&&u.reef===ri).length;if(n<r.cap&&far(r.x,r.y)&&rnd()<.4)ocMoray(r,n);}
  if(OC.units('narwhal').length<6&&rnd()<.4){const p=ocNorthPt(true);if(p)ocPod(p,RI(3,5));}
  if(OC.units('stingray').length<8&&rnd()<.5){const p=ocShallowPt(true);if(p)ocRays(p,RI(2,3));}
  if(OC.units('angler').length<3&&rnd()<.4){const p=seaPoint(0,1e9,{deep:true,far:true});if(p&&p.x>8150+SEA_DX)ocAngler(p);}
  if(OC.units('seaturtle').length<OC_PLAN.seaturtle&&rnd()<.4){const p=seaPoint(120,1400,{noDeep:true,far:true,avoidIsle:true});if(p&&p.y>-200)ocTurtle(p);}
  for(let li=0;li<OC.logs.length;li++){const l=OC.logs[li];if(units.filter(u=>!u.dead&&u.kind==='pturtle'&&u.log===li).length<l.cap&&far(l.x,l.y)&&rnd()<.4)ocPTurtle(li);}
  for(let ci=0;ci<OC.cols.length;ci++){const c=OC.cols[ci];if(units.filter(u=>!u.dead&&u.kind==='penguin'&&u.col===ci).length<c.cap&&far(c.x,c.y))ocPenguin(ci);}
  if(OC.units('starfish').length<OC_PLAN.starfish){const p=ocBeachPt(true);if(p)ocStar(p);}
  if(units.filter(u=>!u.dead&&u.kind==='school'&&u.north).length<OC_PLAN.northSchools){const p=ocNorthPt(true);if(p)mkSea('school',p.x,p.y,{n:RI(6,9),hp:999,maxHp:999,north:1});}}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over&&OC)ocTick(dt);};}
// ---------- drawing ----------
function ocBar(u,w,yo){if(u.hp<u.maxHp&&u.hp>0){rect(u.x-w/2,u.y-yo,w,3.5,'rgba(0,0,0,.45)');rect(u.x-w/2,u.y-yo,w*u.hp/u.maxHp,3.5,u.hp<=u.maxHp*.5?'#ffcc33':'#e44');}}
function ocNight(){return typeof nightAmt==='function'?nightAmt():0;}
function drawOC(u){const x=u.x,y=u.y,f=u.face||1,k=u.kind,t=G.t;ctx.save();
  if(k==='moray'){const ext=u.st==='peek'?1:u.st==='lunge'||u.st==='ret'?1.6:0;const dx=u.x-u.hx,dy=u.y-u.hy,ang=Math.atan2(dy,dx)||(f>0?0:Math.PI);
    ctx.strokeStyle='#5a7a2a';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(u.hx,u.hy+4);
    const wob=Math.sin(t*8+u.id)*4;ctx.quadraticCurveTo((u.hx+x)/2+wob,(u.hy+y)/2-10,x,y-6);ctx.stroke();ctx.strokeStyle='#7a9a3a';ctx.lineWidth=4;ctx.stroke();
    ell(x,y-7,9,7,'#6a8a2e');ell(x+f*5,y-9,2.2,2.2,'#ffec60');ell(x+f*5.4,y-9,1,1.6,'#111');
    if(u.st==='lunge'){poly([x+f*6,y-6,x+f*14,y-9,x+f*14,y-3],'#3a1a1a');}ocBar(u,26,26);ctx.restore();return;}
  if(k==='narwhal'){const s=u.sub||0;ctx.globalAlpha=1-s*.7;ctx.translate(x,y);ctx.scale(f,1);
    ell(0,2,30,9,'rgba(20,40,70,.3)');ell(0,0,28,9,'#8a9aa8');for(let i=0;i<5;i++)ell(-14+i*7,-3,2.4,1.6,'#5a6a78');ell(4,3,16,4,'#d8e0e8');
    poly([-26,0,-38,-8,-34,0,-38,8],'#7a8a98');const pk=u.poke>0?10:0;ctx.strokeStyle='#f4ecd0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(26,-2);ctx.lineTo(56+pk,-8);ctx.stroke();
    ctx.strokeStyle='rgba(150,130,100,.6)';ctx.lineWidth=1;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(32+i*6,-3-i*1.2);ctx.lineTo(34+i*6,-5-i*1.2);ctx.stroke();}ell(18,-3,1.5,1.5,'#111');ctx.restore();
    if(u.spray>0){const h=40*Math.sin(Math.PI*Math.min(1,u.spray/1.1));for(let i=0;i<4;i++)ell(x+f*6+R(-5,5),y-10-h+R(-5,5),5,4,'rgba(230,245,255,.75)');}
    ocBar(u,34,22);return;}
  if(k==='stingray'){const b=u.bury||0;ctx.translate(x,y);ctx.rotate(u.ang||0);const fl=Math.sin(t*4+u.id)*3*(1-b);
    ctx.globalAlpha=1-b*.5;poly([18,0,0,-14-fl,-12,0,0,14+fl],'#8a7a6a');ell(2,0,9,6,'#9a8a7a');ell(8,-3,1.4,1.4,'#222');ell(8,3,1.4,1.4,'#222');
    ctx.strokeStyle='#6a5a4a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-12,0);ctx.quadraticCurveTo(-24,Math.sin(t*3)*4,-32,0);ctx.stroke();ell(-26,0,2,1.2,'#d8c040');
    if(b>.2){ctx.globalAlpha=b*.7;ell(0,0,16,11,'#e0cc98');}ctx.restore();return;}
  if(k==='angler'){const n=ocNight(),hi=GFX_HI,pul=.6+.4*Math.sin(u.lure);ctx.translate(x,y);ctx.scale(f,1);
    ell(0,0,22,17,'#3a2a3a');ell(-2,4,18,10,'#4a3648');poly([-20,0,-32,-10,-30,0,-32,10],'#2a1e2a');const op=u.snap>0?7:3;
    poly([12,-2,22,-4+0,22,4+op],'#1a0e1a');for(let i=0;i<4;i++)poly([13+i*2.4,0,14+i*2.4,3,15+i*2.4,0],'#eee');ell(8,-8,3,3,'#ddd');ell(8.6,-8,1.4,1.4,'#111');
    ctx.strokeStyle='#5a4a5a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(2,-15);ctx.quadraticCurveTo(18,-36,30,-22);ctx.stroke();
    const br=Math.min(1,(.45+.55*n+.15)*pul);
    if(hi){const g=ctx.createRadialGradient(30,-22,0,30,-22,34);g.addColorStop(0,`rgba(180,255,220,${.55*br})`);g.addColorStop(1,'rgba(180,255,220,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(30,-22,34,0,TAU);ctx.fill();}
    else ell(30,-22,8,8,`rgba(180,255,220,${.35*br})`);
    ell(30,-22,3.4,3.4,`rgba(230,255,240,${.6+.4*br})`);ctx.restore();ocBar(u,26,26);return;}
  if(k==='seaturtle'||k==='pturtle'||k==='hatchling'){const sc=k==='seaturtle'?1:k==='pturtle'?.62:.32,hide=u.shell>0,wet=inWater(x,y)&&k!=='pturtle'||u.sub>.3;ctx.translate(x,y);ctx.scale(f*sc,sc);
    if(wet)ctx.globalAlpha=k==='pturtle'?.6:.85;const fl=hide?0:Math.sin(t*(k==='hatchling'?14:4)+u.id)*3;const skin=k==='pturtle'?'#6a8a3a':'#7a9a5a';
    if(!hide){ell(-12,-10+fl*.5,7,3.5,skin);ell(-12,10-fl*.5,7,3.5,skin);ell(12,-11-fl*.5,(k==='seaturtle'?11:6),4,skin);ell(12,11+fl*.5,(k==='seaturtle'?11:6),4,skin);ell(25,0,7,5.5,skin);ell(28,-2,1.2,1.2,'#111');}
    ell(0,0,20,15,k==='pturtle'?'#3a5a2a':'#5a6a3a');ell(0,-1,16,11,k==='pturtle'?'#5a7a3a':'#8a8a4a');ctx.strokeStyle='rgba(40,40,20,.5)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(-8,-9);ctx.lineTo(-8,9);ctx.moveTo(6,-10);ctx.lineTo(6,10);ctx.moveTo(-16,0);ctx.lineTo(16,0);ctx.stroke();ctx.restore();if(k!=='hatchling')ocBar(u,26,22);return;}
  if(k==='penguin'){const wet=u.wet,sl=u.st==='slide';const b=sl?0:Math.abs(Math.sin(u.anim))*2;ctx.translate(x,y);ctx.scale(f,1);
    if(wet){ell(0,0,10,4,'rgba(230,245,255,.5)');ell(0,-2,7,4,'#1a1a24');ell(5,-4,2.4,2,'#fff');poly([8,-4,12,-3,8,-2],'#f0a020');ctx.restore();return;}
    if(sl){ell(0,-4,14,6,'#1a1a24');ell(1,-2,11,3.5,'#f4f4f4');ell(12,-6,4.5,4,'#1a1a24');poly([16,-6,20,-5,16,-4],'#f0a020');ell(13,-7,1,1,'#fff');ctx.restore();return;}
    ell(0,1,8,3,'rgba(0,0,0,.18)');ctx.rotate(Math.sin(u.anim)*.12);ell(0,-11-b,7,11,'#1a1a24');ell(1,-9-b,5,8,'#f4f4f4');ell(1,-21-b,5,5,'#1a1a24');ell(3,-22-b,1.2,1.2,'#fff');ell(3.2,-22-b,.6,.6,'#000');
    poly([5,-21-b,9,-20-b,5,-19-b],'#f0a020');ell(-6,-11-b,2,6,'#1a1a24');ell(-2,0,2.5,1.2,'#f0a020');ell(3,0,2.5,1.2,'#f0a020');ctx.restore();return;}
  if(k==='octopus'){const s=u.sub||0,dz=u.st==='dazed',cam=u.st==='lurk';ctx.globalAlpha=1-s*.6;const col=cam?`hsl(${20+20*Math.sin(t*.7)},45%,${38+8*Math.sin(t*.5)}%)`:'#c8503a';
    for(let i=0;i<8;i++){const a=i/8*TAU+.2,sw=Math.sin(t*2+i)*.4+(u.slap>0&&i===0?1.2:0),L=46+(u.slap>0&&i===0?40:0);ctx.strokeStyle=col;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);
      ctx.quadraticCurveTo(x+Math.cos(a)*L*.6,y+Math.sin(a)*L*.35,x+Math.cos(a+sw)*L,y+Math.sin(a+sw)*L*.55);ctx.stroke();}
    ell(x,y-16,24,22,col);ell(x-7,y-12,4,4.5,'#fff');ell(x+7,y-12,4,4.5,'#fff');ell(x-7,y-12,1.6,dz?.6:2.6,'#111');ell(x+7,y-12,1.6,dz?.6:2.6,'#111');
    ctx.globalAlpha=1;if(dz)for(let i=0;i<3;i++){const a=t*3+i*2.1;txt('★',x+Math.cos(a)*22,y-44+Math.sin(a)*6,12,'#ffe060','center');}ocBar(u,50,50);ctx.restore();return;}
  if(k==='starfish'){ctx.translate(x,y);ctx.rotate(u.rot||0);const c=OC_STAR_C[u.c||0];ctx.fillStyle=c;ctx.beginPath();for(let i=0;i<10;i++){const r=i%2?3.5:10,a=i/10*TAU;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*.75);}ctx.closePath();ctx.fill();
    for(let i=0;i<5;i++){const a=i/5*TAU;ell(Math.cos(a)*4.5,Math.sin(a)*3.3,.9,.9,'rgba(255,255,255,.6)');}ctx.restore();return;}
  ctx.restore();}
{const _ds=drawSeaUnit;drawSeaUnit=function(u){if(u&&u.oc)return drawOC(u);return _ds.apply(this,arguments);};}
function drawShell(s){const x=s.x,y=s.y,cols=['#f4e4d0','#f0c8c0','#e8d8a8','#f8f0e8'],c=cols[s.c||0];ctx.save();ctx.translate(x,y);ctx.rotate(s.rot||0);
  if(s.ty===0){ctx.strokeStyle='#a08060';ctx.fillStyle=c;ctx.lineWidth=1.2;ctx.beginPath();for(let i=0;i<40;i++){const a=i*.35,r=1+i*.22;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r*.8);}ctx.fill();ctx.stroke();}
  else if(s.ty===1){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,4);ctx.arc(0,4,9,Math.PI*1.1,Math.PI*1.9);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(160,110,90,.7)';ctx.lineWidth=1;
    for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(0,4);ctx.lineTo(Math.sin(i*.26)*9,4-Math.cos(i*.26)*9);ctx.stroke();}rect(-2.5,3,5,2.5,c);}
  else{ell(0,0,10,5,c);poly([8,-3,15,0,8,3],c);for(let i=0;i<3;i++)ell(-6+i*4,-3,1.6,1.2,'#d8a888');ell(1,1,6,2,'rgba(240,150,140,.6)');}
  ctx.restore();}
{const _dl=drawSeaLow;drawSeaLow=function(x0,y0,x1,y1){const r=_dl.apply(this,arguments);const v=(o,m)=>o.x>x0-(m||200)&&o.x<x1+(m||200)&&o.y>y0-(m||200)&&o.y<y1+(m||200);
  for(const f of OC.floes)if(v(f,260)){ell(f.x,f.y+4,f.rx+4,f.ry+3,'rgba(150,190,220,.6)');ell(f.x,f.y,f.rx,f.ry,'#eef6fb');if(GFX_HI)ell(f.x-f.rx*.25,f.y-f.ry*.25,f.rx*.5,f.ry*.4,'rgba(255,255,255,.8)');}
  for(const c of OC.cols)if(!c.ice&&v(c,260))ell(c.x,c.y,c.r*1.1,c.r*.6,'rgba(240,248,255,.35)');
  for(const rf of OC.reefs)if(v(rf,260)){for(const k of rf.rocks){ell(k.x,k.y+3,k.r+3,k.r*.6+2,'rgba(20,40,60,.35)');ell(k.x,k.y,k.r,k.r*.62,'#6a6458');ell(k.x-k.r*.25,k.y-k.r*.2,k.r*.55,k.r*.3,'#857d6c');}
    if(GFX_HI)for(let i=0;i<rf.rocks.length;i++){const k=rf.rocks[i];ell(k.x+k.r*.6,k.y-k.r*.4,3,5,['#e8706a','#f0a050','#c070d0'][i%3]);}
    for(const c of rf.cv){ell(c.x,c.y,7,4.5,'#1a1814');}}
  for(const u of units)if(!u.dead&&u.kind==='moray'&&u.inside&&v(u,60)){const f=Math.sin(G.t*2+u.id)>-.3;if(f){ell(u.x-3,u.y-1,1.5,1.5,'#ffec60');ell(u.x+3,u.y-1,1.5,1.5,'#ffec60');}}
  for(const l of OC.logs)if(v(l,200)){ctx.save();ctx.translate(l.x,l.y);ctx.rotate(l.ang);ell(0,3,40,8,'rgba(0,0,0,.2)');rect(-38,-6,76,12,'#6a4a2a');ell(38,0,4,6,'#a8845a');ell(-38,0,4,6,'#8a6a42');ctx.restore();}
  for(const n of OC.nests)if(v(n,120)){ell(n.x,n.y,16,8,'rgba(170,140,90,.45)');for(let i=0;i<(n.eggs||0);i++)ell(n.x-8+i*4,n.y-1+(i%2)*3,3,2.6,'#f8f4e8');}
  for(const s of OC.shells)if(v(s,60))drawShell(s);return r;};}
{const _dm=drawSeaMap;drawSeaMap=function(X,Y,big,q){const r=_dm.apply(this,arguments);if(!big)return r;
  for(const f of OC.floes){if(typeof seen==='function'&&!seen(f.x,f.y))continue;ctx.fillStyle='#f4fbff';ctx.fillRect(X(f.x)-q*.6,Y(f.y)-q*.4,q*1.2,q*.8);}
  for(const rf of OC.reefs){if(typeof seen==='function'&&!seen(rf.x,rf.y))continue;ctx.fillStyle='#e8706a';ctx.fillRect(X(rf.x)-q*.5,Y(rf.y)-q*.5,q,q);}return r;};}
// ---------- Tally ----------
tallyAddSect('coast','Animals · Coast & sea','🦈','#6fb8e8',[['moray','Moray eels'],['narwhal','Narwhals'],['stingray','Stingrays'],['angler','Anglerfish'],['seaturtle','Sea turtles'],['hatchling','Turtle hatchlings'],['penguin','Penguins'],['octopus','Giant octopus'],['starfish','Starfish'],['shell','Seashells found']]);
tallyAddSect('water','Animals · Lake & rivers','🐟','#8fd3ff',[['pturtle','Pond turtles']]);
// ---------- save / load ----------
{const _ss=svSnapshot;svSnapshot=function(){const U=[];for(const u of units)if(!u.dead&&u.oc&&u.kind!=='hatchling')U.push(OCK.indexOf(u.kind),Math.round(u.x),Math.round(u.y),Math.round(u.hp),Math.round(u.hx||0),Math.round(u.hy||0),u.kind==='moray'?u.reef:u.kind==='pturtle'?u.log:u.kind==='penguin'?u.col:u.kind==='narwhal'?(u.pod%1e6):u.kind==='starfish'?u.c:0);
  G.ocU=U;G.ocR=[];for(const r of OC.reefs)G.ocR.push(r.x,r.y,r.cap);G.ocF=[];for(const f of OC.floes)G.ocF.push(Math.round(f.x),Math.round(f.y),Math.round(f.rx),Math.round(f.ry));
  G.ocL=[];for(const l of OC.logs)G.ocL.push(Math.round(l.x),Math.round(l.y),+l.ang.toFixed(3),Math.round(l.wx),Math.round(l.wy),l.cap);G.ocN=[];for(const n of OC.nests)G.ocN.push(Math.round(n.x),Math.round(n.y),n.eggs||0,Math.round(n.t||0));
  G.ocSh=[];for(const s of OC.shells)G.ocSh.push(Math.round(s.x),Math.round(s.y),s.ty,s.c);G.ocC=[];for(const c of OC.cols)G.ocC.push(Math.round(c.x),Math.round(c.y),c.cap,c.ice);return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(!Array.isArray(G.ocU))return r;
  for(const u of units)if(u.oc){u.dead=true;u.gone=true;}units=units.filter(u=>!u.oc);
  if(Array.isArray(G.ocR)){OC.reefs=[];for(let i=0;i+2<G.ocR.length;i+=3)OC.reefs.push(ocReefRocks({x:G.ocR[i],y:G.ocR[i+1],cap:G.ocR[i+2]}));}
  if(Array.isArray(G.ocF)){OC.floes=[];for(let i=0;i+3<G.ocF.length;i+=4)OC.floes.push({x:G.ocF[i],y:G.ocF[i+1],rx:G.ocF[i+2],ry:G.ocF[i+3]});}
  if(Array.isArray(G.ocL)){OC.logs=[];for(let i=0;i+5<G.ocL.length;i+=6)OC.logs.push({x:G.ocL[i],y:G.ocL[i+1],ang:G.ocL[i+2],wx:G.ocL[i+3],wy:G.ocL[i+4],cap:G.ocL[i+5]});}
  if(Array.isArray(G.ocN)){OC.nests=[];for(let i=0;i+3<G.ocN.length;i+=4)OC.nests.push({x:G.ocN[i],y:G.ocN[i+1],eggs:G.ocN[i+2],t:G.ocN[i+3]});}
  if(Array.isArray(G.ocSh)){OC.shells=[];for(let i=0;i+3<G.ocSh.length;i+=4)OC.shells.push({x:G.ocSh[i],y:G.ocSh[i+1],ty:G.ocSh[i+2],c:G.ocSh[i+3],rot:R(-.6,.6)});}
  if(Array.isArray(G.ocC)){OC.cols=[];for(let i=0;i+3<G.ocC.length;i+=4)OC.cols.push({x:G.ocC[i],y:G.ocC[i+1],r:120,cap:G.ocC[i+2],ice:G.ocC[i+3]});}
  const U=G.ocU;for(let i=0;i+6<U.length;i+=7){const k=OCK[U[i]],x=U[i+1],y=U[i+2],hp=U[i+3],hx=U[i+4],hy=U[i+5],e=U[i+6];if(!k)continue;
    const o={hx,hy};if(k==='moray'){Object.assign(o,{reef:e,st:'in',inside:true,t:R(1,4)});}else if(k==='pturtle'){Object.assign(o,{log:e,st:'sun'});}else if(k==='penguin'){Object.assign(o,{col:e,st:'waddle',t:1});}
    else if(k==='narwhal'){Object.assign(o,{pod:e,sub:0,subT:R(0,6),ox:R(-70,70),oy:R(-40,40)});}else if(k==='starfish'){Object.assign(o,{c:e,rot:R(0,TAU)});}else if(k==='seaturtle'){o.nestT=R(30,90);}else if(k==='angler'){o.lure=0;}else if(k==='stingray'){o.bury=0;o.t=R(2,6);}else if(k==='octopus'){o.st='lurk';o.sub=.4;}
    const u=ocMk(k,x,y,o);u.hp=hp;if(k==='moray'){u.x=hx;u.y=hy;}}
  {const pods={};for(const u of units)if(u.kind==='narwhal'&&!u.dead){if(!pods[u.pod]){pods[u.pod]=1;u.lead=true;}else u.lead=false;}}return r;};}
