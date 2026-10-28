// ======================= partKW: KING WILLIAM — the king of Castle Aldric gets a name, a face and a voice =======================
// He stands in the castle courtyard with his name tag and shouts orders when the dragon comes near (purely cosmetic: he can't be eaten or hurt).
const KING={name:'King William',x:KEEP_POS.x-45,y:KEEP_POS.y+95};
const KW_SHOUTS=['Guards! Protect Princess Elizabeth!','Archers to the walls!','Not my treasury, you overgrown lizard!','Shields up! Defend the keep!','Ring the bells! The dragon is here!'];
const KW_CARRY=['Guards! Bring back Princess Elizabeth!','After that dragon! Save Princess Elizabeth!'];
function kingSay(s){if(G.kwLast===s&&G.t-(G.kwT||-99)<30)return;G.kwT=G.t;G.kwLast=s;float(KING.x,KING.y-50,`${KING.name}: "${s}"`,'#ffe08a');}
function updKing(dt){if(scene!=="play"||!G||G.over||G.won||(typeof paused!=="undefined"&&paused))return;G.kwCd=(G.kwCd||0)-dt;const dd=d2(D.x,D.y,KING.x,KING.y);
  if(PR.state==='carried'&&!G.kwCarry){G.kwCarry=1;G.kwCd=8;kingSay(KW_CARRY[RI(0,KW_CARRY.length-1)]);return;}
  if(PR.state!=='carried')G.kwCarry=0;
  if(G.kwCd<=0&&dd<760){G.kwCd=R(9,14);kingSay(PR.state==='carried'?KW_CARRY[RI(0,KW_CARRY.length-1)]:KW_SHOUTS[G.kwFirst?RI(0,KW_SHOUTS.length-1):0]);G.kwFirst=1;}}
const _updateKW=update;update=function(dt){const r=_updateKW.apply(this,arguments);updKing(dt);return r;};
function drawKing(){const x=KING.x,y=KING.y,t=G.t||0,near=d2(D.x,D.y,x,y)<760&&scene==='play',wave=near?Math.sin(t*9)*.5:0;
  ell(x+3,y+2,11,4,'rgba(0,0,0,.25)');
  poly([x-9,y,x-6,y-20,x+6,y-20,x+9,y],'#a8142a');rect(x-9,y-3,18,3,'#f4f0e8');rect(x-1,y-20,2,20,'#f4f0e8');   // red robe with ermine trim
  ctx.strokeStyle='#a8142a';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+5,y-17);ctx.lineTo(x+11,y-24-wave*6);ctx.stroke();       // a waving arm (shaking his fist when the dragon is near)
  ell(x+11.5,y-25-wave*6,2.2,2.2,'#f2c9a0');
  ell(x,y-25,5.5,5.5,'#f2c9a0');ell(x,y-21,5,3.4,'#e8e4dc');                                                    // face and big white beard
  poly([x-5,y-29,x-5,y-35,x-2.5,y-32,x,y-36,x+2.5,y-32,x+5,y-35,x+5,y-29],'#ffd23a');ell(x,y-31,1,1,'#e8342a');   // golden crown
  ctx.font='bold 9px Georgia';ctx.textAlign='center';ctx.fillStyle='rgba(40,20,0,.75)';ctx.fillText(KING.name,x+1,y-40);ctx.fillStyle='#ffe08a';ctx.fillText(KING.name,x,y-41);}
const _drawCastleKW=drawCastle;drawCastle=function(){_drawCastleKW.apply(this,arguments);drawKing();};
