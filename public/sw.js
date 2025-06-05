// Service Worker for Panduan Shalat PWA

const CACHE_NAME = "panduan-shalat-v1"

// Assets to cache
const urlsToCache = ["/", "/manifest.json", "/data/prayers.json", "/icons/icon-512x512.png", "/icons/icon-192x192.png"]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache opened")
        return cache.addAll(urlsToCache)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      // Clone the request
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Add to cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If fetch fails, show offline page
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Handle push notifications (future feature)
self.addEventListener("push", (event) => {
  const title = "Panduan Shalat"
  const options = {
    body: event.data.text(),
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
