"use client";

import { useEffect, useRef, useState } from "react";
import AIMessage from "./AIMessage";
import AIInput from "./AIInput";

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
        const reply = data.data?.content || data; // Handle both direct string or nested content
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: typeof reply === 'string' ? reply : "Protocol communication error." },
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
    <div className="flex flex-col h-full w-full mx-auto bg-[#02070d] overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scroll">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                <div className="text-6xl mb-4">🧠</div>
                <div className="text-xs font-black uppercase tracking-[0.4em]">Neural Core Standby</div>
                <div className="text-[10px] mt-2 font-bold max-w-[200px]">Awaiting cognitive input...</div>
            </div>
        )}
        {messages.map((msg, i) => (
          <AIMessage key={i} {...msg} />
        ))}
        {loading && (
            <div className="flex items-start gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-lg bg-risen-primary/20 flex items-center justify-center text-xs">AI</div>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                </div>
            </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-white/5 bg-[#030913]">
        {remainingPrompts !== null && remainingPrompts < 5 && (
            <div className="mb-2 text-center">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">
                    Low Sync Capacity: {remainingPrompts} Prompts Remaining
                </span>
            </div>
        )}
        <AIInput onSend={sendMessage} onUpload={handleUpload} />
        <div className="mt-2 text-center">
            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">RISEN_COGNITIVE_LAYER_V1.2</span>
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
