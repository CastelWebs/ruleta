const CACHE_NAME = "ruleta-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/index.css",
  "/index.js",
  "/jQueryRotate.js",
  "https://code.jquery.com/jquery-3.6.0.min.js",
  "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"
];

// Instalar el Service Worker y almacenar en caché los recursos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos almacenados en caché");
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar las solicitudes de red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el recurso está en la caché, lo devuelve, si no, lo busca en la red
      return response || fetch(event.request);
    })
  );
});

// Activar el Service Worker y eliminar las cachés anteriores si es necesario
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Borrando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
