# DotGo Demo Video Script

**Duration:** 2-3 minutes
**Format:** Screen recording + voiceover
**Platform:** YouTube (unlisted for submission)

---

## Scene 1: Opening Hook (0:00 - 0:15)

**[SCREEN: DotGo homepage with hero section]**

**Voiceover:**
> "Imagine you're a self-taught developer. You've built amazing projects, but employers don't trust your portfolio. What if you could earn money from verified reviews that prove your skills are real?"

**[SCREEN: Highlight tagline "Where Young Talent Meets Opportunity"]**

> "This is DotGo - a cross-chain platform where students earn USDC from verified reviews."

---

## Scene 2: The Problem (0:15 - 0:30)

**[SCREEN: Show LinkedIn profile screenshot with question marks]**

**Voiceover:**
> "Today's students face a catch-22: you need experience to get experience. Portfolio projects lack credibility. And your reputation is fragmented across different blockchains."

**[SCREEN: Split screen showing GitHub on Ethereum, NFT badges on Base, attestations on Polygon]**

> "Your achievements are scattered across chains with no unified view. DotGo solves this."

---

## Scene 3: The Solution Overview (0:30 - 0:50)

**[SCREEN: Navigate to /portfolios page showing project cards]**

**Voiceover:**
> "Here's how it works: Students create portfolios showcasing their real projects. Anyone can see the preview - the title, description, skills, and student info."

**[SCREEN: Click on a portfolio card to go to /portfolios/1]**

> "But to see the full GitHub repo, live demo, and verified reviews, employers pay just 5 USDC."

**[SCREEN: Highlight unlock button and pricing breakdown: $4 student, $1 platform]**

> "Students receive 4 dollars instantly - no escrow, no delays. The platform keeps 1 dollar."

---

## Scene 4: Live Demo - Wallet Connection (0:50 - 1:10)

**[SCREEN: Click "Connect Wallet" button in navbar]**

**Voiceover:**
> "Let me show you the complete workflow. First, I'll connect my MetaMask wallet."

**[SCREEN: RainbowKit modal appears, select MetaMask]**

> "We're using RainbowKit for multi-chain wallet support."

**[SCREEN: Wallet connects, navbar shows address 0x123...abc]**

> "Connected. Now I can interact with the smart contracts on Base Sepolia."

**[SCREEN: Show Base Sepolia network indicator in MetaMask]**

---

## Scene 5: Live Demo - USDC Approval (1:10 - 1:30)

**[SCREEN: On /portfolios/1, click "Approve 5 USDC" button]**

**Voiceover:**
> "To unlock a project, we use a two-step ERC20 flow. First, I approve the contract to spend 5 USDC from my wallet."

**[SCREEN: MetaMask confirmation popup appears]**

> "This is the standard approve function - we're giving the DotGoUSDC contract permission to transfer USDC on our behalf."

**[SCREEN: Confirm transaction in MetaMask]**

**[SCREEN: Loading spinner while transaction confirms]**

> "Transaction confirmed on Base Sepolia."

**[SCREEN: Button changes to "Unlock Project for 5 USDC"]**

---

## Scene 6: Live Demo - Unlock Project (1:30 - 1:50)

**[SCREEN: Click "Unlock Project for 5 USDC" button]**

**Voiceover:**
> "Now I can unlock the project. This calls the unlockProject function, which transfers 4 USDC to the student and 1 USDC to the platform."

**[SCREEN: MetaMask confirmation popup for unlockProject]**

**[SCREEN: Confirm transaction]**

**[SCREEN: Loading state with "Unlocking project..."]**

> "The transaction is processing. Under the hood, the smart contract is transferring USDC using the ERC20 transferFrom function and marking this project as unlocked for my address."

**[SCREEN: Page refreshes, full project details appear]**

> "Success! I can now see the full GitHub repository URL, the live demo link, and all verified reviews."

**[SCREEN: Scroll to show GitHub link, demo link, reviews section]**

---

## Scene 7: Arkiv Integration (1:50 - 2:10)

**[SCREEN: Open new tab, show backend terminal with event logs]**

**Voiceover:**
> "Behind the scenes, this unlock event was instantly indexed to Arkiv Mendoza - a queryable blockchain database."

**[SCREEN: Show Arkiv SDK code snippet]**

> "Employers can now query portfolios using SQL-like syntax: 'Find React developers with 4-plus star ratings in the last 6 months.'"

**[SCREEN: Show example Arkiv query result]**

> "This takes less than 100 milliseconds - compared to hours scanning the blockchain directly. That's the power of Arkiv."

---

## Scene 8: Hyperbridge Integration (2:10 - 2:30)

**[SCREEN: Switch MetaMask network to Ethereum Sepolia]**

**Voiceover:**
> "Now let's talk cross-chain. DotGo uses Hyperbridge to sync reputation across chains."

**[SCREEN: Show Ethereum Sepolia contract on Etherscan]**

> "This unlock event was automatically synced from Base Sepolia to Ethereum Sepolia via Hyperbridge cross-chain messaging."

**[SCREEN: Show cross-chain reputation dashboard mockup/diagram]**

> "Students can aggregate achievements from multiple chains: portfolio reviews on Base, NFT badges on Ethereum, GitHub attestations anywhere."

**[SCREEN: Show Hyperbridge message verification]**

> "All messages are cryptographically verified - ensuring trust across chains."

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
