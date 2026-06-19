"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { signIn } from "@/lib/auth-client";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setIsLoading(true);
    try {
      const { data, error: authError } = await signIn.email({
        email, password, rememberMe,
      });
      if (authError) { setError(authError.message || "Invalid email or password."); return; }
      setSuccess("Signed in successfully! Redirecting…");
      const role = data?.user?.role;
      if (role === "admin")  router.push("/dashboard/admin");
      else if (role === "artist") router.push("/dashboard/artist");
      else router.push("/");
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(""); setSuccess("");
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-[#0D0D0D]">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%,#1a0a2e 0%,#0D0D0D 60%)" }} />
        <div className="absolute top-16 left-16 w-64 h-64 rounded-full opacity-20" style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }} />
        <div className="absolute bottom-32 right-8 w-48 h-48 rounded-full opacity-15" style={{ background: "linear-gradient(135deg,#db2777,#f97316)" }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-10" style={{ background: "linear-gradient(135deg,#06b6d4,#7c3aed)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <ArtHubLogo />
            <span className="text-white text-xl font-semibold tracking-tight">ArtHub</span>
          </Link>
        </div>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-[1.75rem] font-light leading-snug mb-4">
            "Art is not what you see,<br />but what you make others see."
          </blockquote>
          <p className="text-white/40 text-sm">— Edgar Degas</p>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[["A","#7c3aed"],["M","#db2777"],["S","#f97316"],["R","#06b6d4"]].map(([l,c]) => (
              <div key={l} className="w-9 h-9 rounded-full border-2 border-[#0D0D0D] flex items-center justify-center text-xs font-medium text-white" style={{ background: c }}>{l}</div>
            ))}
          </div>
          <p className="text-white/50 text-sm">Join <span className="text-white/80">12,000+</span> artists & collectors</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <ArtHubLogo size={28} />
              <span className="text-zinc-900 dark:text-white text-lg font-semibold tracking-tight">ArtHub</span>
            </Link>
          </div>

          <Card className="w-full p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">

            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-1 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Welcome back</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to your ArtHub account</p>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60 mb-5"
            >
              {googleLoading ? <SmallSpinner /> : <GoogleIcon />}
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              <span className="text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">

              {/* Email */}
              <TextField isRequired name="email" type="email" className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</Label>
                <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
                  <MailIcon />
                  <Input
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                  />
                </InputGroup>
              </TextField>

              {/* Password */}
              <TextField isRequired name="password" className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
                  <LockIcon />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none">
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </InputGroup>
              </TextField>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none -mt-1">
                <div className="relative flex-shrink-0">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="sr-only peer" />
                  <div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-600 peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-colors flex items-center justify-center">
                    {rememberMe && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                </div>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Remember me for 30 days</span>
              </label>

              {/* Alerts */}
              {error && (
                <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                  <span className="font-semibold">Error:</span> {error}
                </div>
              )}
              {success && (
                <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  <span className="font-semibold">Success:</span> {success}
                </div>
              )}

              <Button
                type="submit"
                color="primary"
                className="w-full font-semibold rounded-xl text-sm h-12"
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Sign In
              </Button>

              <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="font-medium text-violet-600 dark:text-violet-400">
                  Create one
                </Link>
              </div>

            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Shared icons & logo ── */
function ArtHubLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#7c3aed" />
      <path d="M8 24L14 10L20 20L23 15L28 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="22" cy="11" r="3" fill="#f472b6" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
function SmallSpinner() {
  return <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>;
}
function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 pointer-events-none flex-shrink-0"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 7l10 7 10-7"/></svg>;
}
function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 pointer-events-none flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
function EyeIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}