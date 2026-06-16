import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import zimmerBanner from '../assets/zimmer.png'
import zimmer1 from '../assets/zimmer1.jpg'
import z1 from '../assets/z1.jpg'
import z2 from '../assets/z2.png'
import z3 from '../assets/z3.png'
import z4 from '../assets/z4.png'
import z5 from '../assets/z5.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './ZimmerPage.css'

const ZIMMER_BENEFIT_COL_LINES = [
  {
    strong: 'Quick Process:',
    text: ' Zimmer z wave treatment will be covered in 6 to 10 sessions, where each session lasts only for 20-30 minutes.',
  },
  {
    strong: 'Tightens The Skin:',
    text: ' Zimmer treatment results in tightening of the skin as it helps in stimulating the collagen protein level in the body that works on body structuring.',
  },
]

const ZIMMER_BENEFIT_FULL_LINES = [
  {
    strong: 'Non-Invasive:',
    text: ' Zimmer z wave is a safe, pain-free, and non-invasive treatment method with zero downtime.',
  },
  {
    strong: 'Combination with cryolipolysis:',
    text: ' When used in combination with cryolipolysis (Z lipo), the Z wave significantly improves skin firmness and collagen regeneration.',
  },
  {
    strong: 'Aesthetic Scar Treatment:',
    text: ' Unlike other weight loss treatments, Zimmer (z wave) treatment offers smooth, healthy, and scarless skin.',
  },
  {
    strong: 'Visible results:',
    text: ' Zwave treatment shows visible results within the first 4 to 6 weeks of treatment. Every 8 in ten patients notice either a full reduction or reduction after four weeks of undergoing the treatment.',
  },
]

const ZIMMER_PROCESS_STEPS = [
  {
    title: 'Analysis',
    label: 'Analysis',
    body:
      'Zimmer shockwave therapy is a comprehensive non-invasive breakthrough technology aimed at cellulite reduction and body contouring. Z wave Zimmer delivers high-energy acoustic (sound) waves deep into the skin to break down the fibrous structures and connective tissues inside cellulite.',
    icon: 'z1',
  },
  {
    title: 'Preparation',
    label: 'Prep',
    body:
      'With its 39 mm applicator head, Z wave transmits constant, specific, and constructive pressure pulses of radial energy directly into the tissue to compress the fat cells that trust against the adjoining connective tissues and molecular grid. In the form of waves, this mechanical pressure results in an altered molecular structure of collagen and connective tissues within the skin.',
    icon: 'z2',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body: 'Get started on our treatment with a consultation with one expert who will analyze and assess and schedule.',
    icon: 'z3',
  },
  {
    title: 'Treatment',
    label: 'Treatment',
    body:
      'The procedure, which is devoid of surgical incisions and scars, is useful as a standalone application and in conjunction with cryolipolysis technology such as CoolSculpting, radiofrequency, ultrasound and laser therapy for fat reduction. With Z wave cellulite treatment, body areas with more fibrous tissues such as arms, thighs, abdomen, and buttocks can be treated easily.',
    icon: 'z4',
  },
  {
    title: 'Discharge',
    label: 'Discharge',
    body: 'After Necessary checks, you will be discharged.',
    icon: 'z5',
  },
]

const ZIMMER_PROCESS_ICONS = { z1, z2, z3, z4, z5 }

/** Zimmer — Z wave radial pulse therapy for slimming and cellulite at Lifescc. */
export default function ZimmerPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page zimmer-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="zimmer-heading"
          style={{ backgroundImage: `url(${zimmerBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="zimmer-heading" className="cryolipolysis-hero-title">
              Zimmer
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="zimmer"
              treatmentValue="zimmer"
              treatmentLabel="Zimmer"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment zimmer-intro" aria-labelledby="zimmer-intro-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="zimmer-intro__grid">
              <div className="coolsculpting-treatment__copy">
                <h2 id="zimmer-intro-heading" className="coolsculpting-treatment__title">
                  Zimmer weight loss treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Lifescc has been acclaimed as one of the best slimming centers in Hyderabad who always stand first to
                  leverage and incorporate new and emerging technologies into its services to offer nothing less than the
                  best to our customers.
                </p>
              </div>
              <figure className="zimmer-intro__figure">
                <img
                  src={zimmer1}
                  alt="Zimmer Z wave weight loss treatment at Life Slimming and Cosmetic Clinic"
                  className="zimmer-intro__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
            <div className="zimmer-intro__full" aria-labelledby="zimmer-intro-extended-heading">
              <h3 id="zimmer-intro-extended-heading" className="zimmer-intro__full-heading visually-hidden">
                More about Zimmer treatment
              </h3>
              <p className="coolsculpting-treatment__p zimmer-intro__full-p">
                We take immense pride to call ourselves pioneers to introduce the prestigious and cutting edge Zimmer
                weight loss treatment to our customers in Hyderabad. Zimmer technology is one of the best and highly
                advanced body slimming treatment methods powered by German technology that works on Radial Pulse Therapy. It
                applies high energy radial shockwaves penetrating up to 3.5 cm into the skin by breaking down the fibrous
                cellulite bands.
              </p>
              <p className="coolsculpting-treatment__p zimmer-intro__full-p">
                Zimmer has been scientifically proven to be one of the most effective treatment methods that reduce
                cellulite&apos;s appearance. Zimmer technology improves blood circulation in the cellulite and reduces the
                fat bulges, and accelerates collagen production in the body.
              </p>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="coolsculpting-treatment zimmer-benefits" aria-labelledby="zimmer-benefits-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="zimmer-benefits__grid">
              <div className="coolsculpting-treatment__copy zimmer-benefits__copy">
                <h2 id="zimmer-benefits-heading" className="coolsculpting-treatment__title">
                  Benefits of Zimmer
                </h2>
                <ul className="zimmer-benefits__list">
                  {ZIMMER_BENEFIT_COL_LINES.map(({ strong, text }) => (
                    <li key={strong}>
                      <strong>{strong}</strong>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="zimmer-benefits__video">
                <div className="zimmer-benefits__video-inner">
                  <iframe
                    title="Zimmer Z wave treatment overview"
                    src="https://www.youtube.com/embed/UFFgKlObqb8?si=Tld61EJMe5ucW6jh"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
            <div className="zimmer-benefits__full" aria-labelledby="zimmer-benefits-more-heading">
              <h3 id="zimmer-benefits-more-heading" className="zimmer-benefits__full-heading visually-hidden">
                Additional benefits
              </h3>
              <ul className="zimmer-benefits__list zimmer-benefits__list--full">
                {ZIMMER_BENEFIT_FULL_LINES.map(({ strong, text }) => (
                  <li key={strong}>
                    <strong>{strong}</strong>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="zimmer-why-lifescc" aria-labelledby="zimmer-why-lifescc-heading">
          <div className="zimmer-why-lifescc__shell">
            <header className="zimmer-why-lifescc__intro">
              <h2 id="zimmer-why-lifescc-heading" className="zimmer-why-lifescc__title">
                Why Lifescc?
              </h2>
              <div className="zimmer-why-lifescc__leaf" aria-hidden="true">
                <svg
                  className="zimmer-why-lifescc__leaf-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56 32"
                >
                  <ellipse cx="22" cy="18" fill="#15803d" rx="14" ry="7" transform="rotate(-38 22 18)" />
                  <ellipse cx="34" cy="18" fill="#166534" rx="14" ry="7" transform="rotate(38 34 18)" />
                </svg>
              </div>
            </header>
            <div className="zimmer-why-lifescc__body">
              <p className="zimmer-why-lifescc__p">
                At lifescc, we provide fully integrated health and wellness services to our customers with state of the
                art medical equipment well complemented by our team of skilled professionals who excel in advanced clinical
                procedures. We also stand at the top of the game regarding the success ratio of the Zimmer weight loss
                surgeries we have done so far.
              </p>
              <p className="zimmer-why-lifescc__p">
                If you are looking forward to the best Zimmer weight loss treatment in Hyderabad, Vizag, Vijayawada, and
                Nellore. Please visit your nearest lifescc clinic to know more about us and our treatment procedures and
                get free body analysis and counseling.
              </p>
              <p className="zimmer-why-lifescc__p">
                We have also heard back from thousands of our satisfied customers saying that Zimmer weight loss, combined
                with our other weight loss treatments such as Z lipo, has helped them achieve the desired weight loss
                results within a short period. Our other popular weight loss treatment services include CoolSculpting,
                Cryolipolysis, Inch Loss and Figure Correction, and many more.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={ZIMMER_PROCESS_STEPS}
          icons={ZIMMER_PROCESS_ICONS}
          tablistAriaLabel="Zimmer treatment process steps"
          headingId="zimmer-process-heading"
        />

        <WeightLossConsultationStrip sourcePage="zimmer" />
      </main>
      <SiteFooter />
    </div>
  )
}
