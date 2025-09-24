import { expect, it, beforeEach, afterEach } from 'vitest'
import { saveFile, getFileMeta } from '../../../backend/src/services/fileService.js'
import db from '../../../backend/src/db.js'
import fs from 'fs'

let origIsDb
let queries = []

beforeEach(() => {
  origIsDb = db.isDbEnabled
  db.isDbEnabled = true
  queries = []
  db.query = async (text, params) => {
    queries.push({ text, params })
    if (text.startsWith('INSERT INTO files')) return { rowCount: 1 }
    if (text.startsWith('SELECT * FROM files WHERE id')) return { rows: [{ id: params[0], original_name: 'a.txt' }], rowCount: 1 }
    return { rows: [], rowCount: 0 }
  }
})

afterEach(() => {
  db.isDbEnabled = origIsDb
})

it('persists file metadata to DB when enabled', async () => {
  const buf = Buffer.from('hello')
  const meta = await saveFile({ originalName: 'a.txt', buffer: buf, contentType: 'text/plain', uploadedBy: 'u1', workspaceId: 'w1' })
  expect(meta).toHaveProperty('id')
  // ensure DB insert was attempted
  expect(queries.some(q => q.text.includes('INSERT INTO files'))).toBeTruthy()
  const read = await getFileMeta(meta.id)
  // mocked SELECT returns original_name
  expect(read.original_name).toBe('a.txt')
  // cleanup storage file if created
  try { fs.unlinkSync(meta.storage_path) } catch (e) { /**/ }
})
