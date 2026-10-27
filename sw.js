/**
 * CashSplit Service Worker — v13
 * Offline-first app shell + runtime caching (so the screenshot reader / OCR engine
 * works offline after it has been loaded once while online).
 */
const SHELL = "cashsplit-shell-v13";
const RUNTIME = "cashsplit-runtime-v13";
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bere.html",
  "./dere.html",
];
const BACKEND_HOSTS = ["script.google.com", "script.googleusercontent.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) =>
      // add one by one so a missing optional file never breaks installation
      Promise.all(SHELL_ASSETS.map((u) => cache.add(u).catch(() => null))),
    ),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL && k !== RUNTIME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

const cacheable = (res) => res && (res.ok || res.type === "opaque");

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  if (!/^https?:$/.test(url.protocol)) return;
  if (BACKEND_HOSTS.includes(url.hostname)) return; // community wall: app handles its own offline cache

  // Page navigations: network first (fresh updates), fall back to cached shell offline
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then(
              (r) => r || caches.match("./index.html") || caches.match("./"),
            ),
        ),
    );
    return;
  }

  // Everything else (own files + OCR engine from CDN): stale-while-revalidate
  const bucket = url.origin === self.location.origin ? SHELL : RUNTIME;
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (cacheable(res)) {
            const copy = res.clone();
            caches.open(bucket).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});

