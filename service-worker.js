const CACHE_NAME = 'pwa-cache-v3.0';
const ASSETS = [
  '/',
  '/index.html',
  '/pwa/manifest.json',
  '/icons/Logo-CGN.avif',
  '/HECKS-BOT/estilos.css',
  '/pwa/estilos.css',
  '/pwa/temas.css',
  '/pwa/componentes.css',
  '/pwa/panel-de-acciones/estilos-PA.css',
  '/componentes/cargador.js',
  '/HECKS-BOT/javascript.js',
  '/pwa/noticias.js',
  '/pwa/javascript.js',
  '/js/raiz/index.js',
  '/componentes/header.html',
  '/componentes/footer.html',
  '/componentes/bottom-bar.html',
  '/componentes/panel-expansion.html',
  '/componentes/chat-overlay.html',
  '/componentes/theme-help.html',
  '/componentes/context-menu.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
