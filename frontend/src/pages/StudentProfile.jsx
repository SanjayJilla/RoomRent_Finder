import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

function StudentProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("student_access_token");

    if (!token) {
      navigate("/student/login", { replace: true });
      return;
    }

    let active = true;

    axios
      .get(`${API_URL}/students/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (active) {
          setForm({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          });
        }
      })
      .catch((err) => {
        if (!active) return;

        if ([401, 403].includes(err.response?.status)) {
          sessionStorage.removeItem("student_access_token");
          sessionStorage.removeItem("student_name");
          navigate("/student/login", { replace: true });
        } else {
          setError("Unable to load your profile.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = sessionStorage.getItem("student_access_token");

    if (!token) {
      navigate("/student/login");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.patch(
        `${API_URL}/students/me`,
        {
          name: form.name.trim(),
          phone: form.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedStudent = response.data.student;

      setForm({
        name: updatedStudent.name,
        email: updatedStudent.email,
        phone: updatedStudent.phone,
      });

      sessionStorage.setItem("student_name", updatedStudent.name);

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="container">Loading your profile...</p>;
  }

  return (
    <div className="student-auth-container">
      <form className="student-auth-card" onSubmit={handleSubmit}>
        <h2>My Profile</h2>
        <p>Manage your personal information.</p>

        <label htmlFor="profile-name">Full Name</label>
        <input
          id="profile-name"
          type="text"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          minLength={2}
          maxLength={100}
          required
        />

        <label htmlFor="profile-email">Email Address</label>
        <input
          id="profile-email"
          type="email"
          value={form.email}
          readOnly
        />

        <label htmlFor="profile-phone">Phone Number</label>
        <input
          id="profile-phone"
          type="tel"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          minLength={10}
          maxLength={15}
          pattern="[0-9]{10,15}"
          required
        />

        {error && <p className="error">{error}</p>}
        {success && <p className="profile-success">{success}</p>}

        <button
          type="submit"
          className="primary-btn"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
                <Link
        to="/student/change-password"
        className="change-password-link"
        >
        Change Password
        </Link>

        <p>
          <Link to="/student/dashboard">
            ← Back to Dashboard
          </Link>
        </p>
      </form>
    </div>
  );
}

export default StudentProfile;
