import { useEffect, useId, useState } from 'react'
import mainLogo from '../assets/main-logo1.png'
import { BOOKING_SERVICES, BOOKING_SERVICE_GROUPS } from '../constants/services.js'
import './BookSlotModal.css'

function SuccessTick() {
  return (
    <svg
      className="book-slot-tick"
      viewBox="0 0 52 52"
      width="48"
      height="48"
      aria-hidden
    >
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

function todayISODate() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function BookSlotModal({ open, onClose }) {
  const titleId = useId()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [service, setService] = useState(BOOKING_SERVICES[0]?.value ?? '')
  const [slotDate, setSlotDate] = useState(todayISODate())
  const [slotTime, setSlotTime] = useState('10:00')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.classList.add('book-slot-modal-open')
    } else {
      document.body.classList.remove('book-slot-modal-open')
    }
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [open])

  const reset = () => {
    setFullName('')
    setEmail('')
    setMobile('')
    setService(BOOKING_SERVICES[0]?.value ?? '')
    setSlotDate(todayISODate())
    setSlotTime('10:00')
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile,
          service,
          slot_date: slotDate,
          slot_time: slotTime,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Booking failed')
        return
      }
      setSuccess(true)
      setError(data.message && !data.email_sent ? String(data.message) : null)
    } catch {
      setError('Network error. Is the API running?')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="book-slot-modal-root" role="presentation">
      <button
        type="button"
        className="book-slot-modal-backdrop"
        aria-label="Close"
        onClick={handleClose}
      />
      <div
        className="book-slot-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="book-slot-modal-head">
          <img
            id={titleId}
            src={mainLogo}
            alt="Lifescc"
            className="book-slot-modal-logo"
          />
          <button
            type="button"
            className="book-slot-modal-close"
            onClick={handleClose}
            aria-label="Close booking form"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="book-slot-modal-success">
            <div className="book-slot-success-row">
              <SuccessTick />
              <p className="book-slot-success-text">Your slot booking has been confirmed.</p>
            </div>
            {error ? <p className="book-slot-warn">{error}</p> : null}
          </div>
        ) : (
          <form className="book-slot-form" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="book-slot-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="full_name"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>
              </div>
              <div className="col-6">
                <label className="book-slot-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div className="col-6">
                <label className="book-slot-field">
                  <span>Mobile number</span>
                  <input
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </label>
              </div>
              <div className="col-12">
                <label className="book-slot-field">
                  <span>Service</span>
                  <select name="service" required value={service} onChange={(e) => setService(e.target.value)}>
                    {BOOKING_SERVICE_GROUPS.map((g) => (
                      <optgroup key={g.group} label={g.group}>
                        {g.options.map((s) => (
                          <option key={`${g.group}-${s.value}`} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>
              <div className="col-6">
                <label className="book-slot-field">
                  <span>Date</span>
                  <input
                    type="date"
                    name="slot_date"
                    required
                    min={todayISODate()}
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="col-6">
                <label className="book-slot-field">
                  <span>Time</span>
                  <input
                    type="time"
                    name="slot_time"
                    required
                    value={slotTime}
                    onChange={(e) => setSlotTime(e.target.value)}
                  />
                </label>
              </div>
              {error ? (
                <div className="col-12">
                  <p className="book-slot-error">{error}</p>
                </div>
              ) : null}
              <div className="col-12">
                <button
                  type="submit"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill w-100"
                  disabled={submitting}
                >
                  {submitting ? 'Booking…' : 'Book slot'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
