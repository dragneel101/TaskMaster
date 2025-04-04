import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [canDelete, setCanDelete] = useState(false);

  const storedUser = JSON.parse(localStorage.getItem("taskmasterUser") || "{}");
  const currentUid = storedUser?.uid;
  const currentRole = storedUser?.role;

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const taskData = snap.data();
          setTask(taskData);
          setUpdatedTask(taskData);

          // ✅ Safely determine delete permission
          const canDeleteCheck =
            (taskData.type === "work" && currentRole === "admin") ||
            ((taskData.type === "team" || taskData.type === "personal") &&
              taskData.owner === currentUid);
          setCanDelete(canDeleteCheck);
        } else {
          console.warn("No task found with ID:", id);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id, currentUid, currentRole]);

  const handleUpdate = async () => {
    const docRef = doc(db, "tasks", id);
    await updateDoc(docRef, updatedTask);
    setTask(updatedTask);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this task?")) {
      await deleteDoc(doc(db, "tasks", id));
      navigate("/dashboard");
    }
  };

  if (!task) return <div className="p-6">Loading task...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#6B3FA0] mb-4">Task Detail</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="font-semibold block">Title:</label>
            {editMode ? (
              <input
                value={updatedTask.title}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, title: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
              />
            ) : (
              <p>{task.title}</p>
            )}
          </div>

          <div>
            <label className="font-semibold block">Deadline:</label>
            {editMode ? (
              <input
                type="datetime-local"
                value={
                  new Date(updatedTask.deadline.seconds * 1000)
                    .toISOString()
                    .slice(0, 16)
                }
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    deadline: new Date(e.target.value),
                  })
                }
                className="w-full border px-2 py-1 rounded"
              />
            ) : (
              <p>
                {new Date(task.deadline.seconds * 1000).toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <label className="font-semibold block">Status:</label>
            {editMode ? (
              <select
                value={updatedTask.status}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, status: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            ) : (
              <p>{task.status}</p>
            )}
          </div>

          <div>
            <label className="font-semibold block">Created By:</label>
            <p>{task.createdBy || "N/A"}</p>
          </div>

          <div>
            <label className="font-semibold block">Owner:</label>
            <p>{task.owner || "N/A"}</p>
          </div>

          <div>
            <label className="font-semibold block">Assigned To:</label>
            <p>{task.assigned?.join(", ") || "N/A"}</p>
          </div>

          <div>
            <label className="font-semibold block">
              Progress: {editMode ? updatedTask.progress : task.progress || 0}%
            </label>
            {editMode ? (
              <input
                type="range"
                min="0"
                max="100"
                value={updatedTask.progress || 0}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    progress: Number(e.target.value),
                  })
                }
                className="w-full"
              />
            ) : (
              <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                <div
                  className="bg-green-500 h-4 transition-all"
                  style={{ width: `${task.progress || 0}%` }}
                ></div>
              </div>
            )}
          </div>

          <div>
            <label className="font-semibold block">Notes:</label>
            {editMode ? (
              <textarea
                value={updatedTask.notes}
                onChange={(e) =>
                  setUpdatedTask({ ...updatedTask, notes: e.target.value })
                }
                className="w-full border px-2 py-1 rounded"
                rows={4}
              />
            ) : (
              <p className="whitespace-pre-wrap">
                {task.notes || "No notes yet."}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            {editMode ? (
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
