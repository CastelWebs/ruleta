self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open('ruleta-cache').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './index.js',
        './index.css',
        './jQueryRotate.js',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
