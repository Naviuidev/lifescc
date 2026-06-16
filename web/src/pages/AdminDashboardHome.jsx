import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './AdminDashboardHome.css'

function countPendingSlots(rows) {
  return rows.filter((r) => String(r.status ?? 'pending') === 'pending').length
}

function countPendingReviews(rows) {
  return rows.filter((r) => String(r.status ?? 'pending') === 'pending').length
}

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    slots: null,
    reviews: null,
    contacts: null,
    supports: null,
  })
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const endpoints = [
      { path: '/api/slots', key: 'slots' },
      { path: '/api/reviews', key: 'reviews' },
      { path: '/api/contacts', key: 'contacts' },
      { path: '/api/supports', key: 'supports' },
    ]

    ;(async () => {
      setLoadError(null)
      try {
        const responses = await Promise.all(endpoints.map((e) => fetch(e.path)))

        const parseList = async (res, key) => {
          if (!res.ok) return []
          const data = await res.json().catch(() => ({}))
          const list = data[key]
          return Array.isArray(list) ? list : []
        }

        const [slots, reviews, contacts, supports] = await Promise.all(
          responses.map((res, i) => parseList(res, endpoints[i].key)),
        )

        if (cancelled) return

        const failed = responses
          .map((r, i) => (!r.ok ? `${endpoints[i].path} (${r.status})` : null))
          .filter(Boolean)
        if (failed.length > 0) {
          setLoadError(
            `Dashboard data could not load (${failed.join('; ')}). Start the PHP API in another terminal: cd backend && npm run dev — it listens on port 8080 while Vite proxies /api from port 5173. Then refresh.`,
          )
        }

        setStats({
          slots,
          reviews,
          contacts,
          supports,
        })
      } catch {
        if (!cancelled) {
          setLoadError(
            'Could not reach the API (network error). Run: cd backend && npm run dev (port 8080), keep npm run dev in web/ (port 5173), then refresh.',
          )
          setStats({ slots: [], reviews: [], contacts: [], supports: [] })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const derived = useMemo(() => {
    const slots = stats.slots ?? []
    const reviews = stats.reviews ?? []
    const contacts = stats.contacts ?? []
    const supports = stats.supports ?? []
    return {
      slotTotal: slots.length,
      slotPending: countPendingSlots(slots),
      reviewTotal: reviews.length,
      reviewPending: countPendingReviews(reviews),
      contactTotal: contacts.length,
      supportTotal: supports.length,
    }
  }, [stats])

  const loading = stats.slots === null

  const fmt = (n) => (loading ? '—' : n)

  return (
    <div className="admin-dash-home">
      <header className="admin-dash-home__header">
        <h1 className="admin-dash-home__title">Dashboard</h1>
        <p className="admin-dash-home__lead">Overview of bookings, messages, and reviews</p>
      </header>
      {loadError ? <p className="admin-dash-home__error">{loadError}</p> : null}

      <div className="admin-dash-home__grid">
        <Link to="/admin/slots" className="admin-dash-home__card admin-dash-home__card--link">
          <span className="admin-dash-home__card-label">Slot bookings</span>
          <span className="admin-dash-home__card-value">{fmt(derived.slotTotal)}</span>
          {!loading && derived.slotPending > 0 ? (
            <span className="admin-dash-home__card-hint">{derived.slotPending} pending confirmation</span>
          ) : (
            <span className="admin-dash-home__card-hint admin-dash-home__card-hint--muted">
              Appointments &amp; follow-up
            </span>
          )}
          <span className="admin-dash-home__card-go">Open slots →</span>
        </Link>

        <Link to="/admin/reviews" className="admin-dash-home__card admin-dash-home__card--link">
          <span className="admin-dash-home__card-label">Reviews</span>
          <span className="admin-dash-home__card-value">{fmt(derived.reviewTotal)}</span>
          {!loading && derived.reviewPending > 0 ? (
            <span className="admin-dash-home__card-hint">{derived.reviewPending} awaiting approval</span>
          ) : (
            <span className="admin-dash-home__card-hint admin-dash-home__card-hint--muted">
              Customer feedback
            </span>
          )}
          <span className="admin-dash-home__card-go">Moderate reviews →</span>
        </Link>

        <Link to="/admin/contacts" className="admin-dash-home__card admin-dash-home__card--link">
          <span className="admin-dash-home__card-label">Contact form</span>
          <span className="admin-dash-home__card-value">{fmt(derived.contactTotal)}</span>
          <span className="admin-dash-home__card-hint admin-dash-home__card-hint--muted">
            Website contact submissions
          </span>
          <span className="admin-dash-home__card-go">View contacts →</span>
        </Link>

        <Link to="/admin/support" className="admin-dash-home__card admin-dash-home__card--link">
          <span className="admin-dash-home__card-label">Support requests</span>
          <span className="admin-dash-home__card-value">{fmt(derived.supportTotal)}</span>
          <span className="admin-dash-home__card-hint admin-dash-home__card-hint--muted">
            Help &amp; branch queries
          </span>
          <span className="admin-dash-home__card-go">View support →</span>
        </Link>
      </div>
    </div>
  )
}
