/**
 * Command to update a task in Firestore.
 * Stores previous state to support undo operation.
 */
class UpdateTaskCommand {
  /**
   * @param {FirebaseFirestore.Firestore} db - Firestore DB instance.
   * @param {string} taskId - ID of the task to update.
   * @param {Object} newData - Fields to update in the task.
   */
  constructor(db, taskId, newData) {
    this.db = db;
    this.taskId = taskId;
    this.newData = newData;
    this.previousData = null;
  }
  /**
   * Executes the update and stores the previous state.
   */
  async execute() {
    const doc = await this.db.collection("tasks").doc(this.taskId).get();
    this.previousData = doc.data();
    await this.db.collection("tasks").doc(this.taskId).update(this.newData);
    console.log(`Task ${this.taskId} updated.`);
  }
  /**
   * Undoes the update by restoring the previous data.
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

