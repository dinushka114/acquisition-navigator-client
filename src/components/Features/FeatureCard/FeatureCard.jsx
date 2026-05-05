export const FeatureCard = ({ image, title, description, highlighted }) => {
  return (
    <div className={`flex-1 flex flex-col min-w-0 px-4 py-8 sm:px-6 md:px-8 sm:py-10 md:py-12 text-center transition-all duration-300 cursor-default rounded-lg
      ${highlighted ? "bg-white shadow-2xl shadow-blue-100 z-10 md:scale-105" : "bg-transparent"}`}>
      
      <div className="h-24 sm:h-28 md:h-32 flex items-center justify-center mb-6 sm:mb-8">
        <img className="max-h-full w-auto object-contain" src={image} alt={title} />
      </div>

      <h3 className="text-lg sm:text-xl headings font-bold text-slate-800 mb-4 sm:mb-6 px-2 sm:px-4 leading-snug min-h-0 sm:min-h-[60px] flex items-center justify-center">
        {title}
      </h3>

      <div className="px-4">
        <hr className="border-slate-200 mb-8" />
        <p className="text-[14px] text-slate-500 leading-relaxed font-normal">
          {description}
        </p>
      </div>
    </div>
  );
}