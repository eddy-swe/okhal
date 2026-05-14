import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, profile, isStaff, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-earth-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center
                          group-hover:bg-terracotta-600 transition-colors">
            <span className="text-white text-sm font-display font-bold">O</span>
          </div>
          <span className="font-display font-bold text-xl text-inkwood">Okhal</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/menu"
            className="text-earth-600 hover:text-inkwood text-sm font-medium
                       transition-colors px-2 py-1 rounded-lg hover:bg-earth-50"
          >
            Menu
          </Link>

          {isStaff && (
            <Link
              to="/staff"
              className="text-savanna-700 hover:text-savanna-800 text-sm font-medium
                         transition-colors px-2 py-1 rounded-lg hover:bg-savanna-50"
            >
              Staff ↗
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm text-earth-400 max-w-[140px] truncate">
                {profile?.full_name || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-secondary text-sm !py-1.5 !px-3"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"    className="btn-secondary text-sm !py-1.5 !px-3">Sign in</Link>
              <Link to="/register" className="btn-primary  text-sm !py-1.5 !px-3">Register</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}