/** @type {import('next').NextConfig} */
const path = require('path');
const withLess = require('next-with-less');
const lessToJS = require('less-vars-to-js');

const nextConfig = {
  reactStrictMode: true,
  lessLoaderOptions: {
  },
  webpack: (config, { isServer }) => {
      config.resolve.alias['components'] = path.join(__dirname, 'components');
      config.resolve.alias['content'] = path.join(__dirname, 'content');
      config.resolve.alias['utils'] = path.join(__dirname, 'utils');
      config.resolve.alias['api'] = path.join(__dirname, 'api');
      config.resolve.alias['@root'] = path.join(__dirname, '/');
      return config;
  },
  env: {
      ENVHOST: process.env.ENV ? envHostMapping[process.env.ENV] : 'dev-',
      CLIENT_ID: process.env.ENV ? tokenClientIdMapping[process.env.ENV] : 'MPS.Portal.Debug',
      CLIENT_SECRET: process.env.ENV ? tokenClientSecretMapping[process.env.ENV] : 'IEYVtrSGekyI',
      CONFIGURATION_API_URL: process.env.ENV ? configurationApiUrlMapping[process.env.ENV] : 'https://dev-mps-configuration-api.ysd.com/api/v1',
      TOKEN_API_URL: process.env.ENV ? tokenApiUrlMapping[process.env.ENV] : 'https://stg-auth.ysd.com:44300/connect/token'

  }
};

module.exports = withLess(nextConfig);
