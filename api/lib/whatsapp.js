const GRAPH_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0';
const GROQ_TRANSCRIPTION_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;

function requireWhatsAppConfig() {
  if (!process.env.WHATSAPP_TOKEN || !process.env.PHONE_NUMBER_ID) {
    throw new Error('WhatsApp Cloud API is not configured');
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, { ...options, signal: options.signal || AbortSignal.timeout(20000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `WhatsApp/Meta API returned HTTP ${response.status}`);
  return data;
}

async function transcribeWhatsAppAudio(mediaId) {
  requireWhatsAppConfig();
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is required to transcribe WhatsApp audio');
  if (typeof mediaId !== 'string' || !/^[A-Za-z0-9_-]{5,200}$/.test(mediaId)) throw new Error('Invalid WhatsApp audio media id');

  const token = process.env.WHATSAPP_TOKEN;
  const media = await fetchJson(`https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(mediaId)}`, {
    headers: { Authorization: 'Bearer ' + token }
  });
  let mediaUrl;
  try {
    mediaUrl = new URL(media.url);
  } catch {
    throw new Error('Meta returned an invalid media URL');
  }
  if (mediaUrl.protocol !== 'https:' || !(mediaUrl.hostname.endsWith('.fbcdn.net') || mediaUrl.hostname.endsWith('.fbsbx.com'))) {
    throw new Error('Meta returned an untrusted media host');
  }
  const audioResponse = await fetch(mediaUrl, {
    headers: { Authorization: 'Bearer ' + token },
    redirect: 'error',
    signal: AbortSignal.timeout(20000)
  });
  if (!audioResponse.ok) throw new Error(`Could not download WhatsApp audio (HTTP ${audioResponse.status})`);
  const bytes = Buffer.from(await audioResponse.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_AUDIO_BYTES) throw new Error('WhatsApp audio must be between 1 byte and 25 MB');
  const type = (media.mime_type || audioResponse.headers.get('content-type') || 'audio/ogg').split(';')[0];
  const ext = ({ 'audio/ogg': 'ogg', 'audio/mpeg': 'mp3', 'audio/mp4': 'm4a', 'audio/wav': 'wav', 'audio/webm': 'webm' })[type] || 'ogg';
  const form = new FormData();
  form.set('model', 'whisper-large-v3');
  form.set('response_format', 'json');
  form.set('file', new Blob([bytes], { type }), `whatsapp-audio.${ext}`);
  const response = await fetch(GROQ_TRANSCRIPTION_URL, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.GROQ_API_KEY },
    body: form,
    signal: AbortSignal.timeout(60000)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || `Groq transcription failed (HTTP ${response.status})`);
  const text = String(result.text || '').trim();
  if (!text) throw new Error('Groq returned an empty transcription');
  return text.slice(0, 10000);
}

async function sendWhatsAppMessage(to, text) {
  requireWhatsAppConfig();
  if (typeof to !== 'string' || !/^\+?\d{8,15}$/.test(to)) throw new Error('Invalid WhatsApp recipient');
  const apiUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(process.env.PHONE_NUMBER_ID)}/messages`;
  return fetchJson(apiUrl, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.WHATSAPP_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: String(text || '').slice(0, 4000) }
    })
  });
}

module.exports = { sendWhatsAppMessage, transcribeWhatsAppAudio };
