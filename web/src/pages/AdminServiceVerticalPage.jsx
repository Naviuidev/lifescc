import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import AdminUserContactDropdown from '../components/AdminUserContactDropdown.jsx'
import { LIFESCC_BRANCHES } from '../constants/branches.js'
import { SKIN_DROPDOWN_ITEMS } from '../constants/skinTreatments.js'
import './AdminServiceVerticalPage.css'
import './AdminSlotsPage.css'

const VERTICALS = {
  'weight-loss': {
    title: 'Weight loss',
    description:
      'Consultation requests from Book an appointment, CoolSculpting, Cryolipolysis, BMI, HIFU Liposonix, Cool Mini, Figure correction, Inch loss, Non-surgical liposuction, Zimmer, Weight loss treatment hub, 360° Weight Management, Young After 40, GLP-1, Diabetes Management Programme, and Super Woman program pages.',
  },
  skin: {
    title: 'Skin',
    description:
      'Consultation requests saved to skin_details: dedicated skin pages, `/skin/:slug` placeholders, Book an appointment (Skin), Hydra Facial, Anti Ageing, etc.',
  },
  hair: {
    title: 'Hair',
    description:
      'Consultation requests from hair-line hero forms and Book an appointment (Hair), stored in details_slot with treatment hair.',
  },
}

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

const SKIN_PAGE_LABEL_BY_SOURCE = Object.fromEntries([
  ['hydra_facial', 'Hydra Facial page'],
  ['anti_ageing', 'Anti Ageing page'],
  ...SKIN_DROPDOWN_ITEMS.filter((i) => i.slug !== 'hydrafacial' && i.slug !== 'anti-ageing').map((i) => [
    i.slug.replace(/-/g, '_'),
    `${i.label} page`,
  ]),
])

const HAIR_PAGE_LABEL_BY_SOURCE = {
  mesotherapy: 'Mesotherapy page',
  hair_regrowth: 'Hair regrowth page',
  anti_hair_fall: 'Anti hair fall page',
  anti_dandruff: 'Anti dandruff page',
  hair_transplantation_treatment: 'Hair transplantation treatment page',
  non_surgical_hair_replacement: 'Non-surgical hair replacement page',
  book_an_appointment: 'Book appointment page',
}

const HAIR_SERVICE_LABEL_BY_SOURCE = {
  mesotherapy: 'Mesotherapy',
  hair_regrowth: 'Hair regrowth',
  anti_hair_fall: 'Anti hair fall',
  anti_dandruff: 'Anti dandruff',
  hair_transplantation_treatment: 'Hair transplantation treatment',
  non_surgical_hair_replacement: 'Non-surgical hair replacement',
  book_an_appointment: 'Hair',
}

function formatDate(iso) {
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

function consultationSourcePageLabel(row, vertical) {
  const source = String(row.source_page ?? '').trim()
  if (vertical === 'hair') {
    return HAIR_PAGE_LABEL_BY_SOURCE[source] ?? (source ? `${source.replace(/_/g, ' ')} page` : 'Unknown')
  }
  if (source === 'coolsculpting') return 'CoolSculpting page'
  if (source === 'cryolipolysis') return 'Cryolipolysis page'
  if (source === 'bmi') return 'BMI page'
  if (source === 'hifu_liposonix') return 'HIFU Liposonix page'
  if (source === 'cool_mini') return 'Cool Mini page'
  if (source === 'figure_correction') return 'Figure correction page'
  if (source === 'inch_loss') return 'Inch loss page'
  if (source === 'non_surgical_liposuction') return 'Non-surgical liposuction page'
  if (source === 'zimmer') return 'Zimmer page'
  if (source === 'weight_loss_treatment') return 'Weight loss treatment page'
  if (source === 'program_360_weight_management') return '360° Weight Management program page'
  if (source === 'program_young_after_40') return 'Young After 40 program page'
  if (source === 'program_glp_1') return 'GLP-1 program page'
  if (source === 'program_diabetes_management_programme') return 'Diabetes Management Programme page'
  if (source === 'program_super_woman') return 'Super Woman program page'
  if (source === 'program_kids_nutrition') return 'Kids Nutrition program page'
  if (source === 'book_an_appointment') return 'Book appointment page'
  const skinLab = SKIN_PAGE_LABEL_BY_SOURCE[source]
  if (skinLab) return skinLab
  return source || 'Unknown'
}

function hairRowServiceLabel(row) {
  const source = String(row.source_page ?? '').trim()
  return HAIR_SERVICE_LABEL_BY_SOURCE[source] ?? (source ? source.replace(/_/g, ' ') : '—')
}

async function patchWeightLoss(id, body) {
  const res = await fetch('/api/weight-loss', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.weight_loss
}

async function patchSkinDetails(id, body) {
  const res = await fetch('/api/skin-details', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Update failed')
  return data.skin_detail
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

const WL_COL_COUNT = 10
const TREATMENT_COL_COUNT = 11

export default function AdminServiceVerticalPage() {
  const { vertical } = useParams()
  const config = VERTICALS[vertical]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [patchError, setPatchError] = useState(null)

  const showTreatmentColumn = vertical === 'skin' || vertical === 'hair'
  const tableColSpan = showTreatmentColumn ? TREATMENT_COL_COUNT : WL_COL_COUNT

  const loadWeightLoss = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/weight-loss')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setRows([])
        setError(typeof data.error === 'string' ? data.error : 'Failed to load weight-loss requests')
        return
      }
      setRows(Array.isArray(data.weight_loss_rows) ? data.weight_loss_rows : [])
    } catch {
      setRows([])
      setError('Network error. Is the API running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSkinDetails = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/skin-details')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setRows([])
        setError(typeof data.error === 'string' ? data.error : 'Failed to load skin consultation requests')
        return
      }
      setRows(Array.isArray(data.skin_details_rows) ? data.skin_details_rows : [])
    } catch {
      setRows([])
      setError('Network error. Is the API running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHairConsultations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/details-slot')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setRows([])
        setError(typeof data.error === 'string' ? data.error : 'Failed to load hair consultation requests')
        return
      }
      const all = Array.isArray(data.details_slots) ? data.details_slots : []
      setRows(all.filter((r) => String(r.treatment ?? '') === 'hair'))
    } catch {
      setRows([])
      setError('Network error. Is the API running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (vertical === 'weight-loss') {
      loadWeightLoss()
    } else if (vertical === 'skin') {
      loadSkinDetails()
    } else if (vertical === 'hair') {
      loadHairConsultations()
    } else {
      setRows([])
      setLoading(false)
      setError(null)
    }
  }, [vertical, loadWeightLoss, loadSkinDetails, loadHairConsultations])

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ta = String(a.created_at ?? '')
      const tb = String(b.created_at ?? '')
      if (ta > tb) return -1
      if (ta < tb) return 1
      return Number(b.id ?? 0) - Number(a.id ?? 0)
    })
  }, [rows])

  if (!config) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const followUpValue = (row) => {
    const fu = row.follow_up
    if (!fu) return ''
    return String(fu).slice(0, 10)
  }

  const requestsSectionTitle =
    vertical === 'skin'
      ? 'Skin consultation requests'
      : vertical === 'hair'
        ? 'Hair consultation requests'
        : 'Weight-loss consultation requests'

  const emptyRequestsMessage =
    vertical === 'skin'
      ? 'No skin consultation submissions yet.'
      : vertical === 'hair'
        ? 'No hair consultation submissions yet.'
        : 'No weight-loss submissions yet.'

  const handlePatch = async (id, body) => {
    setPatchError(null)
    try {
      if (vertical === 'weight-loss') {
        const updated = await patchWeightLoss(id, body)
        setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
      } else if (vertical === 'skin') {
        const updated = await patchSkinDetails(id, body)
        setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
      } else if (vertical === 'hair') {
        const updated = await patchDetailsSlot(id, body)
        setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)))
      }
    } catch (e) {
      setPatchError(e instanceof Error ? e.message : 'Update failed')
    }
  }

  return (
    <div className="admin-service-vertical">
      <header className="admin-service-vertical__head">
        <h1 className="admin-service-vertical__title">{config.title}</h1>
        <p className="admin-service-vertical__lead">{config.description}</p>
      </header>
      <section className="admin-service-vertical__card" aria-labelledby="svc-contact-h">
        <h2 id="svc-contact-h" className="admin-service-vertical__card-title">
          Main contact
        </h2>
        <p className="admin-service-vertical__placeholder">Not set yet — you’ll wire name, phone, and email here next.</p>
      </section>

      {vertical === 'weight-loss' || vertical === 'skin' || vertical === 'hair' ? (
        <section
          className="admin-service-vertical__card admin-service-vertical__card--table"
          aria-labelledby="svc-requests-h"
        >
          <h2 id="svc-requests-h" className="admin-service-vertical__card-title">
            {requestsSectionTitle}
          </h2>
          {error ? <p className="admin-service-vertical__error">{error}</p> : null}
          {patchError ? <p className="admin-service-vertical__error">{patchError}</p> : null}
          <div className="admin-service-vertical__table-wrap admin-service-vertical__table-wrap--wide">
            <table className="admin-data-table admin-service-vertical__data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Location</th>
                  <th>Message</th>
                  {showTreatmentColumn ? <th>Treatment</th> : null}
                  <th>From page</th>
                  <th>Submitted</th>
                  <th>Follow up</th>
                  <th>Contacted</th>
                  <th>Customer note</th>
                  <th>Visited</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={tableColSpan} className="admin-data-table__empty">
                      Loading...
                    </td>
                  </tr>
                ) : null}
                {!loading && sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={tableColSpan} className="admin-data-table__empty">
                      {emptyRequestsMessage}
                    </td>
                  </tr>
                ) : null}
                {!loading
                  ? sortedRows.map((row) => {
                      const msg = String(row.message ?? '')
                      const msgShort = msg.length > 80 ? `${msg.slice(0, 80)}…` : msg
                      const st = row.status ?? 'pending'
                      const vis = row.visited ?? 'not_visited'
                      const con = row.contacted ?? 'not_contacted'
                      const noteEnabled = con === 'contacted_remember'
                      const treatmentLabel =
                        vertical === 'hair'
                          ? hairRowServiceLabel(row)
                          : vertical === 'skin'
                            ? String(row.service_label ?? '').trim()
                            : ''
                      return (
                        <tr key={row.id}>
                          <td className="admin-data-table__td-user">
                            <AdminUserContactDropdown fullName={row.full_name} email="" mobile={row.phone} />
                          </td>
                          <td>{BRANCH_NAME_BY_ID[row.location_id] ?? row.location_id ?? '—'}</td>
                          <td className="admin-data-table__msg-cell" title={msg}>
                            {msgShort || '—'}
                          </td>
                          {showTreatmentColumn ? <td>{treatmentLabel || '—'}</td> : null}
                          <td>{consultationSourcePageLabel(row, vertical)}</td>
                          <td className="admin-data-table__nowrap">{formatDate(row.created_at)}</td>
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
                                key={`${vertical}-${row.id}-${row.customer_note ?? ''}`}
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
                    })
                  : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
