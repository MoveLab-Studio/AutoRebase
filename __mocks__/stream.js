// Mock implementation of the stream module
module.exports = {
    Readable: class Readable {},
    Writable: class Writable {},
    Duplex: class Duplex {},
    Transform: class Transform {},
    PassThrough: class PassThrough {},
    pipeline: () => {},
    finished: () => {},
    // Add any other stream methods or classes that might be used
};
