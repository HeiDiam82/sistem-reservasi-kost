const logger = {
    info: (msg) => console.log(`[${new Date().toISOString()}] ℹ️  INFO  | ${msg}`),
    error: (msg) => console.error(`[${new Date().toISOString()}] ❌ ERROR | ${msg}`),
    warn: (msg) => console.warn(`[${new Date().toISOString()}] ⚠️  WARN  | ${msg}`),
    debug: (msg) => console.log(`[${new Date().toISOString()}] 🐛 DEBUG | ${msg}`),
    http: (req) => console.log(`[${new Date().toISOString()}] 🌐 HTTP  | ${req.method} ${req.url}`)
};

export default logger;
