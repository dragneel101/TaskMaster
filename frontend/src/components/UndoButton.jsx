import React, { useState } from "react";

/**
 * UndoButton Component
 * Calls the backend POST /undo to reverse last task action.
 */
const UndoButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const backendURL = "https://us-central1-taskmaster-2a195.cloudfunctions.net/api";
  // For local testing: "http://localhost:5001/taskmaster-2a195/us-central1/api"

  const handleUndo = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${backendURL}/undo`, {
        method: "POST",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Undo failed");
      }

      setMessage(" Undo successful!");
    } catch (err) {
      console.error("Undo error:", err);
      setMessage(" Undo failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleUndo}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {loading ? "Undoing..." : "↩️ Undo Last Task"}
      </button>
      {message && <p className="text-sm text-gray-600 mt-2">{message}</p>}
    </div>
  );
};

export default UndoButton;
