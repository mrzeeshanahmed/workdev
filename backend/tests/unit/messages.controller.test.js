/* eslint-env jest */
import request from '../helpers/request.js'
import * as messagesService from '../../src/services/messagesService.js'
import db from '../../src/db.js'
import store from '../../src/stores/inMemoryStore.js'

describe('messages API (unit)', () => {
  beforeEach(() => {
    // ensure fallback/in-memory mode
    db.isDbEnabled = false
    store.messages.clear()
  })

  test('PATCH /api/workspaces/:workspaceId/messages/:messageId/read marks message as read', async () => {
    // create a message in the in-memory store
    const workspaceId = 'ws-1'
    const msg = await messagesService.createMessage({ workspaceId, threadId: null, authorId: 'u1', body: 'hello' })

    const res = await request
      .post(`/api/workspaces/${workspaceId}/messages/${msg.id}/read`)
      .send({ userId: 'reader-1' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('ok', true)

    // verify in-memory store updated
    const stored = store.messages.get(msg.id)
    expect(stored).toBeDefined()
    expect(stored.read_by).toContain('reader-1')
  })

  test('PATCH respects URL param messageId over body.messageId', async () => {
    const workspaceId = 'ws-2'
    const msg = await messagesService.createMessage({ workspaceId, threadId: null, authorId: 'u2', body: 'hi' })
    // create another message that should NOT be marked
    const other = await messagesService.createMessage({ workspaceId, threadId: null, authorId: 'u3', body: 'other' })

    const res = await request
      .post(`/api/workspaces/${workspaceId}/messages/${msg.id}/read`)
      // intentionally send a mismatched messageId in the body that should be ignored
      .send({ userId: 'reader-2', messageId: other.id })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('ok', true)

    const stored = store.messages.get(msg.id)
    expect(stored.read_by).toContain('reader-2')

    const otherStored = store.messages.get(other.id)
    expect(otherStored.read_by || []).not.toContain('reader-2')
  })
})
