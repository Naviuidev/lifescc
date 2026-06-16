import { WEIGHT_DROPDOWN_ITEMS } from './weightTreatments.js'
import { SKIN_DROPDOWN_ITEMS } from './skinTreatments.js'
import { PROGRAM_DROPDOWN_ITEMS } from './programDropdownItems.js'

/** Hair line — matches `Navbar.jsx` dropdown. */
export const HAIR_DROPDOWN_ITEMS = [
  { label: 'Non-surgical hair replacement', href: '/non-surgical-hair-replacement' },
  { label: 'Hair regrowth', href: '/hair-regrowth' },
  { label: 'Anti hair fall', href: '/anti-hair-fall' },
  { label: 'Anti dandruff', href: '/anti-dandruff' },
  { label: 'Mesotherapy', href: '/mesotherapy' },
  { label: 'Hair transplantation treatment', href: '/hair-transplantation-treatment' },
]

/**
 * Nav “Services” dropdowns grouped like the main navbar (Programs / Weight / Skin / Hair).
 * @returns {{ group: string, items: { label: string, href: string }[] }[]}
 */
export function getNavbarServiceDropdownGroups() {
  const programItems = PROGRAM_DROPDOWN_ITEMS.filter(
    (item) => String(item.label ?? '').trim() !== 'All Programs',
  )

  return [
    { group: 'Programs', items: programItems },
    { group: 'Weight', items: WEIGHT_DROPDOWN_ITEMS },
    { group: 'Skin', items: SKIN_DROPDOWN_ITEMS },
    { group: 'Hair', items: HAIR_DROPDOWN_ITEMS },
  ]
}

/**
 * Flat options for &lt;select&gt; — value is stable JSON for saving on site bots.
 * @returns {{ value: string, group: string, label: string, href: string }[]}
 */
export function getNavbarServiceFlatOptions() {
  const out = []
  for (const { group, items } of getNavbarServiceDropdownGroups()) {
    for (const item of items) {
      out.push({
        value: JSON.stringify({ group, label: item.label, href: item.href }),
        group,
        label: item.label,
        href: item.href,
      })
    }
  }
  return out
}
