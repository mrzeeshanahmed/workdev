const http = require('http')
const url = require('url')

const PORT = process.env.PORT || 4000

function json(res, obj, status = 200) {
  const body = JSON.stringify(obj)
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
  res.end(body)
}

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true)
  // List projects
  if (u.pathname === '/api/public/projects') {
    const items = [
      { id: '11111111-1111-1111-1111-111111111111', title: 'Featured Project', featured: true },
      { id: '22222222-2222-2222-2222-222222222222', title: 'Regular Project', featured: false }
    ]
    return json(res, { items, total_count: items.length, next_cursor: null })
  }

  // Project detail
  if (u.pathname && u.pathname.startsWith('/api/public/projects/')) {
    const id = u.pathname.split('/').pop()
    return json(res, { id, title: 'Project ' + id, description: 'Full description here' })
  }

  // List developers
  if (u.pathname === '/api/public/developers') {
    const items = [
      { id: '33333333-3333-3333-3333-333333333333', display_name: 'Dev One', headline: 'Frontend' }
    ]
    return json(res, { items, total_count: items.length, next_cursor: null })
  }

  // Developer detail
  if (u.pathname && u.pathname.startsWith('/api/public/developers/')) {
    const id = u.pathname.split('/').pop()
    // If Authorization header present, include contact
    const auth = req.headers['authorization']
  const base = { id, display_name: 'Dev ' + id, headline: 'Full-stack', summary: 'Experienced full-stack developer' }
    if (auth) {
      base.contact = { email: 'dev@example.com' }
    }
    return json(res, base)
  }

  res.writeHead(404)
  res.end('not found')
})

server.listen(PORT, () => console.log('Dev server listening on', PORT))
