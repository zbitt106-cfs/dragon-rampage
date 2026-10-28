// ===================== partMR: MEERKATS (savanna + desert), ROADRUNNERS (desert) and JACKALS (savanna + desert) =====================
// Meerkat colonies of 4-8 at burrow mounds; an upright lookout squeaks when the dragon or a predator comes near and everyone dives
// into the burrows (hidden = can't be bitten, burned or caught), then they pop back up. Roadrunners zig-zag away at top speed with
// dust puffs and a "Meep meep!" and are hard to catch. Jackals are small scavenger-hunters (the meerkats' & roadrunners' foes).
// All wild: eating them never raises wanted. Respawn, Tally, map dots, save/load.
Object.assign(FAUNA,{meerkat:{hp:3,sp:85,flee:0,zone:'savanna'},roadrunner:{hp:4,sp:80,flee:0,zone:'desert'},
  jackal:{hp:8,sp:112,flee:230,zone:'savanna'}});
Object.assign(HEAL,{meerkat:3,roadrunner:4,jackal:8});Object.assign(FOOD,{meerkat:3,roadrunner:4,jackal:8});
['meerkat','roadrunner','jackal'].forEach(s=>FAUNA_ART.add(s));
// hunting system: who eats whom (cartoon catches via hnCatch)
for(const [p,a] of [['eagle',['meerkat','roadrunner']],['hawk',['meerkat','roadrunner']],['snake',['meerkat']],['cheetah',['meerkat']],['hyena',['meerkat']],['dfox',['meerkat','roadrunner']]])
  if(HN_DIET[p])for(const k of a)if(!HN_DIET[p].prey.includes(k))HN_DIET[p].prey.push(k);
HN_DIET.jackal={prey:['meerkat','roadrunner','lizard','rabbit'],r:440,sp:1.2};
HN_DIET.roadrunner={prey:['lizard','snake'],r:420,sp:1.5};
Object.assign(HN_NICE,{meerkat:'a meerkat',roadrunner:'a roadrunner',jackal:'a jackal'});Object.assign(HN_WHO,{jackal:'A jackal',roadrunner:'A roadrunner',vulture:'A vulture'});
const MK_PRED=new Set(['cheetah','hyena','jackal','snake','dfox','lion','wdragon']),MK_BIRD=new Set(['eagle','hawk','vulture']);
const MK={cols:[],t:0};
function mkColSpot(zone){const Z=ZONES[zone];for(let t=0;t<80;t++){const p=Z.s();if(!Z.ok(p.x,p.y))continue;let ok=true;for(let i=0;i<4&&ok;i++){const a=i*TAU/4;if(!Z.ok(p.x+Math.cos(a)*60,p.y+Math.sin(a)*40))ok=false;}
  if(ok&&!MK.cols.some(c=>d2(c.x,c.y,p.x,p.y)<900)&&(typeof inOasis!=='function'||!inOasis(p.x,p.y)))return p;}return null;}
function mkColony(x,y,zone,cap,members){const c={x,y,zone,cap,i:MK.cols.length,bur:[{x:x-34,y:y+6},{x:x+30,y:y-8},{x:x+4,y:y+24}],alarmT:0,alarms:0,quiet:0};MK.cols.push(c);
  const n=members===undefined?cap:members;for(let i=0;i<n;i++)mkMeerkat(c,i===0);return c;}
function mkMeerkat(c,look,at){const b=c.bur[RI(0,2)],p=at||{x:b.x+R(-10,10),y:b.y+R(-6,6)};
  const u=mkUnit('animal',p.x,p.y,{species:'meerkat',wild:true,free:true,zone:c.zone,col:c.i,look:!!look,hp:FAUNA.meerkat.hp,maxHp:FAUNA.meerkat.hp,mst:'out',bur:b,t:R(0,3),home:{x:c.x-90,y:c.y-60,w:180,h:120},face:rnd()<.5?1:-1,pop:0});
  units.push(u);return u;}
function mkInit(){MK.cols=[];MK.t=0;for(let i=0;i<3;i++){const p=mkColSpot('savanna');if(p)mkColony(p.x,p.y,'savanna',RI(4,8));}
  for(let i=0;i<3;i++){const p=mkColSpot('desert');if(p)mkColony(p.x,p.y,'desert',RI(4,8));}
  for(let i=0;i<preyN('roadrunner',6);i++)rrSpawn(false);
  for(let i=0;i<2;i++){jkSpawn('savanna',false,2);jkSpawn('desert',false,2);}}
function mkMembers(c){return units.filter(u=>!u.dead&&u.species==='meerkat'&&u.col===c.i);}
// threat check for a colony: the dragon (low or close), a land predator, or a raptor/vulture overhead
function mkThreat(c){if(!G.over&&dist(c,D)<(D.alt>.5?300:340))return 'dragon';
  // the lookout is good but not perfect: a sneaking predator or a diving bird is only spotted now and then
  const look=units.some(u=>!u.dead&&u.species==='meerkat'&&u.col===c.i&&u.look&&!u.inside),r=look?240:120;if(rnd()>.3)return null;
  const L=HN.list||{};for(const k of MK_PRED)for(const p of (L[k]||[]))if(!p.dead&&d2(p.x,p.y,c.x,c.y)<r*r)return k;
  for(const b of birds)if(!b.dead&&MK_BIRD.has(b.kind)&&(b.mkDive||b.hPrey||b.z<90)&&d2(b.x,b.y,c.x,c.y)<r*r)return b.kind;
  return null;}
function mkAlarm(c,why){const M=mkMembers(c);let any=false;for(const u of M)if(u.mst==='out'){u.mst='run';any=true;}if(!any)return;c.alarms++;c.alarmT=G.t;
  const L=M.find(u=>u.look)||M[0];if(L&&dist(L,D)<1300)float(L.x,L.y-26,why==='dragon'?'Squeak! SQUEAK! Dragon!':'Squeak squeak! Take cover!','#fff2b0');}
function mkTick(dt){MK.t+=dt;if(MK.t<.25)return;const st=MK.t;MK.t=0;
  for(const c of MK.cols){const th=mkThreat(c);if(th){c.quiet=0;mkAlarm(c,th);}else if(!(dist(c,D)<360&&!G.over))c.quiet+=st;
    // respawn: a new pup now and then, never right under the dragon's nose
    c.rT=(c.rT||0)+st;if(c.rT>=40){c.rT=0;const M=mkMembers(c);if(M.length<c.cap&&dist(c,D)>600){const u=mkMeerkat(c,!M.some(m=>m.look));u.mst='hide';u.inside=true;u.hideT=R(1,3);}}}}
function updMK(u,dt){const c=MK.cols[u.col];if(!c){u.dead=true;return;}u.t-=dt;u.pop=Math.max(0,u.pop-dt*3);
  if(u.mst==='hide'){u.inside=true;u.hideT=(u.hideT||0)-dt;if(u.hideT<=0&&c.quiet>1){u.mst='out';u.inside=false;u.pop=1;u.x=u.bur.x;u.y=u.bur.y;if(u.look&&dist(u,D)<1100&&rnd()<.5)float(u.x,u.y-22,'*pop*','#fff');}return;}
  u.inside=false;
  if(u.mst==='run'){if(u.hBy&&u.hBy.hPrey===u){}const b=u.bur,d=dist(u,b);if(d<8){u.mst='hide';u.inside=true;u.hideT=R(4,7);const p=u.hBy;if(p){u.hBy=null;if(p.hPrey===u){hnDrop(p);p.full=R(6,12);G.mkMiss=(G.mkMiss||0)+1;if(dist(u,D)<900&&rnd()<.5)float(u.x,u.y-20,'Missed! Into the burrow!','#e0ffe0');}}puff(u.x,u.y,3,'rgba(200,170,120,',30,3);return;}
    u.face=b.x>u.x?1:-1;const s=Math.min(d,170*dt);u.x+=(b.x-u.x)/d*s;u.y+=(b.y-u.y)/d*s;u.anim=(u.anim||0)+dt*14;return;}
  // out: the lookout stands tall on the big mound; the rest forage around the burrows
  if(u.look){const m=c.bur[0];u.x=lerp(u.x,m.x,dt*3);u.y=lerp(u.y,m.y-4,dt*3);u.up=1;if(u.t<=0){u.t=R(1,2.5);u.face=-u.face;}return;}
  u.up=Math.max(0,(u.up||0)-dt);if(u.t<=0){u.t=R(1,3);u.tx=c.x+R(-80,80);u.ty=c.y+R(-50,50);if(rnd()<.3)u.up=R(.6,1.4);}
  if(u.tx!==undefined&&!(u.up>0)){const d=Math.hypot(u.tx-u.x,u.ty-u.y);if(d>3){const s=Math.min(d,45*dt);u.face=u.tx>u.x?1:-1;u.x+=(u.tx-u.x)/d*s;u.y+=(u.ty-u.y)/d*s;u.anim=(u.anim||0)+dt*9;}}}
// ---------- roadrunners ----------
function rrSpawn(far,at){const Z=ZONES.desert;let p=at||null;for(let t=0;!p&&t<40;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>900*900))p=q;}if(!p)return null;
  const u=mkUnit('animal',p.x,p.y,{species:'roadrunner',wild:true,free:true,zone:'desert',hp:4,maxHp:4,home:{x:p.x-400,y:p.y-300,w:800,h:600},t:R(0,3),face:1,zz:0});units.push(u);return u;}
function updRR(u,dt){const Z=ZONES.desert,dd=dist(u,D);u.mcd=(u.mcd||0)-dt;
  const thr=(!G.over&&dd<(D.alt>.5?260:300))?D:(u.hBy&&!u.hBy.dead&&dist(u,u.hBy)<330?u.hBy:null);
  if(thr){u.run=1.4;u.thr={x:thr.x,y:thr.y};}else u.run=(u.run||0)-dt;
  if(u.run>0&&u.thr){if(u.hPrey)hnDrop(u);u.zz-=dt;if(u.zz<=0){u.zz=R(.16,.3);u.zs=-(u.zs||1);}
    const base=Math.atan2(u.y-u.thr.y,u.x-u.thr.x),a=base+u.zs*.75,sp=FAUNA.roadrunner.sp*3.1;let nx=u.x+Math.cos(a)*sp*dt,ny=u.y+Math.sin(a)*sp*dt;
    if(!Z.ok(nx,ny)){const b=base+u.zs*1.9;nx=u.x+Math.cos(b)*sp*dt;ny=u.y+Math.sin(b)*sp*dt;if(!Z.ok(nx,ny)){nx=u.x;ny=u.y;u.zs=-u.zs;}}
    u.face=nx>u.x?1:-1;u.x=nx;u.y=ny;u.anim=(u.anim||0)+dt*30;u.dust=(u.dust||0)-dt;if(u.dust<=0&&dd<1100){u.dust=GFX_HI?.08:.2;puff(u.x-u.face*8,u.y,1,'rgba(225,200,150,',25,5);}
    if(u.mcd<=0&&dd<900){u.mcd=3.2;float(u.x,u.y-28,'Meep meep!','#fff7a0');}return;}
  updWild._base(u,dt);}
// ---------- jackals ----------
function jkSpawn(zone,far,n){const Z=ZONES[zone];let p=null;for(let t=0;!p&&t<40;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&(!far||d2(q.x,q.y,D.x,D.y)>900*900))p=q;}if(!p)return;
  for(let i=0;i<(n||1);i++)units.push(mkUnit('animal',p.x+R(-30,30),p.y+R(-20,20),{species:'jackal',wild:true,free:true,zone,hp:8,maxHp:8,home:{x:p.x-450,y:p.y-320,w:900,h:640},t:R(0,3),face:1}));}
{const _uw=updWild;updWild=function(u,dt){if(u.species==='meerkat'){updMK(u,dt);return;}if(u.species==='roadrunner'){updRR(u,dt);return;}return _uw(u,dt);};updWild._base=_uw;}
// hidden meerkats are out of everyone's reach; a roadrunner often dodges at the last moment
{const _hl=hnLists;hnLists=function(){_hl.apply(this,arguments);const L=HN.list;if(L&&L.meerkat)L.meerkat=L.meerkat.filter(u=>!u.inside&&u.mst!=='hide');};}
{const _hc=hnCatch;hnCatch=function(p,T){if(T&&T.species==='meerkat'&&T.inside){if(T.hBy===p)T.hBy=null;hnDrop(p);p.full=R(6,12);if(dist(T,D)<1000)float(T.x,T.y-20,'Missed! It ducked into its burrow','#e0ffe0');G.mkMiss=(G.mkMiss||0)+1;return;}
  if(T&&T.species==='roadrunner'&&rnd()<.5){if(T.hBy===p)T.hBy=null;hnDrop(p);p.full=R(6,12);T.run=1.2;T.thr={x:p.x,y:p.y};if(dist(T,D)<1000)float(T.x,T.y-26,'Meep meep! Too fast!','#fff7a0');G.rrDodge=(G.rrDodge||0)+1;return;}
  return _hc(p,T);};}
TOUGH.roadrunner={chk:u=>{if(u._dg!==G.t){u._dg=G.t;u._dodge=rnd()<.45;}return u._dodge;},hit:u=>{u.run=1.5;u.thr={x:D.x,y:D.y};G.rrDodge=(G.rrDodge||0)+1;float(u.x,u.y-28,'Meep meep! (dodged)','#fff7a0');}};
// vultures swoop down on a meerkat or roadrunner out in the open (cartoon catch)
function vultureSwoop(dt){MK.vT=(MK.vT||0)-dt;
  for(const b of birds){if(b.dead||!b.mkDive)continue;const T=b.mkDive;
    if(!hnAlive(T)||T.inside||(T.species==='roadrunner'&&T.run>0&&rnd()<dt*.6)){b.mkDive=null;if(T)T.hBy=null;continue;}
    const d=Math.hypot(T.x-b.x,T.y-b.y),s=Math.min(d,230*dt);if(d>1){b.x+=(T.x-b.x)/d*s;b.y+=(T.y-b.y)/d*s;}b.z=Math.max(4,b.z-140*dt);b.flap+=dt*14;
    if(d<16&&b.z<30){b.mkDive=null;hnCatch(b,T);b.z=20;}}
  if(MK.vT>0)return;MK.vT=2;
  for(const b of birds){if(b.dead||b.kind!=='vulture'||b.mkDive||b.full>0)continue;let T=null,bd=420*420;
    for(const u of units)if(!u.dead&&!u.inside&&(u.species==='meerkat'||u.species==='roadrunner')&&!u.hBy){const d=d2(u.x,u.y,b.x,b.y);if(d<bd){bd=d;T=u;}}
    if(T&&rnd()<.3){b.mkDive=T;T.hBy=b;}}}
{const _ub=updBirds;updBirds=function(dt){const H=birds.filter(b=>!b.dead&&b.mkDive);for(const b of H)b.dead=true;try{_ub(dt);}finally{for(const b of H)b.dead=false;}
  if(b_full_tick(dt),scene==='play'&&!G.over)vultureSwoop(dt);};}
function b_full_tick(dt){for(const b of birds)if(b.kind==='vulture'&&b.full>0)b.full-=dt;}
// respawn & colony upkeep
function mrRespawn(dt){G.mrT=(G.mrT||0)+dt;if(G.mrT<15)return;G.mrT=0;
  const rr=units.filter(u=>!u.dead&&u.species==='roadrunner').length;if(rr<preyN('roadrunner',6))rrSpawn(true);
  for(const z of ['savanna','desert'])if(units.filter(u=>!u.dead&&u.species==='jackal'&&u.zone===z).length<4&&rnd()<.35)jkSpawn(z,true,1);}
{const _up=updParts;updParts=function(dt){_up(dt);if(scene==='play'&&G&&!G.over){mkTick(dt);mrRespawn(dt);}};}
{const _ng=newGame;newGame=function(o){const r=_ng.apply(this,arguments);G.mrT=0;mkInit();return r;};}
// ---------- drawing ----------
function drawMounds(x0,y0,x1,y1){for(const c of MK.cols){if(c.x<x0-120||c.x>x1+120||c.y<y0-80||c.y>y1+80)continue;
  for(let i=0;i<3;i++){const b=c.bur[i],s=i===0?1.3:1;ell(b.x,b.y+2,20*s,9*s,'rgba(0,0,0,.15)');ell(b.x,b.y,18*s,8*s,c.zone==='desert'?'#d8b47a':'#b89a62');ell(b.x,b.y-1,13*s,5.5*s,c.zone==='desert'?'#e6c690':'#c8aa70');ell(b.x,b.y,6*s,3.2*s,'#3a2a18');}}}
{const _dl=drawSeaLow;drawSeaLow=function(x0,y0,x1,y1){_dl.apply(this,arguments);drawMounds(x0,y0,x1,y1);};}
function drawMeerkat(u){const x=u.x,y=u.y,f=u.face||1,pk=u.pop>0?1-u.pop:1,run=u.mst==='run';
  ell(x,y+1,6,2.4,'rgba(0,0,0,.2)');
  if(u.look||u.up>0){const h=17*pk;ctx.save();ctx.translate(x,y);ell(f*-3,-1,2,1.2,'#a07848');
    ell(0,-h*.45,4.2,h*.5,'#c9a46e');ell(0,-h*.38,2.6,h*.32,'#ead2a4');line(f*-3,-2,f*-8,1,'#8a6a40',2);
    ell(0,-h*.98,3.6,3.4,'#c9a46e');ell(f*1.8,-h*.98+.5,1.6,1.2,'#e7cfa0');ell(f*-1.1,-h*1.02,1.4,1.3,'#3a2414');ell(f*1.4,-h*1.02,1.4,1.3,'#3a2414');ell(f*-1.1,-h*1.04,.5,.5,'#fff');ell(f*1.4,-h*1.04,.5,.5,'#fff');
    ell(f*-3.2,-h*1.15,1.1,1,'#3a2414');ell(f*3.2,-h*1.15,1.1,1,'#3a2414');line(-2,-h*.62,f*-1,-h*.48,'#a07848',1.6);line(2,-h*.62,f*1,-h*.48,'#a07848',1.6);
    if(u.look){ctx.globalAlpha=.6;txt('!',f*6,-h-4,9,'#fff7c0','center');ctx.globalAlpha=1;}ctx.restore();return;}
  const b=Math.sin((u.anim||0))*1.2;ell(x,y-4,7,3.6,'#c9a46e');for(let i=-1;i<=1;i++)line(x+i*2.5-2,y-5,x+i*2.5-1,y-6,'#8a6a40',.8);
  line(x-f*6,y-4,x-f*12,y-2+b,'#8a6a40',2);line(x-3,y-2,x-3+b,y+1,'#8a6a40',1.6);line(x+3,y-2,x+3-b,y+1,'#8a6a40',1.6);
  ell(x+f*7,y-6,3.4,3,'#c9a46e');ell(x+f*9.6,y-5.5,1.6,1.2,'#e7cfa0');ell(x+f*7.4,y-6.6,1.2,1.1,'#3a2414');if(run){ctx.globalAlpha=.5;line(x-f*10,y-8,x-f*16,y-8,'#fff',1);ctx.globalAlpha=1;}}
function drawRoadrunner(u){const x=u.x,y=u.y,f=u.face||1,run=u.run>0,a=u.anim||0;ell(x,y+1,9,3,'rgba(0,0,0,.2)');
  if(run){ctx.globalAlpha=.45;for(let i=0;i<3;i++)ell(x-f*(6+i*5)+Math.sin(a+i)*2,y-2,4-i,2.2,'#bfa77a');ctx.globalAlpha=1;
    ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y-4,4,0,TAU);ctx.stroke();}
  else{line(x-2,y-10,x-3+Math.sin(a)*2,y,'#c8a040',1.4);line(x+2,y-10,x+2-Math.sin(a)*2,y,'#c8a040',1.4);}
  poly([x-f*4,y-12,x-f*22,y-24,x-f*20,y-20,x-f*2,y-9],'#5a4632');
  ell(x,y-13,9,4.8,'#7a6040');for(let i=0;i<4;i++)ell(x-f*(4-i*2.6),y-14+(i%2),1.6,.8,'#f2e6c8');ell(x+f*1,y-11,5,2.6,'#e8dcc0');
  line(x+f*5,y-15,x+f*9,y-23,'#7a6040',3);ell(x+f*10,y-25,4,3.3,'#7a6040');poly([x+f*8,y-27,x+f*4,y-33,x+f*7,y-28,x+f*3,y-30,x+f*9,y-26],'#3a2a1a');
  poly([x+f*13,y-26,x+f*22,y-24.5,x+f*13,y-23.5],'#3a3028');ell(x+f*11,y-26,1.6,1.6,'#fff');ell(x+f*11.4,y-26,.8,.9,'#111');line(x+f*12.5,y-25,x+f*13.5,y-23,'#4aa8e8',1.2);}
function drawJackal(u){const x=u.x,y=u.y,f=u.face||1,a=Math.sin(u.anim||0)*2.4;ell(x,y+1,13,3.5,'rgba(0,0,0,.2)');
  for(const [lx,s] of [[-8,1],[-5,-1],[6,1],[9,-1]])line(x+f*lx,y-8,x+f*lx+s*a,y,'#a0743a',2.2);
  line(x-f*12,y-11,x-f*21,y-6,'#7a5a30',4);ell(x-f*21,y-5.5,2.4,2,'#2a2018');
  ell(x,y-11,13,5.4,'#c8964e');ell(x-f*2,y-13.5,10,3,'#4a4038');ell(x+f*1,y-8.5,9,2.4,'#ead2a8');
  ell(x+f*13,y-15,5,4.4,'#c8964e');poly([x+f*16,y-15,x+f*23,y-13,x+f*16,y-11.5],'#c8964e');ell(x+f*23,y-13,1.3,1.2,'#222');
  poly([x+f*10,y-18,x+f*11,y-26,x+f*14,y-19],'#b0803e');poly([x+f*14,y-18,x+f*16,y-25.5,x+f*17,y-18],'#b0803e');ell(x+f*15,y-16,1.2,1.2,'#222');}
{const _df=drawFauna;drawFauna=function(u){if(u.species==='meerkat'){drawMeerkat(u);return;}if(u.species==='roadrunner'){drawRoadrunner(u);return;}if(u.species==='jackal'){drawJackal(u);return;}_df(u);};}
// vultures diving are drawn low with a dive streak by the normal bird drawer (z drops); nothing extra needed
tallyAddSect('savanna','Animals · The Golden Savanna','🦁','#e8c060',[['meerkat','Meerkats'],['jackal','Jackals']]);
tallyAddSect('desert','Animals · Desert','🌵','#e8b070',[['roadrunner','Roadrunners']]);
{const _sm=drawSeaMap;drawSeaMap=function(X,Y,big,q){_sm.apply(this,arguments);for(const c of MK.cols)if(seen(c.x,c.y)){ctx.fillStyle='#8a6a3a';ctx.beginPath();ctx.arc(X(c.x),Y(c.y),q*.55,0,TAU);ctx.fill();}};}
// ---------- save / load ----------
{const _ss=svSnapshot;svSnapshot=function(){G.mkC=[];for(const c of MK.cols)G.mkC.push(Math.round(c.x),Math.round(c.y),c.zone==='desert'?1:0,c.cap);G.mkS=[];G.rrS=[];G.jkS=[];
  for(const u of units){if(u.dead)continue;if(u.species==='meerkat')G.mkS.push(u.col,Math.round(u.x),Math.round(u.y),u.look?1:0);else if(u.species==='roadrunner')G.rrS.push(Math.round(u.x),Math.round(u.y));else if(u.species==='jackal')G.jkS.push(Math.round(u.x),Math.round(u.y),u.zone==='desert'?1:0);}
  return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(Array.isArray(G.mkC)){const SP=new Set(['meerkat','roadrunner','jackal']);for(const u of units)if(SP.has(u.species))u.dead=true;units=units.filter(u=>!SP.has(u.species));
    MK.cols=[];const C=G.mkC;for(let i=0;i+3<C.length;i+=4)mkColony(C[i],C[i+1],C[i+2]?'desert':'savanna',C[i+3],0);
    const S=G.mkS||[];for(let i=0;i+3<S.length;i+=4){const c=MK.cols[S[i]];if(c)mkMeerkat(c,!!S[i+3],{x:S[i+1],y:S[i+2]});}
    const Rr=G.rrS||[];for(let i=0;i+1<Rr.length;i+=2)rrSpawn(false,{x:Rr[i],y:Rr[i+1]});
    const J=G.jkS||[];for(let i=0;i+2<J.length;i+=3){const z=J[i+2]?'desert':'savanna';units.push(mkUnit('animal',J[i],J[i+1],{species:'jackal',wild:true,free:true,zone:z,hp:8,maxHp:8,home:{x:J[i]-450,y:J[i+1]-320,w:900,h:640},t:R(0,3),face:1}));}}
  return r;};}
