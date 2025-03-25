const admin = require("firebase-admin");
const serviceAccount = require("../firebase/taskmaster-2a195-firebase-adminsdk-fbsvc-f4f4130e97.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = { db };