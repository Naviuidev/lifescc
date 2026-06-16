import { useCallback, useId, useState } from 'react'

/**
 * Process tab strip + panel (CoolSculpting / Cryolipolysis styling from CoolsculptingPage.css).
 *
 * @param {{
 *   steps: Array<{ title: string, label: string, body: string, icon?: string }>,
 *   icons: Record<string, string>,
 *   tablistAriaLabel: string,
 *   sectionTitle?: string,
 *   headingId: string,
 * }} props
 */
export default function TreatmentProcessTabs({
  steps,
  icons,
  tablistAriaLabel,
  sectionTitle = 'Our Process',
  headingId,
}) {
  const baseId = useId()
  const panelId = (n) => `${baseId}-panel-${n}`
  const tabId = (n) => `${baseId}-tab-${n}`

  const [activeStep, setActiveStep] = useState(1)
  const progress = steps.length > 1 ? (activeStep - 1) / (steps.length - 1) : 0

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveStep((s) => Math.min(steps.length, s + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveStep((s) => Math.max(1, s - 1))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setActiveStep(1)
      } else if (e.key === 'End') {
        e.preventDefault()
        setActiveStep(steps.length)
      }
    },
    [steps.length],
  )

  const step = steps[activeStep - 1]

  return (
    <section className="coolsculpting-process" aria-labelledby={headingId}>
      <div className="coolsculpting-process__shell">
        <header className="coolsculpting-process__header">
          <h2 id={headingId} className="coolsculpting-process__title">
            {sectionTitle}
          </h2>
          <div className="coolsculpting-process__divider" aria-hidden="true">
            <span className="coolsculpting-process__divider-line" />
            <span className="coolsculpting-process__divider-icon">
              <svg
                className="coolsculpting-process__divider-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 56 32"
                aria-hidden="true"
              >
                <ellipse cx="22" cy="18" fill="#15803d" rx="14" ry="7" transform="rotate(-38 22 18)" />
                <ellipse cx="34" cy="18" fill="#166534" rx="14" ry="7" transform="rotate(38 34 18)" />
              </svg>
            </span>
            <span className="coolsculpting-process__divider-line" />
          </div>
        </header>

        <div
          className="coolsculpting-process__slider"
          style={{ ['--process-step-count']: String(Math.max(1, steps.length)) }}
        >
          <div className="coolsculpting-process__rail" aria-hidden="true">
            <div className="coolsculpting-process__rail-bg" />
            <div
              className="coolsculpting-process__rail-fill"
              style={{ '--coolsculpt-process-progress': String(progress) }}
            />
          </div>
          <div className="coolsculpting-process__tabs" role="tablist" aria-label={tablistAriaLabel}>
            {steps.map((item, index) => {
              const n = index + 1
              const isActive = activeStep === n
              return (
                <div key={n} className="coolsculpting-process__tab-cell">
                  <button
                    type="button"
                    role="tab"
                    id={tabId(n)}
                    aria-selected={isActive}
                    aria-controls={panelId(n)}
                    tabIndex={isActive ? 0 : -1}
                    className={
                      isActive
                        ? 'coolsculpting-process__tab-btn coolsculpting-process__tab-btn--active'
                        : 'coolsculpting-process__tab-btn'
                    }
                    onClick={() => setActiveStep(n)}
                    onKeyDown={onKeyDown}
                  >
                    <span className="coolsculpting-process__tab-num">{n}</span>
                    <span className="coolsculpting-process__tab-label">{item.label}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div
          key={activeStep}
          role="tabpanel"
          id={panelId(activeStep)}
          aria-labelledby={tabId(activeStep)}
          className="coolsculpting-process__panel"
        >
          {step.icon && icons[step.icon] ? (
            <span className="coolsculpting-process__panel-icon" aria-hidden="true">
              <img src={icons[step.icon]} alt="" className="coolsculpting-process__panel-icon-img" loading="lazy" decoding="async" />
            </span>
          ) : null}
          <h3 className="coolsculpting-process__panel-title">{step.title}</h3>
          <p className="coolsculpting-process__panel-body">{step.body}</p>
        </div>
      </div>
    </section>
  )
}
