# sub0 HACK Buenos Aires - Critical Context

**Event**: sub0 HACK Buenos Aires
**Dates**: November 14-16, 2025
**Submission Deadline**: **November 16, 2025 at 12:00 PM (Buenos Aires time)**
**Submission Form**: http://sl.sub0.gg/b8Qgr

---

## 🚨 CRITICAL INFORMATION from Telegram

### Arkiv Network Details

**IMPORTANT**: Use **Mendoza testnet**, NOT Kaolin!

**Arkiv Mendoza Network**:
- Explorer: https://explorer.mendoza.hoodi.arkiv.network/
- Network Info: https://mendoza.hoodi.arkiv.network/
- Network ID: 60138453056 (from earlier docs)

**Arkiv L2 Network** (for bridging):
- Network Info: https://l2.hoodi.arkiv.network/
- Network ID: 393530
- Bridge Address: `0xf2312FAc5042CfA142e51726C3E620431eA7b705`

**Correct SDK**: Use `@arkiv-network/sdk` (NOT `arkiv-sdk`)
```bash
npm install @arkiv-network/sdk
```

### Getting Test ETH

**Option 1**: Request from Arkiv team in Telegram
- They send 2 ETH on L2
- Bridge to Mendoza by sending to: `0xf2312FAc5042CfA142e51726C3E620431eA7b705`

**Option 2**: Use faucet (if available)
- Check Arkiv portal for faucet link

### Arkiv Key Features

1. **Entity Expiration** (TTL):
   ```javascript
   expiresIn: ExpirationTime.fromHours(3)  // Auto-pruning
   ```

2. **Entity Updates**:
   ```javascript
   // Can update existing entities instead of creating new ones
   await client.mutateEntities({ updates: [...] });
   ```

3. **Audit Log Pattern**:
   - Keep expired entities for history
   - Use attributes as keys for versioning
   - Don't delete, just let expire

4. **Unsupported Transactions**:
   - Don't create raw transactions
   - Always use `@arkiv-network/sdk` methods

### Hyperbridge Information

**Track Documentation**: https://hack.sub0.gg/Hyperbridge-Bounty-5k-2a33e52aeb1580e394e1f1b3d9705f0e

**Message Flow**:
- Polkadot → Hyperbridge Polkadot Contract
- Hyperbridge Relayer → EVM Contract
- Uses pallets on Polkadot side
- Contract addresses in track docs

---

## 📝 Updated Deployment Strategy

### Network Options for Base Contracts

**Option A**: Deploy to **Arkiv Mendoza** (Recommended for Arkiv track)
- Integrated with Arkiv ecosystem
- Direct access to indexing
- Network ID: 60138453056
- Get test ETH from Arkiv team

**Option B**: Deploy to **Base Sepolia**
- Standard Base testnet
- Independent from Arkiv
- Use Base Sepolia faucet

**Recommendation**: Deploy to **BOTH** for maximum prize potential
1. Core contracts on Base Sepolia (standard EVM)
2. Event indexing on Arkiv Mendoza (for $10k prize)

### Polkadot Deployment

**Network**: Paseo Asset Hub (as planned)
- RPC: `wss://testnet-passet-hub.polkadot.io`
- Faucet: https://faucet.polkadot.io/
- Explorer: https://assethub-paseo.subscan.io/

---

## 🎯 Prize Track Strategy Update

### Arkiv Track ($10k) - PRIMARY FOCUS

**Requirements**:
1. ✅ Use `@arkiv-network/sdk` (correct package)
2. ✅ Deploy to Mendoza testnet
3. ✅ Implement queryable data layer
4. ✅ Show time-scoped queries
5. ✅ Demonstrate verifiable integrity

**Implementation**:
- Index events from Polkadot contract
- Store in Arkiv Mendoza
- Query with SQL-like syntax
- Show time-scoped analytics

### Polkadot Main Track ($16k) - CORE

**Requirements**:
1. ✅ ink! smart contract on Paseo
2. ✅ User-facing dApp
3. ✅ Solves real problem
4. ✅ Clean implementation

### Hyperbridge Track ($5k) - BONUS

**Requirements**:
1. ⚡ Cross-chain messaging
2. ⚡ Storage queries across chains
3. ⚡ Use Hyperbridge pallets (Polkadot) + contracts (EVM)

**Resource**: Check track docs for deployed contracts and examples

---

## ⏰ Time-Optimized Plan (Assuming ~10 hours remaining)

### Phase 1: Deploy & Test (3 hours)

**Hour 1**: Get Testnet Tokens
```bash
# Paseo
Visit: https://faucet.polkadot.io/

# Arkiv L2 (request in Telegram)
# Or use wallet: 0x534cc25e88d0f59f44d34575a32020211f5f3e1f
# Bridge to Mendoza: send to 0xf2312FAc5042CfA142e51726C3E620431eA7b705
```

**Hour 2**: Deploy Contracts
```bash
# Polkadot (Paseo)
cd contracts/polkadot/dotgo_portfolio
# Use Contracts UI: https://ui.use.ink/

# Base/Arkiv Mendoza
cd contracts/base
npm install @arkiv-network/sdk  # Correct package!
# Update hardhat config for Mendoza network
npx hardhat run scripts/deploy.js --network mendoza
```

**Hour 3**: Setup Arkiv Indexing
```bash
# Follow ARKIV_INTEGRATION.md
# Use Mendoza testnet
# Correct SDK: @arkiv-network/sdk
```

### Phase 2: Demo Materials (4 hours)

**Hours 4-6**: Create Demo Video
- Show Arkiv queries (SQL-like)
- Demonstrate time-scoped data
- Show cross-chain events (if Hyperbridge done)

**Hours 7**: Create Presentation
- Emphasize Arkiv integration
- Show verifiable data layer
- Highlight time-scoped queries

### Phase 3: Submit (1 hour)

**Hour 8**: Final Polish & Submit
- Form: http://sl.sub0.gg/b8Qgr
- Materials ready
- Submit BEFORE 12 PM

### Buffer (2 hours)
- Testing
- Fixes
- Additional polish

---

## 🔧 Critical Configuration Updates

### Update Environment Variables

Add to `frontend/.env.local`:
```env
# Arkiv Mendoza (PRIMARY for hackathon)
NEXT_PUBLIC_ARKIV_MENDOZA_RPC=https://mendoza.hoodi.arkiv.network/rpc
NEXT_PUBLIC_ARKIV_MENDOZA_NETWORK_ID=60138453056
NEXT_PUBLIC_ARKIV_MENDOZA_EXPLORER=https://explorer.mendoza.hoodi.arkiv.network/

# Arkiv L2 (for bridging)
NEXT_PUBLIC_ARKIV_L2_RPC=https://l2.hoodi.arkiv.network/rpc
NEXT_PUBLIC_ARKIV_L2_NETWORK_ID=393530
NEXT_PUBLIC_ARKIV_BRIDGE_ADDRESS=0xf2312FAc5042CfA142e51726C3E620431eA7b705

# Use correct SDK
# npm install @arkiv-network/sdk
```

### Update Hardhat Config

Add Mendoza network to `contracts/base/hardhat.config.js`:
```javascript
mendoza: {
  url: 'https://mendoza.hoodi.arkiv.network/rpc',
  chainId: 60138453056,
  accounts: [process.env.PRIVATE_KEY],
}
```

---

## 📞 Support Contacts

**Arkiv Team** (from Telegram):
- Dragan Milic - Sending test ETH, network support
- Marcos | Golem/Arkiv - SDK questions, entity management

**Resources**:
- Telegram groups (check for real-time help)
- Track docs for each bounty
- GitHub examples (use Mendoza, not Kaolin!)

---

## ✅ Pre-Submission Checklist

### Arkiv Integration
- [ ] Using `@arkiv-network/sdk` (correct package)
- [ ] Deployed to Mendoza testnet (not Kaolin)
- [ ] Events indexed from smart contracts
- [ ] Queryable data layer working
- [ ] Time-scoped queries demonstrated
- [ ] Explorer shows entity operations

### Smart Contracts
- [ ] Polkadot contract on Paseo
- [ ] Base/Mendoza contract deployed
- [ ] Contract addresses saved
- [ ] Verified on explorers

### Demo
- [ ] Video shows Arkiv queries
- [ ] Time-scoped data featured
- [ ] Cross-chain aspects shown
- [ ] E2E flow demonstrated

### Submission
- [ ] Form filled: http://sl.sub0.gg/b8Qgr
- [ ] Submitted before 12 PM
- [ ] All required materials uploaded

---

## 🚀 Immediate Next Steps

1. **Update SDK**: `npm install @arkiv-network/sdk`
2. **Get Test ETH**: Request in Telegram or use faucet
3. **Update Configs**: Use Mendoza network, not Kaolin
4. **Deploy Contracts**: Paseo + Mendoza
5. **Index Events**: Use correct SDK
6. **Create Demo**: Focus on Arkiv features
7. **Submit**: Before 12 PM!

---

**REMEMBER**:
- ✅ Mendoza (YES)
- ❌ Kaolin (NO)
- ✅ `@arkiv-network/sdk` (YES)
- ❌ `arkiv-sdk` (NO)

Good luck! 🚀
