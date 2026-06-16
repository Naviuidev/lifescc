import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import heroBg from '../assets/cryoImg.png'
import hifuImg from '../assets/hifuImg.png'
import icon1 from '../assets/icon1.png'
import icon2 from '../assets/icon2.png'
import icon3 from '../assets/icon3.png'
import icon4 from '../assets/icon4.png'
import icon5 from '../assets/icon5.png'
import CryolipolysisHeroConsultForm from '../components/CryolipolysisHeroConsultForm.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import WeightLossConsultationStrip from '../components/WeightLossConsultationStrip.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './HifuLiposonixPage.css'

const HIFU_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consult',
    body:
      'A consultation session with our experts will identify your needs and the areas to target. We also assess your skin and take you through the Liposonix fat reduction procedure in detail and answer your queries.',
    icon: 'icon1',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule.',
    icon: 'icon2',
  },
  {
    title: 'Treatment',
    label: 'Treat',
    body:
      'During the treatment, the head of the Liposonix system is moved around the targeted area to deliver the Ultrasound energy. A feeling of warmth and mild prickling sensation is usually felt.',
    icon: 'icon3',
  },
  {
    title: 'Sessions',
    label: 'Sessions',
    body:
      'The session generally lasts about 30 minutes to an hour depending on the area being treated. A single session of HIFU Lipo weight loss treatment is enough to get visible results. Multiple sessions may be required based on individual requirements.',
    icon: 'icon4',
  },
  {
    title: 'Fat removal',
    label: 'Results',
    body:
      'Over the next 8 to 12 weeks, the destroyed fat cells during the procedure are slowly processed and removed by the body’s healing and elimination process.',
    icon: 'icon5',
  },
]

const HIFU_PROCESS_ICONS = {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
}

/** HIFU Liposonix — non-invasive ultrasound body contouring at Lifescc. */
export default function HifuLiposonixPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page hifu-liposonix-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="hifu-liposonix-heading"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="hifu-liposonix-heading" className="cryolipolysis-hero-title">
              HIFU Liposonix
            </h1>
            <CryolipolysisHeroConsultForm
              sourcePage="hifu_liposonix"
              treatmentValue="hifu_liposonix"
              treatmentLabel="HIFU Liposonix"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment hifu-liposonix-intro" aria-labelledby="hifu-intro-heading">
          <div className="coolsculpting-treatment__shell">
            <h2 id="hifu-intro-heading" className="hifu-liposonix-intro__title">
              Hifu liposonix Treatment in Hyderabad.
            </h2>
            <p className="coolsculpting-treatment__p">
              LipoSonix is an advanced non-invasive weight loss treatment used for body contouring. This procedure
              targets the fat cells by focusing high intensity, high-frequency ultrasound energy on a targeted area of
              the body, causing the temperature to rise above 56° C in the subcutaneous fat layer beneath the skin. The
              damaged fat cells are then naturally processed and evacuated from the body within a few weeks. HIFU
              Liposonix body contouring treatment at lifescc has been proven to be a completely safe procedure for
              getting rid of stubborn fat in your abdomen, flanks, hips, thighs, and buttocks. If you are looking for the
              best HIFU Liposonix treatment in Hyderabad. Visit lifescc today!
            </p>
            <h3 className="cryolipolysis-treatment__subheading">How does it work?</h3>
            <p className="coolsculpting-treatment__p">
              Under this treatment, a highly focused beam of ultrasound energy waves is sent into the skin&apos;s
              various layers to precisely target and kill fat cells located in those areas. The high-frequency
              ultrasound waves result in heating under the skin, effectively destroying all the fat cells at the fastest
              possible time. And unlike other fat reduction treatment methods such as liposuction, HIFU Liposonix offers a
              pain-free and more effective way of treating fat cells with zero downtime. It also helps in skin tightening
              at the treated area simultaneously without any side effects.
            </p>
            <h3 className="cryolipolysis-treatment__subheading">Who are eligible for this treatment?</h3>
            <p className="coolsculpting-treatment__p">
              Liposonix treatment is not an ideal treatment for everyone. People near their ideal weight or whose BMI is
              below 30 are more likely to get optimum results from this treatment.
            </p>
          </div>
        </section>

        <CryolipolysisTrustStrip />

        <section className="coolsculpting-treatment hifu-liposonix-why" aria-labelledby="hifu-why-lifescc-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="coolsculpting-treatment__grid">
              <div className="coolsculpting-treatment__copy">
                <h2 id="hifu-why-lifescc-heading" className="coolsculpting-treatment__title">
                  Why Lifescc?
                </h2>
                <p className="coolsculpting-treatment__p">
                  Over the past 10 years, Life Slimming and Cosmetic Clinic has come up with several revolutionary treatment
                  methods to offer exceptional quality health care for people in their diverse medical needs in a simple
                  and effective manner. Our state of the art facilities at our clinics complemented by our highly trained
                  and certified clinical technicians &amp; therapists has helped us to stand out in a sea of look-alikes in
                  big cities.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to noticeable and long-lasting results through HIFU Liposonix treatment in
                  Hyderabad, Nellore, Vizag and Vijayawada.
                </p>
                <p className="coolsculpting-treatment__p">
                  Visit your nearest lifescc clinic to know more about us and our treatment methods and get a free
                  consultation from our team of doctors.
                </p>
                <h3 className="cryolipolysis-treatment__subheading">What results do I get after this treatment?</h3>
                <p className="coolsculpting-treatment__p">
                  There is a misconception among the people that Liposonix is a weight loss treatment procedure. But it is
                  only a fat reduction treatment method, as it only helps reduce a few inches of fat in the problem areas.
                  It has also revealed from various studies that Liposonix can bring an average fat reduction up to 1.8
                  inches or 4.6 cm after one single session. People who go through HIFU Liposonix treatment can witness
                  results within 2-4 months post-treatment.
                </p>
              </div>
              <figure className="coolsculpting-treatment__figure">
                <img
                  src={hifuImg}
                  alt="HIFU Liposonix treatment at Life Slimming and Cosmetic Clinic"
                  className="coolsculpting-treatment__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={HIFU_PROCESS_STEPS}
          icons={HIFU_PROCESS_ICONS}
          tablistAriaLabel="HIFU Liposonix process steps"
          headingId="hifu-liposonix-process-heading"
        />

        <WeightLossConsultationStrip sourcePage="hifu_liposonix" />
      </main>
      <SiteFooter />
    </div>
  )
}
