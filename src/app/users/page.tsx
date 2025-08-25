"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function AllUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<string>("");

  const startEdit = (user: User) => {
    setEditId(user.id);
    setEditRole(user.role);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditRole("");
  };
  const saveEdit = async (user: User) => {
    // Call API to update role
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: editRole } : u));
      cancelEdit();
    }
  };
  const deleteUser = async (user: User) => {
    if (!confirm(`Delete user ${user.email}?`)) return;
    const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    }
  };

  if (status === "loading" || loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Roles</option>
          <option value="user">user</option>
          <option value="editor">editor</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full text-sm bg-white rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={
                    `transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`
                  }
                >
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.name || "-"}</td>
                  <td className="px-4 py-2">
                    {editId === user.id ? (
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">user</option>
                        <option value="editor">editor</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-900 text-white' : user.role === 'editor' ? 'bg-blue-200 text-blue-900' : 'bg-gray-200 text-gray-700'}`}>{user.role}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editId === user.id ? (
                      <>
                        <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs mr-2 shadow" onClick={() => saveEdit(user)}>Save</button>
                        <button className="px-2 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-xs shadow" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs mr-2 shadow" onClick={() => startEdit(user)}>Edit</button>
                        <button className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs shadow" onClick={() => deleteUser(user)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
