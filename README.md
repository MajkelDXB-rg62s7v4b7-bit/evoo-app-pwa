# evoo-app-pwa
Evoo AI OS - PWA

## Uruchomienie lokalne

Wymagany Node.js 20 lub nowszy. Aplikacja PWA i endpointy API działają razem z jednego serwera.

1. Skopiuj `.env.example` do `.env` i wklej własne wartości:
   - `EVOO_ACCESS_KEY` — długie, losowe hasło do endpointu czatu.
   - Uzupełnij co najmniej jeden klucz: `GROQ_API_KEY`, `GEMINI_API_KEY` lub `OPENROUTER_API_KEY`.
   - Dla webhooka i audio WhatsApp ustaw `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_TOKEN` oraz `PHONE_NUMBER_ID`.
   - Dla Calendar/Gmail ustaw OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` i `GOOGLE_REFRESH_TOKEN`; token musi mieć zakresy Calendar events oraz Gmail send.
   - `PORT` domyślnie ma wartość `3000`; SQLite zapisuje bazę pod `MEMORY_DB_PATH` (domyślnie `./data/evoo.sqlite`).
2. Wykonaj `npm install`, potem `npm start`, a następnie otwórz `http://localhost:3000`. Ten sam serwer obsługuje PWA, `POST /api/chat` i webhook `GET/POST /webhook`.
3. Zainstaluj ngrok CLI i skonfiguruj token konta poleceniem `ngrok config add-authtoken <token-z-ngrok>`. Przy uruchomionym serwerze otwórz drugi terminal i wykonaj `ngrok http 3000`.
4. W konfiguracji webhooka aplikacji Meta podaj adres `https://<domena-ngrok>/webhook` wyświetlony przez ngrok, wklej tę samą wartość `WHATSAPP_VERIFY_TOKEN` jako token weryfikacyjny i zasubskrybuj pole `messages`.

Webhook weryfikuje adres i podpis Meta, przekazuje tekst do Witch Routera, a audio pobiera z Meta i transkrybuje modelem Groq Whisper. Odpowiedzi wysyła przez WhatsApp Cloud API. Przypomnienia są wysyłane przez `node-cron`, gdy proces serwera działa. Do pracy mikrofonu otwieraj PWA przez `localhost` lub HTTPS. Nie publikuj pliku `.env`.

Frontend pozostaje statycznym PWA JavaScript z istniejącym ekranem „Na żywo”, Web Speech API i SpeechSynthesis — repozytorium nie używa React/TSX. Lokalny serwer Node.js hostuje PWA i API. Cron oraz SQLite wymagają trwałego, działającego procesu i dysku; standardowe funkcje serverless nie gwarantują wykonania przypomnień ani trwałości lokalnej bazy.
