import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AdminDateRangeFilter from '../components/AdminDateRangeFilter.jsx'
import AdminUserContactDropdown from '../components/AdminUserContactDropdown.jsx'
import { LIFESCC_BRANCHES } from '../constants/branches.js'
import './AdminSlotsPage.css'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
]

const VISITED_OPTIONS = [
  { value: 'not_visited', label: 'Not visited' },
  { value: 'visited', label: 'Visited' },
]

const CONTACTED_OPTIONS = [
  { value: 'not_contacted', label: 'Not contacted yet' },
  { value: 'contacted_remember', label: 'Contacted (reminder)' },
]

const BRANCH_NAME_BY_ID = Object.fromEntries(LIFESCC_BRANCHES.map((b) => [b.id, b.name]))

const TREATMENT_LABELS = {
  weight_loss: 'Weight loss',
  skin: 'Skin',
  hair: 'Hair',
  skin_hair: 'Skin and hair',
}

function formatSlotDisplay(iso) {
  if (!iso) return '—'
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Local calendar date yyyy-mm-dd for slot datetime (for range filter) */
function slotDateKey(iso) {
  if (!iso) return null
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function matchesSearch(row, q) {
  const raw = String(q ?? '').trim()
  if (!raw) return true
  const t = raw.toLowerCase()
  const name = String(row.full_name ?? '').toLowerCase()
  const email = String(row.email ?? '').toLowerCase()
  const mobileDigits = String(row.mobile ?? '').replace(/\D/g, '')
  const queryDigits = raw.replace(/\D/g, '')
  if (name.includes(t) || email.includes(t)) return true
  const mobileNorm = String(row.mobile ?? '').toLowerCase().replace(/\s/g, '')
  if (mobileNorm.includes(t.replace(/\s/g, ''))) return true
  if (queryDigits.length > 0 && mobileDigits.includes(queryDigits)) return true
  return false
}

function matchesDetailSearch(row, q) {
  const raw = String(q ?? '').trim().toLowerCase()
  if (!raw) return true
  const locName = BRANCH_NAME_BY_ID[row.location_id] ?? ''
  const blob = [
    row.full_name,
    row.phone,
    row.location_id,
    locName,
    row.treatment,
    TREATMENT_LABELS[row.treatment] ?? '',
    row.message,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(raw)
}

function matchesSlotDateRange(row, from, to) {
  if (!from && !to) return true
  const key = slotDateKey(row.slot_datetime)
  if (!key) return true
  if (from && key < from) return false
  if (to && key > to) return false
  return true
}

function matchesDetailDateRange(row, from, to) {
  if (!from && !to) return true
  const key = slotDateKey(row.created_at)
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

function SearchIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

async function patchSlot(id, body) {
  const res = await fetch('/api/slots', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.slot
}

async function patchDetailsSlot(id, body) {
  const res = await fetch('/api/details-slot', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.details_slot
}

const COL_COUNT_SLOTS = 8
const COL_COUNT_DETAILS = 10

export default function AdminSlotsPage() {
  const [listView, setListView] = useState('slots')
  const [slots, setSlots] = useState([])
  const [detailSlots, setDetailSlots] = useState([])
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

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [r1, r2] = await Promise.all([fetch('/api/slots'), fetch('/api/details-slot')])
      const d1 = await r1.json().catch(() => ({}))
      const d2 = await r2.json().catch(() => ({}))
      if (!r1.ok) {
        setError(typeof d1.error === 'string' ? d1.error : 'Failed to load slots')
        setSlots([])
      } else {
        setSlots(Array.isArray(d1.slots) ? d1.slots : [])
      }
      if (!r2.ok) {
        setDetailSlots([])
        if (r1.ok) {
          setError(typeof d2.error === 'string' ? d2.error : 'Failed to load consultation requests')
        }
      } else {
        setDetailSlots(Array.isArray(d2.details_slots) ? d2.details_slots : [])
      }
    } catch {
      setError('Network error. Is the API running on port 8080?')
      setSlots([])
      setDetailSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  useEffect(() => {
    if (!filterOpen) return
    const onDown = (e) => {
      if (filterWrapRef.current && !filterWrapRef.current.contains(e.target)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [filterOpen])

  const filteredSlots = useMemo(() => {
    return slots.filter(
      (row) =>
        matchesSearch(row, searchQuery) &&
        matchesSlotDateRange(row, dateFrom, dateTo) &&
        matchesStatusFilter(row, statusFilter),
    )
  }, [slots, searchQuery, dateFrom, dateTo, statusFilter])

  const filteredDetailSlots = useMemo(() => {
    return detailSlots.filter(
      (row) =>
        String(row.treatment ?? '') !== 'weight_loss' &&
        matchesDetailSearch(row, searchQuery) &&
        matchesDetailDateRange(row, dateFrom, dateTo) &&
        matchesStatusFilter(row, statusFilter),
    )
  }, [detailSlots, searchQuery, dateFrom, dateTo, statusFilter])

  const activeFiltered = listView === 'slots' ? filteredSlots : filteredDetailSlots

  const totalPages = Math.max(1, Math.ceil(activeFiltered.length / perPage) || 1)

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), totalPages))
  }, [activeFiltered.length, totalPages])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, dateFrom, dateTo, statusFilter, listView])

  const paged = useMemo(() => {
    const start = (page - 1) * perPage
    return activeFiltered.slice(start, start + perPage)
  }, [activeFiltered, page, perPage])

  const mergeRow = (updated) => {
    setSlots((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)))
  }

  const mergeDetailRow = (updated) => {
    setDetailSlots((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)))
  }

  const handlePatch = async (id, body) => {
    setPatchError(null)
    try {
      const row = await patchSlot(id, body)
      mergeRow(row)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const handlePatchDetail = async (id, body) => {
    setPatchError(null)
    try {
      const row = await patchDetailsSlot(id, body)
      mergeDetailRow(row)
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  const followUpValue = (row) => {
    const fu = row.follow_up
    if (!fu) return ''
    return String(fu).slice(0, 10)
  }

  const start = activeFiltered.length === 0 ? 0 : (page - 1) * perPage + 1
  const end = Math.min(page * perPage, activeFiltered.length)

  const filterTitle = listView === 'slots' ? 'Slot date' : 'Submitted date'
  const filterAria =
    listView === 'slots' ? 'Filter by slot date range' : 'Filter by submission date range'

  return (
    <div className="admin-slots">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">
            {listView === 'slots' ? 'Slot bookings' : 'Consultation requests'}
          </h1>
          <p className="admin-slots__lead">Manage visits, contact, and follow-up</p>
        </div>
        <div className="admin-slots__toolbar admin-slots__toolbar--balanced">
          <div className="admin-slots__toolbar-start admin-slots__toolbar-start--split">
            <button
              type="button"
              className={`btn admin-slots__detail-books-btn${listView === 'slots' ? ' admin-slots__detail-books-btn--active' : ''}`}
              onClick={() => setListView('slots')}
            >
              Slot bookings
            </button>
            <button
              type="button"
              className={`btn admin-slots__detail-books-btn${listView === 'details' ? ' admin-slots__detail-books-btn--active' : ''}`}
              onClick={() => setListView('details')}
            >
              In detail books
            </button>
          </div>
          <div className="admin-slots__toolbar-center">
            <div className="admin-slots__search-wrap">
              <label className="admin-slots__search-label">
                <SearchIcon className="admin-slots__search-icon" />
                <input
                  type="search"
                  className="admin-slots__search form-control border-0 shadow-none"
                  placeholder={
                    listView === 'slots'
                      ? 'Search name, email, or mobile…'
                      : 'Search name, phone, location, treatment…'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  aria-label="Search table"
                />
              </label>
            </div>
          </div>
          <div className="admin-slots__toolbar-end">
            <div className="admin-slots__actions">
              <div className="admin-slots__status-wrap">
                <label className="admin-slots__status-label visually-hidden" htmlFor="admin-slots-status">
                  Status
                </label>
                <select
                  id="admin-slots-status"
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
                onClick={loadAll}
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
                  aria-label={filterAria}
                >
                  <FilterIcon className="admin-slots__toolbar-svg" />
                </button>
                {filterOpen ? (
                  <div
                    className="admin-slots__filter-panel admin-slots__filter-panel--calendar"
                    role="dialog"
                    aria-label={filterTitle}
                  >
                    <AdminDateRangeFilter
                      title={filterTitle}
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
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}
      {patchError ? <p className="admin-slots__banner admin-slots__banner--warn">{patchError}</p> : null}

      <div className="admin-table-card">
        <div className="admin-table-scroll">
          {listView === 'slots' ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Service</th>
                  <th>Slot</th>
                  <th>Follow up</th>
                  <th>Contacted</th>
                  <th>Customer note</th>
                  <th>Visited</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && slots.length === 0 ? (
                  <tr>
                    <td colSpan={COL_COUNT_SLOTS} className="admin-data-table__empty">
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && slots.length === 0 && !error ? (
                  <tr>
                    <td colSpan={COL_COUNT_SLOTS} className="admin-data-table__empty">
                      No bookings yet.
                    </td>
                  </tr>
                ) : null}
                {!loading && slots.length > 0 && filteredSlots.length === 0 ? (
                  <tr>
                    <td colSpan={COL_COUNT_SLOTS} className="admin-data-table__empty">
                      No bookings match your search, status, or date filter.
                    </td>
                  </tr>
                ) : null}
                {paged.map((row) => {
                  const st = row.status ?? 'pending'
                  const vis = row.visited ?? 'not_visited'
                  const con = row.contacted ?? 'not_contacted'
                  const noteEnabled = con === 'contacted_remember'
                  return (
                    <tr key={row.id}>
                      <td className="admin-data-table__td-user">
                        <AdminUserContactDropdown fullName={row.full_name} email={row.email} mobile={row.mobile} />
                      </td>
                      <td>{row.service}</td>
                      <td className="admin-data-table__nowrap">{formatSlotDisplay(row.slot_datetime)}</td>
                      <td>
                        <input
                          type="date"
                          className="admin-table-input"
                          value={followUpValue(row)}
                          onChange={(e) => {
                            const v = e.target.value
                            handlePatch(row.id, { follow_up: v || null })
                          }}
                          aria-label={`Follow up for ${row.full_name}`}
                        />
                      </td>
                      <td>
                        <select
                          className="admin-table-select"
                          value={con}
                          onChange={(e) => handlePatch(row.id, { contacted: e.target.value })}
                          aria-label={`Contacted for ${row.full_name}`}
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
                            aria-label={`Customer note for ${row.full_name}`}
                          />
                        ) : (
                          <span className="admin-data-table__muted">—</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="admin-table-select"
                          value={vis}
                          onChange={(e) => handlePatch(row.id, { visited: e.target.value })}
                          aria-label={`Visited for ${row.full_name}`}
                        >
                          {VISITED_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="admin-table-select admin-table-select--pill"
                          value={st || 'pending'}
                          onChange={(e) => handlePatch(row.id, { status: e.target.value })}
                          aria-label={`Status for ${row.full_name}`}
                        >
                          {!STATUS_OPTIONS.some((o) => o.value === st) && st ? (
                            <option value={st}>{st}</option>
                          ) : null}
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Treatment</th>
                  <th>Message</th>
                  <th>Submitted</th>
                  <th>Follow up</th>
                  <th>Contacted</th>
                  <th>Customer note</th>
                  <th>Visited</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && detailSlots.length === 0 ? (
                  <tr>
                    <td colSpan={COL_COUNT_DETAILS} className="admin-data-table__empty">
                      Loading…
                    </td>
                  </tr>
                ) : null}
                {!loading && detailSlots.length === 0 && !error ? (
                  <tr>
                    <td colSpan={COL_COUNT_DETAILS} className="admin-data-table__empty">
                      No consultation requests yet.
                    </td>
                  </tr>
                ) : null}
                {!loading && detailSlots.length > 0 && filteredDetailSlots.length === 0 ? (
                  <tr>
                    <td colSpan={COL_COUNT_DETAILS} className="admin-data-table__empty">
                      No rows match your search, status, or date filter.
                    </td>
                  </tr>
                ) : null}
                {paged.map((row) => {
                  const st = row.status ?? 'pending'
                  const vis = row.visited ?? 'not_visited'
                  const con = row.contacted ?? 'not_contacted'
                  const noteEnabled = con === 'contacted_remember'
                  const msg = String(row.message ?? '')
                  const msgShort = msg.length > 80 ? `${msg.slice(0, 80)}…` : msg
                  return (
                    <tr key={row.id}>
                      <td className="admin-data-table__td-user">
                        <AdminUserContactDropdown fullName={row.full_name} email="" mobile={row.phone} />
                      </td>
                      <td>{BRANCH_NAME_BY_ID[row.location_id] ?? row.location_id}</td>
                      <td>{TREATMENT_LABELS[row.treatment] ?? row.treatment}</td>
                      <td className="admin-data-table__msg-cell" title={msg}>
                        {msgShort || '—'}
                      </td>
                      <td className="admin-data-table__nowrap">{formatSlotDisplay(row.created_at)}</td>
                      <td>
                        <input
                          type="date"
                          className="admin-table-input"
                          value={followUpValue(row)}
                          onChange={(e) => {
                            const v = e.target.value
                            handlePatchDetail(row.id, { follow_up: v || null })
                          }}
                          aria-label={`Follow up for ${row.full_name}`}
                        />
                      </td>
                      <td>
                        <select
                          className="admin-table-select"
                          value={con}
                          onChange={(e) => handlePatchDetail(row.id, { contacted: e.target.value })}
                          aria-label={`Contacted for ${row.full_name}`}
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
                            key={`d-${row.id}-${row.customer_note ?? ''}`}
                            className="admin-table-textarea"
                            rows={2}
                            defaultValue={row.customer_note ?? ''}
                            onBlur={(e) => {
                              const v = e.target.value.trim()
                              handlePatchDetail(row.id, { customer_note: v || null })
                            }}
                            placeholder="Note about the customer…"
                            aria-label={`Customer note for ${row.full_name}`}
                          />
                        ) : (
                          <span className="admin-data-table__muted">—</span>
                        )}
                      </td>
                      <td>
                        <select
                          className="admin-table-select"
                          value={vis}
                          onChange={(e) => handlePatchDetail(row.id, { visited: e.target.value })}
                          aria-label={`Visited for ${row.full_name}`}
                        >
                          {VISITED_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="admin-table-select admin-table-select--pill"
                          value={st || 'pending'}
                          onChange={(e) => handlePatchDetail(row.id, { status: e.target.value })}
                          aria-label={`Status for ${row.full_name}`}
                        >
                          {!STATUS_OPTIONS.some((o) => o.value === st) && st ? (
                            <option value={st}>{st}</option>
                          ) : null}
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
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
              {activeFiltered.length === 0 ? '0' : `${start}–${end}`} of {activeFiltered.length}
              {listView === 'slots' && filteredSlots.length !== slots.length ? (
                <span className="admin-table-footer__total"> ({slots.length} total)</span>
              ) : null}
              {listView === 'details' && filteredDetailSlots.length !== detailSlots.length ? (
                <span className="admin-table-footer__total"> ({detailSlots.length} total)</span>
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
