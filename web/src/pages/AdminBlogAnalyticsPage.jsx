import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminBlogToolbar from '../components/AdminBlogToolbar.jsx'
import './AdminSlotsPage.css'
import '../components/AdminBlogToolbar.css'
import './AdminBlogsPage.css'
import './AdminBlogAnalyticsPage.css'

function RefreshIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
      />
    </svg>
  )
}

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatLastActivity(row) {
  const sub = row.last_submission_at
  const upd = row.updated_at
  const raw = sub || upd
  if (!raw) return '—'
  return formatWhen(raw)
}

function MetricBars({ views, subs, scaleMax }) {
  const v = Number(views) || 0
  const s = Number(subs) || 0
  const max = Math.max(Number(scaleMax) || 0, 1)
  const vw = Math.min(100, (v / max) * 100)
  const sw = Math.min(100, (s / max) * 100)

  return (
    <div className="admin-blog-analytics__bars" role="img" aria-label={`Views ${v}, clicks ${s}`}>
      <div className="admin-blog-analytics__bar-row">
        <span className="admin-blog-analytics__bar-label">Views</span>
        <div className="admin-blog-analytics__bar-track">
          <div
            className="admin-blog-analytics__bar-fill admin-blog-analytics__bar-fill--views"
            style={{ width: `${vw}%` }}
          />
        </div>
        <span className="admin-blog-analytics__bar-val">{v}</span>
      </div>
      <div className="admin-blog-analytics__bar-row">
        <span className="admin-blog-analytics__bar-label">Clicks</span>
        <div className="admin-blog-analytics__bar-track">
          <div
            className="admin-blog-analytics__bar-fill admin-blog-analytics__bar-fill--leads"
            style={{ width: `${sw}%` }}
          />
        </div>
        <span className="admin-blog-analytics__bar-val">{s}</span>
      </div>
    </div>
  )
}

const CHART_TABS = [
  { id: 'graph', label: 'Graph' },
  { id: 'bar', label: 'Bar chart' },
  { id: 'pie', label: 'Pie chart' },
]

/** Line comparison of Views vs Clicks (form submissions) */
function AnalyticsLineGraph({ views, clicks }) {
  const v = Number(views) || 0
  const c = Number(clicks) || 0
  const max = Math.max(v, c, 1)
  const w = 280
  const h = 140
  const pad = 28
  const innerH = h - pad * 2
  const x1 = 50
  const x2 = w - 50
  const y1 = pad + innerH - (v / max) * innerH
  const y2 = pad + innerH - (c / max) * innerH
  const baseline = pad + innerH

  return (
    <div className="admin-blog-analytics-page__chart-panel" role="img" aria-label={`Views ${v}, clicks ${c}`}>
      <svg className="admin-blog-analytics-page__line-svg" viewBox={`0 0 ${w} ${h + 24}`} width="100%" height="auto" aria-hidden>
        <line x1={pad} y1={baseline} x2={w - pad} y2={baseline} stroke="#e2e8f0" strokeWidth="1" />
        <text x={x1} y={h + 18} textAnchor="middle" className="admin-blog-analytics-page__chart-cap" fontSize="11" fill="#64748b">
          Views
        </text>
        <text x={x2} y={h + 18} textAnchor="middle" className="admin-blog-analytics-page__chart-cap" fontSize="11" fill="#64748b">
          Clicks
        </text>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={x1} cy={y1} r="6" fill="#6366f1" />
        <circle cx={x2} cy={y2} r="6" fill="#059669" />
        <text x={x1} y={y1 - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4f46e5">
          {v}
        </text>
        <text x={x2} y={y2 - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#047857">
          {c}
        </text>
      </svg>
      {v === 0 && c === 0 ? (
        <p className="admin-blog-analytics-page__chart-empty small text-muted mb-0">No views or clicks yet.</p>
      ) : null}
    </div>
  )
}

/** Vertical bars for Views vs Clicks */
function AnalyticsVerticalBars({ views, clicks, scaleMax }) {
  const gradId = useId().replace(/:/g, '')
  const v = Number(views) || 0
  const c = Number(clicks) || 0
  const max = Math.max(Number(scaleMax) || 0, v, c, 1)
  const h = 120
  const barW = 48
  const gap = 56
  const x1 = 60
  const x2 = x1 + barW + gap

  return (
    <div className="admin-blog-analytics-page__chart-panel" role="img" aria-label={`Views ${v}, clicks ${c}`}>
      <svg className="admin-blog-analytics-page__vbar-svg" viewBox="0 0 220 150" width="100%" height="auto" aria-hidden>
        <text x={x1 + barW / 2} y={145} textAnchor="middle" fontSize="11" fill="#64748b">
          Views
        </text>
        <text x={x2 + barW / 2} y={145} textAnchor="middle" fontSize="11" fill="#64748b">
          Clicks
        </text>
        <rect
          x={x1}
          y={h - (v / max) * h}
          width={barW}
          height={Math.max((v / max) * h, v > 0 ? 2 : 0)}
          rx="6"
          fill={`url(#${gradId}-v)`}
        />
        <rect
          x={x2}
          y={h - (c / max) * h}
          width={barW}
          height={Math.max((c / max) * h, c > 0 ? 2 : 0)}
          rx="6"
          fill={`url(#${gradId}-c)`}
        />
        <defs>
          <linearGradient id={`${gradId}-v`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`${gradId}-c`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      <div className="admin-blog-analytics-page__vbar-vals d-flex justify-content-center gap-5 small fw-semibold text-secondary">
        <span>{v}</span>
        <span>{c}</span>
      </div>
    </div>
  )
}

function AnalyticsPieChart({ views, clicks }) {
  const v = Number(views) || 0
  const c = Number(clicks) || 0
  const t = v + c
  if (t === 0) {
    return (
      <div className="admin-blog-analytics-page__chart-panel">
        <div className="admin-blog-analytics-page__pie-fallback text-muted small">No activity yet</div>
      </div>
    )
  }
  const pctV = (v / t) * 100
  const a1 = (v / t) * 360

  return (
    <div className="admin-blog-analytics-page__chart-panel admin-blog-analytics-page__pie-wrap" role="img" aria-label={`Views ${pctV} percent, clicks ${100 - pctV} percent`}>
      <div
        className="admin-blog-analytics-page__pie"
        style={{
          background:
            v === 0
              ? 'conic-gradient(from -90deg, #059669 0deg 360deg)'
              : c === 0
                ? 'conic-gradient(from -90deg, #6366f1 0deg 360deg)'
                : `conic-gradient(from -90deg, #6366f1 0deg ${a1}deg, #059669 ${a1}deg 360deg)`,
        }}
      />
      <div className="admin-blog-analytics-page__pie-legend">
        <span>
          <i className="admin-blog-analytics__dot admin-blog-analytics__dot--views" /> Views {Math.round(pctV)}% ({v})
        </span>
        <span>
          <i className="admin-blog-analytics__dot admin-blog-analytics__dot--leads" /> Clicks {Math.round(100 - pctV)}% ({c})
        </span>
      </div>
    </div>
  )
}

function AnalyticsChartTabs({ views, clicks, scaleMax }) {
  const [tab, setTab] = useState('graph')

  return (
    <div className="admin-blog-analytics-page__chart-tabs">
      <div className="admin-blog-analytics-page__chart-tablist" role="tablist" aria-label="Chart type">
        {CHART_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-blog-analytics-page__chart-tab${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-blog-analytics-page__chart-body" role="tabpanel">
        {tab === 'graph' ? <AnalyticsLineGraph views={views} clicks={clicks} /> : null}
        {tab === 'bar' ? <AnalyticsVerticalBars views={views} clicks={clicks} scaleMax={scaleMax} /> : null}
        {tab === 'pie' ? <AnalyticsPieChart views={views} clicks={clicks} /> : null}
      </div>
    </div>
  )
}

export default function AdminBlogAnalyticsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [leadsFilter, setLeadsFilter] = useState('')
  const [clearTarget, setClearTarget] = useState(null)
  const [clearSubmitting, setClearSubmitting] = useState(false)
  const [clearError, setClearError] = useState(null)
  const clearTitleId = useId()

  const blogParam = searchParams.get('blog')
  const detailParam = searchParams.get('detail')
  const selectedId = blogParam && /^\d+$/.test(blogParam) ? Number(blogParam) : null

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/blogs/analytics-overview')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load analytics')
        setRows([])
        return
      }
      setRows(Array.isArray(data.rows) ? data.rows : [])
    } catch {
      setError('Network error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredRows = useMemo(() => {
    let list = rows
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter((r) => String(r.title ?? '').toLowerCase().includes(q))
    }
    if (leadsFilter === 'yes') {
      list = list.filter((r) => Number(r.submissions_count ?? 0) > 0)
    } else if (leadsFilter === 'no') {
      list = list.filter((r) => Number(r.submissions_count ?? 0) === 0)
    }
    return list
  }, [rows, searchQuery, leadsFilter])

  const scaleMax = useMemo(() => {
    let m = 1
    for (const r of rows) {
      m = Math.max(m, Number(r.view_count) || 0, Number(r.submissions_count) || 0)
    }
    return m
  }, [rows])

  const selected = useMemo(() => {
    if (selectedId == null) return null
    return filteredRows.find((r) => Number(r.blog_id) === selectedId) ?? null
  }, [filteredRows, selectedId])

  /** Drop detail=1 from URL if the post is hidden by filters */
  useEffect(() => {
    if (loading) return
    if (detailParam !== '1') return
    if (selectedId == null || selected != null) return
    const p = new URLSearchParams(searchParams)
    p.delete('detail')
    setSearchParams(p, { replace: true })
  }, [loading, detailParam, selectedId, selected, searchParams, setSearchParams])

  useEffect(() => {
    if (loading || rows.length === 0) return
    if (selectedId != null && !rows.some((r) => Number(r.blog_id) === selectedId)) {
      setSearchParams({}, { replace: true })
    }
  }, [loading, rows, selectedId, setSearchParams])

  const openAnalyticsPanel = useCallback(
    (id) => {
      setSearchParams({ blog: String(id), detail: '1' }, { replace: true })
    },
    [setSearchParams],
  )

  const closeAnalyticsPanel = useCallback(() => {
    const p = new URLSearchParams(searchParams)
    p.delete('detail')
    setSearchParams(p, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!clearTarget) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !clearSubmitting) setClearTarget(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearTarget, clearSubmitting])

  useEffect(() => {
    if (clearTarget) document.body.classList.add('book-slot-modal-open')
    else document.body.classList.remove('book-slot-modal-open')
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [clearTarget])

  const confirmClear = async () => {
    if (!clearTarget) return
    setClearError(null)
    setClearSubmitting(true)
    try {
      const res = await fetch(`/api/blogs/${clearTarget.id}/analytics-data`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setClearError(typeof data.error === 'string' ? data.error : 'Could not clear')
        return
      }
      setClearTarget(null)
      await load()
    } catch {
      setClearError('Network error')
    } finally {
      setClearSubmitting(false)
    }
  }

  const showDetailPanel = detailParam === '1' && selected != null
  const detail = showDetailPanel ? selected : null
  const views = Number(detail?.view_count) || 0
  const subs = Number(detail?.submissions_count) || 0
  const clicks = subs
  const hasLead = subs > 0

  return (
    <div className="admin-slots admin-blog-analytics-page">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Blog analytics</h1>
          <p className="admin-slots__lead">
            Click <strong>View analytics</strong> on a row to open charts. Deep link: <code className="small">?blog=id&amp;detail=1</code>
          </p>
        </div>
        <div className="admin-slots__toolbar admin-blog-page__toolbar-top">
          <AdminBlogToolbar active="analytics" />
          <button
            type="button"
            className="btn btn-outline-success py-1 rounded-pill admin-slots__icon-btn admin-blog-page__refresh"
            onClick={load}
            disabled={loading}
            aria-label={loading ? 'Loading' : 'Refresh'}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm text-success" role="status">
                <span className="visually-hidden">Loading…</span>
              </span>
            ) : (
              <RefreshIcon className="admin-slots__toolbar-svg" />
            )}
          </button>
        </div>

        <div className="admin-slots__toolbar admin-blog-page__toolbar-search">
          <div className="admin-slots__search-wrap">
            <label className="admin-slots__search-label">
              <SearchIcon className="admin-slots__search-icon" />
              <input
                type="search"
                className="admin-slots__search form-control border-0 shadow-none"
                placeholder="Filter table by blog title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search blogs"
              />
            </label>
          </div>
          <div className="admin-slots__actions">
            <label className="visually-hidden" htmlFor="blog-an-leads">
              Leads filter
            </label>
            <select
              id="blog-an-leads"
              className="form-select form-select-sm admin-slots__status-select"
              value={leadsFilter}
              onChange={(e) => setLeadsFilter(e.target.value)}
            >
              <option value="">All posts</option>
              <option value="yes">Has form submissions</option>
              <option value="no">No submissions yet</option>
            </select>
          </div>
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}

      {loading && rows.length === 0 ? <p className="admin-slots__banner text-muted">Loading…</p> : null}

      {!loading && rows.length === 0 && !error ? (
        <p className="admin-slots__banner text-muted">No blog posts yet.</p>
      ) : null}

      {!loading && rows.length > 0 ? (
        <>
          <div className="admin-table-card admin-blog-analytics-page__table-card">
            <div className="admin-table-scroll">
              <table className="admin-data-table admin-blog-analytics-page__pick-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="admin-data-table__center">Posted</th>
                    <th className="admin-data-table__center">Views</th>
                    <th className="admin-data-table__center">Leads</th>
                    <th className="admin-data-table__center">Form submitted</th>
                    <th>Last activity</th>
                    <th className="admin-data-table__center">View analytics</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="admin-data-table__empty">
                        No posts match your search or filter.
                      </td>
                    </tr>
                  ) : null}
                  {filteredRows.map((row) => {
                    const isSel = showDetailPanel && selectedId != null && Number(row.blog_id) === selectedId
                    const subsN = Number(row.submissions_count ?? 0)
                    const has = subsN > 0
                    return (
                      <tr key={row.blog_id} className={`admin-blog-analytics-page__pick-row${isSel ? ' is-selected' : ''}`}>
                        <td className="admin-data-table__td-user">
                          <span className="fw-medium text-dark">{row.title}</span>
                        </td>
                        <td className="admin-data-table__nowrap admin-data-table__center">{formatWhen(row.posted_at)}</td>
                        <td className="admin-data-table__center">{Number(row.view_count ?? 0)}</td>
                        <td className="admin-data-table__center">
                          <Link
                            to={`/admin/blogs/submissions?blog=${encodeURIComponent(String(row.blog_id))}`}
                            className="admin-blog-analytics-page__leads-link"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Open ${subsN} lead${subsN === 1 ? '' : 's'} in Blogs data`}
                          >
                            {subsN}
                          </Link>
                        </td>
                        <td className="admin-data-table__center">
                          {has ? (
                            <span className="badge rounded-pill bg-success-subtle text-success">Yes</span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary-subtle text-secondary">No</span>
                          )}
                        </td>
                        <td className="admin-data-table__nowrap">{formatLastActivity(row)}</td>
                        <td className="admin-data-table__center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success rounded-pill"
                            onClick={(e) => {
                              e.stopPropagation()
                              openAnalyticsPanel(Number(row.blog_id))
                            }}
                          >
                            View analytics
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {detail ? (
            <section className="admin-blog-analytics-page__detail card border-0 shadow-sm" aria-label="Selected blog analytics">
              <div className="card-body">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h2 className="h5 mb-1 fw-bold text-dark">{detail.title}</h2>
                    <p className="small text-muted mb-0">
                      {detail.blog_slug ? (
                        <Link to={`/blog/${encodeURIComponent(detail.blog_slug)}`} target="_blank" rel="noreferrer">
                          View live post
                        </Link>
                      ) : null}
                    </p>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={closeAnalyticsPanel}>
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill d-inline-flex align-items-center gap-2 px-3"
                      title="Clear views and form submissions for this post"
                      onClick={() => {
                        setClearError(null)
                        setClearTarget({ id: detail.blog_id, title: detail.title })
                      }}
                    >
                      <TrashIcon className="admin-blog-analytics-page__clear-trash" aria-hidden />
                      <span>Clear analytics</span>
                    </button>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <h3 className="h6 text-muted text-uppercase small fw-bold mb-2">Views &amp; clicks</h3>
                    <AnalyticsChartTabs views={views} clicks={clicks} scaleMax={scaleMax} />
                  </div>
                  <div className="col-md-6">
                    <h3 className="h6 text-muted text-uppercase small fw-bold mb-2">Volume (scale {scaleMax})</h3>
                    <MetricBars views={views} subs={subs} scaleMax={scaleMax} />
                  </div>
                </div>

                <dl className="row small mt-3 mb-0 admin-blog-analytics-page__meta-dl">
                  <div className="col-sm-4">
                    <dt className="text-muted">Posted</dt>
                    <dd className="mb-0">{formatWhen(detail.posted_at)}</dd>
                  </div>
                  <div className="col-sm-4">
                    <dt className="text-muted">Last activity</dt>
                    <dd className="mb-0">{formatLastActivity(detail)}</dd>
                  </div>
                  <div className="col-sm-4">
                    <dt className="text-muted">Form submitted</dt>
                    <dd className="mb-0">{hasLead ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {clearTarget ? (
        <div className="admin-blogs-modal-root" role="presentation">
          <button
            type="button"
            className="admin-blogs-modal-backdrop"
            aria-label="Close"
            disabled={clearSubmitting}
            onClick={() => !clearSubmitting && setClearTarget(null)}
          />
          <div
            className="admin-blogs-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={clearTitleId}
          >
            <div className="admin-blogs-modal-head">
              <h2 id={clearTitleId} className="admin-blogs-modal-title">
                Clear analytics for this post?
              </h2>
              <button
                type="button"
                className="admin-blogs-modal-close"
                onClick={() => !clearSubmitting && setClearTarget(null)}
                disabled={clearSubmitting}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="admin-blogs-modal-body">
              <p className="mb-2">
                Resets <strong>view count</strong> to 0 and deletes all <strong>form submissions</strong> for{' '}
                <strong>{clearTarget.title}</strong>.
              </p>
              {clearError ? (
                <p className="text-danger small mb-0" role="alert">
                  {clearError}
                </p>
              ) : null}
            </div>
            <div className="admin-blogs-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => setClearTarget(null)}
                disabled={clearSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-pill"
                onClick={confirmClear}
                disabled={clearSubmitting}
              >
                {clearSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden />
                    Clearing…
                  </>
                ) : (
                  'Clear analytics'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
