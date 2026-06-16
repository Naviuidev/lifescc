import { useCallback, useEffect, useRef, useState } from 'react'
import './BeforeAfterSlider.css'

const DEFAULT_POS = 50

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  showLabels = true,
  portrait = false,
}) {
  const [pos, setPos] = useState(DEFAULT_POS)
  const dragging = useRef(false)
  const containerRef = useRef(null)

  const setFromClientX = useCallback((clientX) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const p = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPos(p)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      setFromClientX(e.clientX)
    }
    const onUp = () => {
      dragging.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [setFromClientX])

  const onPointerDown = (e) => {
    if (e.target.closest?.('.ba-slider__handle')) return
    if (e.button != null && e.button !== 0) return
    dragging.current = true
    setFromClientX(e.clientX)
    if (typeof e.currentTarget.setPointerCapture === 'function') {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const onPointerDownHandle = (e) => {
    e.stopPropagation()
    if (e.button != null && e.button !== 0) return
    dragging.current = true
    setFromClientX(e.clientX)
    if (typeof e.currentTarget.setPointerCapture === 'function') {
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const rootClass = ['ba-slider', portrait ? 'ba-slider--portrait' : ''].filter(Boolean).join(' ')

  return (
    <div className="ba-slider-wrap">
      <div
        ref={containerRef}
        className={rootClass}
        onPointerDown={onPointerDown}
        role="group"
        aria-label={`${beforeLabel} and ${afterLabel} comparison. Drag the slider to compare.`}
      >
        {/* Bottom: after (right). Top: before (left) clipped so divider matches Before | After */}
        <img
          className="ba-slider__img ba-slider__img--after"
          src={afterSrc}
          alt=""
          draggable={false}
        />
        <img
          className="ba-slider__img ba-slider__img--before"
          src={beforeSrc}
          alt=""
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        />
        <div className="ba-slider__divider" style={{ left: `${pos}%` }} aria-hidden>
          <button
            type="button"
            className="ba-slider__handle"
            onPointerDown={onPointerDownHandle}
            aria-label="Drag to compare before and after"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            role="slider"
          >
            <span className="ba-slider__handle-arrows" aria-hidden>
              <svg className="ba-slider__tri" width="10" height="12" viewBox="0 0 10 12" aria-hidden>
                <path d="M8 1L2 6l6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="ba-slider__tri" width="10" height="12" viewBox="0 0 10 12" aria-hidden>
                <path d="M2 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
        {showLabels ? (
          <>
            <span className="ba-slider__tag ba-slider__tag--before">{beforeLabel}</span>
            <span className="ba-slider__tag ba-slider__tag--after">{afterLabel}</span>
          </>
        ) : null}
      </div>
    </div>
  )
}
