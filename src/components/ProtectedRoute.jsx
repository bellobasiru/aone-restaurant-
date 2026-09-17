import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase/config";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnapshot = await getDoc(adminRef);

        if (adminSnapshot.exists()) {
          const adminData = adminSnapshot.data();

          setIsAdmin(
            adminData.role === "admin" &&
            adminData.email?.toLowerCase() === user.email?.toLowerCase()
          );
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
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

  if (!auth.currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
