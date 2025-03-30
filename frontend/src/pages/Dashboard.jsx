import React from "react";
import TaskForm from "../components/TaskForm";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import UndoButton from "../components/UndoButton";


/**
 * Dashboard Page
 * Displays the task list component with live updates (Observer Pattern).
 */
const Dashboard = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6"> TaskMaster Dashboard</h1>
      <TaskForm />
      <UndoButton />
      <TaskList />
      <TaskFilter />
    </div>
  );
};

export default Dashboard;