import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import liposuctionBanner from '../assets/liposuction.png'
import liposuction2 from '../assets/liposuction2.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './NonSurgicalLiposuctionPage.css'

const WHY_CHOOSE_POINTS = [
  'Eight years of Experience.',
  'Internationally Qualified Cosmetic Surgeons.',
  'Latest Infrastructure.',
  'Unparalleled Expertise.',
  'Thorough Evaluation Systems.',
  'Personalized Treatments.',
]

/** Non-surgical liposuction — fat reduction without surgery at Lifescc. */
export default function NonSurgicalLiposuctionPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page non-surgical-liposuction-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="non-surgical-liposuction-heading"
          style={{ backgroundImage: `url(${liposuctionBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="non-surgical-liposuction-heading" className="cryolipolysis-hero-title">
              Non-surgical liposuction
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="non_surgical_liposuction"
              treatmentValue="non_surgical_liposuction"
              treatmentLabel="Non-surgical liposuction"
            />
          </div>
        </section>

        <section
          className="coolsculpting-treatment non-surgical-liposuction-intro"
          aria-labelledby="non-surgical-liposuction-intro-heading"
        >
          <div className="coolsculpting-treatment__shell">
            <div className="non-surgical-liposuction-intro__grid">
              <div className="coolsculpting-treatment__copy">
                <h2 id="non-surgical-liposuction-intro-heading" className="coolsculpting-treatment__title">
                  Best non surgical liposuction in Hyderabad.
                </h2>
                <p className="coolsculpting-treatment__p">
                  Now, fat reduction no longer involves heavy physical workouts or surgery pain. Life Slimming and
                  Cosmetic Clinic provides the best non-surgical liposuction in Hyderabad to reduce fat in specific
                  areas in your body without any side effects.
                </p>
                <p className="coolsculpting-treatment__p">
                  No matter how much you exercise or how strictly you follow a diet regimen, getting rid of love handles
                  and muffin tops is challenging for most of you. It is frustrating when you can&apos;t lose fat in
                  specific areas, even though you are vigorously exercising. As against liposuction, non-surgical
                  liposuction does not use any invasive procedure to reduce fat! Without anesthesia or surgery,
                  non-surgical liposuction kills fat cells in specific areas giving excellent results.
                </p>
              </div>
              <figure className="non-surgical-liposuction-intro__figure">
                <img
                  src={liposuction2}
                  alt="Non-surgical liposuction treatment at Life Slimming and Cosmetic Clinic"
                  className="non-surgical-liposuction-intro__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="non-surgical-liposuction-why" aria-labelledby="non-surgical-liposuction-why-heading">
          <div className="non-surgical-liposuction-why__shell">
            <h2 id="non-surgical-liposuction-why-heading" className="non-surgical-liposuction-why__title">
              Why Choose Life Slimming And Cosmetic Clinic?
            </h2>
            <ul className="non-surgical-liposuction-why__list">
              {WHY_CHOOSE_POINTS.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
            <p className="non-surgical-liposuction-why__p">
              Want to know more about non-surgical liposuction? Please read our blog or subscribe to our newsletter to
              know everything about non-surgical liposuction. You can also get complete information with our experts
              available on the chat. Or call us for detailed information. We know that you are craving to have that
              magical figure without any extra fat. We also know that you have questions. Many of you feel that
              non-surgical liposuction is expensive, or you have doubts if this is the right thing for you or not. Do not
              worry!
            </p>
            <p className="non-surgical-liposuction-why__p">
              All your doubts are just one step away from being dispelled. Give us a call and book your appointment with
              our experts today!
            </p>
          </div>
        </section>

        <WeightLossConsultationStrip sourcePage="non_surgical_liposuction" />
      </main>
      <SiteFooter />
    </div>
  )
}
