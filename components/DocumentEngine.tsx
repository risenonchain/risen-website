"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, useScroll, useSpring, useInView, LazyMotion, domAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function DocumentEngine({
  title,
  content,
  pdfLink,
  githubLink,
}: {
  title: string;
  content: string;
  pdfLink?: string;
  githubLink?: string;
}) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const [headings, setHeadings] = useState<string[]>([]);

  useEffect(() => {
    const matches = content.match(/^#\s(.+)$/gm);
    if (matches) {
      setHeadings(matches.map((h) => h.replace("# ", "")));
    }
  }, [content]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className="relative">

        {/* Progress Bar */}
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-risen-primary origin-left z-[60]"
        />

        {/* Floating TOC */}
        <div className="hidden lg:block fixed right-10 top-40 w-64">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <p className="text-sm uppercase text-gray-400 mb-4 tracking-wide">
              Contents
            </p>
            <ul className="space-y-3 text-sm">
              {headings.map((heading, i) => (
                <li key={i}>
                  <a
                    href={`#${heading.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-gray-300 hover:text-risen-primary transition"
                  >
                    {heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </h1>
        </motion.div>

        {/* Controls */}
        {(pdfLink || githubLink) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mb-20"
          >
            <div className="flex gap-6 bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(46,219,255,0.1)]">
              {pdfLink && (
                <a
                  href={pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-risen-primary text-white font-semibold hover:shadow-[0_0_20px_rgba(46,219,255,0.6)] transition"
                >
                  Download PDF
                </a>
              )}

              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-risen-primary text-risen-primary font-medium hover:bg-risen-primary hover:text-black transition"
                >
                  View on GitHub
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Markdown */}
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => {
                const ref = useRef(null);
                const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });

                return (
                  <div ref={ref} className="mt-28 mb-12">
                    <div
                      className={`inline-block px-6 py-3 rounded-xl border transition-all duration-500 ${
                        isInView
                          ? "border-risen-primary shadow-[0_0_30px_rgba(46,219,255,0.4)]"
                          : "border-white/10"
                      } bg-white/5 backdrop-blur-md`}
                    >
                      <h1
                        id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
                        className="text-3xl font-black text-risen-primary tracking-tighter uppercase italic"
                      >
                        {children}
                      </h1>
                    </div>
                  </div>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-16 mb-6 tracking-tight border-b border-white/5 pb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold text-risen-primary/80 mt-12 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-300 leading-relaxed mb-6 text-base md:text-lg">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="space-y-4 text-gray-300 mb-8 list-disc pl-6">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <div className="border-l-4 border-risen-primary bg-risen-primary/5 px-8 py-6 italic text-gray-300 my-10 rounded-r-2xl">
                  {children}
                </div>
              ),
              code: ({ children }) => (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-risen-primary font-mono text-sm">
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </LazyMotion>
  );
}