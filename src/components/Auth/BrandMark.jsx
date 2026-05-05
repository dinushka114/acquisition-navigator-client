function HeartLogo() {
  return (
    <svg viewBox="0 0 40 30" fill="none" className="h-9 w-9 shrink-0" aria-hidden>
      <path
        d="M20 25 C20 25 5 16 5 9 C5 5.5 7.5 3 11 3 C13.5 3 16 4.5 18 7 L20 9 L22 7 C24 4.5 26.5 3 29 3 C32.5 3 35 5.5 35 9 C35 16 20 25 20 25Z"
        fill="#3B82F6"
        opacity="0.85"
      />
      <path
        d="M12 10 L16 14 L20 8 L24 16 L28 10"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Logo + wordmark used on auth screens */
export function BrandMark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HeartLogo />
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-wide">
          <span className="text-blue-600">A</span>
          <span className="text-slate-800">CQUISITION</span>
        </div>
        <div className="text-center text-[10px] font-bold tracking-[0.28em] text-blue-500">
          NAVIGATOR
        </div>
      </div>
    </div>
  );
}
