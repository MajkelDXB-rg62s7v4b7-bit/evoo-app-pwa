let cachedToken = '';
let tokenExpiresAt = 0;

async function accessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Google Workspace OAuth is not configured');
  }
  if (cachedToken && tokenExpiresAt > Date.now() + 60000) return cachedToken;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    }),
    signal: AbortSignal.timeout(15000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) throw new Error(data.error_description || 'Google OAuth refresh failed');
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + Number(data.expires_in || 3600) * 1000;
  return cachedToken;
}

async function googleRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: 'Bearer ' + await accessToken(), 'Content-Type': 'application/json', ...(options.headers || {}) },
    signal: AbortSignal.timeout(20000)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `Google API returned HTTP ${response.status}`);
  return data;
}

function validateDateTime(value, label) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) throw new Error(`${label} must be a valid ISO date-time`);
  return value;
}

async function createCalendarEvent({ title, start, end, description, timeZone }) {
  if (typeof title !== 'string' || !title.trim() || title.length > 200) throw new Error('Event title is required (max 200 characters)');
  const startAt = validateDateTime(start, 'start');
  const endAt = validateDateTime(end, 'end');
  if (Date.parse(endAt) <= Date.parse(startAt)) throw new Error('Event end must be after its start');
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || 'primary');
  const event = {
    summary: title.trim(),
    description: typeof description === 'string' ? description.slice(0, 2000) : '',
    start: { dateTime: startAt, timeZone: timeZone || 'Europe/Warsaw' },
    end: { dateTime: endAt, timeZone: timeZone || 'Europe/Warsaw' }
  };
  const result = await googleRequest(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    method: 'POST',
    body: JSON.stringify(event)
  });
  return { id: result.id, title: result.summary, start: result.start?.dateTime, link: result.htmlLink };
}

async function getCalendarAgenda({ timeMin, timeMax }) {
  const now = new Date();
  const min = timeMin ? validateDateTime(timeMin, 'timeMin') : new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const max = timeMax ? validateDateTime(timeMax, 'timeMax') : new Date(Date.parse(min) + 86400000).toISOString();
  if (Date.parse(max) <= Date.parse(min) || Date.parse(max) - Date.parse(min) > 31 * 86400000) {
    throw new Error('Agenda range must be positive and no longer than 31 days');
  }
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID || 'primary');
  const query = new URLSearchParams({ timeMin: min, timeMax: max, singleEvents: 'true', orderBy: 'startTime', maxResults: '100' });
  const result = await googleRequest(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${query}`);
  return (result.items || []).map((event) => ({
    title: event.summary || '(bez tytułu)',
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    location: event.location || ''
  }));
}

function base64url(value) {
  return Buffer.from(value, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function sendEmail({ to, subject, body }) {
  if (typeof to !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error('A valid recipient email is required');
  if (typeof subject !== 'string' || !subject.trim() || /[\r\n]/.test(subject)) throw new Error('A valid email subject is required');
  if (typeof body !== 'string' || !body.trim() || body.length > 20000) throw new Error('Email body is required (max 20000 characters)');
  const sender = encodeURIComponent(process.env.GMAIL_USER || 'me');
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject.trim(), 'utf8').toString('base64')}?=`;
  const mime = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(body, 'utf8').toString('base64')
  ].join('\r\n');
  const result = await googleRequest(`https://gmail.googleapis.com/gmail/v1/users/${sender}/messages/send`, {
    method: 'POST',
    body: JSON.stringify({ raw: base64url(mime) })
  });
  return { id: result.id, to };
}

module.exports = { createCalendarEvent, getCalendarAgenda, sendEmail };
