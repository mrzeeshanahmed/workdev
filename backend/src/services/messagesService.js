import { v4 as uuidv4 } from 'uuid'
import store from '../stores/inMemoryStore.js'
import db from '../db.js'

export async function createMessage({ workspaceId, threadId = null, authorId, body, attachments = [] }) {
  const id = uuidv4()
  const rec = {
    id,
    workspace_id: workspaceId,
    thread_id: threadId,
    author_id: authorId,
    body,
    attachments,
    read_by: [],
    created_at: new Date().toISOString(),
  }

  if (db.isDbEnabled) {
    try {
      await db.query(`INSERT INTO messages (id, workspace_id, thread_id, author_id, body, attachments, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [rec.id, rec.workspace_id, rec.thread_id, rec.author_id, rec.body, JSON.stringify(rec.attachments || []), rec.created_at])
    } catch (err) {
      console.error('failed to persist message to db', err?.message || err)
    }
  } else {
    store.messages.set(id, rec)
  }
  return rec
}

export async function listMessages({ workspaceId, threadId = null }) {
  if (db.isDbEnabled) {
    const res = await db.query('SELECT * FROM messages WHERE workspace_id=$1 ORDER BY created_at ASC', [workspaceId])
    return res.rows
  }
  const out = []
  for (const m of store.messages.values()) {
    if (m.workspace_id !== workspaceId) continue
    if (threadId && m.thread_id !== threadId) continue
    out.push(m)
  }
  return out
}

export async function markRead({ messageId, userId }) {
  const m = store.messages.get(messageId)
  if (!m) return false
  if (!m.read_by.includes(userId)) m.read_by.push(userId)
  store.messages.set(messageId, m)
  return true
}
