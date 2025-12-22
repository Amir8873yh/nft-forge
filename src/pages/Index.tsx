import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { NFTListView } from '@/components/nft/NFTListView';
import { TraitBuilderView } from '@/components/traits/TraitBuilderView';
import { MetadataView } from '@/components/metadata/MetadataView';
import { BlockchainView } from '@/components/blockchain/BlockchainView';
import { TransactionsView } from '@/components/transactions/TransactionsView';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();

  const handleConnectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true);
    setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'nfts':
        return <NFTListView />;
      case 'traits':
        return <TraitBuilderView />;
      case 'metadata':
        return <MetadataView />;
      case 'blockchain':
        return <BlockchainView />;
      case 'transactions':
        return <TransactionsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ marginLeft: 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {/* Header */}
        <Header
          walletConnected={walletConnected}
          onConnectWallet={handleConnectWallet}
          walletAddress={walletAddress}
        />

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default Index;
