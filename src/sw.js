// Service Worker mínimo — sem cache de JS/HTML.
// Na ativação, limpa TODOS os caches antigos e pede reload aos clientes.
// globPatterns vazio → lista de precache injetada aqui será [] mas o marcador é obrigatório.
self.__WB_MANIFEST // eslint-disable-line no-unused-expressions

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.matchAll({ includeUncontrolled: true, type: 'window' }))
      .then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }))
      })
      .then(() => self.clients.claim())
  )
})

// Todas as requisições vão direto à rede — sem interceptação de cache
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request))
})
