import { api } from "../lib/api.js";

export function fetchRecommendations(limit = 20) {
  return api(`/api/recommendations?limit=${limit}`, { auth: true });
}
