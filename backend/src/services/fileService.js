import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import store from '../stores/inMemoryStore.js'
import db from '../db.js'

const STORAGE_DIR = path.resolve(process.cwd(), 'backend', 'storage')
const MAX_BYTES = 50 * 1024 * 1024 // 50MB

if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true })

export async function saveFile({ originalName, buffer, sourcePath, contentType, uploadedBy, workspaceId }) {
  // Support two modes: a buffer (existing behavior) or a sourcePath to a temp file (streamed upload)
  let size = 0
  if (sourcePath) {
    const st = await fs.promises.stat(sourcePath)
    size = st.size
    if (size > MAX_BYTES) {
      const err = new Error('file too large')
      err.code = 'FILE_TOO_LARGE'
      throw err
    }
  } else {
    if (!buffer) buffer = Buffer.alloc(0)
    size = buffer.length
    if (size > MAX_BYTES) {
      const err = new Error('file too large')
      err.code = 'FILE_TOO_LARGE'
      throw err
    }
  }

  const id = uuidv4()
  const ext = path.extname(originalName) || ''
  const filename = `${id}${ext}`
  const full = path.join(STORAGE_DIR, filename)

  if (sourcePath) {
    // move or copy the temp file into storage
    await fs.promises.copyFile(sourcePath, full)
  } else {
    await fs.promises.writeFile(full, buffer)
  }

  const meta = {
    id,
    workspace_id: workspaceId || null,
    original_name: originalName,
    filename,
    content_type: contentType || null,
    size,
    storage_path: full,
    created_by: uploadedBy || null,
    created_at: new Date().toISOString(),
  }

  if (db.isDbEnabled) {
    // Try to insert metadata to DB; best-effort
    try {
      await db.query(
        `INSERT INTO files (id, workspace_id, original_name, filename, content_type, size, storage_path, created_by, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [meta.id, meta.workspace_id, meta.original_name, meta.filename, meta.content_type, meta.size, meta.storage_path, meta.created_by, meta.created_at]
      )
    } catch (err) {
      // Log and continue
      console.error('failed to persist file metadata to DB', err?.message || err)
    }
  } else {
    // Persist to in-memory store
    store.files.set(meta.id, meta)
  }

  return meta
}

export async function getFileMeta(id) {
  if (db.isDbEnabled) {
    const res = await db.query('SELECT * FROM files WHERE id = $1', [id])
    return res.rows[0]
  }
  return store.files.get(id)
}

export async function readFileContent(meta) {
  if (!meta || !meta.storage_path) throw new Error('missing file meta')
  return fs.promises.readFile(meta.storage_path)
}
