const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts to Ethereum Sepolia with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy MockHyperbridge first
  console.log("\nDeploying MockHyperbridge...");
  const MockHyperbridge = await hre.ethers.getContractFactory("MockHyperbridge");
  const mockHyperbridge = await MockHyperbridge.deploy();
  await mockHyperbridge.waitForDeployment();
  const mockHyperbridgeAddress = await mockHyperbridge.getAddress();
  console.log("MockHyperbridge deployed to:", mockHyperbridgeAddress);

  // Deploy DotGoCrossChain with MockHyperbridge
  console.log("\nDeploying DotGoCrossChain...");
  const platformTreasury = deployer.address;

  // Base Sepolia chain ID (for cross-chain messaging)
  const baseSepoliaChainId = hre.ethers.encodeBytes32String("base-sepolia");

  const DotGoCrossChain = await hre.ethers.getContractFactory("DotGoCrossChain");
  const dotGoCrossChain = await DotGoCrossChain.deploy(
    platformTreasury,
    mockHyperbridgeAddress,
    baseSepoliaChainId
  );
  await dotGoCrossChain.waitForDeployment();
  const dotGoCrossChainAddress = await dotGoCrossChain.getAddress();
  console.log("DotGoCrossChain deployed to:", dotGoCrossChainAddress);

  console.log("\n=== Ethereum Sepolia Deployment Summary ===");
  console.log("MockHyperbridge:", mockHyperbridgeAddress);
  console.log("DotGoCrossChain:", dotGoCrossChainAddress);
  console.log("Platform Treasury:", platformTreasury);
  console.log("\n=== Next Steps ===");
  console.log("1. Update backend/.env with ETHEREUM_SEPOLIA_CONTRACT=" + dotGoCrossChainAddress);
  console.log("2. Update frontend wagmi config to include Ethereum Sepolia");
  console.log("3. Enable cross-chain messaging between Base Sepolia ↔ Ethereum Sepolia");
  console.log("\nVerify contracts on Etherscan:");
  console.log("npx hardhat verify --network sepolia", mockHyperbridgeAddress);
  console.log("npx hardhat verify --network sepolia", dotGoCrossChainAddress, platformTreasury, mockHyperbridgeAddress, baseSepoliaChainId);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
