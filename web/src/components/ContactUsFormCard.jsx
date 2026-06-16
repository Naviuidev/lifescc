import { useState } from 'react'
import ContactSuccessModal from './ContactSuccessModal.jsx'
import { BOOKING_SERVICES, BOOKING_SERVICE_GROUPS, CONTACT_SUBMIT_METHODS } from '../constants/services.js'
import './BookSlotModal.css'
import '../pages/ContactUsPage.css'

function EnvelopeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Same “Get in Touch” card + fields as `/contact-us` (POST /api/contact).
 * @param {{ headingId?: string, className?: string }} props
 */
export default function ContactUsFormCard({ headingId, className = '' }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState(BOOKING_SERVICES[0]?.value ?? '')
  const [submitMethod, setSubmitMethod] = useState(CONTACT_SUBMIT_METHODS[0]?.value ?? 'email')
  const [message, setMessage] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [successEmailWarning, setSuccessEmailWarning] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const maxMessage = 120

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setCountryCode('+91')
    setPhone('')
    setService(BOOKING_SERVICES[0]?.value ?? '')
    setSubmitMethod(CONTACT_SUBMIT_METHODS[0]?.value ?? 'email')
    setMessage('')
    setSubmitError(null)
    setSuccessEmailWarning(null)
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          country_code: countryCode,
          phone,
          service,
          submit_method: submitMethod,
          message,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(typeof data.error === 'string' ? data.error : 'Could not send message')
        return
      }
      setSuccessEmailWarning(
        data.email_sent === false && data.message ? String(data.message) : null
      )
      setSuccessOpen(true)
    } catch {
      setSubmitError('Network error. Is the API running?')
    } finally {
      setSubmitting(false)
    }
  }

  const cardClass = ['contact-us-page__card', className].filter(Boolean).join(' ')

  return (
    <>
      <ContactSuccessModal
        open={successOpen}
        onClose={handleSuccessClose}
        emailWarning={successEmailWarning}
      />
      <div className={cardClass}>
        <header className="contact-us-page__card-head">
          <h2 {...(headingId ? { id: headingId } : {})} className="contact-us-page__card-title">
            Get in Touch
          </h2>
          <p className="contact-us-page__card-sub">You can reach us anytime</p>
        </header>

        <form className="contact-us-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-us-form__row contact-us-form__row--split">
            <label className="contact-us-form__field">
              <span className="contact-us-form__label">First name</span>
              <input
                type="text"
                name="first_name"
                autoComplete="given-name"
                className="contact-us-form__input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </label>
            <label className="contact-us-form__field">
              <span className="contact-us-form__label">Last name</span>
              <input
                type="text"
                name="last_name"
                autoComplete="family-name"
                className="contact-us-form__input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="contact-us-form__field">
            <span className="contact-us-form__label">Your email</span>
            <div className="contact-us-form__input-wrap">
              <span className="contact-us-form__input-icon" aria-hidden>
                <EnvelopeIcon />
              </span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className="contact-us-form__input contact-us-form__input--with-icon"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <div className="contact-us-form__field">
            <span className="contact-us-form__label">Phone number</span>
            <div className="contact-us-form__phone-row">
              <select
                className="contact-us-form__cc"
                aria-label="Country code"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+62">+62</option>
                <option value="+44">+44</option>
                <option value="+971">+971</option>
              </select>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="contact-us-form__input contact-us-form__input--phone"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <label className="contact-us-form__field">
            <span className="contact-us-form__label">Service</span>
            <select
              name="service"
              className="contact-us-form__input contact-us-form__select"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
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

          <label className="contact-us-form__field">
            <span className="contact-us-form__label">Preferred reply method</span>
            <select
              name="submit_method"
              className="contact-us-form__input contact-us-form__select"
              value={submitMethod}
              onChange={(e) => setSubmitMethod(e.target.value)}
              required
            >
              {CONTACT_SUBMIT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="contact-us-form__field">
            <span className="contact-us-form__label">How can we help?</span>
            <div className="contact-us-form__textarea-wrap">
              <textarea
                name="message"
                className="contact-us-form__textarea"
                rows={5}
                maxLength={maxMessage}
                placeholder="Tell us what you need…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <span className="contact-us-form__counter" aria-live="polite">
                {message.length}/{maxMessage}
              </span>
            </div>
          </label>

          {submitError ? <p className="contact-us-form__error">{submitError}</p> : null}

          <button
            type="submit"
            className="book-slot-btn py-2 book-slot-btn--primary rounded-pill w-100"
            disabled={submitting}
          >
            {submitting ? 'Sending…' : 'Submit'}
          </button>

          <p className="contact-us-form__legal">
            By contacting us, you agree to our{' '}
            <a href="#terms">Terms of service</a> and <a href="#privacy">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </>
  )
}
