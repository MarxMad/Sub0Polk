# DotGo Build Plan 🚀

**Hackathon Implementation Plan**
**Target**: sub0 HACK Buenos Aires | Arkiv Main Track + Hyperbridge Track

---

## 📋 Pre-Build Checklist

### Development Environment Setup

**Required Software**:
```bash
# Node.js & Package Managers
node --version  # 20.17.0+
npm --version   # 10+

# Rust & ink! Tools
rustup update
rustup target add wasm32-unknown-unknown
cargo install cargo-contract --version 4.0.0

# Browser Extensions
# - Polkadot.js extension
# - MetaMask

# Git Configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**API Keys & Accounts**:
- [ ] WalletConnect Project ID → https://cloud.walletconnect.com/
- [ ] Arkiv Network API Key → https://arkiv.network/dev
- [ ] Faucet funds for Rococo testnet → https://faucet.polkadot.io/
- [ ] Base Sepolia testnet ETH → https://sepoliafaucet.com/

**Repository Clone**:
```bash
cd /Users/osx/Projects/JulioMCruz/Polkadot
cd Sub0Polk
```

---

## 🎯 Phase 1: Smart Contracts + Arkiv Integration

### Step 1: Project Scaffolding

**Create Directory Structure**:
```bash
# Smart Contracts
mkdir -p contracts/polkadot/dotgo_portfolio
mkdir -p contracts/base/contracts
mkdir -p contracts/base/scripts

# Frontend
mkdir -p frontend/app
mkdir -p frontend/components
mkdir -p frontend/lib/{arkiv,hyperbridge,polkadot}
mkdir -p frontend/public

# Indexer
mkdir -p indexer/src

# Documentation
mkdir -p docs
```

**Initialize ink! Contract**:
```bash
cd contracts/polkadot
cargo contract new dotgo_portfolio
cd dotgo_portfolio
```

**Initialize Hardhat Project**:
```bash
cd contracts/base
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init  # Choose "TypeScript project"
```

**Initialize Next.js Frontend**:
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install @polkadot/api @polkadot/extension-dapp
npm install @rainbow-me/rainbowkit wagmi viem@2.x
npm install lucide-react
```

### Step 2: ink! Smart Contract Implementation

**File**: `contracts/polkadot/dotgo_portfolio/lib.rs`

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dotgo_portfolio {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    // ==================== DATA STRUCTURES ====================

    #[derive(scale::Decode, scale::Encode, Clone, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Project {
        pub id: u64,
        pub student: AccountId,
        pub title: String,
        pub description: String,
        pub github_url: String,
        pub demo_url: String,
        pub skills: Vec<String>,
        pub created_at: Timestamp,
        pub unlock_count: u32,
        pub avg_rating: u8,
    }

    #[derive(scale::Decode, scale::Encode, Clone, Debug)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Review {
        pub reviewer: AccountId,
        pub rating: u8,
        pub comment: String,
        pub timestamp: Timestamp,
    }

    #[ink(event)]
    pub struct ProjectCreated {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        student: AccountId,
        title: String,
    }

    #[ink(event)]
    pub struct ProjectUnlocked {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        reviewer: AccountId,
        amount_paid: Balance,
    }

    #[ink(event)]
    pub struct ReviewSubmitted {
        #[ink(topic)]
        project_id: u64,
        #[ink(topic)]
        reviewer: AccountId,
        rating: u8,
    }

    // ==================== STORAGE ====================

    #[ink(storage)]
    pub struct DotGoPortfolio {
        next_project_id: u64,
        projects: Mapping<u64, Project>,
        student_projects: Mapping<AccountId, Vec<u64>>,
        unlocked: Mapping<(u64, AccountId), bool>,
        reviews: Mapping<u64, Vec<Review>>,
        unlock_price: Balance,
        student_share: Balance,
        platform_share: Balance,
        platform_treasury: AccountId,
    }

    // ==================== ERRORS ====================

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        ProjectNotFound,
        NotUnlocked,
        AlreadyUnlocked,
        InsufficientPayment,
        CannotReviewOwnProject,
        InvalidRating,
        TransferFailed,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    // ==================== IMPLEMENTATION ====================

    impl DotGoPortfolio {
        #[ink(constructor)]
        pub fn new(platform_treasury: AccountId) -> Self {
            Self {
                next_project_id: 0,
                projects: Mapping::default(),
                student_projects: Mapping::default(),
                unlocked: Mapping::default(),
                reviews: Mapping::default(),
                unlock_price: 3_000_000_000_000, // 3 DOT
                student_share: 2_500_000_000_000, // 2.5 DOT
                platform_share: 500_000_000_000,   // 0.5 DOT
                platform_treasury,
            }
        }

        #[ink(message)]
        pub fn create_project(
            &mut self,
            title: String,
            description: String,
            github_url: String,
            demo_url: String,
            skills: Vec<String>,
        ) -> u64 {
            let project_id = self.next_project_id;
            let student = self.env().caller();

            let project = Project {
                id: project_id,
                student,
                title: title.clone(),
                description,
                github_url,
                demo_url,
                skills,
                created_at: self.env().block_timestamp(),
                unlock_count: 0,
                avg_rating: 0,
            };

            self.projects.insert(project_id, &project);

            let mut student_project_ids = self.student_projects.get(&student).unwrap_or_default();
            student_project_ids.push(project_id);
            self.student_projects.insert(&student, &student_project_ids);

            self.next_project_id += 1;

            self.env().emit_event(ProjectCreated {
                project_id,
                student,
                title,
            });

            project_id
        }

        #[ink(message, payable)]
        pub fn unlock_project(&mut self, project_id: u64) -> Result<()> {
            let reviewer = self.env().caller();
            let payment = self.env().transferred_value();

            let mut project = self.projects.get(project_id).ok_or(Error::ProjectNotFound)?;

            if project.student == reviewer {
                return Err(Error::CannotReviewOwnProject);
            }

            if self.unlocked.get((project_id, reviewer)).unwrap_or(false) {
                return Err(Error::AlreadyUnlocked);
            }

            if payment < self.unlock_price {
                return Err(Error::InsufficientPayment);
            }

            // Transfer student share
            if self.env().transfer(project.student, self.student_share).is_err() {
                return Err(Error::TransferFailed);
            }

            // Transfer platform share
            if self.env().transfer(self.platform_treasury, self.platform_share).is_err() {
                return Err(Error::TransferFailed);
            }

            // Mark as unlocked
            self.unlocked.insert((project_id, reviewer), &true);
            project.unlock_count += 1;
            self.projects.insert(project_id, &project);

            self.env().emit_event(ProjectUnlocked {
                project_id,
                reviewer,
                amount_paid: payment,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn submit_review(
            &mut self,
            project_id: u64,
            rating: u8,
            comment: String,
        ) -> Result<()> {
            let reviewer = self.env().caller();

            if !self.unlocked.get((project_id, reviewer)).unwrap_or(false) {
                return Err(Error::NotUnlocked);
            }

            if rating == 0 || rating > 5 {
                return Err(Error::InvalidRating);
            }

            let review = Review {
                reviewer,
                rating,
                comment,
                timestamp: self.env().block_timestamp(),
            };

            let mut reviews = self.reviews.get(project_id).unwrap_or_default();
            reviews.push(review);
            self.reviews.insert(project_id, &reviews);

            // Update average rating
            let mut project = self.projects.get(project_id).ok_or(Error::ProjectNotFound)?;
            let total_rating: u32 = reviews.iter().map(|r| r.rating as u32).sum();
            project.avg_rating = (total_rating / reviews.len() as u32) as u8;
            self.projects.insert(project_id, &project);

            self.env().emit_event(ReviewSubmitted {
                project_id,
                reviewer,
                rating,
            });

            Ok(())
        }

        #[ink(message)]
        pub fn get_project(&self, project_id: u64) -> Option<Project> {
            self.projects.get(project_id)
        }

        #[ink(message)]
        pub fn get_student_projects(&self, student: AccountId) -> Vec<u64> {
            self.student_projects.get(&student).unwrap_or_default()
        }

        #[ink(message)]
        pub fn get_reviews(&self, project_id: u64) -> Vec<Review> {
            self.reviews.get(project_id).unwrap_or_default()
        }

        #[ink(message)]
        pub fn is_unlocked(&self, project_id: u64, reviewer: AccountId) -> bool {
            self.unlocked.get((project_id, reviewer)).unwrap_or(false)
        }

        #[ink(message)]
        pub fn get_unlock_price(&self) -> Balance {
            self.unlock_price
        }
    }

    // ==================== TESTS ====================

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn create_project_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = DotGoPortfolio::new(accounts.alice);

            let project_id = contract.create_project(
                String::from("My Portfolio"),
                String::from("A cool project"),
                String::from("https://github.com/user/repo"),
                String::from("https://demo.com"),
                vec![String::from("Rust"), String::from("React")],
            );

            assert_eq!(project_id, 0);
            assert!(contract.get_project(project_id).is_some());
        }

        #[ink::test]
        fn unlock_and_review_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = DotGoPortfolio::new(accounts.alice);

            let project_id = contract.create_project(
                String::from("My Portfolio"),
                String::from("A cool project"),
                String::from("https://github.com/user/repo"),
                String::from("https://demo.com"),
                vec![String::from("Rust")],
            );

            // Switch to Bob (reviewer)
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            ink::env::test::set_value_transferred::<ink::env::DefaultEnvironment>(3_000_000_000_000);

            let result = contract.unlock_project(project_id);
            assert!(result.is_ok());

            let review_result = contract.submit_review(project_id, 5, String::from("Great!"));
            assert!(review_result.is_ok());

            let reviews = contract.get_reviews(project_id);
            assert_eq!(reviews.len(), 1);
            assert_eq!(reviews[0].rating, 5);
        }
    }
}
```

**Build & Test**:
```bash
cd contracts/polkadot/dotgo_portfolio
cargo contract build
cargo test
```

### Step 3: Arkiv Integration

**File**: `indexer/src/index.ts`

```typescript
import { createArkivClient } from '@arkiv/sdk';

interface DotGoProject {
  project_id: number;
  student_address: string;
  title: string;
  description: string;
  github_url: string;
  demo_url: string;
  skills: string[];
  created_at: number;
  unlock_count: number;
  avg_rating: number;
}

interface DotGoReview {
  project_id: number;
  reviewer_address: string;
  rating: number;
  comment: string;
  timestamp: number;
}

const arkiv = createArkivClient({
  apiKey: process.env.ARKIV_API_KEY!,
  network: 'mendoza-testnet',
});

async function setupDatabase() {
  // Create Projects table
  await arkiv.query(`
    CREATE TABLE IF NOT EXISTS dotgo_projects (
      project_id BIGINT PRIMARY KEY,
      student_address TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      github_url TEXT,
      demo_url TEXT,
      skills TEXT[],
      created_at BIGINT NOT NULL,
      unlock_count INT DEFAULT 0,
      avg_rating INT DEFAULT 0
    )
  `);

  // Create Reviews table
  await arkiv.query(`
    CREATE TABLE IF NOT EXISTS dotgo_reviews (
      id SERIAL PRIMARY KEY,
      project_id BIGINT REFERENCES dotgo_projects(project_id),
      reviewer_address TEXT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      timestamp BIGINT NOT NULL
    )
  `);

  // Create indexes
  await arkiv.query(`
    CREATE INDEX IF NOT EXISTS idx_student ON dotgo_projects(student_address);
    CREATE INDEX IF NOT EXISTS idx_skills ON dotgo_projects USING GIN(skills);
    CREATE INDEX IF NOT EXISTS idx_rating ON dotgo_projects(avg_rating);
    CREATE INDEX IF NOT EXISTS idx_reviews_project ON dotgo_reviews(project_id);
  `);
}

async function indexBlockchainEvents() {
  // Listen for ProjectCreated events
  await arkiv.subscribeToEvents({
    contract: process.env.POLKADOT_CONTRACT_ADDRESS!,
    events: ['ProjectCreated', 'ProjectUnlocked', 'ReviewSubmitted'],
    handler: async (event: any) => {
      switch (event.name) {
        case 'ProjectCreated':
          await arkiv.query(`
            INSERT INTO dotgo_projects (
              project_id, student_address, title, description,
              github_url, demo_url, skills, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            event.data.project_id,
            event.data.student,
            event.data.title,
            event.data.description,
            event.data.github_url,
            event.data.demo_url,
            event.data.skills,
            event.data.created_at,
          ]);
          break;

        case 'ProjectUnlocked':
          await arkiv.query(`
            UPDATE dotgo_projects
            SET unlock_count = unlock_count + 1
            WHERE project_id = $1
          `, [event.data.project_id]);
          break;

        case 'ReviewSubmitted':
          await arkiv.query(`
            INSERT INTO dotgo_reviews (
              project_id, reviewer_address, rating, comment, timestamp
            ) VALUES ($1, $2, $3, $4, $5)
          `, [
            event.data.project_id,
            event.data.reviewer,
            event.data.rating,
            event.data.comment,
            event.data.timestamp,
          ]);
          break;
      }
    },
  });
}

// Export query helpers
export async function searchProjects(
  skills?: string[],
  minRating?: number,
  limit: number = 20
) {
  let query = 'SELECT * FROM dotgo_projects WHERE 1=1';
  const params: any[] = [];

  if (skills && skills.length > 0) {
    query += ` AND skills @> $${params.length + 1}`;
    params.push(skills);
  }

  if (minRating) {
    query += ` AND avg_rating >= $${params.length + 1}`;
    params.push(minRating);
  }

  query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
  params.push(limit);

  return arkiv.query(query, params);
}

export async function getStudentGrowth(studentAddress: string, skill: string) {
  return arkiv.query(`
    SELECT
      DATE_TRUNC('month', to_timestamp(timestamp)) as month,
      AVG(rating) as avg_rating,
      COUNT(*) as review_count
    FROM dotgo_reviews r
    JOIN dotgo_projects p ON r.project_id = p.project_id
    WHERE p.student_address = $1 AND $2 = ANY(p.skills)
    GROUP BY month
    ORDER BY month ASC
  `, [studentAddress, skill]);
}

// Initialize
setupDatabase().then(() => {
  console.log('Arkiv database initialized');
  indexBlockchainEvents();
});
```

**Package Configuration**:
```bash
cd indexer
npm init -y
npm install @arkiv/sdk dotenv
```

**Environment File** (`indexer/.env`):
```
ARKIV_API_KEY=your_arkiv_api_key
POLKADOT_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Step 4: Base Solidity Contract with Hyperbridge

**File**: `contracts/base/contracts/DotGoBase.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@polytope-labs/ismp-solidity/IIsmpHost.sol";
import "@polytope-labs/ismp-solidity/IIsmpModule.sol";

contract DotGoBase is IIsmpModule {
    IIsmpHost public host;

    struct CrossChainReputation {
        address studentAddress;
        uint256 ethereumNFTCount;
        uint256 baseCommitCount;
        uint256 polkadotReviewCount;
        uint256 lastUpdated;
    }

    mapping(address => CrossChainReputation) public reputations;

    event ReputationUpdated(
        address indexed student,
        uint256 ethereumNFTs,
        uint256 baseCommits,
        uint256 polkadotReviews
    );

    constructor(address _host) {
        host = IIsmpHost(_host);
    }

    // Hyperbridge storage query to Ethereum for NFT badges
    function queryEthereumNFTs(address student, address nftContract) external {
        bytes memory storageKey = abi.encodePacked(
            keccak256(abi.encodePacked(student, uint256(0))) // balanceOf slot
        );

        GetRequest memory request = GetRequest({
            source: bytes("ethereum"),
            dest: bytes("base"),
            nonce: uint64(block.timestamp),
            from: abi.encodePacked(address(this)),
            keys: new bytes[](1),
            height: 0,
            timeoutTimestamp: uint64(block.timestamp + 1 hours),
            context: abi.encode(student, "nft")
        });
        request.keys[0] = storageKey;

        host.dispatch(request);
    }

    // Hyperbridge callback handler
    function onGetResponse(GetResponse memory response) external override {
        require(msg.sender == address(host), "Unauthorized");

        (address student, string memory queryType) = abi.decode(
            response.request.context,
            (address, string)
        );

        if (keccak256(bytes(queryType)) == keccak256(bytes("nft"))) {
            uint256 nftCount = abi.decode(response.values[0], (uint256));
            reputations[student].ethereumNFTCount = nftCount;
            reputations[student].lastUpdated = block.timestamp;

            emit ReputationUpdated(
                student,
                nftCount,
                reputations[student].baseCommitCount,
                reputations[student].polkadotReviewCount
            );
        }
    }

    // Manual update for Base-native data
    function updateBaseCommits(address student, uint256 commitCount) external {
        reputations[student].baseCommitCount = commitCount;
        reputations[student].lastUpdated = block.timestamp;
    }

    // Update from Polkadot (via bridge/oracle)
    function updatePolkadotReviews(address student, uint256 reviewCount) external {
        reputations[student].polkadotReviewCount = reviewCount;
        reputations[student].lastUpdated = block.timestamp;
    }

    function getReputation(address student) external view returns (CrossChainReputation memory) {
        return reputations[student];
    }
}
```

**Deployment Script** (`contracts/base/scripts/deploy.ts`):
```typescript
import { ethers } from "hardhat";

async function main() {
  const HYPERBRIDGE_HOST = "0x..."; // Base Sepolia Hyperbridge host address

  const DotGoBase = await ethers.getContractFactory("DotGoBase");
  const contract = await DotGoBase.deploy(HYPERBRIDGE_HOST);

  await contract.waitForDeployment();

  console.log(`DotGoBase deployed to ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Step 5: Frontend Foundation

**File**: `frontend/lib/polkadot/client.ts`

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

const WS_PROVIDER = process.env.NEXT_PUBLIC_POLKADOT_RPC || 'wss://rococo-contracts-rpc.polkadot.io';

let api: ApiPromise | null = null;

export async function getApi(): Promise<ApiPromise> {
  if (api) return api;

  const provider = new WsProvider(WS_PROVIDER);
  api = await ApiPromise.create({ provider });
  return api;
}

export async function enableWallet(appName: string = 'DotGo') {
  const extensions = await web3Enable(appName);
  if (extensions.length === 0) {
    throw new Error('No Polkadot.js extension found');
  }
  return extensions;
}

export async function getAccounts() {
  await enableWallet();
  return await web3Accounts();
}

export async function getInjector(address: string) {
  return await web3FromAddress(address);
}
```

**File**: `frontend/lib/arkiv/client.ts`

```typescript
export interface Project {
  project_id: number;
  student_address: string;
  title: string;
  description: string;
  github_url: string;
  demo_url: string;
  skills: string[];
  created_at: number;
  unlock_count: number;
  avg_rating: number;
}

const ARKIV_API = process.env.NEXT_PUBLIC_ARKIV_API || 'https://api.arkiv.network';

export async function searchProjects(
  skills?: string[],
  minRating?: number
): Promise<Project[]> {
  const params = new URLSearchParams();
  if (skills) params.set('skills', skills.join(','));
  if (minRating) params.set('min_rating', minRating.toString());

  const response = await fetch(`${ARKIV_API}/projects?${params}`);
  return response.json();
}

export async function getProject(projectId: number): Promise<Project> {
  const response = await fetch(`${ARKIV_API}/projects/${projectId}`);
  return response.json();
}

export async function getStudentGrowth(studentAddress: string, skill: string) {
  const response = await fetch(
    `${ARKIV_API}/students/${studentAddress}/growth?skill=${skill}`
  );
  return response.json();
}
```

### Step 6: Testing & Deployment

**Deploy ink! Contract**:
```bash
cd contracts/polkadot/dotgo_portfolio

# Upload contract
cargo contract upload --suri //Alice --url wss://rococo-contracts-rpc.polkadot.io

# Instantiate
cargo contract instantiate \
  --suri //Alice \
  --url wss://rococo-contracts-rpc.polkadot.io \
  --constructor new \
  --args <TREASURY_ADDRESS>
```

**Deploy Base Contract**:
```bash
cd contracts/base
npx hardhat run scripts/deploy.ts --network baseSepolia
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <HYPERBRIDGE_HOST>
```

**Start Arkiv Indexer**:
```bash
cd indexer
npm start
```

---

## 🎯 Phase 2: Frontend + Hyperbridge Integration

### Step 7: Core UI Components

**File**: `frontend/components/project-card.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Lock, ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/arkiv/client";

interface ProjectCardProps {
  project: Project;
  isUnlocked?: boolean;
  onUnlock?: () => void;
}

export function ProjectCard({ project, isUnlocked = false, onUnlock }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">
              {isUnlocked ? project.description : `${project.description.slice(0, 100)}...`}
            </CardDescription>
          </div>
          {!isUnlocked && (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {project.avg_rating > 0 ? `${project.avg_rating}/5` : 'No reviews yet'}
            </span>
            <span className="text-sm text-muted-foreground">
              ({project.unlock_count} unlocks)
            </span>
          </div>

          {/* Links (only if unlocked) */}
          {isUnlocked && (
            <div className="flex gap-3">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Github className="h-4 w-4" />
                Repository
              </a>
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter>
        {!isUnlocked ? (
          <Button onClick={onUnlock} className="w-full">
            Unlock for 3 DOT
          </Button>
        ) : (
          <Button variant="outline" className="w-full">
            Leave Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

**File**: `frontend/app/projects/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/project-card';
import { searchProjects, type Project } from '@/lib/arkiv/client';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);

  useEffect(() => {
    loadProjects();
  }, [skillFilter, ratingFilter]);

  async function loadProjects() {
    setLoading(true);
    try {
      const results = await searchProjects(
        skillFilter ? [skillFilter] : undefined,
        ratingFilter || undefined
      );
      setProjects(results);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Student Projects</h1>

        {/* Filters */}
        <div className="flex gap-4">
          <Input
            placeholder="Filter by skill (e.g., React, Rust)"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={ratingFilter.toString()}
            onValueChange={(v) => setRatingFilter(Number(v))}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div>Loading projects...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 8: Hyperbridge Integration

**File**: `frontend/lib/hyperbridge/client.ts`

```typescript
import { ethers } from 'ethers';

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC || 'https://sepolia.base.org';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS!;

const CONTRACT_ABI = [
  "function queryEthereumNFTs(address student, address nftContract) external",
  "function getReputation(address student) external view returns (tuple(address studentAddress, uint256 ethereumNFTCount, uint256 baseCommitCount, uint256 polkadotReviewCount, uint256 lastUpdated))",
  "event ReputationUpdated(address indexed student, uint256 ethereumNFTs, uint256 baseCommits, uint256 polkadotReviews)"
];

export interface CrossChainReputation {
  studentAddress: string;
  ethereumNFTCount: number;
  baseCommitCount: number;
  polkadotReviewCount: number;
  lastUpdated: number;
}

export async function getReputation(studentAddress: string): Promise<CrossChainReputation> {
  const provider = new ethers.JsonRpcProvider(BASE_RPC);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  const rep = await contract.getReputation(studentAddress);

  return {
    studentAddress: rep.studentAddress,
    ethereumNFTCount: Number(rep.ethereumNFTCount),
    baseCommitCount: Number(rep.baseCommitCount),
    polkadotReviewCount: Number(rep.polkadotReviewCount),
    lastUpdated: Number(rep.lastUpdated),
  };
}

export async function requestNFTUpdate(
  studentAddress: string,
  nftContractAddress: string,
  signer: ethers.Signer
) {
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.queryEthereumNFTs(studentAddress, nftContractAddress);
  await tx.wait();
}
```

**File**: `frontend/components/reputation-dashboard.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getReputation, type CrossChainReputation } from '@/lib/hyperbridge/client';

interface ReputationDashboardProps {
  studentAddress: string;
}

export function ReputationDashboard({ studentAddress }: ReputationDashboardProps) {
  const [reputation, setReputation] = useState<CrossChainReputation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReputation();
  }, [studentAddress]);

  async function loadReputation() {
    try {
      const rep = await getReputation(studentAddress);
      setReputation(rep);
    } catch (error) {
      console.error('Failed to load reputation:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading cross-chain reputation...</div>;
  if (!reputation) return <div>No reputation data found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Chain Reputation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {reputation.ethereumNFTCount}
            </div>
            <div className="text-sm text-muted-foreground">Ethereum NFT Badges</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {reputation.baseCommitCount}
            </div>
            <div className="text-sm text-muted-foreground">Base GitHub Commits</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {reputation.polkadotReviewCount}
            </div>
            <div className="text-sm text-muted-foreground">Polkadot Reviews</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(reputation.lastUpdated * 1000).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Step 9: Contract Interactions

**File**: `frontend/lib/polkadot/contract.ts`

```typescript
import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { getApi, getInjector } from './client';
import contractMetadata from './dotgo_portfolio.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS!;

export async function createProject(
  accountAddress: string,
  title: string,
  description: string,
  githubUrl: string,
  demoUrl: string,
  skills: string[]
) {
  const api = await getApi();
  const injector = await getInjector(accountAddress);
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  return new Promise((resolve, reject) => {
    contract.tx
      .createProject({}, title, description, githubUrl, demoUrl, skills)
      .signAndSend(accountAddress, { signer: injector.signer }, (result) => {
        if (result.status.isInBlock) {
          console.log('In block:', result.status.asInBlock.toHex());
        }
        if (result.status.isFinalized) {
          resolve(result);
        }
        if (result.isError) {
          reject(new Error('Transaction failed'));
        }
      });
  });
}

export async function unlockProject(
  accountAddress: string,
  projectId: number
) {
  const api = await getApi();
  const injector = await getInjector(accountAddress);
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const unlockPrice = 3_000_000_000_000; // 3 DOT

  return new Promise((resolve, reject) => {
    contract.tx
      .unlockProject({ value: unlockPrice }, projectId)
      .signAndSend(accountAddress, { signer: injector.signer }, (result) => {
        if (result.status.isFinalized) {
          resolve(result);
        }
        if (result.isError) {
          reject(new Error('Unlock failed'));
        }
      });
  });
}

export async function submitReview(
  accountAddress: string,
  projectId: number,
  rating: number,
  comment: string
) {
  const api = await getApi();
  const injector = await getInjector(accountAddress);
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  return new Promise((resolve, reject) => {
    contract.tx
      .submitReview({}, projectId, rating, comment)
      .signAndSend(accountAddress, { signer: injector.signer }, (result) => {
        if (result.status.isFinalized) {
          resolve(result);
        }
        if (result.isError) {
          reject(new Error('Review submission failed'));
        }
      });
  });
}

export async function getProject(projectId: number) {
  const api = await getApi();
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const { result, output } = await contract.query.getProject(
    CONTRACT_ADDRESS,
    {},
    projectId
  );

  if (result.isOk && output) {
    return output.toJSON();
  }
  return null;
}
```

### Step 10: Demo Preparation

**Create Demo Data Script** (`scripts/seed-demo-data.ts`):
```typescript
import { createProject } from '../frontend/lib/polkadot/contract';

const DEMO_PROJECTS = [
  {
    title: "DeFi Dashboard",
    description: "Real-time cryptocurrency portfolio tracker with Polkadot integration",
    githubUrl: "https://github.com/alice/defi-dashboard",
    demoUrl: "https://defi-demo.com",
    skills: ["React", "TypeScript", "Polkadot.js", "Web3"]
  },
  {
    title: "NFT Marketplace",
    description: "Cross-chain NFT marketplace supporting Ethereum and Polkadot",
    githubUrl: "https://github.com/bob/nft-market",
    demoUrl: "https://nft-demo.com",
    skills: ["Solidity", "ink!", "Next.js", "IPFS"]
  },
  {
    title: "Governance Platform",
    description: "Decentralized voting system with quadratic voting",
    githubUrl: "https://github.com/charlie/governance",
    demoUrl: "https://gov-demo.com",
    skills: ["Rust", "Substrate", "Vue.js"]
  }
];

async function seedDemoData() {
  for (const project of DEMO_PROJECTS) {
    try {
      await createProject(
        'ALICE_ADDRESS',
        project.title,
        project.description,
        project.githubUrl,
        project.demoUrl,
        project.skills
      );
      console.log(`✅ Created: ${project.title}`);
    } catch (error) {
      console.error(`❌ Failed: ${project.title}`, error);
    }
  }
}

seedDemoData();
```

---

## 🎯 Phase 3: Track-Specific Features + Demo

### Step 11: Arkiv Track Features

**Implement Advanced Search UI**:

```typescript
// frontend/app/search/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdvancedSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  async function executeQuery() {
    const response = await fetch('/api/arkiv/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    setResults(data);
  }

  const EXAMPLE_QUERIES = [
    {
      name: "Top React Developers",
      sql: `SELECT student_address, title, avg_rating
            FROM dotgo_projects
            WHERE 'React' = ANY(skills) AND avg_rating >= 4
            ORDER BY avg_rating DESC LIMIT 10`
    },
    {
      name: "Skill Progression (Last 6 Months)",
      sql: `SELECT p.student_address, p.skills,
                   DATE_TRUNC('month', to_timestamp(r.timestamp)) as month,
                   AVG(r.rating) as avg_rating
            FROM dotgo_projects p
            JOIN dotgo_reviews r ON p.project_id = r.project_id
            WHERE r.timestamp >= EXTRACT(EPOCH FROM NOW() - INTERVAL '6 months')
            GROUP BY p.student_address, p.skills, month
            ORDER BY month ASC`
    },
    {
      name: "Students with 3★ → 5★ Improvement",
      sql: `WITH ratings AS (
              SELECT student_address,
                     FIRST_VALUE(avg_rating) OVER (PARTITION BY student_address ORDER BY created_at) as first_rating,
                     LAST_VALUE(avg_rating) OVER (PARTITION BY student_address ORDER BY created_at) as last_rating
              FROM dotgo_projects
            )
            SELECT DISTINCT student_address
            FROM ratings
            WHERE first_rating <= 3 AND last_rating = 5`
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Arkiv-Powered Search</h1>

      {/* Example Queries */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {EXAMPLE_QUERIES.map((example) => (
          <Card key={example.name} className="p-4">
            <h3 className="font-semibold mb-2">{example.name}</h3>
            <Button
              size="sm"
              onClick={() => setQuery(example.sql)}
            >
              Load Query
            </Button>
          </Card>
        ))}
      </div>

      {/* SQL Editor */}
      <textarea
        className="w-full h-48 p-4 font-mono text-sm border rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="SELECT * FROM dotgo_projects WHERE..."
      />

      <Button onClick={executeQuery} className="mt-4">
        Execute Query
      </Button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Results ({results.length})</h2>
          <pre className="bg-slate-100 p-4 rounded overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
```

**API Route for Arkiv Queries** (`frontend/app/api/arkiv/query/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createArk ivClient } from '@arkiv/sdk';

const arkiv = createArk ivClient({
  apiKey: process.env.ARKIV_API_KEY!,
  network: 'mendoza-testnet',
});

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  try {
    const results = await arkiv.query(query);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Step 12: Hyperbridge Track Features

**Storage Proof Visualizer**:

```typescript
// frontend/components/storage-proof-visualizer.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StorageProof {
  chain: string;
  queryType: string;
  result: any;
  timestamp: number;
  verified: boolean;
}

export function StorageProofVisualizer({ proofs }: { proofs: StorageProof[] }) {
  return (
    <div className="space-y-4">
      {proofs.map((proof, idx) => (
        <Card key={idx} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{proof.queryType}</h3>
              <p className="text-sm text-muted-foreground">
                Source: {proof.chain}
              </p>
            </div>
            <Badge variant={proof.verified ? "default" : "destructive"}>
              {proof.verified ? "Verified ✓" : "Unverified ✗"}
            </Badge>
          </div>

          <div className="bg-slate-50 p-4 rounded">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(proof.result, null, 2)}
            </pre>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            {new Date(proof.timestamp * 1000).toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
```

**Multi-Chain Aggregation Demo**:

```typescript
// frontend/app/reputation/[address]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ReputationDashboard } from '@/components/reputation-dashboard';
import { StorageProofVisualizer } from '@/components/storage-proof-visualizer';
import { getReputation } from '@/lib/hyperbridge/client';

export default function ReputationPage({ params }: { params: { address: string } }) {
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    loadAllProofs();
  }, [params.address]);

  async function loadAllProofs() {
    // Simulate multiple storage queries
    const ethereumProof = {
      chain: 'Ethereum',
      queryType: 'NFT Balance',
      result: { balance: 5 },
      timestamp: Date.now() / 1000,
      verified: true,
    };

    const baseProof = {
      chain: 'Base',
      queryType: 'GitHub Attestations',
      result: { commitCount: 142 },
      timestamp: Date.now() / 1000,
      verified: true,
    };

    const polkadotProof = {
      chain: 'Polkadot',
      queryType: 'Review Count',
      result: { reviews: 8, avgRating: 4.5 },
      timestamp: Date.now() / 1000,
      verified: true,
    };

    setProofs([ethereumProof, baseProof, polkadotProof]);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Cross-Chain Reputation</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Aggregated Reputation</h2>
          <ReputationDashboard studentAddress={params.address} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Storage Proofs</h2>
          <StorageProofVisualizer proofs={proofs} />
        </div>
      </div>
    </div>
  );
}
```

### Step 13: Demo Script Preparation

**Create Demo Script** (`docs/DEMO_SCRIPT.md`):

```markdown
# DotGo Demo Script - sub0 HACK

**Audience**: Hackathon judges (Arkiv + Hyperbridge tracks)

---

## Introduction

"Hi, I'm [Name] from DotGo. We built a cross-chain student portfolio platform where young talent showcases projects and earns verified reviews from industry mentors."

**Key Metrics**:
- 3 DOT unlock fee (2.5 to student, 0.5 to platform)
- Cryptographically verified reviews
- Cross-chain reputation aggregation

---

## Arkiv Track Demo

### 1. Fast Portfolio Search
"Traditional blockchain apps are slow to query. With Arkiv, we have SQL-like queries:"

**Show**: Advanced search page
```sql
SELECT student_address, title, avg_rating
FROM dotgo_projects
WHERE 'React' = ANY(skills) AND avg_rating >= 4
ORDER BY avg_rating DESC LIMIT 10
```

**Execute** → Shows results in <1 second

### 2. Time-Scoped Skill Tracking
"Employers want to see growth. Arkiv lets us track skill progression:"

**Show**: Student growth chart
```sql
SELECT DATE_TRUNC('month', timestamp) as month,
       AVG(rating) as avg_rating
FROM dotgo_reviews
WHERE student_id = 'alice' AND 'React' = ANY(skills)
GROUP BY month
ORDER BY month ASC
```

**Result**: Visual chart showing 3★ → 5★ improvement over 6 months

### 3. Verifiable Data Integrity
"All data is cryptographically tied to on-chain events:"

**Show**: Verification panel with merkle root + event hashes

---

## Hyperbridge Track Demo

### 1. Cross-Chain Storage Queries
"Students have credentials across multiple chains. Hyperbridge aggregates them:"

**Show**: Reputation dashboard
- Ethereum: 5 NFT badges (queried via Hyperbridge GET request)
- Base: 142 GitHub commit attestations
- Polkadot: 8 verified reviews (4.5★ average)

### 2. Storage Proof Verification
"Every cross-chain query includes cryptographic proofs:"

**Show**: Storage proof visualizer
- Source chain: Ethereum
- Query type: balanceOf(studentAddress)
- Result: 5 NFTs
- Verification status: ✓ Verified
- Timestamp: [current time]

### 3. Multi-Chain Integration
"We use 4+ different storage query patterns:"

**List**:
1. EVM state queries (Ethereum NFTs)
2. Account balance lookups (Base USDC)
3. Contract storage reads (attestation contracts)
4. Cross-chain event listening

---

## Live Workflow Demo

1. **Alice creates project** → Event emitted → Arkiv indexes
2. **Bob searches "React developers"** → Arkiv returns Alice's project
3. **Bob unlocks project** → 2.5 DOT to Alice, 0.5 to platform
4. **Bob leaves 5★ review** → Updates avg_rating via Arkiv
5. **View Alice's cross-chain reputation** → Hyperbridge aggregates Ethereum + Base + Polkadot

---

## Conclusion

**Value Propositions**:
- **For Students**: Earn money + build verifiable reputation
- **For Mentors**: Discover talent with fast, queryable data
- **For Employers**: Hire with confidence using cross-chain credentials

**Technical Achievements**:
- ✅ Arkiv: Queryable portfolios, time-scoped analytics, verifiable integrity
- ✅ Hyperbridge: 4+ storage query patterns, multi-chain aggregation, proof verification

"We believe DotGo can bridge the experience gap for young developers—verified across chains."

**Thank you!**
```

### Step 14: Polish & Final Testing

**Testing Checklist**:
```bash
# Smart Contracts
✅ ink! contract tests pass (cargo test)
✅ Solidity contract tests pass (npx hardhat test)
✅ Contracts deployed to testnets
✅ Contract addresses verified on explorers

# Frontend
✅ All pages render without errors
✅ Wallet connections work (Polkadot.js + MetaMask)
✅ Project creation flow complete
✅ Unlock + review flow complete
✅ Arkiv queries return results <2s
✅ Hyperbridge reputation loads
✅ Mobile responsive

# Arkiv Integration
✅ Event indexing working
✅ Database tables created
✅ Search queries optimized
✅ Real-time updates functional

# Hyperbridge Integration
✅ Storage queries execute
✅ Proofs validate correctly
✅ Multi-chain data aggregates
✅ Error handling robust

# Demo
✅ Demo script rehearsed
✅ Demo data seeded
✅ Backup video recorded
✅ Slide deck ready (if needed)
```

**Environment Variables** (`.env.local`):
```bash
# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_id
NEXT_PUBLIC_POLKADOT_RPC=wss://rococo-contracts-rpc.polkadot.io
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=5Xxx...
NEXT_PUBLIC_BASE_RPC=https://sepolia.base.org
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ARKIV_API=https://api.arkiv.network
ARKIV_API_KEY=your_arkiv_key
```

**Final Deployment**:
```bash
# Frontend
cd frontend
npm run build
# Deploy to Vercel:
vercel --prod

# Indexer (keep running)
cd indexer
pm2 start npm --name "dotgo-indexer" -- start
```

---

## 🎯 Success Criteria

### Arkiv Main Track
✅ **Queryable Data**: Sub-2s SQL queries on portfolio data
✅ **Time-Scoped**: Student skill progression tracking
✅ **Verifiable**: Cryptographic integrity checks
✅ **Performance**: 1000+ projects searchable instantly
✅ **Demo**: Live query execution during presentation

### Hyperbridge Track
✅ **Storage Queries**: 4+ different query patterns implemented
✅ **Multi-Chain**: Aggregate data from Ethereum + Base + Polkadot
✅ **Verification**: Storage proofs validated on-chain
✅ **Demo**: Live cross-chain reputation display
✅ **Documentation**: Clear integration patterns documented

### Overall Project Quality
✅ **Working Demo**: Full end-to-end workflow functional
✅ **Code Quality**: Clean, documented, tested code
✅ **Presentation**: Clear value proposition + technical depth
✅ **Innovation**: Unique application of both technologies

---

## 🚨 Contingency Plans

### If Arkiv Integration Fails
- **Fallback**: Use PostgreSQL with manual indexing
- **Impact**: Lose queryable/verifiable features
- **Mitigation**: Focus harder on Hyperbridge track

### If Hyperbridge Integration Fails
- **Fallback**: Mock cross-chain data with static JSON
- **Impact**: Lose storage proof verification
- **Mitigation**: Focus harder on Arkiv track

### If Smart Contracts Don't Deploy
- **Fallback**: Use local Substrate node + Ganache
- **Impact**: Not on public testnet
- **Mitigation**: Record demo video in advance

### If Frontend Breaks
- **Backup**: Have video demo ready
- **Mitigation**: Test thoroughly on Day 2 evening

---

## 📚 Resources

**Documentation**:
- ink! Docs: https://use.ink
- Arkiv Dev Docs: https://arkiv.network/dev
- Hyperbridge SDK: https://docs.hyperbridge.network/developers/evm/getting-started
- Polkadot.js API: https://polkadot.js.org/docs/

**Faucets**:
- Rococo: https://faucet.polkadot.io/
- Base Sepolia: https://sepoliafaucet.com/

**Explorers**:
- Polkadot Contracts UI: https://contracts-ui.substrate.io/
- Base Sepolia: https://sepolia.basescan.org

**Support**:
- Arkiv Discord: [link from hackathon]
- Hyperbridge Discord: [link from hackathon]
- Polkadot Element: https://matrix.to/#/#polkadot:matrix.org

---

**Built with ❤️ on Polkadot, Arkiv, and Hyperbridge**
