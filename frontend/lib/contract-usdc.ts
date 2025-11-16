// DotGoUSDC contract addresses
export const DOTGO_USDC_BASE_SEPOLIA = "0x198F83e1743a2B61473545AFF40D51d658E6aF9D" as const;
export const DOTGO_USDC_SEPOLIA = "0xB625D88FB70D44C680410170B1b6BA0dc80721cf" as const;

// USDC token addresses
export const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;
export const USDC_SEPOLIA = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const;

// Pricing constants (6 decimals for USDC)
export const UNLOCK_PRICE_USDC = 30_000000; // $30 USDC
export const STUDENT_SHARE_USDC = 25_000000; // $25 USDC
export const PLATFORM_FEE_USDC = 5_000000; // $5 USDC

// ERC20 ABI (minimal for approve + transfer)
export const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// DotGoUSDC ABI
export const DOTGO_USDC_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "string", "name": "githubUrl", "type": "string" },
      { "internalType": "string", "name": "demoUrl", "type": "string" },
      { "internalType": "string", "name": "skills", "type": "string" }
    ],
    "name": "createProject",
    "outputs": [{ "internalType": "uint64", "name": "projectId", "type": "uint64" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint64", "name": "projectId", "type": "uint64" }],
    "name": "unlockProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint64", "name": "projectId", "type": "uint64" },
      { "internalType": "uint8", "name": "rating", "type": "uint8" },
      { "internalType": "string", "name": "comment", "type": "string" }
    ],
    "name": "submitReview",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint64", "name": "projectId", "type": "uint64" }],
    "name": "getProject",
    "outputs": [
      {
        "components": [
          { "internalType": "uint64", "name": "id", "type": "uint64" },
          { "internalType": "address", "name": "student", "type": "address" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "string", "name": "githubUrl", "type": "string" },
          { "internalType": "string", "name": "demoUrl", "type": "string" },
          { "internalType": "string", "name": "skills", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "totalUnlocks", "type": "uint256" },
          { "internalType": "uint256", "name": "totalEarnings", "type": "uint256" },
          { "internalType": "bool", "name": "exists", "type": "bool" }
        ],
        "internalType": "struct DotGoUSDC.Project",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint64", "name": "projectId", "type": "uint64" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "hasUserUnlocked",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "UNLOCK_PRICE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdc",
    "outputs": [{ "internalType": "contract IERC20", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint64", "name": "projectId", "type": "uint64" },
      { "indexed": true, "internalType": "address", "name": "student", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint64", "name": "projectId", "type": "uint64" },
      { "indexed": true, "internalType": "address", "name": "reviewer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ProjectUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint64", "name": "projectId", "type": "uint64" },
      { "indexed": true, "internalType": "address", "name": "reviewer", "type": "address" },
      { "indexed": false, "internalType": "uint8", "name": "rating", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "ReviewSubmitted",
    "type": "event"
  }
] as const;
