import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import banFigure from '../assets/ban-figure.png'
import figureCorrectionTreatment from '../assets/Figure_Correction_Treatment.jpg'
import figureCorrectionI from '../assets/Figure_CorrectionI.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import FigureCorrectionTrustStrip from '../components/FigureCorrectionTrustStrip.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './FigureCorrectionPage.css'

const ADVANTAGE_LIST_ITEMS = [
  'We offer completely non-invasive and non-surgical figure correction with no side effects.',
  'We focus on an individual’s overall well-being, and therefore we take into account your medical history, the present state of health, etc., before beginning any shaping treatment.',
  'Our custom made body sculpting treatments are structured to suit your shaping requirements.',
  'We follow a holistic approach towards our advanced skin tightening treatment as part of sculpting to deliver effective aesthetic solutions.',
  'We employ a tested massage regime that focuses on pressure points and mechanical treatments for fat reduction.',
  'Our figure correction program not only reshapes your body to look attractive but also brings balance to your body.',
  'To give you the perfect body shape that you long for, we deal with various modern and safe figure correction procedures such as Cryolipolysis, CoolSculpting, NSLS, etc.',
  'We follow a customer-centric approach, and hence we keep your best interests in mind before recommending any body shape correction treatment.',
  'We have a dedicated specialist team of dieticians, doctors, and counselors to deal with the sculpting needs of your body.',
]

/** Figure correction — body sculpting and contouring at Lifescc. */
export default function FigureCorrectionPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page figure-correction-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="figure-correction-heading"
          style={{ backgroundImage: `url(${banFigure})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="figure-correction-heading" className="cryolipolysis-hero-title">
              Figure correction
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="figure_correction"
              treatmentValue="figure_correction"
              treatmentLabel="Figure correction"
            />
          </div>
        </section>

        <section className="figure-correction-lead" aria-labelledby="figure-correction-lead-heading">
          <div className="figure-correction-lead__shell">
            <div className="figure-correction-lead__divider" aria-hidden="true">
              <span className="figure-correction-lead__divider-line" />
              <span className="figure-correction-lead__divider-icon">
                <svg
                  className="figure-correction-lead__divider-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56 32"
                  aria-hidden="true"
                >
                  <ellipse cx="22" cy="18" fill="#15803d" rx="14" ry="7" transform="rotate(-38 22 18)" />
                  <ellipse cx="34" cy="18" fill="#166534" rx="14" ry="7" transform="rotate(38 34 18)" />
                </svg>
              </span>
              <span className="figure-correction-lead__divider-line" />
            </div>
            <h2 id="figure-correction-lead-heading" className="figure-correction-lead__title">
              Best figure correction Treatment in Hyderabad
            </h2>
            <p className="figure-correction-lead__p">
              Figure correction treatment is an advanced fat reduction technology that can reshape your body and make it
              look slender and attractive. It involves many methods that are pooled together to deal with common bodily
              issues such as excess fat deposits; loose and sagging skin; post-pregnancy stretch marks, etc. Lifescc offers
              some of Hyderabad&apos;s best figure correction treatments that help reduce your body fat, toning the
              muscles, and giving a youthful and flawless look enhancing the individual&apos;s overall self-esteem.
            </p>
          </div>
        </section>

        <section className="coolsculpting-treatment figure-correction-split" aria-labelledby="figure-what-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="coolsculpting-treatment__grid">
              <figure className="coolsculpting-treatment__figure">
                <img
                  src={figureCorrectionTreatment}
                  alt="Figure correction treatment at Life Slimming and Cosmetic Clinic"
                  className="coolsculpting-treatment__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="coolsculpting-treatment__copy">
                <h2 id="figure-what-heading" className="coolsculpting-treatment__title">
                  What is Figure Correction?
                </h2>
                <p className="coolsculpting-treatment__p">
                  Figure correction treatment is an advanced technology that can reshape your body and make it look slender
                  and attractive. The body shape correction involves many methods pooled together to deal with common bodily
                  issues such as excess fat deposits, loose and sagging skin, post-pregnancy stretch marks, etc. Figure
                  correction strives to restore some of these changes by reducing the body fat, toning the muscles, and
                  giving a youthful and flawless body contour. Thus, body sculpting treatment enhances a woman&apos;s overall
                  self-esteem.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">
                  Are you looking for figure correction in Hyderabad? Turn to us.
                </h3>
                <p className="coolsculpting-treatment__p">
                  Life Slimming and Cosmetic Center is a versatile provider of effective weight loss, reshaping, and
                  aesthetic solutions. Figure correction techniques are of two types that are surgical figure correction and
                  non-surgical figure correction. Our body sculpting clinic Hyderabad provides advanced non-surgical figure
                  correction treatments such as CoolSculpting, NSLS, cryolipolysis, etc. Our dedicated professional team at
                  Hyderabad helps you gain muscle mass and eliminate excess fat by employing state-of-the-art body shaping
                  techniques, scientifically proven weight-loss diets, and simple workouts.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FigureCorrectionTrustStrip />

        <section className="coolsculpting-treatment figure-correction-advantages" aria-labelledby="figure-advantages-heading">
          <div className="coolsculpting-treatment__shell">
            <h2 id="figure-advantages-heading" className="figure-correction-advantages__title">
              Advantages Of Body Shape Correction In Hyderabad
            </h2>
            <div className="figure-correction-advantages__grid">
              <div className="figure-correction-advantages__copy">
                <ul className="figure-correction-advantages__list">
                  {ADVANTAGE_LIST_ITEMS.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
                <p className="coolsculpting-treatment__p">
                  Consult our figure correction experts to regain a young and confident you.
                </p>
              </div>
              <figure className="figure-correction-advantages__figure">
                <img
                  src={figureCorrectionI}
                  alt="Body shape correction and figure sculpting at Lifescc"
                  className="figure-correction-advantages__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <WeightLossConsultationStrip sourcePage="figure_correction" />
      </main>
      <SiteFooter />
    </div>
  )
}
