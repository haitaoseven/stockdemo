/** @type {import('next').NextConfig} */
const path = require('path');
const withLess = require('next-with-less');
const lessToJS = require('less-vars-to-js');

const apiHostMapping = {
  'next-prd': '101.133.238.49',
  'next': 'localhost'
};

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
    APIHOST: process.env.ENV ? apiHostMapping[process.env.ENV] : 'localhost',

  },
  distDir: 'build',
};

module.exports = withLess(nextConfig);
