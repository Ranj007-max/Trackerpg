self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then(clients => {
      if (clients && clients.length) {
        clients.forEach(client => client.navigate(client.url));
      }
    });
});
