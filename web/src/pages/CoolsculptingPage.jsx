import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import heroBg from '../assets/coolsculpting-hero.png'
import treatmentImg from '../assets/coolsImg.jpg'
import f1 from '../assets/f1.png'
import f2 from '../assets/f2.png'
import f3 from '../assets/f3.png'
import f4 from '../assets/f4.png'
import icon1 from '../assets/icon1.png'
import icon2 from '../assets/icon2.png'
import icon3 from '../assets/icon3.png'
import icon4 from '../assets/icon4.png'
import icon5 from '../assets/icon5.png'
import cryo from '../assets/cryo.png'
import certification1 from '../assets/certification1.jpg'
import certification2 from '../assets/certification2.jpg'
import certification3 from '../assets/certification3.jpg'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'

const COOLSCULPT_STRIP_IMAGES = [
  { src: f1, width: 318, height: 80 },
  { src: f2, width: 320, height: 80 },
  { src: f3, width: 320, height: 80 },
  { src: f4, width: 318, height: 80 },
]

const PROCESS_STEPS = [
  {
    title: 'First Visit',
    label: 'Consult',
    body:
      'You will meet with our CoolSculpting expert, who will discuss your goals. The expert will look at your body from various angles and identify and discuss the areas which need fat removal to get the desired look.',
    icon: 'first-visit',
  },
  {
    title: 'Determining Target Areas',
    label: 'Plan',
    body:
      'Our CoolSculpting expert will evaluate the areas that need to be sculpted and provide you with recommendations. Fat can be eliminated from various areas, including thighs, abdomen, chin, etc.',
    icon: 'icon2',
  },
  {
    title: 'Schedule',
    label: 'Treat',
    body:
      'Get started on our treatment with a consultation with one expert who will analyze and assess and schedule.',
    icon: 'icon3',
  },
  {
    title: 'Freezing of Fat Cells',
    label: 'Recover',
    body:
      'We will schedule the treatment at your convenience. The treatment will also include a personalized diet plan and diet counseling.',
    icon: 'icon4',
  },
  {
    title: 'Elimination of Fat Cells',
    label: 'Results',
    body:
      'Over the next few weeks, the fat cells are naturally eliminated by your body, revealing a sculpted, slimmer body that you have always wanted.',
    icon: 'icon5',
  },
]

const PROCESS_ICONS = {
  'first-visit': icon1,
  icon2,
  icon3,
  icon4,
  icon5,
}

const FAQ_ITEMS = [
  {
    question: 'Who should be recommended for Cool Sculpting treatment?',
    answer:
      'CoolSculpting can be given to people who have fat pockets and want to have a sculpted look with fat loss. CoolSculpting can reduce 25 to 30% of fat in the treated area.',
  },
  {
    question: 'What are the locations at which CoolSculpting is being offered currently at lifescc?',
    answer: 'CoolSculpting treatment is currently being available at Lifescc Banjara.',
  },
  {
    question: 'Were there any age limitations for Coolsculpting?',
    answer: 'CoolSculpting can be taken up by people aged between 18 to 70yrs.',
  },
  {
    question: 'What are the key benefits of this treatment?',
    answer:
      'CoolSculpting is a leading non-invasive fat-reduction procedure. It is a process of freezing away the unwanted fat from your body. So, there is no surgery involved, and no downtime is required. That’s why people across the world prefer CoolSculpting. Notably, more than 7 Million cycles have been performed successfully worldwide. Fifty-two clinical studies back CoolSculpting.',
  },
]

function CoolsculptingFaqs() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="coolsculpting-faq" aria-labelledby="coolsculpting-faq-heading">
      <div className="coolsculpting-faq__shell">
        <header className="coolsculpting-faq__header">
          <h2 id="coolsculpting-faq-heading" className="coolsculpting-faq__title">
            FAQ&apos;s
          </h2>
        </header>

        <div className="coolsculpting-faq__list">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            const panelId = `${baseId}-faq-panel-${index + 1}`
            const buttonId = `${baseId}-faq-button-${index + 1}`
            return (
              <article
                key={index}
                className={isOpen ? 'coolsculpting-faq__item coolsculpting-faq__item--open' : 'coolsculpting-faq__item'}
              >
                <h3 className="coolsculpting-faq__item-heading">
                  <button
                    id={buttonId}
                    type="button"
                    className="coolsculpting-faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
                  >
                    <span className="coolsculpting-faq__question">{item.question}</span>
                    <span className="coolsculpting-faq__chevron" aria-hidden="true">
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
                  className="coolsculpting-faq__panel-wrap"
                  aria-hidden={!isOpen}
                >
                  <div className="coolsculpting-faq__panel">
                    <p className="coolsculpting-faq__answer">{item.answer}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CoolsculptingAdvantages() {
  return (
    <section className="coolsculpting-advantages" aria-labelledby="coolsculpting-advantages-heading">
      <div className="coolsculpting-advantages__shell">
        <header className="coolsculpting-advantages__intro">
          <h2 id="coolsculpting-advantages-heading" className="coolsculpting-advantages__title">
            Advantages Of Cool Sculpting
          </h2>
          <p className="coolsculpting-advantages__tagline">Clinically proven fat loss treatment</p>
          <p className="coolsculpting-advantages__p">
            Cool sculpting is a highly effective fat reduction technique approved by the FDA that follows stringent
            clinical standards and better service protocols.
          </p>
        </header>

        <div className="coolsculpting-advantages__grid">
          <figure className="coolsculpting-advantages__figure">
            <img
              src={cryo}
              alt="CoolSculpting session demonstrating cryo-based fat reduction treatment"
              className="coolsculpting-advantages__img"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className="coolsculpting-advantages__content">
            <h3 className="coolsculpting-advantages__subheading">Safe Procedure</h3>
            <p className="coolsculpting-advantages__p">
              CoolSculpting procedure offers safety to the patients in all three levels.
            </p>

            <div className="coolsculpting-advantages__cards">
              <article className="coolsculpting-advantages__card">
                <h4 className="coolsculpting-advantages__card-title">Procedure Safety</h4>
                <p className="coolsculpting-advantages__card-body">
                  CoolSculpting is a completely non-invasive treatment procedure that does not involve needles or
                  scissors, making it one of the safest fat reduction treatment procedures that one can go through with
                  zero risks.
                </p>
              </article>

              <article className="coolsculpting-advantages__card">
                <h4 className="coolsculpting-advantages__card-title">Clinician Safety</h4>
                <p className="coolsculpting-advantages__card-body">
                  Cool sculpting specialists undergo in-depth training to provide high standards of safety to the
                  patients.
                </p>
              </article>

              <article className="coolsculpting-advantages__card">
                <h4 className="coolsculpting-advantages__card-title">Device Safety</h4>
                <p className="coolsculpting-advantages__card-body">
                  Devices used for cool sculpting are designed with built-in safety measures that offer the patients.
                  With an optimum safety level, they automatically get shut down when the temperatures go beyond the
                  permissible limit.
                </p>
              </article>
            </div>

            <h3 className="coolsculpting-advantages__subheading">Pain Less Treatment</h3>
            <p className="coolsculpting-advantages__p">
              It is a pain-free treatment; one can read books or watch a movie during the procedure.
            </p>

            <h3 className="coolsculpting-advantages__subheading">Noticeable Results</h3>
            <p className="coolsculpting-advantages__p">
              Results can be observed within the first 8 to 12 weeks of treatment.
            </p>

            <h3 className="coolsculpting-advantages__subheading">Treats Multiple Areas</h3>
            <p className="coolsculpting-advantages__p">
              It is a highly recommended procedure for those patients who wish to reduce the fat bulge in specific areas
              such as abdomen thigh, bra fat, double chin, etc.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Service detail: CoolSculpting — non-invasive fat reduction at Lifescc. */
export default function CoolsculptingPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page">
        <section
          className="coolsculpting-hero"
          aria-labelledby="coolsculpting-heading"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <p className="coolsculpting-hero__eyebrow">Weight loss treatments</p>
            <h1 id="coolsculpting-heading" className="coolsculpting-hero__title">
              Coolsculpting
            </h1>
            <p className="coolsculpting-hero__lead">
              FDA-approved, non-surgical body contouring that freezes stubborn fat — with no needles and minimal downtime.
              Book a free body analysis at your nearest Life Slimming &amp; Cosmetic Clinic in Hyderabad and beyond.
            </p>
            <div className="coolsculpting-hero__actions">
              <Link to="/book-an-appointment" className="coolsculpting-hero__btn coolsculpting-hero__btn--primary">
                Book an appointment
              </Link>
              <Link to="/contact-us" className="coolsculpting-hero__btn coolsculpting-hero__btn--secondary">
                Contact us
              </Link>
            </div>
          </div>
        </section>

        <section className="coolsculpting-treatment" aria-labelledby="coolsculpting-treatment-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="coolsculpting-treatment__grid">
              <div className="coolsculpting-treatment__copy">
                <h2 id="coolsculpting-treatment-heading" className="coolsculpting-treatment__title">
                  CoolSculpting Treatment- Best Non-invasive Body Sculpting Treatments In Hyderabad.
                </h2>
                <p className="coolsculpting-treatment__lead">
                  Are you craving an ideal body shape and look? CoolSculpting can be a perfect solution for you.
                </p>
                <p className="coolsculpting-treatment__p">
                  Coolsculpting at Life Slimming &amp; Cosmetic Clinic is one of the best non-invasive body sculpting
                  treatments in Hyderabad that helps eliminate the fat cells in your body by freezing them. It is a great
                  alternative to liposuction or other similar procedures as it is an FDA approved non-surgical treatment
                  method. It has no downtime.
                </p>
              </div>
              <figure className="coolsculpting-treatment__figure">
                <img
                  src={treatmentImg}
                  alt="Waist area illustrating targeted CoolSculpting treatment zones"
                  className="coolsculpting-treatment__img"
                  width={500}
                  height={389}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
            <div className="coolsculpting-treatment__full">
              <p className="coolsculpting-treatment__p">
                You can go to your workplace right after the procedure! Through the CoolSculpting procedure, we were able
                to help several of our clients realize their dream of a slim and more sculpted body.
              </p>
              <p className="coolsculpting-treatment__p">
                If you are looking to eliminate fat safely and effectively, visit your nearest Life Slimming and Cosmetic
                Clinic to experience our best Coolsculpting treatment services in Hyderabad.
              </p>
            </div>
          </div>
        </section>

        <section className="coolsculpting-four-up" aria-label="CoolSculpting steps">
          <div className="coolsculpting-four-up__shell">
            <div className="coolsculpting-four-up__row">
              {COOLSCULPT_STRIP_IMAGES.map((item, index) => (
                <figure key={index} className="coolsculpting-four-up__cell">
                  <img
                    src={item.src}
                    alt=""
                    className="coolsculpting-four-up__img"
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="coolsculpting-why-lifescc" aria-labelledby="coolsculpting-why-heading">
          <div className="coolsculpting-why-lifescc__shell">
            <h2 id="coolsculpting-why-heading" className="coolsculpting-why-lifescc__title">
              Why Lifescc?
            </h2>
            <p className="coolsculpting-why-lifescc__p">
              At Lifescc, we take immense pride in calling ourselves pioneers to introduce cool sculpting technology in
              south India. Backed by our certified and highly trained cosmetologists&apos; expertise, having extensive
              experience of treating thousands of customers for the past 10 years has helped us emerge as a leader in
              cool sculpting treatment. Lifescc also stands on the top of the game regarding the success ratio of the
              cool sculpting non surgical treatment we have done so far.
            </p>
            <p className="coolsculpting-why-lifescc__p">
              If you are looking forward for the best cool sculpting treatment in Hyderabad, Vizag, Vijayawada, Nellore.
              Please visit your nearest lifescc clinic for free body analysis and counseling, and to discuss an individual
              and a more customized treatment plans with our experts.
            </p>
            <p className="coolsculpting-why-lifescc__p">
              We have also heard back from thousands of our satisfied customers saying that cool sculpting when combined
              with our weight loss treatments, has helped them achieve the desired weight loss results within a short
              period of time. Our other popular weight loss treatment services include &quot;Zimmer Weightloss&quot;,
              &quot;Cryolipolysis&quot;, and &quot;Inch Loss &amp; Figure Correction&quot; treatments.
            </p>
          </div>
        </section>

        <section className="coolsculpting-videos" aria-label="CoolSculpting videos">
          <div className="coolsculpting-videos__shell">
            <div className="coolsculpting-videos__row">
              <div className="coolsculpting-videos__embed">
                <iframe
                  src="https://www.youtube.com/embed/Y7aYm_uG03s?si=PekedkE0_UwLtCmM"
                  title="CoolSculpting video 1"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="coolsculpting-videos__embed">
                <iframe
                  src="https://www.youtube.com/embed/lzT5nWCJnoc?si=MNNqPRlMYKsPJl_7"
                  title="CoolSculpting video 2"
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="coolsculpting-certification" aria-labelledby="coolsculpting-cert-heading">
          <div className="coolsculpting-certification__shell">
            <header className="coolsculpting-certification__header">
              <h2 id="coolsculpting-cert-heading" className="coolsculpting-certification__title">
                Our Certification
              </h2>
              <div className="coolsculpting-certification__divider" aria-hidden="true">
                <span className="coolsculpting-certification__divider-line" />
                <span className="coolsculpting-certification__divider-icon">
                  <svg
                    className="coolsculpting-certification__divider-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56 32"
                    aria-hidden="true"
                  >
                    <ellipse cx="22" cy="18" fill="#15803d" rx="14" ry="7" transform="rotate(-38 22 18)" />
                    <ellipse cx="34" cy="18" fill="#166534" rx="14" ry="7" transform="rotate(38 34 18)" />
                  </svg>
                </span>
                <span className="coolsculpting-certification__divider-line" />
              </div>
            </header>
            <div className="coolsculpting-certification__grid">
              <figure className="coolsculpting-certification__figure">
                <img
                  src={certification1}
                  alt="Certificate of Completion for K. Prathibha, CoolSculpting Training by ZELTIQ Aesthetics, April 2013"
                  className="coolsculpting-certification__img"
                  width={1280}
                  height={954}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <figure className="coolsculpting-certification__figure">
                <img
                  src={certification2}
                  alt="Certificate of Appreciation for Life Slimming & Cosmetic Centre, Zeltiq first CoolSculpting user in India, November 2012"
                  className="coolsculpting-certification__img"
                  width={1280}
                  height={958}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <figure className="coolsculpting-certification__figure">
                <img
                  src={certification3}
                  alt="Certificate of Completion for K. Krishna Prasad, CoolSculpting Training by ZELTIQ Aesthetics, April 2013"
                  className="coolsculpting-certification__img"
                  width={1280}
                  height={935}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={PROCESS_STEPS}
          icons={PROCESS_ICONS}
          tablistAriaLabel="CoolSculpting process steps"
          headingId="coolsculpting-process-heading"
        />
        <CoolsculptingFaqs />
        <CoolsculptingAdvantages />
        <WeightLossConsultationStrip sourcePage="coolsculpting" />
      </main>
      <SiteFooter />
    </div>
  )
}
