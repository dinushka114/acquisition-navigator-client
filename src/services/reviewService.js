import { api } from "../lib/api.js";

/** Fetch all approved reviews to display on the home page */
export function fetchApprovedReviews() {
  return api("/api/reviews");
}

/** Submit a new review (requires authentication) */
export function submitReview(data) {
  return api("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}

/** Admin: Fetch all reviews */
export function fetchAllReviews() {
  return api("/api/reviews/all", { auth: true });
}

/** Admin: Update review status */
export function updateReviewStatus(id, status) {
  return api(`/api/reviews/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    auth: true,
  });
}
