/**
 * Arkiv Query Test Script
 *
 * Demonstrates advanced querying capabilities
 * Shows SQL-like queries for the demo video
 */

import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import dotenv from 'dotenv';

dotenv.config();

const mendoza = {
  id: 60138453056,
  name: 'Arkiv Mendoza',
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
    },
  },
};

const privateKey = process.env.ARKIV_PRIVATE_KEY;
const account = privateKeyToAccount(privateKey);
const client = createWalletClient({
  chain: mendoza,
  transport: http(),
  account: account,
});

console.log('\n🔍 DotGo Arkiv Query Demonstration\n');
console.log('='.repeat(60));
console.log(`Account: ${account.address}\n`);

// Query 1: Find all projects
console.log('📊 Query 1: All Projects');
console.log('-'.repeat(60));
try {
  const projects = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ProjectCreated' },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Found ${projects.length} total projects`);

  if (projects.length > 0) {
    console.log('\nRecent Projects:');
    projects.slice(0, 5).forEach((p, i) => {
      const attrs = p.attributes || [];
      const title = attrs.find(a => a.key === 'title')?.value || 'Unknown';
      const student = attrs.find(a => a.key === 'student')?.value || 'Unknown';
      console.log(`  ${i + 1}. "${title}" by ${student.substring(0, 10)}...`);
    });
  }
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Query 2: Projects by skill
console.log('\n\n💡 Query 2: Find "Arkiv" Developers');
console.log('-'.repeat(60));
try {
  const arkivDevs = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ProjectCreated' },
        { key: 'skill', op: 'eq', value: 'Arkiv' },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Found ${arkivDevs.length} developers with Arkiv skill`);

  if (arkivDevs.length > 0) {
    console.log('\nArkiv Developers:');
    arkivDevs.slice(0, 3).forEach((p, i) => {
      const attrs = p.attributes || [];
      const title = attrs.find(a => a.key === 'title')?.value || 'Unknown';
      const skills = attrs.filter(a => a.key === 'skill').map(a => a.value);
      console.log(`  ${i + 1}. "${title}"`);
      console.log(`     Skills: ${skills.join(', ')}`);
    });
  }
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Query 3: High-rated projects
console.log('\n\n⭐ Query 3: Top-Rated Projects (4+ stars)');
console.log('-'.repeat(60));
try {
  const reviews = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ReviewSubmitted' },
        { key: 'rating', op: 'gte', value: '4' },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Found ${reviews.length} reviews with 4+ stars`);

  if (reviews.length > 0) {
    console.log('\nTop Reviews:');
    reviews.slice(0, 3).forEach((r, i) => {
      const attrs = r.attributes || [];
      const rating = attrs.find(a => a.key === 'rating')?.value || '0';
      const projectId = attrs.find(a => a.key === 'projectId')?.value || 'Unknown';
      console.log(`  ${i + 1}. Project ${projectId.substring(0, 20)}... - ${rating}/5 stars`);
    });
  }
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Query 4: Student's projects
console.log('\n\n👤 Query 4: Projects by Student Address');
console.log('-'.repeat(60));
try {
  const studentProjects = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ProjectCreated' },
        { key: 'student', op: 'eq', value: account.address },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Found ${studentProjects.length} projects by ${account.address.substring(0, 10)}...`);

  if (studentProjects.length > 0) {
    console.log('\nYour Projects:');
    studentProjects.forEach((p, i) => {
      const attrs = p.attributes || [];
      const title = attrs.find(a => a.key === 'title')?.value || 'Unknown';
      const chain = attrs.find(a => a.key === 'chain')?.value || 'Unknown';
      console.log(`  ${i + 1}. "${title}" on ${chain}`);
    });
  }
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Query 5: Recent activity (last 24 hours)
console.log('\n\n📅 Query 5: Recent Activity (Last 24 Hours)');
console.log('-'.repeat(60));
try {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const recentEvents = await client.getEntities({
    where: {
      and: [
        { key: 'timestamp', op: 'gte', value: oneDayAgo.toString() },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Found ${recentEvents.length} events in last 24 hours`);

  // Count by event type
  const eventCounts = {};
  recentEvents.forEach(e => {
    const eventType = e.attributes?.find(a => a.key === 'eventType')?.value || 'Unknown';
    eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
  });

  console.log('\nEvent Breakdown:');
  Object.entries(eventCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Query 6: Cross-chain comparison
console.log('\n\n🌉 Query 6: Cross-Chain Activity');
console.log('-'.repeat(60));
try {
  const polkadotProjects = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ProjectCreated' },
        { key: 'chain', op: 'eq', value: 'polkadot' },
      ],
    },
    limit: 100,
  });

  const baseProjects = await client.getEntities({
    where: {
      and: [
        { key: 'eventType', op: 'eq', value: 'ProjectCreated' },
        { key: 'chain', op: 'eq', value: 'base' },
      ],
    },
    limit: 100,
  });

  console.log(`✅ Polkadot projects: ${polkadotProjects.length}`);
  console.log(`✅ Base projects: ${baseProjects.length}`);
  console.log(`   Total cross-chain: ${polkadotProjects.length + baseProjects.length}`);
} catch (error) {
  console.log('❌ Query failed:', error.message);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 QUERY CAPABILITIES DEMONSTRATED');
console.log('='.repeat(60));
console.log('✅ Query by event type');
console.log('✅ Query by skill (multi-value attributes)');
console.log('✅ Query by rating (numerical comparison)');
console.log('✅ Query by student address');
console.log('✅ Query by timestamp (time-scoped)');
console.log('✅ Cross-chain comparison');
console.log('='.repeat(60));
console.log('\n🎯 SQL-like querying ready for demo!\n');

console.log('💡 Demo Use Cases:');
console.log('  1. "Find React developers with 4+ stars"');
console.log('  2. "Show student portfolio earnings"');
console.log('  3. "Recent platform activity (last 7 days)"');
console.log('  4. "Cross-chain reputation aggregation"\n');

console.log('🏆 Ready for Arkiv Main Track ($10k) submission!\n');
