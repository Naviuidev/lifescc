import { Link } from 'react-router-dom'
import slideBg from '../assets/slide_bg.jpg'
import navbarLogo from '../assets/main-logo1.png'
import './HomeWeightLossProgramsBand.css'

const TEL_DISPLAY = '95 33 44 55 66'
const TEL_HREF = 'tel:+919533445566'

function IconFatLoss({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v4M8 5l-2 3M16 5l2 3M6 18h12M8 18v-5l4-3 4 3v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 14h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconInchLoss({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h16M4 16h10M4 12h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M18 14l2 2-2 2M20 16h-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconBodyShaping({ className }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v3M9 7h6l1 4v9H8v-9l1-4zM10 21h4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="12" cy="13" rx="3" ry="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

const PROGRAM_LINKS = [
  { to: '/weight-loss-treatment', label: 'Fat Loss', Icon: IconFatLoss },
  { to: '/inch-loss', label: 'Inch Loss', Icon: IconInchLoss },
  { to: '/figure-correction', label: 'Body Shaping', Icon: IconBodyShaping },
]

function GoCircle({ variant = 'offer' }) {
  const isLogo = variant === 'logo'
  return (
    <a
      className={`home-wlp-go-circle${isLogo ? ' home-wlp-go-circle--logo' : ''}`}
      href={TEL_HREF}
      aria-label={`Call ${TEL_DISPLAY} for 50% off`}
    >
      <span className="home-wlp-go-circle__ring" aria-hidden />
      {isLogo ? (
        <span className="home-wlp-go-circle__logo-wrap">
          <img src={navbarLogo} alt="Lifescc logo" className="home-wlp-go-circle__logo" loading="lazy" decoding="async" />
        </span>
      ) : (
        <>
          <span className="home-wlp-go-circle__label">GO</span>
          <span className="home-wlp-go-circle__overlay">
            <span className="home-wlp-go-circle__offer">
              Get 50% Off
              <span className="home-wlp-go-circle__call">Call: {TEL_DISPLAY}</span>
            </span>
          </span>
        </>
      )}
    </a>
  )
}

/** Full-bleed band: slide_bg + green wash, programs copy + GO circles (homepage). */
export default function HomeWeightLossProgramsBand() {
  return (
    <section className="home-wlp-band" aria-labelledby="home-wlp-band-heading">
      <div
        className="home-wlp-band__bg"
        style={{ backgroundImage: `url(${slideBg})` }}
        aria-hidden
      />
      <div className="home-wlp-band__overlay" aria-hidden />

      <div className="home-wlp-band__shell">
        <div className="home-wlp-band__grid">
          <div className="home-wlp-band__col home-wlp-band__col--main">
            <div className="home-wlp-band__stars-pill rounded-pill" aria-label="5 out of 5 stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="home-wlp-band__star" aria-hidden>
                  ★
                </span>
              ))}
            </div>

            <h2 id="home-wlp-band-heading" className="home-wlp-band__title">
              Weight Loss Programs
            </h2>

            <p className="home-wlp-band__century-badge rounded-pill">for the 21st Century</p>

            <ul className="home-wlp-band__icon-links">
              {PROGRAM_LINKS.map(({ to, label, Icon }) => (
                <li key={to}>
                  <Link className="home-wlp-band__icon-link" to={to}>
                    <span className="home-wlp-band__icon-wrap">
                      <Icon className="home-wlp-band__icon-svg" />
                    </span>
                    <span className="home-wlp-band__icon-label">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="home-wlp-band__col home-wlp-band__col--cta">
            <div className="home-wlp-band__go-row">
              <GoCircle variant="logo" />
              <GoCircle variant="offer" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
