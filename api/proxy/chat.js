const { decryptJSON } = require('../lib/crypto');
const { findSecretByProvider, logAudit } = require('../lib/store');
const { fetchModels } = require('./models');
const rank = require('../lib/rank');

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
      const err = data.error?.message || 'OpenAI request failed';
      const e = new Error(err);
      e.code = data.error?.type || response.status;
      throw e;
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
      const err = data.error?.message || 'Gemini request failed';
      const e = new Error(err);
      e.code = response.status;
      throw e;
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
      const err = data.error?.message || 'Anthropic request failed';
      const e = new Error(err);
      e.code = response.status;
      throw e;
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
      const err = data.error?.message || 'OpenRouter request failed';
      const e = new Error(err);
      e.code = response.status;
      throw e;
    }

    return {
      text: data.choices?.[0]?.message?.content || '',
      raw: data
    };
  }

  throw new Error(`Provider ${provider} is not supported yet`);
}

function isRetryableError(e){
  if(!e || !e.message) return false;
  const m = String(e.message);
  return /quota|rate.?limit|RESOURCE_EXHAUSTED|retry in|429|overloaded|unavailable|timed out|timedout|timeout/i.test(m) ||
         /model_not_found|does not exist|not found|no longer available|decommission/i.test(m) ||
         /ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN/i.test(m);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const provider = req.body?.provider || 'openai';
    const model = req.body?.model || '';
    const messages = req.body?.messages || [{ role: 'user', content: 'hi' }];
    const keyId = req.body?.keyId || null;
    const chain = req.body?.chain || null; // optional chain: [{provider, model, keyId}]

    const secretEntry = keyId ? findSecretByProvider(provider, keyId) : findSecretByProvider(provider, null);
    if (!secretEntry && !chain) {
      res.status(400).json({ ok: false, error: 'No secret configured for provider and no chain provided' });
      return;
    }

    // build chain if not provided
    let tryChain = [];
    if (Array.isArray(chain) && chain.length) {
      tryChain = chain;
    } else {
      // attempt to auto-pick top models for this provider
      const secretData = decryptJSON(secretEntry.encrypted);
      const models = await fetchModels(provider, secretData.secret).catch(()=>[]);
      const ranked = rank(models);
      const top = ranked.slice(0, Math.min(6, ranked.length));
      tryChain = top.map(m => ({ provider, model: m }));
      if (model) tryChain.unshift({ provider, model });
    }

    const attempts = [];
    for (let i=0;i<tryChain.length;i++){
      const item = tryChain[i];
      try{
        // find secret for item's provider or reuse earlier
        const entry = item.keyId ? findSecretByProvider(item.provider, item.keyId) : findSecretByProvider(item.provider, null) || secretEntry;
        if(!entry) throw new Error('No secret for provider: '+item.provider);
        const sec = decryptJSON(entry.encrypted).secret;
        const usedModel = item.model || model;
        const r = await callProvider(item.provider, sec, usedModel, messages);
        logAudit('chat_proxy_success', { provider: item.provider, model: usedModel });
        res.status(200).json({ ok: true, used: { provider: item.provider, model: usedModel }, text: r.text, raw: r.raw, attempts });
        return;
      }catch(e){
        attempts.push({ provider: item.provider, model: item.model, error: e.message });
        if(isRetryableError(e)){
          // try next in chain
          continue;
        }else{
          // non-retryable - stop and return error
          res.status(500).json({ ok: false, error: e.message, attempts });
          return;
        }
      }
    }

    res.status(500).json({ ok: false, error: 'All chain attempts failed', attempts });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message || 'Unknown error' });
  }
};
