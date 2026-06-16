import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import weightManagementImg from '../assets/weightmanagement.jpeg'
import sec2Img from '../assets/sec2.png'
import clientStoriesImg from '../assets/360-weight-.png'
import ca1Img from '../assets/ca1.avif'
import ca2Img from '../assets/ca2.avif'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './Program360WeightManagementPage.css'

const TRUST_BADGES = ['Premium Guidance', 'Modern Protocols', 'Long-Term Results']

const AUDIENCE_TEXT =
  '360° is for the person who is done trying things that half-work. Who is tired of losing the same 10 kg and gaining 12 back. Who wants to walk into a family event and feel proud. Who wants to keep up with their children. Who wants to live — not just exist — in their body.'

const CLIENT_STORIES = [
  'I went to my daughter\'s wedding at my ideal weight. For the first time in 15 years I was proud to be in the photos.',
  'I climbed 5 floors at my office without stopping to breathe at the top. My colleague asked if I had started running. I said no — I started LIFErise.',
  'It has been 18 months since I finished the programme. The weight has not come back. For the first time in my adult life — it has not come back.',
]

const PROGRAM_HIGHLIGHTS = [
  'Science-backed weight reduction protocols',
  'Root-cause mapping from day one',
  'Energy, mobility, and confidence improvements',
  'Blood report-guided meal and supplement planning',
  'Body composition focus, not scale alone',
  'Structured reviews to avoid weight regain',
]

function IconHeartPulse() {
  return (
    <svg
      className="program-wm360-supports__heart"
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

function IconCheck({ className = 'program-wm360-supports__check' }) {
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
    id: 'blood-assessment',
    number: '01',
    theme: 'green',
    eyebrow: 'DAY 1 · MANDATORY',
    title: 'Root-cause blood assessment',
    body:
      'A detailed panel identifies thyroid, insulin, inflammation, and hormonal contributors before finalising your plan.',
    items: [
      'Clear diagnosis from the start',
      'Targets biology, not guesswork',
      'Foundation for long-term results',
    ],
    footer: 'DAY 1 · QUARTERLY REVIEW',
    icon: 'droplet',
  },
  {
    id: 'body-composition',
    number: '02',
    theme: 'blue',
    eyebrow: 'MONTHLY · AT HOME',
    title: 'Body composition tracking',
    body:
      'Track fat %, muscle, and visceral markers to ensure progress is healthy and not just scale-driven.',
    items: [
      'Measure fat and muscle balance',
      'Monthly correction checkpoints',
      'Data-led decision making',
    ],
    footer: 'MONTHLY · HOME DEVICE',
    icon: 'chart',
  },
  {
    id: 'behaviour',
    number: '03',
    theme: 'pink',
    eyebrow: 'MONTHLY · PRIVATE',
    title: 'Behaviour and mindset support',
    body: 'Break stress-eating patterns and improve consistency with guided behaviour interventions.',
    items: [
      'Control reactive food patterns',
      'Build confidence in routines',
      'Reduce rebound risk',
    ],
    footer: 'MONTHLY · CONFIDENTIAL',
    icon: 'heart',
  },
  {
    id: 'nutrition',
    number: '04',
    theme: 'amber',
    eyebrow: 'DIETITIAN · 2–4 CALLS / MONTH',
    title: 'Precision nutrition coaching',
    body: 'Nutrition is adapted using labs, progress, and lifestyle so the plan stays practical and effective.',
    items: [
      'Report-based nutrition strategy',
      'No generic meal templates',
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
          d="M12 2.5c3.5 5.5 7 9.2 7 13a7 7 0 1 1-14 0c0-3.8 3.5-7.5 7-13z"
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
        <path d="M4 19h16M7 16V9M12 16V6M17 16v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'heart') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20.5s-6.5-4.2-8.5-8.2C1.8 9.2 3.6 6 6.8 6c1.8 0 3.2.9 4.2 2.1C12 7.1 13.4 6 15.2 6c3.2 0 5 3.2 3.3 6.3-2 4-8.5 8.2-8.5 8.2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M4 12h4l2-2 2 3 3-4 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 8h14l-1 11H6L5 8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
    id: 'appetite',
    number: '01',
    icon: 'pill',
    title: 'Appetite & metabolism control',
    body:
      "We support your body's natural satiety signals and metabolism to make fat loss feel natural instead of a constant struggle.",
  },
  {
    id: 'energy',
    number: '02',
    icon: 'hourglass',
    title: 'Sustained energy & satiety',
    body:
      'By design, our diet structures regulate blood sugar levels, keeping your energy stable and cravings under control.',
  },
  {
    id: 'roadmap',
    number: '03',
    icon: 'clipboard',
    title: 'Clinically-led roadmap',
    body: 'Every step is guided by clinical research, ensuring safe, healthy, and evidence-based weight reduction.',
  },
  {
    id: 'support',
    number: '04',
    icon: 'shield',
    title: 'Doctor & dietitian support',
    body:
      'Continuous oversight from qualified experts to adjust your intake, monitor reports, and ensure safe progress.',
  },
  {
    id: 'food',
    number: '05',
    icon: 'egg',
    title: 'Real food, no starvation',
    body:
      'No extreme calorie cutting. We focus on nutrient density, quality proteins, and fiber from foods available in your kitchen.',
  },
  {
    id: 'habits',
    number: '06',
    icon: 'target',
    title: 'Sustainable habit transition',
    body:
      'We coach you on behavioral resets so you can confidently maintain your target weight long after the active program.',
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
  if (type === 'clipboard') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 3h6v3H9zM8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 10c2-1 4-1 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function Program360FaqAccordion() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="program-wm360-faq-acc" role="region" aria-label="Frequently asked questions">
      {PROGRAM_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-faq-panel-${index + 1}`
        const buttonId = `${baseId}-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'program-wm360-faq-acc__item program-wm360-faq-acc__item--open' : 'program-wm360-faq-acc__item'}
          >
            <h3 className="program-wm360-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="program-wm360-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="program-wm360-faq-acc__question">{item.question}</span>
                <span className="program-wm360-faq-acc__toggle" aria-hidden="true">
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
              className="program-wm360-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="program-wm360-faq-acc__panel">
                <p className="program-wm360-faq-acc__answer">{item.answer}</p>
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
    <article className="program-wm360-facts-card">
      <span className="program-wm360-facts-card__number" aria-hidden>
        {card.number}
      </span>
      <div className="program-wm360-facts-card__icon-wrap">
        <HowItWorksIcon type={card.icon} />
      </div>
      <h3 className="program-wm360-facts-card__title">{card.title}</h3>
      <p className="program-wm360-facts-card__body">{card.body}</p>
    </article>
  )
}

function TrustStatCard({ card }) {
  return (
    <article className={`program-wm360-trust-card program-wm360-trust-card--${card.variant}`}>
      <p className="program-wm360-trust-card__stat">{card.stat}</p>
      <h3 className="program-wm360-trust-card__label">{card.label}</h3>
      <p className="program-wm360-trust-card__body">{card.body}</p>
    </article>
  )
}

function GuidanceCard({ card }) {
  return (
    <article className={`program-wm360-guidance-card program-wm360-guidance-card--${card.theme}`}>
      <span className="program-wm360-guidance-card__number" aria-hidden>
        {card.number}
      </span>
      <p className="program-wm360-guidance-card__eyebrow">{card.eyebrow}</p>
      <div className="program-wm360-guidance-card__title-row">
        <div className="program-wm360-guidance-card__icon-wrap">
          <GuidanceCardIcon type={card.icon} />
        </div>
        <h3 className="program-wm360-guidance-card__title">{card.title}</h3>
      </div>
      <p className="program-wm360-guidance-card__body text-start">{card.body}</p>
      <ul className="program-wm360-guidance-card__list">
        {card.items.map((item) => (
          <li key={item} className="program-wm360-guidance-card__list-item">
            <IconCheck className="program-wm360-guidance-card__check" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="program-wm360-guidance-card__footer">{card.footer}</p>
    </article>
  )
}

/** 360° Weight Management program — Lifescc programs line. */
export default function Program360WeightManagementPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-wm360-page">
        <section
          className="program-wm360-hero"
          aria-labelledby="program-wm360-heading"
          style={{ backgroundImage: `url(${weightManagementImg})` }}
        >
          <div className="program-wm360-hero__scrim" aria-hidden />
          <div className="program-wm360-hero__inner container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-wm360-hero__copy text-start">
                <p className="program-wm360-hero__eyebrow">Programs</p>
                <h1 id="program-wm360-heading" className="program-wm360-hero__title">
                  360° Weight Management
                </h1>
                <p className="program-wm360-hero__lead">
                  You Have Tried Everything. You Have Not Tried Finding the Actual Reason.
                </p>
                <ul className="program-wm360-hero__badges" aria-label="Program highlights">
                  {TRUST_BADGES.map((label) => (
                    <li key={label}>
                      <span className="program-wm360-hero__badge">{label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill program-wm360-hero__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a Consultation
                </button>
              </div>

              <div className="col-lg-5 program-wm360-hero__media-col">
                <figure className="program-wm360-hero__figure">
                  <img
                    src={weightManagementImg}
                    alt="360° Weight Management at Lifescc"
                    className="program-wm360-hero__img"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-wm360-audience" aria-label="Who 360° is for">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-wm360-audience__card">
                  <p className="program-wm360-audience__text">{AUDIENCE_TEXT}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-wm360-symptom" aria-labelledby="program-wm360-symptom-heading">
          <div className="container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-wm360-symptom__copy text-start">
                <h2 id="program-wm360-symptom-heading" className="program-wm360-symptom__title">
                  The weight is not the problem. It is the symptom
                </h2>
                <p className="program-wm360-symptom__quote">
                  &ldquo;I have done every diet. Every gym. Every product. The weight always comes back. Sometimes
                  more. I don&apos;t know why. My doctor says eat less and exercise more. I am doing that. It is not
                  working. I am running out of hope — and I am running out of time.&rdquo;
                </p>
              </div>

              <div className="col-lg-5 program-wm360-symptom__media-col">
                <figure className="program-wm360-symptom__figure">
                  <img
                    src={sec2Img}
                    alt="Understanding weight as a symptom at Lifescc"
                    className="program-wm360-symptom__img"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-wm360-stories" aria-labelledby="program-wm360-stories-heading">
          <div className="container">
            <div className="row align-items-center justify-content-between g-4 g-lg-5">
              <div className="col-lg-6 program-wm360-stories__media-col">
                <figure className="program-wm360-stories__figure">
                  <img
                    src={clientStoriesImg}
                    alt="360° weight management client success stories"
                    className="program-wm360-stories__img"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>

              <div className="col-lg-6 program-wm360-stories__copy text-start">
                <h2 id="program-wm360-stories-heading" className="program-wm360-stories__title">
                  What 360° Clients Tell Us After the Programme
                </h2>
                {CLIENT_STORIES.map((story) => (
                  <p key={story} className="program-wm360-stories__quote">
                    &ldquo;{story}&rdquo;
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="program-wm360-supports" aria-labelledby="program-wm360-supports-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-wm360-supports__intro">
                <p className="program-wm360-supports__pill text-start">
                  <IconHeartPulse />
                  <span>360 weight management</span>
                </p>
                <h2 id="program-wm360-supports-heading" className="program-wm360-supports__title text-center">
                  What <span className="program-wm360-supports__brand">360</span>° weight management supports
                </h2>
                <p className="program-wm360-supports__lead text-center">
                  A full-circle approach for healthy fat loss: labs, metabolism, behaviour, and nutrition aligned so
                  results are sustainable.
                </p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-12">
                <article className="program-wm360-supports__highlights-card text-start">
                  <p className="program-wm360-supports__card-badge text-start">Program highlights</p>
                  <div className="row g-4 g-lg-5">
                    <div className="col-md-6">
                      <ul className="program-wm360-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(0, 3).map((item) => (
                          <li key={item} className="program-wm360-supports__list-item">
                            <IconCheck />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="program-wm360-supports__list">
                        {PROGRAM_HIGHLIGHTS.slice(3).map((item) => (
                          <li key={item} className="program-wm360-supports__list-item">
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

            <div className="row justify-content-center g-4 program-wm360-supports__cards-row">
              <div className="col-lg-6">
                <article className="program-wm360-supports__note-card program-wm360-supports__note-card--pink text-start">
                  <p className="program-wm360-supports__note-text">
                    We do not chase short-term drops. We correct the drivers behind weight gain and build habits your
                    body can sustain.
                  </p>
                </article>
              </div>
              <div className="col-lg-6">
                <article className="program-wm360-supports__note-card text-start">
                  <p className="program-wm360-supports__card-badge program-wm360-supports__card-badge--inline text-start">
                    Good to know
                  </p>
                  <h3 className="program-wm360-supports__note-title text-start">Sustainable rhythm</h3>
                  <p className="program-wm360-supports__note-text">
                    Clinical review plus coaching support helps maintain progress long after the initial weight-loss
                    phase.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="program-wm360-guidance" aria-labelledby="program-wm360-guidance-heading">
          <div className="container">
            <div className="row g-4 g-lg-5 align-items-start program-wm360-guidance__intro-row">
              <div className="col-lg-6 text-start">
                <p className="program-wm360-guidance__pill">
                  <IconCube />
                  <span>Expert guidance</span>
                </p>
                <h2 id="program-wm360-guidance-heading" className="program-wm360-guidance__title">
                  Build fat-loss results with{' '}
                  <span className="program-wm360-guidance__brand">expert guidance</span>
                </h2>
              </div>
              <div className="col-lg-6 text-start">
                <p className="program-wm360-guidance__lead text-start">
                  Medical supervision, composition tracking, mindset support, and precision nutrition work together
                  month after month.
                </p>
              </div>
            </div>

            <div className="row g-4 program-wm360-guidance__cards-row">
              {GUIDANCE_CARDS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <GuidanceCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-wm360-trust" aria-labelledby="program-wm360-trust-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-wm360-trust__intro text-center">
                <p className="program-wm360-trust__pill">
                  <IconStar />
                  <span>Why choose us</span>
                </p>
                <h2 id="program-wm360-trust-heading" className="program-wm360-trust__title">
                  Why clients trust <span className="program-wm360-trust__brand">Lifescc</span>
                </h2>
              </div>
            </div>

            <div className="row g-4 program-wm360-trust__cards-row">
              {TRUST_STATS.map((card) => (
                <div key={card.id} className="col-lg-3 col-md-6">
                  <TrustStatCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-wm360-facts" aria-labelledby="program-wm360-facts-heading">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 program-wm360-facts__intro text-center">
                <p className="program-wm360-facts__pill">
                  <span className="program-wm360-facts__pill-dot" aria-hidden />
                  <span>The facts</span>
                </p>
                <h2 id="program-wm360-facts-heading" className="program-wm360-facts__title">
                  How our{' '}
                  <span className="program-wm360-facts__brand">360° weight management program</span> works?
                </h2>
              </div>
            </div>

            <div className="row g-4 program-wm360-facts__cards-row">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <HowItWorksCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-wm360-ai" aria-labelledby="program-wm360-ai-heading">
          <div className="container">
            <article className="program-wm360-ai__panel">
              <div className="row g-4 g-xl-5 align-items-center">
                <div className="col-lg-6 program-wm360-ai__copy text-start">
                  <p className="program-wm360-ai__pill">
                    <IconSparkle />
                    <span>AI powered wellness</span>
                  </p>
                  <h2 id="program-wm360-ai-heading" className="program-wm360-ai__title">
                    Smarter programs, refreshed by <span className="program-wm360-ai__brand">AI insight</span>
                  </h2>
                  <p className="program-wm360-ai__lead">
                    Our AI-assisted approach studies your health profile, daily routine, and transformation goals to
                    shape a more precise plan. You still get human coaching, but every recommendation starts with
                    sharper data.
                  </p>

                  <div className="row g-3 program-wm360-ai__features">
                    {AI_FEATURE_CARDS.map((card) => (
                      <div key={card.id} className="col-sm-6">
                        <article className="program-wm360-ai-feature">
                          <span className="program-wm360-ai-feature__num">{card.number}</span>
                          <h3 className="program-wm360-ai-feature__title">{card.title}</h3>
                          <p className="program-wm360-ai-feature__body">{card.body}</p>
                        </article>
                      </div>
                    ))}
                  </div>

                  <ul className="program-wm360-ai__tags" aria-label="Supported conditions">
                    {AI_CONDITION_TAGS.map((tag) => (
                      <li key={tag}>
                        <span className="program-wm360-ai__tag">
                          <span className="program-wm360-ai__tag-dot" aria-hidden />
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="col-lg-6 program-wm360-ai__visual-col">
                  <div className="program-wm360-ai-compare">
                    <figure className="program-wm360-ai-compare__card program-wm360-ai-compare__card--before">
                      <img src={ca1Img} alt="" className="program-wm360-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-wm360-ai-compare__badge program-wm360-ai-compare__badge--before">
                        Before AI
                      </span>
                      <figcaption className="program-wm360-ai-compare__caption">
                        <strong>Manual plan</strong>
                        <span>Generic routine and delayed corrections</span>
                      </figcaption>
                    </figure>

                    <figure className="program-wm360-ai-compare__card program-wm360-ai-compare__card--after">
                      <img src={ca2Img} alt="" className="program-wm360-ai-compare__img" loading="lazy" decoding="async" />
                      <span className="program-wm360-ai-compare__badge program-wm360-ai-compare__badge--after">
                        After AI
                      </span>
                      <figcaption className="program-wm360-ai-compare__caption">
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

        <section className="program-wm360-faq" aria-labelledby="program-wm360-faq-heading">
          <div className="container">
            <article className="program-wm360-faq__panel">
              <div className="row g-4 g-xl-5 align-items-start">
                <div className="col-lg-5 program-wm360-faq__copy text-start">
                  <p className="program-wm360-faq__pill">
                    <IconSparkle />
                    <span>FAQs</span>
                  </p>
                  <h2 id="program-wm360-faq-heading" className="program-wm360-faq__title">
                    Questions, clearly <span className="program-wm360-faq__brand">answered</span>
                  </h2>
                  <p className="program-wm360-faq__lead">
                    A streamlined overview of membership, support, and planning so you can get started with clarity
                    and confidence.
                  </p>
                </div>

                <div className="col-lg-7">
                  <Program360FaqAccordion />
                </div>
              </div>
            </article>
          </div>
        </section>

        <WeightLossConsultationStrip
          sourcePage="program_360_weight_management"
          bannerImage={weightManagementImg}
          stripClassName="program-wm360-book-strip"
          treatmentLabel="360° Weight Management"
          title="Book a consultation for 360° Weight Management"
          subtitle="Tell us your goals — we’ll help you start with a structured, science-backed plan."
        />
      </main>
      <SiteFooter />
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
    </div>
  )
}
