import React from 'react';
import { Web3Provider } from './context/Web3Context';
import { HeaderTelemetry } from './components/HeaderTelemetry';
import { HeroSection } from './components/HeroSection';
import { InvoiceCreatorSection } from './components/InvoiceCreatorSection';
import { ActiveEscrowVaultSection } from './components/ActiveEscrowVaultSection';
import { BrutalistSlipSection } from './components/BrutalistSlipSection';
import { SmartContractSpecSection } from './components/SmartContractSpecSection';
import { DeveloperTestLabSection } from './components/DeveloperTestLabSection';
import { ManifestoFooter } from './components/ManifestoFooter';

export const App: React.FC = () => {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-black text-white font-mono selection:bg-[#00FF66] selection:text-black">
        {/* Hardware Status Header & Navigation */}
        <HeaderTelemetry />

        <main className="w-full">
          {/* Section 01: Hero & State Topology */}
          <HeroSection />

          {/* Section 02: Invoice Generator & USDC Lock */}
          <InvoiceCreatorSection />

          {/* Section 03: Active Escrow Vault & Dual-Party Settlement */}
          <ActiveEscrowVaultSection />

          {/* Section 04: Cryptographic Brutalist Invoice Slip & Receipt */}
          <BrutalistSlipSection />

          {/* Section 05: Smart Contract Architecture & Solidity Spec */}
          <SmartContractSpecSection />

          {/* Section 06: Developer Test Lab, Faucet & Real-time Event Terminal */}
          <DeveloperTestLabSection />
        </main>

        {/* System Manifesto & Brutalist Compliance Footer */}
        <ManifestoFooter />
      </div>
    </Web3Provider>
  );
};

export default App;
