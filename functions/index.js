// Entry point for Firebase Functions using Express.js
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// Firestore DB instance and utilities
const {db} = require("./firebase");

// Design Pattern Implementations
const TaskFactory = require("./utils/TaskFactory");
const AddTaskCommand = require("./utils/commands/AddTaskCommand");
const CommandManager = require("./utils/commands/CommandManager");

// Initialize Express app
const app = express();
app.use(cors({origin: true}));
app.use(express.json());

/**
 * GET /tasks
 * Retrieves all tasks or filters them by a given date range
 * (startDate and endDate).
 * - Date filtering uses Firestore's where queries on the 'deadline' field.
 */
app.get("/tasks", async (req, res) => {
  try {
    const {startDate, endDate} = req.query;
    let taskQuery = db.collection("tasks");

    //  Date range filtering (if both query params are present)
    if (startDate && endDate) {
      taskQuery = taskQuery
          .where("deadline", ">=", startDate)
          .where("deadline", "<=", endDate);
    }

    const snapshot = await taskQuery.get();
    const tasks = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * POST /tasks
 * Creates a new task using the Factory Pattern.
 * The task creation is wrapped in a Command (Command Pattern)
 *  to support undo functionality.
 */
app.post("/tasks", async (req, res) => {
  try {
    const {title, deadline, type} = req.body;

    // Validate required fields
    if (!title || !deadline || !type) {
      return res.status(400).json({
        error: "Missing task fields (title, deadline, type)",
      });
    }

    //  Factory Pattern: Generate task based on type
    const task = TaskFactory.createTask(type, title, deadline);

    // ↩ Command Pattern: Wrap task creation in an executable/undoable command
    const command = new AddTaskCommand(db, task);
    await CommandManager.execute(command);

    res.status(201).json({message: "Task added", task});
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * POST /undo
 * Undoes the last command (e.g., task creation) using the CommandManager.
 * Useful for implementing undo functionality in frontend or testing.
 */
app.post("/undo", async (req, res) => {
  try {
    await CommandManager.undo();
    res.status(200).json({message: "Undo successful"});
  } catch (error) {
    console.error("Undo error:", error);
    res.status(500).json({error: error.message});
  }
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
