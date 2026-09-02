/* Service worker : rend l'application utilisable sans réseau, au bord de l'eau. */

const CACHE = 'mouche-saumon-v1';

const RESSOURCES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/app.css',
  'assets/polices/public-sans-var-latin.woff2',
  'assets/polices/public-sans-var-latin-ext.woff2',
  'assets/polices/zilla-slab-600-latin.woff2',
  'assets/polices/zilla-slab-600-latin-ext.woff2',
  'assets/polices/zilla-slab-700-latin.woff2',
  'assets/polices/zilla-slab-700-latin-ext.woff2',
  'assets/js/donnees.js',
  'assets/js/app.js',
  'assets/img/coffre-couvercle.jpg',
  'assets/img/coffre-fond.jpg',
  'assets/icones/favicon.svg',
  'assets/icones/icone-192.png',
  'assets/icones/icone-512.png',
  'assets/icones/icone-maskable-512.png'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      // addAll échoue en bloc si une seule ressource manque : on les met une à une.
      .then((c) => Promise.all(RESSOURCES.map((r) => c.add(r).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;

  // Les pages : le réseau d'abord, le cache s'il manque.
  if (req.mode === 'navigate') {
    ev.respondWith(
      fetch(req)
        .then((rep) => {
          const copie = rep.clone();
          caches.open(CACHE).then((c) => c.put(req, copie));
          return rep;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  // Le reste : le cache d'abord, le réseau ensuite.
  ev.respondWith(
    caches.match(req).then((cache) => cache || fetch(req).then((rep) => {
      if (rep.ok || rep.type === 'opaque') {
        const copie = rep.clone();
        caches.open(CACHE).then((c) => c.put(req, copie));
      }
      return rep;
    }).catch(() => new Response('Hors ligne et absent du cache.', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })))
  );
});
