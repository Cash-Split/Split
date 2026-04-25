/**
 * Service Worker for CashSplit PWA
 * Handles: Offline caching + Daily balance notifications
 */

const CACHE_NAME = 'split-in-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/maskable_icon_x192.png'
];

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ===== FETCH — Stale-While-Revalidate =====
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
      return cachedResponse || fetchedResponse;
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

// ===== NOTIFICATION CLICK =====
// When user taps the notification, open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ===== PERIODIC BACKGROUND SYNC (Android Chrome PWA) =====
// Fires daily when PWA is installed on Android
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-balance-check') {
    event.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  // Read balance from all open clients
  const clientList = await clients.matchAll({ type: 'window' });

  // We can't read localStorage directly in SW
  // So we post a message to the client to check and respond
  for (const client of clientList) {
    client.postMessage({ type: 'CHECK_BALANCE_FOR_NOTIF' });
  }
}

// ===== MESSAGE HANDLER =====
// Receives balance info from the app page
self.addEventListener('message', (event) => {
  if (event.data?.type === 'BALANCE_IS_ZERO') {
    const now = new Date();
    self.registration.showNotification('CashSplit 💰', {
      body: 'Your balance is KSh 0.00 — tap to add money and plan your budget!',
      icon: '/maskable_icon_x192.png',
      badge: '/maskable_icon_x192.png',
      tag: 'balance-reminder',
      renotify: false,
      data: { url: '/index.html' }
    });
  }
});