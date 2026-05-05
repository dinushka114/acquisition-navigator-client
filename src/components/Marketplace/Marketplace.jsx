import { useState } from "react";
import { BusinessCard } from "../Businesses/BusinessCard/BusinessCard";
import MarketOneImage from "../../assets/images/market1.png";
import MarketTwoImage from "../../assets/images/market2.png";
import MarketThreeImage from "../../assets/images/market3.png";
import MarketFourImage from "../../assets/images/market4.png";
import MarketFiveImage from "../../assets/images/market5.png";
import { Link } from "react-router-dom";

export const Marketplace = () => {
  const [search, setSearch] = useState("");
  const businesses = [
    { name: "Elite Body Repair", image: MarketOneImage, type: "Automotive", description: "Premium auto body shop specializing in high-quality repairs, paintwork, and restorations. ", price: "$320,000", emoji: "🚗", badge: "HOT" },
    { name: "Brew & Bean Café", image: MarketTwoImage, type: "Cafe", description: "A cozy, high-traffic specialty coffee shop located in the city center. Known for artisan brews, pastries, and a loyal customer base.", price: "$185,000", emoji: "🍺", badge: "" },
    { name: "GreenLeaf Market", image: MarketThreeImage, type: "Automotive", description: "A thriving organic grocery store specializing in fresh produce, sustainable products, and eco-friendly goods.", price: "$450,000", emoji: "🛒", badge: "NEW" },
    { name: "PixelCraft Studio", image: MarketFourImage, type: "Automotive", description: "A creative agency providing web design, branding, and digital marketing services to small and medium-sized businesses.", price: "$275,000", emoji: "🍳", badge: "" },
    { name: "FitZone Gym", image: MarketFiveImage, type: "Automotive", description: "Modern fitness center equipped with premium workout machines, group fitness classes, and personal training services.", price: "$890,000", emoji: "🏍️", badge: "HOT" },
  ];
  return (
    <section className="bg-gradient-to-b from-blue-100 to-blue-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl headings font-extrabold text-slate-900 mb-3 px-1">
            Get a head start and secure the perfect business opportunity.
          </h2>
          <p className="text-slate-500 text-sm mb-4 max-w-xl mx-auto px-1">
            Find businesses that align with your goals and close deals with speed and confidence.
          </p>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto rounded-xl overflow-hidden shadow-lg min-w-0">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a business..."
              className="flex-1 min-w-0 px-4 sm:px-5 py-3 sm:py-3.5 text-sm border-none outline-none bg-white"
            />
            <button type="button" className="bg-[#4E7FF1] hover:bg-blue-700 text-white px-6 py-3 sm:py-0 font-semibold text-sm transition-colors duration-200 shrink-0">
              Search
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pb-8 sm:pb-10">
          {businesses.map((b) => <BusinessCard key={b.name} {...b} />)}
        </div>
        <div className="text-center px-2">
          <Link to="/market-place">
            <button
              type="button"
              className="bg-[#4E7FF1] hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-blue-200 inline-flex items-center justify-center gap-2 transition-all duration-200 w-full max-w-xs sm:max-w-none sm:w-auto"
            >
              View Marketplace →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}