// Dragon Rampage service worker (186): lets the game start fully offline after the first open.
// BUILD is stamped by mksw.sh (run from build.sh) with a hash of index.html, so every deploy gets a new cache name
// and a byte-changed sw.js, which makes browsers install the new worker and drop the old cache.
// index.html / the start page is NETWORK-FIRST (revalidated past the HTTP cache), so an online launch always gets the newest build;
// the cache is only used when the network is unreachable. manifest + icons are served from the versioned cache.
// Nothing else (screenshots/, README, other files) is touched.
const BUILD='94e7e5308b00';
const CACHE='dr-'+BUILD;
const CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png',
  'icons/splash-1170x2532.png','icons/splash-2532x1170.png'];
const BASE=new URL('./',self.location).href;
const abs=p=>new URL(p,BASE).href;
const PAGES=new Set([abs('./'),abs('index.html')]);
const ASSETS=new Set(CORE.filter(p=>p!=='./'&&p!=='index.html').map(abs));
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(p=>
    fetch(new Request(abs(p),{cache:'reload'})).then(r=>{if(r.ok)return c.put(abs(p==='./'?'index.html':p),r);if(p==='./'||p==='index.html')throw new Error('precache '+p+' '+r.status);})
  ))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dr-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
function netFirst(req){
  const key=abs('index.html');
  const net=fetch(new Request(key,{cache:'no-cache',credentials:'same-origin'})).then(r=>{
    if(r&&r.ok){const cp=r.clone();caches.has(CACHE).then(h=>h&&caches.open(CACHE).then(c=>c.put(key,cp))).catch(()=>{});}return r;}); // a replaced worker never re-creates its deleted cache
  // a hung connection (lie-fi) falls back to the cached copy after 6 s; a fresh sw.js still arrives and prompts the update
  const slow=new Promise(res=>setTimeout(res,6000)).then(()=>caches.match(key)).then(m=>m||net);
  return Promise.race([net.catch(()=>caches.match(key).then(m=>m||Promise.reject(new Error('offline')))),slow]);
}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);u.search='';u.hash='';const h=u.href;
  if(PAGES.has(h)){e.respondWith(netFirst(r));return;}
  if(ASSETS.has(h))e.respondWith(caches.match(h,{cacheName:CACHE}).then(m=>m||fetch(r)));
});
self.addEventListener('message',e=>{if(e.data==='build'&&e.source)e.source.postMessage({build:BUILD});});
