import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: [120, 'El nombre no puede superar los 120 caracteres'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        sku: {
            type: String,
            required: [true, 'El SKU es obligatorio'],
            unique: true,
            trim: true,
            uppercase: true,
            maxlength: [40, 'El SKU no puede superar los 40 caracteres'],
        },
        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true,
            maxlength: [80, 'La categoría no puede superar los 80 caracteres'],
            index: true,
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, 'El stock no puede ser negativo'],
            max: [99999, 'El stock no puede superar 99999'],
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {timestamps: true}
);

export const Product = mongoose.model('Product', productSchema);