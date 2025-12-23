import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockNFTs, mockCollections, type NFT, type MintStatus } from '@/data/mockData';
import { NFTDetailDrawer } from './NFTDetailDrawer';
import { NFTForm } from './NFTForm';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

function NFTCard({ 
  nft, 
  onSelect, 
  onEdit 
}: { 
  nft: NFT; 
  onSelect: (nft: NFT) => void;
  onEdit: (nft: NFT) => void;
}) {
  const statusVariant = {
    draft: 'draft',
    ready: 'ready',
    minted: 'minted',
    burned: 'burned',
  } as const;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => onSelect(nft)}
    >
      <Card glow className="overflow-hidden group">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-3 right-3">
            <Badge variant={statusVariant[nft.mintStatus]}>{nft.mintStatus}</Badge>
          </div>
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1">
                <Eye className="w-4 h-4 mr-1" /> View
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(nft);
                }}
              >
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-display font-semibold text-sm truncate">{nft.name}</h3>
              <p className="text-xs text-muted-foreground">{nft.collection}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect(nft); }}>
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(nft); }}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px]">{nft.tokenStandard}</Badge>
            <Badge variant="outline" className="text-[10px]">{nft.supplyType}</Badge>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{nft.traits.length} traits</span>
            <span>{nft.editions.length} editions</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NFTListView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MintStatus | 'all'>('all');
  const [collectionFilter, setCollectionFilter] = useState<string>('all');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingNFT, setEditingNFT] = useState<NFT | null>(null);

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || nft.mintStatus === statusFilter;
    const matchesCollection = collectionFilter === 'all' || nft.collection === collectionFilter;
    return matchesSearch && matchesStatus && matchesCollection;
  });

  const handleCreateNew = () => {
    setEditingNFT(null);
    setFormOpen(true);
  };

  const handleEdit = (nft: NFT) => {
    setEditingNFT(nft);
    setFormOpen(true);
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
          <h1 className="text-3xl font-display font-bold text-glow">NFT Items</h1>
          <p className="text-muted-foreground mt-1">Manage your NFT collection</p>
        </div>
        <Button className="gap-2" onClick={handleCreateNew}>
          <Plus className="w-4 h-4" />
          Create NFT
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as MintStatus | 'all')}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="minted">Minted</SelectItem>
                <SelectItem value="burned">Burned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={collectionFilter} onValueChange={setCollectionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {mockCollections.map(col => (
                  <SelectItem key={col.id} value={col.name}>{col.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredNFTs.map((nft) => (
            <NFTCard key={nft.id} nft={nft} onSelect={setSelectedNFT} onEdit={handleEdit} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No NFTs found matching your filters</p>
        </div>
      )}

      {/* NFT Detail Drawer */}
      <NFTDetailDrawer 
        nft={selectedNFT} 
        open={!!selectedNFT} 
        onOpenChange={(open) => !open && setSelectedNFT(null)} 
      />

      {/* NFT Create/Edit Form */}
      <NFTForm
        nft={editingNFT}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </motion.div>
  );
}
