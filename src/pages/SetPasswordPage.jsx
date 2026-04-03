import { useState, useEffect } from 'react'
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
  teal: '#2DD4BF',
}

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`
const FONT_UI = `'Jost', 'DM Sans', sans-serif`

export default function SetPasswordPage() {
  const { isMentee, menteeId, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // Se não houver sessão ativa após o carregamento, manda para o login
  useEffect(() => {
    if (authLoading) return
    if (!isMentee) navigate('/login', { replace: true })
  }, [authLoading, isMentee, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError('Erro ao definir senha. Tente novamente.')
      return
    }

    setDone(true)
    setTimeout(() => navigate(`/mentorado/${menteeId}`, { replace: true }), 2000)
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
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 48, width: 'auto', objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontSize: 11, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 400 }}>
            Plataforma de Mentoria
          </div>
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 40 }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: COLORS.teal, marginBottom: 8 }}>
                Senha definida!
              </div>
              <div style={{ fontSize: 14, color: COLORS.textMuted }}>
                Redirecionando para o seu portal…
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT_DISPLAY, fontStyle: 'italic', color: COLORS.text, marginBottom: 4 }}>
                  Defina sua senha
                </div>
                <div style={{ fontSize: 14, color: COLORS.textMuted }}>
                  Crie uma senha para acessar a plataforma.
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[['password', 'Nova Senha', password, setPassword], ['confirm', 'Confirmar Senha', confirm, setConfirm]].map(([id, label, val, setter]) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500, marginBottom: 6 }}>
                      {label}
                    </label>
                    <input
                      type="password"
                      value={val}
                      onChange={(e) => setter(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={{ width: '100%', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: '11px 14px', color: COLORS.text, fontSize: 15, outline: 'none', fontFamily: FONT_UI }}
                      onFocus={(e) => { e.target.style.borderColor = COLORS.accent }}
                      onBlur={(e) => { e.target.style.borderColor = COLORS.border }}
                    />
                  </div>
                ))}

                {error && (
                  <div style={{ background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}44`, borderRadius: 2, padding: '10px 14px', fontSize: 14, color: COLORS.red }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ marginTop: 8, padding: '13px 24px', background: loading ? COLORS.textDim : COLORS.accent, border: 'none', borderRadius: 2, color: '#0A0800', fontSize: 13, fontWeight: 600, fontFamily: FONT_UI, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Salvando…' : 'Definir Senha e Acessar'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
