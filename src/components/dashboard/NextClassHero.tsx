import React from 'react';
import { TimetableEntry, Assignment } from '../../types/campus';

interface NextClassHeroProps {
  nextClass: TimetableEntry;
  urgentAssignment?: Assignment;
  isCompleted?: boolean;
  onToggleCompleteAssignment?: (id: string) => void;
  onOpenLabSheet: () => void;
  onOpenBenchGroup: () => void;
  onOpenRouteMap: () => void;
  onInspectDeliverables: () => void;
  timeRemainingText: string;
}

export const NextClassHero: React.FC<NextClassHeroProps> = ({
  nextClass,
  urgentAssignment,
  isCompleted,
  onToggleCompleteAssignment,
  onOpenLabSheet,
  onInspectDeliverables,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* QUESTION 1: WEDNESDAY PERIOD 5-8 LAB BLOCK (7 Cols) */}
      <div className="lg:col-span-7 bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#4F8CFF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col gap-4 relative z-10">
          {/* Live Telemetry Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 px-2.5 py-0.5 rounded-full">
                Wednesday · Period 5-8 Lab Block
              </span>
              <div className="flex items-center gap-1.5 bg-[#050e1c] px-2.5 py-0.5 rounded-full border border-[#424753]/30">
                <span className="h-2 w-2 rounded-full bg-[#00daf3] animate-ping"></span>
                <span className="font-mono text-xs text-[#00daf3] font-bold">
                  UPCOMING 1.40 PM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#8c909f] font-mono text-xs">
              <span className="material-symbols-outlined text-sm text-[#4F8CFF]">schedule</span>
              <span>1.40 – 5.10 PM (P5, P6, P7, P8)</span>
            </div>
          </div>

          {/* Subject Identification */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[#8c909f]">
              <span className="font-mono text-xs font-bold bg-[#16202f] text-[#4F8CFF] px-2 py-0.5 rounded border border-[#4F8CFF]/30">
                {nextClass.subjectCode || '23U111'}
              </span>
              <span className="text-xs uppercase tracking-wider text-[#c2c6d6] font-medium">
                4-Period Laboratory Session
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl lg:text-3xl text-white tracking-tight leading-tight">
              {nextClass.subjectName || 'Circuits and Devices Laboratory'}
            </h2>

            <div className="flex items-center gap-2 text-[#c2c6d6] text-xs pt-0.5">
              <span className="material-symbols-outlined text-base text-[#4F8CFF]">science</span>
              <span>Venue: {nextClass.venue} (As Per Dept Schedule)</span>
            </div>
          </div>

          {/* Practical Block Details */}
          <div className="bg-[#0a1422] border border-[#424753]/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">electrical_services</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    BE ICE Semester 1 Core Practical
                  </span>
                  <span className="text-[10px] bg-[#528dff]/20 text-[#afc6ff] border border-[#528dff]/40 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                    4 Periods
                  </span>
                </div>
                <span className="text-xs text-[#8c909f]">
                  P5 (1.40-2.30), P6 (2.30-3.20), P7 (3.30-4.20), P8 (4.20-5.10)
                </span>
              </div>
            </div>

            <a
              href="#full-matrix"
              className="font-mono text-xs text-[#00daf3] hover:text-white flex items-center gap-1 self-start sm:self-center shrink-0 font-semibold"
            >
              Subject Key <span className="material-symbols-outlined text-sm">arrow_downward</span>
            </a>
          </div>
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-2.5 pt-5 mt-3 border-t border-[#424753]/20 flex-wrap relative z-10">
          <button
            onClick={onOpenLabSheet}
            className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] border border-[#424753]/40 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-[#8c909f]">menu_book</span>
            <span>Lab Manual: Exp 1 to 4</span>
          </button>

          <div className="ml-auto flex items-center gap-1 text-[#8c909f] font-mono text-xs">
            <span className="material-symbols-outlined text-xs text-[#4edea3]">verified</span>
            <span>Strength: 60 Students</span>
          </div>
        </div>
      </div>

      {/* QUESTIONS 2 & 3 QUICK RADAR (5 Cols Split) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* CARD 2: PSG TECH TIMETABLE PROTOCOL */}
        <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-5 flex flex-col gap-2.5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#528dff]/20 text-[#afc6ff] border border-[#528dff]/30 px-2 py-0.5 rounded-full">
              PSG Tech ICE Timetable Protocol
            </span>
            <span className="font-mono text-[10px] text-[#8c909f]">SEM 1 OFFICIAL</span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <span className="material-symbols-outlined text-[#00daf3] text-2xl shrink-0 mt-0.5">
              rule
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-white leading-tight">
                Period &amp; Recess Norms
              </span>
              <p className="text-xs text-[#c2c6d6] leading-relaxed">
                Morning Tea: 10.10–10.30 · Lunch: 12.10–1.40 · Afternoon Tea: 3.20–3.30. Room allocations coordinated via ICE Department HOD Office.
              </p>
            </div>
          </div>

          <div className="bg-[#0a1422] rounded-xl p-2.5 flex items-center justify-between text-xs mt-1 border border-[#424753]/30">
            <span className="font-mono text-[11px] text-[#8c909f]">
              Coimbatore 641 004
            </span>
            <span className="text-[11px] font-bold text-[#4edea3] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span> Verified Structure
            </span>
          </div>
        </div>

        {/* CARD 3: ACADEMIC RECORD DELIVERABLES (DEMO PREVIEW) */}
        <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-5 flex flex-col justify-between shadow-xl flex-1">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#212a39] text-[#c2c6d6] border border-[#424753]/40 px-2 py-0.5 rounded-full">
                Academic Record Deliverables
              </span>
              <span className="font-mono text-xs font-bold text-[#8c909f] bg-[#16202f] px-2 py-0.5 rounded">
                [DEMO PREVIEW]
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-snug">
                    {urgentAssignment ? urgentAssignment.title : '23U111 Circuits & Devices Record'}
                  </span>
                  <span className="text-xs text-[#8c909f]">
                    Sample demo tracker · Not an official institute submission
                  </span>
                </div>
                <span className="font-mono text-xs font-bold bg-[#00a572]/20 text-[#4edea3] px-2 py-0.5 rounded shrink-0 border border-[#00a572]/30">
                  Weekly Lab
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#050e1c] h-2 rounded-full overflow-hidden mt-1 border border-[#424753]/30">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-[#4edea3] w-full' : 'bg-[#4edea3] w-4/5'
                  }`}
                ></div>
              </div>

              <div className="flex items-center justify-between font-mono text-[11px] text-[#8c909f]">
                <span>Physical record verification</span>
                <span className="text-[#4edea3] font-semibold">
                  {isCompleted ? 'Marked Verified' : 'Cycle 1 Practical'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-[#424753]/20 mt-3">
            <span className="font-mono text-xs text-[#8c909f]">
              Peer records &amp; ranks hidden for privacy
            </span>

            <a
              href="#full-matrix"
              className="font-mono text-xs text-[#4F8CFF] hover:text-[#00daf3] flex items-center gap-1 font-semibold ml-auto"
            >
              View Full Timetable <span className="material-symbols-outlined text-sm">east</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
