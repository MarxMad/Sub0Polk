/**
 * DotGo Arkiv Indexer Service
 *
 * Indexes blockchain events to Arkiv Mendoza for queryable data
 * Prize Track: Arkiv Main ($10k)
 */

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ExpirationTime, jsonToPayload } from '@arkiv-network/sdk/utils';
import dotenv from 'dotenv';

dotenv.config();

// Arkiv Mendoza Chain Configuration
const mendoza = {
  id: 60138453056,
  name: 'Arkiv Mendoza',
  network: 'mendoza',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
      webSocket: ['wss://mendoza.hoodi.arkiv.network/rpc/ws'],
    },
    public: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
      webSocket: ['wss://mendoza.hoodi.arkiv.network/rpc/ws'],
    },
  },
};

// Initialize Arkiv client
const privateKey = process.env.ARKIV_PRIVATE_KEY;
if (!privateKey) {
  console.error('❌ ARKIV_PRIVATE_KEY not set in .env file');
  process.exit(1);
}

const account = privateKeyToAccount(privateKey);
const client = createWalletClient({
  chain: mendoza,
  transport: http(),
  account: account,
});

console.log(`✅ Arkiv client initialized: ${client.account.address}`);

/**
 * Index ProjectCreated Event
 */
export async function indexProjectCreated(event) {
  const payload = {
    eventType: 'ProjectCreated',
    projectId: event.projectId,
    student: event.student,
    title: event.title,
    description: event.description,
    githubUrl: event.githubUrl,
    demoUrl: event.demoUrl,
    skills: event.skills,
    timestamp: event.timestamp || Date.now(),
    chain: event.chain,
    txHash: event.txHash,
    blockNumber: event.blockNumber,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [
        {
          payload: jsonToPayload(payload),
          contentType: 'application/json',
          attributes: [
            { key: 'eventType', value: 'ProjectCreated' },
            { key: 'projectId', value: event.projectId },
            { key: 'student', value: event.student },
            { key: 'chain', value: event.chain },
            { key: 'title', value: event.title },
            // Index each skill individually for better querying
            ...event.skills.map(skill => ({ key: 'skill', value: skill })),
            { key: 'timestamp', value: event.timestamp.toString() },
          ],
          expiresIn: ExpirationTime.fromDays(365), // 1 year
        },
      ],
    });

    console.log(`✅ ProjectCreated indexed: ${event.projectId} - "${event.title}"`);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectCreated:', error.message);
    throw error;
  }
}

/**
 * Index ProjectUnlocked Event
 */
export async function indexProjectUnlocked(event) {
  const payload = {
    eventType: 'ProjectUnlocked',
    projectId: event.projectId,
    reviewer: event.reviewer,
    student: event.student,
    amount: event.amount,
    timestamp: event.timestamp || Date.now(),
    chain: event.chain,
    txHash: event.txHash,
    blockNumber: event.blockNumber,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [
        {
          payload: jsonToPayload(payload),
          contentType: 'application/json',
          attributes: [
            { key: 'eventType', value: 'ProjectUnlocked' },
            { key: 'projectId', value: event.projectId },
            { key: 'reviewer', value: event.reviewer },
            { key: 'student', value: event.student },
            { key: 'chain', value: event.chain },
            { key: 'timestamp', value: event.timestamp.toString() },
          ],
          expiresIn: ExpirationTime.fromDays(90), // 90 days
        },
      ],
    });

    console.log(`✅ ProjectUnlocked indexed: ${event.projectId} by ${event.reviewer}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectUnlocked:', error.message);
    throw error;
  }
}

/**
 * Index ReviewSubmitted Event
 */
export async function indexReviewSubmitted(event) {
  const payload = {
    eventType: 'ReviewSubmitted',
    projectId: event.projectId,
    reviewer: event.reviewer,
    rating: event.rating,
    comment: event.comment,
    timestamp: event.timestamp || Date.now(),
    chain: event.chain,
    txHash: event.txHash,
    blockNumber: event.blockNumber,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [
        {
          payload: jsonToPayload(payload),
          contentType: 'application/json',
          attributes: [
            { key: 'eventType', value: 'ReviewSubmitted' },
            { key: 'projectId', value: event.projectId },
            { key: 'reviewer', value: event.reviewer },
            { key: 'rating', value: event.rating.toString() },
            { key: 'chain', value: event.chain },
            { key: 'timestamp', value: event.timestamp.toString() },
          ],
          expiresIn: ExpirationTime.fromDays(365), // 1 year
        },
      ],
    });

    console.log(`✅ ReviewSubmitted indexed: ${event.projectId} - Rating: ${event.rating}/5`);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ReviewSubmitted:', error.message);
    throw error;
  }
}

/**
 * Batch index multiple events (more efficient)
 */
export async function batchIndexEvents(events) {
  const creates = [];
  const now = Date.now();

  // Add ProjectCreated events
  if (events.projectsCreated) {
    events.projectsCreated.forEach(event => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ProjectCreated',
          ...event,
          indexedAt: now,
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectCreated' },
          { key: 'projectId', value: event.projectId },
          { key: 'student', value: event.student },
          { key: 'chain', value: event.chain },
          { key: 'title', value: event.title },
          ...event.skills.map(skill => ({ key: 'skill', value: skill })),
          { key: 'timestamp', value: event.timestamp.toString() },
        ],
        expiresIn: ExpirationTime.fromDays(365),
      });
    });
  }

  // Add ProjectUnlocked events
  if (events.projectsUnlocked) {
    events.projectsUnlocked.forEach(event => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ProjectUnlocked',
          ...event,
          indexedAt: now,
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectUnlocked' },
          { key: 'projectId', value: event.projectId },
          { key: 'reviewer', value: event.reviewer },
          { key: 'student', value: event.student },
          { key: 'chain', value: event.chain },
          { key: 'timestamp', value: event.timestamp.toString() },
        ],
        expiresIn: ExpirationTime.fromDays(90),
      });
    });
  }

  // Add ReviewSubmitted events
  if (events.reviewsSubmitted) {
    events.reviewsSubmitted.forEach(event => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ReviewSubmitted',
          ...event,
          indexedAt: now,
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ReviewSubmitted' },
          { key: 'projectId', value: event.projectId },
          { key: 'reviewer', value: event.reviewer },
          { key: 'rating', value: event.rating.toString() },
          { key: 'chain', value: event.chain },
          { key: 'timestamp', value: event.timestamp.toString() },
        ],
        expiresIn: ExpirationTime.fromDays(365),
      });
    });
  }

  if (creates.length === 0) {
    console.log('⚠️ No events to batch index');
    return null;
  }

  try {
    const result = await client.mutateEntities({ creates });
    console.log(`✅ Batch indexed ${creates.length} events`);
    return result;
  } catch (error) {
    console.error('❌ Batch indexing failed:', error.message);
    throw error;
  }
}
