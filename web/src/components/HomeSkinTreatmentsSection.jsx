import { useState } from 'react'
import { Link } from 'react-router-dom'
import skinLightBanner from '../assets/ban-color.png'
import laserHairBanner from '../assets/ban-laser.png'
import antiAgeingBanner from '../assets/ban-ageing.png'
import scarBanner from '../assets/ban-scar.png'
import BookSlotModal from './BookSlotModal.jsx'
import './HomeSkinTreatmentsSection.css'

const TEL_HREF = 'tel:+919533445566'

const SKIN_CARDS = [
  { title: 'Skin Lightening', image: skinLightBanner, href: '/skin-lightening' },
  { title: 'Laser Hair Removal', image: laserHairBanner, href: '/laser-hair-removal' },
  { title: 'Anti Ageing', image: antiAgeingBanner, href: '/anti-ageing' },
  { title: 'Scar Mark Removal', image: scarBanner, href: '/acne-scar' },
]

function LeafIcon() {
  return (
    <svg className="home-skin-treatments__leaf" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19.5 4.5c-5.5 0-11 2.8-13 8.7-.6 1.7-.7 3.5-.4 5.3 1.8.3 3.6.2 5.3-.4 5.9-2 8.7-7.5 8.7-13z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.2 14.8c1.9-2 4.4-3.8 7.4-5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Homepage: skin treatment cards (same pattern as hair section). */
export default function HomeSkinTreatmentsSection() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <section className="home-skin-treatments" aria-labelledby="home-skin-treatments-heading">
      <div className="home-skin-treatments__shell">
        <header className="home-skin-treatments__head">
          <h2 id="home-skin-treatments-heading" className="home-skin-treatments__title">
            <LeafIcon />
            <span>Skin Treatments</span>
          </h2>
          <p className="home-skin-treatments__lead">
            Expert-led skin solutions using proven technology — tailored to your goals.
          </p>
        </header>

        <div className="home-skin-treatments__grid" role="list">
          {SKIN_CARDS.map((card) => (
            <article key={card.href} className="home-skin-card" role="listitem">
              <Link className="home-skin-card__link" to={card.href} aria-label={`${card.title} treatment`}>
                <div className="home-skin-card__media">
                  <img
                    src={card.image}
                    alt={`${card.title} banner`}
                    className="home-skin-card__img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Link>
              <div className="home-skin-card__body">
                <h3 className="home-skin-card__title">{card.title}</h3>
                <div className="home-skin-card__actions">
                  <div className="home-skin-card__icon-actions">
                    <button
                      type="button"
                      className="home-skin-card__icon-btn"
                      aria-label={`Book a slot — ${card.title}`}
                      onClick={() => setBookSlotOpen(true)}
                    >
                      <IconCalendar />
                    </button>
                    <a className="home-skin-card__icon-btn" href={TEL_HREF} aria-label={`Call us about ${card.title}`}>
                      <IconPhone />
                    </a>
                  </div>
                  <Link className="home-skin-card__cta" to={card.href}>
                    Know more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </section>
  )
}
