import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginAdmin, resetAdminPassword } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await loginAdmin(email.trim(), password);
      navigate("/admin");
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError("Enter your email above first, then tap 'Forgot password'.");
      return;
    }
    try {
      await resetAdminPassword(email.trim());
      setInfo("Password reset email sent. Check your inbox.");
      setError("");
    } catch (err) {
      setError(mapAuthError(err));
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-ink/50 text-center mb-8">AONE Restaurant management dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/15 rounded-xl px-4 py-2.5 focus:border-jollof outline-none"
              required
            />
          </div>

          {error && <p className="text-jollof text-sm">{error}</p>}
          {info && <p className="text-palm text-sm">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-jollof text-cream py-3 rounded-full font-medium hover:bg-jollof-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full text-sm text-ink/50 hover:text-jollof"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}

function mapAuthError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Incorrect email or password.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (code.includes("network")) {
    return "Network error. Check your connection and try again.";
  }
  return "Couldn't sign in. Please try again.";
}