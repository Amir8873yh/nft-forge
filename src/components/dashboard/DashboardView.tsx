import { motion } from 'framer-motion';
import { 
  Image, 
  Coins, 
  TrendingUp, 
  Layers, 
  Flame,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  dashboardStats, 
  rarityDistributionData, 
  mintProgressData,
  traitFrequencyData,
  mockTransactions 
} from '@/data/mockData';

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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; positive: boolean };
  accentColor?: 'primary' | 'accent' | 'success' | 'warning';
}

function StatCard({ title, value, icon, change, accentColor = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary border-primary/30 bg-primary/5',
    accent: 'text-accent border-accent/30 bg-accent/5',
    success: 'text-success border-success/30 bg-success/5',
    warning: 'text-warning border-warning/30 bg-warning/5',
  };

  return (
    <motion.div variants={itemVariants}>
      <Card glow className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{title}</p>
              <p className="text-3xl font-display font-bold">{value}</p>
              {change && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${change.positive ? 'text-success' : 'text-destructive'}`}>
                  {change.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(change.value)}%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg border ${colorClasses[accentColor]}`}>
              {icon}
            </div>
          </div>
        </CardContent>
        {/* Decorative gradient */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${accentColor} to-transparent opacity-50`} />
      </Card>
    </motion.div>
  );
}

export function DashboardView() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-glow">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your NFT collections and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total NFTs"
          value={dashboardStats.totalNFTs}
          icon={<Image className="w-5 h-5" />}
          change={{ value: 12, positive: true }}
          accentColor="primary"
        />
        <StatCard
          title="Minted"
          value={dashboardStats.totalMinted}
          icon={<Coins className="w-5 h-5" />}
          change={{ value: 8, positive: true }}
          accentColor="success"
        />
        <StatCard
          title="Remaining"
          value={dashboardStats.totalRemaining}
          icon={<Layers className="w-5 h-5" />}
          accentColor="warning"
        />
        <StatCard
          title="Avg Floor Price"
          value={`${dashboardStats.avgFloorPrice.toFixed(2)} ETH`}
          icon={<TrendingUp className="w-5 h-5" />}
          change={{ value: 5, positive: false }}
          accentColor="accent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mint Progress Chart */}
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardHeader>
              <CardTitle className="text-lg">Mint Progress by Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mintProgressData} layout="vertical">
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="minted" stackId="a" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="remaining" stackId="a" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rarity Distribution */}
        <motion.div variants={itemVariants}>
          <Card glow>
            <CardHeader>
              <CardTitle className="text-lg">Rarity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rarityDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {rarityDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                      formatter={(value) => <span className="text-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trait Frequency */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card glow>
            <CardHeader>
              <CardTitle className="text-lg">Trait Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={traitFrequencyData}>
                    <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="enabled" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <Card glow className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTransactions.slice(0, 4).map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'confirmed' ? 'bg-success' : 
                      tx.status === 'pending' ? 'bg-warning animate-pulse' : 
                      'bg-destructive'
                    }`} />
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.hash}</p>
                    </div>
                  </div>
                  <Badge variant={tx.status === 'confirmed' ? 'success' : tx.status === 'pending' ? 'warning' : 'destructive'}>
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
