// ======================= KINGDOM WATCHTOWERS: wooden archer towers the kingdom builds from cart-delivered stock =======================
// Spots: beside the kingdom roads (first near the castle, then progressively farther out, spaced apart) plus guard posts on village edges.
// Max towers = 2 + castle level. Kingdom regions only (never the wilds/forest, lair, desert, savanna, jungle, mountains or Dragon Peaks).
// Built ONLY from wood/stone delivered by carts to the storehouse during this level (no starting stock, no free/timed resources):
// each tower spends its cost. Kill the carts/workers and building slows. Destroyed towers leave rubble, still count toward the max,
// and are rebuilt (same delivered-only rule). Saved with the game.
KDEF.wtower={name:'Watchtower',hp:160,cost:[3,2],gold:[1,3],pts:120,alarm:6,sz:30};COST.wtower=KDEF.wtower.cost;STRUCT_NAME.wtower='Watchtower';
const RT={cost:[3,2],buildT:14,check:3,space:650,archerWait:25,regions:new Set(['farm','castle','south','lake','hills','coast'])};
let RT_SPOTS=null;
const rtMax=()=>Math.min((RT_SPOTS||rtSpots()).length,2+(G.lvl||1));
function rtOkAt(x,y){const k=regionKey(x,y);if(!RT.regions.has(k))return false;if(inWater(x,y)||inSea(x,y)||(typeof inDP==='function'&&inDP(x,y,1.3)))return false;
  if(typeof roadWet==='function'&&roadWet(x,y,30))return false;if(castleBox(x,y))return false;if(d2(x,y,LAIR.x,LAIR.y)<1400)return false;
  if(typeof DESERT!=='undefined'&&x<RANGE0+200)return false;return true;}
const rtRoadD=(x,y)=>{let b=1e9;for(const r of buildRoads())for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],c=r.pts[i+1],vx=c.x-a.x,vy=c.y-a.y,L=vx*vx+vy*vy||1,t=clamp(((x-a.x)*vx+(y-a.y)*vy)/L,0,1);b=Math.min(b,Math.hypot(x-a.x-vx*t,y-a.y-vy*t));}return b;};
function rtClear(x,y){return !structures.some(s=>s.kind!=='wtower'&&d2(x,y,s.x,s.y)<85);}
function rtSpots(){if(RT_SPOTS)return RT_SPOTS;const C={x:GATE.x,y:GATE.y+40},cand=[];
  // road spots: every ~60 px along kingdom roads, set 58 px to the side of the road
  for(const r of buildRoads()){if(r.kind==='bridge')continue;const P=r.pts;let acc=0;
    for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1)continue;const nx=-(b.y-a.y)/L,ny=(b.x-a.x)/L;
      for(let t=0;t<L;t+=60){const x=a.x+(b.x-a.x)*t/L,y=a.y+(b.y-a.y)*t/L;for(const sd of[1,-1]){const px=x+nx*58*sd,py=y+ny*58*sd;
        if(rtOkAt(px,py)&&rtRoadD(px,py)>40&&rtClear(px,py)&&d2(px,py,C.x,C.y)>260)cand.push({x:Math.round(px),y:Math.round(py),t:'road'});}}}}
  // village guard spots: on the edge of each kingdom village, on the side facing out from the castle
  const vil=[];VILLAGES.forEach((v,i)=>{if(typeof DTOWN!=='undefined'&&i===DTOWN.vi)return;if(!rtOkAt(v.x,v.y))return;const a0=Math.atan2(v.y-C.y,v.x-C.x);
    for(const da of[0,.5,-.5,1,-1,1.6,-1.6]){const x=v.x+Math.cos(a0+da)*230,y=v.y+Math.sin(a0+da)*190;if(rtOkAt(x,y)&&rtClear(x,y)&&rtRoadD(x,y)>36){vil.push({x:Math.round(x),y:Math.round(y),t:'village',v:i});break;}}});
  // order: nearest the castle first, greedily spaced apart; village guard spots slot in by their distance too
  const all=[...cand,...vil].map(p=>Object.assign(p,{d:Math.hypot(p.x-C.x,p.y-C.y)})).sort((a,b)=>a.d-b.d||(a.t==='village'?-1:1));
  const out=[];for(const p of all){const sp=p.t==='village'?380:RT.space;if(out.some(q=>d2(p.x,p.y,q.x,q.y)<sp))continue;out.push(p);}
  out.forEach((p,i)=>p.i=i);RT_SPOTS=out;return out;}
const rtTowers=()=>structures.filter(s=>s.kind==='wtower');
function rtBudget(){return{w:G.rtW||0,s:G.rtS||0};}
// delivered stock is the only thing that funds towers
{const _d=scDeliver;scDeliver=function(c){const n=c&&c.load|0;if(n>0){if(c.kind==='wood')G.rtW=(G.rtW||0)+n;else G.rtS=(G.rtS||0)+n;G.rtDelivered=(G.rtDelivered||0)+n;}return _d.apply(this,arguments);};}
function rtCanPay(){const[w,s]=RT.cost;return(G.rtW||0)>=w&&(G.rtS||0)>=s&&G.wood>=w&&G.stone>=s;}
function rtPay(){const[w,s]=RT.cost;G.rtW-=w;G.rtS-=s;G.wood-=w;G.stone-=s;G.rtSpent=(G.rtSpent||0)+w+s;}
function rtAdd(p,state){const s=kAdd('wtower',p.x,p.y,-1,{wt:p.i,rt:1});s.state=state||'ok';s.build=state==='building'?0:1;s.hasGold=true;
  for(const t of trees)if(t.state==='ok'&&d2(t.x,t.y,p.x,p.y)<55){t.state='gone';t.hp=0;}return s;}
function rtStartBuild(s,why){rtPay();s.state='building';s.build=0;s.hp=s.maxHp;s.fire=0;G.rtBuilds=(G.rtBuilds||0)+1;
  if(dist(s,D)<1400)float(s.x,s.y-90,why==='re'?'Masons rebuild the watchtower':'Masons start a watchtower','#e8d0a0');}
function rtTick(dt){if(!G||G.over)return;G.rtCk=(G.rtCk||0)-dt;
  for(const s of rtTowers()){
    if(s.state==='building'){s.build=Math.min(1,s.build+dt/RT.buildT);if(s.build>=1){s.state='ok';s.hp=s.maxHp;G.rtBuilt=(G.rtBuilt||0)+1;if(dist(s,D)<1400)float(s.x,s.y-90,'Watchtower manned!','#ffe0a0');}}
    if(s.state==='ok'){const a=units.find(u=>!u.dead&&u.wtS===s);if(!a){s.archT=(s.archT||0)+dt;if(s.archT>=(s.archFirst?RT.archerWait:0)){s.archT=0;s.archFirst=1;rtArcher(s);}}}}
  if(G.rtCk>0)return;G.rtCk=RT.check;
  // rebuild a ruined tower first, else start a new one (one job at a time)
  const T=rtTowers();if(T.some(s=>s.state==='building'))return;if(!rtCanPay())return;
  const ru=T.find(s=>s.state==='wruin');if(ru){rtStartBuild(ru,'re');return;}
  if(T.length>=rtMax())return;const used=new Set(T.map(s=>s.wt));const p=rtSpots().find(q=>!used.has(q.i));if(!p)return;const s=rtAdd(p,'building');rtStartBuild(s);}
function rtArcher(s){const u=mkUnit('archer',s.x,s.y+4,{post:'tower',slot:'wt'+s.wt,px:s.x,py:s.y+4,hp:22,maxHp:22,shootT:R(1,3),wtS:s,lift:108});units.push(u);return u;}
// structure damage: a collapsed watchtower becomes rubble that only the tower builders handle; its archer climbs down
{const _h=hurtStruct;hurtStruct=function(s,d){if(s&&s.kind==='wtower'){if(s.state==='wruin')return;if(s.state==='building'){s.build=Math.max(0,s.build-d/s.maxHp);s.hp=Math.max(1,s.hp-d);if(s.build<=0){s.state='wruin';s.ruinT=G.t;}return;}}
  const r=_h.apply(this,arguments);if(s&&s.kind==='wtower'&&s.state==='ruin'){s.state='wruin';s.fire=0;G.rtLost=(G.rtLost||0)+1;for(const u of units)if(u.wtS===s&&!u.dead){u.post=null;u.wtS=null;u.lift=0;}}return r;};}
// keep struct fire/self-repair code away from rubble
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&G&&!paused&&!G.over)rtTick(dt);return r;};}
// drawing: a wooden watchtower on a stone footing (scaffolding while building, rubble when destroyed)
function drawWTower(s){const x=s.x,y=s.y;
  if(s.state==='wruin'){rubble(x,y+4,30,0,(s.wt*977)|0);return;}
  const b=s.state==='building'?s.build:1,H=88*Math.max(.15,b);
  ell(x+8,y+6,28,10,'rgba(0,0,0,.25)');
  rect(x-20,y-12,40,16,'#8b8478');rect(x-20,y-12,40,3,'#a59d90');
  ctx.strokeStyle='#6b4a2a';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-15,y-10);ctx.lineTo(x-11,y-10-H);ctx.moveTo(x+15,y-10);ctx.lineTo(x+11,y-10-H);ctx.stroke();
  ctx.lineWidth=2;ctx.strokeStyle='#7d5a36';for(let k=1;k<4;k++){const yy=y-10-H*k/4;if(k/4>b+.01)break;ctx.beginPath();ctx.moveTo(x-14,yy+H/8);ctx.lineTo(x+13,yy-H/8);ctx.moveTo(x+14,yy+H/8);ctx.lineTo(x-13,yy-H/8);ctx.stroke();}
  if(b>=1){rect(x-20,y-104,40,10,'#8a643c');rect(x-20,y-104,40,3,'#a87c4c');for(let k=0;k<5;k++)rect(x-20+k*9,y-112,5,8,'#7d5a36');
    poly([x-22,y-112,x,y-134,x+22,y-112],'#a8402c');poly([x,y-134,x+22,y-112,x+8,y-112],'#8a3020');
    rect(x-1,y-150,2,18,'#5a4030');poly([x+1,y-150,x+16,y-145,x+1,y-140],'#d4b030');}
  else{ctx.strokeStyle='rgba(200,170,110,.9)';ctx.lineWidth=1.5;ctx.strokeRect(x-22,y-12-H,44,H);rect(x-25,y+12,50,4,'#333');rect(x-25,y+12,50*b,4,'#7fd07f');}
  if(s.fire>0)for(let i=0;i<3;i++)ell(x+R(-12,12),y-20-R(0,H),4,7,'rgba(255,150,40,.8)');
  if(s.state==='ok'&&s.hp<s.maxHp){rect(x-22,y+12,44,4,'#400');rect(x-22,y+12,44*s.hp/s.maxHp,4,'#d33');}}
{const _k=drawStructK;drawStructK=function(s){if(s.kind==='wtower'){drawWTower(s);return true;}return _k.apply(this,arguments);};}
// archers on a tower are drawn up on its platform
{const _da=drawPerson;drawPerson=function(u){if(u.lift&&u.wtS&&u.wtS.state==='ok'){ctx.save();ctx.translate(0,-u.lift);G.rtDrawnA=(G.rtDrawnA||0)+1;const r=_da.apply(this,arguments);ctx.restore();return r;}return _da.apply(this,arguments);};}
// pause menu line
function pauseExtraLine(){if(!G)return'';const n=rtTowers().filter(s=>s.state!=='wruin').length;return `Towers ${n}/${rtMax()}`;}
// save / load
{const _ss=svSnapshot;svSnapshot=function(){G.rtSave=rtTowers().map(s=>[s.wt,s.state,Math.round(s.hp),+(s.build||0).toFixed(3)].join(',')).join(';');return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(){for(let i=structures.length-1;i>=0;i--)if(structures[i].kind==='wtower')structures.splice(i,1);for(const u of units)if(u.wtS)u.dead=true;
  const r=_sa.apply(this,arguments);for(let i=structures.length-1;i>=0;i--)if(structures[i].kind==='wtower')structures.splice(i,1);
  if(typeof G.rtSave==='string'&&G.rtSave){const S=rtSpots();for(const q of G.rtSave.split(';')){const[w0,st,h0,b0]=q.split(','),wt=+w0,hp=+h0,b=+b0;const p=S[wt];if(!p)continue;const s=rtAdd(p,st);s.hp=hp;s.build=b;}}return r;};}
