/**
 * Service Worker for Split-in PWA
 * Focus: Perfect Offline Use & Fast Loading
 */

const CACHE_NAME = 'split-in-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Add your CSS and JS files here, for example:
  // '/style.css',
  // '/app.js',
  // '/manifest.json'
];

// 1. Install Event: Cache all essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting(); // Force activation
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
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

// 3. Fetch Event: "Stale-While-Revalidate" Strategy
// This serves from cache immediately for speed, then updates cache in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Update cache with new version from network
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });

      // Return cached version if available, otherwise wait for network
      return cachedResponse || fetchedResponse;
    }).catch(() => {
      // Fallback for when both cache and network fail (offline and not cached)
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});