/**
 * Default treatment picker: Weight, Skin, Hair (three lines).
 * Service labels must stay in sync with `CustomChatbotRepository::defaultServiceCatalogLabels()` in PHP.
 */
import { HAIR_DROPDOWN_ITEMS } from './navbarDropdownItems.js'
import { SKIN_DROPDOWN_ITEMS } from './skinTreatments.js'
import { WEIGHT_DROPDOWN_ITEMS } from './weightTreatments.js'

export const LIFESCC_DEFAULT_SERVICE_CATALOG = [
  {
    id: 'weight',
    label: 'Weight',
    services: WEIGHT_DROPDOWN_ITEMS.map((i) => ({ label: i.label, path: i.href })),
  },
  {
    id: 'skin',
    label: 'Skin',
    services: SKIN_DROPDOWN_ITEMS.map((i) => ({ label: i.label, path: i.href })),
  },
  {
    id: 'hair',
    label: 'Hair',
    services: HAIR_DROPDOWN_ITEMS.map((i) => ({ label: i.label, path: i.href })),
  },
]

/** Top-level catalog labels (Weight, Skin, Hair). Sync with PHP `defaultServiceCatalogCategoryLabels()`. */
export function getDefaultCatalogSegmentLabels() {
  return LIFESCC_DEFAULT_SERVICE_CATALOG.map((c) => String(c.label || '').trim()).filter(Boolean)
}

/** Legacy `default` is treated as full treatment picker. */
export function isServicesCatalogTreatmentsMode(catalog) {
  const c = String(catalog || '')
  return c === 'treatments' || c === 'default'
}

export function isServicesCatalogSegmentsMode(catalog) {
  return String(catalog || '') === 'segments'
}

/** @returns {string[]} */
export function getDefaultCatalogServiceLabels() {
  const out = []
  for (const cat of LIFESCC_DEFAULT_SERVICE_CATALOG) {
    for (const s of cat.services || []) {
      if (s.label) out.push(String(s.label))
    }
  }
  return out
}

export function findDefaultCatalogService(label) {
  const want = String(label || '').trim()
  for (const cat of LIFESCC_DEFAULT_SERVICE_CATALOG) {
    for (const s of cat.services || []) {
      if (String(s.label).trim() === want) return { ...s, categoryLabel: cat.label }
    }
  }
  return null
}

/** Rows for admin: each default catalog service with its default path. */
export function getDefaultCatalogServiceRows() {
  const rows = []
  for (const cat of LIFESCC_DEFAULT_SERVICE_CATALOG) {
    for (const s of cat.services || []) {
      rows.push({
        categoryLabel: cat.label,
        label: s.label,
        defaultPath: s.path,
      })
    }
  }
  return rows
}

/** Distinct paths from the default catalog (for “service page” dropdowns). */
export function getUniqueServicePagePaths() {
  const seen = new Set()
  for (const cat of LIFESCC_DEFAULT_SERVICE_CATALOG) {
    for (const svc of cat.services || []) {
      const p = String(svc.path || '').trim()
      if (p) seen.add(p)
    }
  }
  return [...seen].sort((a, b) => a.localeCompare(b))
}
