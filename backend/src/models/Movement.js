import mongoose from 'mongoose';

export const MOVEMENT_TYPES = ['in', 'out'];

const movementSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: MOVEMENT_TYPES,
            required: [true, 'Type is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: 1,
            max: 99999,
            validate: {
                validator: Number.isInteger,
                message: 'Quantity must be an integer',
            },
        },
        occurredOn: {
            type: Date,
            required: [true, 'Date is required'],
            index: true,
        },
        supplier: {
            type: String,
            trim: true,
            maxlength: 120,
            required: [
                function() {
                    return this.type === 'in';
                },
                'Supplier is required for incoming movements',
            ],
        },
        reason: {
            type: String,
            trim: true,
            maxlength: 180,
            required: [
                function() {
                    return this.type === 'out';
                },
                'Reason is required for outgoing movements',
            ],
        },
    },
    { timestamps: true}
);

export const Movement = mongoose.model('Movement', movementSchema);
