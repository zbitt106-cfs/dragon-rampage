// ======================= THE SCORCHING SANDS (geometry; loaded before partW): a desert west of the Frostpeak range (through the Sandgate Pass) =======================
const RANGE0=-3750,RANGE1=-2950;                       // the snowy range between the Deepwood and the desert
const passY0=x=>1480+70*Math.sin(x/310),passY1=x=>2180+60*Math.sin(x/240);
const inPass=(x,y)=>y>passY0(x)&&y<passY1(x);
const inRange=(x,y)=>x>RANGE0&&x<RANGE1&&!inPass(x,y)&&y>frostY(x)-1;
const passEdge=(x,y)=>Math.min(Math.abs(y-passY0(x)),Math.abs(y-passY1(x)));
const OASIS={x:-6800,y:2700,rx:240,ry:150};
function inOasis(x,y){const dx=(x-OASIS.x)/OASIS.rx,dy=(y-OASIS.y)/OASIS.ry,a=Math.atan2(dy,dx);return dx*dx+dy*dy<1+.08*Math.sin(a*4);}
VILLAGES.push({x:-5300,y:1850,name:'Sandhaven',desert:1});const DTOWN=VILLAGES[VILLAGES.length-1];DTOWN.vi=VILLAGES.length-1;const DESERT=true;
// ======================= THE WILD WEST (world expansion): the desert ends ~17% sooner; past it lies the Golden Savanna, then the Emerald Jungle =======================
const DESX0=-9250;                                      // desert content keeps its old "WX0+…" offsets relative to this (its west edge is now ~-8600, was -9550)
const desW=y=>-8600+170*Math.sin(y/560+1)+80*Math.sin(y/190);   // desert | savanna border (wavy, blended in the terrain)
const savW=y=>-12700+220*Math.sin(y/640+2)+90*Math.sin(y/230+.5); // savanna | jungle border
const WHOLE={x:-10600,y:2050,rx:270,ry:165};            // the savanna watering hole
const WHOLE2={x:-11300,y:3450,rx:230,ry:145,ph:2.3};      // a second, smaller watering hole in the south-west savanna (~1500 px from the first)
const WHOLES=[WHOLE,WHOLE2];
function inWHole1(H,x,y,k){const dx=(x-H.x)/H.rx,dy=(y-H.y)/H.ry,a=Math.atan2(dy,dx);return dx*dx+dy*dy<(k||1)*(1+.07*Math.sin(a*5+1+(H.ph||0)));}
function inWHole(x,y,k){for(const H of WHOLES)if(inWHole1(H,x,y,k))return true;return false;}
const JRIVER=[[-14250,-120],[-14650,420],[-14300,1000],[-14720,1600],[-14380,2200],[-14820,2800],[-14480,3400],[-14760,4000],[-14600,4700]],JRW=56; // the jungle river, mountains -> sea
function jriverD(x,y){if(x>-13700||x<-15500)return 1e9;let m=1e9;for(let i=0;i<JRIVER.length-1;i++){const[ax,ay]=JRIVER[i],[bx,by]=JRIVER[i+1],dx=bx-ax,dy=by-ay;
  const t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);const d=Math.hypot(x-ax-dx*t,y-ay-dy*t);if(d<m)m=d;}return m;}
const RUINS=[{x:-15650,y:900,w:300},{x:-13500,y:2950,w:240},{x:-15950,y:3250,w:200}]; // overgrown jungle ruins
