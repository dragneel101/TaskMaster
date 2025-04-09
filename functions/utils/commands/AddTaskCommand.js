const {getUserRole} = require("../../firebase");

/**
 * Command to add a task to Firestore.
 * Implements the Command Pattern for undoable task creation.
 */
class AddTaskCommand {
  /**
   * @param {FirebaseFirestore.Firestore} db - Firestore database instance.
   * @param {Object} taskData - The task object to add.
   * @param {string} uid - The UID of the user creating the task.
   */
  constructor(db, taskData, uid) {
    this.db = db;
    this.taskData = taskData;
    this.uid = uid;
    this.docRef = null;
  }

  /**
   * Executes the task creation.
   * Enforces role-based restriction on work tasks.
   * @return {Promise<void>}
   */
  async execute() {
    const role = await getUserRole(this.uid);
    const {
      type,
      title,
      deadline,
      email = null,
      owner = "",
      assigned = [],
      progress = "Not Started",
    } = this.taskData;

    // Restrict basic users from creating work tasks
    if (type === "work" && role !== "admin") {
      throw new Error("Only admins can create work tasks.");
    }

    const deadlineDate = deadline ? new Date(deadline) : null;

    const dataToSave = {
      type,
      title,
      deadline: deadlineDate,
      email,
      createdBy: this.uid,
      owner: owner || this.uid,
      assigned,
      progress,
      createdAt: new Date(),
    };

    this.docRef = await this.db.collection("tasks").add(dataToSave);
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
