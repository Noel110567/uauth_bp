"use client";

import { useState } from "react";

type Resolution = {
  id: number;
  title: string;
  dateApproved: string;
  summary: string;
};

const initialResolutions: Resolution[] = [
  {
    id: 1,
    title: "Resolution on Local Health Program",
    dateApproved: "2025-08-01",
    summary: "Approving the implementation of a new health program for the municipality.",
  },
  {
    id: 2,
    title: "Resolution for Road Repair",
    dateApproved: "2025-07-15",
    summary: "Allocating funds for the repair of municipal roads.",
  },
];

export default function ResolutionsPage() {
  const [resolutions, setResolutions] = useState<Resolution[]>(initialResolutions);
  const [search, setSearch] = useState("");
  const [newResolution, setNewResolution] = useState<Partial<Resolution>>({});
  const [showAdd, setShowAdd] = useState(false);

  const filtered = resolutions.filter(
    r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    if (!newResolution.title || !newResolution.dateApproved || !newResolution.summary) return;
    setResolutions([
      ...resolutions,
      {
        id: Date.now(),
        title: newResolution.title,
        dateApproved: newResolution.dateApproved,
        summary: newResolution.summary,
      },
    ]);
    setNewResolution({});
    setShowAdd(false);
  }

  function handleDelete(id: number) {
    setResolutions(resolutions.filter(r => r.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto px-2 py-4">
      <h1 className="text-2xl font-bold mb-4">Sangguniang Bayan Approved Resolutions</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search resolutions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          Add Resolution
        </button>
      </div>
      {showAdd && (
        <div className="border rounded p-4 mb-4 bg-gray-50">
          <h2 className="font-semibold mb-2">Add New Resolution</h2>
          <input
            type="text"
            placeholder="Title"
            value={newResolution.title || ""}
            onChange={e => setNewResolution(r => ({ ...r, title: e.target.value }))}
            className="border rounded px-2 py-1 mb-2 w-full"
          />
          <input
            type="date"
            value={newResolution.dateApproved || ""}
            onChange={e => setNewResolution(r => ({ ...r, dateApproved: e.target.value }))}
            className="border rounded px-2 py-1 mb-2 w-full"
          />
          <textarea
            placeholder="Summary"
            value={newResolution.summary || ""}
            onChange={e => setNewResolution(r => ({ ...r, summary: e.target.value }))}
            className="border rounded px-2 py-1 mb-2 w-full"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              onClick={handleAdd}
            >
              Save
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {filtered.map(r => (
          <li key={r.id} className="border rounded p-4 bg-white shadow flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{r.title}</span>
              <button
                className="text-red-600 hover:text-red-800 text-sm"
                onClick={() => handleDelete(r.id)}
                title="Delete"
              >
                &times;
              </button>
            </div>
            <span className="text-sm text-gray-500">Approved: {r.dateApproved}</span>
            <p className="text-gray-700">{r.summary}</p>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-gray-500 italic">No resolutions found.</li>
        )}
      </ul>
    </div>
  );
}