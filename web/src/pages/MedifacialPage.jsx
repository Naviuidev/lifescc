import { useCallback, useId, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import BookSlotModal from '../components/BookSlotModal.jsx'
import SkinHeroConsultForm from '../components/SkinHeroConsultForm.jsx'
import facialImg from '../assets/facial.png'
import ss1sImg from '../assets/ss1s.jpg'
import t1Img from '../assets/t1.jpg'
import t2Img from '../assets/t2.jpg'
import t3Img from '../assets/t3.jpg'
import t4Img from '../assets/t4.jpg'
import t5Img from '../assets/t5.jpg'
import t6Img from '../assets/t6.jpg'
import './HomePage.css'
import './ContactUsPage.css'
import './BookAppointmentPage.css'
import './CoolsculptingPage.css'
import './CryolipolysisPage.css'
import './MedifacialPage.css'

const MEDIFACIAL_ACCORDION_ITEMS = [
  {
    question: 'How safe are medi facial treatments?',
    answer:
      'Medi facial treatments offer not only instant but also long-lasting results. They are also safe on all types of skin types and colours.',
  },
  {
    question: 'What are the benefits of medi facial treatments?',
    answer:
      'Medi facials do deep skin cleansing and remove dead cells on the skin. They rejuvenate the skin without causing damage to its protective layer.',
  },
]

const MEDIFACIAL_BENEFIT_CARDS = [
  {
    num: 1,
    title: 'Reduce Fine Lines',
    body: 'Reduces fine lines and wrinkles caused by sun damage, ageing and family history.',
    image: t1Img,
  },
  {
    num: 2,
    title: 'Improve Texture And Tone',
    body: 'Treats acne and reduces the appearance of mild scarring.',
    image: t2Img,
  },
  {
    num: 3,
    title: 'Reduce Pore Size',
    body: 'Improves the look, feel and brightness of tired skin.',
    image: t3Img,
  },
  {
    num: 4,
    title: 'Prevents Bacterial Breakouts',
    body:
      'Medi-facial such as an anti-acne facial helps eradicate the bacteria that cause inflammation during breakouts with the help of LED light.',
    image: t4Img,
  },
  {
    num: 5,
    title: 'Reduce Fine Lines',
    body: 'Reduces fine lines and wrinkles caused by sun damage, ageing and family history.',
    image: t5Img,
  },
  {
    num: 6,
    title: 'Improve Texture And Tone',
    body: 'Treats acne and reduces the appearance of mild scarring.',
    image: t6Img,
  },
]

const CARDS_PER_SLIDE = 3
const benefitSlides = [
  MEDIFACIAL_BENEFIT_CARDS.slice(0, CARDS_PER_SLIDE),
  MEDIFACIAL_BENEFIT_CARDS.slice(CARDS_PER_SLIDE, CARDS_PER_SLIDE * 2),
]

function MedifacialBenefitsSlider() {
  const slideCount = benefitSlides.length
  const [slideIdx, setSlideIdx] = useState(0)

  const goPrev = useCallback(() => {
    setSlideIdx((i) => (i - 1 + slideCount) % slideCount)
  }, [slideCount])

  const goNext = useCallback(() => {
    setSlideIdx((i) => (i + 1) % slideCount)
  }, [slideCount])

  const slideWidthPct = 100 / slideCount

  return (
    <section
      className="medifacial-benefits"
      aria-labelledby="medifacial-benefits-heading"
      aria-roledescription="carousel"
      aria-label="Medi facial benefits"
    >
      <div className="medifacial-benefits__shell">
        <h2 id="medifacial-benefits-heading" className="medifacial-benefits__title">
          Medi facial benefits
        </h2>
        <div className="medifacial-benefits__viewport">
          <div
            className="medifacial-benefits__track"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translateX(-${(slideIdx * 100) / slideCount}%)`,
            }}
          >
            {benefitSlides.map((cards, si) => (
              <div
                key={si}
                className="medifacial-benefits__slide"
                style={{ width: `${slideWidthPct}%` }}
                aria-hidden={slideIdx !== si}
              >
                <div className="medifacial-benefits__grid">
                  {cards.map((card) => (
                    <article key={card.num} className="medifacial-benefits__card">
                      <div className="medifacial-benefits__card-visual">
                        <img src={card.image} alt="" className="medifacial-benefits__card-img" loading="lazy" />
                        <span className="medifacial-benefits__card-num" aria-hidden="true">
                          {card.num}
                        </span>
                      </div>
                      <h3 className="medifacial-benefits__card-title">{card.title}</h3>
                      <p className="medifacial-benefits__card-body">{card.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="medifacial-benefits__controls">
          <button
            type="button"
            className="medifacial-benefits__btn medifacial-benefits__btn--prev"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="medifacial-benefits__dots" role="tablist" aria-label="Slide">
            {benefitSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={slideIdx === i}
                aria-label={`Slide ${i + 1} of ${slideCount}`}
                className={`medifacial-benefits__dot${slideIdx === i ? ' medifacial-benefits__dot--active' : ''}`}
                onClick={() => setSlideIdx(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="medifacial-benefits__btn medifacial-benefits__btn--next"
            onClick={goNext}
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

function MedifacialAccordions() {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="medifacial-accordions" role="region" aria-label="Medi facial frequently asked questions">
      {MEDIFACIAL_ACCORDION_ITEMS.map((item, index) => {
        const isOpen = openIndex === index
        const panelId = `${baseId}-medifacial-acc-panel-${index + 1}`
        const buttonId = `${baseId}-medifacial-acc-btn-${index + 1}`
        return (
          <article
            key={index}
            className={
              isOpen ? 'medifacial-acc__item medifacial-acc__item--open' : 'medifacial-acc__item'
            }
          >
            <h3 className="medifacial-acc__heading">
              <button
                id={buttonId}
                type="button"
                className="medifacial-acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex((curr) => (curr === index ? -1 : index))}
              >
                <span className="medifacial-acc__question">{item.question}</span>
                <span className="medifacial-acc__chevron" aria-hidden="true">
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
              className="medifacial-acc__panel-wrap"
              aria-hidden={!isOpen}
            >
              <div className="medifacial-acc__panel">
                <p className="medifacial-acc__answer">{item.answer}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

/** Medi facial — dermatologist-led medi facials at Lifescc. */
export default function MedifacialPage() {
  const [bookSlotOpen, setBookSlotOpen] = useState(false)

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main coolsculpting-page cryolipolysis-page medifacial-page">
        <section
          className="coolsculpting-hero coolsculpting-hero--with-inline-form medifacial-banner-hero"
          aria-labelledby="medifacial-heading"
          style={{ backgroundImage: `url(${facialImg})` }}
        >
          <div className="coolsculpting-hero__scrim medifacial-banner-hero__scrim" aria-hidden />
          <div className="coolsculpting-hero__inner">
            <h1 id="medifacial-heading" className="cryolipolysis-hero-title">
              Medifacial
            </h1>
            <SkinHeroConsultForm sourcePage="medifacial" serviceLabel="Medifacial" />
          </div>
        </section>

        <section className="medifacial-method" aria-labelledby="medifacial-method-heading">
          <div className="medifacial-method__shell">
            <h2 id="medifacial-method-heading" className="medifacial-method__title">
              With Lifescc&apos;s Medi Facial Treatment Method
            </h2>
            <p className="medifacial-method__p">
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

        <section className="medifacial-split" aria-labelledby="medifacial-gender-heading">
          <div className="medifacial-split__row">
            <div className="medifacial-split__visual">
              <img
                src={ss1sImg}
                alt="Medi facial treatment"
                className="medifacial-split__img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="medifacial-split__copy-wrap">
              <div className="medifacial-split__copy">
                <h2 id="medifacial-gender-heading" className="coolsculpting-treatment__title">
                  Are these medi facials only to women?
                </h2>
                <p className="coolsculpting-treatment__p">
                  Massive changes in the consumer lifestyle choices on one end and a spike in their income levels on the
                  other end have brought a broader shift in the consumer preferences towards using more natural beauty
                  care products and services in the recent past. Medi facials have now become immensely popular across
                  all age groups and genders. Now if we can see the statistics, men constitute for about more than 30% of
                  total consumers opting for medi facials. This talks more about the changed scenario in the consumer
                  stereotype perceptions &amp; lifestyle changes came over in recent times.
                </p>
                <MedifacialAccordions />
              </div>
            </div>
          </div>
        </section>

        <section className="medifacial-why" aria-labelledby="medifacial-why-heading">
          {/* Same full-bleed photo + gradient wash as Contact Us (`ContactUsPage.css` --contact-us-bg-image) */}
          <div className="contact-us-page-wrap medifacial-why__band">
            <div className="medifacial-why__inner coolsculpting-treatment__copy">
              <h2 id="medifacial-why-heading" className="coolsculpting-treatment__title">
                Why Lifescc
              </h2>
              <p className="coolsculpting-treatment__p">
                Over the past 10 years, Life slimming and the cosmetic clinic has evolved as one of the top leading health
                and wellness care brands in south India by pioneering several advanced, specialized, revolutionary treatment
                methods to our clients and customers in their diverse medical needs simply and effectively.
              </p>
              <p className="coolsculpting-treatment__p">
                Our state of the art facilities at our clinics complemented by our highly trained and certified
                dermatologists skilled &amp; specialized in offering superior quality skin services has helped us in gaining
                trust and confidence of our customers and in turn, enabled us to stand out in a sea of look-alikes in big
                cities.
              </p>
              <p className="coolsculpting-treatment__p">
                If you are looking forward to the best medi facial treatment in Hyderabad, Vizag, Vijayawada &amp; Nellore.
                Please visit your nearest lifescc clinic for free body analysis and counselling, where our experts clearly
                explain all the procedures to help you make an informed decision.
              </p>
              <button
                type="button"
                className="book-slot-btn py-2 book-slot-btn--primary rounded-pill medifacial-why__cta"
                onClick={() => setBookSlotOpen(true)}
              >
                Book a free consulting
              </button>
            </div>
          </div>
        </section>

        <MedifacialBenefitsSlider />

        <section className="medifacial-map" aria-label="Lifescc on Google Maps">
          <iframe
            className="medifacial-map__iframe"
            src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d121811.93727953311!2d78.460463!3d17.429869!3m2!1i1024!2i768!4f13.1!2m1!1slifescc!5e0!3m2!1sen!2sus!4v1777822655464!5m2!1sen!2sus"
            title="Google Map — Lifescc"
            height={480}
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
