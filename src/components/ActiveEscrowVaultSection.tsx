import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useWeb3 } from '../context/Web3Context';
import type { EscrowStatus } from '../types/escrow';
import { formatUSDC, shortenAddress, BOT_CHAIN_CONFIG } from '../utils/contracts';
import { soundFx } from '../utils/audio';
import { 
  Lock, 
  Unlock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  ArrowRightLeft,
  FileCheck2,
  RefreshCw
} from 'lucide-react';

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; step: number; desc: string }> = {
  AWAITING_DEPOSIT: {
    label: "AWAITING DEPOSIT",
    color: "#AAAAAA",
    step: 1,
    desc: "Invoice drafted. Waiting for client to commit and lock USDC into contract vault."
  },
  FUNDED: {
    label: "ESCROW FUNDED // ACTIVE",
    color: "#00FF66",
    step: 2,
    desc: "USDC locked in immutable smart contract vault. Freelancer authorized to begin work."
  },
  WORK_SUBMITTED: {
    label: "DELIVERABLE SUBMITTED // PENDING APPROVAL",
    color: "#00FF66",
    step: 3,
    desc: "Freelancer has submitted deliverable proof. Client review and release pending."
  },
  RELEASED: {
    label: "FUNDS RELEASED // SETTLED",
    color: "#00FF66",
    step: 4,
    desc: "Client verified deliverables and released capital. Payment permanently disbursed."
  },
  REFUNDED: {
    label: "ESCROW CANCELLED // REFUNDED",
    color: "#FF3333",
    step: 4,
    desc: "Settlement cancelled. USDC principal returned to client wallet."
  },
  DISPUTED: {
    label: "PROTOCOL DISPUTED // VAULT FROZEN",
    color: "#FFB800",
    step: 4,
    desc: "Dispute triggered by participant. Vault frozen pending arbitration."
  }
};

export const ActiveEscrowVaultSection: React.FC = () => {
  const {
    invoices,
    activeInvoice,
    activeInvoiceId,
    setActiveInvoiceId,
    userRole,
    switchRole,
    depositFunds,
    submitDeliverable,
    releaseFunds,
    refundFunds,
    raiseDispute,
    isProcessing
  } = useWeb3();

  // Submission form state
  const [proofUrl, setProofUrl] = useState<string>("https://github.com/protocol-archive/tactile-escrow/pull/88");
  const [submissionNotes, setSubmissionNotes] = useState<string>(
    "Delivered full React 19 dApp with Tactile Brutalism specs, verified smart contracts on testnet, 100% test coverage."
  );
  const [disputeReason, setDisputeReason] = useState<string>("");
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false);

  const currentStatusInfo = activeInvoice ? STATUS_CONFIG[activeInvoice.status] : STATUS_CONFIG.AWAITING_DEPOSIT;

  // Handle release with tactile confetti explosion
  const handleRelease = async (invoiceId: string) => {
    const success = await releaseFunds(invoiceId);
    if (success) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00FF66', '#FFFFFF', '#000000']
        });
      } catch {
        // fallback
      }
    }
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvoice) return;
    await raiseDispute(activeInvoice.id, disputeReason);
    setShowDisputeModal(false);
  };

  return (
    <section id="section-vault" className="w-full bg-black border-b border-white py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white pb-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase">
              [SECTION 03] // ON-CHAIN SETTLEMENT TERMINAL
            </div>
            <h2 className="font-neo-serif text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              ACTIVE ESCROW VAULT
            </h2>
          </div>

          {/* Role Switcher Pill for seamless multi-party testing */}
          <div className="border-2 border-[#00FF66] bg-black p-2 mt-4 sm:mt-0 flex items-center space-x-3 text-xs font-mono">
            <span className="text-[#888888] uppercase">YOUR PERSPECTIVE:</span>
            <span className="text-[#00FF66] font-extrabold uppercase">
              [{userRole.toUpperCase()}]
            </span>
            <button
              onClick={() => {
                switchRole(userRole === 'client' ? 'freelancer' : 'client');
              }}
              className="px-2 py-1 bg-white text-black font-bold uppercase hover:bg-[#00FF66] transition-none flex items-center"
            >
              <ArrowRightLeft size={12} className="mr-1" />
              SWITCH TO {userRole === 'client' ? 'FREELANCER' : 'CLIENT'}
            </button>
          </div>
        </div>

        {/* Invoice Selector Strip */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 border-b border-[#333333]">
          <span className="text-xs font-mono text-[#888888] uppercase whitespace-nowrap mr-2">
            SELECT INVOICE:
          </span>
          {invoices.map(inv => {
            const isSelected = inv.id === activeInvoiceId;
            return (
              <button
                key={inv.id}
                onClick={() => {
                  setActiveInvoiceId(inv.id);
                  soundFx.playClick();
                }}
                className={`px-3 py-2 text-xs font-mono uppercase whitespace-nowrap border transition-none flex items-center space-x-2 ${
                  isSelected
                    ? 'border-white bg-white text-black font-bold brutalist-shadow-green'
                    : 'border-[#444444] bg-black text-[#888888] hover:text-white hover:border-white'
                }`}
              >
                <span className={`w-2 h-2 ${
                  inv.status === 'RELEASED' ? 'bg-[#00FF66]' :
                  inv.status === 'WORK_SUBMITTED' ? 'bg-[#00FF66] animate-pulse' :
                  inv.status === 'FUNDED' ? 'bg-[#00FF66]' :
                  inv.status === 'DISPUTED' ? 'bg-[#FFB800]' : 'bg-[#666666]'
                }`}></span>
                <span>{inv.id}</span>
                <span className="text-[10px] opacity-75">(${inv.amount})</span>
              </button>
            );
          })}
        </div>

        {activeInvoice ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Terminal Left (8 cols) */}
            <div className="lg:col-span-8 border border-white p-6 bg-black relative">
              {/* Technical header */}
              <div className="flex flex-wrap items-center justify-between border-b border-[#333333] pb-4 mb-6">
                <div>
                  <div className="text-[10px] font-mono text-[#00FF66] uppercase">
                    SERIAL NO: {activeInvoice.serialNumber} // ID: {activeInvoice.id}
                  </div>
                  <h3 className="font-neo-serif text-xl sm:text-2xl font-bold text-white uppercase mt-0.5">
                    {activeInvoice.title}
                  </h3>
                </div>

                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-xs font-mono text-[#888888]">CONTRACT VAULT BALANCE</div>
                  <div className="font-neo-serif text-2xl font-black text-[#00FF66]">
                    {formatUSDC(activeInvoice.amount)}
                  </div>
                </div>
              </div>

              {/* State Machine Step Progress Bar */}
              <div className="mb-8">
                <div className="text-[11px] font-mono text-[#888888] uppercase mb-2 flex justify-between">
                  <span>STATE TRANSITION PIPELINE</span>
                  <span className="text-[#00FF66] font-bold">{currentStatusInfo.label}</span>
                </div>

                <div className="grid grid-cols-4 gap-1 border border-white p-1 bg-black">
                  {[
                    { step: 1, label: "01: DRAFT" },
                    { step: 2, label: "02: FUNDED" },
                    { step: 3, label: "03: DELIVERED" },
                    { step: 4, label: "04: RELEASED" }
                  ].map(item => {
                    const isActive = currentStatusInfo.step >= item.step;
                    const isCurrent = currentStatusInfo.step === item.step;
                    return (
                      <div
                        key={item.step}
                        className={`py-2 px-1 text-center font-mono text-[11px] font-bold uppercase transition-none ${
                          isCurrent
                            ? 'bg-[#00FF66] text-black'
                            : isActive
                            ? 'bg-white text-black'
                            : 'bg-[#111111] text-[#666666]'
                        }`}
                      >
                        {item.label}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] font-mono text-[#AAAAAA] mt-2 border-l border-[#00FF66] pl-2">
                  {currentStatusInfo.desc}
                </div>
              </div>

              {/* Specification Details Box */}
              <div className="border border-[#333333] p-4 bg-[#050505] mb-6">
                <div className="text-[10px] font-mono text-[#888888] uppercase mb-1">
                  SCOPE OF WORK SPECIFICATION
                </div>
                <div className="font-mono text-xs text-white leading-relaxed whitespace-pre-wrap">
                  {activeInvoice.scopeOfWork}
                </div>
              </div>

              {/* Deliverable Proof Box (if submitted) */}
              {(activeInvoice.status === 'WORK_SUBMITTED' || activeInvoice.status === 'RELEASED') && (
                <div className="border-2 border-[#00FF66] p-4 bg-black mb-6">
                  <div className="flex items-center justify-between text-xs font-mono text-[#00FF66] uppercase mb-2">
                    <span className="flex items-center">
                      <FileCheck2 size={14} className="mr-1.5" />
                      FREELANCER DELIVERABLE SUBMISSION
                    </span>
                    <span className="text-white text-[10px]">
                      VERIFIED ON-CHAIN
                    </span>
                  </div>

                  <div className="font-mono text-xs space-y-2">
                    <div className="flex flex-wrap items-center">
                      <span className="text-[#888888] mr-2">PROOF / REPOSITORY URL:</span>
                      <a
                        href={activeInvoice.deliverableProof}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white font-bold underline hover:text-[#00FF66] flex items-center break-all"
                      >
                        {activeInvoice.deliverableProof}
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    </div>
                    {activeInvoice.deliverableNotes && (
                      <div className="text-[#CCCCCC] text-[11px] bg-[#111111] p-2 border border-[#333333]">
                        {activeInvoice.deliverableNotes}
                      </div>
                    )}
                    {activeInvoice.txHashDeliverable && (
                      <div className="text-[10px] text-[#666666]">
                        PROOF TX HASH: {activeInvoice.txHashDeliverable}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ACTION TRIGGER PANE (Dependent on current state & role) */}
              <div className="border border-white p-5 bg-black mt-8">
                <div className="text-xs font-mono text-[#888888] uppercase border-b border-[#333333] pb-2 mb-4 flex justify-between">
                  <span>DISBURSEMENT CONTROLS</span>
                  <span className="text-[#00FF66]">EXECUTOR: {userRole.toUpperCase()}</span>
                </div>

                {/* State: AWAITING DEPOSIT */}
                {activeInvoice.status === 'AWAITING_DEPOSIT' && (
                  <div className="space-y-4">
                    <p className="text-xs font-mono text-[#CCCCCC]">
                      This invoice requires <strong className="text-white">{formatUSDC(activeInvoice.amount)}</strong> to be deposited into the escrow contract.
                    </p>
                    <button
                      onClick={() => depositFunds(activeInvoice.id)}
                      disabled={isProcessing}
                      className="tactile-btn-primary w-full py-4 text-sm font-mono uppercase tracking-wider flex items-center justify-center font-bold"
                    >
                      <Lock size={16} className="mr-2" />
                      DEPOSIT & LOCK {formatUSDC(activeInvoice.amount)} IN ESCROW
                    </button>
                  </div>
                )}

                {/* State: FUNDED (Escrow is live, Freelancer needs to submit) */}
                {activeInvoice.status === 'FUNDED' && (
                  <div>
                    {userRole === 'freelancer' ? (
                      <div className="space-y-4">
                        <div className="text-xs font-mono text-[#00FF66] font-bold uppercase flex items-center">
                          <CheckCircle2 size={14} className="mr-1.5" />
                          USDC IS SAFELY LOCKED. READY FOR SUBMISSION.
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-white font-bold mb-1">
                            DELIVERABLE PROOF URL / IPFS HASH
                          </label>
                          <input
                            type="text"
                            value={proofUrl}
                            onChange={e => setProofUrl(e.target.value)}
                            placeholder="https://github.com/... or ipfs://Qm..."
                            className="w-full bg-black border border-white px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#00FF66]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase text-white font-bold mb-1">
                            HANDOVER NOTES / VERIFICATION TEST RESULTS
                          </label>
                          <textarea
                            rows={2}
                            value={submissionNotes}
                            onChange={e => setSubmissionNotes(e.target.value)}
                            placeholder="Instructions for testing deliverables..."
                            className="w-full bg-black border border-white px-3 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#00FF66]"
                          />
                        </div>

                        <button
                          onClick={() => submitDeliverable(activeInvoice.id, proofUrl, submissionNotes)}
                          disabled={isProcessing}
                          className="tactile-btn-primary w-full py-4 text-sm font-mono uppercase tracking-wider flex items-center justify-center font-bold"
                        >
                          <Send size={16} className="mr-2" />
                          SUBMIT DELIVERABLES FOR CLIENT RELEASE
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-xs font-mono text-white flex items-center">
                          <Clock size={14} className="mr-1.5 text-[#00FF66]" />
                          WAITING FOR FREELANCER TO SUBMIT WORK DELIVERABLES.
                        </div>
                        <p className="text-[11px] font-mono text-[#888888]">
                          USDC is securely locked in the smart contract vault. You can switch to Freelancer role to simulate milestone submission.
                        </p>
                        <div className="pt-2 flex space-x-3">
                          <button
                            onClick={() => switchRole('freelancer')}
                            className="tactile-btn-secondary px-4 py-2 text-xs font-mono uppercase"
                          >
                            SWITCH TO FREELANCER & SUBMIT PROOF
                          </button>
                          <button
                            onClick={() => refundFunds(activeInvoice.id)}
                            className="tactile-btn-danger px-4 py-2 text-xs font-mono uppercase"
                          >
                            CANCEL & REFUND
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* State: WORK_SUBMITTED (Client can release funds!) */}
                {activeInvoice.status === 'WORK_SUBMITTED' && (
                  <div className="space-y-4">
                    <div className="text-xs font-mono text-[#00FF66] font-bold uppercase">
                      DELIVERABLE SUBMITTED FOR REVIEW. READY FOR CLIENT RELEASE.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => handleRelease(activeInvoice.id)}
                        disabled={isProcessing}
                        className="tactile-btn-primary py-4 px-4 text-sm font-mono uppercase tracking-wider flex items-center justify-center font-black sm:col-span-2"
                      >
                        <Unlock size={18} className="mr-2" />
                        VERIFY & RELEASE {formatUSDC(activeInvoice.amount)} TO FREELANCER
                      </button>

                      <button
                        onClick={() => {
                          setShowDisputeModal(true);
                          soundFx.playHazard();
                        }}
                        className="tactile-btn-danger py-2.5 px-3 text-xs font-mono uppercase flex items-center justify-center"
                      >
                        <AlertTriangle size={14} className="mr-1.5" />
                        RAISE DISPUTE / FREEZE
                      </button>

                      <button
                        onClick={() => refundFunds(activeInvoice.id)}
                        className="tactile-btn-secondary py-2.5 px-3 text-xs font-mono uppercase flex items-center justify-center"
                      >
                        <RefreshCw size={14} className="mr-1.5" />
                        CANCEL & REFUND
                      </button>
                    </div>
                  </div>
                )}

                {/* State: RELEASED (Settlement complete) */}
                {activeInvoice.status === 'RELEASED' && (
                  <div className="border border-[#00FF66] p-4 bg-black text-center space-y-2">
                    <div className="font-neo-serif text-xl font-bold text-[#00FF66] uppercase flex items-center justify-center">
                      <CheckCircle2 size={20} className="mr-2" />
                      CAPITAL IMMUTABLY DISBURSED
                    </div>
                    <div className="text-xs font-mono text-[#CCCCCC]">
                      {formatUSDC(activeInvoice.amount)} was transferred directly to Freelancer address [
                      {shortenAddress(activeInvoice.freelancer)}].
                    </div>
                    {activeInvoice.txHashRelease && (
                      <div className="text-[10px] font-mono text-[#777777] break-all pt-1">
                        RELEASE TX HASH: {activeInvoice.txHashRelease}
                      </div>
                    )}
                  </div>
                )}

                {/* State: DISPUTED */}
                {activeInvoice.status === 'DISPUTED' && (
                  <div className="border border-[#FFB800] p-4 bg-black space-y-2">
                    <div className="text-xs font-mono text-[#FFB800] font-bold uppercase flex items-center">
                      <AlertTriangle size={16} className="mr-2" />
                      PROTOCOL VAULT FROZEN UNDER FORMAL DISPUTE
                    </div>
                    <div className="text-xs font-mono text-white">
                      Reason: {activeInvoice.disputeReason || "Specification mismatch reported."}
                    </div>
                    <div className="text-[11px] font-mono text-[#888888]">
                      Smart contract funds are held in state 5. In a full production implementation,
                      this invokes the configured multi-sig arbitrator or Kleros dispute court.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Right (4 cols): Technical Vault Audit Telemetry */}
            <div className="lg:col-span-4 space-y-6">
              {/* Telemetry Card */}
              <div className="border border-white p-5 bg-black brutalist-shadow-white">
                <div className="text-xs font-mono text-[#00FF66] border-b border-[#333333] pb-2 mb-4 flex justify-between items-center">
                  <span>[VAULT SECURITY REGISTRY]</span>
                  <a
                    href={`${BOT_CHAIN_CONFIG.blockExplorerUrl}/address/${BOT_CHAIN_CONFIG.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-white hover:text-[#00FF66] underline flex items-center"
                  >
                    SCAN
                    <ExternalLink size={10} className="ml-1" />
                  </a>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-[#888888] block text-[10px]">CLIENT ADDRESS:</span>
                    <span className="text-white font-mono break-all">{activeInvoice.client}</span>
                  </div>

                  <div>
                    <span className="text-[#888888] block text-[10px]">FREELANCER BENEFICIARY:</span>
                    <span className="text-white font-mono break-all">{activeInvoice.freelancer}</span>
                  </div>

                  <div>
                    <span className="text-[#888888] block text-[10px]">SETTLEMENT DEADLINE:</span>
                    <span className="text-white font-mono">
                      {new Date(activeInvoice.deadline).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#888888] block text-[10px]">DEPOSIT TX HASH:</span>
                    <span className="text-[#00FF66] font-mono break-all text-[11px]">
                      {activeInvoice.txHashDeposit || "0x00000000000000000000000000000000"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#888888] block text-[10px]">MUTEX CONCURRENCY:</span>
                    <span className="text-white font-mono">NON-REENTRANT GUARD (SOLADY)</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#333333]">
                  <a
                    href="#section-slip"
                    onClick={() => soundFx.playClick()}
                    className="tactile-btn-secondary w-full py-2.5 text-xs font-mono uppercase flex items-center justify-center font-bold"
                  >
                    GENERATE BRUTALIST SLIP →
                  </a>
                </div>
              </div>

              {/* State Machine Legend */}
              <div className="border border-[#444444] p-4 bg-[#080808] font-mono text-xs space-y-2">
                <div className="text-[10px] text-[#888888] uppercase font-bold">
                  DETERMINISTIC INVARIANTS:
                </div>
                <div className="text-[11px] text-[#AAAAAA] leading-relaxed">
                  • Zero platform fees collected by any intermediary.
                  <br />
                  • Freelancer cannot withdraw before client release.
                  <br />
                  • Client cannot revoke funds once deliverable is approved.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-white p-12 text-center font-mono">
            <p className="text-[#888888]">NO ESCROW INVOICE SELECTED.</p>
          </div>
        )}

        {/* Dispute Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="border-2 border-[#FF3333] bg-black p-6 max-w-lg w-full brutalist-shadow-white">
              <div className="text-xs font-mono text-[#FF3333] font-bold uppercase mb-2">
                [CRITICAL ACTION: FREEZE PROTOCOL VAULT]
              </div>
              <h3 className="font-neo-serif text-xl font-bold text-white uppercase mb-4">
                RAISE ESCROW DISPUTE
              </h3>

              <form onSubmit={handleDisputeSubmit}>
                <label className="block text-xs font-mono uppercase text-white mb-2">
                  STATE REASON FOR DISPUTE / SPECIFICATION BREACH
                </label>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={e => setDisputeReason(e.target.value)}
                  placeholder="e.g. Freelancer failed to satisfy cryptographic acceptance criteria..."
                  className="w-full bg-black border border-white p-3 font-mono text-xs text-white focus:outline-none focus:border-[#FF3333] mb-4"
                />

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="tactile-btn-secondary px-4 py-2 text-xs font-mono uppercase"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="tactile-btn-danger px-4 py-2 text-xs font-mono uppercase"
                  >
                    FREEZE ESCROW VAULT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
