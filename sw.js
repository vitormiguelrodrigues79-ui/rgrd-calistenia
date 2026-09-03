const CACHE='rgrd-v3';
const APP='./app-v2.html?v=3';
const ASSETS=[APP,'./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(APP,{cache:'no-store'}).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(APP,copy));
      return response;
    }).catch(()=>caches.match(APP)));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(event.request)));
});