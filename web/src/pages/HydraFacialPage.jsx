import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import hydraFacialBanner from '../assets/8GbgAZky9y.jpg'
import hydraFacialInline from '../assets/1-1.jpg'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './HydraFacialPage.css'

/** Hydra Facial — skin resurfacing and hydration at Lifescc. */
export default function HydraFacialPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page hydra-facial-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form"
          aria-labelledby="hydra-facial-heading"
          style={{ backgroundImage: `url(${hydraFacialBanner})` }}
        >
          <div className="coolsculpting-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="hydra-facial-heading" className="cryolipolysis-hero-title">
              Hydra Facial
            </h1>
            <SkinHeroConsultForm sourcePage="hydra_facial" serviceLabel="Hydra Facial" />
          </div>
        </section>

        <section className="hydra-facial-method" aria-labelledby="hydra-facial-method-heading">
          <div className="hydra-facial-method__shell">
            <h2 id="hydra-facial-method-heading" className="hydra-facial-method__title">
              With Lifescc&apos;s Hydrafacial Treatment Method
            </h2>
            <p className="hydra-facial-method__p">
              By now, many of us might be wondering to know the difference between routine facials and medi facials. We
              are all more used to the habit of going to a salon once or twice in a week for facial purposes. But not
              many of us know about the type of ingredients they use or how safe those facials are to our skin. Hence to
              fill this latent gap and to offer a safer facial treatments method to the end customers, medi facials have
              come into existence. Unlike salon facials, medi facial treatment methods are performed under the strict
              supervision of an approved dermatologist, and the ingredients used in this are also based on vitamins,
              antioxidants and alpha hydroxyl acids. This will not only offer you an instant brightening effect but also
              help protect your skin from signs of early ageing in the long run without any side effects.
            </p>
          </div>
        </section>

        <section className="hydra-facial-split" aria-labelledby="hydra-facial-gender-heading">
          <div className="hydra-facial-split__band" style={{ backgroundImage: `url(${hydraFacialInline})` }}>
            <div className="coolsculpting-treatment__shell hydra-facial-split__shell">
              <div className="hydra-facial-split__layout">
                <div className="coolsculpting-treatment__copy hydra-facial-split__copy">
                  <h2 id="hydra-facial-gender-heading" className="coolsculpting-treatment__title">
                    Are these Hydrafacial only to women?
                  </h2>
                  <p className="coolsculpting-treatment__p">
                    Massive changes in the consumer lifestyle choices on one end and a spike in their income levels on
                    the other end have brought a broader shift in the consumer preferences towards using more natural beauty
                    care products and services in the recent past. Hydrafacial have now become immensely popular across all
                    age groups and genders. Now if we can see the statistics, men constitute for about more than 30% of
                    total consumers opting for Hydrafacial. This talks more about the changed scenario in the consumer
                    stereotype perceptions &amp; lifestyle changes came over in recent times.
                  </p>
                  <h3 className="cryolipolysis-treatment__subheading">How safe are Hydrafacial treatments?</h3>
                  <p className="coolsculpting-treatment__p">
                    Hydrafacial treatments offer not only instant but also long-lasting results. They are also safe on
                    all types of skin types and colours.
                  </p>
                  <h3 className="cryolipolysis-treatment__subheading">What are the benefits of Hydrafacial treatments?</h3>
                  <p className="coolsculpting-treatment__p">
                    Hydrafacial do deep skin cleansing and remove dead cells on the skin. They rejuvenate the skin without
                    causing damage to its protective layer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hydra-facial-why" aria-labelledby="hydra-facial-why-heading">
          <div className="hydra-facial-why__row">
            <div className="hydra-facial-why__copy-wrap">
              <div className="hydra-facial-why__copy-inner coolsculpting-treatment__copy">
                <h2 id="hydra-facial-why-heading" className="coolsculpting-treatment__title">
                  Why Lifescc
                </h2>
                <p className="coolsculpting-treatment__p">
                  Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading
                  health and wellness care brands in south India by pioneering several advanced, specialized, revolutionary
                  treatment methods to our clients and customers in their diverse medical needs simply and effectively.
                </p>
                <p className="coolsculpting-treatment__p">
                  Our state of the art facilities at our clinics complemented by our highly trained and certified
                  dermatologists skilled &amp; specialized in offering superior quality skin services has helped us in
                  gaining trust and confidence of our customers and in turn, enabled us to stand out in a sea of
                  look-alikes in big cities.
                </p>
                <p className="coolsculpting-treatment__p">
                  If you are looking forward to the best medi facial treatment in Hyderabad, Vizag, Vijayawada &amp;
                  Nellore. Please visit your nearest lifescc clinic for free body analysis and counselling, where our
                  experts clearly explain all the procedures to help you make an informed decision.
                </p>
                <button
                  type="button"
                  className="book-slot-btn py-2 book-slot-btn--primary rounded-pill hydra-facial-why__book-btn"
                  onClick={() => setBookSlotOpen(true)}
                >
                  Book free consultation
                </button>
              </div>
            </div>
            <div className="hydra-facial-why__visual">
              <div
                className="hydra-facial-why__photo"
                style={{ backgroundImage: `url(${hydraFacialBanner})` }}
                role="presentation"
              />
            </div>
          </div>
        </section>

        <section className="coolsculpting-page__book-appt" aria-labelledby="hydra-facial-book-strip-heading">
          <div
            className="contact-us-page-wrap contact-us-page-wrap--book coolsculpting-book-appt__band hydra-facial-book-strip"
            style={{ ['--contact-us-bg-image']: `url(${hydraFacialBanner})` }}
          >
            <div className="coolsculpting-book-appt__layout">
              <div className="coolsculpting-book-appt__form-col">
                <div className="page-main contact-us-page book-appointment-page">
                  <div className="book-appointment-page__shell coolsculpting-book-appt__form-shell">
                    <div className="book-appointment-page__form-inner">
                      <div className="contact-us-page__card book-appointment-page__form-card hydra-facial-book-strip__card">
                        <header className="contact-us-page__card-head">
                          <h2
                            id="hydra-facial-book-strip-heading"
                            className="contact-us-page__card-title book-appointment-page__form-title"
                          >
                            Book a consultation
                          </h2>
                          <p className="contact-us-page__card-sub">
                            Tell us how we can help with Hydra Facial — we&apos;ll get back to you shortly.
                          </p>
                        </header>
                        <SkinHeroConsultForm sourcePage="hydra_facial" serviceLabel="Hydra Facial" />
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

        <section className="hydra-facial-map" aria-label="Clinic location map">
          <iframe
            className="hydra-facial-map__iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60911.42549999086!2d78.40622647104448!3d17.41351071943386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb998cf8889263%3A0x2142257bc81507ff!2sGandhi%20Hospital!5e0!3m2!1sen!2sin!4v1777674153404!5m2!1sen!2sin"
            title="Google Map — Gandhi Hospital"
            height={300}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>
      <BookSlotModal open={bookSlotOpen} onClose={() => setBookSlotOpen(false)} />
      <SiteFooter />
    </div>
  )
}
