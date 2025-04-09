import React from "react";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      className="bg-white text-[#6B3FA0] min-h-screen flex items-center justify-center p-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Welcome to TaskMaster</h2>
        <p className="text-lg leading-relaxed text-gray-700">
          Stay on top of your tasks with smart reminders, deadline tracking, and collaborative workspaces — all in one beautiful, streamlined dashboard.
        </p>
      </div>
    </motion.div>
  );
};

export default Home;
