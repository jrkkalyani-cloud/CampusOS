import React from 'react';

interface MiniNavigatorProps {
  onOpenRouteMap: () => void;
  targetRoom?: string;
}

export const MiniNavigator: React.FC<MiniNavigatorProps> = ({
  onOpenRouteMap,
  targetRoom = 'E-Block 102 (Robotics & Sensors)',
}) => {
  return (
    <div
      onClick={onOpenRouteMap}
      className="bg-[#101D30] hover:bg-[#16202f] border border-[#424753]/30 hover:border-[#4F8CFF]/50 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-2xl">signpost</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white group-hover:text-[#4F8CFF] transition-colors">
              Quick Route to {targetRoom}
            </span>
            <span className="text-[10px] bg-[#00a572]/20 text-[#4edea3] px-2 py-0.2 rounded font-mono font-bold">
              Active Path
            </span>
          </div>
          <span className="text-xs text-[#c2c6d6] leading-relaxed mt-0.5">
            From current Room E-301: Descend central staircase to Ground + 1 Level, turn left past the Mechatronics Lab glass lobby.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
        <span className="font-mono text-xs bg-[#0a1422] text-[#4edea3] px-3 py-1.5 rounded-lg border border-[#00a572]/30 font-bold">
          Est. Walk: 3 Mins
        </span>
        <span className="material-symbols-outlined text-[#4F8CFF] text-base group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </div>
    </div>
  );
};
