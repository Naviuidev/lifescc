/**
 * App base path for subfolder deploy (e.g. /test on tefenoza.com).
 * Vite sets import.meta.env.BASE_URL from vite.config `base`.
 */
function runtimeBaseFromUrl() {
  if (typeof window === 'undefined') return ''
  const match = window.location.pathname.match(/^(\/[^/]+)(?=\/|$)/)
  if (!match) return ''
  const segment = match[1]
  // Only treat /test as app base on shared staging host (not domain root later).
  if (segment === '/test') return segment
  return ''
}

export function appBasePath() {
  const fromVite = import.meta.env.BASE_URL || '/'
  if (fromVite !== '/') {
    return fromVite.endsWith('/') ? fromVite.slice(0, -1) : fromVite
  }
  return runtimeBaseFromUrl()
}

/** Prefix root-relative paths with the app base (/coolsculpting → /test/coolsculpting). */
export function withAppBase(path) {
  if (!path || typeof path !== 'string') return path
  const s = path.trim()
  if (!s) return s
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s
  const normalized = s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`
  const base = appBasePath()
  if (!base) return normalized
  if (normalized === base || normalized.startsWith(`${base}/`)) return normalized
  return `${base}${normalized}`
}

export function routerBasename() {
  const base = appBasePath()
  return base || undefined
}

/** Route path without subfolder prefix (e.g. /test/admin → /admin). */
export function stripAppBase(pathname) {
  const path = String(pathname ?? '') || '/'
  const base = appBasePath()
  if (base && (path === base || path.startsWith(`${base}/`))) {
    return path.slice(base.length) || '/'
  }
  return path
}
