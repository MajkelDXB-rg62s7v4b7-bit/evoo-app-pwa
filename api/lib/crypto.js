const crypto = require('crypto');

function getMasterKey() {
  const raw = process.env.MASTER_KEY;
  if (!raw) {
    throw new Error('MASTER_KEY is not configured');
  }

  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error('MASTER_KEY must be a base64 string of exactly 32 bytes');
  }

  return buf;
}

function encryptJSON(value) {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plain = Buffer.from(JSON.stringify(value), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    ct: encrypted.toString('base64'),
    tag: tag.toString('base64')
  };
}

function decryptJSON(blob) {
  if (!blob || !blob.iv || !blob.ct || !blob.tag) {
    throw new Error('Invalid encrypted payload');
  }

  const key = getMasterKey();
  const iv = Buffer.from(blob.iv, 'base64');
  const ct = Buffer.from(blob.ct, 'base64');
  const tag = Buffer.from(blob.tag, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  const out = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(out.toString('utf8'));
}

function createToken(prefix = 'tok') {
  return `${prefix}_${crypto.randomBytes(18).toString('hex')}`;
}

module.exports = {
  encryptJSON,
  decryptJSON,
  createToken
};
