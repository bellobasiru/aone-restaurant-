import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Phase 2:
      // Test Firebase Authentication without Firestore admin checking.
      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);

      switch (error.code) {
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;

        case "auth/user-not-found":
          setError("No account was found with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please wait and try again.");
          break;

        default:
          setError(error.message || "Unable to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
        }}
      >
        <h1 style={{ marginBottom: "8px" }}>
          AONE Restaurant
        </h1>

        <h2>Admin Login</h2>

        <p>
          Sign in to access the administration area.
        </p>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              borderRadius: "6px",
              background: "#ffe5e5",
              color: "#b00020",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Admin email"
              autoComplete="email"
              required
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "6px",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
              autoComplete="current-password"
              required
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                marginTop: "6px",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
