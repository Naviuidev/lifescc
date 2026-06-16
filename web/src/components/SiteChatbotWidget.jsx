import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import { SITE_EMBEDDED_CHATBOT } from '../constants/siteEmbeddedChatbot.js'
import CustomChatbotRuntime from './CustomChatbotRuntime.jsx'
import './SiteChatbotWidget.css'

const AUTO_OPEN_CHAT_MS = 5_000

/**
 * Hardcoded site flow (same UI as before via CustomChatbotRuntime).
 * Steps live in `web/src/constants/siteEmbeddedChatbot.json`; PHP uses that file for lead submit.
 */
export default function SiteChatbotWidget() {
  const location = useLocation()
  const bot = SITE_EMBEDDED_CHATBOT
  const botId = Number(bot?.id)
  const [panelMount, setPanelMount] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const panelOpenRef = useRef(false)
  /** Close uses opacity + transform; wait for both transitionend events before unmounting. */
  const closeArmedRef = useRef(false)
  const closeEndedRef = useRef(0)
  const closeFallbackTimerRef = useRef(null)

  const openChat = useCallback(() => {
    if (closeFallbackTimerRef.current) {
      window.clearTimeout(closeFallbackTimerRef.current)
      closeFallbackTimerRef.current = null
    }
    closeArmedRef.current = false
    closeEndedRef.current = 0
    setPanelMount(true)
    setPanelOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelOpen(true))
    })
  }, [])

  const startClose = useCallback(() => {
    closeArmedRef.current = true
    closeEndedRef.current = 0
    setPanelOpen(false)
    if (closeFallbackTimerRef.current) window.clearTimeout(closeFallbackTimerRef.current)
    closeFallbackTimerRef.current = window.setTimeout(() => {
      closeFallbackTimerRef.current = null
      if (!closeArmedRef.current) return
      closeArmedRef.current = false
      closeEndedRef.current = 0
      setPanelMount(false)
    }, 420)
  }, [])

  const onPanelTransitionEnd = useCallback(
    (e) => {
      if (panelOpen) return
      if (!closeArmedRef.current) return
      if (e.target !== panelRef.current) return
      if (e.propertyName !== 'opacity' && e.propertyName !== 'transform') return
      closeEndedRef.current += 1
      if (closeEndedRef.current >= 2) {
        if (closeFallbackTimerRef.current) {
          window.clearTimeout(closeFallbackTimerRef.current)
          closeFallbackTimerRef.current = null
        }
        closeArmedRef.current = false
        closeEndedRef.current = 0
        setPanelMount(false)
      }
    },
    [panelOpen]
  )

  useEffect(() => {
    if (!panelMount || !panelOpen) return undefined
    const onKey = (ev) => {
      if (ev.key === 'Escape') startClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelMount, panelOpen, startClose])

  useEffect(
    () => () => {
      if (closeFallbackTimerRef.current) {
        window.clearTimeout(closeFallbackTimerRef.current)
        closeFallbackTimerRef.current = null
      }
    },
    []
  )

  useEffect(() => {
    panelOpenRef.current = panelOpen
  }, [panelOpen])

  /** After each full load or client-side route change, open the assistant if it is not already open. */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!panelOpenRef.current) openChat()
    }, AUTO_OPEN_CHAT_MS)
    return () => window.clearTimeout(timer)
  }, [location.pathname, openChat])

  if (!Number.isFinite(botId) || botId <= 0) return null

  const fabAway = panelMount && panelOpen

  return (
    <div className="site-chatbot-widget">
      <div className="site-chatbot-widget__inner">
        {panelMount ? (
          <div
            ref={panelRef}
            className={`site-chatbot-widget__panel site-chatbot-widget__panel--anim${panelOpen ? ' is-open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Chat assistant"
            aria-hidden={!panelOpen}
            onTransitionEnd={onPanelTransitionEnd}
          >
            <CustomChatbotRuntime chatbot={bot} onClose={startClose} />
          </div>
        ) : null}
        <button
          type="button"
          className={`site-chatbot-widget__fab${fabAway ? ' site-chatbot-widget__fab--away' : ''}`}
          onClick={openChat}
          aria-label="Open chat"
          aria-expanded={panelOpen}
        >
          <img src={mainLogo} alt="" className="site-chatbot-widget__fab-logo" />
        </button>
      </div>
    </div>
  )
}
