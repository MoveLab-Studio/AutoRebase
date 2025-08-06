// Setup file for Jest tests

// Provide a global AbortSignal implementation if it's not defined
if (typeof AbortSignal === 'undefined') {
    global.AbortSignal = class AbortSignal {
        constructor() {
            this.aborted = false;
        }

        static timeout(ms) {
            return new AbortSignal();
        }

        // Add any other methods that might be used
    };
}

// Provide a global AbortController implementation if it's not defined
if (typeof AbortController === 'undefined') {
    global.AbortController = class AbortController {
        constructor() {
            this.signal = new AbortSignal();
        }

        abort() {
            this.signal.aborted = true;
        }
    };
}

// Provide a global Event implementation if it's not defined
if (typeof Event === 'undefined') {
    global.Event = class Event {
        constructor(type, eventInitDict) {
            this.type = type;
            Object.assign(this, eventInitDict);
        }
    };
}
