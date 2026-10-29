import React from 'react';

interface QuickRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination?: string;
  source?: string;
}

export const QuickRouteModal: React.FC<QuickRouteModalProps> = ({
  isOpen,
  onClose,
  destination = 'E-Block 102 (Robotics & Sensors Lab)',
  source = 'Room E-301 (3rd Floor Lecture Hall)',
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Exit Room E-301',
      desc: 'Step out into the 3rd floor west corridor, head towards the central glass stairwell near the elevator bay.',
      icon: 'door_front',
    },
    {
      num: 2,
      title: 'Descend to Ground Floor (Level 1)',
      desc: 'Take the wide central staircase down two flights to Level 1. Alternatively, use Lift #2 (Priority for lab carts).',
      icon: 'stairs',
    },
    {
      num: 3,
      title: 'Pass Mechatronics & PLC Center',
      desc: 'Turn left at the foyer; walk past the Mechatronics glass demo cell and ISA student display board.',
      icon: 'arrow_forward',
    },
    {
      num: 4,
      title: 'Arrive at E-Block 102',
      desc: 'Double glass door on your right labeled "Central Robotics & Measurement Center". Station footwear outside.',
      icon: 'location_on',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00daf3]/20 text-[#00daf3] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">signpost</span>
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#4edea3] uppercase tracking-wider font-semibold">
                Campus Spatial Navigator · 3 Mins Walk
              </div>
              <h3 className="font-heading font-bold text-base text-white truncate max-w-[280px]">
                Route to {destination}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Route Steps */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Origin & Destination Banner */}
          <div className="bg-[#16202f] border border-[#424753]/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#8c909f]">Origin</div>
              <div className="text-xs font-semibold text-[#d9e3f7]">{source}</div>
            </div>
            <span className="material-symbols-outlined text-[#4F8CFF] text-lg">arrow_forward</span>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#00daf3]">Destination</div>
              <div className="text-xs font-semibold text-white">{destination}</div>
            </div>
          </div>

          {/* Graphical Step Track */}
          <div className="space-y-3">
            {steps.map((s, idx) => (
              <div
                key={s.num}
                className="flex items-start gap-3 bg-[#0a1422] border border-[#424753]/30 p-3 rounded-xl relative"
              >
                <div className="w-7 h-7 rounded-full bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {s.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-[#00daf3]">
                      {s.icon}
                    </span>
                    <span className="text-xs font-bold text-[#d9e3f7]">{s.title}</span>
                  </div>
                  <p className="text-[11px] text-[#c2c6d6] leading-relaxed mt-0.5">{s.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute left-[26px] top-[40px] bottom-[-16px] w-[2px] bg-[#424753]/30 pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#121c2a] p-3 rounded-xl border border-[#00a572]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-base">verified</span>
              <span className="text-[#d9e3f7]">Door Entry: Badge Scan or Bench Lead Entry</span>
            </div>
            <span className="font-mono text-[#4edea3] font-bold">Open</span>
          </div>
        </div>

        <div className="p-4 border-t border-[#424753]/40 bg-[#0a1422] flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
