# DotGo Portfolio - Polkadot Deployment Guide

## Prerequisites

- Browser wallet with Polkadot.js extension installed
- Test tokens from Polkadot faucet
- Contract artifacts built and ready

## Contract Artifacts

Located in: `target/ink/`

- **dotgo_portfolio.contract** - Upload this file (contains code + metadata)
- **dotgo_portfolio.wasm** - Contract code only
- **dotgo_portfolio.json** - Metadata/ABI only

## Deployment Steps

### Option 1: Using Polkadot.js Apps (Recommended for Testing)

#### Step 1: Access Contracts UI

1. Go to: https://polkadot.js.org/apps/
2. Select network:
   - **Contracts Parachain (Rococo)** for testnet
   - Or connect to custom endpoint for other networks

#### Step 2: Get Test Tokens

1. Visit: https://faucet.polkadot.io/
2. Select "Contracts on Rococo" or your testnet
3. Enter your wallet address
4. Request tokens

#### Step 3: Upload Contract Code

1. Navigate to **Developer → Contracts**
2. Click **Upload & Deploy Code**
3. Upload **dotgo_portfolio.contract** file
4. Review the contract metadata and click **Next**

#### Step 4: Deploy Contract Instance

1. **Constructor**: Select `new(platformTreasury: AccountId)`
2. **Platform Treasury Address**: Enter your wallet address or designated treasury
3. **Endowment**: Set initial balance (e.g., 1000 or leave as 0)
4. **Max Gas**: Leave as default or adjust (usually auto-calculated)
5. Click **Deploy** and sign transaction

#### Step 5: Verify Deployment

1. Find your contract in the contract list
2. Contract address will be displayed
3. Click contract to interact

### Option 2: Using Contracts UI (https://ui.use.ink/)

#### Step 1: Connect Wallet

1. Go to: https://ui.use.ink/
2. Click **Connect** and select Polkadot.js extension
3. Select network (Contracts on Rococo for testnet)

#### Step 2: Upload Contract

1. Click **Add New Contract**
2. Select **Upload New Contract Code**
3. Upload **dotgo_portfolio.contract**
4. Click **Next**

#### Step 3: Deploy

1. Select constructor: `new`
2. Enter **platformTreasury** address
3. Click **Deploy**
4. Sign transaction in wallet

#### Step 4: Interact

Once deployed:
- **Contract address** will be shown
- You can call functions under the **Execute** tab
- Read data under the **Call** tab

## Testing Deployment

### 1. Create a Project

**Function**: `createProject`
**Parameters**:
```
title: "My First Portfolio"
description: "A test project showcasing blockchain skills"
githubUrl: "https://github.com/user/project"
demoUrl: "https://demo.example.com"
skills: ["Rust", "ink!", "Substrate"]
```

### 2. Query Project

**Function**: `getProject`
**Parameters**:
```
projectId: 0
```

### 3. Get Student Projects

**Function**: `getStudentProjects`
**Parameters**:
```
student: <your_wallet_address>
```

### 4. Test Unlock (from different account)

**Function**: `unlockProject`
**Parameters**:
```
projectId: 0
```
**Value to send**: 3000000000000 (3 DOT in plancks)

### 5. Submit Review (after unlocking)

**Function**: `submitReview`
**Parameters**:
```
projectId: 0
rating: 5
comment: "Excellent work!"
```

### 6. Get Reviews

**Function**: `getReviews`
**Parameters**:
```
projectId: 0
```

## Network Endpoints

### Testnet (Contracts on Rococo)
- **RPC**: wss://rococo-contracts-rpc.polkadot.io
- **Explorer**: https://polkadot.js.org/apps/?rpc=wss://rococo-contracts-rpc.polkadot.io#/explorer
- **Faucet**: https://faucet.polkadot.io/

### Alternative Testnets

#### Shibuya (Astar Testnet)
- **RPC**: wss://shibuya-rpc.dwellir.com
- **Native Token**: SBY
- **Faucet**: https://portal.astar.network/shibuya-testnet/assets

#### Aleph Zero Testnet
- **RPC**: wss://ws.test.azero.dev
- **Native Token**: TZERO
- **Faucet**: https://faucet.test.azero.dev/

## Deployment via CLI (Advanced)

### Using cargo-contract

```bash
# Deploy to local node
cargo contract instantiate \
  --constructor new \
  --args <TREASURY_ADDRESS> \
  --suri //Alice \
  --skip-confirm

# Deploy to testnet
cargo contract instantiate \
  --url wss://rococo-contracts-rpc.polkadot.io \
  --constructor new \
  --args <TREASURY_ADDRESS> \
  --suri <YOUR_SEED_PHRASE> \
  --skip-confirm
```

### Using substrate-contracts-node (Local Development)

```bash
# Install local node
cargo install contracts-node --git https://github.com/paritytech/substrate-contracts-node.git

# Run local node
substrate-contracts-node --dev

# Deploy to local node (default endpoint: ws://127.0.0.1:9944)
cargo contract instantiate \
  --constructor new \
  --args <TREASURY_ADDRESS> \
  --suri //Alice
```

## Post-Deployment

### Save Important Information

After successful deployment, record:

```json
{
  "network": "Contracts on Rococo",
  "contractAddress": "<deployed_contract_address>",
  "codeHash": "<code_hash>",
  "deployer": "<your_wallet_address>",
  "platformTreasury": "<treasury_address>",
  "deploymentTx": "<transaction_hash>",
  "timestamp": "2025-11-16T..."
}
```

### Update Frontend Configuration

Add contract address to frontend `.env`:

```bash
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<deployed_contract_address>
NEXT_PUBLIC_POLKADOT_NETWORK=rococo-contracts
NEXT_PUBLIC_POLKADOT_RPC_URL=wss://rococo-contracts-rpc.polkadot.io
```

## Troubleshooting

### Common Errors

**"Execution reverted"**
- Check constructor parameters (treasury address must be valid)
- Ensure sufficient endowment if required

**"Out of gas"**
- Increase gas limit in deployment
- Check contract size (should be under 1MB)

**"Module not found"**
- Ensure correct network selection
- Verify contracts pallet is enabled on the chain

**"Insufficient balance"**
- Get test tokens from faucet
- Minimum balance required for deployment

### Getting Help

- **Polkadot Stack Exchange**: https://substrate.stackexchange.com/
- **ink! Discord**: https://discord.gg/wGUDt2p
- **Polkadot Support**: https://support.polkadot.network/

## Next Steps

1. ✅ Deploy contract to testnet
2. Test all functions (create, unlock, review)
3. Deploy Base contract to Base Sepolia
4. Configure Hyperbridge for cross-chain messaging
5. Connect frontend to both contracts
6. Set up Arkiv indexer for events
7. Prepare for mainnet deployment

---

**Contract Details**:
- **Name**: DotGo Portfolio
- **Version**: 0.1.0
- **Compiler**: ink! 5.1.1
- **Optimized Size**: 15.9 KB
- **Language**: Rust
