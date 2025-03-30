import React, { useState } from "react";

/**
 * TaskFilter Component
 * Fetches tasks from backend within a selected date range.
 * Uses GET /tasks?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
const TaskFilter = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5001/taskmaster-2a195/us-central1/api/tasks?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch tasks.");

      setFilteredTasks(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">📅 Filter Tasks by Deadline</h2>

      <div className="flex items-center space-x-2 mb-3">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <span>to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleFilter}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Filter"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="bg-gray-100 p-3 rounded shadow-sm hover:shadow-md"
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

export default TaskFilter;
