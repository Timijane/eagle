const CACHE = 'ec26-v1';
const SHELL = [self.location.href];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);
    if (url.hostname.includes('firestore') || url.hostname.includes('firebaseauth') || url.hostname.includes('identitytoolkit')) return;
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
