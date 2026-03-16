import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    // Timeout de segurança: se o Supabase não responder em 8s, libera o loading
    const timeout = setTimeout(() => setLoading(false), 8000)

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(timeout)
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile(session.user.id)
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setAuthReady(true)
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    // Tenta até 4 vezes com backoff (1s, 2s, 3s) para cobrir falhas de rede/RLS temporárias
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        if (!error && data) {
          setProfile(data)
          setLoading(false)
          return
        }
        // PGRST116 = "no rows found" — não adianta retry
        if (error?.code === 'PGRST116') break
      } catch (_) {
        // erro de rede — tenta novamente
      }
      if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
    }
    setLoading(false)
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  const isAdmin = profile?.role === 'admin'
  const isMentee = profile?.role === 'mentee'
  const menteeId = profile?.mentee_id

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, authReady, isAdmin, isMentee, menteeId, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
