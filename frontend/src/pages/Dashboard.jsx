import React, { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskFilter from "../components/TaskFilter";
import TaskList from "../components/TaskList";
import UndoButton from "../components/UndoButton";
import UpdateTaskForm from "../components/UpdateTaskForm";

const Dashboard = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskRecentlyUpdated, setTaskRecentlyUpdated] = useState(false); // 👈 new flag

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">TaskMaster Dashboard</h1>
      <TaskForm />
      <UndoButton />
      <TaskList
        onTaskSelect={(task) => {
          setSelectedTask(task);
          setTaskRecentlyUpdated(false); // reset when selecting
        }}
        selectedTaskId={selectedTask?.id}
      />
      <TaskFilter />

      {selectedTask && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Update Task</h2>
          <UpdateTaskForm
            task={selectedTask}
            onSuccess={() => setTaskRecentlyUpdated(true)} //how undo
            onCancel={() => {
              setSelectedTask(null);
              setTaskRecentlyUpdated(false);
            }}
            onClear={() => setSelectedTask(null)} 
            taskRecentlyUpdated={taskRecentlyUpdated}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
