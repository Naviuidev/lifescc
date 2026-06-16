import { Navigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import { skinTreatmentLabelFromSlug, skinSourcePageFromSlug } from '../constants/skinTreatments.js'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './SkinTreatmentPage.css'

/** Dedicated shell for Skin nav items under `/skin/:slug`; hero consultation persists to `skin_details`. */
export default function SkinTreatmentPage() {
  const { slug } = useParams()
  const title = skinTreatmentLabelFromSlug(slug)
  const sourcePage = skinSourcePageFromSlug(slug)

  if (!title) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page skin-treatment-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form skin-treatment-page__hero"
          aria-labelledby="skin-treatment-heading"
        >
          <div className="coolsculpting-hero__scrim skin-treatment-page__hero-scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="skin-treatment-heading" className="cryolipolysis-hero-title">
              {title}
            </h1>
            <SkinHeroConsultForm sourcePage={sourcePage} serviceLabel={title} />
          </div>
        </section>

        <section className="skin-treatment-page__intro" aria-labelledby="skin-treatment-intro-heading">
          <div className="coolsculpting-treatment__shell skin-treatment-page__intro-shell">
            <h2 id="skin-treatment-intro-heading" className="coolsculpting-treatment__title">
              {title}
            </h2>
            <p className="coolsculpting-treatment__p">
              Speak with our dermatology team about {title.toLowerCase()} — we&apos;ll recommend options tailored to
              your skin.
            </p>
          </div>
        </section>

        <section className="coolsculpting-page__book-appt" aria-labelledby="skin-treatment-book-strip-heading">
          <div className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band skin-treatment-book-strip">
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card skin-treatment-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="skin-treatment-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with {title} — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage={sourcePage} serviceLabel={title} />
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
