import { Link } from "react-router-dom";
import { formatMoney, snippet } from "../../utils/format.js";
import { listingCoverSrc } from "../../utils/listingMedia.js";
import marketImg from "../../assets/images/market1.png";

export function ListingCard({ listing, onToggleFavorite, isFavorite }) {
  const price =
    listing.askingPriceMin != null && listing.askingPriceMax != null
      ? `${formatMoney(listing.askingPriceMin)} – ${formatMoney(listing.askingPriceMax)}`
      : formatMoney(listing.askingPriceMin ?? listing.askingPriceMax);

  const imgSrc = listingCoverSrc(listing) || marketImg;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={imgSrc} alt="" className="h-full w-full object-cover" />
        {onToggleFavorite ? (
          <button
            type="button"
            onClick={() => onToggleFavorite(listing._id)}
            className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-sm shadow"
            aria-label={isFavorite ? "Remove favorite" : "Save favorite"}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        ) : null}
        <span className="absolute bottom-2 right-2 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
          {listing.listingType === "share" ? "Equity" : "Business"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="headings text-base font-bold text-slate-900 line-clamp-2">{listing.title}</h3>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-3">
          {snippet(listing.description, 140)}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link
            to={`/listings/${listing._id}`}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            See details
          </Link>
          <span className="text-xs font-semibold  text-slate-700">{price}</span>
        </div>
      </div>
    </article>
  );
}
