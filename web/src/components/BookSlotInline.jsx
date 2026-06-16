import { useEffect, useMemo, useState } from 'react'
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

/**
 * Inline slot booking (same API as BookSlotModal) for chatbot preview.
 *
 * @param {() => void} [props.onBookingSuccess] — after server confirms booking (parent may unmount this form)
 * @param {(payload: { full_name: string }) => void} [props.onNameBlur] — when user leaves name field with text (partial save)
 * @param {string} [props.initialServiceLabel] — pre-select service (adds option if not in catalog)
 * @param {string} [props.className] — extra classes on the form (e.g. chatbot widget typography)
 * @param {'select'|'buttons'} [props.serviceLayout] — service field: native select vs pill buttons
 * @param {{ value: string, label: string }[]} [props.serviceOptionList] — when set, replaces default booking service list
 */
export default function BookSlotInline({
  onBookingSuccess,
  onNameBlur,
  initialServiceLabel,
  className = '',
  serviceLayout = 'select',
  serviceOptionList = null,
}) {
  const serviceOptions = useMemo(() => {
    const label = String(initialServiceLabel || '').trim()
    const fromList =
      Array.isArray(serviceOptionList) && serviceOptionList.length > 0
        ? serviceOptionList
            .map((x) => ({
              value: String(x.value ?? x.label ?? '').trim(),
              label: String(x.label ?? x.value ?? '').trim(),
            }))
            .filter((x) => x.value && x.label)
        : null

    const base = fromList ?? BOOKING_SERVICES
    if (!label) return base
    const hit = base.find(
      (s) => s.label.toLowerCase() === label.toLowerCase() || s.value.toLowerCase() === label.toLowerCase()
    )
    if (hit) return base
    return [{ value: label, label }, ...base]
  }, [initialServiceLabel, serviceOptionList])

  const defaultService = useMemo(() => {
    const label = String(initialServiceLabel || '').trim()
    const first = serviceOptions[0]?.value ?? ''
    if (!label) return first
    const hit = serviceOptions.find(
      (s) => s.label.toLowerCase() === label.toLowerCase() || s.value.toLowerCase() === label.toLowerCase()
    )
    return hit ? hit.value : label
  }, [initialServiceLabel, serviceOptions])

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [service, setService] = useState(defaultService)
  const [slotDate, setSlotDate] = useState(todayISODate())
  const [slotTime, setSlotTime] = useState('10:00')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setService(defaultService)
  }, [defaultService])

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
      setError(data.message && !data.email_sent ? String(data.message) : null)
      if (onBookingSuccess) {
        onBookingSuccess()
        return
      }
      setSuccess(true)
    } catch {
      setError('Network error. Is the API running?')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNameBlur = () => {
    const t = fullName.trim()
    if (t.length > 0) {
      onNameBlur?.({ full_name: t })
    }
  }

  if (success) {
    return (
      <div className="book-slot-modal-success book-slot-inline-success">
        <div className="book-slot-success-row">
          <SuccessTick />
          <p className="book-slot-success-text">Your slot booking has been confirmed.</p>
        </div>
        {error ? <p className="book-slot-warn">{error}</p> : null}
      </div>
    )
  }

  const formClass = `book-slot-form book-slot-inline-form${className ? ` ${className}` : ''}`.trim()

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <div className="book-slot-inline-grid">
        <label className="book-slot-field book-slot-inline-field">
          <span>Full name</span>
          <input
            type="text"
            name="full_name"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={handleNameBlur}
          />
        </label>
        <label className="book-slot-field book-slot-inline-field book-slot-inline-field--half">
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
        <label className="book-slot-field book-slot-inline-field book-slot-inline-field--half">
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
        {serviceLayout === 'buttons' ? (
          <div className="book-slot-service-btns book-slot-inline-field">
            <span className="book-slot-field-label">Service</span>
            <div className="book-slot-service-btns-inner" role="group" aria-label="Service">
              {serviceOptions.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`book-slot-service-chip${service === s.value ? ' is-selected' : ''}`}
                  onClick={() => setService(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <label className="book-slot-field book-slot-inline-field">
            <span>Service</span>
            <select name="service" required value={service} onChange={(e) => setService(e.target.value)}>
              {serviceOptionList != null
                ? serviceOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))
                : BOOKING_SERVICE_GROUPS.map((g) => (
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
        )}
        <label className="book-slot-field book-slot-inline-field book-slot-inline-field--half">
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
        <label className="book-slot-field book-slot-inline-field book-slot-inline-field--half">
          <span>Time</span>
          <input
            type="time"
            name="slot_time"
            required
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
          />
        </label>
        {error ? <p className="book-slot-error book-slot-inline-field">{error}</p> : null}
        <button
          type="submit"
          className="book-slot-btn py-2 book-slot-btn--primary rounded-pill book-slot-inline-field"
          disabled={submitting}
        >
          {submitting ? 'Booking…' : 'Book slot'}
        </button>
      </div>
    </form>
  )
}
