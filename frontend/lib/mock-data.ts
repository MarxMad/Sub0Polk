export interface Project {
  id: string;
  student: string;
  title: string;
  description: string;
  github_url: string;
  demo_url: string;
  skills: string[];
  created_at: string;
  unlock_count: number;
  avg_rating: number;
  review_count: number;
}

export interface Review {
  reviewer: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    student: "0x1234567890123456789012345678901234567890",
    title: "DeFi Yield Aggregator on Polkadot",
    description: "Built a yield aggregation protocol that optimizes returns across multiple Polkadot parachains. Features auto-compounding, gas optimization, and cross-chain asset management.",
    github_url: "https://github.com/student/defi-aggregator",
    demo_url: "https://defi-demo.vercel.app",
    skills: ["Substrate", "ink!", "Rust", "React", "TypeScript"],
    created_at: "2025-01-10T10:00:00Z",
    unlock_count: 12,
    avg_rating: 4.8,
    review_count: 8,
  },
  {
    id: "2",
    student: "0x2345678901234567890123456789012345678901",
    title: "NFT Marketplace with Cross-Chain Support",
    description: "Full-stack NFT marketplace supporting Polkadot and Base chains with Hyperbridge integration. Includes minting, trading, and royalty management.",
    github_url: "https://github.com/student/nft-marketplace",
    demo_url: "https://nft-market-demo.vercel.app",
    skills: ["Solidity", "ink!", "Next.js", "Hyperbridge", "Web3.js"],
    created_at: "2025-01-08T14:30:00Z",
    unlock_count: 18,
    avg_rating: 4.9,
    review_count: 12,
  },
  {
    id: "3",
    student: "0x3456789012345678901234567890123456789012",
    title: "Decentralized Identity Verification System",
    description: "Privacy-preserving identity verification using zero-knowledge proofs on Polkadot. Enables selective disclosure of credentials without revealing personal data.",
    github_url: "https://github.com/student/zkp-identity",
    demo_url: "https://zkp-id-demo.vercel.app",
    skills: ["Zero-Knowledge Proofs", "Substrate", "Rust", "Cryptography"],
    created_at: "2025-01-05T09:15:00Z",
    unlock_count: 15,
    avg_rating: 4.7,
    review_count: 10,
  },
  {
    id: "4",
    student: "0x4567890123456789012345678901234567890123",
    title: "Governance DAO with Multi-Chain Voting",
    description: "Decentralized autonomous organization with cross-chain voting capabilities. Supports proposal creation, weighted voting, and treasury management.",
    github_url: "https://github.com/student/dao-governance",
    demo_url: "https://dao-demo.vercel.app",
    skills: ["Smart Contracts", "ink!", "Governance", "TypeScript", "React"],
    created_at: "2025-01-03T16:45:00Z",
    unlock_count: 9,
    avg_rating: 4.6,
    review_count: 6,
  },
  {
    id: "5",
    student: "0x5678901234567890123456789012345678901234",
    title: "Blockchain-Based Supply Chain Tracker",
    description: "End-to-end supply chain tracking solution using Polkadot for transparency and immutability. Tracks products from manufacturer to consumer.",
    github_url: "https://github.com/student/supply-chain",
    demo_url: "https://supply-chain-demo.vercel.app",
    skills: ["Substrate", "ink!", "IoT Integration", "React", "Node.js"],
    created_at: "2025-01-01T12:00:00Z",
    unlock_count: 7,
    avg_rating: 4.5,
    review_count: 5,
  },
  {
    id: "6",
    student: "0x6789012345678901234567890123456789012345",
    title: "Decentralized Exchange (DEX) Aggregator",
    description: "Smart routing system that finds the best prices across multiple DEXs on Polkadot and Base. Minimizes slippage and gas costs.",
    github_url: "https://github.com/student/dex-aggregator",
    demo_url: "https://dex-agg-demo.vercel.app",
    skills: ["DeFi", "AMM", "ink!", "Solidity", "Optimization"],
    created_at: "2024-12-28T08:30:00Z",
    unlock_count: 14,
    avg_rating: 4.9,
    review_count: 9,
  },
];

export const mockReviews: Record<string, Review[]> = {
  "1": [
    {
      reviewer: "0xabcdef1234567890abcdef1234567890abcdef12",
      rating: 5,
      comment: "Excellent work on the yield optimization algorithm. Clean code and well-documented. Hired for our DeFi project!",
      timestamp: "2025-01-12T15:30:00Z",
    },
    {
      reviewer: "0xbcdef1234567890abcdef1234567890abcdef123",
      rating: 4,
      comment: "Great project with solid fundamentals. Could improve on UI/UX but the core functionality is impressive.",
      timestamp: "2025-01-11T10:20:00Z",
    },
  ],
  "2": [
    {
      reviewer: "0xcdef1234567890abcdef1234567890abcdef1234",
      rating: 5,
      comment: "Amazing cross-chain implementation! The Hyperbridge integration is seamless. Very talented developer.",
      timestamp: "2025-01-10T14:45:00Z",
    },
  ],
};
