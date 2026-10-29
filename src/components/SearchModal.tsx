import React, { useState, useEffect, useMemo } from 'react';
import { TimetableEntry, Assignment, Announcement, Opportunity } from '../types/campus';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: TimetableEntry[];
  assignments: Assignment[];
  announcements: Announcement[];
  opportunities: Opportunity[];
  onSelectResult: (category: string, id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  timetable,
  assignments,
  announcements,
  opportunities,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchedTimetable = timetable
      .filter(
        (t) =>
          t.subjectCode.toLowerCase().includes(q) ||
          t.subjectName.toLowerCase().includes(q) ||
          t.faculty.toLowerCase().includes(q) ||
          t.venue.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((t) => ({
        type: 'timetable',
        id: t.id,
        title: `${t.subjectCode} — ${t.subjectName}`,
        subtitle: `${t.day} ${t.startTime} · ${t.venue} · ${t.faculty}`,
        icon: 'schedule',
        badge: t.isRelocated ? 'Relocated' : t.type,
      }));

    const matchedAssignments = assignments
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectCode.toLowerCase().includes(q) ||
          a.instructions.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((a) => ({
        type: 'assignment',
        id: a.id,
        title: a.title,
        subtitle: `${a.subjectCode} · Due: ${new Date(a.dueDate).toLocaleDateString()}`,
        icon: 'fact_check',
        badge: a.priority,
      }));

    const matchedAnnouncements = announcements
      .filter(
        (an) =>
          an.title.toLowerCase().includes(q) ||
          an.content.toLowerCase().includes(q) ||
          an.author.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((an) => ({
        type: 'announcement',
        id: an.id,
        title: an.title,
        subtitle: `By ${an.author} · ${an.category}`,
        icon: 'campaign',
        badge: an.isUrgent ? 'Urgent' : 'Notice',
      }));

    const matchedOpportunities = opportunities
      .filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organizer.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((o) => ({
        type: 'opportunity',
        id: o.id,
        title: o.title,
        subtitle: `${o.organizer} · Deadline: ${o.deadline}`,
        icon: 'rocket_launch',
        badge: o.category,
      }));

    return [
      ...matchedTimetable,
      ...matchedAssignments,
      ...matchedAnnouncements,
      ...matchedOpportunities,
    ];
  }, [query, timetable, assignments, announcements, opportunities]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 backdrop-blur-sm p-4 pt-20">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#424753]/40 flex items-center gap-3 bg-[#0a1422]">
          <span className="material-symbols-outlined text-[#4F8CFF] text-xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects, lab venues (e.g. E-102), assignments, faculty..."
            className="w-full bg-transparent border-none text-[#d9e3f7] placeholder-[#8c909f] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8c909f] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
          <kbd className="font-mono text-[10px] bg-[#212a39] px-2 py-1 rounded text-[#8c909f]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-[#8c909f]">
              <span className="material-symbols-outlined text-3xl mb-2 opacity-50">travel_explore</span>
              <p className="text-xs">Type a keyword like <span className="text-[#4F8CFF] font-mono font-bold">Sensors</span>, <span className="text-[#4F8CFF] font-mono font-bold">E-102</span>, or <span className="text-[#4F8CFF] font-mono font-bold">Ramanathan</span></p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-[#8c909f]">
              <p className="text-xs">No results found for &quot;{query}&quot;</p>
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={`${item.type}_${item.id}_${idx}`}
                onClick={() => {
                  onSelectResult(item.type, item.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-[#16202f] border border-transparent hover:border-[#424753]/40 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#121c2a] flex items-center justify-center shrink-0 text-[#4F8CFF] group-hover:bg-[#528dff]/20">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-[#d9e3f7] truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-[#8c909f] truncate">{item.subtitle}</div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#212a39] text-[#afc6ff] shrink-0 ml-2">
                  {item.badge}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
