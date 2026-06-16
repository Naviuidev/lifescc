import { useCallback, useId, useState } from 'react'
import ContactSuccessModal from './ContactSuccessModal.jsx'
import { LIFESCC_BRANCHES } from '../constants/branches.js'

/**
 * Book-style consultation form + side image; POSTs to /api/weight-loss.
 * @param {{
 *   sourcePage:
 *     | 'coolsculpting'
 *     | 'book_an_appointment'
 *     | 'cryolipolysis'
 *     | 'bmi'
 *     | 'hifu_liposonix'
 *     | 'cool_mini'
 *     | 'figure_correction'
 *     | 'inch_loss'
 *     | 'non_surgical_liposuction'
 *     | 'zimmer'
 *     | 'weight_loss_treatment'
 *     | 'program_360_weight_management'
 *     | 'program_young_after_40'
 *     | 'program_glp_1'
 *     | 'program_diabetes_management_programme'
 *     | 'program_super_woman'
 *     | 'program_kids_nutrition',
 *   bannerImage?: string,
 *   stripClassName?: string,
 *   treatmentLabel?: string,
 *   title?: string,
 *   subtitle?: string,
 * }} props
 */
export default function WeightLossConsultationStrip({
  sourcePage,
  bannerImage,
  stripClassName = '',
  treatmentLabel = 'Weight loss',
  title = 'Book a consultation and get a free body checkup',
  subtitle = 'Tell us how we can help — we’ll get back to you shortly.',
}) {
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
        const res = await fetch('/api/weight-loss', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName.trim(),
            phone: phone.trim(),
            location_id: locationId,
            message: message.trim(),
            source_page: sourcePage,
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
    [fullName, phone, locationId, message, sourcePage],
  )

  return (
    <section className="coolsculpting-page__book-appt" aria-labelledby={`${formId}-heading`}>
      <ContactSuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          setSuccessEmailWarning(null)
        }}
        emailWarning={successEmailWarning}
      />
      <div
        className={`contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band${stripClassName ? ` ${stripClassName}` : ''}`}
        style={bannerImage ? { ['--contact-us-bg-image']: `url(${bannerImage})` } : undefined}
      >
        <div className="coolsculpting-book-appt__layout">
          <div className="coolsculpting-book-appt__form-col">
            <div className="page-main contact-us-page book-appointment-page">
              <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                <div className="book-appointment-page__form-inner">
                  <div className="contact-us-page__card book-appointment-page__form-card">
                    <header className="contact-us-page__card-head">
                      <h2
                        id={`${formId}-heading`}
                        className="contact-us-page__card-title book-appointment-page__form-title"
                      >
                        {title}
                      </h2>
                      <p className="contact-us-page__card-sub">{subtitle}</p>
                    </header>
                    <form className="contact-us-form" onSubmit={onSubmit} noValidate>
                      <label className="contact-us-form__field">
                        <span className="contact-us-form__label">Full name</span>
                        <input
                          type="text"
                          name="full_name"
                          autoComplete="name"
                          className="contact-us-form__input"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </label>
                      <label className="contact-us-form__field">
                        <span className="contact-us-form__label">Phone number</span>
                        <input
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          className="contact-us-form__input"
                          placeholder="+91 …"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </label>
                      <div className="contact-us-form__row contact-us-form__row--split">
                        <label className="contact-us-form__field">
                          <span className="contact-us-form__label">Location</span>
                          <select
                            className="contact-us-form__input book-appointment-page__select"
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
                        <label className="contact-us-form__field">
                          <span className="contact-us-form__label">Treatment</span>
                          <select
                            className="contact-us-form__input book-appointment-page__select"
                            value="weight_loss"
                            disabled
                            aria-label="Treatment"
                          >
                            <option value="weight_loss">{treatmentLabel}</option>
                          </select>
                        </label>
                      </div>
                      <label className="contact-us-form__field">
                        <span className="contact-us-form__label">Message</span>
                        <textarea
                          name="message"
                          className="contact-us-form__textarea"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </label>
                      {submitError ? (
                        <p className="text-danger small mb-0" role="alert">
                          {submitError}
                        </p>
                      ) : null}
                      <div className="book-appointment-page__submit-wrap">
                        <button
                          type="submit"
                          className="book-appointment-page__submit"
                          disabled={submitting}
                        >
                          <span className="book-appointment-page__submit-text">
                            {submitting ? 'Submitting…' : 'Book consultation'}
                          </span>
                          {!submitting ? (
                            <span className="book-appointment-page__submit-icon" aria-hidden>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M5 12h14M13 6l6 6-6 6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          ) : null}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="coolsculpting-book-appt__visual-col">
            <div
              className="book-appointment-page__photo coolsculpting-book-appt__photo-fullbleed"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
