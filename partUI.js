// ================= partUI: compact stockpile icons (wood log + stone rock) =================
// The kingdom's DELIVERED stockpile (G.wood / G.stone) as two tiny icons with amounts. Used on the HUD (top right)
// and in the pause menu. The score is shown only in the pause menu (it is still tracked and saved as before).
function uiLog(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='#8a5a2b';ctx.strokeStyle='#3a220e';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-8,-4);ctx.lineTo(6,-4);ctx.lineTo(6,4);ctx.lineTo(-8,4);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#5e3a18';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,-1);ctx.lineTo(3,-1);ctx.moveTo(-5,2);ctx.lineTo(2,2);ctx.stroke();
  ctx.fillStyle='#e6c48a';ctx.strokeStyle='#3a220e';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(6,0,3.2,4,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#a67c44';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(6,0,1.4,2,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
function uiRock(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle='#9aa0a8';ctx.strokeStyle='#33363c';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(-6,-2);ctx.lineTo(-2,-5);ctx.lineTo(4,-4);ctx.lineTo(8,1);ctx.lineTo(6,4);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#c4c9d0';ctx.beginPath();ctx.moveTo(-4,-2);ctx.lineTo(-1,-4);ctx.lineTo(3,-3);ctx.lineTo(0,-1);ctx.closePath();ctx.fill();ctx.restore();}
// draws "[log] 12  [rock] 4" starting at x (left) on baseline-centre y; returns the width used
function uiStock(x,y,fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;const w1=ctx.measureText(String(G.wood|0)).width,w2=ctx.measureText(String(G.stone|0)).width;
  let cx=x+9*s;uiLog(cx,y,s);cx+=13*s;txt(String(G.wood|0),cx,y+fs*.38,fs,'#f0d6a8','left');cx+=w1+12*s;
  uiRock(cx,y,s);cx+=12*s;txt(String(G.stone|0),cx,y+fs*.38,fs,'#e4e8ee','left');cx+=w2;return cx-x;}
function uiStockW(fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;return 9*s+13*s+ctx.measureText(String(G.wood|0)).width+12*s+12*s+ctx.measureText(String(G.stone|0)).width;}
// gold as icons: kingdom treasury = little castle + coin, the dragon's lair hoard = little dragon head + coin
function uiCoin(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#ffd23a';ctx.strokeStyle='#7a5200';ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(0,0,3.6,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff3a8';ctx.beginPath();ctx.arc(-1,-1,1.2,0,Math.PI*2);ctx.fill();ctx.restore();}
function uiCastle(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#b9bec8';ctx.strokeStyle='#2e3138';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(-7,5);ctx.lineTo(-7,-5);ctx.lineTo(-5,-5);ctx.lineTo(-5,-3);ctx.lineTo(-2,-3);ctx.lineTo(-2,-5);ctx.lineTo(2,-5);ctx.lineTo(2,-3);ctx.lineTo(5,-3);ctx.lineTo(5,-5);ctx.lineTo(7,-5);ctx.lineTo(7,5);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#3a2a1a';ctx.beginPath();ctx.moveTo(-2,5);ctx.lineTo(-2,1);ctx.arc(0,1,2,Math.PI,0);ctx.lineTo(2,5);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#2e3138';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,-9);ctx.stroke();ctx.fillStyle='#d23a3a';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(4,-8);ctx.lineTo(0,-7);ctx.closePath();ctx.fill();ctx.restore();}
function uiDragon(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#d8402a';ctx.strokeStyle='#4a0e06';ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(-7,3);ctx.lineTo(-5,-3);ctx.lineTo(-6,-7);ctx.lineTo(-2,-4);ctx.lineTo(2,-4);ctx.lineTo(5,-1);ctx.lineTo(8,0);ctx.lineTo(8,3);ctx.lineTo(3,4);ctx.lineTo(1,6);ctx.lineTo(-4,6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#ffe066';ctx.beginPath();ctx.arc(0,-1,1.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#4a0e06';ctx.fillRect(5.5,.6,1.2,1);ctx.restore();}
function uiAmt(n){n=Math.max(0,n|0);return n>=100000?Math.round(n/1000)+'k':n>=10000?(n/1000).toFixed(1)+'k':String(n);}
function uiTreasury(){return typeof treasury==='function'?treasury():0;}
// "[castle+coin] 150  [dragon+coin] 40"
function uiGold(x,y,fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;const a=uiAmt(uiTreasury()),b=uiAmt(G.stash||0),w1=ctx.measureText(a).width,w2=ctx.measureText(b).width;
  let cx=x+8*s;uiCastle(cx,y,s);uiCoin(cx+7*s,y+3*s,s);cx+=14*s;txt(a,cx,y+fs*.38,fs,'#ffd84a','left');cx+=w1+11*s;
  uiDragon(cx,y,s);uiCoin(cx+8*s,y+3*s,s);cx+=15*s;txt(b,cx,y+fs*.38,fs,'#ffe8a0','left');cx+=w2;UI.goldTxt=[a,b];return cx-x;}
function uiGoldW(fs){fs=fs||12;const s=fs/12;ctx.font=`bold ${fs}px Georgia`;return 8*s+14*s+ctx.measureText(uiAmt(uiTreasury())).width+11*s+15*s+ctx.measureText(uiAmt(G.stash||0)).width;}
// HUD: compact pill, top right (replaces the old score / hunters / ruins / rebuilding panel)
// One row "[log] [rock] | [castle$] [dragon$]" when it fits right of the WANTED panel, else two right-aligned rows (iPhone landscape).
function drawStockPill(){const S=typeof SAFE!=='undefined'?SAFE:{r:0,t:0},touch=TOUCH&&TOUCH.on,fs=touch?12:13,ws=uiStockW(fs),wg=uiGoldW(fs),gap=12,y=10+(touch?S.t:0),right=VW-S.r-10;
  const mw=Math.min(380,VW-560>0?380:VW-300),wantR=VW/2+mw/2+16,one=Math.ceil(ws+gap+wg)+18;
  if(right-one>=wantR){const x=right-one,h=24;panel(x,y,one,h);UI.pill={x,y,w:one,h,rows:1};uiStock(x+8,y+h/2,fs);
    ctx.strokeStyle='rgba(255,220,140,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+8+ws+gap/2,y+5);ctx.lineTo(x+8+ws+gap/2,y+h-5);ctx.stroke();uiGold(x+8+ws+gap,y+h/2,fs);}
  else{const w=Math.ceil(Math.max(ws,wg))+18,h=42,x=right-w;panel(x,y,w,h);UI.pill={x,y,w,h,rows:2};uiStock(x+w-10-ws,y+12,fs);uiGold(x+w-10-wg,y+31,fs);}}
const UI={pill:null};
