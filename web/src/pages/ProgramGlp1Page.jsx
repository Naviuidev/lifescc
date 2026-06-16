import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import gplHeroImg from '../assets/Gpl.png'
import ca1Img from '../assets/ca1.avif'
import ca2Img from '../assets/ca2.avif'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './ProgramGlp1Page.css'

const TRUST_BADGES = ['Premium Guidance', 'Modern Protocols', 'Long-Term Results']

const AUDIENCE_TEXT =
  'Maximize the benefits of GLP-1 therapy through personalized nutrition and lifestyle guidance.'

const PROGRAM_HIGHLIGHTS = [
  'Medical eligibility review before any medication plan',
  'Appetite, cravings, and portion control support',
  'Healthy, gradual fat-loss with expert oversight',
  'Nutrition plans aligned with GLP-1 therapy',
  'Progress tracking and side-effect monitoring',
  'Structured reviews to protect muscle and metabolism',
]

function IconHeartPulse() {
  return (
    <svg
      className="program-glp1-supports__heart"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function IconCheck({ className = 'program-glp1-supports__check' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l9 5v10l-9 5-9-5V7l9-5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 22V12M21 7l-9 5-9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

const GUIDANCE_CARDS = [
  {
    id: 'clinical-eligibility',
    number: '01',
    theme: 'blue',
    eyebrow: 'DAY 1 · MANDATORY',
    title: 'Clinical eligibility assessment',
    body:
      'Doctors review your health history, BMI, comorbidities, and relevant reports to determine whether GLP-1 therapy is appropriate and safe for you.',
    items: [
      'Individual suitability review',
      'Clear medical guidance from the start',
      'No one-size-fits-all prescriptions',
    ],
    footer: 'DAY 1 · DOCTOR-LED',
    icon: 'droplet',
  },
  {
    id: 'metabolic-monitoring',
    number: '02',
    theme: 'blue',
    eyebrow: 'LAB REVIEW · PERSONALIZED',
    title: 'Metabolic and health monitoring',
    body:
      'Track key markers — blood sugar, lipids, liver function, and body composition — to ensure therapy stays effective and well tolerated.',
    items: [
      'Data-led progress reviews',
      'Early identification of concerns',
      'Safer long-term outcomes',
    ],
    footer: 'EVERY 3–6 MONTHS',
    icon: 'chart',
  },
  {
    id: 'lifestyle-support',
    number: '03',
    theme: 'pink',
    eyebrow: 'MONTHLY · PRIVATE',
    title: 'Side-effect and lifestyle support',
    body:
      'Guidance on nausea, hydration, meal timing, activity, sleep, and daily routines to improve tolerance and reduce rebound risk after therapy.',
    items: [
      'Practical side-effect management',
      'Build sustainable daily habits',
      'Reduce discontinuation risk',
    ],
    footer: 'MONTHLY · CONFIDENTIAL',
    icon: 'heart',
  },
  {
    id: 'nutrition-coaching',
    number: '04',
    theme: 'amber',
    eyebrow: 'DIETITIAN · 2–4 CALLS / MONTH',
    title: 'GLP-1-aligned nutrition coaching',
    body:
      'Meal plans are tailored to smaller appetites, protein needs, and Indian kitchen preferences so you lose fat — not muscle or energy.',
    items: [
      'Protein-forward meal planning',
      'No generic diet charts',
      'Reviewed and updated monthly',
    ],
    footer: '2–4 CALLS / MONTH',
    icon: 'basket',
  },
]

function GuidanceCardIcon({ type }) {
  if (type === 'droplet') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3.5c3.2 5 6.5 8.4 6.5 11.8a6.5 6.5 0 1 1-13 0C5.5 11.9 8.8 8.5 12 3.5z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'chart') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M7 16V10M12 16V6M17 16v-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  if (type === 'heart') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20.2s-6.2-4-8.2-7.8C2.2 9.4 3.8 6.5 6.8 6.5c1.7 0 3.1.8 4 1.9 1-1.1 2.3-1.9 4-1.9 3 0 4.6 2.9 3 5.9-2 3.8-8.2 7.8-8.2 7.8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M5 12.5h2.5l1.5-1.5 2 2.5 2.5-3 3.5 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9h12l-1.2 10H7.2L6 9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const TRUST_STATS = [
  {
    id: 'members',
    stat: '10K+',
    label: 'Active members',
    body: 'A growing community committed to sustainable health transformation.',
    variant: 'light',
  },
  {
    id: 'sessions',
    stat: '500+',
    label: 'Programme sessions',
    body: 'Structured 360° journeys with medical supervision and monthly reviews.',
    variant: 'green',
  },
  {
    id: 'coaches',
    stat: '50+',
    label: 'Expert coaches',
    body: 'Specialists across nutrition, behavioural science, and clinical weight management.',
    variant: 'light',
  },
  {
    id: 'success',
    stat: '98%',
    label: 'Success rate',
    body: 'Clients who complete the programme maintain results with structured follow-up support.',
    variant: 'green',
  },
]

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.2 22 12 18.56 5.8 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  )
}

const HOW_IT_WORKS_CARDS = [
  {
    id: 'science-protocols',
    number: '01',
    icon: 'pill',
    title: 'Science-backed protocols',
    body:
      'These protocols use clinical nutrition guidelines that regulate appetite, fullness, and cellular energy to support healthier food choices.',
  },
  {
    id: 'feel-full',
    number: '02',
    icon: 'hourglass',
    title: 'Help you feel full longer',
    body:
      'By slowing digestion and improving satiety signals, they help reduce cravings and portion sizes when paired with lifestyle coaching.',
  },
  {
    id: 'proven-outcomes',
    number: '03',
    icon: 'clipboard-heart',
    title: 'Clinically proven outcomes',
    body:
      'Clinical studies show meaningful health improvements when dietary protocols are used with expert supervision and consistent follow-up.',
  },
  {
    id: 'safe-programme',
    number: '04',
    icon: 'shield',
    title: 'Safe and supported programme',
    body:
      'Our experts review history and progress regularly while dietitians guide day-to-day implementation for better tolerance.',
  },
  {
    id: 'balanced-diet',
    number: '05',
    icon: 'egg',
    title: 'Balanced diet remains essential',
    body:
      'Specialized advice supports the process, but sustainable outcomes still depend on protein quality, fiber intake, hydration, and habit consistency.',
  },
  {
    id: 'long-term-results',
    number: '06',
    icon: 'target',
    title: 'Maintain long-term results',
    body:
      'The goal is not short-term recovery only. We build routines and transitions that help you maintain results even after active coaching ends.',
  },
]

function HowItWorksIcon({ type }) {
  if (type === 'pill') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="8" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v8" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }
  if (type === 'hourglass') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 3h12M6 21h12M8 3l4 7-4 4 4 4-4 7M16 3l-4 7 4 4-4 4 4 7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'clipboard' || type === 'clipboard-heart') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 3h6v3H9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        {type === 'clipboard-heart' ? (
          <path
            d="M12 17.2s-2.4-1.5-3.2-2.9c-.7-1.2-.1-2.4 1.1-2.4.7 0 1.3.4 1.6.9.3-.5.9-.9 1.6-.9 1.2 0 1.8 1.2 1.1 2.4-.8 1.4-3.2 2.9-3.2 2.9z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        ) : (
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    )
  }
  if (type === 'shield') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'egg') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 4c4 4 6 7.5 6 11a6 6 0 1 1-12 0c0-3.5 2-7 6-11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const AI_FEATURE_CARDS = [
  {
    id: 'mapping',
    number: '01',
    title: 'Health-led mapping',
    body: 'Personalized guidance built around body signals, lifestyle patterns, and progress markers.',
  },
  {
    id: 'adaptive',
    number: '02',
    title: 'Adaptive plans',
    body: 'Nutrition, habits, and coaching focus are refreshed as your results and needs evolve.',
  },
]

const AI_CONDITION_TAGS = ['PCOD/PCOS', 'Thyroid', 'Weight Loss', 'Diabetes']

const PROGRAM_FAQ_ITEMS = [
  {
    question: 'What is included in the membership?',
    answer:
      'Your membership includes personalized workout programs, guided video sessions, weekly nutrition suggestions, and progress insights to keep your results consistent.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. You can cancel whenever you want from your account dashboard, and your access continues through your active billing period with no hidden charges.',
  },
  {
    question: 'Do you provide diet plans?',
    answer:
      'Absolutely. We provide structured nutrition guidance with meal recommendations aligned to your goals, preferences, and training schedule.',
  },
  {
    question: 'Is this suitable for beginners?',
    answer:
      'Yes, beginner-friendly plans are available with step-by-step progressions, mobility support, and coaching cues designed to build confidence safely.',
  },
  {
    question: 'How do I track my progress?',
    answer:
      'You can monitor milestones through in-app analytics, workout completion trends, body metrics, and check-ins that highlight your monthly improvements.',
  },
]

function ProgramGlp1FaqAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="program-glp1-faq-acc" role="region" aria-label="Frequently asked questions">
      {PROGRAM_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-faq-panel-${index + 1}`
        const buttonId = `${baseId}-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'program-glp1-faq-acc__item program-glp1-faq-acc__item--open' : 'program-glp1-faq-acc__item'}
          >
            <h3 className="program-glp1-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="program-glp1-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="program-glp1-faq-acc__question">{item.question}</span>
                <span className="program-glp1-faq-acc__toggle" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="program-glp1-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="program-glp1-faq-acc__panel">
                <p className="program-glp1-faq-acc__answer">{item.answer}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function IconSparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.4 4.3L18 8l-4.6 1.7L12 14l-1.4-4.3L6 8l4.6-1.7L12 2zm8 10l.9 2.7L23 16l-2.1.8L20 19l-.9-2.7L17 16l2.1-.8L20 12zM4 14l.7 2.1L7 17l-1.6.6L5 20l-.7-2.1L3 17l1.6-.6L4 14z" />
    </svg>
  )
}

function HowItWorksCard({ card }) {
  return (
    <article className="program-glp1-facts-card">
      <span className="program-glp1-facts-card__number" aria-hidden>
        {card.number}
      </span>
      <div className="program-glp1-facts-card__icon-wrap">
        <HowItWorksIcon type={card.icon} />
      </div>
      <h3 className="program-glp1-facts-card__title">{card.title}</h3>
      <p className="program-glp1-facts-card__body">{card.body}</p>
    </article>
  )
}

function TrustStatCard({ card }) {
  return (
    <article className={`program-glp1-trust-card program-glp1-trust-card--${card.variant}`}>
      <p className="program-glp1-trust-card__stat">{card.stat}</p>
      <h3 className="program-glp1-trust-card__label">{card.label}</h3>
      <p className="program-glp1-trust-card__body">{card.body}</p>
    </article>
  )
}

function GuidanceCard({ card }) {
  return (
    <article className={`program-glp1-guidance-card program-glp1-guidance-card--${card.theme}`}>
      <span className="program-glp1-guidance-card__number" aria-hidden>
        {card.number}
      </span>
      <p className="program-glp1-guidance-card__eyebrow">{card.eyebrow}</p>
      <div className="program-glp1-guidance-card__title-row">
        <div className="program-glp1-guidance-card__icon-wrap">
          <GuidanceCardIcon type={card.icon} />
        </div>
        <h3 className="program-glp1-guidance-card__title">{card.title}</h3>
      </div>
      <p className="program-glp1-guidance-card__body text-start">{card.body}</p>
      <ul className="program-glp1-guidance-card__list">
        {card.items.map((item) => (
          <li key={item} className="program-glp1-guidance-card__list-item">
            <IconCheck className="program-glp1-guidance-card__check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="program-glp1-guidance-card__footer">{card.footer}</p>
    </article>
  )
}

/** GLP-1 program — Lifescc programs line. */
export default function ProgramGlp1Page() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-glp1-page">
        <section
          className="program-glp1-hero"
          aria-labelledby="program-glp1-heading"
          style={{ backgroundImage: `url(${gplHeroImg})` }}
        >
          <div className="program-glp1-hero__scrim" aria-hidden />
          <div className="program-glp1-hero__inner container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-glp1-hero__copy text-start">
                <p className="program-glp1-hero__eyebrow">Programs</p>
                <h1 id="program-glp1-heading" className="program-glp1-hero__title">
                  GLP-1
                </h1>
                <p className="program-glp1-hero__lead">
                  You Have Tried Everything. You Have Not Tried Finding the Actual Reason.
                </p>
                <ul className="program-glp1-hero__badges" aria-label="Program highlights">
                  {TRUST_BADGES.map((label) => (
                    <li key={label}>
                      <span className="program-glp1-hero__badge">{label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill program-glp1-hero__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>

              <div className="col-lg-5 program-glp1-hero__media-col">
                <figure className="program-glp1-hero__figure">
                  <img
                    src={gplHeroImg}
                    alt="GLP-1 at Lifescc"
                    className="program-glp1-hero__img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-glp1-audience" aria-label="Who GLP-1 is for">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-glp1-audience__card">
                  <p className="program-glp1-audience__text">{AUDIENCE_TEXT}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-glp1-supports" aria-labelledby="program-glp1-supports-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-glp1-supports__intro">
                <p className="program-glp1-supports__pill text-start">
                  <IconHeartPulse />
                  <span>GLP-1</span>
                </p>
                <h2 id="program-glp1-supports-heading" className="program-glp1-supports__title text-center">
                  What <span className="program-glp1-supports__brand">GLP-1</span> weight care supports
                </h2>
                <p className="program-glp1-supports__lead text-center">
                A doctor-supervised programme combining GLP-1 medication guidance with personalised nutrition, lifestyle coaching, and regular monitoring — so weight loss is safer, more sustainable, and supported beyond the prescription alone.
                </p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-glp1-supports__highlights-card text-start">
                  <p className="program-glp1-supports__card-badge text-start">Program highlights</p>
                  <div className="row g-4 g-lg-5">
                    <div className="col-md-6">
                      <ul className="program-glp1-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(0, 3).map((item) => (
                          <li key={item} className="program-glp1-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="program-glp1-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(3).map((item) => (
                          <li key={item} className="program-glp1-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="row justify-content-center g-4 program-glp1-supports__cards-row">
              <div className="col-lg-6">
                <article className="program-glp1-supports__note-card program-glp1-supports__note-card--pink text-start">
                  <p className="program-glp1-supports__note-text">
                  GLP-1 can be a powerful tool — but lasting results come from pairing medical supervision with the right nutrition, habits, and follow-through.
                  </p>
                </article>
              </div>
              <div className="col-lg-6">
                <article className="program-glp1-supports__note-card text-start">
                  <p className="program-glp1-supports__card-badge program-glp1-supports__card-badge--inline text-start">
                    Good to know
                  </p>
                  <h3 className="program-glp1-supports__note-title text-start">Prescription under medical supervision</h3>
                  <p className="program-glp1-supports__note-text">
                  GLP-1 medications are prescription-only and not suitable for everyone. Eligibility, dosing, and ongoing use are determined solely by qualified doctors after individual clinical assessment. LIFErise programmes support and complement — never replace — your relationship with your treating physician.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-glp1-guidance" aria-labelledby="program-glp1-guidance-heading">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-start program-glp1-guidance__intro-row">
              <div className="col-lg-6 text-start">
                <p className="program-glp1-guidance__pill">
                  <IconCube />
                  <span>Expert guidance</span>
                </p>
                <h2 id="program-glp1-guidance-heading" className="program-glp1-guidance__title">
                Lose weight safely with{' '}
                  <span className="program-glp1-guidance__brand">expert GLP-1 support</span>
                </h2>
              </div>
              <div className="col-lg-6 text-start">
                <p className="program-glp1-guidance__lead text-start">
                Doctor assessment, medication guidance, precision nutrition, and lifestyle coaching work together so GLP-1 therapy is supported responsibly from day one.
                </p>
              </div>
            </div>

            <div className="row g-4 program-glp1-guidance__cards-row">
              {GUIDANCE_CARDS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <GuidanceCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-glp1-trust" aria-labelledby="program-glp1-trust-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-glp1-trust__intro text-center">
                <p className="program-glp1-trust__pill">
                  <IconStar />
                  <span>Why choose us</span>
                </p>
                <h2 id="program-glp1-trust-heading" className="program-glp1-trust__title">
                  Why clients trust <span className="program-glp1-trust__brand">Lifescc</span>
                </h2>
              </div>
            </div>

            <div className="row g-4 program-glp1-trust__cards-row">
              {TRUST_STATS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <TrustStatCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-glp1-facts" aria-labelledby="program-glp1-facts-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-glp1-facts__intro text-center">
                <p className="program-glp1-facts__pill">
                  <span className="program-glp1-facts__pill-dot" aria-hidden />
                  <span>The facts</span>
                </p>
                <h2 id="program-glp1-facts-heading" className="program-glp1-facts__title">
                  How our{' '}
                  <span className="program-glp1-facts__brand">glp-1 program</span> works?
                </h2>
              </div>
            </div>

            <div className="row g-4 program-glp1-facts__cards-row">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <HowItWorksCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-glp1-ai" aria-labelledby="program-glp1-ai-heading">
          <div className="container">
            <article className="program-glp1-ai__panel">
              <div className="row g-4 g-xl-5 align-items-center">
                <div className="col-lg-6 program-glp1-ai__copy text-start">
                  <p className="program-glp1-ai__pill">
                    <IconSparkle />
                    <span>AI powered wellness</span>
                  </p>
                  <h2 id="program-glp1-ai-heading" className="program-glp1-ai__title">
                    Smarter programs, refreshed by <span className="program-glp1-ai__brand">AI insight</span>
                  </h2>
                  <p className="program-glp1-ai__lead">
                    Our AI-assisted approach studies your health profile, daily routine, and transformation goals to
                    shape a more precise plan. You still get human coaching, but every recommendation starts with
                    sharper data.
                  </p>

                  <div className="row g-3 program-glp1-ai__features">
                    {AI_FEATURE_CARDS.map((card) => (
                      <div key={card.id} className="col-sm-6">
                        <article className="program-glp1-ai-feature">
                          <span className="program-glp1-ai-feature__num">{card.number}</span>
                          <h3 className="program-glp1-ai-feature__title">{card.title}</h3>
                          <p className="program-glp1-ai-feature__body">{card.body}</p>
                        </article>
                      </div>
                    ))}
                  </div>

                  <ul className="program-glp1-ai__tags" aria-label="Supported conditions">
                    {AI_CONDITION_TAGS.map((tag) => (
                      <li key={tag}>
                        <span className="program-glp1-ai__tag">
                          <span className="program-glp1-ai__tag-dot" aria-hidden />
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-lg-6 program-glp1-ai__visual-col">
                  <div className="program-glp1-ai-compare">
                    <figure className="program-glp1-ai-compare__card program-glp1-ai-compare__card--before">
                      <img src={ca1Img} alt="" className="program-glp1-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-glp1-ai-compare__badge program-glp1-ai-compare__badge--before">
                        Before AI
                      </span>
                      <figcaption className="program-glp1-ai-compare__caption">
                        <strong>Manual plan</strong>
                        <span>Generic routine and delayed corrections</span>
                      </figcaption>
                    </figure>

                    <figure className="program-glp1-ai-compare__card program-glp1-ai-compare__card--after">
                      <img src={ca2Img} alt="" className="program-glp1-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-glp1-ai-compare__badge program-glp1-ai-compare__badge--after">
                        After AI
                      </span>
                      <figcaption className="program-glp1-ai-compare__caption">
                        <strong>AI refined plan</strong>
                        <span>Personalized guidance refreshed with progress</span>
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="program-glp1-faq" aria-labelledby="program-glp1-faq-heading">
          <div className="container">
            <article className="program-glp1-faq__panel">
              <div className="row g-4 g-xl-5 align-items-start">
                <div className="col-lg-5 program-glp1-faq__copy text-start">
                  <p className="program-glp1-faq__pill">
                    <IconSparkle />
                    <span>FAQs</span>
                  </p>
                  <h2 id="program-glp1-faq-heading" className="program-glp1-faq__title">
                    Questions, clearly <span className="program-glp1-faq__brand">answered</span>
                  </h2>
                  <p className="program-glp1-faq__lead">
                    A streamlined overview of membership, support, and planning so you can get started with clarity
                    and confidence.
                  </p>
                </div>

                <div className="col-lg-7">
                  <ProgramGlp1FaqAccordion />
                </div>
              </div>
            </article>
          </div>
        </section>

        <WeightLossConsultationStrip
          sourcePage="program_glp_1"
          bannerImage={gplHeroImg}
          stripClassName="program-glp1-book-strip"
          treatmentLabel="GLP-1"
          title="Book a consultation for GLP-1"
          subtitle="Tell us your goals — we’ll help you start with a structured, science-backed plan."
        />
      </main>
      <SiteFooter />
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </div>
  )
}
