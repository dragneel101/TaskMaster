import React, { useState, useEffect } from 'react';

const UpdateTaskForm = ({ task, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showUndoButton, setShowUndoButton] = useState(false);
  const backendURL = "https://us-central1-taskmaster-2a195.cloudfunctions.net/api";

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setStatus(task.status || '');
      const taskDeadline = task.deadline?.toDate
        ? task.deadline.toDate()  // Firestore Timestamp -> JS Date
        : new Date(task.deadline);
      setDeadline(taskDeadline.toISOString().slice(0, 16)); // Format for datetime-local
      setShowUndoButton(false);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (status) updatedFields.status = status;
    if (deadline) updatedFields.deadline = new Date(deadline).toISOString(); // Full datetime

    try {
      const res = await fetch(`${backendURL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) throw new Error('Failed to update');

      alert('✅ Task updated!');
      setShowUndoButton(true);
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to update task');
    }
  };

  const handleUndo = async () => {
    try {
      const res = await fetch(`${backendURL}/undo-update/${task.id}`, {
        method: 'POST',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert(`↩️ ${data.message}`);
      setShowUndoButton(false);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to undo update');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="New title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full rounded"
      >
        <option value="">-- Select status --</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="flex space-x-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        {showUndoButton && (
          <button
            type="button"
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={handleUndo}
          >
            Undo Update
          </button>
        )}
      </div>
    </form>
  );
};

export default UpdateTaskForm;
