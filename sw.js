const CACHE = 'ec26-v5';

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(['/', '/admin.html', '/manifest.json']))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE).map(k => caches.delete(k))
        ))
    );
});

self.addEventListener('fetch', e => {
    const u = new URL(e.request.url);
    // Skip external API/CDN infrastructure to avoid breaking Firebase or UI engines
    if (u.hostname.includes('firestore') || 
        u.hostname.includes('firebaseauth') || 
        u.hostname.includes('identitytoolkit') || 
        u.hostname.includes('unpkg') || 
        u.hostname.includes('fonts') || 
        u.hostname.includes('cloudinary')) return;

    e.respondWith(
        fetch(e.request).then(r => {
            const cl = r.clone();
            caches.open(CACHE).then(c => c.put(e.request, cl));
            return r;
        }).catch(() => caches.match(e.request))
    );
});
