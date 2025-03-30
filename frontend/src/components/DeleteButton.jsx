import React from "react";

const DeleteButton = ({ taskId }) => {
  const handleClick = async () => {
    const backendURL = "https://us-central1-taskmaster-2a195.cloudfunctions.net/api";
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      const url = `${backendURL}/tasks/${taskId}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        const errorText = contentType?.includes("application/json")
          ? (await res.json()).error
          : await res.text();

        console.error("Delete failed:", errorText);
        alert(`Failed to delete task:\n${errorText}`);
        return;
      }

      alert("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("An error occurred while deleting the task.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-4 text-red-600 hover:text-red-800 text-sm"
    >
      🗑️ Delete
    </button>
  );
};

export default DeleteButton;
