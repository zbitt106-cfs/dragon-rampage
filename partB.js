// ======================= river bridges: burnable wood, sturdy stone; ground troops must use them =======================
let HEAVY=false; // set while a stomp or dive slam is being applied (only heavy blows can crack stone bridges)
const BRIDGE_ROADS=[[6,8],[6,11],[10,11]]; // village pairs whose roads cross the Silver River
function riverY(x){for(let i=0;i<RIVER.length-1;i++){const[a,b]=[RIVER[i],RIVER[i+1]];if(x>=a[0]&&x<=b[0])return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}return null;}
function rside(x,y){const ry=riverY(x);return ry===null?0:(y>ry?1:-1);}
function addBridges(){for(const[i,j]of BRIDGE_ROADS){const a=VILLAGES[i],b=VILLAGES[j],best=bridgeSpot(i,j);
    const s=addStruct('bridge',best.x,best.y,-1);s.ang=Math.atan2(b.y-a.y,b.x-a.x);s.len=2*RIVW+44;s.mat='wood';s.road=[a,b];}}
function bridgeEnds(s){const c=Math.cos(s.ang),n=Math.sin(s.ang),h=s.len/2+14;const p={x:s.x-c*h,y:s.y-n*h},q={x:s.x+c*h,y:s.y+n*h};return rside(p.x,p.y)<0?[p,q]:[q,p];} // [north, south]
function bridgeEnd(s,u){const[e0,e1]=bridgeEnds(s);return d2(u.x,u.y,e0.x,e0.y)<d2(u.x,u.y,e1.x,e1.y)?e0:e1;}
function onBridge(x,y){for(const s of structures){if(s.kind!=='bridge'||s.state!=='ok')continue;const dx=x-s.x,dy=y-s.y,c=Math.cos(s.ang),n=Math.sin(s.ang);
    if(Math.abs(dx*c+dy*n)<s.len/2+10&&Math.abs(-dx*n+dy*c)<24)return true;}return false;}
const riverBlocked=(x,y)=>riverD(x,y)<RIVW-6&&!onBridge(x,y);
// where should a ground unit head so it doesn't walk into the river? null = straight there is fine
function riverRoute(u,tx,ty){
  if(u.detour){const W=lakeW(u.detour,u.detSide);if(rside(tx,ty)===u.detSide||bridgeUp())u.detour=0;else{if(d2(u.x,u.y,W.x,W.y)<40)u.detour=u.detour===1?2:0;if(u.detour)return lakeW(u.detour,u.detSide);}}if(u.leg&&u.leg.on&&u.leg.s.state==='ok'){const e=bridgeEnds(u.leg.s),to=u.leg.su<0?e[1]:e[0];if(d2(u.x,u.y,to.x,to.y)>10)return to;u.leg=null;}
  if((u.y<3150&&ty<3150)||(u.x<1900&&tx<1900))return null;
  const ru=rside(u.x,u.y),rt=rside(tx,ty),cross=!!(ru&&rt&&ru!==rt);
  if(!cross){u.leg=null;return null;}
  const su=rside(u.x,u.y)||-rside(tx,ty);
  if(u.leg&&u.leg.s.state==='ok'&&(u.leg.on||u.leg.su===su)){const e=bridgeEnds(u.leg.s),from=u.leg.su<0?e[0]:e[1],to=u.leg.su<0?e[1]:e[0];if(!u.leg.on&&d2(u.x,u.y,from.x,from.y)<18)u.leg.on=true;
    if(u.leg.on&&d2(u.x,u.y,to.x,to.y)<10){u.leg=null;return null;}return u.leg.on?to:from;}
  let best=null,bd=1e9;for(const s of structures){if(s.kind!=='bridge'||s.state!=='ok')continue;const d=d2(u.x,u.y,s.x,s.y)+d2(s.x,s.y,tx,ty);if(d<bd){bd=d;best=s;}}
  if(best){u.leg={s:best,on:false,su};const e=bridgeEnds(best);return su<0?e[0]:e[1];}
  // every bridge is down: go the long way round the west shore of Mirror Lake (or wait there)
  u.leg=null;u.detour=1;u.detSide=ru;const W=lakeW(1);
  if(!u.waitMsg||G.t-u.waitMsg>20){u.waitMsg=G.t;if(dist(u,D)<700&&(u.type==='knight'||u.type==='archer'))float(u.x,u.y-34,'The bridge is out! Go around!','#ffe0a0');}return W;}
function bridgeUp(){return structures.some(s=>s.kind==='bridge'&&s.state==='ok');}
function lakeW(i,side){return i===1?{x:LAKE.x-LAKE.rx-160,y:LAKE.y}:{x:LAKE.x-LAKE.rx*.3,y:LAKE.y-(side||-1)*(LAKE.ry+140)};}
// wrap the shared mover: everyone except animals must respect the river
const _moveTo=moveTo;
moveTo=function(u,tx,ty,sp,dt){if(u.type==='animal'||!u.type)return _moveTo(u,tx,ty,sp,dt);
  if(isSoldier(u)&&(inSea(tx,ty)||inLake(tx,ty))&&shoreHold(u,tx,ty,sp,dt))return false;
  if(isSoldier(u)&&!u.inside){const rw=roadWay(u,tx,ty);if(rw){const ox=u.x,oy=u.y;tx=rw.x;ty=rw.y;sp*=1.1;const wp0=riverRoute(u,tx,ty),bl0=uBlocked(u);_moveTo(u,wp0?wp0.x:tx,wp0?wp0.y:ty,sp,dt);if(bl0(u.x,u.y)&&!bl0(ox,oy)){u.x=ox;u.y=oy;bankSlide(u,tx,ty,sp*dt,bl0);}return false;}}
  const wp=riverRoute(u,tx,ty),bl=uBlocked(u);const ox=u.x,oy=u.y,r=_moveTo(u,wp?wp.x:tx,wp?wp.y:ty,sp,dt);
  if(bl(u.x,u.y)&&!bl(ox,oy)){u.x=ox;u.y=oy;bankSlide(u,wp?wp.x:tx,wp?wp.y:ty,sp*dt,bl);}return wp?false:r;};
// a unit that isn't deliberately using a bridge treats the deck like water (so nobody wanders onto it sideways and gets stuck)
const wet=(x,y)=>riverD(x,y)<RIVW-6;function uBlocked0(u){return (u.leg&&(u.leg.on||u.leg.s.state==='ok'))?riverBlocked:(wet(u.x,u.y)?riverBlocked:wet);}
// knights, mounted knights, archers, siege crews and siege engines can't swim: the sea and Mirror Lake are walls to them too
function uBlocked(u){const b=uBlocked0(u);if(!isSoldier(u))return b;return(x,y)=>b(x,y)||inSea(x,y)||inLake(x,y);}
// slide along the riverbank toward the goal instead of getting stuck against the water
function bankSlide(u,tx,ty,step,bl){bl=bl||riverBlocked;const a=Math.atan2(ty-u.y,tx-u.x),pref=u.slideSide||1;
  for(const k of[.5,1,1.5,2,2.5])for(const sd of[pref,-pref]){const b=a+sd*k,x=u.x+Math.cos(b)*step,y=u.y+Math.sin(b)*step;if(!bl(x,y)){u.x=x;u.y=y;u.slideSide=sd;return;}}}
function updBridgeWork(){ // rebuild ruined bridges first; at later castle levels upgrade wood to stone
  const late=G.lvl>=3||G.waveNum>=8;
  for(const s of structures){if(s.kind!=='bridge')continue;
    if(s.state==='ruin'&&!s.builder){const stone=late&&G.stone>=6;s.nextMat=stone?'stone':'wood';}
    if(s.state==='ok'&&s.mat==='wood'&&late&&!s.upgBy&&G.stone>=8&&!s.fire){const bu=freeBuilder(s);if(bu){G.stone-=8;s.upgBy=bu;s.upg=0;bu.task={s,upg:true};bu.state='tobuild';float(s.x,s.y-40,'Villagers start a STONE bridge (-8 stone)','#cfd8e0');return;}}}}
function freeBuilder(s){let bu=null,bd=1e9;for(const u of units)if(u.type==='villager'&&!u.dead&&u.job==='peasant'&&!u.task&&!u.water&&u.state!=='flee'){const dd=dist(u,s);if(dd<bd&&dd<1600){bd=dd;bu=u;}}return bu;}
function bridgeCost(s){return s.nextMat==='stone'?[1,6]:[5,0];}
function drawBridge(s){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.ang);const L=s.len,h=L/2;
  if(s.state==='ruin'){if(s.mat==='stone'){for(const k of[-1,1]){ell(k*h*.8,0,20,14,'#7a7a80');ell(k*h*.6,6,12,8,'#8a8a90');}}
    else for(let i=-2;i<=2;i++){rect(i*L/5-3,-20,6,8,'#1e1610');rect(i*L/5-3,12,6,8,'#1e1610');}}
  else{const b=s.state==='building'?s.build:1;
    if(s.mat==='stone'&&s.state==='ok'){rect(-h,-19,L,38,'#9a9a9e');for(let i=-h;i<h;i+=14)line(i,-19,i,19,'rgba(60,60,70,.35)',1);rect(-h,-22,L,5,'#808088');rect(-h,17,L,5,'#808088');
      ctx.strokeStyle='#6a6a72';ctx.lineWidth=3;for(const k of[-1,1]){ctx.beginPath();ctx.arc(k*L/4,22,14,Math.PI,0);ctx.stroke();}}
    else{const mat=s.state==='building'&&s.nextMat==='stone'?'#9a9a9e':'#9a6a3a';for(let i=-h;i<-h+L*b;i+=8){rect(i,-17,7,34,s.fire?'#5a3a1a':mat);}
      for(let i=-2;i<=2;i++){rect(i*L/5-3,-21,6,6,'#5a3a1a');rect(i*L/5-3,15,6,6,'#5a3a1a');}if(b>=1){line(-h,-18,h,-18,'#6a4422',3);line(-h,18,h,18,'#6a4422',3);}}}
  ctx.restore();
  if(s.fire&&s.state!=='ruin')for(let i=0;i<4;i++){const t=G.t*7+i*2;ell(s.x+Math.cos(s.ang)*(i-1.5)*28,s.y-8-Math.abs(Math.sin(t))*8,8,12+Math.sin(t)*4,i%2?'rgba(255,150,30,.8)':'rgba(255,220,80,.75)');}
  if(s.state==='building'){rect(s.x-26,s.y-44,52,5,'#222');rect(s.x-26,s.y-44,52*s.build,5,s.nextMat==='stone'?'#cfd8e0':'#7fd07f');}
  if(s.upgBy){rect(s.x-26,s.y-44,52,5,'#222');rect(s.x-26,s.y-44,52*(s.upg||0),5,'#cfd8e0');txt('Upgrading to stone',s.x,s.y-50,10,'#fff','center',false);}
  if(s.state==='ok'&&s.hp<s.maxHp){rect(s.x-30,s.y+26,60,4,'#400');rect(s.x-30,s.y+26,60*s.hp/s.maxHp,4,'#f80');}}
// dive slam: dropping out of the sky with F/Y next to things smashes them (the way to crack stone bridges)
function diveSlam(){G.shake=Math.max(G.shake,16);rumble(1,.8,320);puff(D.x,D.y,46,'rgba(170,150,110,',300,20);float(D.x,D.y-90,'DIVE SLAM!','#ffd24a');HEAVY=true;
  for(const s of structures)if(s.state!=='ruin'&&dist(s,D)<150)hurtStruct(s,stoneish(s)?110:45);HEAVY=false;
  for(const u of units)if(!u.dead&&!u.inside&&dist(u,D)<120&&u.type!=='animal')hurtUnit(u,30,'stomp');
  for(const g of siege)if(!g.dead&&dist(g,D)<140)hurtSiege(g,60);}
function updBridges(dt){if(G.diveT&&D.alt<.08){if(G.t-G.diveT<3&&D.diveFrom>.6&&!G.over)shipSlam();if(G.t-G.diveT<3&&D.diveFrom>.85&&!G.over)diveSlam();G.diveT=0;}}
