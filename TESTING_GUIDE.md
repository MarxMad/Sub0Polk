# DotGo - Complete Testing Guide

## 🧪 Full Workflow Testing

This guide walks you through testing the complete DotGo platform from wallet setup to unlocking a project and leaving a review.

---

## Prerequisites Checklist

Before testing, ensure you have:

- [ ] **MetaMask installed** (browser extension)
- [ ] **Base Sepolia network added** to MetaMask
- [ ] **Ethereum Sepolia network added** to MetaMask (optional, for cross-chain)
- [ ] **Testnet USDC** in your wallet (at least 10 USDC)
- [ ] **Frontend running** on http://localhost:3002
- [ ] **Backend indexer running** (Arkiv event listener)

---

## Step 1: Setup MetaMask with Base Sepolia

### Add Base Sepolia Network

1. Open MetaMask
2. Click network dropdown → "Add Network" → "Add a network manually"
3. Enter the following details:

```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Block Explorer: https://sepolia.basescan.org
```

4. Click "Save"
5. Switch to Base Sepolia network

### Get Testnet ETH (for gas fees)

1. Visit Base Sepolia faucet: https://www.alchemy.com/faucets/base-sepolia
2. Enter your wallet address
3. Request 0.5 ETH (enough for ~100 transactions)
4. Wait 1-2 minutes for ETH to arrive

**Verify:** Check your MetaMask balance shows ~0.5 ETH on Base Sepolia

---

## Step 2: Get Testnet USDC

### Circle USDC Faucet

1. Visit: https://faucet.circle.com/
2. Select **"Base Sepolia"** from network dropdown
3. Enter your wallet address
4. Complete CAPTCHA
5. Click "Request USDC"
6. Wait 1-2 minutes

**Expected Result:** 10 USDC appears in your wallet

### Verify USDC Balance in MetaMask

1. Click "Import tokens" in MetaMask
2. Enter USDC token address: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
3. Token symbol should auto-fill as "USDC"
4. Click "Add Custom Token"

**Verify:** You should see 10 USDC in your token list

---

## Step 3: Start the Application

### Terminal 1: Frontend

```bash
cd /Users/osx/Projects/JulioMCruz/Polkadot/Sub0Polk/frontend
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3002
  - Network:      http://192.168.x.x:3002

 ✓ Ready in 2.3s
```

### Terminal 2: Backend (Arkiv Indexer)

```bash
cd /Users/osx/Projects/JulioMCruz/Polkadot/Sub0Polk/backend
npm start
```

**Expected Output:**
```
🚀 DotGo Event Indexer Starting...
✅ Connected to Base Sepolia
✅ Connected to Ethereum Sepolia
🎯 Listening for events on contract 0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3
📊 Arkiv indexing enabled
```

**Keep both terminals running during testing**

---

## Step 4: Connect Wallet to DotGo

1. **Open browser:** http://localhost:3002

2. **Click "Connect Wallet"** button in top-right navbar

3. **RainbowKit modal appears:**
   - Select "MetaMask"
   - Approve connection in MetaMask popup

4. **Verify connection:**
   - Navbar shows your address: `0x123...abc`
   - Network indicator shows "Base Sepolia"

**Troubleshooting:**
- If wallet doesn't connect, refresh page and try again
- Make sure MetaMask is on Base Sepolia network
- Check browser console for errors (F12)

---

## Step 5: Browse Student Portfolios

1. **Navigate to Portfolios page:**
   - Click "Browse Portfolios" in navbar
   - Or go to: http://localhost:3002/portfolios

2. **You should see portfolio cards with:**
   - Student name and wallet address
   - Project title and preview description
   - Skills tags (React, TypeScript, Web3, etc.)
   - Star rating (mock data)
   - "View Details" button

3. **Click on any portfolio card** to view details

**Expected Result:** Navigate to `/portfolios/1` (or /2, /3)

---

## Step 6: View Project Preview (Locked State)

On the portfolio detail page (`/portfolios/1`), you should see:

### Preview Information (Always Visible)
- ✅ Project title: "DeFi Dashboard"
- ✅ Student info: Name, wallet address, rating
- ✅ Short description (preview)
- ✅ Skills tags
- ✅ Number of reviews

### Locked Content (Blurred/Hidden)
- 🔒 Full project description
- 🔒 GitHub repository URL
- 🔒 Live demo URL
- 🔒 Detailed reviews with comments

### Unlock Section
- 💰 Pricing breakdown:
  - To Student: $4 USDC
  - Platform Fee: $1 USDC
  - **Total: $5 USDC**

**Note:** You should see either:
- "Approve 5 USDC" button (if no allowance)
- "Unlock Project for 5 USDC" button (if already approved)

---

## Step 7: Approve USDC (Step 1 of 2)

### Click "Approve 5 USDC" Button

1. **MetaMask popup appears:**
   ```
   Allow DotGo to spend your USDC?
   Contract: 0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3
   Amount: 5 USDC
   ```

2. **Review transaction details:**
   - Spending cap: 5 USDC
   - Gas fee: ~$0.0001 (very cheap on Base Sepolia)

3. **Click "Confirm"** in MetaMask

4. **Wait for confirmation:**
   - Button shows loading spinner
   - Transaction processing on Base Sepolia
   - Takes 5-10 seconds

### Expected Result

✅ **Button changes to "Unlock Project for 5 USDC"**

**Verify on Basescan:**
1. Copy transaction hash from MetaMask
2. Visit: https://sepolia.basescan.org/tx/YOUR_TX_HASH
3. Should show successful `approve()` call to USDC contract

---

## Step 8: Unlock Project (Step 2 of 2)

### Click "Unlock Project for 5 USDC" Button

1. **MetaMask popup appears:**
   ```
   Unlock Project #1
   Contract: DotGoUSDC (0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3)
   Function: unlockProject(1)
   Gas fee: ~$0.0002
   ```

2. **Click "Confirm"** in MetaMask

3. **Wait for confirmation:**
   - Button shows "Unlocking project..."
   - Transaction processing
   - Takes 5-10 seconds

### Expected Result

✅ **Page refreshes and shows unlocked content:**
- Full project description visible
- GitHub repository link clickable
- Live demo URL clickable
- All reviews with full comments visible
- 🎉 Success message or unlocked badge

### Behind the Scenes

**What just happened:**
1. ✅ Smart contract transferred **4 USDC to student** wallet
2. ✅ Smart contract transferred **1 USDC to platform** wallet
3. ✅ Marked `unlocked[projectId][yourAddress] = true` on-chain
4. ✅ Emitted `ProjectUnlocked` event
5. ✅ Backend indexer caught event and sent to Arkiv database

---

## Step 9: Verify on Blockchain Explorers

### Check Transaction on Basescan

1. **Get transaction hash from MetaMask** (click on recent transaction)

2. **Open in Basescan:**
   ```
   https://sepolia.basescan.org/tx/YOUR_TX_HASH
   ```

3. **Verify transaction details:**
   - Status: Success ✅
   - From: Your wallet address
   - To: DotGoUSDC contract (0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3)
   - Function: `unlockProject(1)`

4. **Check "Logs" tab to see events:**
   - `ProjectUnlocked` event emitted
   - Parameters: `projectId=1`, `reviewer=yourAddress`, `student=studentAddress`

5. **Check USDC transfers in "Token Transfers" tab:**
   - Transfer 1: 4 USDC to student
   - Transfer 2: 1 USDC to platform

### Check Contract State

1. **Visit contract on Basescan:**
   ```
   https://sepolia.basescan.org/address/0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3
   ```

2. **Click "Read Contract" tab**

3. **Call `hasUnlocked` function:**
   - projectId: `1`
   - reviewer: `YOUR_WALLET_ADDRESS`
   - Result: `true` ✅

4. **Call `unlockCount` function:**
   - projectId: `1`
   - Result: Incremented by 1

---

## Step 10: Check Backend Indexer (Arkiv Integration)

### Terminal Output Verification

**Switch to Terminal 2** (backend) and look for:

```bash
📥 Event detected: ProjectUnlocked
   Project ID: 1
   Reviewer: 0x123...abc
   Student: 0x456...def
   Timestamp: 2024-11-16T20:30:45Z

📊 Indexing to Arkiv Mendoza...
✅ Event indexed successfully
   Transaction: 0xabc123...
   Block: 12345678
   Gas Used: 125000
```

### Arkiv Database Verification (Advanced)

**If you have Arkiv SDK configured:**

```javascript
// Query unlocks for this project
const unlocks = await arkivClient.query
  .where(eq('eventType', 'ProjectUnlocked'))
  .where(eq('projectId', '1'))
  .fetch();

console.log('Unlocks:', unlocks);
// Should show your unlock event with timestamp, reviewer, student
```

---

## Step 11: Submit a Review (Optional - Future Feature)

**Note:** Review submission UI is planned for Milestone 2. For now, you can test the smart contract directly.

### Using Basescan Write Contract

1. Visit: https://sepolia.basescan.org/address/0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3#writeContract

2. Click "Connect to Web3" → Connect MetaMask

3. Find `submitReview` function:
   ```
   projectId: 1
   rating: 5
   comment: "Excellent project! Clean code and great documentation."
   ```

4. Click "Write" → Confirm in MetaMask

5. **Expected Result:**
   - Transaction confirms
   - Review stored on-chain
   - `ReviewSubmitted` event emitted
   - Backend indexes to Arkiv

---

## Step 12: Test Cross-Chain Sync (Hyperbridge)

### Switch to Ethereum Sepolia

1. **Open MetaMask**
2. Switch network to "Ethereum Sepolia"
3. Add Ethereum Sepolia if not already added:
   ```
   Network Name: Ethereum Sepolia
   RPC URL: https://eth-sepolia.g.alchemy.com/v2/demo
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```

### Check Cross-Chain Message

1. **Visit Ethereum Sepolia contract:**
   ```
   https://sepolia.etherscan.io/address/0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE
   ```

2. **Check "Events" tab** for incoming Hyperbridge messages

3. **Verify cross-chain sync:**
   - Should see messages from Base Sepolia
   - Hyperbridge protocol relayed the unlock event

**Note:** Cross-chain sync may take 1-2 minutes depending on Hyperbridge validators

---

## Troubleshooting Common Issues

### Issue 1: Wallet Won't Connect

**Symptoms:** "Connect Wallet" button doesn't work

**Solutions:**
- Refresh page (F5)
- Clear browser cache
- Make sure MetaMask is unlocked
- Try different browser (Chrome, Brave, Firefox)
- Check browser console (F12) for errors

### Issue 2: "Approve" Transaction Fails

**Symptoms:** MetaMask shows error or transaction reverts

**Solutions:**
- Check you have enough USDC (need 5 USDC)
- Check you have enough ETH for gas (~0.001 ETH)
- Make sure you're on Base Sepolia network
- Try increasing gas limit in MetaMask advanced settings

### Issue 3: "Unlock" Transaction Fails

**Symptoms:** Transaction reverts with error

**Possible Causes:**
- ❌ USDC not approved yet (do Step 7 first)
- ❌ Insufficient USDC balance
- ❌ Already unlocked this project (check on-chain)
- ❌ Wrong network (must be Base Sepolia)

**Solutions:**
- Verify approval: Call `allowance()` on USDC contract
- Check USDC balance in MetaMask
- Verify `hasUnlocked()` returns `false` for your address

### Issue 4: Page Doesn't Show Unlocked Content

**Symptoms:** Clicked unlock but content still locked

**Solutions:**
- Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- Check transaction succeeded on Basescan
- Verify `hasUnlocked()` returns `true` on contract
- Check browser console for React errors

### Issue 5: Backend Not Indexing

**Symptoms:** No logs in Terminal 2

**Solutions:**
- Restart backend: `npm start`
- Check .env file has correct contract address
- Verify RPC endpoint is working
- Check you're on correct network (Base Sepolia)

---

## Testing Checklist

Use this to verify everything works:

- [ ] MetaMask installed and Base Sepolia added
- [ ] Got testnet ETH from faucet (~0.5 ETH)
- [ ] Got testnet USDC from Circle faucet (10 USDC)
- [ ] Frontend running on localhost:3002
- [ ] Backend indexer running and showing logs
- [ ] Wallet connected successfully
- [ ] Can browse portfolio list
- [ ] Can view portfolio detail page
- [ ] USDC approval transaction succeeded
- [ ] Unlock transaction succeeded and transferred USDC
- [ ] Page shows unlocked content after refresh
- [ ] Transaction visible on Basescan with correct logs
- [ ] Backend indexer caught event and logged it
- [ ] Can verify unlock status with `hasUnlocked()` call

---

## Demo Video Recording

When recording your demo video, follow this flow:

1. **Show homepage** (5 seconds)
2. **Connect wallet** (10 seconds)
3. **Browse portfolios** (10 seconds)
4. **View locked project** (15 seconds)
5. **Approve USDC** (20 seconds - show MetaMask)
6. **Unlock project** (20 seconds - show transaction)
7. **Show unlocked content** (15 seconds)
8. **Open Basescan** (20 seconds - verify transaction)
9. **Show backend logs** (15 seconds - Arkiv indexing)
10. **Show Ethereum Sepolia** (15 seconds - Hyperbridge sync)

**Total:** ~2:30 minutes

---

## Next Steps After Testing

Once you've verified everything works:

1. ✅ Test workflow is complete and verified
2. 📹 Record demo video using [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md)
3. 📊 Create pitch deck slides from [PITCH_DECK.md](./PITCH_DECK.md)
4. 🎥 Record pitch video
5. 📤 Upload videos to YouTube
6. 📝 Update README.md with video links
7. 🚀 Submit to http://sl.sub0.gg/b8Qgr

Good luck! 🚀
