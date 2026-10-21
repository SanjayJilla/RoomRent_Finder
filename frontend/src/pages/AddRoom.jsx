
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const rent = Number(form.rent);
    const deposit = Number(form.deposit);
    const totalRooms = Number(form.total_rooms);
    const availableRooms = Number(form.available_rooms);

    if (rent <= 0) {
      setError("Monthly rent must be greater than zero.");
      return;
    }

    if (deposit < 0) {
      setError("Deposit cannot be negative.");
      return;
    }

    if (
      !Number.isInteger(totalRooms) ||
      totalRooms < 1
    ) {
      setError("Total rooms must be at least 1.");
      return;
    }

    if (
      !Number.isInteger(availableRooms) ||
      availableRooms < 0
    ) {
      setError("Available rooms cannot be negative.");
      return;
    }

    if (availableRooms > totalRooms) {
      setError("Available rooms cannot exceed total rooms.");
      return;
    }

    setLoading(true);

    try {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms`,
        {
          ...form,
          rent,
          deposit,
          total_rooms: totalRooms,
          available_rooms: availableRooms,
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
          : "Unable to add property. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const amenities = [
    {
      name: "furnished",
      label: "Furnished",
      description: "Furniture is provided",
      icon: "🛋️",
    },
    {
      name: "wifi",
      label: "Wi-Fi",
      description: "Internet access available",
      icon: "📶",
    },
    {
      name: "attached_bathroom",
      label: "Attached Bathroom",
      description: "Private attached bathroom",
      icon: "🚿",
    },
    {
      name: "food_included",
      label: "Food Included",
      description: "Meals are included in rent",
      icon: "🍽️",
    },
  ];

  return (
    <div className="add-property-page">
      <div className="add-property-wrapper">

        <Link
          to="/owner/dashboard"
          className="add-property-back"
        >
          ← Back to Dashboard
        </Link>

        <header className="add-property-header">
          <span className="add-property-eyebrow">
            OWNER WORKSPACE
          </span>

          <h1>Add New Property</h1>

          <p>
            Share your property details and help students
            find a place they can call home.
          </p>
        </header>

        <form
          className="add-property-form"
          onSubmit={handleSubmit}
        >
          {/* PROPERTY DETAILS */}
          <section className="add-property-section">
            <div className="add-property-section-heading">
              <span className="add-property-section-icon">
                🏠
              </span>

              <div>
                <h2>Property Details</h2>
                <p>Give your property a name and location.</p>
              </div>
            </div>

            <div className="add-property-fields">
              <div className="add-property-field full-width">
                <label htmlFor="property-title">
                  Property Title <span>*</span>
                </label>

                <input
                  id="property-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Sunrise Student Homes"
                  required
                  maxLength={150}
                />
              </div>

              <div className="add-property-field full-width">
                <label htmlFor="property-location">
                  Location <span>*</span>
                </label>

                <input
                  id="property-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Area, city or nearby landmark"
                  required
                  maxLength={200}
                />
              </div>

              <div className="add-property-field">
                <label htmlFor="property-type">
                  Property Type <span>*</span>
                </label>

                <select
                  id="property-type"
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  required
                >
                  <option value="PG">PG</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Independent Room">
                    Independent Room
                  </option>
                </select>
              </div>

              <div className="add-property-field">
                <label htmlFor="room-type">
                  Room Type <span>*</span>
                </label>

                <select
                  id="room-type"
                  name="room_type"
                  value={form.room_type}
                  onChange={handleChange}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double Sharing">
                    Double Sharing
                  </option>
                  <option value="Triple Sharing">
                    Triple Sharing
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section className="add-property-section">
            <div className="add-property-section-heading">
              <span className="add-property-section-icon">
                ₹
              </span>

              <div>
                <h2>Pricing & Availability</h2>
                <p>Set your monthly rent and room capacity.</p>
              </div>
            </div>

            <div className="add-property-fields">
              <div className="add-property-field">
                <label htmlFor="property-rent">
                  Monthly Rent (₹) <span>*</span>
                </label>

                <input
                  id="property-rent"
                  name="rent"
                  type="number"
                  min="1"
                  step="1"
                  value={form.rent}
                  onChange={handleChange}
                  placeholder="e.g. 6000"
                  required
                />
              </div>

              <div className="add-property-field">
                <label htmlFor="property-deposit">
                  Security Deposit (₹) <span>*</span>
                </label>

                <input
                  id="property-deposit"
                  name="deposit"
                  type="number"
                  min="0"
                  step="1"
                  value={form.deposit}
                  onChange={handleChange}
                  placeholder="e.g. 3000"
                  required
                />
              </div>

              <div className="add-property-field">
                <label htmlFor="property-total-rooms">
                  Total Rooms <span>*</span>
                </label>

                <input
                  id="property-total-rooms"
                  name="total_rooms"
                  type="number"
                  min="1"
                  step="1"
                  value={form.total_rooms}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  required
                />
              </div>

              <div className="add-property-field">
                <label htmlFor="property-available-rooms">
                  Available Rooms <span>*</span>
                </label>

                <input
                  id="property-available-rooms"
                  name="available_rooms"
                  type="number"
                  min="0"
                  step="1"
                  max={form.total_rooms || undefined}
                  value={form.available_rooms}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  required
                />
              </div>

              <div className="add-property-field full-width">
                <label htmlFor="gender-preference">
                  Preferred Tenants <span>*</span>
                </label>

                <select
                  id="gender-preference"
                  name="gender_preference"
                  value={form.gender_preference}
                  onChange={handleChange}
                  required
                >
                  <option value="Any">Any</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>
            </div>

            <p className="add-property-note">
              Available rooms cannot exceed total rooms.
              Rent is entered per month.
            </p>
          </section>

          {/* AMENITIES */}
          <section className="add-property-section">
            <div className="add-property-section-heading">
              <span className="add-property-section-icon">
                ✨
              </span>

              <div>
                <h2>Amenities</h2>
                <p>Select the facilities your property offers.</p>
              </div>
            </div>

            <div className="add-property-amenities">
              {amenities.map((amenity) => (
                <label
                  key={amenity.name}
                  className={`add-property-amenity ${
                    form[amenity.name] ? "selected" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    name={amenity.name}
                    checked={form[amenity.name]}
                    onChange={handleChange}
                  />

                  <span className="add-property-amenity-icon">
                    {amenity.icon}
                  </span>

                  <span className="add-property-amenity-text">
                    <strong>{amenity.label}</strong>
                    <small>{amenity.description}</small>
                  </span>

                  <span className="add-property-check">
                    ✓
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* DESCRIPTION */}
          <section className="add-property-section">
            <div className="add-property-section-heading">
              <span className="add-property-section-icon">
                📝
              </span>

              <div>
                <h2>About Your Property</h2>
                <p>Help students understand what makes it suitable.</p>
              </div>
            </div>

            <div className="add-property-field">
              <label htmlFor="property-description">
                Description
              </label>

              <textarea
                id="property-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the facilities, nearby colleges, transport, rules, or other useful details..."
                rows={5}
                maxLength={2000}
              />

              <span className="add-property-character-count">
                {form.description.length}/2000 characters
              </span>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="add-property-error" role="alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="add-property-actions">
            <button
              type="button"
              className="add-property-cancel"
              onClick={() => navigate("/owner/dashboard")}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-property-submit"
              disabled={loading}
            >
              {loading ? "Adding Property..." : "Add Property →"}
            </button>
          </div>

        </form>

        <p className="add-property-footer">
          You can manage your property's availability and photos
          from your Owner Dashboard after adding it.
        </p>

      </div>
    </div>
  );
}

export default AddRoom;
