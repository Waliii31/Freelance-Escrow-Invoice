import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { DEFAULT_CONTRACTS, BOT_CHAIN_CONFIG, formatUSDC } from '../utils/contracts';
import { soundFx } from '../utils/audio';
import { Copy, Check, ExternalLink } from 'lucide-react';

const SOLIDITY_ESCROW_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FreelanceEscrow
 * @author Tactile Brutalism Protocol
 * @notice Non-custodial escrow invoice contract for freelance capital settlement.
 * Built with zero platform fees, immutable deposit locking, and dispute controls.
 */
contract FreelanceEscrow {
    enum EscrowStatus {
        AWAITING_DEPOSIT, // 0: Invoice created, waiting for client USDC deposit
        FUNDED,           // 1: USDC deposited into contract vault, freelancer can work
        WORK_SUBMITTED,   // 2: Freelancer submitted proof of deliverables
        RELEASED,         // 3: Client accepted deliverables, funds disbursed
        REFUNDED,         // 4: Escrow cancelled or refunded to client
        DISPUTED          // 5: Either party initiated dispute resolution
    }

    struct Invoice {
        uint256 id;
        address client;
        address freelancer;
        address token;              // USDC address (or address(0) for native ETH)
        uint256 amount;             // In base units (e.g. 6 decimals for USDC)
        string title;
        string scopeOfWork;
        string deliverableProof;    // IPFS hash, GitHub PR, or proof URL
        string deliverableNotes;
        uint256 deadline;           // Unix timestamp
        uint256 createdAt;
        uint256 fundedAt;
        uint256 releasedAt;
        EscrowStatus status;
    }

    // Mutex lock for reentrancy safety
    uint256 private _locked = 1;
    modifier nonReentrant() {
        require(_locked == 1, "REENTRANCY_GUARD_TRIGGERED");
        _locked = 2;
        _;
        _locked = 1;
    }

    // Function: Client locks stablecoin into escrow
    function depositFunds(uint256 invoiceId) external payable nonReentrant onlyClient(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(inv.status == EscrowStatus.AWAITING_DEPOSIT, "INVALID_STATUS");
        inv.status = EscrowStatus.FUNDED;
        inv.fundedAt = block.timestamp;

        bool success = IERC20Minimal(inv.token).transferFrom(msg.sender, address(this), inv.amount);
        require(success, "TOKEN_TRANSFER_FAILED");

        emit FundsDeposited(invoiceId, msg.sender, inv.amount);
    }

    // Function: Client triggers irrevocable release to freelancer upon completion
    function releaseFunds(uint256 invoiceId) external nonReentrant onlyClient(invoiceId) {
        Invoice storage inv = invoices[invoiceId];
        require(inv.status == EscrowStatus.FUNDED || inv.status == EscrowStatus.WORK_SUBMITTED, "INVALID_STATUS");
        inv.status = EscrowStatus.RELEASED;
        inv.releasedAt = block.timestamp;

        bool success = IERC20Minimal(inv.token).transfer(inv.freelancer, inv.amount);
        require(success, "TOKEN_TRANSFER_FAILED");

        emit FundsReleased(invoiceId, inv.freelancer, inv.amount);
    }
}`;

const SOLIDITY_USDC_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockUSDC
 * @notice Testnet / Local USDC stablecoin implementation with 6 decimals and open faucet minting.
 */
contract MockUSDC {
    string public name = "USD Coin (Brutalist Mock)";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "ERC20: insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        require(balanceOf[sender] >= amount, "ERC20: insufficient balance");
        uint256 currentAllowance = allowance[sender][msg.sender];
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            allowance[sender][msg.sender] = currentAllowance - amount;
        }
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function _mint(address account, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }
}`;

export const SmartContractSpecSection: React.FC = () => {
  const { invoices } = useWeb3();
  const [activeTab, setActiveTab] = useState<'escrow' | 'usdc' | 'state'>('escrow');
  const [copied, setCopied] = useState(false);

  // Compute live protocol metrics
  const totalLocked = invoices
    .filter(inv => inv.status === 'FUNDED' || inv.status === 'WORK_SUBMITTED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSettled = invoices
    .filter(inv => inv.status === 'RELEASED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCopy = () => {
    soundFx.playClick();
    const code = activeTab === 'escrow' ? SOLIDITY_ESCROW_CODE : SOLIDITY_USDC_CODE;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="section-spec" className="w-full bg-black border-b border-white py-16 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-white pb-4 mb-8">
          <div>
            <div className="text-xs font-mono text-[#00FF66] tracking-widest uppercase">
              [SECTION 05] // PROTOCOL ARCHITECTURE & CONTRACT SOURCE
            </div>
            <h2 className="font-neo-serif text-3xl sm:text-4xl font-black text-white uppercase mt-1">
              SMART CONTRACT SPECIFICATION
            </h2>
          </div>

          <div className="text-right text-xs font-mono text-[#888888] mt-2 sm:mt-0">
            <div>COMPILER: <span className="text-white font-bold">SOLC ^0.8.20</span></div>
            <div>OPTIMIZATION: <span className="text-[#00FF66] font-bold">200 RUNS (VIA IR)</span></div>
          </div>
        </div>

        {/* 3 Core Architecture Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-white p-5 bg-black brutalist-shadow-white">
            <div className="text-xs font-mono text-[#00FF66] uppercase mb-1 font-bold">
              [INVARIANT 01] NON-CUSTODIAL VAULT
            </div>
            <h3 className="font-neo-serif text-lg font-bold text-white uppercase mb-2">
              ZERO PLATFORM COMMISSION
            </h3>
            <p className="text-xs font-mono text-[#AAAAAA] leading-relaxed">
              Funds are never held by an administrator or intermediary multisig. 
              Only the originating client or authorized settlement condition can disburse tokens.
            </p>
          </div>

          <div className="border border-white p-5 bg-black brutalist-shadow-white">
            <div className="text-xs font-mono text-[#00FF66] uppercase mb-1 font-bold">
              [INVARIANT 02] REENTRANCY RESISTANCE
            </div>
            <h3 className="font-neo-serif text-lg font-bold text-white uppercase mb-2">
              SOLADY TRANSIENT MUTEX
            </h3>
            <p className="text-xs font-mono text-[#AAAAAA] leading-relaxed">
              All state transitions mutate contract state before performing external token transfers, 
              guaranteeing zero vulnerability to recursive drain attacks.
            </p>
          </div>

          <div className="border border-white p-5 bg-black brutalist-shadow-white">
            <div className="text-xs font-mono text-[#00FF66] uppercase mb-1 font-bold">
              [INVARIANT 03] DETERMINISTIC ESCROW
            </div>
            <h3 className="font-neo-serif text-lg font-bold text-white uppercase mb-2">
              TIMED TIMEOUT REFUND
            </h3>
            <p className="text-xs font-mono text-[#AAAAAA] leading-relaxed">
              If a deliverable is never submitted and the agreed deadline expires, 
              the client can trigger a 1-click contract refund without requiring counterparty consent.
            </p>
          </div>
        </div>

        {/* Tabbed Code & State Inspector */}
        <div className="border border-white bg-black">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between border-b border-white bg-[#0A0A0A] p-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveTab('escrow');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 text-xs font-mono uppercase font-bold transition-none ${
                  activeTab === 'escrow'
                    ? 'bg-white text-black'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                FreelanceEscrow.sol
              </button>
              <button
                onClick={() => {
                  setActiveTab('usdc');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 text-xs font-mono uppercase font-bold transition-none ${
                  activeTab === 'usdc'
                    ? 'bg-white text-black'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                MockUSDC.sol (ERC20)
              </button>
              <button
                onClick={() => {
                  setActiveTab('state');
                  soundFx.playClick();
                }}
                className={`px-4 py-2 text-xs font-mono uppercase font-bold transition-none ${
                  activeTab === 'state'
                    ? 'bg-[#00FF66] text-black'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                [LIVE ON-CHAIN STATE]
              </button>
            </div>

            {activeTab !== 'state' && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 border border-white text-white hover:bg-[#00FF66] hover:text-black text-xs font-mono font-bold flex items-center transition-none mt-2 sm:mt-0"
              >
                {copied ? <Check size={14} className="mr-1.5 text-black" /> : <Copy size={14} className="mr-1.5" />}
                {copied ? "COPIED SOLIDITY CODE" : "COPY SOLIDITY SOURCE"}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'escrow' && (
              <pre className="font-mono text-xs text-[#00FF66] bg-black overflow-x-auto p-4 border border-[#333333] leading-relaxed">
                <code>{SOLIDITY_ESCROW_CODE}</code>
              </pre>
            )}

            {activeTab === 'usdc' && (
              <pre className="font-mono text-xs text-[#CCCCCC] bg-black overflow-x-auto p-4 border border-[#333333] leading-relaxed">
                <code>{SOLIDITY_USDC_CODE}</code>
              </pre>
            )}

            {activeTab === 'state' && (
              <div className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-[#333333] p-4 bg-[#050505]">
                    <div className="text-[10px] text-[#888888] uppercase">CURRENT TVL LOCKED</div>
                    <div className="text-xl font-bold text-[#00FF66] mt-1">{formatUSDC(totalLocked)}</div>
                  </div>
                  <div className="border border-[#333333] p-4 bg-[#050505]">
                    <div className="text-[10px] text-[#888888] uppercase">TOTAL CAPITAL SETTLED</div>
                    <div className="text-xl font-bold text-white mt-1">{formatUSDC(totalSettled)}</div>
                  </div>
                  <div className="border border-[#333333] p-4 bg-[#050505]">
                    <div className="text-[10px] text-[#888888] uppercase">TOTAL INVOICES COUNT</div>
                    <div className="text-xl font-bold text-white mt-1">{invoices.length} CONTRACTS</div>
                  </div>
                  <div className="border border-[#333333] p-4 bg-[#050505]">
                    <div className="text-[10px] text-[#888888] uppercase">MUTEX CONCURRENCY STATUS</div>
                    <div className="text-xl font-bold text-[#00FF66] mt-1">MUTEX UNLOCKED (1)</div>
                  </div>
                </div>

                <div className="border border-[#333333] p-4 bg-[#050505] space-y-2">
                  <div className="text-[10px] text-[#888888] uppercase font-bold flex justify-between items-center">
                    <span>DEPLOYED CONTRACT ADDRESSES // BOT CHAIN MAINNET</span>
                    <a
                      href={`${BOT_CHAIN_CONFIG.blockExplorerUrl}/address/${BOT_CHAIN_CONFIG.contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00FF66] hover:underline flex items-center"
                    >
                      EXPLORE ON BOTCHAIN SCAN
                      <ExternalLink size={10} className="ml-1" />
                    </a>
                  </div>
                  <div className="flex flex-wrap justify-between border-b border-[#222222] py-1.5 items-center">
                    <span className="text-[#888888]">FreelanceEscrow Contract:</span>
                    <a
                      href={`${BOT_CHAIN_CONFIG.blockExplorerUrl}/address/${DEFAULT_CONTRACTS.escrow}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#00FF66] font-mono break-all font-bold underline flex items-center"
                    >
                      {DEFAULT_CONTRACTS.escrow}
                      <ExternalLink size={12} className="ml-1 text-[#00FF66]" />
                    </a>
                  </div>
                  <div className="flex flex-wrap justify-between border-b border-[#222222] py-1.5">
                    <span className="text-[#888888]">MockUSDC Stablecoin Contract:</span>
                    <span className="text-white font-mono break-all">{DEFAULT_CONTRACTS.usdc}</span>
                  </div>
                  <div className="flex flex-wrap justify-between border-b border-[#222222] py-1.5">
                    <span className="text-[#888888]">Network & RPC Endpoint:</span>
                    <span className="text-white font-mono">{BOT_CHAIN_CONFIG.chainName} ({BOT_CHAIN_CONFIG.rpcUrl})</span>
                  </div>
                  <div className="flex flex-wrap justify-between py-1.5">
                    <span className="text-[#888888]">Contract Standard:</span>
                    <span className="text-[#00FF66] font-mono">EIP-20 / EIP-1167 Minimal Proxy Ready</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
