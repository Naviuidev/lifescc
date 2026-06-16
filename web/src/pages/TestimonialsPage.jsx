import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { withAppBase } from '../utils/appBase.js'
import './ContactUsPage.css'
import './TestimonialsPage.css'

function profileSrc(path) {
  if (!path) return null
  return path.startsWith('http') ? path : withAppBase(`/${String(path).replace(/^\//, '')}`)
}

function StarIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  )
}

function formatVideoDate(iso) {
  if (!iso) return ''
  const d = new Date(String(iso).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function VideosTab() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/testimonial-videos')
        const data = await res.json().catch(() => ({}))
        if (!cancelled && res.ok && Array.isArray(data.videos)) {
          setVideos(data.videos)
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

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return videos
    return videos.filter((v) => String(v.title ?? '').toLowerCase().includes(t))
  }, [videos, q])

  if (loading) {
    return <p className="testimonials-reviews__loading">Loading videos…</p>
  }

  return (
    <div className="testimonials-videos">
      <div className="testimonials-videos__search-wrap">
        <div className="testimonials-videos__search-inner">
          <span className="testimonials-videos__search-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            className="testimonials-videos__search-input"
            placeholder="Search videos"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search videos"
          />
        </div>
      </div>

      {videos.length === 0 ? (
        <p className="testimonials-videos__empty">No videos have been published yet. Check back soon.</p>
      ) : filtered.length === 0 ? (
        <p className="testimonials-videos__empty">No videos match your search.</p>
      ) : (
        <ul className="testimonials-videos__grid">
          {filtered.map((v) => (
            <li key={v.id}>
              <article className="testimonials-videos__card">
                <div className="testimonials-videos__thumb testimonials-videos__thumb--embed">
                  <iframe
                    title={String(v.title ?? 'Video')}
                    src={String(v.embed_src ?? '')}
                    className="testimonials-videos__iframe"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="testimonials-videos__meta">
                  <p className="testimonials-videos__title">{v.title ?? 'Video'}</p>
                  {formatVideoDate(v.created_at) ? (
                    <p className="testimonials-videos__stats">Added {formatVideoDate(v.created_at)}</p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ReviewsTab() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p className="testimonials-reviews__loading">Loading reviews…</p>
  }

  if (reviews.length === 0) {
    return (
      <div className="testimonials-reviews__empty">
        <p>No testimonials yet. Be the first to share your story.</p>
        <Link to="/reviews" className="testimonials-reviews__cta">
          Write a review
        </Link>
      </div>
    )
  }

  return (
    <ul className="testimonials-reviews__grid">
      {reviews.map((r) => {
        const img = profileSrc(r.profile_image)
        const initial = String(r.customer_name ?? '?').trim().charAt(0).toUpperCase() || '?'
        const ratingNum = Math.min(5, Math.max(0, Number(r.rating) || 0))
        const ratingLabel = `${ratingNum.toFixed(1)}`
        const txt = String(r.review_text ?? '')
        return (
          <li key={r.id}>
            <article className="testimonials-card">
              <div className="testimonials-card__top">
                <div className="testimonials-card__brand">
                  {img ? (
                    <img src={img} alt="" className="testimonials-card__avatar" width={44} height={44} />
                  ) : (
                    <div className="testimonials-card__avatar testimonials-card__avatar--ph" aria-hidden>
                      {initial}
                    </div>
                  )}
                </div>
                <div className="testimonials-card__rating-block">
                  <span className="testimonials-card__rating-num">{ratingLabel}</span>
                  <StarIcon className="testimonials-card__rating-star" />
                </div>
              </div>
              <blockquote className="testimonials-card__quote">“{txt}”</blockquote>
              <footer className="testimonials-card__footer">
                <p className="testimonials-card__name">{r.customer_name ?? 'Customer'}</p>
                {r.treatment ? <p className="testimonials-card__sub">{r.treatment}</p> : null}
              </footer>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

export default function TestimonialsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab = tabParam === 'videos' ? 'videos' : 'reviews'

  const setTab = (next) => {
    if (next === 'videos') setSearchParams({ tab: 'videos' })
    else setSearchParams({})
  }

  return (
    <div className="home-page">
      <Navbar />
      <div className="contact-us-page-wrap">
        <main className="page-main contact-us-page testimonials-page">
          <div className="contact-us-page__shell testimonials-page__shell">
            <header className="testimonials-page__header">
              <h1 className="testimonials-page__title">
                Our trusted <span className="testimonials-page__title-badge">Clients</span>
              </h1>
              <p className="testimonials-page__lead">
                Our mission is to help you feel confident and cared for — by sharing real stories from people who’ve
                chosen Lifescc for their wellness journey.
              </p>
            </header>

            <div className="testimonials-page__tabs" role="tablist" aria-label="Testimonials content">
              <button
                type="button"
                role="tab"
                id="tab-reviews"
                aria-selected={tab === 'reviews'}
                aria-controls="panel-reviews"
                className={`testimonials-page__tab${tab === 'reviews' ? ' is-active' : ''}`}
                onClick={() => setTab('reviews')}
              >
                Reviews
              </button>
              <button
                type="button"
                role="tab"
                id="tab-videos"
                aria-selected={tab === 'videos'}
                aria-controls="panel-videos"
                className={`testimonials-page__tab${tab === 'videos' ? ' is-active' : ''}`}
                onClick={() => setTab('videos')}
              >
                Videos
              </button>
            </div>

            <div
              id="panel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              hidden={tab !== 'reviews'}
              className="testimonials-page__panel"
            >
              <ReviewsTab />
            </div>

            <div
              id="panel-videos"
              role="tabpanel"
              aria-labelledby="tab-videos"
              hidden={tab !== 'videos'}
              className="testimonials-page__panel testimonials-page__panel--videos"
            >
              <VideosTab />
            </div>
          </div>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}
