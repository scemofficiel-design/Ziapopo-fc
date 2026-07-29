/* Service worker désactivé volontairement.
   L'ancienne version mettait le site en cache et servait des versions
   périmées après chaque redéploiement (bouton "ajouter un joueur" invisible,
   etc). Ce fichier nettoie l'ancien cache puis se désinstalle, pour que le
   site charge toujours la dernière version directement depuis GitHub Pages. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});
