import React, { useState } from 'react';

interface LabSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabSheetModal: React.FC<LabSheetModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleSpiceCode = `* 23U111: Circuits and Devices Laboratory
* Experiment 2: BJT Common Emitter Output Characteristics
VCC 1 0 DC 10V
VBB 3 0 DC 2V
RB 3 2 100k
RC 1 4 1k
Q1 4 2 0 Q2N2222
.model Q2N2222 NPN(Is=14.34f Xti=3 Eg=1.11 Vaf=74.03 Bf=255.9)
.DC VCC 0 10 0.1 VBB 1 3 0.5
.PRINT DC I(RC) V(4)
.END`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-3xl w-full max-h-[85vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">electrical_services</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-[#212a39] text-[#4F8CFF] px-2 py-0.5 rounded font-bold">
                  23U111
                </span>
                <span className="text-xs text-[#8c909f] font-mono">
                  Circuits &amp; Devices Lab Manual · Exp 1 to 4
                </span>
              </div>
              <h2 className="font-heading font-bold text-lg text-white">
                PN Junction Diode &amp; BJT Characteristics
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg hover:bg-[#212a39]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#d9e3f7]">
          {/* Aim & Objective */}
          <div className="bg-[#16202f] p-4 rounded-xl border border-[#424753]/30">
            <h4 className="text-xs font-bold text-[#4F8CFF] uppercase tracking-wider mb-1">
              Aim &amp; Objective
            </h4>
            <p className="text-xs text-[#c2c6d6] leading-relaxed">
              1. To plot the forward and reverse bias V-I characteristics of Silicon PN junction diode and determine cut-in voltage and dynamic resistance.<br />
              2. To obtain the input and output static characteristics of an NPN Bipolar Junction Transistor (BC547 / 2N2222) in Common Emitter configuration and calculate current gain (Beta).
            </p>
          </div>

          {/* Location notice */}
          <div className="bg-[#00daf3]/10 border border-[#00daf3]/30 rounded-xl p-3 flex items-center gap-3 text-xs">
            <span className="material-symbols-outlined text-[#00daf3] text-lg shrink-0">location_on</span>
            <span>
              <strong>Laboratory Venue:</strong> Circuits &amp; Devices Laboratory (E-Block 102). Regulated dual power supplies, breadboards, and digital multimeters are provided at all 12 bench stations.
            </span>
          </div>

          {/* Key Formulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#16202f] p-4 rounded-xl border border-[#424753]/30">
              <div className="text-xs font-semibold text-[#8c909f] uppercase mb-1">
                Dynamic Diode Resistance
              </div>
              <div className="font-mono text-xs text-[#4edea3] bg-[#0a1422] p-2.5 rounded-lg border border-[#424753]/20">
                r_d = ΔV_f / ΔI_f [Ohms] (Above Knee Voltage)
              </div>
            </div>
            <div className="bg-[#16202f] p-4 rounded-xl border border-[#424753]/30">
              <div className="text-xs font-semibold text-[#8c909f] uppercase mb-1">
                Common Emitter Current Gain (Beta)
              </div>
              <div className="font-mono text-xs text-[#00daf3] bg-[#0a1422] p-2.5 rounded-lg border border-[#424753]/20">
                h_fe = ΔI_c / ΔI_b | (V_ce = constant)
              </div>
            </div>
          </div>

          {/* SPICE / Simulation Template */}
          <div className="bg-[#0a1422] p-4 rounded-xl border border-[#424753]/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#4F8CFF]">code</span>
                <span className="font-mono text-xs text-[#afc6ff] font-bold">
                  SPICE / Simulation Netlist (Exp2_BJT_CE.cir)
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleSpiceCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs font-mono text-[#4F8CFF] hover:text-white bg-[#16202f] px-2 py-1 rounded border border-[#424753]/40 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-[#c2c6d6] overflow-x-auto p-2 bg-[#050e1c] rounded-lg">
              {sampleSpiceCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <span className="text-xs text-[#8c909f]">
            Verified by: Department of Instrumentation &amp; Control Engineering
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Lab manual PDF (Exp 1 to 4) downloaded to your device.');
              }}
              className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download PDF Manual</span>
            </button>
            <button
              onClick={onClose}
              className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
