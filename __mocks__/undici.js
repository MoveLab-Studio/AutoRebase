// Mock implementation of undici
module.exports = {
    // Add any methods or properties that might be used
    fetch: async () => ({
        ok: true,
        status: 200,
        json: async () => ({}),
        text: async () => '',
        headers: new Map(),
    }),
    // Add other exports as needed
};
