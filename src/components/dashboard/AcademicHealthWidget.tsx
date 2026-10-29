import React from 'react';
import { UserProfile } from '../../types/campus';

interface AcademicHealthWidgetProps {
  user: UserProfile;
  onViewDetails: () => void;
}

export const AcademicHealthWidget: React.FC<AcademicHealthWidgetProps> = ({
  user,
  onViewDetails,
}) => {
  const { overall, bunkBufferPeriods } = user.attendance;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight">
          Academic Health
        </h2>
        <button
          onClick={onViewDetails}
          className="text-xs font-mono text-[#4F8CFF] hover:text-[#00daf3] transition-colors"
        >
          Detailed Analysis
        </button>
      </div>

      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 px-2 py-0.5 rounded-full">
              Private Telemetry (Only You)
            </span>
            <span className="font-mono text-xs text-[#8c909f]">
              [SAMPLE ESTIMATE]
            </span>
          </div>

          {/* Visual Donut Stat Block */}
          <div className="flex items-center gap-4 pt-1">
            <div className="relative h-20 w-20 shrink-0 flex items-center justify-center">
              <svg className="h-20 w-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#050e1c]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#4edea3] transition-all duration-1000 ease-out"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${overall}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-heading text-lg font-bold text-white">
                {Math.round(overall)}%
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">
                Overall: {overall}%
              </span>
              <span className="text-xs text-[#4edea3] font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm">shield</span>
                Bunk Buffer: {bunkBufferPeriods} Periods
              </span>
              <span className="font-mono text-[11px] text-[#ffdad6] pt-1">
                Next Risk: EE24103 at 79%
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Card */}
        <div className="bg-[#0a1422] rounded-xl p-3 flex items-center justify-between border border-[#424753]/30">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#8c909f] uppercase">
              Continuous Assessment
            </span>
            <span className="text-xs font-bold text-[#d9e3f7]">
              IAT-1 Starts in 12 Days
            </span>
          </div>
          <span className="material-symbols-outlined text-[#4F8CFF] text-2xl">
            event_upcoming
          </span>
        </div>
      </div>
    </div>
  );
};
