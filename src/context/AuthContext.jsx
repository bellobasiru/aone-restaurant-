import React, { createContext, useContext, useEffect, useState } from "react";
import { subscribeToAuthState } from "../firebase/auth";
import { isAdminUser } from "../firebase/adminRoles";
import { isFirebaseConfigured } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminStatus = await isAdminUser(firebaseUser.uid).catch(() => false);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}