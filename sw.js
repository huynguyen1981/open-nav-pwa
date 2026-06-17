const CACHE_NAME = 'opennav-v11'; // Tăng lên v11 để trình duyệt nhận diện bản cập nhật mới
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Cơ chế dọn rác: Xóa sạch cache v10 khi v11 được kích hoạt
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // 👉 LỖI Ở ĐÂY: Nếu request tới Mapbox, BỎ QUA CACHE, cho tải trực tiếp từ server
  if (url.includes('api.mapbox.com')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Logic cache bình thường cho các asset khác
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
