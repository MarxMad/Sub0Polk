# DotGo Quick Reference Card

**Deadline**: November 16, 2025 at 12:00 PM (Buenos Aires)
**Submission**: http://sl.sub0.gg/b8Qgr

---

## 🎯 Prize Tracks

| Track | Prize | Status | Requirements |
|-------|-------|--------|--------------|
| Polkadot Main | $16k | ✅ Ready | Working ink! contract + dApp |
| Arkiv | $10k | ⏳ Optional | Event indexing + queries |
| Hyperbridge | $5k | ⏳ Optional | Cross-chain messaging |

---

## ⚡ 30-Second Deploy

```bash
# 1. Get tokens: https://faucet.polkadot.io/
# 2. Deploy contract: https://ui.use.ink/
#    Upload: contracts/polkadot/dotgo_portfolio/target/ink/dotgo_portfolio.contract
# 3. Update .env.local with contract address
# 4. Test: npm run dev
# 5. Record demo video
# 6. Submit: http://sl.sub0.gg/b8Qgr
```

---

## 📁 File Locations

| What | Where |
|------|-------|
| Polkadot Contract (built) | `contracts/polkadot/dotgo_portfolio/target/ink/` |
| Base Contract (source) | `contracts/base/` |
| Frontend | `frontend/` |
| Arkiv Indexer | `frontend/lib/arkiv-indexer.ts` |
| Environment Template | `frontend/.env.local` |

---

## 🔑 Critical Configuration

### Frontend `.env.local`
```env
NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS=<FROM_DEPLOYMENT>
NEXT_PUBLIC_BASE_CONTRACT_ADDRESS=<FROM_DEPLOYMENT>
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<FROM_CLOUD.WALLETCONNECT.COM>
```

### Arkiv Mendoza
```
Network ID: 60138453056
RPC: https://mendoza.hoodi.arkiv.network/rpc
Bridge: 0xf2312FAc5042CfA142e51726C3E620431eA7b705
Explorer: https://explorer.mendoza.hoodi.arkiv.network/
```

### Paseo Asset Hub
```
RPC: wss://testnet-passet-hub.polkadot.io
Explorer: https://assethub-paseo.subscan.io/
Faucet: https://faucet.polkadot.io/
```

---

## 🚨 Critical Reminders

| ❌ Wrong | ✅ Right |
|---------|---------|
| Kaolin testnet | **Mendoza testnet** |
| `arkiv-sdk` | **`@arkiv-network/sdk`** |
| Auto-deploy without testing | **Test locally first** |
| Forget contract address | **Save immediately!** |

---

## 🎬 Demo Video Outline

1. **Intro** (30s): Hi, I'm [name], presenting DotGo
2. **Problem** (30s): Students need verifiable portfolios
3. **Demo** (2-3min):
   - Connect wallet
   - Create project
   - Pay to unlock
   - Submit review
   - Show Arkiv queries (if applicable)
4. **Tech** (30s): ink!, Arkiv, Next.js
5. **Close** (30s): Thank you, GitHub link

**Max Length**: 5 minutes
**Upload**: YouTube (unlisted)

---

## 🔗 Essential Links

| Resource | URL |
|----------|-----|
| Submission Form | http://sl.sub0.gg/b8Qgr |
| Paseo Faucet | https://faucet.polkadot.io/ |
| Contracts UI | https://ui.use.ink/ |
| Paseo Explorer | https://assethub-paseo.subscan.io/ |
| Mendoza Explorer | https://explorer.mendoza.hoodi.arkiv.network/ |
| WalletConnect | https://cloud.walletconnect.com/ |

---

## 🛠️ Quick Commands

```bash
# Build contract
cd contracts/polkadot/dotgo_portfolio && cargo contract build --release

# Install Arkiv SDK (CORRECT!)
cd frontend && npm install @arkiv-network/sdk

# Deploy to Mendoza
cd contracts/base && npx hardhat ignition deploy ./ignition/modules/DotGoPortfolio.js --network mendoza

# Frontend dev
cd frontend && npm run dev

# Frontend production
cd frontend && npm run build && npm run start
```

---

## 📋 Pre-Submission Checklist

- [ ] Polkadot contract deployed (save address!)
- [ ] Frontend `.env.local` updated
- [ ] Local testing complete
- [ ] Production build successful
- [ ] Demo video recorded (3-5 min)
- [ ] GitHub repo public
- [ ] All links tested
- [ ] Form completed: http://sl.sub0.gg/b8Qgr
- [ ] Submitted before 12:00 PM!

---

## ⏰ Time Budget

| Phase | Duration |
|-------|----------|
| Get tokens | 15 min |
| Deploy Polkadot | 30 min |
| Update frontend | 15 min |
| Test E2E | 45 min |
| Demo video | 1-2 hours |
| Submission | 30 min |
| **Buffer** | 1-2 hours |

---

## 💡 Pro Tips

- Save contract address immediately - can't recover!
- Test with small amounts first
- Keep explorer tab open during deployment
- Record demo in 1080p minimum
- Submit 30 minutes early (buffer)

---

## 📞 Emergency Contacts

**Arkiv Team** (Telegram):
- Dragan Milic - Test ETH
- Marcos - SDK help

**Resources**:
- [QUICKSTART_DEPLOYMENT.md](QUICKSTART_DEPLOYMENT.md) - Detailed guide
- [READY_TO_DEPLOY.md](READY_TO_DEPLOY.md) - Full deployment plan
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete checklist

---

**Good luck! 🚀**
