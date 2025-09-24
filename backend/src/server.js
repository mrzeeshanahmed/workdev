const express = require('express')
// using express.json() instead of body-parser
const { listPublicProjects } = require('./controllers/publicProjectsController')
const { getProjectDetail } = require('./controllers/publicProjectDetailController')
const { listProjects, createProject, getProjectDetail: getProjectDetailInternal } = require('./controllers/projectsController')
const { createProposal, acceptProposal } = require('./controllers/proposalsController')
const { listPublicDevelopers } = require('./controllers/publicDevelopersController')
const { getDeveloperDetail } = require('./controllers/publicDeveloperDetailController')
const rateLimit = require('./middleware/rateLimit')
const auth = require('./middleware/auth')
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

// Client dashboard API: projects (private/public per auth in later iterations)
app.post('/api/projects', auth.requireAuth, async (req, res) => {
  // owner_id must come from authenticated user
  const owner_id = req.user && req.user.id ? req.user.id : null
  const payload = Object.assign({}, req.body, { owner_id })
  const project = await createProject(payload)
  res.status(201).json(project)
})

app.get('/api/projects', async (req, res) => {
  const data = await listProjects(req.query)
  res.json({ total: data.total_count, items: data.items })
})

app.get('/api/projects/:id', async (req, res) => {
  const project = await getProjectDetailInternal(req.params.id)
  if (!project) return res.status(404).json({ error: 'not found' })
  res.json(project)
})

app.post('/api/projects/:id/proposals', auth.requireAuth, async (req, res) => {
  // proposer_id comes from authenticated user only
  const proposer_id = req.user && req.user.id ? req.user.id : null
  const body = Object.assign({}, req.body, { proposer_id })
  const proposal = await createProposal(req.params.id, body)
  res.status(201).json(proposal)
})

app.patch('/api/projects/:projectId/proposals/:proposalId/accept', auth.requireAuth, async (req, res) => {
  const actor = req.user && req.user.id ? req.user.id : null
  const result = await acceptProposal(req.params.projectId, req.params.proposalId, actor)
  if (!result) return res.status(404).json({ error: 'not found' })
  res.json(result)
})

// Simple health check for readiness probes and test harnesses
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
})

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => console.log('API server listening on', PORT))

// Export for tests and external control (if required)
module.exports = { app, server }
