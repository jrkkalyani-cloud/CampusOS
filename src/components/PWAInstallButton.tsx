import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running standalone, display verified status
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 bg-[#121c2a] border border-[#00a572]/40 px-2.5 py-1 rounded-lg text-xs font-mono text-[#4edea3]">
        <span className="material-symbols-outlined text-sm">offline_pin</span>
        <span className="hidden xl:inline">PWA Installed</span>
      </div>
    );
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        title="Install CampusOS on this device"
      >
        <span className="material-symbols-outlined text-base">download_for_offline</span>
        <span>Install CampusOS</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#101D30] border border-[#424753]/60 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4F8CFF]/20 text-[#4F8CFF] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">install_mobile</span>
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Install CampusOS PWA
                  </h3>
                  <span className="font-mono text-[11px] text-[#4edea3]">
                    Native Standalone Experience
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-[#8c909f] hover:text-white p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#c2c6d6] leading-relaxed">
              <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-3">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#4edea3]">android</span>
                  Android Phones (Chrome / Brave / Edge)
                </div>
                <p className="text-[11px] text-[#8c909f]">
                  Tap the three dots (⋮) in the top-right corner of your browser and select{' '}
                  <strong className="text-white">"Install app"</strong> or{' '}
                  <strong className="text-white">"Add to Home screen"</strong>.
                </p>
              </div>

              <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-3">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#4F8CFF]">laptop_windows</span>
                  Windows &amp; Mac Desktops (Chrome / Edge)
                </div>
                <p className="text-[11px] text-[#8c909f]">
                  Click the install icon (⊕ or computer monitor with downward arrow) in the browser address bar, then click{' '}
                  <strong className="text-white">"Install"</strong> to launch in an app window.
                </p>
              </div>

              <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-3">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs">
                  <span className="material-symbols-outlined text-sm text-[#00daf3]">phone_iphone</span>
                  iPhone &amp; iPad (Apple Safari)
                </div>
                <p className="text-[11px] text-[#8c909f]">
                  Tap the <strong className="text-white">Share</strong> icon (square with arrow up), scroll down and tap{' '}
                  <strong className="text-white">"Add to Home Screen"</strong>, then tap <strong className="text-white">"Add"</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#424753]/20 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="rounded-xl bg-[#4F8CFF] hover:bg-[#528dff] px-5 py-2 text-xs font-bold text-[#001a43] transition-colors shadow-sm"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
