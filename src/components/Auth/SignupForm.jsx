import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocialAuthButtons } from "./SocialAuthButtons.jsx";
import { AuthFormField } from "./AuthFormField.jsx";
import { register } from "../../services/authService.js";
import { setToken, setUser } from "../../lib/authStorage.js";
import Logo from "../../assets/images/home/Logo.png";

export function SignupForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nicOrPassport, setNicOrPassport] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await register({
        email: email.trim(),
        password,
        role,
        fullName: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        nicOrPassport: nicOrPassport.trim() || undefined,
      });
      // if (data?.token) setToken(data.token);
      // if (data?.user) {
      //   const u = data.user;
      //   setUser({ ...u, id: u.id ?? u._id });
      // }
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#BFDFFF]">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Form panel (left) */}
        <div className="flex w-full flex-1 flex-col items-center justify-center px-8 py-12 md:w-1/2 md:px-16">
          <h2 className="headings mb-5 text-4xl font-extrabold tracking-tight text-slate-900">SIGN UP</h2>

          <div className="mb-4 w-full max-w-[320px]">
            <label htmlFor="signup-role" className="mb-1 block text-center text-[11px] font-medium text-slate-700">
              I am registering as
            </label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={submitting}
              className="w-full rounded-md border border-white/40 bg-white px-4 py-3 text-center text-xs text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-3">
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <AuthFormField
              id="signup-name"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              disabled={submitting}
            />
            <div className="flex gap-3">
              <AuthFormField
                id="signup-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={submitting}
                className="w-1/2"
              />
              <AuthFormField
                id="signup-phone"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                disabled={submitting}
                className="w-1/2"
              />
            </div>
            <AuthFormField
              id="signup-nic"
              placeholder="NIC/Passport"
              value={nicOrPassport}
              onChange={(e) => setNicOrPassport(e.target.value)}
              disabled={submitting}
            />
            <AuthFormField
              id="signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
            />
            <AuthFormField
              id="signup-confirm"
              type="password"
              placeholder="New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-[#4E7FF1] py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-600 disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-white/70">Or</p>
          <p className="text-[11px] text-white/70">Signup with</p>
          <div className="mt-3">
            <SocialAuthButtons variant="onBlue" />
          </div>

          <p className="mt-6 text-[11px] text-white/75">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-white underline-offset-2 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Branding panel (right) */}
        <div className="flex w-full flex-col items-center justify-center bg-white px-10 py-12 md:w-1/2 md:px-14 md:py-16 md:rounded-l-[7rem] md:shadow-2xl">
          <img src={Logo} alt="Acquisition Navigator" className="mb-7 h-10 w-auto" />
          <h1 className="headings text-center text-3xl font-extrabold text-slate-900 leading-tight">
            Welcome To Acquisition <br />
            Navigator
          </h1>
          <p className="mt-4 max-w-sm text-center text-[11px] leading-relaxed text-slate-500">
            Your trusted guide to smarter acquisitions. Streamline decisions, accelerate success.
          </p>
        </div>
      </div>
    </div>
  );
}
