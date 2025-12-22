import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Zap, 
  Pause, 
  Play,
  AlertTriangle,
  Fuel,
  Server,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { mockNFTs, mockCollections } from '@/data/mockData';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function BlockchainView() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [mintingPaused, setMintingPaused] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [batchSize, setBatchSize] = useState('10');
  const [deploying, setDeploying] = useState(false);
  const [minting, setMinting] = useState(false);

  const handleConnectWallet = () => {
    setWalletConnected(true);
    toast.success('Wallet connected successfully!');
  };

  const handleDeploy = () => {
    setDeploying(true);
    toast.loading('Deploying contract...', { id: 'deploy' });
    setTimeout(() => {
      setDeploying(false);
      toast.success('Contract deployed successfully!', { id: 'deploy' });
    }, 3000);
  };

  const handleMint = () => {
    if (!selectedNFT) {
      toast.error('Please select an NFT to mint');
      return;
    }
    setMinting(true);
    toast.loading('Minting NFT...', { id: 'mint' });
    setTimeout(() => {
      setMinting(false);
      toast.success('NFT minted successfully!', { id: 'mint' });
    }, 2500);
  };

  const handleBatchMint = () => {
    setMinting(true);
    toast.loading(`Batch minting ${batchSize} NFTs...`, { id: 'batch' });
    setTimeout(() => {
      setMinting(false);
      toast.success(`${batchSize} NFTs minted successfully!`, { id: 'batch' });
    }, 4000);
  };

  const readyNFTs = mockNFTs.filter(n => n.mintStatus === 'ready');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-glow">Blockchain Controls</h1>
          <p className="text-muted-foreground mt-1">Deploy contracts and mint NFTs</p>
        </div>
        {walletConnected ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-success font-medium">0x1234...5678</span>
            <Badge variant="success">Connected</Badge>
          </div>
        ) : (
          <Button variant="neon" onClick={handleConnectWallet} className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>

      {!walletConnected && (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <p className="text-sm text-warning">Connect your wallet to access blockchain controls</p>
          </CardContent>
        </Card>
      )}

      {/* Network Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-lg font-display font-bold">Ethereum</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Server className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gas Price</p>
                <p className="text-lg font-display font-bold">24 Gwei</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10">
                <Fuel className="w-5 h-5 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Minting Status</p>
                <p className="text-lg font-display font-bold">{mintingPaused ? 'Paused' : 'Active'}</p>
              </div>
              <Button 
                variant={mintingPaused ? 'success' : 'destructive'}
                size="sm"
                onClick={() => setMintingPaused(!mintingPaused)}
                disabled={!walletConnected}
              >
                {mintingPaused ? <Play className="w-4 h-4 mr-1" /> : <Pause className="w-4 h-4 mr-1" />}
                {mintingPaused ? 'Resume' : 'Pause'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deploy Contract */}
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                Deploy Contract
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {mockCollections.filter(c => !c.contractAddress).map(col => (
                    <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Gas</span>
                  <span>~0.015 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>~$45.00</span>
                </div>
              </div>

              <Button 
                className="w-full gap-2" 
                disabled={!walletConnected || deploying}
                onClick={handleDeploy}
              >
                {deploying ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {deploying ? 'Deploying...' : 'Deploy Contract'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mint NFT */}
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Mint NFT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedNFT} onValueChange={setSelectedNFT}>
                <SelectTrigger>
                  <SelectValue placeholder="Select NFT to mint" />
                </SelectTrigger>
                <SelectContent>
                  {readyNFTs.map(nft => (
                    <SelectItem key={nft.id} value={nft.id}>{nft.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Gas</span>
                  <span>~0.004 ETH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>~$12.00</span>
                </div>
              </div>

              <Button 
                className="w-full gap-2" 
                disabled={!walletConnected || minting || mintingPaused}
                onClick={handleMint}
              >
                {minting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {minting ? 'Minting...' : 'Mint Single NFT'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Batch Mint */}
      <motion.div variants={itemVariants}>
        <Card glow>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-warning" />
              Batch Mint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Collection</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCollections.filter(c => c.contractAddress).map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Batch Size</label>
                <Input 
                  type="number" 
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  min="1" 
                  max="100" 
                />
              </div>
              <Button 
                className="gap-2"
                disabled={!walletConnected || minting || mintingPaused}
                onClick={handleBatchMint}
              >
                {minting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Batch Mint
              </Button>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Estimated Total Gas</span>
                <span>~{(0.004 * parseInt(batchSize || '0')).toFixed(4)} ETH</span>
              </div>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Ready to mint: {readyNFTs.length} NFTs</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deployed Contracts */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Deployed Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockCollections.filter(c => c.contractAddress).map(col => (
                <div 
                  key={col.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium">{col.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{col.contractAddress}</p>
                    </div>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
              ))}
              {mockCollections.filter(c => !c.contractAddress).map(col => (
                <div 
                  key={col.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{col.name}</p>
                      <p className="text-xs text-muted-foreground">Not deployed</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
