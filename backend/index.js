/**
 * DotGo Backend Service - Main Entry Point
 *
 * Runs both Polkadot and Base event listeners in parallel
 */

import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Starting DotGo Backend Service');
console.log('================================\n');

// Start Polkadot listener
const polkadotProcess = spawn('node', ['polkadot-listener.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

// Start Base listener
const baseProcess = spawn('node', ['base-listener.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

// Handle process errors
polkadotProcess.on('error', (error) => {
  console.error('❌ Polkadot listener error:', error);
});

baseProcess.on('error', (error) => {
  console.error('❌ Base listener error:', error);
});

// Handle process exits
polkadotProcess.on('exit', (code) => {
  console.log(`⚠️ Polkadot listener exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting Polkadot listener...');
    // Auto-restart could be added here
  }
});

baseProcess.on('exit', (code) => {
  console.log(`⚠️ Base listener exited with code ${code}`);
  if (code !== 0) {
    console.log('Restarting Base listener...');
    // Auto-restart could be added here
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️ Shutting down all listeners...');
  polkadotProcess.kill('SIGINT');
  baseProcess.kill('SIGINT');
  setTimeout(() => process.exit(0), 1000);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️ Shutting down all listeners...');
  polkadotProcess.kill('SIGTERM');
  baseProcess.kill('SIGTERM');
  setTimeout(() => process.exit(0), 1000);
});

console.log('✅ Backend service started');
console.log('   Press Ctrl+C to stop all listeners\n');
