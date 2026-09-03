/* Service worker : rend l'application utilisable sans réseau, au bord de l'eau. */

const CACHE = 'ma-mouche-du-jour-v2';

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
  'assets/js/coffre.js',
  'assets/js/conditions.js',
  'assets/js/fiche.js',
  'assets/js/app.js',
  'assets/img/mouches/c01.jpg',
  'assets/img/mouches/c02.jpg',
  'assets/img/mouches/c03.jpg',
  'assets/img/mouches/c04.jpg',
  'assets/img/mouches/c05.jpg',
  'assets/img/mouches/c06.jpg',
  'assets/img/mouches/c07.jpg',
  'assets/img/mouches/c08.jpg',
  'assets/img/mouches/c09.jpg',
  'assets/img/mouches/c10.jpg',
  'assets/img/mouches/c11.jpg',
  'assets/img/mouches/c12.jpg',
  'assets/img/mouches/c13.jpg',
  'assets/img/mouches/c14.jpg',
  'assets/img/mouches/c15.jpg',
  'assets/img/mouches/c16.jpg',
  'assets/img/mouches/c17.jpg',
  'assets/img/mouches/c18.jpg',
  'assets/img/mouches/c19.jpg',
  'assets/img/mouches/c20.jpg',
  'assets/img/mouches/c21.jpg',
  'assets/img/mouches/c22.jpg',
  'assets/img/mouches/c23.jpg',
  'assets/img/mouches/c24.jpg',
  'assets/img/mouches/c25.jpg',
  'assets/img/mouches/c26.jpg',
  'assets/img/mouches/c27.jpg',
  'assets/img/mouches/c28.jpg',
  'assets/img/mouches/f01.jpg',
  'assets/img/mouches/f02.jpg',
  'assets/img/mouches/f03.jpg',
  'assets/img/mouches/f04.jpg',
  'assets/img/mouches/f05.jpg',
  'assets/img/mouches/f06.jpg',
  'assets/img/mouches/f07.jpg',
  'assets/img/mouches/f08.jpg',
  'assets/img/mouches/f09.jpg',
  'assets/img/mouches/f10.jpg',
  'assets/img/mouches/f11.jpg',
  'assets/img/mouches/f12.jpg',
  'assets/img/mouches/f13.jpg',
  'assets/img/mouches/f14.jpg',
  'assets/img/mouches/f15.jpg',
  'assets/img/mouches/f16.jpg',
  'assets/img/mouches/f17.jpg',
  'assets/img/mouches/f18.jpg',
  'assets/img/mouches/f19.jpg',
  'assets/img/mouches/f20.jpg',
  'assets/img/mouches/f21.jpg',
  'assets/img/mouches/f22.jpg',
  'assets/img/mouches/f23.jpg',
  'assets/img/mouches/f24.jpg',
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
