import { useEffect, useState } from "react";
import { Handshake } from "lucide-react";
import { ListingCard } from "../../components/Marketplace/ListingCard.jsx";
import { fetchListings } from "../../services/listingService.js";

export function SimilarListings({ currentListingId, industry }) {
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!industry) return;

    async function loadSimilar() {
      try {
        setLoading(true);
        const res = await fetchListings({ industry, limit: 10 });
        if (res.success && res.data) {
          // Filter out the currently viewed listing
          const filtered = res.data.filter((l) => l._id !== currentListingId);
          setSimilarListings(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch similar listings", err);
      } finally {
        setLoading(false);
      }
    }

    loadSimilar();
  }, [industry, currentListingId]);

  if (loading || similarListings.length === 0) {
    return null; // Don't show the section if there are no similar listings or it's still loading
  }

  return (
    <div className="mt-16 w-full pb-10">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
        <Handshake size={28} className="text-blue-500" />
        <h2 className="headings text-xl font-bold text-slate-900">Similar Listing</h2>
      </div>

      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 
        scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {similarListings.map((listing) => (
          <div key={listing._id} className="min-w-[280px] max-w-[320px] snap-start flex-none">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
