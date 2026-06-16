import { Link } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import { LIFESCC_BRANCHES } from '../constants/branches.js'
import './SiteFooter.css'

const ourValues = ['Professional', 'Personalized', 'Enriching', 'Innovative', 'Sensitive']

const midLinks = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about-us' },
  { label: 'Contact us', to: '/contact-us' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Write a review', to: '/reviews' },
]

const EXTERNAL_SOCIAL = {
  facebook: 'https://www.facebook.com/LifeSlimming/',
  x: 'https://x.com/lifeslimming',
  instagram: 'https://www.instagram.com/life_slimming_and_cosmetic/',
  googlePlus:
    'https://workspaceupdates.googleblog.com/2023/04/new-community-features-for-google-chat-and-an-update-currents%20.html',
}

function SocialIconFacebook({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8.2h2.7l.4-3.2h-3.1V8.9c0-.9.3-1.6 1.7-1.6H17V4.2c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.7H7v3.2h2.5V22h4z" />
    </svg>
  )
}

function SocialIconGooglePlus({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23,11H21V9H19V11H17V13H19V15H21V13H23M8,11V13.4H12C11.8,14.4 10.8,16.4 8,16.4C5.6,16.4 3.7,14.4 3.7,12C3.7,9.6 5.6,7.6 8,7.6C9.4,7.6 10.3,8.2 10.8,8.7L12.7,6.9C11.5,5.7 9.9,5 8,5C4.1,5 1,8.1 1,12C1,15.9 4.1,19 8,19C12,19 14.7,16.2 14.7,12.2C14.7,11.7 14.7,11.4 14.6,11H8Z" />
    </svg>
  )
}

function SocialIconLinkedIn({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.7 2.6 4.7 6v7h-4v-6.2c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V23h-4V8z" />
    </svg>
  )
}

function SocialIconTwitter({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SocialIconInstagram({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__glass site-footer__top">
          <div className="site-footer__glass-shine" aria-hidden />
          <div className="site-footer__glass-inner site-footer__grid">
            <div className="site-footer__col site-footer__col--brand">
              <div className="site-footer__brand-row">
                <span className="site-footer__brand-mark" aria-hidden />
                <span className="text-dark">Lifescc</span>
              </div>
              <h2 className="text-dark">About Us</h2>
              <span className="site-footer__rule" aria-hidden />
              <p className="site-footer__lead">
                Life Slimming and Cosmetic Clinic is a pioneer in cosmetic care solutions in India. We are a team
                of professionals working together relentlessly to deliver effective, long-lasting solutions for hair,
                skin and weight problems.
              </p>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__section-title">
                <span className="site-footer__section-bar" aria-hidden />
                Our Values
              </h3>
              <ul className="site-footer__links site-footer__values-list">
                {ourValues.map((label) => (
                  <li key={label}>
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__section-title">
                <span className="site-footer__section-bar" aria-hidden />
                Branches
              </h3>
              <ul className="site-footer__links site-footer__values-list">
                {LIFESCC_BRANCHES.map((b) => (
                  <li key={b.id}>
                    <Link to={`/contact-us#${b.id}`}>{b.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="site-footer__col site-footer__col--contact">
              <div className="site-footer__brand-card">
                <img src={mainLogo} alt="" className="site-footer__brand-card-logo" width={48} height={48} />
               
              </div>
              <ul className="site-footer__contact-lines">
                <li>
                  <span className="site-footer__contact-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.45-1.19a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <a href="tel:+919533445566">+91 9533 44 55 66</a>
                </li>
                <li>
                  <span className="site-footer__contact-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.45-1.19a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <a href="tel:+917331144606">+91 7331 14 46 06</a>
                </li>
                <li>
                  <span className="site-footer__contact-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.45-1.19a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <a href="tel:+917331144607">+91 7331 14 46 07</a>
                </li>
                <li>
                  <span className="site-footer__contact-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M3 7l9 6 9-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <a href="mailto:feedback@lifescc.com">feedback@lifescc.com</a>
                </li>
              </ul>
              <div className="site-footer__address" role="group" aria-label="Locations">
                Hyderabad
                <br />
                Visakhapatnam
                <br />
                Nellore
                <br />
                Vijayawada
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__glass site-footer__mid">
          <div className="site-footer__glass-shine" aria-hidden />
          <div className="site-footer__glass-inner site-footer__mid-inner">
            <div className="site-footer__social">
              <a
                href={EXTERNAL_SOCIAL.facebook}
                className="site-footer__social-btn"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIconFacebook />
              </a>
              <a
                href={EXTERNAL_SOCIAL.googlePlus}
                className="site-footer__social-btn"
                aria-label="Google Plus"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIconGooglePlus />
              </a>
              <a href="#linkedin" className="site-footer__social-btn" aria-label="LinkedIn">
                <SocialIconLinkedIn />
              </a>
              <a
                href={EXTERNAL_SOCIAL.x}
                className="site-footer__social-btn"
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIconTwitter />
              </a>
              <a
                href={EXTERNAL_SOCIAL.instagram}
                className="site-footer__social-btn"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIconInstagram />
              </a>
            </div>

            <nav className="site-footer__mid-nav" aria-label="Footer shortcuts">
              {midLinks.map((link, i) => (
                <span key={link.label} className="site-footer__mid-nav-item">
                  {i > 0 ? <span className="site-footer__mid-pipe" aria-hidden> | </span> : null}
                  <Link to={link.to}>{link.label}</Link>
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="site-footer__glass site-footer__bottom">
          <div className="site-footer__glass-shine" aria-hidden />
          <div className="site-footer__glass-inner site-footer__bottom-inner">
            <p className="site-footer__copyright">
              Copyright © {year} All rights reserved by Lifescc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
