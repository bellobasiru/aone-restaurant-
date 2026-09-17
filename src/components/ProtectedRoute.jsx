import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/config";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (active) setStatus("not-authenticated");
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Admin check timed out")),
            8000
          )
        );

        const adminPromise = getDoc(adminRef);

        const adminSnapshot = await Promise.race([
          adminPromise,
          timeoutPromise,
        ]);

        if (!active) return;

        if (!adminSnapshot.exists()) {
          setStatus("not-admin");
          return;
        }

        const adminData = adminSnapshot.data();

        const validAdmin =
          adminData.role === "admin" &&
          adminData.email?.toLowerCase() ===
            user.email?.toLowerCase();

        setStatus(validAdmin ? "admin" : "not-admin");
      } catch (error) {
        console.error("Admin verification error:", error);

        if (active) {
          setStatus("check-failed");
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Checking admin access...
      </div>
    );
  }

  if (status === "not-authenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "not-admin" || status === "check-failed") {
    return <Navigate to="/" replace />;
  }

  return children;
}
