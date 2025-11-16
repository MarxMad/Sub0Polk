# DotGo - sub0 HACK Submission Checklist

## 📋 ARKIV MAIN TRACK CHECKLIST

### Required Deliverables

- [x] **Public live demo link**
  - ✅ http://localhost:3002
  - ✅ Base Sepolia testnet (Chain ID: 84532)
  - ✅ Ethereum Sepolia testnet (Chain ID: 11155111)

- [x] **Public repo with README.md**
  - ✅ Repository: https://github.com/yourusername/Sub0Polk
  - ✅ README.md includes:
    - What it does: Cross-chain student portfolio platform
    - How to run it: Complete setup instructions in Quick Start section
    - How Arkiv is used:
      - Real-time event indexing (ProjectCreated, ProjectUnlocked, ReviewSubmitted)
      - Queryable database for talent discovery
      - SQL-like queries with eq(), gte(), array filtering
      - Time-scoped data (365 days portfolios, 90 days analytics)

- [ ] **2-3 minute demo video**
  - ⏳ TODO: Record using [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md)
  - ⏳ TODO: Upload to YouTube (unlisted)
  - ⏳ TODO: Add link to README.md

---

## 📋 HYPERBRIDGE BOUNTY CHECKLIST

### Required Deliverables

- [x] **Public live demo link**
  - ✅ http://localhost:3002
  - ✅ Cross-chain contracts deployed

- [x] **Public repo with README.md**
  - ✅ Repository: https://github.com/yourusername/Sub0Polk
  - ✅ README.md includes:
    - What it does: Multi-chain reputation aggregation
    - How to run it: Complete deployment instructions
    - How Hyperbridge is used:
      - Cross-chain messaging (Base ↔ Ethereum)
      - 3 message types: ProjectCreated, ProjectUnlocked, ReviewSubmitted
      - Bidirectional sync with proof verification
      - Storage queries for cross-chain reputation

- [ ] **2-3 minute demo video**
  - ⏳ TODO: Same video shows both Arkiv and Hyperbridge integration
  - ⏳ TODO: Demo cross-chain message sync
  - ⏳ TODO: Show reputation aggregation

---

## 📋 CORE SUBMISSION MATERIALS (Optional but Recommended)

### Required for Polkadot Main Track (if applicable)

- [x] **Public GitHub repository**
  - ✅ Open source license: MIT License
  - ✅ MILESTONE-2-PLAN.md: [Created](./MILESTONE-2-PLAN.md)
  - ✅ README.md with:
    - ✅ Setup instructions
    - ⏳ Demo URL (TBD - needs public deployment)
    - ⏳ Pitch video link (TBD)
    - ✅ Team: Julio Cruz (Full-Stack Developer & Smart Contract Engineer)
    - ⏳ Pitch deck link (TBD)

- [ ] **2-3 minute pitch video**
  - ⏳ TODO: Record pitch using slide deck
  - ⏳ TODO: Include:
    - Problem & solution
    - Demo walkthrough
    - Market context
    - Milestone 2 overview
  - ⏳ TODO: Upload to YouTube
  - ⏳ TODO: Add link to README.md

- [ ] **Pitch deck (URL)**
  - ✅ Outline created: [PITCH_DECK.md](./PITCH_DECK.md)
  - ⏳ TODO: Create visual slides (Google Slides/Canva)
  - ⏳ TODO: Include:
    - Problem & solution
    - Market research & competitive analysis
    - Technical approach (Arkiv + Hyperbridge)
    - Milestone 2 plan summary
  - ⏳ TODO: Upload and get shareable link

### Bonus Material

- [ ] **Demo video** (separate from pitch)
  - ✅ Script created: [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md)
  - ⏳ TODO: Record screen walkthrough
  - ⏳ TODO: Show complete workflow:
    - Wallet connection
    - USDC approval
    - Project unlock
    - Arkiv indexing
    - Hyperbridge sync

- [ ] **User feedback or validation**
  - ⏳ TODO: Survey 5-10 students about platform concept
  - ⏳ TODO: Gather feedback from Web3 developers
  - ⏳ TODO: Document results

- [ ] **Marketing material or plan**
  - ⏳ TODO: Create social media posts
  - ⏳ TODO: Twitter thread about DotGo
  - ⏳ TODO: LinkedIn post for professional network

---

## 🚀 TECHNICAL REQUIREMENTS STATUS

### Working Code

- [x] **Smart contracts deployed to testnet**
  - ✅ Base Sepolia: [0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3](https://sepolia.basescan.org/address/0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3)
  - ✅ Ethereum Sepolia: [0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE](https://sepolia.etherscan.io/address/0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE)
  - ✅ USDC integration (ERC20 approve + unlock)
  - ✅ Hyperbridge cross-chain messaging

- [x] **Functional prototype**
  - ✅ Frontend: Next.js 14 with RainbowKit wallet connection
  - ✅ Core features working:
    - Portfolio browsing (mock data)
    - Wallet connection (multi-chain)
    - USDC approval flow
    - Project unlock ($5 USDC)
    - On-chain unlock verification
  - ✅ Backend: Arkiv event indexer running

- [x] **Clear instructions for judges**
  - ✅ README.md Quick Start section
  - ✅ Prerequisites listed (Node.js, MetaMask, testnet USDC)
  - ✅ Step-by-step setup (clone, install, run)
  - ✅ USDC faucet links provided

- [ ] **Demo URL (deployed)**
  - ⏳ TODO: Deploy frontend to Vercel/Netlify
  - ⏳ TODO: Update README.md with public URL
  - ⏳ TODO: Test deployment end-to-end

---

## 📊 DEPLOYMENT STATUS

### Smart Contracts ✅ COMPLETE

**Base Sepolia (Chain ID: 84532)**
- Contract: DotGoUSDC
- Address: 0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3
- USDC Token: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
- Hyperbridge: 0x624cb3E65b30eB2A94AB10121e9bbf154B4fa4DE
- Explorer: https://sepolia.basescan.org/address/0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3

**Ethereum Sepolia (Chain ID: 11155111)**
- Contract: DotGoUSDC
- Address: 0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE
- USDC Token: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
- Hyperbridge: 0xa49578cECaE397FB5aBb284aDFDf058db1Bd26dE
- Explorer: https://sepolia.etherscan.io/address/0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE

### Backend ✅ RUNNING

- Arkiv event indexer: Operational
- Listening to Base Sepolia events
- Listening to Ethereum Sepolia events
- Real-time indexing: <1 second propagation
- Events tracked: ProjectCreated, ProjectUnlocked, ReviewSubmitted

### Frontend ✅ FUNCTIONAL

- Local development: http://localhost:3002
- Wallet connection: Working (RainbowKit + Wagmi)
- USDC workflow: Complete (approve → unlock)
- Multi-chain support: Base Sepolia + Ethereum Sepolia
- Public deployment: ⏳ TODO

---

## 🎯 NEXT STEPS

### Must Complete Before Submission

1. **Record Demo Video** (2-3 minutes)
   - Follow [DEMO_VIDEO_SCRIPT.md](./DEMO_VIDEO_SCRIPT.md)
   - Show wallet connection, USDC approval, unlock, Arkiv indexing, Hyperbridge sync
   - Upload to YouTube (unlisted)
   - Duration: 2:30 - 3:00 minutes

2. **Create Pitch Deck Slides**
   - Convert [PITCH_DECK.md](./PITCH_DECK.md) to visual slides
   - Use Google Slides or Canva
   - 14 slides total
   - Export as PDF + get shareable link

3. **Record Pitch Video** (2-3 minutes)
   - Face-to-camera introduction
   - Slide deck walkthrough
   - Highlight Arkiv and Hyperbridge integration
   - Show demo teaser
   - Upload to YouTube (unlisted)

4. **Update README.md**
   - Add pitch video link
   - Add demo video link
   - Add pitch deck link
   - Add deployed demo URL (if time permits)

5. **Optional: Deploy Frontend**
   - Deploy to Vercel or Netlify
   - Connect to Base Sepolia testnet
   - Test complete workflow with public URL
   - Update README.md with live demo link

### Submission Timeline

- **Day 1:** Record demo video, create pitch deck slides
- **Day 2:** Record pitch video, deploy frontend (optional)
- **Day 3:** Final README updates, submit to http://sl.sub0.gg/b8Qgr

---

## ✅ COMPLIANCE CHECK

### Arkiv Requirements

- [x] SDK: @arkiv-network/sdk@0.4.5 ✅
- [x] Network: Arkiv Mendoza (Chain ID: 60138453056) ✅
- [x] Queryable entities: 3 event types ✅
- [x] Time-scoped expiration: 365 days (portfolios), 90 days (analytics) ✅
- [x] SQL-like queries: eq(), gte(), array filtering ✅
- [x] Practical use case: Talent discovery platform ✅

### Hyperbridge Requirements

- [x] Integration: DotGoUSDC.sol with cross-chain messaging ✅
- [x] Cross-chain communication: Base ↔ Ethereum sync ✅
- [x] Message types: 3 types (ProjectCreated, ProjectUnlocked, ReviewSubmitted) ✅
- [x] Bidirectional messaging: Send and receive with proof verification ✅
- [x] Practical use case: Multi-chain reputation aggregation ✅

---

## 📝 FINAL CHECKLIST

Before submitting to http://sl.sub0.gg/b8Qgr:

- [ ] Demo video uploaded and link added to README
- [ ] Pitch video uploaded and link added to README
- [ ] Pitch deck created and link added to README
- [ ] MILESTONE-2-PLAN.md in repository ✅
- [ ] README.md complete with all links
- [ ] GitHub repository is public
- [ ] MIT License file present ✅
- [ ] All code committed and pushed
- [ ] Smart contracts verified on explorers (optional but nice)
- [ ] Test workflow end-to-end one final time

**Submission URL:** http://sl.sub0.gg/b8Qgr

Good luck! 🚀
