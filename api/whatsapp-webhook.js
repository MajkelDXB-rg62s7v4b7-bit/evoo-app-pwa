const { claimInboundMessage, finishInboundMessage } = require('./lib/memory');
const { sendWhatsAppMessage, transcribeWhatsAppAudio } = require('./lib/whatsapp');
const { runWitchRouter } = require('./chat');
const crypto = require('crypto');

function validSignature(req) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  const signature = String(req.headers?.['x-hub-signature-256'] || '');
  const rawBody = req.rawBody;
  if (!secret || !Buffer.isBuffer(rawBody) || !signature.startsWith('sha256=')) return false;
  const expected = Buffer.from(`sha256=${crypto.createHmac('sha256', secret).update(rawBody).digest('hex')}`);
  const supplied = Buffer.from(signature);
  return expected.length === supplied.length && crypto.timingSafeEqual(expected, supplied);
}

async function processMessage(message) {
  if (!['text', 'audio'].includes(message.type)) return;
  const messageId = typeof message.id === 'string' ? message.id : '';
  if (messageId && !claimInboundMessage(messageId)) return;
  let processed = false;
  try {
    const from = String(message.from || '');
    if (!/^\d{8,15}$/.test(from)) throw new Error('WhatsApp sender ID is invalid');
    const text = message.type === 'audio'
      ? await transcribeWhatsAppAudio(message.audio?.id)
      : String(message.text?.body || '').trim();
    if (!text) throw new Error('WhatsApp message is empty');

    const system = [
      'Jesteś Evoo, asystentką AI odpowiadającą po polsku, zwięźle i konkretnie.',
      'Wiadomości z WhatsApp traktuj jako polecenia użytkownika. Używaj narzędzi tylko wtedy, gdy prośba jasno autoryzuje daną czynność.',
      'Nie twierdź, że wydarzenie, e-mail lub przypomnienie zostało utworzone, jeśli narzędzie zwróciło błąd.'
    ].join('\n');
    const result = await runWitchRouter([
      { role: 'system', content: system },
      { role: 'user', content: message.type === 'audio' ? `Transkrypcja wiadomości głosowej: ${text}` : text }
    ], { userId: `whatsapp:${from}`, whatsappTo: from });

    if (messageId) finishInboundMessage(messageId, true);
    processed = true;
    await sendWhatsAppMessage(from, result.text);
  } catch (error) {
    const failures = Array.isArray(error.attempts)
      ? error.attempts.map((attempt) => `${attempt.provider}: ${attempt.error}`).join('; ')
      : String(error.message || error).slice(0, 240);
    console.error('WhatsApp inbound processing failed:', failures);
    if (messageId && (processed || error.actionExecuted)) finishInboundMessage(messageId, true);
    else if (messageId) finishInboundMessage(messageId, false);
    try {
      if (message.from && process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID) {
        await sendWhatsAppMessage(message.from, 'Nie udało mi się przetworzyć tej wiadomości. Spróbuj ponownie za chwilę.');
      }
    } catch (sendError) {
      console.error('WhatsApp error reply failed:', String(sendError.message || sendError).slice(0, 160));
    }
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const query = req.query || {};
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (!verifyToken) {
      res.status(503).send('Webhook verification is not configured');
      return;
    }
    if (query['hub.mode'] !== 'subscribe' || query['hub.verify_token'] !== verifyToken || typeof query['hub.challenge'] !== 'string') {
      res.status(403).send('Forbidden');
      return;
    }
    res.status(200).send(query['hub.challenge']);
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }
  if (!validSignature(req)) {
    res.status(process.env.WHATSAPP_APP_SECRET ? 401 : 503).json({
      ok: false,
      error: process.env.WHATSAPP_APP_SECRET ? 'Invalid webhook signature' : 'Webhook signature verification is not configured'
    });
    return;
  }

  const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
  const messages = entries.flatMap((entry) => Array.isArray(entry?.changes) ? entry.changes : [])
    .flatMap((change) => Array.isArray(change?.value?.messages) ? change.value.messages : []);
  for (const message of messages.slice(0, 20)) {
    await processMessage(message);
  }
  res.status(200).json({ ok: true });
};
