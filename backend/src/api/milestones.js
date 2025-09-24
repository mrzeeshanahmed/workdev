import express from 'express'
import * as milestonesService from '../services/milestonesService.js'
import store from '../stores/inMemoryStore.js'
import db from '../db.js'

const router = express.Router({ mergeParams: true })

// POST /api/workspaces/:workspaceId/milestones
router.post('/', async (req, res) => {
  const workspaceId = req.params.workspaceId
  // check workspace existence: DB-backed if available, otherwise in-memory
  if (db.isDbEnabled) {
    const w = await db.query('SELECT id FROM workspaces WHERE id=$1', [workspaceId])
    if (!w.rowCount) return res.status(404).json({ error: 'workspace not found' })
  } else {
    if (!store.workspaces.get(workspaceId)) return res.status(404).json({ error: 'workspace not found' })
  }
  const { title, description, dueDate, amount } = req.body
  if (!title) return res.status(400).json({ error: 'title required' })
  try {
    const created = await milestonesService.createMilestone({ workspaceId, title, description, dueDate, amount, createdBy: null })
    // normalize id between different service return shapes
    const id = created.id ?? created.milestoneId
    return res.status(201).json({ milestoneId: id, state: created.state })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// GET list
router.get('/', async (req, res) => {
  const workspaceId = req.params.workspaceId
  if (db.isDbEnabled) {
    const w = await db.query('SELECT id FROM workspaces WHERE id=$1', [workspaceId])
    if (!w.rowCount) return res.status(404).json({ error: 'workspace not found' })
  } else {
    if (!store.workspaces.get(workspaceId)) return res.status(404).json({ error: 'workspace not found' })
  }
  try {
    const list = await milestonesService.listMilestonesForWorkspace(workspaceId)
    return res.json({ milestones: list })
  } catch (err) {
    return res.status(500).json({ error: 'server error' })
  }
})

// POST submit
router.post('/:milestoneId/submit', async (req, res) => {
  const id = req.params.milestoneId
  try {
    const rec = await milestonesService.submitMilestone(id)
    return res.json({ milestoneId: rec.id || rec.milestoneId, state: rec.state })
  } catch (err) {
    return res.status(404).json({ error: 'not found' })
  }
})

// POST approve
router.post('/:milestoneId/approve', async (req, res) => {
  const id = req.params.milestoneId
  try {
    const rec = await milestonesService.approveMilestone(id)
    return res.json({ milestoneId: rec.id || rec.milestoneId, state: rec.state })
  } catch (err) {
    return res.status(404).json({ error: 'not found' })
  }
})

// PUT update
router.put('/:milestoneId', async (req, res) => {
  const id = req.params.milestoneId
  const { title, description } = req.body
  try {
    const rec = await milestonesService.updateMilestone({ id, title, description })
    return res.json({ milestoneId: rec.id || rec.milestoneId, state: rec.state, title: rec.title, description: rec.description })
  } catch (err) {
    return res.status(404).json({ error: 'not found' })
  }
})

// POST request revision
router.post('/:milestoneId/request-revision', async (req, res) => {
  const id = req.params.milestoneId
  const { reason } = req.body
  try {
    const rec = await milestonesService.requestRevision(id, reason)
    return res.json({ milestoneId: rec.id || rec.milestoneId, state: rec.state })
  } catch (err) {
    return res.status(404).json({ error: 'not found' })
  }
})

export default router
