import { Link } from 'react-router-dom'
import BeforeAfterSlider from './BeforeAfterSlider.jsx'
import beforeImg from '../assets/before-after-1.jpg'
import afterImg from '../assets/before-after-2.jpg'
import './HomeAboutLifesccSection.css'

/** Homepage: About Lifescc two-column section with before/after slider. */
export default function HomeAboutLifesccSection() {
  return (
    <section className="home-about-lifescc" aria-labelledby="home-about-lifescc-heading">
      <div className="home-about-lifescc__shell">
        <div className="home-about-lifescc__grid">
          <div className="home-about-lifescc__copy">
            <h2 id="home-about-lifescc-heading" className="home-about-lifescc__title">
              About Lifescc
            </h2>
            <p className="home-about-lifescc__p">
              Lifescc is one of the leading weight loss clinics and slimming centres in Hyderabad, offering body slimming and
              weight loss solutions with cutting edge technology through our safe and monitored centres which follow
              international standards and are managed by professionals. Apart from Hyderabad, we are also located in Vizag,
              Vijayawada and Nellore.
            </p>
            <p className="home-about-lifescc__p">
              Over the past 10 years, Life slimming and the cosmetic clinic pioneered several revolutionary treatment methods
              like CoolSculpting, Zimmer etc., offering exceptional quality health care for people in their diverse medical
              needs in a simple and effective manner. We have been recognized for delivering outstanding quality care, safe
              and effective alternatives for fat removal and body contouring to our esteemed clientele and beloved customers.
            </p>
            <Link className="home-about-lifescc__cta" to="/about-us">
              Know more
            </Link>
          </div>

          <div className="home-about-lifescc__visual">
            <div className="home-about-lifescc__slider-wrap">
              <BeforeAfterSlider
                beforeSrc={beforeImg}
                afterSrc={afterImg}
                beforeLabel="Before"
                afterLabel="After"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
