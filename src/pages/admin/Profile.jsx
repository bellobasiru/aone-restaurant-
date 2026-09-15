import React, { useState } from "react";
import { resetAdminPassword } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);

  async function handlePasswordReset() {
    await resetAdminPassword(user.email);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Profile</h1>

      <div className="bg-white border border-ink/10 rounded-2xl p-6 max-w-md space-y-4">
        <div>
          <p className="text-sm text-ink/50">Email</p>
          <p>{user?.email}</p>
        </div>
        <button
          onClick={handlePasswordReset}
          className="text-sm bg-jollof text-cream px-5 py-2.5 rounded-full hover:bg-jollof-dark"
        >
          {sent ? "Reset email sent ✓" : "Send password reset email"}
        </button>
      </div>
    </div>
  );
}