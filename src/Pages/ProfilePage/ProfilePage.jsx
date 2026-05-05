import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ProtectedRoute } from "../../components/Routing/ProtectedRoute.jsx";
import { fetchMe, updateMe, uploadMyAvatar } from "../../services/userService.js";
import { setUser } from "../../lib/authStorage.js";
import { baseUrl } from "../../lib/api.js";

function ProfileContent() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [address, setAddress] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [acquisitionTarget, setAcquisitionTarget] = useState("");
  const [skillset, setSkillset] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMe();
        const u = res.user;
        setEmail(u?.email || "");
        setFullName(u?.profile?.fullName || "");
        setPhone(u?.profile?.phone || "");
        setNic(u?.profile?.nicOrPassport || "");
        setAvatarUrl(u?.profile?.avatarUrl || "");
        setAddress(u?.profile?.address || "");
        setAboutMe(u?.profile?.aboutMe || "");
        setAcquisitionTarget(u?.profile?.acquisitionTarget || "");
        setSkillset(u?.profile?.skillset || "");
        setLinkedin(u?.profile?.socialLinks?.linkedin || "");
        setFacebook(u?.profile?.socialLinks?.facebook || "");
        setInstagram(u?.profile?.socialLinks?.instagram || "");
        setTwitter(u?.profile?.socialLinks?.twitter || "");
      } catch {
        /* ignore */
      }
    })();
  }, []);

  function resolveAvatarSrc(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Preferred: "/uploads/..."
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    // Back-compat: "uploads/..."
    if (url.startsWith("uploads/")) return `${baseUrl}/${url}`;
    return `${baseUrl}/${url}`;
  }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    setMsg("");
    try {
      const res = await uploadMyAvatar(file);
      const nextUrl = res?.avatarUrl || res?.user?.profile?.avatarUrl || "";
      setAvatarUrl(nextUrl);
      if (res?.user) {
        const u = res.user;
        setUser({ ...u, id: u.id ?? u._id });
      }
      setMsg("Photo updated.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setAvatarBusy(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await updateMe({
        fullName,
        phone,
        nicOrPassport: nic,
        address,
        aboutMe,
        acquisitionTarget,
        skillset,
        socialLinks: {
          linkedin,
          facebook,
          instagram,
          twitter,
        },
      });
      if (res.user) {
        const u = res.user;
        setUser({ ...u, id: u.id ?? u._id });
      }
      setMsg("Saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <main>
        <div className="w-full bg-black">
          <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-10">
            <div className="relative">
              <label
                className="block h-12 w-12 cursor-pointer overflow-hidden rounded-full bg-white/90 ring-2 ring-white/40"
                title="Change profile photo"
              >
                {avatarUrl ? (
                  <img
                    src={resolveAvatarSrc(avatarUrl)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={avatarBusy}
                  className="hidden"
                />
              </label>
              <div className="pointer-events-none absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5">
                {avatarBusy ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                ) : (
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-700" fill="currentColor" aria-hidden="true">
                    <path d="M9.5 4.5 8.1 6H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.1l-1.4-1.5a2 2 0 0 0-1.5-.7H11a2 2 0 0 0-1.5.7ZM12 9a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" />
                  </svg>
                )}
              </div>
            </div>
            <h1 className="headings text-xl font-medium text-white md:text-2xl">
              {fullName || "Your Name"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left column */}
            <div className="md:col-span-2">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg headings font-semibold text-slate-800">Personal Information</h2>
              </div>

              <div className="mt-6 space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <label className="block text-sm headings font-semibold text-slate-800">Name:</label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <label className="block text-sm headings font-semibold text-slate-800">Email:</label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-500 outline-none"
                    value={email}
                    readOnly
                  />
                </div>

                <div className="border-b border-slate-200 pb-6">
                <label className="block headings text-xs font-semibold text-slate-800">NIC / Passport</label>
                <input
                  className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  placeholder="Enter NIC or Passport"
                />
              </div>

                <div className="border-b border-slate-200 pb-6">
                  <label className="block text-sm headings font-semibold text-slate-800">Phone No:</label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <label className="block text-sm headings font-semibold text-slate-800">Address:</label>
                  <input
                    className="mt-2 w-full bg-transparent text-sm text-slate-700 outline-none"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="border-b border-slate-200 pb-10">
                  <label className="block text-sm headings font-semibold text-slate-800">About me:</label>
                  <textarea
                    className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    rows={4}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Enter your bio information..."
                  />
                </div>

                <div className="border-b border-slate-200 pb-10">
                  <label className="block text-sm headings font-semibold text-slate-800">Acquisition Target:</label>
                  <textarea
                    className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    rows={4}
                    value={acquisitionTarget}
                    onChange={(e) => setAcquisitionTarget(e.target.value)}
                    placeholder="Enter your acquisition target information..."
                  />
                </div>

                <div className="pb-2">
                  <label className="block text-sm headings font-semibold text-slate-800">Skillset:</label>
                  <textarea
                    className="mt-3 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
                    rows={4}
                    value={skillset}
                    onChange={(e) => setSkillset(e.target.value)}
                    placeholder="Enter your skillset information..."
                  />
                </div>
              </div>

              {msg ? <p className="mt-6 text-sm text-blue-600">{msg}</p> : null}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-36 rounded-md bg-[#4E7FF1] px-5 py-2.5 text-xs font-semibold text-white shadow-md disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-1">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm headings font-semibold text-slate-800">Social Links</h3>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                    <span className="font-semibold headings text-slate-700">Linkedin:</span>
                    <input
                      className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                    <span className="font-semibold headings text-slate-700">Facebook:</span>
                    <input
                      className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                    <span className="font-semibold headings text-slate-700">Instagram:</span>
                    <input
                      className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div className="grid grid-cols-[78px_1fr] items-center gap-3">
                    <span className="font-semibold headings text-slate-700">Twiter:</span>
                    <input
                      className="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500/30"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://x.com/..."
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
