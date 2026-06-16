import { useCallback, useId, useState } from 'react'
import ContactSuccessModal from './ContactSuccessModal.jsx'
import { LIFESCC_BRANCHES } from '../constants/branches.js'

/**
 * Hero banner consultation for skin-line services; POSTs to /api/skin-details (skin_details table).
 * @param {{ sourcePage: string, serviceLabel: string }} props
 */
export default function SkinHeroConsultForm({ sourcePage, serviceLabel }) {
  const formId = useId()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [locationId, setLocationId] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successEmailWarning, setSuccessEmailWarning] = useState(null)

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setSubmitError(null)
      setSubmitting(true)
      try {
        const res = await fetch('/api/skin-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName.trim(),
            phone: phone.trim(),
            location_id: locationId,
            message: message.trim(),
            source_page: sourcePage,
            service_label: serviceLabel.trim(),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setSubmitError(typeof data.error === 'string' ? data.error : 'Could not submit')
          return
        }
        setFullName('')
        setPhone('')
        setLocationId('')
        setMessage('')
        setSuccessEmailWarning(data.email_sent === false && data.message ? String(data.message) : null)
        setSuccessOpen(true)
      } catch {
        setSubmitError('Network error. Is the API running?')
      } finally {
        setSubmitting(false)
      }
    },
    [fullName, phone, locationId, message, sourcePage, serviceLabel],
  )

  return (
    <>
      <ContactSuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          setSuccessEmailWarning(null)
        }}
        emailWarning={successEmailWarning}
      />
      <form id={formId} className="cryolipolysis-hero-form" onSubmit={onSubmit} noValidate>
        <div className="cryolipolysis-hero-form__row cryolipolysis-hero-form__row--split">
          <label className="cryolipolysis-hero-form__field">
            <span className="cryolipolysis-hero-form__label">Full name</span>
            <input
              type="text"
              name="full_name"
              autoComplete="name"
              className="cryolipolysis-hero-form__input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
          <label className="cryolipolysis-hero-form__field">
            <span className="cryolipolysis-hero-form__label">Phone number</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              className="cryolipolysis-hero-form__input"
              placeholder="+91 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="cryolipolysis-hero-form__row cryolipolysis-hero-form__row--split">
          <label className="cryolipolysis-hero-form__field">
            <span className="cryolipolysis-hero-form__label">Location</span>
            <select
              className="cryolipolysis-hero-form__input cryolipolysis-hero-form__select"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              required
              aria-label="Select location"
            >
              <option value="" disabled>
                Select location
              </option>
              {LIFESCC_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="cryolipolysis-hero-form__field">
            <span className="cryolipolysis-hero-form__label">Treatment</span>
            <select
              className="cryolipolysis-hero-form__input cryolipolysis-hero-form__select"
              value="skin"
              disabled
              aria-label="Treatment"
            >
              <option value="skin">{serviceLabel}</option>
            </select>
          </label>
        </div>
        <div className="cryolipolysis-hero-form__row">
          <label className="cryolipolysis-hero-form__field cryolipolysis-hero-form__field--full">
            <span className="cryolipolysis-hero-form__label">Message</span>
            <textarea
              name="message"
              className="cryolipolysis-hero-form__textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
        </div>
        {submitError ? (
          <p className="cryolipolysis-hero-form__error" role="alert">
            {submitError}
          </p>
        ) : null}
        <div className="cryolipolysis-hero-form__submit-wrap">
          <button type="submit" className="cryolipolysis-hero-form__submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Book consultation'}
          </button>
        </div>
      </form>
    </>
  )
}
