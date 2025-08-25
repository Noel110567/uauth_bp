"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get email from query string
  let email = "";
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    email = params.get("email") || "";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Password reset! Redirecting to login...");
      setTimeout(() => router.push("/auth/login"), 1500);
    } else {
      const data = await res.json();
      setError(data.error || "Reset failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3 bg-white rounded shadow p-4 mb-2">
        <input
          type="password"
          placeholder="New Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border rounded px-3 py-2"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 mt-2"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      </form>
    </div>
  );
}
