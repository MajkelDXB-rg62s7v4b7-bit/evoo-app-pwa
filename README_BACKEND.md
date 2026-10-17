# Evoo Secure AI Backend

This project now includes a minimal secure backend scaffold for Vercel serverless functions.

It provides:
- one-time upload token generation for provider keys
- encrypted secret storage using AES-GCM with `MASTER_KEY`
- proxy endpoints for model listing and chat completion calls
- Twilio WhatsApp webhook trigger flow

Environment variables required in Vercel:
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
- `POST /api/request-upload`
- `GET /api/upload-secret?tok=...`
- `POST /api/upload-secret?tok=...`
- `POST /api/proxy/models`
- `POST /api/proxy/chat`
- `POST /api/webhook/twilio`

This is a practical MVP for a single-user use case. For production use, add auth, persistent DB, and a secure secret manager.
