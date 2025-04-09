import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewTask = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("personal");
  const [email, setEmail] = useState("");
  const [owner, setOwner] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [assigned, setAssigned] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [undoAvailable, setUndoAvailable] = useState(false);
  const navigate = useNavigate();

  const backendURL = "https://us-central1-taskmaster-2a195.cloudfunctions.net/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !deadline || !type) {
      setMessage("Please fill in all required fields.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("taskmasterUser") || "{}");
    const uid = user?.uid;
  
    if (!uid) {
      setMessage("You must be logged in to create a task.");
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid, // ✅ backend needs this
          title,
          deadline: new Date(deadline).toISOString(),
          type,
          email: email || null,
          owner: owner || uid,
          createdBy: createdBy || uid,
          assigned: assigned ? assigned.split(",").map((s) => s.trim()) : [],
          progress,
        }),
      });
  
      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Task added!");
        setUndoAvailable(true);
        setTitle("");
        setDeadline("");
        setType("personal");
        setEmail("");
        setOwner("");
        setCreatedBy("");
        setAssigned("");
        setProgress(0);
        setTimeout(() => setUndoAvailable(false), 10000);
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (err) {
      setMessage("Failed to connect to backend.");
      console.error(err);
    }
    setLoading(false);
  };
  

  const handleUndo = async () => {
    try {
      const res = await fetch(`${backendURL}/undo`, { method: "POST" });
      const result = await res.json();
      console.log("Undo result:", result);
      setUndoAvailable(false);
    } catch (err) {
      console.error("Undo failed", err);
    }
  };

  return (
    
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-[#6B3FA0] mb-4">➕ Add New Task</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6 border border-gray-200">

      {undoAvailable && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded flex justify-between items-center">
          <span>Task added.</span>
          <button
            onClick={handleUndo}
            className="ml-4 px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Undo
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Deadline</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Notification Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Task Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="team">Team</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Created By</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Owner</label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Assigned To (comma-separated)</label>
          <input
            type="text"
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Progress: {progress}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6B3FA0] text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>

        {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
    </div>
  );
};

export default NewTask;
