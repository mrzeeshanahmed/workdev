import express from 'express'
import * as messagesService from '../services/messagesService.js'

const router = express.Router({ mergeParams: true })

// POST create message
router.post('/', async (req, res) => {
  const workspaceId = req.params.workspaceId
  const { threadId, authorId, body, attachments } = req.body
  if (!authorId || !body) return res.status(400).json({ error: 'invalid payload' })
  const rec = await messagesService.createMessage({ workspaceId, threadId, authorId, body, attachments })
  return res.status(201).json(rec)
})

// GET list messages for workspace (optional threadId query)
router.get('/', async (req, res) => {
  const workspaceId = req.params.workspaceId
  const threadId = req.query.threadId || null
  const list = await messagesService.listMessages({ workspaceId, threadId })
  return res.json({ messages: list })
})

// POST mark message read
router.post('/:messageId/read', async (req, res) => {
  // read the specific param value instead of the whole params object
  const messageId = req.params.messageId
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId required' })
  const ok = await messagesService.markRead({ messageId, userId })
  if (!ok) return res.status(404).json({ error: 'not found' })
  return res.status(200).json({ ok: true })
})

export default router
