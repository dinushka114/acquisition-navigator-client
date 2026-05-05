import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { fetchFavorites } from "../../services/favoriteService.js";
import { ListingCard } from "../../components/Marketplace/ListingCard.jsx";

function FavoritesContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchFavorites();
        setItems(res.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="headings text-3xl font-bold text-slate-900">Favorites</h1>
        {loading ? (
          <p className="mt-8 text-slate-500">Loading…</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((f) =>
              f.listing ? (
                <ListingCard key={f._id} listing={f.listing} />
              ) : null
            )}
          </div>
        )}
        {!loading && !items.length ? (
          <p className="mt-8 text-slate-500">No saved listings.</p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
