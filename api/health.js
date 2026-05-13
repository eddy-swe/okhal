// api/health.js
// Vercel Serverless Function — Node.js runtime
// Pattern: every file in /api exports a default handler(req, res)
// This is NOT Express — you don't call app.listen() or app.get()

export default function handler(req, res) {
  // Always handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  res.status(200).json({
    status:    'ok',
    service:   'okhal-api',
    timestamp: new Date().toISOString(),
    message:   'Phase 1 API is alive 🌿',
  })
}