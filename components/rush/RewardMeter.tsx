type Props = {
  availablePoints: number;
};

export default function RewardMeter({ availablePoints }: Props) {
  const threshold = 100000;
  const ratio = Math.min(availablePoints / threshold, 1);
  // 1,000 points = 1 RSN
  const estimatedRSN = availablePoints / 1000;

  return (
    <div className="rounded-[40px] border border-white/5 bg-[#030913] p-8 shadow-inner relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="text-5xl">💎</span>
      </div>

      <div className="relative z-10">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">Launch Conversion Meter</div>

          <div className="flex items-end gap-3 mb-2">
            <div className="text-4xl font-black text-white italic tracking-tighter">
                {availablePoints.toLocaleString()}
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase mb-2 tracking-widest">Points</div>
          </div>

          <div className="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            Estimated value: {estimatedRSN.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} RSN
          </div>

          <div className="mt-8 h-4 overflow-hidden rounded-full bg-white/5 border border-white/5 p-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(251,191,36,0.4)]"
              style={{ width: `${ratio * 100}%` }}
            />
          </div>

          <div className="mt-4 flex justify-between items-center px-1">
            <div className="text-[8px] font-black text-white/10 uppercase tracking-widest italic">SYNC_START</div>
            <div className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                {Math.floor(ratio * 100)}% to Threshold
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-[9px] font-bold text-white/20 leading-relaxed uppercase italic">
            Minimum claim threshold: 100,000 points. Points converted 1:1000 during network mainnet deployment.
          </div>
      </div>
    </div>
  );
}
