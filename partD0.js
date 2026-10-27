// ======================= THE SCORCHING SANDS (geometry; loaded before partW): a desert west of the Frostpeak range (through the Sandgate Pass) =======================
const RANGE0=-3750,RANGE1=-2950;                       // the snowy range between the Deepwood and the desert
const passY0=x=>1480+70*Math.sin(x/310),passY1=x=>2180+60*Math.sin(x/240);
const inPass=(x,y)=>y>passY0(x)&&y<passY1(x);
const inRange=(x,y)=>x>RANGE0&&x<RANGE1&&!inPass(x,y)&&y>frostY(x)-1;
const passEdge=(x,y)=>Math.min(Math.abs(y-passY0(x)),Math.abs(y-passY1(x)));
const OASIS={x:-6800,y:2700,rx:240,ry:150};
function inOasis(x,y){const dx=(x-OASIS.x)/OASIS.rx,dy=(y-OASIS.y)/OASIS.ry,a=Math.atan2(dy,dx);return dx*dx+dy*dy<1+.08*Math.sin(a*4);}
VILLAGES.push({x:-5300,y:1850,name:'Sandhaven',desert:1});const DTOWN=VILLAGES[VILLAGES.length-1];DTOWN.vi=VILLAGES.length-1;const DESERT=true;
