import mongoose from 'mongoose';
import { env } from './env.js';
import dns from 'node:dns';

// Node's DNS resolver on Windows fails on Atlas SRV lookups (querySrv ECONNREFUSED).
// Only needed locally: Vercel runs on Linux.
if (process.platform === 'win32') {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
}

// Throws on failure: the caller decides how to react
// (server.js exits, api/index.js answers 503 and retries on the next request).
export async function connectDB() {
    await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
