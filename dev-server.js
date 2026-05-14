// dev-server.js  (repo root)
const http = require('http')
const path = require('path')
const { parse: parseUrl } = require('url')

const PORT = 3001

// Patch Node's res to look like Vercel/Express response
function patchRes(res) {
  res.status = (code) => {
    res.statusCode = code
    return res                          // chainable: res.status(200).json(...)
  }
  res.json = (data) => {
    if (!res.getHeader('Content-Type')) {
      res.setHeader('Content-Type', 'application/json')
    }
    res.end(JSON.stringify(data))
    return res
  }
  res.send = (data) => {
    if (typeof data === 'object') return res.json(data)
    res.end(String(data))
    return res
  }
  return res
}

const server = http.createServer(async (req, res) => {
  patchRes(res)   // ← must be first

  const { pathname } = parseUrl(req.url)

  // CORS for local dev
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end() }

  if (!pathname.startsWith('/api/')) {
    res.statusCode = 404
    return res.json({ error: 'Not an API route' })
  }

  const handlerPath = path.join(
    __dirname, 'api',
    pathname.replace(/^\/api/, '') + '.js'
  )

  try {
    delete require.cache[require.resolve(handlerPath)]
    const handler = require(handlerPath)
    const fn = handler.default || handler
    await fn(req, res)
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      res.statusCode = 404
      res.json({ error: `No handler for ${pathname}` })
    } else {
      console.error('API error:', err)
      res.statusCode = 500
      res.json({ error: err.message })
    }
  }
})

server.listen(PORT, () => {
  console.log(`🍲  Okhal API  →  http://localhost:${PORT}/api/health`)
})