import React from "react";
import VideoImage from "../../assets/images/video.png"

export const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
        <div className="w-full max-w-xl text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] headings font-extrabold text-slate-900 leading-tight mb-4">
            The Premier Marketplace for<br />
            Business Buyers and Sellers.
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">
            The modern way to buy and sell businesses. Our platform connects credible buyers and sellers, offering a streamlined, secure, and efficient experience from discovery to deal.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center md:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10">
            <button type="button" className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg shadow-blue-200 transition-all duration-200 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Explore Listings →
            </button>
            <button type="button" className="bg-white border border-slate-200 text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 w-full sm:w-auto">
              Learn More
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8 md:gap-10">
            {[
              ["10K+", "Active Listings"],
              ["95%", "Customer Satisfaction"],
              ["50K+", "Industries Covered"],
            ].map(([num, label], index, array) => (
              <React.Fragment key={label}>
                <div className="text-center min-w-[5.5rem]">
                  <div className="text-3xl sm:text-4xl md:text-5xl headings font-extrabold">{num}</div>
                  <div className="text-[10px] sm:text-xs headings text-slate-500 font-medium mt-1 flex flex-col uppercase tracking-wider">
                    {label.split(" ").map((word, i) => (
                      <span key={i}>{word}</span>
                    ))}
                  </div>
                </div>
                {index !== array.length - 1 && (
                  <div className="hidden sm:block h-12 md:h-16 w-px shrink-0 bg-slate-300" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div
          className="relative w-full max-w-[500px] mx-auto md:mx-0 aspect-[500/320] md:flex-shrink-0 cursor-pointer group overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `url(${VideoImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0  backdrop-blur-[1px]  transition-colors duration-300"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black flex items-center justify-center text-white text-2xl sm:text-3xl pl-0.5 sm:pl-1 shadow-xl transition-transform duration-300 group-hover:scale-110">
              ▶
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
