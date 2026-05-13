const CACHE_NAME = "quiz-stormiq-v3";

const urlsToCache = [
  "/Quiz-Storm-IQ/",
  "/Quiz-Storm-IQ/index.html",
  "/Quiz-Storm-IQ/style.css",
  "/Quiz-Storm-IQ/script.js",
  "/Quiz-Storm-IQ/manifest.json",

  // Images
  "/Quiz-Storm-IQ/storm1.png",
  "/Quiz-Storm-IQ/storm2.png",

  // Sounds
  "/Quiz-Storm-IQ/click.mp3",
  "/Quiz-Storm-IQ/correct.mp3",
  "/Quiz-Storm-IQ/wrong.mp3",
  "/Quiz-Storm-IQ/spin.mp3"
];

// INSTALL
self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {

          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }

        })
      );
    })
  );

  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then((response) => {

        const responseClone = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });

        return response;

      })
      .catch(() => {

        return caches.match(event.request);

      })

  );

});
