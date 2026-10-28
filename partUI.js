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
// HUD: compact pill, top right (replaces the old score / hunters / ruins / rebuilding panel)
function drawStockPill(){const S=typeof SAFE!=='undefined'?SAFE:{r:0,t:0},fs=TOUCH&&TOUCH.on?12:13,w=Math.ceil(uiStockW(fs))+18,h=24,x=VW-S.r-10-w,y=10+(TOUCH&&TOUCH.on?S.t:0);
  panel(x,y,w,h);UI.pill={x,y,w,h};uiStock(x+8,y+h/2,fs);}
const UI={pill:null};
