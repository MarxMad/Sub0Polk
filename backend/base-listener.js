/**
 * DotGo Base Event Listener
 *
 * Listens to Base contract events and indexes them to Arkiv
 */

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { indexProjectCreated, indexProjectUnlocked, indexReviewSubmitted } from './arkiv-indexer.js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BASE_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  console.error('❌ NEXT_PUBLIC_BASE_CONTRACT_ADDRESS not set');
  process.exit(1);
}

// Load contract ABI
let contractABI;
try {
  const abiPath = '../contracts/base/artifacts/contracts/DotGoPortfolio.sol/DotGoPortfolio.json';
  const abiData = JSON.parse(readFileSync(abiPath, 'utf8'));
  contractABI = abiData.abi;
} catch (error) {
  console.error('❌ Failed to load contract ABI:', error.message);
  console.error('Make sure Base contracts are compiled');
  process.exit(1);
}

// Create public client
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

console.log('🎧 Starting Base event listener...');
console.log(`   Chain: ${baseSepolia.name}`);
console.log(`   Contract: ${CONTRACT_ADDRESS}`);
console.log('\n✅ Listening for events... (Press Ctrl+C to stop)\n');

/**
 * Watch ProjectCreated events
 */
client.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: contractABI,
  eventName: 'ProjectCreated',
  onLogs: async (logs) => {
    for (const log of logs) {
      try {
        console.log('\n📡 ProjectCreated event detected');
        console.log(`   Block: ${log.blockNumber}`);
        console.log(`   Tx: ${log.transactionHash}`);

        await indexProjectCreated({
          projectId: log.args.projectId?.toString() || '0',
          student: log.args.student || '',
          title: log.args.title || '',
          description: log.args.description || '',
          githubUrl: log.args.githubUrl || '',
          demoUrl: log.args.demoUrl || '',
          skills: log.args.skills || [],
          timestamp: Date.now(),
          chain: 'base',
          txHash: log.transactionHash,
          blockNumber: Number(log.blockNumber),
        });
      } catch (error) {
        console.error('❌ Error indexing ProjectCreated:', error.message);
      }
    }
  },
  onError: (error) => {
    console.error('❌ Error watching ProjectCreated:', error.message);
  },
});

/**
 * Watch ProjectUnlocked events
 */
client.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: contractABI,
  eventName: 'ProjectUnlocked',
  onLogs: async (logs) => {
    for (const log of logs) {
      try {
        console.log('\n📡 ProjectUnlocked event detected');
        console.log(`   Block: ${log.blockNumber}`);
        console.log(`   Tx: ${log.transactionHash}`);

        await indexProjectUnlocked({
          projectId: log.args.projectId?.toString() || '0',
          reviewer: log.args.reviewer || '',
          student: log.args.student || '',
          amount: log.args.amount?.toString() || '0',
          timestamp: Date.now(),
          chain: 'base',
          txHash: log.transactionHash,
          blockNumber: Number(log.blockNumber),
        });
      } catch (error) {
        console.error('❌ Error indexing ProjectUnlocked:', error.message);
      }
    }
  },
  onError: (error) => {
    console.error('❌ Error watching ProjectUnlocked:', error.message);
  },
});

/**
 * Watch ReviewSubmitted events
 */
client.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: contractABI,
  eventName: 'ReviewSubmitted',
  onLogs: async (logs) => {
    for (const log of logs) {
      try {
        console.log('\n📡 ReviewSubmitted event detected');
        console.log(`   Block: ${log.blockNumber}`);
        console.log(`   Tx: ${log.transactionHash}`);

        await indexReviewSubmitted({
          projectId: log.args.projectId?.toString() || '0',
          reviewer: log.args.reviewer || '',
          rating: Number(log.args.rating) || 0,
          comment: log.args.comment || '',
          timestamp: Date.now(),
          chain: 'base',
          txHash: log.transactionHash,
          blockNumber: Number(log.blockNumber),
        });
      } catch (error) {
        console.error('❌ Error indexing ReviewSubmitted:', error.message);
      }
    }
  },
  onError: (error) => {
    console.error('❌ Error watching ReviewSubmitted:', error.message);
  },
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down Base listener...');
  process.exit(0);
});
