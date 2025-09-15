// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import ToastProvider from './Components/ToastProvider.jsx'

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//   <StrictMode>
//     <App />
//   <ToastProvider />
//   </StrictMode>
//   </BrowserRouter>
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ToastProvider from './Components/ToastProvider.jsx'
import { registerSW } from './registerServiceWorker'   // 👈 import add kiya

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
      <ToastProvider />
    </StrictMode>
  </BrowserRouter>
)

// 👇 Service worker register call
registerSW({
  onUpdate: (registration) => {
    if (confirm("New version available. Refresh?")) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      registration.waiting.addEventListener('statechange', e => {
        if (e.target.state === 'activated') window.location.reload()
      })
    }
  }
})
