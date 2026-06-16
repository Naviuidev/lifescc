import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import laserBanner from '../assets/ban-laser.png'
import laserHairBenefitsImg from '../assets/laser hair removal.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './LaserHairRemovalPage.css'

const LASER_TRUST_LABELS = ['FDA Approved', 'Scientifically Approved', 'Advanced Technology', 'Customized Treatment']

const LASER_FAQ_ITEMS = [
  {
    title: 'What areas can be treated with laser hair removal?',
    body: 'Laser hair removal can be used to treat hairs from any area of the body such as the face, legs, underarms, back & chest.',
  },
  {
    title: 'Is this treatment ideal for both men and women?',
    body: 'Laser hair treatment can effectively be used both for men and women.',
  },
  {
    title: 'How many treatments do I need?',
    body:
      'The hair follicles in our skin go through three stages, such as growth, regression, and resting. Where the laser hair removal treatment method works by disabling the hair in the active phase, it may take 5 to 10 sessions to disable all the hair follicles in a given area.',
  },
  {
    title: 'Does Lifescc offer full body hair removal through laser hair removal process?',
    body:
      'Yes, we do offer full body hair removal services, it may take around 8-12 sessions within 6 months period interval between the sessions. (After 8 sessions of the hair removal process, our patients usually see results in between 75% to 90% in the treated areas)',
  },
]

const LASER_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: '1',
    body:
      'A comprehensive evaluation of the area to be treated is conducted to understand your skin type, sensitivity and hair growth. You will also be informed about the general precautions to be taken in the weeks before and after the Laser Hair Removal treatment.',
  },
  {
    title: 'Patch Test',
    label: '2',
    body:
      'A couple of days before the actual treatment, a patch test on a small area of the skin is carried out. This is to determine what level of laser is required and tolerated for your skin and hair type. This will also give you a fair idea of how your skin responds to the treatment.',
  },
  {
    title: 'Schedule',
    label: '3',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
  },
  {
    title: 'Procedure',
    label: '4',
    body:
      'Your skin is cleansed of any cosmetic traces or excessive oils. An anaesthetic gel is applied. Laser energy is focused directly on the hair follicles using a hand-held device. Based on the colour, thickness and the area being treated the power, size, and pulse frequency of the laser is adjusted.',
  },
  {
    title: 'Sessions',
    label: '5',
    body:
      'Each session may last anywhere between half an hour to an hour, depending on the body part being treated. For best results, a minimum of six sessions are recommended for everyone, could vary by individual. And, each session is spaced one month apart from the other.',
  },
]

function LaserHairFaqAccordions() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="laserhair-faq__accordions" role="region" aria-label="Laser hair removal frequently asked questions">
      {LASER_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-laserhair-faq-panel-${index + 1}`
        const buttonId = `${baseId}-laserhair-faq-btn-${index + 1}`
        return (
          <article
            key={item.title}
            className={isOpen ? 'laserhair-faq-acc__item laserhair-faq-acc__item--open' : 'laserhair-faq-acc__item'}
          >
            <h3 className="laserhair-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="laserhair-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="laserhair-faq-acc__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="laserhair-faq-acc__question">{item.title}</span>
                <span className="laserhair-faq-acc__chevron" aria-hidden="true">
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
              className="laserhair-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="laserhair-faq-acc__panel">
                <p className="laserhair-faq-acc__answer">{item.body}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/** Laser hair removal — Lifescc skin line. */
export default function LaserHairRemovalPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page laserhair-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form laserhair-banner-hero"
          aria-labelledby="laserhair-heading"
          style={{ backgroundImage: `url(${laserBanner})` }}
        >
          <div className="coolsculpting-hero__scrim laserhair-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="laserhair-heading" className="cryolipolysis-hero-title">
              Laser Hair Removal
            </h1>
            <SkinHeroConsultForm sourcePage="laser_hair_removal" serviceLabel="Laser Hair Removal" />
          </div>
        </section>

        <section className="laserhair-intro" aria-labelledby="laserhair-intro-heading">
          <div className="laserhair-intro__shell">
            <h2 id="laserhair-intro-heading" className="laserhair-intro__title">
              Laser Hair Treatment Method
            </h2>
            <p className="laserhair-intro__p">
              Laser hair removal is a relatively safe and painless treatment procedure that uses a high energy laser beam
              to remove excess or unwanted body hair. It applies brief pulses of laser light energy to deactivate and
              prevent the regrowth of hair follicles. Laser hair removal is one of the US FDA–approved treatment methods
              that offer permanent hair reduction by up to 90% and is effective on all skin types and colors.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip labels={LASER_TRUST_LABELS} />

        <section className="laserhair-benefits" aria-labelledby="laserhair-benefits-heading">
          <div className="laserhair-benefits__shell">
            <div className="laserhair-benefits__top">
              <div className="laserhair-benefits__copy coolsculpting-treatment__copy">
                <h2 id="laserhair-benefits-heading" className="coolsculpting-treatment__title">
                  What are the benefits of laser hair removal?
                </h2>
                <div className="laserhair-benefit-block">
                  <h3 className="laserhair-benefit-block__title">One time process</h3>
                  <p className="coolsculpting-treatment__p">
                    Unlike other temporary hair removal methods such as waxing, shaving etc. Laser hair removal is a
                    one-time treatment method that gives lasting results without any side effects.
                  </p>
                </div>
                <div className="laserhair-benefit-block">
                  <h3 className="laserhair-benefit-block__title">Smooth and silky skin tone</h3>
                  <p className="coolsculpting-treatment__p">
                    Laser hair removal gives a smooth and soft skin tone and helps improve its appearance, tone, and
                    texture of the skin.
                  </p>
                </div>
                <div className="laserhair-benefit-block">
                  <h3 className="laserhair-benefit-block__title">Keep Skin Undamaged</h3>
                  <p className="coolsculpting-treatment__p">
                    Laser hair removal precisely targets the hair&apos;s melanin pigment to destroy hair follicles right
                    from the hair roots, leaving the surrounding skin undamaged.
                  </p>
                </div>
                <div className="laserhair-benefit-block">
                  <h3 className="laserhair-benefit-block__title">Treatment Speed</h3>
                  <p className="coolsculpting-treatment__p">
                    Each laser&apos;s pulse takes only a fraction of seconds to treat several hairs on large areas of skin
                    such as the chest, leg &amp; back.
                  </p>
                </div>
              </div>
              <figure className="laserhair-benefits__figure">
                <img
                  src={laserHairBenefitsImg}
                  alt="Laser hair removal treatment at Lifescc"
                  className="laserhair-benefits__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="laserhair-split" aria-labelledby="laserhair-leaders-heading">
          <div className="laserhair-split__shell">
            <div className="laserhair-split__row">
              <div className="laserhair-split__col laserhair-split__col--faq">
                <LaserHairFaqAccordions />
              </div>
              <div className="laserhair-split__col laserhair-split__col--leaders">
                <h2 id="laserhair-leaders-heading" className="coolsculpting-treatment__title">
                  When It Comes To Laser hair treatment, Choose the Leaders
                </h2>
                <p className="coolsculpting-treatment__p">
                  We are south India&apos;s leading laser hair removal provider with over 50,000 treatments delivered since
                  2009. Our Highly Trained practitioners at Lifescc will always help to offer you a safe and effective
                  treatment method tailored to your skin type and colour. We follow strict medical protocols to make sure
                  our treatments methods meet the required safety standards. Hence before treatment, we make sure to do a
                  patch test to determine which laser can give you the safest, and the significant results for your skin
                  type.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to the best laser hair removal in Hyderabad, Vizag, Vijayawada &amp; Nellore.
                  Please visit your nearest lifescc clinic to discuss an individual and more customized treatment plans
                  with our experts.
                </p>
                <p className="coolsculpting-treatment__p">
                  Our other popular treatment services at lifescc include{' '}
                  <Link to="/zimmer">Zimmer</Link>, <Link to="/weight-loss-treatment">Weightloss</Link>,{' '}
                  <Link to="/cryolipolysis">Cryolipolysis</Link>, <Link to="/inch-loss">Inch Loss</Link> &amp;{' '}
                  <Link to="/figure-correction">Figure Correction</Link> treatments.
                </p>
                <p className="coolsculpting-treatment__p">
                  <Link to="/book-an-appointment">Book a Free Consultation</Link> today to meet with our doctors to discuss
                  your hair type and results you expect from the laser hair treatment procedure.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={LASER_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Laser hair removal process steps"
          sectionTitle="Our process"
          headingId="laserhair-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="laserhair-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band laserhair-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${laserBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card laserhair-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="laserhair-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with laser hair removal — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="laser_hair_removal" serviceLabel="Laser Hair Removal" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="coolsculpting-book-appt__visual-col">
                <div
                  className="book-appointment-page__photo coolsculpting-book-appt__photo-fullbleed"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
