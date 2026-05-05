import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import {
  fetchListing,
  fetchListings,
  trackListingView,
  submitListingInquiry,
} from "../../services/listingService.js";
import { createDeal } from "../../services/dealService.js";
import { createThread } from "../../services/messageService.js";
import { addFavorite, fetchFavorites, removeFavorite } from "../../services/favoriteService.js";
import { formatMoney } from "../../utils/format.js";
import { listingCoverSrc } from "../../utils/listingMedia.js";
import { getToken, getUser } from "../../lib/authStorage.js";
import { ListingCard } from "../../components/Marketplace/ListingCard.jsx";
import placeholderHero from "../../assets/images/market1.png";
import { Building, Info, Tag, Handshake } from "lucide-react";

function PinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Accordion({ icon, title, open, onToggle, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-slate-500">{icon}</span>}
          <span className="headings text-xs font-bold text-slate-900 md:text-base">{title}</span>
        </span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open ? <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600">{children}</div> : null}
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [fav, setFav] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [contactMode, setContactMode] = useState("app");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Interested in this listing");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState(null);
  const user = getUser();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchListing(id);
        setListing(res.listing);
        trackListingView(id).catch(() => { });
        if (getToken()) {
          const fr = await fetchFavorites();
          const has = (fr.data || []).some((x) => (x.listing?._id || x.listing) === id);
          setFav(has);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Not found");
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id || !listing?.industry) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchListings({
          industry: listing.industry,
          limit: "12",
          listingType: listing.listingType,
        });
        if (cancelled) return;
        const others = (res.data || []).filter((x) => String(x._id) !== String(id)).slice(0, 8);
        setSimilar(others);
      } catch {
        if (!cancelled) setSimilar([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, listing?.industry, listing?.listingType]);

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

  async function handleSendInquiry(e) {
    e.preventDefault();
    setInquiryStatus(null);
    setBusy(true);
    try {
      await submitListingInquiry(id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim() || "Interested in this listing",
        message: inquiryMessage.trim(),
      });
      setInquiryStatus({ ok: true, text: "Message sent. The seller will get back to you soon." });
      setInquiryMessage("");
    } catch (err) {
      setInquiryStatus({
        ok: false,
        text: err instanceof Error ? err.message : "Could not send",
      });
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
  const isOwner = user?.id && sellerId && String(user.id) === String(sellerId);
  const isBuyer = user?.role === "buyer" || user?.role === "admin";

  const heroSrc = listingCoverSrc(listing) || placeholderHero;
  const fin = listing.financials || {};
  const locationLine = [listing.location?.city, listing.location?.region, listing.location?.country]
    .filter(Boolean)
    .join(", ");

  const minP = listing.askingPriceMin;
  const maxP = listing.askingPriceMax;
  const priceDisplay =
    minP != null && maxP != null && minP === maxP
      ? formatMoney(minP)
      : minP != null && maxP != null
        ? `${formatMoney(minP)} – ${formatMoney(maxP)}`
        : formatMoney(minP ?? maxP);

  const aboutText = (listing.description || "").trim() || "No description provided yet.";
  const detailText = (listing.detailedInformation || "").trim() || "No detailed information provided yet.";

  return (
    // <div className="min-h-screen bg-slate-50 font-sans">
    <div className="min-h-screen bg-[#B4D8FF] font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <Link
          to="/market-place"
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <span aria-hidden>←</span> Market Place
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_minmax(300px,380px)] lg:items-start">
          <div>
            <div className="bg-[#F8F8F8] rounded-b-xl border border-slate-100 shadow-md">
              <div className="relative overflow-hidden  bg-slate-200 shadow-md">
                <div className="aspect-[16/9] min-h-[220px] w-full md:aspect-[21/9] md:min-h-[280px]">
                  <img src={heroSrc} alt="" className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={handleFavorite}
                  className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-md backdrop-blur transition hover:bg-white"
                >
                  {fav ? "♥" : "♡"}
                </button>
              </div>

              <div className="m-6">
                <span className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
                  {listing.industry}
                </span>
                <h1 className="headings mt-4 text-2xl font-black leading-tight text-slate-900 md:text-3xl lg:text-[2rem]">
                  {listing.title}
                </h1>
                {locationLine ? (
                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <PinIcon className="h-4 w-4 flex-shrink-0 text-blue-600" />
                    {locationLine}
                  </p>
                ) : null}

                <hr className="mb-4 mt-4 border-slate-200" />

                <div className="flex items-center gap-2">
                  <Tag size={24} className="text-blue-400" />
                  <div>
                    <p className="headings mt-1 text-3xl font-black text-slate-900 md:text-4xl">{priceDisplay}</p>
                    <p className="text-xs mt-1 font-semibold uppercase tracking-wide text-slate-500">Asking price</p>
                  </div>
                </div>
              </div>

              <div className="m-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  ["Cash flow", formatMoney(fin.sde)],
                  ["Gross revenue", formatMoney(fin.annualRevenue)],
                  ["Inventory", formatMoney(fin.inventory)],
                  ["EBITDA", formatMoney(fin.ebitda)],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                  >
                    <p className="mt-2 text-base text-center font-bold text-slate-900 md:text-lg">{val}</p>
                    <p className="text-[10px] font-semibold uppercase text-center tracking-wide text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>


            {listing.valuation?.low != null ? (
              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/70 p-5 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-blue-800">Indicative valuation</p>
                <p className="headings mt-1 text-xl font-bold text-slate-900">
                  {formatMoney(listing.valuation.low)} – {formatMoney(listing.valuation.high)}
                </p>
              </div>
            ) : null}

            <div className="mt-10 space-y-4">
              <Accordion icon={<Building size={22} className="text-blue-400" />} title="About This Business" open={aboutOpen} onToggle={() => setAboutOpen((o) => !o)}>
                <p className="whitespace-pre-wrap">{aboutText}</p>
              </Accordion>
              <Accordion
                icon={<Info size={22} className="text-blue-400" />}
                title="Detailed Information"
                open={detailOpen}
                onToggle={() => setDetailOpen((o) => !o)}
              >
                <p className="whitespace-pre-wrap">{detailText}</p>
              </Accordion>
            </div>

            {!isOwner && isBuyer ? (
              <p className="mt-8 text-center text-sm text-slate-500 lg:text-left">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleStartDeal}
                  className="font-semibold text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 disabled:opacity-50"
                >
                  Start formal acquisition
                </button>
                <span className="text-slate-400"> · Track this deal in Acquisitions</span>
              </p>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-24">
            {isOwner ? (
              <div className="rounded-2xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-lg">
                <h2 className="headings text-lg font-bold text-slate-900">Your listing</h2>
                <p className="mt-2 text-sm text-slate-600">
                  This is your listing. Update details, photos, and documents from your dashboard.
                </p>
                <Link
                  to="/seller-dashboard"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                >
                  Go to seller dashboard
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-[#F8F8F8] p-6 shadow-lg">
                <h2 className="headings text-lg font-bold text-slate-900">Contact Business Owner</h2>
                <p className="mt-1 text-xs text-slate-500">Choose how you would like to connect with the seller</p>

                <div className="mt-5 space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
                    <input
                      type="radio"
                      name="contactMode"
                      checked={contactMode === "app"}
                      onChange={() => setContactMode("app")}
                      className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-800">Message via App</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50/50">
                    <input
                      type="radio"
                      name="contactMode"
                      checked={contactMode === "email"}
                      onChange={() => setContactMode("email")}
                      className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-800">Send Email</span>
                  </label>
                </div>

                {contactMode === "app" ? (
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleMessage}
                      className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      Start Conversation
                    </button>
                    <p className="mt-3 text-center text-xs text-slate-500">Sign in required to use in-app messaging.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSendInquiry} className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600">First name</label>
                        <input
                          required
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-slate-600">Last name</label>
                        <input
                          required
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">Email</label>
                      <input
                        required
                        type="email"
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">Phone no.</label>
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">Subject</label>
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-600">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell the seller why you're interested"
                        className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                      />
                    </div>
                    {inquiryStatus ? (
                      <p
                        className={`text-sm ${inquiryStatus.ok ? "text-emerald-700" : "text-red-600"}`}
                        role="status"
                      >
                        {inquiryStatus.text}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/15 transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      Send Message
                    </button>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Your message will be sent directly to the seller's email</p>
                  </form>
                )}
              </div>
            )}
          </aside>
        </div>

        {similar.length > 0 ? (
          <section className="mt-16 pt-12">
            <div className="flex items-center gap-3 mb-6">
              <Handshake size={28} className="text-blue-500" />
              <h2 className="headings text-xl font-bold text-slate-900 md:text-2xl">Similar Listing</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {similar.map((s) => (
                <div key={s._id} className="w-[280px] flex-shrink-0 snap-start">
                  <ListingCard listing={s} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
