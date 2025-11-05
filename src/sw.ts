/// <reference types="@types/serviceworker" />
/// <reference types="workbox-precaching" />



import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// 获取 Service Worker 全局作用域
const selfSW = self as unknown as ServiceWorkerGlobalScope;

// 预缓存配置
precacheAndRoute(selfSW.__WB_MANIFEST);

// 运行时缓存策略

// 页面和静态资源 - stale-while-revalidate
registerRoute(
  ({ request }) =>
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 图片资源 - cache-first
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 字体资源 - cache-first
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'font-resources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// API请求 - network-first
registerRoute(
  ({ request }) => request.url.includes('/api/'),
  new NetworkFirst({
    cacheName: 'api-requests',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// 处理推送通知
selfSW.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {};
  const title = data.title || '通知';
  const options = {
    body: data.body || '',
    icon: data.icon || '/vite.svg',
  };

  event.waitUntil(selfSW.registration.showNotification(title, options));
});

// 处理通知点击
selfSW.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
      selfSW.clients.matchAll({ type: 'window' }).then((clientList: readonly WindowClient[]) => {
      if (clientList.length > 0) {
        const client = clientList[0] as WindowClient;
        return client.focus();
      }
      return selfSW.clients.openWindow('/');
    })
  );
});

// 处理激活事件 - 清理旧缓存
selfSW.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = ['static-resources', 'image-resources', 'font-resources', 'api-requests'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// 处理安装事件
selfSW.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(selfSW.skipWaiting());
});

// 处理消息事件 - 与主线程通信
selfSW.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    selfSW.skipWaiting();
  }
});