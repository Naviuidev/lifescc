import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import mainLogo from '../assets/main-logo1.png'
import NavbarTopBar from './NavbarTopBar.jsx'
import { PROGRAM_DROPDOWN_ITEMS } from '../constants/programDropdownItems.js'
import { WEIGHT_DROPDOWN_ITEMS } from '../constants/weightTreatments.js'
import { SKIN_DROPDOWN_ITEMS } from '../constants/skinTreatments.js'
import { HAIR_DROPDOWN_ITEMS } from '../constants/navbarDropdownItems.js'
import './Navbar.css'

/** Pixels of scroll delta to treat as intentional direction (ignore jitter). */
const SCROLL_DIRECTION_THRESHOLD = 6
/** Near top of page: always show main nav. */
const SCROLL_TOP_ALWAYS_SHOW = 32

const dropdownItems = {
  programs: PROGRAM_DROPDOWN_ITEMS,
  weight: WEIGHT_DROPDOWN_ITEMS,
  skin: SKIN_DROPDOWN_ITEMS,
  hair: HAIR_DROPDOWN_ITEMS,
}

function ChevronIcon({ className = '' }) {
  return (
    <svg
      className={`nav-chevron-icon ${className}`.trim()}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DropdownMenu({ id, label, items }) {
  return (
    <li className="nav-item dropdown glass-dropdown">
      <a
        className="nav-link nav-link--dropdown dropdown-toggle"
        href="#"
        id={`${id}Dropdown`}
        role="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        aria-haspopup="true"
      >
        <span className="nav-link__text">{label}</span>
        <span className="nav-chevron-wrap">
          <ChevronIcon />
        </span>
      </a>
      <ul className="dropdown-menu" aria-labelledby={`${id}Dropdown`}>
        {items.map((item) => (
          <Fragment key={item.label}>
            <li>
              <a
                className={`dropdown-item${item.featured ? ' dropdown-item--featured' : ''}`}
                href={item.href}
              >
                {item.label}
              </a>
            </li>
            {item.dividerAfter ? (
              <li>
                <hr className="dropdown-divider" />
              </li>
            ) : null}
          </Fragment>
        ))}
      </ul>
    </li>
  )
}

function MobileAccordionSection({ id, label, items, isOpen, onToggle, onNavigate }) {
  return (
    <li className={`mobile-nav-accordion ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="mobile-nav-accordion__trigger"
        aria-expanded={isOpen}
        id={`${id}-acc-btn`}
        onClick={() => onToggle(isOpen ? null : id)}
      >
        <span>{label}</span>
        <span className={`nav-chevron-wrap ${isOpen ? 'is-open' : ''}`}>
          <ChevronIcon />
        </span>
      </button>
      <div
        className={`mobile-nav-accordion__panel ${isOpen ? 'is-open' : ''}`}
        role="region"
        aria-labelledby={`${id}-acc-btn`}
        aria-hidden={!isOpen}
      >
        <ul className="mobile-nav-accordion__list">
          {items.map((item) => (
            <Fragment key={item.label}>
              <li>
                <a
                  href={item.href}
                  className={`mobile-nav-accordion__link${item.featured ? ' mobile-nav-accordion__link--featured' : ''}`}
                  onClick={onNavigate}
                >
                  {item.label}
                </a>
              </li>
              {item.dividerAfter ? (
                <li className="mobile-nav-accordion__divider" aria-hidden />
              ) : null}
            </Fragment>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Navbar() {
  const [mainNavVisible, setMainNavVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState(null)
  const lastScrollYRef = useRef(0)

  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false)
    setMobileAccordion(null)
  }, [])

  const openMobile = useCallback(() => setMobileMenuOpen(true), [])

  /**
   * Hide main nav when scrolling down; show when scrolling up (with fade/slide in CSS).
   * Near the top of the page, the bar stays visible.
   */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const last = lastScrollYRef.current
      const delta = y - last

      if (y <= SCROLL_TOP_ALWAYS_SHOW) {
        setMainNavVisible(true)
        document.body.classList.add('main-nav-reveal-active')
      } else if (delta > SCROLL_DIRECTION_THRESHOLD) {
        setMainNavVisible(false)
        document.body.classList.remove('main-nav-reveal-active')
      } else if (delta < -SCROLL_DIRECTION_THRESHOLD) {
        setMainNavVisible(true)
        document.body.classList.add('main-nav-reveal-active')
      }

      lastScrollYRef.current = y
    }

    lastScrollYRef.current = window.scrollY || 0
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('main-nav-reveal-active')
    }
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-nav-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('mobile-nav-open')
      document.body.style.overflow = ''
    }
    return () => {
      document.body.classList.remove('mobile-nav-open')
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeMobile])

  return (
    <>
      <div className="navbar-icons-fixed">
        <div className="navbar-shell-inner">
          <NavbarTopBar />
        </div>
      </div>

      <nav
        className={`main-nav-reveal navbar navbar-expand-lg navbar-shell${mainNavVisible ? ' main-nav-reveal--visible' : ''}`}
        aria-label="Primary"
        aria-hidden={!mainNavVisible}
      >
        <div className="navbar-shell-inner navbar-shell-inner--main">
          <div className="navbar-glass-pill">
            <div className="container-fluid navbar-inner px-3 px-lg-4 d-flex align-items-center flex-wrap flex-lg-nowrap gap-2">
              <Link className="navbar-brand d-flex align-items-center" to="/">
                <img
                  src={mainLogo}
                  alt="Lifescc"
                  className="navbar-logo"
                />
              </Link>

              <button
                className={`navbar-toggler-animate d-lg-none ${mobileMenuOpen ? 'is-open' : ''}`}
                type="button"
                onClick={() => (mobileMenuOpen ? closeMobile() : openMobile())}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobileNavDrawer"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="navbar-toggler-animate__bar" />
                <span className="navbar-toggler-animate__bar" />
                <span className="navbar-toggler-animate__bar" />
              </button>

              <div
                className="collapse navbar-collapse main-nav-desktop-collapse"
                id="mainNav"
              >
                <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                  <li className="nav-item">
                    <Link className="nav-link" to="/about-us">
                      About
                    </Link>
                  </li>

                  <DropdownMenu id="programs" label="Programs" items={dropdownItems.programs} />
                  <DropdownMenu id="weight" label="Weight" items={dropdownItems.weight} />
                  <DropdownMenu id="skin" label="Skin" items={dropdownItems.skin} />
                  <DropdownMenu id="hair" label="Hair" items={dropdownItems.hair} />

                  <li className="nav-item">
                    <Link className="nav-link" to="/book-an-appointment">
                      Book appointment
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/testimonials">
                      Testimonials
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/blog">
                      Blogs
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact-us">
                      Contact
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/franchise">
                      Franchise
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu: slides from left */}
      <div
        className={`mobile-nav-backdrop d-lg-none ${mobileMenuOpen ? 'is-visible' : ''}`}
        aria-hidden={!mobileMenuOpen}
        onClick={closeMobile}
      />

      <div
        id="mobileNavDrawer"
        className={`mobile-nav-drawer d-lg-none ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-nav-drawer__inner">
          <div className="mobile-nav-drawer__head">
            <Link
              to="/"
              className="mobile-nav-drawer__brand"
              onClick={closeMobile}
            >
              <img
                src={mainLogo}
                alt="Lifescc"
                className="mobile-nav-drawer__logo"
              />
            </Link>
            <button
              type="button"
              className="mobile-nav-drawer__close"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <span className="navbar-toggler-animate is-open navbar-toggler-animate--small" aria-hidden>
                <span className="navbar-toggler-animate__bar" />
                <span className="navbar-toggler-animate__bar" />
                <span className="navbar-toggler-animate__bar" />
              </span>
            </button>
          </div>
          <ul className="mobile-nav-drawer__list">
            <li>
              <Link to="/about-us" className="mobile-nav-drawer__link" onClick={closeMobile}>
                About
              </Link>
            </li>

            <MobileAccordionSection
              id="programs"
              label="Programs"
              items={dropdownItems.programs}
              isOpen={mobileAccordion === 'programs'}
              onToggle={setMobileAccordion}
              onNavigate={closeMobile}
            />
            <MobileAccordionSection
              id="weight"
              label="Weight"
              items={dropdownItems.weight}
              isOpen={mobileAccordion === 'weight'}
              onToggle={setMobileAccordion}
              onNavigate={closeMobile}
            />
            <MobileAccordionSection
              id="skin"
              label="Skin"
              items={dropdownItems.skin}
              isOpen={mobileAccordion === 'skin'}
              onToggle={setMobileAccordion}
              onNavigate={closeMobile}
            />
            <MobileAccordionSection
              id="hair"
              label="Hair"
              items={dropdownItems.hair}
              isOpen={mobileAccordion === 'hair'}
              onToggle={setMobileAccordion}
              onNavigate={closeMobile}
            />

            <li>
              <Link to="/book-an-appointment" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Book appointment
              </Link>
            </li>
            <li>
              <Link to="/testimonials" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Testimonials
              </Link>
            </li>
            <li>
              <Link to="/blog" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/franchise" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Franchise
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
