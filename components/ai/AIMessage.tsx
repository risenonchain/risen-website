"use client";

type Props = {
  content?: string;
  image?: string;
  role: "user" | "assistant";
};

export default function AIMessage({ content, image, role }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm
        ${
          isUser
            ? "bg-risen-primary text-white"
            : "bg-[#06111f] text-gray-200 border border-risen-primary/20"
        }`}
      >
        {/* 🖼 IMAGE */}
        {image && (
          <img
            src={image}
            alt="Generated"
            className="rounded-xl mb-2 w-full"
          />
        )}

        {/* 💬 TEXT */}
        {content === "typing" ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-risen-primary rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-risen-primary rounded-full animate-bounce delay-100" />
            <span className="w-2 h-2 bg-risen-primary rounded-full animate-bounce delay-200" />
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}