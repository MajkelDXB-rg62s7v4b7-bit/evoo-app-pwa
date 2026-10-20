const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const test = require('node:test');

process.env.MEMORY_DB_PATH = ':memory:';
process.env.EVOO_ACCESS_KEY = 'test-access';
process.env.GROQ_API_KEY = 'test-groq';
process.env.GEMINI_API_KEY = '';
process.env.OPENROUTER_API_KEY = '';
process.env.GOOGLE_CLIENT_ID = 'test-client';
process.env.GOOGLE_CLIENT_SECRET = 'test-secret';
process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh';
process.env.WHATSAPP_TOKEN = 'test-whatsapp-token';
process.env.PHONE_NUMBER_ID = '123456789';
process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify';

const { runWitchRouter } = require('../api/chat');
const webhook = require('../api/whatsapp-webhook');
const { claimDueReminders, db, relevantFacts, saveFacts } = require('../api/lib/memory');
const { processDueReminders } = require('../api/lib/reminder-scheduler');
const { executeTool, availableTools } = require('../api/lib/tools');

function mockResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    send(value) { this.body = value; return this; },
    setHeader() { return this; },
    end() { return this; }
  };
}

function signedRequest(body, messageId) {
  const rawBody = Buffer.from(JSON.stringify(body));
  const signature = crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(rawBody).digest('hex');
  return {
    method: 'POST',
    headers: { 'x-hub-signature-256': `sha256=${signature}` },
    rawBody,
    body,
    query: {}
  };
}

test('SQLite memory is user-scoped, relevant and filters sensitive facts', () => {
  saveFacts('alice', [
    'Pracuje nad projektem Orion',
    'Kontakt: person@example.org',
    'Ma chorobę przewlekłą'
  ]);
  saveFacts('bob', ['Pracuje nad projektem Atlas']);
  assert.deepEqual(relevantFacts('alice', 'Co z projektem Orion?'), ['Pracuje nad projektem Orion']);
  assert.deepEqual(relevantFacts('bob', 'projekt Atlas'), ['Pracuje nad projektem Atlas']);
});

test('Witch Router executes a declared Google Calendar function call', async (t) => {
  let modelCalls = 0;
  let calendarCreates = 0;
  const originalFetch = global.fetch;
  global.fetch = async (url, options = {}) => {
    if (new URL(url).hostname === 'api.groq.com') {
      modelCalls++;
      const request = JSON.parse(options.body);
      if (modelCalls === 1) {
        assert(request.tools.some((tool) => tool.function.name === 'create_calendar_event'));
        return {
          ok: true, status: 200,
          json: async () => ({ choices: [{ message: {
            content: '',
            tool_calls: [{ id: 'event-1', type: 'function', function: {
              name: 'create_calendar_event',
              arguments: JSON.stringify({ title: 'Spotkanie', start: '2026-12-01T10:00:00+01:00', end: '2026-12-01T11:00:00+01:00' })
            } }]
          } }] })
        };
      }
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: modelCalls === 2 ? 'Dodałam wydarzenie.' : '{"facts":[]}' } }] }) };
    }
    if (String(url).includes('oauth2.googleapis.com/token')) {
      return { ok: true, status: 200, json: async () => ({ access_token: 'mock-access', expires_in: 3600 }) };
    }
    if (String(url).includes('/calendar/v3/calendars/')) {
      calendarCreates++;
      assert.equal(options.method, 'POST');
      return { ok: true, status: 200, json: async () => ({ id: 'event-id', summary: 'Spotkanie', start: { dateTime: '2026-12-01T10:00:00+01:00' } }) };
    }
    throw new Error(`Unexpected URL ${url}`);
  };
  t.after(() => { global.fetch = originalFetch; });

  const result = await runWitchRouter([
    { role: 'system', content: 'Jesteś Evoo.' },
    { role: 'user', content: 'Dodaj wydarzenie Spotkanie.' }
  ], { userId: 'calendar-user' });
  assert.equal(result.text, 'Dodałam wydarzenie.');
  assert.equal(result.provider, 'groq');
  assert.equal(calendarCreates, 1);
});

test('Witch Router falls back in Groq, Gemini, OpenRouter order', async (t) => {
  const originalFetch = global.fetch;
  const originalKeys = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
  };
  process.env.GROQ_API_KEY = 'test-groq';
  process.env.GEMINI_API_KEY = 'test-gemini';
  process.env.OPENROUTER_API_KEY = 'test-openrouter';
  const calls = [];
  global.fetch = async (url) => {
    calls.push(String(url));
    if (calls.length < 3) return { ok: false, status: 503, json: async () => ({ error: { message: 'Unavailable' } }) };
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'OpenRouter odpowiedział.' } }] }) };
  };
  t.after(() => {
    global.fetch = originalFetch;
    Object.assign(process.env, originalKeys);
  });
  const result = await runWitchRouter([{ role: 'user', content: 'Powiedz cześć.' }], {}, { remember: false });
  assert.equal(result.text, 'OpenRouter odpowiedział.');
  assert.deepEqual(calls.map((url) => {
    const host = new URL(url).hostname;
    if (host === 'api.groq.com') return 'groq';
    if (host === 'generativelanguage.googleapis.com') return 'gemini';
    if (host === 'openrouter.ai') return 'openrouter';
    throw new Error(`Unexpected provider host ${host}`);
  }), ['groq', 'gemini', 'openrouter']);
});

test('WhatsApp webhook rejects unsigned requests and transcribes signed audio', async (t) => {
  const denied = mockResponse();
  await webhook({ method: 'POST', headers: {}, body: { entry: [] }, rawBody: Buffer.from('{}') }, denied);
  assert.equal(denied.statusCode, 401);

  const originalFetch = global.fetch;
  let transcribed = false;
  let replied = false;
  let groqCalls = 0;
  let replyText = '';
  global.fetch = async (url, options = {}) => {
    const address = String(url);
    if (address.includes('graph.facebook.com/v22.0/media-test-id')) {
      return { ok: true, status: 200, json: async () => ({ url: 'https://lookaside.fbsbx.com/audio-test', mime_type: 'audio/ogg' }) };
    }
    if (address === 'https://lookaside.fbsbx.com/audio-test') {
      return { ok: true, status: 200, headers: { get: () => 'audio/ogg' }, arrayBuffer: async () => Buffer.from('audio') };
    }
    if (address.includes('/audio/transcriptions')) {
      transcribed = true;
      assert.equal(options.body.get('model'), 'whisper-large-v3');
      return { ok: true, status: 200, json: async () => ({ text: 'Co mam dziś w kalendarzu?' }) };
    }
    if (address.includes('api.groq.com/openai/v1/chat/completions')) {
      groqCalls++;
      return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content: groqCalls === 1 ? 'Masz spotkanie.' : '{"facts":[]}' } }] }) };
    }
    if (address.includes('/123456789/messages')) {
      replied = true;
      replyText = JSON.parse(options.body).text.body;
      return { ok: true, status: 200, json: async () => ({ messages: [{ id: 'reply-id' }] }) };
    }
    throw new Error(`Unexpected URL ${url}`);
  };
  t.after(() => { global.fetch = originalFetch; });

  const body = { entry: [{ changes: [{ value: { messages: [{
    id: 'audio-message-test',
    from: '48123456789',
    type: 'audio',
    audio: { id: 'media-test-id' }
  }] } }] }] };
  const response = mockResponse();
  await webhook(signedRequest(body), response);
  assert.equal(response.statusCode, 200);
  assert.equal(transcribed, true);
  assert.equal(replied, true);
  assert.equal(replyText, 'Masz spotkanie.');
  const duplicateResponse = mockResponse();
  await webhook(signedRequest(body), duplicateResponse);
  assert.equal(groqCalls, 2);
  assert.equal(replyText, 'Masz spotkanie.');
});

test('reminder tools persist jobs and cron worker sends them once due', async (t) => {
  const recipient = '48123456789';
  const saved = await executeTool('set_reminder', {
    message: 'Sprawdź spotkanie',
    datetime: new Date(Date.now() + 5 * 60000).toISOString()
  }, { userId: 'reminder-user', whatsappTo: recipient });
  assert.match(saved.id, /^[0-9a-f-]{36}$/i);
  db.prepare("UPDATE reminders SET due_at = ? WHERE id = ?").run(Date.now() - 1, saved.id);

  const originalFetch = global.fetch;
  let sent = 0;
  global.fetch = async (url) => {
    assert(String(url).includes('/123456789/messages'));
    sent++;
    return { ok: true, status: 200, json: async () => ({ messages: [{ id: 'sent' }] }) };
  };
  t.after(() => { global.fetch = originalFetch; });
  await processDueReminders();
  assert.equal(sent, 1);
  assert.equal(db.prepare('SELECT status FROM reminders WHERE id = ?').get(saved.id).status, 'sent');
  assert.equal(claimDueReminders().length, 0);
  assert.equal(availableTools({ whatsappTo: recipient }).some((tool) => tool.name === 'set_reminder'), true);
});
