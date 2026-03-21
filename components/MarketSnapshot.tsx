"use client";

import { useEffect, useMemo, useState } from "react";
import { RISEN_BUY_LINK } from "@/lib/risenConfig";

type MarketSnapshotProps = {
  contractAddress: string;
};

type DexPair = {
  priceUsd?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  marketCap?: number;
  fdv?: number;
  pairAddress?: string;
  url?: string;
  dexId?: string;
  chainId?: string;
};

function formatCompactCurrency(value?: number | string | null, digits = 2) {
  if (value === null || value === undefined || value === "") return "--";

  const num = Number(value);
  if (Number.isNaN(num)) return "--";

  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;

  return `$${num.toLocaleString(undefined, { maximumFractionDigits: digits })}`;
}

function formatPrice(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "--";

  const num = Number(value);
  if (Number.isNaN(num)) return "--";

  if (num < 0.000001) return `$${num.toFixed(8)}`;
  if (num < 0.001) return `$${num.toFixed(6)}`;
  if (num < 1) return `$${num.toFixed(5)}`;

  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
}

function formatPercent(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  const num = Number(value);
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
}

function getBestPair(pairs: DexPair[] = []) {
  if (!pairs.length) return null;

  return [...pairs].sort((a, b) => {
    const aLiquidity = Number(a?.liquidity?.usd ?? 0);
    const bLiquidity = Number(b?.liquidity?.usd ?? 0);
    return bLiquidity - aLiquidity;
  })[0];
}

export default function MarketSnapshot({
  contractAddress,
}: MarketSnapshotProps) {
  const [pair, setPair] = useState<DexPair | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMarketData() {
      if (!contractAddress?.startsWith("0x")) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${contractAddress}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch Dexscreener data");
        }

        const data = await res.json();
        const bestPair = getBestPair(data?.pairs ?? []);

        if (isMounted) {
          setPair(bestPair);
        }
      } catch {
        if (isMounted) {
          setPair(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMarketData();
    const interval = window.setInterval(loadMarketData, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, [contractAddress]);

  const marketCapValue = pair?.marketCap ?? pair?.fdv ?? null;
  const priceChange = Number(pair?.priceChange?.h24 ?? 0);
  const isPositiveChange = priceChange >= 0;

  const stats = useMemo(
    () => [
      {
        label: "Price",
        value: loading ? "Loading..." : formatPrice(pair?.priceUsd),
      },
      {
        label: "Liquidity",
        value: loading
          ? "Loading..."
          : formatCompactCurrency(pair?.liquidity?.usd, 2),
      },
      {
        label: "24H Volume",
        value: loading
          ? "Loading..."
          : formatCompactCurrency(pair?.volume?.h24, 2),
      },
      {
        label: "Market Cap",
        value: loading
          ? "Loading..."
          : formatCompactCurrency(marketCapValue, 2),
        subLabel:
          !loading && pair?.marketCap == null && pair?.fdv != null
            ? "Using FDV"
            : undefined,
      },
      {
        label: "24H Change",
        value: loading ? "Loading..." : formatPercent(pair?.priceChange?.h24),
        highlight: true,
      },
    ],
    [pair, loading, marketCapValue]
  );

  if (!contractAddress?.startsWith("0x")) return null;

  return (
    <section className="relative -mt-2 px-5 sm:px-6 lg:px-8 pb-6 md:pb-8">
      <div className="max-w-[1320px] mx-auto">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] backdrop-blur-xl shadow-[0_0_30px_rgba(46,219,255,0.08)]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.10),transparent_30%)]" />

          <div className="relative px-5 sm:px-6 lg:px-8 py-6 md:py-7">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#2EDBFF]/20 bg-[#2EDBFF]/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#A9F3FF] shadow-[0_0_18px_rgba(46,219,255,0.12)]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#2EDBFF] shadow-[0_0_12px_rgba(46,219,255,0.95)] animate-pulse" />
                  Live Market Snapshot
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                  Market performance at a glance
                </h2>

                <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/65 leading-relaxed">
                  Real-time token metrics presented in a more complete premium
                  layout with pricing, liquidity, volume, market cap, and 24h
                  movement.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={RISEN_BUY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-risen-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(46,219,255,0.32)] hover:scale-[1.02] transition-all duration-300"
                >
                  Buy $RSN
                </a>

                {pair?.url && (
                  <a
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-[#2EDBFF]/30 hover:bg-white/10 transition-all duration-300"
                  >
                    View Live Chart
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {stats.map((stat) => {
                const isChangeCard = stat.label === "24H Change";

                return (
                  <div
                    key={stat.label}
                    className={`rounded-2xl border px-5 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] ${
                      isChangeCard
                        ? "border-[#2EDBFF]/20 bg-[linear-gradient(180deg,rgba(46,219,255,0.12),rgba(7,17,31,0.94))]"
                        : "border-white/10 bg-[#07111f]/85"
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      {stat.label}
                    </p>

                    <p
                      className={`mt-3 text-2xl sm:text-[1.65rem] font-semibold ${
                        isChangeCard && !loading
                          ? isPositiveChange
                            ? "text-[#7DF9C6]"
                            : "text-[#FF7A7A]"
                          : "text-white"
                      }`}
                      style={
                        isChangeCard && !loading
                          ? {
                              textShadow: isPositiveChange
                                ? "0 0 24px rgba(125,249,198,0.18)"
                                : "0 0 24px rgba(255,122,122,0.18)",
                            }
                          : undefined
                      }
                    >
                      {stat.value}
                    </p>

                    {stat.subLabel && (
                      <p className="mt-2 text-xs text-white/40">{stat.subLabel}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/45">
              <span>Source: Dexscreener API</span>
              <span>Refresh: every 30s</span>

              {pair?.dexId && (
                <span className="uppercase tracking-wide">DEX: {pair.dexId}</span>
              )}

              {pair?.chainId && (
                <span className="uppercase tracking-wide">
                  Chain: {pair.chainId}
                </span>
              )}

              {pair?.pairAddress && (
                <span className="truncate max-w-full">
                  Pair: {pair.pairAddress}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}