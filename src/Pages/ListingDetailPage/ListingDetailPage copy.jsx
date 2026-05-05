import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { fetchListing, trackListingView } from "../../services/listingService.js";
import { createDeal } from "../../services/dealService.js";
import { createThread } from "../../services/messageService.js";
import { addFavorite, fetchFavorites, removeFavorite } from "../../services/favoriteService.js";
import { formatMoney } from "../../utils/format.js";
import { getToken, getUser } from "../../lib/authStorage.js";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(false);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchListing(id);
        setListing(res.listing);
        trackListingView(id).catch(() => {});
        if (getToken()) {
          const fr = await fetchFavorites();
          const has = (fr.data || []).some(
            (x) => (x.listing?._id || x.listing) === id
          );
          setFav(has);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Not found");
      }
    })();
  }, [id]);

  async function handleFavorite() {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    try {
      if (fav) {
        await removeFavorite(id);
        setFav(false);
      } else {
        await addFavorite(id);
        setFav(true);
      }
    } catch {
      /* ignore */
    }
  }

  async function handleStartDeal() {
    if (!getToken() || user?.role !== "buyer") {
      navigate("/login");
      return;
    }
    setBusy(true);
    try {
      await createDeal(id);
      navigate("/acquisitions");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not start acquisition");
    } finally {
      setBusy(false);
    }
  }

  async function handleMessage() {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    const sellerId = listing?.seller?._id || listing?.seller;
    if (!sellerId) return;
    setBusy(true);
    try {
      const res = await createThread({ listingId: id, otherUserId: sellerId });
      const tid = res.thread?._id;
      if (tid) navigate(`/messages?thread=${tid}`);
      else navigate("/messages");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not open chat");
    } finally {
      setBusy(false);
    }
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-red-600">{error || "Loading…"}</p>
          <Link to="/market-place" className="mt-4 inline-block text-blue-600 underline">
            Back to marketplace
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const seller = listing.seller;
  const sellerId = seller?._id || seller;
  const isOwner =
    user?.id && sellerId && String(user.id) === String(sellerId);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/market-place" className="text-sm text-blue-600 hover:underline">
          ← Marketplace
        </Link>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="headings text-3xl font-bold text-slate-900">{listing.title}</h1>
              <p className="mt-2 text-sm text-slate-500">
                {listing.industry} · {listing.location?.city}, {listing.location?.country}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleFavorite}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
              >
                {fav ? "♥ Saved" : "♡ Save"}
              </button>
              {!isOwner && (user?.role === "buyer" || user?.role === "admin") ? (
                <>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleStartDeal}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Start acquisition
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleMessage}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    Message seller
                  </button>
                </>
              ) : null}
            </div>
          </div>
          <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <span className="text-slate-500">Asking range</span>
              <p className="font-semibold">
                {formatMoney(listing.askingPriceMin)} – {formatMoney(listing.askingPriceMax)}
              </p>
            </div>
            {listing.listingType === "share" ? (
              <div>
                <span className="text-slate-500">Equity offered</span>
                <p className="font-semibold">{listing.equityOfferedPercent ?? "—"}%</p>
              </div>
            ) : null}
            <div>
              <span className="text-slate-500">Revenue</span>
              <p className="font-semibold">{formatMoney(listing.financials?.annualRevenue)}</p>
            </div>
            <div>
              <span className="text-slate-500">EBITDA</span>
              <p className="font-semibold">{formatMoney(listing.financials?.ebitda)}</p>
            </div>
          </div>
          <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {listing.description}
          </p>
          {listing.valuation?.low != null ? (
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="text-xs font-semibold uppercase text-blue-800">Indicative valuation</p>
              <p className="headings mt-1 text-xl text-slate-900">
                {formatMoney(listing.valuation.low)} – {formatMoney(listing.valuation.high)}
              </p>
            </div>
          ) : null}
          {seller?.email ? (
            <p className="mt-4 text-xs text-slate-400">Listed by seller account · {seller.email}</p>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
