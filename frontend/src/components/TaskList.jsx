import DeleteButton from "./DeleteButton";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const TaskList = ({ onTaskSelect, selectedTaskId }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("deadline", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 Task List (Live)</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            onClick={() => onTaskSelect && onTaskSelect(task)}
            className={`p-3 rounded shadow-sm transition cursor-pointer ${
              selectedTaskId === task.id
                ? "bg-blue-100 border-2 border-blue-500"
                : "bg-gray-100 hover:shadow-md"
            }`}
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-600">
              {task.status} | Due: {task.deadline}
            </div>
            <div className="text-xs text-gray-500">Type: {task.type}</div>
            <div><DeleteButton taskId={task.id} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
