# Evoo Secure AI Backend

This project uses Vercel Node.js serverless functions (not an Express server) alongside a static, vanilla-JavaScript PWA.

It provides:
- one-time upload token generation for provider keys
- encrypted secret storage using AES-GCM with `MASTER_KEY`
- proxy endpoints for model listing and chat completion calls
- Twilio WhatsApp webhook trigger flow
- a Groq → Gemini → OpenRouter fallback router at `POST /api/chat`
- WhatsApp Cloud API verification and inbound text logging at `/webhook`

Set these environment variables in Vercel (or copy `.env.example` for local development):
- `EVOO_ACCESS_KEY` = long random secret used to authorize `/api/chat`
- `GROQ_API_KEY` = Groq API key (optional; first fallback provider)
- `GEMINI_API_KEY` = Google AI Studio API key (optional; second fallback provider)
- `OPENROUTER_API_KEY` = OpenRouter API key (optional; final fallback provider)
- `WHATSAPP_VERIFY_TOKEN` = secret chosen when registering the WhatsApp webhook
- `EVOO_APP_ORIGIN` = allowed PWA origin when hosting the frontend separately (optional)

At least one AI provider key is required. The chat endpoint requires `EVOO_ACCESS_KEY`; the PWA sends it in the standard Authorization header when connecting to the server. Keep provider keys and the access key in Vercel settings; do not put them in frontend files.

The WhatsApp Cloud API callback URL is `https://your-app.vercel.app/webhook`. Set the same `WHATSAPP_VERIFY_TOKEN` in Meta's webhook configuration. Incoming text messages are written to the serverless function log.

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
