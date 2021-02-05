/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

const root = resolve(__dirname);
const rootConfig = require(`${root}/jest.config.js`);

module.exports = {
  ...rootConfig,
  ...{
    roots: [root],
    displayName: 'end2end-tests',
    // setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
    testMatch: ['<rootDir>/**/*.test.ts'],
    transform: {
      '.+\\.ts$': 'ts-jest',
    },
  },
};
