import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddRoom() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    rent: "",
    deposit: "",
    total_rooms: "",
    available_rooms: "",
    property_type: "PG",
    room_type: "Single",
    furnished: false,
    wifi: false,
    attached_bathroom: false,
    food_included: false,
    gender_preference: "Any",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (Number(form.available_rooms) > Number(form.total_rooms)) {
      setError("Available rooms cannot exceed total rooms.");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("access_token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms`,
        {
          ...form,
          rent: Number(form.rent),
          deposit: Number(form.deposit),
          total_rooms: Number(form.total_rooms),
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
          : "Unable to add property. Check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Add New Property</h1>

      <form className="property-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Property title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        {["rent", "deposit", "total_rooms", "available_rooms"].map(
          (field) => (
            <label key={field}>
              {field.replaceAll("_", " ")}
              <input
                type="number"
                name={field}
                value={form[field]}
                onChange={handleChange}
                min={field === "rent" || field === "total_rooms" ? 1 : 0}
                required
              />
            </label>
          )
        )}

        <label>
          Property Type
          <select
            name="property_type"
            value={form.property_type}
            onChange={handleChange}
          >
            <option value="PG">PG</option>
            <option value="Apartment">Apartment</option>
            <option value="Independent Room">Independent Room</option>
          </select>
        </label>

        <label>
          Room Type
          <select
            name="room_type"
            value={form.room_type}
            onChange={handleChange}
          >
            <option value="Single">Single</option>
            <option value="Double Sharing">Double Sharing</option>
            <option value="Triple Sharing">Triple Sharing</option>
          </select>
        </label>

        <label>
          Gender Preference
          <select
            name="gender_preference"
            value={form.gender_preference}
            onChange={handleChange}
          >
            <option value="Any">Any</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
          </select>
        </label>

        {[
          "furnished",
          "wifi",
          "attached_bathroom",
          "food_included",
        ].map((field) => (
          <label key={field} className="checkbox-label">
            <input
              type="checkbox"
              name={field}
              checked={form[field]}
              onChange={handleChange}
            />
            {field.replaceAll("_", " ")}
          </label>
        ))}

        <textarea
          name="description"
          placeholder="Describe your property"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
}

export default AddRoom;