"use client";

import { useState } from "react";

const faqData = [
  {
    q: "What is RISEN ($RSN)?",
    a: `RISEN ($RSN) is a community-powered memecoin and utility token built on the BNB Chain. 
It combines strong meme culture with practical on-chain tools designed to provide real value.

Rather than focusing on short-term hype, RISEN emphasizes long-term sustainability, transparency, and community-driven growth.`,
  },
  {
    q: "When and where is $RSN launching?",
    a: `The official launch is scheduled for March 21, 2026 on a BNB Chain launchpad.

Key principles include:
• No presale
• Community-first approach
• Fair distribution philosophy

The goal is to ensure a balanced and transparent foundation for the ecosystem.`,
  },
  {
    q: "Why was BNB Chain chosen?",
    a: `BNB Chain offers fast transactions, extremely low fees, and one of the largest crypto user bases globally.

Its strong memecoin ecosystem and deep liquidity make it an ideal environment for scalable community-driven projects like RISEN.`,
  },
  {
    q: "What utilities does RISEN provide?",
    a: `RISEN focuses on solving real memecoin ecosystem problems through practical tools.

Memecoin-to-Memecoin Bridge:
Allows easier movement between meme tokens and improves liquidity flow across communities.

Dust Sweeper:
Collects small unused token balances (“dust”) and converts them into usable value.`,
  },
  {
    q: "What is the philosophy behind RISEN?",
    a: `RISEN follows a long-term growth philosophy built on transparency and community alignment.

Core principles include:
• Organic community expansion
• Long-term holder alignment
• Responsible ecosystem scaling
• Real utility development`,
  },
  {
    q: "How can I join the RISEN community?",
    a: `You can connect through our official platforms:

• X (Twitter)
• Telegram Community
• WhatsApp Channel
• Instagram
• TikTok

All official links are available on the website.`,
  },
  {
    q: "Is RISEN just another memecoin?",
    a: `No. RISEN combines meme culture with real blockchain utilities.

The project aims to build practical tools while maintaining the viral energy that makes memecoins powerful.`,
  },
  {
    q: "How can I stay updated?",
    a: `Follow the official RISEN channels and the website.

Major announcements such as launch updates, bot releases, and ecosystem developments will always be posted there first.`,
  },
  {
    q: "What does 'WeRise Now' mean?",
    a: `"WeRise Now" represents the belief that strong communities rise together through resilience and collective momentum.

It is both a philosophy and a rallying call for the RISEN ecosystem.`,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative max-w-6xl mx-auto px-6 py-24 text-white"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>

        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Everything you need to understand RISEN ($RSN), its philosophy,
          utilities, and ecosystem direction.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-risen-primary/40 transition"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between"
            >
              <span className="font-semibold text-white">{item.q}</span>

              <span className="text-risen-primary text-xl">
                {open === i ? "−" : "+"}
              </span>
            </button>

            <div
              className={`px-6 pb-6 text-gray-300 leading-relaxed text-sm transition-all duration-300 ${
                open === i ? "block" : "hidden"
              }`}
            >
              {item.a}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Motto */}
      <div className="text-center mt-16 text-sm text-gray-400 tracking-wide">
        <p className="font-semibold text-white">$RSN</p>
        Engineered for Strength. Built to Rise.
      </div>
    </section>
  );
}