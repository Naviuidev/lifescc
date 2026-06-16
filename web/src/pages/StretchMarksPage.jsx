import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import smrBanner from '../assets/smr.png'
import stretchMarksImg from '../assets/stretch marks.png'
import stretchBefore from '../assets/Stretch Marks a4.jpg'
import stretchAfter from '../assets/Stretch Marks b4.jpg'
import s1 from '../assets/s1.png'
import s2 from '../assets/s2.png'
import s3 from '../assets/s3.png'
import s4 from '../assets/s4.png'
import s5 from '../assets/s5.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './StretchMarksPage.css'

const PROCESS_ICONS = { s1, s2, s3, s4, s5 }

const STRETCH_MARKS_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: '1',
    icon: 's1',
    body:
      'Set up an appointment with our experts as per your convenience. A professional consultation is the first step you must take to free yourself from stretch marks.',
  },
  {
    title: 'Analysis',
    label: '2',
    icon: 's2',
    body:
      'On your first visit, our dermatologist will examine the problem areas to determine the severity of the problem and brief you about our stretch mark treatments.',
  },
  {
    title: 'Schedule',
    label: '3',
    icon: 's3',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
  },
  {
    title: 'Treatment recommend',
    label: '4',
    icon: 's4',
    body:
      'Our experts will recommend a treatment plan. We use treatments like laser therapy, microdermabrasion, RF treatment, etc. for stretch mark removal.',
  },
  {
    title: 'Elimination of Stretch Marks',
    label: '5',
    icon: 's5',
    body:
      'Our treatments stimulate the growth of collagen or elastin in your skin, which eliminates the stretch marks and restores the skin to its original state.',
  },
]

/** Stretch marks — laser removal at Lifescc. */
export default function StretchMarksPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page stretchmarks-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form stretchmarks-banner-hero"
          aria-labelledby="stretchmarks-heading"
          style={{ backgroundImage: `url(${smrBanner})` }}
        >
          <div className="coolsculpting-hero__scrim stretchmarks-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="stretchmarks-heading" className="cryolipolysis-hero-title">
              Stretch Marks
            </h1>
            <SkinHeroConsultForm sourcePage="stretch_marks" serviceLabel="Stretch Marks" />
          </div>
        </section>

        <section className="stretchmarks-intro" aria-labelledby="stretchmarks-intro-heading">
          {/* Same full-bleed photo + gradient as Contact Us (`ContactUsPage.css` --contact-us-bg-image) */}
          <div className="contact-us-page-wrap stretchmarks-intro__band">
            <div className="stretchmarks-intro__inner">
              <h2 id="stretchmarks-intro-heading" className="stretchmarks-intro__title">
                Laser Stretch Marks Removal Treatment
              </h2>
              <p className="stretchmarks-intro__p">
                Stretch marks are a form of skin scarring that can usually be associated with puberty or pregnancy in women
                (one in every three women experience stretch marks due to pregnancy). They can also be equally seen in men
                because of various factors such as obesity, genetics, or short term weight gain due to bodybuilding or other
                activities.
              </p>
              <p className="stretchmarks-intro__p">
                They usually start with purple or red color and gradually fade to silvery white color with time. They may
                appear in various parts of the body, such as breasts, thighs, abdomen, hips, and buttocks in women.
              </p>
              <p className="stretchmarks-intro__p">
                Though stretch marks can neither be seen from outside nor pose any long term effects on one&apos;s health,
                they may cause embarrassment and lead to a loss of confidence in many people.
              </p>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="stretchmarks-laser" aria-label="Laser stretch mark removal and benefits">
          <div className="stretchmarks-laser__shell">
            <div className="stretchmarks-laser__row">
              <div className="stretchmarks-laser__copy coolsculpting-treatment__copy">
                <p className="coolsculpting-treatment__p">
                  Laser stretch mark removal is one of the highly effective, non-invasive ways of reducing stretch marks on
                  the body&apos;s surface.
                </p>
                <p className="coolsculpting-treatment__p">
                  It works on eliminating stretch marks on the skin through a procedure called &quot;laser
                  resurfacing,&quot; which completely removes the outer layer of the skin and helps regenerate the
                  underlying skin through collagen rebuilding by making use of a pulsed beam of laser light in concentrated
                  amounts to encourage the new skin growth.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill stretchmarks-laser__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a consultation
                </button>
                <h3 className="stretchmarks-laser__benefits-title">Benefits of laser stretch mark removal</h3>
                <ol className="stretchmarks-laser__benefits-ol">
                  <li>It&apos;s a non-surgical FDA approved treatment method with no downtime.</li>
                  <li>It is highly effective on all skin types and colors.</li>
                  <li>Gives faster results.</li>
                  <li>Delivers noticeable and superiorly long-lasting results in a minimal number of treatment sessions.</li>
                </ol>
              </div>
              <figure className="stretchmarks-laser__figure">
                <img
                  src={stretchMarksImg}
                  alt="Laser stretch mark removal at Lifescc"
                  className="stretchmarks-laser__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="stretchmarks-consult" aria-label="Before and after, and consultation information">
          <div className="stretchmarks-consult__shell">
            <div className="stretchmarks-consult__row">
              <div className="stretchmarks-consult__slider-wrap">
                <BeforeAfterSlider
                  beforeSrc={stretchBefore}
                  afterSrc={stretchAfter}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              </div>
              <div className="stretchmarks-consult__copy coolsculpting-treatment__copy">
                <p className="coolsculpting-treatment__p">
                  Book a free consultation for complete body analysis and discuss with our expert cosmetologists how
                  suitable the laser stretch mark removal treatment method is for you.
                </p>
                <p className="coolsculpting-treatment__p">
                  Because stretch mark removal treatment has to be customized to the individual patient, consulting a
                  cosmetic dermatologist specialized in offering stretch mark removal is the best way to get information on
                  your specific case.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you have already tried various methods of treatments, such as creams, medications, etc., but you
                  haven&apos;t seen any valid results, now it is time to consider choosing our laser stretch mark removal
                  method. It is a non-invasive, quick, and effective treatment method that can help effectively eliminate
                  stretch marks without any side effects.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to the best laser stretch marks treatment in Hyderabad, Vizag, Vijayawada
                  &amp; Nellore, please visit your nearest lifescc clinic to discuss an individual and more customized
                  treatment plans with our experts.
                </p>
                <p className="coolsculpting-treatment__p">
                  Our other popular treatment services at lifescc include <Link to="/zimmer">Zimmer</Link>,{' '}
                  <Link to="/weight-loss-treatment">Weight loss</Link>, <Link to="/cryolipolysis">Cryolipolysis</Link>,{' '}
                  <Link to="/inch-loss">Inch Loss</Link>, <Link to="/figure-correction">Figure Correction</Link> treatments
                  &amp; many more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={STRETCH_MARKS_PROCESS_STEPS}
          icons={PROCESS_ICONS}
          tablistAriaLabel="Stretch mark removal process steps"
          sectionTitle="Our process"
          headingId="stretchmarks-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="stretchmarks-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band stretchmarks-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${smrBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card stretchmarks-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="stretchmarks-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with stretch marks — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="stretch_marks" serviceLabel="Stretch Marks" />
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
