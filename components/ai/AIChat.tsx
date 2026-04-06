
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

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 PRESET LISTENER
  useEffect(() => {
    const handler = (e: any) => {
      sendMessage(e.detail);
    };

    window.addEventListener("ai-preset", handler);
    return () => window.removeEventListener("ai-preset", handler);
  }, []);

  const streamText = async (text: string, index: number) => {
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prev) => {
        const updated = [...prev];
        updated[index] = { role: "assistant", content: current };
        return updated;
      });

      await new Promise((res) => setTimeout(res, 10)); // speed
    }
  };

  const sendMessage = async (text: string) => {
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "typing..." },
    ]);

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AI_API_URL}/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
            session_id: "default",
            context: {},
          }),
        }
      );

      const data = await res.json();

      // 🔥 HANDLE IMAGE RESPONSE
      if (data.type === "image") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            image: data.data.image_url,
          };
          return updated;
        });
      } else {
        const index = messages.length + 1;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "",
          };
          return updated;
        });

        await streamText(data, index);
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ AI request failed. Try again.",
        };
        return updated;
      });
    }

    setLoading(false);
  };

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
        {
          method: "POST",
          body: formData,
        }
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

  return (
    <div className="flex flex-col h-full">

      {/* 💬 MESSAGES */}
      <div className="flex-1 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <AIMessage key={i} {...msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <AIInput onSend={sendMessage} onUpload={handleUpload} />
    </div>
  );
}
