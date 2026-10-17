const { decryptJSON } = require('../lib/crypto');
const { findSecretByProvider, logAudit } = require('../lib/store');

async function callProvider(provider, secret, model, messages) {
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI request failed');
    }

    return {
      text: data.choices?.[0]?.message?.content || '',
      raw: data
    };
  }

  if (provider === 'gemini') {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': secret
      },
      body: JSON.stringify({
        contents: (messages || []).map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(message.content || '') }]
        }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini request failed');
    }

    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text).join('') || '';
    return { text, raw: data };
  }

  if (provider === 'anthropic') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secret,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: (messages || []).filter((message) => message.role !== 'system').map((message) => ({
          role: message.role === 'assistant' ? 'assistant' : 'user',
          content: String(message.content || '')
        }))
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Anthropic request failed');
    }

    return {
      text: data.content?.map((part) => part.text).join('') || '',
      raw: data
    };
  }

  if (provider === 'openrouter') {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenRouter request failed');
    }

    return {
      text: data.choices?.[0]?.message?.content || '',
      raw: data
    };
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
    const model = req.body?.model || 'gpt-4o-mini';
    const messages = req.body?.messages || [{ role: 'user', content: 'hi' }];
    const keyId = req.body?.keyId || null;

    const secretEntry = keyId ? findSecretByProvider(provider, keyId) : findSecretByProvider(provider, null);
    if (!secretEntry) {
      res.status(400).json({ ok: false, error: 'No secret configured for provider' });
      return;
    }

    const secretData = decryptJSON(secretEntry.encrypted);
    const result = await callProvider(provider, secretData.secret, model, messages);
    logAudit('chat_proxy_call', { provider, model, messageCount: messages.length });

    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Unknown error' });
  }
};
