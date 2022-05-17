module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageProvider: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
