import HomeListBusinessImage from "../../assets/images/home1.png"

export const ListBusiness = () => {
  const steps = [
    { num: "STEP 1", label: "Create & Publish Your Listing" },
    { num: "STEP 2", label: "Connect with Verified Buyers" },
    { num: "STEP 3", label: "Close the Deal Securely" },
  ];
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-16">
          <div className="min-w-0 w-full max-w-lg justify-self-start text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold headings text-slate-900 leading-tight mb-4">
              List Your Business With Confidence!
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-7 max-w-sm mx-auto md:mx-0">
              Reach thousands of qualified buyers and sell your business faster. Our platform gives you the tools to list your business securely and efficiently.
            </p>
            <button type="button" className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg shadow-blue-200 inline-flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-auto">
              List Your Business Here →
            </button>
          </div>
          <div className="min-w-0 w-full max-w-lg justify-self-center md:justify-self-end">
            <div className="relative max-w-md w-full mx-auto md:mx-0 md:ml-auto">
              <img
                src={HomeListBusinessImage}
                alt="List your business"
                className="w-full h-auto rounded-2xl  object-cover"
              />
            </div>
          </div>
        </div>
        <div className="relative hidden md:flex justify-between items-start">
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 z-0" />
          {steps.map((step, i) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center relative z-10 px-1">
              <div className="w-10 h-10 rounded-full bg-[#4E7FF1] text-white font-bold text-sm flex items-center justify-center mb-3 shadow-lg shadow-blue-200">
                {i + 1}
              </div>
              <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">{step.num}</div>
              <div className="text-sm font-semibold text-slate-600">{step.label}</div>
            </div>
          ))}
        </div>

        <ol className="md:hidden list-none p-0 m-0 space-y-0">
          {steps.map((step, i) => (
            <li key={step.num} className="flex gap-4 items-stretch pb-8 last:pb-0">
              <div className="flex w-10 shrink-0 flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#4E7FF1] text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-blue-200">
                  {i + 1}
                </div>
                {i < steps.length - 1 ? (
                  <div className="mt-2 w-0.5 flex-1 min-h-[1.25rem] bg-slate-200" aria-hidden />
                ) : null}
              </div>
              <div className="min-w-0 pt-1.5">
                <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-1">{step.num}</div>
                <div className="text-sm font-semibold text-slate-600 leading-snug">{step.label}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}