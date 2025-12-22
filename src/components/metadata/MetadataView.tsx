import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileJson, 
  Copy, 
  Check, 
  RefreshCw,
  Upload,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockNFTs, type NFT } from '@/data/mockData';

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

function generateMetadata(nft: NFT) {
  return {
    name: nft.name,
    description: nft.description,
    image: `ipfs://Qm.../${nft.id}.png`,
    external_url: `https://example.com/nft/${nft.id}`,
    attributes: nft.traits.map(trait => ({
      trait_type: trait.category,
      value: trait.value,
    })),
    properties: {
      files: [
        {
          uri: `ipfs://Qm.../${nft.id}.png`,
          type: "image/png"
        }
      ],
      category: "image",
      creators: [
        {
          address: "0x1234...5678",
          share: 100
        }
      ]
    },
    seller_fee_basis_points: 500,
    collection: {
      name: nft.collection,
      family: "Cyber Legends"
    }
  };
}

export function MetadataView() {
  const [selectedNFT, setSelectedNFT] = useState<NFT>(mockNFTs[0]);
  const [copied, setCopied] = useState(false);
  const [ipfsStatus, setIpfsStatus] = useState<'idle' | 'uploading' | 'pinned'>('idle');

  const metadata = generateMetadata(selectedNFT);
  const metadataString = JSON.stringify(metadata, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(metadataString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePin = () => {
    setIpfsStatus('uploading');
    setTimeout(() => setIpfsStatus('pinned'), 2000);
  };

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
          <h1 className="text-3xl font-display font-bold text-glow">Metadata Manager</h1>
          <p className="text-muted-foreground mt-1">Generate and manage NFT metadata</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </Button>
          <Button onClick={handlePin} disabled={ipfsStatus === 'uploading'}>
            {ipfsStatus === 'uploading' ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {ipfsStatus === 'pinned' ? 'Pinned to IPFS' : 'Pin to IPFS'}
          </Button>
        </div>
      </div>

      {/* NFT Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Select NFT:</span>
            <Select 
              value={selectedNFT.id} 
              onValueChange={(id) => setSelectedNFT(mockNFTs.find(n => n.id === id) || mockNFTs[0])}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockNFTs.map(nft => (
                  <SelectItem key={nft.id} value={nft.id}>
                    {nft.name} - {nft.collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {ipfsStatus === 'pinned' && (
              <Badge variant="success" className="ml-auto">
                <Check className="w-3 h-3 mr-1" /> IPFS Pinned
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <motion.div variants={itemVariants}>
          <Card glow className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                NFT Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden border border-border">
                <img
                  src={selectedNFT.imageUrl}
                  alt={selectedNFT.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{selectedNFT.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedNFT.collection}</p>
              </div>
              <p className="text-sm text-foreground/80">{selectedNFT.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Attributes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedNFT.traits.map(trait => (
                    <div 
                      key={trait.id} 
                      className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <p className="text-[10px] text-muted-foreground uppercase">{trait.category}</p>
                      <p className="text-sm font-medium text-primary">{trait.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metadata JSON */}
        <motion.div variants={itemVariants}>
          <Card glow className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-accent" />
                Metadata JSON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted">
                <TabsList className="mb-4">
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <TabsContent value="formatted">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted/50 border border-border overflow-auto max-h-[500px] text-xs">
                      <code className="text-foreground">
                        {metadataString}
                      </code>
                    </pre>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="raw">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border overflow-auto max-h-[500px]">
                    <code className="text-xs text-muted-foreground break-all">
                      {JSON.stringify(metadata)}
                    </code>
                  </div>
                </TabsContent>
              </Tabs>

              {/* IPFS Info */}
              <div className="mt-4 p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Token URI</span>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" /> View on IPFS
                  </Button>
                </div>
                <div className="p-2 rounded bg-muted/50 font-mono text-xs text-muted-foreground">
                  ipfs://Qm.../metadata/{selectedNFT.id}.json
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
