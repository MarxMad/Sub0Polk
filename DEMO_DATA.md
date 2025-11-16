# Demo Video - Example Portfolio Data

This file contains sample data to use when recording the demo video. Use this to quickly fill out forms and demonstrate the complete workflow.

---

## 📝 Portfolio 1: React E-Commerce Dashboard

### Basic Information
- **Title**: React E-Commerce Dashboard with Stripe Integration
- **Student Name**: Alex Rivera
- **Student Address**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC (your wallet address)
- **Skills**: React, TypeScript, Stripe API, TailwindCSS, Next.js

### Project Details
- **Description**:
```
Full-stack e-commerce dashboard built with Next.js 14 and React. Features real-time inventory management, Stripe payment integration, order tracking, and customer analytics. Implemented server-side rendering for SEO optimization and used TypeScript for type safety. Includes admin panel with role-based access control.
```

- **GitHub URL**: https://github.com/alexrivera/ecommerce-dashboard
- **Demo URL**: https://ecommerce-dashboard-demo.vercel.app
- **Category**: Full-Stack Development

### Key Features (for demo narration)
- Real-time inventory sync
- Stripe payment processing
- Admin dashboard with charts
- Mobile-responsive design
- 95% test coverage

---

## 📝 Portfolio 2: DeFi Yield Aggregator

### Basic Information
- **Title**: Multi-Chain DeFi Yield Aggregator
- **Student Name**: Sofia Chen
- **Student Address**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC (your wallet address)
- **Skills**: Solidity, ethers.js, React, Web3, Smart Contracts

### Project Details
- **Description**:
```
Decentralized finance application that aggregates yields across multiple DeFi protocols on Ethereum and Polygon. Smart contracts automatically rebalance funds to maximize APY. Built with Solidity 0.8.20, integrated with Aave, Compound, and Curve. Frontend uses React and ethers.js for wallet connection and transaction signing.
```

- **GitHub URL**: https://github.com/sofiachen/defi-yield-aggregator
- **Demo URL**: https://yield-aggregator-demo.netlify.app
- **Category**: Blockchain Development

### Key Features (for demo narration)
- Auto-rebalancing smart contracts
- Gas optimization (saves 30% on transactions)
- Multi-chain support (Ethereum + Polygon)
- Real-time APY tracking
- Audited by CertiK

---

## 📝 Portfolio 3: AI-Powered Code Review Bot

### Basic Information
- **Title**: AI Code Review Bot for GitHub Pull Requests
- **Student Name**: Marcus Johnson
- **Student Address**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC (your wallet address)
- **Skills**: Python, OpenAI API, GitHub API, FastAPI, Docker

### Project Details
- **Description**:
```
Automated code review bot powered by GPT-4 that analyzes pull requests for security vulnerabilities, code quality issues, and best practice violations. Integrates with GitHub webhooks to provide instant feedback. Built with Python FastAPI backend, uses OpenAI API for intelligent analysis, and deployed via Docker containers. Processes 500+ PRs daily.
```

- **GitHub URL**: https://github.com/mjohnson/ai-code-review-bot
- **Demo URL**: https://code-review-bot.onrender.com
- **Category**: AI/ML Development

### Key Features (for demo narration)
- GPT-4 powered analysis
- Security vulnerability detection
- GitHub API integration
- 500+ PRs analyzed daily
- 85% accuracy rate

---

## 🎬 Demo Video Workflow

### Part 1: Create Portfolio (2 minutes)

**Scene 1: Homepage** (10 seconds)
1. Open http://localhost:3002
2. Narrate: "Welcome to DotGo, the proof-of-work portfolio platform where students earn USDC"
3. Click "Create Portfolio" button

**Scene 2: Portfolio Form** (1 minute)
1. Fill out form with **Portfolio 1 data** (React E-Commerce Dashboard)
2. Narrate: "I'm creating a portfolio for a React e-commerce project with Stripe integration"
3. Show form fields being filled:
   - Title: "React E-Commerce Dashboard with Stripe Integration"
   - Description: Copy from above
   - GitHub: https://github.com/alexrivera/ecommerce-dashboard
   - Demo: https://ecommerce-dashboard-demo.vercel.app
   - Skills: React, TypeScript, Stripe API, TailwindCSS, Next.js
4. Click "Create Portfolio" button
5. Show MetaMask popup
6. Confirm transaction
7. Wait for confirmation
8. Show success message

**Scene 3: View Created Portfolio** (30 seconds)
1. Navigate to portfolio list
2. Show the newly created portfolio card
3. Narrate: "Here's my portfolio. Notice the preview shows title, skills, and description"
4. Point out: "Full details are locked behind $5 USDC payment"

---

### Part 2: Unlock Portfolio (2 minutes)

**Scene 1: Browse Portfolios** (20 seconds)
1. Go to http://localhost:3002/portfolios
2. Narrate: "As an employer, I can browse student portfolios"
3. Show portfolio cards with preview info
4. Click on **Portfolio 1** to view details

**Scene 2: USDC Approval (Step 1 of 2)** (40 seconds)
1. Show portfolio detail page
2. Narrate: "To unlock full project details, I need to pay $5 USDC using a 2-step flow"
3. Click "Approve 5 USDC" button
4. Show MetaMask popup:
   - Contract: DotGoUSDC
   - Amount: 5 USDC
5. Narrate: "Step 1: I approve the contract to spend 5 USDC from my wallet"
6. Confirm transaction
7. Wait for confirmation
8. Show button change to "Unlock Project for 5 USDC"

**Scene 3: Unlock Project (Step 2 of 2)** (1 minute)
1. Narrate: "Step 2: Now I unlock the project. The student gets $4, platform gets $1"
2. Click "Unlock Project for 5 USDC" button
3. Show MetaMask popup:
   - Function: unlockProject
   - Gas fee: ~$0.01
4. Confirm transaction
5. Wait for confirmation (show spinner)
6. Page auto-refreshes
7. Show unlocked content:
   - Full description visible
   - GitHub link clickable
   - Demo URL accessible
   - Contact information shown

**Scene 4: Transaction Verification** (20 seconds)
1. Open Basescan in new tab
2. Navigate to latest transaction
3. Show transaction details:
   - From: Your address
   - To: DotGoUSDC contract
   - Method: unlockProject
   - Status: Success ✅
4. Narrate: "Transaction confirmed on-chain. The unlock is permanent and verifiable"

---

### Part 3: Arkiv Integration (30 seconds)

**Scene 1: Event Indexing**
1. Switch to terminal/backend logs
2. Show backend console output:
   ```
   ✅ ProjectCreated event indexed to Arkiv
   ✅ ProjectUnlocked event indexed to Arkiv
   Portfolio ID: 1
   Unlocker: 0x742d35...
   Amount: 5000000 (5 USDC)
   ```
3. Narrate: "Arkiv indexes all events in real-time, making portfolios instantly queryable"

**Scene 2: Queryable Data**
1. Show Arkiv query example:
   ```typescript
   // Find React developers with unlocks
   const results = await query
     .where(eq('skill', 'React'))
     .where(gte('unlock_count', '1'))
     .fetch();
   ```
2. Narrate: "Employers can query: 'Find React developers with at least 1 unlock'"

---

### Part 4: Hyperbridge Integration (30 seconds)

**Scene 1: Cross-Chain Sync**
1. Show diagram or explain:
   - "Unlock happened on Base Sepolia"
   - "Hyperbridge syncs reputation to Ethereum Sepolia"
   - "Student's reputation is now visible across both chains"

**Scene 2: Multi-Chain Reputation**
1. Show conceptual dashboard:
   - Base Sepolia: 1 unlock, $4 earned
   - Ethereum Sepolia: Reputation synced via Hyperbridge
   - Total: Cross-chain verified reputation
2. Narrate: "With Hyperbridge, student reputation follows them across all networks"

---

## 🎯 Quick Copy-Paste Fields

### Portfolio Creation Form
```
Title: React E-Commerce Dashboard with Stripe Integration

Description: Full-stack e-commerce dashboard built with Next.js 14 and React. Features real-time inventory management, Stripe payment integration, order tracking, and customer analytics. Implemented server-side rendering for SEO optimization and used TypeScript for type safety. Includes admin panel with role-based access control.

GitHub: https://github.com/alexrivera/ecommerce-dashboard

Demo: https://ecommerce-dashboard-demo.vercel.app

Skills: React, TypeScript, Stripe API, TailwindCSS, Next.js
```

---

## 📊 Key Numbers to Mention

- **Unlock Price**: $5 USDC
- **Student Earns**: $4 USDC (80%)
- **Platform Fee**: $1 USDC (20%)
- **Transaction Time**: ~3-5 seconds on Base Sepolia
- **Gas Fee**: ~$0.01 (negligible on L2)
- **Arkiv Indexing**: <1 second propagation
- **Chains Supported**: Base Sepolia + Ethereum Sepolia
- **USDC Decimals**: 6 (5 USDC = 5,000,000)

---

## 🎬 Voiceover Script Snippets

**Opening**:
"Hi, I'm demonstrating DotGo, a proof-of-work portfolio platform where students earn USDC by showcasing real projects, and companies discover verified talent through on-chain reputation."

**Creating Portfolio**:
"First, I'll create a portfolio for a React e-commerce dashboard I built. I add the title, description, GitHub repo, live demo, and relevant skills."

**USDC Approval**:
"To unlock this project, I use a 2-step ERC20 flow. Step 1: Approve the contract to spend 5 USDC from my wallet."

**Unlocking**:
"Step 2: Unlock the project. This transfers $4 USDC to the student and $1 to the platform. The unlock is recorded on-chain."

**Arkiv**:
"Arkiv indexes all unlock events in real-time. This makes talent discovery instant—employers can query 'React developers with 4+ star ratings' in milliseconds."

**Hyperbridge**:
"Hyperbridge syncs reputation across chains. If you earn unlocks on Base, that reputation follows you to Ethereum, Polkadot, everywhere."

**Closing**:
"DotGo is live on Base Sepolia and Ethereum Sepolia, with Arkiv indexing and Hyperbridge cross-chain messaging. Check out the code on GitHub!"

---

## ✅ Pre-Recording Checklist

- [ ] MetaMask connected to Base Sepolia
- [ ] Wallet has testnet USDC (at least 10 USDC)
- [ ] Wallet has testnet ETH for gas (~0.01 ETH)
- [ ] Frontend running at http://localhost:3002
- [ ] Backend event indexer running (check terminal logs)
- [ ] Browser zoom at 100%
- [ ] Close unnecessary tabs/windows
- [ ] Clear browser console (F12)
- [ ] Screen recording software ready (OBS/QuickTime/Loom)
- [ ] Microphone tested
- [ ] Quiet recording environment

---

## 🎥 Recording Tips

1. **Screen Resolution**: 1920x1080 or 1280x720
2. **Recording Tool**: OBS Studio, Loom, or QuickTime
3. **Audio**: Clear microphone, no background noise
4. **Pace**: Speak slowly and clearly
5. **Rehearse**: Practice the workflow 2-3 times before recording
6. **Editing**: Use simple cuts to remove mistakes (iMovie, DaVinci Resolve)
7. **Length**: Aim for 2:30 - 2:50 (max 3:00)
8. **Upload**: YouTube unlisted, enable captions

---

Good luck with your demo video! 🚀
