import { useEffect, useRef, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  details: string;
  url?: string;
  is_active: boolean;
}

  const [news, setNews] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [paused, setPaused] = useState(false);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_RUSH_API_URL + "/news/")
      .then(res => res.json())
      .then(data => setNews(data.filter((n: NewsItem) => n.is_active)))
      .catch(() => setNews([]));
  }, []);

  if (!news.length) return null;

  return (
    <>
      <div
        className="w-full bg-[#07111d] border-b border-cyan-400/20 overflow-hidden flex items-center h-10 cursor-pointer"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div
          ref={marqueeRef}
          className={`whitespace-nowrap animate-marquee flex gap-12 w-full${paused ? " paused" : ""}`}
          style={{
            animationDuration: `${news.length * 12}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {news.map(item => (
            <span
              key={item.id}
              className={`text-cyan-300 font-semibold hover:underline px-4${clickedId === item.id ? " bg-cyan-900/30 rounded" : ""}`}
              onClick={() => {
                if (clickedId === item.id) {
                  setSelected(item);
                  setClickedId(null);
                } else {
                  setClickedId(item.id);
                  setTimeout(() => setClickedId(null), 2000); // reset highlight if no second click
                }
              }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  setPaused(true);
                  setSelected(item);
                }
              }}
            >
              {item.title}: {item.summary}
            </span>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#101828] rounded-2xl p-8 max-w-lg w-full border border-cyan-400/30 shadow-2xl relative animate-fadein">
            <button
              className="absolute top-2 right-3 text-white/60 hover:text-cyan-400 text-2xl"
              onClick={() => { setSelected(null); setPaused(false); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-cyan-400 drop-shadow">{selected.title}</h2>
            <div className="text-white/80 mb-4 whitespace-pre-line text-lg leading-relaxed">
              {selected.details}
            </div>
            {selected.url && (
              <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline font-semibold">Read more</a>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee linear infinite;
        }
        .animate-marquee.paused {
          animation-play-state: paused !important;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-fadein {
          animation: fadein 0.25s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
