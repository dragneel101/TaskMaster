/**
 * Factory class for creating task objects based on type.
 */
class TaskFactory {
  /**
   * Creates a task based on the type.
   * @param {string} type - The type of task (e.g., "personal", "work", "team").
   * @param {string} title - The task title.
   * @param {string|Date} deadline - The deadline date
   * @param {string} [email] - Optional email for notifications.
   * @param {string} [createdBy] - Email or UID of the creator.
   * @param {string} [owner] - Email or UID of the task owner.
   * @param {string[]} [assigned] - List of assigned users (emails or UIDs).
   * @return {Object} - A task object with default and computed fields.
   */
  static createTask(
      type,
      title,
      deadline,
      email = null,
      createdBy = "",
      owner = "",
      assigned = [],
  ) {
    const deadlineDate = deadline instanceof Date ?
     deadline : new Date(deadline);

    const baseTask = {
      title,
      deadline: deadlineDate,
      email,
      notes: "",
      progress: 0,
      createdBy,
      owner,
      assigned,
    };

    switch (type) {
      case "personal":
        return {
          ...baseTask,
          status: "Pending",
          priority: "Low",
          shared: false,
          type: "personal",
        };
      case "work":
        return {
          ...baseTask,
          status: "In Progress",
          priority: "High",
          shared: true,
          type: "work",
        };
      case "team":
        return {
          ...baseTask,
          status: "Not Started",
          priority: "Medium",
          shared: true,
          type: "team",
        };
      default:
        throw new Error(`Unsupported task type: ${type}`);
    }
  }
}

module.exports = TaskFactory;
