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
   * @param {Object} command - A command object with execute() and undo().
   */
  execute(command) {
    command.execute();
    this.history.push(command);
  }

  /**
   * Undoes the most recently executed command.
   */
  undo() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
}

module.exports = new CommandManager(); // Singleton

