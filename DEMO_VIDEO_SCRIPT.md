# DotGo Demo Video Script

**Duration:** 2-3 minutes
**Format:** Screen recording + voiceover
**Platform:** YouTube (unlisted for submission)

---

## Scene 1: Introduction - What is DotGo? (0:00 - 0:20)

**[SCREEN: Open http://localhost:3000 - DotGo homepage with hero section]**

**Voiceover:**
> "Hi, I'm presenting DotGo - a proof-of-work portfolio platform where students and young developers earn USDC by showcasing real projects, and companies discover verified talent through on-chain reputation."

**[SCREEN: Highlight tagline "Where Young Talent Meets Opportunity"]**

> "Built for sub0 HACK Buenos Aires, DotGo solves a critical problem: 73% of developers say traditional credentials don't prove their real skills. Self-taught developers with amazing GitHub projects get dismissed for lack of degrees or experience."

**[SCREEN: Show tech stack badges: Next.js, Solidity, Arkiv, Hyperbridge]**

> "We're leveraging Polkadot ecosystem technologies - specifically Arkiv for queryable blockchain data and Hyperbridge for cross-chain reputation - to create something traditional platforms can't: truly portable, verifiable professional identity."

---

## Scene 2: How Polkadot Tech Makes the Difference (0:20 - 0:40)

**[SCREEN: Split screen showing traditional platforms vs DotGo]**

**Voiceover:**
> "Traditional platforms like LinkedIn have three problems: First, anyone can fake their skills. Second, your reputation is locked to one platform. Third, there's no way to monetize your work as a student."

**[SCREEN: Show Arkiv logo and blockchain event indexing diagram]**

> "Arkiv Mendoza - our first Polkadot technology - solves talent discovery. Instead of scanning millions of blockchain transactions taking hours, Arkiv indexes events into a queryable database. Employers find 'React developers with 4-star reviews' in under 100 milliseconds."

**[SCREEN: Show Hyperbridge logo and cross-chain message flow]**

> "Hyperbridge - our second Polkadot technology - enables cross-chain reputation. Your portfolio reviews on Base, NFT badges on Ethereum, GitHub attestations on Polygon, DAO contributions on Polkadot - all aggregated into one verifiable identity using cryptographic state proofs."

**[SCREEN: Show comparison: Traditional = Siloed, DotGo = Unified]**

> "For young professionals, this means your reputation follows you everywhere. No platform lock-in. No starting from zero when switching chains. True Web3 portability powered by Polkadot's cross-chain vision."

---

## Scene 3: The Solution Overview (0:55 - 1:10)

**[SCREEN: Navigate to /portfolios page showing project cards]**

**Voiceover:**
> "Here's how it works: Students create portfolios showcasing their real projects. Anyone can see the preview - the title, description, skills, and student info."

**[SCREEN: Click on a portfolio card to go to /portfolios/1]**

> "But to see the full GitHub repo, live demo, and verified reviews, employers pay just 5 USDC."

**[SCREEN: Highlight unlock button and pricing breakdown: $4 student, $1 platform]**

> "Students receive 4 dollars instantly - no escrow, no delays. The platform keeps 1 dollar."

---

## Scene 4: Live Demo - Wallet Connection (1:10 - 1:30)

**[SCREEN: Click "Connect Wallet" button in navbar]**

**Voiceover:**
> "Let me show you the complete workflow. First, I'll connect my MetaMask wallet."

**[SCREEN: RainbowKit modal appears, select MetaMask]**

> "We're using RainbowKit - an open-source library that provides a beautiful wallet connection UI. Under the hood, it's built on wagmi hooks and viem for type-safe Ethereum interactions."

**[SCREEN: Wallet connects, navbar shows address 0x123...abc]**

> "Connected to Base Sepolia - an Ethereum Layer 2 network with low gas fees. Our frontend uses wagmi's useAccount hook to track connection state and useWriteContract for transaction signing."

**[SCREEN: Show Base Sepolia network indicator in MetaMask, highlight Chain ID: 84532]**

---

## Scene 5: Live Demo - USDC Approval (1:30 - 1:50)

**[SCREEN: On /portfolios/1, click "Approve 5 USDC" button]**

**Voiceover:**
> "To unlock a project, we use the standard ERC20 two-step pattern. First, I approve the contract to spend 5 USDC from my wallet."

**[SCREEN: MetaMask confirmation popup appears]**

> "This calls USDC.approve() - giving our DotGoUSDC smart contract at address 0xe08...0aF3 permission to spend exactly 5 USDC. Notice USDC uses 6 decimals, not 18, so 5 dollars equals 5 million in the contract."

**[SCREEN: Confirm transaction in MetaMask, show gas fee]**

**[SCREEN: Loading spinner while transaction confirms]**

> "Transaction confirmed. Our frontend uses wagmi's useWaitForTransactionReceipt hook to wait for blockchain confirmation, then calls refetchAllowance to update the UI state."

**[SCREEN: Button changes to "Unlock Project for 5 USDC"]**

---

## Scene 6: Live Demo - Unlock Project (1:50 - 2:10)

**[SCREEN: Click "Unlock Project for 5 USDC" button]**

**Voiceover:**
> "Now I unlock the project. This calls our Solidity function unlockProject() which executes two USDC.transferFrom() calls - 4 million to the student, 1 million to the platform."

**[SCREEN: MetaMask confirmation popup for unlockProject]**

**[SCREEN: Confirm transaction, show function signature and gas estimate]**

**[SCREEN: Loading state with "Unlocking project..."]**

> "The smart contract verifies the allowance, executes the transfers, updates the unlocked mapping to mark this portfolio as unlocked for my address, and emits a ProjectUnlocked event."

**[SCREEN: Page refreshes, full project details appear]**

> "Success! The page auto-refreshes using window.location.reload() after transaction confirmation. Our useReadContract hook now fetches hasUnlocked equals true from the blockchain, revealing the full project details."

**[SCREEN: Scroll to show GitHub link, demo link, reviews section]**

---

## Scene 7: Arkiv Integration (2:10 - 2:30)

**[SCREEN: Open new tab, show backend terminal with event logs]**

**Voiceover:**
> "Behind the scenes, our Node.js backend is listening for events using ethers.js. The moment that ProjectUnlocked event was emitted, it was indexed to Arkiv Mendoza - chain ID 60138453056."

**[SCREEN: Show Arkiv SDK code snippet from backend/src/index.js]**

```typescript
const query = await arkiv
  .where(eq('skill', 'React'))
  .where(gte('rating', '4'))
  .fetch();
```

> "Arkiv transforms blockchain events into a queryable database. Employers can use SQL-like syntax: 'Find React developers with 4-plus star ratings.' We're using the official Arkiv SDK version 0.4.5 with eq, gte, and array filtering operators."

**[SCREEN: Show example query taking <100ms]**

> "This query completes in under 100 milliseconds - compared to hours scanning millions of blocks directly. Arkiv makes talent discovery instant."

---

## Scene 8: Hyperbridge Integration (2:30 - 2:50)

**[SCREEN: Switch MetaMask network to Ethereum Sepolia]**

**Voiceover:**
> "Now let's talk cross-chain reputation. DotGo uses Hyperbridge - a Polkadot ecosystem protocol for secure cross-chain messaging with cryptographic state proofs."

**[SCREEN: Show Ethereum Sepolia contract on Etherscan: 0xA45...48FE]**

> "When I unlocked that portfolio on Base Sepolia, our smart contract called Hyperbridge's dispatch function to sync the event to Ethereum Sepolia. The message includes portfolio ID, unlock count, and reviewer address."

**[SCREEN: Show cross-chain reputation dashboard mockup/diagram]**

> "Why does this matter? Students can now aggregate achievements across the entire Web3 ecosystem: portfolio reviews on Base, NFT badges on Ethereum, GitHub attestations on Polygon, DAO contributions on Polkadot."

**[SCREEN: Show Hyperbridge message verification with merkle proof]**

> "Hyperbridge verifies every message using consensus proofs and merkle trees - no trusted intermediaries, just cryptography. This is how Polkadot's cross-chain vision enables truly portable reputation for young professionals."

---

## Scene 9: Smart Contract Details (2:30 - 2:45)

**[SCREEN: Open Basescan at contract address 0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3]**

**Voiceover:**
> "Here's our deployed contract on Base Sepolia. You can verify every transaction - every unlock, every USDC transfer, every review."

**[SCREEN: Show recent transactions tab]**

> "Full transparency. Full verification. That's the DotGo difference."

---

## Scene 10: Closing & Impact (2:45 - 3:00)

**[SCREEN: Return to DotGo homepage]**

**Voiceover:**
> "DotGo empowers students to earn from their work while building verified reputations. Employers discover talent fast with Arkiv queries. And Hyperbridge connects achievements across the entire Web3 ecosystem."

**[SCREEN: Show key metrics overlay]**
- ✅ $5 USDC unlock ($4 student, $1 platform)
- ✅ Real-time Arkiv indexing (<1 second)
- ✅ Cross-chain Hyperbridge sync

**Voiceover:**
> "We built this in 72 hours at sub0 HACK Buenos Aires. Imagine what we can build in 30 days with Milestone 2."

**[SCREEN: Show GitHub repo, submission link]**

> "Check out the code on GitHub. Try the live demo. And help us bring verified opportunities to young developers worldwide."

**[SCREEN: DotGo logo + "Built with ❤️ on Base, Arkiv, and Hyperbridge"]**

> "Thank you."

---

## Production Notes

**Screen Recording Software:**
- OBS Studio (free, high quality)
- Loom (easy editing, direct upload)
- QuickTime (Mac native)

**Audio:**
- Use Audacity for voiceover recording
- Remove background noise
- Normalize audio levels

**Editing:**
- Add text overlays for key points
- Highlight cursor for important clicks
- Use zoom-in for contract addresses
- Add transitions between scenes (fade, cut)

**Upload:**
- YouTube: Unlisted link for submission
- Title: "DotGo - Cross-Chain Student Portfolio Platform | sub0 HACK 2024"
- Description: Include GitHub repo, contract addresses, tech stack
- Thumbnail: DotGo logo + "Arkiv + Hyperbridge"

**Timing:**
- Total: 2:30 - 3:00 minutes
- Speak clearly at moderate pace (120-140 words/minute)
- Leave 1-2 seconds between scene transitions
- Include 5 seconds of silence at start for intro animation

---

## Alternative: Pitch Video Script (Separate from Demo)

**Duration:** 2-3 minutes
**Focus:** Problem, solution, market, team, Milestone 2

**Structure:**
1. Hook: The student experience problem (0:00-0:20)
2. Market size and opportunity (0:20-0:40)
3. Solution and how it works (0:40-1:10)
4. Arkiv integration and value (1:10-1:30)
5. Hyperbridge cross-chain benefits (1:30-1:50)
6. What we built in 72 hours (1:50-2:10)
7. Milestone 2 plan and roadmap (2:10-2:40)
8. Team and ask (2:40-3:00)

**Delivery:**
- Face-to-camera introduction (0:00-0:15)
- Slide deck walkthrough (0:15-2:30)
- Live demo teaser (2:30-2:45)
- Closing call-to-action (2:45-3:00)
