import React from 'react';
import { ArrowRight, Lock, CheckCircle2, FileCode2, Terminal, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const HeroSection: React.FC = () => {
  return (
    <section id="section-hero" className="w-full bg-black border-b border-white relative overflow-hidden bg-grid-tech">
      {/* Harsh engineering corner marks */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-[#666666] select-none">
        [+] SEC_01 // LAT: 0x00 / LNG: 0xFF
      </div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-[#666666] select-none">
        SYS.ESCROW // BRUTALIST_SPEC_2026
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 pb-16">
        {/* Top brutalist badge */}
        <div className="inline-flex items-center space-x-2 border border-white bg-black px-3 py-1 mb-6 text-xs font-mono">
          <span className="w-2 h-2 bg-[#00FF66]"></span>
          <span className="text-white font-bold tracking-widest uppercase">
            BOT CHAIN MAINNET ESCROW PROTOCOL
          </span>
          <span className="text-[#888888]">|</span>
          <span className="text-[#00FF66] font-semibold">POWERED BY BOTCHAIN (CHAIN ID: 677)</span>
        </div>

        {/* Harsh Neo-Serif Monumental Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h1 className="font-neo-serif text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase leading-[0.95]">
              TRUSTLESS CAPITAL <br />
              <span className="text-[#00FF66] underline decoration-white decoration-2">
                DISBURSEMENT
              </span>{" "}
              ENGINE.
            </h1>

            <p className="mt-6 text-sm sm:text-base font-mono text-[#CCCCCC] max-w-2xl leading-relaxed border-l-2 border-[#00FF66] pl-4">
              A high-precision freelance escrow architecture engineered in Tactile Brutalism and powered by Botchain. 
              The client commits stablecoins (<span className="text-white font-bold">USDC</span>) directly 
              into an on-chain non-custodial smart contract on <span className="text-[#00FF66] font-bold">BOT Chain Mainnet</span>. 
              Once milestone deliverables are validated, the client executes an immutable release transaction. Zero platform tax. Zero soft UI. Zero blur.
            </p>

            {/* Tactile Action Button Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#section-creator"
                onClick={() => soundFx.playClick()}
                className="tactile-btn-primary px-6 py-3.5 text-sm font-mono uppercase tracking-wider flex items-center"
              >
                <Zap size={16} className="mr-2" />
                INITIALIZE ESCROW INVOICE
                <ArrowRight size={16} className="ml-2" />
              </a>

              <a
                href="#section-vault"
                onClick={() => soundFx.playClick()}
                className="tactile-btn-secondary px-6 py-3.5 text-sm font-mono uppercase tracking-wider flex items-center"
              >
                <Lock size={16} className="mr-2 text-[#00FF66]" />
                INSPECT ACTIVE VAULT
              </a>

              <a
                href="#section-spec"
                onClick={() => soundFx.playClick()}
                className="px-4 py-3.5 border border-[#444444] text-[#888888] hover:text-white hover:border-white text-xs font-mono uppercase flex items-center"
              >
                <FileCode2 size={14} className="mr-1.5" />
                SOLC 0.8.20 SPEC
              </a>
            </div>
          </div>

          {/* Wireframe Flow Architecture Box */}
          <div className="lg:col-span-4 border border-white bg-black p-5 relative brutalist-shadow-white">
            <div className="text-[10px] font-mono text-[#00FF66] border-b border-[#333333] pb-2 mb-4 flex items-center justify-between">
              <span>[STATE_MACHINE_TOPOLOGY]</span>
              <span>MUTEX_GUARD: ACTIVE</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Step 1 */}
              <div className="border border-[#444444] p-3 bg-[#050505]">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>STEP 01</span>
                  <span className="text-[#00FF66]">STAGE: PRE-COMMIT</span>
                </div>
                <div className="text-white font-bold flex items-center">
                  <Lock size={14} className="mr-1.5 text-[#00FF66]" />
                  CLIENT LOCKS USDC IN VAULT
                </div>
                <p className="text-[11px] text-[#888888] mt-1">
                  Contract transfers USDC via `transferFrom()`. Capital is immutably held in non-custodial custody.
                </p>
              </div>

              {/* Arrow */}
              <div className="text-center text-[#00FF66] font-mono text-xs">↓</div>

              {/* Step 2 */}
              <div className="border border-[#444444] p-3 bg-[#050505]">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>STEP 02</span>
                  <span className="text-[#00FF66]">STAGE: EXECUTION</span>
                </div>
                <div className="text-white font-bold flex items-center">
                  <Terminal size={14} className="mr-1.5 text-[#00FF66]" />
                  FREELANCER DELIVERS PROOF
                </div>
                <p className="text-[11px] text-[#888888] mt-1">
                  Pull requests, IPFS hashes, or cryptographic digests submitted directly to contract state.
                </p>
              </div>

              {/* Arrow */}
              <div className="text-center text-[#00FF66] font-mono text-xs">↓</div>

              {/* Step 3 */}
              <div className="border border-[#00FF66] p-3 bg-black">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>STEP 03</span>
                  <span className="text-[#00FF66] font-bold">STAGE: FINAL DISBURSEMENT</span>
                </div>
                <div className="text-white font-bold flex items-center">
                  <CheckCircle2 size={14} className="mr-1.5 text-[#00FF66]" />
                  CLIENT TRIGGERS RELEASE
                </div>
                <p className="text-[11px] text-[#AAAAAA] mt-1">
                  USDC transfers directly to freelancer address. Contract state switches to `RELEASED`.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#333333] flex justify-between items-center text-[10px] font-mono text-[#888888]">
              <span>PROTOCOL GAS EFFICIENCY</span>
              <span className="text-[#00FF66] font-bold">~42,000 GAS</span>
            </div>
          </div>
        </div>

        {/* Aggressively Engineered Metrics Matrix */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 border border-white">
          <div className="border-b sm:border-b-0 border-r border-white p-4 sm:p-6 bg-black">
            <div className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
              [METRIC 01] TOTAL ESCROW LOCKED
            </div>
            <div className="font-neo-serif text-2xl sm:text-3xl font-black text-white mt-1">
              $482,900<span className="text-sm font-mono text-[#00FF66]">.00</span>
            </div>
            <div className="text-[11px] font-mono text-[#888888] mt-1">
              Immutable USDC across 38 contracts
            </div>
          </div>

          <div className="border-b sm:border-b-0 md:border-r border-white p-4 sm:p-6 bg-black">
            <div className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
              [METRIC 02] SETTLEMENT TIME
            </div>
            <div className="font-neo-serif text-2xl sm:text-3xl font-black text-[#00FF66] mt-1">
              &lt; 12.4s
            </div>
            <div className="text-[11px] font-mono text-[#888888] mt-1">
              Instant on-chain finality post-signature
            </div>
          </div>

          <div className="border-r border-white p-4 sm:p-6 bg-black">
            <div className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
              [METRIC 03] PROTOCOL COMMISSION
            </div>
            <div className="font-neo-serif text-2xl sm:text-3xl font-black text-white mt-1">
              0.00%
            </div>
            <div className="text-[11px] font-mono text-[#888888] mt-1">
              Direct peer-to-peer capital routing
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-black">
            <div className="text-[10px] font-mono text-[#888888] uppercase tracking-widest">
              [METRIC 04] DISPUTE INCIDENCE
            </div>
            <div className="font-neo-serif text-2xl sm:text-3xl font-black text-[#00FF66] mt-1">
              0.00%
            </div>
            <div className="text-[11px] font-mono text-[#888888] mt-1">
              Deterministic code enforcement
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
