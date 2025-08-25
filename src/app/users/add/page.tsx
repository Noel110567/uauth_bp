"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, role }),
    });
    if (res.ok) {
      setSuccess("User added successfully!");
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
      setTimeout(() => router.push("/users"), 1200);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add user");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add User</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg border">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="border px-3 py-2 rounded w-full" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input type="text" className="border px-3 py-2 rounded w-full" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input type="password" className="border px-3 py-2 rounded w-full" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select className="border px-3 py-2 rounded w-full" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">user</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded transition">Add User</button>
      </form>
    </div>
  );
}
