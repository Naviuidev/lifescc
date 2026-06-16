/** Region keys for chatbot grid: pick region, then branch. */
/** Region labels used on the contact page map and for chatbot “cities only” location steps. */
export const LIFESCC_LOCATION_GROUPS = [
  { id: 'hyderabad', label: 'Hyderabad' },
  { id: 'visakhapatnam', label: 'Visakhapatnam' },
  { id: 'andhra-pradesh', label: 'Andhra Pradesh' },
]

/**
 * Lifescc branch locations (Andhra Pradesh & Telangana).
 * Addresses aligned with https://www.lifescc.com/contact-us — coordinates are approximate map pins.
 */
export const LIFESCC_BRANCHES = [
  {
    id: 'gachibowli',
    locationGroup: 'hyderabad',
    name: 'Gachibowli',
    address:
      '1st Floor, Above Airtel Store, M.M Arcade Building, Near ICICI Bank, Vinayak Nagar, Gachibowli, Hyderabad 500032',
    phone: '95 33 44 55 66',
    lat: 17.4409,
    lng: 78.3492,
  },
  {
    id: 'banjara-hills',
    locationGroup: 'hyderabad',
    name: 'Banjara Hills',
    address:
      '2nd Floor, Above SBH Bank, Grand Sitara Hotel Building, Road No 12, Banjara Hills, Hyderabad 500034',
    phone: '95 33 44 55 66',
    lat: 17.4154,
    lng: 78.4342,
  },
  {
    id: 'madhapur',
    locationGroup: 'hyderabad',
    name: 'Madhapur',
    address: '3rd Floor, Above Karachi Bakery, Opp: Pizza Hut, Hi-tech City Road, Madhapur, Hyderabad',
    phone: '95 33 44 55 66',
    lat: 17.4488,
    lng: 78.3905,
  },
  {
    id: 'chandanagar',
    locationGroup: 'hyderabad',
    name: 'Chandanagar',
    address:
      'Yad Kumar Chamber, Above ICICI Bank, Opp RS Brothers, Gangaram, NH-9, Chandanagar, Hyderabad',
    phone: '95 33 44 55 66',
    lat: 17.4954,
    lng: 78.3145,
  },
  {
    id: 'dilsukhnagar',
    locationGroup: 'hyderabad',
    name: 'Dilsukhnagar',
    address:
      '5th Floor, Kontham Ram Reddy Complex, Opp Kothapet Fruit Market, Kothapet, Dilsukhnagar, Hyderabad',
    phone: '95 33 44 55 66',
    lat: 17.3682,
    lng: 78.5248,
  },
  {
    id: 'sr-nagar',
    locationGroup: 'hyderabad',
    name: 'SR Nagar',
    address:
      '1st Floor, Om Plaza, Above Jockey Showroom, Opp Community Hall, SR Nagar, PS Road, Hyderabad',
    phone: '95 33 44 55 66',
    lat: 17.4428,
    lng: 78.4446,
  },
  {
    id: 'himayat-nagar',
    locationGroup: 'hyderabad',
    name: 'Himayat Nagar',
    address:
      '#101, Skill Spectrum Complex, Liberty X Roads, Adj to TTD Kalyanamatapam, Himayat Nagar, Hyderabad 500029',
    phone: '95 33 44 55 66',
    lat: 17.4063,
    lng: 78.4828,
  },
  {
    id: 'vizag',
    locationGroup: 'visakhapatnam',
    name: 'Vizag',
    address:
      'Above SBI, Beside Malabar Gold, Sampath Vinayaka Temple, Asilmetta, Visakhapatnam 530003',
    phone: '95 33 44 55 66',
    lat: 17.7214,
    lng: 83.3163,
  },
  {
    id: 'vijayawada',
    locationGroup: 'andhra-pradesh',
    name: 'Vijayawada',
    address:
      'Lakshmi Avenue, 1st Floor, Srinivasa Nagar Bank Colony, Beside TATA Car Showroom, Vijayawada 520008',
    phone: '95 33 44 55 66',
    lat: 16.5062,
    lng: 80.648,
  },
  {
    id: 'nellore',
    locationGroup: 'andhra-pradesh',
    name: 'Nellore',
    address:
      'Ward No 16-3, Beside Narayana High School Srihari Nagar, Mini Bypass Road Nellore, Andhra Pradesh 524002',
    phone: '95 33 44 55 66',
    lat: 14.4426,
    lng: 79.9865,
  },
  {
    id: 'kukatpally',
    locationGroup: 'hyderabad',
    name: 'Kukatpally',
    address:
      '2nd Floor, Plot No 201, JNTU–Hitech City Road, Above Mandilicious, Dharma Reddy Colony Phase II, Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Telangana 500072',
    phone: '95 33 44 55 66',
    lat: 17.4935,
    lng: 78.3998,
  },
]

export function lifesccLocationGroupLabel(groupId) {
  const id = String(groupId || '').trim()
  if (id === '__all__') return 'Other locations'
  if (!id) return ''
  const hit = LIFESCC_LOCATION_GROUPS.find((g) => g.id === id)
  return hit ? hit.label : id
}

export function googleMapsDirectionsUrl(branch) {
  const dest = `${branch.lat},${branch.lng}`
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
}

/** Embed URL for <iframe> (no Maps JavaScript API key required). */
export function googleMapsEmbedUrl(branch) {
  const q = `${branch.lat},${branch.lng}`
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed&hl=en`
}
