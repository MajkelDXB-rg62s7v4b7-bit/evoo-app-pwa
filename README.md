# evoo-app-pwa
Evoo AI OS - PWA

## Uruchomienie lokalne

Wymagany Node.js 18 lub nowszy. Aplikacja PWA i endpointy API działają razem z jednego serwera.

1. Skopiuj `.env.example` do `.env` i wklej własne wartości:
   - `EVOO_ACCESS_KEY` — długie, losowe hasło do endpointu czatu.
   - Uzupełnij co najmniej jeden klucz: `GROQ_API_KEY`, `GEMINI_API_KEY` lub `OPENROUTER_API_KEY`.
   - Dla webhooka WhatsApp ustaw `WHATSAPP_VERIFY_TOKEN`; `WHATSAPP_TOKEN` i `PHONE_NUMBER_ID` zachowaj na potrzeby integracji z Graph API.
   - `PORT` domyślnie ma wartość `3000`.
2. Uruchom `npm start`, a następnie otwórz `http://localhost:3000`. Ten sam serwer obsługuje PWA, `POST /api/chat` i webhook `GET/POST /webhook`.
3. Aby wystawić webhook publicznie, w drugim terminalu uruchom `ngrok http 3000`. W konfiguracji webhooka aplikacji Meta podaj adres `https://<domena-ngrok>/webhook`, wklej tę samą wartość `WHATSAPP_VERIFY_TOKEN` jako token weryfikacyjny i zasubskrybuj pole `messages`.

Webhook obecnie weryfikuje adres i loguje przychodzące wiadomości tekstowe w terminalu serwera. Do pracy mikrofonu otwieraj PWA przez `localhost` lub HTTPS. Nie publikuj pliku `.env`.

W trybie lokalnym backend jest własnym serwerem Node.js bez dodatkowych zależności; wdrożenie Vercel nadal może używać funkcji z katalogu `api/`.
