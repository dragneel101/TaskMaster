const {getFirestore, Timestamp} = require("firebase-admin/firestore");
const db = getFirestore();

const getTasksDueSoon = async (hoursAhead = 24) => {
  const now = new Date();
  const later = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

  const snapshot = await db.collection("tasks")
      .where("deadline", ">=", Timestamp.fromDate(now))
      .where("deadline", "<=", Timestamp.fromDate(later))
      .get();

  const tasks = [];
  snapshot.forEach((doc) => {
    tasks.push({id: doc.id, ...doc.data()});
  });

  return tasks;
};

module.exports = {
  getTasksDueSoon,
};
