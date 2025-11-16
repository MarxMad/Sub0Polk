# Deploy DotGo Contracts - Step by Step

**Contract Status**: ✅ Polkadot built (45 KB), Base ready to deploy

---

## Step 1: Get Test Tokens (10 minutes)

### Paseo Tokens (for Polkadot)
1. Open: https://faucet.polkadot.io/
2. Select network: **Paseo Asset Hub**
3. Enter your Polkadot wallet address
4. Request tokens (you'll get ~10 PAS)
5. Wait 1-2 minutes for confirmation

### Base Sepolia ETH
1. Open: https://www.alchemy.com/faucets/base-sepolia
2. Connect MetaMask
3. Solve CAPTCHA
4. Request ETH (you'll get ~0.05 ETH)
5. Wait 1-2 minutes for confirmation

✅ Mark this done when you have both tokens

---

## Step 2: Deploy Polkadot Contract (30 minutes)

### Option A: Using Contracts UI (Recommended - Easiest)

**Contract file**: `contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.contract` (45 KB)

1. **Open Contracts UI**:
   - Visit: https://ui.use.ink/
   - Click "Connect Wallet" (top right)
   - Select your wallet (Polkadot.js, Talisman, or SubWallet)
   - Approve connection

2. **Switch Network**:
   - Click network dropdown (top)
   - Select: **Paseo Asset Hub** or **Asset Hub Testnet (Paseo)**
   - Wait for connection confirmation

3. **Upload Contract**:
   - Click "Add New Contract" button
   - Select "Upload New Contract Code"
   - Click "Choose file"
   - Navigate to: `/Users/osx/Projects/JulioMCruz/Polkadot/Sub0Polk/contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.contract`
   - Click "Next"

4. **Instantiate Contract**:
   - Constructor: Select `new`
   - Parameter `treasury`: Enter YOUR Polkadot wallet address (this receives platform fees)
   - Gas limit: Leave default (auto-calculated)
   - Click "Next"
   - Review details
   - Click "Upload and Instantiate"
   - Sign transaction in your wallet

5. **Save Contract Address**:
   - After deployment, you'll see: "Contract deployed at: 5..."
   - **COPY THIS ADDRESS** (starts with 5)
   - Save it here: `5_______________________________________________`

6. **Verify Deployment**:
   - Click on your deployed contract
   - Call "getMessage: get_unlock_price" (read function)
   - Should return: `3000000000000` (3 PAS in smallest units)
   - ✅ Deployment successful!

### Option B: Using CLI (Advanced)

```bash
cd contracts/polkadot/dotgo_portfolio

# Deploy (replace with your seed phrase)
cargo contract instantiate \
  --url wss://paseo-asset-hub-rpc.polkadot.io \
  --constructor new \
  --args YOUR_WALLET_ADDRESS \
  --suri "your twelve word seed phrase" \
  --execute

# Copy the contract address from output
```

**Polkadot Contract Address**: `5_______________________________________________`

---

## Step 3: Deploy Base Contract (30 minutes)

### Configure Environment

```bash
cd contracts/base

# Create .env file
cat > .env << 'EOF'
PRIVATE_KEY=your_metamask_private_key_without_0x
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
EOF
```

**How to get your private key**:
1. Open MetaMask
2. Click account menu (top right)
3. Account details → Export Private Key
4. Enter password
5. Copy the key (remove `0x` if present)
6. Paste in .env file

### Deploy

```bash
# Install dependencies (if not done)
npm install

# Deploy to Base Sepolia
npm run deploy:baseSepolia
```

**Expected Output**:
```
Deploying DotGo contracts to baseSepolia
Deploying with account: 0x...
Account balance: 0.05 ETH

1. Deploying DotGoPortfolio...
✅ DotGoPortfolio deployed to: 0x...

============================================================
DEPLOYMENT SUMMARY
============================================================
Network: baseSepolia
DotGoPortfolio: 0x...
Platform Treasury: 0x...
============================================================
```

**Save Contract Address**: `0x_______________________________________________`

### Verify on BaseScan (Optional)

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <YOUR_WALLET_ADDRESS>
```

**Base Contract Address**: `0x_______________________________________________`

---

## Step 4: Update Frontend Config (10 minutes)

```bash
cd ../../frontend

# Create .env.local
cat > .env.local << 'EOF'
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect_cloud

# Contract Addresses (paste from Steps 2 & 3)
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=5...
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=0x...

# Network Configuration
NEXT_PUBLIC_POLKADOT_NETWORK=paseo
EOF
```

### Get WalletConnect Project ID

1. Visit: https://cloud.walletconnect.com/
2. Sign in (create free account if needed)
3. Create new project
4. Copy Project ID
5. Paste in .env.local

---

## Step 5: Test Deployment (Quick Verification)

### Start Frontend

```bash
npm run dev
```

Open: http://localhost:3000

### Quick Verification

1. **Check Contract Connection**:
   - Open browser console (F12)
   - Look for any contract connection errors
   - Should see: "Connected to Polkadot contract: 5..."

2. **Test Wallet Connection**:
   - Click "Connect Wallet" for Polkadot
   - Select Paseo Asset Hub network
   - Approve connection
   - Should show your address

3. **Test Read Functions** (via browser console):
   ```javascript
   // Should not see errors when page loads
   ```

---

## Deployment Summary

### Polkadot (Paseo Asset Hub)
- **Contract Address**: `5_______________________________________________`
- **Explorer**: https://assethub-paseo.subscan.io/account/5...
- **Network**: Paseo Asset Hub (testnet)
- **Gas Paid**: ~0.5 PAS

### Base (Sepolia Testnet)
- **Contract Address**: `0x_______________________________________________`
- **Explorer**: https://sepolia.basescan.org/address/0x...
- **Network**: Base Sepolia (testnet)
- **Gas Paid**: ~0.002 ETH

### Frontend Configuration
- **WalletConnect ID**: `_______________________________________________`
- **Local URL**: http://localhost:3000

---

## Troubleshooting

### Polkadot Deployment Issues

**Error: "Insufficient balance"**
- Get more tokens from faucet
- Need at least 2-3 PAS for deployment

**Error: "RPC connection failed"**
- Try alternate RPC: `wss://rpc-asset-hub-paseo.luckyfriday.io`
- Check if Paseo network is online

**Error: "Contract already exists"**
- This is normal if uploading same code
- Just instantiate instead of re-uploading

### Base Deployment Issues

**Error: "Insufficient funds"**
- Get more ETH from Base Sepolia faucet
- Need at least 0.01 ETH

**Error: "Invalid private key"**
- Make sure to remove `0x` prefix
- Check key is correct (should be 64 characters)

**Error: "Nonce too high"**
```bash
npx hardhat clean
rm -rf cache artifacts
npm run compile
```

### Frontend Issues

**Error: "Missing environment variables"**
- Check .env.local exists in frontend/
- Verify all contract addresses are filled in
- Restart dev server: `npm run dev`

---

## Next Steps After Deployment

1. **Full E2E Test** (30 min):
   - Create test project
   - Unlock with different wallet
   - Submit review
   - Verify all transactions

2. **Update Documentation**:
   - Add contract addresses to README.md
   - Create DEPLOYED.md with deployment info

3. **Create Demo Video** (45-60 min):
   - Record 4-5 minute walkthrough
   - Upload to YouTube/Loom

4. **Submit to Hackathon**:
   - Visit: https://hack.sub0.gg/
   - Fill submission form with contract addresses

---

## Deployment Checklist

- [ ] Got Paseo tokens from faucet
- [ ] Got Base Sepolia ETH from faucet
- [ ] Deployed Polkadot contract via Contracts UI
- [ ] Saved Polkadot contract address
- [ ] Verified Polkadot contract on explorer
- [ ] Configured Base .env file
- [ ] Deployed Base contract via Hardhat
- [ ] Saved Base contract address
- [ ] Verified Base contract on BaseScan (optional)
- [ ] Created frontend .env.local
- [ ] Got WalletConnect Project ID
- [ ] Updated all contract addresses in .env.local
- [ ] Started frontend dev server
- [ ] Verified no console errors
- [ ] Tested wallet connections

**Deployment Complete! 🎉**

Contract addresses saved in:
- Polkadot: 5...
- Base: 0x...

Ready for E2E testing and demo creation!
