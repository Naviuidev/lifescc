/** Home page treatment cards (images + anchors for deep links). */
export const WEIGHT_LOSS_TREATMENTS = [
  {
    slug: 'wlt-coolsculpting',
    title: 'Coolsculpting',
    image: 'https://www.lifescc.com/img/cools1.jpeg',
    to: '/coolsculpting',
  },
  {
    slug: 'wlt-nonsurgical-liposuction',
    title: 'Non Surgical Liposuction',
    image: 'https://www.lifescc.com/img/t3.png',
    to: '/non-surgical-liposuction',
  },
  {
    slug: 'wlt-zimmer',
    title: 'Zimmer',
    image: 'https://www.lifescc.com/img/loss.jpg',
    to: '/zimmer',
  },
  {
    slug: 'wlt-inch-loss',
    title: 'Inch Loss',
    image: 'https://www.lifescc.com/img/t6.png',
    to: '/inch-loss',
  },
  {
    slug: 'wlt-cryolipolysis',
    title: 'Cryolipolysis Treatment',
    image: 'https://www.lifescc.com/img/t4.jpg',
    to: '/cryolipolysis',
  },
  {
    slug: 'wlt-figure-correction',
    title: 'Figure Correction',
    image: 'https://www.lifescc.com/img/t1.png',
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
