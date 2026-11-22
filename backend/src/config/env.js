import 'dotenv/config';

const required = ['MONGODB_URI', 'JWT_SECRET'];

for (const name of required) {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
}

export const env = {
    port: Number(process.env.PORT) || 3000,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
    // Not a secret, so a development default is fine. Accepts a comma-separated list.
    clientOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim()),
};