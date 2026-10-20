const crypto = require('crypto');
const { createCalendarEvent, getCalendarAgenda, sendEmail } = require('./google-workspace');
const { createReminder } = require('./memory');

const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
const whatsappConfigured = () => Boolean(process.env.WHATSAPP_TOKEN && process.env.PHONE_NUMBER_ID);

const definitions = [
  {
    name: 'create_calendar_event',
    description: 'Create a Google Calendar event when the user explicitly asks to schedule something.',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        title: { type: 'string', description: 'Short event title' },
        start: { type: 'string', description: 'Start date/time in ISO 8601 with timezone offset' },
        end: { type: 'string', description: 'End date/time in ISO 8601 with timezone offset' },
        description: { type: 'string' },
        timeZone: { type: 'string', description: 'IANA timezone, defaults to Europe/Warsaw' }
      },
      required: ['title', 'start', 'end']
    }
  },
  {
    name: 'get_calendar_agenda',
    description: 'Read Google Calendar events between two ISO 8601 timestamps. Defaults to today.',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        timeMin: { type: 'string', description: 'Optional ISO 8601 start' },
        timeMax: { type: 'string', description: 'Optional ISO 8601 end, at most 31 days after start' }
      }
    }
  },
  {
    name: 'send_email',
    description: 'Send an email only when the user explicitly requests sending it. Never send a draft without clear authorization.',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string' },
        body: { type: 'string' }
      },
      required: ['to', 'subject', 'body']
    }
  },
  {
    name: 'set_reminder',
    description: 'Schedule a WhatsApp reminder only when the user explicitly requests one.',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        message: { type: 'string', description: 'Reminder message, max 1000 characters' },
        datetime: { type: 'string', description: 'Future ISO 8601 date/time including timezone offset' }
      },
      required: ['message', 'datetime']
    }
  }
];

function availableTools(context = {}) {
  return definitions.filter((tool) => {
    if (tool.name === 'create_calendar_event' || tool.name === 'get_calendar_agenda' || tool.name === 'send_email') return googleConfigured();
    return whatsappConfigured() && Boolean(context.whatsappTo || process.env.WHATSAPP_RECIPIENT);
  });
}

async function executeTool(name, args, context = {}) {
  if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('Invalid tool arguments');
  if (name === 'create_calendar_event') return createCalendarEvent(args);
  if (name === 'get_calendar_agenda') return getCalendarAgenda(args);
  if (name === 'send_email') return sendEmail(args);
  if (name === 'set_reminder') {
    const message = String(args.message || '').trim();
    const when = Date.parse(args.datetime);
    if (!message || message.length > 1000) throw new Error('Reminder text must be 1–1000 characters');
    if (!Number.isFinite(when) || when < Date.now() + 60000 || when > Date.now() + 366 * 86400000) {
      throw new Error('Reminder time must be between one minute and one year in the future');
    }
    const phone = String(context.whatsappTo || process.env.WHATSAPP_RECIPIENT || '');
    if (!/^\+?\d{8,15}$/.test(phone)) throw new Error('WhatsApp recipient is not configured');
    const id = crypto.randomUUID();
    createReminder({ id, userId: context.userId, phone, message, dueAt: when });
    return { id, dueAt: new Date(when).toISOString(), phone: `…${phone.slice(-4)}` };
  }
  throw new Error(`Unsupported tool: ${name}`);
}

module.exports = { availableTools, executeTool };
