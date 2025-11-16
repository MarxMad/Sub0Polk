# 🚀 DotGo - Next Steps for sub0 HACK Submission

**Deadline**: November 16, 2025 at 12:00 PM
**Time Remaining**: ~9 hours

---

## ✅ Completed

- [x] Smart contract implementation (Polkadot ink! + Base Solidity)
- [x] Frontend with Next.js and shadcn/ui
- [x] Dual-chain wallet integration (Polkadot + Base)
- [x] Build system and development environment
- [x] Contract testing (Polkadot: 2/2 passing, Base: 18/18 passing)

---

## 🎯 Critical Path (Next 6-8 hours)

### Phase 1: Contract Deployment (2-3 hours)

#### Option A: Quick Demo Setup (Recommended for time constraint)
**Deploy to testnets for working demo**

1. **Deploy Polkadot Contract to Paseo** (30 min)
   ```bash
   cd contracts/polkadot/dotgo_portfolio

   # Build
   cargo contract build --release

   # Deploy via Contracts UI
   # https://ui.use.ink/
   # Network: Paseo Asset Hub
   # RPC: wss://testnet-passet-hub.polkadot.io
   ```

   - Get test tokens: https://faucet.polkadot.io/
   - Treasury address: Your wallet address
   - Save contract address

2. **Deploy Base Contract to Base Sepolia** (30 min)
   ```bash
   cd contracts/base
   npm install

   # Create .env file
   echo "PRIVATE_KEY=your_private_key" > .env

   # Deploy
   npx hardhat run scripts/deploy.js --network baseSepolia
   ```

   - Get test ETH: https://www.alchemy.com/faucets/base-sepolia
   - Save both contract addresses (DotGoPortfolio + DotGoCrossChain)

3. **Update Frontend Configuration** (15 min)
   ```bash
   cd frontend
   cp .env.example .env.local

   # Edit .env.local with your deployed contract addresses
   NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<PASTE_ADDRESS>
   NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=<PASTE_ADDRESS>
   ```

4. **Test E2E Flow** (45 min)
   - Start frontend: `npm run dev`
   - Connect Polkadot wallet (Paseo network)
   - Connect Base wallet (Base Sepolia)
   - Create test project
   - Pay to unlock (from different wallet)
   - Submit review
   - Verify on explorers

#### Option B: Local Demo (Faster but less impressive)
**Run everything locally for quick testing**

1. **Start Local Substrate Node** (15 min)
   ```bash
   # Install substrate-contracts-node
   cargo install contracts-node

   # Run local node
   substrate-contracts-node --dev
   ```

2. **Deploy Polkadot Contract Locally** (15 min)
   ```bash
   cd contracts/polkadot/dotgo_portfolio
   cargo contract instantiate --url ws://127.0.0.1:9944 \
     --constructor new \
     --args <YOUR_ADDRESS> \
     --suri //Alice
   ```

3. **Run Hardhat Local Node** (10 min)
   ```bash
   cd contracts/base
   npx hardhat node
   # Deploy in new terminal
   npx hardhat ignition deploy ./ignition/modules/MyToken.js --network localhost
   ```

---

### Phase 2: Arkiv Integration (1-2 hours) [OPTIONAL - BONUS POINTS]

**Arkiv provides $10k prize pool for best indexing implementation**

1. **Setup Arkiv Indexer** (30 min)
   - Reference: https://github.com/Arkiv-Network/learn-arkiv/tree/main/tutorial-source-code/fullstack-tutorial
   - Network: Arkiv L2 (Network ID: 393530)
   - RPC: https://l2.hoodi.arkiv.network/rpc

2. **Index Contract Events** (30 min)
   Events to index:
   - `ProjectCreated`
   - `ProjectUnlocked`
   - `ReviewSubmitted`

3. **Create Query API** (30 min)
   - Setup GraphQL/REST endpoint
   - Query projects by student
   - Query unlock statistics
   - Query reviews

---

### Phase 3: Hyperbridge Integration (1-2 hours) [OPTIONAL - BONUS POINTS]

**Hyperbridge provides $5k prize pool for cross-chain messaging**

1. **Register Contracts** (30 min)
   - Visit https://hyperbridge.network/
   - Register Polkadot contract
   - Register Base contract

2. **Configure Cross-Chain Messages** (30 min)
   - Set up message routing
   - Configure relay fees
   - Test message passing

3. **Implement Sync Logic** (30 min)
   - Cross-chain project creation sync
   - Cross-chain unlock verification
   - Cross-chain review sync

---

### Phase 4: Demo & Documentation (2-3 hours)

1. **Create Demo Video** (60-90 min)
   - **Tool**: Loom or OBS Studio
   - **Length**: 3-5 minutes
   - **Content**:
     ```
     0:00-0:30  Introduction & Problem Statement
     0:30-1:00  Architecture Overview (show diagram)
     1:00-2:30  Live Demo:
                - Connect wallets (both chains)
                - Create student portfolio/project
                - Pay to unlock (show transaction)
                - Submit review
                - Show on both explorers
     2:30-3:00  Tech Stack Highlights
     3:00-3:30  Cross-chain integration (if implemented)
     3:30-4:00  Future roadmap & Q&A
     ```

2. **Update README.md** (30 min)
   Include:
   - Clear problem statement
   - Solution architecture
   - Tech stack (ink!, Solidity, Hyperbridge, Arkiv)
   - Live demo links
   - Setup instructions
   - Screenshots/GIFs

3. **Create Presentation Slides** (30 min)
   **Key Slides**:
   1. Title: DotGo - Cross-Chain Student Portfolios
   2. Problem: Students need verifiable portfolios, employers need trust
   3. Solution: Pay-to-unlock model with cross-chain support
   4. Architecture Diagram
   5. Smart Contracts (Polkadot + Base)
   6. Cross-Chain Integration (Hyperbridge)
   7. Event Indexing (Arkiv)
   8. Demo Screenshots
   9. Tech Stack
   10. Future Roadmap

4. **Prepare GitHub Repository** (15 min)
   - Clean up code comments
   - Add LICENSE file
   - Update all markdown documentation
   - Add deployment guide
   - Tag release version

---

### Phase 5: Submission (30 min)

Follow sub0 HACK checklist: https://hack.sub0.gg/Submission-Checklist-2a43e52aeb1580759a5dcf49136d8794

1. **Complete Submission Form**
   - Project name: DotGo
   - Category: Cross-chain applications
   - Tracks: Polkadot Main ($16k), Hyperbridge ($5k), Arkiv ($10k)

2. **Submit Required Materials**
   - GitHub repository URL
   - Demo video link (YouTube/Loom)
   - Presentation slides (PDF)
   - Live demo URL (Vercel/Netlify)
   - Contract addresses (both chains)

3. **Social Media** (Optional but recommended)
   - Tweet about submission with #sub0HACK
   - Tag @Polkadot, @Hyperbridge, @ArkivNetwork
   - Share demo video

---

## 📋 Quick Reference

### Network Endpoints

**Paseo Asset Hub (Polkadot)**
- RPC: `wss://testnet-passet-hub.polkadot.io`
- Faucet: https://faucet.polkadot.io/
- Explorer: https://assethub-paseo.subscan.io/

**Base Sepolia**
- RPC: `https://sepolia.base.org`
- Chain ID: 84532
- Faucet: https://www.alchemy.com/faucets/base-sepolia
- Explorer: https://sepolia.basescan.org/

**Arkiv L2**
- RPC: `https://l2.hoodi.arkiv.network/rpc`
- Network ID: 393530
- Faucet: Available on Arkiv portal

### Essential Commands

```bash
# Build Polkadot contract
cd contracts/polkadot/dotgo_portfolio && cargo contract build --release

# Test Polkadot contract
cargo test

# Build Base contracts
cd contracts/base && npm install && npx hardhat compile

# Test Base contracts
npx hardhat test

# Deploy Base contract
npx hardhat run scripts/deploy.js --network baseSepolia

# Run frontend
cd frontend && npm install && npm run dev
```

### Contract Addresses Template

Create `DEPLOYED_CONTRACTS.md`:
```markdown
# Deployed Contracts

## Paseo Asset Hub (Polkadot)
- DotGo Portfolio: `<PASTE_ADDRESS>`
- Explorer: `<PASTE_LINK>`

## Base Sepolia
- DotGo Portfolio: `<PASTE_ADDRESS>`
- DotGo CrossChain: `<PASTE_ADDRESS>`
- Explorer: `<PASTE_LINK>`
```

---

## 🎁 Prize Optimization Strategy

### Target Tracks

1. **Polkadot Main Track** ($16,000) - PRIMARY
   - ✅ ink! smart contract implemented
   - ✅ User-facing dApp
   - ✅ Solves real problem (student portfolios)
   - Focus: Clean implementation, good UX

2. **Arkiv Track** ($10,000) - SECONDARY
   - Requires: Event indexing implementation
   - Time needed: 1-2 hours
   - Value: High ROI if implemented

3. **Hyperbridge Track** ($5,000) - TERTIARY
   - Requires: Cross-chain messaging
   - Time needed: 1-2 hours
   - Value: Good for bonus points

### Recommended Approach

**With 9 hours remaining:**
- Hours 1-3: Deploy contracts + test E2E flow
- Hours 4-5: Create demo video + presentation
- Hours 6-7: Arkiv integration (BONUS)
- Hours 7-8: Documentation + polish
- Hour 9: Submission

**With 6 hours remaining:**
- Hours 1-2: Deploy contracts (testnet or local)
- Hours 3-4: Demo video + slides
- Hours 5: Documentation
- Hour 6: Submission

**With 3 hours remaining (MINIMUM VIABLE):**
- Hour 1: Local deployment + basic test
- Hour 2: Quick demo video (screen recording)
- Hour 3: Submit with README + code

---

## 🆘 Fallback Plan (If Behind Schedule)

### Minimum Viable Submission (2 hours)

1. **Skip Deployment** (30 min saved)
   - Demo smart contracts with screenshots
   - Show test results
   - Explain architecture

2. **Simple Demo Video** (30 min total)
   - Walk through codebase
   - Show contract tests passing
   - Explain implementation

3. **Focus on Documentation** (1 hour)
   - Clear README
   - Architecture diagram
   - Well-commented code

---

## 📞 Support Resources

- Polkadot Discord: https://dot.li/discord
- Substrate Stack Exchange: https://substrate.stackexchange.com/
- Arkiv Docs: https://arkiv.network/dev
- Hyperbridge Docs: https://hyperbridge.network/

---

## ✨ Success Criteria

**Minimum (Required for submission)**
- [ ] Smart contracts deployed OR well-documented
- [ ] Frontend built and accessible
- [ ] Demo video (even if screencast)
- [ ] README with clear explanation
- [ ] Submitted before deadline

**Good (Competitive for prizes)**
- [ ] Contracts deployed on testnets
- [ ] Working E2E demo
- [ ] Professional demo video
- [ ] Clean code and documentation
- [ ] Explorer verification

**Excellent (High chance of winning)**
- [ ] Fully functional cross-chain demo
- [ ] Arkiv indexing integrated
- [ ] Hyperbridge messaging working
- [ ] Polished UX
- [ ] Comprehensive documentation
- [ ] Social media presence

---

**Remember**: A working demo is worth more than perfect code. Focus on getting something functional deployed and demonstrated!

Good luck! 🚀
