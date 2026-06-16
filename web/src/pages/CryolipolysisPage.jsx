import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import heroBg from '../assets/cryoImg.png'
import cryolipolysisImg from '../assets/cryolipolysis.png'
import icc1 from '../assets/icc1.png'
import icc2 from '../assets/icc2.png'
import icc3 from '../assets/icc3.png'
import icc4 from '../assets/icc4.png'
import icc5 from '../assets/icc5.png'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'

const CRYO_PROCESS_STEPS = [
  {
    title: 'Identifying The Target Areas',
    label: 'Consult',
    body:
      'Get started on our treatment with a consultation with one of our expert aestheticians who will analyse the areas that need to be sculpted and share the procedure with you.',
    icon: 'icc1',
  },
  {
    title: 'Freezing Fat Cells',
    label: 'Freeze',
    body:
      'The cryo lipo machine targets fat cells and freezes them in a non-invasive procedure which ensures the safety of your skin. It leads to the removal of the fat cells.',
    icon: 'icc2',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
    icon: 'icc3',
  },
  {
    title: 'Removal Of Fat Cells',
    label: 'Results',
    body:
      'In the next few weeks, your body begins to process the dead fat cells and removes them from the system. Results will show when you look at a more sculpted figure in the mirror.',
    icon: 'icc4',
  },
  {
    title: 'Reshaping Sessions',
    label: 'Reshape',
    body:
      'For a better figure or further reshaping, our experts can suggest additional sessions. You can consult our aestheticians for future sessions, toned looks and a more procedure with you.',
    icon: 'icc5',
  },
]

const CRYO_PROCESS_ICONS = {
  icc1,
  icc2,
  icc3,
  icc4,
  icc5,
}

const CRYO_INFO_COLUMNS = [
  {
    id: 'cryolipolysis-info-side-effects',
    heading: 'Were there any side effects of cryolipolysis treatment?',
    body:
      'There are chances that some people might witness numbness, reddish spots or tingling sensation on the treatment areas, during the process of treatment. However, they will subside within a few hours post-treatment.',
  },
  {
    id: 'cryolipolysis-info-ideal-candidates',
    heading: 'Who are not the ideal people for cryolipolysis treatment?',
    body:
      'People with liver disease should not undergo cryolipolysis treatment. At the same time, People who have gone through any major surgery in the past are also not the ideal set of people for this treatment method. However, before going for cryolipolysis, we suggest you have a direct consultation with a doctor, who will analyze your pre-medical history to discuss the potential risks and outcomes of this treatment procedure.',
  },
  {
    id: 'cryolipolysis-info-why',
    heading: 'Why go for cryolipolysis treatment?',
    body:
      'Unlike other invasive treatment methods like liposuction, cryolipolysis will not result in any side effects, and it offers no recovery time, and one can get back to routine immediately after the treatment. Cryolipolysis is one of the best fat reduction treatment methods that help to get rid of excess flab with minimum effort, where one can expect to reduce their body fat up to 25%.',
  },
]

/** Service detail: Cryolipolysis — non-invasive fat reduction via controlled cooling at Lifescc. */
export default function CryolipolysisPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="cryolipolysis-heading"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="cryolipolysis-heading" className="cryolipolysis-hero-title">
              Cryolipolysis
            </h1>
            <CryolipolysisHeroConsultForm />
          </div>
        </section>

        <section className="coolsculpting-treatment" aria-labelledby="cryolipolysis-clinic-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="coolsculpting-treatment__grid">
              <div className="coolsculpting-treatment__copy">
                <h2 id="cryolipolysis-clinic-heading" className="coolsculpting-treatment__title">
                  Best cryolipolysis clinic in Hyderabad
                </h2>
                <p className="coolsculpting-treatment__p">
                  Life Slimming and Cosmetic Clinic is one of the best cryolipolysis clinics in Hyderabad. It is an
                  excellent alternative to liposuction, as it is a non-surgical treatment method which is safe and
                  approved by FDA medical standards. With over 10 years of experience and handling more than 50K+
                  patients, lifescc has evolved as a trusted name in Cryolipolysis treatment in Hyderabad.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">How Cryolipolysis Works?</h3>
                <p className="coolsculpting-treatment__p">
                  In this process, the applicator will be put on the skin, and due to the vacuum effect, the subcutaneous
                  layer of skin will be squeezed into the machine. The fat cells present in the skin are then exposed to
                  extremely low temperatures and are permanently destroyed. The liver later evacuates them from the body
                  through a natural process.
                </p>
              </div>
              <figure className="coolsculpting-treatment__figure">
                <img
                  src={cryolipolysisImg}
                  alt="Cryolipolysis treatment at Life Slimming and Cosmetic Clinic"
                  className="coolsculpting-treatment__img"
                  width={500}
                  height={389}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="cryolipolysis-info-trio" aria-label="Cryolipolysis treatment information">
          <div className="cryolipolysis-info-trio__shell">
            <div className="cryolipolysis-info-trio__grid">
              {CRYO_INFO_COLUMNS.map((col) => (
                <article key={col.id} className="cryolipolysis-info-trio__col">
                  <h3 className="cryolipolysis-info-trio__heading" id={col.id}>
                    {col.heading}
                  </h3>
                  <p className="cryolipolysis-info-trio__p">{col.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cryolipolysis-why-lifescc" aria-labelledby="cryolipolysis-why-lifescc-heading">
          <div className="cryolipolysis-why-lifescc__shell">
            <header className="cryolipolysis-why-lifescc__intro">
              <h2 id="cryolipolysis-why-lifescc-heading" className="cryolipolysis-why-lifescc__title">
                Why Lifescc?
              </h2>
            </header>
            <div className="cryolipolysis-why-lifescc__body">
              <p className="cryolipolysis-why-lifescc__p">
                At Lifescc, we provide fully integrated health and wellness services to our customers with state of the
                art medical equipment well complemented by our team of skilled professionals who excel in advanced
                clinical procedures.
              </p>
              <p className="cryolipolysis-why-lifescc__p">
                We understand that each one of our customers is unique and so are their requirements; hence we offer
                fully customized and personalized treatment plans based on our scientifically research-based approach.
                Apart from the above, we take great pride and privilege to have introduced an array of new treatment
                options such as cool sculpting, cryolipolysis, Zimmer that have impacted thousands of our
                customer&apos;s families positively.
              </p>
              <p className="cryolipolysis-why-lifescc__p">
                So if you are looking for a well-sculpted body line through cryolipolysis treatment in Hyderabad,
                Vijayawada, Visakhapatnam and Nellore, visit your nearest Lifescc clinic to get a free consultation
                service from our doctors.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={CRYO_PROCESS_STEPS}
          icons={CRYO_PROCESS_ICONS}
          tablistAriaLabel="Cryolipolysis process steps"
          headingId="cryolipolysis-process-heading"
        />

        <WeightLossConsultationStrip sourcePage="cryolipolysis" />
      </main>
      <SiteFooter />
    </div>
  )
}
