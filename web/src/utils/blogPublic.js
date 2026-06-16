import { withAppBase } from './appBase.js'

/** Cover / uploads path → browser URL */
export function publicAssetUrl(path) {
  if (!path || typeof path !== 'string') return ''
  const s = path.trim()
  if (!s) return ''
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s
  return withAppBase(s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`)
}

export function excerptFromBlog(b, maxLen = 200) {
  const raw = (b?.listing_summary || b?.banner_subtitle || '').trim()
  if (!raw) return ''
  if (raw.length <= maxLen) return raw
  const cut = raw.slice(0, maxLen)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

export function estimateReadMinutes(b) {
  let fromBlocks = ''
  if (b?.blocks_json) {
    try {
      const blocks = JSON.parse(b.blocks_json)
      if (Array.isArray(blocks)) {
        for (const bl of blocks) {
          if (bl && typeof bl === 'object') {
            if (typeof bl.text === 'string') fromBlocks += ` ${bl.text}`
            if (typeof bl.heading === 'string') fromBlocks += ` ${bl.heading}`
          }
        }
      }
    } catch {
      /* ignore */
    }
  }
  const text = [b?.listing_summary, b?.banner_subtitle, b?.title, fromBlocks].filter(Boolean).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 3
  return Math.max(1, Math.min(25, Math.round(words / 200)))
}

export function formatBlogDate(iso) {
  if (!iso) return ''
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Long form e.g. "Monday, 30 March 2026" for article meta */
export function formatBlogDateLong(iso) {
  if (!iso) return ''
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Which lead-form fields to show; empty array → show all (matches admin catalog). */
export function parseAnalyticsFieldKeysJson(json) {
  const catalog = ['first_name', 'last_name', 'email', 'mobile', 'message']
  if (json == null || String(json).trim() === '') return [...catalog]
  try {
    const a = JSON.parse(json)
    if (!Array.isArray(a)) return [...catalog]
    const out = a.filter((k) => typeof k === 'string' && catalog.includes(k))
    return out.length > 0 ? out : [...catalog]
  } catch {
    return [...catalog]
  }
}
