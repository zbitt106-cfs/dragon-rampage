// ======================= KINGDOM-WIDE MILITIA: at the Militia tier EVERY villager arms up with their own tool and guards their own post =======================
const KM={postR:760,leash:880,home:150};
// reach/dmg/cd = melee; thr/tdmg/tcd/pk = throw (range, damage, cooldown, projectile look)
const KM_W={
  spear:{reach:56,dmg:.7,cd:1.3,thr:270,tdmg:1.6,tcd:3.8,pk:'spear',spd:58,say:['To arms!','Spears up!','For our homes!']},
  axe:{reach:52,dmg:1.0,cd:1.5,thr:190,tdmg:1.3,tcd:5,pk:'axe',spd:56,say:['Timber-r-r!','Axes ready!','Guard the camp!']},
  pick:{reach:50,dmg:1.1,cd:1.6,thr:180,tdmg:.8,tcd:4.5,pk:'rock',spd:52,say:['Pickaxes up!','Not our mine!','Rocks away!']},
  fork:{reach:68,dmg:.8,cd:1.2,spd:56,say:['Pitchforks!','Off my farm!','Shoo, dragon!']},
  scythe:{reach:62,dmg:.9,cd:1.4,spd:54,say:['Scythes ready!','Off my crops!']},
  hammer:{reach:50,dmg:1.0,cd:1.5,thr:170,tdmg:.8,tcd:5,pk:'rock',spd:52,say:['Hammers up!','Guard the castle!']},
  bucket:{reach:0,thr:230,tdmg:.5,tcd:2.4,pk:'water',spd:0,say:['Splash it!','Buckets!']},
  club:{reach:54,dmg:.9,cd:1.4,spd:50,say:['By order of King William!','Clubs out!']},
  staff:{reach:64,dmg:.8,cd:1.3,spd:50,say:['Guard the wagons!','Staffs up!']},
  whip:{reach:96,dmg:.6,cd:1.1,spd:0,say:['Hyah! Crack!','Not my cart!']},
  bow:{reach:0,spd:0,say:['Bow and dagger ready!']},
  oar:{reach:60,dmg:.7,cd:1.4,thr:200,tdmg:.7,tcd:4,pk:'rock',spd:0,say:['Not my lighthouse!']}};
const KM_ONLY=new Set(['bucket','club','staff','whip','bow','oar']); // these keep their own movement (cart, route, fire line, cabin, island)
const KM_NAME={spear:'spear',axe:'axe',pick:'pickaxe',fork:'pitchfork',scythe:'scythe',hammer:'hammer',bucket:'water buckets',club:'club',staff:'staff',whip:'whip',bow:'bow & dagger',oar:'oar'};
let kmProjs=[];
function kmRole(u){if(!u||u.dead)return null;if(u.type==='hunter')return'bow';if(u.type==='sea')return u.kind==='islander'&&u.job==='keeper'?'oar':null;if(u.type!=='villager')return null;
  if(u.tax)return'club';if(u.carav)return'staff';if(u.scart&&!u.scart.wrecked)return'whip';if(u.water)return'bucket';
  if(u.job==='woodcutter')return'axe';if(u.job==='miner')return'pick';if(u.job==='farmer'){if(!u.kmTool){G.kmFarmN=(G.kmFarmN||0)+1;u.kmTool=G.kmFarmN%2?'fork':'scythe';}return u.kmTool;}if(u.mason)return'hammer';return'spear';}
function kmPost(u){const r=u.arm;
  if(r==='axe')return{x:CAMP.x,y:CAMP.y+30,name:'logging camp'};
  if(r==='pick')return{x:MINE.x,y:MINE.y+40,name:'mine'};
  if(r==='fork'||r==='scythe'){const F=FARMS[u.farm];if(F)return{x:F.field.x+F.field.w/2,y:F.field.y+F.field.h/2,name:'farm'};}
  if(r==='hammer')return{x:GATE.x,y:GATE.y+40,name:'castle'};
  if(r==='bow')return{x:CABIN.x,y:CABIN.y+40,name:'cabin'};
  if(r==='oar')return{x:LH.x,y:LH.y+40,name:'lighthouse'};
  if(r==='club'||r==='staff')return{x:u.x,y:u.y,name:'route'};
  if(r==='bucket')return{x:u.x,y:u.y,name:'fire line'};
  if(r==='whip'&&u.scart)return{x:u.scart.x,y:u.scart.y,name:'cart'};
  if(u.shopper&&u.home)return{x:u.home.x,y:u.home.y,name:'market'};
  if(r==='spear'&&VILLAGES[u.v])return{x:VILLAGES[u.v].x,y:VILLAGES[u.v].y,name:'village'};
  return{x:u.home?u.home.x:u.x,y:u.home?u.home.y:u.y,name:'post'};}
function kmBlocked(x,y){return (typeof inWater==='function'&&inWater(x,y))||(typeof riverBlocked==='function'&&riverBlocked(x,y));}
function kmMove(u,tx,ty,sp,dt){const ox=u.x,oy=u.y;const r=moveTo(u,tx,ty,sp,dt);if(kmBlocked(u.x,u.y)&&!kmBlocked(ox,oy)){u.x=ox;u.y=oy;}return r;}
function kmClampLeash(P,x,y){const k=d2(x,y,P.x,P.y);if(k<=KM.leash)return[x,y];return[P.x+(x-P.x)*KM.leash/k,P.y+(y-P.y)*KM.leash/k];}
function kmThreat(P){return d2(D.x,D.y,P.x,P.y)<KM.postR;}
function kmSwing(u,W){u.atk=W.cd*R(.9,1.15);u.poke=.25;hurtDragon(W.dmg*Math.min(2,1+.12*(u.allies||0)),'tool');
  if(u.arm==='whip'){float(D.x+R(-20,20),D.y-heightOf()-64,'CRACK!','#ffe0b0');}
  else if(rnd()<.35)float(D.x+R(-20,20),D.y-heightOf()-64,{spear:'Poke!',axe:'Thwack!',pick:'Clonk!',fork:'Prod!',scythe:'Swish!',hammer:'Bonk!',club:'Bonk!',staff:'Whack!',oar:'Thwap!'}[u.arm]||'Bonk!','#ffe0b0');}
function kmThrow(u,W){const dd=dist(u,D);u.throwT=W.tcd*R(.9,1.2);u.throwA=.35;const sp=W.pk==='water'?260:300,T=dd/sp,px=D.x+D.vx*T*.5,py=D.y+D.vy*T*.5,a=Math.atan2(py-u.y,px-u.x);
  let pk=W.pk;if(pk==='water'){u.nThrow=(u.nThrow||0)+1;if(u.nThrow%3===0)pk='bucket';}
  kmProjs.push({kind:pk,x:u.x,y:u.y,z:12,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,tz:heightOf()+10,life:T+.3,spin:0,dmg:pk==='bucket'?.9:W.tdmg});}
function kmAttack(u,dt,W){const dd=dist(u,D),low=D.alt<.55;
  if(W.reach&&low&&D.alt<DR.hitAltSword&&dd<W.reach&&(u.atk||0)<=0){kmSwing(u,W);return;}
  if(W.thr&&dd>(W.reach||0)+12&&dd<W.thr&&(u.throwT||0)<=0&&D.alt<.6)kmThrow(u,W);}
function kmTick(u,dt){u.poke=Math.max(0,(u.poke||0)-dt);u.throwA=Math.max(0,(u.throwA||0)-dt);u.throwT=(u.throwT||0)-dt;u.atk=(u.atk||0)-dt;}
// full militia (spear, axe, pickaxe, pitchfork, scythe, hammer): fight only near their own post, then walk back
function kmFight(u,dt){const W=KM_W[u.arm]||KM_W.spear,P=kmPost(u);u.post=P;kmTick(u,dt);const dd=dist(u,D),low=D.alt<.55;
  if(kmThreat(P)&&!G.over){u.face=D.x>u.x?1:-1;u.engaged=true;
    if(low&&dd>W.reach*.8){const[tx,ty]=kmClampLeash(P,D.x,D.y);kmMove(u,tx,ty,dd>300?W.spd+4:W.spd,dt);u.anim+=dt*9;}
    else if(!low){const a=u.id*TAU+G.t*.3,[tx,ty]=kmClampLeash(P,D.x+Math.cos(a)*110,D.y+Math.sin(a)*70);kmMove(u,tx,ty,40,dt);u.anim+=dt*6;}
    kmAttack(u,dt,W);u.face=D.x>u.x?1:-1;return true;}
  u.engaged=false;
  // the dragon left: walk home to the post and stand guard there
  const uP=d2(u.x,u.y,P.x,P.y);
  if(uP>KM.home){if(!u.ptgt||d2(u.ptgt.x,u.ptgt.y,P.x,P.y)>KM.home)u.ptgt={x:P.x+R(-90,90),y:P.y+R(-70,70)};moveTo(u,u.ptgt.x,u.ptgt.y,50,dt);u.anim+=dt*8;u.state='post';return true;}
  if(!u.ptgt||(u.wait||0)<=0&&moveTo(u,u.ptgt.x,u.ptgt.y,30,dt)){u.ptgt={x:P.x+R(-110,110),y:P.y+R(-80,80)};u.wait=R(1,4);}
  if(u.wait>0)u.wait-=dt;else u.anim+=dt*6;return true;}
// workers that keep their own movement still fight back near their post (cart, route, fire line)
function kmSideFight(u,dt){const W=KM_W[u.arm];if(!W)return false;const P=kmPost(u);u.post=P;kmTick(u,dt);const dd=dist(u,D);
  if(!kmThreat(P)||G.over||dd>Math.max(W.thr||0,W.reach+60,140))return false;
  u.face=D.x>u.x?1:-1;u.engaged=true;const low=D.alt<.55;
  if((u.arm==='club'||u.arm==='staff')&&low&&dd>W.reach*.8&&dd<220){const[tx,ty]=kmClampLeash(P,D.x,D.y);kmMove(u,tx,ty,48,dt);u.anim+=dt*8;}
  kmAttack(u,dt,W);return true;}
function kmBells(){G.kmBell=6;if(typeof SFX!=='undefined')for(let i=0;i<6;i++)setTimeout(()=>SFX.play('bell',null,null,.8-i*.08),i*420);
  for(const V of VILLAGES)float(V.x,V.y-90,'🔔 DING-DONG! To arms!','#ffe28a');float(GATE.x,GATE.y-120,'🔔 The castle bells ring!','#ffe28a');float(D.x,D.y-140,'🔔 Bells ring across the kingdom!','#ffe28a');}
function kmArmAll(){let n=0;
  for(const u of units){if(u.dead)continue;const r=kmRole(u);if(!r){if(u.arm&&u.type==='villager'){u.arm=null;u.militia=false;}continue;}
    if(u.arm!==r){const fresh=!u.arm;u.arm=r;u.engaged=false;if(fresh){u.throwT=R(.5,2.5);u.atk=R(0,1);if(rnd()<.12)float(u.x,u.y-24,KM_W[r].say[RI(0,KM_W[r].say.length-1)],'#fdd');}}
    if(!KM_ONLY.has(r)&&u.type==='villager'&&!u.inside&&!u.militia){dropCarry(u);u.militia=true;u.state='idle';u.tgt=null;u.ptgt=null;u.hp=u.maxHp=Math.max(u.maxHp||10,14);}
    if(KM_ONLY.has(r)&&u.militia)u.militia=false;n++;}
  G.kmArmed=n;return n;}
function kmDisarmAll(){for(const u of units)if(u.arm||u.militia){u.arm=null;u.militia=false;u.engaged=false;u.post=null;u.ptgt=null;if(u.type==='villager'){u.state='idle';u.tgt=null;}}G.kmArmed=0;}
function kmArmedCount(){let n=0;for(const u of units)if(!u.dead&&u.arm)n++;return n;}
// the Militia tier: arm the whole map, not just villagers near their village
{const _u=updMilitiaAll;updMilitiaAll=function(dt){const was=!!G.milOn,t0=G.milT;_u.apply(this,arguments);
  if(G.milOn&&!was){G.seenMil=true;kmBells();G.banner={text:'The whole kingdom takes up arms!',sub:'Bells ring in every town. Villagers grab spears, and every worker fights with their own tool: axes, pickaxes, pitchforks, scythes, buckets, clubs and whips.',extra:'Each one only guards their own post: village, camp, mine, farm, market, cabin, lighthouse or cart. Fly away and they go back to it.',t:4.5};}
  if((t0||0)-dt<=0||!was&&G.milOn){if(G.milOn)kmArmAll();else if(G.kmArmed||was){kmDisarmAll();if(was)float(D.x,D.y-100,'Everyone goes back to work','#cfe');}}};}
{const _m=updMilitia;updMilitia=function(u,dt){if(!u.arm||KM_ONLY.has(u.arm)||!G.milOn||G.over)return _m.apply(this,arguments);return kmFight(u,dt);};}
{const _v=updVillager;updVillager=function(u,dt){if(u.arm&&KM_ONLY.has(u.arm)&&G.milOn&&!u.inside&&kmSideFight(u,dt)){if(u.arm!=='bucket'&&u.arm!=='whip')return;if(dist(u,D)<fearR())return;}return _v.apply(this,arguments);};}
// the hunter keeps his bow & dagger but now guards his cabin instead of chasing across the map
{const _h=updHunter;updHunter=function(u,dt){if(G.milOn&&u.arm==='bow'){const P=kmPost(u);u.post=P;if(!kmThreat(P)&&d2(u.x,u.y,P.x,P.y)>KM.home){u.engaged=false;moveTo(u,P.x,P.y,60,dt);u.anim+=dt*8;return;}
    if(kmThreat(P)){u.engaged=true;const r=_h.apply(this,arguments);const[cx,cy]=kmClampLeash(P,u.x,u.y);u.x=cx;u.y=cy;return r;}}
  return _h.apply(this,arguments);};}
// the lighthouse keeper swats with an oar and throws pebbles from his island
{const _s=updSeaUnit;updSeaUnit=function(u,dt){if(G.milOn&&u.arm==='oar'&&!u.dead){const W=KM_W.oar,P=kmPost(u);u.post=P;kmTick(u,dt);if(kmThreat(P)&&!G.over){u.engaged=true;u.face=D.x>u.x?1:-1;kmAttack(u,dt,W);}else u.engaged=false;}
  return _s.apply(this,arguments);};}
function updKmProjs(dt){for(const p of kmProjs){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.spin+=dt*14;p.z=lerp(p.z,p.tz,Math.min(1,dt*3));
    if(d2(p.x,p.y,D.x,D.y)<40&&!G.over){p.life=0;hurtDragon(p.dmg,'tool');
      if(p.kind==='water'||p.kind==='bucket'){puff(D.x,D.y-heightOf(),8,'rgba(150,200,255,',80,5);float(D.x+R(-20,20),D.y-heightOf()-64,p.kind==='bucket'?'Bucket bonk!':'Splash!','#9fd4ff');if(typeof SFX!=='undefined')SFX.play('splash',D.x,D.y,.5);}
      else{puff(D.x,D.y-heightOf(),4,'rgba(200,200,200,',60,4);if(p.kind==='axe')float(D.x+R(-20,20),D.y-heightOf()-64,'Thunk!','#ffe0b0');}}}
  for(let i=kmProjs.length-1;i>=0;i--)if(kmProjs[i].life<=0)kmProjs.splice(i,1);}
function drawKmProjs(){for(const p of kmProjs){const x=p.x,y=p.y-p.z;ell(p.x,p.y,3,1.5,'rgba(0,0,0,.25)');
  if(p.kind==='spear'){const a=Math.atan2(p.vy,p.vx);line(x-Math.cos(a)*18,y-Math.sin(a)*18,x,y,'#6b4a26',2);poly([x+Math.cos(a)*5,y+Math.sin(a)*5,x+Math.cos(a+2.4)*4,y+Math.sin(a+2.4)*4,x+Math.cos(a-2.4)*4,y+Math.sin(a-2.4)*4],'#ccc');}
  else if(p.kind==='axe'){ctx.save();ctx.translate(x,y);ctx.rotate(p.spin);line(-6,0,6,0,'#6b4a26',2);poly([4,-1,9,-5,10,3,4,2],'#c8ccd4');ctx.restore();}
  else if(p.kind==='rock'){ell(x,y,4,3.5,'#8a8276');ell(x-1,y-1,1.8,1.5,'#aaa294');}
  else if(p.kind==='water'){ell(x,y,5,4,'rgba(120,190,255,.85)');ell(x-3*Math.sign(p.vx||1),y+1,3,2.5,'rgba(170,220,255,.7)');}
  else if(p.kind==='bucket'){ctx.save();ctx.translate(x,y);ctx.rotate(p.spin*.6);rect(-3.5,-3,7,6,'#7a5530');rect(-3.5,-3,7,1.3,'#555');ell(0,-3,3.2,1,'#6af');ctx.restore();}}}
// sprite tweaks: each armed role carries its own tool and a red armband
function kmDrawTool(u,x,y,f,bob){const st=u.poke>0?4:0,r=u.arm,hy=y-9+bob*.3;
  rect(x-2.8,y-7.5+bob*.3,5.6,1.3,'#c22');
  if(r==='axe'){line(x-f*2,y-3,x+f*(7+st),hy-8,'#7a5530',1.3);poly([x+f*(7+st),hy-8,x+f*(10+st),hy-11,x+f*(11+st),hy-6,x+f*(8+st),hy-5],'#c8ccd4');}
  else if(r==='pick'){line(x-f*2,y-3,x+f*(7+st),hy-8,'#7a5530',1.3);ctx.strokeStyle='#bfc4cc';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x+f*(7+st),hy-5,5,-Math.PI*.9,-Math.PI*.1);ctx.stroke();}
  else if(r==='fork'){line(x-f*3,y-2,x+f*(8+st),hy-10,'#8a6a40',1.1);for(let k=-1;k<=1;k++)line(x+f*(8+st)+k*1.6,hy-10,x+f*(9+st)+k*1.6,hy-14,'#ccd',.9);}
  else if(r==='scythe'){line(x-f*2,y-1,x+f*(6+st),hy-11,'#8a6a40',1.2);ctx.strokeStyle='#d8dce2';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x+f*(6+st)-f*5,hy-11,5,f>0?-Math.PI*.1:-Math.PI*.9,f>0?-Math.PI*.8:-Math.PI*.2,f<0);ctx.stroke();}
  else if(r==='hammer'){line(x-f*2,y-3,x+f*(6+st),hy-7,'#7a5530',1.3);rect(x+f*(6+st)-2.5,hy-10,5,4,'#8a8f98');}
  else if(r==='bucket'){rect(x+f*5-2.5,y-6-(u.throwA>0?6:0),5,4.5,'#7a5530');ell(x+f*5,y-6-(u.throwA>0?6:0),2.5,1,'#6af');}
  else if(r==='club'){line(x+f*1,y-5,x+f*(6+st),hy-8,'#5a3a1a',2.6);ell(x+f*(6+st),hy-8,2.2,2.2,'#5a3a1a');}
  else if(r==='staff'){line(x+f*4,y+1,x+f*(5+st),hy-14,'#8a6a40',1.4);ell(x+f*(5+st),hy-14,1.6,1.6,'#c9a43a');}
  else if(r==='whip'){ctx.strokeStyle='#4a2a14';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+f*3,hy);const L=u.poke>0?18:9;ctx.quadraticCurveTo(x+f*(L*.6),hy-10,x+f*L,hy-(u.poke>0?4:0));ctx.stroke();}
  else if(r==='spear'){line(x-f*3,y-3,x+f*(9+st),y-17,'#8a6a40',1);poly([x+f*(9+st),y-17,x+f*(7+st),y-17.4,x+f*(7.8+st),y-15.4],'#ccd');}
  if(u.hp<u.maxHp){rect(x-6,y-20,12,2,'#400');rect(x-6,y-20,12*u.hp/u.maxHp,2,'#e44');}}
{const _k=drawMilitiaKit;drawMilitiaKit=function(u,x,y,f,bob){if(!u.arm||u.arm==='spear')return _k.apply(this,arguments);kmDrawTool(u,x,y,f,bob);};}
{const _p=drawPerson;drawPerson=function(u){const r=_p.apply(this,arguments);if(u.arm&&!u.militia&&!u.dead){const x=u.x,y=u.y,bob=Math.sin(u.anim||0)*1.2,f=u.face||1;
    if(u.arm==='bow'){rect(x-4,y-13.5,7.6,1.6,'#c22');ell(x-f*4.5,y-12,1.6,4,'#6b4a26');line(x-f*4.5,y-16,x-f*4.5,y-18,'#ddd',.8);}else kmDrawTool(u,x,y,f,bob);}return r;};}
{const _s=drawSeaUnit;drawSeaUnit=function(u){const r=_s.apply(this,arguments);if(u.arm==='oar'&&!u.dead){const x=u.x,y=u.y,f=u.face||1,st=u.poke>0?5:0;rect(x-5,y-14,10,1.6,'#c22');line(x-f*2,y-6,x+f*(8+st),y-22,'#8a6a40',1.6);ell(x+f*(9+st),y-24,2.2,4,'#a07a48');}return r;};}
{const _d=drawWorld;drawWorld=function(){_d.apply(this,arguments);if(!kmProjs.length)return;const z=cam.z;ctx.save();ctx.setTransform(DPR*z,0,0,DPR*z,DPR*(VW/2-cam.x*z),DPR*(VH/2-cam.y*z));drawKmProjs();ctx.restore();};}
// HUD: ringing bell + armed count under the wanted bar
{const _h=drawHUD;drawHUD=function(){_h.apply(this,arguments);if(scene!=='play'||!G.milOn)return;const ring=(G.kmBell||0)>0,sw=ring?Math.sin(G.t*14)*.4:0;
  const w=330,x=VW/2-w/2,y=88;ctx.fillStyle='rgba(90,14,10,.78)';ctx.fillRect(x,y,w,22);ctx.strokeStyle='rgba(255,200,120,.7)';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,21);
  ctx.save();ctx.translate(x+16,y+11);ctx.rotate(sw);txt('🔔',0,5,14,'#ffe28a','center');ctx.restore();
  txt(`The whole kingdom takes up arms! · ${G.kmArmed||0} armed`,x+w/2+8,y+15,12,'#ffe0b0','center');};}
{const _up=update;update=function(dt){_up.apply(this,arguments);if(scene==='play'){if(G.kmBell>0)G.kmBell-=dt;if(kmProjs.length)updKmProjs(dt);}};}
{const _ng=newGame;newGame=function(){kmProjs=[];return _ng.apply(this,arguments);};}
SFX_DEF.bell=(a,B,o,t)=>{osc(a,o,t,'sine',880,0,1.4,.35,.004);osc(a,o,t,'sine',1320,0,.9,.15,.004);osc(a,o,t,'triangle',440,0,1.6,.18,.004);return 1.5;};
