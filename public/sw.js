// SW mínimo: limpa todos os caches antigos na ativação e não faz cache nenhum.
// Isso garante que toda nova aba sempre carregue o bundle mais recente.

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.matchAll({ includeUncontrolled: true, type: 'window' }))
      .then(clients => {
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }))
        return self.clients.claim()
      })
  )
})

// Nenhum cache — todas as requisições vão direto à rede
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request))
})
