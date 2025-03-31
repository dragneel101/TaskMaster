const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();

const {db} = require("../firebase");
const TaskFactory = require("../utils/TaskFactory");
const AddTaskCommand = require("../utils/commands/AddTaskCommand");
const DeleteTaskCommand = require("../utils/commands/DeleteTaskCommand");
const CommandManager = require("../utils/commands/CommandManager");
const UpdateTaskCommand = require("../utils/commands/UpdateTaskCommand");
// Temporary in-memory store for undo operations
const undoMap = new Map();

/**
 * GET /tasks
 */
router.get("/tasks", async (req, res) => {
  try {
    const {startDate, endDate} = req.query;
    let taskQuery = db.collection("tasks");

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
 */
router.post("/tasks", async (req, res) => {
  try {
    const {title, deadline, type, email} = req.body;

    if (!title || !deadline || !type) {
      return res.status(400).json({error: "Missing task fields"});
    }

    const parsedDeadline = new Date(deadline); // ensures deadline includes time

    const task = TaskFactory.createTask(type, title, parsedDeadline, email);
    const command = new AddTaskCommand(db, task);
    await CommandManager.execute(command);

    res.status(201).json({message: "Task added", task});
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * DELETE /tasks/:id
 */
router.delete("/tasks/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const command = new DeleteTaskCommand(id);
    await CommandManager.execute(command);
    res.status(200).json({message: `Task ${id} deleted`});
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * POST /undo
 */
router.post("/undo", async (req, res) => {
  try {
    await CommandManager.undo();
    res.status(200).json({message: "Undo successful"});
  } catch (error) {
    console.error("Undo error:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * POST Update Task
 */
router.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const updatedFields = req.body;

  const command = new UpdateTaskCommand(db, taskId, updatedFields);

  try {
    await command.execute();
    undoMap.set(taskId, command); // ✅ store for undo
    res.status(200).json({
      message: "Task updated successfully.",
      id: taskId,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update task.",
      error: error.message || error,
    });
  }
});

/**
 * POST undo-update Task
 */
router.post("/undo-update/:id", async (req, res) => {
  const taskId = req.params.id;
  const command = undoMap.get(taskId);

  if (!command) {
    return res.status(404).json({message: "No undo operation available."});
  }

  try {
    await command.undo();
    undoMap.delete(taskId); // ✅ clean up
    res.status(200).json({message: `Undo successful for task ${taskId}`});
  } catch (error) {
    res.status(500).json({message: "Failed to undo update.", error});
  }
});

module.exports = router;
