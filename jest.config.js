module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Map 'node:' prefixed modules to their non-prefixed versions
    // and use mocks for problematic modules
    moduleNameMapper: {
        '^node:(.*)$': '$1',
        '^stream$': '<rootDir>/__mocks__/stream.js',
        '^@fastify/busboy$': '<rootDir>/__mocks__/@fastify/busboy.js',
        '^undici$': '<rootDir>/__mocks__/undici.js',
    },
    // Setup file to provide global implementations
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
