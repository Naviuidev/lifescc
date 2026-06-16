import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import pimpleBanner from '../assets/pimple.png'
import pimplesBefore from '../assets/pimples a4.jpg'
import pimplesAfter from '../assets/pimples b4.jpg'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AcnePimpleTreatmentPage.css'

const ACNE_PROCESS_STEPS = [
  {
    title: 'Analysis',
    label: '1',
    body:
      'An expert dermatologist will conduct a thorough, in-depth skin and health analysis. The expert will determine the severity of your acne problem and the underlying causes. Post-evaluation, our specialist will recommend a plan that can treat as well as control your acne.',
  },
  {
    title: 'Preparation',
    label: '2',
    body:
      'The skin is prepped by performing gentle exfoliation and mild cleansing to remove dirt and impurities. This helps the skin better absorb the treatment being applied. A numbing cream may be applied before treatment for some treatments to avoid any discomfort.',
  },
  {
    title: 'Schedule',
    label: '3',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule.',
  },
  {
    title: 'Treatment',
    label: '4',
    body:
      'The life slimming and cosmetic clinic offers a plan that is based on the severity of acne, skin type and skin sensitivity. A combination of facial treatments, laser resurfacing, peels and medications are used to treat acne and improve overall skin health.',
  },
  {
    title: 'Advise',
    label: '5',
    body:
      'The number of sessions that would be needed depends on the severity of acne breakouts, skin type, skin sensitivity and frequency of occurrence. Our dermatologist will also suggest diet and lifestyle changes necessary to avoid a recurrence of the acne problem.',
  },
]

/** Acne / pimple treatment — Lifescc dermatology-led care. */
export default function AcnePimpleTreatmentPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page acnepimple-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form acnepimple-banner-hero"
          aria-labelledby="acnepimple-heading"
          style={{ backgroundImage: `url(${pimpleBanner})` }}
        >
          <div className="coolsculpting-hero__scrim acnepimple-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="acnepimple-heading" className="cryolipolysis-hero-title">
              Acne Pimple Treatment
            </h1>
            <SkinHeroConsultForm sourcePage="acne_pimple_treatment" serviceLabel="Acne Pimple Treatment" />
          </div>
        </section>

        <section className="acnepimple-intro" aria-labelledby="acnepimple-intro-heading">
          <div className="acnepimple-intro__shell">
            <h2 id="acnepimple-intro-heading" className="acnepimple-intro__title">
              Acne Pimple Treatment
            </h2>
            <p className="acnepimple-intro__p">
              Are you troubled by acne? You are not alone. Acne is the most common skin problem encountered. Most of us
              struggle with pimples in our teen years. Of late acne incidence among adults is rising due to stress and
              pollution. Acne breakouts spoil a person&apos;s facial appearance and affect his/her confidence. Acne if left
              unaddressed or inadequately treated using only home remedies can lead to permanent scarring of the skin. If
              you suffer frequent acne breakouts, the best course of action is to seek professional help immediately. The
              Life Slimming and Cosmetic Clinic offers acne treatment in Hyderabad, Vizag &amp; Vijayawada. Our extensive
              range of treatments addresses both acne breakouts and the factors that make skin acne-prone.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="acnepimple-how" aria-labelledby="acnepimple-how-heading">
          <div className="acnepimple-how__shell">
            <div className="acnepimple-how__top">
              <div className="acnepimple-how__copy coolsculpting-treatment__copy">
                <h2 id="acnepimple-how-heading" className="coolsculpting-treatment__title">
                  How The Treatment Works?
                </h2>
                <p className="coolsculpting-treatment__p">
                  Acne or pimples are usually encountered in teen years. But, lifestyle stressors are leading to a decline
                  in overall skin health, causing acne even in adults. Acne occurs due to excessive sebum production,
                  hormonal imbalance, stress and pollution acting together. The best method of controlling acne is seeking
                  early treatment. Delay in getting treatment for pimples may result in permanent scarring and uneven skin
                  texture.
                </p>
              </div>
              <div className="acnepimple-how__slider-wrap">
                <BeforeAfterSlider
                  beforeSrc={pimplesBefore}
                  afterSrc={pimplesAfter}
                  beforeLabel="Before"
                  afterLabel="After"
                />
              </div>
            </div>
            <div className="acnepimple-how__wide coolsculpting-treatment__copy">
              <p className="coolsculpting-treatment__p">
                Our qualified, trained and experienced dermatologists have mastered the art of balancing safety with
                efficacy. Walk-in to Life Slimming and Cosmetic Clinic in Hyderabad for a lasting solution to your acne
                problems.
              </p>
              <p className="coolsculpting-treatment__p">
                Life Slimming and Cosmetic Clinic offers the best and most effective acne removal treatments that start
                with an elaborate pre-treatment assessment process. Treatments like pixel resurfacing and peels are used to
                renew the skin and give it a more even tone. At our acne treatment clinic, the treatment is customized to
                the individual&apos;s needs and skincare goals. The strength of the peel to be used or the parameters for
                laser treatment are carefully set to cause minimal discomfort while delivering the desired results.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={ACNE_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Acne treatment process steps"
          sectionTitle="Our process"
          headingId="acnepimple-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="acnepimple-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band acnepimple-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${pimpleBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card acnepimple-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="acnepimple-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with acne or pimples — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="acne_pimple_treatment" serviceLabel="Acne Pimple Treatment" />
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
