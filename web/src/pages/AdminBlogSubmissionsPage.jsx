import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminBlogToolbar from '../components/AdminBlogToolbar.jsx'
import AdminUserContactDropdown from '../components/AdminUserContactDropdown.jsx'
import './AdminSlotsPage.css'
import '../components/AdminBlogToolbar.css'
import './AdminBlogsPage.css'

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

function FilterIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 5h16l-6.5 7.32V19l-3 1.5v-8.18L4 5z"
      />
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

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

const CONTACTED_OPTIONS = [
  { value: 'not_contacted', label: 'Not contacted yet' },
  { value: 'contacted_remember', label: 'Contacted (reminder)' },
]

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

function truncateMessage(s, max = 80) {
  const t = String(s ?? '').trim()
  if (!t) return '—'
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

function fullName(row) {
  const s = `${row.first_name || ''} ${row.last_name || ''}`.trim()
  return s || '—'
}

function matchesSearch(row, q) {
  const raw = String(q ?? '').trim()
  if (!raw) return true
  const t = raw.toLowerCase()
  const blob = [
    row.blog_title,
    row.blog_slug,
    row.first_name,
    row.last_name,
    row.email,
    row.mobile_number,
    row.message,
    row.customer_note,
    row.status,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(t)
}

function matchesStatusFilter(row, statusFilter) {
  const raw = String(statusFilter ?? '').trim()
  if (!raw) return true
  return String(row.status ?? 'pending') === raw
}

function matchesContactedFilter(row, contactedFilter) {
  const raw = String(contactedFilter ?? '').trim()
  if (!raw) return true
  return String(row.contacted ?? 'not_contacted') === raw
}

/** Quick: needs attention = pending + not contacted */
function matchesQuickFilter(row, quick) {
  if (quick === '') return true
  if (quick === 'needs_followup') {
    return String(row.status ?? 'pending') === 'pending' && String(row.contacted ?? 'not_contacted') === 'not_contacted'
  }
  return true
}

/** URL ?blog=id from analytics — show only leads for that post */
function matchesBlogQuery(row, blogParam) {
  const raw = String(blogParam ?? '').trim()
  if (!raw || !/^\d+$/.test(raw)) return true
  const id = Number(raw)
  return Number(row.blog_id) === id
}

const COL_COUNT = 8

async function patchLead(id, body) {
  const res = await fetch(`/api/blog-leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.lead
}

export default function AdminBlogSubmissionsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const blogQuery = searchParams.get('blog')

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [patchError, setPatchError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [contactedFilter, setContactedFilter] = useState('')
  const [quickFilter, setQuickFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterWrapRef = useRef(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const confirmTitleId = useId()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/blog-leads')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load submissions')
        setLeads([])
        return
      }
      setLeads(Array.isArray(data.leads) ? data.leads : [])
    } catch {
      setError('Network error')
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!filterOpen) return
    const onDown = (e) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [filterOpen])

  useEffect(() => {
    if (!deleteTarget) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !deleteSubmitting) setDeleteTarget(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteTarget, deleteSubmitting])

  useEffect(() => {
    if (deleteTarget) document.body.classList.add('book-slot-modal-open')
    else document.body.classList.remove('book-slot-modal-open')
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [deleteTarget])

  const mergeRow = (updated) => {
    setLeads((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)))
  }

  const handlePatch = async (id, body) => {
    setPatchError(null)
    try {
      const row = await patchLead(id, body)
      mergeRow(row)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const blogFilterTitle = useMemo(() => {
    if (!blogQuery || !/^\d+$/.test(String(blogQuery))) return null
    const id = Number(blogQuery)
    const hit = leads.find((r) => Number(r.blog_id) === id)
    return hit?.blog_title?.trim() || null
  }, [leads, blogQuery])

  const filtered = useMemo(() => {
    return leads.filter(
      (row) =>
        matchesBlogQuery(row, blogQuery) &&
        matchesSearch(row, searchQuery) &&
        matchesStatusFilter(row, statusFilter) &&
        matchesContactedFilter(row, contactedFilter) &&
        matchesQuickFilter(row, quickFilter),
    )
  }, [leads, blogQuery, searchQuery, statusFilter, contactedFilter, quickFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage) || 1)

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [filtered.length, totalPages])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter, contactedFilter, quickFilter, blogQuery])

  const paged = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const start = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, filtered.length)

  const confirmDelete = async () => {
    if (!deleteTarget) return
    const delId = deleteTarget.id
    setDeleteError(null)
    setDeleteSubmitting(true)
    try {
      const res = await fetch(`/api/blog-leads/${delId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDeleteError(typeof data.error === 'string' ? data.error : 'Could not delete')
        return
      }
      setDeleteTarget(null)
      setLeads((prev) => prev.filter((r) => Number(r.id) !== Number(delId)))
    } catch {
      setDeleteError('Network error')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const filtersActive = Boolean(statusFilter || contactedFilter || quickFilter)

  return (
    <div className="admin-slots admin-blog-submissions-page">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Blog form submissions</h1>
          <p className="admin-slots__lead">Leads from public blog posts — same follow-up fields as slot bookings.</p>
        </div>
        <div className="admin-slots__toolbar admin-blog-page__toolbar-top">
          <AdminBlogToolbar active="submissions" />
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
                placeholder="Search blog, name, email, mobile, notes, status…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search submissions"
              />
            </label>
          </div>
          <div className="admin-slots__actions admin-blog-page__quick-filters">
            <label className="visually-hidden" htmlFor="blog-lead-quick">
              Quick filter
            </label>
            <select
              id="blog-lead-quick"
              className="form-select form-select-sm admin-slots__status-select"
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
            >
              <option value="">All leads</option>
              <option value="needs_followup">Needs follow-up (pending, not contacted)</option>
            </select>
            <label className="visually-hidden" htmlFor="blog-lead-status">
              Status
            </label>
            <select
              id="blog-lead-status"
              className="form-select form-select-sm admin-slots__status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <label className="visually-hidden" htmlFor="blog-lead-contacted">
              Contacted
            </label>
            <select
              id="blog-lead-contacted"
              className="form-select form-select-sm admin-slots__status-select"
              value={contactedFilter}
              onChange={(e) => setContactedFilter(e.target.value)}
            >
              <option value="">All contact states</option>
              {CONTACTED_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="admin-slots__filter-wrap" ref={filterWrapRef}>
              <button
                type="button"
                className={`btn btn-outline-secondary py-1 rounded-pill admin-slots__icon-btn${filtersActive ? ' admin-slots__icon-btn--active' : ''}`}
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                aria-label="Filter help"
              >
                <FilterIcon className="admin-slots__toolbar-svg" />
              </button>
              {filterOpen ? (
                <div className="admin-slots__filter-panel" role="dialog" aria-label="Filters">
                  <p className="small text-muted mb-0">
                    Use <strong>Quick filter</strong> for pending rows still not contacted. Refine with status and
                    contacted dropdowns. Search includes notes.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}

      {blogQuery && /^\d+$/.test(String(blogQuery)) ? (
        <p className="admin-slots__banner text-secondary mb-0" role="status">
          Showing leads for{' '}
          <strong>{blogFilterTitle || `blog #${blogQuery}`}</strong>
          .{' '}
          <button
            type="button"
            className="btn btn-link btn-sm p-0 align-baseline"
            onClick={() => setSearchParams({})}
          >
            Show all posts
          </button>
        </p>
      ) : null}
      {patchError ? <p className="admin-slots__banner admin-slots__banner--warn">{patchError}</p> : null}

      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Blog</th>
                <th>User</th>
                <th>Message</th>
                <th>Submitted</th>
                <th>Contacted</th>
                <th>Customer note</th>
                <th>Status</th>
                <th className="admin-data-table__center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    Loading…
                  </td>
                </tr>
              ) : null}
              {!loading && leads.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No submissions yet.
                  </td>
                </tr>
              ) : null}
              {!loading && leads.length > 0 && filtered.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No rows match your search or filters.
                  </td>
                </tr>
              ) : null}
              {paged.map((row) => {
                const con = row.contacted ?? 'not_contacted'
                const st = row.status ?? 'pending'
                const noteEnabled = con === 'contacted_remember'
                return (
                  <tr key={row.id}>
                    <td className="admin-data-table__td-user">
                      <span className="fw-medium text-dark">{row.blog_title || '—'}</span>
                    </td>
                    <td className="admin-data-table__td-user">
                      <AdminUserContactDropdown
                        fullName={fullName(row)}
                        email={row.email}
                        mobile={row.mobile_number}
                      />
                    </td>
                    <td className="admin-blogs-data__msg" title={row.message || ''}>
                      {truncateMessage(row.message)}
                    </td>
                    <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
                    <td>
                      <select
                        className="admin-table-select"
                        value={con}
                        onChange={(e) => handlePatch(row.id, { contacted: e.target.value })}
                        aria-label={`Contacted for ${fullName(row)}`}
                      >
                        {CONTACTED_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      {noteEnabled ? (
                        <textarea
                          key={`${row.id}-${row.customer_note ?? ''}`}
                          className="admin-table-textarea"
                          rows={2}
                          defaultValue={row.customer_note ?? ''}
                          onBlur={(e) => {
                            const v = e.target.value
                            if (v === (row.customer_note ?? '')) return
                            handlePatch(row.id, { customer_note: v || null })
                          }}
                          aria-label={`Customer note for ${fullName(row)}`}
                        />
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="admin-table-select"
                        value={st}
                        onChange={(e) => handlePatch(row.id, { status: e.target.value })}
                        aria-label={`Status for ${fullName(row)}`}
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                        {!STATUS_OPTIONS.some((o) => o.value === st) && st ? <option value={st}>{st}</option> : null}
                      </select>
                    </td>
                    <td className="admin-data-table__center">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill admin-blogs__delete-btn"
                        title="Delete submission"
                        aria-label="Delete submission"
                        onClick={() => {
                          setDeleteError(null)
                          setDeleteTarget({ id: row.id })
                        }}
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <footer className="admin-table-footer">
          <label className="admin-table-footer__per">
            Show rows per page
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value))
                setPage(1)
              }}
              className="admin-table-select admin-table-select--sm"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-table-footer__range">
            <span>
              {filtered.length === 0 ? '0' : `${start}–${end}`} of {filtered.length}
              {filtered.length !== leads.length ? <span className="admin-table-footer__total"> ({leads.length} total)</span> : null}
            </span>
            <button
              type="button"
              className="admin-table-footer__nav"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
            <button
              type="button"
              className="admin-table-footer__nav"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </footer>
      </div>

      {deleteTarget ? (
        <div className="admin-blogs-modal-root" role="presentation">
          <button
            type="button"
            className="admin-blogs-modal-backdrop"
            aria-label="Close"
            disabled={deleteSubmitting}
            onClick={() => !deleteSubmitting && setDeleteTarget(null)}
          />
          <div
            className="admin-blogs-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={confirmTitleId}
          >
            <div className="admin-blogs-modal-head">
              <h2 id={confirmTitleId} className="admin-blogs-modal-title">
                Delete this submission?
              </h2>
              <button
                type="button"
                className="admin-blogs-modal-close"
                onClick={() => !deleteSubmitting && setDeleteTarget(null)}
                disabled={deleteSubmitting}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="admin-blogs-modal-body">
              <p className="mb-2">This removes the lead from your records.</p>
              {deleteError ? (
                <p className="text-danger small mb-0" role="alert">
                  {deleteError}
                </p>
              ) : null}
            </div>
            <div className="admin-blogs-modal-actions">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-pill"
                onClick={confirmDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden />
                    Deleting…
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
