"use client";

import { useEffect, useMemo, useState } from "react";
import { RISEN_BUY_LINK } from "@/lib/risenConfig";
import { useLanguage } from "@/context/LanguageContext";

type MarketSnapshotProps = {
  contractAddress: string;
};

type TxnWindow = {
  buys?: number;
  sells?: number;
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
  txns?: {
    m5?: TxnWindow;
    h1?: TxnWindow;
    h6?: TxnWindow;
    h24?: TxnWindow;
  };
};

type StatCardProps = {
  label: string;
  value: string | number;
  subLabel?: string;
  accent?: "default" | "positive" | "negative" | "primary";
  featured?: boolean;
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

function getEmbeddedChartUrl(pair: DexPair | null) {
  if (!pair?.chainId || !pair?.pairAddress) return null;

  return `https://dexscreener.com/${pair.chainId}/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`;
}

function getTxnCount(window?: TxnWindow) {
  return (window?.buys ?? 0) + (window?.sells ?? 0);
}

function StatCard({
  label,
  value,
  subLabel,
  accent = "default",
  featured = false,
}: StatCardProps) {
  const accentClasses =
    accent === "positive"
      ? "text-[#7DF9C6]"
      : accent === "negative"
      ? "text-[#FF7A7A]"
      : accent === "primary"
      ? "text-[#C9F8FF]"
      : "text-white";

  const glowStyle =
    accent === "positive"
      ? { textShadow: "0 0 24px rgba(125,249,198,0.18)" }
      : accent === "negative"
      ? { textShadow: "0 0 24px rgba(255,122,122,0.18)" }
      : accent === "primary"
      ? { textShadow: "0 0 24px rgba(46,219,255,0.18)" }
      : undefined;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border px-5 py-5 transition-all duration-300
        ${
          featured
            ? "border-[#2EDBFF]/25 bg-[linear-gradient(180deg,rgba(46,219,255,0.12),rgba(7,17,31,0.94))] shadow-[0_0_28px_rgba(46,219,255,0.08)]"
            : "border-white/10 bg-[#07111f]/85 shadow-[0_0_18px_rgba(46,219,255,0.04)]"
        }
        hover:border-[#2EDBFF]/30 hover:shadow-[0_0_30px_rgba(46,219,255,0.10)]`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.10),transparent_35%)]" />

      <p className="relative z-10 text-[11px] uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>

      <p
        className={`relative z-10 mt-3 text-2xl sm:text-[1.65rem] font-semibold ${accentClasses}`}
        style={glowStyle}
      >
        {value}
      </p>

      {subLabel && (
        <p className="relative z-10 mt-2 text-xs text-white/40">{subLabel}</p>
      )}
    </div>
  );
}

export default function MarketSnapshot({
  contractAddress,
}: MarketSnapshotProps) {
  const { t } = useLanguage();
  const [pair, setPair] = useState<DexPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartFailed, setChartFailed] = useState(false);

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
          setChartFailed(false);
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
  const chartUrl = getEmbeddedChartUrl(pair);

  const stats = useMemo(
    () => [
      {
        label: t("market.price"),
        value: loading ? t("market.loading") : formatPrice(pair?.priceUsd),
        accent: "default" as const,
        featured: false,
      },
      {
        label: t("market.liquidity"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(pair?.liquidity?.usd, 2),
        accent: "default" as const,
        featured: false,
      },
      {
        label: t("market.volume24h"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(pair?.volume?.h24, 2),
        accent: "default" as const,
        featured: false,
      },
      {
        label: t("market.marketCap"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(marketCapValue, 2),
        subLabel:
          !loading && pair?.marketCap == null && pair?.fdv != null
            ? t("market.usingFdv")
            : undefined,
        accent: "default" as const,
        featured: false,
      },
      {
        label: t("market.change24h"),
        value: loading
          ? t("market.loading")
          : formatPercent(pair?.priceChange?.h24),
        accent: loading
          ? ("default" as const)
          : isPositiveChange
          ? ("positive" as const)
          : ("negative" as const),
        featured: true,
      },
    ],
    [pair, loading, marketCapValue, t, isPositiveChange]
  );

  const activityRows = useMemo(
    () => [
      {
        label: t("market.window5m"),
        buys: pair?.txns?.m5?.buys ?? null,
        sells: pair?.txns?.m5?.sells ?? null,
        total: pair?.txns?.m5 ? getTxnCount(pair.txns.m5) : null,
      },
      {
        label: t("market.window1h"),
        buys: pair?.txns?.h1?.buys ?? null,
        sells: pair?.txns?.h1?.sells ?? null,
        total: pair?.txns?.h1 ? getTxnCount(pair.txns.h1) : null,
      },
      {
        label: t("market.window6h"),
        buys: pair?.txns?.h6?.buys ?? null,
        sells: pair?.txns?.h6?.sells ?? null,
        total: pair?.txns?.h6 ? getTxnCount(pair.txns.h6) : null,
      },
      {
        label: t("market.window24h"),
        buys: pair?.txns?.h24?.buys ?? null,
        sells: pair?.txns?.h24?.sells ?? null,
        total: pair?.txns?.h24 ? getTxnCount(pair.txns.h24) : null,
      },
    ],
    [pair, t]
  );

  const hasActivity = activityRows.some(
    (row) => row.buys !== null || row.sells !== null || row.total !== null
  );

  const activityHighlights = useMemo(
    () => [
      {
        label: t("market.activityVolume24h"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(pair?.volume?.h24, 2),
        accent: "default" as const,
      },
      {
        label: t("market.activityLiquidity"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(pair?.liquidity?.usd, 2),
        accent: "default" as const,
      },
      {
        label: t("market.activityMarketCap"),
        value: loading
          ? t("market.loading")
          : formatCompactCurrency(marketCapValue, 2),
        accent: "primary" as const,
      },
      {
        label: t("market.activityDex"),
        value: pair?.dexId?.toUpperCase() ?? "--",
        accent: "default" as const,
      },
      {
        label: t("market.activityChain"),
        value: pair?.chainId?.toUpperCase() ?? "--",
        accent: "default" as const,
      },
    ],
    [loading, pair, marketCapValue, t]
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
                  {t("market.badge")}
                </div>

                <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                  {t("market.title")}
                </h2>

                <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/65 leading-relaxed">
                  {t("market.subtitle")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={RISEN_BUY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-risen-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(46,219,255,0.32)] hover:scale-[1.02] transition-all duration-300"
                >
                  {t("market.buy")}
                </a>

                {pair?.url && (
                  <a
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-[#2EDBFF]/30 hover:bg-white/10 transition-all duration-300"
                  >
                    {t("market.viewChart")}
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  subLabel={stat.subLabel}
                  accent={stat.accent}
                  featured={stat.featured}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/45">
              <span>
                {t("market.source")}: Dexscreener API
              </span>
              <span>
                {t("market.refresh")}: {t("market.every30s")}
              </span>

              {pair?.dexId && (
                <span className="uppercase tracking-wide">
                  {t("market.dex")}: {pair.dexId}
                </span>
              )}

              {pair?.chainId && (
                <span className="uppercase tracking-wide">
                  {t("market.chain")}: {pair.chainId}
                </span>
              )}

              {pair?.pairAddress && (
                <span className="truncate max-w-full">
                  {t("market.pair")}: {pair.pairAddress}
                </span>
              )}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5 shadow-[0_0_30px_rgba(46,219,255,0.06)]">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#2EDBFF] shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                    {t("market.chartBadge")}
                  </div>

                  <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                    {t("market.chartTitle")}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/60 leading-relaxed">
                    {t("market.chartSubtitle")}
                  </p>
                </div>

                {pair?.url && (
                  <a
                    href={pair.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-[#2EDBFF]/20 bg-[#2EDBFF]/10 px-5 py-3 text-sm font-semibold text-[#C9F8FF] hover:bg-[#2EDBFF]/15 transition-all duration-300"
                  >
                    {t("market.openChart")}
                  </a>
                )}
              </div>

              <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#050D18] min-h-[420px] sm:min-h-[520px] shadow-[0_0_26px_rgba(46,219,255,0.05)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.08),transparent_28%)]" />

                {chartUrl && !chartFailed ? (
                  <iframe
                    src={chartUrl}
                    title="RISEN live chart"
                    className="relative z-10 h-[420px] sm:h-[520px] w-full"
                    loading="lazy"
                    onError={() => setChartFailed(true)}
                  />
                ) : (
                  <div className="relative z-10 flex h-[420px] sm:h-[520px] flex-col items-center justify-center px-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[#2EDBFF]/20 bg-[#2EDBFF]/10 shadow-[0_0_24px_rgba(46,219,255,0.12)]">
                      <span className="w-3 h-3 rounded-full bg-[#2EDBFF] shadow-[0_0_14px_rgba(46,219,255,0.95)]" />
                    </div>

                    <p className="mt-5 text-lg font-semibold text-white">
                      {t("market.chartFallback")}
                    </p>

                    {pair?.url && (
                      <a
                        href={pair.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center rounded-xl bg-risen-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(46,219,255,0.24)] hover:scale-[1.02] transition-all duration-300"
                      >
                        {t("market.openChart")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 sm:p-5 shadow-[0_0_30px_rgba(46,219,255,0.06)]">
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#2EDBFF] shadow-[0_0_12px_rgba(46,219,255,0.95)]" />
                  {t("market.activityBadge")}
                </div>

                <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white">
                  {t("market.activityTitle")}
                </h3>

                <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/60 leading-relaxed">
                  {t("market.activitySubtitle")}
                </p>
              </div>

              {hasActivity ? (
                <>
                  <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#050D18] shadow-[0_0_26px_rgba(46,219,255,0.05)]">
                    <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.03] text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/45">
                      <div className="px-4 py-3">{t("market.window")}</div>
                      <div className="px-4 py-3">{t("market.buys")}</div>
                      <div className="px-4 py-3">{t("market.sells")}</div>
                      <div className="px-4 py-3">{t("market.totalTxns")}</div>
                    </div>

                    {activityRows.map((row, index) => (
                      <div
                        key={row.label}
                        className={`grid grid-cols-4 text-sm sm:text-base ${
                          index !== activityRows.length - 1
                            ? "border-b border-white/5"
                            : ""
                        }`}
                      >
                        <div className="px-4 py-4 text-white font-semibold">
                          {row.label}
                        </div>
                        <div className="px-4 py-4 text-[#7DF9C6] font-medium">
                          {row.buys ?? "--"}
                        </div>
                        <div className="px-4 py-4 text-[#FF7A7A] font-medium">
                          {row.sells ?? "--"}
                        </div>
                        <div className="px-4 py-4 text-white/80 font-medium">
                          {row.total ?? "--"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-white/45 mb-3">
                      {t("market.activityMetaTitle")}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                      {activityHighlights.map((item) => (
                        <StatCard
                          key={item.label}
                          label={item.label}
                          value={item.value}
                          accent={item.accent}
                          featured={item.accent === "primary"}
                        />
                      ))}
                    </div>

                    {pair?.pairAddress && (
                      <div className="group relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#07111f]/85 px-5 py-4 shadow-[0_0_18px_rgba(46,219,255,0.04)] transition-all duration-300 hover:border-[#2EDBFF]/30 hover:shadow-[0_0_30px_rgba(46,219,255,0.10)]">
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(46,219,255,0.10),transparent_35%)]" />

                        <p className="relative z-10 text-[11px] uppercase tracking-[0.18em] text-white/45">
                          {t("market.activityPair")}
                        </p>
                        <p className="relative z-10 mt-2 break-all text-sm sm:text-base font-medium text-white/80">
                          {pair.pairAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-[#050D18] px-6 py-10 text-center shadow-[0_0_26px_rgba(46,219,255,0.05)]">
                  <p className="text-white/75">{t("market.activityUnavailable")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}