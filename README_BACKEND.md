# Evoo Secure AI Backend

The project has a static vanilla-JavaScript PWA and Node.js API handlers. Run locally using the built-in Node.js server (`npm start`), or deploy the HTTP handlers as Vercel serverless functions. No Express dependency is required. The cron scheduler and local SQLite database require a persistent Node.js process and disk.

It provides:
- one-time upload token generation for provider keys
- encrypted secret storage using AES-GCM with `MASTER_KEY`
- proxy endpoints for model listing and chat completion calls
- Twilio WhatsApp webhook trigger flow
- a Groq → Gemini → OpenRouter fallback router at `POST /api/chat`
- WhatsApp Cloud API verification, text handling, audio transcription and replies at `/webhook`
- Google Calendar/Gmail function tools, SQLite memory and scheduled WhatsApp reminders

Set these environment variables in Vercel or copy `.env.example` to `.env` for local development:
- `EVOO_ACCESS_KEY` = long random secret used to authorize `/api/chat`
- `GROQ_API_KEY` = Groq API key (optional; first fallback provider)
- `GEMINI_API_KEY` = Google AI Studio API key (optional; second fallback provider)
- `OPENROUTER_API_KEY` = OpenRouter API key (optional; final fallback provider)
- `WHATSAPP_VERIFY_TOKEN` = secret chosen when registering the WhatsApp webhook
- `WHATSAPP_TOKEN` = WhatsApp Cloud API access token (for Graph API integrations)
- `PHONE_NUMBER_ID` = WhatsApp Cloud API phone number ID
- `WHATSAPP_APP_SECRET` = Meta app secret for verifying `X-Hub-Signature-256` on webhook POSTs
- `WHATSAPP_API_VERSION` = Meta Graph API version (defaults to `v22.0`)
- `WHATSAPP_RECIPIENT` = optional default recipient for PWA-created reminders
- `EVOO_APP_ORIGIN` = allowed PWA origin when hosting the frontend separately (optional)
- `PORT` = local server port (defaults to `3000`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` = Google OAuth credentials with Calendar events and Gmail send scopes
- `GOOGLE_CALENDAR_ID` = calendar ID (defaults to `primary`)
- `GMAIL_USER` = Gmail account ID (defaults to `me`)
- `MEMORY_DB_PATH` = SQLite database file (defaults to `./data/evoo.sqlite`)

At least one AI provider key is required. The chat endpoint requires `EVOO_ACCESS_KEY`; the PWA sends it in the standard Authorization header when connecting to the server. Keep provider keys and the access key in Vercel settings; do not put them in frontend files.

The WhatsApp Cloud API callback URL is `https://your-app.vercel.app/webhook`. Set the same `WHATSAPP_VERIFY_TOKEN` in Meta's webhook configuration and configure `WHATSAPP_APP_SECRET` to validate POST signatures. Text and audio messages are passed to Witch Router; audio is downloaded from Meta, transcribed using `whisper-large-v3`, and replied to through Cloud API.

For local startup, copy `.env.example` to `.env`, fill in `EVOO_ACCESS_KEY`, at least one AI provider key and WhatsApp credentials including `WHATSAPP_APP_SECRET`, then run `npm install && npm start` and open `http://localhost:3000`. To receive Meta webhooks locally, configure the ngrok CLI auth token, run `ngrok http 3000`, and register `https://<ngrok-domain>/webhook` with the same verify token. The PWA is served by the same Node.js process.

Google tools use OAuth refresh credentials and are only offered when all three Google OAuth variables are configured. Reminders poll SQLite once per minute; keep the server online. For production, use a persistent host and durable disk or replace local SQLite with a managed database. Do not rely on a serverless function instance for `node-cron`.

Legacy upload/Twilio integration environment variables:
- `MASTER_KEY` = base64-encoded 32 byte key
- `BASE_URL` = https://your-app.vercel.app
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM` = `whatsapp:+123456789`

Examples:
- Generate a key locally:
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Then set it in Vercel project settings > Environment Variables.

Core API routes:
- `GET /api/chat` (authorized configuration check)
- `POST /api/chat`
- `GET /webhook` (WhatsApp verification)
- `POST /webhook` (WhatsApp inbound messages)
- `POST /api/request-upload`
- `GET /api/upload-secret?tok=...`
- `POST /api/upload-secret?tok=...`
- `POST /api/proxy/models`
- `POST /api/proxy/chat`
- `POST /api/webhook/twilio`

If the PWA is hosted on a different domain from the API, set `window.EVOO_CHAT_API` in `final/config.js` to the API origin and `EVOO_APP_ORIGIN` to the exact PWA origin. The chat endpoint is authenticated; use HTTPS and rotate access/provider keys if exposed.

This is a practical MVP for a single-user use case. For production use, add persistent audit storage and a secure secret manager.
