import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatUSDC, generateDigest } from '../utils/contracts';
import { soundFx } from '../utils/audio';
import { Printer, Copy, Check, QrCode } from 'lucide-react';

export const BrutalistSlipSection: React.FC = () => {
  const { activeInvoice } = useWeb3();
  const [copied, setCopied] = useState(false);

  if (!activeInvoice) return null;

  const agreementDigest = generateDigest(
    `${activeInvoice.id}:${activeInvoice.client}:${activeInvoice.freelancer}:${activeInvoice.amount}:${activeInvoice.title}`
  );

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  const handleCopyJSON = () => {
    soundFx.playClick();
    const payload = JSON.stringify(activeInvoice, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="section-slip" className="w-full bg-black border-b border-white py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white pb-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase">
              [SECTION 04] // VERIFIABLE RECEIPT SPECIFICATION
            </div>
            <h2 className="font-neo-serif text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              CRYPTOGRAPHIC BRUTALIST SLIP
            </h2>
          </div>

          <div className="flex items-center space-x-3 mt-4 sm:mt-0 no-print">
            <button
              onClick={handleCopyJSON}
              className="tactile-btn-secondary px-3 py-2 text-xs font-mono uppercase flex items-center"
            >
              {copied ? <Check size={14} className="mr-1.5 text-[#00FF66]" /> : <Copy size={14} className="mr-1.5" />}
              {copied ? "JSON COPIED" : "EXPORT JSON"}
            </button>
            <button
              onClick={handlePrint}
              className="tactile-btn-primary px-4 py-2 text-xs font-mono uppercase flex items-center font-bold"
            >
              <Printer size={14} className="mr-1.5" />
              PRINT / EXPORT SLIP
            </button>
          </div>
        </div>

        {/* Printable Brutalist Slip Container */}
        <div className="max-w-3xl mx-auto border-2 border-white bg-black p-6 sm:p-10 invoice-printable font-mono brutalist-shadow-white relative">
          {/* Top Perforated Decorative Cut Line */}
          <div className="perforated-cut h-1 w-full mb-6"></div>

          {/* ASCII Header Banner */}
          <div className="text-center border-b-2 border-white pb-6 mb-6">
            <div className="text-[10px] sm:text-xs text-[#888888] tracking-widest uppercase">
              ============================================================
            </div>
            <div className="font-neo-serif text-2xl sm:text-3xl font-black tracking-tight uppercase text-white my-1">
              FREELANCE ESCROW INVOICE
            </div>
            <div className="text-xs tracking-widest uppercase text-[#00FF66] font-bold">
              BOT CHAIN MAINNET // POWERED BY BOTCHAIN // PROTOCOL V6.0
            </div>
            <div className="text-[10px] sm:text-xs text-[#888888] tracking-widest uppercase">
              ============================================================
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-white pb-6 mb-6">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">INVOICE SERIAL NO:</span>
              <span className="font-bold text-white text-sm">{activeInvoice.serialNumber}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">PROTOCOL ID:</span>
              <span className="font-bold text-white text-sm">{activeInvoice.id}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">TIMESTAMP INITIATED:</span>
              <span className="text-[#CCCCCC]">{new Date(activeInvoice.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">ON-CHAIN STATUS:</span>
              <span className="font-bold text-[#00FF66] uppercase">
                {activeInvoice.status}
              </span>
            </div>
          </div>

          {/* Participants */}
          <div className="border-b border-white pb-6 mb-6 text-xs space-y-3">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">01. CLIENT ORIGINATOR WALLET:</span>
              <span className="text-white font-mono break-all font-semibold">{activeInvoice.client}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase">02. FREELANCER BENEFICIARY WALLET:</span>
              <span className="text-white font-mono break-all font-semibold">{activeInvoice.freelancer}</span>
            </div>
          </div>

          {/* Engagement Specifications */}
          <div className="border-b border-white pb-6 mb-6 text-xs">
            <span className="text-[#888888] block text-[10px] uppercase mb-1">
              SPECIFICATION & DELIVERABLE TITLE:
            </span>
            <div className="font-bold text-white uppercase text-sm mb-2">
              {activeInvoice.title}
            </div>
            <div className="text-[#AAAAAA] text-[11px] leading-relaxed border-l-2 border-white pl-3 bg-[#080808] p-2">
              {activeInvoice.scopeOfWork}
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border-b-2 border-white pb-6 mb-6 text-xs">
            <div className="text-[10px] text-[#888888] uppercase mb-2">
              ITEMIZED CAPITAL ACCOUNTING:
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white">ESCROW PRINCIPAL COMMITTED:</span>
                <span className="font-bold text-white">{formatUSDC(activeInvoice.amount)}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>PROTOCOL BROKER COMMISSION:</span>
                <span className="text-[#00FF66]">0.00 USDC (0.00%)</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>ESCROW SMART CONTRACT TAX:</span>
                <span className="text-[#00FF66]">0.00 USDC (0.00%)</span>
              </div>
              <div className="pt-2 border-t border-white flex justify-between items-baseline font-bold text-sm">
                <span className="text-white uppercase">TOTAL SETTLEMENT VALUE:</span>
                <span className="text-xl font-bold font-mono text-[#00FF66]">
                  {formatUSDC(activeInvoice.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Raw Simulated Barcode Matrix & QR Aesthetic */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            {/* Brutalist Barcode SVG */}
            <div className="flex-1 min-w-[200px]">
              <div className="text-[10px] text-[#888888] uppercase mb-1">
                IMMUTABLE TELEMETRY BARCODE:
              </div>
              <svg className="w-full h-12 bg-black" preserveAspectRatio="none" viewBox="0 0 200 40">
                {/* Generate stark variable barcode bars */}
                {[
                  4, 2, 8, 3, 1, 6, 2, 4, 10, 3, 2, 7, 1, 4, 8, 2, 5, 1, 9, 3,
                  4, 2, 6, 1, 8, 3, 2, 5, 2, 4, 7, 1, 6, 3, 5, 2, 8, 4, 2, 6
                ].map((width, idx) => {
                  let x = 0;
                  for (let i = 0; i < idx; i++) {
                    x += [4, 2, 8, 3, 1, 6, 2, 4, 10, 3, 2, 7, 1, 4, 8, 2, 5, 1, 9, 3, 4, 2, 6, 1, 8, 3, 2, 5, 2, 4, 7, 1, 6, 3, 5, 2, 8, 4, 2, 6][i] + 2;
                  }
                  return (
                    <rect
                      key={idx}
                      x={x % 190}
                      y="0"
                      width={width}
                      height="40"
                      fill="#FFFFFF"
                    />
                  );
                })}
              </svg>
              <div className="text-[9px] text-[#888888] tracking-widest text-center mt-1">
                * {activeInvoice.serialNumber} // {agreementDigest.substring(0, 12)} *
              </div>
            </div>

            {/* Brutalist Seal & Signature Fingerprint */}
            <div className="border border-white p-3 bg-black text-center min-w-[140px]">
              <div className="text-[9px] text-[#00FF66] font-bold uppercase mb-1">
                SEAL OF DEPOSIT
              </div>
              <div className="w-16 h-16 mx-auto border-2 border-white flex items-center justify-center font-bold text-xs">
                <QrCode size={40} className="text-white" />
              </div>
              <div className="text-[8px] text-[#888888] uppercase mt-1">
                VERIFIED BY SOLC
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest & Contract Scan */}
          <div className="mt-6 pt-4 border-t border-[#333333] space-y-1.5 text-[10px] text-[#777777] break-all">
            <div>
              <span className="text-[#AAAAAA] font-bold">SHA-256 AGREEMENT DIGEST: </span>
              {agreementDigest}
            </div>
            <div className="flex flex-wrap items-center justify-between pt-1">
              <span>
                <strong className="text-white">BOT CHAIN CONTRACT: </strong>
                0xFD51797C48f75aF10761F92Bdd639e4518358324
              </span>
              <a
                href="https://scan.botchain.ai/address/0xFD51797C48f75aF10761F92Bdd639e4518358324"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00FF66] underline hover:text-white"
              >
                VERIFY ON SCAN.BOTCHAIN.AI ↗
              </a>
            </div>
          </div>

          {/* Bottom Perforated Cut Line */}
          <div className="perforated-cut h-1 w-full mt-6"></div>
        </div>
      </div>
    </section>
  );
};
