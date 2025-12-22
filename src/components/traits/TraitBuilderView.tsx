import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GripVertical,
  ChevronDown,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { mockTraits, traitCategories, type Trait } from '@/data/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

interface TraitItemProps {
  trait: Trait;
  onToggle: (id: string) => void;
  onUpdateRarity: (id: string, rarity: number) => void;
}

function TraitItem({ trait, onToggle, onUpdateRarity }: TraitItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      layout
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        trait.enabled 
          ? 'bg-card border-primary/20 hover:border-primary/40' 
          : 'bg-muted/30 border-border opacity-60'
      }`}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm">{trait.value}</span>
          {trait.rarityWeight < 5 && (
            <Badge variant="warning" className="text-[10px]">
              <Sparkles className="w-3 h-3 mr-1" /> Rare
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={[trait.rarityWeight]}
              onValueChange={([val]) => onUpdateRarity(trait.id, val)}
              max={100}
              step={1}
              className="cursor-pointer"
              disabled={!trait.enabled}
            />
          </div>
          <span className="text-sm text-muted-foreground w-12 text-right">
            {trait.rarityWeight}%
          </span>
        </div>
      </div>

      <Switch
        checked={trait.enabled}
        onCheckedChange={() => onToggle(trait.id)}
      />
    </motion.div>
  );
}

interface TraitCategoryProps {
  category: string;
  traits: Trait[];
  onToggle: (id: string) => void;
  onUpdateRarity: (id: string, rarity: number) => void;
}

function TraitCategory({ category, traits, onToggle, onUpdateRarity }: TraitCategoryProps) {
  const [expanded, setExpanded] = useState(true);
  const enabledCount = traits.filter(t => t.enabled).length;
  const totalRarity = traits.filter(t => t.enabled).reduce((acc, t) => acc + t.rarityWeight, 0);

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span className="font-display font-semibold">{category}</span>
          <Badge variant="outline">{enabledCount}/{traits.length}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Total: <span className={totalRarity !== 100 ? 'text-warning' : 'text-success'}>{totalRarity}%</span>
          </div>
          <Progress value={totalRarity} className="w-24 h-2" />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 pl-6 overflow-hidden"
          >
            {traits.map(trait => (
              <TraitItem 
                key={trait.id} 
                trait={trait} 
                onToggle={onToggle}
                onUpdateRarity={onUpdateRarity}
              />
            ))}
            <Button variant="ghost" className="w-full border border-dashed border-border hover:border-primary/50">
              <Plus className="w-4 h-4 mr-2" />
              Add {category} Trait
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function TraitBuilderView() {
  const [traits, setTraits] = useState<Trait[]>(mockTraits);

  const handleToggle = (id: string) => {
    setTraits(prev => prev.map(t => 
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const handleUpdateRarity = (id: string, rarity: number) => {
    setTraits(prev => prev.map(t => 
      t.id === id ? { ...t, rarityWeight: rarity } : t
    ));
  };

  const groupedTraits = traitCategories.reduce((acc, category) => {
    acc[category] = traits.filter(t => t.category === category);
    return acc;
  }, {} as Record<string, Trait[]>);

  const totalEnabledTraits = traits.filter(t => t.enabled).length;
  const totalTraits = traits.length;

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
          <h1 className="text-3xl font-display font-bold text-glow">Trait Builder</h1>
          <p className="text-muted-foreground mt-1">Define trait categories and rarity weights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Traits</p>
              <p className="text-2xl font-display font-bold">{totalTraits}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <ToggleRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enabled</p>
              <p className="text-2xl font-display font-bold text-success">{totalEnabledTraits}</p>
            </div>
            <div className="p-3 rounded-lg bg-success/10 text-success">
              <ToggleRight className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-display font-bold">{traitCategories.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trait Categories */}
      <Card glow>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Trait Layers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {traitCategories.map(category => (
            <TraitCategory
              key={category}
              category={category}
              traits={groupedTraits[category] || []}
              onToggle={handleToggle}
              onUpdateRarity={handleUpdateRarity}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
