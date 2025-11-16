# Quick Start Deployment Guide

**Time to complete**: ~2-3 hours
**Deadline**: November 16, 2025 at 12:00 PM

---

## Step 1: Get Testnet Tokens (15 min)

### Paseo Tokens (for Polkadot contract)
1. Visit: https://faucet.polkadot.io/
2. Select "Paseo Asset Hub"
3. Enter your wallet address
4. Request tokens
5. Wait for confirmation

---

## Step 2: Deploy Polkadot Contract (30 min)

### Using Contracts UI (Recommended)

1. **Open Contracts UI**: https://ui.use.ink/

2. **Connect Wallet**:
   - Click "Connect" button
   - Choose: Polkadot.js, Talisman, or SubWallet
   - Authorize connection

3. **Switch to Paseo Network**:
   - Network dropdown → "Paseo Asset Hub"
   - Verify connection

4. **Upload Contract**:
   - Click "Upload New Contract"
   - Select file: `contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.contract`
   - Click "Next"

5. **Deploy**:
   - Constructor: Select "new"
   - Treasury Address: Enter your wallet address
   - Click "Submit"
   - Sign transaction

6. **Save Contract Address**:
   ```
   Contract Address: _________________________
   ```
   **⚠️ CRITICAL**: Save this address immediately!

7. **Verify Deployment**:
   - Visit: https://assethub-paseo.subscan.io/
   - Search for your transaction
   - Confirm success

---

## Step 3: Update Frontend Configuration (5 min)

1. **Edit `.env.local`**:
   ```bash
   cd frontend
   nano .env.local  # or use your preferred editor
   ```

2. **Add Contract Address**:
   ```env
   NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<YOUR_CONTRACT_ADDRESS>
   ```

3. **Add WalletConnect Project ID** (optional but recommended):
   - Visit: https://cloud.walletconnect.com/
   - Create free account
   - Create new project
   - Copy project ID
   - Add to `.env.local`:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<YOUR_PROJECT_ID>
   ```

4. **Save and restart dev server**:
   ```bash
   # Server will auto-reload with new .env.local
   ```

---

## Step 4: Test Frontend (15 min)

1. **Open App**: http://localhost:3000

2. **Connect Polkadot Wallet**:
   - Click "Connect Polkadot" button
   - Authorize connection
   - Verify connected address shown

3. **Test Contract Interaction**:
   - Navigate to profile/dashboard
   - Try creating a test project
   - Verify transaction submission
   - Check explorer for confirmation

4. **Common Issues**:
   - **Wallet not connecting**: Refresh page, try different wallet
   - **Transaction fails**: Check Paseo token balance
   - **Contract not found**: Verify contract address in `.env.local`

---

## Step 5: Build Production (10 min)

```bash
cd frontend

# Build for production
npm run build

# Test production build
npm run start
```

Expected output:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    XXX kB         XXX kB
└ ○ /portfolios                          XXX kB         XXX kB
```

---

## Step 6: Deploy Base Contract (OPTIONAL - 1 hour)

### Prerequisites
```bash
cd contracts/base

# Install dependencies
npm install

# Install Arkiv SDK (correct package!)
npm install @arkiv-network/sdk
```

### Option A: Deploy to Arkiv Mendoza ($10k prize track)

1. **Get Arkiv L2 Tokens**:
   - Request in Telegram from Arkiv team
   - Receive 2 ETH on L2
   - Bridge to Mendoza: Send to `0xf2312FAc5042CfA142e51726C3E620431eA7b705`

2. **Configure Hardhat**:
   ```bash
   # Set private key
   npx hardhat vars set PRIVATE_KEY
   # Paste your private key when prompted
   ```

3. **Deploy**:
   ```bash
   npx hardhat compile
   npx hardhat ignition deploy ./ignition/modules/DotGoPortfolio.js --network mendoza
   ```

4. **Save Contract Address**:
   ```
   Mendoza Contract: _________________________
   ```

5. **Update Frontend**:
   ```env
   NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=<MENDOZA_CONTRACT_ADDRESS>
   NEXT_PUBLIC_ENABLE_ARKIV=true
   ```

### Option B: Deploy to Base Sepolia (Standard)

1. **Get Base Sepolia Tokens**:
   - Visit: https://www.alchemy.com/faucets/base-sepolia

2. **Deploy**:
   ```bash
   npx hardhat vars set PRIVATE_KEY
   npx hardhat compile
   npx hardhat ignition deploy ./ignition/modules/DotGoPortfolio.js --network baseSepolia
   ```

---

## Step 7: Create Demo Materials (2 hours)

### Demo Video Script (3-5 min total)

**Introduction (30s)**:
- "Hi, I'm [name] presenting DotGo"
- "A cross-chain student portfolio platform"
- "Built on Polkadot and Base"

**Problem (30s)**:
- "Students struggle to monetize their portfolio reviews"
- "Lack of cross-chain portfolio solutions"
- "No verifiable blockchain-based credentials"

**Solution (1 min)**:
- "DotGo enables pay-to-unlock student portfolios"
- "Cross-chain support via Polkadot and Base"
- "Event indexing with Arkiv for analytics"

**Live Demo (2-3 min)**:
1. Show dual wallet connection (Polkadot + MetaMask)
2. Create sample project
3. Pay to unlock (show transaction)
4. Submit review
5. Show Arkiv queries (if implemented)

**Conclusion (30s)**:
- "Built with ink! and Solidity"
- "Thank you to sub0 HACK organizers"
- "GitHub: [your-repo]"

### Recording Tips
- Use screen recording (QuickTime, OBS, Loom)
- Clear audio (test microphone first)
- 1080p resolution minimum
- Upload to YouTube (unlisted)

---

## Step 8: Submit (30 min)

### Submission Form: http://sl.sub0.gg/b8Qgr

**Required Information**:
1. Project Name: **DotGo**
2. Team Information
3. Project Description (elevator pitch)
4. GitHub Repo URL
5. Demo Video URL (YouTube)
6. Deployed Contract Addresses:
   - Polkadot (Paseo): `<YOUR_ADDRESS>`
   - Base/Mendoza: `<YOUR_ADDRESS>` (if deployed)
7. Prize Tracks:
   - ✅ Polkadot Main Track ($16k)
   - ✅ Arkiv Track ($10k) - if Arkiv integration complete
   - ⚠️ Hyperbridge Track ($5k) - if cross-chain messaging implemented

### Pre-Submission Checklist
- [ ] GitHub repo public and updated
- [ ] README has deployment instructions
- [ ] Contract addresses documented
- [ ] Demo video accessible
- [ ] All form fields completed
- [ ] Links tested

### Submit BEFORE 12:00 PM November 16, 2025!

---

## Troubleshooting

### Frontend Build Fails
```bash
# Clear cache
rm -rf frontend/.next
rm -rf frontend/node_modules
cd frontend && npm install
npm run build
```

### Contract Deployment Fails
- Check token balance
- Verify network connection
- Check contract size (<100KB)
- Try different RPC endpoint

### Wallet Not Connecting
- Install Polkadot.js extension
- Refresh page
- Try different browser
- Check browser console for errors

---

## Resources

**Faucets**:
- Paseo: https://faucet.polkadot.io/
- Base Sepolia: https://www.alchemy.com/faucets/base-sepolia

**Deployment Tools**:
- Contracts UI: https://ui.use.ink/
- Polkadot.js Apps: https://polkadot.js.org/apps/

**Explorers**:
- Paseo: https://assethub-paseo.subscan.io/
- Mendoza: https://explorer.mendoza.hoodi.arkiv.network/

**Support**:
- Telegram: Arkiv team (Dragan, Marcos)
- Discord: Polkadot community
- GitHub Issues: Post questions

---

**Good luck! 🚀**

Remember: Focus on working demo over perfect code. Ship fast, ship working!
