const {getUserRole} = require("../../firebase");
/**
 * Command to update a task in Firestore.
 * Stores previous state to support undo operation.
 */
class UpdateTaskCommand {
  /**
   * @param {FirebaseFirestore.Firestore} db - Firestore DB instance.
   * @param {string} taskId - ID of the task to update.
   * @param {Object} newData - Fields to update in the task.
   * @param {string} uid - UID of the user performing the update.
   */
  constructor(db, taskId, newData, uid) {
    this.db = db;
    this.taskId = taskId;
    this.newData = newData;
    this.uid = uid;
    this.previousData = null;
  }


  /**
   * Executes the update operation with role-based restriction.
   * Prevents basic users from modifying 'work' tasks.
   * @return {Promise<void>}
   */
  async execute() {
    const docRef = this.db.collection("tasks").doc(this.taskId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Task does not exist.");
    }

    const currentTask = doc.data();
    const role = await getUserRole(this.uid);

    // Restrict editing work tasks to admins only
    if (currentTask.type === "work" && role !== "admin") {
      throw new Error("Only admins can update work tasks.");
    }

    this.previousData = currentTask;

    await docRef.update(this.newData);
    console.log(`Task ${this.taskId} updated.`);
  }
  /**
   * Undoes the update by restoring the previous task data.
   * @return {Promise<void>}
   */
  async undo() {
    if (this.previousData) {
      await this.db.collection("tasks").doc(
          this.taskId).update(this.previousData);
      console.log(`Undo: Task ${this.taskId} reverted.`);
    }
  }
}

module.exports = UpdateTaskCommand;
