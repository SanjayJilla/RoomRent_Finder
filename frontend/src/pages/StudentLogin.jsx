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

      sessionStorage.setItem(
        "student_access_token",
        response.data.access_token
      );

      sessionStorage.setItem(
        "student_name",
        response.data.student_name
      );

      navigate("/student/dashboard");
    } catch (err) {
        console.error("FULL ERROR:", err);
  console.error("ERROR MESSAGE:", err.message);

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
      <form className="student-auth-card" onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <p>Welcome back! Find your next room.</p>

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
          placeholder="Enter your email"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
          placeholder="Enter your password"
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/student/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default StudentLogin;