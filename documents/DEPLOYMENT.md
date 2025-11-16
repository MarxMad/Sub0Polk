# DotGo Deployment Guide

Complete deployment guide for the DotGo cross-chain student portfolio platform.

## Overview

DotGo requires deploying contracts on two chains:
1. **Polkadot Chain**: Paseo Asset Hub (ink! smart contract)
2. **Base Chain**: Base Sepolia (Solidity smart contract)

## Prerequisites

### For Polkadot Deployment
- [ ] Polkadot wallet (Polkadot.js, Talisman, or SubWallet)
- [ ] Test tokens from [Paseo Faucet](https://faucet.polkadot.io/)
- [ ] cargo-contract installed (`cargo install cargo-contract`)

### For Base Deployment
- [ ] MetaMask or compatible Ethereum wallet
- [ ] Test ETH from [Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)
- [ ] Hardhat development environment

---

## Part 1: Deploy Polkadot Contract

### Step 1: Build the Contract

```bash
cd contracts/polkadot/dotgo_portfolio
cargo contract build --release
```

**Expected Output**: Build artifacts in `target/ink/`
- `dotgo_portfolio.contract` (15.9 KB)
- `dotgo_portfolio.wasm`
- `dotgo_portfolio.json`

### Step 2: Deploy via Contracts UI

1. **Open Contracts UI**: https://ui.use.ink/
2. **Connect Wallet**: Click "Connect" and authorize your Polkadot wallet
3. **Switch Network**: Select "Paseo Asset Hub" from network dropdown
4. **Upload Contract**:
   - Click "Upload a new contract"
   - Select `dotgo_portfolio.contract`
   - Click "Next"

5. **Instantiate Contract**:
   - Constructor: `new`
   - Parameters:
     - `treasury`: Your wallet address (receives 0.5 DOT platform fee)
   - Click "Instantiate"
   - Confirm transaction in wallet

6. **Save Contract Address**: Copy the deployed contract address

**Alternative: CLI Deployment**

```bash
# Deploy using cargo-contract
cargo contract instantiate \
  --url wss://testnet-passet-hub.polkadot.io \
  --constructor new \
  --args <YOUR_TREASURY_ADDRESS> \
  --suri <YOUR_SEED_PHRASE>
```

### Step 3: Verify Deployment

Test the contract on Contracts UI:
- Call `get_unlock_price()` → Should return `3000000000000` (3 DOT)
- Verify contract appears in block explorer: https://assethub-paseo.subscan.io/

---

## Part 2: Deploy Base Contracts

### Step 1: Configure Hardhat

```bash
cd contracts/base
npm install
```

Create `.env` file:
```env
PRIVATE_KEY=your_wallet_private_key
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key (optional, for verification)
```

### Step 2: Deploy DotGoPortfolio

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Expected Output**:
```
DotGoPortfolio deployed to: 0x...
Treasury: 0x...
Unlock Price: 0.001 ETH
```

### Step 3: Deploy DotGoCrossChain (with Hyperbridge)

Edit `scripts/deploy.js` to set `HYPERBRIDGE_ADDRESS`:

```javascript
const HYPERBRIDGE_ADDRESS = "0x..."; // Get from Hyperbridge docs
```

Run deployment:
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

### Step 4: Verify Contracts

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## Part 3: Configure Frontend

### Step 1: Update Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<POLKADOT_CONTRACT_ADDRESS>
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=<BASE_CONTRACT_ADDRESS>
NEXT_PUBLIC_BASE_CROSSCHAIN_ADDRESS=<CROSSCHAIN_CONTRACT_ADDRESS>
NEXT_PUBLIC_POLKADOT_NETWORK=paseo
```

### Step 2: Update Contract ABIs

Copy contract metadata to frontend:

```bash
# Polkadot contract metadata
cp contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.json \
   frontend/contracts/

# Base contract ABIs
cp contracts/base/artifacts/contracts/DotGoPortfolio.sol/DotGoPortfolio.json \
   frontend/contracts/base/
```

### Step 3: Build and Test

```bash
cd frontend
npm install
npm run build
npm run dev
```

Open http://localhost:3000 and test:
1. Connect Polkadot wallet (Paseo network)
2. Connect Base wallet (Base Sepolia)
3. Create a test project
4. Unlock and review

---

## Part 4: Hyperbridge Configuration

### Step 1: Register Contracts

Register both contracts with Hyperbridge for cross-chain messaging:

1. Visit [Hyperbridge Console](https://hyperbridge.network/)
2. Register Polkadot contract on Paseo
3. Register Base contract on Base Sepolia
4. Configure message routing

### Step 2: Test Cross-Chain Flow

1. Create project on Polkadot → Event emitted
2. Unlock on Base → Cross-chain message sent
3. Verify sync on both chains

---

## Part 5: Arkiv Indexing

### Step 1: Configure Indexer

Arkiv will index events from both chains for efficient querying.

Network details:
- **Arkiv RPC**: https://mendoza.hoodi.arkiv.network/rpc
- **WebSocket**: wss://mendoza.hoodi.arkiv.network/rpc/ws

### Step 2: Index Events

Events to index:
- `ProjectCreated`
- `ProjectUnlocked`
- `ReviewSubmitted`

---

## Deployment Checklist

### Polkadot Contract
- [ ] Contract built successfully
- [ ] Deployed to Paseo Asset Hub
- [ ] Contract address saved
- [ ] Test functions verified
- [ ] Explorer verification

### Base Contracts
- [ ] Hardhat configured
- [ ] DotGoPortfolio deployed
- [ ] DotGoCrossChain deployed (if using Hyperbridge)
- [ ] Contracts verified on BaseScan
- [ ] Test transactions successful

### Frontend
- [ ] Environment variables configured
- [ ] Contract ABIs copied
- [ ] Build successful
- [ ] Polkadot wallet connects
- [ ] Base wallet connects
- [ ] E2E flow tested

### Integration
- [ ] Hyperbridge configured (optional)
- [ ] Arkiv indexing setup (for sub0 HACK)
- [ ] Cross-chain messages working

---

## Network Information

### Paseo Asset Hub (Polkadot)
- **RPC**: wss://testnet-passet-hub.polkadot.io
- **Chain ID**: paseo-asset-hub
- **Faucet**: https://faucet.polkadot.io/
- **Explorer**: https://assethub-paseo.subscan.io/

### Base Sepolia (Base)
- **RPC**: https://sepolia.base.org
- **Chain ID**: 84532
- **Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **Explorer**: https://sepolia.basescan.org/

### Arkiv Mendoza (Indexing)
- **HTTP RPC**: https://mendoza.hoodi.arkiv.network/rpc
- **WebSocket**: wss://mendoza.hoodi.arkiv.network/rpc/ws
- **Network ID**: 60138453056

---

## Troubleshooting

### Polkadot Deployment Issues

**Error: "Insufficient balance"**
- Get test tokens from faucet
- Minimum required: ~5 DOT for deployment + gas

**Error: "RPC connection failed"**
- Try fallback RPC: `wss://passet-hub-paseo.ibp.network`
- Check network status

### Base Deployment Issues

**Error: "Nonce too high"**
```bash
npx hardhat clean
rm -rf cache artifacts
```

**Error: "Insufficient funds"**
- Get test ETH from Base Sepolia faucet
- Minimum required: ~0.01 ETH

### Frontend Issues

**Wallet won't connect**
- Check browser extension installed
- Verify correct network selected
- Clear browser cache

**RPC errors**
- Check `.env.local` configuration
- Verify network endpoints are correct
- Try alternative RPC endpoints

---

## Production Deployment Notes

For mainnet deployment:
1. Use Polkadot mainnet (not Paseo)
2. Use Base mainnet (not Sepolia)
3. Conduct security audit
4. Set up monitoring and alerts
5. Configure proper treasury addresses
6. Test with small amounts first

---

## Resources

- [Polkadot.js Apps](https://polkadot.js.org/apps/)
- [Contracts UI](https://ui.use.ink/)
- [Base Documentation](https://docs.base.org/)
- [Hyperbridge Docs](https://hyperbridge.network/)
- [Arkiv Developer Portal](https://arkiv.network/dev)
