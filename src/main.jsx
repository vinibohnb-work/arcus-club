import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import MenteePage from './MenteePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import LandingPage from './LandingPage.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminRoute, MenteeRoute } from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/admin', element: <AdminRoute><App /></AdminRoute> },
  { path: '/mentorado/:id', element: <MenteeRoute><MenteePage /></MenteeRoute> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
