import React, { useEffect, useState } from "react";
import { fetchAllAdmins } from "../../firebase/adminRoles";

/**
 * Admin accounts are intentionally NOT creatable from inside the app (see
 * firestore.rules: admins/{uid} write is always false). Creating an admin
 * requires two manual steps in the Firebase console — this is a deliberate
 * security boundary, not a missing feature. See README "Admin Users".
 */
export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllAdmins()
      .then(setAdmins)
      .catch(() => setError("Couldn't load admin users."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl mb-3">Admin Users</h1>
      <p className="text-ink/60 text-sm mb-8 max-w-2xl">
        For security, new admin accounts can only be created from the Firebase
        console, not from this dashboard — that way a compromised website
        can never grant itself extra admins. See the "Admin Users" section of
        the README for the exact two-step process.
      </p>

      {loading && <p className="text-ink/40 text-sm">Loading…</p>}
      {error && <p className="text-jollof text-sm">{error}</p>}

      <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {admins.map((a) => (
              <tr key={a.uid}>
                <td className="px-4 py-3">{a.name || "—"}</td>
                <td className="px-4 py-3 text-ink/60">{a.email}</td>
                <td className="px-4 py-3 capitalize">{a.role || "admin"}</td>
              </tr>
            ))}
            {!loading && admins.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-ink/40">
                  No admin profiles found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}