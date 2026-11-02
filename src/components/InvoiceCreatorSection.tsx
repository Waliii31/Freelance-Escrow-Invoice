import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { DEMO_ADDRESSES, formatUSDC } from '../utils/contracts';
import { soundFx } from '../utils/audio';
import { PlusCircle, Check } from 'lucide-react';

const PRESET_AMOUNTS = [500, 1500, 2800, 5000, 10000];

export const InvoiceCreatorSection: React.FC = () => {
  const { 
    account, 
    clientBalanceUSDC, 
    createInvoice, 
    depositFunds,
    isProcessing 
  } = useWeb3();

  const [freelancer, setFreelancer] = useState<string>(DEMO_ADDRESSES.freelancer);
  const [title, setTitle] = useState<string>("FULL-STACK SOLANA/ETH BRIDGE AUDIT & FRONTEND");
  const [scopeOfWork, setScopeOfWork] = useState<string>(
    "Complete security audit of smart contract vaults, implement frontend dApp with Tactile Brutalism specifications (0px border-radius, pure pitch black, 1px white wireframe borders, neon green CTA)."
  );
  const [amount, setAmount] = useState<number>(2800);
  const [deadlineDays, setDeadlineDays] = useState<number>(14);
  const [autoDeposit, setAutoDeposit] = useState<boolean>(true);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancer || amount <= 0) {
      alert("Please specify a valid freelancer address and escrow amount.");
      return;
    }

    try {
      const invId = await createInvoice({
        freelancer,
        amount,
        title,
        scopeOfWork,
        deadlineDays
      });

      if (autoDeposit) {
        await depositFunds(invId);
      }

      setSuccessId(invId);
      soundFx.playReleaseSuccess();

      // Smooth scroll to vault after small delay
      setTimeout(() => {
        const vaultElement = document.getElementById('section-vault');
        if (vaultElement) {
          vaultElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="section-creator" className="w-full bg-black border-b border-white py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white pb-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase">
              [SECTION 02] // CAPITAL COMMITMENT PROTOCOL
            </div>
            <h2 className="font-neo-serif text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              INITIALIZE ESCROW INVOICE
            </h2>
          </div>
          <div className="text-right text-xs font-mono text-[#888888] mt-2 sm:mt-0">
            <div>NETWORK: <span className="text-white font-bold">BOT CHAIN MAINNET (677)</span></div>
            <div>MUTEX STATUS: <span className="text-[#00FF66] font-bold">NON-REENTRANT</span></div>
          </div>
        </div>

        {/* Success Alert if just generated */}
        {successId && (
          <div className="mb-8 border-2 border-[#00FF66] bg-black p-4 brutalist-shadow-green flex items-center justify-between font-mono text-sm">
            <div className="flex items-center text-white">
              <span className="w-3 h-3 bg-[#00FF66] mr-3"></span>
              <span>
                INVOICE <strong className="text-[#00FF66]">{successId}</strong> INITIALIZED & COMMITTED TO CONTRACT VAULT.
              </span>
            </div>
            <a
              href="#section-vault"
              className="px-3 py-1 bg-[#00FF66] text-black font-bold uppercase text-xs hover:bg-white transition-none"
            >
              VIEW IN VAULT →
            </a>
          </div>
        )}

        {/* Blueprint Form Grid */}
        <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-8 border border-white p-6 bg-black">
            <div className="text-xs font-mono text-[#888888] border-b border-[#333333] pb-2 mb-6 flex justify-between">
              <span>AGREEMENT PARAMETERS</span>
              <span>[ENCODING: ABI_V2]</span>
            </div>

            {/* Freelancer Address */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  01. FREELANCER BENEFICIARY WALLET
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFreelancer(DEMO_ADDRESSES.freelancer);
                    soundFx.playClick();
                  }}
                  className="text-[11px] font-mono text-[#00FF66] hover:underline"
                >
                  [USE DEMO FREELANCER ADDRESS]
                </button>
              </div>
              <input
                type="text"
                required
                value={freelancer}
                onChange={e => setFreelancer(e.target.value)}
                placeholder="0x94B87a5C2dD7412d46A6d2460B12F0d14b87C3E2"
                className="w-full bg-black border border-white px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00FF66] focus:ring-0"
              />
              <p className="text-[11px] font-mono text-[#777777] mt-1.5">
                Funds will only be released to this destination address once you approve work deliverables.
              </p>
            </div>

            {/* Invoice Title */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                02. ENGAGEMENT TITLE / DELIVERABLE MILESTONE
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. SMART CONTRACT V1 AUDIT & GAS OPTIMIZATION"
                className="w-full bg-black border border-white px-4 py-3 font-mono text-sm text-white focus:outline-none focus:border-[#00FF66] focus:ring-0 uppercase font-semibold"
              />
            </div>

            {/* Scope of Work */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                03. FORMAL SPECIFICATION & ACCEPTANCE CRITERIA
              </label>
              <textarea
                rows={4}
                required
                value={scopeOfWork}
                onChange={e => setScopeOfWork(e.target.value)}
                placeholder="Detail technical requirements, repo URL, IPFS requirements, and criteria for fund release..."
                className="w-full bg-black border border-white px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#00FF66] focus:ring-0 leading-relaxed"
              />
            </div>

            {/* Escrow Amount & Presets */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  04. ESCROW DEPOSIT VALUE (USDC)
                </label>
                <span className="text-xs font-mono text-[#888888]">
                  YOUR USDC BALANCE: <strong className="text-[#00FF66]">{formatUSDC(clientBalanceUSDC)}</strong>
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-black border border-white px-4 py-3 font-mono text-lg font-bold text-[#00FF66] focus:outline-none focus:border-[#00FF66] focus:ring-0 pl-16"
                />
                <span className="absolute left-4 top-3.5 font-mono text-sm font-bold text-[#888888]">
                  USDC $
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] font-mono text-[#888888] self-center mr-1">PRESETS:</span>
                {PRESET_AMOUNTS.map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      soundFx.playClick();
                    }}
                    className={`px-2.5 py-1 text-xs font-mono border transition-none ${
                      amount === preset
                        ? 'border-[#00FF66] bg-[#00FF66] text-black font-bold'
                        : 'border-[#444444] text-white hover:border-white'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Deadline */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                05. SETTLEMENT DEADLINE (DAYS)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[7, 14, 30, 60].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setDeadlineDays(days);
                      soundFx.playClick();
                    }}
                    className={`p-2.5 text-xs font-mono border text-center transition-none ${
                      deadlineDays === days
                        ? 'border-white bg-white text-black font-bold'
                        : 'border-[#444444] text-[#888888] hover:text-white hover:border-white'
                    }`}
                  >
                    {days} DAYS
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit mode toggle */}
            <div className="border border-[#333333] p-4 bg-[#050505] flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-white uppercase">
                  ATOMIC DEPOSIT: TRANSFER USDC IMMEDIATELY
                </div>
                <div className="text-[11px] font-mono text-[#888888]">
                  Transfers {formatUSDC(amount)} from your wallet into the contract in this session.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoDeposit}
                onChange={e => setAutoDeposit(e.target.checked)}
                className="w-5 h-5 accent-[#00FF66] bg-black border border-white cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Industrial Breakdown & Submit Action */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="border border-white p-6 bg-black brutalist-shadow-white">
              <div className="text-xs font-mono text-[#00FF66] border-b border-[#333333] pb-2 mb-4">
                [ESCROW PROTOCOL AUDIT BREAKDOWN]
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">CLIENT (YOU):</span>
                  <span className="text-white font-semibold">{account ? account.substring(0, 10) : '0x...'}...</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">FREELANCER:</span>
                  <span className="text-white font-semibold">{freelancer ? freelancer.substring(0, 10) : '0x...'}...</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">ESCROW PRINCIPAL:</span>
                  <span className="text-white font-bold">{formatUSDC(amount)}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">PROTOCOL COMMISSION:</span>
                  <span className="text-[#00FF66] font-bold">$0.00 (0.0%)</span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#222222]">
                  <span className="text-[#888888]">NETWORK GAS (EST):</span>
                  <span className="text-[#888888]">~0.0014 BOT</span>
                </div>

                <div className="pt-3 border-t-2 border-white flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase">TOTAL COMMITMENT:</span>
                  <span className="text-xl font-bold font-mono text-[#00FF66]">
                    {formatUSDC(amount)}
                  </span>
                </div>
              </div>

              {/* Security guarantees */}
              <div className="mt-6 border border-[#333333] p-3 bg-[#050505] space-y-2 text-[11px] font-mono text-[#888888]">
                <div className="flex items-center text-[#AAAAAA]">
                  <Check size={12} className="mr-1.5 text-[#00FF66]" />
                  Non-custodial smart contract custody
                </div>
                <div className="flex items-center text-[#AAAAAA]">
                  <Check size={12} className="mr-1.5 text-[#00FF66]" />
                  Funds release triggered only by client signature
                </div>
                <div className="flex items-center text-[#AAAAAA]">
                  <Check size={12} className="mr-1.5 text-[#00FF66]" />
                  Automatic timeout refund safeguard
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="tactile-btn-primary w-full py-4 text-sm font-mono uppercase tracking-wider mt-6 flex items-center justify-center font-black"
              >
                {isProcessing ? (
                  <span>MINING CONTRACT TRANSACTION...</span>
                ) : (
                  <>
                    <PlusCircle size={16} className="mr-2" />
                    {autoDeposit ? "INITIALIZE & LOCK USDC" : "CREATE INVOICE DRAFT"}
                  </>
                )}
              </button>
            </div>

            {/* Industrial Quote / Notice */}
            <div className="mt-6 border border-[#333333] p-4 text-[11px] font-mono text-[#666666] leading-relaxed">
              [NOTE] Once deposited, USDC cannot be withdrawn without freelancer delivery approval, 
              mutual agreement, or expiration of the settlement deadline timestamp.
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
