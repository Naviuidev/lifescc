import { useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import weightBan from '../assets/weight-ban.png'
import weightImg from '../assets/weight.jpg'
import weightlossImg from '../assets/weightloss.png'
import w1 from '../assets/w1.png'
import w2 from '../assets/w2.png'
import w3 from '../assets/w3.png'
import w4 from '../assets/w4.png'
import w5 from '../assets/w5.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './WeightLossTreatmentPage.css'

const WLT_FAQ_ITEMS = [
  {
    question: 'What is overweight?',
    answer:
      'Body mass index can be taken as a proper screening tool to determine whether a person is underweight, overweight or obese. Body mass index segments people in different weight categories. A person is said to have suffered from underweight, if his BMI is less than 18.5, people with BMI in between 18.5 to 24.9 are considered to be in normal weight, and if their BMI ranges in between 25 to 29.9 they fall into the category of overweight and if their BMI is 30 and more, it falls within the obese range.',
  },
  {
    question: 'What leads to overweight?',
    answer:
      'There may be numerous factors that contribute to overweight people. Out of them all depression, stress, unhealthy food choices, inactive lifestyle, lack of proper diet & physical activity are the major ones.',
  },
  {
    question: 'What are the complexities of overweight?',
    answer:
      'People suffering from overweight will be at the higher risk of succumbing to diseases like type 2 diabetes, high blood pressure, heart diseases and strokes in the future.',
  },
  {
    question: 'Stages of Our Weight Loss Programmes?',
    answer:
      'We offer a comprehensive weight loss programmes to all our customers that are well complemented by our highly trained and certified professionals and our state of the art facilities.',
  },
]

const WLT_PROCESS_STEPS = [
  {
    title: 'Basic Assessment',
    label: 'Assessment',
    body:
      'Our experts will do a body composition analysis to obtain accurate information about your BMI',
    icon: 'w1',
  },
  {
    title: 'Recommendations',
    label: 'Recommend',
    body:
      'Based on body composition analysis, we will recommend a combination of weight loss techniques that will help you get into your ideal body weight. Our popular weight loss treatments include non-surgical liposuction, cool sculpting, Zimmer and more.',
    icon: 'w2',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Our team of experts schedules your treatments after a thorough analysis of your health and body condition.',
    icon: 'w3',
  },
  {
    title: 'Treatment',
    label: 'Treatment',
    body:
      'Based on the treatment method and the person’s body condition, the treatment duration may range from a few hours to a few days.',
    icon: 'w4',
  },
  {
    title: 'Regular Monitoring',
    label: 'Monitoring',
    body:
      'After you have lost all the excess weight, we will regularly monitor you over the next couple of months to help you adopt a healthy lifestyle that ensures the weight loss is properly maintained.',
    icon: 'w5',
  },
]

const WLT_PROCESS_ICONS = { w1, w2, w3, w4, w5 }

function WeightLossTreatmentFaq() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="wlt-faq" role="region" aria-label="Weight loss frequently asked questions">
      {WLT_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-wlt-faq-panel-${index + 1}`
        const buttonId = `${baseId}-wlt-faq-btn-${index + 1}`
        return (
          <article
            key={item.question}
            className={isOpen ? 'wlt-acc__item wlt-acc__item--open' : 'wlt-acc__item'}
          >
            <h3 className="wlt-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="wlt-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="wlt-acc__question">{item.question}</span>
                <span className="wlt-acc__chevron" aria-hidden="true">
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
              className="wlt-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="wlt-acc__panel">
                <p className="wlt-acc__answer">{item.answer}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/** Weight loss treatment hub — slimming and non-surgical programmes at Lifescc. */
export default function WeightLossTreatmentPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page weight-loss-treatment-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="weight-loss-treatment-heading"
          style={{ backgroundImage: `url(${weightBan})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="weight-loss-treatment-heading" className="cryolipolysis-hero-title">
              Weight loss treatment
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="weight_loss_treatment"
              treatmentValue="weight_loss_treatment"
              treatmentLabel="Weight loss treatment"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment wlt-split-a" aria-labelledby="wlt-centers-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="wlt-split-a__grid">
              <figure className="wlt-split-a__figure">
                <img
                  src={weightImg}
                  alt="Weight loss and slimming consultation at Lifescc"
                  className="wlt-split-a__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="coolsculpting-treatment__copy wlt-split-a__copy">
                <h2 id="wlt-centers-heading" className="coolsculpting-treatment__title">
                  Best weight loss centers in Hyderabad
                </h2>
                <p className="coolsculpting-treatment__p">
                  Lifescc is known as the best weight loss and slimming centres in Hyderabad. We are well known for our
                  approved hassle-free fat loss, body slimming and body shaping treatment methods. Our exclusive
                  non-surgical, non-invasive weight loss &amp; body slimming treatment methods such as Coolsculpting,
                  Zimmer, Cryolipolysis etc. can be a great alternative to surgical treatments such as liposuction which may
                  result in health complications. Our weight loss treatments have helped our numerous clients lose excess
                  weight and gain back their health, looks, and confidence. For weight loss treatment in Hyderabad, Vizag,
                  and Vijayawada visit our clinic today!
                </p>
              </div>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="coolsculpting-treatment wlt-split-b" aria-labelledby="wlt-nonsurgical-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="wlt-split-b__grid">
              <div className="coolsculpting-treatment__copy wlt-split-b__copy">
                <h2 id="wlt-nonsurgical-heading" className="coolsculpting-treatment__title">
                  Non-Surgical Weight Loss Treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Weight gain or obesity can be caused due to various factors such as excessive eating, inactive lifestyle,
                  stress, hormonal imbalance, lack of sleep and more. The concerning fact is that obesity or being
                  overweight can lead to numerous complications such as heart ailments, diabetes, asthma, renal failure.
                  Having an expert by your side will help you achieve your weight loss goals quickly and easily. If you are
                  looking for a non-surgical weightloss treatment in Hyderabad that brings lasting results, choose Life
                  Slimming and Cosmetic Clinic.
                </p>
              </div>
              <figure className="wlt-split-b__figure">
                <img
                  src={weightlossImg}
                  alt="Non-surgical weight loss treatment at Life Slimming and Cosmetic Clinic"
                  className="wlt-split-b__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="wlt-why" aria-labelledby="wlt-why-heading">
          <div className="wlt-why__shell">
            <h2 id="wlt-why-heading" className="wlt-why__subtitle">
              Why Lifescc :
            </h2>
            <p className="wlt-why__p">
              Life slimming and cosmetic clinic is one of the most trusted and highly approved weight loss and body
              slimming clinics in south India, offering highly advanced, non-surgical, and non-invasive weight loss
              treatment methods that include cool sculpting, cryolipolysis, Zimmer, cool mini, and many more.
            </p>
            <p className="wlt-why__p">
              Over the past 10 years, We at lifescc has built a reputation for ourselves as one of the best weight loss
              clinics in south India by offering the best value to our customer&apos;s money through our advanced and
              reliable weight loss and body slimming services with 100% success rate. Visit your nearest lifescc branch
              today for a free consultation.
            </p>
            <p className="wlt-why__p">
              In Hyderabad, Lifescc has weight loss and slimming clinics in Banjara hills, Chanda Nagar, Himayat Nagar, SR
              Nagar and Dilsukhnagar. We also have branches in Vijayawada, Vizag and Nellore.
            </p>
          </div>
        </section>

        <section className="coolsculpting-treatment wlt-faq-section" aria-labelledby="wlt-faq-heading">
          <div className="coolsculpting-treatment__shell">
            <h2 id="wlt-faq-heading" className="visually-hidden">
              Overweight and weight loss programme questions
            </h2>
            <WeightLossTreatmentFaq />
          </div>
        </section>

        <TreatmentProcessTabs
          steps={WLT_PROCESS_STEPS}
          icons={WLT_PROCESS_ICONS}
          tablistAriaLabel="Weight loss treatment process steps"
          headingId="wlt-process-heading"
        />

        <WeightLossConsultationStrip sourcePage="weight_loss_treatment" />
      </main>
      <SiteFooter />
    </div>
  )
}
