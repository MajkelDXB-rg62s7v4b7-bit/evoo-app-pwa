const { getSecrets, logAudit, findSecretByProvider } = require('../lib/store');
const { decryptJSON } = require('../lib/crypto');

async function fetchModels(provider, secret) {
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI models fetch failed');
    }
    return (data.data || []).map((item) => item.id);
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/models?limit=100', {
      headers: {
        'x-api-key': secret,
        'anthropic-version': '2023-06-01'
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic models fetch failed');
    }
    return (data.data || []).map((item) => item.id);
  }

  if (provider === 'gemini') {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', {
      headers: { 'x-goog-api-key': secret }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini models fetch failed');
    }
    return (data.models || []).filter((m) => m.name).map((m) => m.name.replace('models/', ''));
  }

  if (provider === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter models fetch failed');
    }
    return (data.data || []).map((item) => item.id);
  }

  throw new Error(`Provider ${provider} is not supported yet`);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const provider = req.body?.provider || 'openai';
    const keyId = req.body?.keyId || null;
    const secretEntry = keyId ? findSecretByProvider(provider, keyId) : findSecretByProvider(provider, null);

    if (!secretEntry) {
      res.status(400).json({ ok: false, error: 'No secret configured for provider' });
      return;
    }

    const secretData = decryptJSON(secretEntry.encrypted);
    const models = await fetchModels(provider, secretData.secret);
    logAudit('models_listed', { provider, count: models.length });

    res.status(200).json({ ok: true, provider, models });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Unknown error' });
  }
};
