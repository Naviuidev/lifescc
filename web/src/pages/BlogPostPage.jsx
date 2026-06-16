import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import {
  estimateReadMinutes,
  excerptFromBlog,
  formatBlogDate,
  formatBlogDateLong,
  parseAnalyticsFieldKeysJson,
  publicAssetUrl,
} from '../utils/blogPublic.js'
import '../components/BookSlotModal.css'
import './BlogPostPage.css'

const DISPLAY_AUTHOR = 'Lifescc'

const FIELD_LABELS = {
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Email',
  mobile: 'Mobile number',
  message: 'Message',
}

const INTENT_OPTIONS = [
  { value: '', label: 'Choose…' },
  { value: 'General inquiry', label: 'General inquiry' },
  { value: 'Book a consultation', label: 'Book a consultation' },
  { value: 'Partnership', label: 'Partnership' },
  { value: 'Press / media', label: 'Press / media' },
  { value: 'Other', label: 'Other' },
]

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="blog-post-meta__icon">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="blog-post-meta__icon">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

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

function renderBlocks(blocks) {
  if (!Array.isArray(blocks)) return null
  return blocks.map((block, i) => {
    const key = `b-${i}`
    const cols = Math.min(12, Math.max(1, Number(block.cols) || 12))
    const style = { gridColumn: `span ${cols}` }
    switch (block.type) {
      case 'heading':
        return (
          <div key={key} className="blog-post__block" style={style}>
            <h2 className="blog-post__h">{block.text || ''}</h2>
          </div>
        )
      case 'paragraph':
        return (
          <div key={key} className="blog-post__block" style={style}>
            <p className="blog-post__p">{block.text || ''}</p>
          </div>
        )
      case 'heading_paragraph':
        return (
          <div key={key} className="blog-post__block" style={style}>
            <h3 className="blog-post__h3">{block.heading || ''}</h3>
            <p className="blog-post__p">{block.text || ''}</p>
          </div>
        )
      case 'image':
        return (
          <div key={key} className="blog-post__block blog-post__block--img" style={style}>
            {block.src ? (
              <img src={publicAssetUrl(block.src)} alt={block.alt || ''} className="blog-post__img" />
            ) : null}
          </div>
        )
      default:
        return null
    }
  })
}

export default function BlogPostPage() {
  const { slug: slugParam } = useParams()
  const slug = slugParam ? decodeURIComponent(slugParam) : ''
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [leadStatus, setLeadStatus] = useState('idle')
  const [leadError, setLeadError] = useState(null)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const leadSuccessTitleId = useId()
  const [leadForm, setLeadForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    message: '',
  })
  const [leadIntent, setLeadIntent] = useState('')

  const load = useCallback(async () => {
    if (!slug) {
      setError('Invalid link')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/blogs/slug/${encodeURIComponent(slug)}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Article not found')
        setBlog(null)
        return
      }
      setBlog(data.blog ?? null)
    } catch {
      setError('Network error')
      setBlog(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!successModalOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setSuccessModalOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [successModalOpen])

  useEffect(() => {
    if (successModalOpen) {
      document.body.classList.add('book-slot-modal-open')
    } else {
      document.body.classList.remove('book-slot-modal-open')
    }
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [successModalOpen])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/blogs/public')
        const data = await res.json().catch(() => ({}))
        if (!res.ok || cancelled) return
        const list = Array.isArray(data.blogs) ? data.blogs : []
        setRecentBlogs(list)
      } catch {
        if (!cancelled) setRecentBlogs([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  let blocks = []
  try {
    blocks = JSON.parse(blog?.blocks_json || '[]')
    if (!Array.isArray(blocks)) blocks = []
  } catch {
    blocks = []
  }

  const heroTitle = (blog?.banner_headline || blog?.title || '').trim() || 'Blog'
  const heroSub = (blog?.banner_subtitle || excerptFromBlog(blog, 220) || '').trim()

  const analyticsOn =
    blog && (blog.analytics_enabled === 1 || blog.analytics_enabled === true || blog.analytics_enabled === '1')

  const fieldKeys = useMemo(() => {
    if (!blog || !analyticsOn) return []
    return parseAnalyticsFieldKeysJson(blog.analytics_field_keys_json)
  }, [blog, analyticsOn])

  const sidebarPosts = useMemo(() => {
    if (!blog?.id) return []
    return recentBlogs.filter((b) => b.id !== blog.id).slice(0, 5)
  }, [recentBlogs, blog])

  const kicker = useMemo(() => {
    const raw = (blog?.listing_summary || '').trim()
    if (!raw) return ''
    const line = raw.split(/\n/)[0].trim()
    if (line.length > 96) return `${line.slice(0, 93)}…`
    return line
  }, [blog])

  const updateLead = (key, value) => {
    setLeadForm((prev) => ({ ...prev, [key]: value }))
  }

  const submitLead = async (e) => {
    e.preventDefault()
    if (!slug || !analyticsOn) return
    setLeadStatus('sending')
    setLeadError(null)
    const body = {}
    for (const k of fieldKeys) {
      if (k === 'message') {
        let msg = leadForm.message ?? ''
        if (leadIntent.trim() && fieldKeys.includes('message')) {
          msg = `Topic: ${leadIntent.trim()}\n\n${msg}`.trim()
        }
        body.message = msg
      } else {
        body[k] = leadForm[k] ?? ''
      }
    }
    try {
      const res = await fetch(`/api/blogs/slug/${encodeURIComponent(slug)}/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLeadError(typeof data.error === 'string' ? data.error : 'Could not submit')
        setLeadStatus('idle')
        return
      }
      setLeadForm({ first_name: '', last_name: '', email: '', mobile: '', message: '' })
      setLeadIntent('')
      setLeadStatus('idle')
      setSuccessModalOpen(true)
    } catch {
      setLeadError('Network error')
      setLeadStatus('idle')
    }
  }

  return (
    <div className="blog-post-page">
      <Navbar />
      <main className="blog-post-page__main">
        {loading ? <p className="blog-post-page__muted blog-post-page__muted--padded">Loading…</p> : null}
        {error ? (
          <div className="blog-post-page__err-wrap container-narrow">
            <p className="text-danger">{error}</p>
            <Link to="/blog" className="btn btn-outline-secondary rounded-pill">
              ← All blogs
            </Link>
          </div>
        ) : null}
        {!loading && !error && blog ? (
          <>
            <header
              className="blog-post-hero"
              style={
                blog.cover_image
                  ? { backgroundImage: `url(${publicAssetUrl(blog.cover_image)})` }
                  : undefined
              }
            >
              <div className="blog-post-hero__overlay" />
              <div className="blog-post-hero__inner">
                <h1 className="blog-post-hero__title">{heroTitle}</h1>
                {heroSub ? <p className="blog-post-hero__sub">{heroSub}</p> : null}
              </div>
            </header>

            <div className="blog-post-body-outer">
              <div className="blog-post-body-grid container-blog-wide">
                <article className="blog-post-main">
                  <Link to="/blog" className="blog-post-back">
                    ← All blogs
                  </Link>

                  {kicker ? <p className="blog-post-kicker">{kicker}</p> : null}

                  <div className="blog-post-meta-row">
                    <span className="blog-post-meta-item">
                      <IconUser />
                      <span>{DISPLAY_AUTHOR}</span>
                    </span>
                    <span className="blog-post-meta-item">
                      <IconCalendar />
                      <time dateTime={String(blog.created_at)}>{formatBlogDateLong(blog.created_at)}</time>
                    </span>
                    <span className="blog-post-meta-item blog-post-meta-item--muted">
                      {estimateReadMinutes(blog)} min read
                    </span>
                  </div>

                  <h2 className="blog-post-article__title">{blog.title}</h2>

                  <div className="blog-post__grid">{renderBlocks(blocks)}</div>

                  {analyticsOn ? (
                    <section className="blog-post-lead" aria-labelledby="blog-lead-heading">
                      <div className="blog-post-lead__shell">
                        <h3 id="blog-lead-heading" className="blog-post-lead__title">
                          {String(blog.analytics_subject || '').trim() || 'Get in touch'}
                        </h3>
                        <form className="blog-post-lead__form" onSubmit={submitLead} noValidate>
                          <div className="blog-post-lead__fields-grid">
                            {fieldKeys.includes('first_name') ? (
                              <label className="blog-post-lead__field">
                                <span>{FIELD_LABELS.first_name}</span>
                                <input
                                  className="form-control"
                                  autoComplete="given-name"
                                  placeholder="First name"
                                  value={leadForm.first_name}
                                  onChange={(e) => updateLead('first_name', e.target.value)}
                                  required
                                />
                              </label>
                            ) : null}
                            {fieldKeys.includes('last_name') ? (
                              <label className="blog-post-lead__field">
                                <span>{FIELD_LABELS.last_name}</span>
                                <input
                                  className="form-control"
                                  autoComplete="family-name"
                                  placeholder="Last name"
                                  value={leadForm.last_name}
                                  onChange={(e) => updateLead('last_name', e.target.value)}
                                  required
                                />
                              </label>
                            ) : null}
                            {fieldKeys.includes('email') ? (
                              <label className="blog-post-lead__field">
                                <span>{FIELD_LABELS.email}</span>
                                <input
                                  type="email"
                                  className="form-control"
                                  autoComplete="email"
                                  placeholder="you@example.com"
                                  value={leadForm.email}
                                  onChange={(e) => updateLead('email', e.target.value)}
                                  required
                                />
                              </label>
                            ) : null}
                            {fieldKeys.includes('message') ? (
                              <label className="blog-post-lead__field">
                                <span>I want to</span>
                                <select
                                  className="form-select"
                                  value={leadIntent}
                                  onChange={(e) => setLeadIntent(e.target.value)}
                                  aria-required="false"
                                >
                                  {INTENT_OPTIONS.map((opt) => (
                                    <option key={opt.label} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ) : fieldKeys.includes('mobile') ? (
                              <label className="blog-post-lead__field">
                                <span>{FIELD_LABELS.mobile}</span>
                                <input
                                  type="tel"
                                  className="form-control"
                                  autoComplete="tel"
                                  placeholder="Mobile number"
                                  value={leadForm.mobile}
                                  onChange={(e) => updateLead('mobile', e.target.value)}
                                  required
                                />
                              </label>
                            ) : null}
                          </div>
                          {fieldKeys.includes('message') && fieldKeys.includes('mobile') ? (
                            <label className="blog-post-lead__field blog-post-lead__field--full">
                              <span>{FIELD_LABELS.mobile}</span>
                              <input
                                type="tel"
                                className="form-control"
                                autoComplete="tel"
                                placeholder="Mobile number"
                                value={leadForm.mobile}
                                onChange={(e) => updateLead('mobile', e.target.value)}
                                required
                              />
                            </label>
                          ) : null}
                          {fieldKeys.includes('message') ? (
                            <label className="blog-post-lead__field blog-post-lead__field--full">
                              <span>{FIELD_LABELS.message}</span>
                              <textarea
                                className="form-control"
                                rows={5}
                                placeholder="Your message…"
                                value={leadForm.message}
                                onChange={(e) => updateLead('message', e.target.value)}
                                required
                              />
                            </label>
                          ) : null}
                          {leadError ? (
                            <p className="text-danger small mb-0" role="alert">
                              {leadError}
                            </p>
                          ) : null}
                          <button type="submit" className="blog-post-lead__submit" disabled={leadStatus === 'sending'}>
                            {leadStatus === 'sending' ? 'Submitting…' : 'Submit'}
                          </button>
                        </form>
                      </div>
                    </section>
                  ) : null}
                </article>

                <aside className="blog-post-sidebar" aria-labelledby="recent-articles-heading">
                  <h3 id="recent-articles-heading" className="blog-post-sidebar__heading">
                    Recent articles
                  </h3>
                  {sidebarPosts.length === 0 ? (
                    <div className="blog-post-sidebar__empty">No other articles yet.</div>
                  ) : (
                    <ul className="blog-post-sidebar__list">
                      {sidebarPosts.map((p) => (
                        <li key={p.id}>
                          <Link to={`/blog/${encodeURIComponent(p.slug)}`} className="blog-post-sidebar__link">
                            {p.cover_image ? (
                              <span
                                className="blog-post-sidebar__thumb"
                                style={{ backgroundImage: `url(${publicAssetUrl(p.cover_image)})` }}
                              />
                            ) : (
                              <span className="blog-post-sidebar__thumb blog-post-sidebar__thumb--empty" />
                            )}
                            <span className="blog-post-sidebar__link-text">
                              <span className="blog-post-sidebar__link-title">{p.title}</span>
                              {p.created_at ? (
                                <time className="blog-post-sidebar__date" dateTime={String(p.created_at)}>
                                  {formatBlogDate(p.created_at)}
                                </time>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </aside>
              </div>
            </div>
          </>
        ) : null}
      </main>
      <SiteFooter />

      {successModalOpen ? (
        <div className="book-slot-modal-root" role="presentation">
          <button
            type="button"
            className="book-slot-modal-backdrop"
            aria-label="Close"
            onClick={() => setSuccessModalOpen(false)}
          />
          <div
            className="book-slot-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={leadSuccessTitleId}
          >
            <div className="book-slot-modal-head">
              <img id={leadSuccessTitleId} src={mainLogo} alt="Lifescc" className="book-slot-modal-logo" />
              <button
                type="button"
                className="book-slot-modal-close"
                onClick={() => setSuccessModalOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="book-slot-modal-success">
              <div className="book-slot-success-row">
                <SuccessTick />
                <p className="book-slot-success-text">Thank you — we received your details.</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
