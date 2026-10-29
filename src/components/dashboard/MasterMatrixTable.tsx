import React from 'react';

export const MasterMatrixTable: React.FC = () => {
  return (
    <div
      className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-5 lg:p-6 flex flex-col gap-4 shadow-xl"
      id="full-matrix"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 px-2 py-0.5 rounded-full">
              Official Schedule
            </span>
            <h2 className="font-heading font-bold text-lg lg:text-xl text-white tracking-tight">
              PSG College of Technology · BE ICE Semester 1 Matrix
            </h2>
          </div>
          <p className="text-xs text-[#8c909f] mt-0.5">
            Coimbatore · 641 004 | Batch Strength: 60 | Department of Instrumentation and Control Engineering
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#8c909f] bg-[#0a1422] px-2.5 py-1 rounded-lg border border-[#424753]/30">
            P1 to P12 Structured Grid
          </span>
        </div>
      </div>

      {/* Full Schedule Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-[#16202f] text-[#c2c6d6] font-mono text-[11px]">
              <th className="p-2.5 border border-[#424753]/30 text-left font-bold text-white min-w-[70px]">
                DAY
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P1<br />
                <span className="text-[#8c909f] font-normal text-[10px]">8.30–9.20</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P2<br />
                <span className="text-[#8c909f] font-normal text-[10px]">9.20–10.10</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[95px]">
                P3<br />
                <span className="text-[#8c909f] font-normal text-[10px]">10.30–11.20</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[95px]">
                P4<br />
                <span className="text-[#8c909f] font-normal text-[10px]">11.20–12.10</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P5<br />
                <span className="text-[#8c909f] font-normal text-[10px]">1.40–2.30</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P6<br />
                <span className="text-[#8c909f] font-normal text-[10px]">2.30–3.20</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P7<br />
                <span className="text-[#8c909f] font-normal text-[10px]">3.30–4.20</span>
              </th>
              <th className="p-2 border border-[#424753]/30 min-w-[90px]">
                P8<br />
                <span className="text-[#8c909f] font-normal text-[10px]">4.20–5.10</span>
              </th>
              <th className="p-2 border border-[#424753]/30 text-[#8c909f] min-w-[70px]">
                P9–P12
              </th>
            </tr>
          </thead>
          <tbody className="text-[#d9e3f7] font-medium">
            {/* MON */}
            <tr className="hover:bg-[#16202f]/50 transition-colors">
              <td className="p-2.5 border border-[#424753]/30 font-mono font-bold text-left text-[#4F8CFF]">
                MON
              </td>
              <td className="p-2 border border-[#424753]/30 bg-[#528dff]/10 text-[#afc6ff] font-semibold">
                Library
              </td>
              <td className="p-2 border border-[#424753]/30">
                English Language Proficiency
              </td>
              <td className="p-2 border border-[#424753]/30">
                Electronic Devices &amp; Circuits
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#4edea3]">
                Tutor Ward Meeting
              </td>
              <td className="p-2 border border-[#424753]/30 bg-[#528dff]/10 text-[#afc6ff] font-semibold">
                Library
              </td>
              <td className="p-2 border border-[#424753]/30">
                Calculus and its Applications
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#00daf3]">
                Electric Circuits
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
            </tr>

            {/* TUE */}
            <tr className="hover:bg-[#16202f]/50 transition-colors">
              <td className="p-2.5 border border-[#424753]/30 font-mono font-bold text-left text-[#4F8CFF]">
                TUE
              </td>
              <td
                colSpan={4}
                className="p-2 border border-[#424753]/30 bg-[#00daf3]/10 text-[#00daf3] font-semibold"
              >
                Engineering Graphics (P1 to P4 Block)
              </td>
              <td className="p-2 border border-[#424753]/30">Physics</td>
              <td className="p-2 border border-[#424753]/30">
                English Language Proficiency
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#00daf3]">
                Electric Circuits
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
            </tr>

            {/* WED (Today) */}
            <tr className="hover:bg-[#16202f]/70 bg-[#0a1422] transition-colors border-l-2 border-l-[#4edea3]">
              <td className="p-2.5 border border-[#424753]/30 font-mono font-bold text-left text-[#4edea3]">
                WED <span className="text-[10px] text-[#4edea3]">(Today)</span>
              </td>
              <td className="p-2 border border-[#424753]/30">
                Calculus and its Applications
              </td>
              <td className="p-2 border border-[#424753]/30">
                Electronic Devices &amp; Circuits
              </td>
              <td className="p-2 border border-[#424753]/30">
                English Language Proficiency
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#00daf3]">
                Electric Circuits
              </td>
              <td
                colSpan={4}
                className="p-2 border border-[#424753]/30 bg-[#00a572]/20 text-[#4edea3] font-bold"
              >
                Circuits &amp; Devices Laboratory (P5 to P8 Block)
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
            </tr>

            {/* THU */}
            <tr className="hover:bg-[#16202f]/50 transition-colors">
              <td className="p-2.5 border border-[#424753]/30 font-mono font-bold text-left text-[#4F8CFF]">
                THU
              </td>
              <td className="p-2 border border-[#424753]/30 bg-[#528dff]/10 text-[#afc6ff] font-semibold">
                Library
              </td>
              <td className="p-2 border border-[#424753]/30">
                Calculus and its Applications
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#00daf3]">
                Electric Circuits
              </td>
              <td className="p-2 border border-[#424753]/30">
                Electronic Devices &amp; Circuits
              </td>
              <td className="p-2 border border-[#424753]/30">Physics</td>
              <td className="p-2 border border-[#424753]/30">
                English Language Proficiency
              </td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
            </tr>

            {/* FRI */}
            <tr className="hover:bg-[#16202f]/50 transition-colors">
              <td className="p-2.5 border border-[#424753]/30 font-mono font-bold text-left text-[#4F8CFF]">
                FRI
              </td>
              <td
                colSpan={4}
                className="p-2 border border-[#424753]/30 bg-[#00a572]/20 text-[#4edea3] font-bold"
              >
                Circuits &amp; Devices Laboratory (P1 to P4 Block)
              </td>
              <td className="p-2 border border-[#424753]/30">
                Calculus and its Applications
              </td>
              <td className="p-2 border border-[#424753]/30">Physics</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
              <td className="p-2 border border-[#424753]/30 text-[#8c909f]">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Official Subject Key Grid */}
      <div className="pt-3 border-t border-[#424753]/20 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4F8CFF] text-base">menu_book</span>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
            Official Subject Key
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4F8CFF]">23U101</span>
              <span className="text-white">Calculus and its Applications</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4F8CFF]">23U102</span>
              <span className="text-white">Physics</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4F8CFF]">23U104</span>
              <span className="text-white">Electronic Devices and Circuits</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00daf3]">23U110</span>
              <span className="text-white">Engineering Graphics</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4edea3]">23U111</span>
              <span className="text-white">Circuits and Devices Laboratory</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4F8CFF]">23G105</span>
              <span className="text-white">English Language Proficiency</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#00daf3]">23U103</span>
              <span className="text-white">Electric Circuits</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#afc6ff]">LIB</span>
              <span className="text-white">Library Reference</span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#4edea3]">TWM</span>
              <span className="text-white">Tutor Ward Meeting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
