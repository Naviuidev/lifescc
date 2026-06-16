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

function IconNoSideEffects({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M13 20l5 5 9-10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconNoDowntime({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M20 12v9l6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconNonSurgical({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path
        d="M12 28l16-16M28 28L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M14 18h12M14 22h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

const ITEMS = [
  { label: 'FDA', Icon: IconFda, tone: 'fda' },
  { label: 'No side effects', Icon: IconNoSideEffects, tone: 'safe' },
  { label: 'No Downtime', Icon: IconNoDowntime, tone: 'time' },
  { label: 'Non-surgical', Icon: IconNonSurgical, tone: 'nonsurg' },
]

/** Four highlights for figure correction — layout matches Cryolipolysis trust strip. */
export default function FigureCorrectionTrustStrip() {
  return (
    <section className="coolsculpting-four-up figure-correction-trust-strip" aria-label="Figure correction highlights">
      <div className="coolsculpting-four-up__shell">
        <ul className="figure-correction-trust-strip__grid">
          {ITEMS.map(({ label, Icon, tone }) => (
            <li key={tone} className={`figure-correction-trust-strip__item figure-correction-trust-strip__item--${tone}`}>
              <span className="figure-correction-trust-strip__icon-wrap" aria-hidden>
                <Icon className="figure-correction-trust-strip__icon" />
              </span>
              <span className="figure-correction-trust-strip__label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
