import React, { useState } from 'react';
import { Opportunity, UserProfile } from '../types/campus';
import { campusStorage } from '../services/campusStorage';

interface OpportunitiesPageProps {
  opportunities: Opportunity[];
  user: UserProfile;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ opportunities, user }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Opportunity['category']>('hackathon');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formEventDate, setFormEventDate] = useState('');
  const [formEligibility, setFormEligibility] = useState('');
  const [formPerks, setFormPerks] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRegistrationUrl, setFormRegistrationUrl] = useState('');
  const [formTags, setFormTags] = useState('');

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'internship', label: 'Internships' },
    { id: 'research', label: 'Research' },
    { id: 'competition', label: 'Competitions' },
  ];

  const filtered = opportunities.filter((opp) => {
    if (categoryFilter !== 'all' && opp.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchOrg = opp.organizer.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      if (!matchTitle && !matchOrg && !matchDesc) return false;
    }

    return true;
  });

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formOrganizer.trim()) return;

    campusStorage.addOpportunity(
      {
        title: formTitle,
        category: formCategory,
        organizer: formOrganizer,
        deadline: formDeadline,
        eventDate: formEventDate,
        eligibility: formEligibility,
        perks: formPerks,
        description: formDescription,
        registrationUrl: formRegistrationUrl || 'https://psgtech.edu',
        isFeatured: false,
        tags: formTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      },
      `${user.name} (${user.rollNo})`
    );

    setShowAddModal(false);
    setFormTitle('');
    setFormOrganizer('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Opportunities &amp; Hackathons
            </h1>
            <span className="bg-[#00daf3]/20 text-[#00daf3] font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#00daf3]/30">
              {opportunities.length} Active Listings
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Curated student hackathons, ISA student section workshops, R&amp;D internships, and research grants for ICE &amp; circuit branches.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Post Opportunity</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                categoryFilter === c.id
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
            placeholder="Search hackathons, internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0a1422] border border-[#424753]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#d9e3f7] placeholder-[#8c909f] focus:outline-none focus:border-[#4F8CFF] w-52"
          />
        </div>
      </div>

      {/* Opportunities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-[#101D30] border border-[#424753]/30 hover:border-[#4F8CFF]/50 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold bg-[#528dff]/20 text-[#afc6ff] border border-[#528dff]/30">
                  {opp.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-mono text-[#ffdad6] bg-[#93000a]/30 border border-[#ff5555]/30 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-xs">hourglass_top</span>
                  <span>Deadline: {opp.deadline}</span>
                </div>
              </div>

              <h3 className="font-heading font-bold text-lg text-white leading-snug">
                {opp.title}
              </h3>

              <div className="text-xs text-[#8c909f] font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#4F8CFF]">corporate_fare</span>
                <span>{opp.organizer}</span>
              </div>

              <p className="text-xs text-[#c2c6d6] leading-relaxed">
                {opp.description}
              </p>

              <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 space-y-1 text-xs">
                <div className="flex items-center gap-1 text-[#4edea3] font-semibold">
                  <span className="material-symbols-outlined text-sm">stars</span>
                  <span>{opp.perks}</span>
                </div>
                <div className="text-[#8c909f] text-[11px]">
                  <strong>Eligibility:</strong> {opp.eligibility}
                </div>
              </div>

              {opp.tags && opp.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {opp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono bg-[#16202f] text-[#8c909f] px-2 py-0.5 rounded border border-[#424753]/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#424753]/20 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8c909f]">
                Event: {opp.eventDate}
              </span>
              <a
                href={opp.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Register &amp; Details</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Opportunity Modal (Admin Only) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                Post New Campus Opportunity
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Opportunity Title <span className="text-[#ff5555]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Robotics Hackathon 2025"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Opportunity['category'])}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="internship">Internship</option>
                    <option value="research">Research</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISA PSG Tech Section"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    required
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Event Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nov 15-16, 2026"
                    value={formEventDate}
                    onChange={(e) => setFormEventDate(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Perks &amp; Prizes
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000 Cash Pool + IEEE Certificate"
                  value={formPerks}
                  onChange={(e) => setFormPerks(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  placeholder="e.g. All 1st & 2nd Year UG Students"
                  value={formEligibility}
                  onChange={(e) => setFormEligibility(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete event details and guidelines..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Registration URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formRegistrationUrl}
                  onChange={(e) => setFormRegistrationUrl(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Sensors, PLC, Hackathon"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#424753]/30">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-[#16202f] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
