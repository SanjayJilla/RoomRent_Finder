import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

function RoomDetails() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enquiry, setEnquiry] = useState({
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState("");
  const [enquiryError, setEnquiryError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rooms/${roomId}`
        );

        setRoom(response.data);
      } catch (err) {
        setError(
          err.response?.status === 404
            ? "Room not found."
            : "Unable to load room details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) return <p>Loading property details...</p>;

  if (error) return <p className="error">{error}</p>;

  if (!room) return null;

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    setEnquirySuccess("");
    setEnquiryError("");

    const token = sessionStorage.getItem("student_access_token");

    if (!token) {
      navigate("/student/login");
      return;
    }

    try {
      setSending(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms/${roomId}/enquiries`,
        {
          message: enquiry.message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquirySuccess("Your enquiry has been sent successfully!");
      setEnquiry({ message: "" });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        sessionStorage.removeItem("student_access_token");
        sessionStorage.removeItem("student_name");
        navigate("/student/login");
        return;
      }

      setEnquiryError(
        err.response?.data?.detail ||
          "Unable to send enquiry. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <Link to="/">← Back to Listings</Link>

      <div className="room-details">
        <h1>{room.title}</h1>
        <p>📍 {room.location}</p>

        <h2>₹{room.rent}/month</h2>
        <p>Security Deposit: ₹{room.deposit}</p>

        <h3>Property Information</h3>
        <p>Property Type: {room.property_type}</p>
        <p>Room Type: {room.room_type}</p>
        <p>Total Rooms: {room.total_rooms}</p>
        <p>Available Rooms: {room.available_rooms}</p>
        <p>Gender Preference: {room.gender_preference}</p>

        <h3>Amenities</h3>
        <p>Wi-Fi: {room.wifi ? "Yes" : "No"}</p>
        <p>Furnished: {room.furnished ? "Yes" : "No"}</p>
        <p>
          Attached Bathroom: {room.attached_bathroom ? "Yes" : "No"}
        </p>
        <p>
          Food Included: {room.food_included ? "Yes" : "No"}
        </p>

        <h3>Description</h3>
        <p>{room.description || "No description provided."}</p>

        <p>
          {room.available_rooms > 0
            ? "Available for Rent"
            : "Currently Fully Occupied"}
        </p>
        <h3>Contact Owner</h3>

        {room.owner_phone ? (
            <div className="contact-owner">
            <p>Owner: {room.owner_name}</p>

            <a
                href={`tel:${room.owner_phone}`}
                className="primary-btn"
            >
            📞 Call Owner
            </a>
            </div>
            ) : (
                <p>Owner contact information is unavailable.</p>
            )}
            {room.images?.length > 0 ? (
            <div className="room-gallery">
                {room.images.map((imageUrl, index) => (
                <img
                    key={imageUrl}
                    src={
                        imageUrl.startsWith("http")
                          ? imageUrl
                          : `${import.meta.env.VITE_API_URL}${imageUrl}`
                      }
                    alt={`${room.title} photo ${index + 1}`}
                    className="gallery-image"
                />
                ))}
            </div>
            ) : (
            <p>No property photos uploaded yet.</p>
            )}
            <div className="enquiry-section">
            <h2>Interested in this property?</h2>
            <p>Send an enquiry directly to the property owner.</p>

            <form onSubmit={handleEnquirySubmit} className="enquiry-form">

                <label htmlFor="enquiry-message">Message</label>
                <textarea
                id="enquiry-message"
                placeholder="I'm interested in this room. Is it available for a visit?"
                value={enquiry.message}
                onChange={(e) =>
                    setEnquiry({
                    ...enquiry,
                    message: e.target.value,
                    })
                }
                minLength={5}
                maxLength={1000}
                rows={4}
                required
                />

                {enquirySuccess && (
                <p className="enquiry-success">{enquirySuccess}</p>
                )}

                {enquiryError && (
                <p className="error">{enquiryError}</p>
                )}

                <button
                type="submit"
                className="primary-btn"
                disabled={sending || room?.available_rooms <= 0}
                >
                {sending ? "Sending..." : "Send Enquiry"}
                </button>
            </form>
            </div>
      </div>
    </div>
  );
}

export default RoomDetails;