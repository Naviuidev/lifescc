import { createPortal } from 'react-dom'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Hover/focus panel with email + mobile (matches admin slots user cell). */
export default function AdminUserContactDropdown({ fullName, email, mobile }) {
  const telHref = String(mobile).replace(/[^\d+]/g, '') || mobile
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const hideTimerRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const clearHide = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const scheduleHide = useCallback(() => {
    clearHide()
    hideTimerRef.current = setTimeout(() => setOpen(false), 140)
  }, [clearHide])

  const show = useCallback(() => {
    clearHide()
    setOpen(true)
  }, [clearHide])

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const r = trigger.getBoundingClientRect()
    const panel = panelRef.current
    const pad = 8
    let left = r.left
    let top = r.bottom + 4

    if (panel) {
      const w = panel.offsetWidth
      const h = panel.offsetHeight
      if (left + w > window.innerWidth - pad) {
        left = Math.max(pad, window.innerWidth - w - pad)
      }
      const spaceBelow = window.innerHeight - r.bottom - pad
      const spaceAbove = r.top - pad
      if (h > spaceBelow && spaceAbove >= spaceBelow) {
        top = Math.max(pad, r.top - h - 4)
      }
      if (top + h > window.innerHeight - pad) {
        top = Math.max(pad, window.innerHeight - h - pad)
      }
    }

    setCoords({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const onScrollOrResize = () => updatePosition()
    const id1 = requestAnimationFrame(() => {
      updatePosition()
      requestAnimationFrame(() => updatePosition())
    })
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      cancelAnimationFrame(id1)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => clearHide(), [clearHide])

  const onTriggerBlur = (e) => {
    const rt = e.relatedTarget
    if (panelRef.current && rt instanceof Node && panelRef.current.contains(rt)) return
    scheduleHide()
  }

  const panel = open ? (
    <div
      ref={panelRef}
      className="admin-user-dropdown__panel admin-user-dropdown__panel--portal"
      style={{ top: coords.top, left: coords.left }}
      role="region"
      aria-label={`Contact details for ${fullName}`}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
    >
      <div className="admin-user-dropdown__panel-shine" aria-hidden />
      <div className="admin-user-dropdown__panel-inner">
        {email ? (
          <div className="admin-user-dropdown__row-meta">
            <span className="admin-user-dropdown__label">Email</span>
            <a href={`mailto:${email}`} className="admin-user-dropdown__value">
              {email}
            </a>
          </div>
        ) : null}
        <div className="admin-user-dropdown__row-meta">
          <span className="admin-user-dropdown__label">Mobile</span>
          <a href={`tel:${telHref}`} className="admin-user-dropdown__value">
            {mobile}
          </a>
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className={`admin-user-dropdown${open ? ' admin-user-dropdown--open' : ''}`}
        tabIndex={0}
        title="Hover for email and mobile"
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
        onFocus={show}
        onBlur={onTriggerBlur}
      >
        <div className="admin-user-dropdown__head">
          <span className="admin-user-cell__name">{fullName}</span>
          <span className="admin-user-dropdown__chev-wrap" aria-hidden>
            <svg
              className="admin-user-dropdown__chev"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
      {panel ? createPortal(panel, document.body) : null}
    </>
  )
}
