/**
 * Factory class for creating task objects based on type.
 */
class TaskFactory {
  /**
   * Creates a task based on the type.
   * @param {string} type - The type of task (e.g., "personal", "work", "team").
   * @param {string} title - The task title.
   * @param {string} deadline - The deadline date in YYYY-MM-DD format.
   * @return {Object} - A task object with default fields.
   */
  static createTask(type, title, deadline) {
    switch (type) {
      case "personal":
        return {
          title,
          deadline,
          status: "Pending",
          priority: "Low",
          shared: false,
          type: "personal",
        };
      case "work":
        return {
          title,
          deadline,
          status: "In Progress",
          priority: "High",
          shared: true,
          type: "work",
        };
      case "team":
        return {
          title,
          deadline,
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

