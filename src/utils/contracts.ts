export const ESCROW_CONTRACT_ABI = [
  "function createInvoice(address freelancer, address token, uint256 amount, string calldata title, string calldata scopeOfWork, uint256 deadline) external returns (uint256)",
  "function depositFunds(uint256 invoiceId) external payable",
  "function submitDeliverable(uint256 invoiceId, string calldata deliverableProof, string calldata notes) external",
  "function releaseFunds(uint256 invoiceId) external",
  "function refundFunds(uint256 invoiceId) external",
  "function raiseDispute(uint256 invoiceId, string calldata reason) external",
  "function totalInvoices() external view returns (uint256)",
  "function invoices(uint256) external view returns (uint256 id, address client, address freelancer, address token, uint256 amount, string title, string scopeOfWork, string deliverableProof, string deliverableNotes, uint256 deadline, uint256 createdAt, uint256 fundedAt, uint256 releasedAt, uint8 status)",
  "event InvoiceCreated(uint256 indexed invoiceId, address indexed client, address indexed freelancer, address token, uint256 amount, string title, uint256 deadline)",
  "event FundsDeposited(uint256 indexed invoiceId, address indexed client, uint256 amount)",
  "event DeliverableSubmitted(uint256 indexed invoiceId, address indexed freelancer, string deliverableProof)",
  "event FundsReleased(uint256 indexed invoiceId, address indexed freelancer, uint256 amount)",
  "event FundsRefunded(uint256 indexed invoiceId, address indexed client, uint256 amount)",
  "event DisputeRaised(uint256 indexed invoiceId, address indexed raisedBy, string reason)"
];

export const MOCK_USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount) external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// BOT Chain Mainnet Specifications
export const BOT_CHAIN_CONFIG = {
  chainId: 677,
  chainIdHex: "0x2a5",
  chainName: "BOT Chain Mainnet",
  rpcUrl: "https://rpc.botchain.ai",
  currencySymbol: "BOT",
  currencyName: "BOT",
  currencyDecimals: 18,
  blockExplorerUrl: "https://scan.botchain.ai",
  contractAddress: "0xFD51797C48f75aF10761F92Bdd639e4518358324",
  twitterUrl: "https://x.com/site_proof__",
  botchainUrl: "https://botchain.ai"
};

// Contract addresses: configured for BOT Chain Mainnet with env override support
export const DEFAULT_CONTRACTS = {
  escrow: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_ESCROW_CONTRACT_ADDRESS || BOT_CHAIN_CONFIG.contractAddress,
  usdc: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_USDC_CONTRACT_ADDRESS || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
};

// Preset demo addresses for local/mock switching
export const DEMO_ADDRESSES = {
  client: "0x71C94Bf448B6fEa3a5D26D4eF08AbfD910e527A1",
  freelancer: "0x94B87a5C2dD7412d46A6d2460B12F0d14b87C3E2",
  arbitrator: "0x1111111111111111111111111111111111111111"
};

export function shortenAddress(addr: string, chars = 4): string {
  if (!addr) return "0x000...0000";
  if (addr.length <= chars * 2 + 2) return addr;
  return `${addr.substring(0, chars + 2)}...${addr.substring(addr.length - chars)}`;
}

export function formatUSDC(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('$', '') + ' USDC';
}

export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function generateDigest(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}e92b${hex}74a1f59c84e1b3`.padEnd(66, '9');
}

export function getExplorerAddressUrl(address: string): string {
  return `${BOT_CHAIN_CONFIG.blockExplorerUrl}/address/${address}`;
}

export function getExplorerTxUrl(txHash: string): string {
  return `${BOT_CHAIN_CONFIG.blockExplorerUrl}/tx/${txHash}`;
}
