// ================= partRK: HOARD RAID TIERS - the raiding champion scales with the lair gold when the raid is announced =================
// Tier 1 at 100 gold, 2 at 250, 3 at 500, 4 at 1000, then +1 per extra 1000 (2000 = 5, 3000 = 6, ...).
// Timing: a raid comes every 300s (420s on Easy) after the previous one ends, gold growth or not, whenever the hoard holds
// at least 100 gold (140 on Easy); the HOARD at announcement decides HOW STRONG it is.
// Gentle scaling, headcount capped at 8 escorts (9 bodies) so phones stay smooth.
const RK={cap:8,spearCap:6,archCap:3};
function raidTier(g){g=Math.floor(g||0);if(g<100)return 0;if(g<250)return 1;if(g<500)return 2;if(g<1000)return 3;return 4+Math.floor((g-1000)/1000);}
function raidTierStats(T,n,lvl,easy){T=Math.max(1,T);const lv=1+.15*((lvl||1)-1),ez=easy?.75:1;
  const hp=Math.round((150+60*Math.min(T-1,5)+30*Math.max(0,T-6)+15*Math.min(n||0,4))*lv*ez);
  const dmg=Math.min(1.6,1+.1*(T-1));
  let spears=Math.min(RK.spearCap,1+T+((lvl||1)>1?1:0)-(easy?1:0)),archers=T>=3?Math.min(RK.archCap,T-2):0;
  while(spears+archers>RK.cap)spears--;spears=Math.max(1,spears);
  const eHp=Math.min(66,30+6*(T-1)),aHp=Math.min(44,22+4*(T-3));return{T,hp,dmg,spears,archers,esc:spears+archers,eHp,aHp};}
{const _w=startRaidWarning;startRaidWarning=function(){const g=G.stash||0,T=Math.max(1,raidTier(g));const r0=_w.apply(this,arguments);const r=RAID.cur;if(!r)return r0;
  const S=raidTierStats(T,r.n,G.lvl,G.easy);Object.assign(r,{tier:T,hp:S.hp,dmgM:S.dmg,esc:S.spears,arch:S.archers,eHp:S.eHp,aHp:S.aHp,tierGold:Math.floor(g)});
  if(G.banner){G.banner.text=`${r.name} (Tier ${T}) rides for your hoard!`;
    G.banner.sub=`Hoard Raid ${r.n+1}: a champion, ${S.spears} spear${S.spears>1?'s':''}${S.archers?` and ${S.archers} archer${S.archers>1?'s':''}`:''} march out in ${RAID_WARN} seconds. Guard your gold!`;}
  if(typeof showToast==='function')showToast(`⚔ ${r.short} (Tier ${T}) rides for your hoard!`);return r0;};}
{const _s=spawnRaid;spawnRaid=function(){const r=RAID.cur;const x0=r.members.length;const res=_s.apply(this,arguments);if(!r.tier)return res;
  for(const u of r.members){if(u.raidEsc){u.hp=u.maxHp=r.eHp;}u.dmgM=r.dmgM;}
  const x=GATE.x,y=GATE.y+12,A=[];for(let i=0;i<(r.arch||0);i++){const u=mkUnit('archer',x+R(-20,20),y+20+i*6,{hp:r.aHp,maxHp:r.aHp,shootT:R(1,3),raid:r,raidEsc:true,born:G.t,dmgM:r.dmgM});A.push(u);}
  r.members.push(...A);units.push(...A);return res;};}
// raid archers loose arrows from range instead of waiting for the dragon to land beside them
{const _r=raidStep;raidStep=function(u,dt){if(u.raid&&u.type==='archer'&&!u.champ&&dist(u,D)<400&&!G.over)return false;return _r.apply(this,arguments);};}
// tier damage: the champion's (and escorts') blows hit a little harder per tier
let RK_DM=1;
{const _k=updKnight;updKnight=function(u,dt){if(!u.dmgM)return _k.apply(this,arguments);RK_DM=u.dmgM;try{return _k.apply(this,arguments);}finally{RK_DM=1;}};}
{const _f=typeof raidFight==='function'?raidFight:null;if(_f)raidFight=function(u,dt){if(!u.dmgM)return _f.apply(this,arguments);RK_DM=u.dmgM;try{return _f.apply(this,arguments);}finally{RK_DM=1;}};}
{const _a=updArcher;updArcher=function(u,dt){if(!u.dmgM)return _a.apply(this,arguments);const n0=projs.length;const r=_a.apply(this,arguments);for(let i=n0;i<projs.length;i++)if(projs[i].kind==='arrow')projs[i].dmg*=u.dmgM;return r;};}
{const _c=typeof updCavalry==='function'?updCavalry:null;if(_c)updCavalry=function(u,dt){if(!u.dmgM)return _c.apply(this,arguments);RK_DM=u.dmgM;try{return _c.apply(this,arguments);}finally{RK_DM=1;}};}
{const _h=hurtDragon;hurtDragon=function(d,src){if(RK_DM!==1)arguments[0]=d*RK_DM;return _h.apply(this,arguments);};}
// the SHARE of the hoard a champion can carry off grows with the tier, but is only ever PART of it (never all):
// T1 20%, T2 25%, T3 30%, T4 35%, T5 40%, T6 45%, T7+ 50% (cap). Stop him (beat or eat him) and you keep / win it all back.
function raidShare(T){return Math.min(.5,.2+.05*(Math.max(1,T)-1));}
function raidTake(stash,T){stash=Math.floor(stash||0);if(stash<=1)return 0;return Math.max(1,Math.min(stash-1,Math.floor(stash*raidShare(T))));}
{const _g=raidGrab;raidGrab=function(){const r=RAID.cur;if(!r||!r.tier)return _g.apply(this,arguments);const ch=r.champ,take=raidTake(G.stash,r.tier);
  r.loot=take;G.stash-=take;r.phase='flee';r.back=raidRoute().reverse().slice(1);r.back.push({x:GATE.x,y:GATE.y+10});
  for(let i=0;i<10;i++)sparkle(HX(),HY(),2);float(ch.x,ch.y-70,`${r.short} grabs ${take} gold!`,'#ff8a5a');
  G.banner={text:`${r.name} (Tier ${r.tier}) has stolen ${take} gold!`,sub:`A Tier ${r.tier} champion carries off ${Math.round(raidShare(r.tier)*100)}% of a hoard. Stop him before the sack reaches the castle gate!`,t:4.5};
  if(typeof SFX!=='undefined')SFX.play('clink');showToast(`💰 ${r.short} is running off with ${take} gold!`);};}
// ---------- heavy loot: a champion carrying stolen gold walks home SLOWER, with visible gold sacks ----------
// speed x(1 - .45*min(1, loot/600)): 100 gold ~92%, 300 ~78%, 600+ = 55%. Stop him on the way and it all drops back into the lair pile.
const RK_SLOW={full:600,min:.55};
function raidLootMul(loot){return Math.max(RK_SLOW.min,1-(1-RK_SLOW.min)*Math.min(1,(loot||0)/RK_SLOW.full));}
let RK_SPD=1,RK_U=null;
{const _m=moveTo;moveTo=function(u,tx,ty,sp,dt){if(RK_U&&u===RK_U&&RK_SPD!==1)arguments[3]=sp*RK_SPD;return _m.apply(this,arguments);};}
{const _r=raidStep;raidStep=function(u,dt){const r=u.raid;if(u.champ&&r&&r.phase==='flee'&&r.loot>0){RK_U=u;RK_SPD=raidLootMul(r.loot);try{return _r.apply(this,arguments);}finally{RK_U=null;RK_SPD=1;}}return _r.apply(this,arguments);};}
function rkSacks(u){const r=u.raid;if(!r||!(r.loot>0))return 0;return Math.min(4,1+Math.floor(r.loot/150));}
function drawLootSacks(u){const n=rkSacks(u);if(!n)return;const f=u.face||1,b=Math.sin((u.anim||0)*2)*1.2,base=u.mounted?-22:-10;
  for(let i=0;i<n;i++){const sx=u.x-f*(7+i*4)+(i%2?f*2:0),sy=u.y+base-(i>>1)*6+b*(i%2?1:-1),s=5+Math.min(3,r_loot(u)/200);
    ell(sx,sy,s,s+1.2,'#b88a3e');ell(sx,sy-s-.5,s*.55,1.4,'#7a5a28');line(sx-s*.5,sy-s+.4,sx+s*.5,sy-s+.4,'#e8c050',1);
    if(Math.sin(G.t*6+i*1.7)>.55)ell(sx+R(-2,2),sy-s-2,1.2,1.2,'#fff4b0');ell(sx-1,sy-1,1.6,1.6,'#ffd84a');}}
const r_loot=u=>(u.raid&&u.raid.loot)||0;
{const _d=drawKnight;drawKnight=function(u){const res=_d.apply(this,arguments);if(u.champ&&u.raid&&u.raid.phase==='flee')drawLootSacks(u);return res;};}
// stopped on the way back: the dropped sacks go straight back to the lair pile with a "+N" pop (plus the usual bonus)
{const _c=raidChampDown;raidChampDown=function(u,eaten){const r=u&&u.raid,live=r&&RAID.cur===r&&!r.done,back=live?(r.loot||0):0;const res=_c.apply(this,arguments);
  if(live&&back>0){G.rkReturned=(G.rkReturned||0)+back;if(typeof GA!=='undefined')GA.pop.push({n:back,t:0});puff(u.x,u.y-10,12,'rgba(255,216,74,',150,5);float(u.x,u.y-56,`The gold sacks drop: ${back} gold back to your hoard!`,'#ffd84a');}
  return res;};}
