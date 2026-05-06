const isDev = process.env.NODE_ENV !== 'production';

const timestamp = () => new Date().toISOString();

const logger = {
    info: (msg, ...args) => {
        console.log(`[${timestamp()}] ℹ️  INFO  | ${msg}`, ...args);
    },
    warn: (msg, ...args) => {
        console.warn(`[${timestamp()}] ⚠️  WARN  | ${msg}`, ...args);
    },
    error: (msg, ...args) => {
        console.error(`[${timestamp()}] ❌ ERROR | ${msg}`, ...args);
    },
    debug: (msg, ...args) => {
        if (isDev) {
            console.debug(`[${timestamp()}] 🐛 DEBUG | ${msg}`, ...args);
        }
    },
    http: (req) => {
        console.log(`[${timestamp()}] 🌐 HTTP  | ${req.method} ${req.originalUrl}`);
    }
};

export default logger;