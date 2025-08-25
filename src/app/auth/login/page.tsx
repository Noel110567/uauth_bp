
'use client';
import { signIn } from "next-auth/react";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    } else if (res?.ok) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
      <button
        className="text-blue-600 hover:underline text-sm mb-2"
        onClick={() => router.push("/auth/signup")}
      >
        Don't have an account? Sign up
      </button>
      <h2 className="text-xl font-semibold mb-2">Sign in to your account</h2>
  <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3 bg-white rounded shadow p-4 mb-2">
        <input
          type="email"
          placeholder="Email"
          className="border rounded px-3 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gray-800 hover:bg-gray-900 text-white rounded px-4 py-2 mt-2"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Email"}
        </button>
        <button
          type="button"
          className="text-blue-600 hover:underline text-xs mt-2 text-left"
          onClick={() => router.push("/auth/forgot")}
        >
          Forgot password?
        </button>
        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      </form>
      <div className="w-full max-w-xs flex flex-col gap-2">
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mb-2"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </button>
        <button
          className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded px-4 py-2"
          onClick={() => signIn("facebook")}
        >
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
