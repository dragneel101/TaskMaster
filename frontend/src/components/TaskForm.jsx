import React, { useState } from "react";

/**
 * TaskForm Component
 * Allows users to create a new task with datetime and optional email.
 */
const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [type, setType] = useState("personal");
  const [email, setEmail] = useState(""); // ✅ new
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const backendURL = "https://us-central1-taskmaster-2a195.cloudfunctions.net/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !deadline || !type) {
      setMessage("Please fill in all required fields.");
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
          title,
          deadline: new Date(deadline).toISOString(), // ✅ ensure it's full ISO datetime
          type,
          email: email || null, // optional
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("✅ Task added!");
        setTitle("");
        setDeadline("");
        setType("personal");
        setEmail("");
      } else {
        setMessage("Error: " + result.error);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Failed to connect to backend.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">➕ Add a New Task</h2>

      <div className="mb-2">
        <label className="block text-sm mb-1">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Deadline (Date & Time):</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm mb-1">Notification Email (optional):</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="user@example.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Task Type:</label>
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

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>

      {message && <p className="text-sm mt-2 text-gray-600">{message}</p>}
    </form>
  );
};

export default TaskForm;
