import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/home/Logo.png";
import { getToken, getUser, clearAuth } from "../../lib/authStorage.js";

const navLinkClass = "text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const loggedIn = !!getToken();
  const user = getUser();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut(e) {
    e.preventDefault();
    clearAuth();
    setIsOpen(false);
    navigate("/");
  }

  const primaryNavLinks = [
    { label: "Market Place", path: "/market-place" },
    { label: "About Us", path: "/about-us" },
    { label: "Contact Us", path: "/contact-us" },
    ...((!loggedIn || user?.role === "seller" || user?.role === "admin")
      ? [{ label: "List My Business", path: "/list-my-business" }]
      : []),
    { label: "Calculators", path: "/calculators" },
  ];

  const menuItems = [
    { label: "Profile", path: "/profile", highlight: true },
    { label: "Favorites", path: "/favorites" },
    { label: "Messages", path: "/messages" },
    { label: "FAQs", path: "/contact-us" },
    ...(user?.role === "seller" || user?.role === "admin"
      ? [{ label: "Seller Dashboard", path: "/seller-dashboard" }]
      : []),
    ...(user?.role === "buyer" || user?.role === "admin"
      ? [{ label: "Acquisitions", path: "/acquisitions" }]
      : []),
    ...(user?.role === "seller"
      ? [{ label: "Deals", path: "/acquisitions" }]
      : []),
    ...(user?.role === "admin"
      ? [{ label: "User Reviews", path: "/admin/reviews" }]
      : []),
    { label: "Sign Out", path: "#", onClick: handleSignOut },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex items-center justify-between gap-3">
        <Link to="/" className="min-w-0 shrink-0">
          <img src={Logo} alt="Acquisition Navigator" className="h-8 sm:h-10 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link to="/market-place" className={navLinkClass}>
            Market Place
          </Link>
          <Link to="/about-us" className={navLinkClass}>
            About Us
          </Link>
          <Link to="/contact-us" className={navLinkClass}>
            Contact Us
          </Link>
          {(!loggedIn || user?.role === "seller" || user?.role === "admin") && (
            <Link to="/list-my-business" className={navLinkClass}>
              List My Business
            </Link>
          )}
          <Link to="/calculators" className={navLinkClass}>
            Calculators
          </Link>
        </div>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          {!loggedIn ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link to="/login" className={`${navLinkClass} px-2`}>
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          ) : null}
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 hover:bg-slate-100"
          >
            <span className="text-gray-600 text-lg leading-none">☰</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm">
              👤
            </span>
          </button>

          {isOpen ? (
            <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,18rem)] sm:w-64 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-50 max-h-[min(85vh,32rem)] overflow-y-auto">
              <div className="md:hidden flex flex-col border-b border-gray-100 pb-2 mb-1">
                {primaryNavLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="px-6 py-2.5 text-[15px] font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {loggedIn ? (
                <div className="flex flex-col">
                  {menuItems.map((item, index) =>
                    item.onClick ? (
                      <button
                        key={index}
                        type="button"
                        onClick={item.onClick}
                        className="w-full px-6 py-3 text-left text-[15px] font-medium text-gray-800 hover:bg-gray-50"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={index}
                        to={item.path}
                        className={`px-6 py-3 text-[15px] font-medium transition-colors hover:bg-gray-50 block ${item.highlight ? "text-blue-600 font-bold" : "text-gray-800"
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col py-1">
                  <Link
                    to="/login"
                    className="px-6 py-3 text-[15px] font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-3 text-[15px] font-medium text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
