"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { signIn, signOut, signUp } from "@/lib/auth-client";

const ROLES = [
  {
    value: "user",
    label: "Buyer",
    description: "Browse & purchase artworks",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="flex-shrink-0"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
  {
    value: "artist",
    label: "Artist",
    description: "Upload & sell your creations",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="flex-shrink-0"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
];

export default function RegisterPage() {
  const router = useRouter();

  // Step: 1 = role pick, 2 = details
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const goToDetails = () => {
    if (!role) {
      setError("Please choose a role to continue.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) return setError("Full name is required.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setIsLoading(true);
    try {
      const { error: authError, data } = await signUp.email({
        email,
        password,
        name: fullName,
      });

      if (authError) {
        setError(authError.message || "Registration failed.");
        setIsLoading(false);
        return;
      }

      console.log("User created:", data);

      const updateRes = await fetch("/api/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role, // "user" বা "artist" যেটা select করছো
        }),
      });

      const updateData = await updateRes.json();
      console.log("Role update response:", updateData);

      if (!updateRes.ok) {
        setError("Failed to set role");
        setIsLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting…");

      await signOut();

      setTimeout(async () => {
        await signIn.email({ email, password });
        router.push(role === "artist" ? "/dashboard/artist" : "/dashboard/user");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!role) {
      setError("Please choose a role before continuing with Google.");
      return;
    }
    setError("");
    setGoogleLoading(true);
    try {
      // ✅ Step 1: First email/password দিয়ে temp user বানাও role সহ
      const tempEmail = `temp_${Date.now()}@arthub.temp`;
      const tempPassword = Math.random().toString(36);

      await signUp.email({
        email: tempEmail,
        password: tempPassword,
        name: "Temp User",
        pendingRole: role, // এটা DB তে save হবে
      });

      // ✅ Step 2: Google sign in করো
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user",
      });
    } catch {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  // Password strength
  const strength = (() => {
    if (!password) return null;
    const score = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    return [
      null,
      { label: "Weak", color: "bg-red-500", w: "25%" },
      { label: "Fair", color: "bg-amber-500", w: "50%" },
      { label: "Good", color: "bg-yellow-400", w: "75%" },
      { label: "Strong", color: "bg-emerald-500", w: "100%" },
    ][score];
  })();

  return (
    <div className="flex min-h-screen">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-[#0D0D0D]">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 70% 80%,#1a0a2e 0%,#0D0D0D 60%)" }}
        />
        <div
          className="absolute bottom-20 right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: "linear-gradient(135deg,#db2777,#7c3aed)" }}
        />
        <div
          className="absolute top-24 left-8 w-40 h-40 rounded-full opacity-15"
          style={{ background: "linear-gradient(135deg,#f97316,#db2777)" }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full opacity-10"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <ArtHubLogo />
            <span className="text-white text-xl font-semibold tracking-tight">ArtHub</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            {
              icon: "🎨",
              title: "Sell your art globally",
              body: "Reach collectors and buyers from every corner of the world.",
            },
            {
              icon: "💳",
              title: "Secure Stripe payments",
              body: "Every transactionsn is protected and processed instantly.",
            },
            { icon: "📊", title: "Track your sales", body: "A dashboard built to help artists grow their revenue." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-white/90 text-sm font-medium">{item.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-white/20 text-xs">© 2025 ArtHub. All rights reserved.</p>
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
            {/* Header + step dots */}
            <div className="flex flex-col items-center justify-center gap-2 pb-6 border-b border-zinc-100 dark:border-zinc-800 mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {step === 1 ? "Create an account" : "Almost there"}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {step === 1 ? "Choose how you want to use ArtHub" : "Fill in your details to finish signing up"}
              </p>
              {/* Step dots */}
              <div className="flex items-center gap-2 mt-1">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${s === step ? "w-6 bg-violet-600" : s < step ? "w-3 bg-violet-400" : "w-3 bg-zinc-200 dark:bg-zinc-700"}`}
                  />
                ))}
              </div>
            </div>

            {/* Error / success */}
            {error && (
              <div className="p-3.5 text-xs font-medium rounded-xl bg-red-100/60 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 mb-5">
                <span className="font-semibold">Error:</span> {error}
              </div>
            )}
            {success && (
              <div className="p-3.5 text-xs font-medium rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 mb-5">
                <span className="font-semibold">Success:</span> {success}
              </div>
            )}

            {/* ── STEP 1: Role picker ── */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setRole(r.value);
                      setError("");
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      role === r.value
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-transparent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        role === r.value
                          ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${role === r.value ? "text-violet-700 dark:text-violet-300" : "text-zinc-800 dark:text-zinc-200"}`}
                      >
                        {r.label}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{r.description}</p>
                    </div>
                    {/* Radio dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        role === r.value ? "border-violet-500 bg-violet-500" : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {role === r.value && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}

                <Button
                  type="button"
                  color="primary"
                  className="w-full font-semibold rounded-xl text-sm h-12 mt-1"
                  onPress={goToDetails}
                >
                  Continue
                </Button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                  <span className="text-zinc-400 dark:text-zinc-600 text-xs uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
                >
                  {googleLoading ? <SmallSpinner /> : <GoogleIcon />}
                  Continue with Google
                </button>

                <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-violet-600 dark:text-violet-400">
                    Sign in instead
                  </Link>
                </div>
              </div>
            )}

            {/* ── STEP 2: Details form ── */}
            {step === 2 && (
              <form onSubmit={handleRegister} className="flex flex-col gap-5">
                {/* Role badge + back */}
                <div className="flex items-center justify-between -mt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1">
                    {ROLES.find((r) => r.value === role)?.icon}
                    Joining as {role === "user" ? "a Buyer" : "an Artist"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors underline underline-offset-2"
                  >
                    Change
                  </button>
                </div>

                {/* Full name */}
                <TextField isRequired name="name" className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</Label>
                  <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
                    <UserIcon />
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                    />
                  </InputGroup>
                </TextField>

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
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</Label>
                  <InputGroup className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 focus-within:border-violet-500 transition-colors">
                    <LockIcon />
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    >
                      {showPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </InputGroup>
                  {/* Strength bar */}
                  {strength && (
                    <div className="space-y-1 mt-0.5">
                      <div className="h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                          style={{ width: strength.w }}
                        />
                      </div>
                      <p className="text-xs text-zinc-400">
                        Strength: <span className="text-zinc-600 dark:text-zinc-300">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </TextField>

                {/* Confirm password */}
                <TextField isRequired name="confirm" className="flex flex-col gap-1.5">
                  <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm Password</Label>
                  <InputGroup
                    className={`flex items-center gap-2 border rounded-xl px-3 bg-zinc-50 dark:bg-zinc-900 transition-colors ${
                      confirm && confirm !== password
                        ? "border-red-400 dark:border-red-700"
                        : "border-zinc-200 dark:border-zinc-700 focus-within:border-violet-500"
                    }`}
                  >
                    <LockIcon />
                    <Input
                      type={showCf ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-900 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCf((v) => !v)}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors focus:outline-none"
                    >
                      {showCf ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </InputGroup>
                  {confirm && confirm !== password && (
                    <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
                  )}
                </TextField>

                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed -mt-1">
                  By creating an account you agree to our{" "}
                  <Link href="/terms" className="text-violet-600 dark:text-violet-400 underline underline-offset-2">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-violet-600 dark:text-violet-400 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  color="primary"
                  className="w-full font-semibold rounded-xl text-sm h-12"
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  Create Account
                </Button>

                <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-medium text-violet-600 dark:text-violet-400">
                    Sign in instead
                  </Link>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── Icons & logo ── */
function ArtHubLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#7c3aed" />
      <path
        d="M8 24L14 10L20 20L23 15L28 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="11" r="3" fill="#f472b6" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
function SmallSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-400 pointer-events-none flex-shrink-0"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-400 pointer-events-none flex-shrink-0"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-zinc-400 pointer-events-none flex-shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
