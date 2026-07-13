// Site-wide contact & social settings. Single source of truth is
// src/data/settings.json, edited via the local /admin panel under "Settings".
// Import from here — never hardcode the email/phone/links in components.
import settings from './settings.json'

export const CONTACT_EMAIL = settings.contactEmail
export const PHONE_DISPLAY = settings.phoneDisplay
export const WHATSAPP_URL = `https://wa.me/${settings.whatsappNumber}`
export const INSTAGRAM_URL = settings.instagramUrl
export const TRIPADVISOR_URL = settings.tripadvisorUrl

export default settings
