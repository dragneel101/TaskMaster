import React, { useEffect, useState } from "react";
import { db } from "../../functions/database";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

/**
 * TaskList Component
 * Implements the Observer Pattern via Firestore onSnapshot().
 * Subscribes to the tasks collection and re-renders when tasks update.
 */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Observer Pattern: real-time listener on the tasks collection
    const q = query(collection(db, "tasks"), orderBy("deadline", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskData);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 Task List (Live)</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-gray-100 p-3 rounded shadow-sm hover:shadow-md transition"
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-600">
              {task.status} | Due: {task.deadline}
            </div>
            <div className="text-xs text-gray-500">Type: {task.type}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
