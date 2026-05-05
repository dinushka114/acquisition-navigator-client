import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SocialAuthButtons } from "./SocialAuthButtons.jsx";
import { AuthFormField } from "./AuthFormField.jsx";
import { login } from "../../services/authService.js";
import { setToken, setUser } from "../../lib/authStorage.js";
import Logo from "../../assets/images/home/Logo.png";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await login(email.trim(), password);
      if (data?.token) setToken(data.token);
      if (data?.user) {
        const u = data.user;
        setUser({ ...u, id: u.id ?? u._id });
      }
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#BFDFFF]">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        {/* Welcome panel */}
        <div className="flex w-full flex-col items-center justify-center bg-white px-10 py-12 md:w-1/2 md:px-14 md:py-16 md:rounded-r-[7rem] md:shadow-2xl">
          <img src={Logo} alt="Acquisition Navigator" className="mb-7 h-10 w-auto" />
          <h1 className="headings text-center text-3xl font-extrabold text-slate-900 leading-tight">
            Welcome Back Acquisition <br />
            Navigator
          </h1>
          <p className="mt-4 max-w-sm text-center text-[11px] leading-relaxed text-slate-500">
            We&apos;re delighted to see you again! As a valued member, you have easy access to all
            our services and special offers.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex w-full flex-1 flex-col items-center justify-center px-8 py-12 md:w-1/2 md:px-16">
          <h2 className="headings mb-4 text-4xl font-extrabold tracking-tight text-slate-900">LOG IN</h2>

          <SocialAuthButtons variant="onBlue" />

          <p className="mt-3 text-[11px] text-white/70">or use your email &amp; password</p>

          <form onSubmit={handleSubmit} className="mt-4 w-full max-w-[280px] space-y-3">
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <AuthFormField
              id="login-email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={submitting}
            />
            <AuthFormField
              id="login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={submitting}
            />
            <button
              type="button"
              className="block w-full text-center text-[11px] text-white/70 hover:text-white"
            >
              Forgot password?
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-md bg-[#4E7FF1] py-3 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-600 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-[11px] text-white/75">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-white underline-offset-2 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
