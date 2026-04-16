"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./dashboard";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      setShowWarning(false);
      // Show warning after 50s, logout after 60s
      warningTimer.current = setTimeout(() => {
        setShowWarning(true);
      }, 50000);
      timer.current = setTimeout(() => {
        setShowWarning(false);
        router.replace("/admin/login");
      }, 60000);
    };
    resetTimer();
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
    };
  }, [router]);

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#101828] border border-yellow-400/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-fadein relative">
            <div className="text-yellow-300 text-xl font-bold mb-2 text-center">Inactivity Warning</div>
            <div className="text-white/80 mb-4 text-center">You will be logged out in <span className="font-bold">10 seconds</span> due to inactivity.</div>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded shadow w-full"
              onClick={() => setShowWarning(false)}
            >
              Stay Logged In
            </button>
          </div>
          <style jsx>{`
            .animate-fadein { animation: fadein 0.25s; }
            @keyframes fadein { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
          `}</style>
        </div>
      )}
      <AdminDashboard>{children}</AdminDashboard>
    </>
  );
}
