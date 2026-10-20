
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = sessionStorage.getItem("student_access_token");

  if (!token) {
    throw new Error("Please log in as a student.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// Fetch the current student's saved rooms
export async function getFavorites() {
  const response = await axios.get(
    `${API_URL}/students/me/favorites`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
}

// Save a room to the student's favorites
export async function addFavorite(roomId) {
  const response = await axios.post(
    `${API_URL}/students/me/favorites/${roomId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  window.dispatchEvent(new Event("favorites-updated"));
  return response.data;
}

// Remove a room from the student's favorites
export async function removeFavorite(roomId) {
  const response = await axios.delete(
    `${API_URL}/students/me/favorites/${roomId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  window.dispatchEvent(new Event("favorites-updated"));
  return response.data;
}

// Toggle a favorite using its current saved status
export async function toggleFavorite(roomId, isSaved) {
  if (isSaved) {
    return removeFavorite(roomId);
  }

  return addFavorite(roomId);
}
