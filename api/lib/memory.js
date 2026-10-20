const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = process.env.MEMORY_DB_PATH || (process.env.VERCEL
  ? path.join('/tmp', 'evoo.sqlite')
  : path.join(__dirname, '..', '..', 'data', 'evoo.sqlite'));
if (dbFile !== ':memory:') fs.mkdirSync(path.dirname(path.resolve(dbFile)), { recursive: true });
const db = new Database(dbFile);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    fact TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    UNIQUE(user_id, fact)
  );
  CREATE INDEX IF NOT EXISTS memories_user_created ON memories(user_id, created_at DESC);
  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    due_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS reminders_due ON reminders(status, due_at);
  CREATE TABLE IF NOT EXISTS inbound_messages (
    message_id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    received_at INTEGER NOT NULL
  );
`);

const normalizeUser = (userId) => String(userId || 'default').slice(0, 120);

function normalizeFact(value) {
  const fact = String(value || '').replace(/\s+/g, ' ').trim();
  if (!fact || fact.length > 280) return '';
  if (/(?:sk-[A-Za-z0-9_-]{12,}|gsk_[A-Za-z0-9_-]{12,}|AIza[A-Za-z0-9_-]{20,}|password|hasło|token|api.?key|klucz api)/i.test(fact)) return '';
  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(fact) || /\b(?:\+?\d[\d\s().-]{7,}\d)\b/.test(fact)) return '';
  if (/\b(?:chorob|diagnoz|lekach|relig|wyznani|orientacj|poglądach politycz|adres zamieszkania)\w*/i.test(fact)) return '';
  return fact;
}

function saveFacts(userId, facts) {
  const user = normalizeUser(userId);
  const insert = db.prepare('INSERT OR IGNORE INTO memories(user_id, fact, created_at) VALUES (?, ?, ?)');
  const now = Date.now();
  const save = db.transaction((items) => {
    for (const item of items) {
      const fact = normalizeFact(item);
      if (fact) insert.run(user, fact, now);
    }
  });
  save(Array.isArray(facts) ? facts.slice(0, 3) : []);
}

function terms(text) {
  return [...new Set(String(text || '').toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[\p{L}\p{N}]{3,}/gu) || [])]
    .filter((word) => !['jest', 'oraz', 'tego', 'taka', 'takie', 'który', 'która', 'proszę', 'mojego', 'mojej', 'moim', 'chce', 'chciałbym', 'chcialbym', 'mam', 'może', 'moze'].includes(word));
}

function relevantFacts(userId, prompt, limit = 8) {
  const user = normalizeUser(userId);
  const queryTerms = terms(prompt);
  const rows = db.prepare('SELECT fact, created_at FROM memories WHERE user_id = ? ORDER BY created_at DESC LIMIT 200').all(user);
  return rows.map((row) => {
    const factTerms = terms(row.fact);
    const score = factTerms.reduce((total, word) => total + (queryTerms.includes(word) ? 1 : 0), 0);
    return { ...row, score };
  }).filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.created_at - a.created_at)
    .slice(0, limit)
    .map((row) => row.fact);
}

function createReminder({ id, userId, phone, message, dueAt }) {
  db.prepare(`INSERT INTO reminders(id, user_id, phone, message, due_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`).run(id, normalizeUser(userId), phone, message, dueAt, Date.now());
}

function claimDueReminders(now = Date.now()) {
  const recover = db.prepare(`UPDATE reminders SET status = 'pending'
    WHERE status = 'sending' AND created_at < ?`).run(now - 120000);
  const due = db.prepare(`SELECT id, phone, message FROM reminders
    WHERE status = 'pending' AND due_at <= ? AND attempts < 5 ORDER BY due_at LIMIT 50`).all(now);
  const claim = db.prepare(`UPDATE reminders SET status = 'sending' WHERE id = ? AND status = 'pending'`);
  return db.transaction((items) => items.filter((item) => claim.run(item.id).changes === 1))(due);
}

function finishReminder(id, error) {
  if (error) {
    db.prepare(`UPDATE reminders SET attempts = attempts + 1,
      status = CASE WHEN attempts + 1 >= 5 THEN 'failed' ELSE 'pending' END,
      last_error = ? WHERE id = ?`).run(String(error).slice(0, 240), id);
  } else {
    db.prepare(`UPDATE reminders SET status = 'sent', last_error = '' WHERE id = ?`).run(id);
  }
}

function claimInboundMessage(messageId) {
  const result = db.prepare(`INSERT INTO inbound_messages(message_id, status, received_at)
    VALUES (?, 'processing', ?) ON CONFLICT(message_id) DO UPDATE SET status = 'processing', received_at = excluded.received_at
    WHERE inbound_messages.status = 'failed'`).run(String(messageId).slice(0, 200), Date.now());
  return result.changes === 1;
}

function finishInboundMessage(messageId, success) {
  db.prepare('UPDATE inbound_messages SET status = ? WHERE message_id = ?')
    .run(success ? 'processed' : 'failed', String(messageId).slice(0, 200));
}

module.exports = { claimDueReminders, claimInboundMessage, createReminder, db, finishInboundMessage, finishReminder, normalizeFact, relevantFacts, saveFacts };
