import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/utils/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null)
  const [profile, setProfile]   = useState(null)   // row from public.users (has role)
  const [loading, setLoading]   = useState(true)   // true until first auth check completes

  // Fetch the public.users row so we have the role field
  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile fetch failed:', error.message)
    } else {
      setProfile(data)
    }
  }, [])

  useEffect(() => {
    // 1. Load the session that may already exist (page refresh, returning user)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // 2. Subscribe to every future auth event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── Auth actions ──────────────────────────────────

  async function signUp({ email, password, fullName }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },   // stored in auth.users.raw_user_meta_data
      },
    })
    return { data, error }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  // ── Exposed value ─────────────────────────────────

  const value = {
    session,
    user:    session?.user ?? null,
    profile,                              // full public.users row
    loading,
    isStaff:    profile?.role === 'staff',
    isCustomer: profile?.role === 'customer',
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until the initial auth check finishes.
          Without this guard, protected routes flash before redirecting. */}
      {loading ? <AuthLoadingScreen /> : children}
    </AuthContext.Provider>
  )
}

// Shown for ~200ms on first page load while Supabase checks localStorage
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-terracotta-500 animate-pulse" />
        <p className="text-earth-400 text-sm font-body">Loading…</p>
      </div>
    </div>
  )
}

// Custom hook — throws if used outside AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}