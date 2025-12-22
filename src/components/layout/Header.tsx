import { motion } from 'framer-motion';
import { Bell, Search, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  walletConnected: boolean;
  onConnectWallet: () => void;
  walletAddress?: string;
}

export function Header({ walletConnected, onConnectWallet, walletAddress }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search NFTs, collections, traits..."
          className="pl-10 bg-muted/50 border-border focus:border-primary"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] flex items-center justify-center text-accent-foreground">
            3
          </span>
        </Button>

        {/* Wallet Connection */}
        {walletConnected ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg"
          >
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success font-medium">
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </span>
            <Badge variant="success" className="text-[10px]">Connected</Badge>
          </motion.div>
        ) : (
          <Button variant="neon" onClick={onConnectWallet} className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
