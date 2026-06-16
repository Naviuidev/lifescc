/**
 * App base path for subfolder deploy (e.g. /test on tefenoza.com).
 * Vite sets import.meta.env.BASE_URL from vite.config `base`.
 */
export function appBasePath() {
  const base = import.meta.env.BASE_URL || '/'
  if (base === '/') return ''
  return base.endsWith('/') ? base.slice(0, -1) : base
}

/** Prefix root-relative paths with the app base (/test/... → /test/...). */
export function withAppBase(path) {
  if (!path || typeof path !== 'string') return path
  const s = path.trim()
  if (!s) return s
  if (s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:')) return s
  const normalized = s.startsWith('/') ? s : `/${s.replace(/^\/+/, '')}`
  const base = appBasePath()
  if (!base) return normalized
  return `${base}${normalized}`
}

export function routerBasename() {
  const base = appBasePath()
  return base || undefined
}
