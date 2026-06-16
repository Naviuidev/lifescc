import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import tightBanner from '../assets/ban-tight.png'
import inchLossImg from '../assets/inch_loss.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './SkinTighteningPage.css'

const SKIN_TIGHTENING_TRUST_LABELS = [
  'FDA Approved',
  'Scientifically backed',
  'Advanced Technology',
  'Customized Treatment',
]

const SKINTIGHT_FAQ_ITEMS = [
  {
    title: 'How long does the treatment procedure last?',
    body: 'The procedure lasts about 30 to 90 minutes.',
  },
  {
    title: 'How many treatments does it take?',
    body:
      'Most patients need only one treatment. But, because of factors like skin laxity, biological response to ultrasound energy, the individual collagen-building process may require more than one treatment for better results.',
  },
  {
    title: 'How long do results last?',
    body: 'Results last for an extended period; in most cases, results last up to a max period of up to 2 to 3 years.',
  },
  {
    title: 'Are there any side effects of this treatment?',
    body: 'As the treatment itself is non-invasive, side effects are temporary and mild.',
  },
]

function SkinTighteningFaqAccordions() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="skintight-faq__accordions" role="region" aria-label="Skin tightening frequently asked questions">
      {SKINTIGHT_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-skintight-faq-panel-${index + 1}`
        const buttonId = `${baseId}-skintight-faq-btn-${index + 1}`
        return (
          <article
            key={item.title}
            className={isOpen ? 'skintight-faq-acc__item skintight-faq-acc__item--open' : 'skintight-faq-acc__item'}
          >
            <h3 className="skintight-faq-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="skintight-faq-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="skintight-faq-acc__num" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="skintight-faq-acc__question">{item.title}</span>
                <span className="skintight-faq-acc__chevron" aria-hidden="true">
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
              className="skintight-faq-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="skintight-faq-acc__panel">
                <p className="skintight-faq-acc__answer">{item.body}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/** Skin tightening / Ultherapy — Lifescc skin line. */
export default function SkinTighteningPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page skintight-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form skintight-banner-hero"
          aria-labelledby="skintight-heading"
          style={{ backgroundImage: `url(${tightBanner})` }}
        >
          <div className="coolsculpting-hero__scrim skintight-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="skintight-heading" className="cryolipolysis-hero-title">
              Skin Tightening
            </h1>
            <SkinHeroConsultForm sourcePage="skin_tightening" serviceLabel="Skin Tightening" />
          </div>
        </section>

        <section className="skintight-intro" aria-labelledby="skintight-intro-heading">
          <div className="skintight-intro__shell">
            <h2 id="skintight-intro-heading" className="skintight-intro__title">
              Treatment for Skin Tightening
            </h2>
            <p className="skintight-intro__p">
              Skin sagging can be quite often seen among those who immediately get thin after putting up a lot of weight
              in the past because the skin stretches once a person starts gaining weight to accommodate extra fat that lies
              beneath. When you lose fat from your body, your skin starts to droop, leading to skin sagging, which is a big
              no-no, especially for those in their early thirties.
            </p>
            <p className="skintight-intro__p">
              Wrinkles also can be seen as early signs of the aging process. They usually tend to appear when people get
              older. Dehydration, sun damage, medicines, and genetic factors can be seen as significant causes of
              developing wrinkles and fine lines on the skin.
            </p>
            <p className="skintight-intro__p">
              If you are looking out for effective, non-surgical anti-aging treatment options to ward off your skin sagging,
              wrinkles, and fine lines problems all at once, then Ultherapy skin tightening treatment should be the one you
              can count on.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip labels={SKIN_TIGHTENING_TRUST_LABELS} />

        <section className="skintight-ultherapy" aria-labelledby="skintight-ultherapy-heading">
          <div className="skintight-ultherapy__shell">
            <div className="skintight-ultherapy__row">
              <div className="skintight-ultherapy__copy coolsculpting-treatment__copy">
                <h2 id="skintight-ultherapy-heading" className="coolsculpting-treatment__title">
                  What is Ultherapy Treatment?
                </h2>
                <p className="coolsculpting-treatment__p">
                  Ultherapy is a perfect alternative to the facelift treatment method. It is one of the most effective
                  non-invasive treatment methods approved by the US FDA (US Food &amp; Drug Administration) that use
                  focused pulsing heat energy to lift and tighten skin on the face, neck, and chest. It works by
                  stimulating collagen production in the body.
                </p>
                <h3 className="skintight-ultherapy__sub">Want more information about the surgery?</h3>
                <p className="coolsculpting-treatment__p">
                  To discuss various skin tightening options with our doctors at Lifescc.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill skintight-ultherapy__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book a consultation
                </button>
              </div>
              <figure className="skintight-ultherapy__figure">
                <img
                  src={inchLossImg}
                  alt="Ultherapy and skin tightening at Lifescc"
                  className="skintight-ultherapy__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="skintight-faq-why" aria-labelledby="skintight-why-heading">
          <div className="contact-us-page-wrap skintight-faq-why__band">
            <div className="skintight-faq-why__shell">
              <div className="skintight-faq-why__row">
                <div className="skintight-faq-why__col skintight-faq-why__col--faq">
                  <SkinTighteningFaqAccordions />
                </div>
                <div className="skintight-faq-why__col skintight-faq-why__col--why coolsculpting-treatment__copy">
                  <h2 id="skintight-why-heading" className="coolsculpting-treatment__title">
                    Why Choose Lifescc?
                  </h2>
                  <p className="coolsculpting-treatment__p">
                    Over the past 10 years, Life slimming and the cosmetic clinic pioneered several revolutionary treatment
                    methods to offer exceptional quality health care for people with their diverse medical needs simply and
                    effectively.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    Our state of the art facilities at our clinics complemented by our highly trained and certified
                    dermatologists skilled in specialized skin services has helped us stand out in a sea of look-alikes in
                    big cities.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    If you are looking forward to the best skin tightening clinic in Hyderabad, Vizag, Vijayawada &amp;
                    Nellore, please visit your nearest lifescc clinic for free body analysis and counseling; our experts
                    clearly explain all the procedures to help you make informed decisions.
                  </p>
                  <button
                    type="button"
                    className="book-slot-btn py-2 book-slot-btn--primary rounded-pill skintight-faq-why__cta"
                    onClick={() => setBookSlotOpen(true)}
                  >
                    Book a consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="coolsculpting-page__book-appt" aria-labelledby="skintight-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band skintight-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${tightBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card skintight-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="skintight-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with skin tightening — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="skin_tightening" serviceLabel="Skin Tightening" />
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
