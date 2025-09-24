const express = require('express')
const bodyParser = require('body-parser')

// Simple mapping: /functions/v1/<path> -> load ./handlers/<path>.js
const app = express()
app.use(bodyParser.json())

function loadHandler(path) {
  try {
    // convert /auth/signup -> auth/signup/index.ts (absolute)
    const pathLib = require('path')
    const sourcePath = path.slice(1) + '/index.ts'  // remove leading /, add /index.ts
    const handlerPath = pathLib.resolve(__dirname, sourcePath)
    // eslint-disable-next-line import/no-dynamic-require
    const handler = require(handlerPath)
    if (typeof handler !== 'function') return null
    return handler
  } catch (err) {
    console.error('loadHandler error for path', path, err && err.stack)
    return null
  }
}

// Health endpoint for CI/tests (handled before wildcard)
app.get('/functions/v1/health', (req, res) => {
  res.json({ ok: true })
})

app.all('/functions/v1/*', async (req, res) => {
  const relative = req.path.replace('/functions/v1', '')
  const pathLib = require('path')
  const sourcePath = relative.slice(1) + '/index.ts'
  const handlerPathResolved = pathLib.resolve(__dirname, sourcePath)
  const handler = loadHandler(relative)
  if (!handler) return res.status(404).json({ error: 'handler not found', path: relative, handlerPath: handlerPathResolved })
  try {
    const result = await handler(req)
    // handler may return { status, body }
    if (result && result.status) {
      res.status(result.status).json(result.body)
    } else {
      res.json(result)
    }
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Health endpoint for CI/tests
app.get('/functions/v1/health', (req, res) => {
  res.json({ ok: true })
})

const port = process.env.FUNCTIONS_PORT || 54322
app.listen(port, () => console.log(`Functions dev server listening on http://localhost:${port}`))
