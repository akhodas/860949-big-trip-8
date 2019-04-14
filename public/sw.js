const CACHE_NAME = `BIG_TRIP`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `./`,
          `./index.html`,
          `./bundle.js`,
          `./css/normalize.css`,
          `./css/main.css`,
          `./css/flatpickr.min.css`,
          `./img/star--check.svg`,
          `./img/star.svg`,
        ]);
      })
  );
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      caches.match(evt.request)
      .then((response) => {
        return response ? response : fetch(evt.request);
      })
      .catch()
  );
});
