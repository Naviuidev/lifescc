import { useCallback } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import refHeroImg from '../assets/refImg.png'
import familyEatingImg from '../assets/family_eating.png'
import cimg1 from '../assets/cimg1.jpg'
import cimg2 from '../assets/cimg2.jpg'
import cimg3 from '../assets/cimg3.jpg'
import pratibhaImg from '../assets/pratibha.jpg'
import './HomePage.css'
import './ProgramKidsNutritionPage.css'

const PROGRAMME_FORM_SECTION_ID = 'program-kn-book-consultation'

const WHATSAPP_ENQUIRY_LINKS = {
  threeMonth:
    'https://api.whatsapp.com/send/?phone=919701394111&text=Hi%2C+I+want+to+know+about+the+LIFErise+3-Month+Kids+Nutrition+Plan&type=phone_number&app_absent=0',
  sixMonth:
    'https://api.whatsapp.com/send/?phone=919701394111&text=Hi%2C+I+want+to+know+about+the+LIFErise+6-Month+Kids+Nutrition+Plan&type=phone_number&app_absent=0',
  twelveMonth:
    'https://api.whatsapp.com/send/?phone=919701394111&text=Hi%2C+I+want+to+know+about+the+LIFErise+12-Month+Kids+Nutrition+Plan&type=phone_number&app_absent=0',
}

function IconStarBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.2 5.2L20 8.3l-4.2 3.5L17.2 18 12 15.2 6.8 18l1.4-6.2L4 8.3l5.8-1.1L12 2z" />
    </svg>
  )
}

const REALITY_CARDS = [
  {
    id: 'sugar-junk',
    emoji: '🍟',
    title: 'Too Much Sugar & Junk',
    body: 'Packaged snacks, soft drinks, and fried food have crept in and replaced real, balanced meals.',
  },
  {
    id: 'picky-eating',
    emoji: '🙅',
    title: 'Picky, Fussy Eating',
    body: 'Mealtimes turn into a fight, vegetables get rejected, and the same three foods repeat on loop.',
  },
  {
    id: 'skipped-meals',
    emoji: '⏰',
    title: 'Skipped, Unbalanced Meals',
    body: 'Rushed breakfasts, no fixed routine, and missing key nutrients during crucial growth years.',
  },
  {
    id: 'energy-crashes',
    emoji: '🔋',
    title: 'Energy Crashes & Low Focus',
    body: 'Sugar highs and slumps that affect mood, school performance, and concentration.',
  },
  {
    id: 'screen-snacking',
    emoji: '📱',
    title: 'Screen-Time Snacking',
    body: 'Eating on autopilot in front of screens — no awareness of what, or how much, is going in.',
  },
  {
    id: 'weight-patterns',
    emoji: '⚖️',
    title: 'Unhealthy Weight Patterns',
    body: "Imbalanced eating leading to weight that's too low, too high, or simply not matched to growth.",
  },
]

function RealityCard({ card }) {
  return (
    <article className="program-kn-reality-card text-start">
      <span className="program-kn-reality-card__icon" aria-hidden>
        {card.emoji}
      </span>
      <h3 className="program-kn-reality-card__title">{card.title}</h3>
      <p className="program-kn-reality-card__body">{card.body}</p>
    </article>
  )
}

const STAKES_CARDS = [
  {
    id: 'habits-harden',
    number: '01',
    title: 'Habits That Harden',
    body: 'Junk-food preferences become lifelong defaults — far harder to undo at 25 than at 5.',
  },
  {
    id: 'uneven-growth',
    number: '02',
    title: 'Uneven Growth & Energy',
    body: "Missing the right nutrients at the right age can affect a child's energy, focus, and development rhythm.",
  },
  {
    id: 'food-bond',
    number: '03',
    title: 'A Difficult Bond With Food',
    body: 'Years of mealtime stress can turn food into anxiety and conflict instead of nourishment.',
  },
  {
    id: 'lifestyle-risks',
    number: '04',
    title: 'Rising Lifestyle Risks',
    body: 'Poor early eating habits are widely linked to weight and lifestyle concerns later in life.',
  },
]

function StakesCard({ card }) {
  return (
    <article className="program-kn-stakes-card text-start">
      <span className="program-kn-stakes-card__number" aria-hidden>
        {card.number}
      </span>
      <h3 className="program-kn-stakes-card__title">{card.title}</h3>
      <p className="program-kn-stakes-card__body">{card.body}</p>
    </article>
  )
}

const WHAT_WE_DO_CARDS = [
  {
    id: 'balanced-design',
    number: '01',
    title: 'Balanced by Design',
    body: 'Every plan covers the right mix of nutrients for healthy growth — nourishment, never restriction.',
    image: cimg1,
    alt: 'Fresh vegetables and balanced meal ingredients arranged on a table',
  },
  {
    id: 'age-appropriate',
    number: '02',
    title: 'Age-Appropriate',
    body: 'A 5-year-old and a 12-year-old need very different things. Plans are built to match each stage.',
    image: cimg2,
    alt: 'Colourful fruit platter with pineapple, berries, and citrus slices',
  },
  {
    id: 'built-around-child',
    number: '03',
    title: 'Built Around Your Child',
    body: 'Real preferences, routines, and requirements — so the plan actually gets followed at home.',
    image: cimg3,
    alt: 'Mother and daughter preparing food together in a bright kitchen',
  },
]

function WhatWeDoCard({ card }) {
  return (
    <article className="program-kn-what-card">
      <div className="program-kn-what-card__frame">
        <img src={card.image} alt={card.alt} className="program-kn-what-card__img" decoding="async" />
        <div className="program-kn-what-card__panel text-start">
          <span className="program-kn-what-card__number" aria-hidden>
            {card.number}
          </span>
          <h3 className="program-kn-what-card__title">{card.title}</h3>
          <p className="program-kn-what-card__body">{card.body}</p>
        </div>
      </div>
    </article>
  )
}

const HOW_IT_WORKS_STEPS = [
  {
    id: 'diet-consultation',
    step: 1,
    title: 'Diet Consultation',
    body: "We understand your child's age, routine, eating patterns, growth, and goals.",
  },
  {
    id: 'personalised-plan',
    step: 2,
    title: 'Personalised Plan',
    body: "Our dieticians build a balanced, age-appropriate diet plan as per Dr. Prathibha's protocols.",
  },
  {
    id: 'guided-follow-through',
    step: 3,
    title: 'Guided Follow-Through',
    body: 'Regular check-ins and adjustments as your child grows, progresses, and builds new habits.',
  },
]

function HowItWorksStep({ step }) {
  return (
    <article className="program-kn-steps-card text-start">
      <span className="program-kn-steps-card__number" aria-hidden>
        {step.step}
      </span>
      <h3 className="program-kn-steps-card__title">{step.title}</h3>
      <p className="program-kn-steps-card__body">{step.body}</p>
    </article>
  )
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

const PROGRAMME_PLANS = [
  {
    id: 'diet-consultation',
    label: 'Start Here',
    title: 'Diet Consultation',
    wasPrice: '₹2,499',
    price: '₹1,999',
    term: 'one-time',
    save: 'SAVE 20%',
    features: [
      '1-on-1 expert consultation',
      "Child's growth & habit review",
      'Starter balanced diet plan',
      'Best first step for parents',
    ],
    cta: 'Book Now',
    ctaHref: null,
    featured: false,
    popular: false,
  },
  {
    id: 'three-month',
    label: 'Build Routines',
    title: '3-Month Plan',
    wasPrice: '₹7,999',
    price: '₹5,999',
    term: 'per programme',
    save: 'SAVE 25%',
    features: [
      '1 diet consultation / month',
      '2 plan reviews / month',
      '1 online talk with your kid / month',
      'Parents counseling',
      'Kids-friendly recipes e-book',
    ],
    cta: 'Enquire',
    ctaHref: WHATSAPP_ENQUIRY_LINKS.threeMonth,
    featured: false,
    popular: false,
  },
  {
    id: 'six-month',
    label: 'Build Routines+',
    title: '6-Month Plan',
    wasPrice: '₹14,999',
    price: '₹9,999',
    term: 'per programme',
    save: 'SAVE 33%',
    features: [
      '1 diet consultation / month',
      '2 plan reviews / month',
      'Fridge & kitchen review (video call)',
      '1 online talk with your kid / month',
      'Parents counseling',
      'Kids-friendly recipes e-book',
      'Kids Zumba / yoga — 3x weekly',
    ],
    cta: 'Enquire',
    ctaHref: WHATSAPP_ENQUIRY_LINKS.sixMonth,
    featured: true,
    popular: true,
  },
  {
    id: 'twelve-month',
    label: 'Best Value',
    title: '12-Month Plan',
    wasPrice: '₹27,999',
    price: '₹16,999',
    term: 'per programme',
    save: 'SAVE 39%',
    features: [
      'Family diet plan included',
      '1 diet consultation / month',
      '2 plan reviews / month',
      'Fridge & kitchen review (video call)',
      '1 online talk with your kid / month',
      'Parents counseling',
      'Kids-friendly recipes e-book',
      'Kids Zumba / yoga — 3x weekly',
    ],
    cta: 'Enquire',
    ctaHref: WHATSAPP_ENQUIRY_LINKS.twelveMonth,
    featured: false,
    popular: false,
  },
]

function ProgrammePlanCard({ plan, onBookConsultation }) {
  const cardClass = plan.featured
    ? 'program-kn-programme-card program-kn-programme-card--featured text-start'
    : 'program-kn-programme-card text-start'

  return (
    <article className={cardClass}>
      {plan.popular ? (
        <span className="program-kn-programme-card__popular">Most Popular</span>
      ) : null}
      <p className="program-kn-programme-card__label">{plan.label}</p>
      <h3 className="program-kn-programme-card__title">{plan.title}</h3>
      <div className="program-kn-programme-card__pricing">
        <p className="program-kn-programme-card__price-row">
          <span className="program-kn-programme-card__was">{plan.wasPrice}</span>{' '}
          <span className="program-kn-programme-card__price">{plan.price}</span>
        </p>
        <p className="program-kn-programme-card__term">{plan.term}</p>
      </div>
      <span className="program-kn-programme-card__save">{plan.save}</span>
      <ul className="program-kn-programme-card__features">
        {plan.features.map((feature) => (
          <li key={feature} className="program-kn-programme-card__feature">
            <span className="program-kn-programme-card__check" aria-hidden>
              <IconCheck />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {plan.ctaHref ? (
        <a
          href={plan.ctaHref}
          className="program-kn-programme-card__cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {plan.cta}
        </a>
      ) : (
        <button type="button" className="program-kn-programme-card__cta" onClick={onBookConsultation}>
          {plan.cta}
        </button>
      )}
    </article>
  )
}

const PROGRAMME_BOUNDARIES = [
  {
    id: 'not-medical',
    lead: 'Not a medical treatment.',
    body: 'We do not provide clinical nutrition therapy or medication.',
  },
  {
    id: 'non-clinical',
    lead: 'Non-clinical.',
    body: "Children with serious underlying medical conditions require a doctor's referral before joining.",
  },
  {
    id: 'preventive-focus',
    lead: 'Preventive focus.',
    body: 'Our expertise is balanced, habit-based nutrition — not hospital-based therapy.',
  },
]

function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 10.8a13.4 13.4 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7.5l8 5.5 8-5.5M4 7.5h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Kids Nutrition program — Lifescc programs line. */
export default function ProgramKidsNutritionPage() {
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main program-kids-nutrition-page">
        <section className="program-kn-hero" aria-labelledby="program-kn-hero-heading">
          <div className="program-kn-hero__inner container">
            <div className="row align-items-center g-4 g-xl-5">
              <div className="col-lg-6 program-kn-hero__copy text-start">
                <p className="program-kn-hero__eyebrow">
                  — KIDS NUTRITION · GUIDED BY DR. K. PRATHIBHA
                </p>
                <h1 id="program-kn-hero-heading" className="program-kn-hero__title">
                  Raise a child who{' '}
                  <span className="program-kn-hero__title-accent">grows strong, fit &amp; healthy.</span>
                </h1>
                <p className="program-kn-hero__lead">
                  Age-appropriate, dietician-designed balanced diet plans that fuel healthy growth, steady energy,
                  and food habits that last a lifetime.
                </p>
                <div className="program-kn-hero__actions">
                  <button
                    type="button"
                    className="program-kn-hero__btn program-kn-hero__btn--primary"
                    onClick={() => scrollToSection('program-kn-programmes')}
                  >
                    View Programmes
                  </button>
                  <button
                    type="button"
                    className="program-kn-hero__btn program-kn-hero__btn--ghost"
                    onClick={() => scrollToSection('program-kn-how-it-works')}
                  >
                    How It Works
                  </button>
                </div>
              </div>

              <div className="col-lg-6 program-kn-hero__media-col">
                <figure className="program-kn-hero__figure">
                  <img
                    src={refHeroImg}
                    alt="Mother and child enjoying a healthy meal together"
                    className="program-kn-hero__img"
                    decoding="async"
                  />
                  <aside className="program-kn-hero__glass-card" aria-label="Programme highlight">
                    <span className="program-kn-hero__glass-icon" aria-hidden>
                      <IconStarBadge />
                    </span>
                    <h2 className="program-kn-hero__glass-title">Plans made for your child&apos;s age.</h2>
                    <p className="program-kn-hero__glass-body">
                      Built around your child&apos;s growth stage, needs, and routine.
                    </p>
                    <p className="program-kn-hero__glass-footer">
                      As per <span className="program-kn-hero__glass-name">Dr. K. Prathibha&apos;s</span> protocols.
                    </p>
                  </aside>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="program-kn-reality" aria-labelledby="program-kn-reality-heading">
          <div className="container">
            <div className="program-kn-reality__intro text-start">
              <p className="program-kn-reality__eyebrow">— THE REALITY TODAY</p>
              <h2 id="program-kn-reality-heading" className="program-kn-reality__title">
                What kids are <span className="program-kn-reality__title-accent">facing right now.</span>
              </h2>
              <p className="program-kn-reality__lead">
                The modern childhood plate looks very different from a generation ago — and it&apos;s quietly
                shaping how our children grow.
              </p>
            </div>

            <div className="row g-4 program-kn-reality__cards-row">
              {REALITY_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4 col-md-6">
                  <RealityCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-kn-stakes" aria-labelledby="program-kn-stakes-heading">
          <div className="container">
            <div className="program-kn-stakes__intro text-start">
              <p className="program-kn-stakes__eyebrow">— IF NOTHING CHANGES</p>
              <h2 id="program-kn-stakes-heading" className="program-kn-stakes__title">
                Today&apos;s habits{' '}
                <span className="program-kn-stakes__title-accent">become tomorrow&apos;s health.</span>
              </h2>
              <p className="program-kn-stakes__lead">
                Eating patterns set in childhood rarely fix themselves. Left unchecked, they tend to follow a child
                into their teens and adult life.
              </p>
            </div>

            <div className="row g-4 program-kn-stakes__cards-row">
              {STAKES_CARDS.map((card) => (
                <div key={card.id} className="col-lg-6">
                  <StakesCard card={card} />
                </div>
              ))}
            </div>

            <aside className="program-kn-stakes__callout text-center">
              <h3 className="program-kn-stakes__callout-title">The good news?</h3>
              <p className="program-kn-stakes__callout-body">
                Habits are easiest to shape early — and that is exactly what we do.
              </p>
            </aside>
          </div>
        </section>

        <section className="program-kn-banner" aria-label="Family enjoying a healthy meal together">
          <img
            src={familyEatingImg}
            alt="Family enjoying a healthy meal together at the kitchen table"
            className="program-kn-banner__img"
            decoding="async"
          />
        </section>

        <section className="program-kn-what" aria-labelledby="program-kn-what-heading">
          <div className="container">
            <div className="program-kn-what__intro text-start">
              <p className="program-kn-what__eyebrow">— WHAT WE DO</p>
              <h2 id="program-kn-what-heading" className="program-kn-what__title">
                Balanced diet plans for{' '}
                <span className="program-kn-what__title-accent">healthy growth</span> — as per age.
              </h2>
              <p className="program-kn-what__lead">
                We design balanced diet plans made specifically for children, matched to their age, growth stage,
                and individual requirements. Not a short-term fix — healthy growth and food habits built to last.
              </p>
            </div>

            <div className="row g-4 g-xl-5 program-kn-what__cards-row">
              {WHAT_WE_DO_CARDS.map((card) => (
                <div key={card.id} className="col-lg-4">
                  <WhatWeDoCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-kn-who" aria-labelledby="program-kn-who-heading">
          <div className="container">
            <div className="row align-items-center g-4 g-xl-5">
              <div className="col-lg-6 program-kn-who__copy text-start">
                <p className="program-kn-who__eyebrow">— WHO WE ARE</p>
                <h2 id="program-kn-who-heading" className="program-kn-who__title">
                  Healthy adults are{' '}
                  <span className="program-kn-who__title-accent">made in childhood kitchens.</span>
                </h2>
                <p className="program-kn-who__body">
                  LIFE RISE is a preventive wellness brand built on one simple belief: the food habits we build early
                  shape the health we carry for life.
                </p>
                <p className="program-kn-who__body">
                  Our Kids Nutrition programme is led by our Clinical Lead and Co-founder, and delivered by qualified
                  dieticians who design every plan around her proven nutrition protocols — combining sound nutritional
                  science with practical, real-world routines families can actually live with.
                </p>
              </div>

              <div className="col-lg-6">
                <aside className="program-kn-who__profile-card text-start" aria-label="Dr. K. Prathibha profile">
                  <div className="program-kn-who__profile-head">
                    <img
                      src={pratibhaImg}
                      alt="Dr. K. Prathibha, Clinical Lead and Co-founder"
                      className="program-kn-who__profile-photo"
                      decoding="async"
                    />
                    <span className="program-kn-who__profile-badge">Clinical Lead</span>
                  </div>
                  <h3 className="program-kn-who__profile-name">Dr. K. Prathibha</h3>
                  <p className="program-kn-who__profile-role">Co-founder, LIFE RISE</p>
                  <p className="program-kn-who__profile-bio">
                    Every diet plan our dieticians create is built on Dr. Prathibha&apos;s nutrition protocols —
                    ensuring each child receives balanced, age-appropriate guidance designed for healthy, confident
                    growth.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section
          id="program-kn-how-it-works"
          className="program-kn-steps"
          aria-labelledby="program-kn-steps-heading"
        >
          <div className="container">
            <div className="program-kn-steps__intro text-center">
              <p className="program-kn-steps__eyebrow">
                <span className="program-kn-steps__eyebrow-line" aria-hidden />
                How It Works
              </p>
              <h2 id="program-kn-steps-heading" className="program-kn-steps__title">
                Three simple steps to{' '}
                <span className="program-kn-steps__title-accent">a healthier child.</span>
              </h2>
            </div>

            <div className="row g-4 program-kn-steps__cards-row">
              {HOW_IT_WORKS_STEPS.map((step) => (
                <div key={step.id} className="col-lg-4">
                  <HowItWorksStep step={step} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="program-kn-programmes"
          className="program-kn-programmes"
          aria-labelledby="program-kn-programmes-heading"
        >
          <div className="container">
            <div className="program-kn-programmes__intro text-start">
              <p className="program-kn-programmes__eyebrow">— OUR PROGRAMMES</p>
              <h2 id="program-kn-programmes-heading" className="program-kn-programmes__title">
                Choose the journey that{' '}
                <span className="program-kn-programmes__title-accent">fits your child.</span>
              </h2>
              <p className="program-kn-programmes__lead">
                Start with a single consultation, or commit to a structured programme to make your kid fit and
                healthy.
              </p>
            </div>

            <div className="row g-4 g-xl-3 program-kn-programmes__cards-row">
              {PROGRAMME_PLANS.map((plan) => (
                <div key={plan.id} className="col-xl-3 col-lg-6">
                  <ProgrammePlanCard
                    plan={plan}
                    onBookConsultation={() => scrollToSection(PROGRAMME_FORM_SECTION_ID)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="program-kn-boundaries" aria-labelledby="program-kn-boundaries-heading">
          <div className="container">
            <aside className="program-kn-boundaries__card text-start">
              <h2 id="program-kn-boundaries-heading" className="program-kn-boundaries__title">
                Our Programme Boundaries
              </h2>
              <ul className="program-kn-boundaries__list">
                {PROGRAMME_BOUNDARIES.map((item) => (
                  <li key={item.id} className="program-kn-boundaries__item">
                    <strong className="program-kn-boundaries__lead">{item.lead}</strong>{' '}
                    <span className="program-kn-boundaries__body">{item.body}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="program-kn-cta" aria-labelledby="program-kn-cta-heading">
          <div className="container">
            <div className="program-kn-cta__inner text-center">
              <h2 id="program-kn-cta-heading" className="program-kn-cta__title">
                Give your child a{' '}
                <span className="program-kn-cta__title-accent">healthy head start.</span>
              </h2>
              <p className="program-kn-cta__lead">
                Balanced diet plans, built for their age — to help your kid grow fit, focused, and full of energy.
              </p>
              <button
                type="button"
                className="program-kn-cta__btn"
                onClick={() => scrollToSection(PROGRAMME_FORM_SECTION_ID)}
              >
                Book a Diet Consultation
              </button>
              <div className="program-kn-cta__contacts">
                <a href="tel:+919701394111" className="program-kn-cta__contact">
                  <IconPhone />
                  <span>+91 97013 94111</span>
                </a>
                <a href="mailto:contact@liferise.co" className="program-kn-cta__contact">
                  <IconMail />
                  <span>contact@liferise.co</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id={PROGRAMME_FORM_SECTION_ID}>
          <WeightLossConsultationStrip
            sourcePage="program_kids_nutrition"
            bannerImage={refHeroImg}
            stripClassName="program-kn-book-strip"
            treatmentLabel="Kids Nutrition"
            title="Book a diet consultation for your child"
            subtitle="Share your child's age, routine, and goals — we'll help you get started with a balanced plan."
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
