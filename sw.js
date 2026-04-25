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

// ── NOTIFICATION CLICK HANDLER ──────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const urlToOpen = self.registration.scope + 'index.html' + (action === 'add' ? '?action=addmoney' : '');

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it and send message
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          client.focus();
          if (action === 'add') client.postMessage({ type: 'FOCUS_ADD_MONEY' });
          return;
        }
      }
      // Otherwise open the app
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});

// ── RECEIVE MESSAGE FROM PAGE TO UPDATE NOTIFICATION ────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_BALANCE_NOTIFICATION') {
    showBalanceNotification(event.data.balance);
  }
});

function showBalanceNotification(balance) {
  const formatted = `KSh ${parseFloat(balance).toFixed(2)}`;
  self.registration.showNotification('💰 CashSplit Balance', {
    body: `Current balance: ${formatted}\nTap "Add Money" to record income`,
    icon: './maskable_icon_x192.png',
    badge: './maskable_icon_x192.png',
    tag: 'cashsplit-balance',   // same tag = replaces previous, always 1 notification
    renotify: false,
    sticky: true,               // keeps it in tray (Android)
    requireInteraction: true,   // won't auto-dismiss on desktop
    silent: true,               // no sound/vibration on updates
    actions: [
      { action: 'add', title: '➕ Add Money' },
      { action: 'open', title: '📊 Open App' }
    ],
    data: { balance }
  });
}