import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import pigmentBanner from '../assets/ban-pigment.png'
import skinliteImg from '../assets/skinlite.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './SkinPigmentationPage.css'

const PIGMENT_PROCESS_STEPS = [
  {
    title: 'Hyperpigmentation Treatment',
    label: '1',
    body:
      "Hyderabad's hyperpigmentation treatment at our clinic is focused on those who have higher melanin deposits under their skin. Our skin experts closely study the different Hyperpigmentation variations as Lentigines, Melasma, & PIH (Post Inflammatory Hyperpigmentation) and then provide specialized hyperpigmentation treatment.",
  },
  {
    title: 'Melasma Treatment',
    label: '2',
    body:
      'Melasma refers to the dark deposits or tanned skin patches that usually occur on the cheeks, nose, or forehead area. At Life Slimming and Cosmetic Clinic, we use skin peeling treatments to get rid of these dark patches for pigmentation removal.',
  },
  {
    title: 'Freckles Treatment',
    label: '3',
    body:
      'Freckles refer to the small dark spots appearing as clusters around cheeks, nose, upper shoulders, & even arms. Life Slimming and Cosmetic Clinic for pigmentation removal offers many freckles treatments, depending on the skin type and severity. The treatments include intense-light skin facials, cryosurgery, fading or bleaching creams, peeling, and laser treatment.',
  },
  {
    title: 'Hypopigmentation Treatment',
    label: '4',
    body:
      'In addition to the abnormal melanin levels on the skin, hypopigmentation occurs due to infections or burns, any injuries or illness. Life Slimming and Cosmetic Clinic offers you the safest and highly effective hypopigmentation treatment, including light/laser treatment or skin peeling.',
  },
  {
    title: 'Discharge',
    label: '5',
    body:
      'After your session, we share clear after-care instructions and follow-up guidance so your skin heals comfortably and you know when to return for your next review.',
  },
]

/** Skin pigmentation — Lifescc dermatology-led care. */
export default function SkinPigmentationPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page skinpigment-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form skinpigment-banner-hero"
          aria-labelledby="skinpigment-heading"
          style={{ backgroundImage: `url(${pigmentBanner})` }}
        >
          <div className="coolsculpting-hero__scrim skinpigment-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="skinpigment-heading" className="cryolipolysis-hero-title">
              Skin Pigmentation
            </h1>
            <SkinHeroConsultForm sourcePage="skin_pigmentation" serviceLabel="Skin Pigmentation" />
          </div>
        </section>

        <section className="skinpigment-intro" aria-labelledby="skinpigment-intro-heading">
          <div className="skinpigment-intro__shell">
            <h2 id="skinpigment-intro-heading" className="skinpigment-intro__title">
              Best Skin Pigmentation Treatment
            </h2>
            <p className="skinpigment-intro__lead">
              Never give up on your fight against skin pigmentation. Now get your spotless radiant white skin in one go.
            </p>
            <p className="skinpigment-intro__p">
              Everyone wishes to have glowing skin. A skin without any freckles, spots, dark lines, or marks is a dream of
              all. However, due to several natural and human-made factors, our skin starts developing some pigments with
              time. Several reasons, including exposure to direct sunlight, pollution, freckles, birthmarks, and many more,
              could lead to skin pigmentation.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="skinpigment-treatment" aria-labelledby="skinpigment-treatment-heading">
          <div className="skinpigment-treatment__shell">
            <div className="skinpigment-treatment__row">
              <div className="skinpigment-treatment__copy coolsculpting-treatment__copy">
                <h2 id="skinpigment-treatment-heading" className="coolsculpting-treatment__title">
                  Skin Pigmentation Treatment at Lifescc
                </h2>
                <p className="coolsculpting-treatment__p">
                  At Life Slimming and Cosmetic Clinic, we believe in using a completely holistic and natural approach to
                  treating skin pigmentation disorders. Our specialized pigmentation treatment aims to eliminate the excess
                  melanin deposits (the natural brown pigment imparting natural color to your skin).
                </p>
                <p className="coolsculpting-treatment__p">
                  The high-end skin pigmentation treatment at Life Slimming and Cosmetic Clinic is carried out by the
                  industry skin experts who have vast knowledge and expertise in this field. Our skin experts use unique
                  peels and deep skin exfoliation techniques to lighten skin pigmentation disorder. This natural treatment
                  also stimulates skin healing &amp; re-growth of healthy tissues.
                </p>
              </div>
              <figure className="skinpigment-treatment__figure">
                <img
                  src={skinliteImg}
                  alt="Skin pigmentation treatment at Lifescc"
                  className="skinpigment-treatment__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="skinpigment-why" aria-labelledby="skinpigment-why-heading">
          {/* Same full-bleed photo + gradient as Contact Us (`ContactUsPage.css` --contact-us-bg-image) */}
          <div className="contact-us-page-wrap skinpigment-why__band">
            <div className="skinpigment-why__inner coolsculpting-treatment__copy">
            <h2 id="skinpigment-why-heading" className="coolsculpting-treatment__title">
              Why Lifescc
            </h2>
            <p className="coolsculpting-treatment__p">
              Over the past 10 years, Life slimming and the cosmetic clinic have evolved as one of the top leading health
              and wellness care brands in south India by pioneering several advanced, specialized, revolutionary treatment
              methods for our clients and customers in their diverse medical needs in a simple and effective manner.
            </p>
            <p className="coolsculpting-treatment__p">
              Our state of the art facilities at our clinics complemented by our highly trained and certified
              dermatologists skilled &amp; specialized in offering superior quality skincare services helped us gain the trust
              and confidence of our customers. Our authentic, value-driven services we offer gave us an edge to stand out in
              a sea of look-alikes in big cities.
            </p>
            <p className="coolsculpting-treatment__p">
              If you are looking for ways to achieve flawless and pigment-free skin, then Life Slimming and Cosmetic Clinic
              for pigmentation removal is the best option for you. Our skin experts are highly qualified and experienced in
              this field and thus, deliver the best results for your skin&apos;s pigmentation treatment.
            </p>
            <p className="coolsculpting-treatment__p">
              All our treatments are done under specialist doctors&apos; strict supervision and come with zero downtime,
              making them more suitable for working professionals as they cannot devote more time to treatment sessions.
            </p>
            <p className="coolsculpting-treatment__p">
              If you are looking forward to Hyderabad&apos;s best skin pigmentation treatment, Vizag, Vijayawada &amp;
              Nellore. Please visit your nearest lifescc clinic to discuss customized treatment options with our experts.
            </p>
            <p className="coolsculpting-treatment__p">
              We will first evaluate the level of pigmentation with the help of physical examination. Based on the results,
              the experts advise a specialized pigmentation treatment. The treatment is carried out to minimize
              pigmentation disorder with non-invasive and safe methods.
            </p>
            <p className="coolsculpting-treatment__p">
              Our other popular treatment services at lifescc include <Link to="/zimmer">Zimmer</Link>,{' '}
              <Link to="/weight-loss-treatment">Weight Loss</Link>, <Link to="/cryolipolysis">Cryolipolysis</Link>,{' '}
              <Link to="/inch-loss">Inch Loss</Link>, <Link to="/figure-correction">Figure Correction</Link> treatments
              &amp; many more.
            </p>
            <button
              type="button"
              className="book-slot-btn py-2 book-slot-btn--primary rounded-pill skinpigment-why__cta"
              onClick={() => setBookSlotOpen(true)}
            >
              Book free consultation
            </button>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={PIGMENT_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Skin pigmentation treatment types"
          sectionTitle="Our process"
          headingId="skinpigment-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="skinpigment-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band skinpigment-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${pigmentBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card skinpigment-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="skinpigment-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with skin pigmentation — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="skin_pigmentation" serviceLabel="Skin Pigmentation" />
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
