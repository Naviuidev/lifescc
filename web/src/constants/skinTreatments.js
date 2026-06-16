/**
 * Skin line — nav dropdown (order matches reference menu).
 * Dedicated pages use their own path; others use `/skin/:slug` until built out.
 */
export const SKIN_DROPDOWN_ITEMS = [
  { label: 'Hydra Facial', slug: 'hydrafacial', href: '/hydrafacial' },
  { label: 'Anti Ageing', slug: 'anti-ageing', href: '/anti-ageing' },
  { label: 'Anti Tan', slug: 'anti-tan', href: '/anti-tan' },
  { label: 'Acne Scar', slug: 'acne-scar', href: '/acne-scar' },
  { label: 'Stretch Marks', slug: 'stretch-marks', href: '/stretch-marks' },
  { label: 'Skin Lightening', slug: 'skin-lightening', href: '/skin-lightening' },
  { label: 'Skin Tightening', slug: 'skin-tightening', href: '/skin-tightening' },
  { label: 'Skin Pigmentation', slug: 'skin-pigmentation', href: '/skin-pigmentation' },
  { label: 'Laser Hair Removal', slug: 'laser-hair-removal', href: '/laser-hair-removal' },
  { label: 'Acne/Pimple Treatment', slug: 'acne-pimple-treatment', href: '/acne-pimple-treatment' },
  { label: 'Qlaser', slug: 'qlaser', href: '/qlaser' },
  { label: 'Medifacial', slug: 'medifacial', href: '/medifacial' },
]

const SLUG_TO_LABEL = Object.fromEntries(SKIN_DROPDOWN_ITEMS.map((i) => [i.slug, i.label]))

export function skinTreatmentLabelFromSlug(slug) {
  return SLUG_TO_LABEL[String(slug ?? '').trim()] ?? null
}

/** Stable `source_page` for `/api/skin-details` from route slug (`anti-tan` → `anti_tan`). */
export function skinSourcePageFromSlug(slug) {
  const s = String(slug ?? '').trim()
  if (!s) return 'skin_treatment'
  return s.replace(/-/g, '_')
}
