import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Connect with Firebase Auth here if desired
    alert("Login logic not implemented yet!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="bg-[#6B3FA0] text-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login to TaskMaster</h2>
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
        />
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-white text-[#6B3FA0] font-semibold px-4 py-2 rounded hover:bg-gray-100"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
