// Emergency one-shot recovery: reconstructs the pre-swap PackageDetail.jsx
// (with inline packages array) into a temp file so migrate-data.mjs can read it.
// We've already swapped the live PackageDetail.jsx to import from data/packages.json,
// so we need to source the array from the unstaged diff against HEAD.

import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'

const diff = execSync('git diff HEAD -- src/pages/PackageDetail.jsx', { encoding: 'utf-8' })

// Extract the deleted (`-` prefix) lines that form the inline packages array.
const lines = diff.split('\n')
let inHunk = false
const deletedLines = []
for (const l of lines) {
  if (l.startsWith('@@')) { inHunk = true; continue }
  if (!inHunk) continue
  if (l.startsWith('-') && !l.startsWith('---')) {
    deletedLines.push(l.slice(1))
  } else if (l.startsWith(' ')) {
    // Context line — also part of the original; needed to bridge gaps.
    deletedLines.push(l.slice(1))
  }
  // Skip `+` (new lines we don't want).
}

// Also need the import lines (which we deleted) to make the array valid JS.
// Build a self-contained module: copy original imports + the packages array.

// Source the original HEAD version's imports (asset imports + tipiskit) from `git show`.
const headSrc = execSync('git show HEAD:src/pages/PackageDetail.jsx', { encoding: 'utf-8' })
const headLines = headSrc.split('\n')
const importLines = headLines.filter((l) => /^import\s+package[1-7]Hero\s+from\s+['"]\.\.\/assets\/package-[1-7]-hero\.webp['"]/.test(l))

// Find the start/end of `const packages = [` ... `]` in our reconstructed deleted lines.
const startIdx = deletedLines.findIndex((l) => /^const\s+packages\s*=\s*\[/.test(l))
if (startIdx === -1) throw new Error('packages array start not found in diff')
let depth = 0
let endIdx = -1
for (let i = startIdx; i < deletedLines.length; i += 1) {
  for (const ch of deletedLines[i]) {
    if (ch === '[') depth += 1
    else if (ch === ']') {
      depth -= 1
      if (depth === 0) { endIdx = i; break }
    }
  }
  if (endIdx !== -1) break
}
if (endIdx === -1) throw new Error('packages array end not found')

const arrayLines = deletedLines.slice(startIdx, endIdx + 1)

// Rewrite asset imports as URL constants.
const importStubs = importLines.map((l) => {
  const m = l.match(/import\s+(\w+)\s+from\s+['"]\.\.\/assets\/([^'"]+)['"]/)
  return `const ${m[1]} = '/uploads/${m[2]}'`
})

const moduleSrc = [...importStubs, '', ...arrayLines, '', 'export { packages }', ''].join('\n')

await fs.writeFile('scripts/_recovered-packages.mjs', moduleSrc, 'utf-8')
console.log('wrote scripts/_recovered-packages.mjs (', moduleSrc.length, 'chars)')
