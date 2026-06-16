import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useParams } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import AdminBlogToolbar from '../components/AdminBlogToolbar.jsx'
import { BLOG_ANALYTICS_BADGE_OPTIONS, BLOG_ANALYTICS_FIELD_BADGES } from '../constants/blogAnalytics.js'
import { publicAssetUrl } from '../utils/blogPublic.js'
import '../components/BookSlotModal.css'
import '../components/AdminBlogToolbar.css'
import './AdminSlotsPage.css'
import './AdminBlogEditorPage.css'

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `b-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function blocksForApi(blocks) {
  return blocks.map(({ id: _id, ...rest }) => rest)
}

/** Public URL for stored path or absolute URL */
function publicImageUrl(src) {
  return publicAssetUrl(src)
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

function emptyBlock(type) {
  const cols = 12
  switch (type) {
    case 'heading':
      return { id: uid(), type: 'heading', cols, text: '' }
    case 'paragraph':
      return { id: uid(), type: 'paragraph', cols, text: '' }
    case 'heading_paragraph':
      return { id: uid(), type: 'heading_paragraph', cols, heading: '', text: '' }
    case 'image':
      return { id: uid(), type: 'image', cols, src: '', alt: '' }
    default:
      return { id: uid(), type: 'paragraph', cols, text: '' }
  }
}

export default function AdminBlogEditorPage() {
  const { id: routeId } = useParams()
  const navigate = useNavigate()
  const isEdit = routeId != null && /^\d+$/.test(String(routeId))
  const editId = isEdit ? routeId : null

  const [loading, setLoading] = useState(isEdit)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [title, setTitle] = useState('')
  const [bannerHeadline, setBannerHeadline] = useState('')
  const [bannerSubtitle, setBannerSubtitle] = useState('')
  const [bannerButtonLabel, setBannerButtonLabel] = useState('')
  const [bannerButtonLink, setBannerButtonLink] = useState('')
  const [listingSummary, setListingSummary] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null)
  const [existingCoverPath, setExistingCoverPath] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [status, setStatus] = useState('published')
  const [uploadingBlockId, setUploadingBlockId] = useState(null)

  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  /** True after user completes the analytics popup (local draft); server save happens on Post blog. */
  const [analyticsDraftReady, setAnalyticsDraftReady] = useState(false)
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false)
  const [finalSuccessOpen, setFinalSuccessOpen] = useState(false)
  const [finalSuccessHadAnalytics, setFinalSuccessHadAnalytics] = useState(false)
  /** Tracking badges (Page views, Lead capture, …) */
  const [afBadges, setAfBadges] = useState([])
  /** Field keys to collect on the public form (first_name, email, …) */
  const [afFieldKeys, setAfFieldKeys] = useState([])
  const [analyticsModalError, setAnalyticsModalError] = useState(null)

  const analyticsDialogTitleId = useId()
  const finalSuccessTitleId = useId()

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null)
      return
    }
    const u = URL.createObjectURL(coverFile)
    setCoverPreviewUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [coverFile])

  const load = useCallback(async () => {
    if (!isEdit) return
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch(`/api/blogs/${editId}`)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError(typeof data.error === 'string' ? data.error : 'Failed to load')
        return
      }
      const b = data.blog
      if (!b) {
        setLoadError('Not found')
        return
      }
      setTitle(b.title ?? '')
      setBannerHeadline(b.banner_headline ?? '')
      setBannerSubtitle(b.banner_subtitle ?? '')
      setBannerButtonLabel(b.banner_button_label ?? '')
      setBannerButtonLink(b.banner_button_link ?? '')
      setListingSummary(b.listing_summary ?? '')
      setExistingCoverPath(b.cover_image ?? null)
      setStatus(b.status ?? 'published')
      let parsed = []
      try {
        parsed = JSON.parse(b.blocks_json || '[]')
      } catch {
        parsed = []
      }
      if (!Array.isArray(parsed)) parsed = []
      setBlocks(parsed.map((x) => ({ ...x, id: uid() })))

      const enabled = b.analytics_enabled === 1 || b.analytics_enabled === true || b.analytics_enabled === '1'
      setAnalyticsEnabled(enabled)
      setAnalyticsDraftReady(enabled)
      let badgeList = []
      try {
        const pj = JSON.parse(b.analytics_badges_json || '[]')
        if (Array.isArray(pj)) {
          badgeList = pj.filter((x) => typeof x === 'string')
        }
      } catch {
        badgeList = []
      }
      setAfBadges(badgeList)
      let fieldKeys = []
      try {
        const fk = JSON.parse(b.analytics_field_keys_json || '[]')
        if (Array.isArray(fk)) {
          fieldKeys = fk.filter((x) => typeof x === 'string')
        }
      } catch {
        fieldKeys = []
      }
      setAfFieldKeys(fieldKeys)
    } catch {
      setLoadError('Network error')
    } finally {
      setLoading(false)
    }
  }, [isEdit, editId])

  useEffect(() => {
    load()
  }, [load])

  const addBlock = (type) => {
    setBlocks((prev) => [...prev, emptyBlock(type)])
  }

  const removeBlock = (blockId) => {
    setBlocks((prev) => prev.filter((x) => x.id !== blockId))
  }

  const moveBlock = (index, dir) => {
    setBlocks((prev) => {
      const next = [...prev]
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }

  const patchBlock = (blockId, patch) => {
    setBlocks((prev) => prev.map((x) => (x.id === blockId ? { ...x, ...patch } : x)))
  }

  const uploadBlockImage = async (blockId, file) => {
    if (!file) return
    setSaveError(null)
    setUploadingBlockId(blockId)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/blog-images', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed')
      }
      const path = typeof data.path === 'string' ? data.path : ''
      if (!path) throw new Error('Invalid response')
      patchBlock(blockId, { src: path })
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Image upload failed')
    } finally {
      setUploadingBlockId(null)
    }
  }

  const heroBgUrl = useMemo(() => {
    if (coverPreviewUrl) return coverPreviewUrl
    if (existingCoverPath) return publicImageUrl(existingCoverPath)
    return null
  }, [coverPreviewUrl, existingCoverPath])

  const heroPreviewTitle = useMemo(() => {
    return (bannerHeadline || title || 'Blog title').trim() || 'Blog title'
  }, [bannerHeadline, title])

  const heroPreviewSub = useMemo(() => {
    const t = (bannerSubtitle || listingSummary || '').trim()
    return t || 'Hero subtitle appears here when you fill Banner subtitle or Listing summary.'
  }, [bannerSubtitle, listingSummary])

  const handleAnalyticsToggle = useCallback((checked) => {
    setAnalyticsEnabled(checked)
    setAnalyticsModalError(null)
    if (checked) {
      setAnalyticsDraftReady(false)
      setAnalyticsModalOpen(true)
    } else {
      setAnalyticsModalOpen(false)
      setAnalyticsDraftReady(false)
      setAfBadges([])
      setAfFieldKeys([])
    }
  }, [])

  const closeAnalyticsModal = useCallback(() => {
    setAnalyticsModalError(null)
    if (analyticsDraftReady) {
      setAnalyticsModalOpen(false)
    } else {
      handleAnalyticsToggle(false)
    }
  }, [analyticsDraftReady, handleAnalyticsToggle])

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaveError(null)
    if (analyticsEnabled && !analyticsDraftReady) {
      setSaveError('Turn on analytics and select tracking + form field badges in the integration window.')
      setAnalyticsModalOpen(true)
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      fd.append('banner_headline', bannerHeadline)
      fd.append('banner_subtitle', bannerSubtitle)
      fd.append('banner_button_label', bannerButtonLabel)
      fd.append('banner_button_link', bannerButtonLink)
      fd.append('listing_summary', listingSummary)
      fd.append('blocks_json', JSON.stringify(blocksForApi(blocks)))
      fd.append('status', status)
      if (coverFile) {
        fd.append('cover_image', coverFile)
      }
      if (isEdit) {
        fd.append('id', String(editId))
      }

      const res = await fetch('/api/blogs', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSaveError(typeof data.error === 'string' ? data.error : 'Save failed')
        return
      }
      const blog = data.blog
      const newId = blog && blog.id != null ? Number(blog.id) : null
      if (!newId || Number.isNaN(newId)) {
        setSaveError('Save succeeded but response was invalid')
        return
      }

      if (analyticsEnabled && analyticsDraftReady) {
        try {
          const ar = await fetch(`/api/blogs/${newId}/analytics`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: title.trim().slice(0, 500),
              badges: afBadges,
              field_keys: afFieldKeys,
            }),
          })
          const ad = await ar.json().catch(() => ({}))
          if (!ar.ok) {
            setSaveError(typeof ad.error === 'string' ? ad.error : 'Blog saved but analytics failed to save')
            return
          }
        } catch {
          setSaveError('Blog saved but analytics request failed')
          return
        }
      }

      setFinalSuccessHadAnalytics(analyticsEnabled && analyticsDraftReady)
      setFinalSuccessOpen(true)
    } catch {
      setSaveError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const toggleAfBadge = (label) => {
    setAfBadges((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]))
  }

  const toggleAfFieldKey = (key) => {
    setAfFieldKeys((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]))
  }

  const saveAnalyticsDraftAndClose = (e) => {
    e.preventDefault()
    setAnalyticsModalError(null)
    if (afBadges.length === 0) {
      setAnalyticsModalError('Select at least one tracking badge.')
      return
    }
    if (afFieldKeys.length === 0) {
      setAnalyticsModalError('Select at least one form field to collect on the public page.')
      return
    }
    setAnalyticsDraftReady(true)
    setAnalyticsModalOpen(false)
  }

  const onFinalSuccessClose = () => {
    setFinalSuccessOpen(false)
    navigate('/admin/blogs', { replace: true })
  }

  const modalOpen = finalSuccessOpen || analyticsModalOpen
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('book-slot-modal-open')
    } else {
      document.body.classList.remove('book-slot-modal-open')
    }
    return () => document.body.classList.remove('book-slot-modal-open')
  }, [modalOpen])

  useEffect(() => {
    if (!analyticsModalOpen) return
    const onKey = (ev) => {
      if (ev.key === 'Escape' && !saving) {
        closeAnalyticsModal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [analyticsModalOpen, saving, closeAnalyticsModal])

  if (loading) {
    return (
      <div className="admin-blog-editor">
        <div className="admin-slots__toolbar admin-blog-page__toolbar-top admin-blog-editor__toolbar-nav">
          <AdminBlogToolbar active={isEdit ? 'editor' : 'new'} />
        </div>
        <p className="admin-blog-editor__loading">Loading…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="admin-blog-editor">
        <div className="admin-slots__toolbar admin-blog-page__toolbar-top admin-blog-editor__toolbar-nav">
          <AdminBlogToolbar active={isEdit ? 'editor' : 'new'} />
        </div>
        <p className="admin-blog-editor__err">{loadError}</p>
        <Link to="/admin/blogs" className="btn btn-outline-secondary btn-sm">
          Back to blogs
        </Link>
      </div>
    )
  }

  return (
    <>
    <div className="admin-blog-editor">
      <header className="admin-blog-editor__head">
        <div>
          <h1 className="admin-blog-editor__title">{isEdit ? 'Edit blog post' : 'Create blog post'}</h1>
          <p className="admin-blog-editor__lead">
            <Link to="/admin/blogs">← All blogs</Link>
          </p>
        </div>
        <div className="admin-slots__toolbar admin-blog-page__toolbar-top admin-blog-editor__toolbar-nav">
          <AdminBlogToolbar active={isEdit ? 'editor' : 'new'} />
        </div>
      </header>

      <form className="admin-blog-editor__grid" onSubmit={onSubmit}>
        <div className="admin-blog-editor__form">
          {saveError ? <p className="admin-blog-editor__banner admin-blog-editor__banner--err">{saveError}</p> : null}

          <div className="admin-blog-editor__analytics-top">
            <div className="form-check form-switch admin-blog-editor__analytics-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="blog-analytics-switch"
                checked={analyticsEnabled}
                onChange={(e) => handleAnalyticsToggle(e.target.checked)}
              />
              <label className="form-check-label fw-semibold" htmlFor="blog-analytics-switch">
                Analytics form integration
              </label>
            </div>
            <p className="admin-blog-editor__hint mb-2">
              Turn on to choose tracking badges and which form fields the public page will collect—then add your title,
              content, and post.
            </p>
            {analyticsEnabled && !analyticsDraftReady ? (
              <p className="admin-blog-editor__analytics-reminder small text-secondary mb-0">
                Finish the badge selection in the integration window, then write your post.{' '}
                <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => setAnalyticsModalOpen(true)}>
                  Open integration form
                </button>
              </p>
            ) : null}
            {analyticsEnabled && analyticsDraftReady ? (
              <p className="small text-success mb-0">
                <span className="fw-semibold">Integration saved.</span> Add your title and content below, then use Post blog.{' '}
                <button type="button" className="btn btn-link btn-sm p-0 align-baseline" onClick={() => setAnalyticsModalOpen(true)}>
                  Edit integration
                </button>
              </p>
            ) : null}
          </div>

          <label className="admin-blog-editor__field">
            <span className="admin-blog-editor__label">Title</span>
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
              required
              autoComplete="off"
            />
          </label>

          <fieldset className="admin-blog-editor__fieldset">
            <legend className="admin-blog-editor__legend">Banner (hero) — optional</legend>
            <p className="admin-blog-editor__hint">Shown over the cover image on the public blog page.</p>
            <label className="admin-blog-editor__field">
              <span className="admin-blog-editor__label">Banner headline</span>
              <input
                className="form-control"
                value={bannerHeadline}
                onChange={(e) => setBannerHeadline(e.target.value)}
                placeholder="Banner headline (defaults to title if empty)"
              />
            </label>
            <label className="admin-blog-editor__field">
              <span className="admin-blog-editor__label">Banner subtitle</span>
              <textarea
                className="form-control"
                rows={2}
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
                placeholder="Banner subtitle"
              />
            </label>
            <div className="admin-blog-editor__row2">
              <label className="admin-blog-editor__field">
                <span className="admin-blog-editor__label">Button label (optional)</span>
                <input
                  className="form-control"
                  value={bannerButtonLabel}
                  onChange={(e) => setBannerButtonLabel(e.target.value)}
                  placeholder="Button label"
                />
              </label>
              <label className="admin-blog-editor__field">
                <span className="admin-blog-editor__label">Button link URL or path</span>
                <input
                  className="form-control"
                  value={bannerButtonLink}
                  onChange={(e) => setBannerButtonLink(e.target.value)}
                  placeholder="/contact-us or https://…"
                />
              </label>
            </div>
          </fieldset>

          <label className="admin-blog-editor__field">
            <span className="admin-blog-editor__label">Cover image (optional)</span>
            <input
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            />
            {(coverPreviewUrl || (existingCoverPath && !coverFile)) ? (
              <div className="admin-blog-editor__cover-thumb-wrap">
                <img
                  src={coverPreviewUrl || publicImageUrl(existingCoverPath)}
                  alt=""
                  className="admin-blog-editor__cover-thumb"
                />
              </div>
            ) : null}
            {existingCoverPath && !coverFile ? (
              <span className="admin-blog-editor__muted">Saved file: {existingCoverPath}</span>
            ) : null}
          </label>

          <label className="admin-blog-editor__field">
            <span className="admin-blog-editor__label">Listing summary (optional)</span>
            <textarea
              className="form-control"
              rows={3}
              value={listingSummary}
              onChange={(e) => setListingSummary(e.target.value)}
              placeholder="Short text for blog cards / search. If empty, text is taken from your blocks."
            />
          </label>

          <label className="admin-blog-editor__field admin-blog-editor__field--inline">
            <span className="admin-blog-editor__label">Status</span>
            <select className="form-select form-select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <div className="admin-blog-editor__blocks">
            <div className="admin-blog-editor__blocks-head">
              <span className="admin-blog-editor__label">Article blocks</span>
              <div className="admin-blog-editor__add-btns">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addBlock('heading')}>
                  + Heading
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addBlock('paragraph')}>
                  + Paragraph
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => addBlock('heading_paragraph')}
                >
                  + Heading + paragraph
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addBlock('image')}>
                  + Image
                </button>
              </div>
            </div>
            <p className="admin-blog-editor__hint">
              On desktop, blocks sit in a 12-column grid. Choose how many columns (of 12) each block uses — e.g. 6 = half
              width.
            </p>

            {blocks.map((block, index) => (
              <div key={block.id} className="admin-blog-editor__block">
                <div className="admin-blog-editor__block-top">
                  <span className="admin-blog-editor__block-type">{block.type.replace(/_/g, ' ')}</span>
                  <div className="admin-blog-editor__block-actions">
                    <label className="admin-blog-editor__cols">
                      Cols (of 12)
                      <select
                        className="form-select form-select-sm"
                        value={block.cols ?? 12}
                        onChange={(e) => patchBlock(block.id, { cols: Number(e.target.value) })}
                      >
                        {[12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => moveBlock(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => moveBlock(index, 1)}
                      disabled={index === blocks.length - 1}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => removeBlock(block.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                {block.type === 'heading' ? (
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Heading…"
                    value={block.text ?? ''}
                    onChange={(e) => patchBlock(block.id, { text: e.target.value })}
                  />
                ) : null}
                {block.type === 'paragraph' ? (
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Paragraph…"
                    value={block.text ?? ''}
                    onChange={(e) => patchBlock(block.id, { text: e.target.value })}
                  />
                ) : null}
                {block.type === 'heading_paragraph' ? (
                  <div className="admin-blog-editor__stack">
                    <input
                      className="form-control"
                      placeholder="Heading"
                      value={block.heading ?? ''}
                      onChange={(e) => patchBlock(block.id, { heading: e.target.value })}
                    />
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Paragraph…"
                      value={block.text ?? ''}
                      onChange={(e) => patchBlock(block.id, { text: e.target.value })}
                    />
                  </div>
                ) : null}
                {block.type === 'image' ? (
                  <div className="admin-blog-editor__stack">
                    <label className="admin-blog-editor__img-upload">
                      <span className="admin-blog-editor__label">Upload image</span>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingBlockId === block.id}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          e.target.value = ''
                          if (f) uploadBlockImage(block.id, f)
                        }}
                      />
                      {uploadingBlockId === block.id ? (
                        <span className="admin-blog-editor__muted">Uploading…</span>
                      ) : null}
                    </label>
                    {block.src ? (
                      <div className="admin-blog-editor__block-img-thumb-wrap">
                        <img
                          src={publicImageUrl(block.src)}
                          alt=""
                          className="admin-blog-editor__block-img-thumb"
                        />
                      </div>
                    ) : (
                      <p className="admin-blog-editor__muted mb-0 small">No image yet — choose a file above.</p>
                    )}
                    <input
                      className="form-control"
                      placeholder="Alt text"
                      value={block.alt ?? ''}
                      onChange={(e) => patchBlock(block.id, { alt: e.target.value })}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="admin-blog-editor__submit-row">
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? 'Saving…' : 'Post blog'}
            </button>
          </div>
        </div>

        <aside className="admin-blog-editor__preview" aria-label="Preview">
          <div className="admin-blog-editor__preview-chrome">Preview (as on public page)</div>
          <div className="admin-blog-editor__preview-hero-wrap">
            {heroBgUrl ? (
              <div
                className="admin-blog-editor__preview-hero-bg"
                style={{ backgroundImage: `url(${heroBgUrl})` }}
                aria-hidden
              />
            ) : (
              <div className="admin-blog-editor__preview-hero-bg admin-blog-editor__preview-hero-bg--fallback" aria-hidden />
            )}
            <div className="admin-blog-editor__preview-hero-overlay" aria-hidden />
            <div className="admin-blog-editor__preview-hero-inner">
              <h2 className="admin-blog-editor__preview-title">{heroPreviewTitle}</h2>
              <p className="admin-blog-editor__preview-sub">{heroPreviewSub}</p>
              {bannerButtonLabel.trim() ? (
                <span className="admin-blog-editor__preview-cta-btn">{bannerButtonLabel.trim()}</span>
              ) : null}
            </div>
          </div>
          <div className="admin-blog-editor__preview-body">
            {title.trim() ? <h1 className="admin-blog-editor__preview-article-title">{title.trim()}</h1> : null}
            {blocks.length === 0 ? (
              <p className="admin-blog-editor__preview-empty">Add blocks to see them here.</p>
            ) : (
              <div className="admin-blog-editor__preview-grid">
                {blocks.map((block) => {
                  const span = Math.min(12, Math.max(1, Number(block.cols) || 12))
                  return (
                    <div
                      key={block.id}
                      className="admin-blog-editor__preview-cell"
                      style={{ gridColumn: `span ${span}` }}
                    >
                      {block.type === 'heading' ? (
                        <h3 className="admin-blog-editor__pv-h">{block.text || 'Heading'}</h3>
                      ) : null}
                      {block.type === 'paragraph' ? (
                        <p className="admin-blog-editor__pv-p">{block.text || 'Paragraph'}</p>
                      ) : null}
                      {block.type === 'heading_paragraph' ? (
                        <>
                          <h3 className="admin-blog-editor__pv-h">{block.heading || 'Heading'}</h3>
                          <p className="admin-blog-editor__pv-p">{block.text || 'Paragraph'}</p>
                        </>
                      ) : null}
                      {block.type === 'image' ? (
                        <div className="admin-blog-editor__pv-img-wrap">
                          {block.src ? (
                            <img
                              src={publicImageUrl(block.src)}
                              alt={block.alt || ''}
                              className="admin-blog-editor__pv-img"
                            />
                          ) : (
                            <span className="admin-blog-editor__muted">Image</span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </aside>
      </form>
    </div>

    {typeof document !== 'undefined' &&
      (analyticsModalOpen || finalSuccessOpen) &&
      createPortal(
        <>
          {analyticsModalOpen ? (
            <div className="admin-blog-editor-modal-root" role="presentation">
              <button
                type="button"
                className="admin-blog-editor-modal-backdrop"
                aria-label="Close"
                disabled={saving}
                onClick={() => {
                  if (saving) return
                  closeAnalyticsModal()
                }}
              />
              <div
                className="admin-blog-editor-modal-dialog admin-blog-editor-modal-dialog--wide"
                role="dialog"
                aria-modal="true"
                aria-labelledby={analyticsDialogTitleId}
              >
                <div className="admin-blog-editor-modal-head">
                  <h2 id={analyticsDialogTitleId} className="admin-blog-editor-modal-title">
                    Analytics integration
                  </h2>
                  <button
                    type="button"
                    className="admin-blog-editor-modal-close"
                    disabled={saving}
                    onClick={() => closeAnalyticsModal()}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <form className="admin-blog-editor-analytics-form" onSubmit={saveAnalyticsDraftAndClose}>
                  <div className="admin-blog-editor-modal-body">
                    <p className="small text-muted mb-3">
                      Pick <strong>tracking</strong> goals and which <strong>form fields</strong> visitors will see on the
                      public blog. No personal data is entered here—that happens on the live page. The subject line for this
                      post is your blog title when you publish.
                    </p>
                    <div className="admin-blog-editor__field mb-3">
                      <span className="admin-blog-editor__label">Tracking &amp; goals</span>
                      <p className="admin-blog-editor__hint mb-2">Select one or more (e.g. pixels, goals).</p>
                      <div className="admin-blog-editor__badge-row">
                        {BLOG_ANALYTICS_BADGE_OPTIONS.map((b) => {
                          const on = afBadges.includes(b)
                          return (
                            <button
                              key={b}
                              type="button"
                              className={`badge rounded-pill admin-blog-editor__analytics-badge ${on ? 'bg-success text-white' : 'bg-success-subtle text-success'}`}
                              onClick={() => toggleAfBadge(b)}
                              aria-pressed={on}
                            >
                              {b}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="admin-blog-editor__field mb-0">
                      <span className="admin-blog-editor__label">Form fields to show publicly</span>
                      <p className="admin-blog-editor__hint mb-2">
                        Choose which inputs appear on the lead / analytics form for this article.
                      </p>
                      <div className="admin-blog-editor__badge-row">
                        {BLOG_ANALYTICS_FIELD_BADGES.map(({ key, label }) => {
                          const on = afFieldKeys.includes(key)
                          return (
                            <button
                              key={key}
                              type="button"
                              className={`badge rounded-pill admin-blog-editor__analytics-badge ${on ? 'bg-success text-white' : 'bg-success-subtle text-success'}`}
                              onClick={() => toggleAfFieldKey(key)}
                              aria-pressed={on}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {analyticsModalError ? (
                      <p className="text-danger small mb-0" role="alert">
                        {analyticsModalError}
                      </p>
                    ) : null}
                  </div>
                  <div className="admin-blog-editor-modal-actions">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill"
                      disabled={saving}
                      onClick={() => closeAnalyticsModal()}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success rounded-pill">
                      Save &amp; continue
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}

          {finalSuccessOpen ? (
            <div className="book-slot-modal-root admin-blog-editor__modal-portal-success" role="presentation">
              <button type="button" className="book-slot-modal-backdrop" aria-label="Close" onClick={onFinalSuccessClose} />
              <div
                className="book-slot-modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={finalSuccessTitleId}
              >
                <div className="book-slot-modal-head">
                  <img id={finalSuccessTitleId} src={mainLogo} alt="Lifescc" className="book-slot-modal-logo" />
                  <button type="button" className="book-slot-modal-close" onClick={onFinalSuccessClose} aria-label="Close">
                    ×
                  </button>
                </div>
                <div className="book-slot-modal-success">
                  <div className="book-slot-success-row">
                    <SuccessTick />
                    <p className="book-slot-success-text">
                      {finalSuccessHadAnalytics
                        ? 'Your blog post has been saved and analytics integration has been applied to it.'
                        : 'Your blog post has been saved successfully.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>,
        document.body
      )}
    </>
  )
}
