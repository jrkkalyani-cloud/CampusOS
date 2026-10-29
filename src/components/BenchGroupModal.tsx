import React, { useState } from 'react';

interface BenchGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  benchGroupName: string;
}

export const BenchGroupModal: React.FC<BenchGroupModalProps> = ({
  isOpen,
  onClose,
  benchGroupName,
}) => {
  const [copied, setCopied] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  if (!isOpen) return null;

  const members = [
    { name: 'Karthik Raja V (You)', roll: '24I108', phone: '+91 94431 11223', role: 'Bench Lead' },
    { name: 'Sneha K', roll: '24I109', phone: '+91 94431 22334', role: 'DAQ & Wiring' },
    { name: 'Vigneshwaran S', roll: '24I110', phone: '+91 94431 33445', role: 'Calibrator & Micrometer' },
    { name: 'Rohit M', roll: '24I111', phone: '+91 94431 44556', role: 'MATLAB & Calculations' },
  ];

  const alertMessage =
    `🚨 *PSG TECH ICE-A BENCH GRP ALERT* 🚨\n` +
    `Transducers & Sensors Lab (IC24201) relocated to *E-BLOCK 102* (Central Robotics Lab).\n` +
    `Time: 10:30 AM. Bring Lab Record #4 + LVDT calculation sheets.\n` +
    `— CampusOS Broadcast`;

  const handleCopy = () => {
    navigator.clipboard.writeText(alertMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00daf3]/20 text-[#00daf3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Notify {benchGroupName}
              </h3>
              <p className="text-xs text-[#8c909f]">ICE-A Practical Rig Coordination</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Members List */}
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase text-[#8c909f] tracking-wider">
              Bench Teammates
            </div>
            {members.map((m) => (
              <div
                key={m.roll}
                className="bg-[#16202f] border border-[#424753]/30 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-[#d9e3f7]">{m.name}</div>
                  <div className="text-[11px] font-mono text-[#8c909f]">{m.roll} · {m.role}</div>
                </div>
                <span className="text-[10px] bg-[#212a39] text-[#4edea3] font-mono px-2 py-0.5 rounded border border-[#00a572]/30">
                  Ready
                </span>
              </div>
            ))}
          </div>

          {/* Message Preview */}
          <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/40">
            <div className="text-[11px] font-bold text-[#8c909f] mb-1">Pre-formatted Alert Message</div>
            <p className="text-xs font-mono text-[#c2c6d6] whitespace-pre-line leading-relaxed bg-[#050e1c] p-2.5 rounded-lg border border-[#424753]/20">
              {alertMessage}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-[#424753]/40 bg-[#0a1422] flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/50 text-[#d9e3f7] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleBroadcast}
            disabled={broadcastSent}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-sm">
              {broadcastSent ? 'task_alt' : 'send'}
            </span>
            <span>{broadcastSent ? 'Notified!' : 'Ping Bench Group'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
