const cacheName = "Malangjwi-Escape the Moon-1.2.0";
const contentToCache = [
    "Build/6880781bbe13645e35a5652347616e64.loader.js",
    "Build/9bd5612ea14ee45002749fdc7dd49377.framework.js.unityweb",
    "Build/0f47c4d53464de0781cc0655a96e06ef.data.unityweb",
    "Build/3f2126597accf684e35dadf3f8c0e813.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
  if (e.request.url.endsWith('/ServiceWorker.js')) { return; }
    console.log('[Service Worker] Install');
    self.skipWaiting();
    
    e.waitUntil((async function () {
      for (let name of (await caches.keys()))
        caches.delete(name);
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
