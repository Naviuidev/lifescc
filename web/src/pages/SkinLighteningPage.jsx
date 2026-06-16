import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import colorBanner from '../assets/ban-color.png'
import skinliteAltImg from '../assets/skinlite (1).png'
import l1 from '../assets/l1.png'
import l2 from '../assets/l2.png'
import l3 from '../assets/l3.png'
import l4 from '../assets/l4.png'
import l5 from '../assets/l5.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './SkinLighteningPage.css'

const PROCESS_ICONS = { l1, l2, l3, l4, l5 }

const SKIN_LIGHTENING_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: '1',
    icon: 'l1',
    body:
      'Schedule an appointment with us. It is quick and easy. When you visit our clinic, you will have a consultation with one of our expert dermatologists.',
  },
  {
    title: 'Analysis',
    label: '2',
    icon: 'l2',
    body:
      'Our expert will evaluate your skin type and the problem areas to uncover the underlying causes responsible for darker skin color.',
  },
  {
    title: 'Schedule',
    label: '3',
    icon: 'l3',
    body:
      'Get started on our treatment with a consultation with one of our experts to analyze and assess and schedule.',
  },
  {
    title: 'Treatment Plan',
    label: '4',
    icon: 'l4',
    body:
      'Based on the analysis, we will recommend a customized plan to achieve your desired skin color improvement. You will be advised Glutathione, chemical peels, or microdermabrasion to achieve skin lightening.',
  },
  {
    title: 'Treatment Follow-ups',
    label: '5',
    icon: 'l5',
    body:
      'Based on your convenience and schedule, you will have regular follow-ups and advice on caring for your skin.',
  },
]

/** Skin lightening — Lifescc skin line. */
export default function SkinLighteningPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page skinlight-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form skinlight-banner-hero"
          aria-labelledby="skinlight-heading"
          style={{ backgroundImage: `url(${colorBanner})` }}
        >
          <div className="coolsculpting-hero__scrim skinlight-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="skinlight-heading" className="cryolipolysis-hero-title">
              Skin Lightening
            </h1>
            <SkinHeroConsultForm sourcePage="skin_lightening" serviceLabel="Skin Lightening" />
          </div>
        </section>

        <section className="skinlight-intro" aria-labelledby="skinlight-intro-heading">
          <div className="skinlight-intro__shell">
            <h2 id="skinlight-intro-heading" className="skinlight-intro__title">
              What is Skin Lightening Treatment?
            </h2>
            <p className="skinlight-intro__p">
              Not many of us know that the melanin pigment in our body is responsible for our body color. Hence skin
              lightening treatment usually targets controlling the production of melanin pigment in the skin to give a
              whiter complexion to the skin through removing dark patch marks on the skin. The production of melanin pigment
              largely depends on factors like genetic buildup and exposure to sunlight and chemicals.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="skinlight-methods" aria-labelledby="skinlight-gluta-heading">
          <div className="skinlight-methods__shell">
            <div className="skinlight-methods__top">
              <div className="skinlight-methods__copy coolsculpting-treatment__copy">
                <h2 id="skinlight-gluta-heading" className="coolsculpting-treatment__title">
                  Glutathione Treatment Method
                </h2>
                <p className="coolsculpting-treatment__p">
                  We infuse glutathione (which is a natural antioxidant present in the body that helps delay the signs of
                  aging) in our skin lightening treatment method, which we call the &quot;glutathione treatment method.&quot;
                  It is a safe, effective, and affordable treatment method that will make your skin glow brighter by
                  rejuvenating it naturally and keep signs of aging at bay.
                </p>
                <h3 className="skinlight-methods__subheading">Chemical Peels</h3>
                <p className="coolsculpting-treatment__p">
                  Chemical peels are another means to achieve skin lightening. Peels can lower fine lines, improve skin
                  appearance, and make skin fairer. As part of this treatment, we apply a chemical solution that peels off
                  the older skin, revealing a newer, smoother, and fairer skin layer.
                </p>
              </div>
              <figure className="skinlight-methods__figure">
                <img
                  src={skinliteAltImg}
                  alt="Skin lightening treatment at Lifescc"
                  className="skinlight-methods__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
            <section className="skinlight-methods__wide coolsculpting-treatment__copy" aria-labelledby="skinlight-micro-heading">
              <h2 id="skinlight-micro-heading" className="coolsculpting-treatment__title">
                Microdermabrasion
              </h2>
              <p className="coolsculpting-treatment__p">
                We also offer microdermabrasion for skin lightening. Microdermabrasion involves spraying medical grade
                crystals on the skin. This gently removes the outermost layer, revealing softer, smoother, and fairer skin.
                All our treatments for skin lightening give instant results without any downtime. Our extensive experience
                and advanced technology deliver exceptional results. Visit or call our clinic today to take the first step
                towards achieving flawless fair skin.
              </p>
            </section>
          </div>
        </section>

        <section className="skinlight-why" aria-labelledby="skinlight-why-heading">
          <div className="contact-us-page-wrap skinlight-why__band">
            <div className="skinlight-why__inner coolsculpting-treatment__copy">
              <h2 id="skinlight-why-heading" className="coolsculpting-treatment__title">
                Why Lifescc
              </h2>
              <p className="coolsculpting-treatment__p">
                We are among south India&apos;s trusted skin lightening and dermatology care providers, with extensive
                experience and thousands of successful treatments since 2009. Our highly trained practitioners at Lifescc
                will always help to offer you a safe and effective treatment method tailored to your skin type and color.
                We follow strict medical protocols to make sure our treatment methods meet the required safety standards.
                Hence before treatment, we make sure to do a patch test to determine which approach can give you the safest
                and the significant results for your skin type.
              </p>
              <p className="coolsculpting-treatment__p">
                If you are looking forward to Hyderabad&apos;s best skin lightening treatment, Vizag, Vijayawada &amp;
                Nellore. Please visit your nearest lifescc clinic to discuss an individual and more customized treatment
                plans with our experts.
              </p>
              <p className="coolsculpting-treatment__p">
                Our other popular treatment services at lifescc include <Link to="/zimmer">Zimmer</Link>,{' '}
                <Link to="/weight-loss-treatment">Weight Loss</Link>, <Link to="/cryolipolysis">Cryolipolysis</Link>,{' '}
                <Link to="/inch-loss">Inch Loss</Link>, <Link to="/figure-correction">Figure Correction</Link> treatments
                &amp; many more.
              </p>
              <p className="coolsculpting-treatment__p">
                <Link to="/book-an-appointment">Book a Free Consultation</Link> today to meet with our doctors to discuss
                your skin type and to get the best results from our skin lightening treatment procedure.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={SKIN_LIGHTENING_PROCESS_STEPS}
          icons={PROCESS_ICONS}
          tablistAriaLabel="Skin lightening treatment process steps"
          sectionTitle="Our process"
          headingId="skinlight-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="skinlight-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band skinlight-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${colorBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card skinlight-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="skinlight-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with skin lightening — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="skin_lightening" serviceLabel="Skin Lightening" />
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
