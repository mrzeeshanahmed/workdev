import store from '../stores/inMemoryStore.js'
import { v4 as uuidv4 } from 'uuid'

// Simple in-app notifications + email stub
export function createNotification({ workspaceId, actorId, type, message, payload }) {
  const id = uuidv4()
  const rec = {
    id,
    workspace_id: workspaceId || null,
    actor_id: actorId || null,
    type,
    message,
    payload: payload || null,
    read: false,
    created_at: new Date().toISOString(),
  }
  store.notifications.set(id, rec)
  return rec
}

// List notifications for workspace (or all)
export function listNotifications({ workspaceId }) {
  const out = []
  for (const n of store.notifications.values()) {
    if (!workspaceId || n.workspace_id === workspaceId) out.push(n)
  }
  return out
}

// Simple email stub — integrate with real email provider later
export async function sendEmail({ to, subject, body }) {
  // For now, just log. In production, hook to SES, SMTP, or SendGrid.
  console.log(`sendEmail to=${to} subject=${subject} body=${typeof body === 'string' ? body.slice(0,140) : JSON.stringify(body).slice(0,140)}`)
  // Return a fake id
  return { id: `email-${Date.now()}` }
}
// Placeholder notification service for saved-search matches
export function notifyDeveloper(developerId, message) {
  // In MVP, just log or push to analytics
  // Real implementation would enqueue email/push notifications
  console.log(`[notification] to=${developerId} message=${message}`)
}

export default { notifyDeveloper }
