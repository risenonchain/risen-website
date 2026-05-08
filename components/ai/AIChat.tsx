"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AIMessage from "./AIMessage";
import AIInput from "./AIInput";
import { BASE_URL } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content?: string;
  image?: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [remainingPrompts, setRemainingPrompts] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for preset events
  useEffect(() => {
    const handler = (e: any) => {
      sendMessage(e.detail);
    };
    window.addEventListener("ai-preset", handler);
    return () => window.removeEventListener("ai-preset", handler);
  }, []);

  // Send user message to backend
  const sendMessage = async (text: string) => {
    if (!text) return;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("rush_token")}`
          },
          body: JSON.stringify({ message: text, session_id: "default", context: {} }),
        }
      );

      const data = await res.json();

      if (data.metadata?.remaining_prompts !== undefined) {
          setRemainingPrompts(data.metadata.remaining_prompts);
      }

      if (data.type === "image") {
        let finalUrl = data.data.image_url;
        // Ensure absolute URL if it's relative
        if (finalUrl.startsWith('/')) {
            finalUrl = `${process.env.NEXT_PUBLIC_AI_API_URL}${finalUrl}`;
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", image: finalUrl },
        ]);
      } else {
        const reply = data.data?.content || data.detail || (typeof data === 'string' ? data : null);

        setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: typeof reply === 'string'
                ? reply
                : "⚠️ **Neural Protocol Error.** The Cognitive Layer returned an unprocessable data packet (Status 422). Please verify your identity and retry the link."
            },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Neural link interrupted. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleUpload = async (file: File) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded Matrix Node: ${file.name}` }
    ]);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/ai/upload`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("rush_token")}` },
            body: formData
        }
      );
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Data packet processed and integrated.",
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Data uplink failed.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto bg-[#02070d]/40 backdrop-blur-sm overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 custom-scroll relative">
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
           <div className="h-full w-full bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(46,219,255,0.05),transparent_70%)] animate-pulse" />
                <div className="relative">
                  <div className="text-6xl mb-6 animate-bounce duration-[3s] grayscale opacity-20">🧠</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Neural Core Standby</div>
                  <div className="text-[9px] mt-3 font-bold text-white/5 uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">Awaiting cognitive synchronization via elite uplink...</div>
                </div>
            </div>
        )}
        {messages.map((msg, i) => (
          <AIMessage key={i} {...msg} />
        ))}
        {loading && (
            <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="h-9 w-9 rounded-xl bg-risen-primary/10 border border-risen-primary/30 flex items-center justify-center text-[10px] font-black text-risen-primary shadow-[0_0_20px_rgba(46,219,255,0.1)]">AI</div>
                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div className="px-6 py-5 rounded-[32px] bg-[#04101a] border border-risen-primary/30 rounded-tl-none shadow-2xl relative overflow-hidden">
                      {/* Premium Thinking Animation */}
                      <div className="flex items-center gap-3">
                          <div className="relative h-4 w-4">
                              <div className="absolute inset-0 border-2 border-risen-primary/20 rounded-full" />
                              <div className="absolute inset-0 border-2 border-risen-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                          <div className="flex gap-1">
                              <motion.div
                                  animate={{ opacity: [0.2, 1, 0.2] }}
                                  transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
                                  className="text-[10px] font-black uppercase tracking-[0.2em] text-risen-primary/60 italic"
                              >
                                  Synthesizing
                              </motion.div>
                              <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                                  className="text-risen-primary/60"
                              >.</motion.span>
                              <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                                  className="text-risen-primary/60"
                              >.</motion.span>
                              <motion.span
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                                  className="text-risen-primary/60"
                              >.</motion.span>
                          </div>
                      </div>

                      {/* Pulsing Neural Lines */}
                      <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
                          <motion.div
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="w-1/3 h-full bg-gradient-to-r from-transparent via-risen-primary to-transparent"
                          />
                      </div>
                  </div>
                  <div className="px-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/10 animate-pulse">Neural Pathing Active...</span>
                  </div>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-white/5 bg-[#030913]/90 backdrop-blur-xl relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {remainingPrompts !== null && remainingPrompts < 5 && (
            <div className="mb-4 text-center">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.3em] bg-amber-400/10 px-4 py-1 rounded-full border border-amber-400/20 italic">
                    Low Sync Capacity: {remainingPrompts} Prompts Remaining
                </span>
            </div>
        )}
        <AIInput onSend={sendMessage} onUpload={handleUpload} />
        <div className="mt-4 text-center flex items-center justify-center gap-4 opacity-20">
            <div className="h-px w-10 bg-white/20" />
            <span className="text-[8px] font-black text-white uppercase tracking-[0.6em] italic">Neural_Uplink_Encrypted</span>
            <div className="h-px w-10 bg-white/20" />
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
