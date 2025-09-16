const express = require('express')
// using express.json() instead of body-parser
const { listPublicProjects } = require('./controllers/publicProjectsController')
const { getProjectDetail } = require('./controllers/publicProjectDetailController')
const { listPublicDevelopers } = require('./controllers/publicDevelopersController')
const { getDeveloperDetail } = require('./controllers/publicDeveloperDetailController')
const rateLimit = require('./middleware/rateLimit')
const analytics = require('./services/analyticsService')

const app = express()
app.use(express.json())

app.get('/api/public/projects', rateLimit, async (req, res) => {
  analytics.emit('search.projects', { q: req.query.q, filters: req.query })
  const data = await listPublicProjects(req.query)
  res.json(data)
})

app.get('/api/public/projects/:id', async (req, res) => {
  const project = await getProjectDetail(req.params.id)
  if (!project) return res.status(404).json({ error: 'not found' })
  res.json(project)
})

app.get('/api/public/developers', rateLimit, async (req, res) => {
  analytics.emit('search.developers', { q: req.query.q, filters: req.query })
  const data = await listPublicDevelopers(req.query)
  res.json(data)
})

app.get('/api/public/developers/:id', async (req, res) => {
  const authenticated = !!req.headers['authorization']
  analytics.emit('view.developer_detail', { id: req.params.id, authenticated })
  const dev = await getDeveloperDetail(req.params.id, { authenticated })
  if (!dev) return res.status(404).json({ error: 'not found' })
  res.json(dev)
})

// Simple health check for readiness probes and test harnesses
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log('API server listening on', PORT))

// Export for tests and external control (if required)
module.exports = { app, server }
