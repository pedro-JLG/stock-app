import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        sku: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: 40,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            maxlength: 80,
            index: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: 0,
            max: 99999,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {timestamps: true}
);

export const Product = mongoose.model('Product', productSchema);