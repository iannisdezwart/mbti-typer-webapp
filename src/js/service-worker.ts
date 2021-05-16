const cacheVersion = '0.0.1'
const staticCache = `static-cache-v${ cacheVersion }`
const dynamicCache = `dynamic-cache-v${ cacheVersion }`

const assets = [
	'/', '/index.html',
	'/test.html',
	'/offline.html',
	'https://fonts.gstatic.com/s/ubuntu/v15/4iCv6KVjbNBYlgoCxCvTtw.ttf',
	'https://fonts.gstatic.com/s/ubuntu/v15/4iCs6KVjbNBYlgo6eA.ttf',
]

const clearCaches = async () => {
	const cacheNames = await caches.keys()
	const deleteCachePromises: Promise<boolean>[] = []

	for (const cacheName of cacheNames) {
		deleteCachePromises.push(caches.delete(cacheName))
	}

	return Promise.all(deleteCachePromises)
}

self.addEventListener('message', async e => {
	const command = e?.data?.command

	if (command == null) return

	if (command == 'clear-cache') {
		await clearCaches()
		e.ports[0].postMessage('Cleared cache!')
	}
})

self.addEventListener('install', (e: ExtendableEvent) => {
	const preCache = async () => {
		const cache = await caches.open(staticCache)
		await cache.addAll(assets)
	}

	const work = Promise.all([ preCache() ])

	e.waitUntil(work)
	self.skipWaiting()
})

self.addEventListener('activate', (e: ExtendableEvent) => {
	const deleteOldCaches = async () => {
		const cacheNames = await caches.keys()
		const deleteCachePromises: Promise<boolean>[] = []

		for (const cacheName of cacheNames) {
			if (cacheName == staticCache || cacheName == dynamicCache) {
				continue
			}

			deleteCachePromises.push(caches.delete(cacheName))
		}

		return Promise.all(deleteCachePromises)
	}

	const navigationPreload = async () => {
		if ('navigationPreload' in self.registration) {
			await self.registration.navigationPreload.enable()
		}
	}

	const work = Promise.all([ deleteOldCaches(), navigationPreload() ])

	e.waitUntil(work)
	self.clients.claim()
})

self.addEventListener('fetch', (e: FetchEvent) => {
	const addResponseToCache = async (clonedResponse: Response) => {
		const cache = await caches.open(dynamicCache)
		cache.put(e.request.url, clonedResponse)
	}

	e.respondWith((async () => {
		try {
			// See if we have the resource in our caches

			const cacheResponse = await caches.match(e.request)

			if (cacheResponse != null) {
				return cacheResponse
			}

			// Respond with preloaded response if it exists and add it to the cache

			const preloadResponse = await e.preloadResponse

			if (preloadResponse != null) {
				addResponseToCache(preloadResponse.clone())
				return preloadResponse
			}

			// Fetch the resource and add it to the cache

			const networkResponse = await fetch(e.request)
			addResponseToCache(networkResponse.clone())
			return networkResponse
		} catch (err) {
			// We're offline and the page is not in our caches, send the fallback page

			if (e.request.mode == 'navigate') {
				const fallbackResponse = await caches.match('/offline.html')
				return fallbackResponse
			}

			return new Response('', { status: 408, statusText: 'Offline' })
		}
	})())
})