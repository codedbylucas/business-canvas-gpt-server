/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest'

const config: Config = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/index.ts',
    '!<rootDir>/src/shared/either.ts',
    '!<rootDir>/src/main/{configs,adapters}/**/*.ts',
    '!<rootDir>/src/main/server.ts',
  ],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  setupFiles:[
    '<rootDir>/src/infra/cache/redis/helpers/test-env-vars/jest-set-env-vars.ts',
    '<rootDir>/src/infra/api/test-env-vars/jest-set-env-vars.ts',
    '<rootDir>/src/interactions/usecases/user/add-random-user/env-test.ts'
  ]
}

export default config
