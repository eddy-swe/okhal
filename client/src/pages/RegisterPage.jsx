import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  if (user) { navigate('/menu', { replace: true }); return null }

  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function change(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setLoading(true)
    const { error } = await signUp({
      email:    form.email,
      password: form.password,
      fullName: form.fullName,
    })
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/login', {
        state: { message: 'Account created! Sign in to start ordering.' },
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-earth-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-inkwood">Create account</h1>
          <p className="text-earth-500 mt-1 font-body">Join Okhal and start ordering</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-inkwood mb-1.5">
                Full name
              </label>
              <input
                id="fullName" name="fullName" type="text"
                autoComplete="name" required
                className="input-field" placeholder="Amara Osei"
                value={form.fullName} onChange={change}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-inkwood mb-1.5">
                Email
              </label>
              <input
                id="email" name="email" type="email"
                autoComplete="email" required
                className="input-field" placeholder="you@example.com"
                value={form.email} onChange={change}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-inkwood mb-1.5">
                Password
              </label>
              <input
                id="password" name="password" type="password"
                autoComplete="new-password" required
                className="input-field" placeholder="Min. 6 characters"
                value={form.password} onChange={change}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-inkwood mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm" name="confirm" type="password"
                autoComplete="new-password" required
                className="input-field" placeholder="••••••••"
                value={form.confirm} onChange={change}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 mt-2"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-earth-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-terracotta-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}