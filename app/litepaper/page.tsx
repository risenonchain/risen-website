import fs from "fs";
import path from "path";
import DocumentEngine from "@/components/DocumentEngine";

export default function Litepaper() {
  const filePath = path.join(process.cwd(), "app", "litepaper", "litepaper.md");
  const content = fs.readFileSync(filePath, "utf8");

  return (
    <div className="relative min-h-screen bg-[#010913] text-white overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(46,219,255,0.12),transparent_60%)] pointer-events-none" />

      <div className="fixed top-0 left-0 right-0 w-full bg-[#010913]/90 backdrop-blur-xl border-b border-risen-primary/20 z-50">
        <div className="w-full max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a
            href="/"
            className="text-risen-primary font-semibold hover:opacity-80 transition"
          >
            ← Back to Homepage
          </a>

          <span className="text-white font-bold tracking-wide">
            RISEN
          </span>
        </div>
      </div>

      <div className="px-6 pt-36 pb-24 relative z-10">
        <div className="max-w-3xl mx-auto">
          <DocumentEngine
            title="RISEN Litepaper"
            content={content}
            pdfLink="/public/litepaper.pdf"


            githubLink="https://github.com/risenonchain/risen-website/blob/main/app/litepaper/litepaper.md"

          />
        </div>
      </div>

    </div>
  );
}
