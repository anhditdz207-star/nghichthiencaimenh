import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { watchForUpdates } from './lib/updateNotifier'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => watchForUpdates(registration))
      .catch(() => {
        // bỏ qua nếu không đăng ký được (vd. môi trường dev không hỗ trợ)
      })
  })
}
