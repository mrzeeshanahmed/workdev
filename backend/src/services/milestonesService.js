import store from '../stores/inMemoryStore.js'
import { v4 as uuidv4 } from 'uuid'
import db from '../db.js'
import * as notificationService from './notificationService.js'

export async function createMilestone({ workspaceId, title, description, dueDate, amount, createdBy }) {
  if (db.isDbEnabled) {
    const res = await db.query(
      `INSERT INTO milestones (workspace_id, title, description, due_date, amount, state, attachments, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, state`,
      [workspaceId, title, description || null, dueDate || null, amount || null, 'Draft', '[]', createdBy || null]
    )
    return { milestoneId: res.rows[0].id, state: res.rows[0].state }
  }
  const id = uuidv4()
  const rec = {
    id,
    workspace_id: workspaceId,
    title,
    description: description || null,
    due_date: dueDate || null,
    amount: amount || null,
    state: 'Draft',
    attachments: [],
    created_by: createdBy || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
  }
  store.milestones.set(id, rec)
  return rec
}

export async function getMilestone(id) {
  if (db.isDbEnabled) {
    const res = await db.query('SELECT * FROM milestones WHERE id = $1', [id])
    return res.rows[0]
  }
  return store.milestones.get(id)
}

export async function updateMilestone({ id, title, description }) {
  if (db.isDbEnabled) {
    const res = await db.query(
      `UPDATE milestones SET title=$2, description=$3, updated_at=now(), version=version+1 WHERE id=$1 RETURNING id, state, title, description`,
      [id, title, description]
    )
    if (!res.rowCount) throw new Error('not found')
    return res.rows[0]
  }
  const rec = store.milestones.get(id)
  if (!rec) throw new Error('not found')
  rec.title = title || rec.title
  rec.description = description || rec.description
  rec.updated_at = new Date().toISOString()
  rec.version = (rec.version || 1) + 1
  // append simple history entry
  rec.history = rec.history || []
  rec.history.push({ action: 'updated', actor: null, at: new Date().toISOString(), changes: { title, description } })
  store.milestones.set(id, rec)
  return rec
}

export async function requestRevision(id, reason) {
  if (db.isDbEnabled) {
    const res = await db.query(`UPDATE milestones SET state='RevisionRequested', updated_at=now(), version=version+1 WHERE id=$1 RETURNING id, state`, [id])
    if (!res.rowCount) throw new Error('not found')
    try {
      await notificationService.createNotification({ workspaceId: null, actorId: null, type: 'milestone.revision_requested', message: `Milestone ${id} revision requested`, payload: { milestoneId: id, reason } })
    } catch (err) {
      console.error('notification failed', err?.message || err)
    }
    return res.rows[0]
  }
  const rec = store.milestones.get(id)
  if (!rec) throw new Error('not found')
  rec.state = 'RevisionRequested'
  rec.updated_at = new Date().toISOString()
  rec.version += 1
  rec.history = rec.history || []
  rec.history.push({ action: 'requestRevision', actor: null, at: new Date().toISOString(), reason })
  store.milestones.set(id, rec)
  try {
    notificationService.createNotification({ workspaceId: rec.workspace_id, actorId: rec.created_by, type: 'milestone.revision_requested', message: `Milestone ${rec.id} revision requested`, payload: { milestoneId: rec.id, reason } })
  } catch (err) {
    console.error('notification failed', err?.message || err)
  }
  return rec
}

export async function listMilestonesForWorkspace(workspaceId) {
  if (db.isDbEnabled) {
    const res = await db.query('SELECT * FROM milestones WHERE workspace_id = $1', [workspaceId])
    return res.rows
  }
  const out = []
  for (const m of store.milestones.values()) {
    if (m.workspace_id === workspaceId) out.push(m)
  }
  return out
}

export async function submitMilestone(id) {
  if (db.isDbEnabled) {
    const res = await db.query(`UPDATE milestones SET state='Submitted', updated_at=now(), version=version+1 WHERE id=$1 RETURNING id, state`, [id])
    if (!res.rowCount) throw new Error('not found')
    // best-effort notification
    try {
      await notificationService.createNotification({ workspaceId: null, actorId: null, type: 'milestone.submitted', message: `Milestone ${id} submitted`, payload: { milestoneId: id } })
    } catch (err) {
      console.error('notification failed', err?.message || err)
    }
    return res.rows[0]
  }
  const rec = store.milestones.get(id)
  if (!rec) throw new Error('not found')
  rec.state = 'Submitted'
  rec.updated_at = new Date().toISOString()
  rec.version += 1
  store.milestones.set(id, rec)
  // best-effort notification (in-app + email stub)
  try {
    notificationService.createNotification({ workspaceId: rec.workspace_id, actorId: rec.created_by, type: 'milestone.submitted', message: `Milestone ${rec.id} submitted`, payload: { milestoneId: rec.id } })
    // optionally send email to client/developer — stub: we don't have addresses here
    notificationService.sendEmail({ to: 'client@example.local', subject: 'Milestone submitted', body: `Milestone ${rec.id} was submitted` })
  } catch (err) {
    console.error('notification failed', err?.message || err)
  }
  return rec
}

export async function approveMilestone(id) {
  if (db.isDbEnabled) {
    const res = await db.query(`UPDATE milestones SET state='Approved', updated_at=now(), version=version+1 WHERE id=$1 RETURNING id, state`, [id])
    if (!res.rowCount) throw new Error('not found')
    try {
      await notificationService.createNotification({ workspaceId: null, actorId: null, type: 'milestone.approved', message: `Milestone ${id} approved`, payload: { milestoneId: id } })
    } catch (err) {
      console.error('notification failed', err?.message || err)
    }
    return res.rows[0]
  }
  const rec = store.milestones.get(id)
  if (!rec) throw new Error('not found')
  rec.state = 'Approved'
  rec.updated_at = new Date().toISOString()
  rec.version += 1
  store.milestones.set(id, rec)
  try {
    notificationService.createNotification({ workspaceId: rec.workspace_id, actorId: rec.created_by, type: 'milestone.approved', message: `Milestone ${rec.id} approved`, payload: { milestoneId: rec.id } })
    notificationService.sendEmail({ to: 'client@example.local', subject: 'Milestone approved', body: `Milestone ${rec.id} was approved` })
  } catch (err) {
    console.error('notification failed', err?.message || err)
  }
  return rec
}
