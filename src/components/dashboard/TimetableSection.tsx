import React from 'react';
import { TimetableEntry } from '../../types/campus';

interface TimetableSectionProps {
  entries: TimetableEntry[];
  selectedDayCycle: number;
  onSelectDayCycle: (cycle: number) => void;
  onOpenWeekMatrix: () => void;
  onOpenLabSheet: () => void;
  onOpenRouteMap: (destination?: string, source?: string) => void;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({
  entries,
  selectedDayCycle,
  onSelectDayCycle,
  onOpenWeekMatrix,
  onOpenLabSheet,
  onOpenRouteMap,
}) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayName = dayNames[selectedDayCycle - 1] || 'Wednesday';

  // Filter entries for this day cycle
  const dayEntries = entries.filter((e) => e.dayCycle === selectedDayCycle);

  return (
    <div className="flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight">
            Today&apos;s Operating Timeline
          </h2>
          <span className="font-mono text-xs bg-[#16202f] px-2.5 py-1 rounded-lg text-[#8c909f] border border-[#424753]/30">
            {dayName} · Cycle {selectedDayCycle}
          </span>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-[#101D30] p-1 rounded-xl border border-[#424753]/30">
          {[1, 2, 3, 4, 5].map((cycle) => (
            <button
              key={cycle}
              onClick={() => onSelectDayCycle(cycle)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedDayCycle === cycle
                  ? 'bg-[#528dff] text-[#001a43] font-bold shadow-sm'
                  : 'text-[#8c909f] hover:text-[#d9e3f7] hover:bg-[#16202f]'
              }`}
            >
              Day {cycle}
            </button>
          ))}
          <div className="h-4 w-px bg-[#424753]/40 mx-1"></div>
          <a
            href="#full-matrix"
            className="px-3 py-1 rounded-lg text-xs font-semibold text-[#00daf3] hover:bg-[#16202f] transition-colors flex items-center gap-1"
          >
            <span>Week Matrix</span>
            <span className="material-symbols-outlined text-xs">calendar_view_week</span>
          </a>
        </div>
      </div>

      {/* Timeline List Stack */}
      <div className="flex flex-col gap-2.5">
        {dayEntries.map((slot) => {
          // Determine slot status styling
          if (slot.type === 'break' || slot.type === 'lunch') {
            return (
              <div
                key={slot.id}
                className="bg-[#050e1c]/60 border border-[#424753]/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-[#8c909f]"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[#8c909f] min-w-[100px]">
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#4F8CFF]">
                      {slot.type === 'lunch' ? 'restaurant' : 'local_cafe'}
                    </span>
                    <span className="text-xs font-medium text-[#c2c6d6]">{slot.subjectName}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#8c909f] uppercase hidden sm:inline">
                  {slot.facultyDept}
                </span>
              </div>
            );
          }

          const isPeriod1 = slot.periodNumber === 1 && selectedDayCycle === 3;
          const isLiveNow = slot.periodNumber === 2 && selectedDayCycle === 3;
          const isPeriod3 = slot.periodNumber === 3 && selectedDayCycle === 3;
          const isPeriod4 = slot.periodNumber === 4 && selectedDayCycle === 3;
          const isLabBlock = (slot.periodNumber === 5 || slot.id === 'tt_wed_5_8') && selectedDayCycle === 3;

          return (
            <div
              key={slot.id}
              className={`rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 border relative ${
                isLiveNow
                  ? 'bg-[#101D30] border-[#00a572]/60 shadow-xl'
                  : isPeriod1
                  ? 'bg-[#101D30]/60 border-[#424753]/20 opacity-75 hover:opacity-100'
                  : 'bg-[#101D30] border-[#424753]/30 shadow-md hover:border-[#4F8CFF]/50'
              }`}
            >
              {/* Highlight bar for live in-progress session */}
              {isLiveNow && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4edea3] rounded-l-2xl"></div>
              )}

              <div className="flex items-start sm:items-center gap-3 sm:gap-4 pl-1">
                {/* Time & Period Column */}
                <div className="flex flex-col min-w-[105px]">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isLiveNow
                        ? 'text-[#4edea3]'
                        : isLabBlock
                        ? 'text-[#00daf3]'
                        : 'text-[#d9e3f7]'
                    }`}
                  >
                    {slot.startTime} – {slot.endTime}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono ${
                      isLiveNow ? 'text-[#4edea3] font-bold flex items-center gap-1' : 'text-[#8c909f]'
                    }`}
                  >
                    {isLiveNow ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
                        Live Period
                      </>
                    ) : (
                      slot.periodLabel
                    )}
                  </span>
                </div>

                <div className="h-8 w-px bg-[#424753]/30 hidden md:block"></div>

                {/* Subject & Venue Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        isLiveNow
                          ? 'bg-[#00a572]/20 text-[#4edea3]'
                          : isLabBlock
                          ? 'bg-[#00daf3]/20 text-[#00daf3]'
                          : 'bg-[#16202f] text-[#4F8CFF]'
                      }`}
                    >
                      {slot.subjectCode}
                    </span>
                    <span className="text-sm font-bold text-white">{slot.subjectName}</span>

                    {/* Relocation / Overwrite Badges */}
                    {slot.isRelocated && (
                      <span className="text-[10px] bg-[#93000a] text-[#ffdad6] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                        <span className="material-symbols-outlined text-[11px]">swap_horiz</span>
                        Relocated to {slot.venue}
                      </span>
                    )}

                    {slot.type === 'lab' && (
                      <span className="text-[10px] bg-[#00daf3]/20 text-[#00daf3] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Practical Block
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#8c909f] mt-1 flex-wrap">
                    <span className="text-[#c2c6d6] font-medium">
                      Venue: <strong className={slot.isRelocated ? 'text-[#00daf3]' : 'text-white'}>{slot.venue}</strong>
                      {slot.originalVenue && (
                        <span className="text-[#8c909f] line-through ml-1.5">
                          (Was: {slot.originalVenue})
                        </span>
                      )}
                    </span>
                    <span>·</span>
                    <span>{slot.faculty}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Tray & Status Pill */}
              <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                {isPeriod1 && (
                  <span className="text-[10px] font-bold bg-[#16202f] text-[#8c909f] px-2.5 py-1 rounded-lg border border-[#424753]/30">
                    Completed
                  </span>
                )}

                {isLiveNow && (
                  <span className="font-mono text-xs bg-[#050e1c] text-[#4edea3] px-2.5 py-1 rounded-lg border border-[#00a572]/40 font-bold">
                    Live Period
                  </span>
                )}

                {isPeriod3 && (
                  <span className="text-[10px] font-bold bg-[#16202f] text-[#8c909f] px-2.5 py-1 rounded-lg border border-[#424753]/30">
                    Next Session
                  </span>
                )}

                {isPeriod4 && (
                  <span className="text-[10px] font-bold bg-[#16202f] text-[#8c909f] px-2.5 py-1 rounded-lg border border-[#424753]/30">
                    Scheduled
                  </span>
                )}

                {slot.labSheetId && (
                  <button
                    onClick={onOpenLabSheet}
                    className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] hover:text-white px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border border-[#424753]/40 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs text-[#4F8CFF]">description</span>
                    <span>Lab Manual</span>
                  </button>
                )}

                {slot.isRelocated && (
                  <button
                    onClick={() => onOpenRouteMap(slot.venue, 'Room E-301')}
                    className="bg-[#00daf3]/10 hover:bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30 px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">navigation</span>
                    <span>Route</span>
                  </button>
                )}

                {isLabBlock && (
                  <span className="text-[10px] font-bold bg-[#00daf3]/20 text-[#00daf3] px-2.5 py-1 rounded-lg border border-[#00daf3]/40 font-mono tracking-wider">
                    AFTERNOON LAB
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
