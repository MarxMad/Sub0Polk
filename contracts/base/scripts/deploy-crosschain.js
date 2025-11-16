const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Step 1: Deploy MockHyperbridge
  console.log("\n📡 Deploying MockHyperbridge...");
  const MockHyperbridge = await hre.ethers.getContractFactory("MockHyperbridge");
  const mockHyperbridge = await MockHyperbridge.deploy();
  await mockHyperbridge.waitForDeployment();
  const mockHyperbridgeAddress = await mockHyperbridge.getAddress();
  console.log("✅ MockHyperbridge deployed to:", mockHyperbridgeAddress);

  // Step 2: Deploy DotGoCrossChain with MockHyperbridge
  console.log("\n🌉 Deploying DotGoCrossChain...");

  const platformTreasury = deployer.address; // Use deployer as treasury for demo
  const ethereumSepoliaChainId = hre.ethers.encodeBytes32String("eth-sepolia"); // Ethereum Sepolia testnet

  const DotGoCrossChain = await hre.ethers.getContractFactory("DotGoCrossChain");
  const dotGoCrossChain = await DotGoCrossChain.deploy(
    platformTreasury,
    mockHyperbridgeAddress,
    ethereumSepoliaChainId
  );
  await dotGoCrossChain.waitForDeployment();
  const dotGoCrossChainAddress = await dotGoCrossChain.getAddress();
  console.log("✅ DotGoCrossChain deployed to:", dotGoCrossChainAddress);

  // Step 3: Verify configuration
  console.log("\n📊 Contract Configuration:");
  console.log("  Platform Treasury:", platformTreasury);
  console.log("  Hyperbridge Address:", mockHyperbridgeAddress);
  console.log("  Ethereum Sepolia Chain ID:", ethereumSepoliaChainId);
  console.log("  Cross-chain Enabled:", await dotGoCrossChain.crossChainEnabled());

  // Step 4: Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      MockHyperbridge: mockHyperbridgeAddress,
      DotGoCrossChain: dotGoCrossChainAddress,
    },
    configuration: {
      platformTreasury,
      ethereumSepoliaChainId,
      unlockPrice: "0.001",
      studentShare: "0.000833",
      platformShare: "0.000167"
    },
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  const path = require('path');

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, 'crosschain-deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment complete!");
  console.log("📄 Deployment info saved to: deployments/crosschain-deployment.json");

  console.log("\n🔗 Next steps:");
  console.log("1. Update frontend CONTRACT_ADDRESS to:", dotGoCrossChainAddress);
  console.log("2. Update backend contract address to:", dotGoCrossChainAddress);
  console.log("3. Test cross-chain functionality via UI");
  console.log("4. Verify contracts on BaseScan (optional)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
