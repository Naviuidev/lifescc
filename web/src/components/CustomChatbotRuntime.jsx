import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
  LIFESCC_BRANCHES,
  LIFESCC_LOCATION_GROUPS,
  lifesccLocationGroupLabel,
} from '../constants/branches.js'
import {
  getDefaultCatalogServiceLabels,
  isServicesCatalogSegmentsMode,
  isServicesCatalogTreatmentsMode,
  LIFESCC_DEFAULT_SERVICE_CATALOG,
} from '../constants/chatbotServiceCatalog.js'
import { getNavbarServiceDropdownGroups } from '../constants/navbarDropdownItems.js'
import { getChatbotTreatmentPreview } from '../constants/chatbotTreatmentPreview.js'
import { SITE_EMBEDDED_CHATBOT_ID } from '../constants/siteEmbeddedChatbot.js'
import mainLogo from '../assets/main-logo1.png'
import BookSlotInline from './BookSlotInline.jsx'
import './CustomChatbotRuntime.css'

function GlassChatHeader({ onClose, onReset, firstLocationIdx, firstCallSpecialistIdx, onJumpLocations, onJumpCallSpecialist }) {
  const locDisabled = firstLocationIdx < 0
  const callDisabled = firstCallSpecialistIdx < 0
  return (
    <header className="cc-runtime__glass-wrap cc-runtime__glass-header">
      <div className="cc-runtime__glass-pill cc-runtime__glass-pill--top">
        <img src={mainLogo} alt="" className="cc-runtime__glass-logo" width={40} height={40} />
        <div className="cc-runtime__glass-titles">
          <span className="cc-runtime__glass-line1">24X7 Chat</span>
          <span className="cc-runtime__glass-line2">Dr. Hema Online!</span>
          <div className="cc-runtime__glass-quick" role="toolbar" aria-label="Quick links">
            <button
              type="button"
              className="cc-runtime__glass-chip cc-runtime__glass-chip--inline"
              disabled={locDisabled}
              title={locDisabled ? 'No location step in this flow' : 'Jump to locations'}
              onClick={onJumpLocations}
            >
              Locations
            </button>
            <button
              type="button"
              className="cc-runtime__glass-chip cc-runtime__glass-chip--inline"
              disabled={callDisabled}
              title={callDisabled ? 'No call specialist step in this flow' : 'Jump to call specialist'}
              onClick={onJumpCallSpecialist}
            >
              Call specialist
            </button>
          </div>
        </div>
        <div className="cc-runtime__glass-actions" role="group" aria-label="Chat window">
          <button type="button" className="cc-runtime__glass-icon-btn" onClick={onReset} aria-label="Restart conversation" title="Restart conversation">
            <svg className="cc-runtime__glass-reset-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"
              />
            </svg>
          </button>
          <button type="button" className="cc-runtime__glass-icon-btn" onClick={onClose} aria-label="Close chat" title="Close">
            <svg className="cc-runtime__glass-close-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

function BotAvatarRow({ children, className = '' }) {
  return (
    <div className={`cc-runtime__bot-row${className ? ` ${className}` : ''}`.trim()}>
      <img src={mainLogo} alt="" className="cc-runtime__bot-avatar" width={28} height={28} />
      <div className="cc-runtime__bot-row__content">{children}</div>
    </div>
  )
}

/** Bot questions / instructions — same surface as welcome message bubbles (white fill, slate border). */
function BotPromptBubble({ children, className = '' }) {
  return (
    <div
      role="status"
      className={`cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--utterance${className ? ` ${className}` : ''}`.trim()}
    >
      {children}
    </div>
  )
}

/**
 * Segments for multi-bubble intro (2+ blocks). Order:
 * 1) step.typing_segments (string[])
 * 2) --- alone on a line (flexible surrounding line breaks / spaces)
 * 3) Paragraphs split on one or more blank lines (\n\n+)
 */
function getTypingSegments(step) {
  if (!step || step.type !== 'message') return null
  if (Array.isArray(step.typing_segments)) {
    const arr = step.typing_segments.filter((x) => typeof x === 'string' && String(x).trim() !== '')
    if (arr.length >= 2) return arr.map((x) => String(x))
  }
  const raw = typeof step.content === 'string' ? step.content : ''
  const trimmed = raw.trim()
  if (!trimmed) return null

  const byDelimiter = trimmed.split(/(?:\r\n|\n|\r)+\s*---\s*(?:\r\n|\n|\r)+/).map((p) => p.trim())
  if (byDelimiter.length >= 2 && byDelimiter.every((p) => p !== '')) {
    return byDelimiter
  }

  const byBlank = trimmed.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  if (byBlank.length >= 2) {
    return byBlank
  }

  return null
}

function messageHistoryText(step) {
  if (step.type !== 'message') return ''
  const parts = getTypingSegments(step)
  return parts ? parts.join('\n\n') : String(step.content || '')
}

/** Multi-segment welcome: each block appears as its own bubble with a short fade/slide-in (no per-character typing). */
function SegmentedRevealBotMessage({ segments, pauseMs, onComplete }) {
  const safe = useMemo(() => segments.map((s) => String(s)), [segments])
  const [lines, setLines] = useState([])
  const onDoneRef = useRef(onComplete)
  onDoneRef.current = onComplete

  useEffect(() => {
    const timers = []
    let cancelled = false
    const schedule = (fn, ms) => {
      const id = window.setTimeout(fn, ms)
      timers.push(id)
    }

    setLines([])

    function finishAll() {
      if (!cancelled) onDoneRef.current?.()
    }

    function revealAt(index) {
      if (cancelled) return
      if (index >= safe.length) {
        finishAll()
        return
      }
      setLines((prev) => [...prev, safe[index]])
      const pRaw = pauseMs != null ? pauseMs[index] : null
      const pauseAfter =
        pRaw != null && Number.isFinite(Number(pRaw))
          ? Math.max(0, Math.min(5000, Number(pRaw)))
          : index < safe.length - 1
            ? 1000
            : 0
      schedule(() => revealAt(index + 1), pauseAfter)
    }

    schedule(() => revealAt(0), 240)
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [safe.join('\u0001'), JSON.stringify(pauseMs ?? null)])

  return (
    <div className="cc-runtime__typing-stack" role="region" aria-live="polite">
      {lines.map((block, i) => (
        <div
          key={i}
          className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__typing-popins cc-runtime__bubble--reveal-in"
        >
          {block}
        </div>
      ))}
    </div>
  )
}

const MAIN_SERVICE_CAROUSEL_SLIDES = [
  { id: 'Weight', title: 'Weight', subtitle: 'Healthy weight & body goals' },
  { id: 'Skin', title: 'Skin', subtitle: 'Glow, repair & anti-ageing' },
  { id: 'Hair', title: 'Hair', subtitle: 'Hair care & restoration' },
]

const SLOT_SERVICE_BOOKING_OPTIONS = getDefaultCatalogServiceLabels().map((l) => ({ value: l, label: l }))

function MainCarouselCategoryIcon({ categoryId }) {
  const stroke = '#157347'
  const sw = 1.6
  const a = { viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': true }
  if (categoryId === 'Weight') {
    return (
      <svg {...a}>
        <rect x="5.5" y="15" width="13" height="4" rx="1.25" stroke={stroke} strokeWidth={sw} />
        <path
          d="M8.5 15V11.5a3.5 3.5 0 017 0V15"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <path d="M12 7.5V10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    )
  }
  if (categoryId === 'Skin') {
    return (
      <svg {...a}>
        <path
          d="M12 21.25c3.6-2.75 6.25-5.85 6.25-9.5 0-3.65-2.4-6.75-6.25-10.25C8.15 4.75 5.75 8.1 5.75 11.75c0 3.65 2.65 6.75 6.25 9.5Z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg {...a}>
      <circle cx="8" cy="8" r="2" stroke={stroke} strokeWidth={sw} />
      <circle cx="8" cy="16" r="2" stroke={stroke} strokeWidth={sw} />
      <path d="M10.3 9.4 15.7 14.6M15.7 9.4 10.3 14.6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  )
}

function MainServiceCarouselFlow({ pillarGroups, onComplete }) {
  const slides = MAIN_SERVICE_CAROUSEL_SLIDES
  const n = slides.length
  const [slideIdx, setSlideIdx] = useState(0)
  const [phase, setPhase] = useState('browse')
  const [pillar, setPillar] = useState(null)

  const itemsForPillar = useMemo(() => {
    if (!pillar) return []
    const g = pillarGroups.find((x) => x.group === pillar)
    return g?.items ?? []
  }, [pillar, pillarGroups])

  const prevSlide = useCallback(() => setSlideIdx((i) => Math.max(0, i - 1)), [])
  const nextSlide = useCallback(() => setSlideIdx((i) => Math.min(n - 1, i + 1)), [n])

  const openCategoryServices = useCallback(() => {
    setPillar(slides[slideIdx].id)
    setPhase('pick')
  }, [slideIdx, slides])

  const backToCarousel = useCallback(() => {
    setPhase('browse')
    setPillar(null)
  }, [])

  const pickService = useCallback(
    (item) => {
      if (!pillar || !item) return
      onComplete(
        JSON.stringify({
          pillar,
          service: { label: item.label, href: item.href },
        })
      )
    },
    [pillar, onComplete]
  )

  if (phase === 'pick') {
    return (
      <div className="cc-runtime__main-carousel cc-runtime__main-carousel--pick">
        <div className="cc-runtime__main-carousel-pick-head">
          <button type="button" className="cc-runtime__main-carousel-back btn btn-link btn-sm p-0" onClick={backToCarousel}>
            ← Categories
          </button>
          <p className="cc-runtime__main-carousel-pick-title">{pillar} · pick a service</p>
        </div>
        {itemsForPillar.length === 0 ? (
          <p className="cc-runtime__muted small mb-0">
            No services listed for this category. Go back and try another option.
          </p>
        ) : (
          <div
            className="cc-runtime__choices cc-runtime__choices--services cc-runtime__choices--main-svc-grid"
            role="group"
            aria-label={`${pillar} services`}
          >
            {itemsForPillar.map((item) => (
              <button
                key={`${item.label}-${item.href}`}
                type="button"
                className="btn btn-sm cc-runtime__choice-btn btn-outline-success"
                onClick={() => pickService(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const trackPct = n > 0 ? 100 / n : 100

  return (
    <div className="cc-runtime__main-carousel">
      <div className="cc-runtime__main-carousel-controls">
        <button
          type="button"
          className="cc-runtime__main-carousel-arrow"
          onClick={prevSlide}
          disabled={slideIdx <= 0}
          aria-label="Previous category"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M14 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="cc-runtime__main-carousel-viewport">
          <div
            className="cc-runtime__main-carousel-track"
            style={{
              width: `${n * 100}%`,
              transform: `translateX(-${trackPct * slideIdx}%)`,
            }}
          >
            {slides.map((s) => (
              <div key={s.id} className="cc-runtime__main-carousel-slide" style={{ width: `${trackPct}%` }}>
                <div className="cc-runtime__main-carousel-card">
                  <div className="cc-runtime__main-carousel-icon-wrap">
                    <div className="cc-runtime__main-carousel-icon-badge">
                      <MainCarouselCategoryIcon categoryId={s.id} />
                    </div>
                  </div>
                  <h3 className="cc-runtime__main-carousel-heading">{s.title}</h3>
                  <p className="cc-runtime__main-carousel-sub">{s.subtitle}</p>
                  <button
                    type="button"
                    className="cc-runtime__main-carousel-select btn btn-outline-success btn-sm"
                    onClick={openCategoryServices}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="cc-runtime__main-carousel-arrow"
          onClick={nextSlide}
          disabled={slideIdx >= n - 1}
          aria-label="Next category"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M10 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="cc-runtime__main-carousel-dots" role="tablist" aria-label="Category">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`cc-runtime__main-carousel-dot${i === slideIdx ? ' is-active' : ''}`}
            aria-label={s.title}
            aria-current={i === slideIdx ? 'true' : undefined}
            onClick={() => setSlideIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}

/** User-facing text for transcript/history (nav step stores JSON). */
function formatUserAnswerForBadge(step, raw) {
  if (raw === undefined || raw === null) return ''
  if (step?.type === 'nav_service_select' && typeof raw === 'string') {
    const t = raw.trim()
    if (t.startsWith('{')) {
      try {
        const o = JSON.parse(t)
        if (o && typeof o.label === 'string') return o.label
      } catch {
        return t
      }
    }
  }
  if (step?.type === 'main_service_carousel' && typeof raw === 'string') {
    const t = raw.trim()
    if (t.startsWith('{')) {
      try {
        const o = JSON.parse(t)
        const p = typeof o.pillar === 'string' ? o.pillar.trim() : ''
        const lbl = o?.service && typeof o.service.label === 'string' ? o.service.label.trim() : ''
        if (p && lbl) return `${p} · ${lbl}`
        if (lbl) return lbl
      } catch {
        return t
      }
    }
  }
  if (step?.type === 'site_near_me' && typeof raw === 'string') {
    const t = raw.trim()
    if (t.startsWith('{')) {
      try {
        const o = JSON.parse(t)
        const city = o?.city && typeof o.city.label === 'string' ? o.city.label.trim() : ''
        const bn = o?.branch && typeof o.branch.name === 'string' ? o.branch.name.trim() : ''
        const fu = typeof o.follow_up === 'string' ? o.follow_up : ''
        const fuLabel =
          fu === 'request_callback' ? 'Request call' : fu === 'slot_booking' ? 'Slot booking' : fu
        if (city && bn && fuLabel) return `${city} · ${bn} · ${fuLabel}`
        if (city && bn) return `${city} · ${bn}`
      } catch {
        return t
      }
    }
  }
  return String(raw)
}

function stepLabel(step) {
  if (step.type === 'message' || step.type === 'call_specialist') return step.type === 'message' ? 'Welcome' : 'Message'
  if (step.type === 'location') return step.title || 'Locations'
  if (step.type === 'branches') return step.title || 'Branches'
  if (step.type === 'site_near_me') return step.title || 'Visit us'
  if (step.type === 'choice') {
    if (step.choice_style === 'main_services') return 'Main service'
    return step.label || 'Choice'
  }
  if (step.type === 'nav_service_select') return 'Service'
  if (step.type === 'main_service_carousel') return 'Your focus'
  if (step.type === 'services') return step.label || 'Services'
  if (step.type === 'loop') return step.title || 'More'
  if (step.type === 'text' || step.type === 'textarea') {
    if (step.mapTo === 'full_name') return 'Name'
    if (step.mapTo === 'email') return 'Email'
    if (step.mapTo === 'phone') return 'Mobile'
    if (step.mapTo === 'service') return 'Service'
  }
  return step.label || step.id
}

/** First mapped answer for full_name in flow order (for “Hi …” on later steps). */
function getAnswerForMapTo(steps, answers, mapToKey) {
  for (const s of steps) {
    if ((s.type === 'text' || s.type === 'textarea') && s.mapTo === mapToKey) {
      const v = answers[s.id]
      if (typeof v === 'string' && v.trim() !== '') return v.trim()
    }
  }
  return ''
}

function firstNameFromFullName(full) {
  const raw = String(full || '').trim()
  if (!raw) return ''
  const first = raw.split(/\s+/)[0] || ''
  if (!first) return ''
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

function groupBranchesByRegionKey(branches) {
  const m = new Map()
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i]
    const raw = (b.locationGroup || b.region || '').trim()
    const key = raw || '__all__'
    if (!m.has(key)) m.set(key, [])
    m.get(key).push({ branch: b, index: i })
  }
  return m
}

/** Matches default choice options from the admin flow editor. */
const CHOICE_RESTART_LABEL = 'Restart the conversation'
const CHOICE_QUIT_LABEL = 'Quit conversation'

/** Branches in `LIFESCC_BRANCHES` for a city-area label from cities-only location step (e.g. "Hyderabad"). */
function lifesccBranchesForCityAnswer(cityLabel) {
  const label = String(cityLabel || '').trim()
  if (!label) return []
  const grp = LIFESCC_LOCATION_GROUPS.find((g) => g.label === label)
  if (!grp) return []
  return LIFESCC_BRANCHES.filter((b) => String(b.locationGroup || '') === grp.id)
}

/** Resolve branches for transcript / city recap using optional `location_cities` on the step. */
function branchesForLocationCityAnswer(answerLabel, step) {
  const raw = String(answerLabel || '').trim()
  const cityKey = raw.includes('·') ? raw.split(/\s*·\s*/)[0].trim() : raw
  const custom = step?.location_cities
  if (Array.isArray(custom) && custom.length > 0) {
    const hit = custom.find(
      (c) => String(c.label || '').trim() === cityKey || String(c.id || '').trim() === cityKey
    )
    const rid = hit && hit.id != null ? String(hit.id).trim() : ''
    if (rid) return LIFESCC_BRANCHES.filter((b) => String(b.locationGroup || '') === rid)
  }
  return lifesccBranchesForCityAnswer(cityKey)
}

/** Branches listed on a `site_near_me` step, filtered by chosen city id/label. */
function branchesForSiteNearMeStep(cityLabel, cityId, step) {
  const branches = Array.isArray(step?.branches) ? step.branches : []
  const custom = step?.location_cities
  const rid = String(cityId || '').trim()
  if (rid) {
    return branches.filter((b) => String(b.region || '').trim() === rid)
  }
  if (Array.isArray(custom) && custom.length > 0) {
    const cityKey = String(cityLabel || '').trim()
    const hit = custom.find(
      (c) => String(c.label || '').trim() === cityKey || String(c.id || '').trim() === cityKey
    )
    const id = hit && hit.id != null ? String(hit.id).trim() : ''
    if (id) return branches.filter((b) => String(b.region || '').trim() === id)
  }
  const grp = LIFESCC_LOCATION_GROUPS.find((g) => g.label === String(cityLabel || '').trim())
  if (!grp) return []
  return branches.filter((b) => String(b.region || '').trim() === grp.id)
}

function LocationCitiesOnlyFlow({ title, cityOptions, onPickCity }) {
  const cities =
    Array.isArray(cityOptions) && cityOptions.length > 0
      ? cityOptions.map((c) => ({
          id: String(c.id || c.label || '').trim() || `c_${String(c.label)}`,
          label: String(c.label || '').trim(),
        })).filter((c) => c.label)
      : LIFESCC_LOCATION_GROUPS.map((g) => ({ id: g.id, label: g.label }))
  return (
    <div className="cc-runtime__loc-grid-flow">
      {title ? (
        <BotPromptBubble>
          <h3 className="cc-runtime__loc-title">{title}</h3>
        </BotPromptBubble>
      ) : null}
      <BotPromptBubble>
        <p className="cc-runtime__loc-sub cc-runtime__city-area-prompt">Choose a city area</p>
      </BotPromptBubble>
      <div className="cc-runtime__grid2">
        {cities.map((g) => (
          <button key={g.id} type="button" className="cc-runtime__tile-btn" onClick={() => onPickCity(g.label)}>
            {g.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function ServicesSegmentPicker({ onPick, segmentLabels }) {
  const labels = Array.isArray(segmentLabels) && segmentLabels.length > 0 ? segmentLabels.map((x) => String(x).trim()).filter(Boolean) : null
  const cats = labels
    ? labels.map((label) => {
        const fromCat = LIFESCC_DEFAULT_SERVICE_CATALOG.find((c) => c.label === label)
        return fromCat ? { id: fromCat.id, label: fromCat.label } : { id: label.replace(/\s+/g, '_').toLowerCase(), label }
      })
    : LIFESCC_DEFAULT_SERVICE_CATALOG.map((c) => ({ id: c.id, label: c.label }))
  return (
    <div className="cc-runtime__svc-catalog">
      <BotPromptBubble className="cc-runtime__bubble--utterance-tight">
        <p className="cc-runtime__loc-sub mb-0">Choose a category</p>
      </BotPromptBubble>
      <div className="cc-runtime__grid2">
        {cats.map((c) => (
          <button key={c.id} type="button" className="cc-runtime__tile-btn" onClick={() => onPick(c.label)}>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Rotating preview for treatments in the selected category (image + title when available). */
function TreatmentPreviewLoop({ items }) {
  const slides = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return []
    return items.map((s) => {
      const label = String(s.label || '').trim()
      const preview = label ? getChatbotTreatmentPreview(label) : null
      return { label, path: s.path, preview }
    })
  }, [items])

  const [i, setI] = useState(0)
  useEffect(() => {
    if (slides.length === 0) return undefined
    setI(0)
    const t = window.setInterval(() => {
      setI((j) => (j + 1) % slides.length)
    }, 2600)
    return () => window.clearInterval(t)
  }, [slides])

  if (slides.length === 0) return null
  const cur = slides[i] ?? slides[0]

  return (
    <div className="cc-runtime__treat-preview-loop" role="region" aria-live="polite" aria-label="Treatment preview">
      <p className="cc-runtime__treat-preview-loop-kicker">Featured in {cur.label}</p>
      <div className="cc-runtime__treat-preview-loop-card">
        {cur.preview ? (
          <>
            <div className="cc-runtime__treat-preview-loop-visual">
              <img src={cur.preview.image} alt="" className="cc-runtime__treat-preview-loop-img" loading="lazy" />
            </div>
            <p className="cc-runtime__treat-preview-loop-title">{cur.preview.title}</p>
          </>
        ) : (
          <p className="cc-runtime__treat-preview-loop-title cc-runtime__treat-preview-loop-title--solo">{cur.label}</p>
        )}
        <div className="cc-runtime__treat-preview-loop-dots" aria-hidden="true">
          {slides.map((_, di) => (
            <span key={di} className={`cc-runtime__treat-preview-loop-dot${di === i ? ' is-on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ServicesCatalogPicker({ onPick, pathOverrides = {} }) {
  const [catId, setCatId] = useState(null)

  const activeCat = catId ? LIFESCC_DEFAULT_SERVICE_CATALOG.find((c) => c.id === catId) : null
  const services = activeCat?.services ? activeCat.services : []

  const resolvePath = (svc) => {
    const o = pathOverrides[String(svc.label)]
    const path = typeof o === 'string' && o.trim() !== '' ? o.trim() : svc.path
    return { ...svc, path }
  }

  return (
    <div className="cc-runtime__svc-catalog">
      <div className="cc-runtime__grid3 cc-runtime__grid3--pillars">
        {LIFESCC_DEFAULT_SERVICE_CATALOG.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`cc-runtime__tile-btn${catId === c.id ? ' cc-runtime__tile-btn--on' : ''}`}
            onClick={() => {
              setCatId(c.id)
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {activeCat && services.length > 0 ? (
        <>
          <TreatmentPreviewLoop items={services.map((s) => resolvePath(s))} />
          <BotPromptBubble className="cc-runtime__bubble--utterance-tight cc-runtime__bubble--treat-pick-hint">
            <p className="cc-runtime__loc-sub mb-0">Pick a treatment</p>
          </BotPromptBubble>
          <div
            className="cc-runtime__choices cc-runtime__choices--services cc-runtime__choices--main-svc-grid"
            role="group"
            aria-label={`${activeCat.label} treatments`}
          >
            {services.map((s) => {
              const r = resolvePath(s)
              return (
                <button
                  key={r.label}
                  type="button"
                  className="btn btn-sm cc-runtime__choice-btn btn-outline-success"
                  onClick={() => onPick(r.label)}
                >
                  {r.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}

function locationNeedRegionStep(grouped) {
  const keys = [...grouped.keys()].filter((k) => (grouped.get(k) || []).length > 0)
  const named = keys.filter((k) => k !== '__all__')
  if (named.length >= 2) return true
  if (named.length >= 1 && keys.includes('__all__')) return true
  return false
}

function LocationGridFlow({ branches, title, isLast, onDone, resetKey }) {
  const grouped = useMemo(() => groupBranchesByRegionKey(branches), [branches])
  const needRegion = useMemo(() => locationNeedRegionStep(grouped), [grouped])

  const [mode, setMode] = useState(() => {
    const g = groupBranchesByRegionKey(branches)
    return locationNeedRegionStep(g) ? 'region' : 'branches'
  })
  const [regionKey, setRegionKey] = useState(null)
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    setMode(needRegion ? 'region' : 'branches')
    setRegionKey(null)
    setPicked(null)
  }, [needRegion, resetKey])

  const regionKeys = useMemo(
    () => [...grouped.keys()].filter((k) => (grouped.get(k) || []).length > 0),
    [grouped]
  )
  const branchRows = useMemo(() => {
    if (!needRegion) return branches.map((b, i) => ({ branch: b, index: i }))
    if (!regionKey) return []
    return grouped.get(regionKey) || []
  }, [needRegion, regionKey, grouped, branches])

  const lat = picked ? Number(picked.branch.lat) : NaN
  const lng = picked ? Number(picked.branch.lng) : NaN
  const hasMap = picked && Number.isFinite(lat) && Number.isFinite(lng)
  const mapBranch = hasMap ? { lat, lng } : null

  return (
    <div className="cc-runtime__loc-grid-flow">
      {title ? (
        <BotPromptBubble>
          <h3 className="cc-runtime__loc-title">{title}</h3>
        </BotPromptBubble>
      ) : null}

      {mode === 'region' ? (
        <div>
          <BotPromptBubble>
            <p className="cc-runtime__loc-sub">Choose a location</p>
          </BotPromptBubble>
          <div className="cc-runtime__grid2">
            {regionKeys.map((rk) => (
              <button
                key={rk}
                type="button"
                className="cc-runtime__tile-btn"
                onClick={() => {
                  setRegionKey(rk)
                  setMode('branches')
                }}
              >
                {lifesccLocationGroupLabel(rk)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {mode === 'branches' ? (
        <div>
          {needRegion ? (
            <button
              type="button"
              className="btn btn-link btn-sm p-0 mb-2 cc-runtime__back-mini"
              onClick={() => {
                setRegionKey(null)
                setMode('region')
              }}
            >
              ← Change location
            </button>
          ) : null}
          <BotPromptBubble>
            <p className="cc-runtime__loc-sub">Choose a branch</p>
          </BotPromptBubble>
          <div className="cc-runtime__grid2">
            {branchRows.map(({ branch: b }) => (
              <button
                key={b.id || `${b.name}-${String(b.address || '').slice(0, 12)}`}
                type="button"
                className="cc-runtime__tile-btn"
                onClick={() => {
                  setPicked({ branch: b })
                  setMode('detail')
                }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {mode === 'detail' && picked ? (
        <div className="cc-runtime__loc-detail">
          <button
            type="button"
            className="btn btn-link btn-sm p-0 mb-2 cc-runtime__back-mini"
            onClick={() => {
              setPicked(null)
              setMode(needRegion ? 'branches' : 'branches')
            }}
          >
            ← Pick another branch
          </button>
          <BotPromptBubble>
            <strong className="cc-runtime__loc-detail-name">{picked.branch.name}</strong>
            <p className="cc-runtime__loc-detail-addr">{picked.branch.address}</p>
            <p className="cc-runtime__loc-detail-phone mb-0">
              <a href={`tel:${String(picked.branch.phone).replace(/\s/g, '')}`}>{picked.branch.phone}</a>
            </p>
          </BotPromptBubble>
          {mapBranch ? (
            <a
              className="cc-runtime__loc-map-tile"
              href={googleMapsDirectionsUrl(mapBranch)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open branch in Google Maps"
            >
              <span className="cc-runtime__loc-map-tile-inner">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" className="cc-runtime__loc-map-pin">
                  <path
                    fill="currentColor"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                  />
                </svg>
                <span className="cc-runtime__loc-map-tile-cap">Maps</span>
              </span>
            </a>
          ) : null}
          <button type="button" className="btn btn-success btn-sm mt-2" onClick={() => onDone()}>
            {isLast ? 'Send' : 'Continue'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function parseMainServiceCarouselAnswer(raw) {
  if (typeof raw !== 'string' || !raw.trim().startsWith('{')) return null
  try {
    const o = JSON.parse(raw)
    if (!o || typeof o !== 'object') return null
    const svc = o.service
    if (!svc || typeof svc.label !== 'string' || String(svc.label).trim() === '') return null
    const href = typeof svc.href === 'string' && svc.href.trim() !== '' ? svc.href.trim() : '#'
    return {
      pillar: typeof o.pillar === 'string' ? o.pillar.trim() : '',
      label: String(svc.label).trim(),
      href,
    }
  } catch {
    return null
  }
}

/** Site widget: service page link → city → branches → branch card + follow-up actions. */
function SiteNearMeFlow({ step, serviceAnswer, onSubmitSelection, onBackToServiceList }) {
  const [phase, setPhase] = useState('city')
  const [cityLabel, setCityLabel] = useState('')
  const [cityId, setCityId] = useState('')
  const [branch, setBranch] = useState(null)
  const [slotPanelOpen, setSlotPanelOpen] = useState(false)

  const svc = useMemo(() => parseMainServiceCarouselAnswer(serviceAnswer), [serviceAnswer])
  const preview = useMemo(() => (svc ? getChatbotTreatmentPreview(svc.label) : null), [svc])

  useEffect(() => {
    setPhase('city')
    setCityLabel('')
    setCityId('')
    setBranch(null)
    setSlotPanelOpen(false)
  }, [serviceAnswer])

  const cities = useMemo(() => {
    const raw = step?.location_cities
    if (Array.isArray(raw) && raw.length > 0) {
      return raw
        .map((c) => ({
          id: String(c.id || c.label || '').trim() || `c_${String(c.label)}`,
          label: String(c.label || '').trim(),
        }))
        .filter((c) => c.label)
    }
    return LIFESCC_LOCATION_GROUPS.map((g) => ({ id: g.id, label: g.label }))
  }, [step])

  const branchRows = useMemo(() => {
    if (!cityLabel && !cityId) return []
    return branchesForSiteNearMeStep(cityLabel, cityId, step)
  }, [cityLabel, cityId, step])

  const mapPt = useMemo(() => {
    if (!branch) return null
    const lat = Number(branch.lat)
    const lng = Number(branch.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { lat, lng }
  }, [branch])

  const openServiceInNewTab = svc && /^https?:\/\//i.test(svc.href)

  const buildPayload = (followUp) => {
    if (!branch || !cityLabel) return ''
    return JSON.stringify({
      city: { id: cityId, label: cityLabel },
      branch: {
        id: String(branch.id || ''),
        name: String(branch.name || ''),
        address: String(branch.address || ''),
        phone: String(branch.phone || ''),
        region: String(branch.region || ''),
        lat: branch.lat != null ? String(branch.lat) : '',
        lng: branch.lng != null ? String(branch.lng) : '',
      },
      follow_up: followUp,
    })
  }

  return (
    <div className="cc-runtime__near-me-flow">
      {svc ? (
        <div className="cc-runtime__near-me-svc-row">
          {preview ? (
            <a
              className="cc-runtime__near-me-preview"
              href={svc.href}
              {...(openServiceInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <img src={preview.image} alt="" className="cc-runtime__near-me-preview-img" loading="lazy" />
            </a>
          ) : null}
          <div className="cc-runtime__near-me-svc-copy">
            <a
              className="cc-runtime__inline-link"
              href={svc.href}
              {...(openServiceInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              View {svc.label}
            </a>
            {preview ? <p className="cc-runtime__near-me-preview-caption">{preview.title}</p> : null}
          </div>
        </div>
      ) : (
        <p className="cc-runtime__muted small mb-2">Choose a service in the previous step to see its page link here.</p>
      )}

      {step.title ? (
        <BotPromptBubble>
          <h3 className="cc-runtime__loc-title">{step.title}</h3>
        </BotPromptBubble>
      ) : null}

      {phase === 'city' ? (
        <div className="cc-runtime__grid2 cc-runtime__grid2--near-me-cities">
          {cities.map((c) => (
            <button
              key={c.id}
              type="button"
              className="cc-runtime__tile-btn"
              onClick={() => {
                setCityLabel(c.label)
                setCityId(c.id)
                setBranch(null)
                setPhase('branches')
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : null}

      {phase === 'branches' ? (
        <>
          <button
            type="button"
            className="btn btn-link btn-sm p-0 mb-2 cc-runtime__back-mini"
            onClick={() => {
              setPhase('city')
              setCityLabel('')
              setCityId('')
              setBranch(null)
            }}
          >
            ← Change city
          </button>
          {branchRows.length === 0 ? (
            <p className="cc-runtime__muted small mb-0">No branches for this area.</p>
          ) : (
            <div
              className="cc-runtime__choices cc-runtime__choices--services cc-runtime__choices--main-svc-grid"
              role="group"
              aria-label="Branches"
            >
              {branchRows.map((b) => (
                <button
                  key={b.id || b.name}
                  type="button"
                  className="btn btn-sm cc-runtime__choice-btn btn-outline-success"
                  onClick={() => {
                    setBranch(b)
                    setPhase('detail')
                  }}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </>
      ) : null}

      {phase === 'detail' && branch ? (
        <>
          <button
            type="button"
            className="btn btn-link btn-sm p-0 mb-2 cc-runtime__back-mini"
            onClick={() => {
              setBranch(null)
              setPhase('branches')
            }}
          >
            ← Other branches
          </button>
          <div className="cc-runtime__near-me-detail-card">
            <div className="cc-runtime__near-me-detail-text">
              <strong className="cc-runtime__near-me-detail-name">{branch.name}</strong>
              <p className="cc-runtime__near-me-detail-addr">{branch.address}</p>
              {branch.phone ? (
                <p className="cc-runtime__near-me-detail-phone mb-0">
                  <a href={`tel:${String(branch.phone).replace(/\s/g, '')}`}>{branch.phone}</a>
                </p>
              ) : null}
            </div>
            {mapPt ? (
              <a
                className="cc-runtime__near-me-map-circle"
                href={googleMapsDirectionsUrl(mapPt)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in Google Maps"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="cc-runtime__near-me-map-pin">
                  <path
                    fill="currentColor"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                  />
                </svg>
              </a>
            ) : null}
          </div>
          <div className="cc-runtime__near-me-actions" role="group" aria-label="Next steps">
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => onSubmitSelection(buildPayload('request_callback'))}
            >
              Request call
            </button>
            <button type="button" className="btn btn-outline-success btn-sm" onClick={() => setSlotPanelOpen(true)}>
              Slot booking
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onBackToServiceList}>
              Back to service list
            </button>
          </div>
          {slotPanelOpen ? (
            <div className="cc-runtime__near-me-slot-overlay" role="dialog" aria-modal="true" aria-label="Book a slot">
              <div className="cc-runtime__near-me-slot-panel">
                <div className="cc-runtime__near-me-slot-head">
                  <strong className="cc-runtime__near-me-slot-title">Book a slot</strong>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setSlotPanelOpen(false)}>
                    Close
                  </button>
                </div>
                <BookSlotInline
                  className="book-slot-inline--widget"
                  serviceLayout="buttons"
                  serviceOptionList={SLOT_SERVICE_BOOKING_OPTIONS}
                  initialServiceLabel={svc?.label}
                  onBookingSuccess={() => {
                    onSubmitSelection(buildPayload('slot_booking'))
                    setSlotPanelOpen(false)
                  }}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

function LoopAnimator({ lines, title }) {
  const clean = useMemo(() => (Array.isArray(lines) ? lines.map((l) => String(l).trim()).filter(Boolean) : []), [lines])
  const [i, setI] = useState(0)
  useEffect(() => {
    if (clean.length === 0) return undefined
    const t = window.setInterval(() => {
      setI((j) => (j + 1) % clean.length)
    }, 2600)
    return () => window.clearInterval(t)
  }, [clean.length])
  if (clean.length === 0) return null
  return (
    <BotPromptBubble className="cc-runtime__bubble--utterance-loop">
      <div className="cc-runtime__loop-anim" aria-live="polite">
        {title ? <p className="cc-runtime__loop-title">{title}</p> : null}
        <div className="cc-runtime__loop-line" key={i}>
          {clean[i]}
        </div>
        <div className="cc-runtime__loop-dots" aria-hidden="true">
          {clean.map((_, di) => (
            <span key={di} className={`cc-runtime__loop-dot${di === i ? ' cc-runtime__loop-dot--on' : ''}`} />
          ))}
        </div>
      </div>
    </BotPromptBubble>
  )
}

export default function CustomChatbotRuntime({ chatbot, onClose }) {
  const steps = useMemo(() => (Array.isArray(chatbot?.steps) ? chatbot.steps : []), [chatbot])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const [done, setDone] = useState(false)
  const [doneNote, setDoneNote] = useState(null)
  const scrollElRef = useRef(null)
  const answersRef = useRef({})
  const [engagementSession, setEngagementSession] = useState(0)
  /** Site embedded engagement email: only after a real user action (not panel auto-open). */
  const [userHasInteracted, setUserHasInteracted] = useState(false)

  const step = steps[idx] ?? null
  const isLast = steps.length > 0 && idx === steps.length - 1

  const leadFirstName = useMemo(
    () => firstNameFromFullName(getAnswerForMapTo(steps, answers, 'full_name')),
    [steps, answers]
  )

  const messageTypingSegments = useMemo(() => {
    if (step?.type !== 'message') return null
    return getTypingSegments(step)
  }, [
    step?.type,
    step?.id,
    step?.content,
    JSON.stringify(Array.isArray(step?.typing_segments) ? step.typing_segments : null),
  ])
  const showMessageTyping = Boolean(messageTypingSegments && messageTypingSegments.length >= 2)
  const typingPauses = useMemo(() => {
    if (!step || step.type !== 'message' || !Array.isArray(step.typing_pause_ms)) return null
    return step.typing_pause_ms.map((n) => Number(n))
  }, [step])

  const [messageContinueReady, setMessageContinueReady] = useState(false)
  const [typingRunTick, setTypingRunTick] = useState(0)

  useLayoutEffect(() => {
    if (!showMessageTyping) setMessageContinueReady(true)
    else setMessageContinueReady(false)
  }, [showMessageTyping, step?.id, idx])

  const firstLocationIdx = useMemo(
    () => steps.findIndex((s) => s.type === 'location' || s.type === 'branches' || s.type === 'site_near_me'),
    [steps]
  )
  const firstCallSpecialistIdx = useMemo(() => steps.findIndex((s) => s.type === 'call_specialist'), [steps])
  const firstMessageIdx = useMemo(() => steps.findIndex((s) => s.type === 'message'), [steps])
  const isFirstMessageStep = Boolean(
    step?.type === 'message' && firstMessageIdx >= 0 && idx === firstMessageIdx
  )

  const jumpToStepIndex = useCallback(
    (i) => {
      if (i < 0 || i >= steps.length) return
      setIdx(i)
      setErr(null)
    },
    [steps.length]
  )

  const resetConversation = useCallback(() => {
    setIdx(0)
    setAnswers({})
    setDraft('')
    setErr(null)
    setDone(false)
    setDoneNote(null)
    setBusy(false)
    setTypingRunTick((t) => t + 1)
    setUserHasInteracted(false)
    setEngagementSession((n) => n + 1)
  }, [])

  useEffect(() => {
    setIdx(0)
    setAnswers({})
    setDraft('')
    setErr(null)
    setDone(false)
    setDoneNote(null)
    setUserHasInteracted(false)
    setEngagementSession((n) => n + 1)
  }, [chatbot?.id])

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  /** Site embedded bot only: after 30s from first user interaction, snapshot answers to `chatbot_user` + admin email. */
  useEffect(() => {
    const cid = Number(chatbot?.id)
    if (!Number.isFinite(cid) || cid !== SITE_EMBEDDED_CHATBOT_ID) return undefined
    if (!userHasInteracted) return undefined
    const startedAt = Date.now()
    const tid = window.setTimeout(() => {
      const dwell = Math.max(30, Math.min(86400, Math.floor((Date.now() - startedAt) / 1000)))
      const payload = JSON.stringify(answersRef.current ?? {})
      void fetch('/api/public/chatbot-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbot_id: cid,
          dwell_seconds: dwell,
          payload_json: payload,
        }),
      }).catch(() => {})
    }, 30_000)
    return () => window.clearTimeout(tid)
  }, [chatbot?.id, engagementSession, userHasInteracted])

  /** After each user turn, smoothly scroll so the latest user bubble sits at the top of the pane (under the header). */
  useEffect(() => {
    const root = scrollElRef.current
    if (!root || done) return
    const users = root.querySelectorAll('.cc-runtime__bubble--user')
    const last = users[users.length - 1]
    const frame = window.requestAnimationFrame(() => {
      if (last) {
        const r = root.getBoundingClientRect()
        const u = last.getBoundingClientRect()
        const nextTop = Math.max(0, root.scrollTop + (u.top - r.top))
        root.scrollTo({ top: nextTop, behavior: 'smooth' })
      } else {
        root.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [idx, answers, done])

  useEffect(() => {
    if (
      !step ||
      step.type === 'message' ||
      step.type === 'choice' ||
      step.type === 'services' ||
      step.type === 'branches' ||
      step.type === 'site_near_me'
    ) {
      return
    }
    if (step.type === 'text' || step.type === 'textarea') {
      const existing = answers[step.id]
      setDraft(typeof existing === 'string' ? existing : '')
    }
  }, [step, answers])

  const submitLeadWith = useCallback(
    async (payloadAnswers) => {
      setBusy(true)
      setErr(null)
      try {
        const res = await fetch('/api/public/custom-chatbot-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatbot_id: chatbot.id,
            answers: payloadAnswers,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setErr(typeof data.error === 'string' ? data.error : 'Could not send')
          setBusy(false)
          return
        }
        setDone(true)
        setDoneNote(typeof data.message === 'string' ? data.message : null)
      } catch {
        setErr('Network error')
      } finally {
        setBusy(false)
      }
    },
    [chatbot?.id]
  )

  const goAfterAnswer = useCallback(
    (mergedAnswers) => {
      setUserHasInteracted(true)
      setAnswers(mergedAnswers)
      if (!isLast) {
        setIdx((j) => j + 1)
      } else {
        void submitLeadWith(mergedAnswers)
      }
    },
    [isLast, submitLeadWith]
  )

  const continueAck = (stepId, ack = '✓') => {
    setErr(null)
    const merged = { ...answers, [stepId]: ack }
    goAfterAnswer(merged)
  }

  const onMessageNext = useCallback((fromUser = false) => {
    if (fromUser) setUserHasInteracted(true)
    setErr(null)
    if (!step) return
    if (step.type === 'message') {
      if (isLast) void submitLeadWith(answers)
      else setIdx((j) => j + 1)
      return
    }
    if (step.type === 'call_specialist') {
      const merged = { ...answers, [step.id]: 'info_viewed' }
      setAnswers(merged)
      if (isLast) void submitLeadWith(merged)
      else setIdx((j) => j + 1)
      return
    }
  }, [step, answers, isLast, submitLeadWith])

  /** Later message steps and all call-specialist steps advance on their own (Continue only on first message). */
  useEffect(() => {
    if (done) return
    if (!step || step.type !== 'message' || busy) return
    if (firstMessageIdx < 0 || idx === firstMessageIdx) return
    if (showMessageTyping && !messageContinueReady) return
    const delay = showMessageTyping ? 550 : 1000
    const tid = window.setTimeout(() => {
      onMessageNext()
    }, delay)
    return () => window.clearTimeout(tid)
  }, [step?.id, step?.type, idx, firstMessageIdx, showMessageTyping, messageContinueReady, busy, done, onMessageNext])

  useEffect(() => {
    if (done) return
    if (!step || step.type !== 'call_specialist' || busy) return
    const tid = window.setTimeout(() => {
      onMessageNext()
    }, 1000)
    return () => window.clearTimeout(tid)
  }, [step?.id, step?.type, busy, done, onMessageNext])

  const onChoicePick = (val) => {
    if (!step || (step.type !== 'choice' && step.type !== 'services')) return
    setErr(null)
    if (step.type === 'choice') {
      if (String(val) === CHOICE_RESTART_LABEL) {
        resetConversation()
        return
      }
      if (String(val) === CHOICE_QUIT_LABEL) {
        if (typeof onClose === 'function') onClose()
        return
      }
    }
    const merged = { ...answers, [step.id]: val }
    goAfterAnswer(merged)
  }

  const onTextSubmit = (e) => {
    e.preventDefault()
    if (!step || (step.type !== 'text' && step.type !== 'textarea')) return
    setErr(null)
    const v = draft.trim()
    if ((step.required ?? false) && !v) {
      setErr('This field is required')
      return
    }
    const merged = { ...answers, [step.id]: v }
    goAfterAnswer(merged)
  }

  const loopJumpTo = (targetId) => {
    if (!targetId) {
      setIdx(0)
      return
    }
    const j = steps.findIndex((s) => s.id === targetId)
    setIdx(j >= 0 ? j : 0)
  }

  if (steps.length === 0) {
    return (
      <div className="cc-runtime cc-runtime--with-glass">
        <GlassChatHeader
          onClose={onClose}
          onReset={resetConversation}
          firstLocationIdx={firstLocationIdx}
          firstCallSpecialistIdx={firstCallSpecialistIdx}
          onJumpLocations={() => jumpToStepIndex(firstLocationIdx)}
          onJumpCallSpecialist={() => jumpToStepIndex(firstCallSpecialistIdx)}
        />
        <div className="cc-runtime__body">
          <div ref={scrollElRef} className="cc-runtime__body-scroll">
            <p className="cc-runtime__muted">This assistant has no steps yet.</p>
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="cc-runtime cc-runtime--with-glass">
        <GlassChatHeader
          onClose={onClose}
          onReset={resetConversation}
          firstLocationIdx={firstLocationIdx}
          firstCallSpecialistIdx={firstCallSpecialistIdx}
          onJumpLocations={() => {
            setDone(false)
            jumpToStepIndex(firstLocationIdx)
          }}
          onJumpCallSpecialist={() => {
            setDone(false)
            jumpToStepIndex(firstCallSpecialistIdx)
          }}
        />
        <div className="cc-runtime__body">
          <div ref={scrollElRef} className="cc-runtime__body-scroll">
            <p className="cc-runtime__success">Thank you! We have received your details.</p>
            {doneNote ? <p className="cc-runtime__hint">{doneNote}</p> : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cc-runtime cc-runtime--with-glass">
      <GlassChatHeader
        onClose={onClose}
        onReset={resetConversation}
        firstLocationIdx={firstLocationIdx}
        firstCallSpecialistIdx={firstCallSpecialistIdx}
        onJumpLocations={() => jumpToStepIndex(firstLocationIdx)}
        onJumpCallSpecialist={() => jumpToStepIndex(firstCallSpecialistIdx)}
      />
      <div className="cc-runtime__body">
        <div ref={scrollElRef} className="cc-runtime__body-scroll">
        {steps.slice(0, idx).map((s) => {
          if (s.type === 'message' || s.type === 'call_specialist') {
            const text = s.type === 'message' ? messageHistoryText(s) : s.message
            return (
              <BotAvatarRow key={s.id}>
                <div
                  className={`cc-runtime__bubble cc-runtime__bubble--bot${s.type === 'message' ? ' cc-runtime__typing-popins' : ''}`}
                  role="status"
                >
                  {text}
                </div>
              </BotAvatarRow>
            )
          }
          if (s.type === 'location') {
            const locAns = answers[s.id]
            const citiesOnly = s.location_source === 'lifescc_site' && s.location_scope === 'cities_only'
            const cityPicked =
              citiesOnly &&
              typeof locAns === 'string' &&
              locAns.trim() !== '' &&
              locAns !== 'locations_viewed'
            if (cityPicked) {
              const cityKey = String(locAns).includes('·')
                ? String(locAns).split(/\s*·\s*/)[0].trim()
                : String(locAns).trim()
              const cityBranches = branchesForLocationCityAnswer(locAns, s)
              return (
                <BotAvatarRow key={s.id}>
                  <div className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--compact" role="status">
                    <span className="cc-runtime__city-area-prompt">Choose a city area</span>
                    <p className="cc-runtime__loc-history-picked mb-1">{cityKey}</p>
                    {cityBranches.length > 0 ? (
                      <ul className="cc-runtime__loc-history-branches list-unstyled mb-0">
                        {cityBranches.map((b) => (
                          <li key={b.id} className="cc-runtime__loc-history-branch">
                            {b.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="cc-runtime__loc-history-empty mb-0">No branches listed for this area.</p>
                    )}
                  </div>
                </BotAvatarRow>
              )
            }
            return (
              <BotAvatarRow key={s.id}>
                <div className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--compact" role="status">
                  <strong>{s.title || 'Locations'}</strong>
                  <span className="text-muted"> · {(s.branches || []).length} branch(es)</span>
                </div>
              </BotAvatarRow>
            )
          }
          if (s.type === 'branches') {
            return (
              <BotAvatarRow key={s.id}>
                <div className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--compact" role="status">
                  <strong>{s.title || 'Branches'}</strong>
                  <span className="text-muted"> · {(s.branches || []).length} branch(es)</span>
                </div>
              </BotAvatarRow>
            )
          }
          if (s.type === 'site_near_me') {
            return (
              <BotAvatarRow key={s.id}>
                <div className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--compact" role="status">
                  <strong>{s.title || 'Find a branch'}</strong>
                  <span className="text-muted"> · {(s.branches || []).length} branch(es)</span>
                </div>
              </BotAvatarRow>
            )
          }
          if (s.type === 'loop') {
            return (
              <BotAvatarRow key={s.id}>
                <div className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__bubble--compact" role="status">
                  Loop · {(s.animated_lines || []).length} lines
                </div>
              </BotAvatarRow>
            )
          }
          const ans = answers[s.id]
          if (ans === undefined || ans === '') return null
          if (
            s.type === 'choice' ||
            s.type === 'services' ||
            s.type === 'nav_service_select' ||
            s.type === 'main_service_carousel' ||
            s.type === 'site_near_me'
          ) {
            return (
              <div key={s.id} className="cc-runtime__bubble cc-runtime__bubble--user" role="status">
                <span className="cc-runtime__bubble-label">{stepLabel(s)}</span>
                <span className="cc-runtime__user-badge">{formatUserAnswerForBadge(s, ans)}</span>
              </div>
            )
          }
          return (
            <div key={s.id} className="cc-runtime__bubble cc-runtime__bubble--user" role="status">
              <span className="cc-runtime__bubble-label">{stepLabel(s)}</span>
              <span className="cc-runtime__user-badge">{formatUserAnswerForBadge(s, ans)}</span>
            </div>
          )
        })}

        {busy ? (
          <p className="cc-runtime__muted" role="status">
            Sending…
          </p>
        ) : null}
        {err ? (
          <div className="cc-runtime__card">
            <p className="cc-runtime__err">{err}</p>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mt-1"
              onClick={() => {
                setUserHasInteracted(true)
                void submitLeadWith(answers)
              }}
            >
              Try again
            </button>
          </div>
        ) : null}

        {step && !busy ? (
          <>
            {(step.type === 'message' || step.type === 'call_specialist') && (
              <div className="cc-runtime__card cc-runtime__card--message-only">
                <BotAvatarRow>
                  {step.type === 'message' && showMessageTyping ? (
                    <SegmentedRevealBotMessage
                      key={typingRunTick}
                      segments={messageTypingSegments}
                      pauseMs={typingPauses}
                      onComplete={() => setMessageContinueReady(true)}
                    />
                  ) : (
                    <div
                      className="cc-runtime__bubble cc-runtime__bubble--bot cc-runtime__typing-popins cc-runtime__bubble--reveal-in"
                      role="region"
                    >
                      {step.type === 'message' ? messageHistoryText(step) : step.message}
                    </div>
                  )}
                </BotAvatarRow>
              </div>
            )}

            {step.type === 'site_near_me' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  <SiteNearMeFlow
                    key={step.id}
                    step={step}
                    serviceAnswer={answers[String(step.service_step_id || '').trim()]}
                    onSubmitSelection={(json) => {
                      setErr(null)
                      goAfterAnswer({ ...answers, [step.id]: json })
                    }}
                    onBackToServiceList={() => {
                      const sid = String(step.service_step_id || '').trim()
                      const si = steps.findIndex((x) => x.id === sid)
                      if (si < 0) return
                      setErr(null)
                      setUserHasInteracted(true)
                      setAnswers((prev) => {
                        const next = { ...prev }
                        for (let j = si; j < steps.length; j++) {
                          delete next[steps[j].id]
                        }
                        return next
                      })
                      setIdx(si)
                    }}
                  />
                </BotAvatarRow>
              </div>
            ) : null}

            {step.type === 'location' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  {(() => {
                    const siteMode = step.location_source === 'lifescc_site'
                    const citiesOnly = siteMode && step.location_scope === 'cities_only'
                    if (citiesOnly) {
                      return (
                        <LocationCitiesOnlyFlow
                          key={step.id}
                          title={step.title || 'Our locations'}
                          cityOptions={step.location_cities}
                          onPickCity={(label) => continueAck(step.id, label)}
                        />
                      )
                    }
                    const useGrid = siteMode || step.location_ui === 'grid'
                    const branchesList = siteMode ? LIFESCC_BRANCHES : step.branches || []
                    if (useGrid) {
                      return (
                        <LocationGridFlow
                          key={step.id}
                          resetKey={step.id}
                          branches={branchesList}
                          title={step.title || 'Our branches'}
                          isLast={isLast}
                          onDone={() => continueAck(step.id, 'locations_viewed')}
                        />
                      )
                    }
                    return (
                      <div className="cc-runtime__loc-bot-wrap">
                        {step.title ? (
                          <BotPromptBubble>
                            <h3 className="cc-runtime__loc-title">{step.title}</h3>
                          </BotPromptBubble>
                        ) : null}
                        <ul className="cc-runtime__branch-list list-unstyled mb-0">
                          {(step.branches || []).map((b, bi) => {
                            const lat = Number(b.lat)
                            const lng = Number(b.lng)
                            const hasMap = Number.isFinite(lat) && Number.isFinite(lng)
                            const fakeBranch = hasMap ? { lat, lng } : null
                            return (
                              <li key={bi} className="cc-runtime__branch">
                                <strong>{b.name}</strong>
                                <p className="cc-runtime__branch-addr mb-1">{b.address}</p>
                                <p className="cc-runtime__branch-phone mb-2">
                                  <a href={`tel:${String(b.phone).replace(/\s/g, '')}`}>{b.phone}</a>
                                </p>
                                {hasMap && fakeBranch ? (
                                  <div className="cc-runtime__map-wrap">
                                    <iframe
                                      title={`Map ${b.name}`}
                                      className="cc-runtime__map-iframe"
                                      loading="lazy"
                                      referrerPolicy="no-referrer-when-downgrade"
                                      src={googleMapsEmbedUrl(fakeBranch)}
                                    />
                                    <a
                                      className="small d-inline-block mt-1"
                                      href={googleMapsDirectionsUrl(fakeBranch)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Open in Google Maps
                                    </a>
                                  </div>
                                ) : null}
                              </li>
                            )
                          })}
                        </ul>
                        <button type="button" className="btn btn-success btn-sm mt-2" onClick={() => continueAck(step.id, 'locations_viewed')}>
                          {isLast ? 'Send' : 'Continue'}
                        </button>
                      </div>
                    )
                  })()}
                </BotAvatarRow>
              </div>
            ) : null}

            {step.type === 'branches' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  <div className="cc-runtime__loc-bot-wrap">
                    {step.title ? (
                      <BotPromptBubble>
                        <h3 className="cc-runtime__loc-title">{step.title}</h3>
                      </BotPromptBubble>
                    ) : null}
                    <ul className="cc-runtime__branch-list list-unstyled mb-0">
                      {(step.branches || []).map((b, bi) => {
                        const lat = Number(b.lat)
                        const lng = Number(b.lng)
                        const hasMap = Number.isFinite(lat) && Number.isFinite(lng)
                        const fakeBranch = hasMap ? { lat, lng } : null
                        return (
                          <li key={bi} className="cc-runtime__branch">
                            <strong>{b.name}</strong>
                            <p className="cc-runtime__branch-addr mb-1">{b.address}</p>
                            <p className="cc-runtime__branch-phone mb-2">
                              <a href={`tel:${String(b.phone).replace(/\s/g, '')}`}>{b.phone}</a>
                            </p>
                            {hasMap && fakeBranch ? (
                              <div className="cc-runtime__map-wrap">
                                <iframe
                                  title={`Map ${b.name}`}
                                  className="cc-runtime__map-iframe"
                                  loading="lazy"
                                  referrerPolicy="no-referrer-when-downgrade"
                                  src={googleMapsEmbedUrl(fakeBranch)}
                                />
                                <a
                                  className="small d-inline-block mt-1"
                                  href={googleMapsDirectionsUrl(fakeBranch)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Open in Google Maps
                                </a>
                              </div>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>
                    <button type="button" className="btn btn-success btn-sm mt-2" onClick={() => continueAck(step.id, 'branches_viewed')}>
                      {isLast ? 'Send' : 'Continue'}
                    </button>
                  </div>
                </BotAvatarRow>
              </div>
            ) : null}

            {step.type === 'choice' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  <BotPromptBubble>
                    <p className="cc-runtime__q">{step.label}</p>
                  </BotPromptBubble>
                  <div
                    className={`cc-runtime__choices${
                      step.choice_style === 'main_services'
                        ? ' cc-runtime__choices--services cc-runtime__choices--main-services'
                        : step.choice_style === 'services'
                          ? ' cc-runtime__choices--services'
                          : ''
                    }`.trim()}
                  >
                    {(step.options || []).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`btn btn-sm cc-runtime__choice-btn${
                          step.choice_style === 'main_services' || step.choice_style === 'services'
                            ? ' btn-outline-success'
                            : ' btn-outline-primary'
                        }`}
                        onClick={() => onChoicePick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </BotAvatarRow>
              </div>
            ) : null}

            {step.type === 'main_service_carousel' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  <BotPromptBubble>
                    <p className="cc-runtime__q">{step.label}</p>
                  </BotPromptBubble>
                  <MainServiceCarouselFlow
                    key={step.id}
                    pillarGroups={getNavbarServiceDropdownGroups()}
                    onComplete={(json) => {
                      setErr(null)
                      goAfterAnswer({ ...answers, [step.id]: json })
                    }}
                  />
                </BotAvatarRow>
              </div>
            ) : null}

            {step.type === 'services' ? (
              <div className="cc-runtime__card">
                <BotAvatarRow>
                  <BotPromptBubble>
                    <p className="cc-runtime__q">{step.label}</p>
                  </BotPromptBubble>
                </BotAvatarRow>
                {isServicesCatalogTreatmentsMode(step.services_catalog) ? (
                  <ServicesCatalogPicker onPick={onChoicePick} pathOverrides={step.services_page_map || {}} />
                ) : isServicesCatalogSegmentsMode(step.services_catalog) ? (
                  <ServicesSegmentPicker onPick={onChoicePick} segmentLabels={step.service_segments} />
                ) : (
                  <div className="cc-runtime__choices cc-runtime__choices--services">
                    {(step.options || []).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className="btn btn-sm cc-runtime__choice-btn btn-outline-success"
                        onClick={() => onChoicePick(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {step.type === 'loop' ? (
              <div className="cc-runtime__card cc-runtime__card--loop">
                <BotAvatarRow>
                  <LoopAnimator key={step.id} lines={step.animated_lines} title={step.title} />
                </BotAvatarRow>
                <div className="cc-runtime__loop-actions mt-3 d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-success btn-sm" onClick={() => continueAck(step.id, 'loop_continue')}>
                    {isLast ? 'Send' : 'Continue'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setErr(null)
                      setUserHasInteracted(true)
                      setAnswers((a) => ({ ...a, [step.id]: 'loop_restart' }))
                      loopJumpTo(step.target_step_id)
                    }}
                  >
                    Explore again
                  </button>
                </div>
              </div>
            ) : null}

            {step.type === 'text' || step.type === 'textarea' ? (
              <form className="cc-runtime__card" onSubmit={onTextSubmit}>
                <BotAvatarRow>
                  <BotPromptBubble>
                    {(step.mapTo === 'email' || step.mapTo === 'phone') && leadFirstName ? (
                      <p className="cc-runtime__bot-greet">Hi {leadFirstName},</p>
                    ) : null}
                    <label className="form-label cc-runtime__q" htmlFor={`cc-field-${step.id}`}>
                      {step.label}
                      {step.required ? <span className="text-danger"> *</span> : null}
                    </label>
                  </BotPromptBubble>
                </BotAvatarRow>
                <div className="cc-runtime__field-row">
                  {step.type === 'text' || step.mapTo === 'full_name' ? (
                    <input
                      id={`cc-field-${step.id}`}
                      type={step.mapTo === 'email' ? 'email' : step.mapTo === 'phone' ? 'tel' : 'text'}
                      className="form-control cc-runtime__field-input"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={step.placeholder || ''}
                      autoComplete={step.mapTo === 'email' ? 'email' : step.mapTo === 'phone' ? 'tel' : 'name'}
                    />
                  ) : (
                    <textarea
                      id={`cc-field-${step.id}`}
                      className="form-control cc-runtime__field-input"
                      rows={3}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={step.placeholder || ''}
                      autoComplete="off"
                    />
                  )}
                  <button type="submit" className="cc-runtime__field-arrow" aria-label={isLast ? 'Send' : 'Continue'} title={isLast ? 'Send' : 'Continue'}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            ) : null}
          </>
        ) : null}
        </div>
        {step && !busy && isFirstMessageStep && (!showMessageTyping || messageContinueReady) ? (
          <div className="cc-runtime__body-footer">
            <button
              type="button"
              className="cc-runtime__msg-continue-btn btn btn-success"
              onClick={() => onMessageNext(true)}
            >
              {isLast ? 'Send' : 'Continue'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
