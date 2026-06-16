import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import youngHeroImg from '../assets/young.png'
import ca1Img from '../assets/ca1.avif'
import ca2Img from '../assets/ca2.avif'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './ProgramYoungAfter40Page.css'

const TRUST_BADGES = ['Premium Guidance', 'Modern Protocols', 'Long-Term Results']

const AUDIENCE_TEXT =
  'This is the programme for the man who wants to be the dad his children brag about. For the woman who wants to look in the mirror and feel proud. For the person who wants to walk into any room — family events, work meetings, weddings — and feel strong, alive and present. LIFErise gives you your life back.'

const PROGRAM_HIGHLIGHTS = [
  'Energetic from morning to night',
  'Weight managed with nutrition science',
  'IFeel 10 years younger — in numbers',
  'Active and sharp at work and business',
  'Fit, healthy and confident again',
  'People notice. You notice. A new you.',
]

function IconHeartPulse() {
  return (
    <svg
      className="program-ya40-supports__heart"
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

function IconCheck({ className = 'program-ya40-supports__check' }) {
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
    id: 'blood-baseline',
    number: '01',
    theme: 'green',
    eyebrow: 'DAY 1',
    title: 'Blood tests ordered. Your real baseline found.',
    body:
      'Your CRM guides you to the nearest lab. Reports uploaded to your programme portal. Doctor and dietician read them together and build YOUR plan from YOUR biology.',
    items: ['Nearest lab guidance', 'Reports uploaded to portal', 'Personalised plan creation'],
    footer: 'DAY 1',
    icon: 'droplet',
  },
  {
    id: 'diet-yoga-steps',
    number: '02',
    theme: 'blue',
    eyebrow: 'WEEK 1–2',
    title: 'Diet plan in your hands. Yoga starts. Steps begin.',
    body:
      'Personalised plan sent within 24 hours of the dietician call. You join your Yoga, Zumba and Strength groups. Walking starts at your level — even 2,000 steps is fine.',
    items: ['Personalised diet plan', 'Yoga & fitness group access', 'Beginner-friendly walking goals'],
    footer: 'WEEK 1–2',
    icon: 'chart',
  },
  {
    id: 'energy-returns',
    number: '03',
    theme: 'pink',
    eyebrow: 'MONTH 1',
    title: 'Energy returns. Something feels different.',
    body:
      'Blood deficiencies being corrected through food and supplements. Cortisol dropping as yoga takes effect. You stop crashing at 3 PM. Your family notices before you do.',
    items: ['Correct nutritional deficiencies', 'Improve energy levels', 'Reduce cortisol and fatigue'],
    footer: 'MONTH 1',
    icon: 'heart',
  },
  {
    id: 'bca-reshaping',
    number: '04',
    theme: 'amber',
    eyebrow: 'MONTH 2–3',
    title: 'BCA numbers moving. Body reshaping.',
    body:
      'Body fat % reducing. Body age coming down. Muscle mass growing. Visceral fat reducing. You compare your first BCA to today and the numbers tell the story no mirror can lie about.',
    items: ['Body fat reduction', 'Muscle mass improvement', 'Visible metabolic progress'],
    footer: 'MONTH 2–3',
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
    icon: 'chart',
    title: 'Metabolism & lean muscle',
    body:
      'High-protein adaptations and weight-bearing guidance to preserve muscle density, support joints, and keep metabolism active.',
  },
  {
    id: 'perimenopause-hormone',
    number: '02',
    icon: 'heart',
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
    icon: 'hourglass',
    title: 'Sustained daily energy',
    body:
      'Fights afternoon fatigue and brain fog by balancing micronutrient absorption and mitochondrial health.',
  },
  {
    id: 'digestive-support',
    number: '05',
    icon: 'avocado',
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
  if (type === 'clipboard') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 3h6v3H9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  if (type === 'avocado') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20.5c3.8-2.8 7-7.2 7-12.2C19 4.6 15.9 2 12 2S5 4.6 5 8.3c0 5 3.2 9.4 7 12.2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.6" />
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

function ProgramYa40FaqAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="program-ya40-faq-acc" role="region" aria-label="Frequently asked questions">
      {PROGRAM_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-faq-panel-${index + 1}`
        const buttonId = `${baseId}-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'program-ya40-faq-acc__item program-ya40-faq-acc__item--open' : 'program-ya40-faq-acc__item'}
          >
            <h3 className="program-ya40-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="program-ya40-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="program-ya40-faq-acc__question">{item.question}</span>
                <span className="program-ya40-faq-acc__toggle" aria-hidden="true">
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
              className="program-ya40-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="program-ya40-faq-acc__panel">
                <p className="program-ya40-faq-acc__answer">{item.answer}</p>
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
    <article className="program-ya40-facts-card">
      <span className="program-ya40-facts-card__number" aria-hidden>
        {card.number}
      </span>
      <div className="program-ya40-facts-card__icon-wrap">
        <HowItWorksIcon type={card.icon} />
      </div>
      <h3 className="program-ya40-facts-card__title">{card.title}</h3>
      <p className="program-ya40-facts-card__body">{card.body}</p>
    </article>
  )
}

function TrustStatCard({ card }) {
  return (
    <article className={`program-ya40-trust-card program-ya40-trust-card--${card.variant}`}>
      <p className="program-ya40-trust-card__stat">{card.stat}</p>
      <h3 className="program-ya40-trust-card__label">{card.label}</h3>
      <p className="program-ya40-trust-card__body">{card.body}</p>
    </article>
  )
}

function GuidanceCard({ card }) {
  return (
    <article className={`program-ya40-guidance-card program-ya40-guidance-card--${card.theme}`}>
      <span className="program-ya40-guidance-card__number" aria-hidden>
        {card.number}
      </span>
      <p className="program-ya40-guidance-card__eyebrow">{card.eyebrow}</p>
      <div className="program-ya40-guidance-card__title-row">
        <div className="program-ya40-guidance-card__icon-wrap">
          <GuidanceCardIcon type={card.icon} />
        </div>
        <h3 className="program-ya40-guidance-card__title">{card.title}</h3>
      </div>
      <p className="program-ya40-guidance-card__body text-start">{card.body}</p>
      <ul className="program-ya40-guidance-card__list">
        {card.items.map((item) => (
          <li key={item} className="program-ya40-guidance-card__list-item">
            <IconCheck className="program-ya40-guidance-card__check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="program-ya40-guidance-card__footer">{card.footer}</p>
    </article>
  )
}

/** Young After 40 program — Lifescc programs line. */
export default function ProgramYoungAfter40Page() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-ya40-page">
        <section
          className="program-ya40-hero"
          aria-labelledby="program-ya40-heading"
          style={{ backgroundImage: `url(${youngHeroImg})` }}
        >
          <div className="program-ya40-hero__scrim" aria-hidden />
          <div className="program-ya40-hero__inner container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-ya40-hero__copy text-start">
                <p className="program-ya40-hero__eyebrow">Programs</p>
                <h1 id="program-ya40-heading" className="program-ya40-hero__title">
                  Young After 40
                </h1>
                <p className="program-ya40-hero__lead">
                  You Have Tried Everything. You Have Not Tried Finding the Actual Reason.
                </p>
                <ul className="program-ya40-hero__badges" aria-label="Program highlights">
                  {TRUST_BADGES.map((label) => (
                    <li key={label}>
                      <span className="program-ya40-hero__badge">{label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill program-ya40-hero__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>

              <div className="col-lg-5 program-ya40-hero__media-col">
                <figure className="program-ya40-hero__figure">
                  <img
                    src={youngHeroImg}
                    alt="Young After 40 at Lifescc"
                    className="program-ya40-hero__img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-ya40-audience" aria-label="Who Young After 40 is for">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-ya40-audience__card">
                  <p className="program-ya40-audience__text">{AUDIENCE_TEXT}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-ya40-supports" aria-labelledby="program-ya40-supports-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-ya40-supports__intro">
                <p className="program-ya40-supports__pill text-start">
                  <IconHeartPulse />
                  <span>young after 40</span>
                </p>
                <h2 id="program-ya40-supports-heading" className="program-ya40-supports__title text-center">
                  What <span className="program-ya40-supports__brand">360°</span> young after 40 care supports
                </h2>
                <p className="program-ya40-supports__lead text-center">
                After 40 You Can Feel Young Again. Active. Energetic. Fit From the Inside Out.
                </p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-ya40-supports__highlights-card text-start">
                  <p className="program-ya40-supports__card-badge text-start">Program highlights</p>
                  <div className="row g-4 g-lg-5">
                    <div className="col-md-6">
                      <ul className="program-ya40-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(0, 3).map((item) => (
                          <li key={item} className="program-ya40-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="program-ya40-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(3).map((item) => (
                          <li key={item} className="program-ya40-supports__list-item">
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

            <div className="row justify-content-center g-4 program-ya40-supports__cards-row">
              <div className="col-lg-6">
                <article className="program-ya40-supports__note-card program-ya40-supports__note-card--pink text-start">
                  <p className="program-ya40-supports__note-text">
                  I want to feel the way I felt at 32 — energetic, sharp, active. I want to walk into my office and feel strong. I want to come home and still have energy for my family. I want to look in the mirror and recognise myself again. Our programme is designed exactly for this.
                  </p>
                </article>
              </div>
              <div className="col-lg-6">
                <article className="program-ya40-supports__note-card text-start">
                  <p className="program-ya40-supports__card-badge program-ya40-supports__card-badge--inline text-start">
                    Good to know
                  </p>
                  <h3 className="program-ya40-supports__note-title text-start">Hormonal consistency</h3>
                  <p className="program-ya40-supports__note-text">
                  LIFErise is a wellness and nutrition support programme. All diet plans are based on your blood reports. Results vary by individual. Our team supports your health goals through scientifically-designed nutrition, fitness coaching and doctor supervision — not medical treatment.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-ya40-guidance" aria-labelledby="program-ya40-guidance-heading">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-start program-ya40-guidance__intro-row">
              <div className="col-lg-6 text-start">
                <p className="program-ya40-guidance__pill">
                  <IconCube />
                  <span>Expert guidance</span>
                </p>
                <h2 id="program-ya40-guidance-heading" className="program-ya40-guidance__title">
                What You Experience{' '}
                  <span className="program-ya40-guidance__brand">expert guidance</span>
                </h2>
              </div>
              <div className="col-lg-6 text-start">
                <p className="program-ya40-guidance__lead text-start">
                After 40 your body changes — but it does not have to slow you down. Our programme is designed to make you feel new from within. Weight management, nutrition, fitness and medical support — all personalised, all online — so you feel energetic at your office, sharp in your business, and fully alive in every moment of your life.
                </p>
              </div>
            </div>

            <div className="row g-4 program-ya40-guidance__cards-row">
              {GUIDANCE_CARDS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <GuidanceCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-ya40-trust" aria-labelledby="program-ya40-trust-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-ya40-trust__intro text-center">
                <p className="program-ya40-trust__pill">
                  <IconStar />
                  <span>Why choose us</span>
                </p>
                <h2 id="program-ya40-trust-heading" className="program-ya40-trust__title">
                  Why clients trust <span className="program-ya40-trust__brand">Lifescc</span>
                </h2>
              </div>
            </div>

            <div className="row g-4 program-ya40-trust__cards-row">
              {TRUST_STATS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <TrustStatCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-ya40-facts" aria-labelledby="program-ya40-facts-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-ya40-facts__intro text-center">
                <p className="program-ya40-facts__pill">
                  <span className="program-ya40-facts__pill-dot" aria-hidden />
                  <span>The facts</span>
                </p>
                <h2 id="program-ya40-facts-heading" className="program-ya40-facts__title">
                  How our{' '}
                  <span className="program-ya40-facts__brand">young after 40 program</span> works?
                </h2>
              </div>
            </div>

            <div className="row g-4 program-ya40-facts__cards-row">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <HowItWorksCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-ya40-ai" aria-labelledby="program-ya40-ai-heading">
          <div className="container">
            <article className="program-ya40-ai__panel">
              <div className="row g-4 g-xl-5 align-items-center">
                <div className="col-lg-6 program-ya40-ai__copy text-start">
                  <p className="program-ya40-ai__pill">
                    <IconSparkle />
                    <span>AI powered wellness</span>
                  </p>
                  <h2 id="program-ya40-ai-heading" className="program-ya40-ai__title">
                    Smarter programs, refreshed by <span className="program-ya40-ai__brand">AI insight</span>
                  </h2>
                  <p className="program-ya40-ai__lead">
                    Our AI-assisted approach studies your health profile, daily routine, and transformation goals to
                    shape a more precise plan. You still get human coaching, but every recommendation starts with
                    sharper data.
                  </p>

                  <div className="row g-3 program-ya40-ai__features">
                    {AI_FEATURE_CARDS.map((card) => (
                      <div key={card.id} className="col-sm-6">
                        <article className="program-ya40-ai-feature">
                          <span className="program-ya40-ai-feature__num">{card.number}</span>
                          <h3 className="program-ya40-ai-feature__title">{card.title}</h3>
                          <p className="program-ya40-ai-feature__body">{card.body}</p>
                        </article>
                      </div>
                    ))}
                  </div>

                  <ul className="program-ya40-ai__tags" aria-label="Supported conditions">
                    {AI_CONDITION_TAGS.map((tag) => (
                      <li key={tag}>
                        <span className="program-ya40-ai__tag">
                          <span className="program-ya40-ai__tag-dot" aria-hidden />
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-lg-6 program-ya40-ai__visual-col">
                  <div className="program-ya40-ai-compare">
                    <figure className="program-ya40-ai-compare__card program-ya40-ai-compare__card--before">
                      <img src={ca1Img} alt="" className="program-ya40-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-ya40-ai-compare__badge program-ya40-ai-compare__badge--before">
                        Before AI
                      </span>
                      <figcaption className="program-ya40-ai-compare__caption">
                        <strong>Manual plan</strong>
                        <span>Generic routine and delayed corrections</span>
                      </figcaption>
                    </figure>

                    <figure className="program-ya40-ai-compare__card program-ya40-ai-compare__card--after">
                      <img src={ca2Img} alt="" className="program-ya40-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-ya40-ai-compare__badge program-ya40-ai-compare__badge--after">
                        After AI
                      </span>
                      <figcaption className="program-ya40-ai-compare__caption">
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

        <section className="program-ya40-faq" aria-labelledby="program-ya40-faq-heading">
          <div className="container">
            <article className="program-ya40-faq__panel">
              <div className="row g-4 g-xl-5 align-items-start">
                <div className="col-lg-5 program-ya40-faq__copy text-start">
                  <p className="program-ya40-faq__pill">
                    <IconSparkle />
                    <span>FAQs</span>
                  </p>
                  <h2 id="program-ya40-faq-heading" className="program-ya40-faq__title">
                    Questions, clearly <span className="program-ya40-faq__brand">answered</span>
                  </h2>
                  <p className="program-ya40-faq__lead">
                    A streamlined overview of membership, support, and planning so you can get started with clarity
                    and confidence.
                  </p>
                </div>

                <div className="col-lg-7">
                  <ProgramYa40FaqAccordion />
                </div>
              </div>
            </article>
          </div>
        </section>

        <WeightLossConsultationStrip
          sourcePage="program_young_after_40"
          bannerImage={youngHeroImg}
          stripClassName="program-ya40-book-strip"
          treatmentLabel="Young After 40"
          title="Book a consultation for Young After 40"
          subtitle="Tell us your goals — we’ll help you start with a structured, science-backed plan."
        />
      </main>
      <SiteFooter />
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </div>
  )
}
