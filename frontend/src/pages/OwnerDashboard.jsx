import { useEffect, useState } from "react";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
  sessionStorage.removeItem("access_token");
  navigate("/login", { replace: true });
  };
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/owners/me/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRooms(response.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          sessionStorage.removeItem("access_token");
          navigate("/login", { replace: true });
        } else {
          setError("Unable to load your rooms.");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);
  //delete function
  const handleDelete = async (roomId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this property?"
  );

  if (!confirmed) return;

  try {
    const token = sessionStorage.getItem("access_token");

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setRooms((previousRooms) =>
      previousRooms.filter((room) => room.id !== roomId)
    );

  } catch (err) {
    alert(
      err.response?.data?.detail || "Unable to delete property"
    );
  }
};

  return (
    
    <div className="container">
        <div className="dashboard-header">
        <div>
          <h1>Owner Dashboard</h1>
          <p>Manage your rental room listings.</p>
        </div>

        {/* NEW: Owner Logout button */}
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
            onClick={() => navigate("/owner/add-room")}
            className="primary-btn"
        >
          + Add Property
        </button>
      </div>
      {loading ? (
        <p>Loading your rooms...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : rooms.length === 0 ? (
        <p>You haven't added any rooms yet.</p>
      ) : (
        <div className="owner-properties">
          {rooms.map((room) => (
            <div className="owner-property-card" key={room.id}>
                {room.images?.length > 0 ? (
                    <img
                    src={`${import.meta.env.VITE_API_URL}${room.images[0]}`}
                    alt={room.title}
                    className="owner-property-image"
                    />
                ) : (
                    <div className="owner-property-placeholder">
                    No Photo Available
                    </div>
                )}

                <div className="owner-property-content">
                    <div className="owner-property-heading">
                    <h3>{room.title}</h3>

                    <span
                        className={
                        room.available_rooms > 0
                            ? "status-available"
                            : "status-occupied"
                        }
                    >
                        {room.available_rooms > 0
                        ? "Available"
                        : "Fully Occupied"}
                    </span>
                    </div>

                    <p>📍 {room.location}</p>
                    <h3>₹{room.rent?.toLocaleString("en-IN")} / month</h3>

                    <p>
                    Rooms Available: {room.available_rooms} / {room.total_rooms}
                    </p>

                    <div className="owner-property-actions">
                    <button
                        type="button"
                        onClick={() => navigate(`/owner/edit-room/${room.id}`)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/owner/rooms/${room.id}/photos`)}
                    >
                        Manage Photos
                    </button>

                    <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(room.id)}
                    >
                        Delete
                    </button>
                    
                    <Link to="/owner/profile" className="primary-btn">
                        My Profile
                      </Link>
                      
                    </div>
                </div>
                </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;