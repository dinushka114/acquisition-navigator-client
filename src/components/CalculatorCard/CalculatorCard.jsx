export const CalculatorCard = ({ img, label }) => {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/60 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <img src={img} alt="" className="h-10 w-10 object-contain" />
      <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-800">
        {label}
      </span>
    </button>
  );
}