/**
 * Command to add a task to Firestore.
 * Implements the Command Pattern for undoable task creation.
 */
class AddTaskCommand {
  /**
   * @param {FirebaseFirestore.Firestore} db - Firestore database instance.
   * @param {Object} taskData - The task object to add.
   */
  constructor(db, taskData) {
    this.db = db;
    this.taskData = taskData;
    this.docRef = null;
  }


  /**
   * Executes the task creation.
   * @return {Promise<void>}
   */
  async execute() {
    this.docRef = await this.db.collection("tasks").add(this.taskData);
    console.log(`Task added: ${this.docRef.id}`);
  }


  /**
   * Undoes the task creation by deleting the created document.
   * @return {Promise<void>}
   */
  async undo() {
    if (this.docRef) {
      await this.docRef.delete();
      console.log(`Undo: Deleted task ${this.docRef.id}`);
    }
  }
}

module.exports = AddTaskCommand;

