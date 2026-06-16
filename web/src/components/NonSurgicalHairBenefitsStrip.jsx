function IconNoPills({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="14" cy="20" r="6" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="26" cy="20" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M11 29L29 11" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

function IconNoSideEffects({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 8l8 4v8c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11v-8l8-4z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M16 20l2.5 2.5L25 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTech({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <ellipse cx="20" cy="26" rx="12" ry="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M14 26V18c0-3.3 2.7-6 6-6s6 2.7 6 6v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="20" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M26 14l5-3M27 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function IconSafeProven({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 20l4.5 4.5L28 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const DEFAULT_ITEMS = [
  { label: 'No pills required', Icon: IconNoPills, tone: 'fda' },
  { label: 'No side effects', Icon: IconNoSideEffects, tone: 'science' },
  { label: 'Advanced Technology', Icon: IconTech, tone: 'tech' },
  { label: 'Safe and Proven', Icon: IconSafeProven, tone: 'custom' },
]

/**
 * Four-up strip — same visual system as CryolipolysisTrustStrip (coloured cards, icon + label).
 * @param {{ benefitLabels?: string[] }} [props] — optional four strings override default labels (order: pills, side effects, tech, proven).
 */
export default function NonSurgicalHairBenefitsStrip({ benefitLabels = null }) {
  const items =
    Array.isArray(benefitLabels) && benefitLabels.length === DEFAULT_ITEMS.length
      ? DEFAULT_ITEMS.map((item, i) => ({ ...item, label: benefitLabels[i] ?? item.label }))
      : DEFAULT_ITEMS

  return (
    <section className="coolsculpting-four-up cryolipolysis-trust-strip" aria-label="Treatment advantages">
      <div className="coolsculpting-four-up__shell">
        <ul className="cryolipolysis-trust-strip__grid">
          {items.map(({ label, Icon, tone }) => (
            <li key={tone} className={`cryolipolysis-trust-strip__item cryolipolysis-trust-strip__item--${tone}`}>
              <span className="cryolipolysis-trust-strip__icon-wrap" aria-hidden>
                <Icon className="cryolipolysis-trust-strip__icon" />
              </span>
              <span className="cryolipolysis-trust-strip__label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
