const KEY = "favorite_rooms";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(roomId) {
  const favorites = getFavorites();

  const updated = favorites.includes(roomId)
    ? favorites.filter((id) => id !== roomId)
    : [...favorites, roomId];

  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("favorites-updated"));

  return updated;
}