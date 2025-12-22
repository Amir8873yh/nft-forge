import { motion } from 'framer-motion';
import { 
  Activity, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTransactions, type Transaction } from '@/data/mockData';
import { format } from 'date-fns';

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

function getTypeIcon(type: Transaction['type']) {
  switch (type) {
    case 'mint':
      return <Zap className="w-4 h-4 text-primary" />;
    case 'burn':
      return <Flame className="w-4 h-4 text-destructive" />;
    case 'transfer':
      return <ArrowUpRight className="w-4 h-4 text-success" />;
    case 'deploy':
      return <Activity className="w-4 h-4 text-accent" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
}

function getStatusVariant(status: Transaction['status']) {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function TransactionsView() {
  const confirmedCount = mockTransactions.filter(t => t.status === 'confirmed').length;
  const pendingCount = mockTransactions.filter(t => t.status === 'pending').length;
  const totalGas = mockTransactions
    .filter(t => t.gasUsed)
    .reduce((acc, t) => acc + parseFloat(t.gasUsed?.replace(' ETH', '') || '0'), 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-glow">Transactions</h1>
        <p className="text-muted-foreground mt-1">Transaction history and status tracking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-display font-bold">{mockTransactions.length}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-2xl font-display font-bold text-success">{confirmedCount}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-display font-bold text-warning">{pendingCount}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Gas Spent</p>
              <p className="text-2xl font-display font-bold">{totalGas.toFixed(4)} ETH</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div variants={itemVariants}>
        <Card glow>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>NFT</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead>Gas Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span className="capitalize font-medium">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {tx.nftName || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">{tx.hash}</span>
                    </TableCell>
                    <TableCell>
                      {tx.gasUsed || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(tx.status)}>
                        {tx.status === 'pending' && (
                          <div className="w-2 h-2 mr-1.5 rounded-full bg-warning animate-pulse" />
                        )}
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(tx.timestamp), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
