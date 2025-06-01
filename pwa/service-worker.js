// ...existing code...
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('pwa-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/pwa/manifest.json',
        // Agrega aquí otros archivos necesarios
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la respuesta es válida, actualiza el caché
        return caches.open('pwa-cache-v1').then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Si falla la red, intenta desde el caché
        return caches.match(event.request);
      })
  );
});
// ...existing code...
