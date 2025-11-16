const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const network = hre.network.name;
  console.log("Interacting with DotGo contracts on", network);

  // Load deployment data
  const deploymentPath = `./deployments/${network}.json`;
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found. Please deploy first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const portfolioAddress = deployment.contracts.DotGoPortfolio;

  console.log("Using DotGoPortfolio at:", portfolioAddress);

  // Get contract instance
  const DotGoPortfolio = await hre.ethers.getContractFactory("DotGoPortfolio");
  const portfolio = DotGoPortfolio.attach(portfolioAddress);

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting as:", signer.address);

  // Example interactions
  console.log("\n" + "=".repeat(60));
  console.log("CONTRACT INTERACTIONS");
  console.log("=".repeat(60));

  // 1. Get unlock price
  const unlockPrice = await portfolio.getUnlockPrice();
  console.log("\n1. Unlock Price:", hre.ethers.formatEther(unlockPrice), "ETH");

  // 2. Get total projects
  const totalProjects = await portfolio.getTotalProjects();
  console.log("2. Total Projects:", totalProjects.toString());

  // 3. Create a sample project
  console.log("\n3. Creating sample project...");
  const tx = await portfolio.createProject(
    "My Blockchain Portfolio",
    "A showcase of my blockchain development skills",
    "https://github.com/user/blockchain-portfolio",
    "https://demo.example.com",
    ["Solidity", "React", "Web3.js"]
  );
  await tx.wait();
  console.log("✅ Project created! TX:", tx.hash);

  // 4. Get student projects
  const studentProjects = await portfolio.getStudentProjects(signer.address);
  console.log("4. Your Projects:", studentProjects.toString());

  if (studentProjects.length > 0) {
    const projectId = studentProjects[0];
    const project = await portfolio.getProject(projectId);
    console.log("\nProject Details:");
    console.log("  ID:", project.id.toString());
    console.log("  Title:", project.title);
    console.log("  Student:", project.student);
    console.log("  Unlocks:", project.unlockCount.toString());
    console.log("  Rating:", project.avgRating.toString());
  }

  console.log("\n" + "=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
