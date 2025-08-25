"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("If this email exists, a reset link has been sent.");
    } else {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <h2 className="text-xl font-semibold mb-2">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3 bg-white rounded shadow p-4 mb-2">
        <input
          type="email"
          placeholder="Enter your email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 mt-2"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        {message && <div className="text-green-600 text-sm mt-1">{message}</div>}
      </form>
    </div>
  );
}
