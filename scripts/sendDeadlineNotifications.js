const admin = require('firebase-admin');
const serviceAccount = require('../functions/taskmaster-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const { sendDeadlineReminders } = require('../functions/controllers/notificationsController');

(async () => {
  console.log("⏰ Running deadline reminder script...");
  await sendDeadlineReminders();
  console.log("✅ Done sending reminders.");
  process.exit();
})();
