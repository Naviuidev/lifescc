function IconFda({ className }) {
  return (
    <svg className={className} width={44} height={28} viewBox="0 0 44 28" aria-hidden>
      <text
        x="0"
        y="21"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        fontSize="17"
        fontWeight="800"
        letterSpacing="-0.06em"
      >
        FDA
      </text>
    </svg>
  )
}

function IconClock({ className }) {
  return (
    <svg className={className} width={36} height={36} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" />
      <path d="M20 12v9l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function IconShield({ className }) {
  return (
    <svg className={className} width={36} height={36} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M20 6l12 5v9c0 7-5 13-12 15-7-2-12-8-12-15V11l12-5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 20l4 4 8-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ITEMS = [
  { label: 'FDA Approved', Icon: IconFda, tone: 'fda' },
  { label: 'No Downtime', Icon: IconClock, tone: 'science' },
  { label: 'Advanced Technology', Icon: IconTech, tone: 'tech' },
  { label: 'Safe and effective', Icon: IconShield, tone: 'custom' },
]

/** Four trust badges — same layout as cryolipolysis strip, anti-ageing copy. */
export default function AntiAgeingTrustStrip() {
  return (
    <section className="coolsculpting-four-up cryolipolysis-trust-strip" aria-label="Treatment highlights">
      <div className="coolsculpting-four-up__shell">
        <ul className="cryolipolysis-trust-strip__grid">
          {ITEMS.map(({ label, Icon, tone }) => (
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
