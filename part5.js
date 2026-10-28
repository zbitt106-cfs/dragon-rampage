// ======================= rendering =======================
let cam={x:1600,y:1300,z:1};const DS=1.4; // dragon draw scale: huge adult dragon
function ell(x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);ctx.fill();}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
function poly(pts,c,stroke){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();if(c){ctx.fillStyle=c;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
function line(x1,y1,x2,y2,c,w){ctx.strokeStyle=c;ctx.lineWidth=w||1;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}

function tower(x,y,r,h,roof){ell(x,y+4,r+3,r*.6+2,'#6a6a70');rect(x-r,y-h,2*r,h,'#94949a');ell(x,y-h,r,r*.6,'#a4a4aa');
  for(let i=-r;i<r;i+=9)rect(x+i,y-h-7,5,7,'#a8a8ae');if(roof)poly([x-r-4,y-h-4,x,y-h-46,x+r+4,y-h-4],roof);}
function drawCastle(){if(GFX_HI){drawCastleHi();return;}const W=CWALL,th=22;
  // walls (thick, crenellated)
  rect(W.x0-th/2,W.y0-th/2,W.x1-W.x0+th,th,'#8d8d92');rect(W.x0-th/2,W.y1-th/2,W.x1-W.x0+th,th,'#85858b');
  rect(W.x0-th/2,W.y0,th,W.y1-W.y0,'#8d8d92');rect(W.x1-th/2,W.y0,th,W.y1-W.y0,'#8d8d92');
  for(let x=W.x0;x<W.x1;x+=22){rect(x,W.y0-th/2-7,12,8,'#a0a0a6');if(Math.abs(x-GATE.x)>50)rect(x,W.y1-th/2-7,12,8,'#9a9aa0');}
  rect(W.x0-th/2,W.y1-th/2+th-5,W.x1-W.x0+th,5,'#6a6a70');
  // keep (great hall)
  if(kUp('keep')){const kx=KEEP_POS.x,ky=KEEP_POS.y;rect(kx-70,ky-70,140,70,'#9c9ca2');rect(kx-14,ky-30,28,30,'#3a2a20');drawKeepRoofLo(kx,ky);}else if(PR.state==='tower')drawInsidePrincess(KEEP_POS.x,KEEP_POS.y-14);
  ctx.fillStyle='#fff';ctx.font='bold 15px Georgia';ctx.textAlign='center';ctx.fillText(`Castle Aldric · King William · Level ${G.lvl}`,CASTLE.x,W.y0-30);
  // gold hoard piles
  for(const g of goldPiles){if(g.amt<=0){ell(g.x,g.y,14,6,'rgba(90,70,30,.5)');continue;}const n=Math.min(26,Math.ceil(g.amt/3));ell(g.x,g.y+2,22,8,'#8a6a10');
    for(let i=0;i<n;i++){const ang=i*2.4,rr=(i%4)*4;ell(g.x+Math.cos(ang)*rr*1.5,g.y-Math.floor(i/4)*4+Math.sin(ang)*rr*.4,6,3.4,i%2?'#ffd84a':'#f0b820');}
    if(Math.sin(G.t*3+g.x)>.85)ell(g.x+R(-8,8),g.y-8,2,2,'#fff');
    ctx.fillStyle='#ffe58a';ctx.font='bold 10px Georgia';ctx.textAlign='center';ctx.fillText(`${g.amt} gold`,g.x,g.y+18);}
  // corner towers
  [[W.x0,W.y0],[W.x1,W.y0],[W.x0,W.y1],[W.x1,W.y1]].forEach(([x,y],i)=>{if(kUp('ctower',s=>s.ti===i))tower(x,y+8,26,34,'#3f4a7a');});
  // princess tower (tall, pink roof)
  const T=PRINCESS_TOWER;if(!kUp('ptower'))return;tower(T.x,T.y+30,20,70,'#d86aa8');line(T.x,T.y-86,T.x,T.y-110,'#333',2);poly([T.x,T.y-110,T.x+18,T.y-104,T.x,T.y-98],'#f6c');
  rect(T.x-7,T.y-30,14,16,'#2a1a14');
}
function drawPrincess(x,y,wave,kick){const k=kick?Math.sin(G.t*14)*3:0;
  line(x-1.5,y+2,x-2-k,y+8,'#f0c8a0',1.5);line(x+1.5,y+2,x+2+k,y+8,'#f0c8a0',1.5);
  poly([x-6,y+4,x,y-10,x+6,y+4],'#ff7fc8');ell(x,y-12,3,3,'#f8d8b8');rect(x-3,y-15.5,6,2,'#ffd84a');poly([x-3,y-15.5,x-2,y-18,x,y-15.5,x+2,y-18,x+3,y-15.5],'#ffd84a');
  const wv=wave?Math.sin(G.t*8)*3:0;line(x-3,y-7,x-8,y-12+wv,'#f8d8b8',1.4);line(x+3,y-7,x+8,y-12-wv,'#f8d8b8',1.4);
  if(!drawPrincess.noTag){ctx.font='bold 9px Georgia';ctx.textAlign='center';ctx.fillStyle='rgba(60,0,40,.75)';ctx.fillText('Princess Elizabeth',x+1,y-21);ctx.fillStyle='#ffb0dc';ctx.fillText('Princess Elizabeth',x,y-22);}}
function drawLair(){const x=LAIR.x,y=LAIR.y; // a rocky cave-nest on the very top of Dragon Peak, the highest summit
  // the summit massif (drawn under everything at the top of the mountains)
  ell(x,y+60,300,150,'rgba(0,0,0,.18)');
  poly([x-330,y+120,x-210,y-70,x-90,y-150,x+40,y-190,x+170,y-130,x+300,y-20,x+340,y+120],'#7d7f8c');
  poly([x+40,y-190,x+170,y-130,x+300,y-20,x+340,y+120,x+90,y+120],'#666874');
  poly([x-210,y-70,x-90,y-150,x+40,y-190,x+170,y-130,x+120,y-95,x+40,y-120,x-60,y-90,x-140,y-40],'#f4f8ff');
  // cave mouth at the back of the nest
  ell(x+10,y-70,90,56,'#4a4a52');ell(x+10,y-62,70,42,'#1a1418');ell(x+10,y-50,58,22,'#2a2024');
  for(let i=0;i<7;i++){const a=Math.PI+i/6*Math.PI;ell(x+10+Math.cos(a)*84,y-70+Math.sin(a)*52,14,10,i%2?'#8a8c96':'#9a9ca6');}
  // nest ring of boulders, sticks and snow
  for(let i=0;i<18;i++){const a=i/18*TAU;ell(x+Math.cos(a)*120,y+20+Math.sin(a)*70,22,15,i%3?'#7a7a84':'#8e8e98');if(i%3===0)ell(x+Math.cos(a)*124,y+14+Math.sin(a)*70,14,6,'#f4f8ff');}
  ell(x,y+20,98,58,'#5a4c3c');ell(x,y+22,84,48,'#6e5a44');
  for(let i=0;i<14;i++){const a=i*.9;line(x+Math.cos(a)*60,y+20+Math.sin(a)*34,x+Math.cos(a+.5)*86,y+20+Math.sin(a+.4)*46,'#4a3826',3);}
  // bones and an old skull
  for(let i=0;i<6;i++){const a=i*1.1+.3,bx=x+Math.cos(a)*62,by=y+24+Math.sin(a)*32;line(bx-9,by-3,bx+9,by+3,'#efe8d4',3);ell(bx-9,by-3,3,3,'#efe8d4');ell(bx+9,by+3,3,3,'#efe8d4');}
  ell(x-70,y+42,9,7,'#efe8d4');ell(x-73,y+41,2,2,'#333');ell(x-67,y+41,2,2,'#333');
  // the hoard (partH): grows with the stash, from a few coins to a mountain of treasure
  drawHoard();
  // snow flurries
  for(let i=0;i<10;i++){const t=(G.t*.3+i*.1)%1;ell(x-200+i*44+Math.sin(G.t+i)*10,y-160+t*260,2,2,'rgba(255,255,255,'+(1-t)*.8+')');}
  if(PR.state==='lair'){drawPrincess(x+50,y+10,false);ctx.fillStyle='#fff';ctx.font='bold 11px Georgia';ctx.textAlign='center';ctx.fillText('Hmph! ...this nest is actually quite comfy. And COLD.',x+50,y-26);}
  ctx.fillStyle='#ffd27a';ctx.font='bold 14px Georgia';ctx.textAlign='center';ctx.fillText(`Dragon's Lair (Dragon Peak) · ${G.stash} gold stashed`,x,y-150);
  if(D.princess){ctx.strokeStyle=`rgba(255,220,100,${.5+.4*Math.sin(G.t*5)})`;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y+20,130,80,0,0,TAU);ctx.stroke();}}
function drawMine(){const x=MINE.x,y=MINE.y;ell(x,y-20,110,70,'#7d6f5b');ell(x-10,y-40,80,50,'#90826c');ell(x+40,y-60,50,30,'#9d8f78');
  ctx.fillStyle='#1a1410';ctx.beginPath();ctx.moveTo(x-26,y+14);ctx.lineTo(x-26,y-12);ctx.arc(x,y-12,26,Math.PI,0);ctx.lineTo(x+26,y+14);ctx.fill();
  if(kUp('minehead')){rect(x-30,y-40,6,54,'#6b4a26');rect(x+24,y-40,6,54,'#6b4a26');rect(x-34,y-44,68,8,'#7a5530');}
  line(x-20,y+30,x+60,y+120,'#555',3);line(x-6,y+26,x+74,y+116,'#555',3);
  ctx.fillStyle='#ffe';ctx.font='bold 13px Georgia';ctx.textAlign='center';ctx.fillText('Stone Mine',x,y-90);}
function drawCamp(){const x=CAMP.x,y=CAMP.y;if(kUp('camptent'))poly([x-30,y+10,x,y-34,x+30,y+10],'#c2ab7a','#7a6440');line(x,y-34,x,y+10,'#7a6440',1);
  ell(x+50,y+30,12,8,'#8a6236');ell(x+50,y+27,10,6,'#b38a55');
  ctx.fillStyle='#ffe';ctx.font='bold 13px Georgia';ctx.textAlign='center';ctx.fillText('Logging Camp',x+20,y-50);}
function drawWells(){} // wells are real structures now (partR)
function drawPen(P){ctx.strokeStyle='#7a5a30';ctx.lineWidth=2;ctx.strokeRect(P.x,P.y,P.w,P.h);ctx.lineWidth=1;
  for(let x=P.x;x<=P.x+P.w;x+=18){rect(x-1.5,P.y-5,3,8,'#6a4a22');rect(x-1.5,P.y+P.h-5,3,8,'#6a4a22');}
  for(let y=P.y;y<=P.y+P.h;y+=18){rect(P.x-1.5,y-5,3,8,'#6a4a22');rect(P.x+P.w-1.5,y-5,3,8,'#6a4a22');}}
function drawCell(c){if(c.burnt){ell(c.x,c.y,10,8,c.flat?'#6a5030':'#2a1f18');if(c.growth>0&&!c.flat)return;return;}
  const g=c.growth,col=c.crop==='wheat'?(g>.8?'#e3c25a':'#a8c25a'):(g>.8?'#c8d25a':'#5d9a3a');
  const h=(c.crop==='wheat'?9:14)*g+2;
  for(let i=-1;i<=1;i++){const x=c.x+i*6;line(x,c.y+6,x+Math.sin(G.t*2+c.x)*1.5,c.y+6-h,col,c.crop==='wheat'?2:3);
    if(c.crop==='corn'&&g>.7)ell(x+2,c.y+2-h*.5,2,3.5,'#f0d040');}
  if(c.fire)ell(c.x,c.y,10,7,'rgba(255,120,20,.45)');}
function drawTree(t){const s=t.s;
  if(GFX_HI&&(t.state==='ok'||t.state==='falling'||!t.state)&&!(t.sapling&&s<.6)){drawTreeHi(t);return;}
  if(t.state==='stump'){ell(t.x,t.y,6*s,4*s,'#6b4a26');ell(t.x,t.y-1,5*s,3*s,'#c9a06a');return;}
  if(t.state==='burnt'){ell(t.x,t.y,7,4,'#1f1712');line(t.x,t.y,t.x-2,t.y-14,'#1a1410',4);return;}
  if(t.sapling&&s<.6){ell(t.x,t.y,6,2.5,'#1f1712');line(t.x,t.y,t.x,t.y-14*s/.3,'#6b4a26',2);ell(t.x-3,t.y-12*s/.3,4*s/.3,3*s/.3,'#5fb04a');ell(t.x+3,t.y-15*s/.3,4*s/.3,3*s/.3,'#6ec055');return;}
  ctx.save();ctx.translate(t.x,t.y);if(t.state==='falling'){ctx.rotate(t.fallA*Math.min(1,t.fallT)**2*Math.PI/2);}
  ell(0,2,14*s,6*s,'rgba(0,0,0,.18)');rect(-3*s,-16*s,6*s,16*s,'#6b4a26');
  const c1=t.fire?'#7a4a1a':(t.hue<.5?'#2e6b2a':'#3b7a2e'),c2=t.fire?'#a0521a':(t.hue<.5?'#3d8a35':'#4e963a');
  ell(0,-26*s,17*s,15*s,c1);ell(-6*s,-30*s,10*s,9*s,c2);ell(6*s,-24*s,9*s,8*s,c2);
  if(t.claimed&&t.claimed.state==='chop')ctx.translate(Math.sin(G.t*30)*.8,0);
  ctx.restore();}
function drawStruct(s){const x=s.x,y=s.y,b=s.state==='building'?s.build:1;
  if(drawStructK(s))return;
  if(GFX_HI&&s.state==='ok'&&drawStructHi(s))return;
  if(s.kind==='gate'){if(s.state==='ruin'){rect(x-40,y-30,80,30,'#2b2018');for(let i=0;i<6;i++)line(x-34+i*13,y,x-30+i*13+(i%2?8:-6),y-14-(i%3)*5,'#1a120c',3);return;}
    const open=clamp(G.gateOpenT,0,1);rect(x-44,y-58,10,60,'#7d7d83');rect(x+34,y-58,10,60,'#7d7d83');rect(x-46,y-64,92,10,'#8d8d92');
    rect(x-34,y-54,68,56,'#2b2018');const ph=56*(1-open*.85);for(let i=-3;i<=3;i++)line(x+i*10,y-54,x+i*10,y-54+ph,'#7a7a7a',2.5);for(let j=0;j<ph;j+=11)line(x-34,y-54+j,x+34,y-54+j,'#6a6a6a',2);
    if(s.state==='building'){rect(x-25,y-72,50*s.build,4,'#7fd07f');}if(s.hp<s.maxHp){rect(x-30,y+6,60,4,'#400');rect(x-30,y+6,60*s.hp/s.maxHp,4,'#f80');}return;}
  if(s.state==='ruin'){ell(x,y,s.kind==='barn'||s.kind==='barracks'?42:30,16,'#2b211a');for(let i=0;i<5;i++)line(x-20+i*10,y,x-22+i*10+(i%2?6:-4),y-10-(i%3)*4,'#1a120c',3);
    return;}
  if(s.kind==='hut'){const H=30*b;rect(x-26,y-H+4,52,H,s.fire?'#8a6a40':'#cfae72');rect(x-26,y+2,52,3,'#9a7a48');
    if(b>=1){poly([x-34,y-24,x,y-54,x+34,y-24],s.fire?'#5a3a1a':'#93622d');for(let i=-2;i<=2;i++)line(x+i*10,y-24,x+i*5,y-48,'rgba(70,40,15,.5)',1);rect(x-6,y-14,12,18,'#5a3a1c');rect(x+12,y-18,8,7,'#3a2a1a');}
  } else if(s.kind==='barn'){const H=46*b;rect(x-40,y-H+4,80,H,s.fire?'#6a2a20':'#a8322a');
    if(b>=1){poly([x-48,y-38,x,y-72,x+48,y-38],s.fire?'#3a2a20':'#6b5a4a');rect(x-14,y-22,28,26,'#f2e8d8');line(x-14,y-22,x+14,y+4,'#a8322a',3);line(x+14,y-22,x-14,y+4,'#a8322a',3);}
  } else if(s.kind==='barracks'){const H=40*b;rect(x-50,y-H+4,100,H,s.fire?'#5a4a3a':'#8a7a62');
    if(b>=1){poly([x-56,y-34,x,y-60,x+56,y-34],s.fire?'#3a2a20':'#4a3a5a');rect(x-10,y-20,20,24,'#3a2a20');rect(x-40,y-26,10,8,'#2a2018');rect(x+30,y-26,10,8,'#2a2018');
      line(x+46,y-60,x+46,y-84,'#333',2);poly([x+46,y-84,x+62,y-79,x+46,y-74],'#c22');ctx.fillStyle='#fff';ctx.font='bold 10px Georgia';ctx.textAlign='center';ctx.fillText('Barracks',x,y+16);}
  } else if(s.kind==='cabin'){const H=28*b;rect(x-30,y-H+4,60,H,s.fire?'#5a3a1a':'#7a5230');for(let j=0;j<H;j+=6)line(x-30,y-H+4+j,x+30,y-H+4+j,'rgba(40,25,10,.5)',1);
    if(b>=1){poly([x-36,y-22,x,y-46,x+36,y-22],s.fire?'#3a2a1a':'#4a6a32');rect(x-6,y-14,12,18,'#3a2410');rect(x+14,y-36,6,14,'#666');
      line(x-28,y-6,x-40,y-20,'#6b4a26',2);ell(x-42,y-22,6,4,'#a07a50');ctx.fillStyle='#ffe';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText("Hunters' Cabin",x,y-56);}
  } else if(s.kind==='logpile'){const n=Math.min(18,G.yardWood||0);rect(x-34,y-4,68,6,'#5a3a1c');
    for(let i=0;i<n;i++){const row=Math.floor(i/6),col=i%6,lx=x-27+col*11+row*5,ly=y-6-row*9;ell(lx,ly,5.5,5,'#8a5a2a');ell(lx,ly,3.5,3.3,'#d2a868');}
    if(n===0){ctx.fillStyle='#fdd';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText('(empty)',x,y-12);}
    ctx.fillStyle='#ffe';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText(`Camp log yard: ${G.yardWood||0}`,x,y-46);
  } else if(s.kind==='stonepile'){const n=Math.min(20,G.yardStone||0);ell(x,y,40,12,'#6a6258');
    for(let i=0;i<n;i++){const a=i*2.4,r=(i%5)*6,sx=x+Math.cos(a)*r*1.6,sy=y-4-Math.floor(i/5)*7+Math.sin(a)*r*.5;ell(sx,sy,7,5,i%2?'#a39d94':'#8d877e');}
    ctx.fillStyle='#ffe';ctx.font='bold 12px Georgia';ctx.textAlign='center';ctx.fillText(`Mine stone yard: ${G.yardStone||0}`,x,y-40);}
  if(s.state==='building'){ctx.strokeStyle='#d8b880';ctx.lineWidth=2;ctx.strokeRect(x-28,y-40,56,44);line(x-28,y-40,x+28,y+4,'#d8b880',2);
    rect(x-25,y-50,50*b,4,'#7fd07f');ctx.strokeStyle='#000';ctx.lineWidth=1;ctx.strokeRect(x-25,y-50,50,4);}
  if(s.fire&&s.hp<s.maxHp){rect(x-20,y+8,40,3,'#400');rect(x-20,y+8,40*s.hp/s.maxHp,3,'#f80');}}
function drawPerson(u){const x=u.x,y=u.y,bob=Math.sin(u.anim)*1.2,f=u.face;
  ell(x,y+1,4,1.8,'rgba(0,0,0,.25)');
  line(x-1.2,y,x-1.2+Math.sin(u.anim)*1.5,y-4,'#3a2a1a',1.4);line(x+1.2,y,x+1.2-Math.sin(u.anim)*1.5,y-4,'#3a2a1a',1.4);
  const sh=u.type==='hunter'?'#5a4a2a':u.type==='archer'?'#2f6a2a':u.type==='crew'?'#8a6a3a':(u.shirt||'#a55');
  if(u.type==='hunter'){ctx.save();ctx.translate(x,y);ctx.scale(1.35,1.35);ctx.translate(-x,-y);}rect(x-2.8,y-10+bob*.3,5.6,6.5,u.burn>0?'#f60':sh);
  ell(x,y-12.5+bob*.3,2.4,2.4,'#f0c8a0');if(GFX_HI)personHi(u,x,y,bob,f||1,u.burn>0?'#f60':sh);
  if(u.type==='hunter'){poly([x-3,y-12,x,y-17.5,x+3,y-12],'#3a5a22');rect(x-4,y-9,1.6,6,'#6b4a26');
    if(u.mode==='dagger'){const st=u.stab>0?5:0;line(x+f*2,y-8,x+f*(6+st),y-9,'#ddd',1.6);rect(x+f*2-1,y-9,2,2,'#6b4a26');}
    else{ctx.strokeStyle='#5a3a16';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(x+f*3,y-8,5.5,-Math.PI/2,Math.PI/2,f<0);ctx.stroke();if(u.draw>0)line(x+f*3,y-13.5,x-f*1,y-8,'#ddd',.8);}
    if(u.hp<u.maxHp){rect(x-7,y-22,14,2,'#400');rect(x-7,y-22,14*u.hp/u.maxHp,2,'#e44');}ctx.restore();return;}
  if(u.militia)drawMilitiaKit(u,x,y,f||1,bob);
  if(u.carry==='bucket'){line(x+f*3,y-8,x+f*5,y-4,'#555',1);rect(x+f*5-2.5,y-4,5,4.5,'#7a5530');ell(x+f*5,y-4,2.5,1,'#6af');}
  else if(u.water){rect(x+f*4-2.5,y-5,5,4.5,'#7a5530');}
  if(u.type==='archer'){if(u.post)ell(x,y+1,6,2.5,'rgba(255,220,120,.35)');ctx.strokeStyle='#6b4a26';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x+f*3,y-8,4,-Math.PI/2,Math.PI/2,f<0);ctx.stroke();rect(x-2.8,y-15,5.6,2,'#2f5a2a');}
  else if(u.job==='woodcutter'){if(u.state==='chop'){const a=Math.sin(u.anim*2)*1.1-0.4;line(x,y-9,x-Math.cos(a)*7,y-9-Math.sin(a)*7,'#6b4a26',1.4);rect(x-Math.cos(a)*7-1.5,y-9-Math.sin(a)*7-1.5,3,3,'#bbb');}
    if(u.carry==='log')line(x-6,y-12,x+6,y-11,'#8a5a2a',3);rect(x-2.5,y-15.5,5,1.6,'#a33');}
  else if(u.job==='miner'){rect(x-2.6,y-15.6,5.2,2,'#d8c040');if(u.state==='pick'){const a=Math.sin(u.anim*2)*1.2;line(x,y-9,x+Math.cos(a)*7,y-9-Math.sin(a)*7,'#6b4a26',1.4);line(x+Math.cos(a)*7-2,y-9-Math.sin(a)*7-2,x+Math.cos(a)*7+2,y-9-Math.sin(a)*7+2,'#ccc',1.5);}}
  else if(u.job==='carter'){ell(x,y-15,6.5,1.8,'#5a3a1c');rect(x-3,y-18,6,3,'#6a4424');line(x+f*3,y-9,x+f*6,y-11,'#2a1a10',1.2);}
  else if(u.job==='farmer'){rect(x-4,y-15.5,8,1.6,'#d8c070');if(u.state==='work'){const a=Math.sin(u.anim*1.5)*.6;line(x,y-8,x+f*6,y-2+a*3,'#6b4a26',1.3);}}
  else if(u.task&&u.state==='build'){const a=Math.sin(u.anim*3);line(x,y-9,x+f*5,y-11+a*3,'#555',1.4);}
  if(u.state==='flee'&&u.type!=='crew'){ctx.fillStyle='#fff';ctx.font='bold 9px Georgia';ctx.textAlign='center';ctx.fillText('!',x,y-17);}}
const FAUNA_ART=new Set(['fish','horse','boar','fox','wolf','bear','beaver','goat','mgoat','cougar','crab','seal']);
function drawAnimal(u){drawAnimal0(u);if(GFX_HI&&!u.burn)furHi(u);}
function drawAnimal0(u){if(FAUNA_ART.has(u.species)){drawFauna(u);return;}const x=u.x,y=u.y,s=u.species,b=0,lift=animalLift(u);
  {const sk=Math.max(.5,1-lift/20);ell(x,y+1,(s==='cow'?9:7)*sk,3*sk,'rgba(0,0,0,.2)');}ctx.save();ctx.translate(0,-lift);
  if(s==='sheep'){ell(x,y-5-b,7,5,'#f2f2ec');ell(x+u.face*6,y-6-b,2.5,2.5,'#333');}
  else if(s==='cow'){ell(x,y-6-b,9,5,'#f5f5f0');ell(x-2,y-7-b,3,2,'#222');ell(x+3,y-5-b,2,1.5,'#222');ell(x+u.face*9,y-7-b,3,2.6,'#e8d8c8');}
  else if(s==='chicken'){ell(x,y-3-b*2,3.5,3,'#fafaf2');ell(x+u.face*3,y-6-b*2,1.8,1.8,'#fafaf2');rect(x+u.face*3-.8,y-8.5-b*2,1.6,1.4,'#e22');rect(x+u.face*4.6,y-6.3-b*2,1.4,.9,'#f0b020');}
  else if(s==='rabbit'){const hop=0;ell(x,y-3-hop,4,3,'#b8a088');ell(x+u.face*3.5,y-5-hop,2.2,2,'#b8a088');line(x+u.face*3,y-6-hop,x+u.face*2.5,y-10-hop,'#b8a088',1.3);line(x+u.face*4,y-6-hop,x+u.face*4.5,y-10-hop,'#b8a088',1.3);ell(x-u.face*4,y-3-hop,1.4,1.4,'#fff');}
  else if(s==='deer'){for(const lx of[-5,-2,3,6])line(x+lx,y-4,x+lx+Math.sin(u.anim+lx)*1.2,y+1,'#6a4428',1.3);ell(x,y-7-b,9,4.2,'#a86a38');ell(x+u.face*9,y-11-b,3,2.6,'#a86a38');
    line(x+u.face*9,y-13-b,x+u.face*7,y-19-b,'#5a3a1a',1.2);line(x+u.face*10,y-13-b,x+u.face*12,y-19-b,'#5a3a1a',1.2);ell(x-u.face*8,y-8-b,1.8,1.6,'#fff');}
  else{ell(x,y-5-b,7,4.5,'#f0a8b0');ell(x+u.face*6.5,y-5-b,2.5,2.2,'#e08890');}
  if(u.burn>0)ell(x,y-6,6,4,'rgba(255,120,0,.6)');ctx.restore();}
function drawKnight(u){if(u.mounted){drawCavalry(u);return;}if(u.foot){drawFootman(u);return;}const x=u.x,y=u.y,f=u.face,g=Math.sin(u.anim*1.5);
  ell(x,y+2,10,3.5,'rgba(0,0,0,.25)');
  for(let i=-1;i<=1;i+=2){line(x+i*5,y-4,x+i*5+g*2*i,y+1,'#4a2e16',1.6);}
  ell(x,y-6,10,4.5,u.burn>0?'#a64':'#7a4a24');ell(x+f*10,y-9,4,2.8,'#7a4a24');rect(x-4,y-9,8,2,u.colr);
  rect(x-2.5,y-17,5,8,'#c8ccd4');ell(x,y-19,2.8,2.8,'#aab0ba');
  const sw=u.swing>0;if(sw){line(x,y-14,x+f*14,y-20,'#eee',2);}else{line(x-f*2,y-12,x+f*16,y-24,'#8a6a40',1.5);poly([x+f*16,y-24,x+f*12,y-24,x+f*14,y-20],u.colr);}
  if(u.hp<u.maxHp){rect(x-8,y-26,16,2,'#400');rect(x-8,y-26,16*u.hp/u.maxHp,2,'#e44');}}
function drawSiege(g){ctx.save();ctx.translate(g.x,g.y);
  ell(0,4,28,10,'rgba(0,0,0,.25)');
  const wh=g.wheel||0;
  if(g.dead){ell(0,0,26,10,'#2a1f18');line(-18,-4,14,-10,'#1a120c',4);line(-10,4,18,-2,'#1a120c',4);ctx.restore();return;}
  ctx.save();ctx.rotate(g.ang);
  rect(-24,-14,48,28,g.fire?'#5a3a1a':'#8a6236');rect(-24,-3,48,6,'#6b4a26');
  [[-16,-16],[16,-16],[-16,16],[16,16]].forEach(([wx,wy])=>{ell(wx,wy,7,3.5,'#3a2a1a');line(wx-Math.cos(wh)*6,wy,wx+Math.cos(wh)*6,wy,'#6b4a26',1.5);});
  if(g.kind==='scorpion'){const r=g.recoil||0;line(-6,0,30,0,'#5a3a1c',5);ctx.strokeStyle='#3a2a1a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(14-r*20,0,22,-1.2,1.2);ctx.stroke();
    line(14-r*20+Math.cos(1.2)*22,Math.sin(1.2)*22,(g.state==='aim'?-4:6),0,'#ddd',1);line(14-r*20+Math.cos(1.2)*22,-Math.sin(1.2)*22,(g.state==='aim'?-4:6),0,'#ddd',1);
    if(g.state==='aim')line(-4,0,34,0,'#aaa',2.5);}
  else{rect(-6,-10,4,20,'#5a3a1c');const a=-0.3-g.armA*1.6+(g.state==='roll'&&g.t<1?0:0);ctx.save();ctx.translate(-4,0);ctx.rotate(0);
    const ax=Math.cos(Math.PI+a)*34,az=Math.sin(Math.PI+a)*0;line(0,0,-30+g.armA*60,0,'#6b4a26',4);ell(-30+g.armA*60,0,6,6,g.armA>0.5?'#6b4a26':'#888');ctx.restore();}
  ctx.restore();
  if(g.hp<g.maxHp){rect(-20,-34,40,4,'#400');rect(-20,-34,40*g.hp/g.maxHp,4,g.kind==='scorpion'?'#e8a030':'#e06030');}
  if(g.state==='abandoned'){ctx.fillStyle='#fff';ctx.font='10px Georgia';ctx.textAlign='center';ctx.fillText('abandoned',0,-38);}
  ctx.restore();}
function drawCart(c){ell(c.x,c.y+3,11,4,'rgba(0,0,0,.25)');
  if(c.wrecked){ctx.globalAlpha=Math.min(1,c.t/3);line(c.x-9,c.y,c.x+7,c.y-4,'#3a2a1a',3);ell(c.x+4,c.y+2,4,2,'#333');ctx.globalAlpha=1;return;}
  rect(c.x-9,c.y-9,18,9,c.fire?'#6a3a1a':'#7a5530');for(let i=0;i<c.stone*3;i++)ell(c.x-5+(i%3)*5,c.y-10,2.8,2.2,'#9a948a');ell(c.x-6,c.y,3,3,'#333');ell(c.x+6,c.y,3,3,'#333');}

function drawDragon(){const h=heightOf(),x=D.x,y=D.y,a=D.ang,alt=D.alt;
  const wOpen=clamp((alt-0.03)/0.45,0,1)*(D.diving?.15:1),flap=Math.sin(D.flapT);
  if(GFX_HI&&!D.swim){drawDragonHi(x,y,a,alt,h,wOpen,flap);}else{
  // shadow
  if(!D.swim){ctx.save();ctx.translate(x+h*.25,y+h*.12);ctx.scale(DS,DS);ctx.rotate(a);ctx.globalAlpha=.32-.12*alt;const ss=1-.15*alt;
  ell(0,0,62*ss,22*ss,'#000');ell(-70*ss,0,28*ss,7*ss,'#000');ell(48*ss,0,22*ss,12*ss,'#000');
  if(wOpen>0){const L=95*wOpen*(.7+.3*flap)*ss;poly([10,-14,-30,-14-L,-40,-14-L*.4,-20,-14],'#000');poly([10,14,-30,14+L,-40,14+L*.4,-20,14],'#000');}
  ctx.restore();}
  ctx.save();ctx.translate(x,y-h+(D.swim?4+Math.sin(G.t*3)*2:0));const k=(1+.18*alt)*DS;ctx.scale(k,k);ctx.rotate(a);
  const hurt=D.hurt>0&&Math.floor(D.hurt*30)%2===0;
  const body=hurt?'#e8584a':'#a8231b',dark=hurt?'#a83a30':'#6e140f',belly=hurt?'#ffd0a0':'#e2a050',wingc=hurt?'rgba(200,70,55,.92)':'rgba(120,22,16,.92)';
  const sway=Math.sin(G.t*2.5+D.walkT*.5)*.25;
  // tail
  ctx.lineCap='round';let px=-36,py=0;for(let i=0;i<8;i++){const nx=-36-i*10,ny=Math.sin(sway*3+i*.5)*i*2.2;line(px,py,nx,ny,body,18-i*2);
    if(i%2===0)poly([nx,ny-4,nx-6,ny,nx,ny+4],dark);px=nx;py=ny;}poly([px-2,py-9,px-18,py,px-2,py+9],dark);
  // legs (hidden as it climbs)
  if(alt<.6&&!D.swim){const la=1-alt/.6,ws=Math.sin(D.walkT)*7*la;ctx.globalAlpha=la;
    [[22,1,ws],[22,-1,-ws],[-22,1,-ws],[-22,-1,ws]].forEach(([lx,s,o])=>{ell(lx+o,s*22,9,6,dark);[-4,0,4].forEach(c=>line(lx+o+6,s*22+c,lx+o+11,s*24+c,'#eee',1.5));});ctx.globalAlpha=1;}
  // wings: folded along the back on the ground, spread and flapping in flight
  for(const s of[-1,1]){
    if(wOpen<1){const fa=1-wOpen;ctx.globalAlpha=fa;poly([16,s*12,-6,s*22,-36,s*20,-30,s*12],wingc);line(16,s*12,-36,s*20,dark,3);ctx.globalAlpha=1;}
    if(wOpen>0){const L=100*wOpen*(.72+.28*flap*s*s),sw=flap*14*wOpen;ctx.globalAlpha=wOpen;
      const sx=14,sy=s*15,ex=-6+sw*.2,ey=s*(15+L*.85),tx=-36-sw,ty=s*(15+L);
      poly([sx,sy,ex,ey,tx,ty,-40,s*(15+L*.55),-46,s*(15+L*.32),-34,s*16],wingc);
      line(sx,sy,ex,ey,dark,4);line(ex,ey,tx,ty,dark,3);line(ex,ey,-40,s*(15+L*.55),dark,2);line(ex,ey,-46,s*(15+L*.32),dark,2);ell(ex,ey,3,3,'#eee');ctx.globalAlpha=1;}}
  // body
  ell(0,0,42,22,body);ell(4,0,30,12,belly);ell(0,0,40,6,dark);
  for(let i=-3;i<=3;i++)poly([i*10-4,0,i*10+3,-6,i*10+5,0],'#f0d090');
  // neck & head
  line(26,0,52,Math.sin(G.t*2)*2,body,18);
  ctx.save();ctx.translate(60,Math.sin(G.t*2)*2);
  ell(0,0,17,12,body);ell(14,0,10,7.5,body);ell(20,-3,2,1.5,'#300');ell(20,3,2,1.5,'#300');
  line(-6,-8,-20,-17,'#eee6c8',3.5);line(-6,8,-20,17,'#eee6c8',3.5);
  ell(4,-7,3.5,2.6,'#ffd31a');ell(4,7,3.5,2.6,'#ffd31a');ell(5,-7,1.2,2,'#000');ell(5,7,1.2,2,'#000');
  if(D.breath){ell(24,0,6,5,'#ffb020');} if(D.eatT>0){poly([10,-9,28,-12,28,12,10,9],'#400');}
  ctx.restore();ctx.restore();}
  if(D.swim){ctx.save();ctx.translate(x,y+4);ctx.scale(DS,DS);ctx.rotate(a);const w=Math.sin(G.t*4)*3;
    ell(-40,0,92,30+w*.5,'rgba(40,110,170,.55)');ell(-95,0,40,12,'rgba(40,110,170,.45)');
    ctx.strokeStyle='rgba(235,248,255,.8)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(-30,0,80+w,32+w*.4,0,-.4,.4+Math.PI*.0);ctx.stroke();
    for(const s of[-1,1]){ctx.beginPath();ctx.ellipse(0,s*30,26+w*2,8,0,0,TAU);ctx.stroke();}
    ctx.lineWidth=2;ctx.strokeStyle='rgba(235,248,255,.55)';ctx.beginPath();ctx.ellipse(-40,0,104+w,40,0,0,TAU);ctx.stroke();ctx.restore();}
  if(D.princess){const px=x+Math.cos(a)*30,py=y-h+Math.sin(a)*30+26;line(px,py-26,px,py-12,'#eee',2);drawPrincess(px,py,true,true);
    if(D.quip){ctx.font='bold 13px Georgia';const w=ctx.measureText(D.quip).width+14;rect(px-w/2,py-58,w,20,'rgba(255,255,255,.92)');poly([px-4,py-38,px+4,py-38,px,py-30],'rgba(255,255,255,.92)');ctx.fillStyle='#c0306a';ctx.textAlign='center';ctx.fillText(D.quip,px,py-43);}}
  if(D.gold>0){const gx=x-Math.cos(a)*10,gy=y-h+16;ell(gx,gy,9,8,'#c8a040');ell(gx,gy-8,4,2,'#a08030');ctx.fillStyle='#3a2a00';ctx.font='bold 9px Georgia';ctx.textAlign='center';ctx.fillText(D.gold,gx,gy+3);}
  if(D.healFx>0){ctx.strokeStyle=`rgba(110,255,130,${D.healFx})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y-h,90*Math.max(.05,1.4-D.healFx),55*Math.max(.05,1.4-D.healFx),0,0,TAU);ctx.stroke();}
  if(D.stompT>0){ctx.strokeStyle=`rgba(255,230,160,${D.stompT*2})`;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(x,y,DR.stompR*Math.max(.05,1.2-D.stompT),DR.stompR*.7*Math.max(.05,1.2-D.stompT),0,0,TAU);ctx.stroke();}}
