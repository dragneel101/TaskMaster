const admin = require("firebase-admin");
const serviceAccount = require(
    "./taskmaster-service-account.json");

const getUserRole = async (uid) => {
  try {
    const doc = await db.collection("users").doc(uid).get();
    return doc.exists ? doc.data().role : null;
  } catch (err) {
    console.error("Error fetching role:", err);
    return null;
  }
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = {db, getUserRole};
