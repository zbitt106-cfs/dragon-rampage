// ======================= partKA: KING WILLIAM'S GOLDEN ARMOUR =======================
// When the dragon threatens Castle Aldric, King William runs into the keep, dons his golden armour (~3.5 s) and comes out to fight
// as a mini-boss beside his guards (leashed near the castle). At 30% health he retreats into the keep, the stone-roofed hall where
// Princess Elizabeth is kept: there he is safe (not targetable) and slowly heals, and after a cooldown he can come out again.
// Family-friendly: the king can NEVER be eaten or killed. His HP never drops below a floor, whatever hits him.
const KA_CFG={trigR:520,castleR:700,suit:3.5,walk:70,fleeSp:120,leash:360,reach:70,flee:.3,floor:.12,heal:.03,cd:35,backAt:.9,
  calm:30,biteDmg:40,armFire:.55,armHit:.8,bashCd:6,bashPush:40};
const KA={phase:'home',t:0,u:null,hp:0,maxHp:0,inT:-99,calmT:0,flees:0,outs:0,hx:KING.x,hy:KING.y,clangT:-9,peek:false};
function kaStats(){const l=Math.max(1,G.lvl||1),ez=!!G.easy;
  return{hp:Math.round(Math.min(1600,600+100*(l-1))*(ez?.75:1)),dmg:Math.round(Math.min(22,10+1.5*(l-1))*(ez?.7:1)),atkCd:1.1,
    bash:Math.round((8+l)*(ez?.7:1)),bashCd:KA_CFG.bashCd};}
function kaDoor(){return{x:KEEP_POS.x,y:KEEP_POS.y+8};}
function kaOut(){return KA.phase==='fight'||KA.phase==='flee';}
function kaThreat(){if(G.over||G.won)return false;
  return(d2(D.x,D.y,KA.hx,KA.hy)<KA_CFG.trigR&&D.alt<.6)||(d2(D.x,D.y,CASTLE.x,CASTLE.y)<KA_CFG.castleR&&(G.sinceDmg==null?99:G.sinceDmg)<2);}
function kaReset(){if(KA.u){const i=units.indexOf(KA.u);if(i>=0)units.splice(i,1);}
  Object.assign(KA,{phase:'home',t:0,u:null,hp:0,maxHp:0,inT:-99,calmT:0,flees:0,outs:0,clangT:-9});KING.x=KA.hx;KING.y=KA.hy;}
function kaSpawn(msg){const S=kaStats(),p=kaDoor();KA.maxHp=S.hp;if(!(KA.hp>0))KA.hp=S.hp;
  const u=mkUnit('knight',p.x,p.y+6,{hp:KA.hp,maxHp:S.hp,atk:.6,colr:'#ffd23a',isKingArmor:true,isKing:true,born:G.t,bashT:2,anim:0});
  KA.u=u;units.push(u);KA.phase='fight';KA.calmT=0;KA.outs++;sparkle(p.x,p.y-20,16);
  float(p.x,p.y-90,msg,'#ffe08a');if(typeof SFX!=='undefined'&&SFX.play)SFX.play('fanfare');}
function kaInside(){const u=KA.u;if(u){KA.hp=u.hp;const i=units.indexOf(u);if(i>=0)units.splice(i,1);}KA.u=null;}
function updKA(dt){if(scene!=='play'||!G||G.over||G.won)return;KA.t+=dt;const thr=kaThreat(),p=kaDoor();
  if(KA.phase==='home'){if(thr&&G.t-KA.inT>KA_CFG.cd){KA.phase='toArmory';kingSay('To the armoury! Fetch my golden armour!');}}
  else if(KA.phase==='toArmory'){const dx=p.x-KING.x,dy=p.y-KING.y,dd=Math.hypot(dx,dy),s=Math.min(dd,KA_CFG.walk*dt);
    if(dd>3){KING.x+=dx/dd*s;KING.y+=dy/dd*s;}else{KA.phase='suit';KA.t=0;
      G.banner={text:'King William dons his golden armor!',sub:'Suiting up in the keep\'s armoury… he will come out fighting!',t:3};
      if(typeof SFX!=='undefined'&&SFX.play)SFX.play('crashStone',p.x,p.y,.25);}}
  else if(KA.phase==='suit'){if(KA.t>=KA_CFG.suit){KA.hp=0;kaSpawn('King William: "Have at thee, foul beast!"');}}
  else if(KA.phase==='fight'||KA.phase==='flee'){const u=KA.u;
    // guard: nothing may take the king away (lava, water, predators, anything that sets .dead directly)
    if(u&&(u.dead||u.gone||u.eaten||!(u.hp>0)||!isFinite(u.x)||!isFinite(u.y))){u.dead=false;u.gone=false;u.eaten=false;u.hp=Math.max(u.hp>0?u.hp:0,u.maxHp*KA_CFG.floor);
      if(!isFinite(u.x)||!isFinite(u.y)){u.x=p.x;u.y=p.y+6;}}
    if(u&&units.indexOf(u)<0)units.push(u);
    if(u){KING.x=u.x;KING.y=u.y;KA.hp=u.hp;}
    if(KA.phase==='fight'){if(thr)KA.calmT=0;else KA.calmT+=dt;
      if(u&&u.hp<=u.maxHp*KA_CFG.flee){KA.phase='flee';KA.flees++;
        G.banner={text:'King William retreats to safety!',sub:'He hurries into the keep to Princess Elizabeth, safe under its stone roof, to rest and heal',t:3.2};
        float(u.x,u.y-90,'King William: "Fall back! To the keep!"','#ffe08a');}
      else if(KA.calmT>KA_CFG.calm){KA.phase='flee';KA.disarm=true;}}}
  else if(KA.phase==='shelter'){KA.hp=Math.min(KA.maxHp,KA.hp+KA.maxHp*KA_CFG.heal*dt);
    if(thr&&KA.hp>=KA.maxHp*KA_CFG.backAt&&G.t-KA.inT>=KA_CFG.cd)kaSpawn('King William returns, armour polished! "Again, beast!"');
    else if(!thr&&KA.hp>=KA.maxHp&&G.t-KA.inT>=KA_CFG.cd){KA.phase='toHome';KING.x=p.x;KING.y=p.y;KA.hp=0;}}
  else if(KA.phase==='toHome'){const dx=KA.hx-KING.x,dy=KA.hy-KING.y,dd=Math.hypot(dx,dy),s=Math.min(dd,KA_CFG.walk*dt);if(dd>3){KING.x+=dx/dd*s;KING.y+=dy/dd*s;}else{KING.x=KA.hx;KING.y=KA.hy;KA.phase='home';}}
  // save-friendly mirror (plain values on G): only 'home' or 'shelter' survive a reload
  G.kaPh=KA.phase==='shelter'||KA.phase==='flee'?'shelter':'home';G.kaHpF=KA.maxHp?+(KA.hp/KA.maxHp).toFixed(3):1;G.kaIn=Math.max(0,KA_CFG.cd-(G.t-KA.inT));}
// the armoured king's own fighting brain (replaces the normal knight AI for him)
function kaStep(u,dt){const S=kaStats(),p=kaDoor();u.retreat=false;u.burn=0;u.post=null;u.atk-=dt;u.bashT=(u.bashT||0)-dt;u.swing=Math.max(0,(u.swing||0)-dt);u.bashFx=Math.max(0,(u.bashFx||0)-dt);
  if(KA.phase==='flee'){if(moveTo(u,p.x,p.y+4,KA_CFG.fleeSp,dt)||dist(u,p)<14){kaInside();
      if(KA.disarm){KA.disarm=false;KA.phase='toHome';KING.x=p.x;KING.y=p.y;KA.hp=0;KA.inT=G.t-KA_CFG.cd+10;}
      else{KA.phase='shelter';KA.inT=G.t;float(p.x,p.y-110,'King William is safe inside the keep with Princess Elizabeth','#ffe08a');}}return;}
  const dd=dist(u,D),low=D.alt<DR.hitAltSword,inLeash=d2(D.x,D.y,KA.hx,KA.hy)<KA_CFG.leash+80;
  if(inLeash&&low){
    if(dd>KA_CFG.reach)moveTo(u,D.x,D.y,95,dt);
    else{u.face=D.x>u.x?1:-1;u.anim+=dt*4;
      if(u.bashT<=0&&dd<KA_CFG.reach+10){u.bashT=S.bashCd;u.bashFx=.35;hurtDragon(S.bash,'bash');const a=Math.atan2(D.y-u.y,D.x-u.x),nx=D.x+Math.cos(a)*KA_CFG.bashPush,ny=D.y+Math.sin(a)*KA_CFG.bashPush;
        const inC=(x,y)=>x>CWALL.x0&&x<CWALL.x1&&y>CWALL.y0&&y<CWALL.y1;if(inC(nx,ny)===inC(D.x,D.y)){D.x=nx;D.y=ny;}D.hurt=.3;G.shake=Math.max(G.shake,5);
        float(D.x,D.y-100,`Royal shield bash! -${S.bash}`,'#ffe08a');}
      else if(u.atk<=0){u.atk=S.atkCd;u.swing=.3;hurtDragon(S.dmg,'sword');if(rnd()<.35)float(u.x,u.y-80,['For Castle Aldric!','Taste royal steel!','Begone, beast!','For Princess Elizabeth!'][RI(0,3)],'#ffe08a');}}}
  else{// the dragon is up in the air or beyond his leash: hold the line between the keep and the dragon
    const a=Math.atan2(D.y-KA.hy,D.x-KA.hx),r=Math.min(KA_CFG.leash*.6,dist(D,{x:KA.hx,y:KA.hy})),tx=KA.hx+Math.cos(a)*r,ty=KA.hy+Math.sin(a)*r;
    if(d2(u.x,u.y,tx,ty)>8)moveTo(u,tx,ty,80,dt);u.face=D.x>u.x?1:-1;}
  // never stray far from the castle
  const lx=u.x-KA.hx,ly=u.y-KA.hy,ld=Math.hypot(lx,ly);if(ld>KA_CFG.leash){u.x=KA.hx+lx/ld*KA_CFG.leash;u.y=KA.hy+ly/ld*KA_CFG.leash;}}
// a bite on the golden armour: CLANG, a dent and a shove, never a gulp
function kaBitten(u){const S=u.maxHp;hurtUnit(u,KA_CFG.biteDmg,'bite');const a=Math.atan2(u.y-D.y,u.x-D.x);u.x+=Math.cos(a)*30;u.y+=Math.sin(a)*30;
  D.eatCD=.7;D.eatT=.3;D.hp-=3*G.dmgMul;D.hurt=.3;float(u.x,u.y-90,'CLANG! Golden armour! King William can\'t be eaten','#ffd27a');sparkle(u.x,u.y-30,6);}
// ---- hooks ----
const _updKnightKA=updKnight;updKnight=function(u,dt){if(u&&u.isKingArmor){if(u===KA.u)kaStep(u,dt);else{u.dead=true;u.gone=true;}return;}return _updKnightKA.apply(this,arguments);};
const _hurtUnitKA=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.isKingArmor){if(!kaOut()||!(d>0))return;
    d*=(src==='fire'||src==='lava'||src==='burn')?KA_CFG.armFire:KA_CFG.armHit;u.hp=Math.max(u.maxHp*KA_CFG.floor,u.hp-d);u.burn=0;
    if(G.t-KA.clangT>.8){KA.clangT=G.t;float(u.x+R(-10,10),u.y-70,src==='fire'?'The golden armour glows hot!':'CLANG!','#ffe08a');}return;}
  return _hurtUnitKA.apply(this,arguments);};
const _eatUnitKA=eatUnit;eatUnit=function(u){if(u&&u.isKingArmor){kaBitten(u);return;}return _eatUnitKA.apply(this,arguments);};
const _biteTargetsKA=biteTargets;biteTargets=function(){const T=_biteTargetsKA.apply(this,arguments);return KA.peek?T:T.filter(u=>!u.isKingArmor);};
const _tryEatKA=tryEat;tryEat=function(){if(KA.u&&kaOut()){KA.peek=true;let T;try{T=biteTargets();}finally{KA.peek=false;}
    if(T.length&&T[0].isKingArmor){kaBitten(T[0]);return;}}return _tryEatKA.apply(this,arguments);};
const _updateKA=update;update=function(dt){const r=_updateKA.apply(this,arguments);updKA(dt);return r;};
const _newGameKA=newGame;newGame=function(){const r=_newGameKA.apply(this,arguments);KA.u=null;kaReset();return r;};
{const _sa=svApply;svApply=function(d){const r=_sa.apply(this,arguments);kaReset();units=units.filter(u=>!u.isKingArmor);
  if(G.kaPh==='shelter'){KA.phase='shelter';KA.maxHp=kaStats().hp;KA.hp=KA.maxHp*Math.max(KA_CFG.floor,Math.min(1,+G.kaHpF||KA_CFG.flee));KA.inT=G.t-(KA_CFG.cd-Math.max(0,Math.min(KA_CFG.cd,+G.kaIn||0)));}
  return r;};}
// ---- drawing ----
// the plain robed king is only drawn while he is unarmoured in the courtyard (or walking to/from the keep door)
const _drawKingKA=drawKing;drawKing=function(){if(KA.phase==='home'||KA.phase==='toArmory'||KA.phase==='toHome')return _drawKingKA.apply(this,arguments);};
function kaGold(y0,y1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#fff6b0');g.addColorStop(.45,'#f2c232');g.addColorStop(1,'#9a6a10');return g;}
function kaFig(x,y,f,s,an,sw,bash){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const g=Math.sin(an*1.5),t=G.t||0;
  ell(0,2,12,4,'rgba(0,0,0,.3)');
  poly([-6,-19,6,-19,9+f*-2,-1,-9+f*-2+Math.sin(t*3)*1.5,-1],'#a8142a');                                     // royal red cape
  line(-4,-7,-4+g*2,0,'#c9a227',3.2);line(4,-7,4-g*2,0,'#c9a227',3.2);ell(-4+g*2,.5,2.6,1.4,'#8a6a10');ell(4-g*2,.5,2.6,1.4,'#8a6a10');
  ctx.fillStyle=kaGold(-21,-6);ctx.beginPath();ctx.moveTo(-7,-6);ctx.lineTo(-8,-20);ctx.lineTo(8,-20);ctx.lineTo(7,-6);ctx.closePath();ctx.fill();
  rect(-7,-9,14,2,'#7a4a10');ell(0,-14.5,2.2,2.2,'#e8342a');ell(-8,-19.5,3.6,2.6,'#f2c232');ell(8,-19.5,3.6,2.6,'#f2c232');
  ctx.fillStyle=kaGold(-31,-20);ctx.beginPath();ctx.arc(0,-25,5.8,0,TAU);ctx.fill();rect(-4+f*1.2,-26,8,1.3,'#3a2a10');ell(0,-20.3,4,1.8,'#efece4'); // helm, visor slit, beard
  poly([-5.5,-29,-5.5,-35,-3,-32,0,-37,3,-32,5.5,-35,5.5,-29],'#ffd23a');ell(0,-32,1.1,1.1,'#e8342a');ell(-4,-31.5,.8,.8,'#3a7af0');ell(4,-31.5,.8,.8,'#3a7af0'); // crown-helm
  const bx=-f*(bash?13:10);poly([bx-6,-22,bx+6,-22,bx+6,-12,bx,-5,bx-6,-12],'#ffd23a');poly([bx-4.6,-20.6,bx+4.6,-20.6,bx+4.6,-12.5,bx,-6.8,bx-4.6,-12.5],'#1f3f9a'); // shield
  poly([bx-2.5,-15,bx-2.5,-18,bx-1.2,-16.6,bx,-18.6,bx+1.2,-16.6,bx+2.5,-18,bx+2.5,-15],'#ffd23a');
  if(sw){line(f*6,-16,f*26,-22,'#f4f6ff',2.6);line(f*7,-19,f*9,-13,'#ffd23a',1.8);}
  else{line(f*7,-15,f*11,-38,'#f4f6ff',2.4);line(f*4.5,-17.5,f*10.5,-16,'#ffd23a',1.8);ell(f*7,-14,1.4,1.4,'#ffd23a');}
  ctx.restore();
  if(((t*6)|0)%5===0){const a=t*2.3,sx=x+Math.cos(a*3)*9*s,sy=y-(18+Math.sin(a*5)*10)*s;line(sx-4,sy,sx+4,sy,'#fff',1.2);line(sx,sy-4,sx,sy+4,'#fff',1.2);}} // golden glint
function drawArmoredKing(u){const s=1.45;kaFig(u.x,u.y,u.face||1,s,u.anim||0,u.swing>0,u.bashFx>0);
  if(u.bashFx>0){ctx.strokeStyle=`rgba(255,230,140,${u.bashFx*2})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(u.x,u.y-20,40*(1.4-u.bashFx),18*(1.4-u.bashFx),0,0,TAU);ctx.stroke();}
  const w=52,f=Math.max(0,Math.min(1,u.hp/u.maxHp)),by=u.y-66;rect(u.x-w/2-2,by-2,w+4,8,'rgba(0,0,0,.65)');rect(u.x-w/2,by,w*f,4,f>KA_CFG.flee+.2?'#ffd23a':f>KA_CFG.flee?'#f0a040':'#e05040');
  txt('👑 King William',u.x,by-5,10,'#ffe08a','center');}
const _drawKnightKA=drawKnight;drawKnight=function(u){if(u&&u.isKingArmor){drawArmoredKing(u);return;}return _drawKnightKA.apply(this,arguments);};
// when the keep roof is broken you can see him inside, guarding Princess Elizabeth
const _drawInsidePrincessKA=drawInsidePrincess;drawInsidePrincess=function(x,y){_drawInsidePrincessKA.apply(this,arguments);if(KA.phase==='shelter')kaFig(x+24,y+6,-1,1.05,0,false,false);};
// overlays drawn above the castle: suiting up at the keep door, and the sheltering king's healing bar over the keep
const _drawCrashFxKA=drawCrashFx;drawCrashFx=function(){_drawCrashFxKA.apply(this,arguments);if(scene!=='play'||!G)return;const p=kaDoor();
  if(KA.phase==='suit'){const k=Math.min(1,KA.t/KA_CFG.suit),pu=.5+.5*Math.sin(G.t*10);ell(p.x,p.y-14,26+8*pu,14+4*pu,`rgba(255,220,90,${.25+.25*pu})`);
    txt(['*clank*','*clink*','*CLANK*'][((G.t*3)|0)%3],p.x+(((G.t*3)|0)%2?-22:22),p.y-40-8*pu,12,'#fff3b0','center');
    rect(p.x-36,p.y-70,72,8,'rgba(0,0,0,.65)');rect(p.x-34,p.y-68,68*k,4,'#ffd23a');txt('Suiting up!',p.x,p.y-76,11,'#ffe08a','center');}
  if(KA.phase==='shelter'&&d2(D.x,D.y,KEEP_POS.x,KEEP_POS.y)<1400){const f=KA.maxHp?KA.hp/KA.maxHp:1,y=KEEP_POS.y-170,w=120;
    txt('🛡 King William is resting in the keep',KEEP_POS.x,y-6,11,'#ffe08a','center');rect(KEEP_POS.x-w/2-2,y-2,w+4,9,'rgba(0,0,0,.65)');rect(KEEP_POS.x-w/2,y,w*f,5,'#7ad070');}};
