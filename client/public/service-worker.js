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

const CACHE_NAME = 'my-app-cache-v2';
const OFFLINE_URL = '/offline.html';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/index.css', // update if build path changes
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event → cache static assets
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event → clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ⚡ 1. Bypass large streaming files (video/audio/pdf) to prevent cache overflow
  if (url.pathname.startsWith('/books/') && url.pathname.endsWith('/file')) {
    return; // browser handles streaming directly
  }

  // ⚡ 2. Cache API requests (auth, books, students, announcements, metrices)
  if (
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/books') ||
    url.pathname.startsWith('/students') ||
    url.pathname.startsWith('/announcements') ||
    url.pathname.startsWith('/metrices')||
    url.pathname.startsWith('/admin') 
  ) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const resClone = res.clone();
          caches.open('api-cache').then(cache => cache.put(request, resClone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ⚡ 3. Navigation requests → serve offline.html if offline
  if (
    request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
  ) {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // ⚡ 4. Static assets → cache-first strategy
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});

// ⚡ 5. Allow skipWaiting from client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
