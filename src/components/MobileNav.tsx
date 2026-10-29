import React from 'react';
import { PageId } from './Sidebar';

interface MobileNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  urgentCount: number;
  dueCount: number;
  isAdmin: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  urgentCount,
  dueCount,
  isAdmin,
}) => {
  const items = [
    { id: 'dashboard' as PageId, label: 'Home', icon: 'grid_view' },
    { id: 'timetable' as PageId, label: 'Timetable', icon: 'schedule' },
    {
      id: 'assignments' as PageId,
      label: 'Tasks',
      icon: 'fact_check',
      badge: dueCount > 0 ? dueCount : null,
    },
    {
      id: 'announcements' as PageId,
      label: 'Notices',
      icon: 'campaign',
      hasDot: urgentCount > 0,
    },
    {
      id: 'opportunities' as PageId,
      label: 'Hacks',
      icon: 'rocket_launch',
    },
    {
      id: isAdmin ? ('admin' as PageId) : ('profile' as PageId),
      label: isAdmin ? 'Admin' : 'Profile',
      icon: isAdmin ? 'admin_panel_settings' : 'account_circle',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#050e1c]/95 backdrop-blur-lg border-t border-[#424753]/30 z-40 md:hidden flex items-center justify-around px-2 select-none safe-bottom">
      {items.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-[#4F8CFF]' : 'text-[#8c909f] hover:text-[#d9e3f7]'
            }`}
          >
            <div className="relative">
              <span className={`material-symbols-outlined text-xl ${isActive ? 'font-bold' : ''}`}>
                {item.icon}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-2 bg-[#93000a] text-[#ffdad6] text-[9px] font-bold px-1 rounded-full leading-none py-0.5">
                  {item.badge}
                </span>
              )}
              {item.hasDot && (
                <span className="absolute -top-0.5 -right-1 h-2 w-2 rounded-full bg-[#ff5555] animate-ping"></span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
