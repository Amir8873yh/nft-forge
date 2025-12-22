import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Image, 
  Layers, 
  FileJson, 
  Wallet, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Hexagon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'nfts', label: 'NFT Items', icon: <Image className="w-5 h-5" /> },
  { id: 'traits', label: 'Trait Builder', icon: <Layers className="w-5 h-5" /> },
  { id: 'metadata', label: 'Metadata', icon: <FileJson className="w-5 h-5" /> },
  { id: 'blockchain', label: 'Blockchain', icon: <Wallet className="w-5 h-5" /> },
  { id: 'transactions', label: 'Transactions', icon: <Activity className="w-5 h-5" /> },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="relative">
          <Hexagon className="w-10 h-10 text-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">NFT</span>
          </div>
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col"
          >
            <span className="font-display font-bold text-lg text-foreground">NFT Admin</span>
            <span className="text-xs text-muted-foreground">Control Panel</span>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
              "hover:bg-sidebar-accent group relative overflow-hidden",
              activeTab === item.id 
                ? "bg-primary/10 text-primary border border-primary/30" 
                : "text-sidebar-foreground hover:text-foreground"
            )}
          >
            <span className={cn(
              "transition-colors",
              activeTab === item.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )}>
              {item.icon}
            </span>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                {item.label}
              </motion.span>
            )}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"
              />
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
