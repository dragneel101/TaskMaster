const admin = require("firebase-admin");
const db = admin.firestore();
const {getUserRole} = require("../../firebase");
/**
 * Command to delete a task from Firestore.
 * Stores task data to support undo operation.
 */
class DeleteTaskCommand {
  /**
   * @param {string} taskId - ID of the task to delete
   * @param {string} uid - UID of the user attempting the delete
   */
  constructor(taskId, uid) {
    this.taskId = taskId;
    this.uid = uid;
    this.deletedTaskData = null;
  }

  /**
   * Executes the deletion of the task.
   * Only users with admin role are allowed to delete.
   * @return {Promise<void>}
   */
  async execute() {
    const role = await getUserRole(this.uid);

    if (role !== "admin") {
      throw new Error("Only admins can delete tasks.");
    }

    const taskRef = db.collection("tasks").doc(this.taskId);
    const doc = await taskRef.get();
    if (!doc.exists) {
      throw new Error(`Task ${this.taskId} does not exist.`);
    }

    this.deletedTaskData = doc.data();
    await taskRef.delete();
    console.log(`Task ${this.taskId} deleted.`);
  }

  /**
   * Undoes the task deletion by restoring the previously deleted data.
   * @return {Promise<void>}
   */
  async undo() {
    if (!this.deletedTaskData) {
      console.log("No task data stored to undo.");
      return;
    }
    await db.collection("tasks").doc(this.taskId).set(this.deletedTaskData);
    console.log(`Undo: Task ${this.taskId} restored.`);
  }
}

module.exports = DeleteTaskCommand;
