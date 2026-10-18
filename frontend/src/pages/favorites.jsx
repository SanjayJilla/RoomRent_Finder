import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../utils/favorites";

function Favorites() {
  const [rooms, setRooms] = useState([]);
  const [favorites, setFavorites] = useState(getFavorites);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/rooms`)
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false));
  }, []);

  const savedRooms = rooms.filter((room) =>
    favorites.includes(room.id)
  );

  return (
    <div className="container">
      <h1>My Saved Rooms</h1>

      {loading ? (
        <p>Loading saved rooms...</p>
      ) : savedRooms.length === 0 ? (
        <p>No saved rooms yet. Explore rooms and save your favorites.</p>
      ) : (
        <div className="room-grid">
          {savedRooms.map((room) => (
            <div className="room-card" key={room.id}>
              {room.images?.length > 0 ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${room.images[0]}`}
                  alt={room.title}
                  className="room-card-image"
                />
              ) : (
                <div className="room-image-placeholder">
                  No Photo Available
                </div>
              )}

              <div className="room-card-details">
                <h3>{room.title}</h3>
                <p>📍 {room.location}</p>
                <h3>₹{room.rent} / month</h3>
                <p>
                  {room.available_rooms > 0
                    ? `${room.available_rooms} rooms available`
                    : "Fully Occupied"}
                </p>

                <button
                  className="favorite-btn"
                  onClick={() =>
                    setFavorites(toggleFavorite(room.id))
                  }
                >
                  ♥ Remove from Saved
                </button>

                <Link
                  to={`/rooms/${room.id}`}
                  className="primary-btn"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;