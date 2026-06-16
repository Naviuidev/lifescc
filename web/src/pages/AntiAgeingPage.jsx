import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import AntiAgeingTrustStrip from '../components/AntiAgeingTrustStrip.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import banAgeing from '../assets/ban-ageing.png'
import agei from '../assets/agei.png'
import icc1 from '../assets/icc1.png'
import icc2 from '../assets/icc2.png'
import icc3 from '../assets/icc3.png'
import icc4 from '../assets/icc4.png'
import icc5 from '../assets/icc5.png'
import agedBefore from '../assets/agedb4 (1).jpg'
import agedAfter from '../assets/ageda4.jpg'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AntiAgeingPage.css'

const ANTI_AGEING_PROCESS_STEPS = [
  {
    title: 'Analysis',
    label: 'Analysis',
    body:
      'On your first visit, our dermatologists carry out an in-depth analysis and explain the problems and the available treatment options. Our experts recommend a plan or a combination of them to help reverse the signs of ageing and suggest a beauty regimen that can slow the ageing of the skin.',
    icon: 'icc1',
  },
  {
    title: 'Preparation',
    label: 'Preparation',
    body:
      'Using a cleansing agent, your skin is cleared of excessive oils or makeup so that the effects of the treatment are better.',
    icon: 'icc2',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
    icon: 'icc3',
  },
  {
    title: 'Sessions',
    label: 'Sessions',
    body:
      'The session generally lasts about 30 minutes to an hour, depending on the area being treated. A single session to get visible results. Multiple sessions may be required based on individual requirements.',
    icon: 'icc4',
  },
  {
    title: 'Treatment',
    label: 'Treatment',
    body:
      'High therapy, Radiofrequency skin tightening, and fillers are some of the advanced treatments offered at Lifescc. Filler treatment involves the direct injection of anti-wrinkle proteins into areas that have lost volume due to collagen depletion giving the skin a plump and youthful appearance.',
    icon: 'icc5',
  },
]

const ANTI_AGEING_PROCESS_ICONS = {
  icc1,
  icc2,
  icc3,
  icc4,
  icc5,
}

function AntiAgeingLeafDivider() {
  return (
    <div className="anti-ageing-intro__divider" aria-hidden="true">
      <span className="anti-ageing-intro__divider-line" />
      <span className="anti-ageing-intro__divider-icon">
        <svg
          className="anti-ageing-intro__divider-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 56 32"
          aria-hidden="true"
        >
          <ellipse cx="22" cy="18" fill="#15803d" rx="14" ry="7" transform="rotate(-38 22 18)" />
          <ellipse cx="34" cy="18" fill="#166534" rx="14" ry="7" transform="rotate(38 34 18)" />
        </svg>
      </span>
      <span className="anti-ageing-intro__divider-line" />
    </div>
  )
}

/** Anti-ageing treatments at Lifescc — dedicated route without `/skin/`. */
export default function AntiAgeingPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page anti-ageing-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="anti-ageing-heading"
          style={{ backgroundImage: `url(${banAgeing})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="anti-ageing-heading" className="cryolipolysis-hero-title">
              Anti Ageing
            </h1>
            <SkinHeroConsultForm sourcePage="anti_ageing" serviceLabel="Anti Ageing" />
          </div>
        </section>

        <section className="anti-ageing-intro" aria-labelledby="anti-ageing-intro-heading">
          <div className="anti-ageing-intro__shell">
            <AntiAgeingLeafDivider />
            <h2 id="anti-ageing-intro-heading" className="anti-ageing-intro__title">
              Anti Ageing Treatment
            </h2>
            <p className="anti-ageing-intro__p">
              Do you want to look eternally young and beautiful? Then Lifescc is your go-to place for all your skincare
              requirements.
            </p>
            <p className="anti-ageing-intro__p">
              Ageing is inevitable; skin ageing occurs when skin cells couldn&apos;t be able to produce an adequate
              amount of collagen protein in the skin leading to loosening of skin firmness, elasticity, and shine.
            </p>
            <p className="anti-ageing-intro__p">
              Loss of elastin (elastic tissue) &amp; thinning of the epidermis layer in the skin play a vital role in
              showing up early signs of skin ageing, causing the skin to hang loosely leading to skin sagging.
            </p>
            <p className="anti-ageing-intro__p">
              Skin ageing mostly occurs due to two factors one is external factors, and the other one is internal
              factors. Where sunlight, pollution come under external factors. Progressing age and genes fall into
              internal factors.
            </p>
          </div>
        </section>

        <AntiAgeingTrustStrip />

        <section className="anti-ageing-therapies" aria-labelledby="anti-ageing-hifu-heading">
          <div className="anti-ageing-therapies__shell">
            <div className="anti-ageing-therapies__grid">
              <div className="anti-ageing-therapies__copy coolsculpting-treatment__copy">
                <h3 id="anti-ageing-hifu-heading" className="cryolipolysis-treatment__subheading">
                  High Therapy
                </h3>
                <p className="coolsculpting-treatment__p">
                  High-intensity ultrasound therapy is a highly advanced USFDA treatment method that is an entirely
                  non-invasive procedure with zero downtime. It uses ultrasound imaging technology that makes it possible
                  for the cosmetologist to see the layers being treated. The ultrasound energy is deposited in the deep
                  tissues of the skin and helps the skin achieve the optimal temperature to aid natural collagen generation.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">Radiofrequency skin tightening</h3>
                <p className="coolsculpting-treatment__p">
                  Radiofrequency skin tightening is a non-invasive, non-surgical treatment method that works gently on
                  your skin that uses Radio Frequency (RF) energy to heat the different layers of skin tissue to
                  stimulate natural collagen production. The RF waves remodel and contract the skin collagen to tighten
                  sagging skin.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">Fillers</h3>
                <p className="coolsculpting-treatment__p">
                  To achieve a more youthful look, the lines and wrinkles on the skin can be filled with a filler agent
                  like collagen and other agents. Collagen is made of natural protein which helps in the nourishment of
                  the skin. Fillers show an immediate effect in smoothing out the fine lines on the forehead, around the
                  eyes and lips and restore lost volume to the skin.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill anti-ageing-therapies__book-btn"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book free consultation
                </button>
                <blockquote className="anti-ageing-therapies__quote">
                  &ldquo;Sometimes all it takes is a phone call, make it&rdquo;
                  <cite>— Rai Chakraborty</cite>
                </blockquote>
              </div>
              <div className="anti-ageing-therapies__media">
                <img className="anti-ageing-therapies__img" src={agei} alt="" width={480} height={640} />
              </div>
            </div>
          </div>
        </section>

        <section className="anti-ageing-partner" aria-labelledby="anti-ageing-partner-heading">
          <div className="anti-ageing-partner__shell">
            <div className="anti-ageing-partner__top">
              <figure className="anti-ageing-partner__figure">
                <BeforeAfterSlider
                  beforeSrc={agedBefore}
                  afterSrc={agedAfter}
                  showLabels={false}
                  portrait
                />
              </figure>
              <div className="anti-ageing-partner__copy coolsculpting-treatment__copy">
                <h2 id="anti-ageing-partner-heading" className="coolsculpting-treatment__title">
                  Make Lifescc your holistic health partner
                </h2>
                <p className="coolsculpting-treatment__p">
                  Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading
                  health and wellness care brands in south India by pioneering several advanced, specialized, revolutionary
                  treatment methods to our clients and customers in their diverse medical needs simply and effectively.
                </p>
                <p className="coolsculpting-treatment__p">
                  Our state of the art facilities at our clinics complemented by our highly trained and certified
                  dermatologists skilled &amp; specialized in offering superior quality skin services has helped us in
                  gaining trust and confidence of our customers and in turn, enabled us to stand out in a sea of
                  look-alikes in big cities.
                </p>
              </div>
            </div>
            <div className="anti-ageing-partner__bottom coolsculpting-treatment__copy">
              <p className="coolsculpting-treatment__p">
                If you are looking forward to the best anti-ageing treatment in Hyderabad, Vizag, Vijayawada &amp;
                Nellore. Please visit your nearest lifescc clinic for free body analysis and counselling, where our
                experts clearly explain all the procedures to help you make an informed decision.
              </p>
              <button
                type="button"
                className="book-slot-btn py-2 book-slot-btn--primary rounded-pill anti-ageing-partner__book-btn"
                onClick={() => setBookSlotOpen(true)}
              >
                Book free consultation
              </button>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={ANTI_AGEING_PROCESS_STEPS}
          icons={ANTI_AGEING_PROCESS_ICONS}
          tablistAriaLabel="Anti-ageing treatment process steps"
          headingId="anti-ageing-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="anti-ageing-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band anti-ageing-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${banAgeing})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card anti-ageing-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="anti-ageing-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with anti-ageing care — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="anti_ageing" serviceLabel="Anti Ageing" />
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
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
      <SiteFooter />
    </div>
  )
}
