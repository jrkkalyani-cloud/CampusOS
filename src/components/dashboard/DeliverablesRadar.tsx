import React from 'react';
import { Assignment, StudentTaskProgress } from '../../types/campus';

interface DeliverablesRadarProps {
  assignments: Assignment[];
  studentProgress: Record<string, StudentTaskProgress>;
  onToggleComplete: (id: string) => void;
  onViewAll: () => void;
  onOpenLabSheet: () => void;
}

export const DeliverablesRadar: React.FC<DeliverablesRadarProps> = ({
  assignments,
  studentProgress,
  onToggleComplete,
  onViewAll,
  onOpenLabSheet,
}) => {
  // Take first 3 active assignments
  const activeAssignments = assignments.slice(0, 3);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight">
            Deliverables &amp; Records
          </h2>
          <span className="font-mono text-xs bg-[#212a39] text-[#c2c6d6] px-2 py-0.5 rounded font-bold border border-[#424753]/40">
            [SAMPLE PREVIEW DATA]
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#8c909f] uppercase hidden sm:inline">
          PEER PROFILES &amp; LEADERBOARDS DISABLED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {activeAssignments.map((asgn, idx) => {
          const isDone = studentProgress[asgn.id]?.isCompleted || false;
          const isUrgent = asgn.priority === 'urgent' || idx === 0;

          return (
            <div
              key={asgn.id}
              className={`rounded-2xl p-5 flex flex-col justify-between gap-4 border shadow-xl transition-all ${
                isDone
                  ? 'bg-[#101D30]/70 border-[#00a572]/40 opacity-85'
                  : isUrgent
                  ? 'bg-[#101D30] border-[#93000a]/60 hover:border-[#ff5555]'
                  : 'bg-[#101D30] border-[#424753]/30 hover:border-[#4F8CFF]/50'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isDone
                        ? 'bg-[#00a572]/20 text-[#4edea3]'
                        : isUrgent
                        ? 'bg-[#93000a] text-[#ffdad6]'
                        : 'bg-[#212a39] text-[#d9e3f7]'
                    }`}
                  >
                    {isDone
                      ? 'Completed'
                      : idx === 0
                      ? 'Today · 04:00 PM'
                      : idx === 1
                      ? 'Thu · 11:59 PM'
                      : 'Fri · Nov 01'}
                  </span>
                  <span
                    className={`material-symbols-outlined text-base ${
                      isDone
                        ? 'text-[#4edea3]'
                        : isUrgent
                        ? 'text-[#ff5555]'
                        : 'text-[#8c909f]'
                    }`}
                  >
                    {isDone ? 'check_circle' : isUrgent ? 'priority_high' : 'upload_file'}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-sm sm:text-base text-white leading-snug">
                  {asgn.title}
                </h3>

                <p className="text-xs text-[#c2c6d6] line-clamp-2 leading-relaxed">
                  {asgn.instructions}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#424753]/20">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className={isDone ? 'text-[#4edea3]' : isUrgent ? 'text-[#ff5555] font-bold' : 'text-[#8c909f]'}>
                    {isDone ? 'Submitted & Cleared' : idx === 0 ? 'Due in ~6 hrs' : 'Due Tomorrow'}
                  </span>
                  <span className="text-[#8c909f] truncate max-w-[120px]">
                    {asgn.subjectCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {idx === 0 ? (
                    <button
                      onClick={onOpenLabSheet}
                      className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors border border-[#424753]/40"
                    >
                      Lab Manual
                    </button>
                  ) : (
                    <button
                      onClick={onViewAll}
                      className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors border border-[#424753]/40"
                    >
                      View Specs
                    </button>
                  )}

                  <button
                    onClick={() => onToggleComplete(asgn.id)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      isDone
                        ? 'bg-[#00a572]/20 text-[#4edea3] hover:bg-[#00a572]/40'
                        : isUrgent
                        ? 'bg-[#93000a]/40 hover:bg-[#93000a]/70 text-[#ffdad6] border border-[#ff5555]/30'
                        : 'bg-[#212a39] hover:bg-[#2c3545] text-[#d9e3f7]'
                    }`}
                  >
                    {isDone ? 'Submitted ✓' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
