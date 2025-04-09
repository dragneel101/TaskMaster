import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection, query, where, orderBy, onSnapshot, deleteDoc, doc
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const deletedTaskTimeout = useRef(null);
  const clickTimestamps = useRef({});
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("taskmasterUser") || "{}");
  const currentRole = storedUser?.role;


  const fetchTasks = useCallback(() => {
    let q = query(collection(db, "tasks"), orderBy("deadline"));

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      q = query(
        collection(db, "tasks"),
        where("deadline", ">=", start),
        where("deadline", "<=", end),
        orderBy("deadline")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllTasks(taskData);
      setTasks(taskData);
    });

    return unsubscribe;
  }, [startDate, endDate]);

  useEffect(() => {
    const unsubscribe = fetchTasks();
    return () => unsubscribe();
  }, [fetchTasks]);

  const handleTaskClick = (task) => {
    const now = Date.now();
    const lastClick = clickTimestamps.current[task.id] || 0;
    const isDoubleClick = now - lastClick < 300;

    if (isDoubleClick) {
      navigate(`/task/${task.id}`);
    } else {
      setSelectedTaskId(task.id);
      clickTimestamps.current[task.id] = now;
    }
  };

  const handleDelete = (task) => {
    toast.info(
      <div className="flex flex-col">
        <span className="truncate max-w-[220px]">Task "{task.title}" deleted.</span>
        <button
          onClick={() => undoDelete(task)}
          className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 w-fit self-start"
        >
          Undo
        </button>
      </div>,
      {
        autoClose: 15000,
        closeOnClick: false,
      }
    );

    deletedTaskTimeout.current = setTimeout(async () => {
      await deleteDoc(doc(db, "tasks", task.id));
    }, 5000);
  };

  const undoDelete = (task) => {
    if (deletedTaskTimeout.current) {
      clearTimeout(deletedTaskTimeout.current);
      deletedTaskTimeout.current = null;
    }
    toast.dismiss();
    toast.success(`Undo delete: "${task.title}" restored.`);
  };
  const handleExportCSV = () => {
    if (!tasks.length) return;
  
    const headers = [
      "Title",
      "Type",
      "Deadline",
      "Owner",
      "Created By",
      "Status",
      "Assigned",
      "Progress",
      "Notes"
    ];
  
    const rows = tasks.map((task) => [
      task.title,
      task.type,
      new Date(task.deadline?.seconds * 1000 || task.deadline).toLocaleString(),
      task.owner || "",
      task.createdBy || "",
      task.status || "",
      (task.assigned || []).join(", "),
      task.progress ?? 0,
      (task.notes || "").replace(/\n/g, " "),
    ]);
  
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "taskmaster_tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <ToastContainer />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Filter by Owner</label>
          <input
            type="text"
            placeholder="e.g. john@example.com"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setTasks(allTasks.filter(t => t.owner?.toLowerCase().includes(value)));
            }}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Filter by Assigned</label>
          <input
            type="text"
            placeholder="e.g. jane@example.com"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setTasks(allTasks.filter(t => t.assigned?.join().toLowerCase().includes(value)));
            }}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Filter by Type</label>
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return setTasks(allTasks);
              setTasks(allTasks.filter(t => t.type === value));
            }}
            className="w-full border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setTasks(allTasks);
            }}
            className="w-full bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Header + Add Task */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#6B3FA0]">Task Dashboard</h1>
        <button
          onClick={() => navigate("/new-task")}
          className="bg-[#6B3FA0] text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          + Add Task
        </button>
        {currentRole === "admin" && (
      <button
        onClick={handleExportCSV}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Export to CSV
      </button>
    )}
      </div>

      {/* Date Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {/* Task List + Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Task List */}
        <ul className="space-y-3 xl:col-span-2">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                onClick={() => handleTaskClick(task)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded cursor-pointer border-l-4 transition duration-300 hover:scale-[1.01] ${
                  task.status === 'Completed' ? 'border-green-600 bg-green-50' :
                  task.status === 'In Progress' ? 'border-yellow-500 bg-yellow-50' :
                  'border-red-500 bg-red-50'
                } ${selectedTaskId === task.id ? 'ring-2 ring-blue-400' : 'hover:bg-opacity-80'}`}
              >
                <div className="font-semibold text-lg">{task.title}</div>
                <div className="text-sm text-gray-600">
                  {task.status} | Due: {new Date(task.deadline.seconds * 1000).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Owner: {task.owner || "N/A"}</div>
                <div className="text-xs text-gray-500">Assigned: {task.assigned?.join(", ") || "None"}</div>
                <div className="w-full bg-gray-200 rounded h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${task.progress || 0}%` }}
                  ></div>
                </div>

                {selectedTaskId === task.id && (
                  <div className="flex gap-4 mt-3">
                    <button
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/task/${task.id}`);
                      }}
                    >
                      <FaEye /> View
                    </button>
                    <button
                      className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Summary & Chart */}
        <div className="space-y-4">
          <div className="bg-white shadow rounded p-6 text-center">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Total Tasks</h2>
            <p className="text-4xl font-bold text-[#6B3FA0]">{tasks.length}</p>
          </div>
          <div className="bg-white shadow rounded p-4 h-[300px]">
            <h2 className="text-lg font-semibold mb-2">Tasks by Status</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={["Pending", "In Progress", "Completed"].map((status) => ({
                  name: status,
                  count: tasks.filter((t) => t.status === status).length
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6B3FA0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
