import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import nonhairBanner from '../assets/nonhair.png'
import home3Img from '../assets/home3.jpg'
import HairHeroConsultForm from '../components/HairHeroConsultForm.jsx'
import NonSurgicalHairBenefitsStrip from '../components/NonSurgicalHairBenefitsStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './NonSurgicalHairReplacementPage.css'

const NSHR_OUR_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: 'Consultation',
    body:
      'Start with an initial design consultation. Our experts analyse your hair type, colour and style to create a product which best suits you. Our experts will also take you through treatment basics in this stage.',
  },
  {
    title: 'Design',
    label: 'Design',
    body:
      'You can choose between readily available cost-effective hair systems or get a hair system custom built. If you choose the latter, our experts start the design of the hair system as per specifications to match your natural hair.',
  },
  {
    title: 'Schedule',
    label: 'Schedule',
    body:
      'Get started on our treatment with a consultation with one of our expert who will analyse and assess and schedule.',
  },
  {
    title: 'Bonding a Hair system',
    label: 'Bonding',
    body:
      'A thin and transparent membrane is applied to the scalp which is grafted with natural human hair. The next step bonding the membrane to the scalp using advanced adhesives and weaving it with the existing hair to create a natural look.',
  },
]

/** Non-surgical hair replacement — consultation-led hair restoration at Lifescc. */
export default function NonSurgicalHairReplacementPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page non-surgical-hair-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="non-surgical-hair-heading"
          style={{ backgroundImage: `url(${nonhairBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="non-surgical-hair-heading" className="cryolipolysis-hero-title">
              Non-surgical hair replacement
            </h1>
            <HairHeroConsultForm
              sourcePage="non_surgical_hair_replacement"
              serviceLabel="Non-surgical hair replacement"
            />
          </div>
        </section>

        <section className="coolsculpting-treatment nshr-split nshr-split--4-8" aria-labelledby="nshr-overview-heading">
          <div className="coolsculpting-treatment__shell">
            <div className="nshr-split__grid">
              <figure className="nshr-split__figure nshr-split__figure--sm">
                <img
                  src={home3Img}
                  alt="Non-surgical hair replacement consultation at Lifescc"
                  className="nshr-split__img"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="nshr-split__copy">
                <h2 id="nshr-overview-heading" className="coolsculpting-treatment__title">
                  Non Surgical Hair Replacement
                </h2>
                <p className="coolsculpting-treatment__p">
                  Non-surgical hair replacement is a safe and non-invasive method to treat your hair loss problems. Many
                  people misunderstand the treatment as just wearing a wig, toupee or a hairpiece. But with advancements in
                  medical science, hair systems too have evolved and have become sophisticated. Today hair systems create a
                  look which is very natural, easy and comfortable to wear. At our Life Slimming and Cosmetic Clinic in
                  Hyderabad, Vizag &amp; Vijayawada, we custom create hair systems using natural human hair which matches
                  your hair type and colour. Our hair systems are so natural that they seamlessly integrate with your
                  existing hair. You can comb, shampoo, dye or gel your hair without any concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        <NonSurgicalHairBenefitsStrip />

        <section className="coolsculpting-treatment nshr-who" aria-labelledby="nshr-who-heading">
          <div className="coolsculpting-treatment__shell nshr-who__shell">
            <div className="nshr-who__row nshr-who__row--8-4 nshr-who__row--reverse-mobile">
              <div className="nshr-who__lead-col">
                <h2 id="nshr-who-heading" className="coolsculpting-treatment__title">
                  Who Should Use Non-Surgical Hair Replacement
                </h2>
                <p className="coolsculpting-treatment__p">
                  Non-surgical hair loss treatment is the best option for people who find it difficult to stimulate hair
                  growth with the use of medications. It is also meant for people who develop baldness early on in their
                  twenties and who do not want to undergo surgical treatments like hair transplantation. To collect donor
                  hair for transplantation onto the bald area, the person seeking treatment has to allow the hair loss to
                  run its course.
                </p>
              </div>
              <div className="nshr-video">
                <div className="nshr-video__inner">
                  <iframe
                    title="Non-surgical hair replacement overview"
                    src="https://www.youtube.com/embed/9xWngpCUZkY?si=Fldew6JSySSXKAc8"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </div>
            <div className="nshr-who__row nshr-who__row--12 nshr-who__tail">
              <p className="coolsculpting-treatment__p">
                In all the scenarios referred to so far, non-surgical hair toupee offers a safe way to deal with hair
                loss. Since the grafts of the transplanted hair systems are created from human hair, it is not possible
                to detect the difference through sight or touch.
              </p>
              <p className="coolsculpting-treatment__p">
                You do not have to look middle-aged in your twenties due to hair loss. Opt for the entirely safe
                non-surgical restoration of your hair and regain your lost confidence.
              </p>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={NSHR_OUR_PROCESS_STEPS}
          icons={{}}
          tablistAriaLabel="Non-surgical hair replacement process steps"
          sectionTitle="Our process"
          headingId="nshr-our-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="nshr-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band nshr-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${nonhairBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card nshr-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="nshr-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with non-surgical hair replacement — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <HairHeroConsultForm
                          sourcePage="non_surgical_hair_replacement"
                          serviceLabel="Non-surgical hair replacement"
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
      <SiteFooter />
    </div>
  )
}
