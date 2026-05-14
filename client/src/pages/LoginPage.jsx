import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { signIn, user } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Where to send the user after login (supports redirect-back from ProtectedRoute)
  const from = location.state?.from?.pathname || '/menu'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  // Already logged in — redirect immediately
  if (user) {
    navigate(from, { replace: true })
    return null
  }

  function change(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn({ email: form.email, password: form.password })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-earth-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-inkwood">Welcome back</h1>
          <p className="text-earth-500 mt-1 font-body">Sign in to your Okhal account</p>
        </div>

        {/* Banner for success message from register page */}
        {location.state?.message && (
          <div className="mb-4 p-3 rounded-xl bg-savanna-50 border border-savanna-200 text-savanna-700 text-sm">
            {location.state.message}
          </div>
        )}

        <div className="card p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-inkwood mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={change}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-inkwood mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={change}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-earth-400 mt-6">
            No account?{' '}
            <Link to="/register" className="text-terracotta-500 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Dev shortcut — remove before Phase 9 */}
        <p className="text-center text-xs text-earth-300 mt-4">
          Staff test account: staff@okhal.test / staffpass123
        </p>
      </div>
    </div>
  )
}