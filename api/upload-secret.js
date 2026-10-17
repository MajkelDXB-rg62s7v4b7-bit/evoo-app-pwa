const { createToken, randomBytes } = require('crypto');
const { addToken, logAudit } = require('./lib/store');

function getBaseUrl(req) {
  return process.env.BASE_URL || `https://${req.headers.host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const token = createToken('tok');
  const expiresAt = Date.now() + 5 * 60 * 1000;

  addToken({
    token,
    expiresAt,
    createdAt: new Date().toISOString(),
    used: false,
    provider: req.body?.provider || 'openai'
  });

  logAudit('request_upload', { token, provider: req.body?.provider || 'openai' });

  const baseUrl = getBaseUrl(req);
  const uploadUrl = `${baseUrl}/api/upload-secret?tok=${token}`;

  res.status(200).json({
    ok: true,
    token,
    uploadUrl,
    expiresAt
  });
};
