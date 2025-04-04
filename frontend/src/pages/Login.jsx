import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      const res = await fetch("https://us-central1-taskmaster-2a195.cloudfunctions.net/api/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("taskmasterUser", JSON.stringify(data));
        alert(`Login successful! Welcome ${data.role}`);
        navigate("/dashboard"); // ✅ Redirect to dashboard
      } else {
        alert("Login failed: " + data.error);
      }

    } catch (err) {
      console.error("Login error:", err.message);
      alert("Login error: " + err.message);
    }
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
