import { useState } from "react";
import { submitContact } from "../../services/contactService.js";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import ContactUsHeroImage from "../../assets/images/contact-us-hero.png"
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import InstagramIcon from "../../assets/images/instagram.png"
import TwitterIcon from "../../assets/images/twitter.png"
import YoutubeIcon from "../../assets/images/youtube.png"
import FacebookIcon from "../../assets/images/facebook.png"

const ContactHero = () => (
  <div className="page-hero relative w-full bg-blue-400 overflow-hidden flex items-center justify-center">
    <img
      src={ContactUsHeroImage}
      alt="Contact us Hero"
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-blue-500/10" />
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <h1 className="relative headings z-10 text-5xl font-black text-slate-900 tracking-tight">Contact Us</h1>
  </div>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const cards = [
  {
    icon: <PhoneIcon />,
    title: "Customer Support",
    description:
      "For any questions or issues regarding your experience on Acquisition Navigator, our dedicated customer support team is here to assist you. Whether you need help with navigating the directory or resolving a problem, don't hesitate to reach out.",
    action: "+94 11 234 5678",
  },
  {
    icon: <MailIcon />,
    title: "Business Inquiries",
    description:
      "If you're a local business looking to list your products or services on Acquisition Navigator, or if you have any partnership opportunities in mind, please contact us directly. We're eager to help you get started and grow your presence in the community.",
    action: "info.AcquisitionNavigator@gmail.com",
  },
  {
    icon: <ShareIcon />,
    title: "Feedback and Suggestions",
    description:
      "We value your input! Share your feedback or suggestions on how we can improve Acquisition Navigator. Your insights help us enhance our platform and provide a better experience for everyone. Reach out to us with your thoughts and ideas.",
    action: "Fill below Form",
  },
];

const ContactCards = () => (
  <div className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 pb-20">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="relative bg-[#F8F9FA] p-10 flex flex-col items-center text-center shadow-sm"
        >
          <div className="absolute -top-8 left-8 w-16 h-16 rounded-full bg-[#5C7CFA] flex items-center justify-center shadow-lg">
            {card.icon}
          </div>

          <div className="mt-8 flex flex-col h-full items-center">
            <h3 className="text-xl headings font-bold text-slate-900 mb-6">
              {card.title}
            </h3>

            <p className="text-slate-600 text-[13px] leading-[1.8] mb-10 px-2 flex-1">
              {card.description}
            </p>

            <a
              href="#"
              className="text-[#5C7CFA] font-semibold text-lg hover:underline transition-all mb-8"
            >
              {card.action}
            </a>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[6px] bg-[#5C7CFA]" />
        </div>
      ))}
    </div>
  </div>
);

const FBIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TWIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1DA1F2" className="w-5 h-5">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const YTIcon = () => (
  <svg viewBox="0 0 24 24" fill="#FF0000" className="w-5 h-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);
const IGIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-5 h-5" stroke="url(#ig2)">
    <defs>
      <linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const socials = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: TwitterIcon, label: "Twitter" },
  { icon: YoutubeIcon, label: "Youtube" },
  { icon: InstagramIcon, label: "Instagram" },
];

const ContactForm = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const handle = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setSending(true);
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setStatus("Thank you — we received your message.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 bg-white  shadow-md border border-slate-100 p-8">
          <h2 className="text-lg font-bold headings text-slate-800 mb-6">Send Us A Message</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs headings font-semibold text-slate-600 mb-1">Name:</label>
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handle("name")}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs headings font-semibold text-slate-600 mb-1">Email:</label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handle("email")}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs headings font-semibold text-slate-600 mb-1">Message:</label>
            <textarea
              rows={6}
              placeholder="Enter your message"
              value={form.message}
              onChange={handle("message")}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            By submitting this form, You agree to the processing of the submitted personal data in accordance with{" "}
            <a href="#" className="text-blue-600 underline font-medium">LocalNest Privacy Policy,</a>{" "}
            including the transfer of data to the Sri Lanka.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            By submitting this form, you agree to receive information from localNest related to our services, events, and promotions. You may subscribe at any time of the following the instructions in those communications.
          </p>
          {status ? (
            <p className={`mb-4 text-sm ${status.includes("Thank") ? "text-emerald-600" : "text-red-600"}`}>
              {status}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={sending}
            className="headings rounded-lg bg-[#4E7FF1] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all duration-200 hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Submit"}
          </button>
        </div>

        <div className="w-full lg:w-64 bg-white  shadow-md border border-slate-100 p-6">
          <div className="space-y-4 mb-6">
            {socials.map((s) => (
              <a key={s.label} href="#" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <img src={s.icon} alt="" srcset="" />
                </div>
                <span className="text-sm font-medium underline text-blue-700 group-hover:text-blue-600 transition-colors">
                  {s.label}
                </span>
              </a>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-bold text-slate-800 mb-1">Already with Acquisition Navigator?</p>
            <p className="text-xs text-slate-500 leading-relaxed">Chat with us in MyLocalNest and get an instant reply.</p>
          </div>
        </div>
      </form>
    </section>
  );
};

const LocIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const MailIcon2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const PhoneIcon2 = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const infoItems = [
  { icon: <LocIcon />, label: "Visit Our location", value: "101 Rosewood Plaza, Colombo 07" },
  { icon: <MailIcon2 />, label: "Send Us a Mail To", value: "PristineWheels@gmail.com" },
  { icon: <PhoneIcon2 />, label: "Call For Services", value: "(+987) 654 321 228 11\n(+987) 654 321 228 14" },
];

const ContactInfoBar = () => (
  <div className="bg-[#4E7FF1]">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-500">
      {infoItems.map((item) => (
        <div key={item.label} className="flex items-center gap-4 px-8 py-5">
          <div className="w-10 h-10 rounded-full bg-blue-500/60 flex items-center justify-center flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <p className="text-blue-200 text-xs font-semibold mb-0.5">{item.label}</p>
            {item.value.split("\n").map((line) => (
              <p key={line} className="text-white text-sm font-medium">{line}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ContactPage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-1">
      <ContactHero />
      <ContactCards />
      <ContactForm />
      <ContactInfoBar />
    </main>
    <Footer />
  </div>
);