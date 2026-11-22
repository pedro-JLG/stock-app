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
            enum: {
                values: MOVEMENT_TYPES,
                message: 'El tipo debe ser in u out',
            },
            required: [true, 'El tipo es obligatorio'],
        },
        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad debe ser al menos 1'],
            max: [99999, 'La cantidad no puede superar 99999'],
            validate: {
                validator: Number.isInteger,
                message: 'La cantidad debe ser un número entero',
            },
        },
        occurredOn: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],
            index: true,
        },
        supplier: {
            type: String,
            trim: true,
            maxlength: [120, 'El proveedor no puede superar los 120 caracteres'],
            required: [
                function() {
                    return this.type === 'in';
                },
                'El proveedor es obligatorio para los ingresos',
            ],
        },
        reason: {
            type: String,
            trim: true,
            maxlength: [180, 'El motivo no puede superar los 180 caracteres'],
            required: [
                function() {
                    return this.type === 'out';
                },
                'El motivo es obligatorio para los egresos',
            ],
        },
    },
    { timestamps: true}
);

export const Movement = mongoose.model('Movement', movementSchema);
