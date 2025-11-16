/**
 * Arkiv Event Indexing for DotGo Platform
 *
 * Indexes blockchain events from Polkadot and Base contracts
 * for queryable analytics and time-scoped data retrieval.
 *
 * Prize Track: Arkiv Network ($10k)
 */

import { Arkiv, ExpirationTime, jsonToPayload, eq } from '@arkiv-network/sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Types for DotGo events
export interface ProjectCreatedEvent {
  projectId: string;
  student: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  skills: string[];
  createdAt: number;
  chain: 'polkadot' | 'base';
  txHash: string;
  blockNumber?: number;
}

export interface ProjectUnlockedEvent {
  projectId: string;
  reviewer: string;
  student: string;
  amount: string;
  timestamp: number;
  chain: 'polkadot' | 'base';
  txHash: string;
  blockNumber?: number;
}

export interface ReviewSubmittedEvent {
  projectId: string;
  reviewer: string;
  rating: number;
  comment: string;
  timestamp: number;
  chain: 'polkadot' | 'base';
  txHash: string;
  blockNumber?: number;
}

/**
 * Initialize Arkiv Client
 */
export async function createArkivClient() {
  if (!process.env.ARKIV_PRIVATE_KEY) {
    throw new Error('ARKIV_PRIVATE_KEY not configured');
  }

  // Create wallet from private key
  const account = privateKeyToAccount(process.env.ARKIV_PRIVATE_KEY as `0x${string}`);

  const walletClient = createWalletClient({
    account,
    chain: {
      id: 60138453056, // Arkiv Mendoza Network ID
      name: 'Arkiv Mendoza',
      network: 'mendoza',
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://mendoza.hoodi.arkiv.network/rpc'] },
        public: { http: ['https://mendoza.hoodi.arkiv.network/rpc'] },
      },
    },
    transport: http('https://mendoza.hoodi.arkiv.network/rpc'),
  });

  // Initialize Arkiv client
  const arkivClient = new Arkiv({ walletClient });

  return arkivClient;
}

/**
 * Index ProjectCreated Event
 */
export async function indexProjectCreated(event: ProjectCreatedEvent) {
  const client = await createArkivClient();

  const payload = {
    eventType: 'ProjectCreated',
    projectId: event.projectId,
    student: event.student,
    title: event.title,
    description: event.description,
    githubUrl: event.githubUrl,
    demoUrl: event.demoUrl,
    skills: event.skills,
    createdAt: event.createdAt,
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
            { key: 'createdAt', value: event.createdAt.toString() },
          ],
          // Keep project data for 1 year
          expiresIn: ExpirationTime.fromDays(365),
        },
      ],
    });

    console.log('✅ ProjectCreated indexed:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectCreated:', error);
    throw error;
  }
}

/**
 * Index ProjectUnlocked Event
 */
export async function indexProjectUnlocked(event: ProjectUnlockedEvent) {
  const client = await createArkivClient();

  const payload = {
    eventType: 'ProjectUnlocked',
    projectId: event.projectId,
    reviewer: event.reviewer,
    student: event.student,
    amount: event.amount,
    timestamp: event.timestamp,
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
          // Keep unlock history for 90 days
          expiresIn: ExpirationTime.fromDays(90),
        },
      ],
    });

    console.log('✅ ProjectUnlocked indexed:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectUnlocked:', error);
    throw error;
  }
}

/**
 * Index ReviewSubmitted Event
 */
export async function indexReviewSubmitted(event: ReviewSubmittedEvent) {
  const client = await createArkivClient();

  const payload = {
    eventType: 'ReviewSubmitted',
    projectId: event.projectId,
    reviewer: event.reviewer,
    rating: event.rating,
    comment: event.comment,
    timestamp: event.timestamp,
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
          // Keep reviews for 1 year
          expiresIn: ExpirationTime.fromDays(365),
        },
      ],
    });

    console.log('✅ ReviewSubmitted indexed:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to index ReviewSubmitted:', error);
    throw error;
  }
}

/**
 * Batch Index Multiple Events
 *
 * Efficient for indexing multiple events in a single transaction
 */
export async function batchIndexEvents(events: {
  projectsCreated?: ProjectCreatedEvent[];
  projectsUnlocked?: ProjectUnlockedEvent[];
  reviewsSubmitted?: ReviewSubmittedEvent[];
}) {
  const client = await createArkivClient();

  const creates: any[] = [];

  // Add ProjectCreated events
  if (events.projectsCreated) {
    events.projectsCreated.forEach((event) => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ProjectCreated',
          ...event,
          indexedAt: Date.now(),
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectCreated' },
          { key: 'projectId', value: event.projectId },
          { key: 'student', value: event.student },
          { key: 'chain', value: event.chain },
          { key: 'createdAt', value: event.createdAt.toString() },
        ],
        expiresIn: ExpirationTime.fromDays(365),
      });
    });
  }

  // Add ProjectUnlocked events
  if (events.projectsUnlocked) {
    events.projectsUnlocked.forEach((event) => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ProjectUnlocked',
          ...event,
          indexedAt: Date.now(),
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectUnlocked' },
          { key: 'projectId', value: event.projectId },
          { key: 'reviewer', value: event.reviewer },
          { key: 'chain', value: event.chain },
        ],
        expiresIn: ExpirationTime.fromDays(90),
      });
    });
  }

  // Add ReviewSubmitted events
  if (events.reviewsSubmitted) {
    events.reviewsSubmitted.forEach((event) => {
      creates.push({
        payload: jsonToPayload({
          eventType: 'ReviewSubmitted',
          ...event,
          indexedAt: Date.now(),
        }),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ReviewSubmitted' },
          { key: 'projectId', value: event.projectId },
          { key: 'rating', value: event.rating.toString() },
          { key: 'chain', value: event.chain },
        ],
        expiresIn: ExpirationTime.fromDays(365),
      });
    });
  }

  try {
    const result = await client.mutateEntities({ creates });
    console.log(`✅ Batch indexed ${creates.length} events`);
    return result;
  } catch (error) {
    console.error('❌ Batch indexing failed:', error);
    throw error;
  }
}

/**
 * Query Events with Time-Scoped Filters
 *
 * Demonstrates Arkiv's SQL-like querying capabilities
 */
export async function queryEvents(filters: {
  eventType?: 'ProjectCreated' | 'ProjectUnlocked' | 'ReviewSubmitted';
  projectId?: string;
  student?: string;
  reviewer?: string;
  chain?: 'polkadot' | 'base';
  startTime?: number;
  endTime?: number;
}) {
  const client = await createArkivClient();

  const conditions = [];

  if (filters.eventType) {
    conditions.push(eq('eventType', filters.eventType));
  }

  if (filters.projectId) {
    conditions.push(eq('projectId', filters.projectId));
  }

  if (filters.student) {
    conditions.push(eq('student', filters.student));
  }

  if (filters.reviewer) {
    conditions.push(eq('reviewer', filters.reviewer));
  }

  if (filters.chain) {
    conditions.push(eq('chain', filters.chain));
  }

  try {
    const entities = await client.getEntities({
      // @ts-ignore - Arkiv SDK types
      where: conditions.length > 0 ? { and: conditions } : undefined,
    });

    // Additional time filtering (if needed)
    let results = entities;
    if (filters.startTime || filters.endTime) {
      results = entities.filter((entity: any) => {
        const timestamp = entity.attributes.find(
          (attr: any) => attr.key === 'timestamp' || attr.key === 'createdAt'
        )?.value;

        if (!timestamp) return false;

        const ts = parseInt(timestamp);
        if (filters.startTime && ts < filters.startTime) return false;
        if (filters.endTime && ts > filters.endTime) return false;

        return true;
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Query failed:', error);
    throw error;
  }
}

/**
 * Get Analytics for Student Portfolio
 */
export async function getStudentAnalytics(studentAddress: string) {
  const allEvents = await queryEvents({ student: studentAddress });

  const analytics = {
    totalProjects: 0,
    totalUnlocks: 0,
    totalReviews: 0,
    totalEarnings: '0',
    averageRating: 0,
    projectsByChain: { polkadot: 0, base: 0 },
  };

  allEvents.forEach((entity: any) => {
    const payload = JSON.parse(entity.payload);

    if (payload.eventType === 'ProjectCreated') {
      analytics.totalProjects++;
      analytics.projectsByChain[payload.chain as 'polkadot' | 'base']++;
    } else if (payload.eventType === 'ProjectUnlocked') {
      analytics.totalUnlocks++;
      analytics.totalEarnings = (
        BigInt(analytics.totalEarnings) + BigInt(payload.amount)
      ).toString();
    } else if (payload.eventType === 'ReviewSubmitted') {
      analytics.totalReviews++;
      analytics.averageRating =
        (analytics.averageRating * (analytics.totalReviews - 1) + payload.rating) /
        analytics.totalReviews;
    }
  });

  return analytics;
}

/**
 * Example Usage for Demo
 */
export async function demoArkivIndexing() {
  console.log('🚀 DotGo Arkiv Indexing Demo');

  // Example: Index a project creation
  const projectEvent: ProjectCreatedEvent = {
    projectId: '1',
    student: '0x1234...5678',
    title: 'DeFi Portfolio Tracker',
    description: 'Multi-chain DeFi portfolio analytics',
    githubUrl: 'https://github.com/example/defi-tracker',
    demoUrl: 'https://defi-tracker-demo.vercel.app',
    skills: ['Solidity', 'React', 'Web3.js'],
    createdAt: Date.now(),
    chain: 'polkadot',
    txHash: '0xabc...def',
  };

  await indexProjectCreated(projectEvent);

  // Example: Query recent projects
  const recentProjects = await queryEvents({
    eventType: 'ProjectCreated',
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
  });

  console.log('Recent projects:', recentProjects.length);

  // Example: Get student analytics
  const analytics = await getStudentAnalytics('0x1234...5678');
  console.log('Student analytics:', analytics);
}
