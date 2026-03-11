import { Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const COLORS = { bg: '#080808', textMuted: '#8A8070' }
const FONT_UI = `'Jost', 'DM Sans', sans-serif`

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_UI,
    }}>
      <div style={{ color: COLORS.textMuted }}>Carregando…</div>
    </div>
  )
}

// Protege a página principal — apenas admins
export function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user || !profile) return <Navigate to="/login" replace />
  if (profile.role !== 'admin') {
    // Mentorado tentou acessar o painel admin → redireciona para sua página
    return <Navigate to={`/mentorado/${profile.mentee_id}`} replace />
  }

  return children
}

// Protege as páginas de mentorado — admin vê qualquer uma, mentorado só a sua
export function MenteeRoute({ children }) {
  const { id } = useParams()
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading) return <LoadingScreen />
  if (!user || !profile) return <Navigate to="/login" replace />

  // Admin pode acessar a página de qualquer mentorado
  if (isAdmin) return children

  // Mentorado só pode acessar a própria página
  if (String(profile.mentee_id) !== String(id)) {
    return <Navigate to={`/mentorado/${profile.mentee_id}`} replace />
  }

  return children
}
