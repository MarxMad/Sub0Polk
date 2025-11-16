# ✅ Arkiv Integration Complete - $10k Prize Track

**Status**: Implementation ready, needs testnet tokens for deployment
**Demo Page**: [http://localhost:3000/arkiv-demo](http://localhost:3000/arkiv-demo)

---

## 🎯 What's Been Implemented

### ✅ SDK Installation
- Correct package: `@arkiv-network/sdk@0.4.5` ✓
- Verified in package.json

### ✅ Arkiv Client ([lib/arkiv-client.ts](frontend/lib/arkiv-client.ts))
- Network: Arkiv Mendoza (Chain ID: 60138453056)
- RPC: `https://mendoza.hoodi.arkiv.network/rpc`
- Explorer: `https://explorer.mendoza.hoodi.arkiv.network/`
- Wallet client integration with viem
- Connection testing function

### ✅ Event Indexer ([lib/arkiv-event-indexer.ts](frontend/lib/arkiv-event-indexer.ts))
Features:
- **ProjectCreated** indexing (365-day expiration)
- **ProjectUnlocked** indexing (90-day expiration)
- **ReviewSubmitted** indexing (365-day expiration)
- Batch indexing support
- SQL-like queries with filters:
  - Event type filtering
  - Student/reviewer filtering
  - Skill-based filtering
  - **Time-scoped queries** (start/end timestamps)
  - Rating filtering
  - Chain filtering (polkadot/base)
- Student analytics aggregation

### ✅ Demo Page ([app/arkiv-demo/page.tsx](frontend/app/arkiv-demo/page.tsx))
Interactive features:
- Connection testing
- Sample data indexing (projects, unlocks, reviews)
- Query demonstrations:
  - All projects
  - Filter by skill (React)
  - Time-scoped (last 7 days)
- Student analytics dashboard
- Real-time query results display

---

## 🚀 How to Get Testnet Tokens

### Step 1: Generate a Wallet (if needed)

```bash
# Option 1: Use existing MetaMask wallet
# Export private key from MetaMask

# Option 2: Generate new wallet with Node.js
node -e "
const { Wallet } = require('ethers');
const wallet = Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
"
```

### Step 2: Request Arkiv L2 Tokens

**Via Telegram**:
1. Join the sub0 HACK Telegram group
2. Message **Dragan Milic** or **Marcos | Golem/Arkiv**
3. Provide your wallet address
4. Request: "Could I get 2 ETH on Arkiv L2 for testing? Address: 0x..."

They will send tokens to `https://l2.hoodi.arkiv.network/`

### Step 3: Bridge to Mendoza

Once you receive L2 tokens:

```javascript
// Send L2 ETH to the bridge address
To: 0xf2312FAc5042CfA142e51726C3E620431eA7b705
Amount: 2 ETH (or desired amount)
Network: Arkiv L2 (https://l2.hoodi.arkiv.network/rpc)
```

The bridge will automatically transfer funds to Mendoza.

### Step 4: Configure Environment

Edit `frontend/.env.local`:

```env
# Add your private key (the one you used for the bridge)
ARKIV_PRIVATE_KEY=0x... # YOUR PRIVATE KEY HERE

# Arkiv is already enabled
NEXT_PUBLIC_ENABLE_ARKIV=true
```

**⚠️ SECURITY**: Never commit `.env.local` to git! It's already in `.gitignore`.

---

## 🧪 Testing the Integration

### 1. Start Dev Server (if not running)

```bash
cd frontend
npm run dev
```

### 2. Open Demo Page

Visit: [http://localhost:3000/arkiv-demo](http://localhost:3000/arkiv-demo)

### 3. Test Connection

Click "Test Connection" button
- ✅ Should show: "Connected to Arkiv Mendoza"
- ❌ If fails: Check private key in `.env.local`

### 4. Index Sample Data

Click buttons to index sample events:
- 📝 **Index Project** - Creates a ProjectCreated event
- 🔓 **Index Unlock** - Creates a ProjectUnlocked event
- ⭐ **Index Review** - Creates a ReviewSubmitted event

Each creates an entity on Arkiv with:
- Structured attributes (eventType, projectId, student, etc.)
- JSON payload with full event data
- Time-scoped expiration

### 5. Query Data

Test different query patterns:
- **All Projects** - Retrieves all ProjectCreated events
- **React Projects** - Filters by skill attribute
- **Last 7 Days** - Time-scoped query (demonstrates key Arkiv feature)

### 6. View Analytics

1. Enter a student address (or use default)
2. Click "Get Analytics"
3. See aggregated metrics:
   - Total projects
   - Total unlocks
   - Average rating
   - Skill distribution

---

## 🔍 Verify on Explorer

After indexing events, verify on Mendoza Explorer:

**Explorer URL**: https://explorer.mendoza.hoodi.arkiv.network/

1. Search for your wallet address
2. Go to "Entity Operations" tab
3. See your indexed events with:
   - Payload (JSON data)
   - Attributes (queryable fields)
   - Expiration time
   - Transaction hash

---

## 📊 Arkiv Features Demonstrated

### 1. Queryable Data
```typescript
// SQL-like queries
const reactProjects = await queryEvents({
  eventType: 'ProjectCreated',
  skill: 'React',
  limit: 10,
});
```

### 2. Time-Scoped Storage
```typescript
// Auto-expiring data
expiresIn: ExpirationTime.fromDays(365) // Projects
expiresIn: ExpirationTime.fromDays(90)  // Unlocks
```

### 3. Verifiable Integrity
- Each entity tied to blockchain transaction
- Cryptographic proof of data authenticity
- Immutable event history

### 4. Structured Attributes
```typescript
attributes: [
  { key: 'eventType', value: 'ProjectCreated' },
  { key: 'projectId', value: '1' },
  { key: 'student', value: '0x...' },
  { key: 'skill', value: 'React' }, // Multiple skills as separate attributes
  { key: 'timestamp', value: '1234567890' },
]
```

---

## 🎬 Demo Video Script

### Scene 1: Connection (30s)
```
"DotGo uses Arkiv for queryable blockchain data.

Let me connect to Arkiv Mendoza testnet..."
[Click "Test Connection"]
"✅ Connected! Now I can index and query events."
```

### Scene 2: Indexing (1min)
```
"When a student creates a project, we index it to Arkiv..."
[Click "Index Project"]
"The event is stored with structured attributes:
- Title, description, GitHub URL
- Skills (React, Solidity, TypeScript)
- Student address
- Timestamp

Data expires automatically after 1 year."
```

### Scene 3: Querying (1min)
```
"Now let's query the data...

[Click "React Projects"]
"Find all projects with React skill - instant results!

[Click "Last 7 Days"]
"Time-scoped query - only projects from last week."

This would take forever to query on-chain directly.
Arkiv makes it instant."
```

### Scene 4: Analytics (30s)
```
"Let's see student analytics..."
[Enter address, click "Get Analytics"]

"Aggregated metrics from all indexed events:
- 5 total projects
- 12 unlocks (earned 30 DOT)
- Average 4.5-star rating
- Skills: React, Solidity, TypeScript

All verifiable on-chain!"
```

### Scene 5: Explorer (30s)
```
"Let's verify on Mendoza Explorer..."
[Show explorer with entity operations]

"Each indexed event is cryptographically tied to a
blockchain transaction. Fully verifiable and immutable."
```

---

## 📝 Key Points for Submission

### Arkiv Main Track Requirements

✅ **Queryable Data Layer**
- SQL-like queries implemented
- Multiple filter types (skill, time, rating, chain)
- Fast retrieval without blockchain latency

✅ **Time-Scoped Data**
- Auto-expiring entities (365 days for projects, 90 for unlocks)
- Demonstrated in query filters (last 7 days)
- Reduces storage costs and ensures data freshness

✅ **Verifiable Integrity**
- Each entity linked to blockchain transaction
- Cryptographic proofs via transaction hash
- Explorer verification available

✅ **Structured Attributes**
- Queryable fields (eventType, student, skill, etc.)
- Efficient filtering and indexing
- Supports complex queries

---

## 🐛 Troubleshooting

### "Arkiv client not available"
**Cause**: Private key not configured
**Fix**: Add `ARKIV_PRIVATE_KEY=0x...` to `.env.local`

### "Failed to create Arkiv client"
**Cause**: Invalid private key format
**Fix**: Ensure private key starts with `0x` and is 66 characters

### "Transaction fails"
**Cause**: Insufficient balance on Mendoza
**Fix**: Request more tokens from Arkiv team or bridge from L2

### "Query returns no results"
**Cause**: No data indexed yet
**Fix**: Click "Index Project" button first to create sample data

### Connection timeout
**Cause**: Network issues or RPC down
**Fix**: Check [https://mendoza.hoodi.arkiv.network/](https://mendoza.hoodi.arkiv.network/) status

---

## 📚 Code References

| File | Purpose |
|------|---------|
| [lib/arkiv-client.ts](frontend/lib/arkiv-client.ts) | Arkiv SDK initialization and connection |
| [lib/arkiv-event-indexer.ts](frontend/lib/arkiv-event-indexer.ts) | Event indexing and query functions |
| [app/arkiv-demo/page.tsx](frontend/app/arkiv-demo/page.tsx) | Interactive demo UI |
| [lib/arkiv-indexer.ts](frontend/lib/arkiv-indexer.ts) | Original implementation (v1) |

---

## 🎯 Next Steps

1. **Get Tokens** (30 min)
   - Request from Telegram
   - Bridge to Mendoza
   - Add private key to `.env.local`

2. **Test Locally** (15 min)
   - Visit /arkiv-demo
   - Test connection
   - Index sample data
   - Query and verify

3. **Verify on Explorer** (10 min)
   - Check Mendoza Explorer
   - Confirm entity operations
   - Screenshot for demo

4. **Record Demo** (1 hour)
   - Follow video script above
   - Show all 4 features
   - Include explorer verification

5. **Submit** (30 min)
   - Form: http://sl.sub0.gg/b8Qgr
   - Select: Polkadot Main ($16k) + Arkiv ($10k)
   - Upload demo video
   - Submit before 12:00 PM!

---

**Prize Target**: Polkadot Main ($16k) + **Arkiv Main ($10k)** = **$26,000 total** 🚀

Good luck!
