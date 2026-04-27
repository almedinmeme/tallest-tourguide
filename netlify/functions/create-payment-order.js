const crypto = require('crypto')

const MONRI_AUTHENTICITY_TOKEN = process.env.MONRI_AUTHENTICITY_TOKEN
const MONRI_KEY = process.env.MONRI_KEY
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

function sha512hex(str) {
  return crypto.createHash('sha512').update(str).digest('hex')
}

function hmacSha256hex(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest('hex')
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const {
    tourSlug,
    tourName,
    tourDate,
    startTime,
    numPeople,
    totalPrice,
    guestName,
    guestEmail,
    guestPhone,
    discountCode,
    tourType,
    tourLanguage,
    cancelUrl,
  } = body

  if (!tourSlug || !tourName || !totalPrice || !guestName || !guestEmail) {
    return { statusCode: 400, body: 'Missing required fields' }
  }

  const orderNumber = crypto.randomUUID().replace(/-/g, '')
  const amountCents = Math.round(Number(totalPrice) * 100)

  await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Bookings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        TourSlug: tourSlug,
        TourName: tourName,
        TourDate: tourDate,
        StartTime: startTime || '',
        NumPeople: Number(numPeople) || 1,
        TourType: tourType || 'shared',
        Language: tourLanguage || '',
        TotalPrice: Number(totalPrice),
        GuestName: guestName,
        GuestEmail: guestEmail,
        GuestPhone: guestPhone || '',
        DiscountCode: discountCode || '',
        Status: 'AwaitingPayment',
        MonriOrderId: orderNumber,
      },
    }),
  }).then((r) => {
    if (!r.ok) r.text().then((t) => console.error('Airtable write error:', t))
  })

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const innerHash = sha512hex(
    timestamp + MONRI_AUTHENTICITY_TOKEN + orderNumber + amountCents.toString()
  )
  const digest = hmacSha256hex(MONRI_KEY, 'WP3-v2:' + innerHash)

  const monriRes = await fetch('https://ipg.monri.com/v2/payment/new', {
    method: 'POST',
    headers: {
      Authorization: `WP3-v2 ${MONRI_AUTHENTICITY_TOKEN}:${digest}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transaction: {
        order_number: orderNumber,
        amount: amountCents,
        currency: 'EUR',
        order_info: tourName,
        ch_full_name: guestName,
        ch_email: guestEmail,
        ch_phone: guestPhone || '',
        ch_address: '',
        ch_city: 'Sarajevo',
        ch_zip: '',
        ch_country: 'BA',
        success_url: `https://tallesttourguide.com/booking-success?order_number=${orderNumber}`,
        cancel_url: cancelUrl || 'https://tallesttourguide.com/tours',
        language: 'en',
        callback_url: 'https://tallesttourguide.com/.netlify/functions/monri-webhook',
      },
    }),
  })

  if (!monriRes.ok) {
    const errText = await monriRes.text()
    console.error('Monri error:', monriRes.status, errText)
    return { statusCode: 502, body: 'Payment provider error' }
  }

  const monriData = await monriRes.json()
  const paymentId = monriData.id
  if (!paymentId) {
    console.error('No payment ID in Monri response:', JSON.stringify(monriData))
    return { statusCode: 502, body: 'Payment provider returned no payment ID' }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      redirectUrl: `https://ipg.monri.com/v2/payment/${paymentId}/new`,
    }),
  }
}
