// DotGoUSDC contract addresses ($5 USDC unlock)
export const CONTRACT_ADDRESS = "0xe08e46D72cCAB33F12D1643eA49D3Cb9CC8A0aF3" as const; // Base Sepolia
export const CONTRACT_ADDRESS_SEPOLIA = "0xA4591Df423177c7db07Ebb97C9e579eCb62C48FE" as const; // Ethereum Sepolia

// USDC token addresses
export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const; // Base Sepolia
export const USDC_ADDRESS_SEPOLIA = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const; // Ethereum Sepolia

// MockHyperbridge contract for cross-chain messaging
export const HYPERBRIDGE_ADDRESS = "0x624cb3E65b30eB2A94AB10121e9bbf154B4fa4DE" as const;

// Pricing (6 decimals for USDC)
export const UNLOCK_PRICE_USDC = 5_000000; // $5 USDC
export const STUDENT_SHARE_USDC = 4_000000; // $4 USDC
export const PLATFORM_FEE_USDC = 1_000000; // $1 USDC

export const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_platformTreasury",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AlreadyUnlocked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CannotReviewOwnProject",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientPayment",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPricing",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidRating",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotUnlocked",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ProjectNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newUnlockPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newStudentShare",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPlatformShare",
        "type": "uint256"
      }
    ],
    "name": "PricingUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "projectId",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "student",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "ProjectCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "projectId",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reviewer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountPaid",
        "type": "uint256"
      }
    ],
    "name": "ProjectUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "projectId",
        "type": "uint64"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "reviewer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      }
    ],
    "name": "ReviewSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_githubUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_demoUrl",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_skills",
        "type": "string[]"
      }
    ],
    "name": "createProject",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_projectId",
        "type": "uint64"
      }
    ],
    "name": "getProject",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint64",
            "name": "id",
            "type": "uint64"
          },
          {
            "internalType": "address",
            "name": "student",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "githubUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "demoUrl",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "skills",
            "type": "string[]"
          },
          {
            "internalType": "uint32",
            "name": "unlockCount",
            "type": "uint32"
          },
          {
            "internalType": "uint32",
            "name": "reviewCount",
            "type": "uint32"
          },
          {
            "internalType": "uint32",
            "name": "totalRating",
            "type": "uint32"
          },
          {
            "internalType": "uint64",
            "name": "createdAt",
            "type": "uint64"
          }
        ],
        "internalType": "struct DotGoPortfolio.Project",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_projectId",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "_reviewer",
        "type": "address"
      }
    ],
    "name": "hasUnlocked",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextProjectId",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformTreasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "studentShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_projectId",
        "type": "uint64"
      },
      {
        "internalType": "uint8",
        "name": "_rating",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_comment",
        "type": "string"
      }
    ],
    "name": "submitReview",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unlockPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_projectId",
        "type": "uint64"
      }
    ],
    "name": "unlockProject",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_unlockPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_studentShare",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_platformShare",
        "type": "uint256"
      }
    ],
    "name": "updatePricing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// ERC20 ABI for USDC approve/allowance
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
