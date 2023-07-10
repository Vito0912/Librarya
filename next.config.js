/** @type {import('next').NextConfig} */
let nextConfig = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.externals = config.externals.concat(['tedious', 'mysql', 'mysql2', 'oracle', 'oracledb', 'pg', 'pg-native', 'sqlite3', 'pg-query-stream', 'aws-sdk', 'strong-oracle', 'mssql', 'nock', 'mock-aws-s3', 'aws-sdk', 'mariasql', 'better-sqlite3', 'get-package-type', 'npm:noop2', 'knex']);
      return config;
    },
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
    async rewrites() {
      return [
        {
          source: '/users/auth',
          destination: '/api/sync/auth',
        },
        {
          source: '/syncs/progress',
          destination: '/api/sync/progress',
        },
        {
          source: '/syncs/progress/:document',
          destination: '/api/sync/progress/:document',
        },
        {
          source: '/healthcheck',
          destination: '/api/sync/',
        },
      ]
    },
  }


module.exports = nextConfig
