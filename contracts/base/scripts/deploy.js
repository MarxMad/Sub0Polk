const hre = require("hardhat");

async function main() {
  console.log("Deploying DotGo contracts to", hre.network.name);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy parameters
  const platformTreasury = process.env.PLATFORM_TREASURY || deployer.address;
  console.log("Platform treasury:", platformTreasury);

  // Deploy basic DotGoPortfolio contract
  console.log("\n1. Deploying DotGoPortfolio...");
  const DotGoPortfolio = await hre.ethers.getContractFactory("DotGoPortfolio");
  const portfolio = await DotGoPortfolio.deploy(platformTreasury);
  await portfolio.waitForDeployment();

  const portfolioAddress = await portfolio.getAddress();
  console.log("✅ DotGoPortfolio deployed to:", portfolioAddress);

  // Optional: Deploy cross-chain version if Hyperbridge is configured
  if (process.env.HYPERBRIDGE_HOST_ADDRESS) {
    console.log("\n2. Deploying DotGoCrossChain...");
    const hyperbridgeAddress = process.env.HYPERBRIDGE_HOST_ADDRESS;
    const polkadotChainId = process.env.POLKADOT_CHAIN_ID || hre.ethers.encodeBytes32String("polkadot");

    const DotGoCrossChain = await hre.ethers.getContractFactory("DotGoCrossChain");
    const crossChain = await DotGoCrossChain.deploy(
      platformTreasury,
      hyperbridgeAddress,
      polkadotChainId
    );
    await crossChain.waitForDeployment();

    const crossChainAddress = await crossChain.getAddress();
    console.log("✅ DotGoCrossChain deployed to:", crossChainAddress);

    // Display deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("Network:", hre.network.name);
    console.log("DotGoPortfolio:", portfolioAddress);
    console.log("DotGoCrossChain:", crossChainAddress);
    console.log("Platform Treasury:", platformTreasury);
    console.log("Hyperbridge:", hyperbridgeAddress);
    console.log("Polkadot Chain ID:", polkadotChainId);
    console.log("=".repeat(60));

    // Verification instructions
    console.log("\nTo verify contracts on Basescan:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${portfolioAddress} ${platformTreasury}`);
    console.log(`npx hardhat verify --network ${hre.network.name} ${crossChainAddress} ${platformTreasury} ${hyperbridgeAddress} ${polkadotChainId}`);
  } else {
    console.log("\n⚠️  Hyperbridge not configured, skipping DotGoCrossChain deployment");
    console.log("To deploy cross-chain contract, set HYPERBRIDGE_HOST_ADDRESS in .env");

    // Display basic deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("Network:", hre.network.name);
    console.log("DotGoPortfolio:", portfolioAddress);
    console.log("Platform Treasury:", platformTreasury);
    console.log("=".repeat(60));

    console.log("\nTo verify contract on Basescan:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${portfolioAddress} ${platformTreasury}`);
  }

  // Save deployment addresses
  const fs = require("fs");
  const deploymentData = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      DotGoPortfolio: portfolioAddress,
      ...(process.env.HYPERBRIDGE_HOST_ADDRESS && {
        DotGoCrossChain: await crossChain.getAddress(),
      }),
    },
    config: {
      platformTreasury,
      ...(process.env.HYPERBRIDGE_HOST_ADDRESS && {
        hyperbridge: process.env.HYPERBRIDGE_HOST_ADDRESS,
        polkadotChainId: process.env.POLKADOT_CHAIN_ID,
      }),
    },
  };

  const deploymentPath = `./deployments/${hre.network.name}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
  console.log(`\n💾 Deployment data saved to ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
