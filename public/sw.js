// Minimal service worker: caches the app shell so the site can *open*
// offline and show a friendly message. It does NOT cache the live menu,
// prices, or enable offline ordering — those need a real connection to
// Firebase, and the app tells the user that clearly (see OfflineNotice).

const CACHE_NAME = "aone-shell-v1";
const SHELL_FILES = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Network-first for everything (menu/prices must always be fresh);
  // fall back to the cached shell only if the network is unreachable.
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((res) => res || caches.match("/index.html"))
    )
  );
});