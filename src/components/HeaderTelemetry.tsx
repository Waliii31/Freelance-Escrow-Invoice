import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { shortenAddress, formatUSDC, BOT_CHAIN_CONFIG } from '../utils/contracts';
import { 
  Volume2, 
  VolumeX, 
  Wallet, 
  Coins,
  ArrowRightLeft,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const HeaderTelemetry: React.FC = () => {
  const {
    account,
    isMetaMask,
    chainId,
    networkName,
    userRole,
    clientBalanceUSDC,
    freelancerBalanceUSDC,
    ethBalance,
    connectMetaMask,
    disconnect,
    switchRole,
    switchNetworkToBotChain,
    mintFaucetUSDC,
    soundEnabled,
    toggleSound,
    isProcessing,
    statusMessage
  } = useWeb3();

  const isWrongChain = isMetaMask && chainId !== BOT_CHAIN_CONFIG.chainId;

  return (
    <header className="w-full bg-black border-b border-white sticky top-0 z-50">
      {/* Top micro-ticker telemetry bar */}
      <div className="w-full bg-black border-b border-[#333333] px-3 py-1 flex flex-wrap items-center justify-between text-[11px] font-mono tracking-wider text-[#888888]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-white font-bold">
            <span className="inline-block w-2 h-2 bg-[#00FF66] mr-1.5 animate-pulse"></span>
            SYS://ESCROW.PROTOCOL.V6
          </span>
          <span className="hidden sm:inline text-[#444444]">|</span>
          <a
            href={BOT_CHAIN_CONFIG.botchainUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#00FF66] flex items-center font-bold"
          >
            POWERED BY BOTCHAIN
            <ExternalLink size={10} className="ml-1 text-[#00FF66]" />
          </a>
          <span className="hidden sm:inline text-[#444444]">|</span>
          <a
            href={BOT_CHAIN_CONFIG.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center text-[#AAAAAA] hover:text-[#00FF66]"
          >
            SCAN: scan.botchain.ai
          </a>
          <span className="hidden sm:inline text-[#444444]">|</span>
          <span className="text-[#00FF66] font-semibold flex items-center">
            {networkName.toUpperCase()} [ID: {chainId || 677}]
          </span>
        </div>

        <div className="flex items-center space-x-3 mt-1 sm:mt-0">
          <span className="text-white">
            CLIENT USDC: <span className="text-[#00FF66] font-bold">{formatUSDC(clientBalanceUSDC)}</span>
          </span>
          <span className="text-[#444444]">|</span>
          <span className="text-white">
            DEV USDC: <span className="text-[#00FF66] font-bold">{formatUSDC(freelancerBalanceUSDC)}</span>
          </span>
          <span className="text-[#444444]">|</span>
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute mechanical sounds" : "Enable mechanical sounds"}
            className="text-white hover:text-[#00FF66] flex items-center p-0.5 border border-[#444444] hover:border-[#00FF66]"
          >
            {soundEnabled ? <Volume2 size={12} className="text-[#00FF66]" /> : <VolumeX size={12} />}
          </button>
        </div>
      </div>

      {/* Main Stark Brutalist Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black border-2 border-white flex items-center justify-center font-bold text-lg font-mono text-[#00FF66] shadow-[2px_2px_0px_#FFFFFF]">
            $E
          </div>
          <div>
            <div className="text-lg font-black tracking-tight uppercase font-neo-serif leading-none flex items-center">
              <span>FREELANCE ESCROW</span>
              <span className="ml-2 text-[10px] font-mono px-1 py-0.5 bg-black border border-[#00FF66] text-[#00FF66]">
                BOT CHAIN MAINNET
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#888888] tracking-widest uppercase mt-0.5">
              NON-CUSTODIAL USDC DISBURSEMENT ENGINE // POWERED BY BOTCHAIN
            </div>
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-mono">
          <a href="#section-hero" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [01: ENGINE]
          </a>
          <a href="#section-creator" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [02: CREATE]
          </a>
          <a href="#section-vault" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [03: VAULT]
          </a>
          <a href="#section-slip" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [04: RECEIPT]
          </a>
          <a href="#section-spec" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [05: SOLIDITY]
          </a>
          <a href="#section-lab" className="px-2.5 py-1 text-[#AAAAAA] hover:text-black hover:bg-white border border-transparent hover:border-white transition-none">
            [06: LAB & LOGS]
          </a>
        </nav>

        {/* Tactical Controls & Wallet Connect */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Role Switcher */}
          <div className="flex items-center border border-white bg-black p-0.5 text-xs font-mono">
            <span className="text-[10px] text-[#888888] px-1.5 uppercase font-bold flex items-center">
              <ArrowRightLeft size={10} className="mr-1 text-[#00FF66]" /> ROLE:
            </span>
            <button
              onClick={() => switchRole('client')}
              className={`px-2 py-1 uppercase font-bold text-[11px] transition-none ${
                userRole === 'client'
                  ? 'bg-white text-black font-extrabold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              CLIENT
            </button>
            <button
              onClick={() => switchRole('freelancer')}
              className={`px-2 py-1 uppercase font-bold text-[11px] transition-none ${
                userRole === 'freelancer'
                  ? 'bg-[#00FF66] text-black font-extrabold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              FREELANCER
            </button>
          </div>

          {/* Faucet button */}
          <button
            onClick={() => mintFaucetUSDC(userRole === 'freelancer' ? 'freelancer' : 'client', 1000)}
            className="px-2.5 py-1.5 border border-white text-white hover:bg-[#00FF66] hover:text-black text-xs font-mono font-bold flex items-center transition-none"
            title="Mint 1,000 mock USDC for testing"
          >
            <Coins size={12} className="mr-1.5 text-[#00FF66]" />
            FAUCET +$1K
          </button>

          {/* Wrong Chain Switcher alert button */}
          {isWrongChain && (
            <button
              onClick={switchNetworkToBotChain}
              className="tactile-btn-primary px-2.5 py-1.5 text-xs font-mono uppercase font-black flex items-center animate-pulse"
              title="Click to switch MetaMask to BOT Chain Mainnet (Chain ID 677)"
            >
              <AlertCircle size={13} className="mr-1 text-black" />
              SWITCH TO BOT CHAIN (677)
            </button>
          )}

          {/* Wallet State / MetaMask Button */}
          {isMetaMask ? (
            <div className="flex items-center">
              <div className="border border-white bg-black px-3 py-1.5 text-xs font-mono flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#00FF66]"></span>
                <span className="font-bold text-white">{shortenAddress(account)}</span>
                <span className="text-[#888888] text-[10px]">({ethBalance})</span>
              </div>
              <button
                onClick={disconnect}
                className="ml-1 px-2 py-1.5 border border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-black text-xs font-mono font-bold"
                title="Disconnect MetaMask and switch to Simulator"
              >
                DISCONNECT
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={connectMetaMask}
                className="tactile-btn-primary px-3 py-1.5 text-xs font-mono uppercase flex items-center"
              >
                <Wallet size={13} className="mr-1.5" />
                CONNECT METAMASK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Processing Banner if transaction is mining */}
      {isProcessing && (
        <div className="w-full bg-[#00FF66] text-black px-4 py-1.5 text-xs font-mono font-bold flex items-center justify-center space-x-2 border-t border-b border-black">
          <span className="inline-block w-3 h-3 border-2 border-black border-t-transparent animate-spin"></span>
          <span>[BLOCKCHAIN TX IN PROGRESS]: {statusMessage}</span>
        </div>
      )}
    </header>
  );
};
