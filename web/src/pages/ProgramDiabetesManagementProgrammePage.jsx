import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import dmpHeroImg from '../assets/dmp.png'
import ca1Img from '../assets/ca1.avif'
import ca2Img from '../assets/ca2.avif'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './ProgramDiabetesManagementProgrammePage.css'

const TRUST_BADGES = ['Premium Guidance', 'Modern Protocols', 'Long-Term Results']

const AUDIENCE_TEXT =
  'A structured diabetes care programme designed to support blood sugar balance, improve metabolic health, and reduce long-term complications through medical guidance, nutrition planning, and regular monitoring.'

const PROGRAM_HIGHLIGHTS = [
  'Improved blood sugar management',
  'Root-cause understanding from day one',
  'Better energy, confidence, and daily health',
  'Blood report-guided meal and supplement planning',
  'Focus on prevention and metabolic balance',
  'Regular reviews to reduce long-term risk',
]

function IconHeartPulse() {
  return (
    <svg
      className="program-diabetes-supports__heart"
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

function IconCheck({ className = 'program-diabetes-supports__check' }) {
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
    id: 'blood-sugar-assessment',
    number: '01',
    theme: 'green',
    eyebrow: 'DAY 1 · MANDATORY',
    title: 'Blood sugar and health assessment',
    body:
      'A detailed review of blood reports, lifestyle, and metabolic markers helps identify risk factors and personalise your diabetes care plan.',
    items: [
      'Clear understanding from the start',
      'Personalised diabetes roadmap',
      'Prevention-focused planning',
    ],
    footer: 'DAY 1 · QUARTERLY REVIEW',
    icon: 'droplet',
  },
  {
    id: 'glucose-tracking',
    number: '02',
    theme: 'blue',
    eyebrow: 'MONTHLY · AT HOME',
    title: 'Glucose and progress tracking',
    body:
      'Monitor sugar readings, energy, and lifestyle habits to ensure diabetes care stays effective and practical.',
    items: [
      'Track glucose patterns',
      'Monthly correction checkpoints',
      'Data-led monitoring',
    ],
    footer: 'MONTHLY · HOME MONITORING',
    icon: 'chart',
  },
  {
    id: 'lifestyle-habits',
    number: '03',
    theme: 'pink',
    eyebrow: 'MONTHLY · PRIVATE',
    title: 'Lifestyle and habit support',
    body:
      'Build healthier routines around activity, sleep, and stress management to improve metabolic health and consistency.',
    items: [
      'Improve daily routines',
      'Reduce lifestyle triggers',
      'Support long-term adherence',
    ],
    footer: 'MONTHLY · CONFIDENTIAL',
    icon: 'heart',
  },
  {
    id: 'diabetes-nutrition',
    number: '04',
    theme: 'amber',
    eyebrow: 'DIETITIAN · 2–4 CALLS / MONTH',
    title: 'Precision diabetes nutrition',
    body:
      'Nutrition guidance is customised using reports, glucose trends, and lifestyle to support stable blood sugar and better health.',
    items: [
      'Report-based meal strategy',
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
    id: 'insulin-sensitivity',
    number: '01',
    icon: 'pill',
    title: 'Improve insulin sensitivity',
    body:
      'Structured carbohydrate pairing and fiber scaling to reduce post-meal glucose spikes and improve HbA1c levels.',
  },
  {
    id: 'glucose-tracking',
    number: '02',
    icon: 'chart',
    title: 'Continuous glucose tracking',
    body:
      'We help you track and map glucose trends alongside food logs, identifying exact food triggers unique to your body.',
  },
  {
    id: 'pancreatic-liver',
    number: '03',
    icon: 'shield',
    title: 'Pancreatic & liver support',
    body:
      'Nutrition designs that reduce liver fat and ease pancreatic stress, working in harmony with your prescribed medication.',
  },
  {
    id: 'low-glycemic-meals',
    number: '04',
    icon: 'egg',
    title: 'Low-glycemic meal structures',
    body:
      'Enjoy satisfying, fiber-rich Indian meals that release energy slowly, preventing sudden sugar crashes.',
  },
  {
    id: 'fatigue-neuropathy',
    number: '05',
    icon: 'heart',
    title: 'Fatigue & neuropathy care',
    body:
      'Micronutrient optimization to support nerve health and steady energy levels, reducing diabetic fatigue.',
  },
  {
    id: 'lifestyle-habits',
    number: '06',
    icon: 'target',
    title: 'Sustainable lifestyle habits',
    body:
      'Our goal is to build long-term routines that help stabilize blood sugar naturally, reducing dependency on higher doses.',
  },
]

function HowItWorksIcon({ type }) {
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
      </svg>
    )
  }
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

function ProgramDiabetesFaqAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="program-diabetes-faq-acc" role="region" aria-label="Frequently asked questions">
      {PROGRAM_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-faq-panel-${index + 1}`
        const buttonId = `${baseId}-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'program-diabetes-faq-acc__item program-diabetes-faq-acc__item--open' : 'program-diabetes-faq-acc__item'}
          >
            <h3 className="program-diabetes-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="program-diabetes-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="program-diabetes-faq-acc__question">{item.question}</span>
                <span className="program-diabetes-faq-acc__toggle" aria-hidden="true">
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
              className="program-diabetes-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="program-diabetes-faq-acc__panel">
                <p className="program-diabetes-faq-acc__answer">{item.answer}</p>
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
    <article className="program-diabetes-facts-card">
      <span className="program-diabetes-facts-card__number" aria-hidden>
        {card.number}
      </span>
      <div className="program-diabetes-facts-card__icon-wrap">
        <HowItWorksIcon type={card.icon} />
      </div>
      <h3 className="program-diabetes-facts-card__title">{card.title}</h3>
      <p className="program-diabetes-facts-card__body">{card.body}</p>
    </article>
  )
}

function TrustStatCard({ card }) {
  return (
    <article className={`program-diabetes-trust-card program-diabetes-trust-card--${card.variant}`}>
      <p className="program-diabetes-trust-card__stat">{card.stat}</p>
      <h3 className="program-diabetes-trust-card__label">{card.label}</h3>
      <p className="program-diabetes-trust-card__body">{card.body}</p>
    </article>
  )
}

function GuidanceCard({ card }) {
  return (
    <article className={`program-diabetes-guidance-card program-diabetes-guidance-card--${card.theme}`}>
      <span className="program-diabetes-guidance-card__number" aria-hidden>
        {card.number}
      </span>
      <p className="program-diabetes-guidance-card__eyebrow">{card.eyebrow}</p>
      <div className="program-diabetes-guidance-card__title-row">
        <div className="program-diabetes-guidance-card__icon-wrap">
          <GuidanceCardIcon type={card.icon} />
        </div>
        <h3 className="program-diabetes-guidance-card__title">{card.title}</h3>
      </div>
      <p className="program-diabetes-guidance-card__body text-start">{card.body}</p>
      <ul className="program-diabetes-guidance-card__list">
        {card.items.map((item) => (
          <li key={item} className="program-diabetes-guidance-card__list-item">
            <IconCheck className="program-diabetes-guidance-card__check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="program-diabetes-guidance-card__footer">{card.footer}</p>
    </article>
  )
}

/** Diabetes Management Programme — Lifescc programs line. */
export default function ProgramDiabetesManagementProgrammePage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-diabetes-page">
        <section
          className="program-diabetes-hero"
          aria-labelledby="program-diabetes-heading"
          style={{ backgroundImage: `url(${dmpHeroImg})` }}
        >
          <div className="program-diabetes-hero__scrim" aria-hidden />
          <div className="program-diabetes-hero__inner container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-diabetes-hero__copy text-start">
                <p className="program-diabetes-hero__eyebrow">Programs</p>
                <h1 id="program-diabetes-heading" className="program-diabetes-hero__title">
                  Diabetes Management Programme
                </h1>
                <p className="program-diabetes-hero__lead">
                Take control of diabetes with expert guidance, personalised nutrition, and sustainable lifestyle care.
                </p>
                <ul className="program-diabetes-hero__badges" aria-label="Program highlights">
                  {TRUST_BADGES.map((label) => (
                    <li key={label}>
                      <span className="program-diabetes-hero__badge">{label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill program-diabetes-hero__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>

              <div className="col-lg-5 program-diabetes-hero__media-col">
                <figure className="program-diabetes-hero__figure">
                  <img
                    src={dmpHeroImg}
                    alt="Diabetes Management Programme at Lifescc"
                    className="program-diabetes-hero__img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-diabetes-audience" aria-label="Who Diabetes Management Programme is for">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-diabetes-audience__card">
                  <p className="program-diabetes-audience__text">{AUDIENCE_TEXT}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-diabetes-supports" aria-labelledby="program-diabetes-supports-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-diabetes-supports__intro">
                <p className="program-diabetes-supports__pill text-start">
                  <IconHeartPulse />
                  <span>diabetes management</span>
                </p>
                <h2 id="program-diabetes-supports-heading" className="program-diabetes-supports__title text-center">
                Live healthier with <span className="program-diabetes-supports__brand">Better</span> <br/>Blood Sugar Control
                </h2>
                <p className="program-diabetes-supports__lead text-center">
                A structured diabetes care approach focused on blood sugar control, metabolic health, nutrition, and sustainable lifestyle changes for long-term wellbeing.
                </p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-diabetes-supports__highlights-card text-start">
                  <p className="program-diabetes-supports__card-badge text-start">Program highlights</p>
                  <div className="row g-4 g-lg-5">
                    <div className="col-md-6">
                      <ul className="program-diabetes-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(0, 3).map((item) => (
                          <li key={item} className="program-diabetes-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="program-diabetes-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(3).map((item) => (
                          <li key={item} className="program-diabetes-supports__list-item">
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

            <div className="row justify-content-center g-4 program-diabetes-supports__cards-row">
              <div className="col-lg-6">
                <article className="program-diabetes-supports__note-card program-diabetes-supports__note-card--pink text-start">
                  <p className="program-diabetes-supports__note-text">
                  We do not simply manage sugar levels. We support healthier routines, better control, and lasting wellbeing.
                  </p>
                </article>
              </div>
              <div className="col-lg-6">
                <article className="program-diabetes-supports__note-card text-start">
                  <p className="program-diabetes-supports__card-badge program-diabetes-supports__card-badge--inline text-start">
                    Good to know
                  </p>
                  <h3 className="program-diabetes-supports__note-title text-start">Consistent control</h3>
                  <p className="program-diabetes-supports__note-text">
                  Clinical supervision and nutrition coaching help maintain healthier glucose levels and support long-term diabetes care.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-diabetes-guidance" aria-labelledby="program-diabetes-guidance-heading">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-start program-diabetes-guidance__intro-row">
              <div className="col-lg-6 text-start">
                <p className="program-diabetes-guidance__pill">
                  <IconCube />
                  <span>Expert guidance</span>
                </p>
                <h2 id="program-diabetes-guidance-heading" className="program-diabetes-guidance__title">
                  Build better glucose control with{' '}
                  <span className="program-diabetes-guidance__brand">expert guidance</span>
                </h2>
              </div>
              <div className="col-lg-6 text-start">
                <p className="program-diabetes-guidance__lead text-start">
                  Medical monitoring, nutrition planning, lifestyle support, and progress tracking work together to
                  create sustainable diabetes management.
                </p>
              </div>
            </div>

            <div className="row g-4 program-diabetes-guidance__cards-row">
              {GUIDANCE_CARDS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <GuidanceCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-diabetes-trust" aria-labelledby="program-diabetes-trust-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-diabetes-trust__intro text-center">
                <p className="program-diabetes-trust__pill">
                  <IconStar />
                  <span>Why choose us</span>
                </p>
                <h2 id="program-diabetes-trust-heading" className="program-diabetes-trust__title">
                  Why clients trust <span className="program-diabetes-trust__brand">Lifescc</span>
                </h2>
              </div>
            </div>

            <div className="row g-4 program-diabetes-trust__cards-row">
              {TRUST_STATS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <TrustStatCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-diabetes-facts" aria-labelledby="program-diabetes-facts-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-diabetes-facts__intro text-center">
                <p className="program-diabetes-facts__pill">
                  <span className="program-diabetes-facts__pill-dot" aria-hidden />
                  <span>The facts</span>
                </p>
                <h2 id="program-diabetes-facts-heading" className="program-diabetes-facts__title">
                  How our{' '}
                  <span className="program-diabetes-facts__brand">diabetes management program</span> works?
                </h2>
              </div>
            </div>

            <div className="row g-4 program-diabetes-facts__cards-row">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <HowItWorksCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-diabetes-ai" aria-labelledby="program-diabetes-ai-heading">
          <div className="container">
            <article className="program-diabetes-ai__panel">
              <div className="row g-4 g-xl-5 align-items-center">
                <div className="col-lg-6 program-diabetes-ai__copy text-start">
                  <p className="program-diabetes-ai__pill">
                    <IconSparkle />
                    <span>AI powered wellness</span>
                  </p>
                  <h2 id="program-diabetes-ai-heading" className="program-diabetes-ai__title">
                    Smarter programs, refreshed by <span className="program-diabetes-ai__brand">AI insight</span>
                  </h2>
                  <p className="program-diabetes-ai__lead">
                    Our AI-assisted approach studies your health profile, daily routine, and transformation goals to
                    shape a more precise plan. You still get human coaching, but every recommendation starts with
                    sharper data.
                  </p>

                  <div className="row g-3 program-diabetes-ai__features">
                    {AI_FEATURE_CARDS.map((card) => (
                      <div key={card.id} className="col-sm-6">
                        <article className="program-diabetes-ai-feature">
                          <span className="program-diabetes-ai-feature__num">{card.number}</span>
                          <h3 className="program-diabetes-ai-feature__title">{card.title}</h3>
                          <p className="program-diabetes-ai-feature__body">{card.body}</p>
                        </article>
                      </div>
                    ))}
                  </div>

                  <ul className="program-diabetes-ai__tags" aria-label="Supported conditions">
                    {AI_CONDITION_TAGS.map((tag) => (
                      <li key={tag}>
                        <span className="program-diabetes-ai__tag">
                          <span className="program-diabetes-ai__tag-dot" aria-hidden />
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-lg-6 program-diabetes-ai__visual-col">
                  <div className="program-diabetes-ai-compare">
                    <figure className="program-diabetes-ai-compare__card program-diabetes-ai-compare__card--before">
                      <img src={ca1Img} alt="" className="program-diabetes-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-diabetes-ai-compare__badge program-diabetes-ai-compare__badge--before">
                        Before AI
                      </span>
                      <figcaption className="program-diabetes-ai-compare__caption">
                        <strong>Manual plan</strong>
                        <span>Generic routine and delayed corrections</span>
                      </figcaption>
                    </figure>

                    <figure className="program-diabetes-ai-compare__card program-diabetes-ai-compare__card--after">
                      <img src={ca2Img} alt="" className="program-diabetes-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-diabetes-ai-compare__badge program-diabetes-ai-compare__badge--after">
                        After AI
                      </span>
                      <figcaption className="program-diabetes-ai-compare__caption">
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

        <section className="program-diabetes-faq" aria-labelledby="program-diabetes-faq-heading">
          <div className="container">
            <article className="program-diabetes-faq__panel">
              <div className="row g-4 g-xl-5 align-items-start">
                <div className="col-lg-5 program-diabetes-faq__copy text-start">
                  <p className="program-diabetes-faq__pill">
                    <IconSparkle />
                    <span>FAQs</span>
                  </p>
                  <h2 id="program-diabetes-faq-heading" className="program-diabetes-faq__title">
                    Questions, clearly <span className="program-diabetes-faq__brand">answered</span>
                  </h2>
                  <p className="program-diabetes-faq__lead">
                    A streamlined overview of membership, support, and planning so you can get started with clarity
                    and confidence.
                  </p>
                </div>

                <div className="col-lg-7">
                  <ProgramDiabetesFaqAccordion />
                </div>
              </div>
            </article>
          </div>
        </section>

        <WeightLossConsultationStrip
          sourcePage="program_diabetes_management_programme"
          bannerImage={dmpHeroImg}
          stripClassName="program-diabetes-book-strip"
          treatmentLabel="Diabetes Management Programme"
          title="Book a consultation for Diabetes Management Programme"
          subtitle="Tell us your goals — we’ll help you start with a structured, science-backed plan."
        />
      </main>
      <SiteFooter />
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </div>
  )
}
