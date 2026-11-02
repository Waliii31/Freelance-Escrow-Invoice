import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { formatUSDC, shortenAddress, DEMO_ADDRESSES } from '../utils/contracts';
import { soundFx } from '../utils/audio';
import { Terminal, Coins, Trash2 } from 'lucide-react';

export const DeveloperTestLabSection: React.FC = () => {
  const {
    logs,
    clearLogs,
    mintFaucetUSDC,
    clientBalanceUSDC,
    freelancerBalanceUSDC
  } = useWeb3();

  const [filter, setFilter] = useState<string>('ALL');
  const [faucetAmount, setFaucetAmount] = useState<number>(1000);

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    return log.type === filter;
  });

  return (
    <section id="section-lab" className="w-full bg-black border-b border-white py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white pb-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase">
              [SECTION 06] // LOCAL TEST LAB & TRANSACTION TELEMETRY
            </div>
            <h2 className="font-neo-serif text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              DEVELOPER TEST LAB & AUDIT LOGS
            </h2>
          </div>

          <div className="text-right text-xs font-mono text-[#888888] mt-2 sm:mt-0">
            <div>EVENT BUFFER: <span className="text-white font-bold">{logs.length} EVENTS</span></div>
            <div>STATUS: <span className="text-[#00FF66] font-bold">RECEPTIVE (POLLING 1000ms)</span></div>
          </div>
        </div>

        {/* Top Split: Testing Controls & Manual Test Walkthrough */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Faucet & Account Switcher (6 cols) */}
          <div className="lg:col-span-6 border border-white p-6 bg-black brutalist-shadow-white">
            <div className="text-xs font-mono text-[#00FF66] border-b border-[#333333] pb-2 mb-4 font-bold">
              [MOCK USDC FAUCET DISPENSER]
            </div>

            <div className="space-y-4 font-mono text-xs">
              <p className="text-[#CCCCCC] leading-relaxed">
                Mint instant testnet USDC tokens into either party's wallet to test the complete escrow lifecycle without spending real gas.
              </p>

              {/* Current Balances */}
              <div className="grid grid-cols-2 gap-3 border border-[#333333] p-3 bg-[#050505]">
                <div>
                  <span className="text-[#888888] block text-[10px] uppercase">CLIENT WALLET:</span>
                  <span className="font-bold text-white block text-sm">{formatUSDC(clientBalanceUSDC)}</span>
                  <span className="text-[10px] text-[#666666]">{shortenAddress(DEMO_ADDRESSES.client)}</span>
                </div>
                <div>
                  <span className="text-[#888888] block text-[10px] uppercase">FREELANCER WALLET:</span>
                  <span className="font-bold text-[#00FF66] block text-sm">{formatUSDC(freelancerBalanceUSDC)}</span>
                  <span className="text-[10px] text-[#666666]">{shortenAddress(DEMO_ADDRESSES.freelancer)}</span>
                </div>
              </div>

              {/* Faucet Amount Selector */}
              <div>
                <label className="block text-[10px] text-[#888888] uppercase mb-1">
                  MINT AMOUNT PER CLICK:
                </label>
                <div className="flex gap-2">
                  {[500, 1000, 2500, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setFaucetAmount(amt);
                        soundFx.playClick();
                      }}
                      className={`flex-1 py-1.5 border text-xs font-mono transition-none ${
                        faucetAmount === amt
                          ? 'border-[#00FF66] bg-[#00FF66] text-black font-bold'
                          : 'border-[#444444] text-white hover:border-white'
                      }`}
                    >
                      +${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mint Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => mintFaucetUSDC('client', faucetAmount)}
                  className="tactile-btn-secondary py-3 text-xs uppercase flex items-center justify-center font-bold"
                >
                  <Coins size={14} className="mr-1.5 text-[#00FF66]" />
                  MINT TO CLIENT
                </button>
                <button
                  onClick={() => mintFaucetUSDC('freelancer', faucetAmount)}
                  className="tactile-btn-primary py-3 text-xs uppercase flex items-center justify-center font-bold"
                >
                  <Coins size={14} className="mr-1.5" />
                  MINT TO FREELANCER
                </button>
              </div>
            </div>
          </div>

          {/* Step-by-Step Manual Test Protocol Guide (6 cols) */}
          <div className="lg:col-span-6 border border-white p-6 bg-black">
            <div className="text-xs font-mono text-[#00FF66] border-b border-[#333333] pb-2 mb-4 font-bold flex items-center justify-between">
              <span>[MANUAL TEST PROTOCOL GUIDE]</span>
              <span>5 STEPS</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="border border-[#333333] p-2.5 bg-[#050505]">
                <div className="text-[#00FF66] font-bold text-[11px] mb-0.5">
                  01. VERIFY BALANCE / MINT USDC
                </div>
                <div className="text-[#888888] text-[11px]">
                  Ensure Client wallet has USDC balance. Use the Faucet button to mint test tokens.
                </div>
              </div>

              <div className="border border-[#333333] p-2.5 bg-[#050505]">
                <div className="text-white font-bold text-[11px] mb-0.5">
                  02. INITIALIZE ESCROW INVOICE (SECTION 02)
                </div>
                <div className="text-[#888888] text-[11px]">
                  Specify amount (e.g. $2,800), scope, and check "Atomic Deposit" to lock funds into the contract.
                </div>
              </div>

              <div className="border border-[#333333] p-2.5 bg-[#050505]">
                <div className="text-white font-bold text-[11px] mb-0.5">
                  03. SWITCH ROLE TO FREELANCER & SUBMIT PROOF (SECTION 03)
                </div>
                <div className="text-[#888888] text-[11px]">
                  Click the "Switch to Freelancer" button in the header or vault, then submit your deliverable PR/IPFS link.
                </div>
              </div>

              <div className="border border-[#333333] p-2.5 bg-[#050505]">
                <div className="text-[#00FF66] font-bold text-[11px] mb-0.5">
                  04. SWITCH BACK TO CLIENT & RELEASE FUNDS (SECTION 03)
                </div>
                <div className="text-[#888888] text-[11px]">
                  Inspect the submitted proof, then hit the neon green "VERIFY & RELEASE" button. USDC is paid instantly!
                </div>
              </div>

              <div className="border border-[#333333] p-2.5 bg-[#050505]">
                <div className="text-white font-bold text-[11px] mb-0.5">
                  05. AUDIT THE EVENT LOGS & PRINT RECEIPT (SECTION 04 & 06)
                </div>
                <div className="text-[#888888] text-[11px]">
                  Check the live terminal below for real-time gas metrics and tx hashes, or print the brutalist slip.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal Output Window */}
        <div className="border border-white bg-black">
          {/* Terminal Title Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-white bg-[#0A0A0A] px-4 py-2 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <Terminal size={14} className="text-[#00FF66]" />
              <span className="font-bold text-white uppercase">SYS.LOGS // ON-CHAIN EVENT STREAM</span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              {['ALL', 'CREATE', 'DEPOSIT', 'SUBMIT', 'RELEASE', 'FAUCET'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    setFilter(btn);
                    soundFx.playClick();
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase transition-none ${
                    filter === btn
                      ? 'bg-white text-black font-bold'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  {btn}
                </button>
              ))}

              <button
                onClick={clearLogs}
                className="ml-2 text-[#888888] hover:text-[#FF3333] p-1"
                title="Clear Terminal Logs"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Terminal Scrolling Log Body */}
          <div className="h-72 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-black">
            {filteredLogs.length === 0 ? (
              <div className="text-[#666666] text-center py-12">
                &gt; NO LOGGED EVENTS MATCHING FILTER [{filter}]
              </div>
            ) : (
              filteredLogs.map(log => {
                const isRelease = log.type === 'RELEASE';
                const isDeposit = log.type === 'DEPOSIT';
                const isDispute = log.type === 'DISPUTE';

                return (
                  <div
                    key={log.id}
                    className="flex flex-wrap items-start justify-between border-b border-[#1A1A1A] pb-1.5 hover:bg-[#080808]"
                  >
                    <div className="flex items-start space-x-2 min-w-0 flex-1">
                      <span className="text-[#666666] text-[10px] whitespace-nowrap">
                        [{log.timestamp}]
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 uppercase whitespace-nowrap ${
                          isRelease ? 'bg-[#00FF66] text-black' :
                          isDeposit ? 'bg-white text-black' :
                          isDispute ? 'bg-[#FF3333] text-black' :
                          'bg-[#222222] text-[#AAAAAA]'
                        }`}
                      >
                        {log.type}
                      </span>
                      <span className="text-white text-xs break-all">
                        {log.details}
                      </span>
                    </div>

                    <div className="text-right text-[10px] text-[#666666] pl-2 whitespace-nowrap">
                      <span>TX: {log.txHash.substring(0, 10)}...</span>
                      {log.gasUsed && <span className="ml-2">({log.gasUsed} gas)</span>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Terminal Status Footer */}
          <div className="border-t border-[#333333] px-4 py-2 bg-[#050505] flex flex-wrap items-center justify-between text-[10px] font-mono text-[#666666] gap-2">
            <span>READY // LISTENING TO SMART CONTRACT EMISSIONS</span>
            <div className="flex items-center space-x-2">
              <span className="text-[#00FF66] font-bold">CONNECTED RPC: HTTPS://RPC.BOTCHAIN.AI [ID: 677]</span>
              <span>|</span>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#00FF66] underline"
              >
                BOTCHAIN SCAN
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
