import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 注册Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })
      console.log('Service Worker registered with scope:', registration.scope)

      // 处理Service Worker更新
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新Service Worker已安装，但旧版本仍在控制应用
              console.log('New Service Worker available')
              // 显示更新提示
              if (confirm('A new version of the app is available. Would you like to update?')) {
                registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
              }
            }
          }
        }
      }

      // 监听来自Service Worker的消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          console.log('Update available message received from Service Worker')
        }
      })
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  })
}
