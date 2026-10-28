// ================= partGP: guards keep travellers safe from predators =================
// The rich caravan's desert escort and the kingdom's road patrols take on predators (lions, wolves, bears, big cats, scorpions, snakes,
// crocs, wild dragons...) that come near the caravan or a patrol on the road; the predator fights back, and once worn down it simply
// runs off (family-friendly: nobody is defeated for good; guards and camels are never knocked below a sliver of health by animals).
// The dragon always comes first: a caravan the dragon is attacking, or an engaged patrol, ignores the animals.
function gpQ(ax,ay,bx,by){const x=ax-bx,y=ay-by;return x*x+y*y;}
const GP={pred:new Set(['lion','hyena','jaguar','tiger','cheetah','cougar','wolf','bear','dscorp','snake','python','croc','wdragon']),
  carR:240,patR:300,travR:450,tick:.25,t:0,list:[],runAt:.3,flee:12,bite:1.35};
function gpOk(T){return !!(T&&!T.dead&&!T.gone&&T.type==='animal'&&!(T.gpFlee>G.t));}
function gpScan(){GP.list=[];for(const u of units)if(gpOk(u)&&GP.pred.has(u.species)&&!u.carav&&!u.tame&&!u.pet)GP.list.push(u);}
function gpNear(x,y,r){let b=null,bd=r*r;for(const t of GP.list){if(!gpOk(t))continue;const d=gpQ(t.x,t.y,x,y);if(d<bd){bd=d;b=t;}}return b;}
function gpDragonFirst(x,y,r){return !G.over&&D.alt<.6&&gpQ(D.x,D.y,x,y)<r*r;}
function gpRunOff(T,from){T.gpFlee=G.t+GP.flee;T.gpAgg=null;T.gpFrom={x:from.x,y:from.y};if(typeof hnDrop==='function'&&T.hPrey)hnDrop(T);T.state='idle';
  G.gpRouted=(G.gpRouted||0)+1;if(dist(T,D)<1300){const n=(typeof HN_WHO!=='undefined'&&HN_WHO[T.species])||('The '+T.species);float(T.x,T.y-34,`${n} runs off!`,'#e0ffe0');puff(T.x,T.y-8,8,'rgba(230,220,190,',70,4);}}
function gpHit(T,d,by){if(!gpOk(T))return;T.hp=Math.max(1,T.hp-d);G.gpHits=(G.gpHits||0)+1;if(!T.gpAgg||T.gpAgg.dead)T.gpAgg=by;
  if(T.species==='wdragon')T.angry=G.t;if(T.hp<=T.maxHp*GP.runAt)gpRunOff(T,by);}
// one guard fights one predator: soldiers close in and strike, archers keep their distance and shoot
function gpFight(u,T,dt){u.anim=(u.anim||0)+dt*6;u.face=T.x>u.x?1:-1;const dd=dist(u,T),m=u.dmgMul||1;u.gpCd=(u.gpCd||0)-dt;
  if(u.type==='archer'){if(dd>300)moveTo(u,T.x,T.y,72,dt);else if(dd<130){const a=Math.atan2(u.y-T.y,u.x-T.x);moveTo(u,u.x+Math.cos(a)*30,u.y+Math.sin(a)*30,70,dt);}
    if(dd<340&&u.gpCd<=0){u.gpCd=2;u.draw=.3;u.gpShot={x0:u.x,y0:u.y-10,x:T.x,y:T.y-8,t:.18};gpHit(T,4*m,u);G.gpArrows=(G.gpArrows||0)+1;}}
  else{if(dd>26)moveTo(u,T.x,T.y,u.mounted?130:90,dt);else if(u.gpCd<=0){u.gpCd=u.foot?1.35:1.1;u.swing=.25;gpHit(T,(u.foot?4:7)*m,u);}}
  u.swing=Math.max(0,(u.swing||0)-dt);u.born=G.t;}
// caravan guards (called from partRC's formation step); returns true while busy with a predator
function gpGuardStep(k,dt){const c=RCV.cur,L=c&&c.lead;if(!L||L.dead)return false;if(gpDragonFirst(L.x,L.y,320)){k.gpT=null;return false;}
  const T=k.gpT;if(!gpOk(T)||dist(T,L)>GP.carR+260){k.gpT=null;return false;}gpFight(k,T,dt);return true;}
function gpCaravanTick(){const c=RCV.cur;if(!c||c.done||!c.lead||c.lead.dead)return;const L=c.lead;if(gpDragonFirst(L.x,L.y,320))return;
  const near=[L,...c.camels.filter(k=>!k.dead)];let T=null;for(const p of near){T=gpNear(p.x,p.y,GP.carR);if(T)break;}
  if(!T){for(const g of c.guards)if(!g.dead&&!gpOk(g.gpT))g.gpT=null;return;}
  for(const g of c.guards)if(!g.dead&&!gpOk(g.gpT))g.gpT=gpNear(g.x,g.y,GP.carR+200)||T;
  for(const t of GP.list)if(gpOk(t)&&!gpOk(t.gpAgg)&&gpQ(t.x,t.y,L.x,L.y)<(GP.carR+120)**2){let b=null,bd=1e12;for(const v of [...c.guards,...c.camels])if(!v.dead){const d=gpQ(v.x,v.y,t.x,t.y);if(d<bd){bd=d;b=v;}}t.gpAgg=b;}
  G.gpCarEngaged=(G.gpCarEngaged||0)+1;}
// road patrols: a predator near the patrol (or bothering a traveller the patrol is passing) gets chased off, then the patrol carries on
function gpPatrolTick(){if(typeof patrols==='undefined')return;for(const p of patrols){if(p.dead||p.engaged){p.gpT=null;continue;}const L=p.members.find(u=>!u.dead);if(!L)continue;
  if(gpOk(p.gpT)&&dist(p.gpT,L)<GP.patR+300)continue;p.gpT=gpNear(L.x,L.y,GP.patR);
  if(!p.gpT)for(const t of GP.list){if(!gpOk(t)||gpQ(t.x,t.y,L.x,L.y)>GP.travR**2)continue;if(units.some(v=>!v.dead&&(v.type==='villager'||v.carav)&&gpQ(v.x,v.y,t.x,t.y)<140*140)){p.gpT=t;break;}}
  if(p.gpT){p.wp=null;G.gpPatEngaged=(G.gpPatEngaged||0)+1;if(!p.gpSaid||G.t-p.gpSaid>8){p.gpSaid=G.t;if(dist(L,D)<1300)float(L.x,L.y-50,'Patrol: "Keep the road safe!"','#ffe0a0');}
    if(!gpOk(p.gpT.gpAgg))p.gpT.gpAgg=L;}}}
{const _up=updPatrols;updPatrols=function(dt){const busy=patrols.filter(p=>!p.engaged&&gpOk(p.gpT));const saved=busy.map(p=>p.members.map(u=>[u.x,u.y]));
  const r=_up.apply(this,arguments);busy.forEach((p,i)=>{if(p.engaged)return;p.members.forEach((u,j)=>{if(saved[i][j]&&!u.dead){u.x=saved[i][j][0];u.y=saved[i][j][1];}if(!u.dead&&gpOk(p.gpT))gpFight(u,p.gpT,dt);});});return r;};}
// predators that are being fought (or that came for the caravan) fight back, and run off when worn down
{const _w=updWild;updWild=function(u,dt){if(u&&!u.dead){
    if(u.gpFlee>G.t&&u.gpFrom){const F=FAUNA[u.species]||{sp:80},a=Math.atan2(u.y-u.gpFrom.y,u.x-u.gpFrom.x),ox=u.x,oy=u.y;moveTo(u,u.x+Math.cos(a)*60,u.y+Math.sin(a)*60,(F.sp||80)*1.1,dt);u.state='idle';
      const Z=ZONES&&ZONES[u.zone];if(Z&&Z.ok&&Z.ok(ox,oy)&&!Z.ok(u.x,u.y)){u.x=ox;u.y=oy;}return;}
    const A=u.gpAgg;if(A&&GP.pred.has(u.species)&&u.species!=='wdragon'){if(A.dead||dist(u,A)>700||gpDragonFirst(u.x,u.y,150)){u.gpAgg=null;}
      else{const F=FAUNA[u.species]||{sp:80,bite:2,cd:1.5};u.state='hunt';u.gpBcd=(u.gpBcd||0)-dt;if(u.hPrey&&typeof hnDrop==='function')hnDrop(u);
        if(dist(u,A)>24)moveTo(u,A.x,A.y,(F.sp||80),dt);else if(u.gpBcd<=0){u.gpBcd=F.cd||GP.bite;const b=F.bite||2,floor=A.type==='animal'?A.maxHp*.5:Math.max(1,A.maxHp*.15);
          A.hp=Math.max(Math.min(A.hp,floor),A.hp-b);G.gpBites=(G.gpBites||0)+1;if(dist(u,D)<1100)float(A.x,A.y-30,(F.say||'Grr!').replace(/ -\d+$/,''),'#ffd0a0');}
        u.face=A.x>u.x?1:-1;return;}}}
  return _w.apply(this,arguments);};updWild._base=_w._base;}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);if(scene==='play'&&!paused&&G&&D&&!G.over){GP.t-=dt;if(GP.t<=0){GP.t=GP.tick;gpScan();gpCaravanTick();gpPatrolTick();}}return r;};}
{const _ng=newGame;newGame=function(){GP.list=[];GP.t=0;return _ng.apply(this,arguments);};}
// archers' arrows at predators: a quick streak
{const _dp=drawPerson;drawPerson=function(u){const r=_dp.apply(this,arguments);const s=u.gpShot;if(s&&s.t>0){s.t-=1/60;ctx.save();ctx.globalAlpha=Math.min(1,s.t*8);line(s.x0,s.y0,s.x,s.y,'#f4ecd8',1.3);ctx.restore();}return r;};}
// ---- worksite patrols: a small squad (3 foot soldiers + 1 archer) loops around the lumber camp and another around the mine ----
// They guard the workers and carts from the dragon (normal patrol engagement) and from predators (same chase-off as road patrols).
// Fresh every level; a lost squad is replaced after a while.
const WS={first:3,respawn:60,sites:()=>[{key:'camp',name:'lumber camp',x:(CAMP.x+LOGPILE_POS.x)/2,y:(CAMP.y+LOGPILE_POS.y)/2,rx:190,ry:140},
  {key:'mine',name:'mine',x:(MINE.x+STONEPILE_POS.x)/2,y:(MINE.y+STONEPILE_POS.y)/2,rx:200,ry:140}]};
function wsLoop(S){return[0,1,2,3,4,5].map(i=>{const a=i/6*TAU;return{x:S.x+Math.cos(a)*S.rx,y:S.y+Math.sin(a)*S.ry};});}
function wsSpawn(S){const lvl=G.lvl||1,hpM=1+.2*(lvl-1),colr='#6a5a2a',P=wsLoop(S),st=P[RI(0,P.length-1)];
  const p={id:++patrolId,members:[],engaged:false,wp:null,site:S.key,siteS:S,li:RI(0,5)};
  ['foot','foot','foot','archer'].forEach((k,i)=>{const x=st.x+R(-14,14),y=st.y+i*8;const u=k==='archer'?mkUnit('archer',x,y,{hp:22,maxHp:22,shootT:R(1,3)}):mkUnit('knight',x,y,{hp:24,maxHp:24,atk:0,foot:true,colr});
    u.hp=u.maxHp=Math.round(u.maxHp*hpM);u.patrol=p;u.wsP=S.key;u.born=G.t;p.members.push(u);});
  p.members[0].banner=true;units.push(...p.members);patrols.push(p);G.wsSpawned=(G.wsSpawned||0)+1;return p;}
function wsTick(dt){if(!G.ws)G.ws={};for(const S of WS.sites()){const live=patrols.some(p=>p.site===S.key&&!p.dead&&p.members.some(u=>!u.dead));
  if(live){G.ws[S.key]=WS.respawn;continue;}G.ws[S.key]=(G.ws[S.key]==null?WS.first:G.ws[S.key])-dt;if(G.ws[S.key]<=0){wsSpawn(S);G.ws[S.key]=WS.respawn;}}}
{const _up=updPatrols;updPatrols=function(dt){wsTick(dt);for(const p of patrols)if(p.site&&!p.engaged&&!p.wp&&p.siteS){const P=wsLoop(p.siteS);p.li=((p.li||0)+1)%P.length;p.wp=P[p.li];}return _up.apply(this,arguments);};}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);if(G)G.ws={};return r;};}
if(typeof svApply==='function'){const _sa=svApply;svApply=function(){const r=_sa.apply(this,arguments);if(G)G.ws={};return r;};}
