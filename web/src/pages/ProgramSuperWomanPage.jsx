import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import superWomanHeroImg from '../assets/hero-programmes_03.jpg'
import ca1Img from '../assets/ca1.avif'
import ca2Img from '../assets/ca2.avif'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './ProgramSuperWomanPage.css'

const TRUST_BADGES = ['Premium Guidance', 'Modern Protocols', 'Long-Term Results']

const AUDIENCE_TEXT =
  "Super Woman is for the woman who wakes up at 5 AM for everyone else, works all day, comes home and gives more — and somewhere in all of that, stopped being her own priority. This programme is for her. For you. Because when you feel healthy, strong and confident — everyone around you feels it."



const PROGRAM_HIGHLIGHTS = [
  'Hormonal and metabolic wellness support',
  'Improved energy, strength, and balance',
  'Stress and lifestyle management guidance',
  'Personalised nutrition and wellness planning',
  'Focus on prevention and long-term vitality',
  'Structured reviews for consistent progress',
]

function IconHeartPulse() {
  return (
    <svg
      className="program-superwoman-supports__heart"
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

function IconCheck({ className = 'program-superwoman-supports__check' }) {
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
    id: 'womens-health-assessment',
    number: '01',
    theme: 'green',
    eyebrow: 'DAY 1 · MANDATORY',
    title: "Women's health assessment",
    body:
      'A detailed review evaluates hormones, lifestyle, symptoms, and health concerns to create a personalised wellness roadmap.',
    items: [
      'Understand underlying health patterns',
      'Personalised wellness foundation',
      'Early prevention-focused care',
    ],
    footer: 'DAY 1 · HEALTH REVIEW',
    icon: 'droplet',
  },
  {
    id: 'energy-wellness-tracking',
    number: '02',
    theme: 'blue',
    eyebrow: 'MONTHLY · ONLINE',
    title: 'Energy and wellness tracking',
    body:
      'Monitor sleep, energy, stress, and body changes to ensure your programme remains practical and effective.',
    items: [
      'Track lifestyle improvements',
      'Regular progress checkpoints',
      'Adjust support as needed',
    ],
    footer: 'MONTHLY · GUIDED REVIEW',
    icon: 'chart',
  },
  {
    id: 'stress-lifestyle-coaching',
    number: '03',
    theme: 'pink',
    eyebrow: 'PRIVATE · SUPPORT',
    title: 'Stress and lifestyle coaching',
    body:
      'Address burnout, emotional wellbeing, and daily pressures through guided lifestyle and behaviour support.',
    items: [
      'Reduce overwhelm and fatigue',
      'Build healthier routines',
      'Improve emotional resilience',
    ],
    footer: 'PRIVATE · CONFIDENTIAL',
    icon: 'heart',
  },
  {
    id: 'precision-nutrition-women',
    number: '04',
    theme: 'amber',
    eyebrow: 'DIETITIAN · 2–4 CALLS / MONTH',
    title: 'Precision nutrition for women',
    body:
      'Nutrition guidance is tailored around hormones, age, lifestyle, and wellness goals for sustainable health.',
    items: [
      'No generic diet plans',
      'Women-focused nutrition strategy',
      'Monthly personalised updates',
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
    id: 'metabolism-muscle',
    number: '01',
    icon: 'pulse',
    title: 'Metabolism & lean muscle',
    body:
      'High-protein adaptations and weight-bearing guidance to preserve muscle density, support joints, and keep metabolism active.',
  },
  {
    id: 'perimenopause-hormone',
    number: '02',
    icon: 'droplet',
    title: 'Perimenopause & hormone care',
    body:
      'Hormonal stabilization nutrition to target night-sweats, sleep disturbances, hot flashes, and fluctuating energy.',
  },
  {
    id: 'cardiovascular-bone',
    number: '03',
    icon: 'shield',
    title: 'Cardiovascular & bone health',
    body:
      'Heart-healthy fats (Omega-3, MUFA) and bone-supporting nutrients (Calcium, Magnesium, K2) built into daily meals.',
  },
  {
    id: 'daily-energy',
    number: '04',
    icon: 'bolt',
    title: 'Sustained daily energy',
    body:
      'Fights afternoon fatigue and brain fog by balancing micronutrient absorption and mitochondrial health.',
  },
  {
    id: 'digestive-support',
    number: '05',
    icon: 'digest',
    title: 'Digestive enzyme support',
    body:
      'Easily digestible, fiber-rich meal structures to counter bloating and slow digestion common after age 40.',
  },
  {
    id: 'stress-resilience',
    number: '06',
    icon: 'target',
    title: 'Sustainable stress resilience',
    body:
      'Pairs clinical nutrition with active recovery and sleep hygiene tips to regulate cortisol and promote deep rest.',
  },
]

function HowItWorksIcon({ type }) {
  if (type === 'pulse') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 12h3l2-4 3 8 2-5 2 5h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
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
  if (type === 'bolt') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M13 2L5 14h6l-1 8 8-12h-6l1-8z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (type === 'digest') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 4c0 3 2 5 4 5s4-2 4-5M8 4v16M16 4v16M8 12h8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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

function ProgramSuperWomanFaqAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="program-superwoman-faq-acc" role="region" aria-label="Frequently asked questions">
      {PROGRAM_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-faq-panel-${index + 1}`
        const buttonId = `${baseId}-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'program-superwoman-faq-acc__item program-superwoman-faq-acc__item--open' : 'program-superwoman-faq-acc__item'}
          >
            <h3 className="program-superwoman-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="program-superwoman-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="program-superwoman-faq-acc__question">{item.question}</span>
                <span className="program-superwoman-faq-acc__toggle" aria-hidden="true">
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
              className="program-superwoman-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="program-superwoman-faq-acc__panel">
                <p className="program-superwoman-faq-acc__answer">{item.answer}</p>
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
    <article className="program-superwoman-facts-card">
      <span className="program-superwoman-facts-card__number" aria-hidden>
        {card.number}
      </span>
      <div className="program-superwoman-facts-card__icon-wrap">
        <HowItWorksIcon type={card.icon} />
      </div>
      <h3 className="program-superwoman-facts-card__title">{card.title}</h3>
      <p className="program-superwoman-facts-card__body">{card.body}</p>
    </article>
  )
}

function TrustStatCard({ card }) {
  return (
    <article className={`program-superwoman-trust-card program-superwoman-trust-card--${card.variant}`}>
      <p className="program-superwoman-trust-card__stat">{card.stat}</p>
      <h3 className="program-superwoman-trust-card__label">{card.label}</h3>
      <p className="program-superwoman-trust-card__body">{card.body}</p>
    </article>
  )
}

function GuidanceCard({ card }) {
  return (
    <article className={`program-superwoman-guidance-card program-superwoman-guidance-card--${card.theme}`}>
      <span className="program-superwoman-guidance-card__number" aria-hidden>
        {card.number}
      </span>
      <p className="program-superwoman-guidance-card__eyebrow">{card.eyebrow}</p>
      <div className="program-superwoman-guidance-card__title-row">
        <div className="program-superwoman-guidance-card__icon-wrap">
          <GuidanceCardIcon type={card.icon} />
        </div>
        <h3 className="program-superwoman-guidance-card__title">{card.title}</h3>
      </div>
      <p className="program-superwoman-guidance-card__body text-start">{card.body}</p>
      <ul className="program-superwoman-guidance-card__list text-start">
        {card.items.map((item) => (
          <li key={item} className="program-superwoman-guidance-card__list-item text-start">
            <IconCheck className="program-superwoman-guidance-card__check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="program-superwoman-guidance-card__footer">{card.footer}</p>
    </article>
  )
}

/** Super Woman program — Lifescc programs line. */
export default function ProgramSuperWomanPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-superwoman-page">
        <section
          className="program-superwoman-hero"
          aria-labelledby="program-superwoman-heading"
          style={{ backgroundImage: `url(${superWomanHeroImg})` }}
        >
          <div className="program-superwoman-hero__scrim" aria-hidden />
          <div className="program-superwoman-hero__inner container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-superwoman-hero__copy text-start">
                <p className="program-superwoman-hero__eyebrow">Programs</p>
                <h1 id="program-superwoman-heading" className="program-superwoman-hero__title">
                  Super Woman
                </h1>
                <p className="program-superwoman-hero__lead">
                You Give Everything to Everyone. It Is Time Someon
                </p>
                <ul className="program-superwoman-hero__badges" aria-label="Program highlights">
                  {TRUST_BADGES.map((label) => (
                    <li key={label}>
                      <span className="program-superwoman-hero__badge">{label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill program-superwoman-hero__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>

              <div className="col-lg-5 program-superwoman-hero__media-col">
                <figure className="program-superwoman-hero__figure">
                  <img
                    src={superWomanHeroImg}
                    alt="Super Woman at Lifescc"
                    className="program-superwoman-hero__img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-superwoman-audience" aria-label="Who Super Woman is for">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-superwoman-audience__card">
                  <p className="program-superwoman-audience__text">{AUDIENCE_TEXT}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-superwoman-supports" aria-labelledby="program-superwoman-supports-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-superwoman-supports__intro">
                <p className="program-superwoman-supports__pill text-start">
                  <IconHeartPulse />
                  <span>super woman</span>
                </p>
                <h2 id="program-superwoman-supports-heading" className="program-superwoman-supports__title text-center">
                  What <span className="program-superwoman-supports__brand">Super Woman</span> supports
                </h2>
                <p className="program-superwoman-supports__lead text-center">
                A complete wellness programme designed for women balancing family, career, hormones, and personal wellbeing with expert care and nutrition support.
                </p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-superwoman-supports__highlights-card text-start">
                  <p className="program-superwoman-supports__card-badge text-start">Program highlights</p>
                  <div className="row g-4 g-lg-5">
                    <div className="col-md-6">
                      <ul className="program-superwoman-supports__list text-start">
                        {PROGRAM_HIGHLIGHTS.slice(0, 3).map((item) => (
                          <li key={item} className="program-superwoman-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="program-superwoman-supports__list text-start">
                        {PROGRAM_HIGHLIGHTS.slice(3).map((item) => (
                          <li key={item} className="program-superwoman-supports__list-item">
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

            <div className="row justify-content-center g-4 program-superwoman-supports__cards-row">
              <div className="col-lg-6">
                <article className="program-superwoman-supports__note-card program-superwoman-supports__note-card--pink text-start">
                  <p className="program-superwoman-supports__note-text">
                  You give everything to everyone. It is time someone gave everything back to you.
                  </p>
                </article>
              </div>
              <div className="col-lg-6">
                <article className="program-superwoman-supports__note-card text-start">
                  <p className="program-superwoman-supports__card-badge program-superwoman-supports__card-badge--inline text-start">
                    Good to know
                  </p>
                  <h3 className="program-superwoman-supports__note-title text-start">Whole-woman wellbeing</h3>
                  <p className="program-superwoman-supports__note-text">
                  Clinical guidance, lifestyle support, and nutrition coaching help women prioritise health without compromising daily responsibilities.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-superwoman-guidance" aria-labelledby="program-superwoman-guidance-heading">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-start program-superwoman-guidance__intro-row">
              <div className="col-lg-6 text-start">
                <p className="program-superwoman-guidance__pill">
                  <IconCube />
                  <span>Expert guidance</span>
                </p>
                <h2 id="program-superwoman-guidance-heading" className="program-superwoman-guidance__title">
                Support your wellness journey with{' '}
                  <span className="program-superwoman-guidance__brand">expert care</span>
                </h2>
              </div>
              <div className="col-lg-6 text-start">
                <p className="program-superwoman-guidance__lead text-start">
                Hormone support, nutrition planning, stress management, and regular health reviews work together to restore balance and confidence.
                </p>
              </div>
            </div>

            <div className="row g-4 program-superwoman-guidance__cards-row">
              {GUIDANCE_CARDS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <GuidanceCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-superwoman-trust" aria-labelledby="program-superwoman-trust-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-superwoman-trust__intro text-center">
                <p className="program-superwoman-trust__pill">
                  <IconStar />
                  <span>Why choose us</span>
                </p>
                <h2 id="program-superwoman-trust-heading" className="program-superwoman-trust__title">
                  Why clients trust <span className="program-superwoman-trust__brand">Lifescc</span>
                </h2>
              </div>
            </div>

            <div className="row g-4 program-superwoman-trust__cards-row">
              {TRUST_STATS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <TrustStatCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-superwoman-facts" aria-labelledby="program-superwoman-facts-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-superwoman-facts__intro text-center">
                <p className="program-superwoman-facts__pill">
                  <span className="program-superwoman-facts__pill-dot" aria-hidden />
                  <span>The facts</span>
                </p>
                <h2 id="program-superwoman-facts-heading" className="program-superwoman-facts__title">
                  How our{' '}
                  <span className="program-superwoman-facts__brand">super woman program</span> works?
                </h2>
              </div>
            </div>

            <div className="row g-4 program-superwoman-facts__cards-row">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <HowItWorksCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-superwoman-ai" aria-labelledby="program-superwoman-ai-heading">
          <div className="container">
            <article className="program-superwoman-ai__panel">
              <div className="row g-4 g-xl-5 align-items-center">
                <div className="col-lg-6 program-superwoman-ai__copy text-start">
                  <p className="program-superwoman-ai__pill">
                    <IconSparkle />
                    <span>AI powered wellness</span>
                  </p>
                  <h2 id="program-superwoman-ai-heading" className="program-superwoman-ai__title">
                    Smarter programs, refreshed by <span className="program-superwoman-ai__brand">AI insight</span>
                  </h2>
                  <p className="program-superwoman-ai__lead">
                    Our AI-assisted approach studies your health profile, daily routine, and transformation goals to
                    shape a more precise plan. You still get human coaching, but every recommendation starts with
                    sharper data.
                  </p>

                  <div className="row g-3 program-superwoman-ai__features">
                    {AI_FEATURE_CARDS.map((card) => (
                      <div key={card.id} className="col-sm-6">
                        <article className="program-superwoman-ai-feature">
                          <span className="program-superwoman-ai-feature__num">{card.number}</span>
                          <h3 className="program-superwoman-ai-feature__title">{card.title}</h3>
                          <p className="program-superwoman-ai-feature__body">{card.body}</p>
                        </article>
                      </div>
                    ))}
                  </div>

                  <ul className="program-superwoman-ai__tags" aria-label="Supported conditions">
                    {AI_CONDITION_TAGS.map((tag) => (
                      <li key={tag}>
                        <span className="program-superwoman-ai__tag">
                          <span className="program-superwoman-ai__tag-dot" aria-hidden />
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-lg-6 program-superwoman-ai__visual-col">
                  <div className="program-superwoman-ai-compare">
                    <figure className="program-superwoman-ai-compare__card program-superwoman-ai-compare__card--before">
                      <img src={ca1Img} alt="" className="program-superwoman-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-superwoman-ai-compare__badge program-superwoman-ai-compare__badge--before">
                        Before AI
                      </span>
                      <figcaption className="program-superwoman-ai-compare__caption">
                        <strong>Manual plan</strong>
                        <span>Generic routine and delayed corrections</span>
                      </figcaption>
                    </figure>

                    <figure className="program-superwoman-ai-compare__card program-superwoman-ai-compare__card--after">
                      <img src={ca2Img} alt="" className="program-superwoman-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-superwoman-ai-compare__badge program-superwoman-ai-compare__badge--after">
                        After AI
                      </span>
                      <figcaption className="program-superwoman-ai-compare__caption">
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

        <section className="program-superwoman-faq" aria-labelledby="program-superwoman-faq-heading">
          <div className="container">
            <article className="program-superwoman-faq__panel">
              <div className="row g-4 g-xl-5 align-items-start">
                <div className="col-lg-5 program-superwoman-faq__copy text-start">
                  <p className="program-superwoman-faq__pill">
                    <IconSparkle />
                    <span>FAQs</span>
                  </p>
                  <h2 id="program-superwoman-faq-heading" className="program-superwoman-faq__title">
                    Questions, clearly <span className="program-superwoman-faq__brand">answered</span>
                  </h2>
                  <p className="program-superwoman-faq__lead">
                    A streamlined overview of membership, support, and planning so you can get started with clarity
                    and confidence.
                  </p>
                </div>

                <div className="col-lg-7">
                  <ProgramSuperWomanFaqAccordion />
                </div>
              </div>
            </article>
          </div>
        </section>

        <WeightLossConsultationStrip
          sourcePage="program_super_woman"
          bannerImage={superWomanHeroImg}
          stripClassName="program-superwoman-book-strip"
          treatmentLabel="Super Woman"
          title="Book a consultation for Super Woman"
          subtitle="Tell us your goals — we’ll help you start with a structured, science-backed plan."
        />
      </main>
      <SiteFooter />
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </div>
  )
}
