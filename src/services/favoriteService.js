import { api } from "../lib/api.js";

export function fetchFavorites() {
  return api("/api/favorites", { auth: true });
}

export function addFavorite(listingId) {
  return api("/api/favorites", {
    method: "POST",
    body: JSON.stringify({ listingId }),
    auth: true,
  });
}

export function removeFavorite(listingId) {
  return api(`/api/favorites/${listingId}`, { method: "DELETE", auth: true });
}
