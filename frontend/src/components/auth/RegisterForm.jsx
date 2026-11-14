import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    if (!formData.email.trim()) {
      return "Email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      return "Password is required.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Automatically log the user in after registration
      try {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } catch {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Anjani Chauhan"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-14 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-white font-semibold transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 shadow-md"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;
