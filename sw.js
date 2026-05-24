const CACHE = 'decision-gate-v2';
const FILES = [
  '/decision-gate/',
  '/decision-gate/index.html',
  '/decision-gate/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

// Network-first: always try network, fall back to cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(res => {
      if(res.ok){
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
