/**
 * DotGo Event Indexer for Arkiv
 *
 * Listens to Polkadot contract events and indexes them to Arkiv Mendoza
 * for queryable, time-scoped, verifiable data storage.
 *
 * Prize Track: Arkiv Main ($10k)
 */

import { getArkivClient } from './arkiv-client';
import { ExpirationTime, jsonToPayload, eq } from '@arkiv-network/sdk';

// Event type definitions
export interface DotGoEvent {
  eventType: 'ProjectCreated' | 'ProjectUnlocked' | 'ReviewSubmitted';
  projectId: string;
  timestamp: number;
  chain: 'polkadot' | 'base';
  txHash: string;
  blockNumber?: number;
}

export interface ProjectCreatedEvent extends DotGoEvent {
  eventType: 'ProjectCreated';
  student: string;
  title: string;
  description: string;
  githubUrl: string;
  demoUrl: string;
  skills: string[];
}

export interface ProjectUnlockedEvent extends DotGoEvent {
  eventType: 'ProjectUnlocked';
  reviewer: string;
  student: string;
  amount: string;
}

export interface ReviewSubmittedEvent extends DotGoEvent {
  eventType: 'ReviewSubmitted';
  reviewer: string;
  rating: number;
  comment: string;
}

/**
 * Index a ProjectCreated event to Arkiv
 */
export async function indexProjectCreated(event: ProjectCreatedEvent) {
  const client = await getArkivClient();

  if (!client) {
    console.warn('⚠️ Arkiv client not available, skipping indexing');
    return null;
  }

  const payload = {
    ...event,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [{
        payload: jsonToPayload(payload),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectCreated' },
          { key: 'projectId', value: event.projectId },
          { key: 'student', value: event.student },
          { key: 'chain', value: event.chain },
          { key: 'title', value: event.title },
          // Index skills as individual attributes for better querying
          ...event.skills.map(skill => ({ key: 'skill', value: skill })),
          { key: 'timestamp', value: event.timestamp.toString() },
        ],
        // Keep project data for 1 year
        expiresIn: ExpirationTime.fromDays(365),
      }],
    });

    console.log('✅ ProjectCreated indexed to Arkiv:', {
      projectId: event.projectId,
      title: event.title,
      student: event.student,
    });

    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectCreated:', error);
    throw error;
  }
}

/**
 * Index a ProjectUnlocked event to Arkiv
 */
export async function indexProjectUnlocked(event: ProjectUnlockedEvent) {
  const client = await getArkivClient();

  if (!client) {
    console.warn('⚠️ Arkiv client not available, skipping indexing');
    return null;
  }

  const payload = {
    ...event,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [{
        payload: jsonToPayload(payload),
        contentType: 'application/json',
        attributes: [
          { key: 'eventType', value: 'ProjectUnlocked' },
          { key: 'projectId', value: event.projectId },
          { key: 'reviewer', value: event.reviewer },
          { key: 'student', value: event.student },
          { key: 'amount', value: event.amount },
          { key: 'chain', value: event.chain },
          { key: 'timestamp', value: event.timestamp.toString() },
        ],
        // Keep unlock history for 90 days
        expiresIn: ExpirationTime.fromDays(90),
      }],
    });

    console.log('✅ ProjectUnlocked indexed to Arkiv:', {
      projectId: event.projectId,
      reviewer: event.reviewer,
      amount: event.amount,
    });

    return result;
  } catch (error) {
    console.error('❌ Failed to index ProjectUnlocked:', error);
    throw error;
  }
}

/**
 * Index a ReviewSubmitted event to Arkiv
 */
export async function indexReviewSubmitted(event: ReviewSubmittedEvent) {
  const client = await getArkivClient();

  if (!client) {
    console.warn('⚠️ Arkiv client not available, skipping indexing');
    return null;
  }

  const payload = {
    ...event,
    indexedAt: Date.now(),
  };

  try {
    const result = await client.mutateEntities({
      creates: [{
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
      }],
    });

    console.log('✅ ReviewSubmitted indexed to Arkiv:', {
      projectId: event.projectId,
      reviewer: event.reviewer,
      rating: event.rating,
    });

    return result;
  } catch (error) {
    console.error('❌ Failed to index ReviewSubmitted:', error);
    throw error;
  }
}

/**
 * Batch index multiple events (more efficient)
 */
export async function batchIndexEvents(events: {
  projectsCreated?: ProjectCreatedEvent[];
  projectsUnlocked?: ProjectUnlockedEvent[];
  reviewsSubmitted?: ReviewSubmittedEvent[];
}) {
  const client = await getArkivClient();

  if (!client) {
    console.warn('⚠️ Arkiv client not available, skipping batch indexing');
    return null;
  }

  const creates: any[] = [];
  const now = Date.now();

  // Add ProjectCreated events
  events.projectsCreated?.forEach(event => {
    creates.push({
      payload: jsonToPayload({ ...event, indexedAt: now }),
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

  // Add ProjectUnlocked events
  events.projectsUnlocked?.forEach(event => {
    creates.push({
      payload: jsonToPayload({ ...event, indexedAt: now }),
      contentType: 'application/json',
      attributes: [
        { key: 'eventType', value: 'ProjectUnlocked' },
        { key: 'projectId', value: event.projectId },
        { key: 'reviewer', value: event.reviewer },
        { key: 'student', value: event.student },
        { key: 'amount', value: event.amount },
        { key: 'chain', value: event.chain },
        { key: 'timestamp', value: event.timestamp.toString() },
      ],
      expiresIn: ExpirationTime.fromDays(90),
    });
  });

  // Add ReviewSubmitted events
  events.reviewsSubmitted?.forEach(event => {
    creates.push({
      payload: jsonToPayload({ ...event, indexedAt: now }),
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

  if (creates.length === 0) {
    console.warn('⚠️ No events to index');
    return null;
  }

  try {
    const result = await client.mutateEntities({ creates });
    console.log(`✅ Batch indexed ${creates.length} events to Arkiv`);
    return result;
  } catch (error) {
    console.error('❌ Batch indexing failed:', error);
    throw error;
  }
}

/**
 * Query events from Arkiv with time-scoped filters
 *
 * Demonstrates SQL-like querying capabilities
 */
export async function queryEvents(filters: {
  eventType?: 'ProjectCreated' | 'ProjectUnlocked' | 'ReviewSubmitted';
  projectId?: string;
  student?: string;
  reviewer?: string;
  skill?: string;
  chain?: 'polkadot' | 'base';
  minRating?: number;
  startTime?: number; // Unix timestamp
  endTime?: number;   // Unix timestamp
  limit?: number;
}) {
  const client = await getArkivClient();

  if (!client) {
    console.warn('⚠️ Arkiv client not available, returning empty results');
    return [];
  }

  // Build query conditions
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

  if (filters.skill) {
    conditions.push(eq('skill', filters.skill));
  }

  if (filters.chain) {
    conditions.push(eq('chain', filters.chain));
  }

  try {
    const entities = await client.getEntities({
      where: conditions.length > 0 ? { and: conditions } : undefined,
      limit: filters.limit || 100,
    });

    // Additional filtering (time-scoped, rating)
    let results = entities;

    // Time-scoped filtering
    if (filters.startTime || filters.endTime) {
      results = results.filter((entity: any) => {
        const timestampAttr = entity.attributes.find(
          (attr: any) => attr.key === 'timestamp'
        );

        if (!timestampAttr) return false;

        const timestamp = parseInt(timestampAttr.value);

        if (filters.startTime && timestamp < filters.startTime) return false;
        if (filters.endTime && timestamp > filters.endTime) return false;

        return true;
      });
    }

    // Rating filtering
    if (filters.minRating !== undefined) {
      results = results.filter((entity: any) => {
        const ratingAttr = entity.attributes.find(
          (attr: any) => attr.key === 'rating'
        );

        if (!ratingAttr) return false;

        const rating = parseInt(ratingAttr.value);
        return rating >= filters.minRating!;
      });
    }

    console.log(`📊 Query returned ${results.length} events`);
    return results;
  } catch (error) {
    console.error('❌ Query failed:', error);
    throw error;
  }
}

/**
 * Get student analytics from Arkiv
 *
 * Aggregates all events for a student
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
    skillDistribution: {} as Record<string, number>,
  };

  allEvents.forEach((entity: any) => {
    const payload = JSON.parse(entity.payload);

    switch (payload.eventType) {
      case 'ProjectCreated':
        analytics.totalProjects++;
        analytics.projectsByChain[payload.chain as 'polkadot' | 'base']++;

        // Count skills
        payload.skills?.forEach((skill: string) => {
          analytics.skillDistribution[skill] =
            (analytics.skillDistribution[skill] || 0) + 1;
        });
        break;

      case 'ProjectUnlocked':
        analytics.totalUnlocks++;
        analytics.totalEarnings = (
          BigInt(analytics.totalEarnings) + BigInt(payload.amount || '0')
        ).toString();
        break;

      case 'ReviewSubmitted':
        analytics.totalReviews++;
        const rating = payload.rating || 0;
        analytics.averageRating =
          (analytics.averageRating * (analytics.totalReviews - 1) + rating) /
          analytics.totalReviews;
        break;
    }
  });

  return analytics;
}

/**
 * Demo function for testing Arkiv integration
 */
export async function demoArkivIndexing() {
  console.log('🚀 DotGo Arkiv Integration Demo');
  console.log('--------------------------------');

  // Example: Index a project creation
  const projectEvent: ProjectCreatedEvent = {
    eventType: 'ProjectCreated',
    projectId: '1',
    student: '0x1234567890123456789012345678901234567890',
    title: 'DeFi Portfolio Tracker',
    description: 'Multi-chain DeFi portfolio analytics dashboard',
    githubUrl: 'https://github.com/example/defi-tracker',
    demoUrl: 'https://defi-tracker-demo.vercel.app',
    skills: ['Solidity', 'React', 'Web3.js', 'Hardhat'],
    timestamp: Date.now(),
    chain: 'polkadot',
    txHash: '0xabcdef123456789...',
    blockNumber: 12345,
  };

  await indexProjectCreated(projectEvent);

  // Example: Query recent projects with React skill
  console.log('\n📊 Querying projects with React skill...');
  const reactProjects = await queryEvents({
    eventType: 'ProjectCreated',
    skill: 'React',
    startTime: Date.now() - 30 * 24 * 60 * 60 * 1000, // Last 30 days
  });

  console.log(`Found ${reactProjects.length} React projects`);

  // Example: Get student analytics
  console.log('\n📈 Getting student analytics...');
  const analytics = await getStudentAnalytics(projectEvent.student);
  console.log('Analytics:', analytics);

  console.log('\n✅ Demo complete!');
}
