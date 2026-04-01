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

  // =========================
  // 🔽 AUTO SCROLL
  // =========================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 🔥 HANDLE PRESET TRIGGERS
  // =========================
  useEffect(() => {
    if (presetMessage) {
      sendMessage(presetMessage);
    }
  }, [presetMessage]);

  // =========================
  // 💬 SEND MESSAGE (TEXT / IMAGE DETECTION)
  // =========================
  const sendMessage = async (input: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    // 🔹 First call normal endpoint to detect type
    const res = await fetch("/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input, session_id: "user1" }),
    });

    const data = await res.json();

    // =========================
    // 🖼 IMAGE RESPONSE
    // =========================
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

    // =========================
    // 💬 STREAM RESPONSE
    // =========================
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "typing" },
    ]);

    const streamRes = await fetch("/ai/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        session_id: "user1",
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
  };

  // =========================
  // 📎 HANDLE IMAGE UPLOAD
  // =========================
  const handleUpload = async (file: File) => {
    // show typing placeholder
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "typing" },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/ai/upload-avatar", {
      method: "POST",
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
  };

  // =========================
  // 🧩 UI
  // =========================
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
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

      {/* Input */}
      <AIInput onSend={sendMessage} onUpload={handleUpload} />
    </div>
  );
}