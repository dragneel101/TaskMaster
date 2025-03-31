const {getTasksDueSoon} = require("../utils/taskService");
const {sendSMS} = require("../utils/notifier");

const sendDeadlineReminders = async () => {
  try {
    const tasks = await getTasksDueSoon();
    for (const task of tasks) {
      const phone = task.phoneNumber;
      if (!phone) {
        console.log(`Skipping task ${task.title} — no phone number found`);
        continue;
      }

      const deadlineText = task.deadline.toDate ?
        task.deadline.toDate().toDateString() :
        new Date(task.deadline).toDateString();

      const message = `Reminder: Your task "${
        task.title}" is due on ${deadlineText}`;
      await sendSMS(phone, message);
    }
  } catch (error) {
    console.error("Error sending reminders:", error.message);
  }
};

module.exports = {
  sendDeadlineReminders,
};
