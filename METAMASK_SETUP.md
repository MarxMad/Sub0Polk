# MetaMask Setup for Arkiv Mendoza Testnet

Complete guide to add Arkiv Mendoza testnet to MetaMask wallet.

---

## 🦊 Quick Add to MetaMask

**Easiest Method**: Click "Add Network to Wallet" on https://arkiv.network/dev

Or follow manual setup below:

---

## 📝 Manual Network Configuration

### Network Details

| Field | Value |
|-------|-------|
| **Network Name** | Arkiv Mendoza Testnet |
| **RPC URL** | https://mendoza.hoodi.arkiv.network/rpc |
| **Chain ID** | 60138453056 |
| **Currency Symbol** | ETH |
| **Block Explorer** | https://explorer.mendoza.hoodi.arkiv.network |

### Step-by-Step Setup

#### 1. Open MetaMask
- Click MetaMask extension icon
- Click network dropdown (top center)
- Click "Add Network"

#### 2. Add Network Manually
Click "Add a network manually" at the bottom

#### 3. Enter Network Details
```
Network Name:     Arkiv Mendoza Testnet
RPC URL:          https://mendoza.hoodi.arkiv.network/rpc
Chain ID:         60138453056
Currency Symbol:  ETH
Block Explorer:   https://explorer.mendoza.hoodi.arkiv.network
```

#### 4. Save & Switch
- Click "Save"
- MetaMask automatically switches to Mendoza
- You should see "Arkiv Mendoza Testnet" in network dropdown

---

## 💧 Get Test Tokens

### Official Faucet

**URL**: https://mendoza.hoodi.arkiv.network/faucet/

#### Steps:
1. Copy your MetaMask address
2. Visit faucet URL
3. Paste address
4. Request tokens
5. Wait ~30 seconds for confirmation

### Verify Balance

In MetaMask:
- Switch to Arkiv Mendoza network
- Your balance should show test ETH

---

## ✅ Verify Setup

### 1. Check Network
- MetaMask should show "Arkiv Mendoza Testnet"
- Chain ID: 60138453056

### 2. Check Balance
- Should have test ETH from faucet
- Example: 0.5 ETH (varies by faucet)

### 3. Test Transaction
Visit DotGo Arkiv demo: http://localhost:3000/arkiv-demo
- Click "Test Connection"
- Should connect to Mendoza
- Should show your address

---

## 🔗 Integration with DotGo

### Backend Integration

The DotGo backend uses the **same network** for indexing:

```javascript
// backend/arkiv-indexer.js
const mendoza = {
  id: 60138453056,
  name: 'Arkiv Mendoza',
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
    },
  },
};
```

### Frontend Integration

The DotGo frontend can query Mendoza directly:

```typescript
// frontend/lib/arkiv-client.ts
export const ARKIV_MENDOZA_CHAIN = {
  id: 60138453056,
  name: 'Arkiv Mendoza',
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
    },
  },
};
```

---

## 🛠️ Programmatic Setup

### Using wagmi (React)

```typescript
import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

const arkivMendoza = defineChain({
  id: 60138453056,
  name: 'Arkiv Mendoza',
  network: 'mendoza',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mendoza Explorer',
      url: 'https://explorer.mendoza.hoodi.arkiv.network',
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [arkivMendoza],
  transports: {
    [arkivMendoza.id]: http(),
  },
});
```

### Using ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  'https://mendoza.hoodi.arkiv.network/rpc',
  {
    chainId: 60138453056,
    name: 'mendoza',
  }
);

// Connect to MetaMask
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: '0xE00000000000',
    chainName: 'Arkiv Mendoza Testnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mendoza.hoodi.arkiv.network/rpc'],
    blockExplorerUrls: ['https://explorer.mendoza.hoodi.arkiv.network'],
  }],
});
```

---

## 🔍 Troubleshooting

### Network Not Appearing
- Clear MetaMask cache: Settings → Advanced → Reset Account
- Re-add network manually
- Refresh browser

### Can't Get Faucet Tokens
- Check you're on correct network
- Try different address
- Wait 24 hours between requests
- Ask in [Discord](https://discord.gg/arkiv)

### Transaction Fails
- Ensure sufficient balance for gas
- Check network is Mendoza (not mainnet)
- Verify contract addresses

### MetaMask Shows Wrong Chain ID
Chain ID `60138453056` displays as:
- Hex: `0xE00000000000`
- Decimal: 60138453056

Both are correct - just different formats.

---

## 📊 Network Information

### Technical Details

```json
{
  "chainId": 60138453056,
  "chainIdHex": "0xE00000000000",
  "networkName": "Arkiv Mendoza Testnet",
  "rpcUrl": "https://mendoza.hoodi.arkiv.network/rpc",
  "wsUrl": "wss://mendoza.hoodi.arkiv.network/rpc/ws",
  "explorerUrl": "https://explorer.mendoza.hoodi.arkiv.network",
  "faucetUrl": "https://mendoza.hoodi.arkiv.network/faucet/",
  "bridgeContract": "0x5E31A6803523ADC255f71A2Aef7E0Af43E985Bc8",
  "currency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  }
}
```

### Useful Links

- **Developer Portal**: https://arkiv.network/dev
- **Documentation**: https://arkiv.network/docs
- **Block Explorer**: https://explorer.mendoza.hoodi.arkiv.network
- **Faucet**: https://mendoza.hoodi.arkiv.network/faucet/
- **GitHub**: https://github.com/arkiv-network
- **Discord**: https://discord.gg/arkiv

---

## 🎯 For DotGo Demo

### Demo Flow

1. **Add Mendoza to MetaMask** (this guide)
2. **Get test ETH** from faucet
3. **Start backend** with ARKIV_PRIVATE_KEY
4. **Visit demo page** http://localhost:3000/arkiv-demo
5. **Test connection** - should show Mendoza
6. **Index events** - creates sample data
7. **Query data** - shows indexed results
8. **Watch live stats** - updates every 15s

### For Hackathon Judges

Show judges:
- MetaMask connected to Mendoza ✅
- Test ETH balance from faucet ✅
- Real-time event indexing ✅
- Cross-chain queries ✅
- Live analytics dashboard ✅

---

## 💡 Pro Tips

### Multiple Accounts
Create separate MetaMask accounts for:
- **Backend indexing** - needs test ETH for indexing
- **Frontend testing** - for querying (read-only)
- **Student testing** - simulate student creating projects
- **Reviewer testing** - simulate reviewers unlocking

### Save RPC for Backup
Alternative RPC endpoints (if needed):
- Primary: https://mendoza.hoodi.arkiv.network/rpc
- WebSocket: wss://mendoza.hoodi.arkiv.network/rpc/ws

### Monitor Transactions
Use block explorer to track:
- Entity creation transactions
- Query operations
- Contract interactions

**Explorer**: https://explorer.mendoza.hoodi.arkiv.network

---

## 📚 Additional Resources

### Tutorials
- [MetaMask Sketch App](https://arkiv.network/dev) - Interactive drawing demo
- [TypeScript Guide](https://arkiv.network/getting-started/typescript)
- [Python Guide](https://arkiv.network/getting-started/python)

### Documentation
- [Full Arkiv Docs](https://arkiv.network/docs)
- [SDK Reference](https://www.npmjs.com/package/@arkiv-network/sdk)
- [Code Playground](https://arkiv.network/playground)

### Community
- [Discord Server](https://discord.gg/arkiv)
- [GitHub](https://github.com/arkiv-network)
- [Blog & Tutorials](https://arkiv.network/blog)

---

**Last Updated**: November 16, 2024
**Network Status**: ✅ Active
**Faucet Status**: ✅ Available
