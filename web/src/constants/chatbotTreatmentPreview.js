import { SKIN_DROPDOWN_ITEMS } from './skinTreatments.js'
import { WEIGHT_DROPDOWN_ITEMS, WEIGHT_LOSS_TREATMENTS } from './weightTreatments.js'

/** Light loop preview for skin-line labels (matches site imagery). */
const SKIN_PREVIEW_IMAGE = 'https://www.lifescc.com/img/agei.png'
const HAIR_PREVIEW_IMAGE = 'https://www.lifescc.com/img/loss.jpg'

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Preview image for a navbar service label (Weight line uses WEIGHT_LOSS_TREATMENTS).
 * @returns {{ image: string, title: string } | null}
 */
export function getChatbotTreatmentPreview(serviceLabel) {
  const label = String(serviceLabel || '').trim()
  if (!label) return null

  const n = norm(label)
  for (const t of WEIGHT_LOSS_TREATMENTS) {
    const tn = norm(t.title)
    if (tn && (n === tn || n.includes(tn) || tn.includes(n))) {
      return { image: t.image, title: t.title }
    }
  }

  for (const item of WEIGHT_DROPDOWN_ITEMS) {
    if (norm(item.label) === n || n.includes(norm(item.label)) || norm(item.label).includes(n)) {
      const match = WEIGHT_LOSS_TREATMENTS.find(
        (t) => norm(t.title) === norm(item.label) || norm(t.title).includes(norm(item.label))
      )
      if (match) return { image: match.image, title: match.title }
    }
  }

  for (const item of SKIN_DROPDOWN_ITEMS) {
    const ln = norm(item.label)
    if (ln && (n === ln || n.includes(ln) || ln.includes(n))) {
      return { image: SKIN_PREVIEW_IMAGE, title: item.label }
    }
  }

  if (n.includes('skin') || n.includes('facial') || n.includes('tan') || n.includes('acne') || n.includes('laser')) {
    return { image: SKIN_PREVIEW_IMAGE, title: label }
  }

  if (n.includes('hair') || n.includes('service 3')) {
    return { image: HAIR_PREVIEW_IMAGE, title: label }
  }

  if (n.includes('weight')) {
    return {
      image: 'https://www.lifescc.com/img/loss.jpg',
      title: 'Weight',
    }
  }

  return null
}
