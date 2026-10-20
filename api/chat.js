const crypto = require('crypto');

const PROVIDERS = [
  {
    id: 'groq',
    key: 'GROQ_API_KEY',
    model: 'llama-3.3-70b-versatile',
    url: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'gemini',
    key: 'GEMINI_API_KEY',
    model: 'gemini-2.0-flash',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  },
  {
    id: 'openrouter',
    key: 'OPENROUTER_API_KEY',
    model: 'google/gemini-2.0-flash-exp:free',
    url: 'https://openrouter.ai/api/v1/chat/completions'
  }
];
const MAX_PROMPT_CHARS = 80000;
const MAX_MESSAGES = 30;

function configuredProviders() {
  return PROVIDERS.filter((provider) => process.env[provider.key]?.trim());
}

function authorized(req) {
  const expected = process.env.EVOO_ACCESS_KEY;
  const authorization = String(req.headers?.authorization || '');
  if (!expected || authorization.slice(0, 7).toLowerCase() !== 'bearer ') return false;
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(authorization.slice(7));
  return expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
}

function setCors(req, res) {
  const origin = req.headers?.origin;
  if (process.env.EVOO_APP_ORIGIN && origin === process.env.EVOO_APP_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', process.env.EVOO_APP_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Vary', 'Origin');
    return true;
  }
  return false;
}

function normalizeMessages(body) {
  const messages = Array.isArray(body.messages)
    ? body.messages
    : typeof body.prompt === 'string'
      ? [{ role: 'user', content: body.prompt }]
      : [];
  if (!messages.length || messages.length > MAX_MESSAGES) {
    throw new Error('Provide between 1 and 30 messages');
  }

  const normalized = [];
  if (typeof body.system === 'string' && body.system.trim()) {
    normalized.push({ role: 'system', content: body.system.trim() });
  }

  for (const message of messages) {
    if (!message || typeof message.content !== 'string') {
      throw new Error('Each message must have text content');
    }
    const role = ['system', 'user', 'assistant'].includes(message.role) ? message.role : null;
    if (!role) throw new Error('Unsupported message role');
    if (message.content.trim()) normalized.push({ role, content: message.content.trim() });
  }

  if (!normalized.some((message) => message.role === 'user')) {
    throw new Error('A user message is required');
  }
  if (normalized.reduce((total, message) => total + message.content.length, 0) > MAX_PROMPT_CHARS) {
    throw new Error('Prompt is too large');
  }
  return normalized;
}

async function fetchJson(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error?.message || `Provider returned HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function callProvider(provider, key, messages) {
  if (provider.id === 'gemini') {
    const system = messages.filter((message) => message.role === 'system').map((message) => message.content).join('\n');
    const contents = messages.filter((message) => message.role !== 'system').map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    }));
    const body = { contents, generationConfig: { temperature: 0.8, maxOutputTokens: 8192 } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    const data = await fetchJson(provider.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body)
    });
    return data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  }

  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key };
  if (provider.id === 'openrouter') headers['X-Title'] = 'Evoo AI OS';
  const data = await fetchJson(provider.url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: provider.model, messages, temperature: 0.8, max_tokens: 8192 })
  });
  return data.choices?.[0]?.message?.content || '';
}

module.exports = async function handler(req, res) {
  const corsAllowed = setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(corsAllowed ? 204 : 403).end();
    return;
  }
  const providers = configuredProviders();
  if (req.method === 'GET') {
    if (!process.env.EVOO_ACCESS_KEY || !providers.length) {
      res.status(503).json({ ok: false, error: 'Chat backend is not configured' });
      return;
    }
    if (!authorized(req)) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  if (!authorized(req)) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  if (!providers.length) {
    res.status(503).json({ ok: false, error: 'No AI providers are configured' });
    return;
  }
  if (Number(req.headers?.['content-length']) > 100000) {
    res.status(413).json({ ok: false, error: 'Prompt is too large' });
    return;
  }

  let messages;
  try {
    messages = normalizeMessages(req.body || {});
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
    return;
  }

  const attempts = [];
  for (const provider of providers) {
    try {
      const text = await callProvider(provider, process.env[provider.key], messages);
      if (!text.trim()) throw new Error('Provider returned an empty response');
      res.status(200).json({
        ok: true,
        text,
        provider: provider.id,
        model: provider.model,
        fallbacks: attempts.length
      });
      return;
    } catch (error) {
      attempts.push({ provider: provider.id, error: error.status ? `HTTP ${error.status}` : 'Network or timeout error' });
    }
  }

  res.status(502).json({ ok: false, error: 'All AI providers failed', attempts });
};
