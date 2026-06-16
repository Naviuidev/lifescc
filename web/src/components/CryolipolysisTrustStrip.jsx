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

function IconScience({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" />
      <path
        d="M22 11v6h5l-9 12v-7h-5l9-11z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M12 28l16-16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
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

function IconCustom({ className }) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="10" y="14" width="20" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M13 14V11h14v3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M20 19v6M17 22h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const ITEMS = [
  {
    label: 'FDA Approved',
    Icon: IconFda,
    tone: 'fda',
  },
  {
    label: 'Scientifically Backed',
    Icon: IconScience,
    tone: 'science',
  },
  {
    label: 'Advanced Technology',
    Icon: IconTech,
    tone: 'tech',
  },
  {
    label: 'Customized Treatment',
    Icon: IconCustom,
    tone: 'custom',
  },
]

/**
 * Four trust badges — layout mirrors CoolSculpting four-up strip.
 * @param {{ labels?: string[] }} [props] — optional four labels (same order as default pillars).
 */
export default function CryolipolysisTrustStrip({ labels } = {}) {
  const resolved = ITEMS.map((item, i) => ({
    ...item,
    label: labels?.[i] != null && String(labels[i]).trim() !== '' ? String(labels[i]) : item.label,
  }))

  return (
    <section className="coolsculpting-four-up cryolipolysis-trust-strip" aria-label="Treatment highlights">
      <div className="coolsculpting-four-up__shell">
        <ul className="cryolipolysis-trust-strip__grid">
          {resolved.map(({ label, Icon, tone }) => {
            const TrustIcon = Icon
            return (
              <li key={tone} className={`cryolipolysis-trust-strip__item cryolipolysis-trust-strip__item--${tone}`}>
                <span className="cryolipolysis-trust-strip__icon-wrap" aria-hidden>
                  <TrustIcon className="cryolipolysis-trust-strip__icon" />
                </span>
                <span className="cryolipolysis-trust-strip__label">{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
