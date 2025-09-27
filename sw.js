const CACHE_NAME = 'serniak-v1';
const urlsToCache = [
  '/',
  '/css/grid-3.0.min.css',
  '/css/blocks-2.14.css',
  '/css/animation-1.0.min.css',
  '/css/menusub-1.0.min.css',
  '/css/popup-1.1.min.css',
  '/css/cover-1.0.min.css',
  '/css/slds-1.4.min.css',
  '/js/jquery-3.7.1.min.js',
  '/js/scripts-3.0.min.js',
  '/js/fallback-1.0.min.js',
  '/js/blocks-2.7.js',
  '/js/animation-1.0.min.js',
  '/js/events-1.0.min.js',
  '/js/menusub-1.0.min.js',
  '/js/slds-1.4.min.js',
  '/js/lazyload-1.3.min.js',
  '/script.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request for caching
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          // Check if valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response for caching
          var responseToCache = response.clone();
          
          // Cache images and static assets
          if (event.request.url.match(/\.(jpg|jpeg|png|webp|css|js)$/)) {
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        });
      }
    )
  );
});

// Clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});