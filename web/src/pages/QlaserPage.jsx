import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import women1Banner from '../assets/women1.png'
import q1Img from '../assets/q1.jpg'
import q11Img from '../assets/q11.jpg'
import g1Img from '../assets/1g1.jpg'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './QlaserPage.css'

const PRINCIPLE_COPY = {
  heading: 'Principle of Q-switching',
  body:
    'Q-switching is achieved by putting some variable attenuator inside the laser\'s optical resonator. When the attenuator is functioning, the light which leaves the gain medium does not return, and lasing cannot begin. This attenuation inside the cavity corresponds to a decrease in the Q factor or quality factor of the optical resonator. A high Q factor corresponds to low resonator losses per round trip and vice versa. The variable attenuator is commonly called a "Q-switch" when used for this purpose.',
}

const QLASER_FAQ_ITEMS = [
  {
    title: 'A. How Q switch laser treatment works?',
    body:
      'The Q-switched laser is used to remove unwanted brown spots, sun freckles, or tattoos from your skin. The laser energy pulse, which is in billionths of a second, releases the pigment into the skin so it can be naturally reabsorbed and disposed of by the body.',
  },
  {
    title: 'B. Why go for Q switch laser treatment?',
    intro:
      'There are a few good strong points to talk about "Q switch laser treatment" when compared to other treatment methods, they are',
    bullets: [
      'It works appropriately for only those people who have isolated dark brown spots on a very few areas on the body',
      'Unlike liquid nitrogen treatment, Q switch laser treatment works perfectly well, as it will not leave any white marks in the place of brown spots which can be seen in liquid nitrogen treatment.',
      'The laser used in this treatment can go into the deeper layer of skin to eliminate brown spots which can\'t be possible with other medicines or creams.',
    ],
  },
  {
    title: 'C. Who are the ideal people for Q switch laser treatment?',
    body:
      'Pregnant women are not the ideal people for this treatment. People with the previous history of cold sores or people who are taking Accutane for the past 6 months are not eligible to go for Q switch laser treatment until and unless the conditions are permanently treated.',
  },
  {
    title: 'D. Are there any alternative treatment methods for Q switch laser treatment?',
    body:
      'Yes, PDT(Photodynamic therapy), Fraxel lasers and laser nitrogen treatment methods are a few other options that are available at Lifescc. Along with Q switch laser treatment. Whereas PDT holds well when you have too many dark spots spread across all your body such as the chest, arms, legs, face, etc.',
  },
  {
    title: 'E. What are the other benefits of Q switch Laser Treatment?',
    body:
      'It not only helps tighten the sagging skin on the face but also helps in drastically improving facial appearance by removing the wrinkles and fine lines on the face without causing any side effects.',
  },
  {
    title: 'F. How effective is Q Switch laser treatment for tattoo removal?',
    body:
      'Q switch laser treatment is one of the highly safest and the most sought after treatment methods for tattoo removal as it directly targets the pigment of the tattoo. Q switch laser tattoo removal uses short, intense pulses of laser energy that shatter ink in a tattoo causing the tattoo to fade over a series of consecutive treatments, leaving a fair and smooth skin free of ink.',
  },
]

const WHERE_LIST_ITEMS = [
  'Pigmentation (such as freckles, sun spots, age spots, brown spots, melasma, birthmarks)',
  'Fairness Skin',
  'Skin Rejuvenation',
  'Acne and Acne Marks',
  'Tattoo Removal',
]

function QlaserFaqAccordions() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="qlaser-faq__accordions" role="region" aria-label="Q laser treatment questions">
      {QLASER_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-qlaser-faq-panel-${index + 1}`
        const buttonId = `${baseId}-qlaser-faq-btn-${index + 1}`
        return (
          <article
            key={item.title}
            className={isOpen ? 'qlaser-faq-acc__item qlaser-faq-acc__item--open' : 'qlaser-faq-acc__item'}
          >
            <h3 className="qlaser-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="qlaser-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="qlaser-faq-acc__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="qlaser-faq-acc__question">{item.title}</span>
                <span className="qlaser-faq-acc__chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="qlaser-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="qlaser-faq-acc__panel">
                {typeof item.body === 'string' && item.body ? (
                  <p className="qlaser-faq-acc__answer">{item.body}</p>
                ) : null}
                {typeof item.intro === 'string' && item.intro ? (
                  <p className="qlaser-faq-acc__answer">{item.intro}</p>
                ) : null}
                {Array.isArray(item.bullets) && item.bullets.length > 0 ? (
                  <ul className="qlaser-faq-acc__bullets">
                    {item.bullets.map((line) => (
                      <li key={line.slice(0, 48)}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function PrincipleBlock({ image, imageAlt, idSuffix }) {
  return (
    <div className="qlaser-principle__row">
      <div className="qlaser-principle__copy coolsculpting-treatment__copy">
        <h2 id={`qlaser-principle-heading-${idSuffix}`} className="coolsculpting-treatment__title">
          {PRINCIPLE_COPY.heading}
        </h2>
        <p className="coolsculpting-treatment__p">{PRINCIPLE_COPY.body}</p>
      </div>
      <figure className="qlaser-principle__figure">
        <img src={image} alt={imageAlt} className="qlaser-principle__img" loading="lazy" decoding="async" />
      </figure>
    </div>
  )
}

/** Qlaser — skin treatment at Lifescc. */
export default function QlaserPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page qlaser-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form qlaser-banner-hero"
          aria-labelledby="qlaser-heading"
          style={{ backgroundImage: `url(${women1Banner})` }}
        >
          <div className="coolsculpting-hero__scrim qlaser-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="qlaser-heading" className="cryolipolysis-hero-title">
              Qlaser
            </h1>
            <SkinHeroConsultForm sourcePage="qlaser" serviceLabel="Qlaser" />
          </div>
        </section>

        <section className="qlaser-principle" aria-labelledby="qlaser-principle-heading-a">
          <div className="qlaser-principle__shell">
            <PrincipleBlock image={q1Img} imageAlt="Q-switch laser principle illustration" idSuffix="a" />
          </div>
        </section>

        <section className="qlaser-faq" aria-labelledby="qlaser-faq-heading">
          <div className="contact-us-page-wrap qlaser-faq__band">
            <div className="qlaser-faq__curve" aria-hidden="true" />
            <div className="qlaser-faq__shell">
              <h2 id="qlaser-faq-heading" className="qlaser-faq__title">
                Q laser treatment
              </h2>
              <QlaserFaqAccordions />
            </div>
          </div>
        </section>

        <section className="qlaser-principle" aria-labelledby="qlaser-principle-heading-b">
          <div className="qlaser-principle__shell">
            <PrincipleBlock image={q11Img} imageAlt="Q-switch laser treatment at Lifescc" idSuffix="b" />
          </div>
        </section>

        <section className="qlaser-where" aria-labelledby="qlaser-where-heading">
          <div className="qlaser-where__row">
            <div className="qlaser-where__visual">
              <img
                src={g1Img}
                alt="Q laser treatment applications at Lifescc"
                className="qlaser-where__img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="qlaser-where__copy-wrap">
              <div className="qlaser-where__copy coolsculpting-treatment__copy">
                <h2 id="qlaser-where-heading" className="coolsculpting-treatment__title">
                  Where does it work?
                </h2>
                <p className="coolsculpting-treatment__p">
                  The power settings of the laser can be set at different levels and frequencies to accommodate your
                  specific condition and expectations.
                </p>
                <ul className="qlaser-where__list">
                  {WHERE_LIST_ITEMS.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="qlaser-map" aria-label="Lifescc on Google Maps">
          <iframe
            className="qlaser-map__iframe"
            src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d121811.93727953311!2d78.460463!3d17.429869!3m2!1i1024!2i768!4f13.1!2m1!1slifescc!5e0!3m2!1sen!2sus!4v1777832365226!5m2!1sen!2sus"
            title="Google Map — Lifescc"
            height={480}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
