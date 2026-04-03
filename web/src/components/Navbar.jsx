import { useCallback, useEffect, useState } from 'react'
import mainLogo from '../assets/main-logo1.png'
import NavbarTopBar from './NavbarTopBar.jsx'
import './Navbar.css'

/** Main nav is visible when scroll is within this distance of the top; hidden when scrolled further down */
const SCROLL_TOP_SHOW_MAX = 80

const dropdownItems = {
  weight: [
    { label: 'Weight loss programs', href: '#weight-programs' },
    { label: 'BMI & nutrition', href: '#bmi' },
    { label: 'Body contouring', href: '#body' },
  ],
  skin: [
    { label: 'Facial treatments', href: '#facial' },
    { label: 'Acne & pigmentation', href: '#acne' },
    { label: 'Anti-aging', href: '#anti-aging' },
  ],
  hair: [
    { label: 'Hair loss treatment', href: '#hair-loss' },
    { label: 'PRP hair therapy', href: '#prp-hair' },
    { label: 'Hair transplant', href: '#transplant' },
  ],
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
          <li key={item.href}>
            <a className="dropdown-item" href={item.href}>
              {item.label}
            </a>
          </li>
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
            <li key={item.href}>
              <a href={item.href} className="mobile-nav-accordion__link" onClick={onNavigate}>
                {item.label}
              </a>
            </li>
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

  const closeMobile = useCallback(() => {
    setMobileMenuOpen(false)
    setMobileAccordion(null)
  }, [])

  const openMobile = useCallback(() => setMobileMenuOpen(true), [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      const show = y <= SCROLL_TOP_SHOW_MAX
      setMainNavVisible(show)
      document.body.classList.toggle('main-nav-reveal-active', show)
    }
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
        className={`main-nav-reveal navbar navbar-expand-lg navbar-shell ${mainNavVisible ? 'main-nav-reveal--visible' : ''}`}
        aria-label="Primary"
        aria-hidden={!mainNavVisible}
      >
        <div className="navbar-shell-inner navbar-shell-inner--main">
          <div className="navbar-glass-pill">
            <div className="container-fluid navbar-inner px-3 px-lg-4 d-flex align-items-center flex-wrap flex-lg-nowrap gap-2">
              <a className="navbar-brand d-flex align-items-center" href="/">
                <img
                  src={mainLogo}
                  alt="Lifescc"
                  className="navbar-logo"
                />
              </a>

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
                    <a className="nav-link" href="#about">
                      About
                    </a>
                  </li>

                  <DropdownMenu id="weight" label="Weight" items={dropdownItems.weight} />
                  <DropdownMenu id="skin" label="Skin" items={dropdownItems.skin} />
                  <DropdownMenu id="hair" label="Hair" items={dropdownItems.hair} />

                  <li className="nav-item">
                    <a className="nav-link" href="#book">
                      Book appointment
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="#testimonials">
                      Testimonials
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#blogs">
                      Blogs
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#contact">
                      Contact
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#franchise">
                      Franchise
                    </a>
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
            <a
              href="/"
              className="mobile-nav-drawer__brand"
              onClick={closeMobile}
            >
              <img
                src={mainLogo}
                alt="Lifescc"
                className="mobile-nav-drawer__logo"
              />
            </a>
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
              <a href="#about" className="mobile-nav-drawer__link" onClick={closeMobile}>
                About
              </a>
            </li>

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
              <a href="#book" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Book appointment
              </a>
            </li>
            <li>
              <a href="#testimonials" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Testimonials
              </a>
            </li>
            <li>
              <a href="#blogs" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Blogs
              </a>
            </li>
            <li>
              <a href="#contact" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Contact
              </a>
            </li>
            <li>
              <a href="#franchise" className="mobile-nav-drawer__link" onClick={closeMobile}>
                Franchise
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
