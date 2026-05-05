import { baseUrl } from "../lib/api.js";

/** Absolute URL for a listing cover served from the API `/uploads` static mount. */
export function listingCoverSrc(listing) {
  const p = listing?.coverImagePath;
  if (!p) return null;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const normalized = p.replace(/^\/+/, "");
  return `${baseUrl}/${normalized}`;
}
