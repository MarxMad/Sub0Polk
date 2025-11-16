# Arkiv Integration Guide for DotGo

Complete guide for integrating Arkiv L2 event indexing into the DotGo platform.

## Overview

Arkiv provides real-time, decentralized data indexing for blockchain events. For DotGo, we'll index:
- **Project Creation Events** - When students publish portfolios
- **Project Unlock Events** - When reviewers pay to access projects
- **Review Submission Events** - When reviews are posted

## Architecture

```
Smart Contracts (Polkadot + Base)
         ↓ emit events
    Event Listener
         ↓ process
   Arkiv L2 Storage
         ↓ query
    Frontend Dashboard
```

## Setup

### 1. Install Dependencies

```bash
npm install @arkiv-network/sdk
```

### 2. Environment Configuration

Add to `.env.local`:
```env
# Arkiv L2 Network
ARKIV_PRIVATE_KEY=0x...  # Generate: node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
NEXT_PUBLIC_ARKIV_RPC=https://l2.hoodi.arkiv.network/rpc
NEXT_PUBLIC_ARKIV_NETWORK_ID=393530
```

### 3. Create Indexer Service

Create `backend/arkiv-indexer.js`:

```javascript
import { Arkiv, ExpirationTime, jsonToPayload, eq } from '@arkiv-network/sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';

// Define Arkiv L2 chain
const arkivL2 = defineChain({
  id: 393530,
  name: 'Arkiv L2',
  network: 'arkiv-l2',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://l2.hoodi.arkiv.network/rpc'] },
    public: { http: ['https://l2.hoodi.arkiv.network/rpc'] },
  },
});

// Initialize Arkiv client
const account = privateKeyToAccount(process.env.ARKIV_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: arkivL2,
  transport: http(),
});

const arkivClient = new Arkiv(walletClient);

/**
 * Index Project Creation Event
 */
export async function indexProjectCreated(event) {
  const payload = {
    eventType: 'ProjectCreated',
    projectId: event.projectId.toString(),
    student: event.student,
    title: event.title,
    description: event.description,
    githubUrl: event.githubUrl,
    demoUrl: event.demoUrl,
    skills: event.skills,
    timestamp: event.timestamp || Date.now(),
    chain: event.chain, // 'polkadot' or 'base'
    txHash: event.txHash,
  };

  await arkivClient.mutateEntities({
    creates: [{
      payload: jsonToPayload(payload),
      contentType: 'application/json',
      attributes: [
        { key: 'eventType', value: 'ProjectCreated' },
        { key: 'projectId', value: event.projectId.toString() },
        { key: 'student', value: event.student },
        { key: 'chain', value: event.chain },
      ],
      expiresIn: ExpirationTime.fromDays(365), // 1 year retention
    }],
  });

  console.log(`✅ Indexed ProjectCreated: ${event.projectId}`);
}

/**
 * Index Project Unlock Event
 */
export async function indexProjectUnlocked(event) {
  const payload = {
    eventType: 'ProjectUnlocked',
    projectId: event.projectId.toString(),
    reviewer: event.reviewer,
    amount: event.amount.toString(),
    timestamp: event.timestamp || Date.now(),
    chain: event.chain,
    txHash: event.txHash,
  };

  await arkivClient.mutateEntities({
    creates: [{
      payload: jsonToPayload(payload),
      contentType: 'application/json',
      attributes: [
        { key: 'eventType', value: 'ProjectUnlocked' },
        { key: 'projectId', value: event.projectId.toString() },
        { key: 'reviewer', value: event.reviewer },
        { key: 'chain', value: event.chain },
      ],
      expiresIn: ExpirationTime.fromDays(365),
    }],
  });

  console.log(`✅ Indexed ProjectUnlocked: ${event.projectId} by ${event.reviewer}`);
}

/**
 * Index Review Submission Event
 */
export async function indexReviewSubmitted(event) {
  const payload = {
    eventType: 'ReviewSubmitted',
    projectId: event.projectId.toString(),
    reviewer: event.reviewer,
    rating: event.rating,
    comment: event.comment,
    timestamp: event.timestamp || Date.now(),
    chain: event.chain,
    txHash: event.txHash,
  };

  await arkivClient.mutateEntities({
    creates: [{
      payload: jsonToPayload(payload),
      contentType: 'application/json',
      attributes: [
        { key: 'eventType', value: 'ReviewSubmitted' },
        { key: 'projectId', value: event.projectId.toString() },
        { key: 'reviewer', value: event.reviewer },
        { key: 'rating', value: event.rating.toString() },
        { key: 'chain', value: event.chain },
      ],
      expiresIn: ExpirationTime.fromDays(365),
    }],
  });

  console.log(`✅ Indexed ReviewSubmitted: ${event.projectId} - Rating: ${event.rating}/5`);
}
```

## Event Listener Implementation

### Polkadot Event Listener

Create `backend/polkadot-listener.js`:

```javascript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { indexProjectCreated, indexProjectUnlocked, indexReviewSubmitted } from './arkiv-indexer.js';
import contractMetadata from '../contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.json' assert { type: 'json' };

const CONTRACT_ADDRESS = process.env.POLKADOT_CONTRACT_ADDRESS;
const RPC_URL = 'wss://testnet-passet-hub.polkadot.io';

async function listenPolkadotEvents() {
  const provider = new WsProvider(RPC_URL);
  const api = await ApiPromise.create({ provider });
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  console.log('🎧 Listening for Polkadot events...');

  // Subscribe to contract events
  api.query.system.events((events) => {
    events.forEach(async (record) => {
      const { event } = record;

      // Filter contract events
      if (event.section === 'contracts' && event.method === 'ContractEmitted') {
        const [accountId, data] = event.data;

        if (accountId.toString() === CONTRACT_ADDRESS) {
          // Decode event
          const decodedEvent = contract.abi.decodeEvent(data);

          // Index based on event type
          if (decodedEvent.event.identifier === 'ProjectCreated') {
            await indexProjectCreated({
              ...decodedEvent.args,
              chain: 'polkadot',
              txHash: record.hash.toHex(),
            });
          } else if (decodedEvent.event.identifier === 'ProjectUnlocked') {
            await indexProjectUnlocked({
              ...decodedEvent.args,
              chain: 'polkadot',
              txHash: record.hash.toHex(),
            });
          } else if (decodedEvent.event.identifier === 'ReviewSubmitted') {
            await indexReviewSubmitted({
              ...decodedEvent.args,
              chain: 'polkadot',
              txHash: record.hash.toHex(),
            });
          }
        }
      }
    });
  });
}

listenPolkadotEvents().catch(console.error);
```

### Base Event Listener

Create `backend/base-listener.js`:

```javascript
import { createPublicClient, http, parseAbiItem } from 'viem';
import { baseSepolia } from 'viem/chains';
import { indexProjectCreated, indexProjectUnlocked, indexReviewSubmitted } from './arkiv-indexer.js';
import DotGoPortfolioABI from '../contracts/base/artifacts/contracts/DotGoPortfolio.sol/DotGoPortfolio.json' assert { type: 'json' };

const CONTRACT_ADDRESS = process.env.BASE_CONTRACT_ADDRESS;

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function listenBaseEvents() {
  console.log('🎧 Listening for Base events...');

  // Listen for ProjectCreated events
  client.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DotGoPortfolioABI.abi,
    eventName: 'ProjectCreated',
    onLogs: async (logs) => {
      for (const log of logs) {
        await indexProjectCreated({
          ...log.args,
          chain: 'base',
          txHash: log.transactionHash,
        });
      }
    },
  });

  // Listen for ProjectUnlocked events
  client.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DotGoPortfolioABI.abi,
    eventName: 'ProjectUnlocked',
    onLogs: async (logs) => {
      for (const log of logs) {
        await indexProjectUnlocked({
          ...log.args,
          chain: 'base',
          txHash: log.transactionHash,
        });
      }
    },
  });

  // Listen for ReviewSubmitted events
  client.watchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DotGoPortfolioABI.abi,
    eventName: 'ReviewSubmitted',
    onLogs: async (logs) => {
      for (const log of logs) {
        await indexReviewSubmitted({
          ...log.args,
          chain: 'base',
          txHash: log.transactionHash,
        });
      }
    },
  });
}

listenBaseEvents().catch(console.error);
```

## Frontend Querying

Create `frontend/lib/arkiv.ts`:

```typescript
import { Arkiv, eq } from '@arkiv-network/sdk';
import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem';

const arkivL2 = defineChain({
  id: 393530,
  name: 'Arkiv L2',
  network: 'arkiv-l2',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://l2.hoodi.arkiv.network/rpc'] },
    public: { http: ['https://l2.hoodi.arkiv.network/rpc'] },
  },
});

const publicClient = createPublicClient({
  chain: arkivL2,
  transport: http(),
});

const arkivClient = new Arkiv(publicClient);

/**
 * Get all projects by student address
 */
export async function getProjectsByStudent(studentAddress: string) {
  const query = arkivClient.buildQuery();
  const result = await query
    .where(eq('eventType', 'ProjectCreated'))
    .where(eq('student', studentAddress))
    .withPayload(true)
    .fetch();

  return result.entities.map(e => e.toJson());
}

/**
 * Get project unlock statistics
 */
export async function getProjectUnlocks(projectId: string) {
  const query = arkivClient.buildQuery();
  const result = await query
    .where(eq('eventType', 'ProjectUnlocked'))
    .where(eq('projectId', projectId))
    .withPayload(true)
    .fetch();

  return result.entities.map(e => e.toJson());
}

/**
 * Get reviews for a project
 */
export async function getProjectReviews(projectId: string) {
  const query = arkivClient.buildQuery();
  const result = await query
    .where(eq('eventType', 'ReviewSubmitted'))
    .where(eq('projectId', projectId))
    .withPayload(true)
    .fetch();

  return result.entities
    .map(e => e.toJson())
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Get cross-chain project analytics
 */
export async function getProjectAnalytics(projectId: string) {
  const [unlocks, reviews] = await Promise.all([
    getProjectUnlocks(projectId),
    getProjectReviews(projectId),
  ]);

  return {
    totalUnlocks: unlocks.length,
    totalReviews: reviews.length,
    averageRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0,
    unlocksByChain: {
      polkadot: unlocks.filter(u => u.chain === 'polkadot').length,
      base: unlocks.filter(u => u.chain === 'base').length,
    },
  };
}
```

## Running the Indexer

### Development

```bash
# Terminal 1: Start Polkadot listener
node backend/polkadot-listener.js

# Terminal 2: Start Base listener
node backend/base-listener.js

# Terminal 3: Run frontend
cd frontend && npm run dev
```

### Production

Use PM2 for process management:

```bash
npm install -g pm2

# Start listeners
pm2 start backend/polkadot-listener.js --name polkadot-indexer
pm2 start backend/base-listener.js --name base-indexer

# Save configuration
pm2 save
pm2 startup
```

## Testing

### 1. Create Test Project

```bash
# On Polkadot via Contracts UI
# Or on Base via Hardhat console
```

### 2. Verify Indexing

```javascript
import { getProjectsByStudent } from './frontend/lib/arkiv';

const projects = await getProjectsByStudent('YOUR_ADDRESS');
console.log('Indexed projects:', projects);
```

### 3. Check Arkiv Explorer

Visit Arkiv L2 explorer to verify stored data.

## Benefits for sub0 HACK

1. **Arkiv Prize Track** ($10k) - Event indexing implementation
2. **Cross-Chain Analytics** - Unified view of Polkadot + Base events
3. **Real-Time Dashboard** - Live project statistics
4. **Decentralized Storage** - No centralized database needed
5. **Query Performance** - Fast indexed data retrieval

## Next Steps

1. Deploy event listeners to cloud (Heroku/Railway)
2. Add dashboard charts for analytics
3. Implement notifications based on indexed events
4. Create public API for querying project data

---

**Time Estimate**: 1-2 hours for basic integration
**Prize Value**: $10,000 Arkiv track + enhanced demo
