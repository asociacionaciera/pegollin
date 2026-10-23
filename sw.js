// Service worker: guarda todo al instalar y responde desde el móvil, con o sin cobertura.
// Con cobertura la página se pide primero a internet (así las actualizaciones llegan enseguida);
// sin cobertura o con señal muy lenta (3 s) se usa lo guardado.
const CACHE = "pegollin-d3d229f1";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png", "logo-asociacion.png", "casa-aciera.png", "fonts/Fraunces-300-900-latin-ext.woff2", "fonts/Fraunces-300-900-latin.woff2", "fonts/IBMPlexMono-500-latin-ext.woff2", "fonts/IBMPlexMono-500-latin.woff2", "fonts/IBMPlexMono-600-latin-ext.woff2", "fonts/IBMPlexMono-600-latin.woff2", "fonts/WorkSans-400-latin-ext.woff2", "fonts/WorkSans-400-latin.woff2", "fonts/WorkSans-500-latin-ext.woff2", "fonts/WorkSans-500-latin.woff2", "fonts/WorkSans-600-latin-ext.woff2", "fonts/WorkSans-600-latin.woff2", "fonts/WorkSans-700-latin-ext.woff2", "fonts/WorkSans-700-latin.woff2"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  if(req.mode === "navigate"){
    e.respondWith(new Promise(resolve => {
      let done = false;
      const fromCache = () => caches.match("index.html").then(r => { if(!done){ done = true; resolve(r || Response.error()); } });
      const t = setTimeout(fromCache, 3000);
      fetch(req, { cache: "no-cache" }).then(r => {
        clearTimeout(t);
        if(r && r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); }
        if(!done){ done = true; resolve(r); }
      }).catch(() => { clearTimeout(t); fromCache(); });
    }));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
