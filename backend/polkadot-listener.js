/**
 * DotGo Polkadot Event Listener
 *
 * Listens to Polkadot contract events and indexes them to Arkiv
 */

import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { indexProjectCreated, indexProjectUnlocked, indexReviewSubmitted } from './arkiv-indexer.js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS;
const RPC_URL = process.env.NEXT_PUBLIC_POLKADOT_RPC || 'wss://testnet-passet-hub.polkadot.io';

if (!CONTRACT_ADDRESS) {
  console.error('❌ NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS not set');
  process.exit(1);
}

// Load contract metadata
let contractMetadata;
try {
  contractMetadata = JSON.parse(
    readFileSync('../frontend/contracts/dotgo_portfolio.json', 'utf8')
  );
} catch (error) {
  console.error('❌ Failed to load contract metadata:', error.message);
  console.error('Make sure dotgo_portfolio.json exists in frontend/contracts/');
  process.exit(1);
}

/**
 * Start listening to Polkadot events
 */
async function startPolkadotListener() {
  console.log('🎧 Starting Polkadot event listener...');
  console.log(`   RPC: ${RPC_URL}`);
  console.log(`   Contract: ${CONTRACT_ADDRESS}`);

  const provider = new WsProvider(RPC_URL);
  const api = await ApiPromise.create({ provider });
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  console.log('✅ Connected to Polkadot');
  console.log(`   Chain: ${await api.rpc.system.chain()}`);
  console.log(`   Node: ${await api.rpc.system.name()}`);
  console.log(`   Version: ${await api.rpc.system.version()}`);

  // Subscribe to all system events
  const unsubscribe = await api.query.system.events((events) => {
    events.forEach(async (record) => {
      const { event, phase } = record;

      // Filter for contract events from our contract
      if (event.section === 'contracts' && event.method === 'ContractEmitted') {
        const [accountId, data] = event.data;

        if (accountId.toString() === CONTRACT_ADDRESS) {
          try {
            // Decode the contract event
            const decodedEvent = contract.abi.decodeEvent(data);
            const eventName = decodedEvent.event.identifier;
            const args = decodedEvent.args;

            console.log(`\n📡 Event detected: ${eventName}`);
            console.log(`   Block: ${record.hash?.toHex() || 'unknown'}`);
            console.log(`   Phase: ${phase.toString()}`);

            // Process event based on type
            if (eventName === 'ProjectCreated') {
              await indexProjectCreated({
                projectId: args.projectId?.toString() || '0',
                student: args.student?.toString() || '',
                title: args.title?.toString() || '',
                description: args.description?.toString() || '',
                githubUrl: args.githubUrl?.toString() || '',
                demoUrl: args.demoUrl?.toString() || '',
                skills: args.skills || [],
                timestamp: Date.now(),
                chain: 'polkadot',
                txHash: record.hash?.toHex() || '',
              });
            } else if (eventName === 'ProjectUnlocked') {
              await indexProjectUnlocked({
                projectId: args.projectId?.toString() || '0',
                reviewer: args.reviewer?.toString() || '',
                student: args.student?.toString() || '',
                amount: args.amount?.toString() || '0',
                timestamp: Date.now(),
                chain: 'polkadot',
                txHash: record.hash?.toHex() || '',
              });
            } else if (eventName === 'ReviewSubmitted') {
              await indexReviewSubmitted({
                projectId: args.projectId?.toString() || '0',
                reviewer: args.reviewer?.toString() || '',
                rating: parseInt(args.rating?.toString() || '0'),
                comment: args.comment?.toString() || '',
                timestamp: Date.now(),
                chain: 'polkadot',
                txHash: record.hash?.toHex() || '',
              });
            }
          } catch (error) {
            console.error('❌ Error processing event:', error.message);
          }
        }
      }
    });
  });

  console.log('\n✅ Listening for events... (Press Ctrl+C to stop)\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n⏹️ Shutting down...');
    unsubscribe();
    await api.disconnect();
    process.exit(0);
  });
}

// Start the listener
startPolkadotListener().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
