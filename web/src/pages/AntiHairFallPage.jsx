import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import hairFallBanner from '../assets/hair-fall.png'
import hairfall2Img from '../assets/hairfall2.png'
import hairfall1Img from '../assets/hairfall1.png'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AntiHairFallPage.css'

const AHF_BENEFIT_LABELS = ['No pills required', 'No side effects', 'Advanced technology', 'Safe and proven']

const AHF_PROCESS_STEPS = [
  {
    title: 'Book an Appointment',
    label: 'Book',
    body:
      'Book a quick appointment. It is quick and easy. When you visit our clinic, you will first have a consultation with one of our expert doctors.',
  },
  {
    title: 'Analysis',
    label: 'Analysis',
    body:
      'Our expert will assess the hair loss and conduct a quick, painless computerized test to analyze the underlying problem. The results will identify the root cause of your hair fall.',
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
      'Based on the problem, our expert will recommend a personalized, advanced treatment plan to you. He/she will explain the plan and procedures involved in detail.',
  },
  {
    title: 'Treatment Follow-ups',
    label: 'Follow-ups',
    body:
      'Based on your schedule and as per your convenience, you will have regular treatment follow-ups which will bring lasting hair restoration.',
  },
]

/** Anti hair fall — trichologist-led care at Lifescc. */
export default function AntiHairFallPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page anti-hair-fall-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="anti-hair-fall-heading"
          style={{ backgroundImage: `url(${hairFallBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="anti-hair-fall-heading" className="cryolipolysis-hero-title">
              Anti hair fall
            </h1>
            <HairHeroConsultForm sourcePage="anti_hair_fall" serviceLabel="Anti hair fall" />
          </div>
        </section>

        <section className="coolsculpting-treatment ahaf-split ahaf-split--4-8" aria-labelledby="ahaf-intro-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="ahaf-split__grid">
              <figure className="ahaf-split__figure">
                <img
                  src={hairfall2Img}
                  alt="Anti hair fall treatment at Lifescc"
                  className="ahaf-split__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="ahaf-split__copy">
                <h2 id="ahaf-intro-heading" className="coolsculpting-treatment__title">
                  Anti Hair Fall Treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Hair loss can lead to a lot of distress and worry. A receding hairline can affect your social confidence
                  and ultimately lead to depression. Hair loss can be due to a lot of factors such as stress, improper diet,
                  hormonal imbalance, etc. If you are experiencing hair fall, it is time you consult a hair fall specialist.
                  At Life Slimming and Cosmetic Clinic, we have specialized trichologists who will determine the root
                  cause of your hair fall and suggest the best treatment to restore your hair health. If you are looking for
                  the best anti-hair fall treatments in Hyderabad, Vizag, Vijayawada &amp; Nellore choose Life Slimming and
                  Cosmetic Clinic.
                </p>
              </div>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip benefitLabels={AHF_BENEFIT_LABELS} />

        <section className="coolsculpting-treatment ahaf-experts" aria-labelledby="ahaf-trust-heading">
          <div className="coolsculpting-treatment__shell ahaf-experts__shell">
            <div className="ahaf-experts__row ahaf-experts__row--12">
              <h2 id="ahaf-trust-heading" className="coolsculpting-treatment__title">
                Trust The Experts
              </h2>
            </div>
            <div className="ahaf-experts__row ahaf-experts__row--8-4 ahaf-experts__row--reverse-mobile">
              <div className="ahaf-experts__lead-col">
                <p className="coolsculpting-treatment__p">
                  At Life Slimming and Cosmetic Clinic, our hair fall treatment is all about achieving quick and lasting
                  hair restoration, which will put the smile back on your face. If you have tried other hair loss treatments
                  without any results, do not worry! Our clients have experienced the power of advanced,
                  scientifically-backed hair loss treatments. We are here to eliminate all your hair loss concerns.
                </p>
              </div>
              <figure className="ahaf-experts__figure">
                <div className="ahaf-experts__figure-inner">
                  <img
                    src={hairfall1Img}
                    alt="Trichology consultation for hair fall at Lifescc"
                    className="ahaf-experts__img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>
            <div className="ahaf-experts__row ahaf-experts__row--12 ahaf-experts__tail">
              <p className="coolsculpting-treatment__p">
                Many people try several treatments for hair fall, including topical treatments, medication etc. However,
                the results do not seem very promising. They give up, thinking that there is no solution and end up more
                distressed and worried than before. When you undertake treatment at our anti-hair fall clinic in
                Hyderabad, you get the advantage of expert trichologists, state-of-the-art facilities, tried and trusted
                treatments as well as support throughout your hair regrowth journey. Visit your nearest lifescc clinic
                today to find a permanent solution to all your hair loss problems.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={AHF_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Anti hair fall treatment process steps"
          sectionTitle="Our process"
          headingId="ahaf-our-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="ahaf-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band ahaf-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${hairFallBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card ahaf-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="ahaf-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with anti hair fall — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm sourcePage="anti_hair_fall" serviceLabel="Anti hair fall" />
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
