import express from 'express'
import bodyParser from 'body-parser'
import { requestLogger } from './utils/logger.js'
import errorHandler from './middleware/errorHandler.js'
import store from './stores/inMemoryStore.js'
import * as savedSearchService from './services/savedSearchService.js'

const app = express()
app.use(bodyParser.json())
// request logging
app.use(requestLogger)

// Use centralized in-memory store seeded by inMemoryStore.js
const developers = store.developers
const projects = store.projects
const savedSearches = store.savedSearches

// Helpers
function ensureDeveloper(id) {
  return developers.get(id)
}

// Routes
import developersRouter from './api/developers.js'
app.use('/developers', developersRouter)

import milestonesRouter from './api/milestones.js'
app.use('/api/workspaces/:workspaceId/milestones', milestonesRouter)

import filesRouter from './api/files.js'
app.use('/api/workspaces/:workspaceId/files', filesRouter)

import notificationsRouter from './api/notifications.js'
app.use('/api/workspaces/:workspaceId/notifications', notificationsRouter)

import messagesRouter from './api/messages.js'
app.use('/api/workspaces/:workspaceId/messages', messagesRouter)

app.post('/developers/:developerId/saved-searches', (req, res) => {
  const developerId = req.params.developerId
  const dev = ensureDeveloper(developerId)
  if (!dev) return res.status(404).json({error: 'developer not found'})

  const {name, criteria, notification_cadence} = req.body
  if (!name || !criteria) return res.status(400).json({error: 'invalid payload'})

  try {
    const created = savedSearchService.createSavedSearch({ developerId, name, query: criteria, notification_cadence })
    return res.status(201).json(created)
  } catch (err) {
    if (err && err.code === 'DUPLICATE') return res.status(409).json({ error: 'duplicate' })
    return res.status(500).json({ error: 'server error' })
  }
})

app.get('/developers/:developerId/saved-searches', (req, res) => {
  const developerId = req.params.developerId
  const dev = ensureDeveloper(developerId)
  if (!dev) return res.status(404).json({error: 'developer not found'})
  const saved = savedSearchService.listSavedSearches({ developerId })
  return res.json({saved_searches: saved})
})

app.delete('/developers/:developerId/saved-searches/:id', (req, res) => {
  const developerId = req.params.developerId
  const id = req.params.id
  const item = savedSearches.get(id)
  if (!item || item.developer_id !== developerId) return res.status(404).json({error: 'not found'})
  const ok = savedSearchService.deleteSavedSearch({ id })
  if (!ok) return res.status(404).json({ error: 'not found' })
  return res.status(204).send()
})

import * as proposalsService from './services/proposalsService.js'

app.post('/projects/:projectId/proposals', async (req, res) => {
  const projectId = req.params.projectId
  const { developer_id, cover_letter, hourly_rate, total_price } = req.body
  if (!developer_id || !cover_letter) return res.status(400).json({ error: 'invalid payload' })

  try {
    const rec = await proposalsService.submitProposal({ projectId, developerId: developer_id, cover_letter, hourly_rate, total_price })
    return res.status(201).json({ id: rec.id, developer_id: rec.developer_id, project_id: rec.project_id, status: rec.status, created_at: rec.created_at })
  } catch (err) {
    if (err && err.code === 'NOT_FOUND') return res.status(404).json({ error: 'project not found' })
    if (err && err.code === 'FORBIDDEN') return res.status(403).json({ error: 'developer not authorized' })
    return res.status(500).json({ error: 'server error' })
  }
})

app.get('/developers/:developerId/proposals', async (req, res) => {
  const developerId = req.params.developerId
  const dev = ensureDeveloper(developerId)
  if (!dev) return res.status(404).json({ error: 'developer not found' })
  const list = await proposalsService.listProposals({ developerId })
  const payload = list.map(p => ({ id: p.id, project_id: p.project_id, status: p.status, created_at: p.created_at, project_title: projects.get(p.project_id)?.title || null }))
  return res.json({ proposals: payload })
})

export default app

// If run directly, start server (ESM-safe)
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] === __filename) {
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server listening on ${port}`))
}

// centralized error handler (must be last middleware)
app.use(errorHandler)
