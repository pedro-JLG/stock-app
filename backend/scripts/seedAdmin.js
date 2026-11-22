import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

const { ADMIN_NAME = 'Administrador', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
    process.exit(1);
}

await connectDB();

const email = ADMIN_EMAIL.toLowerCase();
const existing = await User.findOne({ email });

if (existing) {
    existing.role = 'admin';
    await existing.save();
    console.log(`Existing user promoted to admin: ${email}`);
} else {
    const admin = new User({ name: ADMIN_NAME, email, role: 'admin' });
    await admin.setPassword(ADMIN_PASSWORD);
    await admin.save();
    console.log(`Admin created: ${email}`);
}

await mongoose.disconnect();