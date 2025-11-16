const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log(`Deploying DotGoUSDC to ${network} with account:`, deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // USDC addresses on testnets
  const USDC_ADDRESSES = {
    baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
    sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
  };

  const usdcAddress = USDC_ADDRESSES[network];
  if (!usdcAddress) {
    throw new Error(`USDC address not configured for network: ${network}`);
  }

  console.log("Using USDC address:", usdcAddress);

  // Deploy MockHyperbridge first
  console.log("\nDeploying MockHyperbridge...");
  const MockHyperbridge = await hre.ethers.getContractFactory("MockHyperbridge");
  const mockHyperbridge = await MockHyperbridge.deploy();
  await mockHyperbridge.waitForDeployment();
  const mockHyperbridgeAddress = await mockHyperbridge.getAddress();
  console.log("MockHyperbridge deployed to:", mockHyperbridgeAddress);

  // Deploy DotGoUSDC
  console.log("\nDeploying DotGoUSDC...");
  const platformTreasury = deployer.address;

  // Destination chain ID (Base Sepolia <-> Ethereum Sepolia)
  const destinationChainId = network === "baseSepolia"
    ? hre.ethers.encodeBytes32String("eth-sepolia")
    : hre.ethers.encodeBytes32String("base-sepolia");

  const DotGoUSDC = await hre.ethers.getContractFactory("DotGoUSDC");
  const dotGoUSDC = await DotGoUSDC.deploy(
    usdcAddress,
    platformTreasury,
    mockHyperbridgeAddress,
    destinationChainId
  );
  await dotGoUSDC.waitForDeployment();
  const dotGoUSDCAddress = await dotGoUSDC.getAddress();
  console.log("DotGoUSDC deployed to:", dotGoUSDCAddress);

  console.log(`\n=== ${network} Deployment Summary ===`);
  console.log("USDC Token:", usdcAddress);
  console.log("MockHyperbridge:", mockHyperbridgeAddress);
  console.log("DotGoUSDC:", dotGoUSDCAddress);
  console.log("Platform Treasury:", platformTreasury);
  console.log("Unlock Price: $30 USDC");
  console.log("Student Share: $25 USDC");
  console.log("Platform Fee: $5 USDC");

  console.log("\n=== Next Steps ===");
  console.log("1. Get testnet USDC from faucet");
  console.log("2. Update frontend/lib/contract.ts with new address");
  console.log("3. Update backend/.env with new contract address");
  console.log("4. Test USDC approval + unlock flow");

  if (network === "baseSepolia") {
    console.log("\n=== Get Base Sepolia USDC ===");
    console.log("Faucet: https://faucet.circle.com/");
  } else if (network === "sepolia") {
    console.log("\n=== Get Sepolia USDC ===");
    console.log("Faucet: https://faucet.circle.com/");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
