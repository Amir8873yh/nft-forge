import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  ExternalLink,
  Zap,
  Layers,
  Sparkles,
  Clock,
  Hash,
  Wallet,
  Play,
  Pause,
  Flame,
  FileJson,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type NFT, type Edition, type Trait } from '@/data/mockData';
import { toast } from 'sonner';

interface NFTDetailDrawerProps {
  nft: NFT | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TraitCard({ trait }: { trait: Trait }) {
  const getRarityColor = (weight: number) => {
    if (weight < 5) return 'text-warning';
    if (weight < 10) return 'text-accent';
    if (weight <= 20) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getRarityLabel = (weight: number) => {
    if (weight < 5) return 'Legendary';
    if (weight < 10) return 'Rare';
    if (weight <= 20) return 'Uncommon';
    return 'Common';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      <div className="p-3 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 transition-all">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {trait.category}
          </span>
          {!trait.enabled && (
            <Badge variant="outline" className="text-[10px] h-4">Disabled</Badge>
          )}
        </div>
        <p className="font-medium text-sm">{trait.value}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium ${getRarityColor(trait.rarityWeight)}`}>
            {getRarityLabel(trait.rarityWeight)}
          </span>
          <span className="text-xs text-muted-foreground">{trait.rarityWeight}%</span>
        </div>
        <Progress 
          value={trait.rarityWeight} 
          className="h-1 mt-1.5" 
        />
      </div>
    </motion.div>
  );
}

function EditionCard({ edition, onMint }: { edition: Edition; onMint: (edition: Edition) => void }) {
  const progress = (edition.minted / edition.maxSupply) * 100;
  const isSoldOut = edition.minted >= edition.maxSupply;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50"
    >
      <div className="flex gap-4">
        {/* Edition Image */}
        <div className="flex-shrink-0">
          {edition.imageUrl ? (
            <img
              src={edition.imageUrl}
              alt={`${edition.name} artwork`}
              className="w-20 h-20 rounded-lg object-cover border border-border/50"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-card/80 border border-border/50 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Edition Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-display font-semibold">{edition.name || 'Unnamed Edition'}</h4>
              <p className="text-sm text-muted-foreground">
                {edition.minted} / {edition.maxSupply} minted
              </p>
            </div>
            <Badge 
              variant={edition.revealStatus === 'revealed' ? 'minted' : 'draft'}
              className="capitalize flex-shrink-0"
            >
              {edition.revealStatus}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2 mb-3" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-display font-bold">
                {edition.mintPrice} {edition.currency}
              </span>
            </div>
            <Button 
              size="sm" 
              disabled={isSoldOut}
              onClick={() => onMint(edition)}
              className="gap-1.5"
            >
              {isSoldOut ? (
                <>Sold Out</>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  Mint
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetadataPreview({ nft }: { nft: NFT }) {
  const [expanded, setExpanded] = useState(false);

  const metadata = {
    name: nft.name,
    description: nft.description,
    image: nft.imageUrl,
    external_url: `https://nft.example.com/${nft.id}`,
    attributes: nft.traits.map(trait => ({
      trait_type: trait.category,
      value: trait.value,
    })),
  };

  const copyMetadata = () => {
    navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
    toast.success('Metadata copied to clipboard');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">Token Metadata (ERC-721)</h4>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={copyMetadata}>
            <Copy className="w-3.5 h-3.5 mr-1" />
            Copy
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="relative">
        <pre className={`p-4 rounded-lg bg-background/50 border border-border/50 text-xs font-mono overflow-x-auto ${expanded ? '' : 'max-h-[200px]'} overflow-y-auto`}>
          <code className="text-primary/80">
            {JSON.stringify(metadata, null, 2)}
          </code>
        </pre>
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export function NFTDetailDrawer({ nft, open, onOpenChange }: NFTDetailDrawerProps) {
  const [isMinting, setIsMinting] = useState(false);

  if (!nft) return null;

  const statusConfig = {
    draft: { icon: FileJson, label: 'Draft', variant: 'draft' as const },
    ready: { icon: Check, label: 'Ready to Mint', variant: 'ready' as const },
    minted: { icon: Sparkles, label: 'Minted', variant: 'minted' as const },
    burned: { icon: Flame, label: 'Burned', variant: 'burned' as const },
  };

  const status = statusConfig[nft.mintStatus];
  const StatusIcon = status.icon;

  const handleMint = async (edition?: Edition) => {
    setIsMinting(true);
    toast.loading('Preparing mint transaction...', { id: 'mint' });
    
    // Simulate minting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(
      edition 
        ? `Successfully minted ${nft.name} (${edition.name} Edition)` 
        : `Successfully minted ${nft.name}`,
      { id: 'mint' }
    );
    setIsMinting(false);
  };

  const handleBurn = () => {
    toast.error('Burn action requires confirmation', {
      action: {
        label: 'Confirm Burn',
        onClick: () => toast.success('NFT burned successfully'),
      },
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(nft.tokenId || 'N/A');
    toast.success('Token ID copied');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl p-0 border-l border-border/50 bg-gradient-to-b from-card to-background">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-0">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <SheetTitle className="text-2xl font-display font-bold text-glow">
                    {nft.name}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">{nft.collection}</p>
                </div>
              </div>
            </SheetHeader>

            {/* NFT Image */}
            <div className="relative rounded-xl overflow-hidden group">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant={status.variant} className="backdrop-blur-sm">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" className="flex-1">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  View Full
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  IPFS
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center">
                <Hash className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Token ID</p>
                <p className="font-mono text-sm font-medium truncate">
                  {nft.tokenId || 'Not Minted'}
                </p>
              </Card>
              <Card className="p-3 text-center">
                <Layers className="w-4 h-4 mx-auto mb-1 text-accent" />
                <p className="text-xs text-muted-foreground">Standard</p>
                <p className="font-mono text-sm font-medium">{nft.tokenStandard}</p>
              </Card>
              <Card className="p-3 text-center">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-warning" />
                <p className="text-xs text-muted-foreground">Supply</p>
                <p className="font-mono text-sm font-medium">{nft.supplyType}</p>
              </Card>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <p className="text-sm leading-relaxed">{nft.description}</p>
            </div>

            <Separator className="bg-border/50" />

            {/* Tabs for Traits, Editions, Metadata */}
            <Tabs defaultValue="traits" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="traits" className="gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Traits
                </TabsTrigger>
                <TabsTrigger value="editions" className="gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Editions
                </TabsTrigger>
                <TabsTrigger value="metadata" className="gap-1.5">
                  <FileJson className="w-3.5 h-3.5" />
                  Metadata
                </TabsTrigger>
              </TabsList>

              <TabsContent value="traits" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {nft.traits.length > 0 ? (
                    nft.traits.map((trait, index) => (
                      <TraitCard key={trait.id} trait={trait} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No traits assigned</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="editions" className="mt-0 space-y-3">
                {nft.editions.length > 0 ? (
                  nft.editions.map((edition) => (
                    <EditionCard 
                      key={edition.id} 
                      edition={edition} 
                      onMint={handleMint}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No editions available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="metadata" className="mt-0">
                <MetadataPreview nft={nft} />
              </TabsContent>
            </Tabs>

            <Separator className="bg-border/50" />

            {/* Timestamps */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Created: {new Date(nft.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Updated: {new Date(nft.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {nft.mintStatus === 'ready' && (
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  onClick={() => handleMint()}
                  disabled={isMinting}
                >
                  <Zap className="w-4 h-4" />
                  {isMinting ? 'Minting...' : 'Mint NFT'}
                </Button>
              )}
              
              {nft.mintStatus === 'minted' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="gap-2">
                    <Pause className="w-4 h-4" />
                    Pause Sales
                  </Button>
                  <Button variant="destructive" className="gap-2" onClick={handleBurn}>
                    <Flame className="w-4 h-4" />
                    Burn
                  </Button>
                </div>
              )}

              {nft.mintStatus === 'draft' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0" />
                  <p className="text-xs text-warning">
                    Complete NFT setup before minting. Add traits and configure editions.
                  </p>
                </div>
              )}

              {nft.mintStatus === 'burned' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <Flame className="w-4 h-4 text-destructive flex-shrink-0" />
                  <p className="text-xs text-destructive">
                    This NFT has been permanently burned and cannot be recovered.
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
