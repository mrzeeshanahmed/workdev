import express from 'express'
import Busboy from 'busboy'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { saveFile, getFileMeta, readFileContent } from '../services/fileService.js'
import db from '../db.js'

const router = express.Router({ mergeParams: true })

// POST /api/workspaces/:workspaceId/files - upload single file
router.post('/', (req, res) => {
  const workspaceId = req.params.workspaceId
  // ensure workspace exists in DB-backed mode
  const ensureWorkspace = async () => {
    if (db.isDbEnabled) {
      const w = await db.query('SELECT id FROM workspaces WHERE id=$1', [workspaceId])
      if (!w.rowCount) throw new Error('workspace not found')
    } else {
      // in the original code the in-memory store check happens at router level
      // leave that behavior to callers that rely on store.workspaces
    }
  }

  // limits: max 10MB per file, max 5 files
  const busboy = new Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024, files: 5 } })
  let fileHandled = false
  let finished = false
  const tempFiles = []

  busboy.on('file', (fieldname, fileStream, filename, encoding, mimetype) => {
    const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`)
    tempFiles.push(tmpPath)
    const writeStream = fs.createWriteStream(tmpPath)
    let errored = false

    fileStream.on('limit', () => {
      errored = true
      fileStream.unpipe(writeStream)
      writeStream.destroy()
    })

    fileStream.pipe(writeStream)

    writeStream.on('error', (err) => {
      errored = true
      console.error('write stream error', err)
      // ensure stream is drained
      fileStream.resume()
    })

    writeStream.on('finish', async () => {
      if (errored) return
      try {
        await ensureWorkspace()
        const meta = await saveFile({ originalName: filename, sourcePath: tmpPath, contentType: mimetype, workspaceId })
        fileHandled = true
        // respond immediately for single-file uploads
        if (!finished) {
          finished = true
          // cleanup other temps
          for (const f of tempFiles) { if (f !== tmpPath) fs.promises.unlink(f).catch(() => undefined) }
          return res.status(201).json({ id: meta.id, original_name: meta.original_name, size: meta.size })
        }
      } catch (err) {
        if (err && err.code === 'FILE_TOO_LARGE') return res.status(413).json({ error: 'file too large' })
        console.error('file upload error', err)
        return res.status(500).json({ error: 'upload failed' })
      }
    })
  })

  busboy.on('error', (err) => {
    console.error('busboy error', err)
    return res.status(400).json({ error: 'upload failed' })
  })

  busboy.on('finish', () => {
    if (!fileHandled && !finished) return res.status(400).json({ error: 'no file uploaded' })
  })

  req.pipe(busboy)
})

// GET metadata
router.get('/:fileId', async (req, res) => {
  const meta = await getFileMeta(req.params.fileId)
  if (!meta) return res.status(404).json({ error: 'not found' })
  return res.json(meta)
})

// GET content
router.get('/:fileId/content', async (req, res) => {
  const meta = await getFileMeta(req.params.fileId)
  if (!meta) return res.status(404).json({ error: 'not found' })
  const buf = await readFileContent(meta)
  res.setHeader('Content-Type', meta.content_type || 'application/octet-stream')
  res.setHeader('Content-Length', buf.length)
  return res.send(buf)
})

export default router
