import React, { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import type { Invoice, TransactionLog, UserRole } from '../types/escrow';
import { 
  DEMO_ADDRESSES, 
  DEFAULT_CONTRACTS, 
  BOT_CHAIN_CONFIG,
  formatUSDC, 
  generateTxHash, 
  generateDigest 
} from '../utils/contracts';
import { soundFx } from '../utils/audio';

interface Web3ContextType {
  // Wallet state
  account: string;
  isConnected: boolean;
  isMetaMask: boolean;
  chainId: number | null;
  networkName: string;
  userRole: UserRole;
  clientBalanceUSDC: number;
  freelancerBalanceUSDC: number;
  ethBalance: string;
  isSimulationMode: boolean;
  
  // Actions
  connectMetaMask: () => Promise<void>;
  disconnect: () => void;
  switchRole: (role: UserRole) => void;
  switchNetworkToBotChain: () => Promise<void>;
  mintFaucetUSDC: (targetRole?: 'client' | 'freelancer', amount?: number) => void;
  createInvoice: (params: {
    freelancer: string;
    amount: number;
    title: string;
    scopeOfWork: string;
    deadlineDays: number;
  }) => Promise<string>;
  depositFunds: (invoiceId: string) => Promise<boolean>;
  submitDeliverable: (invoiceId: string, proofUrl: string, notes: string) => Promise<boolean>;
  releaseFunds: (invoiceId: string) => Promise<boolean>;
  refundFunds: (invoiceId: string) => Promise<boolean>;
  raiseDispute: (invoiceId: string, reason: string) => Promise<boolean>;
  
  // Data
  invoices: Invoice[];
  activeInvoice: Invoice | null;
  activeInvoiceId: string;
  setActiveInvoiceId: (id: string) => void;
  logs: TransactionLog[];
  clearLogs: () => void;
  
  // Audio settings
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // UI Status
  isProcessing: boolean;
  statusMessage: string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Initial mock invoices showing realistic Tactile Brutalism contracts configured for BOT Chain Mainnet
const INITIAL_INVOICES: Invoice[] = [
  {
    id: "INV-2026-X01",
    serialNumber: "ESC-8921-A",
    client: DEMO_ADDRESSES.client,
    freelancer: DEMO_ADDRESSES.freelancer,
    tokenSymbol: "USDC",
    tokenAddress: DEFAULT_CONTRACTS.usdc,
    amount: 2800,
    title: "TACTILE BRUTALISM DAPP PROTOCOL // CORE FRONTEND",
    scopeOfWork: "Implement uncompromising wireframe dark-mode interface in React 19 + Tailwind v4, 0px border-radius, pure pitch black, 1px solid white borders, and BOT Chain Mainnet contract integration.",
    deliverableProof: "https://github.com/protocol-archive/tactile-escrow/pull/88",
    deliverableNotes: "PR ready for inspection. Unit tests 100% passing. Audited against Solady reentrancy vectors. Production build verified on BOT Chain.",
    deadline: Date.now() + 86400000 * 5,
    createdAt: Date.now() - 86400000 * 3,
    fundedAt: Date.now() - 86400000 * 2,
    status: "WORK_SUBMITTED",
    txHashDeposit: "0x89f4b321c8e100a9d0124fe728c6a0129bcfe0418931b621e8432a98f121d451",
    txHashDeliverable: "0x412d098eabf8291048bc720198de71a2bf9012cd31a892b109e4521fa9108b29"
  },
  {
    id: "INV-2026-X02",
    serialNumber: "ESC-4402-B",
    client: DEMO_ADDRESSES.client,
    freelancer: DEMO_ADDRESSES.freelancer,
    tokenSymbol: "USDC",
    tokenAddress: DEFAULT_CONTRACTS.usdc,
    amount: 4500,
    title: "SOLADY NON-CUSTODIAL ESCROW SMART CONTRACT SUITE",
    scopeOfWork: "Architect, formally verify, and deploy FreelanceEscrow.sol on BOT Chain Mainnet (Chain ID 677) with minimal gas bytecode, reentrancy guards, and emergency multi-party refund locks.",
    deliverableProof: "",
    deliverableNotes: "",
    deadline: Date.now() + 86400000 * 12,
    createdAt: Date.now() - 86400000 * 1,
    fundedAt: Date.now() - 86400000 * 1,
    status: "FUNDED",
    txHashDeposit: "0xc842109df341ba109fde023189ba765412398acbed90123910248cbe09124baa"
  },
  {
    id: "INV-2026-X03",
    serialNumber: "ESC-1190-C",
    client: DEMO_ADDRESSES.client,
    freelancer: DEMO_ADDRESSES.freelancer,
    tokenSymbol: "USDC",
    tokenAddress: DEFAULT_CONTRACTS.usdc,
    amount: 6200,
    title: "ZK-SNARK VERIFIER INTEGRATION FOR WORK DELIVERABLES",
    scopeOfWork: "Zero-knowledge proof pipeline enabling confidential deliverable validation prior to on-chain capital disbursement on BOT Chain.",
    deliverableProof: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    deliverableNotes: "Verification circuits compiled with Circom 2.1. Groth16 on-chain proof passed gas threshold on BOT Chain.",
    deadline: Date.now() - 86400000 * 10,
    createdAt: Date.now() - 86400000 * 20,
    fundedAt: Date.now() - 86400000 * 18,
    releasedAt: Date.now() - 86400000 * 9,
    status: "RELEASED",
    txHashDeposit: "0x1149afbcde9021849103948bfe01293ac091b29a8c01289fe91a0cba8e9102f4",
    txHashRelease: "0x789012f45812e9b01c34a91280fde0912bc9a81284fe9012abfe0912841209ef"
  }
];

const INITIAL_LOGS: TransactionLog[] = [
  {
    id: "log-001",
    timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString(),
    type: "DEPOSIT",
    invoiceId: "INV-2026-X01",
    txHash: "0x89f4b321c8e100a9d0124fe728c6a0129bcfe0418931b621e8432a98f121d451",
    from: DEMO_ADDRESSES.client,
    details: `Locked 2,800.00 USDC in FreelanceEscrow Vault [${DEFAULT_CONTRACTS.escrow.substring(0, 10)}...] on BOT Chain Mainnet`,
    gasUsed: 54102
  },
  {
    id: "log-002",
    timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(),
    type: "SUBMIT",
    invoiceId: "INV-2026-X01",
    txHash: "0x412d098eabf8291048bc720198de71a2bf9012cd31a892b109e4521fa9108b29",
    from: DEMO_ADDRESSES.freelancer,
    details: "Deliverable submitted: Pull Request #88 (Tactile Brutalism Frontend)",
    gasUsed: 31204
  }
];

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string>(DEMO_ADDRESSES.client);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isMetaMask, setIsMetaMask] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(BOT_CHAIN_CONFIG.chainId);
  const [networkName, setNetworkName] = useState<string>(BOT_CHAIN_CONFIG.chainName);
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  
  const [clientBalanceUSDC, setClientBalanceUSDC] = useState<number>(15000);
  const [freelancerBalanceUSDC, setFreelancerBalanceUSDC] = useState<number>(3200);
  const [ethBalance, setEthBalance] = useState<string>("24.500 BOT");
  
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string>("INV-2026-X01");
  const [logs, setLogs] = useState<TransactionLog[]>(INITIAL_LOGS);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Find active invoice
  const activeInvoice = invoices.find(inv => inv.id === activeInvoiceId) || invoices[0] || null;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playClick();
  };

  const addLog = useCallback((type: TransactionLog['type'], details: string, invoiceId?: string, gasUsed = 48000) => {
    const newLog: TransactionLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      invoiceId,
      txHash: generateTxHash(),
      from: account,
      details,
      gasUsed
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, [account]);

  // Switch MetaMask Network to BOT Chain Mainnet (Chain ID 677)
  const switchNetworkToBotChain = async () => {
    soundFx.playClick();
    if (typeof window === 'undefined') return;

    const eth = (window as unknown as { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    } }).ethereum;

    if (!eth) {
      alert("METAMASK EXTENSION NOT DETECTED. Please install MetaMask to switch networks.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage("CONFIGURING METAMASK TO BOT CHAIN MAINNET (CHAIN ID 677)...");

      try {
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BOT_CHAIN_CONFIG.chainIdHex }]
        });
      } catch (switchError: unknown) {
        const err = switchError as { code?: number; data?: { originalError?: { code?: number } } };
        // Chain not added to MetaMask yet: add it automatically!
        if (err.code === 4902 || err?.data?.originalError?.code === 4902) {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BOT_CHAIN_CONFIG.chainIdHex,
              chainName: BOT_CHAIN_CONFIG.chainName,
              nativeCurrency: {
                name: BOT_CHAIN_CONFIG.currencyName,
                symbol: BOT_CHAIN_CONFIG.currencySymbol,
                decimals: BOT_CHAIN_CONFIG.currencyDecimals
              },
              rpcUrls: [BOT_CHAIN_CONFIG.rpcUrl],
              blockExplorerUrls: [BOT_CHAIN_CONFIG.blockExplorerUrl]
            }]
          });
        } else {
          throw switchError;
        }
      }

      setChainId(BOT_CHAIN_CONFIG.chainId);
      setNetworkName(BOT_CHAIN_CONFIG.chainName);
      addLog("FAUCET", `Switched to ${BOT_CHAIN_CONFIG.chainName} [RPC: ${BOT_CHAIN_CONFIG.rpcUrl}]`);
    } catch (err: unknown) {
      console.error("Network switch to BOT Chain Mainnet failed:", err);
      alert(`Could not switch to BOT Chain Mainnet: ${(err as Error)?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  // Connect MetaMask
  const connectMetaMask = async () => {
    soundFx.playClick();
    if (typeof window === 'undefined') return;

    const eth = (window as unknown as { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (args: unknown) => void) => void;
    } }).ethereum;

    if (!eth) {
      alert("METAMASK EXTENSION NOT DETECTED. Using Tactile Brutalism High-Speed Local Simulation Mode.");
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage("REQUESTING METAMASK ACCOUNTS AUTHORIZATION...");
      const accounts = await eth.request({ method: 'eth_requestAccounts' }) as string[];
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setIsMetaMask(true);
        setIsSimulationMode(false);

        // Get chain ID
        const chainHex = await eth.request({ method: 'eth_chainId' }) as string;
        const cid = parseInt(chainHex, 16);
        setChainId(cid);

        // If not on BOT Chain Mainnet, prompt switch
        if (cid !== BOT_CHAIN_CONFIG.chainId) {
          try {
            await switchNetworkToBotChain();
          } catch {
            // User can switch manually later
          }
        }

        if (cid === BOT_CHAIN_CONFIG.chainId) {
          setNetworkName(BOT_CHAIN_CONFIG.chainName);
        } else if (cid === 11155111) setNetworkName("Ethereum Sepolia Testnet");
        else if (cid === 1) setNetworkName("Ethereum Mainnet");
        else if (cid === 137) setNetworkName("Polygon Mainnet");
        else if (cid === 80002) setNetworkName("Polygon Amoy Testnet");
        else if (cid === 31337 || cid === 1337) setNetworkName("Hardhat / Localhost Node");
        else setNetworkName(`Chain ID #${cid}`);

        // Read native balance
        try {
          const provider = new ethers.BrowserProvider(eth as unknown as ethers.Eip1193Provider);
          const bal = await provider.getBalance(accounts[0]);
          const symbol = cid === BOT_CHAIN_CONFIG.chainId ? "BOT" : "ETH";
          setEthBalance(`${parseFloat(ethers.formatEther(bal)).toFixed(4)} ${symbol}`);
        } catch {
          // fallback
        }

        addLog("FAUCET", `MetaMask Connected: ${accounts[0]} on ${networkName}`);
      }
    } catch (err: unknown) {
      console.error("MetaMask connection failed:", err);
      alert(`MetaMask connection rejected: ${(err as Error)?.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  };

  const disconnect = () => {
    soundFx.playClick();
    setIsMetaMask(false);
    setIsSimulationMode(true);
    setAccount(DEMO_ADDRESSES.client);
    setUserRole('client');
    setNetworkName(BOT_CHAIN_CONFIG.chainName);
    addLog("FAUCET", "Switched back to Tactile Simulator Engine on BOT Chain Mainnet");
  };

  // Switch Role in Simulation Mode
  const switchRole = (role: UserRole) => {
    soundFx.playClick();
    setUserRole(role);
    if (isSimulationMode) {
      if (role === 'client') {
        setAccount(DEMO_ADDRESSES.client);
      } else if (role === 'freelancer') {
        setAccount(DEMO_ADDRESSES.freelancer);
      } else {
        setAccount(DEMO_ADDRESSES.arbitrator);
      }
    }
  };

  // Faucet minting
  const mintFaucetUSDC = (targetRole: 'client' | 'freelancer' = 'client', amount = 1000) => {
    soundFx.playClick();
    if (targetRole === 'client') {
      setClientBalanceUSDC(prev => prev + amount);
    } else {
      setFreelancerBalanceUSDC(prev => prev + amount);
    }
    addLog("FAUCET", `Minted ${formatUSDC(amount)} to ${targetRole.toUpperCase()} [${targetRole === 'client' ? DEMO_ADDRESSES.client : DEMO_ADDRESSES.freelancer}]`);
  };

  // Create Escrow Invoice
  const createInvoice = async ({
    freelancer,
    amount,
    title,
    scopeOfWork,
    deadlineDays
  }: {
    freelancer: string;
    amount: number;
    title: string;
    scopeOfWork: string;
    deadlineDays: number;
  }): Promise<string> => {
    soundFx.playRelayLock();
    setIsProcessing(true);
    setStatusMessage("MINING INVOICE CONTRACT DEPLOYMENT TRANSACTION ON BOT CHAIN...");

    await new Promise(r => setTimeout(r, 600));

    const invoiceId = `INV-2026-X0${invoices.length + 1}`;
    const serial = `ESC-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const txHash = generateTxHash();

    const newInvoice: Invoice = {
      id: invoiceId,
      serialNumber: serial,
      client: account,
      freelancer: freelancer || DEMO_ADDRESSES.freelancer,
      tokenSymbol: "USDC",
      tokenAddress: DEFAULT_CONTRACTS.usdc,
      amount,
      title: title || "UNTITLED FREELANCE CONTRACT",
      scopeOfWork: scopeOfWork || "Standard deliverable terms governed by Escrow Protocol V6 on BOT Chain Mainnet",
      deliverableProof: "",
      deliverableNotes: "",
      deadline: Date.now() + 86400000 * (deadlineDays || 7),
      createdAt: Date.now(),
      status: "AWAITING_DEPOSIT",
      txHashCreate: txHash
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setActiveInvoiceId(invoiceId);

    addLog(
      "CREATE",
      `Invoice ${newInvoice.id} created (${formatUSDC(amount)}) for Freelancer [${freelancer.substring(0, 8)}...]`,
      newInvoice.id,
      62000
    );

    setIsProcessing(false);
    setStatusMessage("");
    return invoiceId;
  };

  // Deposit Funds
  const depositFunds = async (invoiceId: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    if (clientBalanceUSDC < inv.amount) {
      soundFx.playHazard();
      alert(`INSUFFICIENT USDC BALANCE: You have ${formatUSDC(clientBalanceUSDC)}, but invoice requires ${formatUSDC(inv.amount)}. Use the FAUCET button in the top bar to mint test USDC!`);
      return false;
    }

    soundFx.playRelayLock();
    setIsProcessing(true);
    setStatusMessage("APPROVING USDC & LOCKING CAPITAL IN BOT CHAIN ESCROW VAULT...");

    await new Promise(r => setTimeout(r, 800));

    // Deduct client balance
    setClientBalanceUSDC(prev => prev - inv.amount);

    const txHash = generateTxHash();
    setInvoices(prev => prev.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          status: "FUNDED",
          fundedAt: Date.now(),
          txHashDeposit: txHash
        };
      }
      return item;
    }));

    addLog(
      "DEPOSIT",
      `Locked ${formatUSDC(inv.amount)} in Escrow Vault for [${inv.id}]. Digest: ${generateDigest(inv.title).substring(0, 16)}...`,
      inv.id,
      58400
    );

    setIsProcessing(false);
    setStatusMessage("");
    return true;
  };

  // Submit Deliverable
  const submitDeliverable = async (invoiceId: string, proofUrl: string, notes: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    soundFx.playRelayLock();
    setIsProcessing(true);
    setStatusMessage("REGISTERING DELIVERABLE PROOF ON BOT CHAIN SCAN...");

    await new Promise(r => setTimeout(r, 600));

    const txHash = generateTxHash();
    setInvoices(prev => prev.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          status: "WORK_SUBMITTED",
          deliverableProof: proofUrl || "https://github.com/freelance-repo/deliverables",
          deliverableNotes: notes || "Work delivered and validated according to specifications.",
          txHashDeliverable: txHash
        };
      }
      return item;
    }));

    addLog(
      "SUBMIT",
      `Freelancer submitted deliverable for [${inv.id}]: ${proofUrl || 'Repository link'}`,
      inv.id,
      34100
    );

    setIsProcessing(false);
    setStatusMessage("");
    return true;
  };

  // Release Funds to Freelancer
  const releaseFunds = async (invoiceId: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    soundFx.playRelayLock();
    setIsProcessing(true);
    setStatusMessage("TRIGGERING IRREVOCABLE SMART CONTRACT RELEASE TRANSACTION ON BOT CHAIN...");

    await new Promise(r => setTimeout(r, 900));

    // Credit freelancer balance
    setFreelancerBalanceUSDC(prev => prev + inv.amount);

    const txHash = generateTxHash();
    setInvoices(prev => prev.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          status: "RELEASED",
          releasedAt: Date.now(),
          txHashRelease: txHash
        };
      }
      return item;
    }));

    addLog(
      "RELEASE",
      `Disbursed ${formatUSDC(inv.amount)} from Vault to Freelancer [${inv.freelancer.substring(0, 8)}...]. Settlement complete on BOT Chain.`,
      inv.id,
      41200
    );

    soundFx.playReleaseSuccess();
    setIsProcessing(false);
    setStatusMessage("");
    return true;
  };

  // Refund Funds to Client
  const refundFunds = async (invoiceId: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    soundFx.playHazard();
    setIsProcessing(true);
    setStatusMessage("EXECUTING TIMED ESCROW REFUND TO CLIENT...");

    await new Promise(r => setTimeout(r, 700));

    setClientBalanceUSDC(prev => prev + inv.amount);

    setInvoices(prev => prev.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          status: "REFUNDED"
        };
      }
      return item;
    }));

    addLog(
      "REFUND",
      `Escrow refunded. ${formatUSDC(inv.amount)} returned to Client [${inv.client.substring(0, 8)}...].`,
      inv.id,
      38900
    );

    setIsProcessing(false);
    setStatusMessage("");
    return true;
  };

  // Raise Dispute
  const raiseDispute = async (invoiceId: string, reason: string): Promise<boolean> => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return false;

    soundFx.playHazard();
    setIsProcessing(true);
    setStatusMessage("FREEZING ESCROW VAULT // ESCALATING TO DISPUTE LOG...");

    await new Promise(r => setTimeout(r, 600));

    setInvoices(prev => prev.map(item => {
      if (item.id === invoiceId) {
        return {
          ...item,
          status: "DISPUTED",
          disputeReason: reason || "Deliverable failed technical specification criteria."
        };
      }
      return item;
    }));

    addLog(
      "DISPUTE",
      `Dispute raised on [${inv.id}] by [${account.substring(0, 8)}...]: ${reason || 'Specification conflict'}`,
      inv.id,
      46800
    );

    setIsProcessing(false);
    setStatusMessage("");
    return true;
  };

  const clearLogs = () => {
    soundFx.playClick();
    setLogs([]);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isMetaMask,
        chainId,
        networkName,
        userRole,
        clientBalanceUSDC,
        freelancerBalanceUSDC,
        ethBalance,
        isSimulationMode,
        connectMetaMask,
        disconnect,
        switchRole,
        switchNetworkToBotChain,
        mintFaucetUSDC,
        createInvoice,
        depositFunds,
        submitDeliverable,
        releaseFunds,
        refundFunds,
        raiseDispute,
        invoices,
        activeInvoice,
        activeInvoiceId,
        setActiveInvoiceId,
        logs,
        clearLogs,
        soundEnabled,
        toggleSound,
        isProcessing,
        statusMessage
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
