# Deployment Checklist - sub0 HACK Buenos Aires

**Deadline**: November 16, 2025 at 12:00 PM (Buenos Aires time)
**Submission Form**: http://sl.sub0.gg/b8Qgr

---

## Phase 1: Get Testnet Tokens ⏰ 30 min

### Paseo Testnet (for Polkadot contracts)
- [ ] Visit https://faucet.polkadot.io/
- [ ] Select "Paseo Asset Hub"
- [ ] Enter your Polkadot wallet address
- [ ] Request tokens
- [ ] Verify receipt in wallet

### Arkiv L2 (for Arkiv integration - $10k prize track)
**Option 1: Request from Arkiv Team**
- [ ] Join Telegram group
- [ ] Request 2 ETH on L2 from Dragan Milic or Marcos
- [ ] Bridge to Mendoza: Send to `0xf2312FAc5042CfA142e51726C3E620431eA7b705`

**Option 2: Use Faucet** (if available)
- [ ] Check Arkiv portal for faucet link
- [ ] Request tokens

---

## Phase 2: Deploy Polkadot Contract ⏰ 1 hour

### Prerequisites
- [ ] Polkadot wallet with Paseo tokens
- [ ] Contract artifact: `contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.contract`

### Deployment via Contracts UI
1. [ ] Open https://ui.use.ink/
2. [ ] Connect wallet (Polkadot.js/Talisman/SubWallet)
3. [ ] Switch network to "Paseo Asset Hub"
4. [ ] Click "Upload New Contract"
5. [ ] Upload `dotgo_portfolio.contract` file
6. [ ] Select constructor: `new`
7. [ ] Enter treasury address (your wallet address)
8. [ ] Sign and submit transaction
9. [ ] **SAVE CONTRACT ADDRESS** - critical for frontend!
10. [ ] Verify on explorer: https://assethub-paseo.subscan.io/

**Contract Address**: _________________ (save this!)

### Alternative: Deploy via cargo-contract
```bash
cd contracts/polkadot/dotgo_portfolio

# Deploy to Paseo
cargo contract instantiate \
  --url wss://testnet-passet-hub.polkadot.io \
  --constructor new \
  --args <YOUR_TREASURY_ADDRESS> \
  --suri "//YourAccountSeed"

# Save the contract address from output
```

---

## Phase 3: Deploy Base Contract ⏰ 1.5 hours

### Option A: Deploy to Arkiv Mendoza (RECOMMENDED for $10k prize)

#### Prerequisites
- [ ] Arkiv Mendoza tokens (bridged from L2)
- [ ] Install correct SDK: `npm install @arkiv-network/sdk`

#### Update Hardhat Config
```javascript
// contracts/base/hardhat.config.js
mendoza: {
  url: 'https://mendoza.hoodi.arkiv.network/rpc',
  chainId: 60138453056,
  accounts: [process.env.PRIVATE_KEY],
}
```

#### Deployment Steps
```bash
cd contracts/base

# Set private key
npx hardhat vars set PRIVATE_KEY

# Compile
npx hardhat compile

# Deploy
npx hardhat ignition deploy ./ignition/modules/DotGoPortfolio.js --network mendoza
```

- [ ] Deploy completed
- [ ] **SAVE CONTRACT ADDRESS**: _________________
- [ ] Verify on explorer: https://explorer.mendoza.hoodi.arkiv.network/

### Option B: Deploy to Base Sepolia (Standard testnet)

```bash
cd contracts/base

# Get Base Sepolia tokens from faucet
# https://www.alchemy.com/faucets/base-sepolia

# Set private key
npx hardhat vars set PRIVATE_KEY

# Compile
npx hardhat compile

# Deploy
npx hardhat ignition deploy ./ignition/modules/DotGoPortfolio.js --network baseSepolia
```

- [ ] Deploy completed
- [ ] **SAVE CONTRACT ADDRESS**: _________________

---

## Phase 4: Update Frontend ⏰ 15 min

### Create Environment File
```bash
cd frontend
cp .env.example .env.local
```

### Update .env.local
```env
# WalletConnect Project ID (create at https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Polkadot Contract (deployed on Paseo)
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<YOUR_PASEO_CONTRACT_ADDRESS>

# Base Contract (deployed on Mendoza or Base Sepolia)
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=<YOUR_BASE_CONTRACT_ADDRESS>

# Arkiv Configuration (if using Mendoza)
NEXT_PUBLIC_ARKIV_MENDOZA_RPC=https://mendoza.hoodi.arkiv.network/rpc
NEXT_PUBLIC_ARKIV_MENDOZA_NETWORK_ID=60138453056
NEXT_PUBLIC_ARKIV_L2_BRIDGE=0xf2312FAc5042CfA142e51726C3E620431eA7b705
```

- [ ] Environment file created
- [ ] Contract addresses added
- [ ] Build test: `npm run build`
- [ ] Local test: `npm run dev`

---

## Phase 5: E2E Testing ⏰ 1 hour

### Test Polkadot Flow
- [ ] Connect Polkadot wallet
- [ ] Create test project
- [ ] Verify event emission
- [ ] Check explorer for transaction

### Test Base Flow (if deployed)
- [ ] Connect MetaMask to Base/Mendoza
- [ ] Create test project
- [ ] Verify event emission
- [ ] Check explorer for transaction

### Test Cross-Chain (if Hyperbridge integrated)
- [ ] Create project on Polkadot
- [ ] Verify message on Base
- [ ] Test unlock flow
- [ ] Test review flow

---

## Phase 6: Arkiv Indexing (BONUS - $10k track) ⏰ 2 hours

### Setup Arkiv SDK
```bash
cd frontend
npm install @arkiv-network/sdk  # Correct package!
```

### Implement Event Indexing
See [ARKIV_INTEGRATION.md](ARKIV_INTEGRATION.md) for complete guide.

Key steps:
- [ ] Create Arkiv client
- [ ] Index ProjectCreated events
- [ ] Index ProjectUnlocked events
- [ ] Index ReviewSubmitted events
- [ ] Test queries with time-scoped data

### Verify on Arkiv Explorer
- [ ] Check https://explorer.mendoza.hoodi.arkiv.network/
- [ ] Verify entity operations
- [ ] Test SQL-like queries

---

## Phase 7: Demo Materials ⏰ 3 hours

### Demo Video (3-5 minutes)
- [ ] Script written
- [ ] Screen recording setup
- [ ] Record: Introduction (30s)
- [ ] Record: Problem statement (30s)
- [ ] Record: Solution overview (1min)
- [ ] Record: Live demo (2-3min)
  - Connect wallets (both chains)
  - Create project
  - Pay to unlock
  - Submit review
  - Show Arkiv queries (if implemented)
- [ ] Record: Conclusion (30s)
- [ ] Edit and export
- [ ] Upload to YouTube (unlisted)

### Presentation Slides (10-15 slides)
1. [ ] Title + Team
2. [ ] Problem Statement
3. [ ] Solution Overview
4. [ ] Architecture Diagram
5. [ ] Tech Stack
6. [ ] Smart Contracts (Polkadot)
7. [ ] Smart Contracts (Base/EVM)
8. [ ] Cross-Chain Integration
9. [ ] Arkiv Indexing (if implemented)
10. [ ] Demo Screenshots
11. [ ] Technical Highlights
12. [ ] Challenges & Solutions
13. [ ] Future Roadmap
14. [ ] Thank You + Links

- [ ] Slides created
- [ ] Export to PDF

---

## Phase 8: Submission ⏰ 30 min

### Pre-Submission Checklist
- [ ] All contracts deployed and verified
- [ ] Frontend working with deployed contracts
- [ ] Demo video uploaded and accessible
- [ ] Presentation slides ready
- [ ] GitHub repo public and up-to-date
- [ ] README updated with deployment info

### Submit to Form
**URL**: http://sl.sub0.gg/b8Qgr

Required materials:
- [ ] Project name: DotGo
- [ ] Team information
- [ ] Project description
- [ ] GitHub repository URL
- [ ] Demo video URL
- [ ] Presentation slides (PDF)
- [ ] Deployed contract addresses
  - Polkadot (Paseo): _________________
  - Base/Mendoza: _________________
- [ ] Prize tracks targeting:
  - ✅ Polkadot Main Track ($16k)
  - ✅ Arkiv Track ($10k) - if indexing implemented
  - ⚠️ Hyperbridge Track ($5k) - if cross-chain implemented

### Final Checks
- [ ] All form fields completed
- [ ] Links tested and accessible
- [ ] Contract addresses verified
- [ ] Submission timestamp before 12:00 PM

---

## Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Get Tokens | 30 min | ⏳ |
| Deploy Polkadot | 1 hour | ⏳ |
| Deploy Base | 1.5 hours | ⏳ |
| Update Frontend | 15 min | ⏳ |
| E2E Testing | 1 hour | ⏳ |
| Arkiv (bonus) | 2 hours | ⏳ |
| Demo Materials | 3 hours | ⏳ |
| Submission | 30 min | ⏳ |
| **TOTAL** | **~10 hours** | |

**Buffer**: 2 hours for unexpected issues

---

## Emergency Contacts

**Arkiv Team** (Telegram):
- Dragan Milic - Test ETH, network support
- Marcos | Golem/Arkiv - SDK questions, entity management

**Resources**:
- Polkadot Faucet: https://faucet.polkadot.io/
- Contracts UI: https://ui.use.ink/
- Paseo Explorer: https://assethub-paseo.subscan.io/
- Mendoza Explorer: https://explorer.mendoza.hoodi.arkiv.network/
- Submission Form: http://sl.sub0.gg/b8Qgr

---

## Notes

**Critical Reminders**:
- ✅ Use Mendoza (YES) - NOT Kaolin (NO)
- ✅ Use `@arkiv-network/sdk` (YES) - NOT `arkiv-sdk` (NO)
- ⏰ Deadline: November 16, 2025 at 12:00 PM
- 📍 Location: Buenos Aires time zone

Good luck! 🚀
