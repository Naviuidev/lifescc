/** Tracking / goal badges (GA events, pixels, etc.) — stored on the blog post. */
export const BLOG_ANALYTICS_BADGE_OPTIONS = [
  'Page views',
  'Lead capture',
  'Conversion tracking',
  'Newsletter signup',
  'Remarketing',
]

/**
 * Form field badges: which inputs the public lead/analytics form will show.
 * Keys are stored in `analytics_field_keys_json` and must match the PHP catalog.
 */
export const BLOG_ANALYTICS_FIELD_BADGES = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'message', label: 'Message' },
]
