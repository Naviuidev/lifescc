import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import coolminiBg from '../assets/coolminiBg.png'
import cool1Img from '../assets/cool1Img.jpg'
import coolMiniTreatmentImg from '../assets/cool_mini_treatment.jpg'
import c1 from '../assets/c1.png'
import c2 from '../assets/c2.png'
import c3 from '../assets/c3.png'
import c4 from '../assets/c4.png'
import c5 from '../assets/c5.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './CoolMiniPage.css'

const COOL_MINI_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consult',
    body:
      'Schedule an appointment with our expert staff for an assessment and understand more about the CoolMini double chin procedure.',
    icon: 'c1',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our experts to analyze and assess and schedule.',
    icon: 'c2',
  },
  {
    title: 'Treatment',
    label: 'Treat',
    body:
      'The Cool Mini applicator is positioned under the chin area and is activated. The applicator’s cup pulls the double chin area into it and cools the fat to its freezing point. The fat cells break down and are absorbed by the body within a few weeks.',
    icon: 'c3',
  },
  {
    title: 'Sessions',
    label: 'Sessions',
    body:
      'Each session may last less than an hour and requires no downtime. You can get back to your work or everyday activities right after the procedure. The number of sessions depends on the amount of fat deposited under the chin. For most patients, 1 to 2 sessions are usually enough.',
    icon: 'c4',
  },
  {
    title: 'Post-treatment',
    label: 'Care',
    body:
      'After Cool Mini chin treatment, some people experience loose skin due to the loss of fat under the chin. This can be easily addressed by our skin rejuvenation and firming treatments.',
    icon: 'c5',
  },
]

const COOL_MINI_PROCESS_ICONS = {
  c1,
  c2,
  c3,
  c4,
  c5,
}

/** Cool Mini — CoolSculpting Mini applicator for double chin at Lifescc. */
export default function CoolMiniPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page cool-mini-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="cool-mini-heading"
          style={{ backgroundImage: `url(${coolminiBg})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="cool-mini-heading" className="cryolipolysis-hero-title">
              Cool Mini
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="cool_mini"
              treatmentValue="cool_mini"
              treatmentLabel="Cool Mini"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment cool-mini-intro-block" aria-labelledby="cool-mini-best-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="cool-mini-intro-block__grid">
              <div className="coolsculpting-treatment__copy cool-mini-intro-block__copy">
                <h2 id="cool-mini-best-heading" className="coolsculpting-treatment__title">
                  Best cool mini treatment in Hyderabad
                </h2>
                <p className="coolsculpting-treatment__p">
                  Life Slimming and Cosmetic Clinic brings to you the advanced Cool Mini Treatment in Hyderabad, Vizag,
                  and Vijayawada designed explicitly for double chin removal.
                </p>
              </div>
              <figure className="coolsculpting-treatment__figure cool-mini-intro-block__figure">
                <img
                  src={cool1Img}
                  alt="Cool Mini double chin treatment at Life Slimming and Cosmetic Clinic"
                  className="coolsculpting-treatment__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="cool-mini-intro-block__full">
                <p className="coolsculpting-treatment__p">
                  Life Slimming and Cosmetic Clinic brings you the best cool mini treatment in Hyderabad designed
                  explicitly for double chin removal. It&apos;s a completely non-invasive technique that involves freezing
                  fat cells, giving visible and lasting results. Double chin comes up can be quite frustrating and may lead
                  to lower self-esteem for many people. Double chin problems can be seen in healthy people due to aging and
                  genetics. When it can&apos;t be possible to eliminate the fat under the chin through diet or exercise,
                  cool mini treatment comes as a solution that provides effective and accurate results in reducing double
                  chin in a short period.
                </p>
                <p className="coolsculpting-treatment__p">
                  The cool mini method is one of the highly safest, most advanced non-surgical fat reduction treatment
                  methods dedicated to treating small to medium fat areas under your neck, chin, and other delicate areas.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">What is a cool mini method?</h3>
                <p className="coolsculpting-treatment__p">
                  The cool mini method is one of the highly safest, most advanced non-surgical fat reduction treatment
                  methods dedicated to treating small to medium fat areas under your neck, chin, and other delicate areas.
                </p>
                <p className="coolsculpting-treatment__p">
                  The cool mini method is one of the highly safest, most advanced non-surgical fat reduction treatment
                  methods dedicated to treating small to medium fat areas under your neck, chin, and other delicate areas.
                </p>
                <p className="coolsculpting-treatment__p">
                  The cool mini device is an application developed by Zeltiq, a leading Biopharma company in the USA; it
                  has earlier developed cool sculpting, patented technology with the help of Boston doctors to treat
                  stubborn fat in sensitive areas such as the chin, neck, etc. It was based on the Cryolipolysis Treatment
                  method that works on inactivating fat cells under controlled cooling conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="coolsculpting-treatment cool-mini-works" aria-labelledby="cool-mini-works-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="coolsculpting-treatment__grid">
              <figure className="coolsculpting-treatment__figure">
                <img
                  src={coolMiniTreatmentImg}
                  alt="Cool Mini treatment applicator for under-chin contouring"
                  className="coolsculpting-treatment__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="coolsculpting-treatment__copy">
                <h2 id="cool-mini-works-heading" className="coolsculpting-treatment__title">
                  How Cool Mini Works?
                </h2>
                <p className="coolsculpting-treatment__p">
                  In Cool Mini method, Cool mini device is kept under your chin and held in place by a strap around your
                  head. Some people may find it a bit uncomfortable during the initial treatment stage; however, it will
                  not last for a longer time. It offers permanent and highly effective solutions for people suffering from
                  double chin and neck fullness problems and brings a dramatic change in their appearance. The complete
                  treatment duration may range between 1 to 3 sessions, and each session lasts about 45 minutes. However,
                  as per an estimate, as much as 25% fat will be removed per every session, one can have a noticeable
                  stronger jawline right after their first session.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">How long it takes to see the results?</h3>
                <p className="coolsculpting-treatment__p">
                  It may take around 2 to 3 months to see the full results after the treatment. However, it may vary from
                  person to person.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="coolsculpting-treatment cool-mini-lifescc"
          aria-labelledby="cool-mini-why-lifescc-heading"
        >
          <div className="coolsculpting-treatment__shell">
            <h2 id="cool-mini-why-lifescc-heading" className="coolsculpting-treatment__title">
              Why Lifescc?
            </h2>
            <p className="coolsculpting-treatment__p">
              Over the past 10 years, we at lifescc have successfully helped many of our customers with our innovative and
              revolutionary treatment methods. Cool mini is one such unique treatment method available only at lifescc. Our
              state-of-the-art facilities at our clinics complemented by our highly certified team of experts have helped
              us stand out in a sea of look-alikes in big cities. Suppose you are looking forward to noticeable and
              long-lasting results for your double chin issue through cool mini treatment in Hyderabad, Nellore, Vizag,
              and Vijayawada. Visit your nearest lifescc clinic to know more about us and our treatment methods and get a
              free consultation from our doctors&apos; team.
            </p>
            <p className="coolsculpting-treatment__p">
              Our other popular treatment services at lifescc include Zimmer, Weight loss, Cryolipolysis, Inch Loss, &amp;
              Figure Correction treatments.
            </p>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={COOL_MINI_PROCESS_STEPS}
          icons={COOL_MINI_PROCESS_ICONS}
          tablistAriaLabel="Cool Mini process steps"
          headingId="cool-mini-process-heading"
        />

        <WeightLossConsultationStrip sourcePage="cool_mini" />
      </main>
      <SiteFooter />
    </div>
  )
}
