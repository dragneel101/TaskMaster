import React, { useEffect, useState } from "react";
import { db } from "../../functions/database"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Observer Pattern: Subscribe to real-time task updates
    const q = query(collection(db, "tasks"), orderBy("deadline"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(updatedTasks);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>📋 Task List (Live)</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> – {task.status} (Due: {task.deadline})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
