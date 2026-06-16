import imgCoolsculpting from '../assets/cools1Img.jpg'
import imgLiposuction from '../assets/t3.png'
import imgZimmer from '../assets/zimmer1.jpg'
import imgInchLoss from '../assets/t6.jpg'
import imgCryolipolysis from '../assets/t4.jpg'
import imgFigureCorrection from '../assets/t1.png'

/** Home page treatment cards (images + anchors for deep links). */
export const WEIGHT_LOSS_TREATMENTS = [
  {
    slug: 'wlt-coolsculpting',
    title: 'Coolsculpting',
    image: imgCoolsculpting,
    to: '/coolsculpting',
  },
  {
    slug: 'wlt-nonsurgical-liposuction',
    title: 'Non Surgical Liposuction',
    image: imgLiposuction,
    to: '/non-surgical-liposuction',
  },
  {
    slug: 'wlt-zimmer',
    title: 'Zimmer',
    image: imgZimmer,
    to: '/zimmer',
  },
  {
    slug: 'wlt-inch-loss',
    title: 'Inch Loss',
    image: imgInchLoss,
    to: '/inch-loss',
  },
  {
    slug: 'wlt-cryolipolysis',
    title: 'Cryolipolysis Treatment',
    image: imgCryolipolysis,
    to: '/cryolipolysis',
  },
  {
    slug: 'wlt-figure-correction',
    title: 'Figure Correction',
    image: imgFigureCorrection,
    to: '/figure-correction',
  },
]

/**
 * Full Weight nav dropdown (order matches site menu).
 * Items without a card yet scroll to the Weight Loss section.
 */
export const WEIGHT_DROPDOWN_ITEMS = [
  { label: 'Weight Loss', href: '/weight-loss-treatment' },
  { label: 'Coolsculpting', href: '/coolsculpting' },
  { label: 'Zimmer', href: '/zimmer' },
  { label: 'Non Surgical Liposuction', href: '/non-surgical-liposuction' },
  { label: 'Inch Loss', href: '/inch-loss' },
  { label: 'Figure Correction', href: '/figure-correction' },
  { label: 'Cool Mini', href: '/cool-mini' },
  { label: 'HIFU Liposonix', href: '/hifu-liposonix' },
  { label: 'BMI Overview', href: '/bmi' },
  { label: 'Cryolipolysis Treatment', href: '/cryolipolysis' },
]
