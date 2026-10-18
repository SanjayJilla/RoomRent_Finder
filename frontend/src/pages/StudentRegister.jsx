import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function StudentRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/students/register`,
        form
      );

      alert("Registration successful! Please login.");
      navigate("/student/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-auth-container">
      <form className="student-auth-card" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>
        <p>Create an account to find your ideal room.</p>

        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          minLength={2}
          maxLength={100}
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />

        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="[0-9]{10}"
          maxLength={10}
          placeholder="10-digit mobile number"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={128}
          placeholder="Minimum 8 characters"
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-btn" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
        </button>

        <p>
          Already registered?{" "}
          <Link to="/student/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default StudentRegister;