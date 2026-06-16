import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import NavRouteLink from '../components/NavRouteLink.jsx'
import { stripAppBase } from '../utils/appBase.js'
import './AdminLayout.css'

function IconDashboard({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" opacity="0.95" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" fill="currentColor" opacity="0.95" />
        <rect x="14" y="11" width="7" height="10" rx="1.5" fill="currentColor" opacity="0.95" />
        <rect x="3" y="15" width="7" height="6" rx="1.5" fill="currentColor" opacity="0.95" />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="11" width="7" height="10" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="15" width="7" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function IconReviews({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSupport({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 6.48 2 12v4c0 1.1.9 2 2 2h2v-4H4v-2c0-4.41 3.59-8 8-8s8 3.59 8 8v2h-2v4h2c1.1 0 2-.9 2-2v-4c0-5.52-4.48-10-10-10zm-1 17h2v2h-2v-2zm-1-4h4v2h-4v-2z"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C6.48 2 2 6.48 2 12v4c0 1.1.9 2 2 2h2v-4H4v-2c0-4.41 3.59-8 8-8s8 3.59 8 8v2h-2v4h2c1.1 0 2-.9 2-2v-4c0-5.52-4.48-10-10-10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 15h4M10 19h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Waist / body shaping — slimming arrows (line-art style) */
function IconWeightLoss({ active }) {
  const sw = active ? 2 : 1.75
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* torso sides — hourglass */}
      <path
        d="M9 4.5c-1 2.2-1 5.3 0 7.2.3.6.5 1.1.6 1.6.2 1.2.1 2.6-.2 3.8-.2.8-.5 1.6-.8 2.4-.6 1.6-1 3.4-1 5.1"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 4.5c1 2.2 1 5.3 0 7.2-.3.6-.5 1.1-.6 1.6-.2 1.2-.1 2.6.2 3.8.2.8.5 1.6.8 2.4.6 1.6 1 3.4 1 5.1"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* waist band */}
      <path d="M9.2 12.5h5.6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      {/* belly button */}
      <path d="M12 14.2v1.1" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" />
      {/* hip line */}
      <path d="M9.5 17.2h5" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" />
      {/* legs hint */}
      <path
        d="M10.5 20.5q1.5 1.8 3 0"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* inward arrows — slimming */}
      <path d="M3.5 11.5h3.2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M6.2 11.5l-1.1-1M6.2 11.5l-1.1 1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5 11.5h-3.2" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M17.8 11.5l1.1-1M17.8 11.5l1.1 1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Face, headband, closed eyes, sparkles — skin / beauty line-art */
function IconSkin({ active }) {
  const sw = active ? 2 : 1.65
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* face oval */}
      <ellipse
        cx="11.5"
        cy="13"
        rx="5.2"
        ry="6.2"
        stroke="currentColor"
        strokeWidth={sw}
        fill={active ? 'currentColor' : 'none'}
        opacity={active ? 0.12 : 0}
      />
      {/* ear */}
      <path
        d="M6.2 12.5c-.5.8-.4 1.8.2 2.4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* headband */}
      <path
        d="M7 7.5c1.8-1.2 4.5-1.4 6.8-.8"
        stroke="currentColor"
        strokeWidth={1.45}
        strokeLinecap="round"
      />
      <path
        d="M7.3 9c1.6-.9 4-.95 6-.5"
        stroke="currentColor"
        strokeWidth={1.45}
        strokeLinecap="round"
      />
      {/* brows */}
      <path d="M8.8 10.2q1-.4 2 0" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" />
      <path d="M13.2 10.2q1-.4 2 0" stroke="currentColor" strokeWidth={1.35} strokeLinecap="round" />
      {/* closed eyes + lashes */}
      <path d="M8.6 11.8q.9-.5 1.8 0" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M8.5 12.1v.35M9.1 12.05v.4M9.7 12v.35" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
      <path d="M13.6 11.8q.9-.5 1.8 0" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <path d="M13.5 12.1v.35M14.1 12.05v.4M14.7 12v.35" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
      {/* mouth */}
      <ellipse cx="12" cy="16.2" rx="1.1" ry="0.65" stroke="currentColor" strokeWidth={1.35} fill="none" />
      {/* sparkles — minimal + stars */}
      <path d="M17.2 11v2.2M16.1 12.1h2.2" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
      <path d="M19.8 8.8v1.4M19.1 9.5h1.4" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
      <path d="M19 14.6v1.5M18.25 15.35h1.5" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" />
    </svg>
  )
}

/** Skin surface + follicles + three hair strands (line-art) */
function IconHair({ active }) {
  const sw = active ? 2 : 1.7
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* skin line */}
      <path d="M3 15.5h18" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" />
      {/* follicle dips + strand 1 */}
      <path
        d="M6.5 15.5v1.2c0 .8.6 1.4 1.3 1.4h.4c.7 0 1.3-.6 1.3-1.4v-1.2"
        stroke="currentColor"
        strokeWidth={1.55}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7.8 15.5 Q7 11 8.5 6.5"
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        fill="none"
      />
      {/* strand 2 (center, taller) */}
      <path
        d="M11.2 15.5v1.3c0 .85.65 1.45 1.4 1.45h.4c.75 0 1.4-.6 1.4-1.45v-1.3"
        stroke="currentColor"
        strokeWidth={1.55}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12.5 15.5 Q11.5 9.5 12.5 4"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        fill="none"
      />
      {/* strand 3 */}
      <path
        d="M16.2 15.5v1.2c0 .8.6 1.4 1.3 1.4h.4c.7 0 1.3-.6 1.3-1.4v-1.2"
        stroke="currentColor"
        strokeWidth={1.55}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M17.2 15.5 Q18.5 11 17 6.8"
        stroke="currentColor"
        strokeWidth={1.65}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

function IconContact({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 8l9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBlog({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M6 2h9a2 2 0 012 2v16l-1.5-1.5a2 2 0 00-1.4-.58H6a2 2 0 01-2-2V4a2 2 0 012-2z"
          opacity="0.95"
        />
        <path
          fill="currentColor"
          d="M18 2h1a2 2 0 012 2v14a2 2 0 01-2 2h-1V2z"
          opacity="0.75"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 2h9a2 2 0 012 2v16l-1.5-1.5a2 2 0 00-1.4-.58H6a2 2 0 01-2-2V4a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M18 2h1a2 2 0 012 2v14a2 2 0 01-2 2h-1V2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function IconVideo({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="2" y="5" width="15" height="14" rx="2.5" fill="currentColor" />
        <path
          fill="currentColor"
          d="M21 8.5v7l-4 2.5V6L21 8.5z"
          opacity="0.95"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 8.5v7l-4 2.5V6L21 8.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconFranchise({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M4 10.5V20h4v-6h8v6h4V10.5L12 4 4 10.5zm2 .86L12 6.12l6 5.24V18h-2v-6H8v6H6v-6.64z"
        />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5L12 4l8 6.5V20h-4v-6H8v6H4V10.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconChatbot({ active }) {
  const sw = active ? 2 : 1.75
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2h-3.5l-2.5 2.5L8.5 17H5a2 2 0 01-2-2V5a2 2 0 012-2z"
          opacity="0.95"
        />
        <circle cx="9" cy="10" r="1.2" fill="rgba(255,255,255,0.92)" />
        <circle cx="12" cy="10" r="1.2" fill="rgba(255,255,255,0.92)" />
        <circle cx="15" cy="10" r="1.2" fill="rgba(255,255,255,0.92)" />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2h-3.5l-2.5 2.5L8.5 17H5a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.15" fill="currentColor" />
      <circle cx="12" cy="10" r="1.15" fill="currentColor" />
      <circle cx="15" cy="10" r="1.15" fill="currentColor" />
    </svg>
  )
}

/** Homepage site chatbot — letter H */
function IconHomeChat({ active }) {
  const sw = active ? 2.25 : 2
  return (
    <svg className="admin-sidebar-icon admin-sidebar-icon--letter" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.75}
        fill={active ? 'currentColor' : 'none'}
        opacity={active ? 0.14 : 1}
      />
      <path
        d="M8.25 7.5v9M15.75 7.5v9M8.25 12h7.5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconSlots({ active }) {
  if (active) {
    return (
      <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2.5" fill="currentColor" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="rgba(255,255,255,0.92)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="rgba(255,255,255,0.92)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="rgba(255,255,255,0.92)" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="admin-sidebar-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowBack() {
  return (
    <svg className="admin-sidebar-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RefreshMini({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const routePath = stripAppBase(location.pathname)
  const videoSection = routePath.startsWith('/admin/videos')
  const blogSection = routePath.startsWith('/admin/blogs')
  const svcWeight = routePath.startsWith('/admin/services/weight-loss')
  const svcSkin = routePath.startsWith('/admin/services/skin')
  const svcHair = routePath.startsWith('/admin/services/hair')
  const [siteChatbotEnabled, setSiteChatbotEnabled] = useState(false)
  const [siteChatbotLoading, setSiteChatbotLoading] = useState(true)
  const [siteChatbotSaving, setSiteChatbotSaving] = useState(false)
  const [siteChatbotFlyoutOpen, setSiteChatbotFlyoutOpen] = useState(false)
  const [siteChatbotError, setSiteChatbotError] = useState('')
  const siteChatbotBtnRef = useRef(null)
  const siteChatbotMenuRef = useRef(null)

  const positionSiteChatbotFlyout = useCallback(() => {
    const btn = siteChatbotBtnRef.current
    const menu = siteChatbotMenuRef.current
    if (!btn || !menu) return
    const rect = btn.getBoundingClientRect()
    menu.style.top = `${rect.top + rect.height / 2}px`
  }, [])

  const loadSiteChatbotSettings = useCallback(() => {
    return fetch('/api/site-chatbot-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        setSiteChatbotEnabled(Boolean(data.website_enabled))
        setSiteChatbotError('')
      })
      .catch(() => {
        setSiteChatbotError('Could not load chatbot setting')
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    loadSiteChatbotSettings().finally(() => {
      if (!cancelled) setSiteChatbotLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [loadSiteChatbotSettings])

  const updateSiteChatbot = useCallback(
    async (enabled) => {
      if (siteChatbotSaving || siteChatbotLoading || siteChatbotEnabled === enabled) return
      const previous = siteChatbotEnabled
      setSiteChatbotSaving(true)
      setSiteChatbotError('')
      setSiteChatbotEnabled(enabled)
      try {
        const res = await fetch('/api/site-chatbot-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website_enabled: enabled }),
        })
        if (!res.ok) {
          throw new Error('save failed')
        }
        const data = await res.json()
        setSiteChatbotEnabled(Boolean(data.website_enabled))
      } catch {
        setSiteChatbotEnabled(previous)
        setSiteChatbotError('Could not save — try again')
      } finally {
        setSiteChatbotSaving(false)
      }
    },
    [siteChatbotEnabled, siteChatbotLoading, siteChatbotSaving],
  )

  const toggleSiteChatbot = useCallback(() => {
    if (siteChatbotLoading) return
    updateSiteChatbot(!siteChatbotEnabled)
  }, [siteChatbotEnabled, siteChatbotLoading, updateSiteChatbot])

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar-liquid" aria-label="Admin navigation">
        <div className="admin-sidebar-liquid__shine" aria-hidden />
        <div className="admin-sidebar-liquid__inner">
          <NavRouteLink to="/admin/dashboard" className="admin-sidebar-liquid__logo-link" title="Lifescc" aria-label="Lifescc home">
            <img src={mainLogo} alt="" className="admin-sidebar-liquid__logo" />
          </NavRouteLink>
          <nav className="admin-sidebar-liquid__nav">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Dashboard"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconDashboard active={isActive} />
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin/slots"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Slots"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconSlots active={isActive} />
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin/franchises"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Franchise inquiries"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconFranchise active={isActive} />
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin/contacts"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Contact form"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconContact active={isActive} />
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin/chatbot-users"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Site chatbot captures"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconChatbot active={isActive} />
                </span>
              )}
            </NavLink>
            <div
              className={`admin-sidebar-flyout admin-sidebar-flyout--chatbot${siteChatbotEnabled ? ' is-active' : ''}${siteChatbotFlyoutOpen ? ' is-pinned' : ''}`}
              onMouseEnter={() => {
                setSiteChatbotFlyoutOpen(true)
                positionSiteChatbotFlyout()
              }}
              onMouseLeave={() => setSiteChatbotFlyoutOpen(false)}
            >
              <button
                ref={siteChatbotBtnRef}
                type="button"
                className={`admin-sidebar-liquid__link admin-sidebar-liquid__link--button${siteChatbotEnabled ? ' is-active' : ''}`}
                title={siteChatbotEnabled ? 'Homepage chatbot: on (click to turn off)' : 'Homepage chatbot: off (click to turn on)'}
                aria-label="Homepage chatbot visibility"
                aria-pressed={Boolean(siteChatbotEnabled)}
                disabled={siteChatbotLoading || siteChatbotSaving}
                onClick={toggleSiteChatbot}
                onFocus={() => {
                  setSiteChatbotFlyoutOpen(true)
                  positionSiteChatbotFlyout()
                }}
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconHomeChat active={Boolean(siteChatbotEnabled)} />
                </span>
              </button>
              <div
                ref={siteChatbotMenuRef}
                className="admin-sidebar-flyout__menu admin-sidebar-flyout__menu--wide admin-sidebar-flyout__menu--fixed"
                role="group"
                aria-label="Homepage chatbot"
              >
                <p className="admin-sidebar-flyout__hint">Homepage chatbot</p>
                <div className="admin-sidebar-chatbot-toggle">
                  <span className="admin-sidebar-chatbot-toggle__label">Show on website</span>
                  <button
                    type="button"
                    className={`admin-sidebar-chatbot-toggle__switch${siteChatbotEnabled ? ' is-on' : ''}`}
                    role="switch"
                    aria-checked={Boolean(siteChatbotEnabled)}
                    disabled={siteChatbotLoading || siteChatbotSaving}
                    onClick={toggleSiteChatbot}
                    aria-label={siteChatbotEnabled ? 'Disable homepage chatbot' : 'Enable homepage chatbot'}
                  >
                    <span className="admin-sidebar-chatbot-toggle__track" aria-hidden />
                  </button>
                </div>
                <p className="admin-sidebar-flyout__muted">
                  {siteChatbotLoading
                    ? 'Loading…'
                    : siteChatbotSaving
                      ? 'Saving…'
                      : siteChatbotError
                        ? siteChatbotError
                        : siteChatbotEnabled
                          ? 'Visible to visitors'
                          : 'Hidden from site'}
                </p>
              </div>
            </div>
            <div className="admin-sidebar-liquid__divider" role="presentation" aria-hidden />
            <span className="visually-hidden">Service lines</span>
            <div className={`admin-sidebar-flyout${svcWeight ? ' is-active' : ''}`}>
              <NavLink
                to="/admin/services/weight-loss"
                className={() => `admin-sidebar-liquid__link${svcWeight ? ' is-active' : ''}`}
                title="Weight loss"
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconWeightLoss active={svcWeight} />
                </span>
              </NavLink>
              <div className="admin-sidebar-flyout__menu admin-sidebar-flyout__menu--wide" role="menu" aria-label="Weight loss">
                <p className="admin-sidebar-flyout__hint">Main contact</p>
                <p className="admin-sidebar-flyout__muted">Assign owner — next step</p>
                <NavRouteLink to="/admin/services/weight-loss" className="admin-sidebar-flyout__item" role="menuitem">
                  Open
                </NavRouteLink>
              </div>
            </div>
            <div className={`admin-sidebar-flyout${svcSkin ? ' is-active' : ''}`}>
              <NavLink
                to="/admin/services/skin"
                className={() => `admin-sidebar-liquid__link${svcSkin ? ' is-active' : ''}`}
                title="Skin"
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconSkin active={svcSkin} />
                </span>
              </NavLink>
              <div className="admin-sidebar-flyout__menu admin-sidebar-flyout__menu--wide" role="menu" aria-label="Skin">
                <p className="admin-sidebar-flyout__hint">Main contact</p>
                <p className="admin-sidebar-flyout__muted">Assign owner — next step</p>
                <NavRouteLink to="/admin/services/skin" className="admin-sidebar-flyout__item" role="menuitem">
                  Open
                </NavRouteLink>
              </div>
            </div>
            <div className={`admin-sidebar-flyout${svcHair ? ' is-active' : ''}`}>
              <NavLink
                to="/admin/services/hair"
                className={() => `admin-sidebar-liquid__link${svcHair ? ' is-active' : ''}`}
                title="Hair"
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconHair active={svcHair} />
                </span>
              </NavLink>
              <div className="admin-sidebar-flyout__menu admin-sidebar-flyout__menu--wide" role="menu" aria-label="Hair">
                <p className="admin-sidebar-flyout__hint">Main contact</p>
                <p className="admin-sidebar-flyout__muted">Assign owner — next step</p>
                <NavRouteLink to="/admin/services/hair" className="admin-sidebar-flyout__item" role="menuitem">
                  Open
                </NavRouteLink>
              </div>
            </div>
            <NavLink
              to="/admin/support"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Customer support"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconSupport active={isActive} />
                </span>
              )}
            </NavLink>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) => `admin-sidebar-liquid__link${isActive ? ' is-active' : ''}`}
              title="Reviews"
            >
              {({ isActive }) => (
                <span className="admin-sidebar-liquid__icon">
                  <IconReviews active={isActive} />
                </span>
              )}
            </NavLink>
            <div className={`admin-sidebar-flyout${blogSection ? ' is-active' : ''}`}>
              <NavLink
                to="/admin/blogs"
                className={() => `admin-sidebar-liquid__link${blogSection ? ' is-active' : ''}`}
                title="Blog posts"
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconBlog active={blogSection} />
                </span>
              </NavLink>
              <div className="admin-sidebar-flyout__menu" role="menu" aria-label="Blog actions">
                <NavRouteLink to="/admin/blogs/new" className="admin-sidebar-flyout__item" role="menuitem">
                  New post
                </NavRouteLink>
                <NavRouteLink to="/admin/blogs" className="admin-sidebar-flyout__item" role="menuitem">
                  <RefreshMini className="admin-sidebar-flyout__mini" />
                  All blogs
                </NavRouteLink>
                <NavRouteLink to="/admin/blogs/submissions" className="admin-sidebar-flyout__item" role="menuitem">
                  Form submissions
                </NavRouteLink>
                <NavRouteLink to="/admin/blogs/analytics" className="admin-sidebar-flyout__item" role="menuitem">
                  Analytics
                </NavRouteLink>
              </div>
            </div>
            <div className={`admin-sidebar-flyout${videoSection ? ' is-active' : ''}`}>
              <NavLink
                to="/admin/videos"
                className={() =>
                  `admin-sidebar-liquid__link${videoSection ? ' is-active' : ''}`
                }
                title="Testimonial videos"
              >
                <span className="admin-sidebar-liquid__icon">
                  <IconVideo active={videoSection} />
                </span>
              </NavLink>
              <div className="admin-sidebar-flyout__menu" role="menu" aria-label="Video actions">
                <NavRouteLink to="/admin/videos/add" className="admin-sidebar-flyout__item" role="menuitem">
                  Add video
                </NavRouteLink>
                <NavRouteLink to="/admin/videos" className="admin-sidebar-flyout__item" role="menuitem">
                  <RefreshMini className="admin-sidebar-flyout__mini" />
                  All videos
                </NavRouteLink>
              </div>
            </div>
          </nav>
          <NavRouteLink to="/" className="admin-sidebar-liquid__footer-link" title="Back to site">
            <span className="admin-sidebar-liquid__icon">
              <IconArrowBack />
            </span>
          </NavRouteLink>
        </div>
      </aside>

      <div className="admin-main-panel">
        <div className="admin-main-liquid">
          <div className="admin-main-liquid__blobs" aria-hidden />
          <div className="admin-main-liquid__shine" aria-hidden />
          <div className="admin-main-liquid__content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
