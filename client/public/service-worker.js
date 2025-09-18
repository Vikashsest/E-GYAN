// const CACHE_NAME = 'my-app-cache-v1';
// const OFFLINE_URL = '/offline.html';
// const STATIC_ASSETS = [
//   '/',
//   '/index.html',
//   '/offline.html',
//   '/assets/index.css', // build ke hisaab se update karo
//   '/icons/icon-192x192.png',
//   '/icons/icon-512x512.png'
// ];

// // Install event
// self.addEventListener('install', event => {
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
//   );
// });

// // Activate event
// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(keys =>
//       Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
//     )
//   );
//   self.clients.claim();
// });

// // Fetch event
// self.addEventListener('fetch', event => {
//   const { request } = event;
//   const url = new URL(request.url);

//   // ✅ API requests ko detect karo (bina /api ke bhi)
//   if (
//     url.pathname.startsWith('/auth') ||
//     url.pathname.startsWith('/books') ||
//     url.pathname.startsWith('/students') ||
//     url.pathname.startsWith('/announcements') ||
//     url.pathname.startsWith('/metrices')
//   ) {
//     event.respondWith(
//       fetch(request)
//         .then(res => {
//           const resClone = res.clone();
//           caches.open('api-cache').then(cache => cache.put(request, resClone));
//           return res;
//         })
//         .catch(() => caches.match(request))
//     );
//     return;
//   }

//   // ✅ Navigation requests → offline.html
//   if (
//     request.mode === 'navigate' ||
//     (request.method === 'GET' &&
//       request.headers.get('accept')?.includes('text/html'))
//   ) {
//     event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
//     return;
//   }

//   // ✅ Static assets → cache-first
//   event.respondWith(
//     caches.match(request).then(cached => cached || fetch(request))
//   );
// });

// // Allow skipWaiting
// self.addEventListener('message', event => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });

// const CACHE_NAME = 'e-Gyan';
// const OFFLINE_URL = '/offline.html';
// const STATIC_ASSETS = [
//   '/',
//   '/index.html',
//   '/offline.html',
//   '/assets/index.css',
//   '/icons/icon-192x192.png',
//   '/icons/icon-512x512.png'
// ];

// // Install → cache static assets
// self.addEventListener('install', event => {
//   self.skipWaiting();
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
//   );
// });

// // Activate → delete old caches
// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(keys =>
//       Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
//     )
//   );
//   self.clients.claim();
// });

// // Fetch → handle requests
// self.addEventListener('fetch', event => {
//   const { request } = event;
//   const url = new URL(request.url);

//   // 1️⃣ Bypass auth requests
//   if (url.pathname.startsWith('/auth')) {
//     return;
//   }

//   // 2️⃣ Bypass non-GET API requests
//   if (
//     request.method !== 'GET' &&
//     (url.pathname.startsWith('/books') ||
//      url.pathname.startsWith('/students') ||
//      url.pathname.startsWith('/announcements') ||
//      url.pathname.startsWith('/metrices') ||
//      url.pathname.startsWith('/admin'))
//   ) {
//     return;
//   }

//   // 3️⃣ Bypass large streaming files
//   if (url.pathname.startsWith('/books/') && url.pathname.endsWith('/file')) {
//     return;
//   }

//   // 4️⃣ Navigation → offline fallback (skip API routes)
//   if (
//     request.mode === 'navigate' ||
//     (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
//   ) {
//     if (
//       url.pathname.startsWith('/admin') ||
//       url.pathname.startsWith('/students') ||
//       url.pathname.startsWith('/books') ||
//       url.pathname.startsWith('/announcements') ||
//       url.pathname.startsWith('/metrices')
//     ) {
//       return; // Don’t hijack API → let network handle it
//     }

//     event.respondWith(
//       fetch(request).catch(() => caches.match(OFFLINE_URL))
//     );
//     return;
//   }

//   // 5️⃣ Static assets → cache-first
//   event.respondWith(
//     caches.match(request).then(
//       cached => cached || fetch(request).catch(() => caches.match(OFFLINE_URL))
//     )
//   );
// });

// // Allow skipWaiting from client
// self.addEventListener('message', event => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });
