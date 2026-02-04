const CACHE_NAME = 'mon-app-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/ton-logo.png',
  OFFLINE_URL // Très important : on met la page hors-ligne en cache !
];

// Installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Stratégie de récupération
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 1. Si le fichier est dans le cache, on le donne
      if (response) return response;

      // 2. Sinon, on essaie de le chercher sur internet
      return fetch(event.request).catch(() => {
        // 3. SI INTERNET ECHOUE (connexion perdue)
        // On renvoie la page offline.html si c'est une page HTML
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
