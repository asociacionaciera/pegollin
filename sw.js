// Service worker: guarda todo al instalar y responde desde el móvil, con o sin cobertura.
const CACHE = "pegollin-4ab7b6f1";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", "fonts/Fraunces-300-900-latin-ext.woff2", "fonts/Fraunces-300-900-latin.woff2", "fonts/IBMPlexMono-500-latin-ext.woff2", "fonts/IBMPlexMono-500-latin.woff2", "fonts/IBMPlexMono-600-latin-ext.woff2", "fonts/IBMPlexMono-600-latin.woff2", "fonts/WorkSans-400-latin-ext.woff2", "fonts/WorkSans-400-latin.woff2", "fonts/WorkSans-500-latin-ext.woff2", "fonts/WorkSans-500-latin.woff2", "fonts/WorkSans-600-latin-ext.woff2", "fonts/WorkSans-600-latin.woff2", "fonts/WorkSans-700-latin-ext.woff2", "fonts/WorkSans-700-latin.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).catch(() => caches.match("index.html"))));
});
