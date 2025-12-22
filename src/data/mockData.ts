// NFT Mock Data for Admin Panel

export type MintStatus = 'draft' | 'ready' | 'minted' | 'burned';
export type TokenStandard = 'ERC-721' | 'ERC-1155';
export type SupplyType = '1/1' | 'Limited' | 'Open Edition';
export type RevealStatus = 'hidden' | 'revealed';

export interface Trait {
  id: string;
  category: string;
  value: string;
  rarityWeight: number;
  enabled: boolean;
  imageUrl?: string;
}

export interface Edition {
  id: string;
  name: string;
  maxSupply: number;
  mintPrice: number;
  currency: 'ETH' | 'MATIC';
  revealStatus: RevealStatus;
  minted: number;
  imageUrl?: string;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  description: string;
  imageUrl: string;
  tokenStandard: TokenStandard;
  supplyType: SupplyType;
  mintStatus: MintStatus;
  traits: Trait[];
  editions: Edition[];
  tokenId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  symbol: string;
  contractAddress?: string;
  totalNFTs: number;
  minted: number;
  floorPrice: number;
  currency: 'ETH' | 'MATIC';
}

export interface Transaction {
  id: string;
  type: 'mint' | 'transfer' | 'burn' | 'deploy';
  nftId?: string;
  nftName?: string;
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  timestamp: string;
}

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Cyber Legends',
    symbol: 'CYBL',
    contractAddress: '0x1234...5678',
    totalNFTs: 10000,
    minted: 7823,
    floorPrice: 0.15,
    currency: 'ETH',
  },
  {
    id: 'col-2',
    name: 'Neon Warriors',
    symbol: 'NWAR',
    contractAddress: '0xabcd...efgh',
    totalNFTs: 5000,
    minted: 2156,
    floorPrice: 0.08,
    currency: 'ETH',
  },
  {
    id: 'col-3',
    name: 'Digital Dreams',
    symbol: 'DDRM',
    totalNFTs: 2500,
    minted: 0,
    floorPrice: 0.25,
    currency: 'MATIC',
  },
];

// Mock Traits
export const traitCategories = ['Background', 'Body', 'Eyes', 'Armor', 'Weapon', 'Power Aura'];

export const mockTraits: Trait[] = [
  { id: 't1', category: 'Background', value: 'Cyber City', rarityWeight: 15, enabled: true },
  { id: 't2', category: 'Background', value: 'Neon Grid', rarityWeight: 25, enabled: true },
  { id: 't3', category: 'Background', value: 'Dark Void', rarityWeight: 30, enabled: true },
  { id: 't4', category: 'Background', value: 'Holographic', rarityWeight: 5, enabled: true },
  { id: 't5', category: 'Eyes', value: 'Laser Red', rarityWeight: 10, enabled: true },
  { id: 't6', category: 'Eyes', value: 'Electric Blue', rarityWeight: 20, enabled: true },
  { id: 't7', category: 'Eyes', value: 'Void Black', rarityWeight: 8, enabled: true },
  { id: 't8', category: 'Armor', value: 'Titanium', rarityWeight: 30, enabled: true },
  { id: 't9', category: 'Armor', value: 'Plasma', rarityWeight: 15, enabled: true },
  { id: 't10', category: 'Armor', value: 'Quantum', rarityWeight: 5, enabled: false },
  { id: 't11', category: 'Weapon', value: 'Energy Blade', rarityWeight: 20, enabled: true },
  { id: 't12', category: 'Weapon', value: 'Plasma Cannon', rarityWeight: 12, enabled: true },
  { id: 't13', category: 'Power Aura', value: 'Golden', rarityWeight: 3, enabled: true },
  { id: 't14', category: 'Power Aura', value: 'Electric', rarityWeight: 18, enabled: true },
];

// Mock Editions
export const mockEditions: Edition[] = [
  { id: 'ed1', name: 'Genesis', maxSupply: 100, mintPrice: 0.5, currency: 'ETH', revealStatus: 'revealed', minted: 100 },
  { id: 'ed2', name: 'Legendary', maxSupply: 500, mintPrice: 0.25, currency: 'ETH', revealStatus: 'revealed', minted: 342 },
  { id: 'ed3', name: 'Mythic', maxSupply: 1000, mintPrice: 0.1, currency: 'ETH', revealStatus: 'hidden', minted: 0 },
  { id: 'ed4', name: 'Common', maxSupply: 5000, mintPrice: 0.05, currency: 'ETH', revealStatus: 'hidden', minted: 0 },
];

// Mock NFTs
export const mockNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Cyber Warrior #001',
    collection: 'Cyber Legends',
    description: 'A legendary cyber warrior from the future. Equipped with quantum armor and laser eyes, this warrior is unstoppable.',
    imageUrl: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400',
    tokenStandard: 'ERC-721',
    supplyType: '1/1',
    mintStatus: 'minted',
    tokenId: '1',
    traits: [mockTraits[0], mockTraits[4], mockTraits[8]],
    editions: [mockEditions[0]],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
  },
  {
    id: 'nft-2',
    name: 'Neon Phoenix #042',
    collection: 'Cyber Legends',
    description: 'A mythical phoenix reborn in the digital realm. Its wings emit a brilliant neon glow.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    tokenStandard: 'ERC-721',
    supplyType: 'Limited',
    mintStatus: 'ready',
    traits: [mockTraits[1], mockTraits[5], mockTraits[13]],
    editions: [mockEditions[1], mockEditions[2]],
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:45:00Z',
  },
  {
    id: 'nft-3',
    name: 'Void Walker #128',
    collection: 'Neon Warriors',
    description: 'A mysterious entity that traverses between dimensions. Rarely seen, highly sought after.',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=400',
    tokenStandard: 'ERC-1155',
    supplyType: 'Open Edition',
    mintStatus: 'draft',
    traits: [mockTraits[2], mockTraits[6], mockTraits[9]],
    editions: [mockEditions[3]],
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 'nft-4',
    name: 'Plasma Knight #007',
    collection: 'Cyber Legends',
    description: 'Elite warrior class equipped with experimental plasma technology.',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400',
    tokenStandard: 'ERC-721',
    supplyType: '1/1',
    mintStatus: 'minted',
    tokenId: '7',
    traits: [mockTraits[3], mockTraits[4], mockTraits[8], mockTraits[11]],
    editions: [mockEditions[0]],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T09:30:00Z',
  },
  {
    id: 'nft-5',
    name: 'Digital Samurai #256',
    collection: 'Neon Warriors',
    description: 'Ancient warrior code meets futuristic technology. Master of the energy blade.',
    imageUrl: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=400',
    tokenStandard: 'ERC-721',
    supplyType: 'Limited',
    mintStatus: 'ready',
    traits: [mockTraits[1], mockTraits[5], mockTraits[10]],
    editions: [mockEditions[1]],
    createdAt: '2024-01-22T12:00:00Z',
    updatedAt: '2024-01-23T16:00:00Z',
  },
  {
    id: 'nft-6',
    name: 'Quantum Entity #512',
    collection: 'Digital Dreams',
    description: 'Exists in multiple states simultaneously. A true marvel of digital art.',
    imageUrl: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=400',
    tokenStandard: 'ERC-1155',
    supplyType: 'Open Edition',
    mintStatus: 'burned',
    traits: [mockTraits[2], mockTraits[6], mockTraits[12]],
    editions: [],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'mint',
    nftId: 'nft-1',
    nftName: 'Cyber Warrior #001',
    hash: '0x7a8b9c...d1e2f3',
    status: 'confirmed',
    gasUsed: '0.0042 ETH',
    timestamp: '2024-01-20T14:22:00Z',
  },
  {
    id: 'tx-2',
    type: 'deploy',
    hash: '0x4e5f6a...b7c8d9',
    status: 'confirmed',
    gasUsed: '0.0156 ETH',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: 'tx-3',
    type: 'mint',
    nftId: 'nft-4',
    nftName: 'Plasma Knight #007',
    hash: '0x1a2b3c...4d5e6f',
    status: 'confirmed',
    gasUsed: '0.0038 ETH',
    timestamp: '2024-01-25T09:30:00Z',
  },
  {
    id: 'tx-4',
    type: 'burn',
    nftId: 'nft-6',
    nftName: 'Quantum Entity #512',
    hash: '0x9f8e7d...6c5b4a',
    status: 'confirmed',
    gasUsed: '0.0021 ETH',
    timestamp: '2024-01-28T10:00:00Z',
  },
  {
    id: 'tx-5',
    type: 'mint',
    nftId: 'nft-2',
    nftName: 'Neon Phoenix #042',
    hash: '0x3d4e5f...6a7b8c',
    status: 'pending',
    timestamp: '2024-01-29T08:15:00Z',
  },
];

// Dashboard Stats
export const dashboardStats = {
  totalNFTs: mockNFTs.length,
  totalMinted: mockNFTs.filter(n => n.mintStatus === 'minted').length,
  totalRemaining: mockNFTs.filter(n => n.mintStatus === 'draft' || n.mintStatus === 'ready').length,
  totalBurned: mockNFTs.filter(n => n.mintStatus === 'burned').length,
  totalCollections: mockCollections.length,
  avgFloorPrice: mockCollections.reduce((acc, c) => acc + c.floorPrice, 0) / mockCollections.length,
};

// Trait Frequency Data for Charts
export const traitFrequencyData = traitCategories.map(category => ({
  category,
  count: mockTraits.filter(t => t.category === category).length,
  enabled: mockTraits.filter(t => t.category === category && t.enabled).length,
}));

// Rarity Distribution Data
export const rarityDistributionData = [
  { name: 'Common (>20%)', value: mockTraits.filter(t => t.rarityWeight > 20).length, fill: 'hsl(var(--muted-foreground))' },
  { name: 'Uncommon (10-20%)', value: mockTraits.filter(t => t.rarityWeight >= 10 && t.rarityWeight <= 20).length, fill: 'hsl(var(--primary))' },
  { name: 'Rare (5-10%)', value: mockTraits.filter(t => t.rarityWeight >= 5 && t.rarityWeight < 10).length, fill: 'hsl(var(--accent))' },
  { name: 'Legendary (<5%)', value: mockTraits.filter(t => t.rarityWeight < 5).length, fill: 'hsl(var(--warning))' },
];

// Mint Progress Data
export const mintProgressData = mockCollections.map(col => ({
  name: col.name,
  minted: col.minted,
  remaining: col.totalNFTs - col.minted,
  total: col.totalNFTs,
}));
