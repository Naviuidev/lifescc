import { useState } from 'react'
import { Link } from 'react-router-dom'
import BookSlotModal from './BookSlotModal.jsx'
import { WEIGHT_LOSS_TREATMENTS } from '../constants/weightTreatments.js'
import './WeightLossTreatments.css'

const TEL_HREF = 'tel:+919533445566'

function LeafIcon() {
  return (
    <svg className="weight-loss-treatments__leaf" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function IconCalendar({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function IconPhone({ className }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
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

export default function WeightLossTreatments() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <section
      className="weight-loss-treatments"
      id="weight-loss-treatments"
      aria-labelledby="weight-loss-treatments-heading"
    >
      <div className="weight-loss-treatments__inner">
        <h2 id="weight-loss-treatments-heading" className="weight-loss-treatments__title">
          <LeafIcon />
          <span>Weight Loss Treatments</span>
        </h2>
        <div className="weight-loss-treatments__tagline">
          We use transformational advances in technology for weight management, beauty and wellness.
        </div>

        <div className="weight-loss-treatments__grid">
          {WEIGHT_LOSS_TREATMENTS.map((item) => (
            <article key={item.slug} id={item.slug} className="wlt-card">
              <Link className="wlt-card__link" to={item.to} aria-label={`${item.title} — open treatment page`}>
                <div className="wlt-card__media">
                  <img
                    className="wlt-card__img"
                    src={item.image}
                    alt={`${item.title} — treatment`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Link>

              <div className="wlt-card__body">
                <Link className="wlt-card__heading-link" to={item.to}>
                  <h3 className="wlt-card__heading">{item.title}</h3>
                </Link>

                <div className="wlt-card__footer">
                  <div className="wlt-card__icon-actions">
                    <button
                      type="button"
                      className="wlt-card__icon-btn"
                      aria-label={`Book a slot — ${item.title}`}
                      onClick={() => setBookSlotOpen(true)}
                    >
                      <IconCalendar />
                    </button>
                    <a className="wlt-card__icon-btn" href={TEL_HREF} aria-label="Call us">
                      <IconPhone />
                    </a>
                  </div>
                  <Link className="wlt-card__cta" to={item.to}>
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
