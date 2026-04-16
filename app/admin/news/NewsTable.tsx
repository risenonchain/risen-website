"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const NewsForm = dynamic(() => import("./NewsForm"), { ssr: false });

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  details: string;
  url?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchNews = () => {
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/news/")
      .then(res => res.json())
      .then(setNews)
      .catch(() => setError("Failed to load news"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: NewsItem) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this news item?")) return;
    setSaving(true);
    await fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/news/" + id, { method: "DELETE" });
    fetchNews();
    setSaving(false);
  };

  const handleSave = async (data: any) => {
    setSaving(true);
    const method = editItem ? "PUT" : "POST";
    const url = process.env.NEXT_PUBLIC_RUSH_API_URL + "/news" + (editItem ? "/" + editItem.id : "/");
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    setEditItem(null);
    fetchNews();
    setSaving(false);
  };

  return (
    <div className="rounded-3xl bg-[#101828] border border-cyan-400/20 p-10 min-h-[60vh] shadow-xl flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-4 text-cyan-400">Live News Management</h1>
      <p className="text-white/70 mb-8 text-center max-w-xl">
        Add, edit, or remove live scrolling news updates. Each news item can have a title, short summary, and full details for modal popup.
      </p>
      {showForm && (
        <NewsForm
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(null); }}
          initial={editItem}
        />
      )}
      <button
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-5 py-2 rounded shadow mb-6"
        onClick={handleAdd}
        disabled={showForm || saving}
      >
        + Add News
      </button>
      {loading ? (
        <div className="text-white/60">Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <div className="w-full max-w-2xl">
          <table className="w-full text-white border-separate border-spacing-y-2">
            <thead>
              <tr className="text-cyan-300 text-left">
                <th>Title</th>
                <th>Summary</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {news.map(item => (
                <tr key={item.id} className="bg-[#07111d] rounded-xl">
                  <td className="py-2 px-3 font-semibold">{item.title}</td>
                  <td className="py-2 px-3 text-white/80">{item.summary}</td>
                  <td className="py-2 px-3">{item.is_active ? "✅" : "❌"}</td>
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
