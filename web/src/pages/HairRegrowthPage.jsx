import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import hairRegrowthBanner from '../assets/hair-regrowth.png'
import hair1Img from '../assets/hair1.png'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './HairRegrowthPage.css'

const HRG_BENEFIT_LABELS = ['No Pills Required', 'No side Effects', 'Advanced Technology', 'Safe and Proven']

const HRG_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consultation',
    body:
      'Our expert will assess your scalp, determine the hair loss and analyze the areas that need to be focused on, and discuss the stem cell therapy procedure with you.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule.',
  },
  {
    title: 'Collecting',
    label: 'Collecting',
    body:
      'Stem cells are collected from the bone marrow through informed consent. Donated cells can also be used for this procedure.',
  },
  {
    title: 'Introducing the Stem Cells',
    label: 'Stem cells',
    body:
      'Stem cells are introduced to the scalp, in the affected areas. These cells stimulate hair growth and even work on the follicles that have been long dead.',
  },
  {
    title: 'Monitoring Hair Growth',
    label: 'Monitoring',
    body:
      'Our experts will monitor you continually. New hair growth can be seen in a matter of weeks. After a full hair growth cycle, around 9 months, a complete restoration is achieved.',
  },
]

/** Hair regrowth — stem cell and advanced hair restoration at Lifescc. */
export default function HairRegrowthPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page hair-regrowth-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="hair-regrowth-heading"
          style={{ backgroundImage: `url(${hairRegrowthBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="hair-regrowth-heading" className="cryolipolysis-hero-title">
              Hair regrowth
            </h1>
            <HairHeroConsultForm sourcePage="hair_regrowth" serviceLabel="Hair regrowth" />
          </div>
        </section>

        <section className="coolsculpting-treatment hrg-split hrg-split--4-8" aria-labelledby="hrg-best-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="hrg-split__grid">
              <figure className="hrg-split__figure">
                <img
                  src={hair1Img}
                  alt="Hair regrowth treatment at Lifescc"
                  className="hrg-split__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="hrg-split__copy">
                <h2 id="hrg-best-heading" className="coolsculpting-treatment__title">
                  Best Hair Regrowth Treatment
                </h2>
                <p className="coolsculpting-treatment__p">
                  Hair loss can cause a lot of worry and frustration. It can affect your appearance, leading to low
                  self-esteem. At Life Slimming and Cosmetic Clinic, we offer professional treatments like stem cell
                  therapy for hair regrowth. Stem cells are inactive and developing cells that can multiply rapidly. Not
                  many hair regrowth clinics in Hyderabad have the expertise and infrastructure to offer this treatment,
                  which has a high success rate. If you wish to get the best hair regrowth treatment in Hyderabad, Vizag,
                  Vijayawada &amp; Nellore. Visit our clinic today. You will be amazed by the results!
                </p>
              </div>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip benefitLabels={HRG_BENEFIT_LABELS} />

        <section className="coolsculpting-treatment hrg-worry" aria-labelledby="hrg-worry-heading">
          <div className="coolsculpting-treatment__shell hrg-worry__shell">
            <div className="hrg-worry__row hrg-worry__row--12">
              <h2 id="hrg-worry-heading" className="coolsculpting-treatment__title">
                Eliminate Your Hair Loss Worries
              </h2>
            </div>
            <div className="hrg-worry__row hrg-worry__row--8-4 hrg-worry__row--reverse-mobile">
              <div className="hrg-worry__lead-col">
                <p className="coolsculpting-treatment__p">
                  Many hair growth treatments are expensive and unsuccessful. Individuals give up after seeing temporary
                  or no results. In some other cases, people try various methods such as topical hair oils and medication.
                  However, the results are not very encouraging. The hair regrowth treatment carried out at Life Slimming,
                  and Cosmetic Clinic is all about using advanced and trusted technology to restore your confidence and
                  bring lasting results. If you had no luck with other hair growth treatment methods or oil, do not worry!
                  Consider the stem cell therapy hair loss treatment – it has shown impressive results in several of our
                  clients.
                </p>
              </div>
              <div className="hrg-video">
                <div className="hrg-video__inner">
                  <iframe
                    title="Hair regrowth and stem cell therapy overview"
                    src="https://www.youtube.com/embed/9xWngpCUZkY?si=_l5dh6WaVBu2lS6K"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
            <div className="hrg-worry__row hrg-worry__row--12 hrg-worry__tail">
              <p className="coolsculpting-treatment__p">
                We use state-of-the-art equipment and the best facilities available for stem cell therapy. Our extensive
                experience allows us to perform the procedure flawlessly. When you choose our hair growth clinic, you can
                eliminate all your hair loss concerns. We combine our expertise and experience to give our clients the best
                results. Visit us today and get back on the path to self-confidence.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={HRG_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Hair regrowth treatment process steps"
          sectionTitle="Our process"
          headingId="hrg-our-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="hrg-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band hrg-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${hairRegrowthBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card hrg-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="hrg-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with hair regrowth — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm sourcePage="hair_regrowth" serviceLabel="Hair regrowth" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="coolsculpting-book-appt__visual-col">
                <div
                  className="book-appointment-page__photo coolsculpting-book-appt__photo-fullbleed"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
