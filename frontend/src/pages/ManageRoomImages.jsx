import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}`;

function ManageRoomImages() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${API}/rooms/${roomId}/images`
        );

        setImages(response.data);
      } catch (err) {
        setError("Unable to load property photos.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [roomId]);

  const handleDelete = async (imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem("access_token");

      await axios.delete(
        `${API}/rooms/${roomId}/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImages((previous) =>
        previous.filter((image) => image.id !== imageId)
      );
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete photo."
      );
    }
  };

  if (loading) return <p>Loading photos...</p>;

  return (
    <div className="container">
      <h1>Manage Property Photos</h1>

      <button
        className="primary-btn"
        onClick={() =>
          navigate(`/owner/rooms/${roomId}/upload`)
        }
      >
        + Upload More Photos
      </button>

      {error && <p className="error">{error}</p>}

      {images.length === 0 ? (
        <p>No photos uploaded yet.</p>
      ) : (
        <div className="manage-photo-grid">
          {images.map((image) => (
            <div className="manage-photo-card" key={image.id}>
              <img
                src={`${API}${image.image_url}`}
                alt="Property"
              />

              <button
                className="delete-btn"
                onClick={() => handleDelete(image.id)}
              >
                Delete Photo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageRoomImages;