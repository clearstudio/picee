const cacheName = 'picee-pwa-0.0.2';
// 在这个数组里面写入您主页加载需要的资源文件
const filesToCache = [
    '/',
    './index.html',
    './js/chooseImg.js',
    './js/element-ui.js',
    './js/fetch.js',
    './js/main.js',
    './js/paste.js',
    './js/vue.min.js',
    './style/fonts/element-icons.ttf',
    './style/fonts/element-icons.woff',
    './style/element-ui.css',
    './style/main.css',
    './manifest.json',
    './images/icons/icon-144x144.png',
    './images/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache)
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    // 清理旧版本
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // 更新客户端
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
            .then(cache => cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                // 使用缓存而不是进行网络请求，实现app秒开
                return response || fetch(event.request);
            })
    );
});

// 监听推送事件 然后显示通知
self.addEventListener('push', function (event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    const title = 'Push Codelab';
    const options = {
        body: 'Yay it works.',
        icon: '/images/icons/icon-512×512.png',
        badge: '/images/icons/icon-512×512.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// 监听通知的点击事件
self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://developers.google.com/web/') // eslint-disable-line
    );
}); 