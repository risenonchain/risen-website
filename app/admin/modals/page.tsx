"use client";

import { useEffect, useState } from "react";

interface ModalItem {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  start_at?: string;
  end_at?: string;
  created_at: string;
  updated_at?: string;
}

export default function AdminModalsPage() {
  const [modals, setModals] = useState<ModalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ModalItem | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchModals = () => {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/modals/")
      .then(res => res.json())
      .then(setModals)
      .catch(() => setError("Failed to load modals"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchModals();
  }, []);

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: ModalItem) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this modal?")) return;
    setSaving(true);
    await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/modals/" + id, { method: "DELETE" });
    fetchModals();
    setSaving(false);
  };

  const handleSave = async (data: any) => {
    setSaving(true);
    const method = editItem ? "PUT" : "POST";
    const url = process.env.NEXT_PUBLIC_RUSH_API_URL + "/modals" + (editItem ? "/" + editItem.id : "/");
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    setEditItem(null);
    fetchModals();
    setSaving(false);
  };

  return (
    <div className="rounded-3xl bg-[#101828] border border-yellow-400/20 p-10 min-h-[60vh] shadow-xl flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-yellow-400">Modal Management</h1>
      <p className="text-white/70 mb-8 text-center max-w-xl">
        Schedule contests, announcements, and manage platform modals here.
      </p>
      {showForm && (
        <ModalForm
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          initial={editItem}
        />
      )}
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-5 py-2 rounded shadow mb-6"
        onClick={handleAdd}
        disabled={showForm || saving}
      >
        + Add Modal
      </button>
      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="w-full max-w-2xl">
          <table className="w-full text-white border-separate border-spacing-y-2">
            <thead>
              <tr className="text-yellow-300 text-left">
                <th>Title</th>
                <th>Active</th>
                <th>Start</th>
                <th>End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modals.map(item => (
                <tr key={item.id} className="bg-[#07111d] rounded-xl">
                  <td className="py-2 px-3 font-semibold">{item.title}</td>
                  <td className="py-2 px-3">{item.is_active ? "✅" : "❌"}</td>
                  <td className="py-2 px-3">{item.start_at ? new Date(item.start_at).toLocaleString() : "-"}</td>
                  <td className="py-2 px-3">{item.end_at ? new Date(item.end_at).toLocaleString() : "-"}</td>
                  <td className="py-2 px-3">
                    <button
                      className="text-yellow-400 hover:underline mr-2"
                      onClick={() => handleEdit(item)}
                      disabled={saving}
                    >Edit</button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ModalForm({ onSave, onCancel, initial }: { onSave: (data: any) => void; onCancel: () => void; initial?: ModalItem | null }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [isActive, setIsActive] = useState(initial?.is_active || false);
  const [startAt, setStartAt] = useState(initial?.start_at || "");
  const [endAt, setEndAt] = useState(initial?.end_at || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      content,
      is_active: isActive,
      start_at: startAt,
      end_at: endAt,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg bg-[#07111d] border border-yellow-400/20 rounded-2xl p-6 mb-8">
      <div className="mb-4">
        <label className="block text-yellow-300 font-semibold mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-[#101828] border border-yellow-400/20 text-white"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-yellow-300 font-semibold mb-1">Content</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-[#101828] border border-yellow-400/20 text-white"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <div className="mb-4 flex gap-4 items-center">
        <label className="text-yellow-300 font-semibold">Active</label>
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
        />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-yellow-300 font-semibold mb-1">Start At</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 rounded bg-[#101828] border border-yellow-400/20 text-white"
            value={startAt ? startAt.slice(0, 16) : ""}
            onChange={e => setStartAt(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-yellow-300 font-semibold mb-1">End At</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 rounded bg-[#101828] border border-yellow-400/20 text-white"
            value={endAt ? endAt.slice(0, 16) : ""}
            onChange={e => setEndAt(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-5 py-2 rounded shadow"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white font-bold px-5 py-2 rounded shadow"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
