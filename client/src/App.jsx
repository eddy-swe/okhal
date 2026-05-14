import { Link, Routes, Route } from 'react-router-dom'
import { AuthProvider }                from '@/context/AuthContext'
import { ProtectedRoute, StaffRoute }  from '@/components/ProtectedRoute'
import Navbar                          from '@/components/Navbar'
import LoginPage                       from '@/pages/LoginPage'
import RegisterPage                    from '@/pages/RegisterPage'

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-earth-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-terracotta-500
                        flex items-center justify-center shadow-lg">
          <span className="text-white text-4xl font-display font-bold">O</span>
        </div>
        <h1 className="text-5xl font-display font-bold text-inkwood mb-3">Okhal</h1>
        <p className="text-earth-500 text-lg mb-8 font-body">Kenyan &amp; Ethiopian Fusion</p>
        <Link to="/menu" className="btn-primary inline-block">Explore the menu →</Link>
      </div>
    </div>
  )
}

function Placeholder({ label }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <p className="text-earth-400 font-body">{label}</p>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4">
      <div>
        <h2 className="text-3xl font-display font-bold text-inkwood mb-3">Page not found</h2>
        <a href="/" className="text-terracotta-500 hover:underline font-body">← Go home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/menu"     element={<Placeholder label="Menu — coming in Phase 4" />} />

        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <Placeholder label="Order tracking — coming in Phase 7" />
          </ProtectedRoute>
        } />

        <Route path="/staff" element={
          <StaffRoute>
            <Placeholder label="Staff dashboard — coming in Phase 8" />
          </StaffRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}