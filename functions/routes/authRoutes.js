const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const admin = require("firebase-admin");
const {getUserRole} = require("../firebase");

router.post("/login", async (req, res) => {
  const {idToken} = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const role = await getUserRole(uid);
    const user = await admin.auth().getUser(uid);

    res.status(200).json({
      uid,
      email: user.email,
      role,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({error: "Invalid or expired token"});
  }
});

module.exports = router;
