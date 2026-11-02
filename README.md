# SYS://ESCROW.PROTOCOL.V6 — TACTILE BRUTALISM FREELANCE ESCROW DAPP
### POWERED BY BOTCHAIN // BOT CHAIN MAINNET (CHAIN ID: 677)

> **A trustless, non-custodial freelance escrow agreement protocol engineered in Tactile Brutalism.**
> Pure pitch black background (`#000000`), stark 1px solid white wireframe borders, absolute 0px border-radius, high-voltage neon green action buttons (`#00FF66`), neo-serif + monospace typography, and zero soft UI or blur effects.

[![Powered by Botchain](https://img.shields.io/badge/Powered%20by-Botchain.ai-00FF66?style=for-the-badge&logoColor=black)](https://botchain.ai)
[![BOT Chain Mainnet](https://img.shields.io/badge/Network-BOT%20Chain%20Mainnet%20(677)-000000?style=for-the-badge&logoColor=white&borderColor=white)](https://scan.botchain.ai)
[![X / Twitter](https://img.shields.io/badge/X-@site__proof__-white?style=for-the-badge&logo=x&logoColor=black)](https://x.com/site_proof__)

---

## 🌐 BOT CHAIN MAINNET CONFIGURATION

This dApp is configured out-of-the-box for **BOT Chain Mainnet**.

| Parameter | Mainnet Value |
| :--- | :--- |
| **Network Name** | `BOT Chain Mainnet` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Chain ID** | `677` (`0x2a5` in hexadecimal) |
| **Currency Symbol** | `BOT` |
| **Currency Decimals** | `18` |
| **Block Explorer URL** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Mainnet Contract Scan** | [0xFD51797C48f75aF10761F92Bdd639e4518358324](https://scan.botchain.ai/address/0xFD51797C48f75aF10761F92Bdd639e4518358324) |
| **Official Twitter / X** | [@site_proof__ (https://x.com/site_proof__)](https://x.com/site_proof__) |
| **Ecosystem & Infrastructure** | [Powered by Botchain (https://botchain.ai)](https://botchain.ai) |

---

## 📐 THE AESTHETIC: TACTILE BRUTALISM

This dApp is built to reject soft pastel gradients, rounded pill cards, and blurry glassmorphism. It implements **Tactile Brutalism**: an aggressively engineered, high-contrast, mechanical wireframe dark mode that prioritizes geometric certainty, cryptographic accountability, and raw industrial utility.

### Strict UI Requirements Implemented:
* **Pitch Black Background**: Pure `#000000` absolute darkness across all viewports.
* **Stark 1px Solid White Borders**: Crisp wireframe boundaries (`border: 1px solid #ffffff`) framing all panels, containers, tables, and dialogs.
* **0px Border-Radius**: Zero corner rounding across every button, card, modal, input, and badge (`* { border-radius: 0 !important; }`).
* **High-Voltage Neon Green Primary Action**: `#00FF66` with pitch-black text for primary transactional operations (Deploy, Deposit, Release).
* **Typography Duality**:
  * **Neo-Serif** (`Cinzel` & `Playfair Display`) for authoritative legal headers, contracts, and monument banners.
  * **Monospace** (`Space Mono` & `JetBrains Mono`) for hex addresses, bytecodes, balances, telemetry, and smart contract specs.
* **Tactile Mechanical Audio**: Real-time synthesized relay clunks, micro-clicks, and settlement chimes generated via the native Web Audio API (zero external asset requests).

---

## ⚡ 1. ALL THE FEATURES OF THIS WEB APP (WHAT CAN IT DO?)

### 1. Non-Custodial Stablecoin Capital Escrow Lock
* **Direct Stablecoin Deposit**: The client commits USDC stablecoins directly into the immutable escrow smart contract vault (`FreelanceEscrow.sol`).
* **Zero Platform Fees**: 0.00% intermediary tax. 100% of the funds go directly from client to freelancer.
* **Atomic Deposit Mode**: Generate invoice and transfer funds into the contract vault in a single atomic workflow.

### 2. Dual-Perspective State Machine (Client & Freelancer Roles)
* **Instant Role Switcher**: Toggle between `CLIENT` and `FREELANCER` perspectives with a single tactile button. Test both sides of the agreement seamlessly on the same machine without switching browsers!
* **Deterministic Status Transitions**:
  * `01: AWAITING_DEPOSIT` — Agreement parameters defined; waiting for client to deposit funds.
  * `02: FUNDED (ESCROW ACTIVE)` — Stablecoins immutably locked in vault; freelancer authorized to commence work.
  * `03: WORK_SUBMITTED` — Freelancer has attached cryptographic deliverable proofs (GitHub PR, IPFS hash, live staging URL, test notes).
  * `04: RELEASED` — Client inspects deliverables and triggers irrevocable release of USDC to the freelancer's wallet.
  * `05: REFUNDED` — Deposit refunded back to client if the deadline expired or mutual agreement was reached.
  * `06: DISPUTED` — Vault frozen pending dispute arbitration.

### 3. BOT Chain Mainnet Web3 Engine + Zero-Friction Simulator
* **MetaMask Support (`window.ethereum`)**: Direct connection to BOT Chain Mainnet (Chain ID 677).
* **1-Click Network Switcher**: If connected to another network, click `[ SWITCH TO BOT CHAIN (677) ]` and MetaMask will automatically prompt to add and switch to BOT Chain Mainnet.
* **Zero-Friction Simulator Fallback**: If MetaMask is disconnected, the integrated high-speed simulation engine executes verifiable state transitions, tracks simulated gas, and maintains contract balances.

### 4. Built-in Mock USDC Faucet
* **1-Click Test Faucet**: Mint $500, $1,000, $2,500, or $5,000 mock USDC directly into either the Client or Freelancer balance for friction-free testing.

### 5. Verifiable Brutalist Invoice & Receipt Generator
* **Physical Dot-Matrix / Thermal Printer Aesthetic**: Raw monospace receipt layout with perforated cut lines (`- - - - - -`).
* **Algorithmic Barcode & Seal of Deposit**: Dynamic SVG barcode generated from the invoice parameters.
* **Cryptographic SHA-256 Digest**: Verifiable hash of the scope of work, wallet public keys, and principal amount.
* **1-Click Print / PDF Export**: Built-in `window.print()` stylesheet formatted specifically for clean, stark black-and-white printouts.
* **Export Raw JSON**: 1-click clipboard copy of the entire on-chain invoice record.

### 6. Interactive Developer Test Lab & Live Terminal Stream
* **Real-Time Event Stream**: Live scrolling terminal logging every contract event (`InvoiceCreated`, `FundsDeposited`, `DeliverableSubmitted`, `FundsReleased`, `DisputeRaised`).
* **Log Filtering**: Filter transaction logs by type (`ALL`, `CREATE`, `DEPOSIT`, `SUBMIT`, `RELEASE`, `FAUCET`).
* **Gas Telemetry**: Logs gas consumption in native BOT currency.

### 7. Smart Contract Source Inspector & Live On-Chain State
* **Full Solidity Source Code**: Tabbed viewer displaying `FreelanceEscrow.sol` and `MockUSDC.sol` with 1-click copy.
* **On-Chain State Telemetry**: Real-time counter of total locked TVL, settled capital, total invoices, and reentrancy mutex status.
* **Direct Explorer Scan Link**: 1-click jump to `https://scan.botchain.ai/address/0xFD51797C48f75aF10761F92Bdd639e4518358324`.

---

## 🏛️ LANDING PAGE SECTIONS (OVERVIEW)

1. **Hardware Telemetry & Masthead Bar**: Real-time gas price (14 Gwei), block tracker (#19,842,104), live wallet USDC balances, sound FX toggle, BOT Chain status badge, and role switcher.
2. **Section 01: Hero // Capital Settlement Engine**: Harsh monument typography, protocol state machine topology diagram, and core financial metrics matrix.
3. **Section 02: Escrow Invoice Generator & Deposit Vault**: Industrial form with amount presets, deliverable specification editor, deadline selector, and atomic deposit trigger.
4. **Section 03: Active Escrow Vault & Dual-Party Settlement**: Dynamic state transition pipeline, deliverable review drawer, and primary neon green `[ VERIFY & RELEASE ]` button with celebratory confetti & audio chime.
5. **Section 04: Cryptographic Brutalist Invoice Slip**: Printable thermal receipt with perforated tear marks, dynamic barcode, SHA-256 digest, and JSON export.
6. **Section 05: Smart Contract Specification & Bytecode**: Solady reentrancy protection analysis, live Solidity source code viewer, and on-chain state metrics linking to BOT Chain Scan.
7. **Section 06: Developer Test Lab & Transaction Stream**: 1-Click Mock USDC Faucet, 5-step manual testing protocol guide, and live terminal event stream connected to `https://rpc.botchain.ai`.
8. **Manifesto Footer**: Ecosystem links to **Powered by Botchain** (`botchain.ai`), **Twitter / X** (`x.com/site_proof__`), **Contract Scan** (`scan.botchain.ai/address/0xFD51...8324`), and compliance checklist.

---

## 🚀 2. HOW TO RUN IT LOCALLY & TEST IT OUT

### System Requirements
* **Node.js**: v18.0.0 or higher (Node v20+ or v26 recommended)
* **npm**: v9.0.0 or higher
* **MetaMask Browser Extension**

### Quick Start (Local Setup)

1. Open your terminal in the project directory:
   ```bash
   cd "e:\D'APPS\Freelance Escrow Invoice"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🦊 HOW TO TEST USING METAMASK ON BOT CHAIN MAINNET

### 1-Click Automatic Network Addition
1. Open the dApp at `http://localhost:5173`.
2. Click **`[ CONNECT METAMASK ]`** in the top navigation bar.
3. If MetaMask is not on BOT Chain Mainnet, the dApp will automatically prompt you:
   * **Network Name**: `BOT Chain Mainnet`
   * **RPC URL**: `https://rpc.botchain.ai`
   * **Chain ID**: `677`
   * **Currency Symbol**: `BOT`
   * **Block Explorer**: `https://scan.botchain.ai`
4. Click **"Approve"** and **"Switch network"** in the MetaMask popup.
5. You can also manually click the **`[ SWITCH TO BOT CHAIN (677) ]`** button in the header at any time.

### Manual Network Configuration in MetaMask (Optional)
If you prefer to add BOT Chain manually in MetaMask:
1. Open MetaMask $\rightarrow$ Click Network Dropdown $\rightarrow$ **"Add network"** $\rightarrow$ **"Add a network manually"**.
2. Enter the following parameters:
   * **Network name**: `BOT Chain Mainnet`
   * **New RPC URL**: `https://rpc.botchain.ai`
   * **Chain ID**: `677`
   * **Currency symbol**: `BOT`
   * **Block explorer URL**: `https://scan.botchain.ai`
3. Click **Save**.

### Integrating Your Mainnet Contract Address & Custom ABI
When you deploy your contract on BOT Chain Mainnet:
1. Copy your deployed contract address and ABI.
2. In `src/utils/contracts.ts`, update `DEFAULT_CONTRACTS.escrow` or create a `.env` file:
   ```env
   VITE_ESCROW_CONTRACT_ADDRESS=0xFD51797C48f75aF10761F92Bdd639e4518358324
   VITE_USDC_CONTRACT_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
   ```
3. To update the ABI, paste your compiled ABI array directly into `ESCROW_CONTRACT_ABI` in `src/utils/contracts.ts`.

---

## 🧪 HOW TO TEST ALL FEATURES MANUALLY (STEP-BY-STEP)

You can test the complete end-to-end lifecycle in under 2 minutes:

### 🔬 STEP 1: Verify Balances & Mint Test USDC (Faucet)
1. Look at the top telemetry bar or scroll to **Section 06: Developer Test Lab**.
2. Notice the `CLIENT USDC` balance (defaults to $15,000.00 USDC) and `DEV USDC` balance ($3,200.00 USDC).
3. In Section 06, click **`[ MINT TO CLIENT ]`** or the **`[ FAUCET +$1K ]`** button in the header.
4. Listen to the crisp mechanical click sound, and watch the client balance increase by +$1,000.00 USDC.
5. In the **SYS.LOGS terminal** below, observe the new `FAUCET` event logged with a transaction hash!

---

### 📝 STEP 2: Create a New Escrow Invoice (Section 02)
1. Scroll to **Section 02: Initialize Escrow Invoice**.
2. Notice the pre-filled fields or customize:
   * **Freelancer Beneficiary Wallet**: Keep the default demo freelancer address (`0x94B8...C3E2`) or click `[USE DEMO FREELANCER ADDRESS]`.
   * **Engagement Title**: e.g., `FULL-STACK SOLANA/ETH BRIDGE AUDIT & FRONTEND`.
   * **Scope of Work**: Acceptance criteria and testing instructions.
   * **Escrow Deposit Value**: Click on the preset buttons (e.g., `$2,800` or `$5,000`).
   * **Settlement Deadline**: Choose `14 DAYS`.
   * **Atomic Deposit**: Leave checked to immediately lock funds in the contract.
3. Click the primary neon green button:
   **`[ INITIALIZE & LOCK USDC ]`**
4. Hear the mechanical relay lock audio latch, see the blockchain mining banner, and watch the green confirmation badge appear with your new invoice ID (e.g., `INV-2026-X04`).

---

### 🛠️ STEP 3: Switch Perspective to Freelancer & Submit Deliverables (Section 03)
1. Scroll to **Section 03: Active Escrow Vault**.
2. In the top right of the section, note your perspective indicator:
   `YOUR PERSPECTIVE: [CLIENT]`
3. Click the white button:
   **`[ SWITCH TO FREELANCER ]`**
4. Select your active invoice tab (or `INV-2026-X02` which is currently in `FUNDED` state).
5. As the Freelancer, you will now see the submission form:
   * **Deliverable Proof URL**: Enter a GitHub PR or IPFS link (e.g., `https://github.com/my-org/my-project/pull/42`).
   * **Handover Notes**: Enter verification notes (e.g., `All unit tests passed. Production build verified.`).
6. Click the neon green button:
   **`[ SUBMIT DELIVERABLES FOR CLIENT RELEASE ]`**
7. The state machine transitions immediately to **`03: DELIVERED`** (`WORK_SUBMITTED`).

---

### 💰 STEP 4: Switch Back to Client & Release Capital (Section 03)
1. Click **`[ SWITCH TO CLIENT ]`** in the header or in Section 03.
2. Select your invoice with status `WORK_SUBMITTED` (or `INV-2026-X01`).
3. As the Client, inspect the **FREELANCER DELIVERABLE SUBMISSION** panel:
   * Click the deliverable proof link to test review.
   * Review the handover notes and verification hash.
4. When satisfied, click the monumental neon green button:
   **`[ VERIFY & RELEASE $2,800.00 USDC TO FREELANCER ]`**
5. Experience the Tactile Brutalism confirmation:
   * A **high-tech dual-beep audio confirmation** chime plays.
   * A **celebratory particle shockwave / confetti explosion** triggers.
   * The invoice updates to **`FUNDS RELEASED // SETTLED`**.
   * The freelancer's balance increases by +$2,800.00 USDC.
   * A permanent release transaction hash is generated and logged.

---

### ⚠️ STEP 5: Test Dispute & Refund Controls
1. On any funded invoice, you can test the emergency safety mechanisms:
   * **Raise Dispute**: Click **`[ RAISE DISPUTE / FREEZE ]`**. A modal will open. Enter a reason (e.g., `Code does not pass security audit`) and click `[ FREEZE ESCROW VAULT ]`. The contract freezes into status `DISPUTED` to halt any automated withdrawals.
   * **Refund**: Click **`[ CANCEL & REFUND ]`**. The USDC principal is returned back to the Client wallet immediately.

---

### 🖨️ STEP 6: Generate & Print the Brutalist Invoice Slip (Section 04)
1. Scroll to **Section 04: Cryptographic Brutalist Slip**.
2. Notice the dot-matrix receipt layout, dynamic SVG barcode, and SHA-256 agreement digest.
3. Click **`[ EXPORT JSON ]`** to copy the full on-chain JSON record to your clipboard.
4. Click **`[ PRINT / EXPORT SLIP ]`**. The browser print preview will open with our dedicated print stylesheet, generating a crisp, high-contrast, black-and-white physical receipt ready for PDF export or thermal receipt printing.

---

### 💻 STEP 7: Inspect Smart Contract Code & Terminal Logs (Sections 05 & 06)
1. In **Section 05**, click the tabs:
   * `FreelanceEscrow.sol` — Review the audited Solidity escrow logic.
   * `MockUSDC.sol` — Review the 6-decimal ERC20 token implementation.
   * `[LIVE ON-CHAIN STATE]` — Check TVL and active mutex locks.
   * Click the scan link to view [0xFD51797C48f75aF10761F92Bdd639e4518358324 on BOT Chain Scan](https://scan.botchain.ai/address/0xFD51797C48f75aF10761F92Bdd639e4518358324).
2. In **Section 06**, watch the live terminal logs. Click `RELEASE`, `DEPOSIT`, or `CREATE` filter pills to inspect individual transaction payloads.

---

## 📁 REPOSITORY STRUCTURE

```
├── contracts/
│   ├── FreelanceEscrow.sol     # Non-custodial escrow smart contract
│   ├── MockUSDC.sol            # 6-decimal USDC mock token with faucet
│   └── scripts/
│       └── deploy.js           # Hardhat deployment script for BOT Chain Mainnet
├── src/
│   ├── components/
│   │   ├── HeaderTelemetry.tsx         # Masthead, balances, role switcher, MetaMask connect
│   │   ├── HeroSection.tsx             # Section 1: Hero & state topology
│   │   ├── InvoiceCreatorSection.tsx   # Section 2: Invoice builder & atomic USDC lock
│   │   ├── ActiveEscrowVaultSection.tsx# Section 3: Dual-role escrow settlement terminal
│   │   ├── BrutalistSlipSection.tsx    # Section 4: Cryptographic invoice receipt & print
│   │   ├── SmartContractSpecSection.tsx# Section 5: Solidity source & state telemetry
│   │   ├── DeveloperTestLabSection.tsx # Section 6: Mock USDC faucet & terminal logs
│   │   └── ManifestoFooter.tsx         # Botchain links, Twitter/X, scan contract link & manifesto
│   ├── context/
│   │   └── Web3Context.tsx     # Dual Web3 provider (MetaMask + Simulator) for BOT Chain Mainnet
│   ├── types/
│   │   └── escrow.ts           # TypeScript interfaces & status models
│   ├── utils/
│   │   ├── audio.ts            # Web Audio API mechanical sound synthesizer
│   │   └── contracts.ts        # BOT Chain config, ABIs, default addresses, formatters
│   ├── App.tsx                 # Root application composition
│   ├── index.css               # Tactile Brutalism Tailwind v4 base styles
│   └── main.tsx                # React 19 mount entry point
├── hardhat.config.cjs          # Hardhat configuration with BOT Chain Mainnet network
├── index.html                  # HTML head with Google Fonts (Cinzel, Playfair, Space Mono)
├── package.json                # Project dependencies and build scripts
└── vite.config.ts              # Vite 8 + Tailwind CSS v4 configuration
```

---

## 🔗 ECOSYSTEM LINKS

* **Infrastructure**: [Powered by Botchain](https://botchain.ai)
* **Block Explorer**: [BOT Chain Scan](https://scan.botchain.ai)
* **Contract Address**: [0xFD51797C48f75aF10761F92Bdd639e4518358324](https://scan.botchain.ai/address/0xFD51797C48f75aF10761F92Bdd639e4518358324)
* **Twitter / X**: [@site_proof__](https://x.com/site_proof__)

---

## 📜 LICENSE

MIT License. Free to use, adapt, and deploy on BOT Chain Mainnet for trustless freelance capital disbursement.
