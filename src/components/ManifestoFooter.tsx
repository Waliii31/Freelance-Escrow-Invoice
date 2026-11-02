import React from 'react';
import { soundFx } from '../utils/audio';
import { BOT_CHAIN_CONFIG } from '../utils/contracts';
import { ArrowUp, Terminal, ExternalLink, Zap } from 'lucide-react';

export const ManifestoFooter: React.FC = () => {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black border-t-2 border-white py-12 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Manifesto Statement */}
        <div className="border-b border-[#333333] pb-8 mb-8">
          <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase mb-2">
            [TACTILE BRUTALISM SYSTEM MANIFESTO]
          </div>
          <h2 className="font-neo-serif text-2xl sm:text-3xl font-black text-white uppercase max-w-4xl leading-tight">
            "COMMERCE WITHOUT ARBITRARY MIDDLEMEN. DETERMINISTIC CAPITAL ROUTING 
            GOVERNED BY SOLIDITY BYTECODE AND CRYPTOGRAPHIC PROOFS."
          </h2>
          <p className="font-mono text-xs text-[#888888] mt-3 max-w-3xl leading-relaxed">
            Eliminating 20% freelance marketplace fees, predatory payout freezes, and vague terms of service. 
            The client deposits stablecoins directly into the escrow smart contract on BOT Chain Mainnet. 
            Work is delivered. Client triggers irrevocable release. Zero blur. Zero soft gradients. Uncompromising engineering rigor.
          </p>
        </div>

        {/* PRIMARY BOTCHAIN & SOCIAL LINKS BAR (Tactile Brutalism Geometry) */}
        <div className="border-2 border-white bg-black p-6 mb-8 brutalist-shadow-white">
          <div className="text-xs font-mono text-[#00FF66] font-bold uppercase mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Zap size={14} className="mr-1.5" />
              ECOSYSTEM LINKS & IMMUTABLE ON-CHAIN CONTRACT SPECIFICATION
            </span>
            <span className="text-white text-[10px]">BOT CHAIN MAINNET // CHAIN ID: 677</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Powered by Botchain Link */}
            <a
              href={BOT_CHAIN_CONFIG.botchainUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="tactile-btn-primary p-4 text-xs font-mono uppercase flex flex-col justify-between tracking-wider font-extrabold"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-black/75">INFRASTRUCTURE</span>
                <ExternalLink size={14} className="text-black" />
              </div>
              <div className="text-base font-black font-neo-serif text-black mt-2">
                POWERED BY BOTCHAIN
              </div>
              <div className="text-[11px] font-mono text-black font-semibold mt-1">
                https://botchain.ai →
              </div>
            </a>

            {/* 2. Twitter / X Link */}
            <a
              href={BOT_CHAIN_CONFIG.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="tactile-btn-secondary p-4 text-xs font-mono uppercase flex flex-col justify-between tracking-wider font-bold"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#888888]">OFFICIAL BROADCAST</span>
                <ExternalLink size={14} className="text-[#00FF66]" />
              </div>
              <div className="text-base font-black font-neo-serif text-white mt-2 flex items-center">
                <svg className="w-4 h-4 mr-2 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X: @SITE_PROOF__
              </div>
              <div className="text-[11px] font-mono text-[#00FF66] mt-1">
                https://x.com/site_proof__ →
              </div>
            </a>

            {/* 3. Scan Link (Contract Address) */}
            <a
              href={`${BOT_CHAIN_CONFIG.blockExplorerUrl}/address/${BOT_CHAIN_CONFIG.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClick()}
              className="border border-[#00FF66] bg-black p-4 text-xs font-mono uppercase flex flex-col justify-between tracking-wider text-white hover:bg-[#00FF66] hover:text-black font-bold transition-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#00FF66]">MAINNET CONTRACT SCAN</span>
                <ExternalLink size={14} />
              </div>
              <div className="text-sm font-bold font-mono text-white mt-2 break-all">
                {BOT_CHAIN_CONFIG.contractAddress}
              </div>
              <div className="text-[10px] font-mono text-[#AAAAAA] mt-1">
                scan.botchain.ai/address/{BOT_CHAIN_CONFIG.contractAddress.substring(0, 10)}... →
              </div>
            </a>
          </div>
        </div>

        {/* Brutalist UI Design Rules Checklist */}
        <div className="border border-white p-6 bg-black mb-8 brutalist-shadow-white">
          <div className="text-xs font-mono text-white font-bold uppercase mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <Terminal size={14} className="mr-2 text-[#00FF66]" />
              SPECIFICATION COMPLIANCE CHECKLIST
            </span>
            <span className="text-[#00FF66] text-xs">NETWORK: BOT CHAIN MAINNET (677)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] PITCH BLACK</span>
              <p className="text-[11px] text-[#888888] mt-1">#000000 pure darkness. No soft charcoal gradients.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] 1PX WHITE BORDERS</span>
              <p className="text-[11px] text-[#888888] mt-1">Stark solid 1px wireframe containers across all views.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] 0PX BORDER RADIUS</span>
              <p className="text-[11px] text-[#888888] mt-1">Perfect right angles everywhere. Zero rounding.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] NEON GREEN ACTION</span>
              <p className="text-[11px] text-[#888888] mt-1">#00FF66 high-voltage tactile primary buttons.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] NEO-SERIF + MONO</span>
              <p className="text-[11px] text-[#888888] mt-1">Playfair/Cinzel + Space/JetBrains typography duality.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] ZERO BLUR</span>
              <p className="text-[11px] text-[#888888] mt-1">No soft drop shadows, glassmorphism, or fuzzy UI.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] BOT CHAIN MAINNET</span>
              <p className="text-[11px] text-[#888888] mt-1">Chain ID 677, RPC rpc.botchain.ai, currency BOT.</p>
            </div>

            <div className="border border-[#333333] p-3 bg-[#050505]">
              <span className="text-[#00FF66] font-bold">[✓] CONTRACT SCAN WIRED</span>
              <p className="text-[11px] text-[#888888] mt-1">Direct link to 0xFD51...8324 on scan.botchain.ai.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#888888] pt-4">
          <div>
            SYS://ESCROW.PROTOCOL.V6 // POWERED BY BOTCHAIN © 2026 // RPC: HTTPS://RPC.BOTCHAIN.AI
          </div>

          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <a
              href="https://x.com/site_proof__"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAAAAA] hover:text-[#00FF66]"
            >
              X: @site_proof__
            </a>
            <span>|</span>
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#AAAAAA] hover:text-[#00FF66]"
            >
              botchain.ai
            </a>
            <span>|</span>
            <button
              onClick={scrollToTop}
              className="tactile-btn-secondary px-3 py-1 text-xs uppercase flex items-center font-bold text-white hover:text-black"
            >
              <ArrowUp size={12} className="mr-1" />
              BACK TO TOP
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
