import { useState } from "react";

interface NewsFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  initial?: any;
}

export default function NewsForm({ onSave, onCancel, initial }: NewsFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [summary, setSummary] = useState(initial?.summary || "");
  const [details, setDetails] = useState(initial?.details || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  return (
    <form
      className="bg-[#07111d] rounded-xl p-6 w-full max-w-lg border border-cyan-400/20 mb-6"
      onSubmit={e => {
        e.preventDefault();
        onSave({ title, summary, details, url, is_active: isActive });
      }}
    >
      <h3 className="text-xl font-bold mb-4 text-cyan-300">{initial ? "Edit News" : "Add News"}</h3>
      <div className="mb-3">
        <label className="block text-white/80 mb-1">Title</label>
        <input
          className="w-full px-3 py-2 rounded bg-[#101828] border border-cyan-400/20 text-white"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-white/80 mb-1">Summary</label>
        <input
          className="w-full px-3 py-2 rounded bg-[#101828] border border-cyan-400/20 text-white"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-white/80 mb-1">Full Details</label>
        <textarea
          className="w-full px-3 py-2 rounded bg-[#101828] border border-cyan-400/20 text-white min-h-[80px]"
          value={details}
          onChange={e => setDetails(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-white/80 mb-1">URL (optional)</label>
        <input
          className="w-full px-3 py-2 rounded bg-[#101828] border border-cyan-400/20 text-white"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
          id="isActive"
        />
        <label htmlFor="isActive" className="text-white/80">Active</label>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-5 py-2 rounded shadow"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
