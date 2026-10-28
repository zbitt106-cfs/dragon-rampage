// ================= partY: the DRAGON'S TALLY (bestiary) + the pause menu (tally / save / load) =================
// Every kind of thing the dragon can gobble or defeat, counted for this game and ALL-TIME (kept in localStorage).
const TALLY_KEY='dr_tally_v1';
const SHIP_NM={fishing:'Fishing boats',rowboat:'Rowboats',merchant:'Merchant ships',pirate:'Pirate ships',islander:'Islander canoes'};
const TALLY_SECT=[
 {id:'people',name:'People',icon:'🧑',col:'#f3c98b',keys:[['villager','Villagers'],['shopper','Market folk'],['farmer','Farmers'],['logger','Loggers'],['miner','Miners'],['mason','Castle masons'],['trader','Desert traders'],['keeper','Lighthouse keeper'],['taxman','Tax collectors'],['hunter','Hunters'],['sailor','Sailors'],['islander','Islanders'],['pirate','Pirates'],['carter','Cart drivers']]},
 {id:'army',name:"King William's army",icon:'⚔',col:'#9fc4ff',keys:[['militia','Militia'],['foot','Foot soldiers'],['knight','Knights'],['cavalry','Mounted knights'],['archer','Archers'],['crew','Siege crews']]},
 {id:'champ',name:'Brave knights (hoard raiders)',icon:'🛡',col:'#ffd24a',keys:RAID_NAMES.map(n=>['champ:'+n,n])},
 {id:'farm',name:'Animals · Farmlands',icon:'🐄',col:'#b8e07a',keys:[['chicken','Chickens'],['cow','Cows'],['pig','Pigs'],['sheep','Sheep'],['horse','Horses'],['crow','Crows']]},
 {id:'forest',name:'Animals · The Deepwood',icon:'🦌',col:'#7fcf8a',keys:[['deer','Deer'],['rabbit','Rabbits'],['fox','Foxes'],['boar','Boars'],['wolf','Wolves'],['bear','Bears']]},
 {id:'water',name:'Animals · Lake & rivers',icon:'🐟',col:'#8fd3ff',keys:[['fish','Fish'],['beaver','Beavers'],['duck','Ducks'],['goose','Geese']]},
 {id:'mount',name:'Animals · Hills & mountains',icon:'🐐',col:'#d9d3c7',keys:[['goat','Goats'],['mgoat','Mountain goats'],['cougar','Mountain lions'],['hawk','Hawks'],['eagle','Eagles'],['sparrow','Sparrows']]},
 {id:'coast',name:'Animals · Coast & sea',icon:'🦈',col:'#6fb8e8',keys:[['crab','Crabs'],['seal','Seals'],['gull','Gulls'],['shark','Sharks'],['whale','Whales'],['squid','Giant squid']]},
 {id:'desert',name:'Animals · The desert',icon:'🐪',col:'#f0c070',keys:[['camel','Camels'],['lizard','Lizards'],['dfox','Desert foxes'],['snake','Snakes'],['dscorp','Desert scorpions'],['sandworm','Sand worm']]},
 {id:'boats',name:'Boats & siege engines',icon:'⛵',col:'#c6b0ff',keys:[...Object.keys(SHIPK).map(k=>['ship:'+k,SHIP_NM[k]||(k[0].toUpperCase()+k.slice(1)+' boats')]),['siege:catapult','Catapults'],['siege:scorpion','Scorpions'],['cart','Mine carts'],['supplycart','Supply carts'],['carthorse','Cart horses']]},
 {id:'build',name:'Buildings destroyed',icon:'🏚',col:'#ff9a6a',keys:[]},
 {id:'other',name:'Other',icon:'✦',col:'#cccccc',keys:[]}];
(function(){const B=TALLY_SECT.find(s=>s.id==='build'),seen=new Set();
  const add=(k,n)=>{if(seen.has(k))return;seen.add(k);B.keys.push(['b:'+k,n]);};
  for(const k of ['hut','barn','logpile','stonepile','cabin','gate','barracks','bridge'])add(k,(STRUCT_NAME[k]||k)+(k==='bridge'?'s':''));
  for(const k in KDEF)add(k,(KDEF[k].name||STRUCT_NAME[k]||k));
  B.keys.push(['tree','Trees felled'],['crop','Crop fields burned']);})();
const TALLY_LABEL={};for(const s of TALLY_SECT)for(const [k,n] of s.keys)TALLY_LABEL[k]=n;
let TALLY={game:{},all:{},prGame:0,prAll:0},TALLY_KEEP=false,tallyFlushT=null,GAME_PLAYT=0;
(function(){try{const j=JSON.parse(localStorage.getItem(TALLY_KEY)||'null');if(j&&j.all&&typeof j.all==='object'){TALLY.all=j.all;TALLY.prAll=+j.prAll||0;}}catch(e){}})();
function tallySave(){if(tallyFlushT){clearTimeout(tallyFlushT);tallyFlushT=null;}try{localStorage.setItem(TALLY_KEY,JSON.stringify({v:1,all:TALLY.all,prAll:TALLY.prAll}));}catch(e){}}
function tallyAdd(k,n){if(!k)return;n=n||1;TALLY.game[k]=(TALLY.game[k]||0)+n;TALLY.all[k]=(TALLY.all[k]||0)+n;
  if(!TALLY_LABEL[k]){const O=TALLY_SECT.find(s=>s.id==='other');O.keys.push([k,k]);TALLY_LABEL[k]=k;}
  if(!tallyFlushT)tallyFlushT=setTimeout(tallySave,300);}
addEventListener('pagehide',tallySave);addEventListener('beforeunload',tallySave);
function tallyReset(){TALLY.all={};TALLY.prAll=0;tallySave();}
function tallyTotal(which){const o=TALLY[which];let n=0;for(const k in o)n+=o[k];return n;}
function tallyKeyU(u){if(!u)return null;const t=u.type;
  if(t==='villager'){if(u.tax||u.job==='tax')return'taxman';if(u.militia)return'militia';if(u.carav||u.job==='trader')return'trader';if(u.mason)return'mason';if(u.shopper)return'shopper';
    const j=u.job;if(j==='carter')return'carter';return j==='woodcutter'?'logger':j==='miner'?'miner':j==='farmer'?'farmer':j==='keeper'?'keeper':'villager';}
  if(t==='hunter')return'hunter';
  if(t==='knight'){if(u.champ&&u.raid&&u.raid.name)return'champ:'+u.raid.name;if(u.militia)return'militia';if(u.foot)return'foot';return u.mounted?'cavalry':'knight';}
  if(t==='archer')return'archer';if(t==='crew')return'crew';
  if(t==='animal')return u.cartHorse?'carthorse':u.species;
  if(t==='sea'){const k=u.kind;return k==='school'||k==='lakeschool'?'fish':k==='iseal'?'seal':k;}
  return t;}
// ---- hooks: every way something gets gobbled or defeated ----
const _eatUnitY=eatUnit;eatUnit=function(u){const was=!!u.dead,n=u.n;const r=_eatUnitY.apply(this,arguments);
  if(u.type==='sea'&&(u.kind==='school'||u.kind==='lakeschool')){if((n!==undefined&&u.n<n)||(!was&&u.dead))tallyAdd('fish');}
  else if(!was&&u.dead&&!u._tal){u._tal=1;tallyAdd(tallyKeyU(u));}return r;};
const _hurtUnitY=hurtUnit;hurtUnit=function(u){const was=!!(u&&u.dead);const r=_hurtUnitY.apply(this,arguments);if(u&&!was&&u.dead&&!u._tal&&!u.gone){u._tal=1;tallyAdd(tallyKeyU(u));}return r;};
if(typeof hurtSea==='function'){const _hurtSeaY=hurtSea;hurtSea=function(u){const was=!!u.dead;const r=_hurtSeaY.apply(this,arguments);if(!was&&u.dead&&!u._tal&&!u.gone){u._tal=1;tallyAdd(tallyKeyU(u));}return r;};}
const _tryEatBirdY=tryEatBird;tryEatBird=function(){const live=birds.filter(b=>!b.dead);const r=_tryEatBirdY.apply(this,arguments);for(const b of live)if(b.dead)tallyAdd(b.kind);return r;};
if(typeof hurtShip==='function'){const _hurtShipY=hurtShip;hurtShip=function(s){const was=s.state==='sink';const r=_hurtShipY.apply(this,arguments);if(!was&&s.state==='sink')tallyAdd('ship:'+s.kind);return r;};}
const _hurtSiegeY=hurtSiege;hurtSiege=function(g){const was=!!g.dead;const r=_hurtSiegeY.apply(this,arguments);if(!was&&g.dead)tallyAdd('siege:'+(g.kind||'catapult'));return r;};
const _onRuinY=onRuin;onRuin=function(s){if(s&&!s._loading)tallyAdd('b:'+s.kind);return _onRuinY.apply(this,arguments);};
const _updateY=update;update=function(dt){const S=G.stats,a=S.trees||0,b=S.crops||0,c=S.carts||0,g0=G;const r=_updateY.apply(this,arguments);
  if(G===g0&&!G.over){const s=G.stats;if((s.trees||0)>a)tallyAdd('tree',s.trees-a);if((s.crops||0)>b)tallyAdd('crop',s.crops-b);if((s.carts||0)>c)tallyAdd('cart',s.carts-c);}
  if(D.princess&&!G._prCap){G._prCap=1;TALLY.prGame++;TALLY.prAll++;tallySave();}
  if(!G.over&&!G.won)GAME_PLAYT+=dt;return r;};
const _newGameY=newGame;newGame=function(){const r=_newGameY.apply(this,arguments);if(!TALLY_KEEP){TALLY.game={};TALLY.prGame=0;GAME_PLAYT=0;}TALLY_KEEP=false;return r;};
const _nextLevelY=nextLevel;nextLevel=function(){TALLY_KEEP=true;return _nextLevelY.apply(this,arguments);};
function tallyRows(){const rows=[];for(const s of TALLY_SECT){if(!s.keys.length)continue;let g=0,a=0;for(const [k] of s.keys){g+=TALLY.game[k]||0;a+=TALLY.all[k]||0;}
    rows.push({h:1,s,g,a});for(const [k,n] of s.keys){const gg=TALLY.game[k]||0,aa=TALLY.all[k]||0;rows.push({k,label:aa||gg?n:'???',g:gg,a:aa,got:!!(aa||gg),s});}}return rows;}

// ================= the pause menu (also used on the title screen for Continue / Load) =================
const PM={on:false,from:'pause',scr:'main',sel:0,scroll:0,confirm:null,msg:null,msgT:0,hit:[],drag:null,vis:10};
const PM_MAIN=[['▶  Resume','resume'],["📜  Dragon's Tally",'tally'],['💾  Save Game','save'],['📂  Load Game','load'],['⟲  Restart (new game)','restart']];
function pmOpen(scr,from){PM.on=true;PM.from=from||'pause';PM.scr=scr||'main';PM.sel=0;PM.scroll=0;PM.confirm=null;PM.msg=null;PM.drag=null;
  if(PM.scr==='load'){const L=svList();let b=-1,bt=0;L.forEach((s,i)=>{if(s.info&&s.info.when>bt){bt=s.info.when;b=i;}});PM.sel=Math.max(0,b);}}
function pmClose(){PM.on=false;PM.confirm=null;PM.drag=null;}
function pmSay(m){PM.msg=m;PM.msgT=performance.now();}
function pmBack(){if(PM.confirm){PM.confirm=null;return;}if(PM.scr==='main'||PM.from==='title'){if(PM.from==='title')pmClose();else paused=false;return;}PM.scr='main';PM.sel={tally:1,save:2,load:3}[PM.scr]||0;PM.sel=0;}
function pmAct(a){if(a==='resume'){paused=false;pmClose();}else if(a==='tally'){PM.scr='tally';PM.scroll=0;}else if(a==='save'){PM.scr='save';PM.sel=0;}else if(a==='load'){PM.scr='load';PM.sel=0;}
  else if(a==='restart'){PM.confirm={q:'Restart and begin a brand-new game?',sub:'(Your saves and the all-time tally are kept.)',sel:1,yes:()=>{pmClose();newGame();paused=false;}};}}
function pmTallyReset(){PM.confirm={q:"Reset the ALL-TIME Dragon's Tally?",sub:'Every all-time count goes back to 0. This cannot be undone.',sel:1,yes:()=>{tallyReset();pmSay('All-time tally reset.');}};}
function pmSlotAct(i){const L=svList();
  if(PM.scr==='save'){const s=L[i+1];if(!s)return;const go=()=>{const ok=svWrite(s.key);pmSay(ok?`Saved to ${s.name}!`:'Could not save (storage is full or blocked).');};
    if(s.info)PM.confirm={q:`Overwrite ${s.name}?`,sub:svDesc(s.info),sel:1,yes:go};else go();}
  else{const s=L[i];if(!s)return;if(!s.raw){pmSay(`${s.name} is empty.`);return;}const res=svLoad(s.key);if(res===true){pmClose();paused=false;scene='play';showToast(`📂 Loaded ${s.name}`);}else pmSay(res);}}
function pmRowsN(){return PM.scr==='main'?PM_MAIN.length:PM.scr==='save'?4:PM.scr==='load'?5:0;}
function pmInput(){// returns true when the menu consumed this frame's input
  const up=P('arrowup')||P('w'),dn=P('arrowdown')||P('s'),lf=P('arrowleft')||P('a'),rt=P('arrowright')||P('d'),ok=P('enter')||P(' ')||P('e'),back=P('escape')||P('p')||P('backspace');
  if(PM.confirm){const c=PM.confirm;if(up||dn||lf||rt)c.sel=1-c.sel;if(ok){PM.confirm=null;if(c.sel===0)c.yes();}else if(back)PM.confirm=null;return true;}
  if(PM.scr==='main'){if(back||P('r'))return false;if(up)PM.sel=(PM.sel+PM_MAIN.length-1)%PM_MAIN.length;if(dn)PM.sel=(PM.sel+1)%PM_MAIN.length;if(ok)pmAct(PM_MAIN[PM.sel][1]);return true;}
  if(PM.scr==='tally'){const n=tallyRows().length,mx=Math.max(0,n-PM.vis);if(up)PM.scroll--;if(dn)PM.scroll++;if(lf||P('pageup'))PM.scroll-=PM.vis-1;if(rt||P('pagedown'))PM.scroll+=PM.vis-1;PM.scroll=clamp(PM.scroll,0,mx);
    if(ok||P('x'))pmTallyReset();else if(back){PM.scr='main';PM.sel=1;}return true;}
  const n=pmRowsN();if(up)PM.sel=(PM.sel+n-1)%n;if(dn)PM.sel=(PM.sel+1)%n;
  if(ok){if(PM.sel===n-1){if(PM.from==='title')pmClose();else{PM.sel=PM.scr==='save'?2:3;PM.scr='main';}}else pmSlotAct(PM.sel);}
  else if(back){if(PM.from==='title')pmClose();else{PM.sel=PM.scr==='save'?2:3;PM.scr='main';}}
  return true;}
function pmTap(x,y,id){if(typeof hitBtn==='function'&&PM.from==='pause'&&!PM.confirm){const b=hitBtn(x,y);if(b&&b.key==='p'){if(PM.scr==='main')paused=false;else{PM.scr='main';PM.sel=0;}return true;}}
  for(let i=PM.hit.length-1;i>=0;i--){const h=PM.hit[i];if(x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h){if(h.list){PM.drag={id,y,sc:PM.scroll};return true;}h.f();return true;}if(h.modal)return true;}
  return true;}
function pmDragMove(id,y){const d=PM.drag;if(!d||d.id!==id)return;const n=tallyRows().length;PM.scroll=clamp(Math.round(d.sc-(y-d.y)/(PM.rh||24)),0,Math.max(0,n-PM.vis));}
function pmBtn(x,y,w,h,label,f,on,col){panel(x,y,w,h);if(on){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);}txt(label,x+w/2,y+h/2+6,Math.min(17,h*.45),on?'#ffd24a':(col||'#eee'),'center');PM.hit.push({x,y,w,h,f});}
function drawPM(){ctx.setTransform(DPR,0,0,DPR,0,0);const S=SAFE,touch=TOUCH.on;PM.hit=[];
  ctx.fillStyle='rgba(6,4,10,.66)';ctx.fillRect(0,0,VW,VH);
  const aw=VW-S.l-S.r,ah=VH-S.t-S.b,W=Math.min(aw-16,PM.scr==='tally'?680:600),x0=S.l+(aw-W)/2,cx=x0+W/2;
  if(PM.scr==='main'){const rh=touch?46:38,H=86+PM_MAIN.length*(rh+8)+96,y0=S.t+Math.max(8,(ah-H)/2);panel(x0,y0,W,H);
    txt('PAUSED',cx,y0+44,36,'#ffd24a','center');
    if(scene==='play'&&G){const fs=touch?13:14;txt(`Score ${G.over?G.score:calcScore()}`,x0+18,y0+30,fs+2,'#ffe08a','left');txt(`Wave ${G.waveNum}`,x0+18,y0+50,fs-2,'#ddd','left',false);
      const sw=uiStockW(fs);uiStock(x0+W-18-sw,y0+26,fs);if(typeof pauseExtraLine==='function'){const l=pauseExtraLine();if(l)txt(l,x0+W-18,y0+50,fs-2,'#ddd','right',false);}}
    PM_MAIN.forEach(([l,a],i)=>pmBtn(x0+30,y0+70+i*(rh+8),W-60,rh,l,()=>{PM.sel=i;pmAct(a);},PM.sel===i));
    if(typeof raidCdLine==='function'){const l=raidCdLine();if(l)txt(l,cx,y0+H-64,touch?12:12,'#ffd8a0','center',false);}
    if(typeof drawGlutBar==='function')drawGlutBar(x0+30,y0+H-52,W-60,18);
    txt(touch?'Tap a choice · II resumes':'↑/↓ + Enter (A) choose · P / Esc / Start resume · R / Back restart',cx,y0+H-16,touch?13:12,'#bbb','center',false);}
  else if(PM.scr==='tally')drawTallyScreen(x0,W,S,ah,touch);
  else drawSlots(x0,W,S,ah,touch);
  if(PM.msg&&performance.now()-PM.msgT<3500){ctx.font='bold 16px Georgia';const w=Math.min(aw-20,ctx.measureText(PM.msg).width+40);panel(cx-w/2,S.t+ah-58,w,38);txt(PM.msg,cx,S.t+ah-33,15,'#ffe28a','center');}
  if(PM.confirm){const c=PM.confirm,w=Math.min(aw-20,520),h=150,x=S.l+(aw-w)/2,y=S.t+(ah-h)/2;PM.hit.push({x:0,y:0,w:VW,h:VH,f:()=>{},modal:1});
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,VW,VH);panel(x,y,w,h);ctx.fillStyle='rgba(40,20,10,.85)';ctx.fillRect(x+2,y+2,w-4,h-4);
    txt(c.q,x+w/2,y+36,Math.min(19,w/26),'#ffd24a','center');if(c.sub)txt(c.sub,x+w/2,y+62,Math.min(13,w/40),'#ddd','center',false);
    pmBtn(x+w/2-150,y+h-62,130,44,'Yes',()=>{PM.confirm=null;c.yes();},c.sel===0,'#ff9a8a');pmBtn(x+w/2+20,y+h-62,130,44,'No',()=>{PM.confirm=null;},c.sel===1);}}
function drawTallyScreen(x0,W,S,ah,touch){const cx=x0+W/2,y0=S.t+8,H=ah-16;panel(x0,y0,W,H);ctx.fillStyle='rgba(30,18,8,.6)';ctx.fillRect(x0+1,y0+1,W-2,H-2);
  const sm=W<520,fs=sm?12:14;txt("📜  THE DRAGON'S TALLY",cx,y0+30,sm?20:24,'#ffd24a','center');
  const tg=tallyTotal('game'),ta=tallyTotal('all');
  txt(`Total gobbled / defeated:  this game ${tg}  ·  all-time ${ta}`,cx,y0+52,fs,'#fff','center');
  txt(`♛ Princess Elizabeth captured (not a kill, she's never hurt!):  this game ${TALLY.prGame}  ·  all-time ${TALLY.prAll}`,cx,y0+70,sm?10.5:12.5,'#ffb0dc','center',false);
  if(typeof drawGlutBar==='function')drawGlutBar(x0+16,y0+78,W-32,16);
  const colA=x0+W-24,colG=x0+W-(sm?96:130),ly=y0+112;txt('This game',colG,ly,sm?11:13,'#f0c070','right');txt('All-time',colA,ly,sm?11:13,'#f0c070','right');
  const rh=touch?26:22,top=ly+8,foot=touch?56:46,listH=H-(top-y0)-foot,vis=Math.max(3,Math.floor(listH/rh));PM.vis=vis;PM.rh=rh;
  const rows=tallyRows(),mx=Math.max(0,rows.length-vis);PM.scroll=clamp(PM.scroll,0,mx);
  PM.hit.push({x:x0,y:top,w:W,h:vis*rh,list:1});
  ctx.save();ctx.beginPath();ctx.rect(x0+2,top,W-4,vis*rh+2);ctx.clip();
  for(let i=0;i<vis&&PM.scroll+i<rows.length;i++){const r=rows[PM.scroll+i],y=top+i*rh;
    if(r.h){ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(x0+6,y+2,W-28,rh-2);ctx.fillStyle=r.s.col;ctx.fillRect(x0+6,y+2,4,rh-2);
      txt(`${r.s.icon}  ${r.s.name}`,x0+16,y+rh-6,fs,r.s.col,'left');txt(String(r.g),colG,y+rh-6,fs,r.s.col,'right');txt(String(r.a),colA,y+rh-6,fs,r.s.col,'right');}
    else{const c=r.got?'#f4eadc':'#77736c';ctx.fillStyle=r.got?r.s.col:'#55524c';ctx.beginPath();ctx.arc(x0+24,y+rh/2+1,3.5,0,TAU);ctx.fill();
      let lab=r.label;ctx.font=`${fs}px Georgia`;const maxw=colG-(sm?70:80)-(x0+34);while(lab.length>4&&ctx.measureText(lab).width>maxw)lab=lab.slice(0,-2)+'…';
      txt(lab,x0+34,y+rh-6,fs,c,'left',false);txt(String(r.g),colG,y+rh-6,fs,r.g?'#fff':'#77736c','right',false);txt(String(r.a),colA,y+rh-6,fs,r.a?'#ffe6a0':'#77736c','right',false);}}
  ctx.restore();
  // scrollbar
  if(mx>0){const bx=x0+W-10,bh=vis*rh,th=Math.max(20,bh*vis/rows.length),ty=top+(bh-th)*(PM.scroll/mx);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(bx,top,5,bh);ctx.fillStyle='#d9a64a';ctx.fillRect(bx,ty,5,th);}
  const by=y0+H-foot+8,bh=foot-16,n=4,gap=8,bw=(W-24-gap*(n-1))/n;
  pmBtn(x0+12,by,bw,bh,'▲ Up',()=>{PM.scroll=Math.max(0,PM.scroll-(vis-1));},false);
  pmBtn(x0+12+(bw+gap),by,bw,bh,'▼ Down',()=>{PM.scroll=Math.min(mx,PM.scroll+(vis-1));},false);
  pmBtn(x0+12+2*(bw+gap),by,bw,bh,'Reset tally',pmTallyReset,false,'#ff9a8a');
  pmBtn(x0+12+3*(bw+gap),by,bw,bh,'◀ Back',()=>{PM.scr='main';PM.sel=1;},false);
  if(!touch)txt(`↑/↓ scroll · ←/→ page · Enter / A / X: reset all-time tally · Esc / B: back   (${PM.scroll+1}-${Math.min(rows.length,PM.scroll+vis)} of ${rows.length})`,cx,by-6,11,'#aaa','center',false);}
function drawSlots(x0,W,S,ah,touch){const cx=x0+W/2,L=svList(),save=PM.scr==='save',rows=save?L.slice(1):L,rh=touch?58:52,n=rows.length+1;
  const H=Math.min(ah-16,84+rows.length*(rh+6)+(touch?52:44)+40),y0=S.t+Math.max(8,(ah-H)/2);panel(x0,y0,W,H);ctx.fillStyle='rgba(30,18,8,.6)';ctx.fillRect(x0+1,y0+1,W-2,H-2);
  txt(save?'💾  SAVE GAME':(PM.from==='title'?'📂  CONTINUE / LOAD':'📂  LOAD GAME'),cx,y0+34,24,'#ffd24a','center');
  txt(save?'Pick a slot to save your whole kingdom-wrecking progress.':'Pick a save to load. The autosave updates every 2 minutes and when you pause.',cx,y0+56,12,'#ccc','center',false);
  const sm=W<520;rows.forEach((s,i)=>{const y=y0+70+i*(rh+6),on=PM.sel===i,x=x0+16,w=W-32;panel(x,y,w,rh);if(on){ctx.strokeStyle='#ffd24a';ctx.lineWidth=3;ctx.strokeRect(x,y,w,rh);}
    PM.hit.push({x,y,w,h:rh,f:()=>{PM.sel=i;pmSlotAct(i);}});
    const head=`${s.auto?'⟳':'▣'}  ${s.name}`+(s.info?'  —  '+svWhen(s.info.when):s.raw?'  —  (unreadable)':'  —  empty');
    txt(head,x+12,y+21,sm?13:15,on?'#ffd24a':s.info?'#fff':'#999','left');
    if(s.info)txt(svDesc(s.info),x+12,y+rh-12,sm?11:12.5,s.info.old?'#ffb080':'#bfe0ff','left',false);
    else if(s.raw)txt('This save is from a different version.',x+12,y+rh-12,12,'#ffb080','left',false);});
  const by=y0+70+rows.length*(rh+6)+4,bh=touch?44:36;pmBtn(cx-110,by,220,bh,'◀ Back',()=>{if(PM.from==='title')pmClose();else{PM.scr='main';PM.sel=save?2:3;}},PM.sel===n-1);
  txt(touch?'Tap a slot':'↑/↓ + Enter (A) choose · Esc / B back',cx,by+bh+20,12,'#aaa','center',false);}
