import React, { useState } from 'react';
import { DriveResource, DriveCategory, UserProfile } from '../../types/campus';
import { campusStorage } from '../../services/campusStorage';

interface DriveVaultSectionProps {
  resources: DriveResource[];
  user: UserProfile;
}

export const DriveVaultSection: React.FC<DriveVaultSectionProps> = ({ resources, user }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<DriveCategory>('Lab Manuals');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSize, setFormSize] = useState('1.2 GB');
  const [formFilesCount, setFormFilesCount] = useState('24 files');
  const [formRootPath, setFormRootPath] = useState('');

  // Toast / Feedback State
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const categories = [
    'All',
    'Lab Manuals',
    'Question Banks',
    'Lecture Notes',
    'Reference Books',
  ];

  const filteredResources = resources.filter((res) => {
    if (selectedCategory === 'All') return true;
    return res.category === selectedCategory;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormTitle('');
    setFormCategory('Lab Manuals');
    setFormUrl('');
    setFormDescription('');
    setFormSize('1.0 GB');
    setFormFilesCount('15 files');
    setFormRootPath('Root: /PSGTech/ICE/Sem1/');
    setShowForm(true);
  };

  const handleOpenEdit = (res: DriveResource) => {
    setEditingId(res.id);
    setFormTitle(res.title);
    setFormCategory(res.category);
    setFormUrl(res.url);
    setFormDescription(res.description);
    setFormSize(res.size || '1.0 GB');
    setFormFilesCount(res.filesCount || '15 files');
    setFormRootPath(res.rootPath || '');
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    if (editingId) {
      campusStorage.updateDriveResource(
        editingId,
        {
          title: formTitle,
          category: formCategory,
          url: formUrl,
          description: formDescription,
          size: formSize,
          filesCount: formFilesCount,
          rootPath: formRootPath,
        },
        `${user.name} (${user.rollNo})`
      );
      showFeedback(`Updated "${formTitle}" in Google Drive Study Vault.`);
    } else {
      campusStorage.addDriveResource(
        {
          title: formTitle,
          category: formCategory,
          url: formUrl,
          description:
            formDescription ||
            'Study materials and syllabus resources for BE ICE Semester 1 students.',
          size: formSize || '1.0 GB',
          filesCount: formFilesCount || '20 files',
          rootPath: formRootPath || `Root: /PSGTech/ICE/Sem1/${formCategory}/`,
          visibility: 'Batch ICE Sem 1 (60 Students)',
          updatedBy: `${user.name} (${user.rollNo})`,
        },
        `${user.name} (${user.rollNo})`
      );
      showFeedback(`Added "${formTitle}" to Google Drive Study Vault.`);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from the student study vault?`)) {
      campusStorage.deleteDriveResource(id, `${user.name} (${user.rollNo})`);
      showFeedback(`Removed "${title}" from study vault.`);
    }
  };

  const handleCopy = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    showFeedback(`Copied Drive URL for "${title}" to clipboard!`);
  };

  const handleRefresh = () => {
    showFeedback('Drive index synchronized with PSG Tech ICE repository.');
  };

  return (
    <section
      id="drive-vault-section"
      className="bg-[#101D30] rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-md border border-[#424753]/30 scroll-mt-20"
    >
      {/* Toast Notification */}
      {feedbackMsg && (
        <div className="bg-[#16202f] border border-[#528dff]/40 text-[#afc6ff] px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-sm">check_circle</span>
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-[#8c909f] hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#424753]/20">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#00daf3]/10 text-[#00daf3] px-2 py-0.5 rounded text-[11px] font-semibold uppercase flex items-center gap-1 border border-[#00daf3]/20">
              <span className="material-symbols-outlined text-xs">cloud_sync</span>
              Google Drive Cloud
            </span>
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
              Google Drive Study Vault &amp; Course Materials
            </h2>
            <span className="font-mono bg-[#16202f] text-[#4edea3] px-2 py-0.5 rounded text-xs border border-[#4edea3]/20">
              Auto-Synced Folder Tree
            </span>
          </div>
          <p className="text-xs text-[#8c909f]">
            Centralized ICE repository for lecture notes, solved semester question banks, lab sheets, and reference textbooks. Manage URLs dynamically without code edits.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors text-xs font-bold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span>+ Add Google Drive Link</span>
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            className="bg-[#121c2a] hover:bg-[#16202f] border border-[#424753]/30 text-[#d9e3f7] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-[#00daf3]">sync</span>
            <span>Refresh Drive Index</span>
          </button>
        </div>
      </div>

      {/* Inline Add / Edit Drive Resource Card (No Code Required) */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-[#121c2a] border border-[#4F8CFF]/50 rounded-xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl transition-all"
        >
          <div className="flex items-center justify-between border-b border-[#424753]/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4F8CFF] text-base">
                {editingId ? 'edit' : 'add_link'}
              </span>
              <span className="font-heading font-semibold text-sm text-white">
                {editingId ? 'Edit Google Drive Resource' : 'Add New Google Drive Resource Link'}
              </span>
              <span className="bg-[#528dff]/20 text-[#afc6ff] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                No code required
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-[#8c909f] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Resource / Folder Title *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. 23U104 EDC Lecture Slides & Circuits"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Category / Subject Tag
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as DriveCategory)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              >
                <option value="Lab Manuals">Lab Manuals (PDF &amp; Simulations)</option>
                <option value="Question Banks">Question Banks &amp; Solved Puzzles</option>
                <option value="Lecture Notes">Lecture Notes &amp; Slides</option>
                <option value="Reference Books">Reference Textbooks (e-Library)</option>
                <option value="Master Drive">Master Batch Drive</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Google Drive Folder / File URL *
              </label>
              <input
                required
                type="url"
                placeholder="https://drive.google.com/drive/folders/..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Description / Coverage Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Complete experimental manuals, MATLAB sample scripts, circuit schematics"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-[#8c909f] uppercase">
                Directory Path / Subtitle
              </label>
              <input
                type="text"
                placeholder="e.g. Exp 1 to 12 · Graph sheets & Viva"
                value={formRootPath}
                onChange={(e) => setFormRootPath(e.target.value)}
                className="bg-[#16202f] border border-[#424753]/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-[#424753]/20">
            <span className="font-mono text-[11px] text-[#8c909f] flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-[#4edea3]">lock_clock</span>
              Read-only permission recommended. Peer isolation preserved.
            </span>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
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
                <span className="material-symbols-outlined text-xs">save</span>
                <span>{editingId ? 'Save Changes' : 'Save to Vault'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category Filter Pills & Status */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? resources.length
                : resources.filter((r) => r.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/40 shadow-sm'
                    : 'text-[#8c909f] hover:text-white hover:bg-[#16202f] border border-transparent'
                }`}
              >
                {cat === 'All' ? `All Drives (${count})` : `${cat} (${count})`}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[11px] text-[#8c909f] flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          STATUS: DRIVE API ONLINE
        </span>
      </div>

      {/* Grid of Google Drive Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredResources.map((res) => {
          let badgeColor = 'bg-[#4F8CFF]/20 text-[#afc6ff]';
          let iconColor = 'text-[#4F8CFF]';
          let iconBg = 'bg-[#4F8CFF]/10';
          let iconName = 'folder_shared';

          if (res.category === 'Lab Manuals') {
            badgeColor = 'bg-[#4edea3]/20 text-[#4edea3]';
            iconColor = 'text-[#4edea3]';
            iconBg = 'bg-[#4edea3]/10';
            iconName = 'science';
          } else if (res.category === 'Question Banks') {
            badgeColor = 'bg-[#00daf3]/20 text-[#00daf3]';
            iconColor = 'text-[#00daf3]';
            iconBg = 'bg-[#00daf3]/10';
            iconName = 'quiz';
          } else if (res.category === 'Lecture Notes') {
            badgeColor = 'bg-[#528dff]/20 text-[#afc6ff]';
            iconColor = 'text-[#afc6ff]';
            iconBg = 'bg-[#528dff]/10';
            iconName = 'menu_book';
          }

          return (
            <div
              key={res.id}
              className="bg-[#121c2a] border border-[#424753]/30 hover:border-[#4F8CFF]/40 rounded-xl p-4 flex flex-col justify-between gap-3.5 transition-all shadow-sm group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${badgeColor}`}
                  >
                    {res.category.toUpperCase()}
                  </span>
                  <span className="font-mono bg-[#16202f] text-[#4edea3] px-1.5 py-0.5 rounded text-[10px] font-semibold">
                    {res.size} · {res.filesCount}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <div
                    className={`h-9 w-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <span className={`material-symbols-outlined ${iconColor} text-xl`}>
                      {iconName}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="font-heading font-semibold text-sm text-white leading-tight group-hover:text-[#4F8CFF] transition-colors line-clamp-1">
                      {res.title}
                    </h3>
                    <span className="font-mono text-[11px] text-[#8c909f] mt-0.5 truncate">
                      {res.rootPath || 'PSG Tech ICE Repository'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#8c909f] line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2.5 border-t border-[#424753]/20">
                <div className="flex items-center justify-between gap-1">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1 transition-colors flex-1 justify-center active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                    <span>Open in Drive</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(res.url, res.title)}
                    title="Copy Link"
                    className="p-1.5 rounded-lg bg-[#16202f] hover:bg-[#212a39] text-[#8c909f] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(res)}
                    title="Edit Link URL"
                    className="p-1.5 rounded-lg bg-[#16202f] hover:bg-[#212a39] text-[#8c909f] hover:text-[#4F8CFF] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(res.id, res.title)}
                      title="Delete Link"
                      className="p-1.5 rounded-lg bg-[#16202f] hover:bg-[#93000a]/40 text-[#8c909f] hover:text-[#ff5555] transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
