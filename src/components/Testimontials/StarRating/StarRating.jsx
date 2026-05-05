export const StarRating = ({ rating = 5 }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
      ))}
    </div>
  );
}