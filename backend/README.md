# DotGo Backend Event Listener

Real-time event indexing service for DotGo platform using Arkiv.

## Overview

Listens to smart contract events from both Polkadot and Base chains and indexes them to Arkiv Mendoza for fast, queryable data access.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Generate private key for Arkiv
ARKIV_PRIVATE_KEY=0x...

# Add deployed contract addresses
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=5...
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x...
```

**Generate Arkiv Private Key**:
```bash
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Listeners

**Development** (both chains):
```bash
npm run dev
```

**Individual listeners**:
```bash
# Polkadot only
npm run polkadot

# Base only
npm run base
```

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start all listeners
pm2 start index.js --name dotgo-backend

# Or start individually
pm2 start polkadot-listener.js --name polkadot-indexer
pm2 start base-listener.js --name base-indexer

# Save configuration
pm2 save
pm2 startup
```

### Using Docker

```bash
docker build -t dotgo-backend .
docker run -d --env-file .env dotgo-backend
```

## Architecture

```
Smart Contracts (Polkadot + Base)
         ↓ emit events
    Event Listeners
         ↓ process
   Arkiv Indexer
         ↓ store
   Arkiv Mendoza L2
         ↓ query
    Frontend
```

## Events Indexed

### ProjectCreated
- Project ID, student address, title, description
- GitHub URL, demo URL, skills array
- Chain (polkadot/base), transaction hash

### ProjectUnlocked
- Project ID, reviewer, student
- Payment amount
- Chain, transaction hash

### ReviewSubmitted
- Project ID, reviewer
- Rating (1-5), comment
- Chain, transaction hash

## Monitoring

**Logs**:
```bash
# PM2 logs
pm2 logs dotgo-backend

# Real-time
tail -f ~/.pm2/logs/dotgo-backend-out.log
```

**Health Check**:
```bash
# Check if services are running
pm2 status

# Restart if needed
pm2 restart dotgo-backend
```

## Troubleshooting

### No events detected
- Verify contract addresses in `.env`
- Check RPC endpoints are accessible
- Ensure contracts are deployed and active

### Arkiv indexing fails
- Verify `ARKIV_PRIVATE_KEY` is set correctly
- Check Arkiv Mendoza network is accessible
- Ensure account has sufficient balance (if required)

### Connection errors
- Check network connectivity
- Verify RPC URLs are correct
- Try alternative RPC endpoints

## Data Retention

- **Projects**: 365 days
- **Unlocks**: 90 days
- **Reviews**: 365 days

## API Integration

Frontend queries indexed data via:
```typescript
import { queryEvents } from '@/lib/arkiv-indexer';

// Get all projects by student
const projects = await queryEvents({
  eventType: 'ProjectCreated',
  student: '0x...'
});
```

## Resources

- [Arkiv Documentation](https://arkiv.network/dev)
- [Arkiv SDK](https://www.npmjs.com/package/@arkiv-network/sdk)
- [Polkadot.js API](https://polkadot.js.org/docs/)
- [Viem Documentation](https://viem.sh/)
