import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminDateRangeFilter from '../components/AdminDateRangeFilter.jsx'
import { withAppBase } from '../utils/appBase.js'
import './AdminSlotsPage.css'
import './AdminContactsPage.css'
import './AdminReviewsPage.css'

const COL_COUNT = 9

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'discarded', label: 'Rejected' },
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

function statusLabel(st) {
  const s = String(st ?? 'pending')
  if (s === 'discarded') return 'Rejected'
  return s
}

function StarsDisplay({ n }) {
  const v = Math.min(5, Math.max(0, Number(n) || 0))
  return (
    <span className="admin-reviews__stars" aria-label={`${v} of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= v ? 'admin-reviews__star-on' : 'admin-reviews__star-off'}>
          ★
        </span>
      ))}
    </span>
  )
}

/** Local calendar date yyyy-mm-dd for created_at (range filter) */
function reviewDateKey(iso) {
  if (!iso) return null
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function matchesReviewDateRange(row, from, to) {
  if (!from && !to) return true
  const key = reviewDateKey(row.created_at)
  if (!key) return true
  if (from && key < from) return false
  if (to && key > to) return false
  return true
}

function matchesStatusFilter(row, statusFilter) {
  const raw = String(statusFilter ?? '').trim()
  if (!raw) return true
  const st = String(row.status ?? 'pending')
  return st === raw
}

async function patchReview(id, status) {
  const res = await fetch('/api/reviews', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.review
}

async function deleteReview(id) {
  const res = await fetch('/api/reviews', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Delete failed')
  return data
}

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
        d="M4 7h16M10 11v6M14 11v6M6 7l1-3h10l1 3M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
      />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 6L9 17l-5-5"
      />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 6L6 18M6 6l12 12"
      />
    </svg>
  )
}

function profileSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : withAppBase(`/${path.replace(/^\//, '')}`)
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [patchError, setPatchError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [patchingId, setPatchingId] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterWrapRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load reviews')
        setReviews([])
        return
      }
      setReviews(Array.isArray(data.reviews) ? data.reviews : [])
    } catch {
      setError('Network error. Is the API running on port 8080?')
      setReviews([])
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

  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (row) => matchesReviewDateRange(row, dateFrom, dateTo) && matchesStatusFilter(row, statusFilter),
    )
  }, [reviews, dateFrom, dateTo, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / perPage) || 1)

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [filteredReviews.length, totalPages])

  useEffect(() => {
    setPage(1)
  }, [dateFrom, dateTo, statusFilter])

  const paged = useMemo(() => {
    const start = (page - 1) * perPage
    return filteredReviews.slice(start, start + perPage)
  }, [filteredReviews, page, perPage])

  const mergeRow = (updated) => {
    setReviews((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
  }

  const handleStatus = async (id, status) => {
    setPatchError(null)
    setPatchingId(id)
    try {
      const row = await patchReview(id, status)
      mergeRow(row)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setPatchingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently? This cannot be undone.')) return
    setDeleteError(null)
    setDeletingId(id)
    try {
      await deleteReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const start = filteredReviews.length === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, filteredReviews.length)

  return (
    <div className="admin-slots">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Reviews</h1>
          <p className="admin-slots__lead">Approve or discard customer feedback</p>
        </div>
        <div className="admin-slots__toolbar">
          <div />
          <div className="admin-slots__actions">
            <div className="admin-slots__status-wrap">
              <label className="admin-slots__status-label visually-hidden" htmlFor="admin-reviews-status">
                Status
              </label>
              <select
                id="admin-reviews-status"
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
            </div>
            <button
              type="button"
              className="btn btn-outline-success py-1 rounded-pill admin-slots__icon-btn"
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
            <div className="admin-slots__filter-wrap" ref={filterWrapRef}>
              <button
                type="button"
                className={`btn btn-outline-secondary py-1 rounded-pill admin-slots__icon-btn${dateFrom || dateTo ? ' admin-slots__icon-btn--active' : ''}`}
                onClick={() => setFilterOpen((v) => !v)}
                aria-expanded={filterOpen}
                aria-haspopup="dialog"
                aria-label="Filter by submitted date range"
              >
                <FilterIcon className="admin-slots__toolbar-svg" />
              </button>
              {filterOpen ? (
                <div
                  className="admin-slots__filter-panel admin-slots__filter-panel--calendar"
                  role="dialog"
                  aria-label="Submitted date range"
                >
                  <AdminDateRangeFilter
                    title="Submitted"
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onChange={({ dateFrom: f, dateTo: t }) => {
                      setDateFrom(f)
                      setDateTo(t)
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}
      {patchError ? <p className="admin-slots__banner admin-slots__banner--warn">{patchError}</p> : null}
      {deleteError ? <p className="admin-slots__banner admin-slots__banner--warn">{deleteError}</p> : null}

      <div className="admin-table-card">
        <div className="admin-table-scroll admin-table-scroll--reviews">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Treatment</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
                <th className="admin-data-table__nowrap">Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && reviews.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    Loading…
                  </td>
                </tr>
              ) : null}
              {!loading && reviews.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No reviews yet.
                  </td>
                </tr>
              ) : null}
              {!loading && reviews.length > 0 && filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No reviews match your status or date filter.
                  </td>
                </tr>
              ) : null}
              {paged.map((row) => {
                const txt = String(row.review_text ?? '')
                const short = txt.length > 100 ? `${txt.slice(0, 97)}…` : txt
                const st = row.status ?? 'pending'
                const pending = st === 'pending'
                const showDelete = st === 'approved' || st === 'discarded'
                const img = profileSrc(row.profile_image)
                return (
                  <tr key={row.id}>
                    <td>
                      {img ? (
                        <img src={img} alt="" className="admin-reviews__thumb" width={40} height={40} />
                      ) : (
                        <span className="admin-data-table__muted">—</span>
                      )}
                    </td>
                    <td>{row.customer_name ?? '—'}</td>
                    <td className="admin-data-table__nowrap">{row.email ?? '—'}</td>
                    <td>{row.treatment ?? '—'}</td>
                    <td>
                      <StarsDisplay n={row.rating} />
                    </td>
                    <td>
                      <span className="admin-contacts__msg" title={txt}>
                        {short || '—'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-reviews__badge admin-reviews__badge--${st}`}>{statusLabel(st)}</span>
                    </td>
                    <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
                    <td>
                      {pending ? (
                        <div className="admin-reviews__actions">
                          {patchingId === row.id ? (
                            <span className="admin-reviews__patching" role="status" aria-label="Updating">
                              <span className="spinner-border spinner-border-sm text-success" />
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="admin-reviews__icon-btn admin-reviews__icon-btn--approve"
                                onClick={() => handleStatus(row.id, 'approved')}
                                aria-label="Approve review"
                                title="Approve"
                              >
                                <CheckIcon className="admin-reviews__action-icon" />
                              </button>
                              <button
                                type="button"
                                className="admin-reviews__icon-btn admin-reviews__icon-btn--reject"
                                onClick={() => handleStatus(row.id, 'discarded')}
                                aria-label="Reject review"
                                title="Reject"
                              >
                                <XIcon className="admin-reviews__action-icon" />
                              </button>
                            </>
                          )}
                        </div>
                      ) : showDelete ? (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm rounded-pill admin-reviews__delete-btn"
                          onClick={() => handleDelete(row.id)}
                          disabled={deletingId === row.id}
                          aria-label={`Delete review from ${row.customer_name ?? 'customer'}`}
                          title="Delete review"
                        >
                          {deletingId === row.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" />
                          ) : (
                            <TrashIcon className="admin-reviews__delete-icon" />
                          )}
                        </button>
                      ) : (
                        <span className="admin-data-table__muted">—</span>
                      )}
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
              {[8, 16, 24, 32].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-table-footer__range">
            <span>
              {filteredReviews.length === 0 ? '0' : `${start}–${end}`} of {filteredReviews.length}
              {filteredReviews.length !== reviews.length ? (
                <span className="admin-table-footer__total"> ({reviews.length} total)</span>
              ) : null}
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
    </div>
  )
}
