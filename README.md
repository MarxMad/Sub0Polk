# DotGo 🚀

**Cross-Chain Student Portfolio Platform - Where Young Talent Meets Opportunity**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hackathon](https://img.shields.io/badge/Hackathon-sub0%20HACK-blue)](https://luma.com/sub0hack)

---

## 🎯 Overview

**DotGo** is a cross-chain portfolio platform where students and young professionals showcase real projects and earn **verified reviews from industry mentors**. Built for [sub0 HACK Buenos Aires](https://luma.com/sub0hack) targeting:

- **Arkiv Main Track** ($10k) - Queryable, time-scoped, verifiable student data
- **Hyperbridge Track** ($5k) - Cross-chain storage queries for reputation aggregation

### The Problem

Students face a catch-22:
- ❌ Need experience to get experience
- ❌ Portfolio projects lack credibility
- ❌ Self-taught skills dismissed
- ❌ Reputation fragmented across chains

### The Solution

**Pay-to-Review + Cross-Chain Verification**

1. Students create project portfolios (GitHub repos, demos, skills)
2. Mentors pay **3 DOT** to unlock project details
3. Students receive **2.5 DOT** instantly (no escrow)
4. Mentors leave **cryptographically verified reviews**
5. **Arkiv** makes portfolios queryable: "Find React devs with 5★ rating in last 6 months"
6. **Hyperbridge** aggregates reputation: "This student has credentials on Polkadot + Ethereum + Base"

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    DotGo Platform                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐   ┌────────────┐ │
│  │   Frontend   │───▶│   Arkiv DB   │───│ Hyperbridge│ │
│  │  (Next.js)   │    │  (Queryable) │   │    SDK     │ │
│  └──────┬───────┘    └──────┬───────┘   └─────┬──────┘ │
│         │                   │                  │         │
│         └───────────────────┴──────────────────┘         │
│                             │                            │
└─────────────────────────────┼────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐         ┌──────▼──────┐      ┌──────▼──────┐
   │Polkadot │         │  Ethereum   │      │    Base     │
   │ ink! SC │◀────────│    EVM SC   │◀─────│   EVM SC    │
   └─────────┘         └─────────────┘      └─────────────┘
        │                     │                     │
   Cross-chain Storage Queries via Hyperbridge GET requests
```

### Tech Stack

**Smart Contracts**:
- Polkadot: ink! (Rust) on Contracts parachain
- Base: Solidity with Hyperbridge SDK integration

**Data Layer**:
- Arkiv: Queryable, time-scoped, verifiable database
- Hyperbridge: Cross-chain storage queries

**Frontend**:
- Next.js 15 + TypeScript
- Polkadot.js API + @polkadot/extension-dapp
- Hyperbridge SDK
- Arkiv SDK (JavaScript/TypeScript)
- Tailwind CSS v4

---

## 📂 Project Structure

```
Sub0Polk/
├── contracts/               # Smart contracts
│   ├── polkadot/           # ink! contracts
│   │   ├── dotgo_portfolio/
│   │   └── Cargo.toml
│   └── base/               # Solidity contracts (Hyperbridge)
│       ├── contracts/
│       ├── scripts/
│       └── hardhat.config.ts
├── frontend/               # Next.js application
│   ├── app/               # App router
│   ├── components/        # React components
│   ├── lib/              # Utilities & integrations
│   │   ├── arkiv/        # Arkiv SDK integration
│   │   ├── hyperbridge/  # Hyperbridge SDK integration
│   │   └── polkadot/     # Polkadot.js integration
│   └── public/           # Static assets
├── indexer/               # Arkiv data indexer
│   └── src/
├── docs/                  # Documentation
│   ├── DotGo.md          # Complete specification
│   └── DUAL_TRACK_STRATEGY.md
├── README.md             # This file
├── LICENSE               # MIT License
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.17.0+
- Rust 1.75+ with `wasm32-unknown-unknown` target
- cargo-contract 4.0+
- Polkadot.js browser extension
- MetaMask (for Base testnet)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/Sub0Polk.git
cd Sub0Polk
```

### 2. Smart Contracts Setup

#### Polkadot (ink!)

```bash
cd contracts/polkadot/dotgo_portfolio

# Install dependencies
cargo build

# Compile contract
cargo contract build

# Run tests
cargo test

# Deploy to testnet (Rococo Contracts parachain)
cargo contract upload --suri //Alice
cargo contract instantiate --suri //Alice --args <treasury_address>
```

#### Base (Solidity + Hyperbridge)

```bash
cd contracts/base

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Verify on Basescan
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables
# Add:
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# - NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS
# - NEXT_PUBLIC_BASE_CONTRACT_ADDRESS
# - NEXT_PUBLIC_ARKIV_API_KEY
# - NEXT_PUBLIC_HYPERBRIDGE_RPC

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Arkiv Indexer Setup

```bash
cd indexer

# Install dependencies
npm install

# Configure Arkiv connection
cp .env.example .env
# Add ARKIV_NETWORK_ID and RPC_URL

# Start indexer
npm run index

# Query data
npm run query
```

---

## 🎯 Hackathon Tracks

### Arkiv Main Track ($10k)

**Integration**: Queryable, time-scoped, verifiable student portfolio data

**Key Features**:
- SQL-like queries: `SELECT * FROM projects WHERE skills LIKE '%React%' AND avg_rating >= 4`
- Time-scoped tracking: Student skill progression over time
- Verifiable integrity: Cryptographic proofs tie data to blockchain

**Demo Points**:
- Fast search without blockchain latency
- "Show me students who improved from 3★ to 5★ in React over 6 months"
- Database integrity verification

### Hyperbridge Track ($5k)

**Integration**: Cross-chain storage queries for reputation aggregation

**Key Features**:
- Query student's NFT badges from Ethereum
- Verify GitHub commit attestations from Base
- Aggregate reviews from Polkadot + EVM chains
- Cross-chain unlock verification via storage proofs

**Demo Points**:
- 4+ different storage query patterns
- Multi-chain reputation dashboard
- Storage proof visualizer

---

## 💡 Core Features

### For Students
- ✅ Create project portfolios (GitHub, demo, skills)
- ✅ Earn 2.5 DOT per unlock (instant payment)
- ✅ Build verifiable on-chain reputation
- ✅ Cross-chain credential aggregation
- ✅ Portable reputation across Web3

### For Mentors/Reviewers
- ✅ Discover promising talent
- ✅ Pay 3 DOT to unlock full project details
- ✅ Leave verified reviews (cryptographically proven)
- ✅ Query portfolios via Arkiv (fast, time-scoped)
- ✅ Verify cross-chain achievements via Hyperbridge

### For Employers
- ✅ Fast talent search (Arkiv queries)
- ✅ Verified reviews (can't be faked)
- ✅ Cross-chain reputation visibility
- ✅ Time-scoped skill tracking
- ✅ Pre-vetted junior developers

---

## 🛠️ Development

### Running Tests

```bash
# Smart contracts
cd contracts/polkadot/dotgo_portfolio
cargo test

cd contracts/base
npx hardhat test

# Frontend
cd frontend
npm run test

# Integration tests
npm run test:e2e
```

### Building for Production

```bash
# Contracts
cargo contract build --release

# Frontend
cd frontend
npm run build
npm start
```

### Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

---

## 📊 Milestones

### Hackathon (72 hours)
- ✅ ink! contract deployed on Rococo
- ✅ Solidity contract deployed on Base Sepolia
- ✅ Arkiv DB-chain indexing project data
- ✅ Hyperbridge storage queries functional
- ✅ Next.js UI with wallet integration
- ✅ End-to-end demo (create → unlock → review → verify)

### Milestone 2 (30 days post-hackathon)
- [ ] Employer discovery marketplace
- [ ] Skill-based NFT credentials (PSP-34)
- [ ] XCM cross-chain reputation bridge
- [ ] Enhanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Production mainnet launch

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📚 Documentation

- [Complete Specification](./docs/DotGo.md) - Full technical details
- [Dual-Track Strategy](./docs/DUAL_TRACK_STRATEGY.md) - Hackathon approach
- [Smart Contract API](./docs/API.md) - Contract interface reference
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design
- [Deployment Guide](./docs/DEPLOYMENT.md) - How to deploy

---

## 🔗 Links

### Hackathon
- [sub0 HACK Event](https://luma.com/sub0hack)
- [Arkiv Network](https://arkiv.network/dev)
- [Hyperbridge Docs](https://docs.hyperbridge.network/)

### Networks
- [Polkadot Contracts UI](https://contracts-ui.substrate.io/)
- [Base Sepolia Explorer](https://sepolia.basescan.org)
- [Arkiv Mendoza Testnet](https://arkiv.network)

### Developer Resources
- [ink! Documentation](https://use.ink)
- [Polkadot.js API](https://polkadot.js.org/docs/)
- [Hyperbridge SDK](https://docs.hyperbridge.network/developers/evm/getting-started)
- [Arkiv Developer Docs](https://arkiv.network/dev)

---

## 🏆 Hackathon Details

**Event**: sub0 HACK Buenos Aires
**Dates**: November 14-16, 2024 (72 hours)
**Location**: Bubble Studios, Buenos Aires, Argentina

**Tracks**:
- Arkiv Main Track: $10,000
- Hyperbridge Track: $5,000
- **Total Target**: $15,000

**Team**: [Your Team Name]
- [Team Member 1] - Smart Contracts & Backend
- [Team Member 2] - Frontend & Integration
- [Team Member 3] - Design & UX

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/Sub0Polk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Sub0Polk/discussions)
- **Twitter**: [@DotGoApp](https://twitter.com/DotGoApp)
- **Discord**: [Join our community](#)

---

## 🙏 Acknowledgments

- [Polkadot](https://polkadot.network) - For the amazing blockchain ecosystem
- [Arkiv Network](https://arkiv.network) - For queryable blockchain data infrastructure
- [Hyperbridge](https://hyperbridge.network) - For secure cross-chain communication
- [sub0 HACK](https://luma.com/sub0hack) - For hosting the hackathon
- ProofGig - For inspiration on the pay-to-unlock model

---

**Built with ❤️ on Polkadot, Arkiv, and Hyperbridge**

*Where young talent meets opportunity, verified across chains.*
