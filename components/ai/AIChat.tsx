
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

  // Stream text for typing effect
  const streamText = async (text: string, index: number) => {
    let current = "";
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[index] = { role: "assistant", content: current };
        return updated;
      });
      await new Promise((res) => setTimeout(res, 10));
    }
  };

  // Send user message to backend
  const sendMessage = async (text: string) => {
    if (!text) return;
    // Add user message and a placeholder for assistant response
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "typing..." },
    ]);
    setLoading(true);
    const responseIndex = messages.length + 1; // Index of the assistant placeholder
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, session_id: "default", context: {} }),
        }
      );
      const data = await res.json();
      if (data.type === "image") {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[responseIndex]) {
            updated[responseIndex] = {
              role: "assistant",
              image: data.data.image_url,
            };
          }
          return updated;
        });
      } else {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[responseIndex]) {
            updated[responseIndex] = {
              role: "assistant",
              content: "",
            };
          }
          return updated;
        });
        await streamText(data, responseIndex);
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[responseIndex]) {
          updated[responseIndex] = {
            role: "assistant",
            content: "⚠️ AI request failed. Try again.",
          };
        }
        return updated;
      });
    }
    setLoading(false);
  };

  // Handle file upload
  const handleUpload = async (file: File) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `Uploaded: ${file.name}` },
      { role: "assistant", content: "typing..." },
    ]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/ai/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: data.response || "Processed.",
        };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Upload failed.",
        };
        return updated;
      });
    }
  };

  // Modern chat UI
  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto bg-[#0a101a] rounded-2xl shadow-lg border border-white/10 overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 bg-gradient-to-b from-[#0a101a] to-[#0e1624]">
        {messages.map((msg, i) => (
          <AIMessage key={i} {...msg} />
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input area */}
      <div className="p-4 border-t border-white/10 bg-[#101828]">
        <AIInput onSend={sendMessage} onUpload={handleUpload} />
      </div>
    </div>
  );
}
