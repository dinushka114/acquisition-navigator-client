import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ListingCard } from "../../components/Marketplace/ListingCard.jsx";
import { fetchListings } from "../../services/listingService.js";
import { addFavorite, fetchFavorites, removeFavorite } from "../../services/favoriteService.js";
import { fetchRecommendations } from "../../services/recommendationService.js";
import { getToken, getUser } from "../../lib/authStorage.js";
import aboutHero from "../../assets/images/about-hero.png";

export default function MarketplacePage() {
  const [tab, setTab] = useState("full");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favSet, setFavSet] = useState(() => new Set());
  const [recs, setRecs] = useState([]);
  const user = getUser();
  const isBuyer = user?.role === "buyer" || user?.role === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { limit: "24" };
      if (tab === "full" || tab === "share") params.listingType = tab;
      if (q.trim()) params.search = q.trim();
      const res = await fetchListings(params);
      setListings(res.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load listings");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [tab, q]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!getToken()) return;
    (async () => {
      try {
        const res = await fetchFavorites();
        const set = new Set((res.data || []).map((f) => f.listing?._id || f.listing));
        setFavSet(set);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    if (!getToken() || !isBuyer) {
      setRecs([]);
      return;
    }
    (async () => {
      try {
        const res = await fetchRecommendations(8);
        setRecs(res.data || []);
      } catch {
        setRecs([]);
      }
    })();
  }, [isBuyer]);

  async function toggleFavorite(id) {
    if (!getToken()) {
      window.location.href = "/login";
      return;
    }
    try {
      if (favSet.has(id)) {
        await removeFavorite(id);
        setFavSet((prev) => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
      } else {
        await addFavorite(id);
        setFavSet((prev) => new Set(prev).add(id));
      }
    } catch {
      /* toast optional */
    }
  }

  function submitSearch(e) {
    e.preventDefault();
    setQ(search);
  }

  const recListings = recs.map((r) => r.listing).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <main>
        <div className="page-hero relative flex items-center justify-center overflow-hidden">
          <img src={aboutHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 " />
          <h1 className="relative z-10 headings text-4xl font-black text-slate-900 md:text-5xl">
            Market-Place
          </h1>
        </div>

        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="headings text-center text-2xl font-bold text-slate-900 md:text-4xl">
            Discover Top Businesses from <br /> Every Corner of the Globe
          </h2>

          <form
            onSubmit={submitSearch}
            className="relative mx-auto mt-8 flex max-w-4xl items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Discover businesses around the world..."
                className="w-full rounded-full border-2 border-blue-300 bg-white py-5 pl-8 pr-20 text-slate-500 outline-none transition-all focus:border-blue-500"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-600 text-white shadow-md hover:from-blue-400 hover:to-blue-700 active:scale-95 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className="mx-auto mt-8 flex max-w-md justify-center gap-8 border-b border-slate-200 text-sm font-semibold headings">
            <button
              type="button"
              onClick={() => setTab("full")}
              className={`relative pb-3 transition-colors ${tab === "full" ? "text-black-600" : "text-slate-500"
                }`}
            >
              Businesses
              {tab === "full" && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-blue-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setTab("share")}
              className={`relative pb-3 transition-colors ${tab === "share" ? "text-black-600" : "text-slate-500"
                }`}
            >
              Equity Investments
              {tab === "share" && (
                <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 bg-blue-600" />
              )}
            </button>
          </div>

          {/* {isBuyer && recListings.length > 0 ? (
            <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
              <h3 className="headings text-lg font-bold text-slate-900">Recommended for you</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recListings.map((l) => (
                  <ListingCard
                    key={l._id}
                    listing={l}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favSet.has(l._id)}
                  />
                ))}
              </div>
            </div>
          ) : null} */}

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="headings text-2xl font-bold text-slate-900">Businesses For Sale</h3>
              <p className="text-sm text-slate-500">{listings.length} results</p>
            </div>
          </div>

          {error ? (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
          ) : null}
          {loading ? (
            <p className="mt-10 text-center text-slate-500">Loading…</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onToggleFavorite={getToken() ? toggleFavorite : null}
                  isFavorite={favSet.has(listing._id)}
                />
              ))}
            </div>
          )}
          {!loading && !listings.length ? (
            <p className="mt-8 text-center text-slate-500">No listings match your filters.</p>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
