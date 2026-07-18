// Single place every form sends email through.
//
// EmailJS's free plan allows 2 templates per account, so the site spans two
// accounts (which also doubles the 200 emails/month allowance):
//   account 1 (existing) — booking admin notification + customer confirmation
//   account 2            — general enquiry + personalised tour request
// emailjs.send() accepts a per-call { publicKey }, so no global init is
// needed and each template can live on its own account.
import emailjs from '@emailjs/browser'

// Each env var is referenced as a full `import.meta.env.VITE_…` expression:
// Vite only inlines the vars named this way. Never alias import.meta.env to
// a variable here — that inlines EVERY env var into the public bundle.
const ACCOUNT_1 = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const ACCOUNT_2 = {
  service: import.meta.env.VITE_EMAILJS2_SERVICE_ID,
  publicKey: import.meta.env.VITE_EMAILJS2_PUBLIC_KEY,
}

const TEMPLATES = {
  // Booking flow (checkout) — params: tour_name, tour_date, num_people,
  // guest_name, guest_email, guest_phone, total_price, payment_method, …
  bookingAdmin: { ...ACCOUNT_1, template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID },
  bookingConfirmation: { ...ACCOUNT_1, template: import.meta.env.VITE_EMAILJS_CONFIRMATION_TEMPLATE_ID },
  // General enquiry (Contact, Partners, journey enquiry) — params:
  // enquiry_type, subject, from_name, from_email, message.
  enquiry: { ...ACCOUNT_2, template: import.meta.env.VITE_EMAILJS2_ENQUIRY_TEMPLATE_ID },
  // Personalised tour request — structured params: from_name, from_email,
  // phone, traveller_type, group_size, arrival_date, departure_date,
  // duration, places, budget, accommodation, interests, notes, how_heard.
  personalised: { ...ACCOUNT_2, template: import.meta.env.VITE_EMAILJS2_PERSONALISED_TEMPLATE_ID },
}

export function sendEmail(templateName, params) {
  const t = TEMPLATES[templateName]
  if (!t || !t.service || !t.template || !t.publicKey) {
    return Promise.reject(new Error(`Email template not configured: ${templateName}`))
  }
  return emailjs.send(t.service, t.template, params, { publicKey: t.publicKey })
}
