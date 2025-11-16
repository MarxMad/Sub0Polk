# Arkiv Integration Testing Guide

Quick testing guide for the Arkiv integration.

## Pre-requisites

✅ Contracts deployed on Polkadot Paseo and/or Base Sepolia
✅ Backend service running with valid ARKIV_PRIVATE_KEY
✅ Frontend running on http://localhost:3000

---

## Testing Steps

### 1. Generate Arkiv Private Key

```bash
node -e "console.log('0x' + require('crypto').randomBytes(32).toString('hex'))"
```

Copy output and save to `backend/.env`:
```env
ARKIV_PRIVATE_KEY=0x<your_key_here>
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Expected output:
```
added 150 packages
```

### 3. Start Backend Listeners

```bash
npm run dev
```

Expected output:
```
🚀 Starting DotGo Backend Service
================================

✅ Arkiv client initialized: 0x...
🎧 Starting Polkadot event listener...
   RPC: wss://testnet-passet-hub.polkadot.io
   Contract: 5...

🎧 Starting Base event listener...
   Chain: Base Sepolia
   Contract: 0x...

✅ Listening for events... (Press Ctrl+C to stop)
```

### 4. Open Arkiv Demo Page

Navigate to: http://localhost:3000/arkiv-demo

### 5. Test Connection

Click "Test Connection" button

Expected:
- Button changes to "✅ Connected"
- Alert shows: "✅ Connected to Arkiv Mendoza successfully!"
- Console shows:
  ```
  ✅ Arkiv client initialized
    Network: Mendoza (Chain ID: 60138453056)
    Account: 0x...
  ✅ Arkiv connection successful
    Found 0 entities
  ```

### 6. Index Sample Events

Enter a test address in "Student Address" field (or leave default)

Click each button:
1. **"📝 Index Project (365 days)"**
   - Alert: "✅ Project indexed successfully!"
   - Backend logs:
     ```
     ✅ ProjectCreated indexed: demo-1234567890 - "DeFi Analytics Dashboard"
     ```

2. **"🔓 Index Unlock (90 days)"**
   - Alert: "✅ Unlock indexed successfully!"
   - Backend logs:
     ```
     ✅ ProjectUnlocked indexed: 1 by 0x9876...
     ```

3. **"⭐ Index Review (365 days)"**
   - Alert: "✅ Review indexed successfully!"
   - Backend logs:
     ```
     ✅ ReviewSubmitted indexed: 1 - Rating: 5/5
     ```

### 7. Query Indexed Data

Click query buttons:

**"All Projects"**:
- Should show indexed projects
- Query Results section appears with JSON data
- Console shows:
  ```
  📊 Query returned 1 events
  Query results: [...]
  ```

**"React Projects"**:
- Filters projects with React skill
- Shows subset of results

**"Last 7 Days"**:
- Time-scoped query
- Shows recent projects only

### 8. View Analytics

With student address filled, click "Get Analytics"

Expected:
- Student Analytics card appears
- Shows:
  - Total Projects: 1
  - Total Unlocks: 1
  - Total Reviews: 1
  - Avg Rating: 5.0★
  - Polkadot Projects: 1
  - Unique Skills: 5
- Skill distribution tags show: Solidity, React, TypeScript, The Graph, Hardhat

### 9. Watch Live Stats

Wait 15 seconds and observe:
- "Total Projects" counter updates
- "Total Reviews" counter updates
- "Last Refresh" timestamp updates
- Console shows:
  ```
  📊 Query returned X events
  ```

---

## Expected Behavior Summary

### ✅ Success Indicators

1. **Backend Connection**: Arkiv client initializes with your address
2. **Event Indexing**: All 3 event types index successfully
3. **Queries Work**: Returns indexed data with proper filtering
4. **Live Updates**: Stats refresh every 15 seconds automatically
5. **Analytics**: Aggregates data correctly across events

### ❌ Common Issues

**"Arkiv client not initialized"**:
- Check `ARKIV_PRIVATE_KEY` is set in `backend/.env`
- Restart backend service

**"Query returned 0 events"**:
- Index some test events first
- Wait 15 seconds for processing
- Check backend is running

**"Failed to index"**:
- Check backend logs for errors
- Verify Arkiv RPC is accessible
- Ensure private key is valid hex format (0x...)

---

## Manual Backend Testing

Test individual components:

### Test Polkadot Listener Only
```bash
cd backend
npm run polkadot
```

### Test Base Listener Only
```bash
cd backend
npm run base
```

### Test Arkiv Indexer Directly
```bash
cd backend
node -e "
const { indexProjectCreated } = await import('./arkiv-indexer.js');
await indexProjectCreated({
  projectId: 'test-1',
  student: '0x123',
  title: 'Test Project',
  description: 'Test',
  githubUrl: 'https://github.com',
  demoUrl: 'https://demo.com',
  skills: ['JavaScript'],
  timestamp: Date.now(),
  chain: 'polkadot',
  txHash: '0xtest'
});
"
```

---

## Production Testing

### 1. Deploy with PM2

```bash
cd backend
pm2 start ecosystem.config.js
pm2 logs
```

Expected logs:
```
PM2      | App [dotgo-polkadot-indexer] launched
PM2      | App [dotgo-base-indexer] launched
```

### 2. Test Auto-Restart

Kill a process:
```bash
pm2 list  # Get process ID
pm2 stop dotgo-polkadot-indexer
```

Wait 5 seconds:
```bash
pm2 list  # Should show "online" again
```

### 3. Monitor Resources

```bash
pm2 monit
```

Check:
- Memory usage < 500MB
- CPU usage < 50% average
- No restart loops

---

## Integration Testing Checklist

- [ ] Backend connects to Arkiv Mendoza
- [ ] Polkadot listener subscribes to events
- [ ] Base listener watches contract events
- [ ] ProjectCreated events index successfully
- [ ] ProjectUnlocked events index successfully
- [ ] ReviewSubmitted events index successfully
- [ ] Frontend can query indexed data
- [ ] Skill-based filtering works
- [ ] Time-scoped queries work
- [ ] Student analytics aggregates correctly
- [ ] Live stats update every 15 seconds
- [ ] PM2 auto-restart works
- [ ] Logs are being written
- [ ] No memory leaks over 1 hour

---

## Next Steps After Testing

1. ✅ Deploy contracts to testnets
2. ✅ Update `.env` with real contract addresses
3. ✅ Deploy backend to cloud (Railway/Render)
4. ✅ Deploy frontend to Vercel
5. ✅ Create demo video showing live indexing
6. ✅ Prepare hackathon presentation

---

**Testing Time**: ~15 minutes
**Prize Value**: $10,000 Arkiv track
