import express from 'express'
import store from '../stores/inMemoryStore.js'
import * as proposalsService from '../services/proposalsService.js'
import * as savedSearchService from '../services/savedSearchService.js'

const router = express.Router()

function ensureDeveloper(id) {
  return store.developers.get(id)
}

// GET /developers/:id/dashboard
router.get('/:id/dashboard', async (req, res) => {
  const id = req.params.id
  const dev = ensureDeveloper(id)
  if (!dev) return res.status(404).json({ error: 'not found' })

  const devAnalytics = store.analytics.get(id) || { profile_views: 0, proposals_submitted: 0, proposals_accepted: 0 }

  const recentProposals = (await proposalsService.listProposals({ developerId: id }))
    .slice(0, 10)
    .map(p => ({ id: p.id, project_id: p.project_id, status: p.status, created_at: p.created_at }))

  const saved = savedSearchService.listSavedSearches({ developerId: id })

  return res.json({ developer: dev, analytics: devAnalytics, recent_proposals: recentProposals, saved_searches: saved })
})

export default router
