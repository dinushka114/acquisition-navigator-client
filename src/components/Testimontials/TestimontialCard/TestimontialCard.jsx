import { StarRating } from "../StarRating/StarRating";

export const TestimonialCard = ({ quote, author, role, rating = 5, dark = false }) => {
  return (
    <div className={`rounded-xl p-6 flex flex-col gap-3 shadow-md h-full ${dark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
      <span className="text-3xl headings text-blue-500 font-extrabold leading-none">"</span>
      <p className={`text-sm leading-relaxed flex-1 ${dark ? "text-slate-300" : "text-slate-500"}`}>{quote}</p>
      <div className="flex items-center gap-3 mt-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${dark ? "bg-slate-700" : "bg-blue-100"}`}>👤</div>
        <div>
          <div className="text-xs font-bold">{author}</div>
          <div className="text-[11px] text-slate-400">{role}</div>
        </div>
        <div className="ml-auto text-right">
          <StarRating rating={rating} />
          <div className="text-[11px] text-slate-400">{rating}.0</div>
        </div>
      </div>
    </div>
  );
}