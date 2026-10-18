import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("student_access_token");

  if (!token) {
    throw new Error("STUDENT_LOGIN_REQUIRED");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getFavorites = async () => {
  const response = await axios.get(
    `${API_URL}/students/me/favorites`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const addFavorite = async (roomId) => {
  const response = await axios.post(
    `${API_URL}/students/me/favorites/${roomId}`,
    {},
    { headers: getAuthHeaders() }
  );

  return response.data;
};

export const removeFavorite = async (roomId) => {
  const response = await axios.delete(
    `${API_URL}/students/me/favorites/${roomId}`,
    { headers: getAuthHeaders() }
  );

  return response.data;
};