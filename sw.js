"use strict";
self.importScripts("./js/fetchGQL.js");
self.importScripts("./js/idb.js");
const cacheName = "animal-pwa";
const filesToCache = [
  "./",
  "./css/style.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
  "./fonts",
  "./fonts/noto-serif-v20-latin-regular.woff2",
  "./index.html",
  "./js/fetchGQL.js",
  "./js/idb.js",
  "./js/main.js",
  "./images/pwa.png",
  "./favicon.ico",
];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        return cache.addAll(filesToCache);
      } catch (e) {
        console.log("after install", e.message);
      }
    })()
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      try {
        const response = await caches.match(e.request);
        return response || fetch(e.request);
      } catch (e) {
        console.log("load cache", e.message);
      }
    })()
  );
});

self.addEventListener("sync", (e) => {
  if (e.tag == "animal-sync") {
    console.log("onsync");
    e.waitUntil(sendToServer());
  }
});

// self.addEventListener('online', function() {
//   if(!navigator.serviceWorker && !window.SyncManager) {
//     console.log("online");
//       fetchData().then(function(response) {
//           if(response.length > 0) {
//               return sendToServer();
//           }
//       });
//   }
// });

self.addEventListener("offline", function () {
  alert("You have lost internet access!");
});
