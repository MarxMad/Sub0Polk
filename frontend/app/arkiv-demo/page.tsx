/**
 * Arkiv Integration Demo Page
 *
 * Demonstrates queryable, time-scoped, verifiable data storage
 * for the Arkiv Main Track ($10k prize)
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  testArkivConnection,
  getArkivClient,
} from '@/lib/arkiv-client';
import {
  indexProjectCreated,
  indexProjectUnlocked,
  indexReviewSubmitted,
  queryEvents,
  getStudentAnalytics,
  type ProjectCreatedEvent,
  type ProjectUnlockedEvent,
  type ReviewSubmittedEvent,
} from '@/lib/arkiv-event-indexer';

export default function ArkivDemoPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [studentAddress, setStudentAddress] = useState('');
  const [liveProjectCount, setLiveProjectCount] = useState(0);
  const [liveReviewCount, setLiveReviewCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Real-time data refresh (every 15 seconds like learn-arkiv)
  useEffect(() => {
    const updateLiveStats = async () => {
      try {
        const [projects, reviews] = await Promise.all([
          queryEvents({ eventType: 'ProjectCreated', limit: 100 }),
          queryEvents({ eventType: 'ReviewSubmitted', limit: 100 }),
        ]);

        setLiveProjectCount(projects.length);
        setLiveReviewCount(reviews.length);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to update live stats:', error);
      }
    };

    // Initial load
    updateLiveStats();

    // Refresh every 15 seconds
    const interval = setInterval(updateLiveStats, 15000);

    return () => clearInterval(interval);
  }, []);

  // Test connection to Arkiv
  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      const connected = await testArkivConnection();
      setIsConnected(connected);
      if (connected) {
        alert('✅ Connected to Arkiv Mendoza successfully!');
      } else {
        alert('❌ Failed to connect. Check console for details.');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Connection error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Index a sample project
  const handleIndexProject = async () => {
    const sampleProject: ProjectCreatedEvent = {
      eventType: 'ProjectCreated',
      projectId: `demo-${Date.now()}`,
      student: studentAddress || '0x1234567890123456789012345678901234567890',
      title: 'DeFi Analytics Dashboard',
      description: 'Real-time DeFi protocol analytics and portfolio tracking',
      githubUrl: 'https://github.com/example/defi-analytics',
      demoUrl: 'https://defi-analytics-demo.vercel.app',
      skills: ['Solidity', 'React', 'TypeScript', 'The Graph', 'Hardhat'],
      timestamp: Date.now(),
      chain: 'polkadot',
      txHash: `0x${Math.random().toString(16).substring(2)}`,
      blockNumber: Math.floor(Math.random() * 1000000),
    };

    try {
      await indexProjectCreated(sampleProject);
      alert('✅ Project indexed successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to index project');
    }
  };

  // Index a sample unlock
  const handleIndexUnlock = async () => {
    const sampleUnlock: ProjectUnlockedEvent = {
      eventType: 'ProjectUnlocked',
      projectId: '1',
      reviewer: '0x9876543210987654321098765432109876543210',
      student: studentAddress || '0x1234567890123456789012345678901234567890',
      amount: '3000000000000000000', // 3 DOT
      timestamp: Date.now(),
      chain: 'polkadot',
      txHash: `0x${Math.random().toString(16).substring(2)}`,
    };

    try {
      await indexProjectUnlocked(sampleUnlock);
      alert('✅ Unlock indexed successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to index unlock');
    }
  };

  // Index a sample review
  const handleIndexReview = async () => {
    const sampleReview: ReviewSubmittedEvent = {
      eventType: 'ReviewSubmitted',
      projectId: '1',
      reviewer: '0x9876543210987654321098765432109876543210',
      rating: 5,
      comment: 'Excellent work! Very professional implementation.',
      timestamp: Date.now(),
      chain: 'polkadot',
      txHash: `0x${Math.random().toString(16).substring(2)}`,
    };

    try {
      await indexReviewSubmitted(sampleReview);
      alert('✅ Review indexed successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to index review');
    }
  };

  // Query all projects
  const handleQueryProjects = async () => {
    try {
      const results = await queryEvents({
        eventType: 'ProjectCreated',
        limit: 10,
      });
      setQueryResults(results);
      console.log('Query results:', results);
    } catch (error) {
      console.error(error);
      alert('❌ Query failed');
    }
  };

  // Query projects with specific skill
  const handleQueryBySkill = async () => {
    try {
      const results = await queryEvents({
        eventType: 'ProjectCreated',
        skill: 'React',
        limit: 10,
      });
      setQueryResults(results);
      console.log('React projects:', results);
    } catch (error) {
      console.error(error);
      alert('❌ Query failed');
    }
  };

  // Query time-scoped data (last 7 days)
  const handleQueryTimeScoped = async () => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    try {
      const results = await queryEvents({
        eventType: 'ProjectCreated',
        startTime: sevenDaysAgo,
        limit: 10,
      });
      setQueryResults(results);
      console.log('Projects from last 7 days:', results);
    } catch (error) {
      console.error(error);
      alert('❌ Query failed');
    }
  };

  // Get student analytics
  const handleGetAnalytics = async () => {
    if (!studentAddress) {
      alert('Please enter a student address');
      return;
    }

    try {
      const data = await getStudentAnalytics(studentAddress);
      setAnalytics(data);
      console.log('Student analytics:', data);
    } catch (error) {
      console.error(error);
      alert('❌ Failed to get analytics');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Arkiv Integration Demo</h1>
        <p className="text-muted-foreground">
          Queryable, time-scoped, verifiable data storage on Arkiv Mendoza
        </p>
      </div>

      {/* Live Stats Banner */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold">{liveProjectCount}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{liveReviewCount}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold animate-pulse">🔴 LIVE</div>
              <div className="text-sm text-muted-foreground">Real-time Updates</div>
            </div>
            <div>
              <div className="text-sm font-mono">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
              </div>
              <div className="text-sm text-muted-foreground">Last Refresh</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Auto-refreshing every 15 seconds • Powered by Arkiv Mendoza
          </p>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
          <CardDescription>
            Test connection to Arkiv Mendoza testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleTestConnection}
              disabled={isConnecting}
              variant={isConnected ? 'outline' : 'default'}
            >
              {isConnecting ? 'Connecting...' : isConnected ? '✅ Connected' : 'Test Connection'}
            </Button>

            {isConnected && (
              <div className="text-sm text-muted-foreground">
                Connected to Arkiv Mendoza (Chain ID: 60138453056)
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Student Address Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Student Address</CardTitle>
          <CardDescription>
            Enter a student wallet address for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="0x..."
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className="font-mono text-sm"
            />
            <Button onClick={handleGetAnalytics}>Get Analytics</Button>
          </div>
        </CardContent>
      </Card>

      {/* Indexing Demo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Index Events to Arkiv</CardTitle>
          <CardDescription>
            Store blockchain events with time-scoped expiration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleIndexProject} variant="outline">
              📝 Index Project (365 days)
            </Button>
            <Button onClick={handleIndexUnlock} variant="outline">
              🔓 Index Unlock (90 days)
            </Button>
            <Button onClick={handleIndexReview} variant="outline">
              ⭐ Index Review (365 days)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Each event is stored with attributes for efficient querying
          </p>
        </CardContent>
      </Card>

      {/* Query Demo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Query Indexed Data</CardTitle>
          <CardDescription>
            SQL-like queries with time-scoped filtering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={handleQueryProjects}>All Projects</Button>
            <Button onClick={handleQueryBySkill}>React Projects</Button>
            <Button onClick={handleQueryTimeScoped}>Last 7 Days</Button>
          </div>

          {queryResults.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-2">
                Query Results ({queryResults.length})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {queryResults.map((result, i) => (
                  <div
                    key={i}
                    className="bg-background border rounded p-3 text-sm"
                  >
                    <pre className="whitespace-pre-wrap overflow-x-auto text-xs">
                      {JSON.stringify(JSON.parse(result.payload), null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Display */}
      {analytics && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Analytics</CardTitle>
            <CardDescription>
              Aggregated data from all indexed events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{analytics.totalProjects}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{analytics.totalUnlocks}</div>
                <div className="text-sm text-muted-foreground">Total Unlocks</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{analytics.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {analytics.averageRating.toFixed(1)}★
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {analytics.projectsByChain.polkadot}
                </div>
                <div className="text-sm text-muted-foreground">Polkadot Projects</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {Object.keys(analytics.skillDistribution).length}
                </div>
                <div className="text-sm text-muted-foreground">Unique Skills</div>
              </div>
            </div>

            {Object.keys(analytics.skillDistribution).length > 0 && (
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Skill Distribution:</h5>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(analytics.skillDistribution).map(
                    ([skill, count]) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                      >
                        {skill} ({count})
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>1. Event Indexing:</strong> Blockchain events are captured
            and stored on Arkiv with structured attributes.
          </p>
          <p>
            <strong>2. Queryable Data:</strong> Use SQL-like queries to filter
            by skills, ratings, time ranges, etc.
          </p>
          <p>
            <strong>3. Time-Scoped Expiration:</strong> Data automatically
            expires (e.g., unlocks after 90 days, projects after 1 year).
          </p>
          <p>
            <strong>4. Verifiable Integrity:</strong> All data is cryptographically
            tied to blockchain transactions.
          </p>
          <p className="pt-2 border-t">
            <strong>View on Explorer:</strong>{' '}
            <a
              href="https://explorer.mendoza.hoodi.arkiv.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Mendoza Explorer
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
