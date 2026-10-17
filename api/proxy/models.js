const { encryptJSON, decryptJSON } = require('./lib/crypto');
const { getTokenByValue, removeToken, addSecret, logAudit } = require('./lib/store');

function parseSecretBody(req) {
  if (typeof req.body === 'object' && req.body !== null) {
    if (req.body.secret) return req.body.secret;
    if (req.body.key) return req.body.key;
    if (req.body.apiKey) return req.body.apiKey;
  }

  const raw = req.query?.secret || req.query?.key || '';
  return raw;
}

module.exports = async function handler(req, res) {
  const token = req.query?.tok || req.body?.tok || '';
  const record = getTokenByValue(token);

  if (!record || record.expiresAt < Date.now()) {
    res.status(400).json({ ok: false, error: 'Invalid or expired token' });
    return;
  }

  const secret = parseSecretBody(req);
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    res.status(400).json({ ok: false, error: 'Missing API key' });
    return;
  }

  const provider = record.provider || req.body?.provider || 'openai';
  const encrypted = encryptJSON({
    provider,
    secret: secret.trim(),
    createdAt: new Date().toISOString()
  });

  const id = `key_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  addSecret({
    id,
    provider,
    encrypted,
    createdAt: new Date().toISOString()
  });

  removeToken(token);
  logAudit('secret_saved', { id, provider });

  res.status(200).json({
    ok: true,
    id,
    provider,
    message: 'Secret stored securely'
  });
};
