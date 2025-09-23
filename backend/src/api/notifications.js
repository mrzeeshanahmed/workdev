import express from 'express'
import * as notificationService from '../services/notificationService.js'

const router = express.Router({ mergeParams: true })

// GET /api/workspaces/:workspaceId/notifications
router.get('/', (req, res) => {
  const workspaceId = req.params.workspaceId
  const list = notificationService.listNotifications({ workspaceId })
  return res.json({ notifications: list })
})

export default router
