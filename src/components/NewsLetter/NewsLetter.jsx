import { useState } from "react";
import BuildingImage from "../../assets/images/building.png";

export const NewsLetter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative w-full" style={{ overflow: "visible" }}>
      <div
        className="bg-gradient-to-r from-[#D7E9FF] via-[#A2C9FB] to-[#2D8CFF]"
        style={{ overflow: "visible" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-end">
          <div className="w-full md:w-1/2 py-8 sm:py-10 md:py-16 z-10 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl headings font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Get Our Monthly <br />
              Newsletter
            </h2>
            <p className="text-slate-700 text-sm sm:text-base max-w-sm mx-auto md:mx-0 mb-6 sm:mb-8">
              Stay updated with the latest local business news, exclusive offers,
              and helpful tips delivered straight to your inbox every month.
            </p>
            <div className="flex flex-col sm:flex-row w-full max-w-md mx-auto md:mx-0 bg-white/30 backdrop-blur-sm rounded-md overflow-hidden p-1 shadow-inner min-w-0 gap-1 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm placeholder:text-slate-600 outline-none"
              />
              <button
                type="button"
                className="bg-[#007BFF] hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-sm text-xs font-bold transition-all shrink-0 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </div>
          </div>

          <div
            className="hidden md:flex w-1/2 justify-end items-end"
            style={{ overflow: "visible" }}
          >
            <img
              src={BuildingImage}
              alt=""
              style={{
                width: "420px",
                maxWidth: "100%",
                height: "auto",
                marginTop: "-200px",
                display: "block",
                overflow: "visible",
              }}
              className="drop-shadow-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
};