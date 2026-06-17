const CACHE_NAME = 'opennav-v12'; // Đổi tên cache để ép xóa sạch cache cũ

self.addEventListener('fetch', (e) => {
  const url = e.request.url;

  // CỬA THOÁT HIỂM: Nếu thấy Mapbox, dừng SW lại ngay lập tức
  if (url.includes('api.mapbox.com')) {
    return; // SW trả quyền kiểm soát về cho trình duyệt (nó sẽ tự fetch ra ngoài)
  }

  // Với các file khác mới cache
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
