import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ['admin', 'operator'];

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: [100, 'El nombre no puede superar los 100 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: {
                values: ROLES,
                message: 'El rol debe ser admin u operator',
            },
            default: 'operator',
        },
    },
    {timestamps: true}
);

userSchema.methods.setPassword = async function (password) {
    this.passwordHash = await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = function (password){
    return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema)