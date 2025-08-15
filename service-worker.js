self.addEventListener('install', () => {
  // Activate new service worker as soon as it's installed
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Unregister the service worker
  self.registration.unregister()
    .then(() => {
      // Reload all clients to ensure they get the latest version of the site
      return self.clients.matchAll();
    })
    .then(clients => {
      clients.forEach(client => client.navigate(client.url));
    });
});
