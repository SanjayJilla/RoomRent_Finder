import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}`;

function OwnerEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: Store selected statuses before saving
  const [selectedStatuses, setSelectedStatuses] = useState({});

  // NEW: Track which enquiry is being updated
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    axios
      .get(`${API_URL}/owners/me/enquiries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEnquiries(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("access_token");
          navigate("/login", { replace: true });
        } else {
          setError("Unable to load enquiries.");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // NEW: Save the selected enquiry status to the backend
  const handleUpdateStatus = async (enquiryId) => {
    const token = sessionStorage.getItem("access_token");

    const enquiry = enquiries.find((item) => item.id === enquiryId);

    if (!enquiry) return;

    const newStatus =
      selectedStatuses[enquiryId] ?? enquiry.status;

    setUpdatingId(enquiryId);
    setUpdateError("");

    try {
      // IMPORTANT: Confirm this endpoint exists in main.py
      await axios.patch(
        `${API_URL}/owners/enquiries/${enquiryId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // NEW: Update the displayed status without refreshing
      setEnquiries((previous) =>
        previous.map((item) =>
          item.id === enquiryId
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      console.error("Status update failed:", err.response?.data || err);

      setUpdateError(
        err.response?.data?.detail ||
          "Unable to update enquiry status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container">
      <div className="enquiries-header">
        <div>
          <h1>Property Enquiries</h1>
          <p>View and manage enquiries received for your properties.</p>
        </div>

        <Link to="/owner/dashboard" className="primary-btn">
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <p>Loading enquiries...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : enquiries.length === 0 ? (
        <p>No enquiries received yet.</p>
      ) : (
        <div className="enquiries-list">
          {updateError && <p className="error">{updateError}</p>}

          {enquiries.map((enquiry) => (
            <div className="enquiry-card" key={enquiry.id}>
              <div className="enquiry-card-header">
                <div>
                  <h3>{enquiry.room_title}</h3>
                  <p>Enquiry #{enquiry.id}</p>
                </div>

                {/* CHANGED: Status badge reflects the saved status */}
                <span
                  className={`enquiry-status ${enquiry.status.toLowerCase()}`}
                >
                  {enquiry.status}
                </span>
              </div>

              <div className="enquiry-student-info">
                <p>
                  <strong>Student:</strong> {enquiry.student_name}
                </p>

                <p>
                  <strong>Phone:</strong> {enquiry.student_phone}
                </p>

                <p>
                  <strong>Message:</strong> {enquiry.message}
                </p>
              </div>

              {/* NEW: Status selection and update button */}
              <div className="enquiry-status-editor">
                <label htmlFor={`status-${enquiry.id}`}>
                  Update Status
                </label>

                <select
                  id={`status-${enquiry.id}`}
                  value={
                    selectedStatuses[enquiry.id] ?? enquiry.status
                  }
                  onChange={(e) =>
                    setSelectedStatuses((previous) => ({
                      ...previous,
                      [enquiry.id]: e.target.value,
                    }))
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button
                  type="button"
                  className="primary-btn"
                  disabled={
                    updatingId === enquiry.id ||
                    (selectedStatuses[enquiry.id] ?? enquiry.status) ===
                      enquiry.status
                  }
                  onClick={() => handleUpdateStatus(enquiry.id)}
                >
                  {updatingId === enquiry.id
                    ? "Updating..."
                    : "Save Status"}
                </button>
              </div>

              <div className="enquiry-actions">
                <a
                  href={`tel:${enquiry.student_phone}`}
                  className="primary-btn"
                >
                  Call Student
                </a>

                <Link to={`/rooms/${enquiry.room_id}`}>
                  View Property →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerEnquiries;