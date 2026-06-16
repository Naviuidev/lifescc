import { useEffect, useId } from 'react'
import mainLogo from '../assets/main-logo1.png'
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

/** Same pattern as slot/contact success; closing returns to home. */
export default function ReviewSuccessModal({ open, onClose }) {
  const titleId = useId()

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

  if (!open) return null

  return (
    <div className="book-slot-modal-root" role="presentation">
      <button type="button" className="book-slot-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className="book-slot-modal-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="book-slot-modal-head">
          <img id={titleId} src={mainLogo} alt="Lifescc" className="book-slot-modal-logo" />
          <button type="button" className="book-slot-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="book-slot-modal-success">
          <div className="book-slot-success-row">
            <SuccessTick />
            <p className="book-slot-success-text">
              Thanks for your feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
