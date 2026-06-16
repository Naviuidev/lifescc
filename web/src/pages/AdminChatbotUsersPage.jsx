import { useCallback, useEffect, useMemo, useState } from 'react'
import './AdminSlotsPage.css'
import './AdminChatbotUsersPage.css'

const COL_COUNT = 6

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

function matchesSearch(row, q) {
  const raw = String(q ?? '').trim().toLowerCase()
  if (!raw) return true
  const blob = [row.summary_line, row.payload_json, String(row.id), String(row.dwell_seconds)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(raw)
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

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function AdminChatbotUsersPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(12)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chatbot-users')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load')
        setRows([])
        return
      }
      setRows(Array.isArray(data.chatbot_users) ? data.chatbot_users : [])
    } catch {
      setError('Network error. Is the API running?')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => rows.filter((r) => matchesSearch(r, searchQuery)), [rows, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage) || 1)

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [filtered.length, totalPages])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, perPage])

  const paged = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const start = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, filtered.length)

  return (
    <div className="admin-slots">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Site chatbot visitors</h1>
          <p className="admin-slots__lead">
            Captures after 30+ seconds in the floating assistant (answers snapshot + email to admin when configured).
          </p>
        </div>
        <div className="admin-slots__toolbar">
          <div className="admin-slots__search-wrap">
            <label className="admin-slots__search-label">
              <SearchIcon className="admin-slots__search-icon" />
              <input
                type="search"
                className="admin-slots__search form-control border-0 shadow-none"
                placeholder="Search summary or payload…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search chatbot captures"
              />
            </label>
          </div>
          <div className="admin-slots__actions">
            <label className="admin-chatbot-users__per visually-hidden" htmlFor="admin-chatbot-users-per">
              Rows per page
            </label>
            <select
              id="admin-chatbot-users-per"
              className="form-select form-select-sm admin-slots__status-select"
              value={String(perPage)}
              onChange={(e) => setPerPage(Number(e.target.value) || 12)}
            >
              <option value="8">8 / page</option>
              <option value="12">12 / page</option>
              <option value="24">24 / page</option>
            </select>
            <button
              type="button"
              className="btn btn-outline-success py-1 rounded-pill admin-slots__icon-btn"
              onClick={() => void load()}
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
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}

      <p className="admin-chatbot-users__meta" aria-live="polite">
        {filtered.length === 0 ? 'No rows' : `Showing ${start}–${end} of ${filtered.length}`}
      </p>

      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th className="admin-data-table__nowrap">ID</th>
                <th>Summary</th>
                <th className="admin-data-table__nowrap">Seconds</th>
                <th className="admin-data-table__nowrap">Mail</th>
                <th className="admin-data-table__nowrap">Recorded</th>
                <th>Answers (JSON)</th>
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
              {!loading && rows.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No captures yet. Open the site chat for 30+ seconds to create a row.
                  </td>
                </tr>
              ) : null}
              {!loading && rows.length > 0 && filtered.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No rows match your search.
                  </td>
                </tr>
              ) : null}
              {paged.map((row) => (
                <tr key={row.id}>
                  <td className="admin-data-table__nowrap">{row.id}</td>
                  <td>
                    <span className="admin-chatbot-users__summary">{row.summary_line ?? '—'}</span>
                  </td>
                  <td className="admin-data-table__nowrap">{row.dwell_seconds ?? '—'}</td>
                  <td className="admin-data-table__nowrap">
                    {Number(row.email_sent) === 1 ? (
                      <span className="text-success">Sent</span>
                    ) : (
                      <span className="text-muted">No</span>
                    )}
                  </td>
                  <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
                  <td>
                    <pre className="admin-chatbot-users__json" tabIndex={0}>
                      {row.payload_json ?? '—'}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 ? (
        <nav className="admin-chatbot-users__pager" aria-label="Pagination">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="admin-chatbot-users__page-num">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </nav>
      ) : null}
    </div>
  )
}
