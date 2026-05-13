import { Routes, Route } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-earth-50">
      <div className="text-center max-w-md px-6">
        {/* Decorative circle */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-terracotta-500 flex items-center justify-center shadow-lg">
          <span className="text-white text-4xl font-display font-bold">O</span>
        </div>

        <h1 className="text-5xl font-display font-bold text-inkwood mb-3">
          Okhal
        </h1>
        <p className="text-earth-600 text-lg mb-2 font-body">
          Kenyan &amp; Ethiopian Fusion
        </p>
        <p className="text-earth-400 text-sm font-body mb-8">
          Phase 1 scaffold — working ✓
        </p>

        
          href="/api/health"
          className="btn-primary inline-block"
        >
          Ping API →
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}