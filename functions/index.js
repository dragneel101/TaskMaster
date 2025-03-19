const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Base Route
app.get("/", (req, res) => {
  res.send("TaskMaster Web API connected to Firestore is running...");
});

// ✅ 1. Get All Tasks (Reads from Firestore)
app.get("/tasks", async (req, res) => {
  try {
    const snapshot = await db.collection("tasks").get();
    if (snapshot.empty) {
      return res.status(404).json({
        message: "No tasks found"});
    }

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(tasks);
  } catch (error) {
    res.status(500).json({error: "Error fetching tasks", details: error});
  }
});

// ✅ 2. Get a Task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({message: "Task not found"});

    res.json({id: doc.id, ...doc.data()});
  } catch (error) {
    res.status(500).json({error: "Error retrieving task", details: error});
  }
});

// ✅ 3. Create a New Task (Writes to Firestore)
app.post("/tasks", async (req, res) => {
  try {
    const {title, status, deadline} = req.body;
    if (!title || !status) {
      return res.status(400).json({
        error: "Missing required fields"});
    }

    const newTask = {
      title,
      status,
      deadline: deadline || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const taskRef = await db.collection("tasks").add(newTask);
    res.status(201).json({id: taskRef.id, ...newTask});
  } catch (error) {
    res.status(500).json({error: "Error creating task", details: error});
  }
});

// ✅ 4. Update a Task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const taskRef = db.collection("tasks").doc(req.params.id);
    const doc = await taskRef.get();

    if (!doc.exists) return res.status(404).json({message: "Task not found"});

    await taskRef.update(req.body);
    res.json({message: "Task updated successfully"});
  } catch (error) {
    res.status(500).json({error: "Error updating task", details: error});
  }
});

// ✅ 5. Delete a Task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    await db.collection("tasks").doc(req.params.id).delete();
    res.json({message: "Task deleted successfully"});
  } catch (error) {
    res.status(500).json({error: "Error deleting task", details: error});
  }
});

// ✅ Deploy API as a Firebase Function
exports.api = functions.https.onRequest(app);
