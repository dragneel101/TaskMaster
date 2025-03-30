/**
 * Manages execution and history of commands.
 * Implements the Invoker role in the Command Pattern.
 */
class CommandManager {
  /**
   * Initializes the command history stack.
   */
  constructor() {
    this.history = [];
  }

  /**
   * Executes a command and stores it in history.
   * @param {Object} command - A command object with async execute() and undo().
   */
  async execute(command) {
    await command.execute();
    this.history.push(command);
  }

  /**
   * Undoes the most recently executed command.
   */
  async undo() {
    const command = this.history.pop();
    if (command) {
      await command.undo();
    }
  }
}

module.exports = new CommandManager(); // Singleton
