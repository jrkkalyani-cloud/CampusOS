import React, { useState } from 'react';
import { TimetableEntry } from '../types/campus';

interface CalendarExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: TimetableEntry[];
}

export const CalendarExportModal: React.FC<CalendarExportModalProps> = ({
  isOpen,
  onClose,
  timetable,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadICS = () => {
    // Generate .ics standard string
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusOS//PSG Tech ICE Timetable//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:CampusOS PSG Tech ICE-A',
      'X-WR-TIMEZONE:Asia/Kolkata',
    ];

    timetable
      .filter((t) => t.type !== 'break' && t.type !== 'lunch')
      .forEach((t) => {
        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`UID:${t.id}@campusos.psgtech.ac.in`);
        icsContent.push(`SUMMARY:${t.subjectCode} - ${t.subjectName}`);
        icsContent.push(
          `DESCRIPTION:Faculty: ${t.faculty} (${t.facultyDept})\\nSession: ${t.type}\\nRoom: ${t.venue}`
        );
        icsContent.push(`LOCATION:${t.venue}`);
        icsContent.push('STATUS:CONFIRMED');
        icsContent.push('END:VEVENT');
      });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'CampusOS_PSG_Tech_Timetable.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">event_upcoming</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Sync Timetable to Calendar
              </h3>
              <p className="text-xs text-[#8c909f]">Google Calendar, Outlook &amp; Apple iCal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-[#c2c6d6]">
          <p>
            Export your complete PSG College of Technology weekly class timetable directly into your mobile or desktop calendar app. Includes classroom numbers, relocated laboratories, and faculty contacts.
          </p>

          <div className="bg-[#16202f] border border-[#424753]/30 p-3 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>Included in export:</span>
              <span className="text-[#4edea3] font-mono">{timetable.length} Sessions</span>
            </div>
            <ul className="space-y-1 text-[#8c909f] list-disc list-inside">
              <li>Full Monday - Friday ICE-A Cycle</li>
              <li>Instant classroom venue coordinates (E-Block, F-Block)</li>
              <li>Auto-reminders 15 minutes before lab sessions</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-[#424753]/40 bg-[#0a1422] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-[#16202f] hover:bg-[#212a39] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadICS}
            className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {downloaded ? 'check' : 'calendar_month'}
            </span>
            <span>{downloaded ? 'Calendar Exported!' : 'Download .ICS Calendar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
