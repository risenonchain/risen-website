"use client";

import { useEffect, useRef, useState } from "react";
import AIMessage from "./AIMessage";
import AIInput from "./AIInput";

type Message = {
  role: "user" | "assistant";
  content?: string;
  image?: string;
};

export default function AIChat({
  presetMessage,
}: {
  presetMessage?: string | null;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_AI_API_URL!;
  console.log("API URL:", API_URL);

  // =========================
  // 🔽 AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 🔥 PRESET FROM PROP
  // =========================
  useEffect(() => {
    if (presetMessage) {
      sendMessage(presetMessage);
    }
  }, [presetMessage]);

  // =========================
  // 🔥 GLOBAL PRESET EVENT (NEW)
  // =========================
  useEffect(() => {
    const handler = (e: any) => {
      const msg = e.detail;
      if (msg) sendMessage(msg);
    };

    window.addEventListener("ai-preset", handler);

    return () => {
      window.removeEventListener("ai-preset", handler);
    };
  }, []);

  // =========================
  // 💬 SEND MESSAGE
  // =========================
  const sendMessage = async (input: string) => {
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const token = localStorage.getItem("risen_rush_token");
    const username = localStorage.getItem("risen_rush_username");

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: input,
          session_id: "fallback",
          context: {
            page: window.location.pathname,
            username,
          },
        }),
      });

      const data = await res.json();

      // 🖼 IMAGE
      if (data.type === "image") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            image: data.data.image_url,
          },
        ]);
        return;
      }

      // 💬 STREAM
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "typing" },
      ]);

      const streamRes = await fetch(`${API_URL}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: input,
          session_id: "fallback",
          context: {
            page: window.location.pathname,
            username,
          },
        }),
      });

      const reader = streamRes.body?.getReader();
      const decoder = new TextDecoder();

      let result = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        result += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: result || "typing",
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Try again.",
        },
      ]);
    }
  };

  // =========================
  // 📎 HANDLE IMAGE UPLOAD
  // =========================
  const handleUpload = async (file: File) => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "typing" },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/ai/upload-avatar`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          image: data.image_url,
        };
        return updated;
      });
    } catch (error) {
      console.error("Upload error:", error);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Image upload failed.",
        };
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2">
        {messages.map((msg, i) => (
          <AIMessage
            key={i}
            role={msg.role}
            content={msg.content}
            image={msg.image}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <AIInput onSend={sendMessage} onUpload={handleUpload} />
    </div>
  );
}