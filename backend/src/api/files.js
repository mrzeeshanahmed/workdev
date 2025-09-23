import express from 'express'
import Busboy from 'busboy'
import { saveFile, getFileMeta, readFileContent } from '../services/fileService.js'

const router = express.Router({ mergeParams: true })

// POST /api/workspaces/:workspaceId/files - upload single file
router.post('/', (req, res) => {
  const workspaceId = req.params.workspaceId
  const busboy = Busboy({ headers: req.headers })
  let fileHandled = false

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const chunks = []
    file.on('data', (d) => chunks.push(d))
    file.on('limit', () => {
      // Busboy supports limits via options; fallback just in case
    })
    file.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks)
        const meta = await saveFile({ originalName: filename, buffer, contentType: mimetype, workspaceId })
        fileHandled = true
        return res.status(201).json({ id: meta.id, original_name: meta.original_name, size: meta.size })
      } catch (err) {
        if (err && err.code === 'FILE_TOO_LARGE') return res.status(413).json({ error: 'file too large' })
        console.error('file upload error', err)
        return res.status(500).json({ error: 'upload failed' })
      }
    })
  })

  busboy.on('finish', () => {
    if (!fileHandled) return res.status(400).json({ error: 'no file uploaded' })
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
