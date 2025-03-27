// Factory Pattern: Responsible for generating different types of task templates
class TaskFactory {
    static createTask(type, title, deadline) {
      switch (type) {
        case 'personal':
          return {
            title,
            deadline,
            status: 'Pending',
            priority: 'Low',
            shared: false,
            type: 'personal'
          };
        case 'work':
          return {
            title,
            deadline,
            status: 'In Progress',
            priority: 'High',
            shared: true,
            type: 'work'
          };
        case 'team':
          return {
            title,
            deadline,
            status: 'Not Started',
            priority: 'Medium',
            shared: true,
            assigned: [],
            type: 'team'
          };
        default:
          throw new Error(`Unsupported task type: ${type}`);
      }
    }
  }
  
  module.exports = TaskFactory;
  