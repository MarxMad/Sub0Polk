/**
 * Simplified Arkiv Integration for Demo
 * Works with @arkiv-network/sdk v0.4.5
 */

import { createWalletClient, createPublicClient } from '@arkiv-network/sdk';
import { stringToPayload } from '@arkiv-network/sdk/utils';

// Simple event interfaces
export interface ProjectEvent {
  projectId: string;
  student: string;
  title: string;
  skills: string[];
  timestamp: number;
}

// Get Arkiv wallet client
async function getWalletClient() {
  const privateKey = process.env.ARKIV_PRIVATE_KEY;
  if (!privateKey) return null;

  return createWalletClient({
    privateKey,
    rpcUrl: 'https://mendoza.hoodi.arkiv.network/rpc'
  });
}

// Get Arkiv public client for queries
async function getPublicClient() {
  return createPublicClient({
    rpcUrl: 'https://mendoza.hoodi.arkiv.network/rpc'
  });
}

// Index a project event
export async function indexProject(event: ProjectEvent) {
  const client = await getWalletClient();
  if (!client) throw new Error('Arkiv client not configured');

  const result = await client.mutateEntities({
    creates: [{
      payload: stringToPayload(JSON.stringify(event)),
      contentType: 'application/json',
      attributes: [
        { key: 'type', value: 'project' },
        { key: 'projectId', value: event.projectId },
        { key: 'student', value: event.student },
        { key: 'title', value: event.title },
        ...event.skills.map(skill => ({ key: 'skill', value: skill })),
      ],
      expiresIn: 365 * 24 * 60 * 60 // 365 days in seconds
    }],
  });

  return result;
}

// Query projects
export async function queryProjects(filters?: { skill?: string; limit?: number }) {
  const client = await getPublicClient();

  try {
    const entities = await client.buildQuery().fetch({ limit: filters?.limit || 10 });

    return entities.map((entity: any) => ({
      ...JSON.parse(entity.payload),
      entityKey: entity.key,
    }));
  } catch (error) {
    console.error('Query error:', error);
    return [];
  }
}

// Test connection
export async function testConnection() {
  const client = await getPublicClient();

  try {
    await client.buildQuery().fetch({ limit: 1 });
    return true;
  } catch {
    return false;
  }
}
