export const BusinessCard = ({ name, image, description, price, type, highlighted }) => {
  return (
    <div className={`w-full max-w-md sm:max-w-none sm:w-[45%] md:w-[30%] lg:w-[18%] mx-auto sm:mx-0 rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-300 cursor-pointer group flex flex-col
      ${highlighted ? 'ring-4 ring-blue-500 ring-inset scale-105 z-10' : 'hover:-translate-y-2'}`}>
      
      <div className="relative h-44 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full">
          <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        <div className="absolute bottom-3 right-3 bg-[#4E7FF1] text-[10px] text-white  px-3 py-1 rounded-md shadow-lg">
          {type}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="sub-headings text-lg font-bold text-slate-900 mb-3">{name}</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-6 line-clamp-3">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <button className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded uppercase tracking-wider hover:bg-slate-800 transition-colors">
            See Details
          </button>
          <span className="text-sm font-black text-slate-900">{price}</span>
        </div>
      </div>
    </div>
  );
};