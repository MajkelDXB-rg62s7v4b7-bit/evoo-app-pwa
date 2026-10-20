const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = __dirname;
const WEB_ROOT = path.join(ROOT, 'final');
const MAX_BODY_BYTES = 100000;

function loadEnv(file = path.join(ROOT, '.env')) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, '');
    }
    process.env[match[1]] = value;
  }
}

function responseAdapter(res) {
  return {
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(value) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(value));
      return this;
    },
    send(value) {
      res.end(String(value));
      return this;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
      return this;
    },
    end() {
      res.end();
      return this;
    }
  };
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large');
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (!size) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON');
    error.status = 400;
    throw error;
  }
}

function serveStatic(req, res, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  const requested = decoded === '/' ? '/index.html' : decoded;
  const file = path.resolve(WEB_ROOT, `.${requested}`);
  if (file !== WEB_ROOT && !file.startsWith(WEB_ROOT + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end('Not found');
    return;
  }

  const types = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json'
  };
  res.writeHead(200, {
    'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff'
  });
  if (req.method === 'HEAD') res.end();
  else fs.createReadStream(file).pipe(res);
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/chat') {
      const handler = require('./api/chat');
      req.query = Object.fromEntries(url.searchParams);
      try {
        req.body = req.method === 'POST' ? await readJson(req) : {};
      } catch (error) {
        res.writeHead(error.status || 400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: error.message }));
        return;
      }
      await handler(req, responseAdapter(res));
      return;
    }
    if (url.pathname === '/webhook' || url.pathname === '/api/whatsapp-webhook') {
      const handler = require('./api/whatsapp-webhook');
      req.query = Object.fromEntries(url.searchParams);
      try {
        req.body = req.method === 'POST' ? await readJson(req) : {};
      } catch (error) {
        res.writeHead(error.status || 400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: error.message }));
        return;
      }
      await handler(req, responseAdapter(res));
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    serveStatic(req, res, url.pathname);
  });
}

if (require.main === module) {
  loadEnv();
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT must be an integer between 1 and 65535');
    process.exitCode = 1;
  } else {
    createServer().listen(port, '0.0.0.0', () => {
      console.log(`Evoo PWA and API listening on http://localhost:${port}`);
    });
  }
}

module.exports = { createServer, loadEnv };
