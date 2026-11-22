import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

try {
    await connectDB();
} catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
}

app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
});
