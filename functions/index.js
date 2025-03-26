const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {db} = require("./firebase");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// GET /tasks - fetch tasks from Firestore
app.get("/tasks", async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    const tasks = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const {title, deadline, status} = req.body;
    if (!title || !deadline || !status) {
      return res.status(400).json({error: "Missing task fields"});
    }

    const newTaskRef = await db.collection("tasks").add({
      title,
      deadline,
      status,
    });

    res.status(201).json({id: newTaskRef.id, title, deadline, status});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

exports.api = functions.https.onRequest(app);
