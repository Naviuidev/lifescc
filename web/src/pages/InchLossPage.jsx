import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import liposuctionBanner from '../assets/liposuction.png'
import inchloss2 from '../assets/inchloss2.jpg'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './InchLossPage.css'

const INCH_LOSS_ALTERNATIVE_LIST = [
  'Our inch loss treatment programs are customized programs that are structured to work in sync with your body’s needs and aspirations. Hence, visible improvements are seen to post each treatment.',
  'There are no needles and no administration of anesthesia because all our inch loss treatments are completely non-surgical.',
  'The other commendable advantage is that it improves blood circulation, lymph circulation, renders elasticity to the skin, and tones the overall body to give a perfect contour.',
]

/** Inch loss — slimming and non-surgical fat reduction at Lifescc. */
export default function InchLossPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page inch-loss-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="inch-loss-heading"
          style={{ backgroundImage: `url(${liposuctionBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="inch-loss-heading" className="cryolipolysis-hero-title">
              Inch loss
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="inch_loss"
              treatmentValue="inch_loss"
              treatmentLabel="Inch loss"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment inch-loss-intro" aria-labelledby="inch-loss-clinics-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="inch-loss-intro__grid">
              <div className="inch-loss-intro__left-stack">
                <div className="coolsculpting-treatment__copy">
                  <h2 id="inch-loss-clinics-heading" className="coolsculpting-treatment__title">
                    Best inch loss clinics in Hyderabad
                  </h2>
                  <p className="coolsculpting-treatment__p">
                    Lifescc is one of Hyderabad&apos;s best inch loss clinics that provides a highly trained &amp;
                    qualified group of inch loss therapists who can give you the best of everything. They incessantly
                    strive to offer the finest visible solutions through a wide range of instant inch loss treatments such
                    as Coolsculpting, Cryolipolysis, NSLS, Body Contouring, etc.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    Although certain weight loss diet plans and exercises help you manage your weight to a certain extent,
                    they cannot help fight the accumulated fat in certain areas. This is where inch loss treatments come to
                    play. The good news is that there is no shortage of innovative fat reduction therapies that combine the
                    latest in technology. Life Slimming and Cosmetic Clinic is a famous treatment center that offers the
                    best instant inch loss treatments in Hyderabad, Vizag &amp; Vijayawada.
                  </p>
                </div>
                <figure className="inch-loss-intro__figure">
                  <img
                    src={liposuctionBanner}
                    alt="Treatment setting matching the inch loss hero banner"
                    className="inch-loss-intro__img"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
              <div className="inch-loss-intro__right-stack">
                <figure className="inch-loss-intro__figure">
                  <img
                    src={inchloss2}
                    alt="Inch loss treatment at Life Slimming and Cosmetic Clinic"
                    className="inch-loss-intro__img"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="coolsculpting-treatment__copy">
                  <h3 className="coolsculpting-treatment__title">
                    How do our slimming and inch loss treatment work to help you lose ugly fat?
                  </h3>
                  <p className="coolsculpting-treatment__p">
                    Our inch loss clinic extends the most up-to-date inch loss therapy that efficiently aids in getting
                    rid of extra fat without causing any adverse effects on an individual&apos;s health.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    Highly qualified inch loss therapists at our clinics in Hyderabad incessantly strive to offer the
                    finest visible solutions through a wide range of instant inch loss treatments such as Coolsculpting,
                    Cryolipolysis, NSLS, Body Contouring, etc.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    Our inch loss treatment program efficiently targets the areas with excess fat concentration. It
                    breaks down the fat cells in the subcutaneous or hypodermic layer resulting in increased metabolism and
                    reduced fatty wall chambers.
                  </p>
                  <p className="coolsculpting-treatment__p">
                    Additionally, it fixes saggy skin and unwanted flab. Thus, slimming and inch loss treatment addresses
                    weight gain problems with a gentle approach for you to lose a few inches over your body quickly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="inch-loss-benefits" aria-labelledby="inch-loss-benefits-heading">
          <div className="inch-loss-benefits__shell">
            <h2 id="inch-loss-benefits-heading" className="inch-loss-benefits__title">
              Baked In Benefits Of Our Advanced Inch Loss Treatments
            </h2>
            <p className="inch-loss-benefits__p">
              At Life Slimming and Cosmetic Center, we follow a holistic approach. We do not experiment on your body with
              various weight reduction techniques. Therefore, we do not recommend any crash diets, weight-loss pills, or
              strenuous exercises that may bring unfavorable effects.
            </p>
            <p className="inch-loss-benefits__p">
              There are no needles and no administration of anesthesia because all our inch loss treatments are completely
              non-surgical.
            </p>
            <p className="inch-loss-benefits__p">
              Our unique treatments for inch loss involve a complete analysis of your body&apos;s specific needs. We
              consider your body&apos;s present state and past medical history, if any, before advising any inch loss
              treatment regimen.
            </p>
            <p className="inch-loss-benefits__p">
              There are no laborious inch loss procedures to go through for weight reduction. No pain is what we
              guarantee, along with visible inch loss. Our inch loss treatments come with no downtime.
            </p>
            <h3 className="inch-loss-benefits__subheading">Hence, These Are Best Alternative To Surgery</h3>
            <ul className="inch-loss-benefits__list">
              {INCH_LOSS_ALTERNATIVE_LIST.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </section>

        <WeightLossConsultationStrip sourcePage="inch_loss" />
      </main>
      <SiteFooter />
    </div>
  )
}
