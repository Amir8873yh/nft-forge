import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Sparkles,
  Save,
  FileJson,
  Layers,
  Type,
  AlignLeft,
  Tag,
  Check,
  Crown,
  Eye,
  EyeOff,
  Coins,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type NFT,
  type Trait,
  type Edition,
  type TokenStandard,
  type SupplyType,
  type RevealStatus,
  mockCollections,
  mockTraits,
  traitCategories,
} from '@/data/mockData';
import { toast } from 'sonner';

interface NFTFormProps {
  nft?: NFT | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: NFTFormData) => void;
}

export interface NFTFormData {
  name: string;
  description: string;
  collection: string;
  imageUrl: string;
  tokenStandard: TokenStandard;
  supplyType: SupplyType;
  traits: Trait[];
  editions: Edition[];
}

const createDefaultEdition = (): Edition => ({
  id: `ed-${Date.now()}`,
  name: '',
  maxSupply: 100,
  mintPrice: 0.1,
  currency: 'ETH',
  revealStatus: 'hidden',
  minted: 0,
});

const defaultFormData: NFTFormData = {
  name: '',
  description: '',
  collection: '',
  imageUrl: '',
  tokenStandard: 'ERC-721',
  supplyType: '1/1',
  traits: [],
  editions: [],
};

function TraitSelector({ 
  selectedTraits, 
  onTraitsChange 
}: { 
  selectedTraits: Trait[]; 
  onTraitsChange: (traits: Trait[]) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(traitCategories[0]);

  const categoryTraits = mockTraits.filter(t => t.category === activeCategory);
  const selectedIds = selectedTraits.map(t => t.id);

  const toggleTrait = (trait: Trait) => {
    if (selectedIds.includes(trait.id)) {
      onTraitsChange(selectedTraits.filter(t => t.id !== trait.id));
    } else {
      onTraitsChange([...selectedTraits, trait]);
    }
  };

  const getRarityColor = (weight: number) => {
    if (weight < 5) return 'border-warning/50 bg-warning/10';
    if (weight < 10) return 'border-accent/50 bg-accent/10';
    if (weight <= 20) return 'border-primary/50 bg-primary/10';
    return 'border-border bg-card/50';
  };

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {traitCategories.map((category) => {
          const count = selectedTraits.filter(t => t.category === category).length;
          return (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="relative"
            >
              {category}
              {count > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {count}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Traits Grid */}
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence mode="popLayout">
          {categoryTraits.map((trait) => {
            const isSelected = selectedIds.includes(trait.id);
            return (
              <motion.div
                key={trait.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => toggleTrait(trait)}
                className={`
                  relative p-3 rounded-lg border cursor-pointer transition-all
                  ${getRarityColor(trait.rarityWeight)}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:border-primary/30'}
                  ${!trait.enabled ? 'opacity-50' : ''}
                `}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                )}
                <p className="font-medium text-sm pr-6">{trait.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {trait.rarityWeight}% rarity
                  </span>
                  {!trait.enabled && (
                    <Badge variant="outline" className="text-[9px] h-4">Disabled</Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {categoryTraits.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No traits in this category</p>
        </div>
      )}
    </div>
  );
}

function ImageUploader({ 
  imageUrl, 
  onImageChange 
}: { 
  imageUrl: string; 
  onImageChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Create a preview URL
    const url = URL.createObjectURL(file);
    onImageChange(url);
    toast.success('Image uploaded successfully');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {imageUrl ? (
        <div className="relative group rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt="NFT Preview"
            className="w-full aspect-square object-cover"
          />
          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Replace
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onImageChange('')}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            aspect-square rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3 transition-all
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-card/50'
            }
          `}
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drop image here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">
            PNG, JPG, GIF, MP4, GLB
          </p>
        </div>
      )}
    </div>
  );
}

function EditionManager({
  editions,
  onEditionsChange,
}: {
  editions: Edition[];
  onEditionsChange: (editions: Edition[]) => void;
}) {
  const addEdition = () => {
    onEditionsChange([...editions, createDefaultEdition()]);
  };

  const updateEdition = (id: string, field: keyof Edition, value: any) => {
    onEditionsChange(
      editions.map((ed) => (ed.id === id ? { ...ed, [field]: value } : ed))
    );
  };

  const removeEdition = (id: string) => {
    onEditionsChange(editions.filter((ed) => ed.id !== id));
  };

  return (
    <div className="space-y-4">
      {editions.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
          <Crown className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground mb-3">No editions added yet</p>
          <Button variant="outline" size="sm" onClick={addEdition}>
            <Plus className="w-4 h-4 mr-1" />
            Add First Edition
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {editions.map((edition, index) => (
              <motion.div
                key={edition.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 rounded-lg border border-border/50 bg-card/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Edition {index + 1}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeEdition(edition.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Edition Name */}
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Edition Name</Label>
                    <Input
                      placeholder="e.g., Genesis, Legendary"
                      value={edition.name}
                      onChange={(e) => updateEdition(edition.id, 'name', e.target.value)}
                    />
                  </div>

                  {/* Max Supply */}
                  <div className="space-y-2">
                    <Label className="text-xs">Max Supply</Label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="100"
                      value={edition.maxSupply}
                      onChange={(e) => updateEdition(edition.id, 'maxSupply', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Mint Price */}
                  <div className="space-y-2">
                    <Label className="text-xs">Mint Price</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.001}
                        placeholder="0.1"
                        value={edition.mintPrice}
                        onChange={(e) => updateEdition(edition.id, 'mintPrice', parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Select
                        value={edition.currency}
                        onValueChange={(v) => updateEdition(edition.id, 'currency', v)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="MATIC">MATIC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Reveal Status */}
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs">Reveal Status</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={edition.revealStatus === 'hidden' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => updateEdition(edition.id, 'revealStatus', 'hidden')}
                      >
                        <EyeOff className="w-4 h-4" />
                        Hidden
                      </Button>
                      <Button
                        type="button"
                        variant={edition.revealStatus === 'revealed' ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => updateEdition(edition.id, 'revealStatus', 'revealed')}
                      >
                        <Eye className="w-4 h-4" />
                        Revealed
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Button
            variant="outline"
            size="sm"
            onClick={addEdition}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Another Edition
          </Button>
        </div>
      )}
    </div>
  );
}

export function NFTForm({ nft, open, onOpenChange, onSave }: NFTFormProps) {
  const isEditing = !!nft;
  const [formData, setFormData] = useState<NFTFormData>(
    nft
      ? {
          name: nft.name,
          description: nft.description,
          collection: nft.collection,
          imageUrl: nft.imageUrl,
          tokenStandard: nft.tokenStandard,
          supplyType: nft.supplyType,
          traits: nft.traits,
          editions: nft.editions,
        }
      : defaultFormData
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof NFTFormData>(
    field: K,
    value: NFTFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter an NFT name');
      return;
    }
    if (!formData.collection) {
      toast.error('Please select a collection');
      return;
    }
    if (!formData.imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    setIsSaving(true);
    toast.loading(isEditing ? 'Updating NFT...' : 'Creating NFT...', { id: 'save' });

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success(
      isEditing ? 'NFT updated successfully!' : 'NFT created successfully!',
      { id: 'save' }
    );
    setIsSaving(false);
    onSave?.(formData);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFormData(defaultFormData);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 border-l border-border/50 bg-gradient-to-b from-card to-background">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader>
              <SheetTitle className="text-2xl font-display font-bold text-glow flex items-center gap-2">
                {isEditing ? (
                  <>
                    <FileJson className="w-6 h-6" />
                    Edit NFT
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    Create New NFT
                  </>
                )}
              </SheetTitle>
              <SheetDescription>
                {isEditing
                  ? 'Update your NFT metadata and properties'
                  : 'Fill in the details to create a new NFT'}
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Image */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  NFT Image
                </Label>
                <ImageUploader
                  imageUrl={formData.imageUrl}
                  onImageChange={(url) => updateField('imageUrl', url)}
                />
              </div>

              {/* Right Column - Basic Info */}
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Cyber Warrior #001"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>

                {/* Collection */}
                <div className="space-y-2">
                  <Label htmlFor="collection" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Collection
                  </Label>
                  <Select
                    value={formData.collection}
                    onValueChange={(v) => updateField('collection', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCollections.map((col) => (
                        <SelectItem key={col.id} value={col.name}>
                          {col.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Token Standard & Supply Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Token Standard
                    </Label>
                    <Select
                      value={formData.tokenStandard}
                      onValueChange={(v) =>
                        updateField('tokenStandard', v as TokenStandard)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ERC-721">ERC-721</SelectItem>
                        <SelectItem value="ERC-1155">ERC-1155</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Supply Type
                    </Label>
                    <Select
                      value={formData.supplyType}
                      onValueChange={(v) =>
                        updateField('supplyType', v as SupplyType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1/1">1/1 Unique</SelectItem>
                        <SelectItem value="Limited">Limited Edition</SelectItem>
                        <SelectItem value="Open Edition">Open Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" />
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your NFT..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports markdown formatting
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Trait Assignment */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4" />
                  Assign Traits
                </Label>
                <Badge variant="outline">
                  {formData.traits.length} selected
                </Badge>
              </div>

              {/* Selected Traits Preview */}
              {formData.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-card/50 border border-border/50">
                  {formData.traits.map((trait) => (
                    <Badge
                      key={trait.id}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      <span className="text-[10px] text-muted-foreground mr-1">
                        {trait.category}:
                      </span>
                      {trait.value}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-destructive/20"
                        onClick={() =>
                          updateField(
                            'traits',
                            formData.traits.filter((t) => t.id !== trait.id)
                          )
                        }
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <Card>
                <CardContent className="p-4">
                  <TraitSelector
                    selectedTraits={formData.traits}
                    onTraitsChange={(traits) => updateField('traits', traits)}
                  />
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-border/50" />

            {/* Edition Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-base">
                  <Crown className="w-4 h-4" />
                  Editions
                </Label>
                <Badge variant="outline">
                  {formData.editions.length} edition{formData.editions.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <Card>
                <CardContent className="p-4">
                  <EditionManager
                    editions={formData.editions}
                    onEditionsChange={(editions) => updateField('editions', editions)}
                  />
                </CardContent>
              </Card>
            </div>

            <Separator className="bg-border/50" />

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              {!isEditing && (
                <Button variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              )}
              <Button
                className="flex-1 gap-2"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving
                  ? 'Saving...'
                  : isEditing
                  ? 'Save Changes'
                  : 'Create NFT'}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
