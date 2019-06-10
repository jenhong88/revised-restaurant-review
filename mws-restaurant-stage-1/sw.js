self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('restaurant-cache-v1').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/css/styles.css',
       '/js/main.js',
       '/js/restaurant_info.js',
       '/js/dbhelper.js',
       '/data/restaurants.json'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

 event.respondWith(
   caches.match(event.request).then(function(response) {
     return response || fetch(event.request);
   })
 );
});
