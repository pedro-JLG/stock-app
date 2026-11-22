import mongoose from 'mongoose';
import { env } from './env.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB() {
    try {
        await mongoose.connect(env.mongodbUri);
        console.log(`MongoDB connected: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}
