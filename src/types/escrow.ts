export type EscrowStatus = 
  | 'AWAITING_DEPOSIT' 
  | 'FUNDED' 
  | 'WORK_SUBMITTED' 
  | 'RELEASED' 
  | 'REFUNDED' 
  | 'DISPUTED';

export interface Invoice {
  id: string;
  serialNumber: string;
  client: string;
  freelancer: string;
  tokenSymbol: 'USDC';
  tokenAddress: string;
  amount: number;
  title: string;
  scopeOfWork: string;
  deliverableProof: string;
  deliverableNotes: string;
  deadline: number;
  createdAt: number;
  fundedAt?: number;
  releasedAt?: number;
  status: EscrowStatus;
  txHashCreate?: string;
  txHashDeposit?: string;
  txHashDeliverable?: string;
  txHashRelease?: string;
  disputeReason?: string;
}

export interface TransactionLog {
  id: string;
  timestamp: string;
  type: 'CREATE' | 'DEPOSIT' | 'SUBMIT' | 'RELEASE' | 'REFUND' | 'DISPUTE' | 'FAUCET';
  invoiceId?: string;
  txHash: string;
  from: string;
  details: string;
  gasUsed?: number;
}

export type UserRole = 'client' | 'freelancer' | 'observer';
