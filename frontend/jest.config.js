// jest.config.js
module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '^store/(.*)$': '<rootDir>/src/store/$1',
    '^react-icons/fa$': '<rootDir>/node_modules/react-icons/fa',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // Add any packages that need to be transformed (excluding node_modules except these)
    '/node_modules/(?!axios|other-module)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
};
