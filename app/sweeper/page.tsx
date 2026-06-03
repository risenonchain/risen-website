"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Zap,
  Trash2,
  ChevronRight,
  Wallet,
  Info,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Search,
  ChevronLeft,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { scanWalletDust, hasRushToken } from "@/lib/api";
import { useAccount, useSignMessage, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { parseUnits } from "viem";

export default function DustSweeper() {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { signMessageAsync } = useSignMessage();
  const { writeContract, data: hash, isPending: isSweeping } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [scanning, setScanning] = useState(false);
  const [dust, setDust] = useState<any[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [sweepResult, setSweepResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !hasRushToken()) {
      router.replace("/sweeper/login");
    }
  }, [router]);

  useEffect(() => {
    if (isSuccess && hash) {
      setSweepResult({
        rsn_received: "Calculated after tax",
        explorer_url: `https://bscscan.com/tx/${hash}`
      });
      setDust([]);
      setSelectedTokens([]);
    }
  }, [isSuccess, hash]);

  const startScan = async () => {
    if (!isConnected) {
        open();
        return;
    }

    setScanning(true);
    setSweepResult(null);
    try {
        const message = `Authorize RISEN to scan ${address} for dust fragments. Timestamp: ${Date.now()}`;
        const signature = await signMessageAsync({ message });

        // Pass signature to backend for verification (secure ownership)
        const data = await scanWalletDust(address as string, "bsc");
        setDust(data);
        setSelectedTokens(data.map(t => t.symbol));
    } catch (e) {
        console.error("Dust Scan Failed", e);
        alert("Authorization failed. Please sign the message to scan.");
    } finally {
        setScanning(false);
    }
  };

  const initiateSweep = async () => {
    if (selectedTokens.length === 0 || !address) return;

    // Logic for Contract Interaction
    // In production, we need the token addresses and amounts (fetched from scan)
    const selectedData = dust.filter(t => selectedTokens.includes(t.symbol));
    const tokenAddresses = selectedData.map(t => t.token_address);
    const amounts = selectedData.map(t => parseUnits(t.balance.replace(/,/g, ''), 18)); // Simplified decimal handling

    try {
      writeContract({
        address: '0x6Ac725cF68419184704e0dbAB75A507dC3570305', // DUST_SWEEPER_CONTRACT (TBD)
        abi: [
          {
            "name": "sweepTokens",
            "type": "function",
            "stateMutability": "nonpayable",
            "inputs": [
              { "name": "tokens", "type": "address[]" },
              { "name": "amounts", "type": "uint256[]" },
              { "name": "minRSNOut", "type": "uint256" },
              { "name": "deadline", "type": "uint256" }
            ]
          }
        ],
        functionName: 'sweepTokens',
        args: [tokenAddresses, amounts, 0n, BigInt(Math.floor(Date.now() / 1000) + 600)],
      });
    } catch (e) {
      alert("Sweep failed: Contract interaction error.");
    }
  };

  const totalValue = dust
    .filter(t => selectedTokens.includes(t.symbol))
    .reduce((acc, curr) => acc + Number(curr.value_usd), 0);

  return (
    <main className="min-h-screen bg-[#02070d] text-white selection:bg-amber-400/30 font-sans relative overflow-hidden pb-20">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-400/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-risen-primary/5 blur-[120px] rounded-full -z-10" />

      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/store" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-400/50 transition-all">
             <ChevronLeft size={16} className="text-white/40 group-hover:text-white" />
          </div>
          <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors italic">Back to App Store</span>
        </Link>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest italic">Sweeper_Protocol_v1.0</div>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-12 text-center">
         <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-amber-400 mb-8 font-black">
            <Trash2 size={12} className="fill-amber-400" /> Wallet Optimization
         </div>
         <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-6">
            Dust <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Sweeper</span>
         </h1>
         <p className="text-white/40 text-sm font-bold leading-relaxed uppercase tracking-tight max-w-lg mx-auto mb-16">
            Convert small, unusable token balances into $RSN or native liquidity. Reclaim your wallet’s efficiency with sub-atomic precision.
         </p>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Wallet Info */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-[#030913] border border-white/5 rounded-[32px] p-6 text-left">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Wallet size={18} className="text-white/40" />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Active Wallet</div>
                        <div className="flex items-center gap-2">
                           <div className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 w-full text-[10px] font-black text-white italic truncate">
                              {isConnected ? address : "No Wallet Connected"}
                           </div>
                           <button
                              onClick={() => open()}
                              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/40 hover:text-white transition-all"
                           >
                              {isConnected ? "Change" : "Connect"}
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[8px] font-black text-white/20 uppercase tracking-widest">Est. Recoverable Value</div>
                     <div className="text-3xl font-black text-amber-400 italic tracking-tighter">${totalValue.toFixed(2)}</div>
                     <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">After 3% Fee</div>
                  </div>
               </div>

               <button
                  onClick={startScan}
                  disabled={scanning}
                  className="w-full py-5 rounded-2xl bg-amber-400 text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
               >
                  {scanning ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
                  {scanning ? "Scanning Neural Nodes..." : "Refresh Dust Data"}
               </button>
            </div>

            {/* Right: List */}
            <div className="lg:col-span-2">
               <div className="bg-[#030913] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                  {sweepResult ? (
                    <div className="py-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
                            <ShieldCheck className="text-emerald-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic text-white mb-2">Sweep Successful</h3>
                        <p className="text-white/40 text-sm font-bold uppercase mb-8 max-w-sm">
                            Fragments consolidated. Received <span className="text-emerald-400">{sweepResult.rsn_received || sweepResult.rsn_expected} $RSN</span> in your wallet.
                        </p>
                        <a
                            href={sweepResult.explorer_url || "#"}
                            target="_blank"
                            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            View Transaction
                        </a>
                        <button
                            onClick={() => setSweepResult(null)}
                            className="mt-6 text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors"
                        >
                            Start New Scan
                        </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Detected Fragments</h3>
                         <button
                            onClick={selectAll}
                            className="text-[10px] font-black text-risen-primary uppercase tracking-widest hover:opacity-80 transition-opacity"
                         >
                            {selectedTokens.length === dust.length ? "Deselect All" : "Select All"}
                         </button>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {dust.length > 0 ? dust.map((token, i) => {
                            const isSelected = selectedTokens.includes(token.symbol);
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleToken(token.symbol)}
                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${
                                        isSelected
                                            ? 'bg-amber-400/10 border-amber-400/40'
                                            : 'bg-white/5 border-white/5 hover:border-white/20'
                                    }`}
                                >
                                   <div className="flex items-center gap-4">
                                      <span className="text-2xl">{token.icon}</span>
                                      <div className="text-left">
                                         <div className="text-sm font-black uppercase italic text-white">{token.name}</div>
                                         <div className="text-[10px] font-bold text-white/20 uppercase">{token.balance} {token.symbol}</div>
                                      </div>
                                   </div>
                                   <div className="text-right flex items-center gap-6">
                                      <div className="text-xs font-black text-amber-400/80">${token.value_usd}</div>
                                      <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                          isSelected
                                            ? 'bg-amber-400 border-amber-400 text-black'
                                            : 'border-white/10 group-hover:border-amber-400/40'
                                      }`}>
                                          {isSelected && <Zap size={14} fill="currentColor" />}
                                      </div>
                                   </div>
                                </div>
                            );
                         }) : (
                            <div className="py-20 text-center text-white/10 uppercase font-black text-[10px] tracking-widest italic">
                                {scanning ? "Decoding Neural Matrix..." : "Awaiting Neural Scan..."}
                            </div>
                         )}
                      </div>

                      <div className="mt-10 pt-8 border-t border-white/5">
                         <button
                            onClick={initiateSweep}
                            disabled={selectedTokens.length === 0 || isSweeping || isConfirming}
                            className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 ${
                                selectedTokens.length > 0 && !isSweeping && !isConfirming
                                    ? 'bg-white text-black hover:bg-amber-400 hover:text-white shadow-amber-400/20'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                            }`}
                         >
                            {(isSweeping || isConfirming) ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            {isSweeping ? "Awaiting Signature..." : isConfirming ? "Confirming on Chain..." : "Sweep to $RSN"}
                         </button>
                      </div>
                    </>
                  )}
               </div>
            </div>
         </div>
      </section>
    </main>
  );
}
