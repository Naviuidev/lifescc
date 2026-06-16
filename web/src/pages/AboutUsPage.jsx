import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import imgAfter from '../assets/before-after-1.jpg'
import imgBefore from '../assets/before-after-2.jpg'
import './HomePage.css'
import './AboutUsPage.css'

const IMG_AFTER = imgAfter
const IMG_BEFORE = imgBefore

export default function AboutUsPage() {
  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main about-us-page">
        <section className="about-us-hero" aria-labelledby="about-hero-heading">
          <div className="about-us-hero__media" aria-hidden />
          <div className="about-us-hero__content">
            <p className="about-us-hero__eyebrow">Our story</p>
            <h1 id="about-hero-heading" className="about-us-hero__title">
              About <span className="about-us-hero__badge">Lifescc</span>
            </h1>
            <p className="about-us-hero__lead">
              Life Slimming and Cosmetic Clinic — pioneering thoughtful, personalized care for hair, skin, and weight
              wellness across India.
            </p>
          </div>
        </section>

        <section className="about-us-intro" aria-label="About Lifescc">
          <div className="about-us-intro__shell">
            <div className="about-us-intro__grid">
              <div className="about-us-intro__copy">
                <p className="about-us-intro__p">
                  Lifescc is a pioneer in body slimming and weight loss solutions in Hyderabad, India. We are an expert
                  team of highly trained and experienced professionals working together relentlessly to deliver you the
                  most efficient, cost-effective, and long-lasting solutions for your hair, skin, and weight-related
                  problems.
                </p>
                <p className="about-us-intro__p">
                  At Lifescc, we always look forward to delight our customers with our services and strive hard to live
                  up to their expectations. Keeping today&apos;s hectic schedules in mind, we offer our customers highly
                  advanced and state-of-the-art solutions that are:
                </p>
                <ul className="about-us-intro__list">
                  <li>Safe</li>
                  <li>Painless</li>
                  <li>Non-surgical</li>
                  <li>Convenient</li>
                  <li>Speedy</li>
                  <li>
                    <strong className="about-us-intro__strong">Long Lasting</strong> and Affordable
                  </li>
                </ul>
              </div>
              <BeforeAfterSlider beforeSrc={IMG_BEFORE} afterSrc={IMG_AFTER} />
            </div>
          </div>
        </section>

        <section className="about-us-story" aria-label="Our milestones and treatments">
          <div className="about-us-story__shell">
            <p className="about-us-story__p">
              Since our inception 10 years ago, we have set various milestones for ourselves, raising a strong foothold
              in Tier 1 and Tier 2 cities of Telangana and Andhra Pradesh. Our esteemed clients comprise of students,
              homemakers, professionals, and celebrities, have greatly benefited from our transformational treatments.
            </p>
            <p className="about-us-story__p">
              We offer a wide, extensive range of globally renowned, FDA approved treatment options to our customers
              that have demonstrated a high success rate. We are proud of our dedicated team of trained and highly
              experienced practitioners to deliver the best results for your body slimming and weight loss problems.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
