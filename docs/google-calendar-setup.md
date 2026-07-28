# Google Calendar + Sheets setup (bookings)

Bookings taken on the site become **events on a Google Calendar**, and every
submission is also appended to a **Google Sheet ledger**. One service account
covers both.

This replaced Airtable, whose free-plan monthly API-call cap kept lapsing and
silently left the site serving stale data. A service-account key **does not
expire**, which is the whole point — there is nothing to renew each month.

Total time: about 15 minutes, once.

---

## 1. Google Cloud project

1. Open <https://console.cloud.google.com/> and pick the project that already
   holds `GOOGLE_MAPS_API_KEY` (the one used for review syncing), or create a
   new one.
2. **APIs & Services → Library**, then enable **both**:
   - Google Calendar API
   - Google Sheets API

   Enabling one does not enable the other. Missing either shows up later as
   `403 accessNotConfigured`.

## 2. Service account

1. **IAM & Admin → Service Accounts → Create service account**.
2. Name it something like `tallest-bookings`. Note the generated email —
   `tallest-bookings@<project>.iam.gserviceaccount.com`.
3. **Skip the "grant this service account access to the project" step.** It
   needs no IAM roles at all; access comes from sharing the calendar and the
   sheet with it, which keeps its reach to exactly those two files.
4. Open the account → **Keys → Add key → Create new key → JSON**. A file
   downloads. **Do not put it in the repo.**

## 3. The Bookings calendar

1. In Google Calendar, **Create new calendar** named `Bookings`.
2. Set its **time zone to Europe/Sarajevo**. This matters: the site reads
   event dates back out, and a different zone produces off-by-one dates
   around midnight. (The code logs a warning if it ever finds a mismatch.)
3. **Settings → Share with specific people or groups → Add people** → paste
   the service-account email → permission **"Make changes to events"**.
4. Scroll to **Integrate calendar** and copy the **Calendar ID**. It looks
   like `c_a1b2c3...@group.calendar.google.com`.

Do **not** use `primary` as the calendar ID — that would be the service
account's own calendar, which no human can see.

## 4. The ledger sheet

1. Create a spreadsheet named `Bookings ledger`.
2. Rename the first tab to exactly **`Bookings`**.
3. Paste this as row 1:

   ```
   bookedAt  bookingId  tourSlug  tourName  tourDate  startTime  numPeople  language  tourType  guestName  guestEmail  guestPhone  totalPrice  discountCode  accommodation  calendarStatus  eventId
   ```

4. **Share → add the service-account email as Editor.**
5. Copy the spreadsheet ID out of the URL:
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.

## 5. A second, throwaway pair for local development

Repeat steps 3 and 4 for a `Bookings (dev)` calendar and a dev sheet, shared
with the same service account.

Local `npm run dev` writes real events. Without a separate dev calendar,
every booking you make while testing lands on your actual calendar and holds
seats that were never sold.

## 6. Environment variables

Base64 the key file onto a single line:

```sh
base64 -i ~/Downloads/your-key.json | tr -d '\n'
```

It has to be one line because the `.env` parser is single-line and a PEM is
28 lines. Before encoding you can delete everything except `client_email` and
`private_key` — those are the only fields read, and it halves the value.

**Local `.env`** (dev calendar + dev sheet):

```
GOOGLE_SA_KEY_B64=<the base64 blob>
GOOGLE_CALENDAR_ID=<dev calendar id>
GOOGLE_SHEET_ID=<dev sheet id>
```

**Netlify → Site configuration → Environment variables** (real calendar +
real sheet): the same three names.

## 7. Check it works

```sh
node -e "Promise.all([import('./netlify/functions/_lib/google-auth.mjs'),
                      import('./netlify/functions/_lib/gcal.mjs'),
                      import('./netlify/functions/_lib/gsheet.mjs')]).then(async ([a, c, s]) => {
  const sa = a.parseServiceAccount(process.env.GOOGLE_SA_KEY_B64)
  console.log('service account:', sa && sa.clientEmail)
  console.log('token ok:', !!(await a.getAccessToken(sa)))
  console.log('calendar:', await c.fetchAvailability({ sa, calendarId: process.env.GOOGLE_CALENDAR_ID }))
  console.log('sheet:', await s.appendBookingRow({ sa, sheetId: process.env.GOOGLE_SHEET_ID,
    booking: { bookingId: 'smoke-test', tourSlug: 'x', tourDate: '2026-01-01', numPeople: 1 },
    result: { calendarStatus: 'smoke-test' } }))
})"
```

Run it with the env vars loaded. It exercises the base64 decode, the RS256
signing, the token endpoint, both scopes, and both share permissions. Delete
the smoke-test row from the sheet afterwards.

Then `npm run dev`, book something, and confirm the event appears on the dev
calendar and a row appears in the dev sheet.

---

## How it behaves day to day

**Every event the site writes holds a seat, immediately.** There is no
pending/confirmed step — a booking that doesn't hold its seat until you
confirm it is just an overselling risk.

| You do this in Google Calendar | What happens on the site |
|---|---|
| Delete or cancel the event | The seats are released |
| Drag it to another day | The booking moves with it — reschedules just work |
| Create an event by hand | Ignored. Your own diary entries never eat seats |
| Edit the head count in the text | **Nothing.** See below |

The head count lives in hidden event properties, not in the text you can see,
so retyping the description doesn't change it. To change a booking's size,
delete the event and record the seats under **/admin → Availability →
External bookings**.

**Moving an event to a different calendar** takes it out of view entirely and
releases the seats — same as deleting it.

### The one rule that catches people out

- The **calendar** holds bookings taken **on the site**.
- **/admin → Availability → External bookings** holds seats sold **elsewhere**
  (Viator, GetYourGuide, WhatsApp).

Putting the same booking in both double-counts it and quietly costs you a
seat.

### The ledger is not a cancellation record

Rows are only ever appended, so a row stays put even after you delete the
event. That's deliberate — it's a permanent record of what was submitted, not
a live view. If you reconcile revenue from it, check against the calendar
rather than counting rows.

Nothing in the codebase reads the sheet, so you can sort it, filter it, add
columns **to the right**, and build pivot tables on it freely. Don't insert
columns in the middle: historic rows would stop lining up with their headers.

---

## When something is wrong

| Symptom | Cause |
|---|---|
| `403 accessNotConfigured` | Calendar API or Sheets API not enabled on the service account's project |
| `404 notFound` | The calendar or sheet wasn't shared with the service-account email (sharing can take a couple of minutes to propagate) |
| `401` on every call | The key was deleted or the service account disabled |
| Availability shows everything as free | The endpoint is failing open — check the function logs. OTA bookings from `/admin` still apply |
| Dates off by one near midnight | The calendar's time zone isn't Europe/Sarajevo |
| Admin email says **NOT SAVED TO CALENDAR** | Google was unreachable when that booking came in. The seats are **not** being held — add the event by hand. The guest was already told they're booked |

`npm run test:gcal` re-runs the offline checks (event shape, DST, capacity,
write order) without needing credentials or a network.

---

## Security note

The key never expires, which is the feature and also the risk: a leaked build
log is a permanent compromise. The code never logs it — only the service
account's email address. If it ever does leak, delete the key in the Cloud
console and generate a new one; the calendar and sheet stay put.
