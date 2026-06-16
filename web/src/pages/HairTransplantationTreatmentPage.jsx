import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import hairRestorationBanner from '../assets/hair-restoration.png'
import home3AltImg from '../assets/home3 (1).jpg'
import mesoAltImg from '../assets/meso1.png'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './HairTransplantationTreatmentPage.css'

const HTT_BENEFIT_LABELS = ['No Pills Required', 'No side Effects', 'Advanced Technology', 'Safe and Proven']

const HTT_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consultation',
    body:
      'Our expert will examine your scalp to analyze the required areas that need the treatment and further on discuss the complete procedure with you. Blood pressure of the patient is taken while the patient is relaxing, and an anaesthetic is given.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule.',
  },
  {
    title: 'FUE',
    label: 'FUE',
    body:
      'The doctor will insert the graphs with tweezers along with his team. The first session will take about 6 hours to complete, and the patient is bandaged.',
  },
  {
    title: 'FUE Treatment',
    label: 'FUE Treatment',
    body:
      'A revolutionary solution for hair transplantation is the Follicular Unit Extraction (FUE). Hair follicles are harvested in this procedure. Unlike the traditional methods of hair transplant involving stripping of skin, this is a much easier way by isolating and extracting hair follicles. Follicles are removed with a 1 mm complete specially crafted precision jeweller’s forceps.',
  },
  {
    title: 'Monitoring Hair Growth',
    label: 'Monitoring',
    body:
      'Our experts will monitor you continually. New hair growth can be seen in a matter of weeks. After a full hair growth cycle, around 9 months, a complete restoration is achieved.',
  },
]

/** Hair transplantation treatment — FUE and stem cell options at Lifescc. */
export default function HairTransplantationTreatmentPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page hair-transplantation-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="hair-transplantation-heading"
          style={{ backgroundImage: `url(${hairRestorationBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="hair-transplantation-heading" className="cryolipolysis-hero-title">
              Hair transplantation treatment
            </h1>
            <HairHeroConsultForm
              sourcePage="hair_transplantation_treatment"
              serviceLabel="Hair transplantation treatment"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment htt-intro" aria-labelledby="htt-intro-heading">
          <div className="coolsculpting-treatment__shell htt-intro__shell">
            <div className="htt-intro__row htt-intro__row--8-4 htt-intro__row--reverse-mobile">
              <div className="htt-intro__copy">
                <h2 id="htt-intro-heading" className="coolsculpting-treatment__title">
                  Hair Transplant
                </h2>
                <p className="coolsculpting-treatment__p">
                  Hair loss has become a significant stress factor for people all across the globe, as it will negatively
                  impact one&apos;s self-image and confidence. Unhealthy food habits, sedentary lifestyle, mental stress,
                  unprecedented growth in pollution are becoming increasingly responsible for severe hair loss, especially
                  among the people who are in their early thirties and mid-twenties. At the same time, the number of
                  people seeking hair fall treatment has also been surging in recent years.
                </p>
              </div>
              <figure className="htt-intro__figure">
                <div className="htt-intro__figure-inner">
                  <img
                    src={home3AltImg}
                    alt="Hair transplant consultation at Lifescc"
                    className="htt-intro__img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </div>
            <div className="htt-intro__tail">
              <p className="coolsculpting-treatment__p">
                However, with the latest technological advancement in the cosmetic treatment landscape, has spurred the
                growth to the demand for novel hair transplantation treatment methods in recent years, as more people are
                looking forward to a relatively permanent solution for their hair fall problems.
              </p>
              <p className="coolsculpting-treatment__p">
                At lifescc, we offer both stem cells treatment therapy &amp; follicular unit extraction treatments for both
                men and women looking for safe and long-lasting results through hair transplantation treatment methods.
              </p>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip benefitLabels={HTT_BENEFIT_LABELS} />

        <section className="coolsculpting-treatment htt-fue" aria-labelledby="htt-fue-heading">
          <div className="coolsculpting-treatment__shell htt-fue__shell">
            <div className="htt-fue__row htt-fue__row--8-4 htt-fue__row--reverse-mobile">
              <div className="htt-fue__copy">
                <h2 id="htt-fue-heading" className="coolsculpting-treatment__title">
                  What is FUE procedure?
                </h2>
                <p className="coolsculpting-treatment__p">
                  FUE (Follicular unit extraction) is one of the most advanced, tested and standardized treatment
                  methodof hair transplantation, when compared to other forms of traditional hair transplantation like FUT
                  etc.
                </p>
              </div>
              <div className="htt-fue__video">
                <div className="htt-fue__video-inner">
                  <iframe
                    title="FUE hair transplantation procedure overview"
                    src="https://www.youtube.com/embed/qlbDO_XgBCA?si=CUhLefS8QTmzuaV4"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
            <div className="htt-fue__tail">
              <h3 className="htt-fue__subheading">How this works :</h3>
              <p className="coolsculpting-treatment__p">
                In this method, the doctor extracts the follicle units of hair from one donor area of your head to
                another. The hair follicles extracted are usually taken from the back of the neck with a specialized
                extraction instrument less than 1 mm in diameter, later these follicular hair units are transplanted in
                the balded areas on the scalp.
              </p>
              <p className="coolsculpting-treatment__p">
                The fue procedure gives good results for those who have a tight scalp and it will also be an ideal
                treatment procedure for those, who have already gone through FUT method but with little or no success.
              </p>
            </div>
          </div>
        </section>

        <section className="coolsculpting-treatment htt-dual" aria-labelledby="htt-stem-heading">
          <div className="coolsculpting-treatment__shell htt-dual__shell">
            <div className="htt-dual__grid">
              <div className="htt-dual__col">
                <h2 id="htt-stem-heading" className="coolsculpting-treatment__title">
                  B.What is stem cell therapy treatment:
                </h2>
                <p className="coolsculpting-treatment__p">
                  Stem cells are the unique human cells that have the potential to develop into other types of cells in
                  the body. Stem cells are used to replace or regenerate damaged tissues. They are exclusively used to
                  recreate your hairline and growth pattern to give them a natural-looking result.
                </p>
                <p className="coolsculpting-treatment__p">
                  Stem cell therapy is one of the most efficient, non-surgical treatment methods used to stimulate and
                  promote new hair follicles on the bald portions of the scalp.
                </p>
                <h3 className="htt-dual__subheading">How this works :</h3>
                <p className="coolsculpting-treatment__p">
                  Unlike other traditional methods of hair transplantation. Stem cell therapy doesn&apos;t involve the usage
                  of local anaesthesia or scars. It can be explained in two stages. In the first stage, the doctors will
                  extract a few hair follicles from the donor area of your scalp to collect stem cells.
                </p>
                <p className="coolsculpting-treatment__p">
                  Later the hair follicles are processed and cultured in the lab to recreate multiple numbers of hair
                  follicles through the usage of stem cells.
                </p>
                <p className="coolsculpting-treatment__p">
                  In the second stage, the processed new hair follicles are inserted on the balded portions of the scalp
                  that help repair damaged, broken hair follicles and help stimulate and grow new hair follicles within a
                  short period usually within a time frame of 3 to 6 months.
                </p>
              </div>
              <div className="htt-dual__col">
                <h2 className="coolsculpting-treatment__title">Why Choose Lifescc For Hair Transplantation Treatment?</h2>
                <p className="coolsculpting-treatment__p">
                  We are south India&apos;s leading hair transplantation clinics with over 50,000 treatments delivered since
                  2009. Our highly trained practitioners at Lifescc will always help to offer you a safe and effective
                  treatment method tailored to treat your hair problems from the root level. We follow strict medical
                  protocols to make sure our treatments methods meet the required safety standards.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to the best stem cell therapy or fue hair transplant in Hyderabad, Vizag,
                  Vijayawada, Nellore. Please visit your nearest lifescc clinic to discuss an individual and more
                  customized treatment plans with our experts.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill htt-dual__cta"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Free Consultation
                </button>
                <p className="coolsculpting-treatment__p">
                  Our other popular treatment services at lifescc include &ldquo;Zimmer&rdquo;, &ldquo;Cryolipolysis&rdquo;, and
                  &ldquo;Inch Loss &amp; Figure Correction&rdquo; treatments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={HTT_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Hair transplantation treatment process steps"
          sectionTitle="Our process"
          headingId="htt-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="htt-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band htt-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${hairRestorationBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card htt-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="htt-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with hair transplantation treatment — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm
                          sourcePage="hair_transplantation_treatment"
                          serviceLabel="Hair transplantation treatment"
                        />
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
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
      <SiteFooter />
    </div>
  )
}
