
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/students/login`,
        {
          email: form.email.trim(),
          password: form.password,
        }
      );

      // Remove previous owner session
      sessionStorage.removeItem("access_token");

      // Save student session
      sessionStorage.setItem(
        "student_access_token",
        response.data.access_token
      );

      sessionStorage.setItem(
        "student_name",
        response.data.student_name
      );

      // Update navbar
      window.dispatchEvent(new Event("auth-changed"));

      navigate("/student/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-auth-container">
      <div className="student-login-wrapper">

        <div className="student-login-icon">🎓</div>

        <div className="student-login-heading">
          <span>STUDENT PORTAL</span>
          <h1>Welcome back</h1>
          <p>
            Sign in to manage your saved rooms and enquiries.
          </p>
        </div>

        <form
          className="student-auth-card"
          onSubmit={handleSubmit}
        >
          <div className="student-login-field">
            <label htmlFor="student-login-email">
              Email Address
            </label>

            <input
              id="student-login-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="student-login-field">
            <label htmlFor="student-login-password">
              Password
            </label>

            <div className="student-password-wrapper">
              <input
                id="student-login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
                placeholder="Enter your password"
              />

              <button
                type="button"
                className="student-password-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="student-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="student-login-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Your Account"}
          </button>

          <p className="student-login-register">
            Don't have an account?{" "}
            <Link to="/student/register">
              Create an account
            </Link>
          </p>
        </form>

        <Link to="/" className="student-login-back">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default StudentLogin;
