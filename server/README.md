# SV Developers — Leads API

Backend for the **Aurora** brochure lead-capture flow.

```
Website form  →  Backend API  →  Google Sheet  →  Email sent
```

Node.js + Express + TypeScript. Every lead is appended as a row to a Google Sheet the sales team already knows how to use (filter, download to Excel, add a Notes column), and a brochure email is sent automatically from **marketing@svdevelopers.in** with the PDF attached.

## Why Google Sheets

- Sales team just opens the Sheet — no training, no admin panel to learn.
- Filter by project/date, sort, download as Excel/CSV, add their own columns (Notes, Status, Owner).
- The API still has a JWT-protected `GET /api/leads` if you want to read leads programmatically too.

### Sheet layout
Row 1 is written automatically on first submission:

| Timestamp | Name | Email | Phone | Project | IP |
|-----------|------|-------|-------|---------|----|

## Folder structure

```
server/
├─ src/
│  ├─ config/env.ts             # typed env loader
│  ├─ routes/index.ts           # /api routes
│  ├─ controllers/              # request handlers
│  ├─ services/
│  │  ├─ sheetsService.ts       # Google Sheets read/append/dedupe
│  │  ├─ leadService.ts         # thin domain layer over sheets
│  │  └─ emailService.ts        # Nodemailer + PDF attachment
│  ├─ middleware/               # auth, rate limit, error handler
│  ├─ validators/lead.ts        # zod validation + sanitization
│  ├─ app.ts                    # express app (helmet, cors, json)
│  └─ index.ts                  # entrypoint
├─ assets/aurora-brochure.pdf   # the PDF emailed to leads (replace this)
├─ .env.example
└─ package.json
```

## One-time Google setup

1. In **Google Cloud Console**, create a project and **enable the Google Sheets API**.
2. Create a **Service Account**, then add a **JSON key** → download it.
3. Create a Google Sheet. **Share it** with the service account's email (the `client_email` in the JSON) with **Editor** access.
4. Copy the spreadsheet ID from its URL (`docs.google.com/spreadsheets/d/<THIS_PART>/edit`).
5. Fill `.env`:
   - `GOOGLE_SHEET_ID` = the id from step 4
   - `GOOGLE_CLIENT_EMAIL` = `client_email` from the JSON
   - `GOOGLE_PRIVATE_KEY` = `private_key` from the JSON, on one line with literal `\n`, wrapped in quotes

## Setup & run

```bash
cd server
cp .env.example .env          # fill in Google + SMTP + admin values
npm install
npm run dev                   # http://localhost:4000
```

Place the brochure PDF at `BROCHURE_PATH` (default `./assets/aurora-brochure.pdf`). If missing, the email still sends without the attachment.

### Email (marketing@svdevelopers.in)
Set `SMTP_USER=marketing@svdevelopers.in` and an **App Password** in `SMTP_PASS` (for Google Workspace: Account → Security → App passwords). Credentials live only in `.env`, never in code.

## API

### `POST /api/brochure-download`  (public, rate-limited 5/15min/IP)
```json
{ "name": "John Doe", "email": "john@example.com", "phone": "+919945586527", "project": "Aurora" }
```
Flow: validate + sanitize → dedupe (same email+project within 30 min) → **append row to the Sheet** → email brochure → respond. A mail failure never loses the row.

```json
{ "ok": true, "message": "Thank you. The Aurora brochure has been sent to your email.", "emailed": true }
```

### `POST /api/auth/login`  →  `{ token }`  (admin, for `GET /api/leads`)
### `GET /api/leads`  (admin, `Authorization: Bearer <token>`) — all rows, newest first.

## Security
Helmet headers · CORS locked to `CORS_ORIGIN` · rate limiting on public + login routes · server-side zod validation & sanitization · duplicate-spam window · JWT admin auth · secrets only in env · 10kb body cap.

## Connecting the frontend
The React `BrochureModal` posts to `/api/brochure-download`. The dev proxy in `vite.config.ts` already forwards `/api` → `http://localhost:4000`. For production set `VITE_API_BASE` to the deployed API URL and add that origin to `CORS_ORIGIN`.
```
