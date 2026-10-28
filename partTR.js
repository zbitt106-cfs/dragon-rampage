// ---- partTR: raid TROPHIES - each beaten champion's banner is planted around the hoard (kept for the whole session) ----
let TROPHIES=[];
function trophySlot(i){// ring around the pile, filling from the back outwards, then a wider second ring
  const ring=i<14?0:1,j=ring?i-14:i,cnt=ring?18:14,k=Math.ceil(j/2)*(j%2?1:-1),a=-Math.PI/2+k*(TAU/cnt),rx=ring?150:118,ry=ring?86:70;
  return{x:HX()+Math.cos(a)*rx,y:HY()+8+Math.sin(a)*ry,a};}
function plantTrophy(r){if(!r||TROPHIES.some(t=>t.raidRef===r))return;const i=TROPHIES.length,s=trophySlot(i);
  TROPHIES.push({name:r.name,short:r.short,col:r.col,trim:r.trim,crest:r.crest,big:!!r.big,x:s.x,y:s.y,a:s.a,t0:G.t,raidRef:r,ph:Math.random()*6});
  setTimeout(()=>showToast(`🚩 ${r.short}'s banner is planted at your lair as a trophy`),1200);}
function drawTrophy(f){const age=Math.min(1,Math.max(0,(G.t-f.t0)/1.2)),e=1-Math.pow(1-age,3),x=f.x,y=f.y,H=54*e,t=G.t;
  if(e<=0)return;ell(x,y+1,9,3.5,'rgba(0,0,0,.28)');
  // stone cairn + pole
  ell(x-3,y,4,3,'#8a8478');ell(x+3,y,4,3,'#7a7468');ell(x,y-2,3.5,2.6,'#9a9488');
  line(x,y-1,x,y-H,'#6b4a2a',3);line(x+.8,y-1,x+.8,y-H,'#8a6236',1);
  ell(x,y-H-2,2.8,2.8,f.trim);
  if(e<.98)return;
  // waving cloth: strips with a travelling sine wave, wind blowing east
  const W=30,FH=20,N=10,top=y-H+2,wind=1+.35*Math.sin(t*.7+f.ph);
  const wy=u=>Math.sin(t*5.2*wind-u*4.2+f.ph)*u*4.2, wx=u=>u*W*(.82+.18*Math.cos(t*3+f.ph+u*2));
  ctx.beginPath();ctx.moveTo(x+1,top);for(let i=1;i<=N;i++){const u=i/N;ctx.lineTo(x+1+wx(u),top+wy(u));}
  for(let i=N;i>=0;i--){const u=i/N;ctx.lineTo(x+1+wx(u),top+FH-u*3+wy(u));}ctx.closePath();
  ctx.fillStyle=f.col;ctx.fill();ctx.strokeStyle=f.trim;ctx.lineWidth=1.6;ctx.stroke();
  // shading bands on the folds
  for(let i=1;i<N;i++){const u=i/N,sh=Math.cos(t*5.2*wind-u*4.2+f.ph);if(sh>.3){ctx.fillStyle=`rgba(0,0,0,${(sh-.3)*.18})`;ctx.fillRect(x+1+wx(u-.05),top+wy(u)+1,W/N,FH-u*3-2);}}
  // crest in the middle of the cloth
  const cu=.5;drawCrest(x+1+wx(cu),top+FH/2-1.5+wy(cu),1.9,f.crest,f.trim);}
const _drawHoardTR=drawHoard;drawHoard=function(){
  const back=TROPHIES.filter(f=>Math.sin(f.a)<.15),front=TROPHIES.filter(f=>Math.sin(f.a)>=.15);
  back.sort((a,b)=>a.y-b.y).forEach(drawTrophy);_drawHoardTR();front.sort((a,b)=>a.y-b.y).forEach(drawTrophy);
  // name tag when the dragon is close
  if(typeof D!=='undefined'&&D&&TROPHIES.length){let best=null,bd=1e9;for(const f of TROPHIES){const d=Math.hypot(D.x-f.x,D.y-(f.y-20));if(d<bd){bd=d;best=f;}}
    if(best&&bd<130){ctx.globalAlpha=Math.min(1,(130-bd)/40);txt(`🚩 ${best.name}`,best.x+14,best.y-68,12,'#ffe08a','center');ctx.globalAlpha=1;}}};
const _raidChampDownTR=raidChampDown;raidChampDown=function(u,eaten){const r=u&&u.raid,ok=r&&RAID.cur===r&&!r.done;_raidChampDownTR(u,eaten);if(ok)plantTrophy(r);};
// tiny map marker: one pennant dot per trophy beside the lair
const _drawMapTR=drawMap;drawMap=function(mmx,mmy,mmw,big){_drawMapTR(mmx,mmy,mmw,big);if(!TROPHIES.length||!big)return;const s=mmw/(WX1-WX0),X=mmx+(HX()-WX0)*s,Y=mmy+(HY()-WY0)*s;
  TROPHIES.slice(0,12).forEach((f,i)=>{const px=X-18+i*5,py=Y+14;ctx.fillStyle='#6b4a2a';ctx.fillRect(px,py-8,1,9);ctx.fillStyle=f.col;ctx.fillRect(px+1,py-8,4,3);});
  ctx.fillStyle='#ffe08a';ctx.font='bold 10px Georgia';ctx.textAlign='left';ctx.fillText(`🚩×${TROPHIES.length}`,X-18,Y+26);};
// ---- Princess Elizabeth: knights shout rescue calls while you carry her ----
const PE_SHOUTS=['Rescue Princess Elizabeth!','Unhand Princess Elizabeth, foul beast!','Hold on, Princess Elizabeth, we are coming!','For Princess Elizabeth!','Bring back Princess Elizabeth!','After them! Save the princess!'];
let PE_T=2,PE_I=0;
const _updPartsPE=updParts;updParts=function(dt){_updPartsPE(dt);if(scene!=='play'||!G||G.over||!D.princess){PE_T=Math.min(PE_T,1.5);return;}
  PE_T-=dt;if(PE_T>0)return;PE_T=3.2+Math.random()*1.6;
  let best=null,bd=620;for(const u of units){if(u.dead||u.inside||u.post||!(u.type==='knight'||u.type==='archer'))continue;const d=dist(u,D);if(d<bd){bd=d;best=u;}}
  if(best){const s=PE_SHOUTS[PE_I++%PE_SHOUTS.length];float(best.x,best.y-34,`"${s}"`,'#cfe2ff');}};
