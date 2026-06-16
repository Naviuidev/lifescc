import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminSlotsPage.css'
import './AdminVideosPage.css'


const COL_COUNT = 4

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

async function deleteVideo(id) {
  const res = await fetch('/api/testimonial-videos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Delete failed')
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/testimonial-videos')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load videos')
        setVideos([])
        return
      }
      setVideos(Array.isArray(data.videos) ? data.videos : [])
    } catch {
      setError('Network error. Is the API running on port 8080?')
      setVideos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this video from the website?')) return
    setDeleteError(null)
    setDeletingId(id)
    try {
      await deleteVideo(id)
      setVideos((prev) => prev.filter((v) => v.id !== id))
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="admin-slots">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Testimonial videos</h1>
          <p className="admin-slots__lead">Preview, refresh, or remove YouTube embeds shown on the Testimonials page.</p>
        </div>
        <div className="admin-slots__toolbar">
          <div />
          <div className="admin-slots__actions">
            <Link to="/admin/videos/add" className="btn btn-success btn-sm rounded-pill px-3">
              Add video
            </Link>
            <button
              type="button"
              className="btn btn-outline-success py-1 rounded-pill admin-slots__icon-btn"
              onClick={load}
              disabled={loading}
              aria-label={loading ? 'Loading' : 'Refresh list'}
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
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}
      {deleteError ? <p className="admin-slots__banner admin-slots__banner--warn">{deleteError}</p> : null}

      <div className="admin-table-card">
        <div className="admin-table-scroll admin-table-scroll--videos">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th className="admin-data-table__nowrap">Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && videos.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    Loading…
                  </td>
                </tr>
              ) : null}
              {!loading && videos.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No videos yet.{' '}
                    <Link to="/admin/videos/add" className="admin-videos__inline-link">
                      Add one
                    </Link>
                  </td>
                </tr>
              ) : null}
              {videos.map((row) => (
                <tr key={row.id}>
                  <td className="admin-videos__preview-cell">
                    <div className="admin-videos__iframe-wrap">
                      <iframe
                        title={String(row.title ?? 'Video')}
                        src={String(row.embed_src ?? '')}
                        className="admin-videos__iframe"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </td>
                  <td>{row.title ?? '—'}</td>
                  <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm rounded-pill admin-videos__del"
                      onClick={() => handleDelete(row.id)}
                      disabled={deletingId === row.id}
                      aria-label={`Delete ${row.title ?? 'video'}`}
                    >
                      {deletingId === row.id ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                      ) : (
                        <TrashIcon className="admin-videos__del-icon" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
