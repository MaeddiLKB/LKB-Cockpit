const CACHE_NAME = 'lkb-cockpit-v1';
const ASSETS = [
  './',
  './index.html'
];

// Beim ersten Start: App fest im Handy speichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Auf der Bühne (im Mischpult-WLAN): Erst versuchen online zu laden, bei Fehler sofort aus dem Handyspeicher bedienen!
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
