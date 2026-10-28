// ================= partJT: the ANCIENT JUNGLE TEMPLE (destructible, 100 gold) + MOUNT EMBER (a second lava volcano, far SW jungle) =================
// Temple: overgrown stepped stone temple with vines. Stone: fire alone never hurts it; stomps (Q, the land claw/stomp), bites and lava do.
// Wrecked -> cartoon rubble burst + 100 gold straight to the lair hoard ("+100"). Never rebuilt; back every level (initStructsK). Tally + save/load.
const JT={x:-13700,y:600,hp:700,gold:100,bite:40};
KDEF.jtemple={name:'Ancient jungle temple',hp:JT.hp,stone:1,cost:[0,0],gold:[0,0],pts:150,alarm:0,sz:80};COST.jtemple=[0,0];STRUCT_NAME.jtemple=KDEF.jtemple.name;
const JT_LOCK={lock:1,task:null,dead:false,state:'lock'}; // a "builder" that never comes: masons and self-repair skip the ruin
function jtS(){return structures.find(s=>s.kind==='jtemple');}
{const B=TALLY_SECT.find(s=>s.id==='build');if(B&&!B.keys.some(k=>k[0]==='b:jtemple'))B.keys.push(['b:jtemple','Ancient jungle temples']);TALLY_LABEL['b:jtemple']='Ancient jungle temples';}
function jtClear(x,y,r){const far=o=>Math.hypot(o.x-x,(o.y-y)*1.25)>r;DECOR=DECOR.filter(o=>far(o));if(trees)trees=trees.filter(far);if(typeof ROCKS!=='undefined')for(let i=ROCKS.length-1;i>=0;i--)if(!far(ROCKS[i]))ROCKS.splice(i,1);}
{const _i=initStructsK;initStructsK=function(){const r=_i.apply(this,arguments);if(!jtS()){const s=kAdd('jtemple',JT.x,JT.y,-1);s.hasGold=false;}return r;};}
{const _s=stoneFire;stoneFire=function(s,dt){if(s&&s.kind==='jtemple')return;return _s.apply(this,arguments);};}
{const _o=onRuin;onRuin=function(s){if(!s||s.kind!=='jtemple')return _o.apply(this,arguments);s.hasGold=false;const r=_o.apply(this,arguments);s.builder=JT_LOCK;
  if(!s._loading){D.gold=(D.gold||0)+JT.gold;G.jtGold=(G.jtGold||0)+JT.gold;G.jtWrecked=(G.jtWrecked||0)+1;
    float(s.x,s.y-120,`KA-BOOM! The ancient temple crumbles: +${JT.gold} gold!`,'#ffd84a');G.shake=Math.max(G.shake,14);
    for(let i=0;i<5;i++)puff(s.x+R(-70,70),s.y+R(-30,10),16,'rgba(170,165,140,',200,16);puff(s.x,s.y-30,20,'rgba(255,220,90,',160,10);
    JT_BITS.length=0;for(let i=0;i<26;i++){const a=R(0,TAU),v=R(80,260);JT_BITS.push({x:s.x+R(-40,40),y:s.y-R(10,60),z:R(10,40),vx:Math.cos(a)*v,vy:Math.sin(a)*v*.5,vz:R(160,380),t:R(1.2,2),c:i%3?'#8e8a76':'#5f7a3a',s:R(4,9)});}}
  return r;};}
const JT_BITS=[];
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);for(const b of JT_BITS){b.t-=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vz-=700*dt;b.z=Math.max(0,b.z+b.vz*dt);if(b.z<=0){b.vx*=.5;b.vy*=.5;b.vz=0;}}
  for(let i=JT_BITS.length-1;i>=0;i--)if(JT_BITS[i].t<=0)JT_BITS.splice(i,1);const s=jtS();if(s&&s.state==='ruin'&&!s.builder)s.builder=JT_LOCK;return r;};}
// bites: gnaw the temple stones (heavy, like a stomp)
{const _b=biteWell;biteWell=function(){if(D.alt<.3){const s=jtS(),mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70;
    if(s&&s.state==='ok'&&d2(mx,my,s.x,s.y-20)<115){const hv=HEAVY;HEAVY=true;hurtStruct(s,JT.bite);HEAVY=hv;D.eatCD=.45;D.eatT=.3;G.jtBites=(G.jtBites||0)+1;
      if(s.state==='ok')float(s.x,s.y-100,'Crunch! Ancient stone chips away','#e0d8b0');puff(mx,my,8,'rgba(170,165,140,',90,8);if(typeof SFX!=='undefined')SFX.play('crashStone',s.x,s.y,.5);return true;}}
  return _b.apply(this,arguments);};}
// the swim claw-scratch also rakes the temple if it is in reach (on land Q is the stomp)
{const _c=clawScratch;clawScratch=function(){const r=_c.apply(this,arguments);const s=jtS();if(s&&s.state==='ok'&&dist(s,D)<160){const hv=HEAVY;HEAVY=true;hurtStruct(s,30);HEAVY=hv;}return r;};}
function drawTemple(s){const x=s.x,y=s.y,t=G.t;
  if(s.state==='ruin'){ell(x,y+6,96,30,'rgba(0,0,0,.18)');for(let i=0;i<14;i++){const a=i*2.1,r=20+(i*37%60);rect(x+Math.cos(a)*r-9,y+Math.sin(a)*r*.4-8,18,12,i%2?'#8e8a76':'#a4a08a');}
    rect(x-30,y-16,14,22,'#9a9680');line(x-30,y-16,x-10,y-30,'#4f7a2a',3);ell(x+20,y-6,16,8,'#4a7a2a');ell(x-48,y+2,14,7,'#5a8a34');
    for(const b of JT_BITS){ell(b.x,b.y+2,b.s*.8,b.s*.3,'rgba(0,0,0,.2)');rect(b.x-b.s/2,b.y-b.z-b.s/2,b.s,b.s,b.c);}return;}
  const dmg=1-s.hp/s.maxHp;ell(x+10,y+8,110,30,'rgba(0,0,0,.25)');
  // 4 stepped tiers
  const T=[[96,22,'#8a8672'],[76,22,'#96927c'],[56,22,'#a29e88'],[36,20,'#aeaa94']];let yy=y;
  for(const [w,h,c] of T){rect(x-w,yy-h,w*2,h,c);rect(x-w,yy-h,w*2,4,'#bcb8a2');for(let k=-w+12;k<w;k+=24)line(x+k,yy-h+4,x+k,yy,'rgba(60,56,46,.35)',1);yy-=h;}
  // stairway + shrine
  poly([x-14,y,x+14,y,x+10,yy,x-10,yy],'#bdb9a2');for(let k=y-6;k>yy;k-=6)line(x-13,k,x+13,k,'rgba(80,76,62,.5)',1);
  rect(x-26,yy-36,52,36,'#a8a48e');poly([x-32,yy-36,x+32,yy-36,x+20,yy-50,x-20,yy-50],'#8e8a76');rect(x-9,yy-28,18,28,'#2a2418');
  const gl=.5+.5*Math.sin(t*2.2);ell(x-4,yy-18,1.8,1.8,`rgba(255,220,90,${.5+.5*gl})`);ell(x+4,yy-18,1.8,1.8,`rgba(255,220,90,${.5+.5*gl})`); // a little gold glints inside
  // carved face blocks
  for(const sx of[-60,60]){rect(x+sx-10,y-38,20,14,'#8a8672');ell(x+sx-4,y-32,2,2,'#4a463a');ell(x+sx+4,y-32,2,2,'#4a463a');}
  // moss + hanging vines
  for(let i=0;i<9;i++){const vx=x-88+i*22,vy=y-40-(i%3)*18,sw=Math.sin(t*1.3+i)*2;ctx.strokeStyle='#3f7a2a';ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(vx,vy);ctx.quadraticCurveTo(vx+sw+4,vy+16,vx+sw,vy+30+(i%2)*8);ctx.stroke();ell(vx+sw,vy+30+(i%2)*8,3,2.2,'#58a038');}
  for(let i=0;i<7;i++)ell(x-80+i*27,y-44+(i%2?-22:0)-(i%3)*10,12,5,'rgba(80,140,50,.85)');ell(x+40,yy-38,14,6,'rgba(80,140,50,.9)');
  if(dmg>.25){line(x-50,y-30,x-36,y-10,'#3a3628',1.6);line(x+30,y-58,x+44,y-40,'#3a3628',1.6);}if(dmg>.6){line(x-20,yy-30,x-4,yy-6,'#3a3628',1.6);line(x+56,y-20,x+70,y-2,'#3a3628',1.6);}
  if(s.hp<s.maxHp){rect(x-40,yy-62,80,5,'#400');rect(x-40,yy-62,80*s.hp/s.maxHp,5,'#e8c040');}
  if(dist(D,s)<700)txt('Ancient Temple',x,y+30,12,'#e8e0b0','center');}
{const _d=drawStructK;drawStructK=function(s){if(s.kind==='jtemple'){drawTemple(s);return true;}return _d.apply(this,arguments);};}
{const _a=svApply;svApply=function(d){const r=_a.apply(this,arguments);const s=jtS();if(s&&s.state==='ruin')s.builder=JT_LOCK;return r;};}

// ================= MOUNT EMBER: a second lava volcano in the far south-west corner of the jungle =================
const VOLC2={x:-16650,y:3950,r:96,drinkR:165,name:'Mount Ember'};let VOLC2_T={erupt:9,smoke:0,warn:0};
const VOLCS=()=>[VOLC,VOLC2];
function withV2(fn){const ox=VOLC.x,oy=VOLC.y,ot=VOLC_T;VOLC.x=VOLC2.x;VOLC.y=VOLC2.y;VOLC_T=VOLC2_T;VOLC.v2=1;try{return fn();}finally{VOLC.x=ox;VOLC.y=oy;VOLC2_T=VOLC_T;VOLC_T=ot;VOLC.v2=0;}}
function nearV2(){return D&&D.mode==='ground'&&D.alt<.3&&!D.swim&&Math.hypot(D.x-VOLC2.x,D.y-VOLC2.y)<VOLC2.drinkR;}
{const _n=nearLava;nearLava=function(){return _n.apply(this,arguments)||(!VOLC.v2&&nearV2());};}
{const _l=lavaDrink;lavaDrink=function(){if(!VOLC.v2&&nearV2()&&!(Math.hypot(D.x-VOLC.x,D.y-VOLC.y)<VOLC.drinkR)){const r=withV2(()=>_l.apply(this,arguments));if(r)G.v2Drinks=(G.v2Drinks||0)+1;return r;}return _l.apply(this,arguments);};}
{const _t=txt;txt=function(s){if(VOLC.v2&&s==='Mount Cinder')arguments[0]=VOLC2.name;return _t.apply(this,arguments);};}
{const _dv=drawVolcano;drawVolcano=function(){_dv.apply(this,arguments);if(Math.abs(cam.x-VOLC2.x)>1900||Math.abs(cam.y-VOLC2.y)>1400)return;withV2(()=>_dv.apply(this,arguments));};}
// site: no trees, plants, rocks or animals on the cone; animals never spawn there
function v2Clear(){jtClear(VOLC2.x,VOLC2.y,340);jtClear(VOLC2.x,VOLC2.y+120,300);jtClear(JT.x,JT.y-30,190);
  for(const u of units)if(u.type==='animal'&&!u.dead&&(Math.hypot(u.x-VOLC2.x,u.y-VOLC2.y)<450||Math.hypot(u.x-JT.x,u.y-JT.y)<200)){u.x+=u.x<VOLC2.x+600?700:0;u.y-=400;}
  if(typeof pbIndex==='function')pbIndex();}
const JV_NOSPAWN=(x,y)=>Math.hypot(x-VOLC2.x,y-VOLC2.y)<480||Math.hypot(x-JT.x,y-JT.y)<220;
for(const k in ZONES){const z=ZONES[k];if(z&&typeof z.ok==='function'){const _ok=z.ok;z.ok=function(x,y){return !JV_NOSPAWN(x,y)&&_ok.apply(this,arguments);};}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);v2Clear();VOLC2_T={erupt:9,smoke:0,warn:0};return r;};}
// smoke, rumbling eruptions, and lava embers that set the nearby jungle alight
function updVolc2(dt){const V=VOLC2,T=VOLC2_T,near=Math.abs(cam.x-V.x)<1600&&Math.abs(cam.y-V.y)<1200;
  T.smoke-=dt;if(near&&T.smoke<=0){T.smoke=.18;parts.push({x:V.x+R(-30,30),y:V.y+R(-10,6),z:R(10,30),vx:R(-10,25),vy:R(-14,-4),vz:R(30,55),life:R(2.2,3.4),max:3.4,size:R(10,18),kind:'smoke',col:'rgba(70,64,64,'});}
  T.erupt-=dt;if(T.erupt<=0){T.erupt=R(10,18);T.warn=1.4;G.v2Erupt=(G.v2Erupt||0)+1;
    if(near){SFX.play('erupt',V.x,V.y,1);const dd=Math.hypot(D.x-V.x,D.y-V.y);G.shake=Math.max(G.shake,dd<700?6:2);if(dd<900&&typeof rumble==='function')rumble(.4,.3,220);
      for(let i=0;i<46;i++){const a=R(0,TAU),s=R(30,190);LEMBERS.push({x:V.x+R(-20,20),y:V.y+R(-8,8),z:20,vx:Math.cos(a)*s,vy:Math.sin(a)*s*.6,vz:R(260,520),t:R(1.2,2.4)});}
      for(let i=0;i<12;i++)parts.push({x:V.x+R(-40,40),y:V.y,z:R(20,60),vx:R(-30,30),vy:R(-20,0),vz:R(60,110),life:R(2,3),max:3,size:R(16,26),kind:'smoke',col:'rgba(60,52,52,'});}
    // lava bombs land just past the cone and burn the plants around it
    let lit=0;const tryLit=o=>{if(lit<3&&typeof pbIgnite==='function'&&pbIgnite(o))lit++;};
    if(typeof pbNear==='function')pbNear(V.x,V.y+60,620,(o,d)=>{if(d>330&&d<620&&rnd()<.25)tryLit(o);});
    for(const t of trees){if(lit>=3)break;const d=Math.hypot(t.x-V.x,t.y-V.y);if(t.state==='ok'&&!t.fire&&d>330&&d<620&&rnd()<.25){t.fire=1;lit++;}}
    if(lit){G.v2Lit=(G.v2Lit||0)+lit;for(let i=0;i<3;i++)LPUDDLES.push({x:V.x+R(-260,260),y:V.y+R(170,260),r:R(14,22),t:5,max:5,tick:0});}}
  T.warn=Math.max(0,T.warn-dt);}
{const _up=updParts;updParts=function(dt){_up.apply(this,arguments);if(scene==='play'&&!paused&&G&&D)updVolc2(dt);};}
// world map: both volcanoes, Mount Ember labelled once you have seen it, plus the temple
{const _m=drawMap;drawMap=function(mmx,mmy,mmw,big){const r=_m.apply(this,arguments);try{const s=mmw/(WX1-WX0),X=x=>mmx+(x-WX0)*s,Y=y=>mmy+(y-WY0)*s,p=.6+.4*Math.sin(G.t*3);
  const vol=(V,lab)=>{const x=X(V.x),y=Y(V.y),k=big?1:.6;poly([x-8*k,y+5*k,x-2.5*k,y-5*k,x+2.5*k,y-5*k,x+8*k,y+5*k],'#5a4a44');ell(x,y-5*k,3*k,1.4*k,`rgba(255,${120+80*p|0},40,1)`);if(big)txt(lab,x,y+16,9,'#ffb070','center',false);G.v2MapDrawn=(G.v2MapDrawn||0)+1;};
  vol(VOLC,'Mount Cinder');vol(VOLC2,'🌋 Mount Ember');
  const t=jtS();if(t&&(typeof seen!=='function'||seen(t.x,t.y))){ctx.fillStyle=t.state==='ok'?'#d8d0a0':'#555';const x=X(t.x),y=Y(t.y);poly([x-5,y+3,x+5,y+3,x+2,y-4,x-2,y-4],t.state==='ok'?'#c8c09a':'#555');if(big)txt(t.state==='ok'?'Ancient Temple':'Temple (rubble)',x,y+13,9,'#e8e0b0','center',false);}}catch(e){}return r;};}
