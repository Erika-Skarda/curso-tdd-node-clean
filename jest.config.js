module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageProvider: 'coverage',
  testEnvironment: "node",
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};
