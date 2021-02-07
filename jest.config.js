const { resolve } = require('path');

const root = resolve(__dirname);


module.exports = {
  rootDir: root,
  displayName: 'root-tests',
  clearMocks: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    "@src/(.*)": "<rootDir>/src/$1",
    "@test/(.*)": "<rootDir>/test/$1",
  }
};
