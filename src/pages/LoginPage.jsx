import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const COLORS = {
  bg: '#080808',
  surface: '#111111',
  card: '#161616',
  border: '#2A2A2A',
  accent: '#C9A84C',
  accentLight: '#E2C37A',
  text: '#F2EDE4',
  textMuted: '#8A8070',
  textDim: '#4A4440',
  red: '#E05252',
}

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`
const FONT_UI = `'Jost', 'DM Sans', sans-serif`

export default function LoginPage() {
  const { signIn, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')

    const { data, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }

    // Fetch profile to redirect correctly (with 6s timeout)
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 6000)
      )
      const query = supabase
        .from('profiles')
        .select('role, mentee_id')
        .eq('id', data.user.id)
        .single()

      const { data: profile, error: profileError } = await Promise.race([query, timeout])

      if (profileError) throw profileError

      if (profile?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else if (profile?.role === 'mentee' && profile?.mentee_id) {
        navigate(`/mentorado/${profile.mentee_id}`, { replace: true })
      } else {
        setError('Perfil não encontrado. Entre em contato com o administrador.')
        setLoading(false)
      }
    } catch (err) {
      const msg = err?.message === 'timeout'
        ? 'Tempo esgotado. Verifique sua conexão e tente novamente.'
        : 'Erro ao carregar perfil. Tente novamente.'
      setError(msg)
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.textMuted, fontFamily: FONT_UI }}>Carregando…</div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      backgroundImage: `radial-gradient(ellipse at 20% 0%, #1A140833 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #0D0D1A22 0%, transparent 60%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_UI,
      padding: 24,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px ${COLORS.surface} inset !important;
          -webkit-text-fill-color: ${COLORS.text} !important;
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.accent})` }} />
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontStyle: 'italic', fontWeight: 700, color: COLORS.text }}>
              Arcus Club
            </span>
            <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
          </div>
          <div style={{ fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 400 }}>
            Plataforma de Mentoria
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 4,
          padding: 40,
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: COLORS.text, marginBottom: 4 }}>
              Bem-vindo de volta
            </div>
            <div style={{ fontSize: 14, color: COLORS.textMuted }}>
              Acesse sua conta para continuar
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 500,
                marginBottom: 6,
              }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%',
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  padding: '11px 14px',
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none',
                  fontFamily: FONT_UI,
                }}
                onFocus={(e) => { e.target.style.borderColor = COLORS.accent }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.border }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 11,
                color: COLORS.textMuted,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 500,
                marginBottom: 6,
              }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 2,
                  padding: '11px 14px',
                  color: COLORS.text,
                  fontSize: 15,
                  outline: 'none',
                  fontFamily: FONT_UI,
                }}
                onFocus={(e) => { e.target.style.borderColor = COLORS.accent }}
                onBlur={(e) => { e.target.style.borderColor = COLORS.border }}
              />
            </div>

            {error && (
              <div style={{
                background: `${COLORS.red}15`,
                border: `1px solid ${COLORS.red}44`,
                borderRadius: 2,
                padding: '10px 14px',
                fontSize: 14,
                color: COLORS.red,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                padding: '13px 24px',
                background: loading ? COLORS.textDim : COLORS.accent,
                border: 'none',
                borderRadius: 2,
                color: '#0A0800',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_UI,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: COLORS.textDim }}>
          Acesso restrito aos membros do Arcus Club
        </div>
      </div>
    </div>
  )
}
