import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Registra SW mínimo (public/sw.js) que limpa caches antigos e não faz cache
// nenhum — garante que toda nova aba sempre carregue o bundle mais recente.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'SW_UPDATED') {
      window.location.reload()
    }
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
