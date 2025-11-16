# Arkiv Integration Setup Guide

Complete setup guide for the Arkiv event indexing system in DotGo.

## Overview

DotGo uses Arkiv Mendoza testnet to provide:
- ✅ **Real-time event indexing** from Polkadot + Base contracts
- ✅ **SQL-like queries** for portfolio discovery
- ✅ **Time-scoped data** with automatic expiration
- ✅ **Verifiable integrity** tied to blockchain transactions

**Prize Track**: Arkiv Main ($10,000)

---

## Architecture

```
Smart Contracts (Polkadot + Base)
         ↓ emit events
    Backend Listeners (Node.js)
         ↓ process & index
    Arkiv Mendoza L2
         ↓ query
    Frontend Dashboard
```

---

## Quick Start

### 1. Generate Arkiv Private Key

```bash
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

**Save this key** - you'll need it for backend configuration.

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
# Arkiv Configuration
ARKIV_PRIVATE_KEY=0x...  # Your generated key

# Contract Addresses (after deployment)
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=5...
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x...
```

### 3. Start Event Listeners

**Development** (both chains):
```bash
npm run dev
```

**Production** (with PM2):
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Test Integration

Open frontend: http://localhost:3000/arkiv-demo

- Click "Test Connection" to verify Arkiv connectivity
- Use "Index Events" buttons to create sample data
- Query indexed data with various filters
- Watch live stats update every 15 seconds

---

## What Gets Indexed

### ProjectCreated Events
- **Retention**: 365 days
- **Attributes**: projectId, student, title, skills[], chain, timestamp
- **Use Cases**: Portfolio discovery, skill-based search

### ProjectUnlocked Events
- **Retention**: 90 days
- **Attributes**: projectId, reviewer, student, amount, chain, timestamp
- **Use Cases**: Earnings tracking, popularity metrics

### ReviewSubmitted Events
- **Retention**: 365 days
- **Attributes**: projectId, reviewer, rating, chain, timestamp
- **Use Cases**: Reputation scores, review analytics

---

## Query Examples

### Find React Developers with 4+ Rating
```typescript
await queryEvents({
  eventType: 'ProjectCreated',
  skill: 'React',
  minRating: 4,
});
```

### Time-Scoped: Projects from Last 30 Days
```typescript
await queryEvents({
  eventType: 'ProjectCreated',
  startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
  endTime: Date.now(),
});
```

### Student Analytics
```typescript
const analytics = await getStudentAnalytics('0x...');
// Returns: totalProjects, averageRating, totalEarnings, skillDistribution
```

---

## Production Deployment

### Option 1: PM2 (Recommended)

```bash
cd backend
pm2 start ecosystem.config.js

# Monitor
pm2 logs
pm2 status

# Restart
pm2 restart all
```

### Option 2: Docker

Create `backend/Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t dotgo-backend backend/
docker run -d --env-file backend/.env dotgo-backend
```

### Option 3: Cloud Platforms

**Railway**:
```bash
cd backend
railway init
railway up
```

**Render**:
- Connect GitHub repo
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables

---

## Monitoring

### Check Logs

**PM2**:
```bash
pm2 logs dotgo-polkadot-indexer
pm2 logs dotgo-base-indexer
```

**View specific lines**:
```bash
tail -f backend/logs/polkadot-out.log
tail -f backend/logs/base-error.log
```

### Health Checks

**Arkiv Connection**:
Visit: http://localhost:3000/arkiv-demo
Click "Test Connection"

**Event Processing**:
Check logs for:
- `✅ ProjectCreated indexed: ...`
- `✅ ProjectUnlocked indexed: ...`
- `✅ ReviewSubmitted indexed: ...`

---

## Troubleshooting

### Backend Won't Start

**Error: `ARKIV_PRIVATE_KEY not set`**
```bash
# Verify .env file exists
ls -la backend/.env

# Check key is set
cat backend/.env | grep ARKIV_PRIVATE_KEY
```

**Error: `Cannot find module`**
```bash
cd backend
npm install
```

### Events Not Indexing

**Check contract addresses**:
```bash
# Verify contracts are deployed
cat backend/.env | grep CONTRACT_ADDRESS
```

**Check RPC connectivity**:
```bash
# Test Polkadot RPC
curl -H "Content-Type: application/json" \
  -d '{"id":1, "jsonrpc":"2.0", "method": "chain_getBlockHash"}' \
  wss://testnet-passet-hub.polkadot.io
```

**Check Arkiv network**:
```bash
# Test Arkiv RPC
curl https://mendoza.hoodi.arkiv.network/rpc \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

### Frontend Queries Failing

**Error: `Arkiv client not available`**
- Backend must be running with valid ARKIV_PRIVATE_KEY
- Frontend uses same Arkiv account for read operations

**Empty query results**:
- Index some test events first using demo page
- Wait 15 seconds for auto-refresh
- Check backend logs for successful indexing

---

## Network Information

### Arkiv Mendoza Testnet

- **Chain ID**: 60138453056
- **HTTP RPC**: https://mendoza.hoodi.arkiv.network/rpc
- **WebSocket**: wss://mendoza.hoodi.arkiv.network/rpc/ws
- **Explorer**: https://explorer.mendoza.hoodi.arkiv.network/
- **Faucet**: Not required (no gas fees)

### Polkadot Paseo Asset Hub

- **RPC**: wss://testnet-passet-hub.polkadot.io
- **Faucet**: https://faucet.polkadot.io/
- **Explorer**: https://assethub-paseo.subscan.io/

### Base Sepolia

- **RPC**: https://sepolia.base.org
- **Chain ID**: 84532
- **Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **Explorer**: https://sepolia.basescan.org/

---

## Demo Points for Hackathon

### Live Demo Flow

1. **Show Real-Time Stats**
   - Open `/arkiv-demo`
   - Point out live counter updating every 15s

2. **Index Sample Events**
   - Click "Index Project"
   - Click "Index Review"
   - Show immediate indexing in logs

3. **Query Demonstrations**
   - "All Projects" - show SQL-like query
   - "React Projects" - skill-based filtering
   - "Last 7 Days" - time-scoped queries

4. **Analytics Dashboard**
   - Enter student address
   - Click "Get Analytics"
   - Show aggregated data across chains

5. **Cross-Chain Verification**
   - Index on Polkadot → Query shows "chain: polkadot"
   - Index on Base → Query shows "chain: base"
   - Unified analytics across both

### Key Talking Points

✅ **Real-time indexing** - Events indexed within seconds
✅ **SQL-like queries** - Filter by skills, rating, time, chain
✅ **Time-scoped expiration** - Automatic data lifecycle management
✅ **Verifiable integrity** - All data cryptographically tied to blockchain
✅ **Cross-chain support** - Unified queries across Polkadot + Base

---

## Resources

- [Arkiv Documentation](https://arkiv.network/dev)
- [Arkiv TypeScript Guide](https://arkiv.network/getting-started/typescript)
- [Arkiv SDK npm](https://www.npmjs.com/package/@arkiv-network/sdk)
- [DotGo Arkiv Demo](/arkiv-demo)

---

**Built for sub0 HACK Buenos Aires**
**Prize Track**: Arkiv Main ($10,000)
