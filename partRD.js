// ======================= HOARD RAIDS: brave named knights come for the dragon's gold =======================
const RAID_NAMES=['Sir Gareth the Bold','Sir Roland Ironheart','Dame Elara the Brave','Sir Percival Stoutshield','Dame Isolde of the Silver Lance','Sir Bertram the Unshaken','Sir Cedric Goldspur','Dame Rowena Stormbanner','Sir Tobias the Tall','Sir Aldous Dragonbane','Dame Mirabel the Fearless','Sir Hugo Thunderhelm','Dame Gwendolyn Lionheart','Sir Lancelot the Lesser','Sir Fergus Two-Swords','Dame Beatrix the Bright'];
const RAID_COLS=[['#c8282e','#ffd23a','lion'],['#2a4fb8','#f4f4f4','star'],['#2f8f3a','#ffd23a','tree'],['#7a2fa0','#ffe08a','crown'],['#d86a12','#1a1a1a','sun'],['#16807e','#f4f4f4','moon'],['#b81e6e','#ffe08a','rose'],['#30343c','#e83a2a','bolt']];
const RAID_THR=[100,200,350,550,850],RAID_CD=300,RAID_CD_EASY=420,RAID_WARN=8; // cooldown = seconds of play time after a raid ends
let RAID={n:0,thr:0,cd:0,cur:null},RAID_NAME_I=Math.floor(Math.random()*RAID_NAMES.length),RAID_COL_I=Math.floor(Math.random()*8);
function raidThreshold(i){const e=G.easy?1.4:1;return Math.round((i<RAID_THR.length?RAID_THR[i]:RAID_THR[RAID_THR.length-1]+(i-RAID_THR.length+1)*400)*e);}
function raidActive(){return !!RAID.cur;}
function raidHudOn(){return !!RAID.cur&&scene==='play';}
function startRaidWarning(){const n=RAID.n,name=RAID_NAMES[RAID_NAME_I%RAID_NAMES.length];RAID_NAME_I++;const c=RAID_COLS[(RAID_COL_I++)%RAID_COLS.length];
  const esc=Math.min(8,2+n+(G.lvl>1?1:0)-(G.easy?1:0)),hp=Math.round((150+70*n)*(1+.15*(G.lvl-1))*(G.easy?.75:1));
  RAID.cur={n,name,short:name.split(' ').slice(0,2).join(' '),dame:name.startsWith('Dame'),col:c[0],trim:c[1],crest:c[2],esc,hp,phase:'warn',t:RAID_WARN,champ:null,members:[],loot:0,path:null};
  G.banner={text:`${name} vows before King William to claim the dragon's hoard!`,sub:`Hoard Raid ${n+1}: a champion and ${esc} spear${esc>1?'s':''} march out in ${RAID_WARN} seconds. Guard your gold!`,extra:n===0?'Defeat or eat the champion to win back any stolen gold, plus a bonus.':'',t:4.5};
  G.shake=Math.max(G.shake,6);if(typeof SFX!=='undefined')SFX.play('raidHorn');showToast(`⚔ ${name} is coming for your hoard!`);}
function spawnRaid(){const r=RAID.cur;r.phase='march';const x=GATE.x,y=GATE.y+12;
  const ch=mkUnit('knight',x,y,{hp:r.hp,maxHp:r.hp,atk:0,colr:r.col,champ:true,raid:r,born:G.t});r.champ=ch;r.members.push(ch);
  for(let i=0;i<r.esc;i++){const u=mkUnit('knight',x+R(-20,20),y+10+i*6,{hp:30+6*r.n,maxHp:30+6*r.n,atk:0,foot:true,colr:r.col,raid:r,raidEsc:true,flag:i<2,born:G.t});r.members.push(u);}
  units.push(...r.members);G.gateOpenT=Math.max(G.gateOpenT||0,3);
  r.path=raidRoute();
  float(x,y-60,`${r.short}: "For King William!"`,'#ffe08a');if(typeof SFX!=='undefined')SFX.play('raidHorn');}
// out of the southern gate, north along King William's roads (over the Riverbend bridge) to the old castle hill, then up the mountain trail to Dragon Peak
const RAID_TRAIL={x:2070,y:430}; // trailhead at the foot of the Frostpeaks, where the old castle used to stand
function raidRoute(){const P=[{x:GATE.x,y:GATE.y+24}],rp=typeof roadPath==='function'?roadPath(GATE.x,GATE.y+20,RAID_TRAIL.x,RAID_TRAIL.y):null;
  if(rp)for(const p of rp.P){const l=P[P.length-1];if(dist(l,p)>40)P.push({x:p.x,y:p.y});}else P.push({x:2400,y:3960},{x:2265,y:3340},{x:2350,y:2900},{x:2350,y:1720},{x:2150,y:900});
  P.push({x:RAID_TRAIL.x,y:RAID_TRAIL.y},{x:2070,y:120},{x:2130,y:-380},{x:2210,y:-880},{x:2270,y:-1330},{x:HX()+20,y:HY()+150},{x:HX(),y:HY()+14});return P;}
function raidFight(u,dt){const dd=dist(u,D),ground=D.alt<DR.hitAltSword;if(!ground||dd>150)return false;
  u.atk-=dt;if(dd>70)moveTo(u,D.x,D.y,95,dt);else{u.anim+=dt*4;if(u.atk<=0){u.atk=.95;u.swing=.3;hurtDragon(9+3*u.raid.n,'sword');}}u.swing=Math.max(0,(u.swing||0)-dt);return true;}
// called from the unit loop: true = this unit was handled here
function raidStep(u,dt){const r=u.raid;if(!r||RAID.cur!==r){u.raid=null;return false;}const ch=r.champ;
  if(u.champ){u.swing=Math.max(0,(u.swing||0)-dt);
    if(r.phase==='march'){if(raidFight(u,dt))return true;const p=r.path[0];if(!p){raidGrab();return true;}if(moveTo(u,p.x,p.y,58,dt)||dist(u,p)<26)r.path.shift();return true;}
    if(r.phase==='flee'){if(raidFight(u,dt))return true;if(!r.back||!r.back.length){if(dist(u,GATE)<30){raidEscaped();return true;}r.back=[{x:GATE.x,y:GATE.y+10}];}
      const p=r.back[0];if(moveTo(u,p.x,p.y,50,dt)||dist(u,p)<26)r.back.shift();return true;}
    return true;}
  // escort: stays in formation around the champion unless the dragon is close
  if(!ch||ch.dead)return false;if(D.alt<DR.hitAltSword&&dist(u,D)<230)return false;
  const i=r.members.indexOf(u),row=Math.ceil(i/2),side=i%2?1:-1,ha=Math.atan2((r.path[0]||GATE).y-ch.y,(r.path[0]||GATE).x-ch.x),tx=ch.x-Math.cos(ha)*26*row-Math.sin(ha)*18*side,ty=ch.y-Math.sin(ha)*26*row+Math.cos(ha)*18*side;
  if(d2(u.x,u.y,tx,ty)>900*900){u.x=tx;u.y=ty;}else moveTo(u,tx,ty,90,dt);return true;}
function raidGrab(){const r=RAID.cur,ch=r.champ;const take=Math.min(G.stash,Math.max(10,Math.round(G.stash*(.25+.05*Math.min(4,r.n)))));
  r.loot=take;G.stash-=take;r.phase='flee';r.back=raidRoute().reverse().slice(1);r.back.push({x:GATE.x,y:GATE.y+10});
  for(let i=0;i<10;i++)sparkle(HX(),HY(),2);float(ch.x,ch.y-70,`${r.short} grabs ${take} gold!`,'#ff8a5a');
  G.banner={text:`${r.name} has stolen ${take} gold!`,sub:'Stop the champion before the sack reaches the castle gate!',t:4.5};if(typeof SFX!=='undefined')SFX.play('clink');showToast(`💰 ${r.short} is running off with ${take} gold!`);}
function raidEscaped(){const r=RAID.cur,ch=r.champ;ch.dead=true;ch.gone=true;
  G.banner={text:`${r.name} returns to King William with ${r.loot} gold`,sub:'The court cheers… for now. The hoard is smaller.',t:4.5};endRaid(false);}
function raidChampDown(u,eaten){const r=u.raid;if(!r||RAID.cur!==r||r.done)return;r.done=true;const bonus=40+20*r.n,pts=300+150*r.n,back=r.loot;
  G.stash+=back+bonus;G.stats.raidPts=(G.stats.raidPts||0)+pts;G.stats.champs=(G.stats.champs||0)+1;if(typeof hoardDrop==='function'&&back+bonus>0)hoardDrop(back+bonus,u.x,u.y);
  float(u.x,u.y-80,eaten?`${r.dame?'Dame':'Sir'}? Gulp! +${pts} pts`:`${r.short} is defeated! +${pts} pts`,'#ffe08a');sparkle(u.x,u.y,24);
  G.banner={text:eaten?`You gobbled ${r.name}!`:`${r.name} has fallen!`,sub:`${back?back+' stolen gold returns to your hoard':'The hoard is safe'}  +  ${bonus} bonus gold  ·  +${pts} pts`,t:4.5};
  if(typeof SFX!=='undefined')SFX.play('fanfare');showToast(`🏆 Raid beaten: +${back+bonus} gold`);endRaid(true);}
function endRaid(won){const r=RAID.cur;for(const u of r.members)if(!u.dead){u.raid=null;if(u.raidEsc&&!won){}if(u.raidEsc)u.retreat=!won?true:u.retreat;}RAID.cur=null;RAID.n++;RAID.cd=G.easy?RAID_CD_EASY:RAID_CD;}
function updRaids(dt){if(scene!=='play'||!G||G.over||G.won)return;const r=RAID.cur;if(!r)RAID.cd=Math.max(0,RAID.cd-dt);
  if(!r){while(RAID.thr<RAID.n)RAID.thr++;if(RAID.cd<=0&&G.stash>=raidThreshold(RAID.thr)){RAID.thr++;while(G.stash>=raidThreshold(RAID.thr))RAID.thr++;startRaidWarning();}return;} // one raid at a time: crossing several thresholds never queues extra raids
  if(r.phase==='warn'){r.t-=dt;if(r.t<=0)spawnRaid();return;}
  if(r.champ&&r.champ.dead&&!r.done){if(r.champ.gone)return;raidChampDown(r.champ,!!r.champ.eaten);}}
// ---- hooks ----
const _newGameRD=newGame;newGame=function(o){const x=_newGameRD(o);RAID={n:0,thr:0,cd:30,cur:null};return x;};
const _hurtUnitRD=hurtUnit;hurtUnit=function(u,d,src){if(u&&u.champ&&!u.dead){d*=src==='fire'?.6:.8;}const was=u&&u.dead;_hurtUnitRD(u,d,src);if(u&&u.champ&&!was&&u.dead)raidChampDown(u,false);};
const _eatUnitRD=eatUnit;eatUnit=function(u){const c=u&&u.champ&&!u.dead;_eatUnitRD(u);if(c)raidChampDown(u,true);};
const _calcScoreRD=calcScore;calcScore=function(){return _calcScoreRD()+((G&&G.stats&&G.stats.raidPts)||0);};
const _updPartsRD=updParts;updParts=function(dt){_updPartsRD(dt);updRaids(dt);};
// ---- drawing: the champion, flags and decorated spears ----
function drawCrest(x,y,s,c,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=col;ctx.beginPath();
  if(c==='star'){for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?1.2:2.8;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}}
  else if(c==='moon'){ctx.arc(0,0,2.8,Math.PI*.25,Math.PI*1.75);ctx.arc(1.4,0,2.1,Math.PI*1.6,Math.PI*.4,true);}
  else if(c==='crown'){ctx.moveTo(-3,2);ctx.lineTo(-3,-2);ctx.lineTo(-1.5,0);ctx.lineTo(0,-2.6);ctx.lineTo(1.5,0);ctx.lineTo(3,-2);ctx.lineTo(3,2);}
  else if(c==='bolt'){ctx.moveTo(1,-3);ctx.lineTo(-2,.5);ctx.lineTo(0,.5);ctx.lineTo(-1,3);ctx.lineTo(2,-.5);ctx.lineTo(0,-.5);}
  else if(c==='tree'){ctx.moveTo(0,-3);ctx.lineTo(2.6,1.2);ctx.lineTo(.6,1.2);ctx.lineTo(.6,3);ctx.lineTo(-.6,3);ctx.lineTo(-.6,1.2);ctx.lineTo(-2.6,1.2);}
  else{ctx.arc(0,0,c==='sun'?2.2:2.4,0,TAU);}
  ctx.fill();if(c==='sun'){ctx.strokeStyle=col;ctx.lineWidth=.7;for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*2.6,Math.sin(a)*2.6);ctx.lineTo(Math.cos(a)*3.6,Math.sin(a)*3.6);ctx.stroke();}}
  ctx.restore();}
function drawPennant(x,y,f,col,trim,w){const wv=Math.sin(G.t*6+x*.05)*2;ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-f*w*.5,y+2+wv,x-f*w,y+4+wv*1.3);ctx.lineTo(x,y+8);ctx.closePath();ctx.fill();ctx.fillStyle=trim;ctx.fillRect(x-f*2.5,y+3,f*-(w*.5),1.4);}
function drawChampion(u){const r=u.raid||{},x=u.x,y=u.y,f=u.face||1,g=Math.sin(u.anim*1.4),col=u.colr,trim=r.trim||'#ffd23a',s=1.55;
  ell(x,y+2,13,4.5,'rgba(0,0,0,.3)');ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  line(-2,0,-2+g*2,-6,'#3a3a44',2);line(2,0,2-g*2,-6,'#3a3a44',2); // armoured legs
  // cape
  ctx.fillStyle=trim;ctx.beginPath();ctx.moveTo(-f*1,-13);ctx.quadraticCurveTo(-f*7,-8+g,-f*6,-2);ctx.lineTo(-f*1,-3);ctx.fill();
  rect(-4,-14,8,9,'#b8bec8');rect(-3.4,-13.4,6.8,8.4,u.burn>0?'#f60':col);rect(-3.4,-9.6,6.8,1.1,trim);drawCrest(0,-11.8,.55,r.crest,trim); // tabard
  ell(0,-16.5,3.1,3.1,'#c8ccd4');rect(-2.6,-17,5.2,1,'#333'); // great helm + visor slit
  // plume
  ctx.fillStyle=trim;ctx.beginPath();ctx.moveTo(0,-19);ctx.quadraticCurveTo(-f*5,-25+g*.6,-f*8,-19);ctx.quadraticCurveTo(-f*4,-21,0,-18);ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(0,-19.3);ctx.quadraticCurveTo(-f*3,-23,-f*5.5,-20.5);ctx.quadraticCurveTo(-f*2.6,-20.6,0,-18.6);ctx.fill();
  // sword + kite shield with crest
  const sw=u.swing>0;if(sw)line(f*3,-11,f*13,-18,'#eef',1.6);else line(f*3,-8,f*9,-20,'#dde',1.4);line(f*1.6,-9.5,f*4.6,-7.5,'#c9a43a',1.4);
  ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(-f*1.5,-13);ctx.lineTo(-f*8,-13);ctx.lineTo(-f*8,-8);ctx.lineTo(-f*4.75,-4);ctx.lineTo(-f*1.5,-8);ctx.fill();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-f*2.1,-12.4);ctx.lineTo(-f*7.4,-12.4);ctx.lineTo(-f*7.4,-8.2);ctx.lineTo(-f*4.75,-5);ctx.lineTo(-f*2.1,-8.2);ctx.fill();drawCrest(-f*4.75,-9.4,.62,r.crest,trim);
  if(r.loot>0){ell(f*5,-4,4,3.4,'#a07a3a');ell(f*5,-6.8,2,1.2,'#7a5a28');ctx.fillStyle='#ffd23a';ctx.fillRect(f*5-1,-4.6,2,2);}
  ctx.restore();
  // name tag + boss health bar
  const ty=y-48,w=56;rect(x-w/2-1,ty-1,w+2,6,'#000');rect(x-w/2,ty,w,4,'#401010');rect(x-w/2,ty,w*Math.max(0,u.hp/u.maxHp),4,u.hp>u.maxHp*.5?'#ffc23a':'#ff5a3a');
  txt(r.name||'Champion',x,ty-4,11,trim==='#1a1a1a'||trim==='#30343c'?'#ffd8a0':'#fff4c0','center',true);
  if(r.loot>0)txt(`💰 ${r.loot}g`,x,ty+16,10,'#ffd84a','center',true);}
function drawRaidEscort(u){const r=u.raid,f=u.face||1,x=u.x,y=u.y,col=u.colr,trim=r?r.trim:'#ffd23a';
  if(u.flag){const px=x-f*5,top=y-40;line(px,y-4,px,top,'#6a4a28',1.4);ell(px,top-1,1.4,1.4,trim);ctx.fillStyle=col;ctx.fillRect(px-(f>0?0:12),top+1,12,9);ctx.fillStyle=trim;ctx.fillRect(px-(f>0?0:12),top+8,12,1.4);
    ctx.save();ctx.beginPath();ctx.rect(px-(f>0?0:12),top+1,12,9);ctx.clip();drawCrest(px+(f>0?6:-6),top+5,.85,r?r.crest:'star',trim);ctx.restore();
    ctx.fillStyle=col;for(let i=0;i<3;i++){ctx.beginPath();const bx=px+(f>0?i*4:-12+i*4);ctx.moveTo(bx,top+10);ctx.lineTo(bx+4,top+10);ctx.lineTo(bx+2,top+13+Math.sin(G.t*5+i)*.8);ctx.fill();}}
  else{const tx=x+f*12.8*(1+(u.swing>0?.5:0)),tyy=y-17.9;drawPennant(tx-f*1.5,tyy+1,f,col,trim,9);line(tx-f*6,tyy+5.6,tx-f*5,tyy+4.3,trim,1.5);}}
const _drawKnightRD=drawKnight;drawKnight=function(u){if(u.champ){drawChampion(u);return;}_drawKnightRD(u);if(u.raidEsc&&u.raid)drawRaidEscort(u);};
// ---- HUD + map ----
function raidStatus(){const r=RAID.cur;if(!r)return'';if(r.phase==='warn')return`${r.name} marches out in ${Math.ceil(r.t)}s`;const ch=r.champ,m=ch?Math.round(Math.hypot(ch.x-HX(),ch.y-HY())/10):0;
  const esc=r.members.filter(u=>u.raidEsc&&!u.dead).length;return r.phase==='flee'?`${r.short} runs for the castle with ${r.loot} gold! · ${Math.round(dist(ch,GATE)/10)} m to the gate`:`${r.short} + ${esc} spear${esc===1?'':'s'} marching on your hoard · ${m} m away`;}
const _drawHUDRD=drawHUD;drawHUD=function(){_drawHUDRD();if(!raidHudOn()||G.over||G.won)return;ctx.setTransform(DPR,0,0,DPR,0,0);const sm=VW<760,y=sm?(typeof TOUCH!=='undefined'&&TOUCH.on?120:56):10+94+(typeof gateBroken==='function'&&gateBroken()?24:0),w=uiCenterW(Math.min(VW-20,440));
  const pl=.75+.25*Math.sin(G.t*5),r=RAID.cur;ctx.fillStyle=`rgba(60,30,8,${.85*pl})`;ctx.fillRect(VW/2-w/2,y,w,20);ctx.strokeStyle=r.trim||'#ffd23a';ctx.lineWidth=1.5;ctx.strokeRect(VW/2-w/2+.5,y+.5,w-1,19);
  ctx.fillStyle=r.col;ctx.fillRect(VW/2-w/2+3,y+3,14,14);drawCrest(VW/2-w/2+10,y+10,1.2,r.crest,r.trim);
  txt(`⚔ HOARD RAID: ${raidStatus()}`,VW/2+8,y+14,sm?10:11,'#ffe8b0','center');};
const _drawMapRD=drawMap;drawMap=function(mmx,mmy,mmw,big){_drawMapRD(mmx,mmy,mmw,big);const r=RAID.cur;if(!r||!r.champ||r.champ.dead)return;const s=mmw/(WX1-WX0),X=mmx+(r.champ.x-WX0)*s,Y=mmy+(r.champ.y-WY0)*s,pl=Math.sin(Date.now()/180)>0;
  for(const u of r.members)if(u.raidEsc&&!u.dead){ctx.fillStyle=r.col;ctx.fillRect(mmx+(u.x-WX0)*s-1,mmy+(u.y-WY0)*s-1,2,2);}
  const h=big?16:9;ctx.strokeStyle='#fff';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X,Y-h);ctx.stroke();ctx.fillStyle=pl?r.col:r.trim;ctx.fillRect(X,Y-h,big?10:6,big?7:4);
  ctx.beginPath();ctx.arc(X,Y,big?4:2.5,0,TAU);ctx.fillStyle='#ff4a2a';ctx.fill();if(big){txt(`⚔ ${r.short}${r.loot?' 💰'+r.loot:''}`,X+12,Y-h+7,10,'#ffe08a','left',true);}};
// ---- sounds ----
SFX_DEF.raidHorn=(a,B,o,t)=>{[[0,.32,0],[.36,.22,5],[.62,.7,7]].forEach(([dt,len,st])=>{const f=196*Math.pow(2,st/12);osc(a,o,t+dt,'sawtooth',f,f*1.002,len,.16,.04);osc(a,o,t+dt,'square',f*2,f*2.004,len,.05,.04);});return 1.4;};
if(!SFX_DEF.fanfare)SFX_DEF.fanfare=(a,B,o,t)=>{[0,4,7,12].forEach((st,i)=>{const f=392*Math.pow(2,st/12);osc(a,o,t+i*.11,'triangle',f,f*1.002,i===3?.5:.14,.14,.01);});return .9;};

// pause-menu line: when the next hoard raid can come
function raidCdLine(){if(!G||!RAID)return'';const r=RAID.cur;if(r)return r.phase==='warn'?'🛡 A hoard raid is about to march!':'🛡 A hoard raid is under way';
  const need=raidThreshold(RAID.thr);if(RAID.cd>0){const s=Math.ceil(RAID.cd);return`🛡 Next raid possible in ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}  ·  when your hoard reaches ${need} gold`;}
  return G.stash>=need?'🛡 Next raid possible now':`🛡 Next raid possible now  ·  when your hoard reaches ${need} gold`;}
