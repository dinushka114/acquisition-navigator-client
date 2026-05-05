import { Link } from "react-router-dom";
import Logo from "../../assets/images/home/Logo.png";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import InstagramIcon from "../../assets/images/instagram.png"
import TwitterIcon from "../../assets/images/twitter.png"
import YoutubeIcon from "../../assets/images/youtube.png"
import FacebookIcon from "../../assets/images/facebook.png"

export const Footer = () => {
  const socialIcons = [
    { Icon: FacebookIcon, color: "text-blue-600" },
    { Icon: TwitterIcon, color: "text-blue-400" },
    { Icon: YoutubeIcon, color: "text-blue-500" },
    { Icon: InstagramIcon, color: "text-blue-400" },
  ];

  const navLinks = ["Home", "Services", "Contact Us", "About Us", "Legal"];

  return (
    <footer className="bg-white pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto text-center px-4 sm:px-6">
        <div className="flex justify-center mb-8">
          <img src={Logo} alt="Acquisition Navigator Logo" className="h-14 w-auto" />
        </div>

        <div className="mb-10">
          <p className="text-slate-900 font-medium mb-4">Follow Us On</p>
          <div className="flex justify-center gap-6">
            {socialIcons.map(({ Icon, color }) => (
              <a 
                key={Icon} 
                href="#" 
                className={`${color} hover:scale-110 transition-transform duration-200 text-xl`}
              >
                <img src={Icon} alt="Social Icon" className="h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-3 sm:gap-8 mb-12 sm:mb-16">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-black hover:text-blue-600 text-base sm:text-lg font-semibold transition-colors duration-200"
            >
              {link}.
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#6384e6] py-6 text-center">
        <p className="text-white text-sm font-medium">
          Copyright 2025 – Developed by Pamuditha . M
        </p>
      </div>
    </footer>
  );
};