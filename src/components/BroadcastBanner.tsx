import React, { useState } from 'react';
import { Announcement } from '../types/campus';

interface BroadcastBannerProps {
  urgentAnnouncement?: Announcement;
  onViewRoute: () => void;
}

export const BroadcastBanner: React.FC<BroadcastBannerProps> = ({
  urgentAnnouncement,
  onViewRoute,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const isScheduleNotice = !urgentAnnouncement || urgentAnnouncement.category === 'timetable_change';

  return (
    <div
      className={`w-full border-b px-4 py-2 flex items-center justify-between text-[#d9e3f7] animate-fadeIn ${
        isScheduleNotice
          ? 'bg-[#00daf3]/10 border-[#00daf3]/20'
          : 'bg-[#93000a]/20 border-[#ff5555]/30'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`material-symbols-outlined text-lg shrink-0 ${
            isScheduleNotice ? 'text-[#00daf3]' : 'text-[#ff5555] animate-bounce'
          }`}
        >
          {isScheduleNotice ? 'info' : 'notification_important'}
        </span>
        <div className="flex items-center gap-2 truncate">
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 font-mono ${
              isScheduleNotice
                ? 'bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30'
                : 'bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/40'
            }`}
          >
            {isScheduleNotice ? 'Official Schedule Notice' : 'Urgent Alert'}
          </span>
          <span className="text-xs text-[#d9e3f7] truncate font-medium">
            {urgentAnnouncement
              ? `${urgentAnnouncement.title}: ${urgentAnnouncement.content}`
              : 'PSG College of Technology · BE ICE Semester 1 official timetable active (Strength: 60). All mock entries tagged as [DEMO PREVIEW].'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        {urgentAnnouncement?.category === 'room_change' && (
          <button
            onClick={onViewRoute}
            className="text-[11px] font-bold text-[#00daf3] hover:text-[#4F8CFF] underline flex items-center gap-0.5"
          >
            <span>View Route</span>
            <span className="material-symbols-outlined text-xs">navigation</span>
          </button>
        )}
        <span className="font-mono text-[10px] text-[#8c909f] uppercase hidden md:inline">
          SEMESTER 1 · SEC ICE
        </span>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#8c909f] hover:text-white flex items-center p-1 rounded hover:bg-[#16202f] transition-colors"
          title="Dismiss notice"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
};
