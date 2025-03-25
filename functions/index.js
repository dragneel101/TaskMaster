const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { db } = require("./firebase");

const app = express();
app.use(cors({ origin: true }));

// GET /tasks - fetch tasks from Firestore
app.get("/tasks", async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
