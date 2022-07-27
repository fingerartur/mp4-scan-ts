// Classic jest config for tests to be run in jsdom environment
// Useful for classic unit tests or enzyme component tests

module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/(*.)+test.ts',
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'jsdom',
}
