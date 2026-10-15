// Сервис-воркер: сайт открывается без сети, расписание намаза считается в браузере из уже загруженных файлов.
// Страницы — «сначала сеть, при обрыве из кэша»; файлы сборки, шрифты и картинки — из кэша. Админка и API не кэшируются.
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;
const OFFLINE = "/offline";
// Next отдаёт Vary по служебным заголовкам (RSC и др.) — для кэша они не важны.
const MATCH = { ignoreVary: true };
const SKIP = [/^\/admin/, /^\/api/, /^\/_next\/image/, /^\/_next\/webpack-hmr/];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(PAGES)
      .then((c) => Promise.allSettled([OFFLINE, "/", "/namaz"].map((u) => c.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![PAGES, ASSETS].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Страница после первой загрузки присылает список файлов сборки, которые она уже получила, — их кладём в кэш.
self.addEventListener("message", (e) => {
  if (e.data?.type !== "cache" || !Array.isArray(e.data.urls)) return;
  e.waitUntil(
    caches.open(ASSETS).then((c) =>
      Promise.allSettled(
        e.data.urls
          .filter((u) => typeof u === "string" && u.startsWith("/_next/static/"))
          .map((u) => c.match(u, MATCH).then((hit) => hit || c.add(u))),
      ),
    ),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || SKIP.some((re) => re.test(url.pathname))) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req, MATCH)) || (await caches.match(OFFLINE, MATCH)) || Response.error()),
    );
    return;
  }

  if (/^\/_next\/static\//.test(url.pathname) || /\.(woff2?|png|jpg|jpeg|webp|avif|svg|ico)$/.test(url.pathname)) {
    e.respondWith(
      caches.match(req, MATCH).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
