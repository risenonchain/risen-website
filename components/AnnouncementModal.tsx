"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ModalItem {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  start_at?: string;
  end_at?: string;
}

export default function AnnouncementModal() {
  const [activeModal, setActiveModal] = useState<ModalItem | null>(null);
  const [countdown, setCountdown] = useState(7);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchActiveModal = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_RUSH_API_URL}/modals/`);
        if (res.ok) {
          const data: ModalItem[] = await res.json();
          const now = new Date();
          const active = data.find(m => {
            if (!m.is_active) return false;
            const start = m.start_at ? new Date(m.start_at) : null;
            const end = m.end_at ? new Date(m.end_at) : null;
            if (start && start > now) return false;
            if (end && end < now) return false;
            return true;
          });

          if (active) {
            // Check if seen in this session
            const seen = sessionStorage.getItem(`seen_modal_${active.id}`);
            if (!seen) {
              setActiveModal(active);
              setIsVisible(true);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch modals", e);
      }
    };

    fetchActiveModal();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (activeModal) {
      sessionStorage.setItem(`seen_modal_${activeModal.id}`, "true");
    }
  };

  const handleExplore = () => {
    handleClose();
    router.push("/store");
  };

  if (!isVisible || !activeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-500">
      <div className="relative w-full max-w-lg bg-[#07111d] border border-risen-primary/30 rounded-[40px] p-8 shadow-[0_0_80px_rgba(46,219,255,0.2)] overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-risen-primary transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 7) * 100}%` }} />

        <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-risen-primary/20 bg-risen-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-risen-primary mb-6">
                Announcement
            </div>

            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">
                {activeModal.title}
            </h2>

            <p className="text-white/60 text-sm font-bold leading-relaxed uppercase mb-8">
                {activeModal.content}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
                <button
                    onClick={handleExplore}
                    className="py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-risen-primary hover:text-white transition-all active:scale-95 shadow-lg"
                >
                    Explore Protocol
                </button>
                <button
                    onClick={handleClose}
                    className="py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all active:scale-95"
                >
                    Skip ({countdown}s)
                </button>
            </div>
        </div>

        {/* Close Button */}
        <button
            onClick={handleClose}
            className="absolute top-6 right-6 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
            ✕
        </button>
      </div>
    </div>
  );
}
