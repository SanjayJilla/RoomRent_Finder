import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    location: "",
    rent: "",
    available_rooms: "",
    wifi: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    axios.get(`${import.meta.env.VITE_API_URL}/owners/me/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      const room = response.data.find(
        (r) => r.id === Number(roomId)
      );

      if (!room) {
        setError("Room not found or you don't own this room.");
        return;
      }

      setForm({
        title: room.title,
        location: room.location,
        rent: room.rent,
        available_rooms: room.available_rooms,
        wifi: room.wifi ?? false,
      });
    })
    .catch(() => setError("Unable to load room details."))
    .finally(() => setLoading(false));
  }, [roomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = sessionStorage.getItem("access_token");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/rooms/${roomId}`,
        {
          ...form,
          rent: Number(form.rent),
          available_rooms: Number(form.available_rooms),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/owner/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Unable to update property."
      );
    }
  };

  if (loading) return <p>Loading room...</p>;

  return (
    <div className="container">
      <h1>Edit Property</h1>

      {error && <p className="error">{error}</p>}

      <form className="property-form" onSubmit={handleSubmit}>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          placeholder="Title"
          required
        />

        <input
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
          placeholder="Location"
          required
        />

        <label>
          Monthly Rent
          <input
            type="number"
            value={form.rent}
            onChange={(e) =>
              setForm({ ...form, rent: e.target.value })
            }
            min="1"
            required
          />
        </label>

        <label>
          Available Rooms
          <input
            type="number"
            value={form.available_rooms}
            onChange={(e) =>
              setForm({ ...form, available_rooms: e.target.value })
            }
            min="0"
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.wifi}
            onChange={(e) =>
              setForm({ ...form, wifi: e.target.checked })
            }
          />
          Wi-Fi Available
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditRoom;