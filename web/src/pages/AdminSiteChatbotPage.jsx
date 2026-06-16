import { Link } from 'react-router-dom'
import { useSiteChatbotSettings } from '../hooks/useSiteChatbotSettings.js'
import './AdminSiteChatbotPage.css'

export default function AdminSiteChatbotPage() {
  const { enabled, loading, saving, error, toggle } = useSiteChatbotSettings()

  return (
    <div className="admin-site-chatbot">
      <header className="admin-site-chatbot__head">
        <div>
          <h1 className="admin-site-chatbot__title">Homepage chatbot</h1>
          <p className="admin-site-chatbot__subtitle">
            Control whether the visitor chat widget appears on the public website.
          </p>
        </div>
      </header>

      <section className="admin-site-chatbot__card" aria-labelledby="admin-site-chatbot-toggle-heading">
        <h2 id="admin-site-chatbot-toggle-heading" className="admin-site-chatbot__card-title">
          Visibility
        </h2>
        <p className="admin-site-chatbot__card-desc">
          When enabled, visitors see the chat bubble on all public pages. When disabled, the widget is hidden and
          chatbot APIs are turned off.
        </p>

        <div className="admin-site-chatbot__row">
          <div>
            <p className="admin-site-chatbot__status-label">Show on website</p>
            <p className="admin-site-chatbot__status-meta">
              {loading ? 'Loading…' : saving ? 'Saving…' : enabled ? 'Currently visible to visitors' : 'Currently hidden'}
            </p>
            {error ? <p className="admin-site-chatbot__error">{error}</p> : null}
          </div>
          <button
            type="button"
            className={`admin-site-chatbot__switch${enabled ? ' is-on' : ''}`}
            role="switch"
            aria-checked={enabled}
            disabled={loading || saving}
            onClick={toggle}
            aria-label={enabled ? 'Disable homepage chatbot' : 'Enable homepage chatbot'}
          >
            <span className="admin-site-chatbot__switch-track" aria-hidden />
          </button>
        </div>
      </section>

      <p className="admin-site-chatbot__footer">
        View submitted leads in{' '}
        <Link to="/admin/chatbot-users" className="admin-site-chatbot__link">
          Site chatbot captures
        </Link>
        .
      </p>
    </div>
  )
}
