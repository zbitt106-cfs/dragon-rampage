
// ================= partP: Princess Elizabeth is held INSIDE the great keep, under a tough stone roof the dragon must break =================
// The roof: barely scorched by normal fire; bites, stomps, the flying crash stomp and lava shots crack it in stages until it crumbles.
// Castle masons slowly rebuild it while she is still inside. Before it breaks she can't be seen or grabbed.
KDEF.kroof={name:'The keep\'s stone roof',hp:640,stone:1,cost:[0,6],gold:[3,6],pts:300,alarm:16,self:0,sz:60};COST.kroof=KDEF.kroof.cost;STRUCT_NAME.kroof=KDEF.kroof.name;CASTLE_KINDS.add('kroof');
const KROOF={wait:30,build:60,biteDmg:70,fireMul:.012,hint:'Princess Elizabeth is inside the castle — break the stone roof!'};
function kroof(){return structures.find(s=>s.kind==='kroof');}
function keepS(){return structures.find(s=>s.kind==='keep');}
// open = the roof is broken (or the whole keep fell down): she can be seen and grabbed
function roofOpen(){const r=kroof(),k=keepS();return !r||r.state!=='ok'||(k&&k.state==='ruin');}
function roofStage(){const r=kroof();if(!r||r.state!=='ok')return 4;const f=r.hp/r.maxHp;return f>.75?0:f>.5?1:f>.25?2:3;}
function roofHint(force){if(PR.state!=='tower'||roofOpen())return;if(!force&&G.t-(G.roofHintT||-99)<6)return;G.roofHintT=G.t;float(KEEP_POS.x,KEEP_POS.y-150,KROOF.hint,'#ffb0dc');}
// the dragon's jaws on the roof (any altitude: the roof is the top of the keep)
function biteRoof(){const r=kroof();if(!r||r.state!=='ok'||PR.state!=='tower')return false;const mx=D.x+Math.cos(D.ang)*70,my=D.y+Math.sin(D.ang)*70,cy=KEEP_POS.y-40;
  if(d2(mx,my,KEEP_POS.x,cy)>110&&d2(D.x,D.y,KEEP_POS.x,cy)>120)return false;
  HEAVY=true;try{hurtStruct(r,KROOF.biteDmg);}finally{HEAVY=false;}D.eatCD=.55;D.eatT=.3;
  puff(KEEP_POS.x+R(-30,30),cy-30,8,'rgba(170,165,150,',100,7);if(typeof SFX!=='undefined'&&SFX.play)SFX.play('crashStone',KEEP_POS.x,cy,.45);
  if(r.state==='ok')float(KEEP_POS.x+R(-20,20),cy-70,'CRUNCH! You chomp the stone roof','#e0d8c8');roofHint();return true;}
// stage changes, the big crumble, and slow rebuilding by the masons
function updKeepRoof(dt){const r=kroof();if(!r)return;const st=roofStage();
  if(r.stg===undefined)r.stg=st;
  if(st!==r.stg){if(st>r.stg&&st<4){G.shake=Math.max(G.shake,4);puff(KEEP_POS.x,KEEP_POS.y-70,10,'rgba(180,172,160,',120,8);if(typeof SFX!=='undefined'&&SFX.play)SFX.play('crashStone',KEEP_POS.x,KEEP_POS.y,.6);
      float(KEEP_POS.x,KEEP_POS.y-120,['','The stone roof cracks!','Big cracks! Slabs are slipping!','The roof is sagging, one more push!'][st],'#ffd8a0');}
    if(st===4&&r.stg<4&&r.state==='ruin'){G.shake=Math.max(G.shake,12);for(let i=0;i<4;i++)puff(KEEP_POS.x+R(-60,60),KEEP_POS.y-60,10,'rgba(150,145,140,',200,14);
      if(PR.state==='tower'){G.banner={text:'The keep roof crumbles!',sub:'Princess Elizabeth is revealed inside. Grab her (E / X / BITE)!',t:3.5};float(PR.x,PR.y-90,'Eek! My ceiling!','#ff9ad0');}}
    r.stg=st;}
  // rebuild: only while the princess is still inside
  if(r.state==='ruin'&&PR.state==='tower'&&G.t-(r.ruinT||0)>KROOF.wait&&dist(r,D)>500){r.state='building';r.build=0;r.selfB=true;}
  if(r.state==='building'&&r.selfB){if(PR.state!=='tower'){r.state='ruin';r.selfB=false;r.build=0;return;}if(dist(r,D)<260)return;
    r.build+=dt/KROOF.build*(typeof treasRepair==='function'?treasRepair():1);if(Math.random()<dt*2)puff(KEEP_POS.x+R(-40,40),KEEP_POS.y-60,1,'rgba(200,200,200,',30,5);
    if(r.build>=1){r.state='ok';r.hp=r.maxHp;r.build=0;r.selfB=false;r.stg=0;r.hasGold=true;}}}
// --- drawing ---
const RCR=[[-.8,.2,-.3,.9],[.1,.1,.6,.8],[-.4,.5,.2,.95],[.5,.3,.9,.6],[-.9,.6,-.6,.3],[0,.3,-.2,.7]];
function roofCracks(pt,stg){if(stg<1)return;ctx.strokeStyle='rgba(25,22,20,.85)';ctx.lineWidth=stg>2?2.2:1.6;const n=stg===1?2:stg===2?4:6;
  for(let i=0;i<n;i++){const[a,b,c,d]=RCR[i];let[x,y]=pt(a,b);const[x2,y2]=pt(c,d);ctx.beginPath();ctx.moveTo(x,y);for(let k=1;k<=4;k++){const t=k/4;ctx.lineTo(x+(x2-x)*t+(k%2?4:-3),y+(y2-y)*t);}ctx.stroke();}
  if(stg>=3)for(let i=0;i<3;i++){const[x,y]=pt([-.5,.35,.7][i],[.45,.6,.5][i]);ell(x,y,9,5,'#1c1814');ell(x,y+1,6,3,'rgba(255,200,120,.25)');}}
function roofRubble(cx,cy,w){for(let i=0;i<14;i++){const a=hsh01({id:i*7+3}),b=hsh01({id:i*13+1});ell(cx+(a-.5)*w,cy+(b-.5)*w*.25,4+a*5,3+b*3,i%3?'#8a8a90':'#6a6a70');}}
function drawInsidePrincess(x,y){drawPrincess(x,y,true);if(Math.sin(G.t*1.3)>.3)txt('Help! A dragon!',x,y-34,11,'#fff','center');}
function roofBar(x,y){const r=kroof();if(!r||PR.state!=='tower')return;
  if(r.state==='ok'&&(r.hp<r.maxHp||dist(D,KEEP_POS)<1100)){const w=110,f=r.hp/r.maxHp;rect(x-w/2-2,y-2,w+4,11,'rgba(0,0,0,.6)');rect(x-w/2,y,w*f,7,f>.5?'#b8b8c4':f>.25?'#e0a050':'#e05040');
    txt('Stone roof',x,y-4,10,'#eee','center');}
  else if(r.state==='building'){const w=110;rect(x-w/2-2,y-2,w+4,11,'rgba(0,0,0,.6)');rect(x-w/2,y,w*(r.build||0),7,'#7ab8ff');}}
// low graphics keep roof
function drawKeepRoofLo(kx,ky){const r=kroof(),open=roofOpen(),stg=roofStage();
  if(!open){poly([kx-80,ky-68,kx,ky-112,kx+80,ky-68],'#7e8290');line(kx-80,ky-68,kx+80,ky-68,'#5a5e68',3);
    roofCracks((a,b)=>[kx+a*70,ky-108+b*38],stg);}
  else{rect(kx-70,ky-78,140,10,'#3a3028');roofRubble(kx,ky-74,150);
    if(r&&r.state==='building'){for(let i=-2;i<=2;i++)line(kx+i*30,ky-70,kx+i*30,ky-70-40*r.build,'#7a5a30',2);}
    if(PR.state==='tower')drawInsidePrincess(kx,ky-74);}
  roofBar(kx,ky-150);}
// high graphics keep: the shared 2.5D house with a stone-slab roof, cracked by stage, open when broken
function keepHi(x,y,o){const r=kroof(),open=roofOpen(),stg=roofStage();
  if(!open){const P=house(x,y,o),H=o.H,R=o.R,dp=o.dp,w=o.w;
    roofCracks((a,b)=>P(x+a*w*.5,y-dp*b,H+R*(1-Math.abs(a))),stg);}
  else{const P=house(x,y,Object.assign({},o,{R:4,roof:'#3a3028'})),H=o.H;const[cx,cy]=P(x,y-o.dp/2,H+2);roofRubble(cx,cy,o.w+10);
    if(r&&r.state==='building'){for(let i=-2;i<=2;i++){const[a,b]=P(x+i*28,y-o.dp/2,H);line(a,b,a,b-46*r.build,'#7a5a30',2.5);}}
    if(PR.state==='tower')drawInsidePrincess(cx,cy);}
  const[bx,by]=[x,y-o.dp-o.H-o.R-40];roofBar(bx,by);}
{const _u=updK;updK=function(dt){_u(dt);updKeepRoof(dt);};}
// courtyard flagstones (the castle stands outside the detailed core ground canvas, so draw them as a cached overlay)
let _cgc=null;
function drawCastleGround(){const W=CWALL;if(Math.abs(cam.x-CASTLE.x)>2000||Math.abs(cam.y-CASTLE.y)>1600)return;
  if(!_cgc){_cgc=document.createElement('canvas');_cgc.width=W.x1-W.x0;_cgc.height=W.y1-W.y0;const g=_cgc.getContext('2d');g.fillStyle='#b3a487';g.fillRect(0,0,_cgc.width,_cgc.height);
    g.strokeStyle='rgba(90,80,60,.35)';g.lineWidth=1;for(let x=0;x<_cgc.width;x+=28)for(let y=0;y<_cgc.height;y+=20)g.strokeRect(x+((y/20)%2)*14,y,28,20);}
  ctx.drawImage(_cgc,W.x0,W.y0);}
