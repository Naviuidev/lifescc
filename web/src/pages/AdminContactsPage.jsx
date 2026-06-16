import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminDateRangeFilter from '../components/AdminDateRangeFilter.jsx'
import AdminUserContactDropdown from '../components/AdminUserContactDropdown.jsx'
import './AdminSlotsPage.css'
import './AdminContactsPage.css'

const COL_COUNT = 8

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

const CONTACTED_OPTIONS = [
  { value: 'not_contacted', label: 'Not contacted customer' },
  { value: 'contacted_remember', label: 'Contacted customer' },
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

function methodLabel(v) {
  const m = { email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp' }
  return m[v] ?? v ?? '—'
}

function matchesSearch(row, q) {
  const raw = String(q ?? '').trim().toLowerCase()
  if (!raw) return true
  const hay = [
    row.first_name,
    row.last_name,
    row.email,
    row.country_code,
    row.phone,
    row.service,
    row.submit_method,
    row.message,
    row.customer_note,
    row.status,
    row.contacted,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(raw)
}

/** Local calendar date yyyy-mm-dd for submission time (for range filter) */
function contactDateKey(iso) {
  if (!iso) return null
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function matchesContactDateRange(row, from, to) {
  if (!from && !to) return true
  const key = contactDateKey(row.created_at)
  if (!key) return true
  if (from && key < from) return false
  if (to && key > to) return false
  return true
}

/** @param {string} statusFilter empty = all */
function matchesStatusFilter(row, statusFilter) {
  const raw = String(statusFilter ?? '').trim()
  if (!raw) return true
  const st = String(row.status ?? 'pending')
  return st === raw
}

async function patchContact(id, body) {
  const res = await fetch('/api/contacts', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.contact
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

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [patchError, setPatchError] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const filterWrapRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Failed to load contacts')
        setContacts([])
        return
      }
      setContacts(Array.isArray(data.contacts) ? data.contacts : [])
    } catch {
      setError('Network error. Is the API running on port 8080?')
      setContacts([])
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

  const filtered = useMemo(() => {
    return contacts.filter(
      (row) =>
        matchesSearch(row, searchQuery) &&
        matchesContactDateRange(row, dateFrom, dateTo) &&
        matchesStatusFilter(row, statusFilter),
    )
  }, [contacts, searchQuery, dateFrom, dateTo, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage) || 1)

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [filtered.length, totalPages])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, dateFrom, dateTo, statusFilter])

  const paged = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page, perPage])

  const mergeRow = (updated) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)))
  }

  const handlePatch = async (id, body) => {
    setPatchError(null)
    try {
      const row = await patchContact(id, body)
      mergeRow(row)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const start = filtered.length === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, filtered.length)

  return (
    <div className="admin-slots">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Contact form</h1>
          <p className="admin-slots__lead">Submissions from the Contact us page</p>
        </div>
        <div className="admin-slots__toolbar">
          <div className="admin-slots__search-wrap">
            <label className="admin-slots__search-label">
              <SearchIcon className="admin-slots__search-icon" />
              <input
                type="search"
                className="admin-slots__search form-control border-0 shadow-none"
                placeholder="Search name, email, phone, service, message…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search contact submissions"
              />
            </label>
          </div>
          <div className="admin-slots__actions">
            <div className="admin-slots__status-wrap">
              <label className="admin-slots__status-label visually-hidden" htmlFor="admin-contacts-status">
                Status
              </label>
              <select
                id="admin-contacts-status"
                className="form-select form-select-sm admin-slots__status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
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
                aria-label="Filter by submission date range"
              >
                <FilterIcon className="admin-slots__toolbar-svg" />
              </button>
              {filterOpen ? (
                <div
                  className="admin-slots__filter-panel admin-slots__filter-panel--calendar"
                  role="dialog"
                  aria-label="Submission date range"
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

      <div className="admin-table-card">
        <div className="admin-table-scroll admin-table-scroll--contacts">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Reply via</th>
                <th>Message</th>
                <th>Contacted</th>
                <th>Customer note</th>
                <th>Status</th>
                <th className="admin-data-table__nowrap">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loading && contacts.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    Loading…
                  </td>
                </tr>
              ) : null}
              {!loading && contacts.length === 0 && !error ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No submissions yet.
                  </td>
                </tr>
              ) : null}
              {!loading && contacts.length > 0 && filtered.length === 0 ? (
                <tr>
                  <td colSpan={COL_COUNT} className="admin-data-table__empty">
                    No submissions match your search or date filter.
                  </td>
                </tr>
              ) : null}
              {paged.map((row) => {
                const name = `${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || '—'
                const phoneDisp = [row.country_code, row.phone].filter(Boolean).join(' ')
                const msg = String(row.message ?? '')
                const msgShort = msg.length > 120 ? `${msg.slice(0, 117)}…` : msg
                const con = row.contacted ?? 'not_contacted'
                const st = row.status ?? 'pending'
                const noteEnabled = con === 'contacted_remember'
                return (
                  <tr key={row.id}>
                    <td className="admin-data-table__td-user">
                      <AdminUserContactDropdown fullName={name} email={row.email} mobile={phoneDisp || '—'} />
                    </td>
                    <td>{row.service ?? '—'}</td>
                    <td className="admin-data-table__nowrap">{methodLabel(row.submit_method)}</td>
                    <td>
                      <span className="admin-contacts__msg" title={msg}>
                        {msgShort || '—'}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-table-select"
                        value={con}
                        onChange={(e) => handlePatch(row.id, { contacted: e.target.value })}
                        aria-label={`Contacted for ${name}`}
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
                            const v = e.target.value.trim()
                            handlePatch(row.id, { customer_note: v || null })
                          }}
                          placeholder="Note about the customer…"
                          aria-label={`Customer note for ${name}`}
                        />
                      ) : (
                        <span className="admin-data-table__muted">—</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="admin-table-select admin-table-select--pill"
                        value={st || 'pending'}
                        onChange={(e) => handlePatch(row.id, { status: e.target.value })}
                        aria-label={`Status for ${name}`}
                      >
                        {!STATUS_OPTIONS.some((o) => o.value === st) && st ? <option value={st}>{st}</option> : null}
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="admin-data-table__nowrap">{formatWhen(row.created_at)}</td>
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
              {filtered.length === 0 ? '0' : `${start}–${end}`} of {filtered.length}
              {filtered.length !== contacts.length ? (
                <span className="admin-table-footer__total"> ({contacts.length} total)</span>
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
