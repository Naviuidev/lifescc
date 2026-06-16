import { useCallback, useEffect, useState } from 'react'
import ContactUsFormCard from './ContactUsFormCard.jsx'
import { withAppBase } from '../utils/appBase.js'

const AUTO_MS = 3000

function Stars({ n }) {
  const v = Math.min(5, Math.max(0, Number(n) || 0))
  return (
    <div className="happy-clients__stars" role="img" aria-label={`${v} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= v ? 'happy-clients__star happy-clients__star--on' : 'happy-clients__star'}>
          ★
        </span>
      ))}
    </div>
  )
}

function avatarSrc(profilePath) {
  if (!profilePath) return null
  return profilePath.startsWith('http') ? profilePath : withAppBase(`/${String(profilePath).replace(/^\//, '')}`)
}

function ArrowPrev({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 18l-6-6 6-6"
      />
    </svg>
  )
}

function ArrowNext({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18l6-6-6-6"
      />
    </svg>
  )
}

export default function HappyClients() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [autoPlayKey, setAutoPlayKey] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/reviews/public')
        const data = await res.json().catch(() => ({}))
        if (!cancelled && res.ok && Array.isArray(data.reviews)) {
          setReviews(data.reviews)
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const n = reviews.length
  const canSlide = n > 1

  const goNext = useCallback(() => {
    if (!canSlide) return
    setIndex((i) => (i + 1) % n)
    setAutoPlayKey((k) => k + 1)
  }, [canSlide, n])

  const goPrev = useCallback(() => {
    if (!canSlide) return
    setIndex((i) => (i - 1 + n) % n)
    setAutoPlayKey((k) => k + 1)
  }, [canSlide, n])

  useEffect(() => {
    if (!canSlide || reduceMotion) return undefined
    const id = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(id)
  }, [canSlide, reduceMotion, goNext, autoPlayKey])

  useEffect(() => {
    setIndex((i) => (n > 0 ? Math.min(i, n - 1) : 0))
  }, [n])

  if (!loading && reviews.length === 0) return null

  return (
    <section className="happy-clients" aria-labelledby="happy-clients-heading">
      <div className="happy-clients__inner">
        {loading ? (
          <p className="happy-clients__loading">Loading…</p>
        ) : (
          <div className="happy-clients__layout">
            <div className="happy-clients__form-col">
              <ContactUsFormCard className="happy-clients__form-card" />
            </div>

            <div
              className="happy-clients__slider-wrap"
              aria-roledescription="carousel"
              aria-label="Client testimonials"
            >
              <header className="happy-clients__head">
                <div className="happy-clients__head-row">
                  <div className="happy-clients__head-text">
                    <h2 id="happy-clients-heading" className="happy-clients__title">
                      From our community
                    </h2>
                    <p className="happy-clients__lead">
                      Here’s what clients say about Lifescc — real feedback from people who’ve visited us.
                    </p>
                  </div>
                  {canSlide ? (
                    <div className="happy-clients__nav" role="group" aria-label="Testimonial navigation">
                      <button
                        type="button"
                        className="happy-clients__nav-btn"
                        onClick={goPrev}
                        aria-label="Previous testimonial"
                      >
                        <ArrowPrev className="happy-clients__nav-icon" />
                      </button>
                      <button
                        type="button"
                        className="happy-clients__nav-btn"
                        onClick={goNext}
                        aria-label="Next testimonial"
                      >
                        <ArrowNext className="happy-clients__nav-icon" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </header>

              <div className="happy-clients__viewport">
                <div
                  className={`happy-clients__track${reduceMotion ? ' happy-clients__track--no-motion' : ''}`}
                  style={{ '--idx': index }}
                >
                  {reviews.map((r, slideIndex) => {
                    const img = avatarSrc(r.profile_image)
                    const initial = String(r.customer_name ?? '?').trim().charAt(0).toUpperCase() || '?'
                    return (
                      <article
                        key={r.id}
                        className="happy-clients__slide"
                        aria-hidden={slideIndex !== index}
                      >
                        <blockquote className="happy-clients__quote">{r.review_text ?? ''}</blockquote>
                        <div className="happy-clients__meta">
                          {img ? (
                            <img src={img} alt="" className="happy-clients__avatar" width={56} height={56} />
                          ) : (
                            <div className="happy-clients__avatar happy-clients__avatar--placeholder" aria-hidden>
                              {initial}
                            </div>
                          )}
                          <div className="happy-clients__meta-body">
                            <p className="happy-clients__name">{r.customer_name ?? 'Customer'}</p>
                            {r.treatment ? <p className="happy-clients__service">{r.treatment}</p> : null}
                            <Stars n={r.rating} />
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              {canSlide ? (
                <div className="happy-clients__dots" aria-hidden>
                  {reviews.map((r, i) => (
                    <span
                      key={r.id}
                      className={`happy-clients__dot${i === index ? ' happy-clients__dot--active' : ''}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
