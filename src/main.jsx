import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Force SW update: when a new SW is waiting, activate it immediately and reload
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing
      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New SW installed — tell it to skip waiting then reload
          newWorker.postMessage({ type: 'SKIP_WAITING' })
        }
      })
    })
  })
  // When a new SW takes control, reload to get the fresh bundle
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) { refreshing = true; window.location.reload() }
  })
}
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MenteePage from './MenteePage.jsx'
import ProspeccaoPage from './pages/ProspeccaoPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LandingPage from './LandingPage.jsx'
import LinksPage from './pages/LinksPage.jsx'
import PropostaPage from './pages/PropostaPage.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminRoute, MenteeRoute } from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/links', element: <LinksPage /> },
  { path: '/proposta', element: <PropostaPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/definir-senha', element: <SetPasswordPage /> },
  { path: '/admin', element: <AdminRoute><App /></AdminRoute> },
  { path: '/mentorado/:id', element: <MenteeRoute><MenteePage /></MenteeRoute> },
  { path: '/mentorado/:id/prospeccao', element: <MenteeRoute><ProspeccaoPage /></MenteeRoute> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
