import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import ContactSuccessModal from '../components/ContactSuccessModal.jsx'
import { LIFESCC_BRANCHES } from '../constants/branches.js'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'

const TREATMENTS = [
  { value: 'weight_loss', label: 'Weight loss' },
  { value: 'skin', label: 'Skin' },
  { value: 'hair', label: 'Hair' },
]

export default function BookAppointmentPage() {
  const formId = useId()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [locationId, setLocationId] = useState('')
  const [treatment, setTreatment] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successEmailWarning, setSuccessEmailWarning] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const isWeightLoss = treatment === 'weight_loss'
      const isSkin = treatment === 'skin'
      const res = await fetch(
        isWeightLoss ? '/api/weight-loss' : isSkin ? '/api/skin-details' : '/api/details-slot',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isWeightLoss
              ? {
                  full_name: fullName.trim(),
                  phone: phone.trim(),
                  location_id: locationId,
                  message: message.trim(),
                  source_page: 'book_an_appointment',
                }
              : isSkin
                ? {
                    full_name: fullName.trim(),
                    phone: phone.trim(),
                    location_id: locationId,
                    message: message.trim(),
                    source_page: 'book_an_appointment',
                    service_label: 'Skin',
                  }
                : {
                    full_name: fullName.trim(),
                    phone: phone.trim(),
                    location_id: locationId,
                    treatment,
                    message: message.trim(),
                    source_page: 'book_an_appointment',
                  },
          ),
        },
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(typeof data.error === 'string' ? data.error : 'Could not submit')
        return
      }
      setFullName('')
      setPhone('')
      setLocationId('')
      setTreatment('')
      setMessage('')
      setSuccessEmailWarning(
        data.email_sent === false && data.message ? String(data.message) : null,
      )
      setSuccessOpen(true)
    } catch {
      setSubmitError('Network error. Is the API running?')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="home-page">
      <Navbar />
      <ContactSuccessModal
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false)
          setSuccessEmailWarning(null)
        }}
        emailWarning={successEmailWarning}
      />
      <div className="contact-us-page-wrap contact-us-page-wrap--book">
        <main className="page-main contact-us-page book-appointment-page">
          <div className="book-appointment-page__shell">
            <div className="book-appointment-page__split">
              <div className="book-appointment-page__col book-appointment-page__col--form">
                <div className="book-appointment-page__form-inner">
                  <div className="contact-us-page__card book-appointment-page__form-card">
                    <header className="contact-us-page__card-head">
                      <h1
                        id={`${formId}-heading`}
                        className="contact-us-page__card-title book-appointment-page__form-title"
                      >
                        Book a consultation and get a free body checkup
                      </h1>
                      <p className="contact-us-page__card-sub">
                        Tell us how we can help — we’ll get back to you shortly.
                      </p>
                    </header>
                    <form className="contact-us-form" onSubmit={handleSubmit} noValidate>
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
                            value={treatment}
                            onChange={(e) => setTreatment(e.target.value)}
                            required
                            aria-label="Select treatment"
                          >
                            <option value="" disabled>
                              Select treatment
                            </option>
                            {TREATMENTS.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
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
              <div className="book-appointment-page__col book-appointment-page__col--visual">
                <div className="book-appointment-page__photo" aria-hidden="true" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
