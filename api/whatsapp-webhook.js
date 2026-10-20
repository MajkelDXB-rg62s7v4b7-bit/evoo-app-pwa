module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const query = req.query || {};
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (!verifyToken) {
      res.status(503).send('Webhook verification is not configured');
      return;
    }
    if (mode !== 'subscribe' || token !== verifyToken || typeof challenge !== 'string') {
      res.status(403).send('Forbidden');
      return;
    }
    res.status(200).send(challenge);
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
  for (const entry of entries) {
    for (const change of Array.isArray(entry?.changes) ? entry.changes : []) {
      for (const message of Array.isArray(change?.value?.messages) ? change.value.messages : []) {
        if (message.type !== 'text' || typeof message.text?.body !== 'string') continue;
        console.info(JSON.stringify({
          event: 'whatsapp_inbound_text',
          from: message.from || '',
          timestamp: message.timestamp || '',
          text: message.text.body
        }));
      }
    }
  }

  res.status(200).json({ ok: true });
};
