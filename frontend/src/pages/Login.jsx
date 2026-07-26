import { useState } from "react";
import { loginUser } from "../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // Save JWT token
      localStorage.setItem("token", data.access_token);

      console.log("Login Successful:", data);

      // Redirect to Dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816]">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-[#FAF9F6] p-8 shadow-xl"
      >
        <h1 className="mb-8 text-4xl font-bold text-slate-900">
          Welcome Back
        </h1>

        <div className="mb-5">
          <label className="mb-2 block text-slate-700">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="mb-8">
          <label className="mb-2 block text-slate-700">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-violet-600 py-3 text-lg font-semibold text-white transition hover:bg-violet-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;