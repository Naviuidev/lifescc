import { useEffect, useId, useState } from 'react'
import mainLogo from '../assets/main-logo1.png'
import { LIFESCC_BRANCHES } from '../constants/branches.js'
import './BookSlotModal.css'

function SuccessTick() {
  return (
    <svg className="book-slot-tick" viewBox="0 0 52 52" width="48" height="48" aria-hidden>
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

export default function SupportModal({ open, onClose }) {
  const titleId = useId()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [branchId, setBranchId] = useState(LIFESCC_BRANCHES[0]?.id ?? '')
  const [query, setQuery] = useState('')
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

  useEffect(() => {
    if (!open) {
      setFullName('')
      setEmail('')
      setMobile('')
      setBranchId(LIFESCC_BRANCHES[0]?.id ?? '')
      setQuery('')
      setError(null)
      setSuccess(false)
    }
  }, [open])

  const reset = () => {
    setFullName('')
    setEmail('')
    setMobile('')
    setBranchId(LIFESCC_BRANCHES[0]?.id ?? '')
    setQuery('')
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
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email,
          mobile,
          branch_id: branchId,
          query,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not send request')
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
      <button type="button" className="book-slot-modal-backdrop" aria-label="Close" onClick={handleClose} />
      <div
        className="book-slot-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="book-slot-modal-head">
          <img id={titleId} src={mainLogo} alt="Lifescc" className="book-slot-modal-logo" />
          <button
            type="button"
            className="book-slot-modal-close"
            onClick={handleClose}
            aria-label="Close support form"
          >
            ×
          </button>
        </div>

        {success ? (
          <div className="book-slot-modal-success">
            <div className="book-slot-success-row">
              <SuccessTick />
              <p className="book-slot-success-text">
                Thank you — we&apos;ve received your support request and will get back to you soon.
              </p>
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
                  <span>Which branch is your issue related to?</span>
                  <select name="branch_id" required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                    {LIFESCC_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="col-12">
                <label className="book-slot-field">
                  <span>Describe your issue</span>
                  <textarea
                    name="query"
                    required
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tell us what you need help with…"
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
                  {submitting ? 'Sending…' : 'Submit request'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
