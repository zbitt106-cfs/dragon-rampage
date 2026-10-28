// ======================= HOARD CARRY-OVER: the lair gold pile and trophy banners survive between castle levels on the same life =======================
// Reset only on a brand-new game (title, restart) or after the dragon dies (game over).
let HOARD_CARRY=null;
{const _nl=nextLevel;nextLevel=function(){
  const stash=Math.max(0,Math.round(G.stash||0));
  HOARD_CARRY={stash,raid:{n:RAID.n,thr:RAID.thr,cd:RAID.cd},trophies:TROPHIES.slice(),hpBonus:D.hpBonus||0,hpUps:D.hpUps||0,feastBonus:D.feastBonus||0,food:D.food||0,glutN:D.glutN||0};
  G.bank-=stash*5; // the carried hoard keeps scoring 5/gold from the new level's score, so don't bank it twice
  let r;try{r=_nl.apply(this,arguments);}finally{HOARD_CARRY=null;}
  if(stash>0){const msg=`Hoard carried over: ${stash} gold`;G.hoardCarry=stash;
    if(G.banner)G.banner.sub=(G.banner.sub?G.banner.sub+'  ·  ':'')+msg;else G.banner={text:`Castle Level ${G.lvl}`,sub:msg,t:4.5};
    float(LAIR.x,LAIR.y-80,msg,'#ffd84a');if(typeof showToast==='function')showToast('💰 '+msg);}
  return r;};}
{const _ng=newGame;newGame=function(){const c=HOARD_CARRY;const r=_ng.apply(this,arguments);
  if(c){D.food=c.food||0;D.glutN=c.glutN||0;D.feastBonus=c.feastBonus||0;}
  if(c&&c.hpBonus>0){D.hpBonus=c.hpBonus;D.hpUps=c.hpUps;D.baseMaxHp=D.maxHp;D.maxHp+=c.hpBonus;D.hp=D.maxHp;} // monster-feast max-health bonus stays on the same life
  if(c){G.stash=c.stash;G.hoardCarry=c.stash;if(typeof HOARD!=='undefined'){HOARD.shown=c.stash;HOARD.bump=0;}
    RAID.n=c.raid.n;RAID.thr=c.raid.thr;RAID.cd=Math.max(c.raid.cd||0,45);RAID.cur=null; // thresholds already passed stay passed
    TROPHIES.length=0;c.trophies.forEach((t,i)=>{const s=trophySlot(i);TROPHIES.push(Object.assign({},t,{x:s.x,y:s.y,a:s.a,t0:-5,raidRef:null}));});}
  else{TROPHIES.length=0;if(G)G.hoardCarry=0;}
  return r;};}
