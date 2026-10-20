const cron = require('node-cron');
const { claimDueReminders, finishReminder } = require('./memory');
const { sendWhatsAppMessage } = require('./whatsapp');

let task = null;
let running = false;

async function processDueReminders() {
  if (running) return;
  running = true;
  try {
    const due = claimDueReminders();
    for (const reminder of due) {
      try {
        await sendWhatsAppMessage(reminder.phone, reminder.message);
        finishReminder(reminder.id);
      } catch (error) {
        console.error('WhatsApp reminder delivery failed:', String(error.message || error).slice(0, 240));
        finishReminder(reminder.id, error.message || 'Delivery failed');
      }
    }
  } finally {
    running = false;
  }
}

function startReminderScheduler() {
  if (task) return task;
  task = cron.schedule('* * * * *', () => {
    processDueReminders().catch((error) => console.error('Reminder scheduler failed:', error.message));
  });
  processDueReminders().catch((error) => console.error('Reminder startup scan failed:', error.message));
  return task;
}

module.exports = { processDueReminders, startReminderScheduler };
