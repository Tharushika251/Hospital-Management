module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/*.test.js'], // Adjust based on your test directory
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
