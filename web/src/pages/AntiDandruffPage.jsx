import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import dandruffBanner from '../assets/dandruff.png'
import dandruffInfoImg from '../assets/d1.png'
import dandruffExpertsImg from '../assets/ept.png'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AntiDandruffPage.css'

const AD_BENEFIT_LABELS = ['No pills required', 'No side effects', 'Advanced Technology', 'Safe and Proven']
const AD_PROCESS_STEPS = [
  {
    title: 'Book an Appointment',
    label: 'Book',
    body:
      'Book an appointment. It’s quick and easy. On your first visit to our clinic, we will set up a consultation with one of our trichologists.',
  },
  {
    title: 'Analysis',
    label: 'Analysis',
    body:
      'Our expert will examine your scalp and problem areas and ask a few questions. Based on the analysis, we will accurately determine the root cause of the problem.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
  },
  {
    title: 'Treatment Plan',
    label: 'Plan',
    body:
      'Based on the problem, our expert will recommend a proven and scientifically-backed plan. You will be provided with all the details of the plan.',
  },
  {
    title: 'Treatment Follow-ups',
    label: 'Follow-ups',
    body:
      'As per your convenience, we will schedule regular treatment follow-ups, which will eliminate your dandruff and make your hair healthier.',
  },
]

/** Anti dandruff — consultation entry at Lifescc. */
export default function AntiDandruffPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page anti-dandruff-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="anti-dandruff-heading"
          style={{ backgroundImage: `url(${dandruffBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="anti-dandruff-heading" className="cryolipolysis-hero-title">
              Anti dandruff
            </h1>
            <HairHeroConsultForm sourcePage="anti_dandruff" serviceLabel="Anti dandruff" />
          </div>
        </section>

        <section className="coolsculpting-treatment ad-split ad-split--4-8" aria-labelledby="ad-intro-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="ad-split__grid">
              <figure className="ad-split__figure">
                <img
                  src={dandruffInfoImg}
                  alt="Anti dandruff treatment at Lifescc"
                  className="ad-split__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="ad-split__copy">
                <h2 id="ad-intro-heading" className="coolsculpting-treatment__title">
                  Anti Dandruff Treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Dandruff is characterized by dry, oily flakes of dead skin in the hair and shoulders. Its presence
                  leads to an itchy scalp, and the shedding of dandruff causes embarrassment. Dandruff if left unchecked
                  may also lead to severe hair fall! So, if you have been suffering from a dandruff problem, you need to
                  act quickly and get rid of it before it leads to other problems. If you are looking for the best
                  anti-dandruff treatment in Hyderabad, Vizag, Vijayawada &amp; Nellore choose Life Slimming and Cosmetic
                  Clinic. We have expert trichologists who offer the best treatments that give lasting results.
                </p>
              </div>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip benefitLabels={AD_BENEFIT_LABELS} />

        <section className="coolsculpting-treatment ad-experts" aria-labelledby="ad-trust-heading">
          <div className="coolsculpting-treatment__shell ad-experts__shell">
            <div className="ad-experts__row ad-experts__row--8-4 ad-experts__row--reverse-mobile">
              <div className="ad-experts__lead-col">
                <h2 id="ad-trust-heading" className="coolsculpting-treatment__title">
                  Trust The Experts
                </h2>
                <p className="coolsculpting-treatment__p">
                  At Life Slimming and Cosmetic Clinic, our goal is to eliminate dandruff from your head and ensure that
                  the problem does not reoccur. Our friendly and professional staff will make you comfortable and be there
                  to address all your concerns right from the first consultation to completion of treatment.
                </p>
              </div>
              <figure className="ad-experts__figure">
                <div className="ad-experts__figure-inner">
                  <img
                    src={dandruffExpertsImg}
                    alt="Trichology experts helping with dandruff treatment"
                    className="ad-experts__img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>
            <div className="ad-experts__row ad-experts__row--12 ad-experts__tail">
              <p className="coolsculpting-treatment__p">
                While there are many over-the-counter shampoos and natural remedies to fight dandruff, if you have had
                limited success in eliminating dandruff through these methods, it is time to consult the experts at our
                clinic. Dandruff can be caused due to several factors such as dry skin, sensitivity to shampoos or hair
                products, yeast-like fungus and improper hair care. Dandruff might also be a symptom of a deeper problem
                such as seborrheic dermatitis. We will determine the root problem and get rid of your dandruff problem. If
                you are concerned about dandruff and itchy scalp, stop worrying! Visit Life Slimming and Cosmetic Clinic,
                the best dandruff treatment clinic in Hyderabad to clients experiencing the power of our advanced dandruff
                treatment. We look forward to serving you!
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={AD_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Anti dandruff treatment process steps"
          sectionTitle="Our process"
          headingId="ad-our-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="ad-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band ad-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${dandruffBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card ad-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="ad-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with anti dandruff — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm sourcePage="anti_dandruff" serviceLabel="Anti dandruff" />
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
