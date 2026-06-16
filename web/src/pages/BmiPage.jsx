import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import bmiImg from '../assets/bmiImg.jpg'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './BmiPage.css'

const BMI_INTRO_ACCORDION_ITEMS = [
  {
    question: 'How BMI is calculated?',
    answer:
      'BMI can be calculated by a simple formula : BMI = Weight (Kilograms)/Height (meters)*Height (Centimeters)',
  },
  {
    question: 'How to determine a person’s weight status with BMI?',
    answer:
      'A person’s weight status can be easily determined based on their BMI values from the infographic given below.',
  },
]

function BmiIntroAccordions() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="bmi-intro__accordions" role="region" aria-label="BMI frequently asked questions">
      {BMI_INTRO_ACCORDION_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-bmi-acc-panel-${index + 1}`
        const buttonId = `${baseId}-bmi-acc-btn-${index + 1}`
        return (
          <article
            key={index}
            className={isOpen ? 'bmi-intro-acc__item bmi-intro-acc__item--open' : 'bmi-intro-acc__item'}
          >
            <h3 className="bmi-intro-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="bmi-intro-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="bmi-intro-acc__question">{item.question}</span>
                <span className="bmi-intro-acc__chevron" aria-hidden="true">
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
              className="bmi-intro-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="bmi-intro-acc__panel">
                <p className="bmi-intro-acc__answer">{item.answer}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/** BMI calculator / analysis landing — hero plus consultation strip matching CoolSculpting layout. */
export default function BmiPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page bmi-page">
        <section className="coolsculpting-hero bmi-hero" aria-labelledby="bmi-heading">
          <div className="coolsculpting-hero__inner">
            <p className="coolsculpting-hero__eyebrow">Weight loss treatments</p>
            <h1 id="bmi-heading" className="coolsculpting-hero__title">
              BMI calculator / BMI analysis in Hyderabad
            </h1>
            <p className="coolsculpting-hero__lead">Are you looking for the best treatment for weight loss?</p>
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

        <section className="bmi-intro" aria-labelledby="bmi-intro-heading">
          <div className="bmi-intro__shell">
            <div className="bmi-intro__grid">
              <div className="bmi-intro__lead">
                <h2 id="bmi-intro-heading" className="bmi-intro__title">
                  BMI
                </h2>
                <p className="bmi-intro__p">
                  BMI or Body Mass Index is a globally acknowledged, scientific method of measuring obesity. As
                  recommended by the WHO (World Health Organization), it is a simple index of weight-for-height, which can
                  be used to classify underweight, normal weight, overweight and obese adults along with their level of
                  associated health risks. It is calculated by dividing the weight in kilograms by the square of an
                  individual&apos;s height in meters. Check your BMI with our free BMI calculator today at lifescc and
                  stay on top of your health.
                </p>
              </div>
              <BmiIntroAccordions />
              <figure className="bmi-intro__figure">
                <img
                  src={bmiImg}
                  alt="Infographic illustrating BMI categories and weight status ranges"
                  className="bmi-intro__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bmi-daytoday" aria-labelledby="bmi-daytoday-heading">
          <div className="bmi-daytoday__shell">
            <h2 id="bmi-daytoday-heading" className="bmi-daytoday__title">
              Why it is important in our day to day life?
            </h2>
            <p className="bmi-daytoday__p">
              One can be on top of their body weight and health by keeping a regular check on their BMI. A person with
              high BMI has higher chances of developing severe health problems in the future such as heart attack,
              diabetes etc. like high BMI can cause health problems, so can low BMI also results in various health issues
              such as decreased immune function, heart problems, iron deficiency, bone loss and many more.
            </p>
            <h3 className="bmi-daytoday__subtitle">Why people become overweight?</h3>
            <p className="bmi-daytoday__p">
              Usually, overweight is primarily associated with genetics, but it also largely depends on the type of food we
              take and exercise that we do every day. As we all know, our body observes energy in the form of calories
              through the food we take for its functioning. Our weight will be more likely to stay the same as long as we
              give our body the same amount of energy it requires. But when one takes more food than what their body can
              burn, it may result in gaining their body weight. However, it has been revealed from a few studies that doing
              exercise for at least three times a week will help in maintaining an ideal body weight which in turn results
              in a good BMI.
            </p>
            <h3 className="bmi-daytoday__subtitle">Why lifescc?</h3>
            <p className="bmi-daytoday__p bmi-daytoday__p--last">
              Are you concerned about knowing your BMI? But do not know where to get the right help? Walk-in to any of your
              nearest lifescc clinics to get a free consultation with our weight loss experts and to discuss the best ways
              of maintaining an ideal BMI. Now you even check your BMI instantly through our body mass index calculator
              given here:
            </p>
          </div>
        </section>

        <WeightLossConsultationStrip sourcePage="bmi" />
      </main>
      <SiteFooter />
    </div>
  )
}
