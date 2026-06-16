import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import AdminBlogToolbar from '../components/AdminBlogToolbar.jsx'
import './AdminSlotsPage.css'
import '../components/AdminBlogToolbar.css'
import './AdminBlogsPage.css'
import '../components/BookSlotModal.css'

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
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

function SettingsIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
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

function SuccessTick() {
  return (
    <svg className="book-slot-tick" viewBox="0 0 52 52" width="48" height="48" aria-hidden>
      <circle className="book-slot-tick__circle" cx="26" cy="26" r="23" fill="none" stroke="#0a4a24" strokeWidth="2" />
      <path
        className="book-slot-tick__check"
        fill="none"
        stroke="#0a4a24"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 27.5l7 7L37 19"
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

function matchesBlogSearch(row, q) {
  const raw = String(q ?? '').trim().toLowerCase()
  if (!raw) return true
  const blob = [row.title, row.slug, row.status].filter(Boolean).join(' ').toLowerCase()
  return blob.includes(raw)
}

const COL_COUNT = 6

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [postStatusFilter, setPostStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [deletedOpen, setDeletedOpen] = useState(false)

  const confirmTitleId = useId()
  const deletedTitleId = useId()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/blogs')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load blogs')
        setBlogs([])
        return
      }
      setBlogs(Array.isArray(data.blogs) ? data.blogs : [])
    } catch {
      setError('Network error. Is the API running on port 8080?')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!deleteTarget && !deletedOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (deleteTarget && !deleteSubmitting) setDeleteTarget(null)
        if (deletedOpen) setDeletedOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deleteTarget, deletedOpen, deleteSubmitting])

  useEffect(() => {
    if (deleteTarget || deletedOpen) {
      document.body.classList.add('book-slot-modal-open')
    } else {
      document.body.classList.remove('book-slot-modal-open')
    }
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [deleteTarget, deletedOpen])

  const rows = useMemo(() => {
    return blogs.filter((row) => {
      if (!matchesBlogSearch(row, searchQuery)) return false
      if (postStatusFilter && String(row.status ?? '') !== postStatusFilter) return false
      return true
    })
  }, [blogs, searchQuery, postStatusFilter])

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteError(null)
    setDeleteSubmitting(true)
    try {
      const res = await fetch(`/api/blogs/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setDeleteError(typeof data.error === 'string' ? data.error : 'Could not delete post')
        return
      }
      setDeleteTarget(null)
      setBlogs((prev) => prev.filter((b) => Number(b.id) !== Number(deleteTarget.id)))
      setDeletedOpen(true)
    } catch {
      setDeleteError('Network error')
    } finally {
      setDeleteSubmitting(false)
    }
  }

  return (
    <div className="admin-slots admin-blogs-page">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Blog posts</h1>
          <p className="admin-slots__lead">Create and manage posts for the public blog</p>
        </div>
        <div className="admin-slots__toolbar admin-blogs-page__toolbar-top">
          <AdminBlogToolbar active="posts" />
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
                placeholder="Search title, slug, status…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search blog posts"
              />
            </label>
          </div>
          <div className="admin-slots__actions admin-blog-page__quick-filters">
            <label className="visually-hidden" htmlFor="blog-list-status">
              Status filter
            </label>
            <select
              id="blog-list-status"
              className="form-select form-select-sm admin-slots__status-select"
              value={postStatusFilter}
              onChange={(e) => setPostStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="published">Published only</option>
              <option value="draft">Drafts only</option>
            </select>
          </div>
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}

      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Created</th>
                <th className="admin-data-table__center">Settings</th>
                <th className="admin-data-table__center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    Loading…
                  </td>
                </tr>
              ) : null}
              {!loading && blogs.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No blog posts yet. <Link to="/admin/blogs/new">Create one</Link>.
                  </td>
                </tr>
              ) : null}
              {!loading && blogs.length > 0 && rows.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No posts match your search or filters.{' '}
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 align-baseline"
                      onClick={() => {
                        setSearchQuery('')
                        setPostStatusFilter('')
                      }}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : null}
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="admin-data-table__td-user">
                    <span className="fw-medium text-dark">{row.title}</span>
                  </td>
                  <td className="admin-data-table__nowrap">
                    <code className="admin-blogs__slug">{row.slug || '—'}</code>
                  </td>
                  <td>
                    {row.status === 'published' ? (
                      <span className="badge rounded-pill bg-success-subtle text-success">Published</span>
                    ) : (
                      <span className="badge rounded-pill admin-blogs__badge-draft">Draft</span>
                    )}
                  </td>
                  <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
                  <td className="admin-data-table__center">
                    <Link
                      to={`/admin/blogs/${row.id}/edit`}
                      className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1"
                      title="Edit post"
                      aria-label={`Edit ${row.title}`}
                    >
                      <SettingsIcon />
                      <span className="visually-hidden">Edit</span>
                    </Link>
                  </td>
                  <td className="admin-data-table__center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill admin-blogs__delete-btn"
                      title="Delete post"
                      aria-label={`Delete ${row.title}`}
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget({ id: row.id, title: row.title })
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                Delete this post?
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
              <p className="mb-2">
                This will permanently remove <strong>{deleteTarget.title}</strong> from the blog. This cannot be undone.
              </p>
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
                  'Delete post'
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletedOpen ? (
        <div className="book-slot-modal-root" role="presentation">
          <button type="button" className="book-slot-modal-backdrop" aria-label="Close" onClick={() => setDeletedOpen(false)} />
          <div
            className="book-slot-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={deletedTitleId}
          >
            <div className="book-slot-modal-head">
              <img id={deletedTitleId} src={mainLogo} alt="Lifescc" className="book-slot-modal-logo" />
              <button
                type="button"
                className="book-slot-modal-close"
                onClick={() => setDeletedOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="book-slot-modal-success">
              <div className="book-slot-success-row">
                <SuccessTick />
                <p className="book-slot-success-text">The blog post has been deleted.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
