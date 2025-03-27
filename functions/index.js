const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {db} = require("./firebase");
const TaskFactory = require("./utils/TaskFactory");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// GET /tasks - fetch tasks from Firestore
app.get("/tasks", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      let taskQuery = db.collection("tasks");
  
      // Apply filtering only if both dates are provided
      if (startDate && endDate) {
        taskQuery = taskQuery
          .where("deadline", ">=", startDate)
          .where("deadline", "<=", endDate);
      }
  
      const snapshot = await taskQuery.get();
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: error.message });
    }
  });

app.post("/tasks", async (req, res) => {
  try {
    const {title, deadline, type} = req.body;

    if (!title || !deadline || !type) {
      return res.status(400).json({
        error: "Missing task fields (title, deadline, type)"});
    }

    // Factory Pattern: Create a task based on type
    const task = TaskFactory.createTask(type, title, deadline);

    const newTaskRef = await db.collection("tasks").add(task);

    res.status(201).json({id: newTaskRef.id, ...task});
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({error: error.message});
  }
});

exports.api = functions.https.onRequest(app);
