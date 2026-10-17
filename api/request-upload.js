const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'api', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const initialState = {
  tokens: [],
  secrets: [],
  audit: []
};

function ensureStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialState, null, 2));
    }
  } catch (err) {
    console.warn('Store init failed:', err.message);
  }
}

function readStore() {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      tokens: Array.isArray(parsed.tokens) ? parsed.tokens : [],
      secrets: Array.isArray(parsed.secrets) ? parsed.secrets : [],
      audit: Array.isArray(parsed.audit) ? parsed.audit : []
    };
  } catch (err) {
    console.warn('Store read failed:', err.message);
    return { ...initialState };
  }
}

function writeStore(next) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(next, null, 2));
}

function addToken(token) {
  const state = readStore();
  state.tokens.push(token);
  writeStore(state);
  return token;
}

function getTokenByValue(value) {
  const state = readStore();
  return state.tokens.find((t) => t.token === value) || null;
}

function removeToken(value) {
  const state = readStore();
  state.tokens = state.tokens.filter((t) => t.token !== value);
  writeStore(state);
}

function addSecret(record) {
  const state = readStore();
  state.secrets.push(record);
  writeStore(state);
  return record;
}

function getSecrets() {
  const state = readStore();
  return state.secrets;
}

function findSecretByProvider(provider, id) {
  const state = readStore();
  if (id) {
    return state.secrets.find((item) => item.id === id) || null;
  }

  return state.secrets.find((item) => item.provider === provider) || null;
}

function logAudit(message, meta = {}) {
  const state = readStore();
  state.audit.push({
    at: new Date().toISOString(),
    message,
    meta
  });
  writeStore(state);
}

module.exports = {
  addToken,
  getTokenByValue,
  removeToken,
  addSecret,
  getSecrets,
  findSecretByProvider,
  logAudit
};
