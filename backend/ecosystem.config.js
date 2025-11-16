/**
 * PM2 Configuration for DotGo Backend
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 logs
 *   pm2 restart all
 *   pm2 stop all
 */

module.exports = {
  apps: [
    {
      name: 'dotgo-polkadot-indexer',
      script: './polkadot-listener.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/polkadot-error.log',
      out_file: './logs/polkadot-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'dotgo-base-indexer',
      script: './base-listener.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/base-error.log',
      out_file: './logs/base-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
