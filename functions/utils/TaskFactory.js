/**
 * Factory class for creating task objects based on type.
 */
class TaskFactory {
  /**
   * Creates a task based on the type.
   * @param {string} type - The type of task (e.g., "personal", "work", "team").
   * @param {string} title - The task title.
   * @param {string|Date} deadline - The deadline date in ISO format
   * @param {string} [email] - Optional email for notifications.
   * @return {Object} - A task object with default fields.
   */
  static createTask(type, title, deadline, email = null) {
    const deadlineDate = deadline instanceof Date ?
     deadline : new Date(deadline);

    const baseTask = {
      title,
      deadline: deadlineDate,
      email,
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
          assigned: [],
          type: "team",
        };
      default:
        throw new Error(`Unsupported task type: ${type}`);
    }
  }
}

module.exports = TaskFactory;
