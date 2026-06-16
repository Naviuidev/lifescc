import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { DISTRICTS_BY_STATE, STATES } from '../constants/apTsDistricts.js'
import './HomePage.css'
import './FranchisePage.css'

const PLANNING = [
  { value: 'this_week', label: 'This week' },
  { value: 'next_month', label: 'Next month' },
  { value: 'custom', label: 'Custom date range' },
]

function ChevronDown({ className = '' }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LeafDividerIcon() {
  return (
    <svg
      className="franchise-opportunity__leaf"
      width="28"
      height="20"
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 18c-2.5-4-1.5-9 2.5-12.5C14 2 18 1 21 2.5c-1 3.5-4 6.5-8 8-2 .8-3.5 2-4.5 3.5L8 18z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M20 18c2.5-4 1.5-9-2.5-12.5C14 2 10 1 7 2.5c1 3.5 4 6.5 8 8 2 .8 3.5 2 4.5 3.5L20 18z"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  )
}

export default function FranchisePage() {
  const [state, setState] = useState('')
  const [district, setDistrict] = useState('')
  const [planningOption, setPlanningOption] = useState('this_week')
  const [planningDate, setPlanningDate] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const planningDateRef = useRef(null)

  const districts = useMemo(() => {
    if (!state || !DISTRICTS_BY_STATE[state]) return []
    return [...DISTRICTS_BY_STATE[state]].sort((a, b) => a.localeCompare(b))
  }, [state])

  useEffect(() => {
    setDistrict('')
  }, [state])

  useEffect(() => {
    if (planningOption !== 'custom') return
    const el = planningDateRef.current
    if (!el) return
    const id = window.requestAnimationFrame(() => {
      if (typeof el.showPicker === 'function') {
        try {
          el.showPicker()
        } catch {
          el.focus()
        }
      } else {
        el.focus()
      }
    })
    return () => window.cancelAnimationFrame(id)
  }, [planningOption])

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setFormError(null)
      setFormSuccess(false)
      setSubmitting(true)
      try {
        const body = {
          state,
          district,
          planning_option: planningOption,
          full_name: fullName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        }
        if (planningOption === 'custom') {
          body.planning_date = planningDate
        }
        const res = await fetch('/api/franchises', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setFormError(typeof data.error === 'string' ? data.error : 'Could not submit. Try again.')
          return
        }
        setFormSuccess(true)
        setFullName('')
        setEmail('')
        setMobile('')
        setPlanningDate('')
        setPlanningOption('this_week')
        setState('')
        setDistrict('')
      } catch {
        setFormError('Network error. Check your connection and try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [state, district, planningOption, planningDate, fullName, email, mobile],
  )

  return (
    <div className="home-page">
      <Navbar />
      <main className="page-main franchise-page">
        <section className="franchise-hero" aria-labelledby="franchise-hero-heading">
          <div className="franchise-hero__media" aria-hidden />
          <div className="franchise-hero__stack">
            <div className="franchise-hero__content">
              <p className="franchise-hero__eyebrow">Partner with us</p>
              <h1 id="franchise-hero-heading" className="franchise-hero__title">
                Franchise <span className="franchise-hero__accent">opportunities</span>
              </h1>
              <p className="franchise-hero__lead">
                Bring Lifescc&apos;s trusted hair, skin, and weight wellness model to your city with a brand built on
                results, training, and ongoing support.
              </p>
            </div>

            <form className="franchise-hero-form" onSubmit={onSubmit} noValidate>
              <div className="franchise-hero-form__bar rounded-3">
                <label className="franchise-hero-form__field">
                  <span className="franchise-hero-form__label">State</span>
                  <span className="franchise-hero-form__control">
                    <select
                      className="franchise-hero-form__select"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      aria-label="State"
                    >
                      <option value="">State</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="franchise-hero-form__chevron" />
                  </span>
                </label>

                <label className="franchise-hero-form__field">
                  <span className="franchise-hero-form__label">District</span>
                  <span className="franchise-hero-form__control">
                    <select
                      className="franchise-hero-form__select"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      disabled={!state}
                      aria-label="District"
                    >
                      <option value="">District</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="franchise-hero-form__chevron" />
                  </span>
                </label>

                <div className="franchise-hero-form__field franchise-hero-form__field--planning">
                  <span className="franchise-hero-form__label">Planning for</span>
                  <div className="franchise-hero-form__planning-row">
                    <span className="franchise-hero-form__control franchise-hero-form__control--planning">
                      <select
                        className="franchise-hero-form__select"
                        value={planningOption}
                        onChange={(e) => setPlanningOption(e.target.value)}
                        aria-label="Planning timeframe"
                      >
                        {PLANNING.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="franchise-hero-form__chevron" />
                    </span>
                    {planningOption === 'custom' ? (
                      <input
                        ref={planningDateRef}
                        type="date"
                        className="franchise-hero-form__date franchise-hero-form__date--inline"
                        value={planningDate}
                        onChange={(e) => setPlanningDate(e.target.value)}
                        required
                        aria-label="Preferred date"
                      />
                    ) : null}
                  </div>
                </div>

                <label className="franchise-hero-form__field">
                  <span className="franchise-hero-form__label">Name</span>
                  <input
                    type="text"
                    className="franchise-hero-form__input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    placeholder="Name"
                    required
                    aria-label="Full name"
                  />
                </label>

                <label className="franchise-hero-form__field">
                  <span className="franchise-hero-form__label">Email</span>
                  <input
                    type="email"
                    className="franchise-hero-form__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder="Mail"
                    required
                    aria-label="Email"
                  />
                </label>

                <label className="franchise-hero-form__field">
                  <span className="franchise-hero-form__label">Mobile</span>
                  <input
                    type="tel"
                    className="franchise-hero-form__input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    autoComplete="tel"
                    placeholder="Mobile"
                    required
                    aria-label="Mobile number"
                  />
                </label>

                <div className="franchise-hero-form__submit-wrap">
                  <button
                    type="submit"
                    className="franchise-hero-form__submit btn franchise-hero-form__submit--success-light"
                    disabled={submitting}
                  >
                    <SearchIcon />
                    <span>{submitting ? 'Sending…' : 'Submit'}</span>
                  </button>
                </div>
              </div>

              {formError ? <p className="franchise-hero-form__msg franchise-hero-form__msg--err">{formError}</p> : null}
              {formSuccess ? (
                <p className="franchise-hero-form__msg franchise-hero-form__msg--ok" role="status">
                  Thank you — we&apos;ve received your inquiry and will get back to you shortly.
                </p>
              ) : null}
            </form>
          </div>
        </section>

        <section className="franchise-opportunity" aria-labelledby="franchise-opportunity-title">
          <div className="franchise-opportunity__shell">
            <h2 id="franchise-opportunity-title" className="franchise-opportunity__title">
              Life Slimming &amp; Cosmetic Clinic
            </h2>
            <div className="franchise-opportunity__divider" aria-hidden>
              <span className="franchise-opportunity__divider-line" />
              <LeafDividerIcon />
              <span className="franchise-opportunity__divider-line" />
            </div>
            <p className="franchise-opportunity__kicker">BIG BUSINESS OPPORTUNITY.</p>
            <p className="franchise-opportunity__lead">
              Franchise Partners are invited for setting up LIFE Slimming &amp; Cosmetic clinic — a very big brand,
              reputed organisation across Telangana &amp; AP. For details, call{' '}
              <a href="tel:+919533445566" className="franchise-opportunity__phone">
                9533445566
              </a>
              .
            </p>
            <div className="franchise-opportunity__list-block">
              <p className="franchise-opportunity__list-title">You grow fast for the following reasons.</p>
              <ul className="franchise-opportunity__list">
                <li>
                  Life clinics are known for brand image of world&apos;s top slimming and aesthetic cutting-edge
                  technologies; due to these reasons the results are drawn greatly.
                </li>
                <li>Known for pioneers of CoolSculpting in India.</li>
                <li>Known for non-surgical procedures i.e. replacement of surgical procedures.</li>
                <li>
                  Got award from Union Minister for quality of treatment and results apart from state level awards for
                  results.
                </li>
                <li>Team of experienced and expert doctors, dietitians, and technical staff.</li>
              </ul>
            </div>
            <p className="franchise-opportunity__outro">
              With the above infrastructure, our organisation will be able to impart training and guidance both in
              treatments and other allied matters such that the franchisees will be benefited.
            </p>
            <p className="franchise-opportunity__contact">
              <span className="franchise-opportunity__contact-label">For more details please contact:</span>{' '}
              <a href="tel:+919533445566" className="franchise-opportunity__phone franchise-opportunity__phone--footer">
                +91 95 33 44 55 66
              </a>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
