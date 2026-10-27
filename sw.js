/**
 * CashSplit Service Worker — v15
 * - Offline-first app shell
 * - Own files: network-first (fixes/updates always arrive), cache fallback offline
 * - CDN files (OCR engine): cache-first + background refresh, so the screenshot
 *   reader works offline after it has been loaded once while online
 * - Bumping the version purges every older cache (clears the broken v13/v14 pages)
 */
const VERSION = "v15";
const SHELL = "cashsplit-shell-" + VERSION;
const RUNTIME = "cashsplit-runtime-" + VERSION;
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./bere.html",
  "./dere.html",
];
const OCR_JS =
  "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
const BACKEND_HOSTS = ["script.google.com", "script.googleusercontent.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(SHELL);
      // one by one so a missing optional file never breaks installation
      await Promise.all(
        SHELL_ASSETS.map((u) =>
          fetch(u, { cache: "reload" })
            .then((r) => (r.ok ? shell.put(u, r) : null))
            .catch(() => null),
        ),
      );
      const rt = await caches.open(RUNTIME);
      await rt.add(OCR_JS).catch(() => null);
    })(),
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
  if (BACKEND_HOSTS.includes(url.hostname)) return; // community wall handles its own offline cache

  const sameOrigin = url.origin === self.location.origin;

  // Own pages and files: network first, cached copy when offline
  if (req.mode === "navigate" || sameOrigin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (cacheable(res)) {
            const copy = res.clone();
            caches.open(SHELL).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(req)
            .then(
              (r) =>
                r ||
                (req.mode === "navigate"
                  ? caches.match("./index.html") || caches.match("./")
                  : undefined),
            ),
        ),
    );
    return;
  }

  // CDN files (OCR engine etc.): cache first, refresh in background
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (cacheable(res)) {
            const copy = res.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
