
// ================= part7: castle goal, lair, hunter, bucket brigade, easy mode, gamepad =================
// ---------- sound (WebAudio horn, created on first input) ----------
let AC=null;function audio(){try{if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C();}if(AC&&AC.state==='suspended'){const pr=AC.resume();if(pr&&pr.catch)pr.catch(()=>{});}}catch(e){}return AC;}
addEventListener('keydown',()=>audio(),{once:true});addEventListener('pointerdown',()=>audio(),{once:true});
function horn(){const a=AC;if(!a)return;try{const t=a.currentTime,o=a.createOscillator(),o2=a.createOscillator(),f=a.createBiquadFilter(),g=a.createGain();
  o.type='sawtooth';o2.type='sawtooth';o.frequency.setValueAtTime(196,t);o.frequency.linearRampToValueAtTime(220,t+.25);o.frequency.setValueAtTime(220,t+1.2);o.frequency.linearRampToValueAtTime(196,t+1.6);o2.frequency.value=147;
  f.type='lowpass';f.frequency.value=900;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.12);g.gain.setValueAtTime(.16,t+1.3);g.gain.linearRampToValueAtTime(0,t+1.7);
  o.connect(f);o2.connect(f);f.connect(g);g.connect((typeof audOut==='function'&&audOut('sfx'))||a.destination);o.start(t);o2.start(t);o.stop(t+1.8);o2.stop(t+1.8);}catch(e){}}

// ---------- gamepad (standard mapping; works alongside the keyboard) ----------
const GPAD={connected:false,id:'',mx:0,my:0,fire:false,prev:[],toast:null,toastT:0,idx:-1,navT:0};
function showToast(s){GPAD.toast=s;GPAD.toastT=3.5;}
addEventListener('gamepadconnected',e=>{GPAD.connected=true;GPAD.id=e.gamepad.id;showToast('🎮 Controller connected: '+e.gamepad.id.slice(0,40));audio();});
addEventListener('gamepaddisconnected',()=>{GPAD.connected=false;GPAD.mx=GPAD.my=0;GPAD.fire=false;showToast('Controller disconnected');});
function rumble(strong,weak,ms){try{const pads=navigator.getGamepads?navigator.getGamepads():[];for(const p of pads){if(p&&p.vibrationActuator&&p.vibrationActuator.playEffect)
  p.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:strong,weakMagnitude:weak}).catch(()=>{});}}catch(e){}}
function pollPad(dt){GPAD.toastT=Math.max(0,GPAD.toastT-dt);let pads=[];try{pads=navigator.getGamepads?navigator.getGamepads():[];}catch(e){}
  let p=null;for(const q of pads||[])if(q&&q.connected!==false){p=q;break;}
  if(!p){GPAD.mx=GPAD.my=0;GPAD.fire=false;return;}
  if(!GPAD.connected){GPAD.connected=true;GPAD.id=p.id;showToast('🎮 Controller connected: '+String(p.id).slice(0,40));}
  const B=i=>{const b=p.buttons[i];return !!b&&(b.pressed||b.value>.5);},prev=GPAD.prev,edge=i=>B(i)&&!prev[i];
  const menu=scene==='title'||G.over||G.won||paused;
  // movement: left stick (radial deadzone, analog magnitude) or d-pad
  let ax=p.axes[0]||0,ay=p.axes[1]||0;const m=Math.hypot(ax,ay);
  if(m<.2){ax=ay=0;}else{const k=Math.min(1,(m-.2)/.75)/m;ax*=k;ay*=k;}
  const dx=(B(15)?1:0)-(B(14)?1:0),dy=(B(13)?1:0)-(B(12)?1:0);if(dx||dy){const l=Math.hypot(dx,dy);ax=dx/l;ay=dy/l;}
  GPAD.mx=menu?0:ax;GPAD.my=menu?0:ay;
  // buttons -> the same virtual key presses the keyboard uses
  if(menu){if(edge(0))pressed['enter']=true;if(edge(9))pressed[paused&&!G.over&&!G.won&&scene!=='title'?'p':'enter']=true;if(edge(8))pressed['r']=true;if(edge(1)&&(paused||PM.on))pressed['p']=true;
    // d-pad / stick edges navigate menus
    GPAD.navT-=dt;const nx=dx||(Math.abs(ax)>.5?Math.sign(ax):0),ny=dy||(Math.abs(ay)>.5?Math.sign(ay):0);
    if((nx||ny)&&GPAD.navT<=0){GPAD.navT=.28;if(ny<0)pressed['arrowup']=true;else if(ny>0)pressed['arrowdown']=true;else if(nx<0)pressed['arrowleft']=true;else pressed['arrowright']=true;}
    if(!nx&&!ny)GPAD.navT=0;GPAD.fire=false;}
  else{GPAD.fire=B(0)||((p.buttons[7]&&p.buttons[7].value)||0)>.3;if(edge(2))pressed['e']=true;if(edge(1))pressed['q']=true;if(edge(3))pressed['f']=true;if(edge(9))pressed['p']=true;if(edge(8))pressed['r']=true;if(edge(4))pressed['m']=true;}
  GPAD.prev=p.buttons.map((b,i)=>B(i));}

// ---------- castle goal: steal gold, kidnap the princess (cartoon style), fly home ----------
const QUIPS=['Eek! Put me down!','Help! Somebody!','You big lizard!','Daddy will be SO mad!','Watch the dress!','Are we there yet?','I get airsick, you know!'];
function tryGrab(){const mx=D.x+Math.cos(D.ang)*60,my=D.y+Math.sin(D.ang)*60;
  const nearPR=PR.state==='tower'&&!D.princess&&(d2(D.x,D.y,PR.x,PR.y)<120||d2(mx,my,PR.x,PR.y)<110);
  if(nearPR&&!roofOpen()){if(biteRoof())return true;roofHint(true);}
  if(nearPR&&roofOpen()){
    PR.state='carried';D.princess=true;D.quip=QUIPS[0];D.quipT=3;G.quipT=4;addAlarm(100);G.alarm=100;
    float(PR.x,PR.y-60,'Eek! Put me down!','#ff9ad0');spawnWave(Math.max(1,G.level),true);G.banner={text:'You captured Princess Elizabeth!',sub:'Fly her back to your lair (follow the gold arrow, north to Dragon Peak). She is quite safe — just very cross.',extra:'The knights ride out of the gate: "Rescue Princess Elizabeth!"',t:4.5};return true;}
  const cap=G.easy?80:60;
  if(D.gold<cap)for(const g of goldPiles){if(g.amt>0&&(d2(D.x,D.y,g.x,g.y)<95||d2(mx,my,g.x,g.y)<90)){const take=Math.min(g.amt,cap-D.gold);g.amt-=take;D.gold+=take;
    float(g.x,g.y-30,`+${take} gold (carrying ${D.gold})`,'#ffd84a');sparkle(g.x,g.y,8);addAlarm(6);return true;}}
  return false;}
function updGoal(dt){
  // princess quips while carried
  if(D.princess){D.quipT-=dt;G.quipT-=dt;if(G.quipT<=0){G.quipT=4;D.quip=QUIPS[RI(1,QUIPS.length-1)];D.quipT=2.6;}if(D.quipT<=0)D.quip=null;}
  D.healFx=Math.max(0,(D.healFx||0)-dt);
  // deliveries at the lair
  if(!G.over&&!G.won&&d2(D.x,D.y,LAIR.x,LAIR.y)<130){
    if(D.gold>0){hoardDrop(D.gold,D.x,D.y);G.stash+=D.gold;float(LAIR.x,LAIR.y-60,`Hoard +${D.gold} gold! (+${D.gold*5} bonus)`,'#ffd84a');sparkle(LAIR.x,LAIR.y,16);D.gold=0;}
    if(D.princess){D.princess=false;D.quip=null;PR.state='lair';PR.x=LAIR.x+40;PR.y=LAIR.y;G.won=true;G.wonT=0;G.score=calcScore();
      if(G.score>best){best=G.score;try{localStorage.setItem('dr_best',best);}catch(e){}}rumble(.5,.5,300);}}
  if(G.won)G.wonT+=dt;
  // garrison: tower archers & gate guards are replaced from the barracks
  G.postT-=dt;if(G.postT<=0){G.postT=25;if(castleHealth('barracks')>.3){const lvl=G.lvl;
    const nT=Math.min(TOWER_SPOTS.length,Math.round((G.easy?2:4)+(G.easy?1:2)*(lvl-1))),nG=Math.min(12,Math.round((G.easy?2:3)+(G.easy?1:2)*(lvl-1)));
    for(let i=0;i<nT;i++)if(!units.some(u=>!u.dead&&u.post==='tower'&&u.slot===i))spawnPost('tower',i);
    for(let i=0;i<nG;i++)if(!units.some(u=>!u.dead&&u.post==='guard'&&u.slot===i))spawnPost('guard',i);}}
  // hunter respawns from his cabin
  if(!units.some(u=>!u.dead&&(u.type==='hunter'||(u.wk&&u.wk.id==='cabin'&&!u.wk.back)))){const cab=structures.find(s=>s.kind==='cabin');if(cab&&cab.state==='ok'){G.hunterT-=dt;if(G.hunterT<=0){G.hunterT=20;spawnHunter();}}}
  else G.hunterT=20;
  // wild & farmyard animals wander back in
  // (wild animals respawn per region in updFauna)
  if(rnd()<dt*.05){const f=FARMS[RI(0,FARMS.length-1)];const barn=structures.find(s=>s.kind==='barn'&&dist(s,f.barn)<5);if(barn&&barn.state==='ok'&&units.filter(u=>!u.dead&&u.pen===f.yard).length<(f.yard.cap||4))units.push(mkUnit('animal',f.yard.x+R(10,130),f.yard.y+R(8,42),{species:'chicken',pen:f.yard,hp:6,free:true}));}
  updFirefight(dt);}
function nextLevel(){const bank=calcScore();newGame({lvl:G.lvl+1,bank});G.banner={text:`Castle Level ${G.lvl}`,sub:'A tougher castle: thicker gate, more tower archers and guards, more gold.',t:4.5};}

// ---------- the hunter: bow at range (hits air & ground), dagger up close, keeps his distance ----------
function updHunter(u,dt){const dd=dist(u,D);u.atk-=dt;u.shootT-=dt;u.stab=Math.max(0,(u.stab||0)-dt);u.draw=Math.max(0,(u.draw||0)-dt);u.face=D.x>u.x?1:-1;
  if(G.over||G.won||dd>520*clamp(.45+.4*kingdomMul(D.x,D.y),.55,1)){moveTo(u,u.home.x+30+Math.sin(G.t*.3+u.id)*60,u.home.y+40+Math.cos(G.t*.4)*40,40,dt);u.mode='bow';return;}
  const ground=D.alt<0.35;
  if(ground&&dd<110){u.mode='dagger';if(dd>60)moveTo(u,D.x,D.y,70,dt);
    if(u.atk<=0&&dd<80){u.atk=.9;u.stab=.25;hurtDragon(6,'dagger');float(D.x,D.y-heightOf()-70,'Stabbed by the hunter!','#ff9a9a');}return;}
  u.mode='bow';
  const a=Math.atan2(u.y-D.y,u.x-D.x);
  if(dd<200){u.x=clamp(u.x+Math.cos(a)*80*dt,WX0+80,WX1-80);u.y=clamp(u.y+Math.sin(a)*80*dt,WY0+80,WY1-80);u.anim+=dt*10;}
  else if(dd>320)moveTo(u,D.x,D.y,62,dt);
  if(u.shootT<=0&&dd<480){u.shootT=1.6;u.draw=.35;const T=dd/460,px=D.x+D.vx*T*.7,py=D.y+D.vy*T*.7,b=Math.atan2(py-u.y,px-u.x);
    projs.push({kind:'arrow',x:u.x,y:u.y,z:12,vx:Math.cos(b)*460,vy:Math.sin(b)*460,tz:heightOf()+15,life:1.4,dmg:6,hunter:true});}}

// ---------- bucket brigade ----------
let ffT=0;
function updFirefight(dt){ffT-=dt;if(ffT>0)return;ffT=.5;
  const fires=[...structures.filter(s=>s.fire&&s.state!=='ruin'),...trees.filter(t=>t.fire&&t.state==='ok')];
  for(const f of fires){if(dist(f,D)<320)continue;const n=units.filter(u=>!u.dead&&u.water&&u.water.f===f).length;if(n>=3)continue;
    let best=null,bd=700;for(const u of units){if(u.dead||u.type!=='villager'||u.job!=='peasant'||u.task||u.water||u.state==='flee'||u.inside)continue;const d=d2(u.x,u.y,f.x,f.y);if(d<bd){bd=d;best=u;}}
    if(best){best.water={f,st:'fetch',well:nearestWell(best.x,best.y),t:1};best.carry=null;}}}
function updBucket(u,dt){const w=u.water,f=w.f;const out=f.state==='ruin'||!f.fire||(f.state!==undefined&&f.state!=='ok'&&!f.kind);
  if(out&&w.st!=='fetch'){u.water=null;u.carry=null;u.state='idle';return;}
  if(w.st==='fetch'){if(wellFetch(u,w,dt)){w.st='carry';u.carry='bucket';}}
  else if(w.st==='carry'){if(!f.fire){u.water=null;u.carry=null;return;}if(moveTo(u,f.x+(u.x<f.x?-24:24),f.y+14,55,dt)){w.st='throw';w.t=.5;}}
  else if(w.st==='throw'){w.t-=dt;if(w.t<=0){u.carry=null;puff(f.x,f.y-10,16,'rgba(120,180,255,',120,7,2.5);
      f.water=(f.water||0)+1;const need=f.kind?2:1;
      if(f.water>=need){f.fire=0;f.water=0;float(f.x,f.y-50,'Fire out!','#8fd0ff');G.stats.fires=(G.stats.fires||0)+1;}
      w.st='fetch';w.t=1;w.well=nearestWell(u.x,u.y);if(!f.fire){u.water=null;u.state='idle';}}}}

// ---------- victory screen ----------
function drawWon(){ctx.fillStyle=`rgba(10,10,40,${Math.min(.72,G.wonT)})`;ctx.fillRect(0,0,VW,VH);const sm=VW<760;
  center([['VICTORY!',sm?34:58,'#ffd84a'],['Princess Elizabeth is in your lair, and the kingdom is in an uproar.',sm?14:20,'#fff',false],
    ['"Hmph! ...this nest is actually quite comfy." (She is perfectly fine and will be rescued with lots of cake.)',sm?11:14,'#ffc0e0',false],
    [`Castle level ${G.lvl} cleared · Gold stashed ${G.stash} (+${G.stash*5}) · Princess bonus +${1000*G.lvl}`,sm?13:17,'#ffe08a',false],
    [`Score so far: ${G.score}`,22,'#ffe08a'],['',8,'#fff',false],
    [Math.floor(performance.now()/500)%2?'Enter / Space / A / Start: attack the next, tougher castle':'',sm?15:20,'#ffd24a'],['R / Back: start over at level 1',14,'#ccc',false]],VH*.26);}
function drawToast(){if(GPAD.toastT<=0)return;ctx.setTransform(DPR,0,0,DPR,0,0);const a=clamp(GPAD.toastT,0,1);ctx.globalAlpha=a;ctx.font='bold 15px Georgia';
  const w=ctx.measureText(GPAD.toast).width+30;panel(VW/2-w/2,VH-70,w,34);txt(GPAD.toast,VW/2,VH-48,15,'#cfe6ff','center');ctx.globalAlpha=1;}

// ---------- birds: flocks of small birds, pond ducks & geese, field crows, and the odd eagle or hawk ----------
let birds=[],bid=0;
const BIRD={sparrow:{heal:2,pts:10,sp:150,col:'#7a5a3a'},crow:{heal:3,pts:15,sp:120,col:'#1a1a22'},duck:{heal:4,pts:20,sp:115,col:'#5a7a3a'},goose:{heal:6,pts:25,sp:105,col:'#e8e4d8'},gull:{heal:3,pts:15,sp:130,col:'#f4f4f0'},
  hawk:{heal:9,pts:60,sp:200,col:'#8a5a2a',hp:1,dmg:2},eagle:{heal:12,pts:80,sp:190,col:'#4a3020',hp:2,dmg:3}};
function mkBird(kind,x,y,o){return Object.assign({id:++bid,kind,x,y,z:0,vx:0,vy:0,state:'ground',t:R(0,3),flap:R(0,6),hp:BIRD[kind].hp||1,cd:0},o||{});}
function spawnFlock(){const n=RI(6,10),ia=R(0,TAU);let x=D.x+Math.cos(ia)*950,y=D.y+Math.sin(ia)*700;x=clamp(x,WX0+300,WX1-300);y=clamp(y,WY0+300,WY1-300);
  const a=Math.atan2(D.y+R(-300,300)-y,D.x+R(-400,400)-x),f=++bid;for(let i=0;i<n;i++)birds.push(mkBird('sparrow',x+R(-40,40),y+R(-30,30),{state:'fly',z:R(110,140),flock:f,head:a,vx:Math.cos(a)*70,vy:Math.sin(a)*70}));}
function spawnPondBird(p){const k=p.gull?'gull':rnd()<.6?'duck':'goose',a=R(0,TAU);birds.push(mkBird(k,p.x+Math.cos(a)*p.rx*.6,p.y+Math.sin(a)*p.ry*.6,{home:p,hx:0,hy:0}));}
function spawnCrow(){const c=cells.filter(c=>c.state==='ok');if(!c.length)return;const t=c[RI(0,c.length-1)];birds.push(mkBird('crow',t.x+R(-8,8),t.y+R(-6,6),{}));}
let GULLS=[];function gullHomes(){if(GULLS.length)return GULLS;for(const y of[600,1900,3300]){GULLS.push({x:coastX(y)-80,y,rx:60,ry:40,gull:1});}GULLS.push({x:3200,y:coastY(3200)-70,rx:60,ry:40,gull:1});return GULLS;}
function raptorPerches(){const P=[];for(const r of DECOR)if(r.k==='cliff')P.push({x:r.x,y:r.y,z:r.r*.9+8});for(const r of ROCKS)if(r.r>30&&r.x>3300)P.push({x:r.x,y:r.y,z:r.r*.9+8});
  const tall=trees.filter(t=>t.state==='ok'&&t.s>1.05&&t.x<-300);for(let i=0;i<tall.length;i+=Math.max(1,Math.floor(tall.length/6)))P.push({x:tall[i].x,y:tall[i].y,z:46*tall[i].s,tree:tall[i]});return P;}
function spawnRaptor(kind){const all=raptorPerches(),P=all.filter(p=>kind==='eagle'?!p.tree:(!!p.tree||rnd()<.25));const p=P.length?P[RI(0,P.length-1)]:{x:R(2700,3100),y:R(400,1800),z:30};
  birds.push(mkBird(kind,p.x,p.y,{state:'perch',z:p.z,perch:p}));}
function pondCap(p){return p.gull?preyN('gull'+GULLS.indexOf(p),3):preyN('pond'+PONDS.indexOf(p),p.lake?7:4);}
function initBirds(){birds=[];for(let i=0;i<preyN('flocks',4);i++)spawnFlock();
  // start the first flocks already over the map
  const fl={};for(const b of birds){if(!fl[b.flock])fl[b.flock]={x:R(300,WW-300),y:R(400,WH-300)};b.x=fl[b.flock].x+R(-40,40);b.y=fl[b.flock].y+R(-30,30);}
  PONDS.forEach(p=>{for(let i=0;i<pondCap(p);i++)spawnPondBird(p);});gullHomes().forEach(p=>{for(let i=0;i<pondCap(p);i++)spawnPondBird(p);});for(let i=0;i<9;i++)spawnCrow();
  for(let i=0;i<4;i++)spawnRaptor('eagle');for(let i=0;i<3;i++)spawnRaptor('hawk');}
function updBirds(dt){const dz=heightOf();
  for(const b of birds){if(b.dead)continue;const dd=dist(b,D),spd=BIRD[b.kind].sp;b.flap+=dt*(b.state==='ground'||b.state==='perch'?2:14);b.t-=dt;b.cd-=dt;
    if(b.kind==='sparrow'){ // flock: drift together; scatter away from the dragon, then regroup
      if(dd<220&&!G.over){const a=Math.atan2(b.y-D.y,b.x-D.x)+R(-.6,.6);b.vx=lerp(b.vx,Math.cos(a)*spd,dt*4);b.vy=lerp(b.vy,Math.sin(a)*spd,dt*4);b.z=Math.min(170,b.z+40*dt);b.scared=1.5;}
      else{b.scared=(b.scared||0)-dt;if(rnd()<dt*.15)b.head+=R(-.8,.8);const mates=birds.filter(o=>o.flock===b.flock&&!o.dead);let cx=0,cy=0;for(const o of mates){cx+=o.x;cy+=o.y;}cx/=mates.length;cy/=mates.length;
        const tx=Math.cos(b.head)*70+(cx-b.x)*.8,ty=Math.sin(b.head)*70+(cy-b.y)*.8;b.vx=lerp(b.vx,tx,dt*1.5);b.vy=lerp(b.vy,ty,dt*1.5);b.z=lerp(b.z,125,dt*.5);}
      b.x+=b.vx*dt;b.y+=b.vy*dt;if(dd>1700||b.x<WX0||b.x>WX1||b.y<WY0||b.y>WY1)b.dead=true;continue;}
    if(b.kind==='eagle'||b.kind==='hawk'){updRaptor(b,dt,dd,dz);continue;}
    if(b.kind==='vulture'){updVulture(b,dt,dd);continue;}
    // ducks, geese & crows: sit, then take off when startled and settle again later
    if(b.state==='ground'){const scare=D.alt>.5?260:200;
      if(b.home){b.hx+=R(-1,1)*dt*20;b.x+=Math.sin(G.t*.7+b.id)*4*dt;b.y+=Math.cos(G.t*.5+b.id)*2*dt;}else if(b.t<=0){b.t=R(.5,2);b.x+=R(-6,6);b.y+=R(-3,3);}
      if(dd<scare&&!G.over){b.state='fly';b.t=R(6,10);const a=Math.atan2(b.y-D.y,b.x-D.x)+R(-.7,.7);b.vx=Math.cos(a)*spd;b.vy=Math.sin(a)*spd;b.honk=1;
        if(rnd()<.3)float(b.x,b.y-20,b.kind==='crow'?'Caw!':b.kind==='goose'?'HONK!':b.kind==='gull'||b.kind==='parrot'?'Squawk!':b.kind==='toucan'?'Croak-croak!':'Quack!','#eee');}}
    else{ // flying
      b.z=lerp(b.z,95,dt*1.5);if(dd<200){const a=Math.atan2(b.y-D.y,b.x-D.x);b.vx=lerp(b.vx,Math.cos(a)*spd,dt*2);b.vy=lerp(b.vy,Math.sin(a)*spd,dt*2);}
      if(b.t<=0&&dd>300){const tg=b.home?{x:b.home.x+R(-b.home.rx,b.home.rx)*.6,y:b.home.y+R(-b.home.ry,b.home.ry)*.6}:(b.tgt||(b.tgt=(()=>{const c=cells.filter(c=>c.state==='ok');return c.length?c[RI(0,c.length-1)]:{x:b.x,y:b.y};})()));
        const a=Math.atan2(tg.y-b.y,tg.x-b.x),d=Math.hypot(tg.x-b.x,tg.y-b.y);b.vx=lerp(b.vx,Math.cos(a)*Math.min(spd,d*1.5),dt*2);b.vy=lerp(b.vy,Math.sin(a)*Math.min(spd,d*1.5),dt*2);
        if(d<40){b.z=Math.max(0,b.z-140*dt);if(b.z<=1&&d<14){b.state='ground';b.z=0;b.vx=b.vy=0;b.tgt=null;}}}
      b.x=clamp(b.x+b.vx*dt,WX0+20,WX1-20);b.y=clamp(b.y+b.vy*dt,WY0+20,WY1-20);}}
  for(let i=birds.length-1;i>=0;i--)if(birds[i].dead)birds.splice(i,1);
  // respawning
  G.birdT=(G.birdT||0)-dt;if(G.birdT<=0){G.birdT=12;const fl=new Set(birds.filter(b=>b.kind==='sparrow').map(b=>b.flock));if(fl.size<preyN('flocks',4))spawnFlock();
    PONDS.forEach(p=>{if(birds.filter(b=>b.home===p).length<pondCap(p))spawnPondBird(p);});gullHomes().forEach(p=>{if(birds.filter(b=>b.home===p).length<pondCap(p))spawnPondBird(p);});if(birds.filter(b=>b.kind==='crow').length<9)spawnCrow();}
  G.raptorT=(G.raptorT||0)-dt;if(G.raptorT<=0){G.raptorT=45;for(const k of['eagle','hawk'])if(birds.filter(b=>b.kind===k).length<(k==='eagle'?4:3))spawnRaptor(k);}}
// eagles & hawks: circle the dragon, swoop-dive to peck/claw for a few HP, then dodge away. A nuisance, not a threat.
function updRaptor(b,dt,dd,dz){const spd=BIRD[b.kind].sp;
  if(b.state==='perch'){b.z=b.perch.z;if(dd<(D.alt>.5?380:240)&&!G.over&&!G.won){b.state='circle';b.t=R(2,3.5);b.ang=Math.atan2(b.y-D.y,b.x-D.x);float(b.x,b.y-b.z-14,b.kind==='eagle'?'SKREEE!':'Kee-kee!','#ffe0a0');}return;}
  if(dd>650||G.over||G.won){b.state='home';}
  if(b.state==='home'){const p=b.perch;const a=Math.atan2(p.y-b.y,p.x-b.x),d=Math.hypot(p.x-b.x,p.y-b.y);b.x+=Math.cos(a)*Math.min(d,spd*.7*dt);b.y+=Math.sin(a)*Math.min(d,spd*.7*dt);b.z=lerp(b.z,d<30?p.z:110,dt*2);
    if(d<4){b.state='perch';b.z=p.z;}else if(dd<300&&!G.over&&!G.won){b.state='circle';b.t=2;b.ang=Math.atan2(b.y-D.y,b.x-D.x);}return;}
  if(b.state==='circle'){b.ang+=dt*(b.kind==='hawk'?1.6:1.2);const R0=150,tx=D.x+Math.cos(b.ang)*R0,ty=D.y+Math.sin(b.ang)*R0*.7;b.x=lerp(b.x,tx,dt*3);b.y=lerp(b.y,ty,dt*3);b.z=lerp(b.z,dz+70,dt*2);
    if(b.t<=0&&b.cd<=0){if(D.alt>.5||rnd()<.35){b.state='dive';b.t=1.6;}else b.t=R(1.5,3);}return;}
  if(b.state==='dive'){const tz=dz+20,a=Math.atan2(D.y-b.y,D.x-b.x),d=Math.hypot(D.x-b.x,D.y-b.y);b.x+=Math.cos(a)*spd*1.5*dt;b.y+=Math.sin(a)*spd*1.5*dt;b.z=lerp(b.z,tz,dt*4);b.face=Math.cos(a)>0?1:-1;
    if(d<50){const dmg=BIRD[b.kind].dmg;hurtDragon(dmg,b.kind);float(D.x,D.y-dz-60,b.kind==='eagle'?`Eagle talons! -${dmg}`:`Hawk peck! -${dmg}`,'#ffb0a0');puff(D.x,D.y-dz,3,'rgba(220,210,190,',50,3);
      b.state='dodge';b.t=1.2;b.cd=R(3,4.5);b.dx=-Math.cos(a+R(-.8,.8));b.dy=-Math.sin(a+R(-.8,.8));}
    else if(b.t<=0){b.state='circle';b.t=R(1.5,2.5);b.cd=1.5;}return;}
  if(b.state==='dodge'){b.x+=b.dx*spd*1.3*dt;b.y+=b.dy*spd*1.3*dt;b.z=Math.min(dz+150,b.z+90*dt);if(b.t<=0){b.state='circle';b.t=R(1.5,3);b.ang=Math.atan2(b.y-D.y,b.x-D.x);}}
  b.x=clamp(b.x,WX0+20,WX1-20);b.y=clamp(b.y,WY0+20,WY1-20);}
// air mode catches flying birds; walking catches birds on the ground. Raptors dodge the first snap (eagles twice).
function tryEatBird(){const air=D.alt>=0.5,gr=D.alt<0.3;if(!air&&!gr)return false;const mx=D.x+Math.cos(D.ang)*85,my=D.y+Math.sin(D.ang)*85;
  let best=null,bd=1e9;for(const b of birds){if(b.dead)continue;const flying=b.state!=='ground'&&b.state!=='perch'||b.z>25;if(air!==flying)continue;
    const raptor=b.kind==='eagle'||b.kind==='hawk',r=air?(raptor?52:70):DR.eatRGround;const d=Math.min(d2(b.x,b.y,mx,my),dist(b,D)+12);if(d<r&&d<bd){bd=d;best=b;}}
  if(!best)return false;D.eatT=.3;
  const raptor=best.kind==='eagle'||best.kind==='hawk';
  if(raptor&&--best.hp>0){D.eatCD=.5;puff(best.x,best.y-best.z,6,'rgba(200,170,120,',80,4);float(best.x,best.y-best.z-20,'Feathers fly! It dodged!','#ffe0a0');best.state='dodge';best.t=1;best.cd=2;const a=Math.atan2(best.y-D.y,best.x-D.x);best.dx=Math.cos(a);best.dy=Math.sin(a);return true;}
  best.dead=true;const B=BIRD[best.kind];D.eatCD=air?.6:.4;D.hp=Math.min(D.maxHp,D.hp+B.heal);D.healFx=.6;feed(B.heal);G.stats.birds=(G.stats.birds||0)+1;G.stats.birdPts=(G.stats.birdPts||0)+B.pts;
  puff(best.x,best.y-best.z,8,'rgba(230,220,200,',70,4);sparkle(D.x,D.y-heightOf(),raptor?14:7);float(D.x+R(-10,10),D.y-heightOf()-70,`+${B.heal} HP`,'#6dff7a');
  float(best.x,best.y-best.z-18,`${raptor?(best.kind==='eagle'?'Eagle caught!':'Hawk caught!'):'Snack!'} +${B.pts} pts`,'#ffd27a');return true;} // wild birds never raise the alarm
function drawBird(b,fly){const B=BIRD[b.kind],x=b.x,y=fly?b.y-b.z:b.y-(b.state==='perch'?b.z:0),w=Math.sin(b.flap);
  const big=b.kind==='vulture'?2.5:b.kind==='eagle'?2.2:b.kind==='hawk'?1.7:b.kind==='goose'?1.4:b.kind==='gull'?1.15:b.kind==='duck'?1.15:b.kind==='crow'?1.05:.75;
  if(fly){ell(b.x+b.z*.25,b.y+b.z*.1,4*big,1.6*big,'rgba(0,0,0,.18)');const s=6*big,f=w*s*.7;
    ctx.strokeStyle=B.col;ctx.lineWidth=1.6*Math.sqrt(big);ctx.beginPath();ctx.moveTo(x-s,y-f);ctx.quadraticCurveTo(x-s*.4,y-f*.2-2,x,y);ctx.quadraticCurveTo(x+s*.4,y-f*.2-2,x+s,y-f);ctx.stroke();ell(x,y,1.6*big,1.2*big,B.col);
    if(b.kind==='eagle')ell(x,y-1.5*big,1*big,1*big,'#fff');if(b.state==='dive'){ctx.strokeStyle='rgba(255,80,60,.6)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,s+4,0,TAU);ctx.stroke();}return;}
  const f=b.face||1;if(b.home){ell(x,y+1,5*big,2*big,'rgba(255,255,255,.25)');}else ell(x,y+1,4*big,1.6*big,'rgba(0,0,0,.2)');
  ell(x,y-3*big,4*big,2.6*big,B.col);ell(x+f*3.4*big,y-5.2*big,1.7*big,1.6*big,b.kind==='duck'?'#2a6a3a':b.kind==='goose'?'#222':B.col);
  rect(x+f*4.6*big-(f<0?1.6*big:0),y-5.2*big,1.6*big,.9*big,b.kind==='crow'?'#333':'#f0a020');if(b.kind==='eagle')ell(x+f*3.4*big,y-5.2*big,1.6*big,1.5*big,'#fff');}
