const CACHE_NAME = "quiz-storm-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",

  // Images
  "/storm1.png",
  "/storm2.png",

  // Sounds
  "/click.mp3",
  "/correct.mp3",
  "/wrong.mp3",
  "/spin.mp3"
];

// INSTALL
self.addEventListener("install", (event) => {
  console.log("✅ Service Worker Installed");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker Activated");

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

  // Ads ko cache mat karo
  if (
    event.request.url.includes("ads") ||
    event.request.url.includes("doubleclick") ||
    event.request.url.includes("googlesyndication")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {

        // Fresh response cache karo
        const responseClone = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return response;
      })
      .catch(() => {

        // Offline fallback
        return caches.match(event.request);
      })
  );
});
