
// ================= partK: kingdom concern, multi-bite helpers, building gold, markets, soldiers vs water =================
// ---------- kingdom concern: damage near Castle Aldric alarms the kingdom far more than mischief at the edges of the world ----------
function kingdomMul(x,y){const dx=x-CASTLE.x,dy=y-CASTLE.y;const d=Math.hypot(dx,dy);
  if(x>CWALL.x0-120&&x<CWALL.x1+120&&y>CWALL.y0-120&&y<CWALL.y1+160)return 2;            // castle grounds
  return clamp(.2+1.8*Math.exp(-Math.pow(d/2200,1.6)),.2,2);}
function concern(){const k=kingdomMul(D.x,D.y);return k>=1.2?{name:'HIGH',k,col:'#ff9a7a'}:k>=.6?{name:'Med',k,col:'#ffe08a'}:{name:'Low',k,col:'#9fe0a0'};}
function coolMul(){return clamp(1/kingdomMul(D.x,D.y),.5,3);}          // ~0.5x next to the castle up to 3x at the far edges
function coolDelay(){return clamp(1+2.5*kingdomMul(D.x,D.y),1.5,6);}     // and cooling starts sooner when you're far away
function giveUpT(){return clamp(2+5*kingdomMul(D.x,D.y),3,12);}         // chasers lose interest sooner far from the castle          // the meter cools faster when the dragon is far away
function waveNear(){return clamp(.55+.35*kingdomMul(D.x,D.y),.62,1.25);} // waves are bigger when you threaten the castle
function musterNear(){return clamp(1.3-.25*kingdomMul(D.x,D.y),.8,1.25);} // and the knights ride out faster
// ---------- wild vs farm animals (only livestock and people bother the kingdom) ----------
const LIVESTOCK=new Set(['cow','pig','sheep','chicken','horse']);
function isWild(u){return u.type==='sea'?!['sailor','pirate','islander'].includes(u.kind):u.type==='animal'&&!LIVESTOCK.has(u.species)&&!u.carav;}
// ---------- soldiers vs water ----------
function isSoldier(u){return u.militia||u.type==='knight'||u.type==='archer'||u.type==='crew'||u.kind==='scorpion'||u.kind==='catapult';}
const soldierWet=(x,y)=>(inSea(x,y)||inLake(x,y)||riverD(x,y)<RIVW-6)&&!onBridge(x,y);
// the target is out in the water: walk to the shore, then wait there (pacing a little) instead of wading in
function shoreHold(u,tx,ty,sp,dt){const a=Math.atan2(ty-u.y,tx-u.x),look=34;
  if(!soldierWet(u.x+Math.cos(a)*look,u.y+Math.sin(a)*look))return false; // still dry ahead: keep walking normally
  u.face=tx>u.x?1:-1;u.shore=G.t;u.pace=(u.pace||0)+dt;const p=Math.sin(u.pace*.8+((u.id*50)|0))*.5;
  const px=u.x-Math.sin(a)*sp*.25*p*dt,py=u.y+Math.cos(a)*sp*.25*p*dt;if(!soldierWet(px,py)&&!soldierWet(px+Math.cos(a)*20,py+Math.sin(a)*20)){u.x=px;u.y=py;}
  if(u.type!=='crew'&&(!u.shoreMsg||G.t-u.shoreMsg>14)&&Math.random()<.02&&dist(u,D)<700){u.shoreMsg=G.t;float(u.x,u.y-40,['Come out and fight, coward!','We can\'t swim in this armour!','Wait for it on the beach!','Somebody fetch a boat!'][RI(0,3)],'#ffe0a0');}
  return true;}
function dryNear(x,y){for(let r=16;r<=480;r+=16)for(let k=0;k<16;k++){const a=k/16*TAU,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(!soldierWet(px,py)&&!soldierWet(px+12,py)&&!soldierWet(px-12,py))return{x:px,y:py};}return null;}
// knocked into the water (stomp, landing blast, lance recoil): flounder, then get hauled back to the bank, or bob away cartoon-style
function soldierSwim(u,dt){if(!isSoldier(u)||!soldierWet(u.x,u.y)){u.flT=0;return false;}
  if(!u.flT){u.flT=1.3;u.flounder=1;puff(u.x,u.y,10,'rgba(220,240,255,',90,6);if(typeof SFX!=='undefined')SFX.play('splash',u.x,u.y,.7);if(dist(u,D)<800)float(u.x,u.y-34,['Glub! Can\'t swim!','Help! My armour!','Blub blub!'][RI(0,2)],'#bfe6ff');}
  u.flT-=dt;u.anim+=dt*14;u.face=Math.sin(G.t*9)>0?1:-1;
  if(u.flT<=0){u.flT=0;u.flounder=0;const p=dryNear(u.x,u.y);
    if(p){u.x=p.x;u.y=p.y;puff(p.x,p.y,8,'rgba(220,240,255,',60,5);if(dist(u,D)<800)float(p.x,p.y-34,'*cough* ...made it!','#cfe8ff');if(u.mounted)u.cs='wheel';}
    else{u.dead=true;u.gone=true;float(u.x,u.y-34,'...and bobs away downstream!','#bfe6ff');}}
  return true;}
function siegeSwim(g){if(!soldierWet(g.x,g.y))return false;const p=dryNear(g.x,g.y);if(p){g.x=p.x;g.y=p.y;}return true;}
function drawFlounder(u){const x=u.x,y=u.y,b=Math.sin(G.t*10+u.x)*2.5;
  for(let i=0;i<3;i++){const r=(G.t*30+i*9)%26+6;ctx.strokeStyle=`rgba(230,245,255,${.6-r/50})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y,r,r*.4,0,0,TAU);ctx.stroke();}
  ctx.fillStyle=u.type==='archer'?'#4f7a3a':'#8e96a0';ctx.beginPath();ctx.arc(x,y-6+b,6,Math.PI,0);ctx.fill();            // helmet / hood bobbing
  ctx.fillStyle='#f0c8a0';ctx.fillRect(x-4,y-6+b,8,4);
  ctx.strokeStyle='#8e96a0';ctx.lineWidth=2.4;const w=Math.sin(G.t*16)*6;ctx.beginPath();ctx.moveTo(x-6,y-3+b);ctx.lineTo(x-12,y-14+w);ctx.moveTo(x+6,y-3+b);ctx.lineTo(x+12,y-14-w);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<3;i++)ctx.fillRect(x+Math.sin(G.t*7+i*2)*14,y-2-((G.t*40+i*7)%10),2,2);}
// ---------- mountain lions: rare, solitary, stalk goats, crouch-and-pounce on a grounded dragon, then slink away ----------
function updCougar(u,dt,dd,ox,oy){const F=FAUNA.cougar,Z=ZONES[u.zone];u.cd=(u.cd||0);u.crouch=0;
  const back=()=>{if(!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;u.tgt=null;}const H=u.home;u.x=clamp(u.x,H.x-220,H.x+H.w+220);u.y=clamp(u.y,H.y-220,H.y+H.h+220);};
  if(u.burn>0){u.state='retreat';u.t2=3;}
  if(u.state==='pounce'){u.t2-=dt;u.x+=u.vx*dt;u.y+=u.vy*dt;u.anim+=dt*16;u.leap=.3;
    const T=u.prey;if(T&&T!==D&&!T.dead&&dist(u,T)<26){T.dead=true;T.gone=true;u.state='feed';u.t2=6;puff(T.x,T.y,6,'rgba(240,240,240,',50,4);if(dist(u,D)<900)float(u.x,u.y-30,'The mountain lion catches a goat!','#ffe0a0');}
    else if(T===D&&!u.hit&&dist(u,D)<46&&D.alt<.35){u.hit=true;hurtDragon(F.bite,'cougar');float(D.x+R(-20,20),D.y-90,F.say,'#ffb0a0');if(typeof SFX!=='undefined')SFX.play('growl',u.x,u.y,.9);}
    if(u.t2<=0){u.state=T===D?'retreat':'prowl';u.t2=T===D?R(2.5,3.5):1;u.cd=F.cd+2;}back();return true;}
  if(u.state==='feed'){u.t2-=dt;u.anim+=dt*2;if(u.t2<=0||dd<160)u.state='prowl';return true;}
  if(u.state==='retreat'){u.t2-=dt;const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*1.2,dt);if(u.t2<=0)u.state='prowl';back();return true;}
  u.cd-=dt;const low=D.alt<.4&&!G.over&&!G.won;
  // the dragon on the ground: crouch, creep in, then POUNCE
  if(low&&dd<F.aggro&&u.cd<=0){if(u.state!=='stalkD'){u.state='stalkD';u.t2=R(.7,1.1);if(!u.growl||G.t-u.growl>8){u.growl=G.t;float(u.x,u.y-26,'*low growl*','#ffd0a0');}}
    u.crouch=1;u.face=D.x>u.x?1:-1;u.t2-=dt;if(dd>90)moveTo(u,D.x,D.y,F.sp*.35,dt);
    if(u.t2<=0){const a=Math.atan2(D.y-u.y,D.x-u.x),sp=Math.min(380,dd/.32);u.vx=Math.cos(a)*sp;u.vy=Math.sin(a)*sp;u.state='pounce';u.t2=.36;u.prey=D;u.hit=false;float(u.x,u.y-30,'POUNCE!','#ffb070');}
    back();return true;}
  if(u.state==='stalkD')u.state='prowl';
  if(!low&&dd<170){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,F.sp*.9,dt);back();return true;} // can't reach a flying dragon: slinks off
  // hunt mountain goats
  if(!u.prey||u.prey.dead||u.prey===D||dist(u,u.prey)>520){u.prey=null;if(Math.random()<dt*.5){let b=null,bd=520;for(const g of units)if(!g.dead&&(g.species==='mgoat'||g.species==='goat')){const q=dist(u,g);if(q<bd){bd=q;b=g;}}u.prey=b;}}
  if(u.prey){const g=u.prey,q=dist(u,g);u.state='stalk';u.crouch=q<260?1:0;u.face=g.x>u.x?1:-1;
    if(q>95)moveTo(u,g.x,g.y,F.sp*(q<260?.3:.55),dt);
    else{const a=Math.atan2(g.y-u.y,g.x-u.x);u.vx=Math.cos(a)*330;u.vy=Math.sin(a)*330;u.state='pounce';u.t2=.38;u.hit=false;g.leap=.55;}
    back();return true;}
  u.state='prowl';if(!u.tgt||u.t<=0){u.t=R(3,7);const H=u.home;u.tgt={x:H.x+R(0,H.w),y:H.y+R(0,H.h)};}
  if(moveTo(u,u.tgt.x,u.tgt.y,F.sp*.3,dt))u.tgt=null;back();return true;}
function drawCougar(u){const x=u.x,f=u.face||1,cr=u.crouch?1:0,lp=u.state==='pounce'?Math.sin((.36-Math.max(0,u.t2))/.36*Math.PI)*16:0,y=u.y-lp,g=Math.sin(u.anim)*(u.state==='feed'?0:1),bd=cr?-6:-10;
  ell(u.x,u.y+1,18,5,'rgba(0,0,0,.22)');const fur='#c9955a',dk='#9a6a38';
  // tail: long with a dark tip, flicks while stalking
  ctx.strokeStyle=fur;ctx.lineWidth=3.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-f*13,y+bd);ctx.quadraticCurveTo(x-f*26,y+bd+4+Math.sin(G.t*(cr?9:3))*4,x-f*30,y+bd-8);ctx.stroke();ell(x-f*30,y+bd-8,2.6,2.6,'#4a2e18');
  for(const lx of[-9,-5,6,10]){const sw=u.state==='pounce'?(lx>0?6:-6)*f:Math.sin(u.anim+lx)*2.5;line(x+lx*f,y+bd+3,x+lx*f+sw,y+1-(cr?1:0),dk,2.6);}
  ell(x,y+bd,15,cr?5:6,fur);ell(x+f*2,y+bd+2.5,10,2.5,'#ead2a8');// belly
  const hx=x+f*15,hy=y+bd-(cr?0:4)+(u.state==='feed'?6:0);ell(hx,hy,6,5,fur);ell(hx+f*4,hy+1.5,3.5,2.6,'#ead2a8');
  poly([hx-3*f,hy-3,hx-1*f,hy-8,hx+1*f,hy-3],dk);poly([hx+1*f,hy-3,hx+3*f,hy-8,hx+4*f,hy-2],dk);
  ell(hx+f*2.5,hy-1,1.3,cr?.6:1.3,cr?'#ffd040':'#222');ell(hx+f*7,hy+1,1.2,1,'#3a2418');
  if(u.state==='pounce'&&u.prey===D){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(hx+f*8,hy-6+i*4);ctx.lineTo(hx+f*14,hy-2+i*4);ctx.stroke();}}
  if(u.burn>0)for(let i=0;i<3;i++)ell(x+R(-10,10),y+bd-8-R(0,8),3,5,'rgba(255,150,40,.8)');}
// =================== EVERYTHING IS DESTRUCTIBLE: castle sections, lighthouse, dock, mine & camp buildings, markets, coins ===================
// name, hp, stone?, rebuild cost [wood,stone], gold dropped [min,max], points, alarm, self-repairing (own workers), footprint size
const KDEF={
  cwall:{name:'Castle wall',hp:300,stone:1,cost:[0,3],gold:[2,4],pts:120,alarm:8,self:1,sz:40},
  ctower:{name:'Castle tower',hp:420,stone:1,cost:[1,5],gold:[3,6],pts:180,alarm:10,self:1,sz:34},
  keep:{name:'The great keep',hp:900,stone:1,cost:[4,9],gold:[10,16],pts:500,alarm:18,self:1,sz:70},
  ptower:{name:"Princess Elizabeth's tower",hp:380,stone:1,cost:[1,5],gold:[3,5],pts:200,alarm:10,self:1,sz:26},
  lighthouse:{name:'The lighthouse',hp:360,stone:1,cost:[3,5],gold:[3,5],pts:220,alarm:2,self:1,sz:30},
  dock:{name:'The dock',hp:90,cost:[3,0],gold:[1,2],pts:60,alarm:1,self:1,sz:50},
  minehut:{name:"Miners' bunkhouse",hp:110,cost:[3,1],gold:[2,4],pts:90,alarm:6,sz:34},
  minehead:{name:'Mine headframe',hp:100,cost:[3,0],gold:[1,3],pts:80,alarm:6,sz:30},
  sawmill:{name:'Sawmill',hp:110,cost:[3,1],gold:[2,4],pts:90,alarm:6,sz:36},
  camptent:{name:"Woodcutters' tent",hp:50,cost:[1,0],gold:[1,2],pts:40,alarm:3,sz:28},
  stall:{name:'Market stall',hp:34,cost:[1,0],gold:[2,4],pts:40,alarm:5,sz:24},
  fishmonger:{name:'Fishmonger',hp:60,cost:[2,0],gold:[4,6],pts:70,alarm:7,sz:28},
  bakery:{name:'Bakery',hp:85,cost:[3,1],gold:[4,7],pts:90,alarm:8,sz:30},
  smithy:{name:'Blacksmith',hp:120,cost:[3,2],gold:[5,8],pts:110,alarm:9,sz:32},
  jeweler:{name:'Jeweler',hp:100,cost:[3,2],gold:[14,22],pts:160,alarm:14,sz:30},
  storehouse:{name:'Castle storehouse',hp:260,cost:[3,3],gold:[2,4],pts:160,alarm:9,sz:44},
  adobe:{name:'Adobe house',hp:110,cost:[1,2],gold:[1,3],pts:50,alarm:5,sz:28}};
const GOLD_OLD={hut:[1,3],barn:[3,5],cabin:[2,3],barracks:[6,9],gate:[4,6],bridge:[1,2],logpile:[0,0],stonepile:[0,0]};
for(const k in KDEF){COST[k]=KDEF[k].cost;STRUCT_NAME[k]=KDEF[k].name;}
const MARKET_KINDS=new Set(['stall','fishmonger','bakery','smithy','jeweler']),CASTLE_KINDS=new Set(['cwall','ctower','keep','ptower']);
const _stoneish0=stoneish;
function isStone(s){return !!(KDEF[s.kind]&&KDEF[s.kind].stone);}
let coins=[],MARKETS=[];
function kAdd(kind,x,y,v,o){const s=addStruct(kind,x,y,v);s.hp=s.maxHp=KDEF[kind].hp;Object.assign(s,o||{});return s;}
function placeDry(x,y,ax,ay){const b={x:x-30,y:y-30};inlandBox(b,60,60,ax,ay);return{x:b.x+30,y:b.y+30};}
function initStructsK(){coins=[];const W=CWALL;
  // castle in sections: walls, 4 corner towers, the keep and the princess's tower (the gate and barracks already exist)
  for(const x of[1400,1500,1600,1700,1800].map(x=>x+CDX))kAdd('cwall',x,W.y0,-1,{side:'n'});
  for(const x of[1400,1490,1710,1800].map(x=>x+CDX))kAdd('cwall',x,W.y1,-1,{side:'s'});
  for(const y of[135,200,260].map(y=>y+CDY)){kAdd('cwall',W.x0,y,-1,{side:'w'});kAdd('cwall',W.x1,y,-1,{side:'e'});}
  [[W.x0,W.y0],[W.x1,W.y0],[W.x0,W.y1],[W.x1,W.y1]].forEach(([x,y],i)=>kAdd('ctower',x,y+8,-1,{ti:i}));
  kAdd('keep',KEEP_POS.x,KEEP_POS.y,-1);kAdd('kroof',KEEP_POS.x,KEEP_POS.y-2,-1);kAdd('ptower',PRINCESS_TOWER.x,PRINCESS_TOWER.y+30,-1); // the pink tower is only decoration now
  // the lighthouse and its dock (repaired by the keeper)
  kAdd('lighthouse',LH.x,LH.y,-1);kAdd('dock',DOCK.x,DOCK.y,-1);
  // mine & logging camp buildings
  kAdd('minehead',MINE.x,MINE.y+14,-1);kAdd('minehut',MINE.x-120,MINE.y+60,-1);kAdd('camptent',CAMP.x,CAMP.y+10,-1);kAdd('sawmill',CAMP.x-100,CAMP.y+60,-1);
  // markets: a big one outside the castle gate and smaller ones in the larger villages
  MARKETS=[{name:'Castle Market',x:GATE.x+290,y:GATE.y+120,v:8,shops:['jeweler','smithy','bakery','stall','stall','stall']},
    {name:'Millbrook Market',x:VILLAGES[5].x+10,y:VILLAGES[5].y+210,v:5,shops:['bakery','smithy','stall','stall']},
    {name:'Riverbend Market',x:VILLAGES[6].x-40,y:VILLAGES[6].y-215,v:6,shops:['smithy','jeweler','stall','stall']},
    {name:'Stonebrook Market',x:VILLAGES[9].x,y:VILLAGES[9].y+210,v:9,shops:['smithy','bakery','stall']},
    {name:'Saltmere Fish Market',x:VILLAGES[10].x-30,y:VILLAGES[10].y+210,v:10,shops:['fishmonger','jeweler','stall','stall']},
    {name:'Crabhaven Market',x:VILLAGES[11].x,y:VILLAGES[11].y-215,v:11,shops:['fishmonger','bakery','stall']}];
  if(typeof DESERT!=='undefined')MARKETS.push({name:'Sandhaven Bazaar',x:DTOWN.x+20,y:DTOWN.y+200,v:DTOWN.vi,shops:['jeweler','stall','stall','stall','bakery'],desert:1});
  const slots=[[-95,-10],[95,-10],[0,-40],[-55,55],[55,55],[0,95],[-120,70],[120,70]];
  for(const M of MARKETS){const c=placeDry(M.x,M.y,VILLAGES[M.v]?VILLAGES[M.v].x:M.x,VILLAGES[M.v]?VILLAGES[M.v].y:M.y);M.x=c.x;M.y=c.y;
    M.shops.forEach((k,i)=>{const[dx,dy]=slots[i];const p=placeDry(c.x+dx,c.y+dy,c.x,c.y);const s=kAdd(k,p.x,p.y,M.v,{market:M.name,hue:(i*67+M.x)%360});});
    for(const t of trees)if(t.state==='ok'&&d2(t.x,t.y,c.x,c.y)<190){t.state='gone';t.hp=0;}
    // merchants and shoppers mill about
    for(let i=0;i<5;i++){spawnVillager(c.x+R(-80,80),c.y+R(-50,80),'peasant',M.v);const u=units[units.length-1];u.home={x:c.x,y:c.y+20};u.shopper=true;u.shirt=['#c0392b','#2e86c1','#d4ac0d','#7d3c98','#239b56'][i];}}
  // castle masons who repair the walls
  for(let i=0;i<3;i++){spawnVillager(CASTLE.x+R(-120,120),CASTLE.y+40,'peasant',8);const u=units[units.length-1];u.home={x:CASTLE.x,y:CASTLE.y+40};u.mason=true;}
  for(const s of structures){s.hasGold=true;if(s.kind==='hut'&&s.v===DTOWN.vi)s.adobe=true;}
  placeWells();initFlora();}
function goldOf(s){const g=KDEF[s.kind]?KDEF[s.kind].gold:GOLD_OLD[s.kind]||[1,2];return RI(g[0],g[1]);}
function dropCoins(x,y,n){for(let i=0;i<n;i++){const a=R(0,TAU),r=R(10,55);coins.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r*.7,z:R(20,40),vz:R(60,140),t:0,ph:R(0,6)});}}
// called by hurtStruct the moment any structure collapses
function onRuin(s){const K=KDEF[s.kind],st=isStone(s)||(s.kind==='bridge'&&s.mat==='stone');s.ruinT=G.t;s.weak=0;
  puff(s.x,s.y-10,st?34:22,st?'rgba(190,178,160,':'rgba(150,130,110,',st?170:130,st?18:14);if(st)puff(s.x,s.y,14,'rgba(120,120,126,',220,5,3);
  G.shake=Math.max(G.shake,st?10:6);if(typeof SFX!=='undefined')SFX.play(st?'crashStone':'crashWood',s.x,s.y,1);
  if(s.hasGold){const n=goldOf(s);if(n>0){dropCoins(s.x,s.y+10,n);float(s.x,s.y-70,`${n} gold coin${n>1?'s':''} spill out!`,'#ffd84a');}s.hasGold=false;}s.refillT=60;
  if(K){G.stats.kPts=(G.stats.kPts||0)+K.pts;G.stats.wrecked=(G.stats.wrecked||0)+1;if(MARKET_KINDS.has(s.kind))G.stats.shops=(G.stats.shops||0)+1;if(CASTLE_KINDS.has(s.kind))G.stats.castle=(G.stats.castle||0)+1;
    addAlarm(K.alarm,s.x,s.y);float(s.x,s.y-48,`${K.name} ${st?'collapses into rubble':'is wrecked'}! +${K.pts}`,'#ffb050');
    if(s.kind==='lighthouse')float(LH.x,LH.y-90,'The beacon is out! (the island is still a fine place to rest)','#ffd27a');}}
function stoneFire(s,dt){if(s.kind==='well'||s.kind==='fountain')return;s.weak=3;if(s.kind==='kroof'){if(s.hp>s.maxHp*.5)s.hp-=DR.fireDps*.012*dt;return;} // the keep roof barely notices fire
  if(s.hp>s.maxHp*.35)s.hp-=DR.fireDps*.06*dt;}
// coins, gold refills, self-repair of the castle/lighthouse/dock, stone weakening decay
function updK(dt){
  for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.t+=dt;if(c.z>0||c.vz>0){c.vz-=420*dt;c.z=Math.max(0,c.z+c.vz*dt);if(c.z===0&&c.vz<0)c.vz=c.vz<-60?-c.vz*.35:0;}
    if(c.t>.4&&D.alt<.55&&d2(c.x,c.y,D.x,D.y)<58){coins.splice(i,1);D.gold++;G.stats.coins=(G.stats.coins||0)+1;G.stats.coinPts=(G.stats.coinPts||0)+3;if(typeof SFX!=='undefined')SFX.play('coin',c.x,c.y,.6);if(Math.random()<.5)float(c.x,c.y-20,'+1 gold','#ffe070');}
    else if(c.t>240)coins.splice(i,1);}
  for(const s of structures){if(s.weak>0)s.weak-=dt;
    if(s.state==='ok'&&!s.hasGold){s.refillT=(s.refillT===undefined?60:s.refillT)-dt;if(s.refillT<=0){s.hasGold=true;s.refillT=undefined;}}
    const K=KDEF[s.kind];if(!K||!K.self)continue;
    if(s.state==='ruin'&&!s.builder&&G.t-(s.ruinT||0)>35&&dist(s,D)>500){s.state='building';s.build=0;s.selfB=true;}
    if(s.state==='building'&&s.selfB){if(dist(s,D)<260)continue;s.build+=dt/30*treasRepair();if(Math.random()<dt*2)puff(s.x+R(-20,20),s.y,1,'rgba(200,200,200,',30,5);
      if(s.build>=1){s.state='ok';s.hp=s.maxHp;s.build=0;s.selfB=false;s.paid=false;}}}}
function kUp(kind,pred){const s=structures.find(s=>s.kind===kind&&(!pred||pred(s)));return !s||s.state==='ok';}
function kS(kind,pred){return structures.find(s=>s.kind===kind&&(!pred||pred(s)));}
function drawCoins(){for(const c of coins){const sp=Math.cos(G.t*6+c.ph);ell(c.x,c.y+1,5,2,'rgba(0,0,0,.25)');ell(c.x,c.y-3-c.z,4.5*Math.abs(sp)+1,4.5,sp>0?'#ffd84a':'#e0a820');if(Math.sin(G.t*4+c.ph)>.9)ell(c.x+1,c.y-5-c.z,1.4,1.4,'#fff');}}
// ---------- damage stages for every structure: cracks at 2/3, heavy cracks and smoke at 1/3 ----------
function drawDamage(s){if(s.state!=='ok'||s.hp>=s.maxHp*.66)return;const K=KDEF[s.kind],sz=K?K.sz:s.kind==='barn'?40:s.kind==='barracks'?46:28,st=isStone(s)||s.kind==='bridge'&&s.mat==='stone',h=hsh01(s),heavy=s.hp<s.maxHp*.33;
  const top=CASTLE_KINDS.has(s.kind)&&s.kind!=='cwall'?(s.kind==='keep'?60:s.kind==='ptower'?80:40):s.kind==='lighthouse'?90:20;
  ctx.strokeStyle=st?'rgba(30,28,26,.85)':'rgba(25,12,4,.8)';ctx.lineWidth=st?1.6:2;
  for(let k=0;k<(heavy?5:2);k++){let x=s.x+(hsh01({id:h+k})-.5)*sz*1.4,y=s.y-6-hsh01({id:h*3+k})*top;ctx.beginPath();ctx.moveTo(x,y);for(let j=0;j<4;j++){x+=(j%2?5:-4)+(hsh01({id:h+k*7+j})-.5)*6;y+=6;ctx.lineTo(x,y);}ctx.stroke();}
  if(!st)for(let k=0;k<(heavy?4:2);k++)ell(s.x+(hsh01({id:h+k*5})-.5)*sz*1.3,s.y-8-hsh01({id:h+k*9})*top,5,3,'rgba(20,10,5,.55)');
  if(heavy){for(let k=0;k<2;k++){const ph=(G.t*.4+k*.5)%1;ell(s.x+(k?8:-6)+Math.sin(G.t+k)*4,s.y-top-10-ph*40,6+ph*12,6+ph*10,`rgba(${st?'150,145,140':'70,60,55'},${.35*(1-ph)})`);}}
  if(s.weak>0&&st){ctx.fillStyle=`rgba(255,110,30,${.15+.1*Math.sin(G.t*9)})`;ctx.beginPath();ctx.ellipse(s.x,s.y-top/2,sz,top/2+10,0,0,TAU);ctx.fill();}}
function rubble(x,y,w,st,seed){for(let i=0;i<Math.max(6,w/4);i++){const a=hsh01({id:seed+i}),b=hsh01({id:seed*2+i});const rx=x+(a-.5)*w*1.6,ry=y-b*w*.3,r=3+((a*b*97)%1)*w*.18;ell(rx,ry,r,r*.7,st?(i%3?'#8a8a90':'#6a6a70'):(i%3?'#3a2a1a':'#24180e'));}}
function scaffold(x,y,w,h,b){const H=h*b;rect(x-w/2,y-H,w,H,'rgba(150,140,120,.85)');ctx.strokeStyle='#7a5a30';ctx.lineWidth=2;for(let i=-1;i<=1;i++)line(x+i*w/2,y,x+i*w/2,y-h,'#7a5a30',2);for(let j=1;j<4;j++)line(x-w/2-4,y-j*h/4,x+w/2+4,y-j*h/4,'#7a5a30',1.5);}
// draw a structure kind added by this module (returns true when handled)
function drawStructK(s){if(s.kind==='kroof')return true; // drawn as part of the keep
  if(s.kind==='well'){drawWell(s);return true;}if(s.kind==='fountain'){drawFountain(s);return true;}if(s.adobe&&s.state==='ok'&&s.kind==='hut'){s.kind='adobe';let r;try{r=drawStructK(s);}finally{s.kind='hut';}return r;}const K=KDEF[s.kind];if(!K)return false;const x=s.x,y=s.y,F=s.fire,st=K.stone;
  if(s.state==='ruin'){if(s.kind==='cwall'){const hz=s.side==='n'||s.side==='s';rect(x-(hz?52:14),y-(hz?14:34),hz?104:28,hz?22:68,'#6f7458');}
    rubble(x,y+4,K.sz*(CASTLE_KINDS.has(s.kind)?1.2:1),st,(s.id*1e4)|0);if(G.t-(s.ruinT||0)<4&&Math.random()<.3)puff(x+R(-20,20),y,1,'rgba(190,178,160,',30,8);
    if(s.kind==='ptower'&&PR.state==='tower'){drawPrincess(x,y-10,true);if(Math.sin(G.t*1.3)>.3)txt('My tower! You brute!',x,y-40,11,'#fff','center');}return true;}
  if(s.state==='building'){scaffold(x,y,K.sz*1.6,CASTLE_KINDS.has(s.kind)||s.kind==='lighthouse'?70:40,s.build);if(s.kind==='ptower'&&PR.state==='tower')drawPrincess(x,y-10,true);return true;}
  if(CASTLE_KINDS.has(s.kind)||s.kind==='lighthouse'||s.kind==='dock'||s.kind==='camptent'||s.kind==='minehead'){drawDamage(s);return true;} // drawn by the castle / decor art
  if(F)for(let i=0;i<3;i++)ell(x+R(-K.sz*.6,K.sz*.6),y-20-R(0,16),R(5,9),R(8,13),`rgba(255,${RI(120,200)},40,.75)`);
  const hue=s.hue||0,awn=`hsl(${hue},70%,52%)`,awn2='#f4ecd8';
  if(s.kind==='stall'||s.kind==='fishmonger'){softShadowSafe(x+6,y+2,30,9);rect(x-24,y-14,48,16,F?'#4a2e14':'#8a5a2a');rect(x-24,y-16,48,3,'#6a4020');
    const c1=s.kind==='fishmonger'?'#2e78b8':awn;for(let i=0;i<6;i++)poly([x-28+i*9.4,y-38,x-28+(i+1)*9.4,y-38,x-28+(i+1)*9.4,y-30,x-28+i*9.4,y-30],F?'#3a2a1a':i%2?c1:awn2);
    line(x-26,y-30,x-26,y,'#5a3a1a',2);line(x+26,y-30,x+26,y,'#5a3a1a',2);
    if(s.kind==='fishmonger')for(let i=0;i<4;i++){ell(x-15+i*10,y-18,4.5,2,'#a8c8d8');poly([x-11+i*10,y-18,x-8+i*10,y-21,x-8+i*10,y-15],'#88a8b8');}
    else for(let i=0;i<5;i++)ell(x-18+i*9,y-18,3.2,3,['#e74c3c','#f39c12','#f1c40f','#27ae60','#c0392b'][(i+hue)%5]);}
  else{const O={smithy:{w:54,wall:'#9a948a',roof:'#5a4a44',sign:'⚒'},bakery:{w:50,wall:'#e8d0a0',roof:'#b0603a',sign:'🥖'},jeweler:{w:48,wall:'#c8b8d8',roof:'#5a3a7a',sign:'💎'},
      minehut:{w:56,wall:'#8a6a44',roof:'#5a4a3a'},sawmill:{w:62,wall:'#a07848',roof:'#6a5232'},adobe:{w:50,wall:'#d8a868',roof:'#c08850'},storehouse:{w:76,wall:'#a8865a',roof:'#7a3a2a',sign:'📦'}}[s.kind]||{w:46,wall:'#aaa',roof:'#666'};
    const w=O.w,H=s.kind==='adobe'?28:26;softShadowSafe(x+8,y+2,w*.6,10);rect(x-w/2,y-H,w,H+2,F?'#5a3a1a':O.wall);
    if(s.kind==='adobe'){rect(x-w/2-2,y-H-6,w+4,7,F?'#3a2a1a':O.roof);for(const dx of[-16,0,16])rect(x+dx-2,y-H-3,4,3,'#7a5030');rect(x-6,y-16,12,18,'#5a3a20');rect(x+12,y-20,7,7,'#3a2a1a');}
    else{poly([x-w/2-6,y-H,x,y-H-24,x+w/2+6,y-H],F?'#2a1a10':O.roof);rect(x-7,y-16,14,18,'#4a3020');}
    if(s.kind==='smithy'){rect(x+w/2-2,y-14,12,14,'#555');ell(x+w/2+4,y-12,4,3,`rgba(255,${120+60*Math.sin(G.t*8)|0},40,.9)`);rect(x-w/2-14,y-8,12,5,'#3a3a40');rect(x-w/2-11,y-3,6,4,'#3a3a40');if(typeof addLight==='function'&&GFX_HI)addLight(x+w/2+4,y-12,60,.6,1);}
    if(s.kind==='bakery'&&!F){const ph=(G.t*.5)%1;ell(x+w/4,y-H-30-ph*24,5+ph*8,5+ph*6,`rgba(230,230,230,${.5*(1-ph)})`);}
    if(s.kind==='sawmill'){ell(x+w/2+8,y-10,10,10,'#8a8a90');line(x+w/2+8,y-20,x+w/2+8,y,'#555',2);rect(x-w/2-20,y-4,18,6,'#9a6a3a');}
    if(O.sign){rect(x-14,y-H-8,28,12,'#3a2a18');ctx.font='10px serif';ctx.textAlign='center';ctx.fillStyle='#ffe';ctx.fillText(O.sign,x,y-H+2);}}
  if(s.kind==='jeweler'&&s.hasGold&&Math.sin(G.t*3+x)>.6)ell(x+R(-10,10),y-12,1.6,1.6,'#fff');
  drawDamage(s);return true;}
function softShadowSafe(x,y,rx,ry){if(GFX_HI&&typeof softShadow==='function')softShadow(x,y,rx,ry,.4*shadowK());else ell(x,y,rx,ry,'rgba(0,0,0,.2)');}
// =================== TAXES: collectors ride out from the castle, gather coin from every standing village and market, and fill the hoard ===================
function treasury(){return goldPiles.reduce((a,g)=>a+Math.max(0,g.amt),0);}
function treasMul(){return clamp(.85+treasury()/500,.85,1.4);}           // a rich king fields bigger waves...
function treasPatrols(){return Math.min(2,Math.floor(treasury()/180));}  // ...more patrols...
function treasRepair(){return clamp(1+treasury()/300,1,2);}              // ...and faster repairs
function taxTargets(){const T=[];VILLAGES.forEach((v,vi)=>{const n=structures.filter(s=>s.v===vi&&(s.kind==='hut'||s.kind==='adobe')&&s.state==='ok').length;if(n)T.push({x:v.x+30,y:v.y+40,amt:1+Math.ceil(n/2),name:v.name||'a village'});});
  for(const M of MARKETS){const n=structures.filter(s=>s.market===M.name&&s.state==='ok').length;if(n)T.push({x:M.x,y:M.y+40,amt:2+n*2,name:M.name});}return T;}
function taxIncome(){return taxTargets().reduce((a,t)=>a+t.amt,0);}
function spawnTaxman(){const T=taxTargets();if(!T.length)return null;T.sort(()=>Math.random()-.5);const route=T.slice(0,3);
  const u=mkUnit('villager',GATE.x,GATE.y+20,{job:'tax',tax:true,route,ri:0,sack:0,hp:10,maxHp:10,shirt:'#5a2a6a',home:{x:GATE.x,y:GATE.y+20},v:-1});units.push(u);
  const ne=G.easy?1:RI(1,2);for(let i=0;i<ne;i++){const k=mkUnit('knight',GATE.x+R(-20,20),GATE.y+10,{hp:45,maxHp:45,atk:0,colr:'#c9a227',escort:u,eo:i?-1:1,born:G.t});units.push(k);}
  G.taxmen=(G.taxmen||0)+1;return u;}
function updTax(u,dt){if(u.state==='flee'){u.t-=dt;if(u.t>0)return;u.state='walk';}
  const dd=dist(u,D);if(dd<200&&!G.over){const a=Math.atan2(u.y-D.y,u.x-D.x);moveTo(u,u.x+Math.cos(a)*40,u.y+Math.sin(a)*40,70,dt);if(!u.yelp||G.t-u.yelp>5){u.yelp=G.t;float(u.x,u.y-30,['King William\'s taxes! Begone!','Not the coin sack!','Guards! GUARDS!'][RI(0,2)],'#ffe0a0');}return;}
  const tg=u.ri<u.route.length?u.route[u.ri]:{x:GATE.x,y:GATE.y+10,home:1};
  if(u.wait>0){u.wait-=dt;u.anim+=dt*2;return;}
  if(moveTo(u,tg.x,tg.y,48,dt)||dist(u,tg)<14){if(tg.home){const p=goldPiles.reduce((a,b)=>a.amt<=b.amt?a:b);p.amt+=u.sack;G.taxIn=(G.taxIn||0)+u.sack;if(dist(u,D)<1500||G.bigMap)float(GATE.x,GATE.y-70,`Taxes collected: +${u.sack} gold for King William's treasury`,'#ffd84a');u.sack=0;u.dead=true;u.gone=true;return;}
    const got=Math.min(tg.amt,30);u.sack+=got;u.wait=2;u.ri++;if(dist(u,D)<900)float(u.x,u.y-30,`Tax! +${got} gold`,'#ffd84a');}}
function escortStep(k,dt){const c=k.escort;if(!c||c.dead){k.escort=null;return false;}const dd=dist(k,D);if(dd<260&&D.alt<.6)return false; // the escort fights when the dragon comes near
  const a=Math.atan2(c.y-k.y,c.x-k.x),tx=c.x-Math.cos(a)*22+k.eo*14,ty=c.y-Math.sin(a)*10+k.eo*10;if(dist(k,c)>30)moveTo(k,tx,ty,dist(k,c)>120?80:52,dt);k.face=c.x>k.x?1:-1;k.born=G.t;k.retreat=false;return true;}
function updTaxes(dt){G.taxT=(G.taxT===undefined?12:G.taxT)-dt;const active=units.filter(u=>u.tax&&!u.dead).length;
  if(G.taxT<=0){G.taxT=G.easy?55:40;if(active<2&&castleHealth('gate')>0||active<1)spawnTaxman();}
}
function taxSacks(){for(const u of units)if(u.tax&&u.dead&&!u.gone&&!u.sackDone){u.sackDone=true;const n=Math.min(u.sack+3,25);dropCoins(u.x,u.y,n);addAlarm(4,u.x,u.y);G.stats.taxmen=(G.stats.taxmen||0)+1;float(u.x,u.y-40,`The tax collector drops his coin sack! (${n} gold)`,'#ffd84a');}}
function drawTaxSack(u){const x=u.x+(u.face||1)*-7,y=u.y-10,s=4+Math.min(5,u.sack/5);ell(x,y,s,s+1,'#a07a40');ell(x,y-s,2.4,1.6,'#7a5a28');ctx.fillStyle='#ffe58a';ctx.font='bold 7px Georgia';ctx.textAlign='center';ctx.fillText('$',x,y+2);
  rect(u.x-5,u.y-27,10,3,'#2a1a2a');rect(u.x-3,u.y-31,6,4,'#2a1a2a');} // a tall tax-man hat
// =================== FLYING CRASH STOMP: stomp while airborne = tuck the wings, plummet, and slam the ground ===================
const CRASH={cd:2.4,st:6,r:1.6,dmg:1.6};let RINGS=[],PLANKS=[];
function isWood(s){return !stoneish(s)&&s.kind!=='gate';}
function startCrash(){if(D.crashCD>0){float(D.x,D.y-80,`Dive stomp recharging… ${D.crashCD.toFixed(1)}s`,'#ffd');return false;}
  if(D.st<CRASH.st){float(D.x,D.y-80,'Too tired for a dive stomp!','#ffb0a0');return false;}
  D.st-=CRASH.st;D.crashCD=CRASH.cd;D.diving=true;D.mode='ground';D.altT=0;D.landDust=false;D.diveFrom=D.alt;G.diveT=0;
  if(typeof SFX!=='undefined'&&SFX.play)SFX.play('whoosh',D.x,D.y,1);float(D.x,D.y-90,'DIVE STOMP!','#ffd24a');return true;}
function splinters(x,y,n){for(let i=0;i<n;i++){const a=R(0,TAU),v=R(80,260);PLANKS.push({x:x+R(-15,15),y:y+R(-10,10),z:R(4,20),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,vz:R(160,380),r:R(0,TAU),vr:R(-12,12),l:R(8,18),t:R(1.6,2.6),c:['#7a5530','#9a7040','#5a3a1a','#b08850'][RI(0,3)]});}if(PLANKS.length>400)PLANKS.splice(0,PLANKS.length-400);}
function crashStomp(){const r0=DR.stompR,d0=DR.stompDmg,R1=r0*CRASH.r;DR.stompR=R1;DR.stompDmg=d0*CRASH.dmg;
  const wood=structures.filter(s=>s.state!=='ruin'&&isWood(s)&&dist(s,D)<R1+30);
  const tx0=texts.length;try{doStomp();}finally{DR.stompR=r0;DR.stompDmg=d0;}
  HEAVY=true;for(const s of wood)if(s.state!=='ruin'){splinters(s.x,s.y,10);hurtStruct(s,(s.hp||100)+50);} // wood is smashed flat instantly
  for(const s of structures)if(s.state!=='ruin'&&stoneish(s)&&dist(s,D)<R1+30)hurtStruct(s,110);HEAVY=false; // counts as the dive slam for stone
  if(texts.length-tx0>3)texts.splice(tx0,texts.length-tx0); // one big summary instead of a pile of messages
  if(typeof shipSlam==='function')shipSlam();
  G.shake=Math.max(G.shake,24);rumble(1,1,450);puff(D.x,D.y,60,'rgba(170,150,110,',340,24);puff(D.x,D.y,24,'rgba(110,90,60,',200,8,true);
  RINGS.push({x:D.x,y:D.y,t:0,R:R1*1.25},{x:D.x,y:D.y,t:-.08,R:R1*.8});
  if(typeof SFX!=='undefined'&&SFX.play){SFX.play('crashStone',D.x,D.y,1.2);if(wood.length)SFX.play('crashWood',D.x,D.y,1);}
  G.stats.crashes=(G.stats.crashes||0)+1;float(D.x,D.y-110,wood.length?`CRASH! ${wood.length} wooden building${wood.length>1?'s':''} smashed!`:'CRASH STOMP!','#ffb84a');}
function updCrash(dt){D.crashCD=Math.max(0,(D.crashCD||0)-dt);
  if(D.diving){D.altT=0;if(D.alt<=0.02){D.alt=0;D.diving=false;crashStomp();}}
  for(const r of RINGS)r.t+=dt;RINGS=RINGS.filter(r=>r.t<.6);
  for(const p of PLANKS){p.t-=dt;p.vz-=700*dt;p.z+=p.vz*dt;if(p.z<=0){p.z=0;p.vz*=-.3;p.vx*=.6;p.vy*=.6;p.vr*=.5;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;}PLANKS=PLANKS.filter(p=>p.t>0);}
function drawCrashFx(){for(const r of RINGS){if(r.t<0)continue;const k=r.t/.6,rr=r.R*(.2+k);ctx.strokeStyle=`rgba(255,230,170,${.8*(1-k)})`;ctx.lineWidth=10*(1-k)+2;ctx.beginPath();ctx.ellipse(r.x,r.y,rr,rr*.62,0,0,TAU);ctx.stroke();
    ctx.strokeStyle=`rgba(120,95,60,${.5*(1-k)})`;ctx.lineWidth=5*(1-k)+1;ctx.beginPath();ctx.ellipse(r.x,r.y,rr*.85,rr*.53,0,0,TAU);ctx.stroke();}
  for(const p of PLANKS){ctx.globalAlpha=Math.min(1,p.t*2);ctx.save();ctx.translate(p.x,p.y-p.z);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.l/2,-1.6,p.l,3.2);ctx.restore();}ctx.globalAlpha=1;}
