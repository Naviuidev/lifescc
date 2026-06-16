import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import CryolipolysisTrustStrip from '../components/CryolipolysisTrustStrip.jsx'
import TreatmentProcessTabs from '../components/TreatmentProcessTabs.jsx'
import banScar from '../assets/ban-scar.png'
import acanImg from '../assets/acan.png'
import s1 from '../assets/s1.png'
import s2 from '../assets/s2.png'
import s3 from '../assets/s3.png'
import s4 from '../assets/s4.png'
import s5 from '../assets/s5.png'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './AcneScarPage.css'

const PROCESS_ICONS = { s1, s2, s3, s4, s5 }

const ACNE_SCAR_TRUST_LABELS = ['FDA Approved', 'No Downtime', 'Advanced Technology', 'Safe and Effective']

const ACNE_SCAR_PROCESS_STEPS = [
  {
    title: 'Consultation',
    label: '1',
    icon: 's1',
    body:
      'When you arrive for your first consultation, our expert dermatologists conduct a thorough skin and health analysis to determine the severity of scarring and the underlying causes. Post-evaluation, our skin specialists will suggest a personalized treatment plan.',
  },
  {
    title: 'Preparation',
    label: '2',
    icon: 's2',
    body:
      'The skin is prepped for treatment by performing mild cleansing and gentle exfoliation to remove all the dirt and impurities on the surface. The skin may be further treated with special techniques depending upon the type of treatment being performed.',
  },
  {
    title: 'Schedule',
    label: '3',
    icon: 's3',
    body:
      'Get started on our treatment with a consultation with one of our experts who will analyse and assess and schedule.',
  },
  {
    title: 'Treatment',
    label: '4',
    icon: 's4',
    body:
      'We offer a range of advanced treatment options to treat different types of acne and acne scars. Treatments like derma roller, pixel resurfacing, platelet-rich plasma (PRP), subcision, excision, punch elevation and peels are performed by our expert dermatologists to lessen the appearance of scars.',
  },
  {
    title: 'Sessions',
    label: '5',
    icon: 's5',
    body:
      'Depending on the skin type, sensitivity, and the extent of scarring the number of sessions are determined. The approximate number of sessions that will be needed to see a noticeable difference is usually intimated during the consultation itself.',
  },
]

/** Laser acne scar removal — Lifescc. */
export default function AcneScarPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page acnescar-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form acnescar-banner-hero"
          aria-labelledby="acnescar-heading"
          style={{ backgroundImage: `url(${banScar})` }}
        >
          <div className="coolsculpting-hero__scrim acnescar-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="acnescar-heading" className="cryolipolysis-hero-title">
              Acne Scar
            </h1>
            <SkinHeroConsultForm sourcePage="acne_scar" serviceLabel="Acne Scar" />
          </div>
        </section>

        <section className="acnescar-intro" aria-labelledby="acnescar-intro-heading">
          <div className="contact-us-page-wrap acnescar-intro__band">
            <div className="acnescar-intro__inner">
              <h2 id="acnescar-intro-heading" className="acnescar-intro__title">
                Laser Acne Scars Removal Treatment
              </h2>
              <p className="acnescar-intro__p">
                Acne is a common skin disease that affects an estimated 85% of the population across the world at some
                point in their lives. It is a chronic, inflammatory skin condition that causes spots and pimples on the
                face, shoulders, back, neck chest and upper arms.
              </p>
              <p className="acnescar-intro__p">
                Acne scars/pimples can be equally seen both in men/women. They commonly occur during puberty in women;
                they may occur at any age. Acne scars are not dangerous, but they can leave skin scars, they also show a
                significant impact on the confidence and self-esteem of that individual.
              </p>
            </div>
          </div>
        </section>

        <CryolipolysisTrustStrip labels={ACNE_SCAR_TRUST_LABELS} />

        <section className="acnescar-treatments" aria-labelledby="acnescar-treatments-heading">
          <div className="acnescar-treatments__shell">
            <div className="acnescar-treatments__top-row">
              <div className="acnescar-treatments__copy coolsculpting-treatment__copy">
                <h2 id="acnescar-treatments-heading" className="acnescar-treatments__h2">
                  Acne scar treatments at lifescc:
                </h2>
                <p className="coolsculpting-treatment__p">
                  We offer a range of in-clinic treatment options ranging from peels to acne surgeries to provide the
                  best and effective results at affordable prices and the short time.
                </p>
                <h3 className="acnescar-treatments__h3">A. Pixel Laser Resurfacing Treatment Method</h3>
                <p className="coolsculpting-treatment__p">
                  Laser resurfacing is a proven skin resurfacing treatment method that makes use of lasers to effectively
                  reduce wrinkles, age circles, acne scars on the skin by removing layers of the skin. It works by
                  directing a short pulsating beam of light energy on the affected skin removing skin layer by layer.
                </p>
              </div>
              <figure className="acnescar-treatments__figure">
                <img src={acanImg} alt="Acne scar laser treatment at Lifescc" className="acnescar-treatments__img" loading="lazy" decoding="async" />
              </figure>
            </div>
            <div className="acnescar-treatments__full coolsculpting-treatment__copy">
              <h3 className="acnescar-treatments__h3">Laser resurfacing can be done by making use of two types of lasers:</h3>
              <p className="coolsculpting-treatment__p">
                <strong>Ablative lasers:</strong> Ablative lasers are wounding lasers; they remove the skin layer by
                layer. Co2 laser and erbium laser come under this category.
              </p>
              <p className="coolsculpting-treatment__p">
                <strong>Non-ablative lasers:</strong> Non-ablative lasers are not wounding lasers; they stimulate
                collagen growth in the skin and help in naturally tightening underlying skin. Unlike ablative lasers,
                treatments that involve non-ablative lasers are usually non-invasive and come with zero downtime allowing
                people to resume their day to day activities without taking any time gap.
              </p>
              <p className="coolsculpting-treatment__p">
                Pixel laser resurfacing helps in improving the quality and texture of the skin, while also stimulating
                the collagen production in the body with no downtime, unlike classical resurfacing.
              </p>
              <h3 className="acnescar-treatments__h3">B. Chemical Peel Treatment Method:</h3>
              <p className="coolsculpting-treatment__p">
                Chemical peel treatment is another most sought after treatment method that can be effectively used to
                treat acne/scars on the skin. As a part of this treatment method, a concentrated form of chemicals is
                applied to remove scarred skin cells allowing healthy cells to grow in their place.
              </p>
            </div>
          </div>
        </section>

        <section className="acnescar-closing" aria-labelledby="acnescar-closing-heading">
          <div className="contact-us-page-wrap acnescar-closing__band">
            <div className="acnescar-closing__shell coolsculpting-treatment__copy">
              <h2 id="acnescar-closing-heading" className="visually-hidden">
                Why choose Lifescc for acne scar treatment
              </h2>
              <p className="coolsculpting-treatment__p">
                They offer a smoother skin by exfoliating dead cells from the skin and also help to even out skin tone
                without any side effects. Different types of chemical peels exist, and each has its benefits in treating
                acne scars. However, one must also have to note that chemical peels may not be able to provide a permanent
                and lasting solution for severe acne scars.
              </p>
              <p className="coolsculpting-treatment__p">
                Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading health
                and wellness care brands in south India by pioneering several advanced, specialized, revolutionary treatment
                methods to our clients and customers in their diverse medical needs simply and effectively.
              </p>
              <p className="coolsculpting-treatment__p">
                Our state of the art facilities at our clinics complemented by our highly trained and certified
                dermatologists skilled &amp; specialized in offering superior quality skincare services helped us in gaining
                the trust and confidence of our customers. Our authentic, value-driven services we offer to them gave us an
                edge to stand out in a sea of look-alikes in big cities.
              </p>
              <p className="coolsculpting-treatment__p">
                At lifescc, our extensive range of acne/pimples treatment methods perfectly addresses both acne breakouts
                and the factors that make skin acne-prone. All our treatments are done under the strict supervision of
                specialist doctors and come with zero downtime, which makes them more suitable for working professionals as
                they cannot devote more time for treatment sessions. If you are looking forward to the best acne scar
                treatment in Hyderabad, Vizag, Vijayawada &amp; Nellore. Please visit your nearest lifescc clinic to discuss
                customized treatment options with our experts. Our other popular treatment services at lifescc include{' '}
                <Link to="/zimmer">&quot;Zimmer&quot;</Link>, <Link to="/weight-loss-treatment">&quot;Weightloss&quot;</Link>,{' '}
                <Link to="/cryolipolysis">&quot;Cryolipolysis&quot;</Link>, <Link to="/inch-loss">&quot;Inch Loss&quot;</Link>,{' '}
                <Link to="/figure-correction">&quot;Figure Correction&quot;</Link> treatments &amp; many more.
              </p>
              <button
                type="button"
                className="book-slot-btn py-2 book-slot-btn--primary rounded-pill acnescar-closing__cta"
                onClick={() => setBookSlotOpen(true)}
              >
                Book a free slot
              </button>
            </div>
          </div>
        </section>

        <TreatmentProcessTabs
          steps={ACNE_SCAR_PROCESS_STEPS}
          icons={PROCESS_ICONS}
          tablistAriaLabel="Acne scar removal process steps"
          sectionTitle="Our process"
          headingId="acnescar-process-heading"
        />

        <section className="coolsculpting-page__book-appt" aria-labelledby="acnescar-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band acnescar-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${banScar})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card acnescar-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="acnescar-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with acne scars — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="acne_scar" serviceLabel="Acne Scar" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="coolsculpting-book-appt__visual-col">
                <div className="book-appointment-page__photo coolsculpting-book-appt__photo-fullbleed" aria-hidden="true" />
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
