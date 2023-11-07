/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts'
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

export default config
