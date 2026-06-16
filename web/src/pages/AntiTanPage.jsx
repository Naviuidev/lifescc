import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import banTan1 from '../assets/ban-tan 1.png'
import agei1 from '../assets/agei (1).png'
import tanBefore from '../assets/skin tan a4.jpg'
import tanAfter from '../assets/skin tan b4.jpg'
import t1 from '../assets/t1.png'
import t2 from '../assets/t2.png'
import t3 from '../assets/t3.png'
import t4 from '../assets/t4.png'
import t5 from '../assets/t5.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AntiTanPage.css'

const PROCESS_ICONS = { t1, t2, t3, t4, t5 }

const TRUST_LABELS = ['FDA Approved', 'No Downtime', 'Advanced Technology', 'Safe and Effective']

const PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: '1',
    icon: 't1',
    body:
      'Our skin specialists evaluate your skin to understand your skin type, skin sensitivity and the extent of tanning. Also, they take you through anti-tan Peels and Microdermabrasion for pigmentation procedures and the steps involved.',
  },
  {
    title: 'Preparation',
    label: '2',
    icon: 't2',
    body:
      'Using a natural cleanser, the skin is cleared of any makeup. A gentle exfoliator is then used to prepare you for the treatment.',
  },
  {
    title: 'Schedule',
    label: '3',
    icon: 't3',
    body:
      'The time each patient was in the office, compared to the length of the appointment.',
  },
  {
    title: 'Treatment',
    label: '4',
    icon: 't4',
    body:
      'Microdermabrasion is performed using a unique handheld device, where the therapist applies diamond tip microdermabrasion crystals to your skin. The crystals gently exfoliate, removing dry, dead cells and other debris like dirt leaving your skin smooth, fresh, and fairer. A Skin Peel is subsequently applied to the skin to exfoliate and renew the skin. In the end, a hydrating solution is used to soothe and refresh your skin.',
  },
  {
    title: 'Sessions',
    label: '5',
    icon: 't5',
    body:
      'Depending on the skin type and sensitivity, the number of sessions are determined. Generally, 4 to 6 sessions are recommended to get optimum results.',
  },
]

export default function AntiTanPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page antitan-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form antitan-banner-hero"
          aria-labelledby="antitan-heading"
          style={{ backgroundImage: `url(${banTan1})` }}
        >
          <div className="coolsculpting-hero__scrim antitan-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="antitan-heading" className="cryolipolysis-hero-title">
              Anti Tan
            </h1>
            <SkinHeroConsultForm sourcePage="anti_tan" serviceLabel="Anti Tan" />
          </div>
        </section>

        <section className="antitan-intro" aria-labelledby="antitan-intro-heading">
          <div className="contact-us-page-wrap antitan-intro__band">
            <div className="antitan-intro__inner">
              <h2 id="antitan-intro-heading" className="antitan-intro__title">
                Anti Tan Treatment
              </h2>
              <p className="antitan-intro__p">
                Anti-tanning is one of the most common skin conditions we often notice among the majority of people in
                India. When skin is exposed to excessive sunlight, the skin cells create a pigment called melanin to stop
                UV rays from reaching into deeper layers of the skin and defend the skin from affecting various other side
                effects or skin diseases. However, the secretion of excessive melanin pigment makes the skin grow darker,
                which we call it as tanning. We usually use anti-tanning creams and scrubs to get rid of tanned skin
                problems. However, the results will not sustain for a more extended period. Hence at lifescc, we recommend
                trying our most effective anti-tanning treatment methods to get the desired results for a fairer and
                smoother skin that lasts for a long time.
              </p>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip labels={TRUST_LABELS} />

        <section className="antitan-treatments" aria-labelledby="antitan-treatments-heading">
          <div className="antitan-treatments__shell">
            <div className="antitan-treatments__top-row">
              <div className="antitan-treatments__copy coolsculpting-treatment__copy">
                <h2 id="antitan-treatments-heading" className="antitan-treatments__h2">
                  Anti-Tan Treatments At Lifescc
                </h2>
                <h3 className="antitan-treatments__h3">Microdermabrasion</h3>
                <p className="coolsculpting-treatment__p">
                  It is a USFDA approved non-surgical treatment procedure used for improving overall skin tone and texture.
                  It helps in refreshing and rejuvenating the skin by removing the dead cells and help stimulate the
                  collagen growth in the skin.
                </p>
                <h3 className="antitan-treatments__h3">Radio frequency</h3>
                <p className="coolsculpting-treatment__p">
                  Radiofrequency is a non-invasive anti-tan treatment technique that makes use of radiofrequency (RF)
                  energy to heat the different layers of skin tissues to stimulate natural collagen production. The RF waves
                  remodel and contract the skin collagen to tighten sagging skin.
                </p>
                <h3 className="antitan-treatments__h3">Peels</h3>
                <p className="coolsculpting-treatment__p">
                  Peels help in exfoliating and quickly regenerating skin cells by effectively renewing and reducing the
                  tanning effects on the skin. Depending on your skin type, a suitable skin peel is used. Salicylic peel,
                  Glycolic Peel and Lactic Peel are some of the many peels available at our anti-tan treatment clinic in
                  Hyderabad.
                </p>
              </div>
              <figure className="antitan-treatments__figure">
                <img
                  src={agei1}
                  alt="Anti-tan treatment at Lifescc"
                  className="antitan-treatments__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
            <div className="antitan-treatments__full coolsculpting-treatment__copy">
              <h3 className="antitan-treatments__h3">We make sure that you get the best bang for your buck!</h3>
              <p className="coolsculpting-treatment__p">
                Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading health
                and wellness care brands in south India by pioneering several advanced, specialized, revolutionary treatment
                methods to our clients and customers in their diverse medical needs simply and effectively.
              </p>
              <p className="coolsculpting-treatment__p">
                Our state of the art facilities at our clinics complemented by our highly trained and certified
                dermatologists skilled &amp; specialized in offering superior quality skin services has helped us in gaining
                trust and confidence of our customers and in turn, enabled us to stand out in a sea of look-alikes in big
                cities.
              </p>
            </div>
          </div>
        </section>

        <section className="antitan-consult" aria-labelledby="antitan-consult-heading">
          <div className="antitan-consult__shell">
            <div className="antitan-consult__row">
              <div className="antitan-consult__slider-wrap">
                <BeforeAfterSlider beforeSrc={tanBefore} afterSrc={tanAfter} beforeLabel="Before" afterLabel="After" />
              </div>
              <div className="antitan-consult__copy coolsculpting-treatment__copy">
                <h3 id="antitan-consult-heading" className="antitan-treatments__h3">
                  We make sure that you get the best bang for your buck!
                </h3>
                <p className="coolsculpting-treatment__p">
                  Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading health
                  and wellness care brands in south India by pioneering several advanced, specialized, revolutionary treatment
                  methods to our clients and customers in their diverse medical needs simply and effectively.
                </p>
                <p className="coolsculpting-treatment__p">
                  Our state of the art facilities at our clinics complemented by our highly trained and certified
                  dermatologists skilled &amp; specialized in offering superior quality skin services has helped us in gaining
                  trust and confidence of our customers and in turn, enabled us to stand out in a sea of look-alikes in big
                  cities.
                </p>
                <p className="antitan-consult__tagline">
                  <em>&ldquo;Great skin doesn&apos;t happen by chance, it happens by appointment&rdquo;</em>
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to the best anti tanning treatment in Hyderabad, Vizag, Vijayawada &amp; Nellore.
                  Please visit your nearest lifescc clinic for free body analysis and counselling, where our experts clearly
                  explain all the procedures to help you make an informed decision.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill antitan-consult__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a free slot
                </button>
              </div>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={PROCESS_STEPS}
          icons={PROCESS_ICONS}
          tablistAriaLabel="Anti-tan treatment process steps"
          sectionTitle="Our process"
          headingId="antitan-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="antitan-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band antitan-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${banTan1})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card antitan-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="antitan-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with anti-tan — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="anti_tan" serviceLabel="Anti Tan" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="coolsculpting-book-appt__visual-col">
                <div className="book-appointment-page__photo coolsculpting-book-appt__photo-fullbleed" aria-hidden="true" />
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
