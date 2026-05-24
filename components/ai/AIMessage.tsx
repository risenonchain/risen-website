"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content?: string;
  image?: string;
  role: "user" | "assistant";
};

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
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Icon / Avatar */}
      <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all duration-500 ${
          isUser
          ? "bg-white/10 border-white/20 text-white/60"
          : "bg-risen-primary/10 border-risen-primary/30 text-risen-primary shadow-[0_0_15px_rgba(46,219,255,0.2)]"
      }`}>
        {isUser ? "ME" : "AI"}
      </div>

      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div className={`relative px-6 py-5 rounded-[32px] text-[13px] leading-relaxed transition-all duration-700 ${
            isUser
              ? "bg-[#07111d] text-white border border-white/20 rounded-tr-none shadow-xl"
              : "bg-[#04101a] text-white border border-risen-primary/40 rounded-tl-none shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          }`}
        >
          {/* Subtle Scanning effect for AI messages */}
          {!isUser && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-risen-primary/20 animate-[scan_3s_linear_infinite] rounded-full" />
          )}

          {image && (
            <div className="relative group overflow-hidden rounded-2xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img
                    src={image}
                    alt="Neural Output"
                    className="rounded-2xl w-full border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105"
                />
                <a
                    href={image}
                    download
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    Save Image
                </a>
            </div>
          )}

          {content && (
            <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-white prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-code:text-risen-primary prose-strong:text-white prose-strong:font-black prose-ul:text-white prose-ol:text-white prose-li:text-white">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footnote Actions */}
        {content && (
          <div className="flex items-center gap-3 mt-2 px-2">
             <button
                onClick={handleCopy}
                className="text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-risen-primary transition-colors"
              >
                {copied ? "Node Copied ✓" : "Copy Node"}
              </button>
              {!isUser && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Decryption Protocol V2.1 Synchronized</span>
              )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
