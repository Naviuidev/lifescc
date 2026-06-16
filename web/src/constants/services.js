import { WEIGHT_DROPDOWN_ITEMS } from './weightTreatments.js'
import { SKIN_DROPDOWN_ITEMS } from './skinTreatments.js'
import { HAIR_DROPDOWN_ITEMS } from './navbarDropdownItems.js'
import { PROGRAM_DROPDOWN_ITEMS } from './programDropdownItems.js'

/** Bookable programme lines (exclude hub link). */
const PROGRAM_BOOKING_ITEMS = PROGRAM_DROPDOWN_ITEMS.filter(
  (item) => String(item.label ?? '').trim() !== 'All Programs',
)

/** @param {{ label: string, href?: string }[]} items */
function bookingOptionsFromNavItems(items) {
  return items.map((item) => {
    const label = String(item.label ?? '').trim()
    return { value: label, label }
  })
}

/**
 * Service dropdown on contact / booking / reviews — programmes + Weight, Skin, Hair nav catalog.
 * `value` is the human-readable label (stored in DB / email).
 */
export const BOOKING_SERVICE_GROUPS = [
  { group: 'Programs', options: bookingOptionsFromNavItems(PROGRAM_BOOKING_ITEMS) },
  { group: 'Weight loss', options: bookingOptionsFromNavItems(WEIGHT_DROPDOWN_ITEMS) },
  { group: 'Skin', options: bookingOptionsFromNavItems(SKIN_DROPDOWN_ITEMS) },
  { group: 'Hair', options: bookingOptionsFromNavItems(HAIR_DROPDOWN_ITEMS) },
]

/** Flat list (order: weight → skin → hair) for components that iterate a single array */
export const BOOKING_SERVICES = BOOKING_SERVICE_GROUPS.flatMap((g) => g.options)

/** Preferred reply channel for contact form */
export const CONTACT_SUBMIT_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
]
