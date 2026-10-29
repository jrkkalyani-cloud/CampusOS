import React, { useState } from 'react';
import { Announcement, UserProfile } from '../types/campus';
import { campusStorage } from '../services/campusStorage';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  user: UserProfile;
  onOpenRouteMap: (dest?: string, src?: string) => void;
}

export const AnnouncementsPage: React.FC<AnnouncementsPageProps> = ({
  announcements,
  user,
  onOpenRouteMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Admin Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [retractingAnnouncement, setRetractingAnnouncement] = useState<Announcement | null>(null);
  const [retractionReason, setRetractionReason] = useState('');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<Announcement['category']>('general');
  const [formAffectedClass, setFormAffectedClass] = useState('ICE-A');
  const [formIsUrgent, setFormIsUrgent] = useState(false);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'urgent', label: 'Urgent Alert' },
    { id: 'room_change', label: 'Room Change' },
    { id: 'timetable_change', label: 'Timetable Change' },
    { id: 'library', label: 'Library Session' },
    { id: 'extra_class', label: 'Extra Class' },
    { id: 'academic', label: 'Academic Notice' },
    { id: 'exam', label: 'Exam Updates' },
    { id: 'general', label: 'General' },
  ];

  const filteredAnnouncements = announcements.filter((a) => {
    if (selectedCategory === 'urgent' && !a.isUrgent) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'urgent' && a.category !== selectedCategory)
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchContent = a.content.toLowerCase().includes(q);
      const matchAuthor = a.author.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
    }

    return true;
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    campusStorage.addAnnouncement({
      title: formTitle,
      content: formContent,
      category: formCategory,
      author: user.name,
      authorRole: user.role === 'admin' ? 'Class Representative / Admin' : 'Student Liaison',
      affectedClass: formAffectedClass,
      isUrgent: formIsUrgent,
      isVerified: true,
      status: 'active',
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormContent('');
  };

  const handleConfirmRetract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retractingAnnouncement || !retractionReason.trim()) return;

    campusStorage.retractAnnouncement(
      retractingAnnouncement.id,
      retractionReason,
      `${user.name} (${user.rollNo})`
    );

    setRetractingAnnouncement(null);
    setRetractionReason('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Official Announcements &amp; Dispatches
            </h1>
            <span className="bg-[#528dff]/20 text-[#afc6ff] font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#528dff]/30">
              {announcements.length} Dispatches
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Verified updates from Faculty, Class Representatives, and Department Heads. Eliminates WhatsApp group clutter.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            <span>Broadcast Notice</span>
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-[#528dff] text-[#001a43] font-bold shadow-sm'
                  : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#8c909f] text-sm">
            search
          </span>
          <input
            type="text"
            placeholder="Search dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0a1422] border border-[#424753]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#d9e3f7] placeholder-[#8c909f] focus:outline-none focus:border-[#4F8CFF] w-48"
          />
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-12 text-center text-[#8c909f]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#4F8CFF]">campaign</span>
            <p className="text-sm font-semibold text-white">No announcements found</p>
            <p className="text-xs text-[#8c909f] mt-1">Try selecting another category or clear your search.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRetracted = ann.status === 'retracted';
            const isExpanded = expandedId === ann.id;

            return (
              <div
                key={ann.id}
                className={`bg-[#101D30] rounded-2xl p-5 border transition-all shadow-md ${
                  isRetracted
                    ? 'border-[#424753]/20 opacity-60'
                    : ann.isUrgent
                    ? 'border-[#ff5555]/60 hover:border-[#ff5555]'
                    : 'border-[#424753]/30 hover:border-[#4F8CFF]/50'
                }`}
              >
                <div className="flex flex-col gap-3">
                  {/* Category & Status Bar */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {ann.isUrgent && !isRetracted && (
                        <span className="text-[10px] bg-[#93000a] text-[#ffdad6] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                          <span className="material-symbols-outlined text-xs">priority_high</span>
                          Urgent Notice
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#16202f] text-[#afc6ff] border border-[#424753]/40 font-semibold">
                        {ann.category.replace('_', ' ')}
                      </span>

                      <span className="text-[10px] font-mono bg-[#212a39] text-[#c2c6d6] px-2 py-0.5 rounded">
                        Target: {ann.affectedClass}
                      </span>

                      {ann.isVerified && (
                        <span className="text-[10px] text-[#4edea3] flex items-center gap-0.5 font-mono">
                          <span className="material-symbols-outlined text-xs">verified</span>
                          Verified Desk
                        </span>
                      )}

                      {isRetracted && (
                        <span className="text-[10px] bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/40 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Retracted
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-xs text-[#8c909f]">
                      {new Date(ann.publishedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-lg text-white leading-snug">
                    {ann.title}
                  </h3>

                  {/* Content */}
                  <p
                    className={`text-xs text-[#c2c6d6] leading-relaxed ${
                      !isExpanded ? 'line-clamp-3' : ''
                    }`}
                  >
                    {ann.content}
                  </p>

                  {/* Retraction Notice */}
                  {isRetracted && ann.retractionReason && (
                    <div className="bg-[#93000a]/20 border border-[#ff5555]/30 p-3 rounded-xl text-xs text-[#ffdad6]">
                      <strong>Notice of Retraction:</strong> {ann.retractionReason}
                    </div>
                  )}

                  {/* Author, Actions and Audit */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#424753]/20 flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[#8c909f]">
                      <span className="material-symbols-outlined text-sm text-[#4F8CFF]">account_circle</span>
                      <span>
                        <strong className="text-white">{ann.author}</strong> ({ann.authorRole})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ann.category === 'room_change' && (
                        <button
                          onClick={() => onOpenRouteMap('E-Block 102', 'Room E-301')}
                          className="bg-[#00daf3]/10 hover:bg-[#00daf3]/20 text-[#00daf3] px-2.5 py-1 rounded-lg text-xs font-bold border border-[#00daf3]/30 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">navigation</span>
                          <span>View Route</span>
                        </button>
                      )}

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ann.id)}
                        className="text-xs text-[#4F8CFF] hover:underline font-mono"
                      >
                        {isExpanded ? 'Show Less' : 'Full Dispatch & History'}
                      </button>

                      {user.role === 'admin' && !isRetracted && (
                        <button
                          onClick={() => setRetractingAnnouncement(ann)}
                          className="text-xs text-[#ff5555] hover:bg-[#93000a]/20 border border-[#ff5555]/40 px-2 py-1 rounded-lg font-mono font-semibold"
                        >
                          Retract Notice
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Audit History */}
                  {isExpanded && ann.auditTrail && ann.auditTrail.length > 0 && (
                    <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 space-y-1.5 mt-2">
                      <div className="text-[10px] uppercase font-bold text-[#8c909f] tracking-wider">
                        Audit Trail Record
                      </div>
                      {ann.auditTrail.map((log, i) => (
                        <div
                          key={i}
                          className="font-mono text-[11px] text-[#c2c6d6] flex items-center justify-between border-b border-[#424753]/20 pb-1"
                        >
                          <span>
                            [{new Date(log.timestamp).toLocaleTimeString()}] {log.details}
                          </span>
                          <span className="text-[#8c909f]">By: {log.performedBy}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Notice Modal (Admin Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                Broadcast Official Announcement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Announcement Title <span className="text-[#ff5555]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relocation Notice: Sensors Lab"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Announcement['category'])}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="room_change">Room Change</option>
                    <option value="timetable_change">Timetable Change</option>
                    <option value="library">Library Session</option>
                    <option value="extra_class">Extra Class</option>
                    <option value="academic">Academic Notice</option>
                    <option value="exam">Examination Update</option>
                    <option value="general">General Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Affected Class
                  </label>
                  <input
                    type="text"
                    required
                    value={formAffectedClass}
                    onChange={(e) => setFormAffectedClass(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Notice Content <span className="text-[#ff5555]">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide precise details, room numbers, reporting instructions..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgentCheck"
                  checked={formIsUrgent}
                  onChange={(e) => setFormIsUrgent(e.target.checked)}
                  className="rounded border-[#424753] text-[#4F8CFF] focus:ring-0"
                />
                <label htmlFor="urgentCheck" className="text-xs text-white cursor-pointer">
                  Mark as <strong className="text-[#ff5555]">Urgent Alert</strong> (Displays broadcast top banner)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#424753]/30">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-[#16202f] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Retraction Modal */}
      {retractingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#ff5555]/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white">
              Retract Announcement?
            </h3>
            <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">
              Please state why &quot;{retractingAnnouncement.title}&quot; is being retracted. The
              retraction notice and reason will be archived in the audit logs.
            </p>

            <form onSubmit={handleConfirmRetract} className="space-y-3 mt-4">
              <textarea
                rows={2}
                required
                placeholder="Reason (e.g. Schedule reverted by faculty, cancelled session)..."
                value={retractionReason}
                onChange={(e) => setRetractionReason(e.target.value)}
                className="w-full bg-[#16202f] border border-[#ff5555]/40 rounded-xl px-3 py-2 text-xs text-white"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRetractingAnnouncement(null)}
                  className="bg-[#16202f] text-[#c2c6d6] px-3.5 py-2 rounded-xl text-xs font-semibold"
                >
                  Keep Notice
                </button>
                <button
                  type="submit"
                  className="bg-[#93000a] hover:bg-[#ff5555] text-white px-3.5 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm Retraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
