
// ===================== partWF: Dragon Peaks extras =====================
// 1) wild dragons are IMMUNE to the player's fire breath (no damage, no burning; a little "shrug" puff). Bites, claws, stomps, lava still hurt.
// 2) their own weak fire is only for HUNTING (goats, birds, mountain lions): it singes prey, never the player, and only leaves tiny scorches.
//    Mountain lions in the peaks fight back with a claw swipe until they're worn down.
// 3) the DRAGON EGG NEST: a rocky nest of speckled eggs the roost guards. Come close and they stop hunting and rush to defend it
//    (swoop, bite, claw). Eggs can be eaten (E: cartoon gulp, food) or smashed (stomp, claw, lava, or a bite when you're already full):
//    a crack and a puff of shell bits, no bonus. Either makes the guards extra aggressive. 3 eggs, reset every castle level; saved with the game.
//    Each egg eaten = +5 permanent max fire on this life (kept across levels, reset on death / new game).
let WF_LAVA=0;
{const _ls=lavaSplash;lavaSplash=function(x,y){WF_LAVA++;try{const r=_ls.apply(this,arguments);if(wfNearNest(x,y,95))wfSmash('lava');return r;}finally{WF_LAVA--;}};}
{const _uv=updVolcano;updVolcano=function(){WF_LAVA++;try{return _uv.apply(this,arguments);}finally{WF_LAVA--;}};}
{const _hu=hurtUnit;hurtUnit=function(u,d,src){
  if(u&&!u.dead&&u.species==='wdragon'&&src==='fire'&&!WF_LAVA){u.burn=0;G.wdImmune=(G.wdImmune||0)+1;
    if(!u.imT||G.t-u.imT>.8){u.imT=G.t;puff(u.x,u.y-20,5,'rgba(255,240,200,',60,6);if(dist(u,D)<900&&(!G.wdImmT||G.t-G.wdImmT>4)){G.wdImmT=G.t;float(u.x,u.y-56,'Immune! *shrug*','#ffe6a8');}}
    return;}
  return _hu.apply(this,arguments);};}
// ---------- weak hunting fire ----------
function wdHuntFire(u,T){u.ang=Math.atan2(T.y-u.y,T.x-u.x);wdFire(u,.45);G.wdHuntFires=(G.wdHuntFires||0)+1;
  if(dist(u,T)>170)return;
  if(T.flap!==undefined){T.singe=G.t;G.wdSinged=(G.wdSinged||0)+1;return;}   // a bird: a puff of feathers, it's caught on the next pass
  if(T.type==='animal'){const dmg=T.species==='cougar'?7:5;T.hp=Math.max(1,T.hp-dmg);T.singe=G.t;G.wdSinged=(G.wdSinged||0)+1;puff(T.x,T.y-8,4,'rgba(90,80,70,',50,5);
    if(rnd()<.35)scorch(T.x+R(-8,8),T.y+R(-6,6),7);}}                    // tiny scorch marks only, never a wildfire
function wdPreyResists(u,T){if(!T||T.species!=='cougar'||T.hp<=T.maxHp*.5)return false;
  u.hp=Math.max(1,u.hp-4);u.fcd=Math.min(u.fcd,.4);const a=Math.atan2(u.y-T.y,u.x-T.x);u.x+=Math.cos(a)*50;u.y+=Math.sin(a)*50;T.face=u.x>T.x?1:-1;T.leap=.3;
  G.wdCougarSwipes=(G.wdCougarSwipes||0)+1;if(dist(T,D)<900&&(!G.wdSwT||G.t-G.wdSwT>3)){G.wdSwT=G.t;float(T.x,T.y-50,'Rrrowr! The mountain lion swipes back!','#ffd27a');}
  return true;}
// a couple of mountain lions live in the peaks (prey for the roost)
function wdCougar(){const Z=ZONES.drpeaks;let p=null;for(let t=0;!p&&t<40;t++){const q=Z.s();if(Z.ok(q.x,q.y)&&d2(q.x,q.y,D.x,D.y)>700&&d2(q.x,q.y,WDN.x,WDN.y)>500)p=q;}if(!p)return;
  units.push(mkUnit('animal',p.x,p.y,{species:'cougar',wild:true,zone:'drpeaks',home:{x:p.x-400,y:p.y-250,w:800,h:500},hp:FAUNA.cougar.hp,maxHp:FAUNA.cougar.hp,free:true,t:R(0,3),jt:0,wdc:1}));}
// ---------- the egg nest ----------
const WDN=(()=>{for(const [x,y] of [[-14800,-980],[-14650,-1500],[-15600,-1100],[-13900,-1000]])if(!WD_CRAGS.some(c=>d2(x,y,c.x,c.y)<220)&&!WD_NESTS.some(n=>d2(x,y,n.x,n.y)<300))return{x,y};return{x:-14800,y:-980};})();
const WDN_MAX=3,WDN_R=560,WDN_FIRE=5;   // 3 eggs per castle level (reset with every level, like all creatures); no relaying mid-level
function wfEggs(){if(G.wdEggs==null)G.wdEggs=WDN_MAX;return G.wdEggs;}
function wfNearNest(x,y,r){return d2(x,y,WDN.x,WDN.y)<r;}
function wfFury(why){G.wdFury=G.t+(why==='near'?10:20);
  for(const u of units)if(!u.dead&&u.species==='wdragon'&&!(u.daze>0)&&u.hp>u.maxHp*.3&&dist(u,WDN)<3200){if(u.hPrey)hnDrop(u);
    if(u.st!=='attack'){u.st='attack';u.angry=G.t;u.atkT=0;}u.atkT=Math.max(u.atkT||0,why==='near'?12:20);u.fury=G.wdFury;}}
function wfEggFx(){puff(WDN.x,WDN.y-8,8,'rgba(250,245,230,',90,6);for(let i=0;i<6;i++)hnFx(WDN.x+R(-16,16),WDN.y-6+R(-6,6),'stars');}
// special food: each egg gives +5 PERMANENT max fire (the red bar), kept across levels on the same life, reset on death / new game
function wfFireMax(){return FM.max+(D.fireBonus||0);}
function wfEat(){if(wfEggs()<=0)return false;G.wdEggs--;tallyAdd('wdegg');G.stats.wdEggs=(G.stats.wdEggs||0)+1;
  if(D.maxFire===undefined)fireInit();D.fireBonus=(D.fireBonus||0)+WDN_FIRE;D.maxFire=wfFireMax();D.fire=D.maxFire;D.fireOut=false;feed(10);D.eatCD=.6;D.eatT=.3;
  if(typeof mhBanner==='function')mhBanner(`Fire lasts longer! (+${WDN_FIRE})`,`Max fire ${D.maxFire}  ·  ${G.wdEggs} egg${G.wdEggs===1?'':'s'} left in the nest`,3.2);else G.banner={text:`Fire lasts longer! (+${WDN_FIRE})`,sub:'',t:3.2};
  if(typeof SFX!=='undefined')SFX.play('gulp',WDN.x,WDN.y,.9);wfEggFx();float(WDN.x,WDN.y-50,'GULP! A dragon egg!','#ffe08a');wfFury('egg');return true;}
function wfSmash(how){if(wfEggs()<=0)return false;G.wdEggs--;tallyAdd('wdeggx');G.stats.wdEggsX=(G.stats.wdEggsX||0)+1;G.wdSmashBy=how;
  if(typeof SFX!=='undefined')SFX.play('eggCrack',WDN.x,WDN.y,1);
  puff(WDN.x,WDN.y-10,10,'rgba(245,240,225,',120,5);G.wdShells=G.wdShells||[];
  for(let i=0;i<8;i++)G.wdShells.push({x:WDN.x+R(-10,10),y:WDN.y-8,vx:R(-90,90),vy:R(-120,-40),t:0,c:WD_EGG[RI(0,WD_EGG.length-1)]});
  float(WDN.x,WDN.y-50,'CRACK! Egg smashed','#f4e8d0');wfFury('smash');return true;}
Object.assign(SFX_DEF,{eggCrack:(a,B,o,t)=>{nz(a,B,o,t,.06,'highpass',3500,0,3,.8);nz(a,B,o,t+.04,.12,'bandpass',2200,900,4,.5);for(let i=0;i<4;i++)nz(a,B,o,t+.06+i*.04,.03,'bandpass',4000+i*500,0,6,.3);osc(a,o,t,'triangle',900,300,.08,.2);return .3;}});
tallyAddSect('drpeaks','Animals · The Dragon Peaks','🐉','#c89aff',[['wdegg','Dragon eggs eaten'],['wdeggx','Dragon eggs smashed']]);
// bite (E): at the nest, gulp an egg; when you're already full (Normal), the bite just cracks it
{const _te=tryEat;tryEat=function(){const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70;
  if(D.alt<.3&&wfEggs()>0&&!(D.eatCD>0)&&(wfNearNest(mx,my,60)||wfNearNest(D.x,D.y,45))){if(!G.easy&&D.hunger>=D.maxHunger-.5){D.eatCD=.6;D.eatT=.3;return wfSmash('bite');}return wfEat();}
  return _te.apply(this,arguments);};}
{const _ds=doStomp;doStomp=function(){const r=_ds.apply(this,arguments);if(wfNearNest(D.x,D.y,DR.stompR+40))wfSmash('stomp');return r;};}
{const _cs=clawScratch;clawScratch=function(){const was=D.scratchCD>0,r=_cs.apply(this,arguments);if(!was&&D.scratchCD>0&&typeof inScratch==='function'&&inScratch(WDN.x,WDN.y,30))wfSmash('claw');return r;};}
// ---------- per-frame: guarding, hunting near the nest, relaying, cougars ----------
function wfTick(dt){if(!G||!D||G.over)return;wfEggs();
  if(!DECOR.some(o=>o.k==='wdegg')){for(let i=DECOR.length-1;i>=0;i--){const o=DECOR[i];if(o.k!=='wdnest'&&d2(o.x,o.y,WDN.x,WDN.y)<(o.k==='peak'?190:130))DECOR.splice(i,1);} // clear rocks/crags off the nest so it reads clearly
    DECOR.push({k:'wdegg',x:WDN.x,y:WDN.y});}
  const near=d2(D.x,D.y,WDN.x,WDN.y)<WDN_R;
  if(near&&(!G.wdNearT||G.t-G.wdNearT>3)){G.wdNearT=G.t;wfFury('near');G.wdDefends=(G.wdDefends||0)+1;
    if(!G.wdGuardMsg||G.t-G.wdGuardMsg>20){G.wdGuardMsg=G.t;float(WDN.x,WDN.y-70,'SKRAAA! The roost rushes to guard the eggs!','#ffb070');}}
  G.wdCT=(G.wdCT||0)+dt;if(G.wdCT>20){G.wdCT=0;if(units.filter(u=>!u.dead&&u.species==='cougar'&&u.wdc).length<2)wdCougar();}
  if(G.wdShells){for(const s of G.wdShells){s.t+=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.vy+=320*dt;}G.wdShells=G.wdShells.filter(s=>s.t<.7);}}
{const _uw=updWD;updWD=function(u,dt){
  if(u.fury>G.t&&!(u.daze>0)){u.cd-=dt*.6;u.clawCD=(u.clawCD||0)-dt;const dd=dist(u,D);           // extra aggressive guards: faster bites + claw swipes
    if(u.st==='attack'&&dd<110&&u.clawCD<=0){u.clawCD=G.easy?2.6:1.6;const dmg=G.easy?1:2;hurtDragon(dmg,'wdragon');G.wdClaws=(G.wdClaws||0)+1;if(rnd()<.5)float(D.x+R(-20,20),D.y-heightOf()-60,`Wild dragon claw! -${dmg}`,'#ffb0a0');}}
  if(u.st==='fly'&&u.wp&&!u.wp.nb){if(rnd()<.55){const a=R(0,TAU),r=R(150,700);u.wp={x:WDN.x+Math.cos(a)*r,y:WDN.y+Math.sin(a)*r*.6,nb:1};}else u.wp.nb=1;} // hunt around the nest
  const r=_uw.apply(this,arguments);
  if(u.st==='attack'&&u.fury>G.t)u.atkT=Math.max(u.atkT,1);
  return r;};}
{const _uwd=wdMove;wdMove=function(u,tx,ty,sp,dt){return _uwd.call(this,u,tx,ty,u.fury>G.t&&u.st==='attack'?sp*1.25:sp,dt);};}
{const _ud=updFauna;updFauna=function(dt){const r=_ud.apply(this,arguments);try{wfTick(dt);}catch(e){}return r;};}
// ---------- drawing ----------
function drawEggNest(o){const x=o.x,y=o.y,n=wfEggs();ell(x,y+6,64,20,'rgba(0,0,0,.25)');
  for(let i=0;i<12;i++){const a=i/12*TAU,rx=x+Math.cos(a)*50,ry=y+Math.sin(a)*16;ell(rx,ry,13,8,i%2?'#8a8078':'#a49a90');ell(rx-3,ry-3,5,3,'#c4bab0');}
  ell(x,y-1,42,13,'#7a5a30');ell(x,y-3,34,10,'#5a3e1e');
  ctx.strokeStyle='#b08a50';ctx.lineWidth=2;for(let i=0;i<10;i++){const a=i*.63;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*38,y-2+Math.sin(a)*11);ctx.lineTo(x+Math.cos(a+1.1)*33,y-2+Math.sin(a+1.1)*10);ctx.stroke();}
  const P=[[-20,-4],[-6,-7],[8,-6],[21,-3],[0,1]];
  for(let e=0;e<n;e++){const [ex,ey]=P[e],c=WD_EGG[(e*3+1)%WD_EGG.length],wob=Math.sin(G.t*2.4+e*1.7)*.07;ctx.save();ctx.translate(x+ex,y+ey-6);ctx.rotate(wob);
    ell(0,0,7.5,10,c);ctx.fillStyle='rgba(90,60,120,.35)';for(let k=0;k<5;k++){ctx.beginPath();ctx.arc(Math.cos(k*2.4+e)*4,Math.sin(k*1.9+e)*6,1.3,0,TAU);ctx.fill();}
    ell(-2.5,-4,2,3,'rgba(255,255,255,.75)');ctx.restore();}
  if(G.wdShells)for(const s of G.wdShells){const k=1-s.t/.7;ctx.globalAlpha=k;poly([s.x-3,s.y,s.x,s.y-4,s.x+3,s.y,s.x,s.y+2],s.c);ctx.globalAlpha=1;}
  if(d2(D.x,D.y,x,y)<WDN_R+300)txt('Dragon egg nest',x,y-34,11,'rgba(255,240,210,.85)','center',true);}
{const _dd=drawDecor;drawDecor=function(o){if(o.k==='wdegg'){drawEggNest(o);return;}_dd(o);};}
{const _sm=drawSeaMap;drawSeaMap=function(X,Y,big,q){_sm.apply(this,arguments);if(seen(WDN.x,WDN.y)){ctx.fillStyle='#ffe08a';ctx.fillRect(X(WDN.x)-q,Y(WDN.y)-q,q*2,q*2);}};}
// ---------- save / load ----------
{const _ss=svSnapshot;svSnapshot=function(){wfEggs();G.wdEggS=[G.wdEggs,D.fireBonus||0];return _ss.apply(this,arguments);};}
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);if(Array.isArray(G.wdEggS)){G.wdEggs=clamp(G.wdEggS[0]|0,0,WDN_MAX);D.fireBonus=Math.max(0,G.wdEggS[1]|0);D.maxFire=wfFireMax();D.fire=Math.min(D.fire==null?D.maxFire:D.fire,D.maxFire);}G.wdShells=[];return r;};}
// fire bonus carry-over between castle levels (same life); a brand-new game / death resets it
let WF_CARRY=null;
{const _nl=nextLevel;nextLevel=function(){WF_CARRY={fb:D.fireBonus||0};try{return _nl.apply(this,arguments);}finally{WF_CARRY=null;}};}
{const _ng=newGame;newGame=function(){const c=WF_CARRY;const r=_ng.apply(this,arguments);D.fireBonus=c?c.fb:0;D.maxFire=wfFireMax();D.fire=D.maxFire;return r;};}
