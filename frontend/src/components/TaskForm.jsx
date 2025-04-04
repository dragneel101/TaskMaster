import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TaskForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("personal");
  const [deadline, setDeadline] = useState("");
  const [email, setEmail] = useState("");
  const [assigned, setAssigned] = useState("");
  const [notes, setNotes] = useState("");
  const [role, setRole] = useState("user"); // default to 'user'

  useEffect(() => {
    const stored = localStorage.getItem("taskmasterUser");
    if (stored) {
      const parsed = JSON.parse(stored);
      setRole(parsed?.role || "user");
    }
  }, []);

  const handleSubmit = async (e) => {
    console.log("🚀 handleSubmit fired!");
    e.preventDefault();
    console.log("🚀 handleSubmit fired!2");
  
    const storedUser = JSON.parse(localStorage.getItem("taskmasterUser") || "{}");
    const uid = storedUser?.uid;
  
    if (!uid) {
      alert("You must be logged in to create a task.");
      return;
    }
  
    if (!title || !deadline || !type) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const payload = {
      uid,
      title,
      type,
      deadline: new Date(deadline).toISOString(),
      email: email || null,
      owner: uid,
      assigned: assigned ? assigned.split(",").map((s) => s.trim()) : [],
      progress: 0,
      status: "Pending",
      notes
    };
    console.log("🧾 Final Payload to Backend:", {
      uid,
      title,
      deadline: new Date(deadline).toISOString(),
      type,
      email,
      owner: uid,
      assigned: assigned ? assigned.split(",").map((s) => s.trim()) : [],
      progress: 0,
      status: "Pending",
      notes
    });
  
    try {
      const res = await fetch("https://us-central1-taskmaster-2a195.cloudfunctions.net/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // ✅ flat structure
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Task created successfully!");
        navigate("/dashboard");
      } else {
        console.error("Error:", data);
        alert("Failed to create task: " + data.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-[#6B3FA0]">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title*</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Type*</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="personal">Personal</option>
            <option value="team">Team</option>
            {role === "admin" && <option value="work">Work</option>}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Deadline*</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Email (for notification)</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Assigned To (comma-separated emails)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={assigned}
            onChange={(e) => setAssigned(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold">Notes</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-[#6B3FA0] text-white font-semibold px-6 py-2 rounded hover:bg-[#58318e]"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
