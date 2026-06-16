import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReviewPage.css'
import './AdminVideosPage.css'

export default function AdminVideoAddPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [embed, setEmbed] = useState('')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const canSubmit = title.trim() !== '' && embed.trim() !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/testimonial-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), embed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not save video')
        return
      }
      navigate('/admin/videos')
    } catch {
      setError('Network error. Is the API running?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-slots admin-video-add">
      <header className="admin-slots__header">
        <div className="admin-slots__header-intro">
          <h1 className="admin-slots__title">Add testimonial video</h1>
          <p className="admin-slots__lead">Paste a YouTube embed iframe or link, then add a title.</p>
        </div>
      </header>

      {error ? <p className="admin-slots__banner admin-slots__banner--err">{error}</p> : null}

      <form className="review-portal__card admin-video-add__form" onSubmit={handleSubmit} noValidate>
        <div className="review-portal__field">
          <label className="review-portal__label" htmlFor="admin-video-title">
            Video title <span className="review-portal__req">*</span>
          </label>
          <input
            id="admin-video-title"
            className="review-portal__input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Client success story"
            required
          />
        </div>

        <div className="review-portal__field">
          <label className="review-portal__label" htmlFor="admin-video-embed">
            YouTube embed <span className="review-portal__req">*</span>
          </label>
          <textarea
            id="admin-video-embed"
            className="review-portal__textarea admin-video-add__embed"
            rows={8}
            value={embed}
            onChange={(e) => setEmbed(e.target.value)}
            placeholder='Paste the full iframe from YouTube (Share → Embed), e.g. &lt;iframe width="560" ...&gt;&lt;/iframe&gt;'
            spellCheck={false}
            required
          />
          <p className="admin-video-add__hint">You can also paste a youtube.com or youtu.be watch URL.</p>
        </div>

        <button type="submit" className="review-portal__submit" disabled={!canSubmit || saving}>
          {saving ? 'Posting…' : 'Post to website'}
        </button>
      </form>
    </div>
  )
}
