import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function UploadRoomImage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Select a JPG, PNG, or WEBP image.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const token = sessionStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms/${roomId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/owner/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Image upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload Property Image</h1>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "300px",
              marginTop: "20px",
              borderRadius: "10px",
            }}
          />
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
    </div>
  );
}

export default UploadRoomImage;