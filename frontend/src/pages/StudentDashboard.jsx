
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getFavorites } from "../services/favoritesApi";

function StudentDashboard() {
  const navigate = useNavigate();

  const studentName =
    sessionStorage.getItem("student_name") || "Student";

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedRoomsCount, setSavedRoomsCount] = useState(0);
  const [favoritesError, setFavoritesError] = useState("");

  // Load student enquiries
  useEffect(() => {
    const token = sessionStorage.getItem("student_access_token");

    if (!token) {
      navigate("/student/login", { replace: true });
      return;
    }

    let active = true;

    axios
      .get(`${import.meta.env.VITE_API_URL}/students/me/enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (active) {
          setEnquiries(
            Array.isArray(response.data) ? response.data : []
          );
        }
      })
      .catch((err) => {
        if (!active) return;

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          sessionStorage.removeItem("student_access_token");
          sessionStorage.removeItem("student_name");
          navigate("/student/login", { replace: true });
        } else {
          setError("Unable to load your enquiries.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  // Load saved rooms count
  useEffect(() => {
    const token = sessionStorage.getItem("student_access_token");

    if (!token) return;

    let active = true;

    getFavorites()
      .then((data) => {
        if (active) {
          setSavedRoomsCount(
            Array.isArray(data) ? data.length : 0
          );
        }
      })
      .catch(() => {
        if (active) {
          setFavoritesError(
            "Unable to load saved rooms count."
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Dashboard statistics
  const totalEnquiries = enquiries.length;

  const pendingEnquiries = enquiries.filter(
    (enquiry) =>
      (enquiry.status || "Pending").toLowerCase() === "pending"
  ).length;

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("student_access_token");
    sessionStorage.removeItem("student_name");

    navigate("/student/login", { replace: true });
  };

  // Enquiry status
  const getEnquiryStatus = (status) => {
    const value = (status || "Pending").toLowerCase();

    if (value === "accepted") {
      return {
        label: "Accepted",
        className: "enquiry-status accepted",
      };
    }

    if (value === "rejected") {
      return {
        label: "Rejected",
        className: "enquiry-status rejected",
      };
    }

    return {
      label: "Pending",
      className: "enquiry-status pending",
    };
  };

  return (
    <div className="container">

      {/* Welcome section */}
      <h1>Welcome, {studentName}!</h1>

      <p>
        Manage your rental room search and enquiries.
      </p>

      {/* Dashboard actions */}
      <div className="student-dashboard-actions">

        <Link to="/" className="primary-btn">
          Explore Rooms
        </Link>

        <Link to="/favorites" className="primary-btn">
          Saved Rooms
        </Link>

        <Link
          to="/student/profile"
          className="primary-btn"
        >
          My Profile
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="delete-btn"
        >
          Logout
        </button>

      </div>

      {/* Dashboard statistics */}
      <div className="student-stats-grid">

        <div className="student-stat-card">
          <h3>❤️ Saved Rooms</h3>

          <p>{savedRoomsCount}</p>

          <Link to="/favorites">
            View Saved Rooms →
          </Link>
        </div>

        <div className="student-stat-card">
          <h3>📩 Total Enquiries</h3>

          <p>{totalEnquiries}</p>
        </div>

        <div className="student-stat-card">
          <h3>⏳ Pending Enquiries</h3>

          <p>{pendingEnquiries}</p>
        </div>

      </div>

      {favoritesError && (
        <p className="error">{favoritesError}</p>
      )}

      {/* Enquiry history */}
      <div className="student-enquiries-section">

        <h2>My Enquiries ({enquiries.length})</h2>

        {loading ? (
          <p>Loading your enquiries...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : enquiries.length === 0 ? (
          <p>
            You haven't sent any enquiries yet.
            Explore rooms and contact an owner.
          </p>
        ) : (
          <div className="student-enquiries-list">

            {enquiries.map((enquiry) => {
              const status = getEnquiryStatus(
                enquiry.status
              );

              return (
                <div
                  className="student-enquiry-card"
                  key={enquiry.id}
                >

                  <div className="student-enquiry-heading">

                    <h3>
                      {enquiry.room_title || "Room"}
                    </h3>

                    <span
                      className={`student-status ${status.className}`}
                    >
                      {status.label}
                    </span>

                  </div>

                  <p>
                    📍 {enquiry.location || "Location unavailable"}
                  </p>

                  <p>
                    <strong>Rent:</strong>{" "}
                    {enquiry.rent != null
                      ? `₹${Number(enquiry.rent).toLocaleString("en-IN")}/month`
                      : "Not available"}
                  </p>

                  <p>
                    <strong>Your Message:</strong>{" "}
                    {enquiry.message}
                  </p>

                  <Link to={`/rooms/${enquiry.room_id}`}>
                    View Property →
                  </Link>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default StudentDashboard;
