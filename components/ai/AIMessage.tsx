
"use client";

import { useState } from "react";

type Props = {
  content?: string;
  image?: string;
  role: "user" | "assistant";
};

function formatMessage(text: string) {
  if (!text) return "";

  return text
    .replace(/### (.*)/g, "<br/><strong>$1</strong><br/>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

export default function AIMessage({ content, image, role }: Props) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!content) return;

    navigator.clipboard.writeText(content);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      
      <div className="flex flex-col max-w-[75%]">

        {/* MESSAGE */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-risen-primary text-white"
              : "bg-[#06111f] text-gray-200 border border-risen-primary/20"
          }`}
        >
          {image && (
            <img
              src={image}
              alt="Generated"
              className="rounded-xl mb-2 w-full"
            />
          )}

          {content === "typing..." ? (
            <div className="flex gap-1 items-center h-6">
              <span className="block w-2 h-2 bg-risen-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="block w-2 h-2 bg-risen-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="block w-2 h-2 bg-risen-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="ml-2 text-xs text-risen-primary font-semibold animate-pulse">RISEN is thinking…</span>
            </div>
          ) : (
            <span
              className="inline-block"
              dangerouslySetInnerHTML={{ __html: formatMessage(content || "") }}
            />
          )}
          )}
        </div>

        {/* COPY BUTTON */}
        {content && content !== "typing..." && (
          <button
            onClick={handleCopy}
            className="text-[10px] mt-1 text-gray-400 hover:text-risen-primary transition self-end"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
