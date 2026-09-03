self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    self.registration.unregister().then(() =>
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
    )
  );
});

self.addEventListener('fetch', () => {
  // Deliberadamente sem cache: a app usa sempre a versão publicada no GitHub Pages.
});