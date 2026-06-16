import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import heroSlide1 from '../assets/hero-slide-1.png'
import heroSlide2 from '../assets/hero-slide-2.png'
import heroSlide3 from '../assets/hero-slide-3.png'
import './HomeHeroSlider.css'

const AUTO_MS = 10000

/** Mobile-only background focal point (see HomeHeroSlider.css @media max-width 640px); order matches SLIDES */
const MOBILE_BG_FOCUS = ['treatment', 'face', 'subject']

const SLIDES = [
  {
    image: heroSlide2,
    variant: 'dark',
    tagline: 'Chilling your way to your dream figure',
    heading: 'Highly innovative technology',
    line1:
      'Life Slimming and Cosmetic Clinic is a cosmetic care facility based in Hyderabad that offers innovative treatments for obesity, skin and hair-related problems.',
  },
  {
    image: heroSlide1,
    variant: 'light',
    /** Panoramic asset: avoid cover cropping sides; letterbox uses hero background */
    bgFitWidth: true,
    bgFallback: '#faf6f2',
    tagline: 'The Best Treatments',
    heading: 'Get Your Dream Face Shape In Single Sitting',
    line1:
      'The bedding was hardly able to cover it and seemed ready to slide off any moment.',
    line2: 'His many legs, pitifully thin compared.',
  },
  {
    image: heroSlide3,
    variant: 'dark',
    tagline: 'Your transformation story',
    heading: 'Non-surgical paths to visible results',
    line1:
      'Targeted body and wellness solutions with transparent guidance—no guesswork, just a plan that fits.',
    line2: 'Limited-time offers available; ask our team what applies to your visit.',
  },
]

export default function HomeHeroSlider() {
  const [index, setIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timerRef = useRef(null)
  const n = SLIDES.length

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + n) % n)
    },
    [n],
  )

  useEffect(() => {
    if (reducedMotion) return undefined
    timerRef.current = window.setInterval(() => go(1), AUTO_MS)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [go, reducedMotion, index])

  const current = SLIDES[index]

  return (
    <section
      className="home-hero"
      data-variant={current.variant}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      <div className="home-hero__backgrounds" aria-hidden>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`home-hero__bg home-hero__bg--focus-${MOBILE_BG_FOCUS[i]}${
              slide.bgFitWidth ? ' home-hero__bg--fit-width' : ''
            }${i === index ? ' home-hero__bg--active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              ...(slide.bgFallback ? { backgroundColor: slide.bgFallback } : {}),
            }}
          />
        ))}
      </div>

      <div className={`home-hero__scrim home-hero__scrim--${current.variant}`} aria-hidden />

      <div className="home-hero__inner">
        <div
          className={`home-hero__content home-hero__content--${current.variant}`}
          key={index}
        >
          <p className="home-hero__tagline">{current.tagline}</p>
          <h1 className="home-hero__heading">{current.heading}</h1>
          <p className="home-hero__para">{current.line1}</p>
          {current.line2 ? <p className="home-hero__para">{current.line2}</p> : null}
          <div className="home-hero__actions">
            <Link className="home-hero__btn home-hero__btn--primary" to="/about-us">
              Know More
            </Link>
            <Link className="home-hero__btn home-hero__btn--secondary" to="/contact-us">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="home-hero__controls">
        <button
          type="button"
          className="home-hero__arrow"
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <span aria-hidden>‹</span>
        </button>
        <button
          type="button"
          className="home-hero__arrow"
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <div className="home-hero__dots" role="tablist" aria-label="Slide selection">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`home-hero__dot${i === index ? ' home-hero__dot--active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
