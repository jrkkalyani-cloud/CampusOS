import React, { useState } from 'react';
import { Announcement, UserProfile } from '../../types/campus';
import { campusStorage } from '../../services/campusStorage';

interface BulletinsFeedProps {
  announcements: Announcement[];
  user: UserProfile;
  onViewAllAnnouncements: () => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
}

export const BulletinsFeed: React.FC<BulletinsFeedProps> = ({
  announcements,
  user,
  onViewAllAnnouncements,
  onSelectAnnouncement,
}) => {
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Inline Editor Form State
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorCategory, setEditorCategory] = useState<Announcement['category']>('general');
  const [editorContent, setEditorContent] = useState('');
  const [editorUrgent, setEditorUrgent] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: Announcement) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditorTitle(item.title);
    setEditorCategory(item.category);
    setEditorContent(item.content);
    setEditorUrgent(item.isUrgent);
    setShowEditor(true);
  };

  const handleArchive = (e: React.MouseEvent, item: Announcement) => {
    e.stopPropagation();
    if (confirm(`Archive "${item.title}" from the live student stream?`)) {
      campusStorage.retractAnnouncement(
        item.id,
        'Archived by Class Representative',
        `${user.name} (${user.rollNo})`
      );
      showToast('Bulletin archived successfully.');
    }
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim() || !editorContent.trim()) return;

    if (editingId) {
      campusStorage.updateAnnouncement(
        editingId,
        {
          title: editorTitle,
          category: editorCategory,
          content: editorContent,
          isUrgent: editorUrgent,
        },
        `${user.name} (${user.rollNo})`
      );
      showToast('Bulletin updated successfully! Published to CampusOS student dispatches.');
    } else {
      campusStorage.addAnnouncement({
        title: editorTitle,
        category: editorCategory,
        content: editorContent,
        isUrgent: editorUrgent,
        author: user.name,
        authorRole: 'Class Representative / Admin',
        affectedClass: 'ICE-A',
        isVerified: true,
        status: 'active',
      });
      showToast('New class bulletin posted to student stream.');
    }

    setShowEditor(false);
    setEditingId(null);
  };

  // Filter items
  const activeAnnouncements = announcements.filter((a) => a.status !== 'retracted');

  const filtered = activeAnnouncements.filter((item) => {
    if (filterTag === 'high_priority') return item.isUrgent;
    if (filterTag === 'hacks') return item.category === 'academic' || item.title.toLowerCase().includes('hack');
    if (filterTag === 'iv') return item.category === 'general' || item.title.toLowerCase().includes('visit');
    if (filterTag === 'labs') return item.category === 'room_change' || item.category === 'extra_class' || item.title.toLowerCase().includes('lab');
    return true;
  });

  // Sort items
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (sortBy === 'oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    if (sortBy === 'priority') return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
    return 0;
  });

  const displayList = sorted.slice(0, 4);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="bg-[#121c2a] border border-[#4edea3]/40 text-[#4edea3] px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{toastMsg}</span>
          </div>
          <button onClick={() => setToastMsg(null)} className="text-[#8c909f] hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight">
              Verified Bulletins &amp; Dispatches
            </h2>
            <span className="material-symbols-outlined text-[#4edea3] text-base">verified</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#121c2a] border border-[#424753]/30 px-2.5 py-1 rounded-lg">
              <span className="material-symbols-outlined text-xs text-[#8c909f]">sort</span>
              <span className="text-[11px] font-semibold text-[#8c909f]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#00daf3] text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#101D30] text-white">Newest First</option>
                <option value="oldest" className="bg-[#101D30] text-white">Oldest First</option>
                <option value="priority" className="bg-[#101D30] text-white">Highest Priority</option>
              </select>
            </div>
            <span className="font-mono text-[11px] text-[#8c909f] hidden sm:inline">
              CLASS CR &amp; HOD DESK
            </span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilterTag('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterTag === 'all'
                ? 'bg-[#4F8CFF]/20 text-[#afc6ff] border border-[#4F8CFF]/40'
                : 'bg-[#121c2a] text-[#8c909f] hover:text-white hover:bg-[#16202f]'
            }`}
          >
            All Dispatches ({activeAnnouncements.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTag('high_priority')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterTag === 'high_priority'
                ? 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ff5555]/40'
                : 'bg-[#121c2a] text-[#8c909f] hover:text-[#ff5555] hover:bg-[#16202f]'
            }`}
          >
            <span className="material-symbols-outlined text-xs text-[#ff5555]">priority_high</span>
            High Priority
          </button>

          <button
            type="button"
            onClick={() => setFilterTag('hacks')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterTag === 'hacks'
                ? 'bg-[#4F8CFF]/20 text-[#afc6ff] border border-[#4F8CFF]/40'
                : 'bg-[#121c2a] text-[#8c909f] hover:text-[#4F8CFF] hover:bg-[#16202f]'
            }`}
          >
            <span className="material-symbols-outlined text-xs text-[#4F8CFF]">emoji_events</span>
            Opportunities / Hackathons
          </button>

          <button
            type="button"
            onClick={() => setFilterTag('iv')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterTag === 'iv'
                ? 'bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/40'
                : 'bg-[#121c2a] text-[#8c909f] hover:text-[#00daf3] hover:bg-[#16202f]'
            }`}
          >
            <span className="material-symbols-outlined text-xs text-[#00daf3]">factory</span>
            Industrial Visits
          </button>

          <button
            type="button"
            onClick={() => setFilterTag('labs')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterTag === 'labs'
                ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/40'
                : 'bg-[#121c2a] text-[#8c909f] hover:text-[#4edea3] hover:bg-[#16202f]'
            }`}
          >
            <span className="material-symbols-outlined text-xs text-[#4edea3]">inventory_2</span>
            Lab Updates
          </button>
        </div>
      </div>

      {/* Main Bulletins Container */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl divide-y divide-[#424753]/20 shadow-md overflow-hidden">
        {/* Inline Editor Form (Toggled when clicking Edit on any bulletin or New) */}
        {showEditor && (
          <form
            onSubmit={handleSaveEditor}
            className="p-4 sm:p-5 bg-[#121c2a] border-b border-[#4F8CFF]/40 flex flex-col gap-3 transition-all animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-[#424753]/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4F8CFF] text-base">edit_note</span>
                <span className="font-heading font-semibold text-sm text-white">
                  {editingId ? 'Edit Department Bulletin' : 'Post New Class Notice'}
                </span>
                <span className="bg-[#4edea3]/20 text-[#4edea3] px-2 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider">
                  Live In-Place Edit
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowEditor(false);
                  setEditingId(null);
                }}
                className="text-[#8c909f] hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                  Bulletin Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter bulletin headline..."
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                  Category Tag
                </label>
                <select
                  value={editorCategory}
                  onChange={(e) => setEditorCategory(e.target.value as any)}
                  className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                >
                  <option value="academic">Hacks / Hackathon</option>
                  <option value="general">Industrial Visit / IV-Drive</option>
                  <option value="room_change">Lab Store &amp; Components</option>
                  <option value="exam">Exam / Assessment</option>
                  <option value="timetable_change">Timetable Change</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Dispatch Body Content
              </label>
              <textarea
                required
                rows={3}
                placeholder="Enter full dispatch description, dates, venues, or instructions..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              ></textarea>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#424753]/20 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#d9e3f7]">
                <input
                  type="checkbox"
                  checked={editorUrgent}
                  onChange={(e) => setEditorUrgent(e.target.checked)}
                  className="accent-[#4F8CFF] rounded"
                />
                <span>Flag as Urgent / Pinned notice</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingId(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#8c909f] hover:text-white hover:bg-[#16202f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                  <span>Publish Updates</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* List of Bulletin Items */}
        {displayList.map((item, index) => {
          let iconColor = 'text-[#4F8CFF]';
          let iconBg = 'bg-[#4F8CFF]/10';
          let iconName = 'campaign';
          let tagLabel = 'General';
          let tagColor = 'bg-[#528dff]/20 text-[#afc6ff]';

          if (item.category === 'academic' || item.title.toLowerCase().includes('hack')) {
            iconName = 'emoji_events';
            tagLabel = 'Hacks';
            tagColor = 'bg-[#528dff]/20 text-[#afc6ff]';
          } else if (item.category === 'general' || item.title.toLowerCase().includes('visit')) {
            iconName = 'factory';
            tagLabel = 'IV-Drive';
            tagColor = 'bg-[#00daf3]/20 text-[#00daf3]';
          } else if (item.category === 'room_change' || item.title.toLowerCase().includes('hardware') || item.title.toLowerCase().includes('stock')) {
            iconName = 'inventory_2';
            tagLabel = 'Lab Store';
            tagColor = 'bg-[#4edea3]/20 text-[#4edea3]';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelectAnnouncement(item)}
              className="p-4 sm:p-5 flex items-start gap-4 hover:bg-[#16202f]/50 transition-colors group cursor-pointer"
            >
              <div
                className={`h-10 w-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <span className="material-symbols-outlined text-xl">{iconName}</span>
              </div>

              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-semibold text-sm text-white group-hover:text-[#4F8CFF] transition-colors">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.2 rounded font-bold ${tagColor}`}
                    >
                      {tagLabel}
                    </span>
                    <span className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30 px-1.5 py-0.2 rounded text-[10px] font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">forum</span>
                      Synced via ICE-A WhatsApp Group (CR Broadcast)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#8c909f] shrink-0">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>

                    {/* Action buttons on card: Edit & Archive */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(e, item)}
                        title="Edit Bulletin"
                        className="p-1 px-2 rounded-lg bg-[#121c2a] hover:bg-[#16202f] text-[#8c909f] hover:text-[#4F8CFF] transition-colors flex items-center gap-1 text-[11px] font-mono"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleArchive(e, item)}
                        title="Archive or Remove"
                        className="p-1 px-2 rounded-lg bg-[#121c2a] hover:bg-[#93000a]/40 text-[#8c909f] hover:text-[#ff5555] transition-colors flex items-center gap-1 text-[11px] font-mono"
                      >
                        <span className="material-symbols-outlined text-xs">archive</span>
                        <span>Archive</span>
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#c2c6d6] leading-relaxed pt-0.5 line-clamp-2">
                  {item.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
