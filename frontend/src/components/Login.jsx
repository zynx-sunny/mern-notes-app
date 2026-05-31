import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      localStorage.setItem("token", data.token);
      setUser(data);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">

    {/* Abstract Background */}
    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

    {/* Login Card */}
    <div className="relative z-10 w-full max-w-md p-8 rounded-[32px]
                    bg-white/10 backdrop-blur-xl
                    border border-white/20
                    shadow-2xl">

      <h2 className="text-3xl font-bold text-white text-center mb-6">
        Welcome Back
      </h2>

      {error && (
        <p className="text-red-400 mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-2xl
                     bg-white/10 text-white
                     border border-white/20
                     placeholder-gray-300
                     outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-2xl
                     bg-white/10 text-white
                     border border-white/20
                     placeholder-gray-300
                     outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-2xl
                     bg-blue-600 text-white
                     hover:bg-blue-700 transition"
        >
          Login
        </button>

      </form>

      <p className="mt-6 text-center text-gray-300">
        Don't have an account?{" "}
        <Link
          className="text-blue-400 hover:text-blue-300"
          to="/register"
        >
          Register
        </Link>
      </p>

    </div>
  </div>
);
};

export default Login;