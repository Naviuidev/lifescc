import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import hairlossBanner from '../assets/hairloss.png'
import mesoIntroImg from '../assets/meso.jpg'
import mesoHowImg from '../assets/meso1.png'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './MesotherapyPage.css'

const MESO_BENEFIT_LABELS = ['No pills required', 'No side effects', 'Advanced Technology', 'Safe and Proven']

const MESO_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consultation',
    body:
      'Our expert trichologists analyse your hair to identify what’s causing baldness. This helps in tailoring the nutrient-rich solution to your specific needs.',
  },
  {
    title: 'Micro introduction',
    label: 'Micro intro',
    body:
      'The next step involves introducing the liquid into the mesoderm, the middle area of the scalp. This is performed using a specialized gun for precise delivery. It is done in every 1cm of an area on the scalp. It is virtually painless, and no anaesthesia is required.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule',
  },
  {
    title: 'Sessions',
    label: 'Sessions',
    body:
      'The number of sessions required for Mesotherapy hair treatment is based on the extent of hair loss. Around 5 to 8 sessions are generally recommended. Each session lasts about 30 minutes.',
  },
  {
    title: 'Monitoring',
    label: 'Monitoring',
    body:
      'Throughout the treatment, around 4 to 6 months, our meso therapists monitor your hair growth and suggest recommendations and tailor the course based on the results.',
  },
]

/** Mesotherapy — micronutrient scalp therapy and hair support at Lifescc. */
export default function MesotherapyPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page mesotherapy-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="mesotherapy-heading"
          style={{ backgroundImage: `url(${hairlossBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="mesotherapy-heading" className="cryolipolysis-hero-title">
              Mesotherapy
            </h1>
            <HairHeroConsultForm sourcePage="mesotherapy" serviceLabel="Mesotherapy" />
          </div>
        </section>

        <section className="coolsculpting-treatment meso-split meso-split--4-8" aria-labelledby="meso-intro-heading">
          <div className="coolsculpting-treatment__shell meso-split__shell">
            <div className="meso-split__grid">
              <figure className="meso-split__figure">
                <img
                  src={mesoIntroImg}
                  alt="Hair mesotherapy treatment at Lifescc"
                  className="meso-split__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="meso-split__copy">
                <h2 id="meso-intro-heading" className="coolsculpting-treatment__title">
                  Hair Mesotherapy Treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Mesotherapy is a partially invasive treatment method that involves injecting microscopic quantities of
                  vitamins, hormones and plant extracts into the mesodermal layer of the skin to naturally rejuvenate
                  &amp; tighten the skin by removing excess fat from the body.
                </p>
              </div>
            </div>
            <div className="meso-intro__tail">
              <p className="coolsculpting-treatment__p">
                It also helps in boosting skin metabolism rate by improving the blood circulation in the skin through
                promoting adequate levels of collagen production and elastin enzymes in the body.
              </p>
              <h3 className="meso-intro__subheading">What are all the areas mesotherapy can be used?</h3>
              <p className="coolsculpting-treatment__p">
                A part from treating body fat, mesotherapy is also widely used to treat various other conditions like
              </p>
              <p className="coolsculpting-treatment__p">A. Removing wrinkles and fine lines on the face.</p>
              <p className="coolsculpting-treatment__p">
                B. Treating hair loss by fighting against alopecia (condition that causes hair loss).
              </p>
              <p className="coolsculpting-treatment__p">C. Recontour the body.</p>
              <p className="coolsculpting-treatment__p">D. Tighten loosen skin.</p>
              <p className="coolsculpting-treatment__p">
                E. Removing acne scars and lightens pigmentation on the skin etc.
              </p>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip benefitLabels={MESO_BENEFIT_LABELS} />

        <section className="coolsculpting-treatment meso-how" aria-labelledby="meso-how-heading">
          <div className="coolsculpting-treatment__shell meso-how__shell">
            <div className="meso-how__row meso-how__row--8-4 meso-how__row--reverse-mobile">
              <div className="meso-how__copy-col">
                <h2 id="meso-how-heading" className="coolsculpting-treatment__title">
                  How mesotherapy works for hair loss
                </h2>
                <p className="coolsculpting-treatment__p">
                  The primary cause of hair loss in humans is primarily attributed to nutrition deficiency. Mesotherapy
                  treatment for hair loss can also be called by another name&rdquo;meso hair treatment&rdquo;. It perfectly helps in
                  restraining hair loss problems by bringing nourishment directly into the mesoderm layer of the scalp
                  through injecting natural plant extracts, vitamins &amp; medicines like finasteride and minoxidil directly
                  into the head. It also helps correct hormonal imbalances surrounding in and around hair follicles by
                  enhancing blood circulation in the scalp.
                </p>
              </div>
              <figure className="meso-how__figure">
                <div className="meso-how__figure-inner">
                  <img
                    src={mesoHowImg}
                    alt="Mesotherapy scalp treatment support"
                    className="meso-how__img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={MESO_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Mesotherapy treatment process steps"
          sectionTitle="Our process"
          headingId="meso-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="meso-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band meso-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${hairlossBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card meso-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="meso-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with mesotherapy — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm sourcePage="mesotherapy" serviceLabel="Mesotherapy" />
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
