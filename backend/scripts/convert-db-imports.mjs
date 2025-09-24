#!/usr/bin/env node
// Codemod: convert-db-imports.mjs
// - Replaces `import * as db from '../db.js'` with `import db from '../db.js'`
// - Replaces top-level dynamic `const db = await import('../db.js')` or `const db = (await import('../db.js')).default` patterns
//   by adding `import db from '../db.js'` at the top and removing the dynamic line.
// Usage: node backend/scripts/convert-db-imports.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptFile = fileURLToPath(import.meta.url)
// workspace root (assume script lives under backend/scripts)
const workspaceRoot = path.resolve(path.dirname(scriptFile), '..', '..')
// scan the entire workspace; skip common large folders
const srcDir = workspaceRoot

function walk(dir) {
  const skip = new Set(['node_modules', '.git', 'dist', 'build'])
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (skip.has(ent.name)) continue
      walk(full)
    } else if (ent.isFile() && full.endsWith('.js')) {
      // skip compiled locations under frontend or backend 'dist' if present
      processFile(full)
    }
  }
}

function processFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8')
  let changed = false

  // 1) Replace import * as db from '../db.js' (or ./db.js)
  const importStarRegex = /(import)\s+\*\s+as\s+db\s+from\s+(['"][./]+db\.js['"]);?/g
  if (importStarRegex.test(src)) {
    src = src.replace(importStarRegex, "import db from $2;")
    changed = true
  }

  // 2) Detect top-level `const db = await import('../db.js')` or similar and replace with top-level import
  // We'll look for a simple pattern: a line with `const <name> = await import('...db.js')` or `const <name> = (await import('...db.js')).default`
  const dynamicImportRegex = /(^|\n)\s*(const|let)\s+[a-zA-Z_$][\w$]*\s*=\s*await\s+import\((['"][./]+db\.js['"])\)\s*;?/g
  let dynamicMatch
  const importsToAdd = new Set()
  while ((dynamicMatch = dynamicImportRegex.exec(src)) !== null) {
    const fullMatch = dynamicMatch[0]
    const importPath = dynamicMatch[3]
    // If varName is 'db' or the usage later references 'db', convert
    // Add top-level import and remove the dynamic declaration
    // But guard: if file already has `import db` we'll just remove the dynamic line
    if (!/import\s+db\s+from\s+/.test(src)) {
      importsToAdd.add(importPath)
    }
    // remove the dynamic declaration
    src = src.replace(fullMatch, '\n')
    changed = true
  }

  // Also patterns like `const db = (await import('../db.js')).default`
  const dynamicDefaultRegex = /(^|\n)\s*(const|let)\s+[a-zA-Z_$][\w$]*\s*=\s*\(\s*await\s+import\((['"][./]+db\.js['"])\)\s*\)\.default\s*;?/g
  while ((dynamicMatch = dynamicDefaultRegex.exec(src)) !== null) {
    const fullMatch = dynamicMatch[0]
    const importPath = dynamicMatch[4]
    if (!/import\s+db\s+from\s+/.test(src)) {
      importsToAdd.add(importPath)
    }
    src = src.replace(fullMatch, '\n')
    changed = true
  }

  // If we need to add imports, insert them after the first existing import or at top
  if (importsToAdd.size > 0) {
    const importsText = Array.from(importsToAdd).map(p => `import db from ${p};`).join('\n') + '\n'
    const firstImport = src.search(/^[ \t]*import\s+/m)
    if (firstImport >= 0) {
      // find end of that import line
      const lines = src.split('\n')
      let insertAt = 0
      for (let i = 0; i < lines.length; i++) {
        if (/^\s*import\s+/.test(lines[i])) insertAt = i + 1
        else if (insertAt > 0) break
      }
      lines.splice(insertAt, 0, importsText)
      src = lines.join('\n')
    } else {
      src = importsText + src
    }
  }

  // 3) Replace occurrences of `(await import('../db.js')).default` references that might remain
  src = src.replace(/\(\s*await\s+import\((['"][./]+db\.js['"])\)\s*\)\.default/g, 'db')

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8')
    console.log('Updated', filePath)
  }
}

console.log('Scanning', srcDir)
walk(srcDir)
console.log('Done')
