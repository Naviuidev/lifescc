import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import ReviewSuccessModal from '../components/ReviewSuccessModal.jsx'
import { BOOKING_SERVICES, BOOKING_SERVICE_GROUPS } from '../constants/services.js'
import './HomePage.css'
import './ContactUsPage.css'
import './ReviewPage.css'

const MAX_REVIEW_WORDS = 20

/** Word count — non-whitespace tokens (aligned with server `preg_match_all('/\S+/u')`). */
function countWords(s) {
  const m = String(s ?? '').match(/\S+/g)
  return m ? m.length : 0
}

/**
 * Cap at `max` words. While under the limit, keep the string exactly as typed
 * (including trailing spaces so users can type the next word).
 * Beyond the limit, join with single spaces.
 */
function clampToWordLimit(s, max) {
  const str = String(s ?? '')
  const words = str.match(/\S+/g) ?? []
  if (words.length <= max) return str
  return words.slice(0, max).join(' ')
}

function StarRatingInput({ id, value, onChange }) {
  return (
    <div className="review-portal__stars" role="group" aria-labelledby={id}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`review-portal__star${n <= value ? ' review-portal__star--on' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          aria-pressed={n <= value}
        >
          <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden>
            <path
              fill="currentColor"
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewPage() {
  const navigate = useNavigate()
  const ratingLabelId = useId()
  const fileInputRef = useRef(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [treatment, setTreatment] = useState(BOOKING_SERVICES[0]?.value ?? '')
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [profileFile, setProfileFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [successOpen, setSuccessOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onFileChange = (e) => {
    const f = e.target.files?.[0]
    setProfileFile(f ?? null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (f) {
      setPreviewUrl(URL.createObjectURL(f))
    }
  }

  const reviewWordCount = countWords(reviewText)

  const canSubmit =
    name.trim() !== '' &&
    email.trim() !== '' &&
    treatment !== '' &&
    reviewWordCount >= 1 &&
    reviewWordCount <= MAX_REVIEW_WORDS &&
    rating >= 1 &&
    rating <= 5

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('customer_name', name.trim())
      fd.append('email', email.trim())
      fd.append('treatment', treatment)
      fd.append('review_text', clampToWordLimit(reviewText, MAX_REVIEW_WORDS))
      fd.append('rating', String(rating))
      if (profileFile) {
        fd.append('profile_image', profileFile)
      }
      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not submit review')
        return
      }
      setSuccessOpen(true)
    } catch {
      setError('Network error. Is the API running?')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSuccessClose = () => {
    setSuccessOpen(false)
    navigate('/')
  }

  return (
    <div className="home-page">
      <Navbar />
      <ReviewSuccessModal open={successOpen} onClose={handleSuccessClose} />
      <div className="contact-us-page-wrap">
        <main className="page-main contact-us-page">
          <div className="contact-us-page__shell">
            <section className="review-page__hero" aria-labelledby="review-hero-heading">
              <h1 id="review-hero-heading" className="contact-us-page__title">
                Reviews
              </h1>
              <p className="contact-us-page__intro review-page__hero-intro">
                Share your experience with Lifescc — your feedback helps us and future clients.
              </p>
            </section>

            <div className="review-page__form-wrap">
              <form className="review-portal__card" onSubmit={handleSubmit} noValidate>
                <div className="review-portal__field">
                  <label className="review-portal__label" id={ratingLabelId}>
                    Rate your experience <span className="review-portal__req">*</span>
                  </label>
                  <StarRatingInput id={ratingLabelId} value={rating} onChange={setRating} />
                </div>

                <div className="review-portal__field">
                  <span className="review-portal__label">Profile photo (optional)</span>
                  <div className="review-portal__upload">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="review-portal__file-input"
                      onChange={onFileChange}
                      aria-label="Upload profile photo"
                    />
                    <button
                      type="button"
                      className="review-portal__upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="" className="review-portal__preview" />
                      ) : (
                        <>
                          <span className="review-portal__upload-icon" aria-hidden>
                            +
                          </span>
                          <span className="review-portal__upload-hint">
                            Click or drag an image (JPG, PNG, WebP — max 2MB)
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="review-portal__field">
                  <label className="review-portal__label" htmlFor="review-name">
                    Name <span className="review-portal__req">*</span>
                  </label>
                  <input
                    id="review-name"
                    className="review-portal__input"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="review-portal__field">
                  <label className="review-portal__label" htmlFor="review-email">
                    Email <span className="review-portal__req">*</span>
                  </label>
                  <input
                    id="review-email"
                    className="review-portal__input"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="review-portal__field">
                  <label className="review-portal__label" htmlFor="review-treatment">
                    Treatment you received <span className="review-portal__req">*</span>
                  </label>
                  <select
                    id="review-treatment"
                    className="review-portal__input review-portal__select"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
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
                </div>

                <div className="review-portal__field">
                  <label className="review-portal__label" htmlFor="review-text">
                    Your review <span className="review-portal__req">*</span>
                    <span className="review-portal__label-hint"> (max {MAX_REVIEW_WORDS} words)</span>
                  </label>
                  <textarea
                    id="review-text"
                    className="review-portal__textarea"
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(clampToWordLimit(e.target.value, MAX_REVIEW_WORDS))}
                    placeholder="Tell others about your visit…"
                    required
                    aria-describedby="review-text-wordcount"
                  />
                  <p
                    id="review-text-wordcount"
                    className="review-portal__wordcount"
                    data-at-limit={reviewWordCount >= MAX_REVIEW_WORDS ? 'true' : undefined}
                  >
                    {reviewWordCount} / {MAX_REVIEW_WORDS} words
                  </p>
                </div>

                {error ? <p className="review-portal__error">{error}</p> : null}

                <button
                  type="submit"
                  className="review-portal__submit"
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit review'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
