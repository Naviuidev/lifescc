import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  LIFESCC_BRANCHES,
  googleMapsDirectionsUrl,
  googleMapsEmbedUrl,
} from '../constants/branches.js'
import './ContactBranchesMap.css'

function branchIdFromLocationHash(hash) {
  const raw = String(hash || '').replace(/^#/, '').trim()
  if (!raw || raw === 'branches') return ''
  return LIFESCC_BRANCHES.some((b) => b.id === raw) ? raw : ''
}

function MapAddressCard({ branch }) {
  return (
    <div className="contact-branches__map-overlay" role="region" aria-label={`${branch.name} address on map`}>
      <div className="contact-branches__pin-card">
        <p className="contact-branches__pin-name">{branch.name}</p>
        <p className="contact-branches__pin-address">{branch.address}</p>
      </div>
    </div>
  )
}

function telHrefFromDisplay(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '')
  if (digits.length === 10) return `tel:+91${digits}`
  if (digits.length > 0) return `tel:+${digits}`
  return undefined
}

function BranchesDetailPanel({ selected }) {
  if (!selected) return null
  const telHref = telHrefFromDisplay(selected.phone)
  return (
    <div className="contact-branches__detail">
      <p className="contact-branches__eyebrow">Our locations</p>
      <h2 id="contact-branches-heading" className="contact-branches__title">
        Connecting Near and Far
      </h2>
      <h3 className="contact-branches__branch-name">{selected.name}</h3>
      <address className="contact-branches__address">{selected.address}</address>
      <p className="contact-branches__phone">
        <span className="contact-branches__phone-label">Ph:</span>{' '}
        {telHref ? <a href={telHref}>{selected.phone}</a> : selected.phone}
      </p>
      <a
        className="contact-branches__directions-btn"
        href={googleMapsDirectionsUrl(selected)}
        target="_blank"
        rel="noopener noreferrer"
      >
        View directions in Google Maps
      </a>
    </div>
  )
}

function BranchChips({ selectedId, onSelect }) {
  return (
    <ul className="contact-branches__chip-list" role="listbox" aria-label="Branches">
      {LIFESCC_BRANCHES.map((b) => (
        <li key={b.id} role="none">
          <button
            type="button"
            role="option"
            aria-selected={selectedId === b.id}
            className={`contact-branches__chip${selectedId === b.id ? ' contact-branches__chip--active' : ''}`}
            onClick={() => onSelect(b.id)}
          >
            {b.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

function MapColumn({ selectedId, onSelectBranch, mapChildren }) {
  return (
    <div className="contact-branches__map-column">
      <div className="contact-branches__chips-block">
        <p className="contact-branches__chips-label">Our branches</p>
        <BranchChips selectedId={selectedId} onSelect={onSelectBranch} />
      </div>
      <div className="contact-branches__map-wrap">{mapChildren}</div>
    </div>
  )
}

function MapIframeEmbed({ branch }) {
  return (
    <div className="contact-branches__map-embed">
      <iframe
        key={branch.id}
        title={`Map: ${branch.name}`}
        className="contact-branches__iframe"
        src={googleMapsEmbedUrl(branch)}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <MapAddressCard branch={branch} />
    </div>
  )
}

export default function ContactBranchesMap() {
  const location = useLocation()
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === 'undefined') return LIFESCC_BRANCHES[0]?.id ?? ''
    const fromHash = branchIdFromLocationHash(window.location.hash)
    return fromHash || LIFESCC_BRANCHES[0]?.id || ''
  })

  const selected = useMemo(
    () => LIFESCC_BRANCHES.find((b) => b.id === selectedId) ?? LIFESCC_BRANCHES[0],
    [selectedId],
  )

  useEffect(() => {
    if (location.pathname !== '/contact-us') return
    const raw = location.hash.replace(/^#/, '').trim()
    if (!raw) return

    const id = branchIdFromLocationHash(location.hash)
    if (id) setSelectedId(id)

    const scrollBranches = () => {
      document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollBranches)
    })
  }, [location.pathname, location.hash])

  return (
    <section id="branches" className="contact-branches" aria-labelledby="contact-branches-heading">
      <div className="contact-branches__inner">
        <MapColumn selectedId={selectedId} onSelectBranch={setSelectedId} mapChildren={<MapIframeEmbed branch={selected} />} />
        <BranchesDetailPanel selected={selected} />
      </div>
    </section>
  )
}
