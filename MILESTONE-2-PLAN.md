# MILESTONE 2 PLAN: DotGo

**Team:** DotGo
**Track:** [X] SHIP-A-TON [ ] IDEA-TON
**Date:** November 16, 2024

---

## 📍 WHERE WE ARE NOW

**What we built/validated this weekend:**
- DotGoUSDC smart contract deployed on Base Sepolia and Ethereum Sepolia with $5 USDC unlock mechanism
- Arkiv integration with real-time event indexing (ProjectCreated, ProjectUnlocked, ReviewSubmitted)
- Hyperbridge cross-chain messaging for multi-chain reputation sync
- Next.js frontend with RainbowKit wallet integration and 2-step USDC payment flow (approve → unlock)
- Backend event indexer listening to both Base Sepolia and Ethereum Sepolia

**What's working:**
- USDC payment workflow: Users can approve $5 USDC and unlock student portfolios ($4 to student, $1 to platform)
- Arkiv real-time indexing: Events propagate from blockchain to queryable database in <1 second
- Cross-chain messaging: Hyperbridge integration for Base ↔ Ethereum reputation sync
- Wallet connection: RainbowKit properly shows connected state and handles multi-chain switching
- On-chain verification: Smart contract correctly tracks unlock status and verified reviews

**What still needs work:**
- Student portfolio creation UI (currently mock data only)
- Review submission frontend integration
- Arkiv query dashboard for talent discovery
- Cross-chain reputation aggregation UI
- Demo video production showing full workflow

**Blockers or hurdles we hit:**
- USDC faucet rate limits slowed testing (resolved by using multiple test addresses)
- Wallet connection state not persisting on page navigation (fixed by adding on-chain unlock check)
- Need actual student portfolios with real GitHub repos and demos for production testing

---

## 🚀 WHAT WE'LL SHIP IN 30 DAYS

**Our MVP will do this:**
Students can create verified portfolios and earn USDC from reviewers who unlock their projects. Employers can discover talent through Arkiv queries like "Find React developers with 4+ star ratings in the last 6 months" and verify cross-chain credentials via Hyperbridge.

### Features We'll Build (5 max)

**Week 1-2: Student Portfolio Creation & Management**
- Feature: Complete portfolio creation form with GitHub API integration, demo URL validation, and skill tagging
- Why it matters: Students need an easy way to showcase their real projects with verified GitHub activity
- Who builds it: Frontend lead

**Week 2-3: Review Submission & Verification System**
- Feature: Review submission UI with on-chain verification, star rating, and comment storage
- Why it matters: Verified reviews are the core value proposition - can't be faked or edited
- Who builds it: Smart contract + Frontend lead

**Week 2-3: Arkiv Query Dashboard**
- Feature: Talent discovery interface with filters (skills, rating, date, unlocks) using Arkiv SDK
- Why it matters: Employers need fast, queryable access to find the right talent quickly
- Who builds it: Backend + Frontend lead

**Week 3-4: Cross-Chain Reputation Aggregator**
- Feature: Hyperbridge-powered dashboard showing NFT badges, GitHub attestations, and multi-chain reviews
- Why it matters: Students' reputations are fragmented across chains - need unified view
- Who builds it: Backend + Smart contract lead

**Week 4: Production Mainnet Deployment**
- Feature: Deploy to Base mainnet + Ethereum mainnet with real USDC, comprehensive testing, and monitoring
- Why it matters: Users need production-ready platform with real economic incentives
- Who builds it: DevOps + Smart contract lead

### Team Breakdown

**Julio Cruz - Full-Stack Developer & Smart Contract Engineer** | 30 hrs/week
- Owns: Smart contract development, deployment, Hyperbridge integration, backend event indexer

**Frontend Developer (TBD)** | 20 hrs/week
- Owns: React components, Arkiv query dashboard, wallet integration, UX/UI polish

**Product/Marketing (TBD)** | 10 hrs/week
- Owns: User acquisition, student onboarding, demo video production, social media

### Mentoring & Expertise We Need

**Areas where we need support:**
- Security audit for smart contracts before mainnet deployment (USDC handling, reentrancy, access control)
- UX/UI design for talent discovery interface and cross-chain reputation dashboard
- Marketing strategy for student acquisition and employer partnerships

**Specific expertise we're looking for:**
- Arkiv advanced query optimization: Complex filters, aggregations, and performance tuning
- Hyperbridge cross-chain state verification: Best practices for multi-chain data consistency
- Tokenomics/incentive design: Optimal pricing, referral rewards, and staking mechanisms

---

## 🎯 WHAT HAPPENS AFTER

**When M2 is done, we plan to...**
- Launch beta program with 50 students from coding bootcamps and universities
- Partner with 5-10 Web3 companies looking to hire junior developers
- Implement referral rewards: Students earn bonus USDC for bringing in other students
- Add NFT achievement badges for milestones (first unlock, 10 reviews, 5-star avg rating)

**And 6 months out we see our project achieve:**
- 500+ student portfolios with verified reviews and cross-chain credentials
- 50+ employers actively discovering talent through Arkiv queries
- $50K+ in total USDC earned by students through project unlocks
- Integration with GitHub, LinkedIn, and ENS for comprehensive identity verification
- Mobile app (React Native) for students to manage portfolios and track earnings on-the-go
