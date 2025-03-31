const admin = require("firebase-admin");
const db = admin.firestore();

/**
 * Command to delete a task from Firestore and support undo.
 */
class DeleteTaskCommand {
  /**
   * @param {string} taskId - ID of the task to delete
   */
  constructor(taskId) {
    this.taskId = taskId;
    this.deletedTaskData = null; // Used for undo
  }


  /**
   * Executes the delete operation and stores task data for undo.
   */
  async execute() {
    try {
      const taskRef = db.collection("tasks").doc(this.taskId);
      const doc = await taskRef.get();
      if (!doc.exists) {
        console.log(`Task ${this.taskId} does not exist.`);
        return;
      }

      this.deletedTaskData = doc.data(); // store for undo
      await taskRef.delete();
      console.log(`Task ${this.taskId} deleted.`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }


  /**
   * Undoes the delete by restoring the previously deleted task.
   */
  async undo() {
    try {
      if (!this.deletedTaskData) {
        console.log("No task data stored to undo.");
        return;
      }
      await db.collection("tasks").doc(this.taskId).set(this.deletedTaskData);
      console.log(`Undo: Task ${this.taskId} restored.`);
    } catch (error) {
      console.error("Undo delete failed:", error);
    }
  }
}

module.exports = DeleteTaskCommand;
